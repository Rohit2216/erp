var moment = require('moment');
require('dotenv').config();
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { holidayListValidation, checkPositiveInteger } = require('../helpers/validation');
const { calculatePagination, generateRandomAlphanumeric } = require('../helpers/general');

const createHolidayList = async (req, res) => {

    try {

        const { holiday_name, holiday_date } = req.body;

        const { error } = holidayListValidation.validate(req.body);

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        insertData = {
            holiday_name,
            holiday_date,
            created_by: req.user.user_id,
        }

        const queryResult = await db.query('INSERT INTO holiday_lists SET ?', [insertData]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Holiday list saved successfully"
                });
        }
        else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: "Error! something went wrong, please try again later"
                });
        }

    }
    catch (error) {

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

// const getAllHolidayList = async (req, res) => {

//     try {

//         const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         const searchColumns = ['holiday_name', 'holiday_date', 'holiday_type'];
//         const searchConditions = [];
//         const dateFilter = req.query.year;


//         return console.log(dateFilter)

//         if (searchData != null && searchData != '') {
//             searchColumns.forEach((column) => {
//                 searchConditions.push(`${column} LIKE '%${searchData}%'`);
//             });
//         }

//         const orderLimitQuery = `ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
//         const query = `SELECT * FROM holiday_lists ${searchConditions.length > 0 ? `WHERE ${searchConditions.join(' OR ')} ` : ''
//             } ${orderLimitQuery}`;

//         const queryResult = await db.query(query);
//         console.log(queryResult);
//         // remove order by limit for totaL PAGINATION COUNT
//         const modifiedQueryString = query.substring(0, query.indexOf('ORDER BY'));
//         const totalResult = await db.query(modifiedQueryString);

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             var finalData = [];
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//             for (const row of queryResult) {

//                 finalData.push({
//                     id: row.id,
//                     holiday_name: row.holiday_name,
//                     holiday_date: moment(row.holiday_date).format('YYYY-MM-DD'),
//                 });
//             }

//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Fetched successfully",
//                     data: finalData,
//                     pageDetails: pageDetails
//                 });
//         }
//         else {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Data not found",
//                 });
//         }

//     }
//     catch (error) {

//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: error.message
//             });
//     }
// }


const getAllHolidayList = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 20;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ['holiday_name', 'holiday_date'];
        const searchConditions = [];
        const dateFilter = req.query.year || new Date().getFullYear(); // Default to current year if not provided
        // Construct search conditions for filtering
        if (searchData) {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        // Year filter condition
        searchConditions.push(`YEAR(holiday_date) = ${dateFilter}`);

        // Build query with optional WHERE clause for search and date filter, then paginate
        const whereClause = searchConditions.length > 0 ? `WHERE ${searchConditions.join(' AND ')}` : '';
        const orderLimitQuery = `ORDER BY holiday_date ASC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT * FROM holiday_lists ${whereClause} ${orderLimitQuery}`;

        // Execute main query for pagination
        const queryResult = await db.query(query);

        // Count total results for pagination
        const modifiedQueryString = query.substring(0, query.indexOf('ORDER BY'));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            const finalData = [];
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            queryResult.forEach((row) => {
                finalData.push({
                    id: row.id,
                    holiday_name: row.holiday_name,
                    holiday_date: moment(row.holiday_date).format('YYYY-MM-DD'),
                });
            });

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                pageDetails: pageDetails
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data not found",
            });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
};


const getHolidayDetailById = async (req, res) => {

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

        const query = `SELECT * FROM holiday_lists WHERE id = ?`;

        const queryResult = await db.query(query, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {

                finalData.push({
                    id: row.id,
                    holiday_name: row.holiday_name,
                    holiday_date: row.holiday_date,
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: finalData[0],
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Data not found",
                });
        }

    }
    catch (error) {

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

const updateHolidayList = async (req, res) => {

    try {

        const { holiday_name, holiday_date, id } = req.body;

        const { error } = holidayListValidation.validate(req.body);

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        updateData = {
            holiday_name,
            holiday_date,
            updated_by: req.user.user_id,
            updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        }

        const queryResult = await db.query('UPDATE holiday_lists SET ? WHERE id = ?', [updateData, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Holiday list updated successfully"
                });
        }
        else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: "Error! something went wrong, please try again later"
                });
        }

    }
    catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

const getUpcomingHolidays = async (req, res) => {
    try {
        const currentDate = new Date(); // Get the current date

        // Query to fetch the next two upcoming holidays
        const query = `
            SELECT id, holiday_name, holiday_date 
            FROM holiday_lists 
            WHERE holiday_date > ?
            ORDER BY holiday_date ASC
            LIMIT 2
        `;

        // Execute query with the current date as the filter
        const queryResult = await db.query(query, [currentDate]);

        if (queryResult.length > 0) {
            // Format data with holiday date in 'YYYY-MM-DD' format
            const formattedResult = queryResult.map((row) => ({
                id: row.id,
                holiday_name: row.holiday_name,
                holiday_date: moment(row.holiday_date).format('YYYY-MM-DD'),
            }));

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Upcoming holidays fetched successfully",
                data: formattedResult
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "No upcoming holidays found",
                data: []
            });
        }

    } catch (error) {
        console.error("Error fetching upcoming holidays:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
};


const deleteHolidayList = async (req, res) => {

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

        const query = `DELETE FROM holiday_lists WHERE id = ?`;

        const queryResult = await db.query(query, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Holiday list deleted successfully",
                });
        }
        else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: "Error! something went wrong, please try again later",
                });
        }

    }
    catch (error) {

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}


const getHolidayListOfMonth = async (req, res) => {

    try {
        const yearMonth = req.query.year_month || moment(new Date()).format('YYYY-MM');

        const queryResult = await db.query(`SELECT id, holiday_name, holiday_date FROM holiday_lists WHERE DATE_FORMAT(holiday_date, '%Y-%m') = ?`, [yearMonth])

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    holiday_name: row.holiday_name,
                    holiday_date: moment(row.holiday_date).format('DD-MM-YYYY'),
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: finalData
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Data not found",
                });
        }

    }
    catch (error) {

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message,
            });
    }
}

const getTodayBirthdayList = async (req, res) => {

    try {

        const today_date = moment(new Date()).format('YYYY-MM-DD');
        const queryResult = await db.query(`SELECT id, name, image FROM users WHERE DATE_FORMAT(dob, '%Y-%m-%d') = '${today_date}' AND is_deleted != '1'`);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: queryResult
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Birthday not found",
                })
        }
    }
    catch (error) {

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

module.exports = { createHolidayList, getAllHolidayList, getHolidayDetailById, updateHolidayList, deleteHolidayList, getHolidayListOfMonth, getTodayBirthdayList, getUpcomingHolidays }