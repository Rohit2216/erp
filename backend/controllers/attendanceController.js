require('dotenv').config();
var moment = require('moment');
const { con, makeDb } = require('../db');
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger, companyValidation } = require('../helpers/validation');
const {
    getDifferenceBetweenTime, getDayNameOnDate, calculateAbsentPercentage, calculateInTimePercentage, calculatePagination } = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const requestIp = require('request-ip');
const { insertEmployeeActivityLog } = require('../helpers/activityLog');
const { log } = require('console');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const excel = require('exceljs');

const PDFDocument = require('pdfkit');
const PDFTable = require('pdfkit-table');
const puppeteer = require('puppeteer');
const puppeteerHTMLPDF = require('puppeteer-html-pdf');
var momentTz = require('moment-timezone');
const { convertBase64Image } = require('../helpers/commonHelper');

// const schema = Joi.object({
//     clockInLatitude: Joi.number().required(),
//     clockInLongitude: Joi.number().required(),
//     company_location_name: Joi.string().required(),
//     capturedImage: Joi.string().required(),
// }).unknown(true);

const schema = Joi.object({
    clockInLatitude: Joi.number().required(),
    clockInLongitude: Joi.number().required(),
    company_location_name: Joi.string().required(),
}).unknown(true);


const clockIn = async (req, res) => {
    try {
        const { clockInLatitude, clockInLongitude, company_location_name, user_uuid, device_info, capturedImage } = req.body;
        // const clockInLatitude = 28.4590123;
        // const clockInLongitude = 77.044339;


        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
        }

        if (capturedImage == null || capturedImage == undefined) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Please take selfie first" })
        }

        const userId = req.user.user_id;
        let capImage;
        if (capturedImage) {
            const base64File = capturedImage.replace(/^data:image\/\w+;base64,/, '');
            // Call the function to process the image
            capImage = await convertBase64Image(base64File, './public/checkin_image/', 'checkin_image/');
        }

        //        const currentDate = moment().format('YYYY-MM-DD'); // Get today's date
        const currentDate = momentTz().tz('Asia/Kolkata').format('YYYY-MM-DD'); // Get today's date in Asia/Kolkata timezone
        // Check if the user has precise_location enabled
        const checkPreciseLocationQuery = `
            SELECT precise_location, locationId
            FROM users
            WHERE id = ?;
        `;

        const userResult = await db.query(checkPreciseLocationQuery, [userId]);
        // If precise_location is true, validate latitude and longitude
        if (userResult.length > 0 && userResult[0].precise_location === 1) {
            if (!clockInLatitude || !clockInLongitude) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: 'Check-in location (latitude and longitude) are required for precise location.',
                });
            }

            // Get the user's location stored in the database to check radius
            const getLocationQuery = `
                SELECT latitude, longitude, radius
                FROM locations
                WHERE id = ?;
            `;
            const locationResult = await db.query(getLocationQuery, [userResult[0].locationId]);
            if (locationResult.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: false,
                    message: `location not exists in the database`,
                });
            }

            const storedLatitude = locationResult[0].latitude;
            const storedLongitude = locationResult[0].longitude;
            const radius = locationResult[0].radius;

            // Calculate distance between clock-in location and stored location using Haversine formula
            const distance = calculateDistance(
                clockInLatitude, clockInLongitude,
                storedLatitude, storedLongitude
            );

            // Check if the clock-in location is within the radius
            if (distance > radius) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: `check-in location is outside the allowed radius of ${radius} meters.`,
                });
            }
        }


        // Check if the user has already clocked in today
        const checkClockInQuery = `
            SELECT in_time
            FROM attendances
            WHERE user_id = ? AND DATE(in_time) = ?;
        `;
        const checkResult = await db.query(checkClockInQuery, [userId, currentDate]);

        if (checkResult.length > 0) {
            // If user has already clocked in today, return the clock-in time
            const clockInTime = checkResult[0].in_time;
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Already checked in today',
                clockInTime: moment(clockInTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            });
        }
        // If no clock-in entry for today, proceed with the clock-in
        //const in_time = moment().format('YYYY-MM-DD HH:mm:ss'); // Get the current time for clock-in
        const in_time = momentTz().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'); // Get the current time for clock-in
        const status = 'incomplete'; // You can update this status later as needed

        const insertQuery = `
            INSERT INTO attendances (in_time, user_id, status, clockInLongitude, clockInLatitude, attendance_mark_by, attendance_status, company_location_name, user_uuid, device_info, captured_image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const queryResult = await db.query(insertQuery, [in_time, userId, status, clockInLongitude, clockInLatitude, userId, 2, company_location_name, user_uuid, device_info, capImage]);

        let response = '';
        if (queryResult.affectedRows > 0) {
            response = 'Checked in successfully';
            res.status(StatusCodes.OK).json({ status: true, message: response, clockInTime: in_time });
        } else {
            response = 'Error in check-in!';
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }

    // Log user activity
    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: momentTz().tz('Asia/Kolkata').unix(),
            action: 'checkIn method of attendanceController',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: 'check in attempt',
        },
    ];
    await insertEmployeeActivityLog(logData);
};


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Returns distance in meters
}



const clockOut = async (req, res) => {
    try {
        const { clockOutLatitude, clockOutLongitude, capturedImage } = req.body;
        const userId = req.user.user_id;

        if (capturedImage == null || capturedImage == undefined) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Please take selfie first" })
        }

        //const currentDate = moment().format('YYYY-MM-DD'); // Today's date
        //const out_time = moment().format('YYYY-MM-DD HH:mm:ss'); // Current time for clock-out

        const currentDate = momentTz().tz('Asia/Kolkata').format('YYYY-MM-DD'); // Get today's date in Asia/Kolkata timezone
        const out_time = momentTz().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'); // Get the current time for clock-in
        let capImage;
        if (capturedImage) {
            const base64File = capturedImage.replace(/^data:image\/\w+;base64,/, '');
            // Call the function to process the image
            capImage = await convertBase64Image(base64File, './public/checkout_image/', 'checkout_image/');
        }

        // Check if the user has precise_location enabled
        const checkPreciseLocationQuery = `
            SELECT precise_location, locationId
            FROM users
            WHERE id = ?;
        `;
        const userResult = await db.query(checkPreciseLocationQuery, [userId]);

        if (userResult.length > 0 && userResult[0].precise_location === 1) {
            if (!clockOutLatitude || !clockOutLongitude) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: 'Check-out location (latitude and longitude) are required for precise location.',
                });
            }

            // Get the user's stored location to validate radius
            const getLocationQuery = `
                SELECT latitude, longitude, radius
                FROM locations
                WHERE id = ?;
            `;
            const locationResult = await db.query(getLocationQuery, [userResult[0].locationId]);
            if (locationResult.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: false,
                    message: `Location not found in the database.`,
                });
            }

            const storedLatitude = locationResult[0].latitude;
            const storedLongitude = locationResult[0].longitude;
            const radius = locationResult[0].radius;

            // Calculate distance between clock-out location and stored location using Haversine formula
            const distance = calculateDistance(
                clockOutLatitude, clockOutLongitude,
                storedLatitude, storedLongitude
            );

            // Check if the clock-out location is within the allowed radius
            if (distance > radius) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: `Check-out location is outside the allowed radius of ${radius} meters.`,
                });
            }
        }

        // Check if the user has an incomplete attendance record for today
        const getTodayMarkedAttendance = `
            SELECT id, in_time
            FROM attendances
            WHERE user_id = ? AND DATE(in_time) = ? AND status = 'incomplete';
        `;
        const attendanceResult = await db.query(getTodayMarkedAttendance, [userId, currentDate]);

        if (attendanceResult.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'You have not checked in.',
            });
        }

        const attendanceId = attendanceResult[0].id;
        const inTime = moment(attendanceResult[0].in_time); // in_time from attendance record

        // Calculate total working hours
        const outTime = moment(out_time); // current out time
        const totalHoursWorked = outTime.diff(inTime, 'hours', true); // Difference in hours (as float)

        // Determine attendance status based on total working hours
        let attendanceStatus = 1; // Default status: Less than 2 hours

        if (totalHoursWorked >= 8) {
            attendanceStatus = 2; // 8 hours or more: Full day attendance
        } else if (totalHoursWorked > 2 && totalHoursWorked <= 6) {
            attendanceStatus = 3; // Between 2 and 6 hours: Partial attendance
        }

        // Update the attendance record with clock-out details and status
        const updateQuery = `
            UPDATE attendances
            SET out_time = ?, clockOutLatitude = ?, clockOutLongitude = ?, status = 'complete', attendance_status = ?, checkout_captured_image = ?
            WHERE id = ? AND user_id = ?;
        `;
        const updateResult = await db.query(updateQuery, [out_time, clockOutLatitude, clockOutLongitude, attendanceStatus, capImage, attendanceId, userId]);

        if (updateResult.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Checked out successfully.',
                clockOutTime: out_time,
                attendanceStatus: attendanceStatus, // Send the attendance status in response
            });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: 'Error during clock-out!',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }

    // Log user activity
    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: momentTz().tz('Asia/Kolkata').unix(),
            action: 'Checkout method of attendanceController',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: 'check out attempt',
        },
    ];
    await insertEmployeeActivityLog(logData);
};



const startBreak = async (req, res) => {
    try {
        const { status, break_type } = req.body;
        const in_time = moment().format('YYYY-MM-DD H:m:s');
        const userId = req.user.user_id;
        var response = '';

        const insertQuery = `INSERT INTO attendances(status, break_type, user_id, in_time) VALUES(?, ?, ?, ?)`;
        const queryResult = await db.query(insertQuery, [status, break_type, userId, in_time]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            response = 'Break marked';
            res.status(StatusCodes.OK).json({
                status: true,
                message: response,
                breakStartAt: in_time,
            });
        } else {
            response = 'Error! Not marked break';
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'startBreak method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const endBreak = async (req, res) => {
    try {
        const { break_type } = req.body;
        const out_time = moment().format('YYYY-MM-DD H:m:s');
        const userId = req.user.user_id;
        const today = moment().format('YYYY-MM-DD');
        var response = '';

        const getTodayMarkedBreak = `SELECT * FROM attendances WHERE user_id = ? AND DATE_FORMAT(in_time, '%Y-%m-%d') = ? AND break_type = ?`;

        const queryResult = await db.query(getTodayMarkedBreak, [userId, today, break_type]);
        const dbId = queryResult[0].id;

        const updateQuery = `UPDATE attendances SET out_time = ? WHERE user_id = ? AND id = ?`;
        const updateQueryResult = await db.query(updateQuery, [out_time, userId, dbId]);

        if (updateQueryResult.affectedRows > process.env.VALUE_ZERO) {
            response = 'Break ended';
            res.status(StatusCodes.OK).json({ status: true, message: response });
        } else {
            response = 'Error! Break not ended';
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'endBreak method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const checkClockInToday = async (req, res) => {
    try {
        const month = req.query.date || moment().format('YYYY-MM');
        const userId = req.user.user_id;
        const userType = req.user.user_type;

        if (userType == process.env.SUPER_ADMIN_ROLE_ID) {
            var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, admins.name, admins.image, breaks.break_name as break_name FROM attendances LEFT JOIN admins ON admins.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? ORDER BY attendances.id DESC`;
        } else {
            var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name,users.image, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? ORDER BY attendances.id DESC`;
        }
        const queryResults = await db.query(selectQuery, [userId, month]);

        if (queryResults.length > process.env.VALUE_ZERO) {
            var values = [];
            var result = [];

            for (const row of queryResults) {
                if (row.status === 'incomplete') {
                    values.push({
                        clockIn: row.in_time
                            ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss A')
                            : '--',
                        clockOut: row.out_time
                            ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss A')
                            : '--',
                        date: row.created_at ? moment(row.created_at).format('YYYY-MM-DD') : '--',
                        user_name: row.name,
                        user_image: row.image,
                    });
                }

                if (row.status === 'Company break') {
                    values.push({
                        break_name: row.status,
                        break_start: row.in_time
                            ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss A')
                            : '--',
                        break_end: row.out_time
                            ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss A')
                            : '--',
                        date: moment(row.created_at).format('YYYY-MM-DD'),
                    });
                }
            }
            const groupedData = values.reduce((acc, curr) => {
                const date = curr.date;
                if (!acc[date]) {
                    acc[date] = { dateArray: [] };
                }
                acc[date].dateArray.push(curr);
                return acc;
            }, {});

            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: groupedData,
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'data not found' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const timeSheet = async (req, res) => {
    try {
        var id = '';

        const date = req.query.date || moment().format('YYYY-MM');
        const today = moment(date).format('YYYY-MM');
        const userId = req.user.user_id;
        var response = '';

        if (req.user.user_type == process.env.SUPER_ADMIN_ROLE_ID || req.user.user_type == process.env.CONTRACTOR_ROLE_ID) {
            id = req.params.id;
            var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id = ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? AND attendances.status = ? GROUP BY DATE(attendances.in_time) ORDER BY attendances.in_time DESC`;
        } else {
            id = req.user.user_id;
            var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? AND attendances.status = ? GROUP BY DATE(attendances.in_time) ORDER BY attendances.in_time DESC`;
        }

        const queryResults = await db.query(selectQuery, [id, today, 'incomplete']);

        console.log("queryResults", queryResults)

        if (queryResults.length > process.env.VALUE_ZERO) {
            var values = [];
            var outTime = '--';
            var totalWorkDuration = '--';

            for (const row of queryResults) {
                if (row.out_time == null) {
                    outTime, totalWorkDuration;
                } else {
                    totalWorkDuration = await getDifferenceBetweenTime(row.in_time, row.out_time);
                    outTime = moment(row.out_time).format('H:m:s A');
                }

                values.push({
                    id: row.id,
                    name: row.name,
                    image: row.image,
                    date: moment(row.in_time).format('YYYY-MM-DD'),
                    day: await getDayNameOnDate(row.in_time),
                    clockIn: moment(row.in_time).format('H:m:s A'),
                    clockOut: outTime,
                    totalWorkHour: totalWorkDuration,
                });
            }
            response = 'Fetched successfully';
            res.status(StatusCodes.OK).json({ status: true, message: response, data: values });
        } else {
            response = 'Records not found';
            res.status(StatusCodes.OK).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'timeSheet method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const getTimeSheetOfAllUserForSuperAdmin = async (req, res) => {
    try {
        var id = '';

        const date = req.query.date || moment().format('DD-MM-YYYY');
        const today = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        var response = '';

        var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.status = ? ORDER BY attendances.id DESC`;

        const queryResults = await db.query(selectQuery, [today, 'incomplete']);


        if (queryResults.length > process.env.VALUE_ZERO) {
            var values = [];
            var outTime = '--';
            var totalWorkDuration = '--';

            for (const row of queryResults) {
                if (row.out_time == null) {
                    outTime, totalWorkDuration;
                } else {
                    totalWorkDuration = await getDifferenceBetweenTime(row.in_time, row.out_time);
                    outTime = moment(row.out_time).format('H:m:s A');
                }

                values.push({
                    id: row.id,
                    name: row.name,
                    date: moment(row.created_at).format('YYYY-MM-DD'),
                    day: await getDayNameOnDate(row.in_time),
                    clockIn: moment(row.in_time).format('H:m:s A'),
                    clockOut: outTime,
                    totalWorkHour: totalWorkDuration,
                });
            }
            response = 'Fetched successfully';
            res.status(StatusCodes.OK).json({ status: true, message: response, data: values });
        } else {
            response = 'Records not found';
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'timeSheet method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const getAttendanceChartById = async (req, res) => {
    try {
        const id = req.params.id;
        const date = req.query.date || moment().format('YYYY-MM');
        var TotalWorkingDays = 0;
        var totalAbsent = 0;
        var totalAbsentPercentage = 0;
        var totalSickLeave = 0;
        var totalOnTimeAttendance = 0;
        var totalOnTimeAttendancePercentage = 0;
        var totalLateTimeAttendance = 0;
        var totalLateTimeAttendancePercentage = 0;
        var onTimeCLockIn = '';
        let totalWorkHoursInMonth = 0;
        let workHourInTIme = [];

        var now = new Date(date) || new Date();

        const totalDayInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        const { error } = checkPositiveInteger.validate({ id });
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .res.status({ status: false, message: error.message });

        const selectTotalWorkingDaysQuery = `SELECT * FROM attendances WHERE user_id = ? AND break_type IS NULL AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? AND out_time IS NOT NULL`;

        const selectTotalWorkingDaysQueryResult = await db.query(selectTotalWorkingDaysQuery, [
            id,
            date,
        ]);

        if (selectTotalWorkingDaysQueryResult.length > process.env.VALUE_ZERO) {
            for (const row of selectTotalWorkingDaysQueryResult) {
                //total working days count
                if (row.status === 'incomplete') {
                    TotalWorkingDays++;

                    //int ime percentage calculate
                    onTimeCLockIn = moment(row.in_time).format('HH:mm:ss');

                    const timeString = '10:09:59 AM';
                    const timeObj = moment(timeString, 'hh:mm:ss A');
                    const lastTimeForIn = timeObj.format('HH:mm:ss');

                    if (onTimeCLockIn < lastTimeForIn) {
                        totalOnTimeAttendance++;
                    }

                    if (onTimeCLockIn < lastTimeForIn) {
                        totalLateTimeAttendance++;
                    }
                    const workHour = await getDifferenceBetweenTime(row.in_time, row.out_time);
                    workHourInTIme.push(workHour);
                    // Define an array of work hour durations
                }

                //absent count
                if (row.leave_type === 19) {
                    totalAbsent++;
                }
                //sick leave count
                if (row.leave_type === 6) {
                    totalSickLeave++;
                }

                //absent percentage calculate
            }
            if (workHourInTIme.length > process.env.VALUE_ZERO) {
                for (let index = 0; index < workHourInTIme.length; index += 2) {
                    const workHours = [
                        moment.duration(workHourInTIme[index]),
                        moment.duration(workHourInTIme[index + 1]),
                    ];

                    // Add all work hours in the array
                    const totalWorkHours = workHours.reduce(
                        (acc, curr) => acc.add(curr),
                        moment.duration(0)
                    );
                    totalWorkHoursInMonth =
                        totalWorkHours.hours() +
                        ':' +
                        totalWorkHours.minutes() +
                        ':' +
                        totalWorkHours.seconds();
                }
            }

            totalAbsentPercentage = await calculateAbsentPercentage(TotalWorkingDays, totalAbsent);
            totalOnTimeAttendancePercentage = await calculateInTimePercentage(
                TotalWorkingDays,
                totalOnTimeAttendance
            );
            totalLateTimeAttendancePercentage = await calculateInTimePercentage(
                TotalWorkingDays,
                totalLateTimeAttendance
            );

            TotalWorkingDays = TotalWorkingDays + '/' + totalDayInMonth;
        }

        const data = {
            TotalWorkingDays,
            totalAbsent,
            totalSickLeave,
            totalAbsentPercentage,
            totalOnTimeAttendancePercentage,
            totalLateTimeAttendancePercentage,
            totalWorkHoursInMonth,
        };

        res.status(StatusCodes.OK).json({
            status: true,
            message: 'Fetched successfully',
            data: data,
        });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const checkTodayMarkBreakAndAttendance = async (req, res) => {
    try {
        const id = req.user.user_id;
        const today = moment().format('YYYY-MM-DD');
        var loggedIn = false;
        var loggedInTime = '';
        var breakMark = false;
        var breakStartTime = '';

        const { error } = checkPositiveInteger.validate({ id });
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: error.message });

        const selectQueryForLoggedIn = `SELECT * FROM attendances WHERE user_id = ? AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND status = ? AND out_time IS NULL`;

        const queryResultForLoggedIn = await db.query(selectQueryForLoggedIn, [
            id,
            today,
            'incomplete',
        ]);

        if (queryResultForLoggedIn.length > process.env.VALUE_ZERO) {
            loggedIn = true;
            loggedInTime = moment(queryResultForLoggedIn[0].in_time).format('HH:mm:ss A');
        }

        const selectQueryForBreakMark = `SELECT * FROM attendances WHERE user_id = ? AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND status = ? AND break_type IS NOT NULL AND out_time IS NULL`;
        const queryResultForBreakMark = await db.query(selectQueryForBreakMark, [
            id,
            today,
            'Company break',
        ]);

        if (queryResultForBreakMark.length > process.env.VALUE_ZERO) {
            breakMark = true;
            breakStartTime = moment(queryResultForBreakMark[0].in_time).format('HH:mm:ss A');
        }

        const data = [
            {
                loggedIn: loggedIn,
                loggedInTime: loggedInTime,
                breakMark: breakMark,
                breakStartTime: breakStartTime,
            },
        ];

        res.status(StatusCodes.OK).json({ status: true, message: null, data: data });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const getMonthsTotalWorkHour = async (req, res) => {
    try {
        const id = req.user.user_id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: error.message });

        const selectQuery = `SELECT user_id, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(out_time, in_time)))) AS total_work_hours FROM attendances WHERE user_id = ? AND status = ? AND MONTH(in_time) = MONTH(CURRENT_DATE()) GROUP BY user_id;`;

        const queryResults = await db.query(selectQuery, [id, 'incomplete']);

        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: queryResults,
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Data not found' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

// const checkTotalUsersTimeSheet = async (req, res) => {
//     try {
//         //const month = req.query.date ||  moment().format('YYYY-MM');
//         const currentDate = moment();
//         const startDate = req.query.start_date || moment(currentDate).format('DD-MM-YYYY');

//         const endDate = req.query.end_date || moment(currentDate).format('DD-MM-YYYY');
//         const formattedStartDate = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
//         const formattedEndDate = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
//         var userId = req.query.user_id;

//         //dynamic pagination start

//         const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         var totalPages = process.env.VALUE_ZERO;

//         var countSelectQuery = `SELECT COUNT(*) as total FROM attendances WHERE DATE_FORMAT(created_at, '%Y-%m-%d') >= ? AND DATE_FORMAT(created_at, '%Y-%m-%d') <= ? `;

//         constTotalLength = await db.query(countSelectQuery, [formattedStartDate, formattedEndDate]);
//         totalPages = Math.round(constTotalLength[0].total / pageSize);
//         const total = constTotalLength[0].total;
//         const pageFirstResult = (currentPage - 1) * pageSize;

//         var queryParams = [pageFirstResult, pageSize];

//         if (formattedStartDate != null && formattedEndDate != null) {
//             // var selectQuery = `SELECT MAX(attendances.id) as id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image, users.employee_id, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE DATE_FORMAT(attendances.in_time, '%Y-%m-%d') >= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') <= ? GROUP BY attendances.user_id, DATE_FORMAT(attendances.in_time, '%Y-%m-%d') ORDER BY attendances.in_time DESC LIMIT ?, ?`;

//             var selectQuery = `SELECT 
//     MAX(attendances.id) as id,
//     MAX(attendances.status) as status,
//     MAX(attendances.break_type) as break_type,
//     attendances.user_id,
//     MAX(attendances.in_time) as in_time,
//     MAX(attendances.out_time) as out_time,
//     MAX(attendances.created_at) as created_at,
//     users.name,
//     users.image,
//     users.employee_id,
//     MAX(breaks.break_name) as break_name 
// FROM attendances 
// LEFT JOIN users ON users.id = attendances.user_id 
// LEFT JOIN breaks ON breaks.id = attendances.break_type 
// WHERE DATE_FORMAT(attendances.in_time, '%Y-%m-%d') >= ? 
//   AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') <= ? 
// GROUP BY attendances.user_id, DATE_FORMAT(attendances.in_time, '%Y-%m-%d') 
// ORDER BY in_time DESC 
// LIMIT ?, ?
// `

//             queryParams.unshift(formattedStartDate, formattedEndDate);
//             // res.send({data: selectQuery, queryParams:queryParams})

//             console.log('queryParams', queryParams)

//             const queryResults = await db.query(selectQuery, queryParams);
//             console.log(queryResults)
//             if (queryResults.length > process.env.VALUE_ZERO) {
//                 var values = [];
//                 var outTime = '--';
//                 var totalWorkDuration = '--';

//                 for (const row of queryResults) {
//                     if (row.status === 'incomplete') {
//                         if (row.out_time == null) {
//                             outTime, totalWorkDuration;
//                         } else {
//                             totalWorkDuration = await getDifferenceBetweenTime(
//                                 row.in_time,
//                                 row.out_time
//                             );
//                             outTime = moment(row.out_time).format('HH:mm:ss A');
//                         }

//                         values.push({
//                             clockIn: row.in_time ? moment(row.in_time).format('HH:mm:ss A') : '--',
//                             clockOut: row.out_time
//                                 ? moment(row.out_time).format('HH:mm:ss A')
//                                 : '--',
//                             date: row.in_time ? moment(row.in_time).format('YYYY-MM-DD') : '--',
//                             user_name: row.name,
//                             user_image: row.image,
//                             user_id: row.user_id,
//                             employee_id: row.employee_id,
//                             totalWorkDuration: totalWorkDuration,
//                         });
//                     }

//                     if (row.status === 'Company break') {

//                         for (const value of values) {
//                             value.break_name = row.status;
//                             value.break_start = row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss A') : '--';
//                             value.break_end = row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss A') : '--';
//                         }
//                     }
//                     else {
//                         for (const value of values) {
//                             value.break_name = '--';
//                             value.break_start = '--';
//                             value.break_end = '--';
//                         }
//                     }
//                 }



//                 res.status(StatusCodes.OK).json({
//                     status: true,
//                     message: 'Fetched successfully',
//                     total: values.length,
//                     data: values,
//                 });
//             } else {
//                 res.status(StatusCodes.OK).json({
//                     status: false,
//                     message: 'data not found',
//                 });
//             }
//         } else {
//             return res
//                 .status(StatusCodes.FORBIDDEN)
//                 .json({ status: false, message: 'Please select date range' });
//         }
//     } catch (error) {
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({ status: false, message: error.message });
//     }
// };

const checkTotalUsersTimeSheet = async (req, res) => {
    try {
        const currentDate = moment();
        const startDate = req.query.start_date || moment(currentDate).format('DD-MM-YYYY');
        const endDate = req.query.end_date || moment(currentDate).format('DD-MM-YYYY');
        const formattedStartDate = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const formattedEndDate = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');

        const userId = req.user.user_id;
        const userType = req.user.user_type;  // Logged-in user's type

        // Dynamic pagination start
        const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
        const currentPage = parseInt(req.query.pageNo) || 1;
        const pageFirstResult = (currentPage - 1) * pageSize;

        // Base query for counting total records within the date range
        let countSelectQuery = `
            SELECT COUNT(*) as total 
            FROM attendances 
            WHERE DATE_FORMAT(created_at, '%Y-%m-%d') BETWEEN ? AND ?`;

        // Base query for fetching attendance records
        let selectQuery = `
            SELECT 
                MAX(attendances.id) as id,
                MAX(attendances.status) as status,
                MAX(attendances.break_type) as break_type,
                attendances.user_id,
                MAX(attendances.in_time) as in_time,
                MAX(attendances.out_time) as out_time,
                MAX(attendances.created_at) as created_at,
                users.name,
                users.image,
                users.employee_id,
                MAX(breaks.break_name) as break_name 
            FROM attendances 
            LEFT JOIN users ON users.id = attendances.user_id 
            LEFT JOIN breaks ON breaks.id = attendances.break_type 
            WHERE DATE_FORMAT(attendances.in_time, '%Y-%m-%d') BETWEEN ? AND ?`;

        // Modify queries based on user type
        const queryParams = [formattedStartDate, formattedEndDate];

        if (userType !== 3) {
            // If the user is not type 3, filter by the specific user's ID
            countSelectQuery += ` AND attendances.user_id = ?`;
            selectQuery += ` AND attendances.user_id = ?`;
            queryParams.push(userId);
        }

        // Finalize the query with GROUP BY and pagination for records query
        selectQuery += `
            GROUP BY attendances.user_id, DATE_FORMAT(attendances.in_time, '%Y-%m-%d') 
            ORDER BY in_time DESC 
            LIMIT ?, ?`;

        queryParams.push(pageFirstResult, pageSize);

        // Execute the count query for pagination
        const totalRecordsResult = await db.query(countSelectQuery, queryParams.slice(0, -2));
        const totalRecords = totalRecordsResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Execute the main query for attendance records
        const queryResults = await db.query(selectQuery, queryParams);

        if (queryResults.length > 0) {
            let values = [];
            for (const row of queryResults) {
                let totalWorkDuration = '--';
                let outTime = row.out_time ? moment(row.out_time).format('HH:mm:ss A') : '--';

                // Calculate work duration if both in_time and out_time are available
                if (row.in_time && row.out_time) {
                    totalWorkDuration = await getDifferenceBetweenTime(row.in_time, row.out_time);
                }

                values.push({
                    clockIn: row.in_time ? moment(row.in_time).format('HH:mm:ss A') : '--',
                    clockOut: outTime,
                    date: row.in_time ? moment(row.in_time).format('YYYY-MM-DD') : '--',
                    user_name: row.name,
                    user_image: row.image,
                    user_id: row.user_id,
                    employee_id: row.employee_id,
                    totalWorkDuration: totalWorkDuration,
                    break_name: row.status === 'Company break' ? row.break_name : '--',
                    break_start: row.status === 'Company break' && row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss A') : '--',
                    break_end: row.status === 'Company break' && row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss A') : '--',
                });
            }

            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                total: totalRecords,
                totalPages: totalPages,
                data: values,
            });
        } else {
            res.status(StatusCodes.OK).json({
                status: false,
                message: 'Data not found',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
};



const checkTotalUsersTimeSheetNew = async (req, res) => {
    try {

        const currentDate = moment();
        const startDate = req.query.start_date || moment(currentDate).format('DD-MM-YYYY');

        const endDate = req.query.end_date || moment(currentDate).format('DD-MM-YYYY');
        const formattedStartDate = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const formattedEndDate = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        var userId = req.query.user_id;

        //dynamic pagination start
        const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = '';

        if (searchData != null && searchData != '') {
            search_value += `AND (users.name LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
        }

        var queryParams = [pageFirstResult, pageSize];

        if (formattedStartDate != null && formattedEndDate != null) {
            var selectQuery = `SELECT MAX(attendances.id) as id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image, users.employee_id, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE DATE_FORMAT(attendances.in_time, '%Y-%m-%d') >= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') <= ? ${search_value} GROUP BY attendances.user_id, DATE_FORMAT(attendances.in_time, '%Y-%m-%d') ORDER BY attendances.in_time DESC LIMIT ?, ?`;

            queryParams.unshift(formattedStartDate, formattedEndDate);
            const queryResults = await db.query(selectQuery, queryParams);

            // remove group by order by for pagination
            const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf('ORDER BY'));
            const totalResult = await db.query(modifiedQueryString, [formattedStartDate, formattedEndDate]);

            if (queryResults.length > process.env.VALUE_ZERO) {
                var values = [];
                var outTime = '--';
                var totalWorkDuration = '--';
                var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

                for (const row of queryResults) {
                    if (row.status === 'incomplete') {
                        if (row.out_time == null) {
                            outTime, totalWorkDuration;
                        } else {
                            totalWorkDuration = await getDifferenceBetweenTime(
                                row.in_time,
                                row.out_time
                            );
                            outTime = moment(row.out_time).format('HH:mm:ss A');
                        }

                        values.push({
                            id: row.id,
                            clockIn: row.in_time ? moment(row.in_time).format('HH:mm:ss A') : '--',
                            clockOut: row.out_time
                                ? moment(row.out_time).format('HH:mm:ss A')
                                : '--',
                            date: row.in_time ? moment(row.in_time).format('YYYY-MM-DD') : '--',
                            user_name: row.name,
                            user_image: row.image,
                            user_id: row.user_id,
                            employee_id: row.employee_id,
                            totalWorkDuration: totalWorkDuration,
                        });
                    }

                    if (row.status === 'Company break') {

                        for (const value of values) {
                            value.break_name = row.status;
                            value.break_start = row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss A') : '--';
                            value.break_end = row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss A') : '--';
                        }
                    }
                    else {
                        for (const value of values) {
                            value.break_name = '--';
                            value.break_start = '--';
                            value.break_end = '--';
                        }
                    }
                }

                res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'Fetched successfully',
                    data: values,
                    pageDetails: pageDetails,
                });
            } else {
                res.status(StatusCodes.OK).json({
                    status: false,
                    message: 'data not found',
                });
            }
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: 'Please select date range' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const getAllUsersTodayClockIn = async (req, res) => {
    try {
        const currentDate = moment();
        const todayDate = moment(currentDate).format('YYYY-MM-DD');
        const superAdminId = process.env.SUPER_ADMIN_ROLE_ID;
        const userType = req.user.user_type; // Get user type from logged-in user
        const userId = req.user.user_id; // Get user ID of logged-in user

        // Dynamic pagination settings
        const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        let totalPages = 0;

        // Base query for counting total records for pagination
        let countSelectQuery = `
            SELECT COUNT(*) as total 
            FROM attendances 
            LEFT JOIN users ON users.id = attendances.user_id 
            WHERE attendances.status = ? 
            AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? 
            AND attendances.out_time IS NULL`;

        let countQueryParams = ['incomplete', todayDate];

        // Filter by user type
        if (userType !== 3) {
            countSelectQuery += ` AND attendances.user_id = ?`;
            countQueryParams.push(userId);
        } else {
            countSelectQuery += ` AND attendances.user_id != ?`;
            countQueryParams.push(superAdminId);
        }

        // Execute the count query for pagination
        const totalRecordsResult = await db.query(countSelectQuery, countQueryParams);
        const totalRecords = totalRecordsResult[0].total;
        totalPages = Math.ceil(totalRecords / pageSize);
        const pageFirstResult = (currentPage - 1) * pageSize;

        // Search data condition
        let searchDataCondition = '';
        let queryParams = ['incomplete', todayDate];

        if (searchData) {
            searchDataCondition = 'AND users.name LIKE ? ';
            queryParams.push(`%${searchData}%`);
        }

        // Main query for fetching attendance records with pagination
        let selectQuery = `
            SELECT 
                attendances.id,
                attendances.status,
                attendances.break_type,
                attendances.user_id,
                attendances.in_time,
                attendances.out_time,
                attendances.created_at,
                users.name,
                users.image 
            FROM attendances 
            LEFT JOIN users ON users.id = attendances.user_id 
            WHERE attendances.status = ? 
            AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? 
            AND attendances.out_time IS NULL 
            ${searchDataCondition}`;

        // Add user filtering based on user type
        if (userType !== 3) {
            selectQuery += ` AND attendances.user_id = ?`;
            queryParams.push(userId);
        } else {
            selectQuery += ` AND attendances.user_id != ?`;
            queryParams.push(superAdminId);
        }

        // Add ordering and pagination to the query
        selectQuery += ` ORDER BY attendances.id DESC LIMIT ?, ?`;
        queryParams.push(pageFirstResult, pageSize);

        // Execute the main query
        const queryResults = await db.query(selectQuery, queryParams);

        if (queryResults.length > 0) {
            let values = [];

            // Format the result data
            for (const row of queryResults) {
                values.push({
                    id: row.id,
                    user_name: row.name,
                    user_image: row.image,
                    date: moment(row.in_time).format('YYYY-MM-DD'),
                    status: 'Clock in at ' + moment(row.in_time).format('HH:mm:ss A'),
                });
            }

            // Pagination details
            const pageDetails = {
                pageSize,
                currentPage,
                totalPages,
                total: totalRecords,
            };

            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: values,
                pageDetails: pageDetails,
            });
        } else {
            res.status(StatusCodes.OK).json({
                status: false,
                message: 'Data not found',
            });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
};


// const getAllUsersTodayClockIn = async (req, res) => {
//     try {
//         const currentDate = moment();
//         const todayDate = moment(currentDate).format('YYYY-MM-DD');
//         const superAdminId = process.env.SUPER_ADMIN_ROLE_ID;

//         //dynamic pagination starts here

//         const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         var totalPages = process.env.VALUE_ZERO;

//         const countSelectQuery = `SELECT COUNT(*) as total FROM attendances WHERE user_id != ? AND attendances.status = ?  AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.out_time IS NULL`;

//         constTotalLength = await db.query(countSelectQuery, [
//             superAdminId,
//             'incomplete',
//             todayDate,
//         ]);
//         totalPages = Math.round(constTotalLength[0].total / pageSize);
//         const total = constTotalLength[0].total;
//         const pageFirstResult = (currentPage - 1) * pageSize;

//         var searchDataCondition = '';
//         var queryParams = [pageFirstResult, pageSize];

//         if (searchData != null && searchData != '') {
//             searchDataCondition = 'AND users.name LIKE ? ';
//             queryParams.unshift(`%${searchData}%`);
//         }

//         //pagination ends here
//         var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image FROM attendances LEFT JOIN users ON users.id=attendances.user_id WHERE attendances.user_id != ? AND attendances.status = ?  AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.out_time IS NULL ${searchDataCondition}  ORDER BY attendances.id DESC LIMIT ?, ?`;

//         queryParams.unshift(superAdminId, 'incomplete', todayDate);

//         const queryResults = await db.query(selectQuery, queryParams);

//         if (queryResults.length > process.env.VALUE_ZERO) {
//             var values = [];

//             for (const row of queryResults) {
//                 values.push({
//                     id: row.id,
//                     user_name: row.name,
//                     user_image: row.image,
//                     date: moment(row.in_time).format('YYYY-MM-DD'),
//                     status: 'Clock in at ' + moment(row.in_time).format('HH:mm:ss A'),
//                 });
//             }
//             var pageDetails = [];
//             pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total });
//             res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: 'Fetched successfully',
//                 data: values,
//                 pageDetails: pageDetails,
//             });
//         } else {
//             res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
//     }
// };

// const getAllUsersTodayClockOut = async (req, res) => {
//     try {
//         const currentDate = moment();
//         const todayDate = moment(currentDate).format('YYYY-MM-DD');
//         const superAdminId = process.env.SUPER_ADMIN_ROLE_ID;

//         //dynamic pagination starts here

//         const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         var totalPages = process.env.VALUE_ZERO;

//         const countSelectQuery = `SELECT COUNT(*) as total FROM attendances WHERE user_id != ? AND attendances.status = ?  AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.out_time IS NULL`;

//         constTotalLength = await db.query(countSelectQuery, [
//             superAdminId,
//             'incomplete',
//             todayDate,
//         ]);
//         totalPages = Math.round(constTotalLength[0].total / pageSize);
//         const total = constTotalLength[0].total;
//         const pageFirstResult = (currentPage - 1) * pageSize;

//         var searchDataCondition = '';
//         var queryParams = [pageFirstResult, pageSize];

//         if (searchData != null && searchData != '') {
//             searchDataCondition = 'AND users.name LIKE ? ';
//             queryParams.unshift(`%${searchData}%`);
//         }

//         //pagination ends here

//         var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image FROM attendances LEFT JOIN users ON users.id=attendances.user_id WHERE attendances.status = ?  AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.out_time IS NOT NULL ${searchDataCondition}  ORDER BY attendances.id DESC LIMIT ?, ?`;

//         queryParams.unshift('incomplete', todayDate);

//         const queryResults = await db.query(selectQuery, queryParams);

//         if (queryResults.length > process.env.VALUE_ZERO) {
//             var values = [];

//             for (const row of queryResults) {
//                 values.push({
//                     id: row.id,
//                     user_name: row.name,
//                     user_image: row.image,
//                     date: moment(row.in_time).format('YYYY-MM-DD'),
//                     status: 'Clock out at ' + moment(row.out_time).format('HH:mm:ss A'),
//                 });
//             }
//             var pageDetails = [];
//             pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total });
//             res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: 'Fetched successfully',
//                 data: values,
//                 pageDetails: pageDetails,
//             });
//         } else {
//             res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
//     }
// };

const getAllUsersTodayClockOut = async (req, res) => {
    try {
        const currentDate = moment();
        const todayDate = moment(currentDate).format('YYYY-MM-DD');
        const superAdminId = process.env.SUPER_ADMIN_ROLE_ID;
        const userType = req.user.user_type; // Get user type
        const userId = req.user.user_id; // Get user ID

        // Dynamic pagination starts here
        const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        let totalPages = 0;

        // Base query for counting total records for pagination
        let countSelectQuery = `
            SELECT COUNT(*) as total 
            FROM attendances 
            LEFT JOIN users ON users.id = attendances.user_id 
            WHERE attendances.status = ? 
            AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? 
            AND attendances.out_time IS NULL`;

        let countQueryParams = ['incomplete', todayDate];

        // Add user filtering based on user type
        if (userType !== 3) {
            countSelectQuery += ` AND attendances.user_id = ?`;
            countQueryParams.push(userId);
        } else {
            countSelectQuery += ` AND attendances.user_id != ?`;
            countQueryParams.push(superAdminId);
        }

        // Execute the count query for pagination
        const totalRecordsResult = await db.query(countSelectQuery, countQueryParams);
        const totalRecords = totalRecordsResult[0].total;
        totalPages = Math.ceil(totalRecords / pageSize);
        const pageFirstResult = (currentPage - 1) * pageSize;

        // Pagination ends here

        // Search condition
        let searchDataCondition = '';
        let queryParams = ['incomplete', todayDate];

        if (searchData) {
            searchDataCondition = 'AND users.name LIKE ? ';
            queryParams.push(`%${searchData}%`);
        }

        // Main query for fetching attendance records with pagination
        let selectQuery = `
            SELECT 
                attendances.id,
                attendances.status,
                attendances.break_type,
                attendances.user_id,
                attendances.in_time,
                attendances.out_time,
                attendances.created_at,
                users.name,
                users.image 
            FROM attendances 
            LEFT JOIN users ON users.id = attendances.user_id 
            WHERE attendances.status = ? 
            AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? 
            AND attendances.out_time IS NOT NULL 
            ${searchDataCondition}`;

        // Add user filtering to the main query
        if (userType !== 3) {
            selectQuery += ` AND attendances.user_id = ?`;
            queryParams.push(userId);
        } else {
            selectQuery += ` AND attendances.user_id != ?`;
            queryParams.push(superAdminId);
        }

        // Add ordering and pagination to the query
        selectQuery += ` ORDER BY attendances.id DESC LIMIT ?, ?`;
        queryParams.push(pageFirstResult, pageSize);

        // Execute the main query
        const queryResults = await db.query(selectQuery, queryParams);

        if (queryResults.length > 0) {
            let values = [];

            // Format the result data
            for (const row of queryResults) {
                values.push({
                    id: row.id,
                    user_name: row.name,
                    user_image: row.image,
                    date: moment(row.in_time).format('YYYY-MM-DD'),
                    status: 'Clock out at ' + moment(row.out_time).format('HH:mm:ss A'),
                });
            }

            // Pagination details
            const pageDetails = {
                pageSize,
                currentPage,
                totalPages,
                total: totalRecords,
            };

            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: values,
                pageDetails: pageDetails,
            });
        } else {
            res.status(StatusCodes.OK).json({
                status: false,
                message: 'Data not found',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
};


const markUserClockInClockOutBySuperAdmin = async (req, res) => {
    try {
        const { id, type } = req.body;
        const currentDate = moment();
        const currentDateTime = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
        const updatedAt = currentDateTime;
        const validation = Joi.object({
            id: Joi.number().required(),
            type: Joi.string().required(),
        });

        const { error } = validation.validate(req.body);
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: error.message });

        // get today attendance of users
        const selectQuery = await db.query(`SELECT * FROM attendances WHERE id = ?`, id);
        const lastId = selectQuery[0].id;

        if (type === 'clock in') {
            var updateQuery = `UPDATE attendances SET status = 'incomplete', in_time = ?, out_time = ?, updated_at = ? WHERE id = ?`;
            var queryResult = await db.query(updateQuery, [
                currentDateTime,
                null,
                updatedAt,
                lastId,
            ]);
        } else {
            var updateQuery = `UPDATE attendances SET out_time = ?, updated_at = ? WHERE id = ?`;
            var queryResult = await db.query(updateQuery, [currentDateTime, updatedAt, lastId]);
        }

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({
                status: true,
                message: 'User marked ' + type + ' successfully',
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: 'Error! user not marked ' + type,
            });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const createManuallyClockInClockOut = async (req, res) => {
    try {
        const { user_ids, in_time, out_time, is_default_time, note, attendance_status } = req.body;
        // Validate input data here

        const validationSchema = Joi.object({
            user_ids: Joi.required(),
            in_time: Joi.required(),
            out_time: Joi.required(),
        }).options({ allowUnknown: true });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const in_time_input = is_default_time ? moment(new Date()).format('YYYY-MM-DD') + ' ' + '09:00:00' : in_time;
        const out_time_input = is_default_time ? moment(new Date()).format('YYYY-MM-DD') + ' ' + '18:00:00' : out_time;

        const insertQuery = `INSERT INTO attendances (status, user_id, in_time, out_time, attendance_type, attendance_mark_by, attendance_mark_status, note, attendance_status) VALUES ?`;

        const attendanceDataArray = user_ids.map(user_id => {
            const status = 'incomplete';
            const attendance_type = '2';
            const attendance_mark_by = req.user.user_id;
            const attendance_mark_status = '2';

            return [
                status,
                user_id,
                in_time_input,
                out_time_input,
                attendance_type,
                attendance_mark_by,
                attendance_mark_status,
                note,
                attendance_status,
            ];
        });

        const queryResult = await db.query(insertQuery, [attendanceDataArray]);

        if (queryResult.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Attendance marked successfully',
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'Error! Something went wrong, please try again later',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


// mark attendance in bulk;

const parseDateRange = (range, month, year) => {
    const [startDay, endDay] = range.split('-').map(Number);

    // Create start and end dates using moment
    const startDate = moment({ year, month: month - 1, day: startDay }).startOf('day');
    const endDate = moment({ year, month: month - 1, day: endDay }).endOf('day');

    let dates = [];

    // Loop through the dates from startDate to endDate
    for (let d = startDate; d.isSameOrBefore(endDate); d.add(1, 'day')) {
        // Push the date to the array
        dates.push(d.toDate());
    }

    return dates;
};


const markAttendanceInBulk = async (req, res) => {
    try {
        const { user_ids, attendance_status, date, month } = req.body;

        // Validate input data
        const validationSchema = Joi.object({
            user_ids: Joi.array().items(Joi.number()).required(),
            date: Joi.array().items(Joi.string().pattern(/^\d+-\d+$/)).required(),
            month: Joi.number().min(1).max(12).required(),
            attendance_status: Joi.string().required()
        }).options({ allowUnknown: true });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const currentYear = new Date().getFullYear();
        let allDates = [];
        date.forEach(range => {
            allDates = allDates.concat(parseDateRange(range, month, currentYear));
        });

        const attendanceDataArray = [];

        for (const user_id of user_ids) {
            for (const attendanceDate of allDates) {
                // Check if attendance data already exists
                const existingRecord = await db.query(
                    `SELECT 1 FROM attendances WHERE user_id = ? AND DATE(in_time) = ?`,
                    [user_id, attendanceDate]
                );

                if (existingRecord.length > 0) {
                    // Update existing record
                    const updateQuery = `
                        UPDATE attendances 
                        SET attendance_status = ? 
                        WHERE user_id = ? AND DATE(in_time) = ?`;
                    await db.query(updateQuery, [attendance_status, user_id, attendanceDate]);
                } else {
                    // Insert new record
                    const status = 'incomplete';
                    const attendance_type = '2';
                    const attendance_mark_by = req.user.user_id;
                    const attendance_mark_status = '2';

                    attendanceDataArray.push([
                        status,
                        user_id,
                        attendanceDate,
                        attendanceDate,
                        attendance_type,
                        attendance_mark_by,
                        attendance_mark_status,
                        '',
                        attendance_status,
                    ]);
                }
            }
        }

        if (attendanceDataArray.length > 0) {
            const insertQuery = `INSERT INTO attendances (status, user_id, in_time, out_time, attendance_type, attendance_mark_by, attendance_mark_status, note, attendance_status) VALUES ?`;
            const queryResult = await db.query(insertQuery, [attendanceDataArray]);

            if (queryResult.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'Attendance marked successfully',
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: 'Error! Something went wrong, please try again later',
                });
            }
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Attendance updated successfully',
            });
        }
    } catch (error) {
        console.error(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


const markAttendance = async (req, res) => {
    try {
        const { user_id, in_time, out_time, is_default_time, note, attendance_status } = req.body;

        const validationSchema = Joi.object({
            user_id: Joi.number().required(),
            in_time: Joi.required(),
            out_time: Joi.required(),
        }).options({ allowUnknown: true });

        const { error } = validationSchema.validate(req.body);



        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        var in_time_input;
        var out_time_input;
        var todayDate = '';
        if (is_default_time) {
            todayDate = moment(new Date()).format('YYYY-MM-DD');
            in_time_input = todayDate + ' ' + '09:00:00';
            out_time_input = todayDate + ' ' + '18:00:00';
        } else {
            todayDate = moment(in_time).format('YYYY-MM-DD');
            in_time_input = in_time;
            out_time_input = out_time;
        }
        var queryResult = '';


        const selectedData = await db.query(`SELECT * FROM attendances WHERE user_id="${user_id}"  AND date(in_time) = "${todayDate}" ORDER BY attendances.id  ASC LIMIT 1;`);
        const status = 'incomplete';
        const attendance_type = '2';
        const attendance_mark_by = req.user.user_id;
        const attendance_mark_status = '2';


        if (selectedData.length > 0) {

            const updateQuery = `UPDATE attendances SET status='${status}',user_id='${user_id}',in_time='${in_time_input}',out_time='${out_time_input}',attendance_type='${attendance_type}',attendance_mark_by='${attendance_mark_by}',attendance_mark_status='${attendance_mark_status}',attendance_status='${attendance_status}',note='${note}',attendance_status='${attendance_status}' WHERE id='${selectedData[0].id}'`;
            queryResult = await db.query(updateQuery);
        } else {
            const insertQuery = `INSERT INTO attendances (status, user_id, in_time, out_time, attendance_type, attendance_mark_by, attendance_mark_status, note, attendance_status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const insertValues = [
                status,
                user_id,
                in_time_input,
                out_time_input,
                attendance_type,
                attendance_mark_by,
                attendance_mark_status,
                note,
                attendance_status,
            ];

            queryResult = await db.query(insertQuery, insertValues);
        }
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Attendance marked successfully',
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'Error! something went wrong, please try again later',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error,
        });
    }
};

// const getAllUserTimeSheetInCalendarView = async (req, res) => {
//     try {

//         const monthYear = req.query.yearMonth || moment(new Date()).format('YYYY-MM');


//         //pagination start here
//         const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         const searchColumns = ['name', 'employee_id', 'department'];
//         const searchConditions = [];

//         if (searchData != null && searchData != '') {
//             searchColumns.forEach((column) => {
//                 searchConditions.push(`${column} LIKE '%${searchData}%'`);
//             });
//         }

//         // get all active users
//         const activeUsers = await db.query(`SELECT id, name, image, employee_id, department FROM users WHERE status = ?`, [process.env.ACTIVE_STATUS]);

//         if (activeUsers.length > process.env.VALUE_ZERO) {
//             // get users daily attendance report of monthly
//             for (const user of activeUsers) {
//                 const attendanceReport = await getUserDailyAttendanceOfMonth(user.id, monthYear);
//                 user.total_pay_days = attendanceReport.totalPayDays;
//                 user.attendanceReports = attendanceReport.dayAttendanceStatus;
//             }

//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Fetched successfully",
//                     data: activeUsers
//                 });
//         }



//     } catch (error) {
//         console.error(error.message);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

// const getAllUserTimeSheetInCalendarView = async (req, res) => {
//     try {
//         const { user_id, user_type } = req.user;
//         const monthYear = req.query.yearMonth || moment(new Date()).format('YYYY-MM');

//         const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         const searchColumns = ['name', 'employee_id', 'department'];

//         // Construct the base query and parameters
//         let baseQuery = `SELECT id, name, image, employee_id, department FROM users WHERE status = ?`;
//         let queryParams = [process.env.ACTIVE_STATUS];

//         // Add user-specific filter if needed
//         if (user_type !== 3) {
//             baseQuery += ` AND id = ?`;
//             queryParams.push(user_id);
//         }

//         // Add search conditions
//         if (searchData) {
//             const searchConditions = searchColumns.map(column => `${column} LIKE ?`).join(" OR ");
//             baseQuery += ` AND (${searchConditions})`;
//             searchColumns.forEach(() => queryParams.push(`%${searchData}%`));
//         }

//         // Pagination parameters
//         baseQuery += ` LIMIT ?, ?`;
//         queryParams.push(pageFirstResult, pageSize);

//         // Execute the query
//         const activeUsers = await db.query(baseQuery, queryParams);

//         if (activeUsers.length > 0) {
//             for (const user of activeUsers) {
//                 const attendanceReport = await getUserDailyAttendanceOfMonth(user.id, monthYear);
//                 user.total_pay_days = attendanceReport.totalPayDays;
//                 user.attendanceReports = attendanceReport.dayAttendanceStatus;
//             }

//             // Get total count for pagination
//             const countQuery = `SELECT COUNT(*) as count FROM users WHERE status = ?` + 
//                                (user_type !== 3 ? ` AND id = ?` : '') + 
//                                (searchData ? ` AND (${searchColumns.map(column => `${column} LIKE ?`).join(" OR ")})` : '');

//             const totalParams = [process.env.ACTIVE_STATUS];
//             if (user_type !== 3) totalParams.push(user_id);
//             if (searchData) searchColumns.forEach(() => totalParams.push(`%${searchData}%`));

//             const totalRecordsResult = await db.query(countQuery, totalParams);
//             const totalRecords = totalRecordsResult[0].count;
//             const pageDetails = {
//                 currentPage,
//                 pageSize,
//                 totalRecords,
//                 totalPages: Math.ceil(totalRecords / pageSize)
//             };

//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Fetched successfully",
//                 data: activeUsers,
//                 pageDetails
//             });
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         console.error(error.message);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

const getAllUserTimeSheetInCalendarView = async (req, res) => {
    try {
        const { user_id, user_type } = req.user;
        const monthYear = req.query.yearMonth || moment(new Date()).format('YYYY-MM');

        const searchData = req.query.search || '';
        const searchColumns = ['name', 'employee_id', 'department'];

        // Construct the base query and parameters
        let baseQuery = `SELECT id, name, image, employee_id, department FROM users WHERE status = ?`;
        let queryParams = [process.env.ACTIVE_STATUS];

        // Add user-specific filter if needed
        if (user_type != 3) {
            baseQuery += ` AND id = ?`;
            queryParams.push(user_id);
        }

        // Add search conditions
        if (searchData) {
            const searchConditions = searchColumns.map(column => `${column} LIKE ?`).join(" OR ");
            baseQuery += ` AND (${searchConditions})`;
            searchColumns.forEach(() => queryParams.push(`%${searchData}%`));
        }

        // Execute the query without pagination
        const activeUsers = await db.query(baseQuery, queryParams);

        if (activeUsers.length > 0) {
            for (const user of activeUsers) {
                const attendanceReport = await getUserDailyAttendanceOfMonth(user.id, monthYear);
                user.total_pay_days = attendanceReport.totalPayDays;
                user.attendanceReports = attendanceReport.dayAttendanceStatus;
            }

            // Get total count for page details if needed (without pagination)
            const countQuery = `SELECT COUNT(*) as count FROM users WHERE status = ?` +
                (user_type != 3 ? ` AND id = ?` : '') +
                (searchData ? ` AND (${searchColumns.map(column => `${column} LIKE ?`).join(" OR ")})` : '');

            const totalParams = [process.env.ACTIVE_STATUS];
            if (user_type != 3) totalParams.push(user_id);
            if (searchData) searchColumns.forEach(() => totalParams.push(`%${searchData}%`));

            const totalRecordsResult = await db.query(countQuery, totalParams);
            const totalRecords = totalRecordsResult[0].count;

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: activeUsers,
                pageDetails: {
                    totalRecords
                }
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


const getSingleUserAttendanceTimeSheetInCalendarView = async (req, res) => {

    try {

        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const monthYear = req.query.yearMonth || moment(new Date()).format('YYYY-MM');

        // get all active users
        const activeUsers = await db.query(`SELECT id, name, employee_id, department FROM users WHERE id = ?`, [id]);

        if (activeUsers.length > process.env.VALUE_ZERO) {
            // get users daily attendance report of monthly
            for (const user of activeUsers) {
                const attendanceReport = await getSingleUserDailyAttendanceOfMonth(user.id, monthYear);
                user.total_pay_days = attendanceReport.totalPayDays;
                user.attendanceReports = attendanceReport.dayAttendanceStatus;
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: activeUsers[0]
                });
        }



    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }

}

async function getUserDailyAttendanceOfMonth(user_id, monthYear) {
    const totalDaysInMonth = moment(monthYear, 'YYYY-MM').daysInMonth();

    // const query = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.attendance_status, attendances.created_at FROM attendances WHERE attendances.user_id = '${user_id}' AND attendances.status = 'incomplete' AND DATE_FORMAT(attendances.in_time, '%Y-%m') = '${monthYear}' GROUP BY DATE(attendances.in_time) ORDER BY DATE(attendances.in_time)`;

    const query = `SELECT 
    MAX(attendances.id) AS id,
    MAX(attendances.status) AS status,
    MAX(attendances.break_type) AS break_type,
    MAX(attendances.user_id) AS user_id,
    MAX(attendances.in_time) AS in_time,
    MAX(attendances.out_time) AS out_time,
    MAX(attendances.attendance_status) AS attendance_status,
    MAX(attendances.created_at) AS created_at
FROM 
    attendances
WHERE 
    attendances.user_id = '${user_id}' 
    AND attendances.status = 'incomplete' 
    AND DATE_FORMAT(attendances.in_time, '%Y-%m') = '${monthYear}'
GROUP BY 
    DATE(attendances.in_time)
ORDER BY 
    DATE(attendances.in_time);
    `
    const queryResult = await db.query(query);

    const dayAttendanceStatus = new Array(totalDaysInMonth).fill('AB');
    let totalPayDays = 0;
    const sundays = [];

    if (queryResult.length > process.env.VALUE_ZERO) {
        //get attendance with status
        for (const row of queryResult) {
            const day = moment(row.in_time).date(); // Get the day of the attendance

            if (row.attendance_status === '1') {
                dayAttendanceStatus[day - 1] = 'AB'; // Subtract 1 as array is 0-indexed
            } else if (row.attendance_status === '2') {
                dayAttendanceStatus[day - 1] = 'P';
                totalPayDays += 1; // Full pay day
            } else {
                dayAttendanceStatus[day - 1] = 'HF';
                totalPayDays += 0.5; // Half pay day
            }

        }

        return { dayAttendanceStatus, totalPayDays };
    }
    else {
        return { dayAttendanceStatus, totalPayDays };
    }
}

async function getSingleUserDailyAttendanceOfMonth(user_id, monthYear) {
    const totalDaysInMonth = moment(monthYear, 'YYYY-MM').daysInMonth();
    const query = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.attendance_status, attendances.created_at FROM attendances WHERE attendances.user_id = ? AND attendances.status = ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? GROUP BY DATE(attendances.in_time) ORDER BY DATE(attendances.in_time)`;

    const queryResult = await db.query(query, [user_id, 'incomplete', monthYear]);

    const dayAttendanceStatus = new Array(totalDaysInMonth).fill('AB');
    let totalPayDays = 0;

    if (queryResult.length > process.env.VALUE_ZERO) {
        for (const row of queryResult) {
            const day = moment(row.in_time).date(); // Get the day of the attendance

            if (row.attendance_status === '1') {
                dayAttendanceStatus[day - 1] = 'AB'; // Subtract 1 as array is 0-indexed
            } else if (row.attendance_status === '2') {
                dayAttendanceStatus[day - 1] = 'P';
                totalPayDays += 1; // Full pay day
            } else {
                dayAttendanceStatus[day - 1] = 'HF';
                totalPayDays += 0.5; // Half pay day
            }
        }
    }

    const attendanceDataWithNumbers = [];

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const fullDate = moment(`${monthYear}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const dayName = moment(fullDate).format('dd');
        attendanceDataWithNumbers.push({ title: dayAttendanceStatus[day - 1], date: fullDate });
    }

    return { dayAttendanceStatus: attendanceDataWithNumbers, totalPayDays };
}

// const getClockInStatus = async (req, res) => {
//     try {
//         const userId = req.user.user_id;
//         const currentDate = moment().format("YYYY-MM-DD");

//         const query = `
//             SELECT in_time, out_time
//             FROM attendances
//             WHERE user_id = ? AND DATE(in_time) = ?
//             ORDER BY in_time DESC
//             LIMIT 1;
//         `;
//         const result = await db.query(query, [userId, currentDate]);

//         if (result.length > 0) {
//             const { in_time, out_time } = result[0];

//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 clockInTime: in_time ? moment(in_time).format("YYYY-MM-DD HH:mm:ss") : null,
//                 clockOutTime: out_time ? moment(out_time).format("YYYY-MM-DD HH:mm:ss") : null,
//             });
//         }

//         return res.status(StatusCodes.OK).json({
//             status: true,
//             clockInTime: null,
//             clockOutTime: null,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };

// const getClockInStatus = async (req, res) => {
//     try {
//         const userId = req.user.user_id;
//         const currentDate = moment().format("YYYY-MM-DD");

//         const query = `
//             SELECT in_time, out_time
//             FROM attendances
//             WHERE user_id = ? AND DATE(in_time) = ?
//             ORDER BY in_time DESC
//             LIMIT 1;
//         `;
//         const result = await db.query(query, [userId, currentDate]);

//         if (result.length > 0) {
//             const { in_time, out_time } = result[0];

//             let totalHours = null;
//             if (in_time && out_time) {
//                 const start = moment(in_time);
//                 const end = moment(out_time);
//                 totalHours = end.diff(start, 'hours', true); // Calculate total hours
//             }

//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 clockInTime: in_time ? moment(in_time).format("YYYY-MM-DD HH:mm:ss") : null,
//                 clockOutTime: out_time ? moment(out_time).format("YYYY-MM-DD HH:mm:ss") : null,
//                 totalHours: totalHours !== null ? totalHours.toFixed(2) : null,
//             });
//         }

//         return res.status(StatusCodes.OK).json({
//             status: true,
//             clockInTime: null,
//             clockOutTime: null,
//             totalHours: null,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


// const getClockInStatus = async (req, res) => {
//     try {
//         const userId = req.user.user_id;
//         const currentDate = moment().format("YYYY-MM-DD");

//         const query = `
//             SELECT in_time, out_time, company_location_name
//             FROM attendances
//             WHERE user_id = ? AND DATE(in_time) = ?
//             ORDER BY in_time DESC
//             LIMIT 1;
//         `;
//         const result = await db.query(query, [userId, currentDate]);

//         if (result.length > 0) {
//             const { in_time, out_time } = result[0];

//             let totalHours = null;
//             if (in_time && out_time) {
//                 const start = moment(in_time);
//                 const end = moment(out_time);
//                 const duration = moment.duration(end.diff(start));

//                 // Convert duration to HH:mm:ss
//                 const hours = String(Math.floor(duration.asHours())).padStart(2, "0");
//                 const minutes = String(duration.minutes()).padStart(2, "0");
//                 const seconds = String(duration.seconds()).padStart(2, "0");
//                 totalHours = `${hours}:${minutes}:${seconds}`;
//             }

//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 clockInTime: in_time ? moment(in_time).format("YYYY-MM-DD HH:mm:ss") : null,
//                 clockOutTime: out_time ? moment(out_time).format("YYYY-MM-DD HH:mm:ss") : null,
//                 totalHours: totalHours,
//                 company_location_name:result[0].companyValidation,
//             });
//         }

//         return res.status(StatusCodes.OK).json({
//             status: true,
//             clockInTime: null,
//             clockOutTime: null,
//             totalHours: null,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };
const getClockInStatus = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const currentDate = moment().format("YYYY-MM-DD");

        const query = `
            SELECT in_time, out_time, company_location_name, captured_image, checkout_captured_image
            FROM attendances
            WHERE user_id = ? AND DATE(in_time) = ?
            ORDER BY in_time DESC
            LIMIT 1;
        `;
        const result = await db.query(query, [userId, currentDate]);

        if (result.length > 0) {
            const { in_time, out_time, company_location_name, captured_image, checkout_captured_image } = result[0];

            let totalHours = null;
            if (in_time && out_time) {
                const start = moment(in_time);
                const end = moment(out_time);
                const duration = moment.duration(end.diff(start));

                // Convert duration to HH:mm:ss
                const hours = String(Math.floor(duration.asHours())).padStart(2, "0");
                const minutes = String(duration.minutes()).padStart(2, "0");
                const seconds = String(duration.seconds()).padStart(2, "0");
                totalHours = `${hours}:${minutes}:${seconds}`;
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                clockInTime: in_time ? moment(in_time).format("YYYY-MM-DD HH:mm:ss") : null,
                clockOutTime: out_time ? moment(out_time).format("YYYY-MM-DD HH:mm:ss") : null,
                totalHours: totalHours,
                company_location_name: company_location_name, // Corrected key name
                checkin_captured_image: captured_image,
                checkout_captured_image: checkout_captured_image,
            });
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            clockInTime: null,
            clockOutTime: null,
            totalHours: null,
            companyLocationName: null, // Added this for consistency
            checkin_captured_image: null,
            checkout_captured_image: null,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


// const getPastDaysAttendance = async (req, res) => {
//     try {

//         const userId = req.user.user_id;

//         // Query to fetch attendance
//         const selectQuery = `
//             SELECT * 
//             FROM attendances 
//             WHERE user_id = ? 
//             ORDER BY id DESC 
//             LIMIT 10
//         `;
//         const queryResult = await db.query(selectQuery, [userId]);

//         // Check for query result
//         if (queryResult.length > 0) {
//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Fetched successfully",
//                 data: queryResult
//             });
//         } else {
//             return res.status(StatusCodes.NOT_FOUND).json({
//                 status: false,
//                 message: "No attendance records found"
//             });
//         }
//     } catch (error) {
//         console.error("Error fetching attendance:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "An unexpected error occurred"
//         });
//     }
// };


// const getPastDaysAttendance = async (req, res) => {
//     try {
//         const userId = req.user.user_id;

//         // Query to fetch attendance
//         const selectQuery = `
//             SELECT * 
//             FROM attendances 
//             WHERE user_id = ? 
//             ORDER BY id DESC 
//             LIMIT 10
//         `;
//         const queryResult = await db.query(selectQuery, [userId]);

//         // Check for query result
//         if (queryResult.length > 0) {
//             // Map attendance_status to descriptive labels
//             const mappedResult = queryResult.map((attendance) => ({
//                 ...attendance,
//                 status_label: attendance.attendance_status == 1
//                     ? "A"
//                     : attendance.attendance_status == 2
//                         ? "P"
//                         : attendance.attendance_status == 3
//                             ? "H"
//                             : "Unknown",
//             }));

//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Fetched successfully",
//                 data: mappedResult
//             });
//         } else {
//             return res.status(StatusCodes.NOT_FOUND).json({
//                 status: false,
//                 message: "No attendance records found"
//             });
//         }
//     } catch (error) {
//         console.error("Error fetching attendance:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "An unexpected error occurred"
//         });
//     }
// };

const getPastDaysAttendance = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Specify the timezone (replace 'Asia/Kolkata' with your desired timezone)
        const timeZone = 'Asia/Kolkata';

        // Query to fetch attendance records for the user (limit to last 10 records)
        const selectQuery = `
            SELECT * 
            FROM attendances 
            WHERE user_id = ? 
            ORDER BY id DESC 
            LIMIT 10
        `;
        const queryResult = await db.query(selectQuery, [userId]);

        // Check for query result
        if (queryResult.length > 0) {
            // Map attendance records and convert time to the specified timezone
            const mappedResult = queryResult.map((attendance) => {
                const in_time_local = attendance.in_time ? momentTz.utc(attendance.in_time).tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : null;
                const out_time_local = attendance.out_time ? momentTz.utc(attendance.out_time).tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : null;

                return {
                    id: attendance.id,
                    status: attendance.status,
                    break_type: attendance.break_type,
                    leave_type: attendance.leave_type,
                    user_id: attendance.user_id,
                    in_time: attendance.in_time ? moment(attendance.in_time).format("YYYY-MM-DD HH:mm:ss") : null,
                    out_time: attendance.out_time ? moment(attendance.out_time).format("YYYY-MM-DD HH:mm:ss") : null,
                    attendance_type: attendance.attendance_type,
                    attendance_mark_by: attendance.attendance_mark_by,
                    attendance_mark_status: attendance.attendance_mark_status,
                    attendance_status: attendance.attendance_status,
                    note: attendance.note,
                    created_at: momentTz.utc(attendance.created_at).tz(timeZone).format("YYYY-MM-DD HH:mm:ss"),
                    updated_at: attendance.updated_at ? momentTz.utc(attendance.updated_at).tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : null,
                    clockInLongitude: attendance.clockInLongitude,
                    clockInLatitude: attendance.clockInLatitude,
                    clockOutLongitude: attendance.clockOutLongitude,
                    clockOutLatitude: attendance.clockOutLatitude,
                    company_location_name: attendance.company_location_name,
                    device_info: attendance.device_info,
                    user_uuid: attendance.user_uuid,
                    captured_image: attendance.captured_image,
                    checkout_captured_image: attendance.checkout_captured_image,
                    name: attendance.name,
                    employee_id: attendance.employee_id,
                    status_label: attendance.attendance_status == 1
                        ? "A"
                        : attendance.attendance_status == 2
                            ? "P"
                            : attendance.attendance_status == 3
                                ? "H"
                                : "Unknown",
                };
            });

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: mappedResult // Return the array of formatted records
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "No attendance records found"
            });
        }
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "An unexpected error occurred"
        });
    }
};

const getPastDaysAttendanceUsers = async (req, res) => {
    try {
        const userId = req.params.user_id;

        // Query to fetch attendance
        // const selectQuery = `
        //     SELECT * 
        //     FROM attendances 
        //     WHERE user_id = ? 
        //     ORDER BY id DESC 
        //     LIMIT 10
        // `;
        // const queryResult = await db.query(selectQuery, [userId]);

        // // Check for query result
        // if (queryResult.length > 0) {
        //     // Map attendance_status to descriptive labels
        //     const mappedResult = queryResult.map((attendance) => ({
        //         ...attendance,
        //         status_label: attendance.attendance_status == 1
        //             ? "A"
        //             : attendance.attendance_status == 2
        //                 ? "P"
        //                 : attendance.attendance_status == 3
        //                     ? "H"
        //                     : "Unknown",
        //     }));

        //     return res.status(StatusCodes.OK).json({
        //         status: true,
        //         message: "Fetched successfully",
        //         data: mappedResult
        //     });
        // } else {
        //     return res.status(StatusCodes.NOT_FOUND).json({
        //         status: false,
        //         message: "No attendance records found"
        //     });
        // }


        const timeZone = 'Asia/Kolkata';

        // Query to fetch attendance records for the user (limit to last 10 records)
        const selectQuery = `
            SELECT * 
            FROM attendances 
            WHERE user_id = ? 
            ORDER BY id DESC 
            LIMIT 10
        `;
        const queryResult = await db.query(selectQuery, [userId]);

        // Check for query result
        if (queryResult.length > 0) {
            // Map attendance records and convert time to the specified timezone
            const mappedResult = queryResult.map((attendance) => {
                const in_time_local = attendance.in_time ? momentTz.utc(attendance.in_time).tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : null;
                const out_time_local = attendance.out_time ? momentTz.utc(attendance.out_time).tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : null;

                return {
                    id: attendance.id,
                    status: attendance.status,
                    break_type: attendance.break_type,
                    leave_type: attendance.leave_type,
                    user_id: attendance.user_id,
                    in_time: attendance.in_time ? moment(attendance.in_time).format("YYYY-MM-DD HH:mm:ss") : null,
                    out_time: attendance.out_time ? moment(attendance.out_time).format("YYYY-MM-DD HH:mm:ss") : null,
                    attendance_type: attendance.attendance_type,
                    attendance_mark_by: attendance.attendance_mark_by,
                    attendance_mark_status: attendance.attendance_mark_status,
                    attendance_status: attendance.attendance_status,
                    note: attendance.note,
                    created_at: momentTz.utc(attendance.created_at).tz(timeZone).format("YYYY-MM-DD HH:mm:ss"),
                    updated_at: attendance.updated_at ? momentTz.utc(attendance.updated_at).tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : null,
                    clockInLongitude: attendance.clockInLongitude,
                    clockInLatitude: attendance.clockInLatitude,
                    clockOutLongitude: attendance.clockOutLongitude,
                    clockOutLatitude: attendance.clockOutLatitude,
                    company_location_name: attendance.company_location_name,
                    device_info: attendance.device_info,
                    user_uuid: attendance.user_uuid,
                    captured_image: attendance.captured_image,
                    checkout_captured_image: attendance.checkout_captured_image,
                    name: attendance.name,
                    employee_id: attendance.employee_id,
                    status_label: attendance.attendance_status == 1
                        ? "A"
                        : attendance.attendance_status == 2
                            ? "P"
                            : attendance.attendance_status == 3
                                ? "H"
                                : "Unknown",
                };
            });

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: mappedResult // Return the array of formatted records
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "No attendance records found"
            });
        }
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "An unexpected error occurred"
        });
    }
};



// const getTodayAttendance = async (req, res) => {
//     try {
//         // Query to fetch today's attendance
//         const selectQuery = `
//             SELECT attendances.*, users.name, users.employee_id
//             FROM attendances LEFT JOIN users ON users.id = attendances.user_id
//             WHERE DATE(attendances.created_at) = CURDATE() 
//             ORDER BY id DESC
//         `;
//         const queryResult = await db.query(selectQuery);

//         // Check for query result
//         if (queryResult.length > 0) {
//             // Map attendance_status to descriptive labels
//             const mappedResult = queryResult.map((attendance) => ({
//                 ...attendance,
//                 status_label: attendance.attendance_status == 1
//                     ? "A"
//                     : attendance.attendance_status == 2
//                         ? "P"
//                         : attendance.attendance_status == 3
//                             ? "H"
//                             : "Unknown",
//             }));

//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Fetched successfully",
//                 data: mappedResult
//             });
//         } else {
//             return res.status(StatusCodes.NOT_FOUND).json({
//                 status: false,
//                 message: "No attendance records found for today"
//             });
//         }
//     } catch (error) {
//         console.error("Error fetching attendance:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "An unexpected error occurred"
//         });
//     }
// };



// for single users 
// const downloadCsvFileForUsers = async (req, res) => {
//     try {
//         const id = req.query.id;

//         if (id) {
//             // Fetch data from the database for the current month
//             // const selectQuery = await db.query(
//             //     `SELECT * FROM attendances  WHERE user_id = ? AND MONTH(in_time) = MONTH(CURRENT_DATE()) AND YEAR(in_time) = YEAR(CURRENT_DATE())`,
//             //     [id]
//             // );

//             const selectQuery = await db.query(
//                 `SELECT * 
//                  FROM attendances 
//                  LEFT JOIN users ON users.id = attendances.user_id 
//                  WHERE attendances.user_id = ? 
//                  AND MONTH(attendances.in_time) = MONTH(CURRENT_DATE()) 
//                  AND YEAR(attendances.in_time) = YEAR(CURRENT_DATE())`,
//                 [id]
//             );


//             if (selectQuery.length === 0) {
//                 return res.status(404).json({ status: false, message: 'No records found for the given user ID in the current month.' });
//             }

//             const csvWriter = createObjectCsvWriter({
//                 path: 'attendance.csv',
//                 header: [
//                     { id: 'name', title: 'Employee Name' },
//                     { id: 'status', title: 'Status' },
//                     { id: 'in_time', title: 'In Time' },
//                     { id: 'out_time', title: 'Out Time' },
//                     { id: 'clockInLongitude', title: 'Check-in Longitude' },
//                     { id: 'clockInLatitude', title: 'Check-In Latitude' },
//                     { id: 'clockOutLongitude', title: 'Check-Out Longitude' },
//                     { id: 'clockOutLatitude', title: 'Check-Out Latitude' },
//                     { id: 'company_location_name', title: 'Company Location Name' }
//                 ]
//             });

//             const results = selectQuery.map(row => ({
//                 name: row.name || 'N/A',
//                 status: row.status || 'N/A',
//                 in_time: row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                 out_time: row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                 clockInLongitude: row.clockInLongitude || 'N/A',
//                 clockInLatitude: row.clockInLatitude || 'N/A',
//                 clockOutLongitude: row.clockOutLongitude || 'N/A',
//                 clockOutLatitude: row.clockOutLatitude || 'N/A',
//                 company_location_name: row.company_location_name || 'N/A'
//             }));

//             // Write data to CSV
//             await csvWriter.writeRecords(results);

//             // Set response headers and download file
//             res.set({
//                 'Content-Type': 'text/csv',
//                 'Content-Disposition': 'attachment; filename="attendance.csv"'
//             });

//             return res.download('attendance.csv', (err) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).send(err);
//                 } else {
//                     fs.unlinkSync('attendance.csv'); // Delete the file after sending it
//                 }
//             });
//         } else {
//             // Directly download the sample file without checking if it exists
//             const sampleCsvPath = path.join(__dirname, '../public/sampleCsv/sampleCsv.csv');

//             res.download(sampleCsvPath, 'sampleCsv.csv', (err) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).send(err);
//                 }
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };

// for multiple users 
// const downloadCsvFileForUsers = async (req, res) => {
//     try {
//         const createdById =125; // Assuming `created_by` is linked to the logged-in user's ID

//         if (createdById) {
//             // Step 1: Get users created by the current user
//             const usersQuery = await db.query(
//                 `SELECT id FROM users WHERE created_by = ?`,
//                 [createdById]
//             );

//             if (usersQuery.length === 0) {
//                 return res.status(404).json({ status: false, message: 'No users found created by the given user ID.' });
//             }

//             // Extract user IDs from the query result
//             const userIds = usersQuery.map(user => user.id);

//             // Step 2: Get attendance records for these users for the current month
//             const attendancesQuery = await db.query(
//                 `SELECT attendances.*, users.name AS user_name 
//                  FROM attendances 
//                  LEFT JOIN users ON users.id = attendances.user_id 
//                  WHERE attendances.user_id IN (?) 
//                  AND MONTH(attendances.in_time) = MONTH(CURRENT_DATE()) 
//                  AND YEAR(attendances.in_time) = YEAR(CURRENT_DATE())`,
//                 [userIds]
//             );

//             if (attendancesQuery.length === 0) {
//                 return res.status(404).json({ status: false, message: 'No attendance records found for the specified users in the current month.' });
//             }

//             // Step 3: Prepare CSV file
//             const csvWriter = createObjectCsvWriter({
//                 path: 'attendance.csv',
//                 header: [
//                     { id: 'user_id', title: 'User ID' },
//                     { id: 'user_name', title: 'User Name' },
//                     { id: 'status', title: 'Status' },
//                     { id: 'in_time', title: 'In Time' },
//                     { id: 'out_time', title: 'Out Time' },
//                     { id: 'clockInLongitude', title: 'Clock-In Longitude' },
//                     { id: 'clockInLatitude', title: 'Clock-In Latitude' },
//                     { id: 'clockOutLongitude', title: 'Clock-Out Longitude' },
//                     { id: 'clockOutLatitude', title: 'Clock-Out Latitude' },
//                     { id: 'company_location_name', title: 'Company Location Name' }
//                 ]
//             });

//             const results = attendancesQuery.map(row => ({
//                 user_id: row.user_id || 'N/A',
//                 user_name: row.user_name || 'N/A',
//                 status: row.status || 'N/A',
//                 in_time: row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                 out_time: row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                 clockInLongitude: row.clockInLongitude || 'N/A',
//                 clockInLatitude: row.clockInLatitude || 'N/A',
//                 clockOutLongitude: row.clockOutLongitude || 'N/A',
//                 clockOutLatitude: row.clockOutLatitude || 'N/A',
//                 company_location_name: row.company_location_name || 'N/A'
//             }));

//             await csvWriter.writeRecords(results);

//             // Step 4: Send the CSV file as a response
//             res.set({
//                 'Content-Type': 'text/csv',
//                 'Content-Disposition': 'attachment; filename="attendance.csv"'
//             });

//             res.download('attendance.csv', (err) => {
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send(err);
//                 } else {
//                     fs.unlinkSync('attendance.csv'); // Delete the file after sending it
//                 }
//             });
//         } else {
//             return res.status(400).json({ status: false, message: 'Invalid user ID.' });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };


// const downloadCsvFileForUsers = async (req, res) => {
//     try {
//         const createdById =125; // Assuming `created_by` is linked to the logged-in user's ID

//         if (createdById) {
//             // Step 1: Get users created by the current user
//             const usersQuery = await db.query(
//                 `SELECT id, name FROM users WHERE created_by = ?`,
//                 [createdById]
//             );

//             if (usersQuery.length === 0) {
//                 return res.status(404).json({ status: false, message: 'No users found created by the given user ID.' });
//             }

//             // Extract user IDs from the query result
//             const userIds = usersQuery.map(user => user.id);

//             // Step 2: Get attendance records for these users for the current month
//             const attendancesQuery = await db.query(
//                 `SELECT attendances.*, users.name AS user_name 
//                  FROM attendances 
//                  LEFT JOIN users ON users.id = attendances.user_id 
//                  WHERE attendances.user_id IN (?) 
//                  AND MONTH(attendances.in_time) = MONTH(CURRENT_DATE()) 
//                  AND YEAR(attendances.in_time) = YEAR(CURRENT_DATE())`,
//                 [userIds]
//             );

//             if (attendancesQuery.length === 0) {
//                 return res.status(404).json({ status: false, message: 'No attendance records found for the specified users in the current month.' });
//             }

//             // Step 3: Group data by user
//             const groupedData = {};
//             attendancesQuery.forEach(row => {
//                 if (!groupedData[row.user_id]) {
//                     groupedData[row.user_id] = {
//                         user_name: row.user_name,
//                         records: []
//                     };
//                 }
//                 groupedData[row.user_id].records.push({
//                     status: row.status || 'N/A',
//                     in_time: row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                     out_time: row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                     clockInLongitude: row.clockInLongitude || 'N/A',
//                     clockInLatitude: row.clockInLatitude || 'N/A',
//                     clockOutLongitude: row.clockOutLongitude || 'N/A',
//                     clockOutLatitude: row.clockOutLatitude || 'N/A',
//                     company_location_name: row.company_location_name || 'N/A'
//                 });
//             });

//             // Step 4: Prepare CSV content
//             const csvWriter = createObjectCsvWriter({
//                 path: 'attendance.csv',
//                 header: [
//                     { id: 'user_id', title: 'User ID' },
//                     { id: 'user_name', title: 'User Name' },
//                     { id: 'status', title: 'Status' },
//                     { id: 'in_time', title: 'In Time' },
//                     { id: 'out_time', title: 'Out Time' },
//                     { id: 'clockInLongitude', title: 'Clock-In Longitude' },
//                     { id: 'clockInLatitude', title: 'Clock-In Latitude' },
//                     { id: 'clockOutLongitude', title: 'Clock-Out Longitude' },
//                     { id: 'clockOutLatitude', title: 'Clock-Out Latitude' },
//                     { id: 'company_location_name', title: 'Company Location Name' }
//                 ]
//             });

//             const records = [];
//             for (const userId in groupedData) {
//                 const user = groupedData[userId];
//                 user.records.forEach(record => {
//                     records.push({
//                         user_id: userId,
//                         user_name: user.user_name,
//                         ...record
//                     });
//                 });
//             }

//             await csvWriter.writeRecords(records);

//             // Step 5: Send the CSV file as a response
//             res.set({
//                 'Content-Type': 'text/csv',
//                 'Content-Disposition': 'attachment; filename="attendance.csv"'
//             });

//             res.download('attendance.csv', (err) => {
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send(err);
//                 } else {
//                     fs.unlinkSync('attendance.csv'); // Delete the file after sending it
//                 }
//             });
//         } else {
//             return res.status(400).json({ status: false, message: 'Invalid user ID.' });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };

// for pdf
// const downloadCsvFileForUsers = async (req, res) => {
//     try {
//         const createdById = 125;

//         if (createdById) {
//             // Step 1: Get users created by the current user
//             const usersQuery = await db.query(
//                 `SELECT id, name FROM users WHERE created_by = ?`,
//                 [createdById]
//             );

//             if (usersQuery.length === 0) {
//                 return res.status(404).json({ status: false, message: 'No users found created by the given user ID.' });
//             }

//             // Extract user IDs from the query result
//             const userIds = usersQuery.map(user => user.id);

//             // Step 2: Get attendance records for these users for the current month
//             const attendancesQuery = await db.query(
//                 `SELECT attendances.*, users.name AS user_name 
//                  FROM attendances 
//                  LEFT JOIN users ON users.id = attendances.user_id 
//                  WHERE attendances.user_id IN (?) 
//                  AND MONTH(attendances.in_time) = MONTH(CURRENT_DATE()) 
//                  AND YEAR(attendances.in_time) = YEAR(CURRENT_DATE())`,
//                 [userIds]
//             );

//             if (attendancesQuery.length === 0) {
//                 return res.status(404).json({ status: false, message: 'No attendance records found for the specified users in the current month.' });
//             }

//             // Step 3: Group data by user
//             const groupedData = {};
//             attendancesQuery.forEach(row => {
//                 if (!groupedData[row.user_id]) {
//                     groupedData[row.user_id] = {
//                         user_name: row.user_name,
//                         records: []
//                     };
//                 }
//                 groupedData[row.user_id].records.push({
//                     status: row.status || 'N/A',
//                     in_time: row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                     out_time: row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                     clockInLongitude: row.clockInLongitude || 'N/A',
//                     clockInLatitude: row.clockInLatitude || 'N/A',
//                     clockOutLongitude: row.clockOutLongitude || 'N/A',
//                     clockOutLatitude: row.clockOutLatitude || 'N/A',
//                     company_location_name: row.company_location_name || 'N/A'
//                 });
//             });

//             // Step 4: Generate PDF
//             const doc = new PDFDocument();
//             const filePath = 'attendance.pdf';

//             doc.pipe(fs.createWriteStream(filePath)); // Save to file

//             doc.fontSize(18).text('Attendance Report', { align: 'center' });
//             doc.moveDown();

//             for (const userId in groupedData) {
//                 const user = groupedData[userId];

//                 // User Header
//                 doc.fontSize(14).text(`User ID: ${userId}`, { bold: true });
//                 doc.fontSize(14).text(`User Name: ${user.user_name}`);
//                 doc.moveDown(0.5);

//                 // Table Header
//                 doc.fontSize(12).text('Attendance Details:');
//                 doc.moveDown(0.3);

//                 // Attendance Records
//                 user.records.forEach((record, index) => {
//                     doc.text(`Record ${index + 1}:`, { underline: true });
//                     doc.text(`  Status: ${record.status}`);
//                     doc.text(`  In Time: ${record.in_time}`);
//                     doc.text(`  Out Time: ${record.out_time}`);
//                     doc.text(`  Clock-In Latitude/Longitude: ${record.clockInLatitude} / ${record.clockInLongitude}`);
//                     doc.text(`  Clock-Out Latitude/Longitude: ${record.clockOutLatitude} / ${record.clockOutLongitude}`);
//                     doc.text(`  Company Location: ${record.company_location_name}`);
//                     doc.moveDown(0.5);
//                 });

//                 doc.moveDown();
//             }

//             doc.end();

//             // Step 5: Send PDF as a response
//             res.set({
//                 'Content-Type': 'application/pdf',
//                 'Content-Disposition': `attachment; filename="attendance.pdf"`
//             });

//             res.download(filePath, (err) => {
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send(err);
//                 } else {
//                     fs.unlinkSync(filePath); // Delete the file after sending it
//                 }
//             });
//         } else {
//             return res.status(400).json({ status: false, message: 'Invalid user ID.' });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };






// const downloadCsvFileForUsers = async (req, res) => {
//     try {
//         const createdById = 125;

//         if (createdById) {
//             // Step 1: Get users created by the current user
//             const usersQuery = await db.query(
//                 `SELECT id, name FROM users WHERE created_by = ?`,
//                 [createdById]
//             );

//             if (usersQuery.length === 0) {
//                 return res.status(404).json({ status: false, message: 'No users found created by the given user ID.' });
//             }

//             // Extract user IDs from the query result
//             const userIds = usersQuery.map(user => user.id);

//             // Step 2: Get attendance records for these users for the current month
//             const attendancesQuery = await db.query(
//                 `SELECT attendances.*, users.name AS user_name 
//                      FROM attendances 
//                      LEFT JOIN users ON users.id = attendances.user_id 
//                      WHERE attendances.user_id IN (?) 
//                      AND MONTH(attendances.in_time) = MONTH(CURRENT_DATE()) 
//                      AND YEAR(attendances.in_time) = YEAR(CURRENT_DATE())`,
//                 [userIds]
//             );

//             if (attendancesQuery.length === 0) {
//                 return res.status(404).json({ status: false, message: 'No attendance records found for the specified users in the current month.' });
//             }

//             // Step 3: Group attendance data by user
//             const groupedData = {};
//             attendancesQuery.forEach(row => {
//                 if (!groupedData[row.user_id]) {
//                     groupedData[row.user_id] = {
//                         user_name: row.user_name,
//                         records: []
//                     };
//                 }
//                 groupedData[row.user_id].records.push({
//                     Status: row.status || 'N/A',
//                     "In Time": row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                     "Out Time": row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                     "Clock-In Longitude": row.clockInLongitude || 'N/A',
//                     "Clock-In Latitude": row.clockInLatitude || 'N/A',
//                     "Clock-Out Longitude": row.clockOutLongitude || 'N/A',
//                     "Clock-Out Latitude": row.clockOutLatitude || 'N/A',
//                     "Company Location": row.company_location_name || 'N/A'
//                 });
//             });

//             // Step 4: Generate PDF
//             const doc = new PDFDocument({ margin: 30, size: 'A4' });

//             // Pipe the PDF output to the response for direct download
//             res.set({
//                 'Content-Type': 'application/pdf',
//                 'Content-Disposition': `attachment; filename="attendance_report.pdf"`
//             });

//             // Pipe to the response stream
//             doc.pipe(res);

//             // Title
//             doc
//                 .fontSize(20)
//                 .text('Attendance Report', { align: 'center', underline: true })
//                 .moveDown(1);

//             // Add data for each user in table format
//             for (const userId in groupedData) {
//                 const user = groupedData[userId];

//                 // Section Header
//                 doc
//                     .fontSize(16)
//                     .text(`User: ${user.user_name} (ID: ${userId})`, { bold: true })
//                     .moveDown(0.5);

//                 // Table header
//                 const tableHeaders = [
//                     'Status', 'In Time', 'Out Time', 'Clock-In Longitude',
//                     'Clock-In Latitude', 'Clock-Out Longitude',
//                     'Clock-Out Latitude', 'Company Location'
//                 ];

//                 // Draw table headers
//                 const headerX = doc.x + 10;
//                 const headerY = doc.y + 10;
//                 const headerHeight = 20;
//                 const columnWidths = [60, 100, 100, 80, 80, 80, 80, 120]; // Adjust width as needed

//                 // Draw the header row
//                 tableHeaders.forEach((header, index) => {
//                     doc
//                         .text(header, headerX + columnWidths.slice(0, index).reduce((acc, curr) => acc + curr, 0), headerY, { width: columnWidths[index], align: 'center' })
//                         .moveDown(0);
//                 });

//                 doc.moveDown(0.5);

//                 // Draw the records
//                 user.records.forEach((record, recordIndex) => {
//                     tableHeaders.forEach((header, index) => {
//                         const value = record[header] || 'N/A';
//                         doc
//                             .text(value, headerX + columnWidths.slice(0, index).reduce((acc, curr) => acc + curr, 0), doc.y, { width: columnWidths[index], align: 'center' })
//                             .moveDown(0);
//                     });

//                     if (recordIndex < user.records.length - 1) {
//                         doc.moveDown(0.5); // Add space between records
//                     }
//                 });

//                 doc.moveDown(1); // Add space between users
//             }

//             // Add page footer with page number
//             doc.on('pageAdded', function () {
//                 doc.fontSize(8)
//                     .text(`Page ${doc.pageCount}`, doc.page.width - 50, doc.page.height - 30, { align: 'right' });
//             });

//             // End the document
//             doc.end();

//         } else {
//             return res.status(400).json({ status: false, message: 'Invalid user ID.' });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };

//  for pdf download multiple users 

// const downloadCsvFileForUsers = async (req, res) => {
//     try {
//         const createdById = 125;
//         console.log('Step 1: Received request to generate attendance report for user ID:', createdById);

//         if (createdById) {
//             // Step 1: Fetch users created by the current user
//             const usersQuery = await db.query(
//                 `SELECT id, name FROM users WHERE created_by = ?`,
//                 [createdById]
//             );
//             console.log('Step 2: Fetched users created by user ID:', createdById, usersQuery);

//             if (usersQuery.length === 0) {
//                 console.log('No users found for user ID:', createdById);
//                 return res.status(404).json({ status: false, message: 'No users found created by the given user ID.' });
//             }

//             const userIds = usersQuery.map(user => user.id);
//             console.log('Step 3: Extracted user IDs for attendance query:', userIds);

//             // Step 2: Fetch attendance records for these users
//             const attendancesQuery = await db.query(
//                 `SELECT attendances.*, users.name AS user_name 
//                  FROM attendances 
//                  LEFT JOIN users ON users.id = attendances.user_id 
//                  WHERE attendances.user_id IN (?) 
//                  AND MONTH(attendances.in_time) = MONTH(CURRENT_DATE()) 
//                  AND YEAR(attendances.in_time) = YEAR(CURRENT_DATE())`,
//                 [userIds]
//             );
//             console.log('Step 4: Fetched attendance records:', attendancesQuery);

//             if (attendancesQuery.length === 0) {
//                 console.log('No attendance records found for user IDs:', userIds);
//                 return res.status(404).json({ status: false, message: 'No attendance records found for the specified users in the current month.' });
//             }

//             // Group attendance data by user
//             const groupedData = usersQuery.map(user => ({
//                 user_name: user.name,
//                 attendances: attendancesQuery.filter(record => record.user_id === user.id),
//             }));
//             console.log('Step 5: Grouped attendance data by user:', JSON.stringify(groupedData, null, 2));
//             // Step 3: Generate HTML content for the PDF
//             // Filter out users with empty attendance data
//             const filteredData = groupedData.filter(group => group.attendances.length > 0);
//             console.log('Filtered attendance data:', JSON.stringify(filteredData, null, 2));

//             // Generate HTML content for the PDF
//             let htmlContent = `
//                 <html>
//                     <head>
//                         <style>
//                             body { font-family: Arial, sans-serif; margin: 20px; }
//                             h1 { text-align: center; }
//                             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//                             th, td { padding: 10px; border: 1px solid #ddd; }
//                             th { background-color: #f4f4f4; }
//                         </style>
//                     </head>
//                     <body>
//                         <h1>Attendance Report</h1>
//             `;

//             // Loop through filtered data and generate table for each user
//             filteredData.forEach(group => {
//                 htmlContent += `
//                     <h2>${group.user_name}</h2>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Status</th>
//                                 <th>In Time</th>
//                                 <th>Out Time</th>
//                                 <th>Check-In Longitude</th>
//                                 <th>Check-In Latitude</th>
//                                 <th>Check-Out Longitude</th>
//                                 <th>Check-Out Latitude</th>
//                                 <th>Company Location</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                 `;

//                 group.attendances.forEach(attendance => {
//                     htmlContent += `
//                         <tr>
//                             <td>${attendance.status || 'N/A'}</td>
//                             <td>${formatTime(attendance.in_time)}</td>
//                             <td>${formatTime(attendance.out_time)}</td>
//                             <td>${attendance.clockInLongitude || 'N/A'}</td>
//                             <td>${attendance.clockInLatitude || 'N/A'}</td>
//                             <td>${attendance.clockOutLongitude || 'N/A'}</td>
//                             <td>${attendance.clockOutLatitude || 'N/A'}</td>
//                             <td>${attendance.company_location_name || 'N/A'}</td>
//                         </tr>
//                     `;
//                 });

//                 htmlContent += `</tbody></table>`;
//             });

//             htmlContent += `</body></html>`;
//             console.log('Generated HTML content for PDF.');
//             // Step 4: Generate PDF using Puppeteer
//             const browser = await puppeteer.launch({
//                 headless: true,
//                 args: ['--no-sandbox', '--disable-setuid-sandbox'],
//             });
//             console.log('Step 7: Puppeteer browser launched.');

//             const page = await browser.newPage();
//             await page.setContent(htmlContent, { waitUntil: 'load' });
//             console.log('Step 8: Set HTML content in Puppeteer.');

//             const pdfBuffer = await page.pdf({ format: 'A4' });
//             console.log('Step 9: PDF generated. Buffer size:', pdfBuffer.length);

//             if (!pdfBuffer || pdfBuffer.length === 0) {
//                 console.log('Error: PDF buffer is empty.');
//                 throw new Error('PDF buffer is empty. Ensure Puppeteer generated the PDF correctly.');
//             }

//             await browser.close();
//             console.log('Step 10: Puppeteer browser closed.');

//             // Step 5: Send PDF as a response with cache control
//             res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//             res.setHeader('Pragma', 'no-cache');
//             res.setHeader('Expires', '0');
//             res.setHeader('Content-Type', 'application/pdf');
//             res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.pdf"');
//             console.log('Step 11: Sending PDF response...');
//             res.write(pdfBuffer);
//             res.end(); // End the response
//         } else {
//             console.log('Invalid user ID provided:', createdById);
//             res.status(400).json({ status: false, message: 'Invalid user ID.' });
//         }
//     } catch (error) {
//         console.error('Error occurred:', error.message);
//         res.status(500).json({ status: false, message: error.message });
//     }
// };

// const downloadCsvFileForUsers = async (req, res) => {
//     try {
//         const createdById = 125;
//         const userType = 3;

//         console.log('Step 1: Received request to generate attendance report for user ID:', createdById, 'and userType:', userType);

//         if (createdById) {
//             // Initialize userIds and usersQuery
//             let userIds = [createdById]; // Default to createdById for userType !== 3
//             let usersQuery = [];

//             if (userType === 3) {
//                 console.log('Step 2: Fetching users created by user ID:', createdById);

//                 // Fetch users created by the current user
//                 usersQuery = await db.query(
//                     `SELECT id, name FROM users WHERE created_by = ?`,
//                     [createdById]
//                 );
//                 console.log('Step 3: Fetched users:', usersQuery);

//                 if (usersQuery.length === 0) {
//                     console.log('No users found for user ID:', createdById);
//                     return res.status(404).json({ status: false, message: 'No users found created by the given user ID.' });
//                 }

//                 // Extract user IDs for attendance query
//                 userIds = usersQuery.map(user => user.id);
//                 console.log('Step 4: Extracted user IDs for attendance query:', userIds);
//             } else {
//                 console.log('Step 2: Skipping user fetch as userType is not 3.');
//             }

//             // Fetch attendance records for the users
//             const attendancesQuery = await db.query(
//                 `SELECT attendances.*, users.name AS user_name 
//          FROM attendances 
//          LEFT JOIN users ON users.id = attendances.user_id 
//          WHERE attendances.user_id IN (?) 
//          AND MONTH(attendances.in_time) = MONTH(CURRENT_DATE()) 
//          AND YEAR(attendances.in_time) = YEAR(CURRENT_DATE())`,
//                 [userIds]
//             );
//             console.log('Step 5: Fetched attendance records:', attendancesQuery);

//             if (attendancesQuery.length === 0) {
//                 console.log('No attendance records found for user IDs:', userIds);
//                 return res.status(404).json({ status: false, message: 'No attendance records found for the specified users in the current month.' });
//             }

//             // If userType !== 3, fetch the single user info for grouping
//             if (userType !== 3) {
//                 usersQuery = await db.query(
//                     `SELECT id, name FROM users WHERE id = ?`,
//                     [createdById]
//                 );
//             }

//             // Group attendance data by user
//             const groupedData = usersQuery.map(user => ({
//                 user_name: user.name,
//                 attendances: attendancesQuery.filter(record => record.user_id === user.id),
//             }));

//             console.log('Step 6: Grouped attendance data by user:', JSON.stringify(groupedData, null, 2));

//             // Filter out users with empty attendance data
//             const filteredData = groupedData.filter(group => group.attendances.length > 0);
//             console.log('Step 7: Filtered attendance data:', JSON.stringify(filteredData, null, 2));


//             // Step 4: Prepare CSV file
//             const csvWriter = createObjectCsvWriter({
//                 path: 'attendance.csv',
//                 header: [
//                     { id: 'user_id', title: 'User ID' },
//                     { id: 'user_name', title: 'User Name' },
//                     { id: 'status', title: 'Status' },
//                     { id: 'in_time', title: 'In Time' },
//                     { id: 'out_time', title: 'Out Time' },
//                     { id: 'clockInLongitude', title: 'Clock-In Longitude' },
//                     { id: 'clockInLatitude', title: 'Clock-In Latitude' },
//                     { id: 'clockOutLongitude', title: 'Clock-Out Longitude' },
//                     { id: 'clockOutLatitude', title: 'Clock-Out Latitude' },
//                     { id: 'company_location_name', title: 'Company Location Name' }
//                 ]
//             });

//             const results = attendancesQuery.map(row => ({
//                 user_id: row.user_id || 'N/A',
//                 user_name: row.user_name || 'N/A',
//                 status: row.status || 'N/A',
//                 in_time: row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                 out_time: row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
//                 clockInLongitude: row.clockInLongitude || 'N/A',
//                 clockInLatitude: row.clockInLatitude || 'N/A',
//                 clockOutLongitude: row.clockOutLongitude || 'N/A',
//                 clockOutLatitude: row.clockOutLatitude || 'N/A',
//                 company_location_name: row.company_location_name || 'N/A'
//             }));

//             await csvWriter.writeRecords(results);

//             // Step 5: Send the CSV file as a response
//             res.set({
//                 'Content-Type': 'text/csv',
//                 'Content-Disposition': 'attachment; filename="attendance.csv"'
//             });

//             res.download('attendance.csv', (err) => {
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send(err);
//                 } else {
//                     fs.unlinkSync('attendance.csv'); // Delete the file after sending it
//                 }
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };




// with admin and users or single and multiple users 

// const downloadCsvFileForUsers = async (req, res) => {
//     try {
//         const createdById = 125; // Assuming this is the logged-in user's ID
//         const userType = 3; // Assuming userType is passed in the request
//         const startDate = "2024-11-01";
//         const endDate = "2024-12-31";
//         console.log('Step 1: Received request to generate attendance report for user ID:', createdById, 'and userType:', userType);

//         let userIds = [];

//         if (userType === 3) {
//             console.log('Step 2: Fetching users created by user ID:', createdById);

//             // Fetch users created by the current user
//             const usersQuery = await db.query(
//                 `SELECT id, name FROM users WHERE created_by = ?`,
//                 [createdById]
//             );
//             console.log('Step 3: Fetched users:', usersQuery);

//             if (usersQuery.length === 0) {
//                 console.log('No users found for user ID:', createdById);
//                 return res.status(404).json({ status: false, message: 'No users found created by the given user ID.' });
//             }

//             // Extract user IDs for attendance query
//             userIds = usersQuery.map(user => user.id);
//             console.log('Step 4: Extracted user IDs for attendance query:', userIds);
//         } else {
//             console.log('Step 2: Skipping user fetch as userType is not 3. Fetching attendance for the logged-in user only.');
//             userIds = [createdById];
//         }

//         // Fetch attendance records for the users
//         // const attendancesQuery = await db.query(
//         //     `SELECT attendances.*, users.name AS user_name 
//         //      FROM attendances 
//         //      LEFT JOIN users ON users.id = attendances.user_id 
//         //      WHERE attendances.user_id IN (?) 
//         //      AND MONTH(attendances.in_time) = MONTH(CURRENT_DATE()) 
//         //      AND YEAR(attendances.in_time) = YEAR(CURRENT_DATE())`,
//         //     [userIds]
//         // );


//         const attendancesQuery = await db.query(
//             `SELECT attendances.*, users.name AS user_name 
//              FROM attendances 
//              LEFT JOIN users ON users.id = attendances.user_id 
//              WHERE attendances.user_id IN (?) 
//              AND attendances.in_time BETWEEN ? AND ?`,
//             [userIds, startDate, endDate]
//         );
//         // console.log('Step 5: Fetched attendance records:', attendancesQuery);

//         if (attendancesQuery.length === 0) {
//             console.log('No attendance records found for user IDs:', userIds);
//             return res.status(404).json({ status: false, message: 'No attendance records found for the specified users in the current month.' });
//         }

//         // Group attendance data by user
//         const groupedData = userIds.map(userId => ({
//             user_name: attendancesQuery.find(record => record.user_id === userId)?.user_name || 'N/A',
//             attendances: attendancesQuery.filter(record => record.user_id === userId),
//         }));

//         console.log('Step 6: Grouped attendance data by user:', JSON.stringify(groupedData, null, 2));

//         const csvData = groupedData.flatMap(group =>
//             group.attendances.map(record => ({
//                 user_id: record.user_id || 'N/A',
//                 user_name: group.user_name || 'N/A',
//                 status:
//                     record.status == "incomplete"
//                         ? "checkIn"
//                         : record.status == "complete"
//                             ? 'checkIn/checkout'
//                             : 'N/A',
//                 attendance_status:
//                     record.attendance_status === '1'
//                         ? 'A' // Present
//                         : record.attendance_status === '2'
//                             ? 'P' // Absent
//                             : record.attendance_status === '3'
//                                 ? 'H' // Half-day
//                                 : 'N/A', // Default
//                 in_time: record.in_time
//                     ? moment(record.in_time).format('YYYY-MM-DD HH:mm:ss')
//                     : 'N/A',
//                 out_time: record.out_time
//                     ? moment(record.out_time).format('YYYY-MM-DD HH:mm:ss')
//                     : 'N/A',
//                 month: record.in_time
//                     ? moment(record.in_time).format('MMMM') // Extract month name
//                     : 'N/A',
//                 clockInLongitude: record.clockInLongitude || 'N/A',
//                 clockInLatitude: record.clockInLatitude || 'N/A',
//                 clockOutLongitude: record.clockOutLongitude || 'N/A',
//                 clockOutLatitude: record.clockOutLatitude || 'N/A',
//                 company_location_name: record.company_location_name || 'N/A',
//             }))
//         );


//         // Write CSV file
//         const csvWriter = createObjectCsvWriter({
//             path: 'attendance.csv',
//             header: [
//                 { id: 'user_name', title: 'Employee Name' },
//                 { id: 'status', title: 'Status' },
//                 { id: 'in_time', title: 'In Time' },
//                 { id: 'out_time', title: 'Out Time' },
//                 { id: 'month', title: 'Month' }, // Add Month to header
//                 { id: 'attendance_status', title: 'Attendance Status' },
//                 { id: 'clockInLongitude', title: 'Check-In Longitude' },
//                 { id: 'clockInLatitude', title: 'Check-In Latitude' },
//                 { id: 'clockOutLongitude', title: 'Check-Out Longitude' },
//                 { id: 'clockOutLatitude', title: 'Check-Out Latitude' },
//                 { id: 'company_location_name', title: 'Company/Location Name' }
//             ]
//         });

//         await csvWriter.writeRecords(csvData);

//         // Send the CSV file as a response
//         res.set({
//             'Content-Type': 'text/csv',
//             'Content-Disposition': 'attachment; filename="attendance.csv"'
//         });

//         res.download('attendance.csv', (err) => {
//             if (err) {
//                 console.error(err);
//                 res.status(500).send(err);
//             } else {
//                 fs.unlinkSync('attendance.csv'); // Delete the file after sending it
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };


const getTodayAttendance = async (req, res) => {
    try {
        // Specify the timezone (replace 'Asia/Kolkata' with your desired timezone)
        const timeZone = 'Asia/Kolkata';

        // Query to fetch today's attendance without timezone conversion
        const selectQuery = `
            SELECT attendances.*, users.name, users.employee_id
            FROM attendances 
            LEFT JOIN users ON users.id = attendances.user_id
            WHERE DATE(attendances.created_at) = CURDATE() 
            ORDER BY id DESC
        `;
        const queryResult = await db.query(selectQuery);

        // Check for query result
        if (queryResult.length > 0) {
            // Create an array to store formatted results
            const attendanceArray = queryResult.map((attendance) => {
                // Convert in_time and out_time to the specified timezone
                const in_time_local = attendance.in_time ? momentTz.utc(attendance.in_time).tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : null;
                const out_time_local = attendance.out_time ? momentTz.utc(attendance.out_time).tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : null;

                // Format the result
                return {
                    id: attendance.id,
                    status: attendance.status,
                    break_type: attendance.break_type,
                    leave_type: attendance.leave_type,
                    user_id: attendance.user_id,
                    in_time: attendance.in_time ? moment(attendance.in_time).format("YYYY-MM-DD HH:mm:ss") : null,
                    out_time: attendance.out_time ? moment(attendance.out_time).format("YYYY-MM-DD HH:mm:ss") : null,
                    attendance_type: attendance.attendance_type,
                    attendance_mark_by: attendance.attendance_mark_by,
                    attendance_mark_status: attendance.attendance_mark_status,
                    attendance_status: attendance.attendance_status,
                    note: attendance.note,
                    created_at: momentTz.utc(attendance.created_at).tz(timeZone).format("YYYY-MM-DD HH:mm:ss"),
                    updated_at: attendance.updated_at ? momentTz.utc(attendance.updated_at).tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : null,
                    clockInLongitude: attendance.clockInLongitude,
                    clockInLatitude: attendance.clockInLatitude,    
                    clockOutLongitude: attendance.clockOutLongitude,
                    clockOutLatitude: attendance.clockOutLatitude,
                    company_location_name: attendance.company_location_name,
                    device_info: attendance.device_info,
                    user_uuid: attendance.user_uuid,
                    captured_image: attendance.captured_image,
                    checkout_captured_image: attendance.checkout_captured_image,
                    name: attendance.name,
                    employee_id: attendance.employee_id,
                    status_label: attendance.attendance_status == 1
                        ? "A"
                        : attendance.attendance_status == 2
                            ? "P"
                            : attendance.attendance_status == 3
                                ? "H"
                                : "Unknown",
                };
            });

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: attendanceArray // Return the array of formatted records
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "No attendance records found for today"
            });
        }
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "An unexpected error occurred"
        });
    }
};

const downloadCsvFileForUsers = async (req, res) => {
    try {
        const createdById = req.user.user_id; // Assuming this is the logged-in user's ID
        const userType = req.user.user_type; // Assuming userType is passed in the request
        // const startDate = "2024-11-01";
        // const endDate = "2024-12-31";
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const formattedStartDate = `${startDate} 00:00:00`; // Full start timestamp
        const formattedEndDate = `${endDate} 23:59:59`;

        console.log('Step 1: Received request to generate attendance report for user ID:', createdById, 'and userType:', userType);

        let userIds = [];

        if (userType == 3) {
            console.log('Step 2: Fetching users created by user ID:', createdById);

            // Fetch users created by the current user
            const usersQuery = await db.query(
                `SELECT id, name FROM users WHERE created_by = ?`,
                [createdById]
            );
            console.log('Step 3: Fetched users:', usersQuery);

            if (usersQuery.length === 0) {
                console.log('No users found for user ID:', createdById);
                return res.status(404).json({ status: false, message: 'No users found created by the given user ID.' });
            }

            // Extract user IDs for attendance query
            userIds = usersQuery.map(user => user.id);
            console.log('Step 4: Extracted user IDs for attendance query:', userIds);
        } else {
            console.log('Step 2: Skipping user fetch as userType is not 3. Fetching attendance for the logged-in user only.');
            userIds = [createdById];
        }

        // Fetch attendance records for the users
        const attendancesQuery = await db.query(
            `SELECT attendances.*, users.name AS user_name 
             FROM attendances 
             LEFT JOIN users ON users.id = attendances.user_id 
             WHERE attendances.user_id IN (?) 
             AND attendances.in_time BETWEEN ? AND ?`,
            [userIds, formattedStartDate, formattedEndDate]
        );
        console.log(userIds, startDate, endDate)
        console.log('Step 5: Fetched attendance records:', attendancesQuery);


        if (attendancesQuery.length === 0) {
            console.log('No attendance records found for user IDs:', userIds);
            return res.status(404).json({ status: false, message: 'No attendance records found for the specified users in the current date range.' });
        }

        // Group attendance data by user
        const groupedData = userIds.map(userId => ({
            user_name: attendancesQuery.find(record => record.user_id === userId)?.user_name || 'N/A',
            attendances: attendancesQuery.filter(record => record.user_id === userId),
        }));

        console.log('Step 6: Grouped attendance data by user:', JSON.stringify(groupedData, null, 2));

        const csvData = groupedData.flatMap(group =>
            group.attendances.map(record => ({
                user_id: record.user_id || 'N/A',
                user_name: group.user_name || 'N/A',
                status:
                    record.status == "incomplete"
                        ? "checkIn"
                        : record.status == "complete"
                            ? 'checkIn/checkout'
                            : 'N/A',
                attendance_status:
                    record.attendance_status === '1'
                        ? 'A' // Present
                        : record.attendance_status === '2'
                            ? 'P' // Absent
                            : record.attendance_status === '3'
                                ? 'H' // Half-day
                                : 'N/A', // Default
                in_time: record.in_time
                    ? moment(record.in_time).format('YYYY-MM-DD HH:mm:ss')
                    : 'N/A',
                out_time: record.out_time
                    ? moment(record.out_time).format('YYYY-MM-DD HH:mm:ss')
                    : 'N/A',
                month: record.in_time
                    ? moment(record.in_time).format('MMMM') // Extract month name
                    : 'N/A',
                clockInLongitude: record.clockInLongitude || 'N/A',
                clockInLatitude: record.clockInLatitude || 'N/A',
                clockOutLongitude: record.clockOutLongitude || 'N/A',
                clockOutLatitude: record.clockOutLatitude || 'N/A',
                company_location_name: record.company_location_name || 'N/A',
            }))
        );


        const fileName = "attendance_report.csv";
        const uploadPath = path.join(process.cwd(), "public", "downloads");

        // Create the "downloads" directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Define the full file path
        const filePath = path.join(uploadPath, fileName);

        // Create CSV writer
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'user_name', title: 'Employee Name' },
                { id: 'status', title: 'Status' },
                { id: 'in_time', title: 'In Time' },
                { id: 'out_time', title: 'Out Time' },
                { id: 'month', title: 'Month' },
                { id: 'attendance_status', title: 'Attendance Status' },
                { id: 'clockInLongitude', title: 'Check-In Longitude' },
                { id: 'clockInLatitude', title: 'Check-In Latitude' },
                { id: 'clockOutLongitude', title: 'Check-Out Longitude' },
                { id: 'clockOutLatitude', title: 'Check-Out Latitude' },
                { id: 'company_location_name', title: 'Company/Location Name' },
            ]
        });

        // Write the CSV data to the file
        await csvWriter.writeRecords(csvData);
        console.log("CSV file written successfully to:", filePath);

        // Construct the URL to access the CSV file
        const fileUrl = `/downloads/${fileName}`;
        console.log("File URL:", fileUrl);

        // Send the file URL as a response
        return res.status(200).json({
            status: true,
            message: "CSV file generated successfully",
            fileUrl: fileUrl, // Provide the file URL
        });


    } catch (error) {
        console.error('Error generating CSV:', error);
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};



const downloadPdfFileForUsers = async (req, res) => {
    try {

        const createdById = 125;
        const userType = 3;

        console.log('Step 1: Received request to generate attendance report for user ID:', createdById, 'and userType:', userType);

        if (createdById) {
            // Initialize userIds and usersQuery
            let userIds = [createdById]; // Default to createdById for userType !== 3
            let usersQuery = [];

            if (userType === 3) {
                console.log('Step 2: Fetching users created by user ID:', createdById);

                // Fetch users created by the current user
                usersQuery = await db.query(
                    `SELECT id, name FROM users WHERE created_by = ?`,
                    [createdById]
                );
                console.log('Step 3: Fetched users:', usersQuery);

                if (usersQuery.length === 0) {
                    console.log('No users found for user ID:', createdById);
                    return res.status(404).json({ status: false, message: 'No users found created by the given user ID.' });
                }

                // Extract user IDs for attendance query
                userIds = usersQuery.map(user => user.id);
                console.log('Step 4: Extracted user IDs for attendance query:', userIds);
            } else {
                console.log('Step 2: Skipping user fetch as userType is not 3.');
            }

            // Fetch attendance records for the users
            const attendancesQuery = await db.query(
                `SELECT attendances.*, users.name AS user_name 
         FROM attendances 
         LEFT JOIN users ON users.id = attendances.user_id 
         WHERE attendances.user_id IN (?) 
         AND MONTH(attendances.in_time) = MONTH(CURRENT_DATE()) 
         AND YEAR(attendances.in_time) = YEAR(CURRENT_DATE())`,
                [userIds]
            );
            console.log('Step 5: Fetched attendance records:', attendancesQuery);

            if (attendancesQuery.length === 0) {
                console.log('No attendance records found for user IDs:', userIds);
                return res.status(404).json({ status: false, message: 'No attendance records found for the specified users in the current month.' });
            }

            // If userType !== 3, fetch the single user info for grouping
            if (userType !== 3) {
                usersQuery = await db.query(
                    `SELECT id, name FROM users WHERE id = ?`,
                    [createdById]
                );
            }

            // Group attendance data by user
            const groupedData = usersQuery.map(user => ({
                user_name: user.name,
                attendances: attendancesQuery.filter(record => record.user_id === user.id),
            }));

            console.log('Step 6: Grouped attendance data by user:', JSON.stringify(groupedData, null, 2));

            // Filter out users with empty attendance data
            const filteredData = groupedData.filter(group => group.attendances.length > 0);
            console.log('Step 7: Filtered attendance data:', JSON.stringify(filteredData, null, 2));

            // Generate HTML content for the PDF
            let htmlContent = `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            h1 { text-align: center; }
                            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                            th, td { padding: 10px; border: 1px solid #ddd; }
                            th { background-color: #f4f4f4; }
                        </style>
                    </head>
                    <body>
                        <h1>Attendance Report</h1>
            `;

            // Loop through filtered data and generate table for each user
            filteredData.forEach(group => {
                htmlContent += `
                    <h2>Employee Name:- ${capitalizeName(group.user_name)}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>In Time</th>
                                <th>Out Time</th>
                                <th>Check-In Longitude</th>
                                <th>Check-In Latitude</th>
                                <th>Check-Out Longitude</th>
                                <th>Check-Out Latitude</th>
                                <th>Company Location</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                group.attendances.forEach(attendance => {
                    htmlContent += `
                        <tr>
                            <td>${attendance.status || 'N/A'}</td>
                            <td>${formatTime(attendance.in_time)}</td>
                            <td>${formatTime(attendance.out_time)}</td>
                            <td>${attendance.clockInLongitude || 'N/A'}</td>
                            <td>${attendance.clockInLatitude || 'N/A'}</td>
                            <td>${attendance.clockOutLongitude || 'N/A'}</td>
                            <td>${attendance.clockOutLatitude || 'N/A'}</td>
                            <td>${attendance.company_location_name || 'N/A'}</td>
                        </tr>
                    `;
                });

                htmlContent += `</tbody></table>`;
            });

            htmlContent += `</body></html>`;
            console.log('Generated HTML content for PDF.');
            // Step 4: Generate PDF using Puppeteer
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            console.log('Step 7: Puppeteer browser launched.');

            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'load' });
            console.log('Step 8: Set HTML content in Puppeteer.');

            const pdfBuffer = await page.pdf({ format: 'A4' });
            console.log('Step 9: PDF generated. Buffer size:', pdfBuffer.length);

            if (!pdfBuffer || pdfBuffer.length === 0) {
                console.log('Error: PDF buffer is empty.');
                throw new Error('PDF buffer is empty. Ensure Puppeteer generated the PDF correctly.');
            }

            await browser.close();
            console.log('Step 10: Puppeteer browser closed.');

            // Step 5: Send PDF as a response with cache control
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.pdf"');
            console.log('Step 11: Sending PDF response...');
            res.write(pdfBuffer);
            res.end(); // End the response
        } else {
            console.log('Invalid user ID provided:', createdById);
            res.status(400).json({ status: false, message: 'Invalid user ID.' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ status: false, message: error.message });
    }
};

function capitalizeName(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function formatTime(dateTime) {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toTimeString().split(' ')[0]; // Extract only the time part (HH:MM:SS)
}

module.exports = {
    clockIn,
    clockOut,
    checkClockInToday,
    startBreak,
    endBreak,
    timeSheet,
    getAttendanceChartById,
    checkTodayMarkBreakAndAttendance,
    getMonthsTotalWorkHour,
    checkTotalUsersTimeSheet,
    checkTotalUsersTimeSheetNew,
    getAllUsersTodayClockIn,
    getAllUsersTodayClockOut,
    markUserClockInClockOutBySuperAdmin,
    createManuallyClockInClockOut,
    getTimeSheetOfAllUserForSuperAdmin,
    markAttendance,
    getAllUserTimeSheetInCalendarView,
    getSingleUserAttendanceTimeSheetInCalendarView,
    markAttendanceInBulk,
    getClockInStatus,
    getPastDaysAttendance,
    getPastDaysAttendanceUsers,
    downloadCsvFileForUsers,
    downloadPdfFileForUsers,
    getTodayAttendance
};
