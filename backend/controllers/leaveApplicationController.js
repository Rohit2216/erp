require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger, leaveApplicationValidations } = require("../helpers/validation");
const { getDifferenceBetweenTwoDays } = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const requestIp = require('request-ip')
const { insertEmployeeActivityLog } = require("../helpers/activityLog");
const { insertNotifications } = require("../helpers/notifications");
const cron = require('node-cron');
const momentTz = require("moment-timezone");


// const applyLeave = async (req, res) => {

//     try 
//     {
//         const {leave_type_id, start_date, end_date, reason, user_id, status} = req.body;   
//         const {error} = leaveApplicationValidations.validate(req.body)
//         if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

//         var response = ''
//         var applicant_id = 0
//         if(user_id != null)
//         {

//             applicant_id =  user_id ;
//         }
//         else
//         {
//             applicant_id =  req.user.user_id
//         }

//         const createdBy = req.user.user_id;


//         const totalDays = await getDifferenceBetweenTwoDays(start_date, end_date)
//         const totalHours = (totalDays * 8);
//         var storePath = ''

//         if(req.files != null)
//         {
//             const image = req.files.image
//             const imageName = Date.now()+image.name
//             const uploadPath =  process.cwd() +'/public/leave_application/' + imageName;
//             storePath = '/leave_application/' + imageName;

//             image.mv(uploadPath, async(err, response) => {
//                 if(err) res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
//             })
//         }

//         const insertQuery = `INSERT INTO leave_applications(leave_type_id, start_date, end_date, total_hours, total_days, applicant_id, reason, supporting_documents, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

//         const queryResult = await db.query(insertQuery, [leave_type_id, start_date, end_date, totalHours, totalDays, applicant_id, reason, storePath, status, createdBy])

//         if(queryResult.affectedRows > process.env.VALUE_ZERO)
//         {
//             response = "Leave apply successfully"
//             res.status(StatusCodes.OK).json({status: true, message: response})

//              //notifications
//             const notificationData = [{
//                 userId: req.user.user_id, 
//                 roleId: req.user.user_type,
//                 title: "Leave Application",
//                 message: req.body.reason
//             }]
//             const notificationsSave = await insertNotifications(notificationData)
//         }
//         else
//         {
//             response = "Error! Leave not applied"
//             res.status(StatusCodes.FORBIDDEN).json({status: false, message: response})
//         }
//     } 
//     catch (error) 
//     {                                                                                                          
//         response = error
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: response})    
//     }

//     const logData = [{
//         userId: req.user.user_id, 
//         roleId: req.user.user_type,
//         timestamp: moment().unix(),
//         action: 'applyLeave method of leaveApplicationController ', 
//         ipAddress: requestIp.getClientIp(req), 
//         userAgent: req.useragent.source,
//         logResult: "response"
//     }]
//     const userActivityLog = await insertEmployeeActivityLog(logData)
// }

const applyLeave = async (req, res) => {
    try {
        const { leave_type_id, start_date, end_date, reason, user_id, paid_days, unpaid_days, leave_duration, requested_days } = req.body;
        const { error } = leaveApplicationValidations.validate(req.body);
        // const requested = parseInt(req.body.requested_days)
        // return console.log("req.body", requested)

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }

        var response = ''
        var applicant_id = 0;

        if (user_id != null) {
            applicant_id = user_id;
        } else {
            applicant_id = req.user.user_id;
        }

        const createdBy = req.user.user_id;

        const totalDays = await getDifferenceBetweenTwoDays(start_date, end_date);
        if (requested_days >= 0) {
            // const totalHours = totalDays * 8;
            let totalHours;
            if (requested_days == 0) {
                totalHours = 8;
            } else {
                totalHours = req.body.requested_days * 9
            }


            var storePath = '';

            if (req.files != null) {
                const image = req.files.image;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + '/public/leave_application/' + imageName;
                storePath = '/leave_application/' + imageName;

                image.mv(uploadPath, async (err, response) => {
                    if (err) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                    }
                });
            }

            const insertQuery = `INSERT INTO leave_applications SET leave_type_id = '${leave_type_id}', start_date = '${start_date}', end_date = '${end_date}', total_hours = ${totalHours}, total_days = ${requested_days}, applicant_id = '${applicant_id}', reason = '${reason}', supporting_documents = '${storePath}', created_by = '${createdBy}', leave_duration = '${leave_duration}', paid_days = '${paid_days}', unpaid_days = '${unpaid_days}'`;

            // return console.log("insert Query", insertQuery)
            const queryResult = await db.query(insertQuery)

            console.log("leave apply successfully")

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                response = "Leave apply successfully";
                res.status(StatusCodes.OK).json({ status: true, message: response });

                // Notifications
                const notificationData = [{
                    userId: req.user.user_id,
                    roleId: req.user.user_type,
                    title: "Leave Application",
                    message: req.body.reason,
                }];

                const notificationsSave = await insertNotifications(notificationData)
            } else {
                response = "Error! Leave not applied";
                res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: " Start date cannot be after the end date." })
        }
    } catch (error) {
        console.log("error", error)
        response = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    // Log user activity
    const logData = [{
        userId: req.user.user_id,
        roleId: req.user.user_type,
        timestamp: moment().unix(),
        action: 'applyLeave method of leaveApplicationController',
        ipAddress: requestIp.getClientIp(req),
        userAgent: req.useragent.source,
        logResult: "response",
    }];

    const userActivityLog = await insertEmployeeActivityLog(logData)
};

// const applyLeave = async (req, res) => {

//     try 
//     {
//         const {leave_type_id, start_date, end_date, reason} = req.body;   
//         const {error} = leaveApplicationValidations.validate(req.body)
//         if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

//         var response = ''
//         const createdBy = req.user.userId;
//         const applicant_id =  createdBy 

//         const totalDays = await getDifferenceBetweenTwoDays(start_date, end_date)
//         const totalHours = (totalDays * 8);
//         var storePath = ''

//         if(req.files != null)
//         {
//             const image = req.files.image
//             const imageName = Date.now()+image.name
//             const uploadPath =  process.cwd() +'/public/leave_application/' + imageName;
//             storePath = '/leave_application/' + imageName;

//             image.mv(uploadPath, async(err, response) => {
//                 if(err) res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
//             })
//         }

//         const insertQuery = `INSERT INTO leave_applications(leave_type_id, start_date, end_date, total_hours, total_days, applicant_id, reason, supporting_documents, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

//         const queryResult = await db.query(insertQuery, [leave_type_id, start_date, end_date, totalHours, totalDays, applicant_id, reason, storePath, createdBy])

//         if(queryResult.affectedRows > process.env.VALUE_ZERO)
//         {
//             response = "Leave apply successfully"
//             res.status(StatusCodes.OK).json({status: false, message: response})
//         }
//         else
//         {
//             response = "Error! Leave not applied"
//             res.status(StatusCodes.FORBIDDEN).json({status: false, message: response})
//         }
//     } 
//     catch (error) 
//     {
//         response = error.message
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: response})    
//     }

//     const logData = [{
//         userId: req.user.userId, 
//         roleId: req.user.roleId,
//         timestamp: moment().unix(),
//         action: 'applyLeave method of leaveApplicationController ', 
//         ipAddress: requestIp.getClientIp(req), 
//         userAgent: req.useragent.source,
//         logResult: response
//     }]
//     const userActivityLog = await insertEmployeeActivityLog(logData)
// }



// const getAllLeaveApplications = async (req, res) => {

//     try {
//         const id = req.params.id

//         const pageSize = req.query.pageSize || 10;
//         const currentPage = req.query.pageNo || 1;
//         const searchData = req.query.search || '';
//         var totalPages = process.env.VALUE_ZERO;
//         const countSelectQuery = `SELECT COUNT(*) as total FROM leave_applications`
//         constTotalLength = await db.query(countSelectQuery);
//         totalPages = Math.round((constTotalLength[0].total / pageSize));
//         const total = constTotalLength[0].total;
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var search_cond = "";
//         if (searchData != null && searchData != '') {
//             search_cond = ` WHERE leave_applications.reason LIKE '%${searchData}%' OR users.name LIKE '%${searchData}%'  OR leave_types.leave_type LIKE '%${searchData}%' OR leave_applications.status LIKE '%${searchData}%'`
//         }
//         var selectQuery = `SELECT leave_applications.*, leave_types.leave_type, users.name as applicant_name, users.image as user_image FROM leave_applications LEFT JOIN leave_types ON leave_types.id=leave_applications.leave_type_id LEFT JOIN users ON users.id=leave_applications.applicant_id ${search_cond} ORDER BY leave_applications.id DESC LIMIT ?, ?`;
//         var values = [pageFirstResult, +pageSize];
//         const queryResults = await db.query(selectQuery, values)


//         if (queryResults.length > process.env.VALUE_ZERO) {
//             var pageDetails = [];
//             pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total })

//             res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults, pageDetails: pageDetails[0] })
//         }
//         else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
//         }
//     }
//     catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
//     }
// }


const getAllLeaveApplications = async (req, res) => {
    try {
        const loggedUserId = req.user.user_id; // Logged-in user's ID
        const loggedUserType = req.user.user_type; // Logged-in user's type

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        let totalPages = 0;

        // Count total entries based on admin or user
        let countSelectQuery = `SELECT COUNT(*) as total FROM leave_applications`;
        let countParams = [];

        // If not admin, filter by applicant_id
        if (loggedUserType != 3) {
            countSelectQuery += ` WHERE leave_applications.applicant_id = ?`;
            countParams.push(loggedUserId);
        }

        // Execute count query
        const constTotalLength = await db.query(countSelectQuery, countParams);
        const total = constTotalLength[0].total;
        totalPages = Math.ceil(total / pageSize);

        const pageFirstResult = (currentPage - 1) * pageSize;

        // Build search conditions
        let searchCond = '';
        let searchParams = [];
        if (searchData) {
            searchCond = `
                ${loggedUserType == 3 ? 'WHERE' : 'AND'}
                (leave_applications.reason LIKE ? OR 
                users.name LIKE ? OR 
                leave_types.leave_type LIKE ? OR 
                leave_applications.status LIKE ?)`;
            searchParams = [`%${searchData}%`, `%${searchData}%`, `%${searchData}%`, `%${searchData}%`];
        }

        // Build the main query
        let selectQuery = `
            SELECT leave_applications.*, 
                   leave_types.leave_type, 
                   users.name as applicant_name, 
                   users.image as user_image 
            FROM leave_applications 
            LEFT JOIN leave_types ON leave_types.id = leave_applications.leave_type_id 
            LEFT JOIN users ON users.id = leave_applications.applicant_id 
            ${loggedUserType != 3 ? 'WHERE leave_applications.applicant_id = ?' : ''} 
            ${searchCond} 
            ORDER BY leave_applications.id DESC 
            LIMIT ?, ?`;

        // Prepare query parameters
        const queryParams = [
            ...(loggedUserType != 3 ? [loggedUserId] : []),
            ...searchParams,
            pageFirstResult,
            pageSize
        ];

        // Execute the main query
        const queryResults = await db.query(selectQuery, queryParams);

        if (queryResults.length > 0) {
            const pageDetails = { pageSize, currentPage, totalPages, total };
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults, pageDetails });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


// const getAllLeaveBalance = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const loggedUserId = req.user.user_id; // Logged-in user's ID
//         const loggedUserType = req.user.user_type; // Logged-in user's type

//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const currentYear = new Date().getFullYear(); // Current Year
//         const currentMonth = new Date().getMonth() + 1; // Current Month (1-based)

//         let totalPages = 0;

//         // Get the year and month filters from the request query, default to current year and month
//         const filterYear = parseInt(req.query.year) || currentYear;
//         const filterMonth = parseInt(req.query.month) || currentMonth;

//         // Count total entries based on admin or user
//         let countSelectQuery = `SELECT COUNT(*) as total FROM leave_applications 
//                                 WHERE YEAR(leave_applications.start_date) = ? 
//                                 AND MONTH(leave_applications.start_date) = ?`;
//         let countParams = [filterYear, filterMonth];

//         // If not admin, filter by applicant_id
//         if (loggedUserType != 3) {
//             countSelectQuery += ` AND leave_applications.applicant_id = ?`;
//             countParams.push(loggedUserId);
//         }

//         // Execute count query
//         const constTotalLength = await db.query(countSelectQuery, countParams);
//         const total = constTotalLength[0].total;
//         totalPages = Math.ceil(total / pageSize);

//         const pageFirstResult = (currentPage - 1) * pageSize;

//         // Build search conditions
//         let searchCond = '';
//         let searchParams = [];
//         if (searchData) {
//             searchCond = `
//                 ${loggedUserType == 3 ? 'WHERE' : 'AND'}
//                 (leave_applications.reason LIKE ? OR 
//                 users.name LIKE ? OR 
//                 leave_types.leave_type LIKE ? OR 
//                 leave_applications.status LIKE ?)`;
//             searchParams = [`%${searchData}%`, `%${searchData}%`, `%${searchData}%`, `%${searchData}%`];
//         }

//         // Build the main query
//         let selectQuery = `SELECT leave_applications.*, 
//                                   leave_types.leave_type, 
//                                   users.name as applicant_name, 
//                                   users.image as user_image 
//                            FROM leave_applications 
//                            LEFT JOIN leave_types ON leave_types.id = leave_applications.leave_type_id 
//                            LEFT JOIN users ON users.id = leave_applications.applicant_id 
//                            WHERE YEAR(leave_applications.start_date) = ? 
//                            AND MONTH(leave_applications.start_date) = ?`;

//         // Add user-specific filter if not an admin
//         if (loggedUserType != 3) {
//             selectQuery += ` AND leave_applications.applicant_id = ?`;
//         }

//         // Add search conditions if available
//         selectQuery += ` ${searchCond} ORDER BY leave_applications.id DESC LIMIT ?, ?`;

//         // Prepare query parameters
//         const queryParams = [
//             filterYear,
//             filterMonth,
//             ...(loggedUserType != 3 ? [loggedUserId] : []),
//             ...searchParams,
//             pageFirstResult,
//             pageSize
//         ];

//         // Execute the main query
//         const queryResults = await db.query(selectQuery, queryParams);

//         // Fetch totals for pending, approved, paid, and unpaid leaves
//         const totalLeaveStatusQuery = `
//             SELECT 
//                 SUM(CASE WHEN leave_applications.status = 'pending' THEN 1 ELSE 0 END) as pending_leaves,
//                 SUM(CASE WHEN leave_applications.status = 'approved' THEN 1 ELSE 0 END) as approved_leaves,
//                 SUM(CASE WHEN leave_applications.status = 'approved' AND leave_applications.paid_days > 0 THEN 1 ELSE 0 END) as paid_leaves,
//                 SUM(CASE WHEN leave_applications.status = 'approved' AND leave_applications.unpaid_days > 0 THEN 1 ELSE 0 END) as unpaid_leaves
//             FROM leave_applications
//             WHERE YEAR(leave_applications.start_date) = ? 
//             AND MONTH(leave_applications.start_date) = ?
//         `;

//         // Execute the status query
//         const leaveStatusResults = await db.query(totalLeaveStatusQuery, [filterYear, filterMonth]);

//         const leaveStatus = leaveStatusResults[0] || {};

//         // If there are results, send them
//         if (queryResults.length > 0) {
//             const pageDetails = { pageSize, currentPage, totalPages, total };
//             res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Fetched successfully",
//                 data: queryResults,
//                 pageDetails,
//                 leaveStatus: {
//                     pending_leaves: leaveStatus.pending_leaves || 0,
//                     approved_leaves: leaveStatus.approved_leaves || 0,
//                     paid_leaves: leaveStatus.paid_leaves || 0,
//                     unpaid_leaves: leaveStatus.unpaid_leaves || 0
//                 }
//             });
//         } else {
//             res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };
// const getAllLeaveBalance = async (req, res) => {
//     try {
//         const loggedUserId = req.user.user_id; // Logged-in user's ID
//         const loggedUserType = req.user.user_type; // Logged-in user's type

//         const currentYear = new Date().getFullYear(); // Current Year
//         const currentMonth = new Date().getMonth() + 1; // Current Month (1-based)

//         // Get the year and month filters from the request query, default to current year and month
//         const filterYear = parseInt(req.query.year) || currentYear;
//         const filterMonth = parseInt(req.query.month) || currentMonth;

//         // Query to get the leave status counts
//         let leaveStatusQuery = `
//         SELECT users.name as applicant_name, users.image as user_image ,
//             SUM(CASE WHEN leave_applications.status = 'pending' THEN 1 ELSE 0 END) as pending_leaves,
//             SUM(CASE WHEN leave_applications.status = 'approved' THEN 1 ELSE 0 END) as approved_leaves,
//             SUM(CASE WHEN leave_applications.status = 'approved' THEN leave_applications.paid_days ELSE 0 END) as paid_leaves,
//             SUM(CASE WHEN leave_applications.status = 'approved' THEN leave_applications.unpaid_days ELSE 0 END) as unpaid_leaves
//         FROM leave_applications LEFT JOIN users ON users.id = leave_applications.applicant_id 
//         WHERE YEAR(leave_applications.start_date) = ? 
//         AND MONTH(leave_applications.start_date) = ?
//     `;

//         // If not admin, filter by applicant_id
//         const params = [filterYear, filterMonth];
//         if (loggedUserType != 3) {
//             leaveStatusQuery += ` AND leave_applications.applicant_id = ?`;
//             params.push(loggedUserId);
//         }

//         // Execute the leave status query
//         const leaveStatusResults = await db.query(leaveStatusQuery, params);

//         const leaveStatus = leaveStatusResults[0] || {};

//         // Respond with leave status
//         res.status(StatusCodes.OK).json({
//             status: true,
//             message: "Leave status fetched successfully",
//             leaveStatus: {
//                 user_name: leaveStatus.applicant_name,
//                 user_image: leaveStatus.user_image,  
//                 pending_leaves: leaveStatus.pending_leaves || 0,
//                 approved_leaves: leaveStatus.approved_leaves || 0,
//                 paid_leaves: leaveStatus.paid_leaves || 0,
//                 unpaid_leaves: leaveStatus.unpaid_leaves || 0
//             }
//         });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


const getAllLeaveBalance = async (req, res) => {
    try {
        const loggedUserId = req.user.user_id; // Logged-in user's ID
        const loggedUserType = req.user.user_type; // Logged-in user's type

        const currentYear = req.query.year || new Date().getFullYear(); // Current Year 

        // Get the month filter from the request query, default to null
        const filterMonth = req.query.month ? parseInt(req.query.month) : null;

        // Query to get the leave status counts
        let leaveStatusQuery = `
        SELECT 
            users.name as applicant_name, 
            users.image as user_image,
            users.remaining_leaves,
            SUM(CASE WHEN leave_applications.status = 'pending' THEN 1 ELSE 0 END) as pending_leaves,
            SUM(CASE WHEN leave_applications.status = 'approved' THEN 1 ELSE 0 END) as approved_leaves,
            SUM(CASE WHEN leave_applications.status = 'approved' THEN leave_applications.paid_days ELSE 0 END) as paid_leaves,
            SUM(CASE WHEN leave_applications.status = 'approved' THEN leave_applications.unpaid_days ELSE 0 END) as unpaid_leaves
        FROM leave_applications 
        LEFT JOIN users ON users.id = leave_applications.applicant_id 
        WHERE YEAR(leave_applications.start_date) = ?
    `;

        const params = [currentYear];

        // If a specific month is provided, add it to the query
        if (filterMonth) {
            leaveStatusQuery += ` AND MONTH(leave_applications.start_date) = ?`;
            params.push(filterMonth);
        }

        // If not admin, filter by applicant_id
        if (loggedUserType != 3) {
            leaveStatusQuery += ` AND leave_applications.applicant_id = ?`;
            params.push(loggedUserId);
        }

        // Add GROUP BY to ensure proper aggregation
        leaveStatusQuery += `
        GROUP BY leave_applications.applicant_id, users.name, users.image
    `;

        // Execute the leave status query
        const leaveStatusResults = await db.query(leaveStatusQuery, params);

        // Map the results for admin or non-admin users
        const leaveStatuses = leaveStatusResults.map((leaveStatus) => ({
            user_name: leaveStatus.applicant_name || null,
            user_image: leaveStatus.user_image || null,
            pending_leaves: leaveStatus.pending_leaves || 0,
            approved_leaves: leaveStatus.approved_leaves || 0,
            paid_leaves: leaveStatus.paid_leaves || 0,
            unpaid_leaves: leaveStatus.unpaid_leaves || 0,
            remaining_leaves: leaveStatus.remaining_leaves || 0,
        }));

        // Respond with leave statuses
        res.status(StatusCodes.OK).json({
            status: true,
            message: "Leave statuses fetched successfully",
            leaveStatuses, // Return an array of leave statuses
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};



// const updateLeaveApplication = async (req, res) => {

//     try {
//         const { status, id } = req.body
//         const { error } = checkPositiveInteger.validate({ id })
//         if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

//         const selectQuery = await db.query(`Select * from leave_applications where id = ${id}`)

//         if (selectQuery.length > 0){
//             const users =  await db.query(`Select * from users where id = ${selectQuery[0].applicant_id}`)
//             const paid_days = users[0].remaining_leaves - selectQuery[0].paid_days;

//             const updatedLeaves =  await db.query(`Update users set remaining_leaves = ${paid_days} where id = '${selectQuery[0].applicant_id}'`)
//         }else {
//             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Leave not found" })
//         }


//         const updateQuery = `UPDATE leave_applications SET status = ? WHERE id = ?`
//         const queryResult = await db.query(updateQuery, [status, id])

//         if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//             res.status(StatusCodes.OK).json({ status: true, message: "Leave application status changed to " + status + " successfully" })
//         }
//         else {
//             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong, please try again later" })
//         }
//     }
//     catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
//     }
// }

// const updateLeaveApplication = async (req, res) => {
//     try {
//         const { status, id } = req.body;

//         // Validate the ID
//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) {
//             return res.status(StatusCodes.FORBIDDEN).json({
//                 status: false,
//                 message: error.message,
//             });
//         }

//         // Check if leave application exists
//         const selectQuery = await db.query(`SELECT * FROM leave_applications WHERE id = ?`, [id]);
//         if (selectQuery.length === 0) {
//             return res.status(StatusCodes.FORBIDDEN).json({
//                 status: false,
//                 message: "Leave application not found",
//             });
//         }

//         const leaveApplication = selectQuery[0];
//         console.log("leaveApplication", leaveApplication)
//         // Retrieve the user's remaining leaves
//         const usersQuery = await db.query(`SELECT * FROM users WHERE id = ?`, [leaveApplication.applicant_id]);
//         if (usersQuery.length === 0) {
//             return res.status(StatusCodes.FORBIDDEN).json({
//                 status: false,
//                 message: "Applicant not found",
//             });
//         }



//         const user = usersQuery[0];
//         const remainingLeaves = user.remaining_leaves;
//         const totalLeaveDays = leaveApplication.total_days;

//         console.log("testing ", remainingLeaves, totalLeaveDays)


//         let paidDays = 0;
//         let unpaidDays = 0;

//         if (status === "approved") {
//             // Calculate paid and unpaid days based on remaining leaves
//             if (remainingLeaves >= totalLeaveDays) {
//                 paidDays = totalLeaveDays;
//                 unpaidDays = 0;
//             } else {
//                 paidDays = remainingLeaves;
//                 unpaidDays = totalLeaveDays - remainingLeaves;
//             }

//             // Update user's remaining leaves
//             const updatedRemainingLeaves = remainingLeaves - paidDays;

//             await db.query(`update users set remaining_leaves = ? WHERE id = ?`, [
//                 updatedRemainingLeaves,
//                 leaveApplication.applicant_id,
//             ]);

//             // Update leave application for paid and unpaid days
//             await db.query(
//                 `UPDATE leave_applications SET paid_days = ?, unpaid_days = ? WHERE id = ?`,
//                 [paidDays, unpaidDays, id]
//             );
//         }

//         // Update leave application status
//         const updateQuery = `UPDATE leave_applications SET status = ? WHERE id = ?`;
//         const queryResult = await db.query(updateQuery, [status, id]);

//         if (queryResult.affectedRows > 0) {
//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: `Leave approved successfully.`,
//             });
//         } else {
//             return res.status(StatusCodes.FORBIDDEN).json({
//                 status: false,
//                 message: "Failed to update leave application status. Please try again later.",
//             });
//         }
//     } catch (error) {
//         console.error("Error in updateLeaveApplication:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "An error occurred. Please try again later.",
//         });
//     }
// };



const updateLeaveApplication = async (req, res) => {
    try {
        const { status, id } = req.body;

        // Validate the ID
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        // Check if leave application exists
        const selectQuery = await db.query(`SELECT * FROM leave_applications WHERE id = ?`, [id]);
        if (selectQuery.length === 0) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Leave application not found",
            });
        }

        const leaveApplication = selectQuery[0];
        const startDate = momentTz(leaveApplication.start_date)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD"); // Convert to 'YYYY-MM-DD'
        const endDate = momentTz(leaveApplication.end_date)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD");

        // Get only gazette holidays between the start and end dates
        const gazetteHolidays = await db.query(
            `SELECT holiday_date FROM holiday_lists WHERE holiday_date BETWEEN ? AND ?`,
            [startDate, endDate]
        );

        const holidayDates = gazetteHolidays.map((holiday) =>
            momentTz(holiday.holiday_date).tz("Asia/Kolkata").format("YYYY-MM-DD")
        );

        // Generate all leave dates and exclude holidays
        const leaveDates = [];
        let currentDate = momentTz(startDate).tz("Asia/Kolkata");
        const lastDate = momentTz(endDate).tz("Asia/Kolkata");

        while (currentDate.isSameOrBefore(lastDate)) {
            const formattedDate = currentDate.format("YYYY-MM-DD");
            if (!holidayDates.includes(formattedDate)) {
                leaveDates.push(formattedDate); // Only add non-holiday dates
            }
            currentDate.add(1, "day");
        }

        // Calculate total leave days excluding holidays
        const totalLeaveDays = leaveDates.length;
        // Retrieve the user's remaining leaves
        const usersQuery = await db.query(`SELECT * FROM users WHERE id = ?`, [leaveApplication.applicant_id]);
        if (usersQuery.length === 0) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Applicant not found",
            });
        }

        const user = usersQuery[0];
        const remainingLeaves = user.remaining_leaves;

        let paidDays = 0;
        let unpaidDays = 0;

        if (status === "approved") {
            // Calculate paid and unpaid days based on remaining leaves
            if (remainingLeaves >= totalLeaveDays) {
                paidDays = totalLeaveDays;
                unpaidDays = 0;
            } else {
                paidDays = remainingLeaves;
                unpaidDays = totalLeaveDays - remainingLeaves;
            }

            // Update user's remaining leaves
            const updatedRemainingLeaves = remainingLeaves - paidDays;
           
            await db.query(`UPDATE users SET remaining_leaves = ? WHERE id = ?`, [
                updatedRemainingLeaves,
                leaveApplication.applicant_id,
            ]);

            // Update leave application for paid and unpaid days
            await db.query(
                `UPDATE leave_applications SET paid_days = ?, unpaid_days = ? WHERE id = ?`,
                [paidDays, unpaidDays, id]
            );
        }
        
        // Update leave application status
        const updateQuery = `UPDATE leave_applications SET status = ? WHERE id = ?`;
        const queryResult = await db.query(updateQuery, [status, id]);

        if (queryResult.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: `Leave approved successfully.`,
            });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Failed to update leave application status. Please try again later.",
            });
        }
    } catch (error) {
        console.error("Error in updateLeaveApplication:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "An error occurred. Please try again later.",
        });
    }
};



const getSingleLeaveApplication = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const selectQuery = `SELECT leave_applications.*, leave_types.leave_type, users.name as applicant_name, users.image as user_image, users.mobile as phone, users.email FROM leave_applications INNER JOIN leave_types ON leave_types.id=leave_applications.leave_type_id INNER JOIN users ON users.id=leave_applications.applicant_id WHERE leave_applications.id = ?;`
        const queryResults = await db.query(selectQuery, [id])

        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults[0] })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const leaveApplicationSoftDelete = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const deleteQuery = `UPDATE leave_applications SET deleted = ? WHERE id = ?`
        const queryResult = await db.query(deleteQuery, [1, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Leave application deleted successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong, please try again later" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}




const getCountLeaves = async (req, res) => {
    try {

        const userId = req.user.user_id;

        // Query to count leaves by status for the current year
        const selectQuery = `
            SELECT
                COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_count,
                COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejected_count,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count
            FROM leave_applications
            WHERE applicant_id = ? 
              AND YEAR(created_at) = YEAR(CURDATE())
        `;

        const [queryResult] = await db.query(selectQuery, [userId]);

        // Check for query result
        if (queryResult) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Leave count fetched successfully",
                data: queryResult
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "No leave records found"
            });
        }
    } catch (error) {
        console.error("Error fetching leave counts:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "An unexpected error occurred"
        });
    }
};



// cron.schedule("*/2 * * * *", async () => {
//     try {
//         const users = await db.query(`select users.*, locations.assign_leave from users left join locations on users.locationId = locations.id where users.is_deleted = 1`)

//         for (const row of users ){
//             const countTotalLeaves =  users.remaining_leaves + users.assign_leave;

//             const update  = await db.query(`update users set remaining_leaves = ${countTotalLeaves} where id = ${users.id}`)
//         }



//     } catch (error) {
//         console.error("Error fetching leave counts:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "An unexpected error occurred"
//         });
//     }
// });

cron.schedule("0 0 1 * *", async () => {
    try {
        // Fetch users and their assigned leaves
        const users = await db.query(`
           select users.*, locations.assign_leave from users left join locations on users.locationId = locations.id;
        `);


        // Check if users is an array before iterating
        if (Array.isArray(users)) {
            for (const row of users) {
                const countTotalLeaves = row.remaining_leaves + row.assign_leave;

                // Update remaining leaves for each user
                await db.query(`
                    UPDATE users 
                    SET remaining_leaves = ? 
                    WHERE id = ?
                `, [countTotalLeaves, row.id]);

                console.log(`Updated user ${row.id}: Remaining leaves = ${countTotalLeaves}`);
            }
        } else {
            console.log("No users to update.");
        }
    } catch (error) {
        console.error("Error fetching leave counts:", error);
    }
});

// cron.schedule("0 0 1 * *", async () => { // This runs on the 1st day of every month at midnight (12:00 AM)
//     try {
//         // Fetch users and their assigned leaves
//         const [users] = await db.query(`
//             SELECT users.*, locations.assign_leave 
//             FROM users 
//             LEFT JOIN locations ON users.locationId = locations.id
//         `);

//         console.log("users", users);

//         // Check if users is an array before iterating
//         if (Array.isArray(users)) {
//             for (const row of users) {
//                 const countTotalLeaves = row.remaining_leaves + row.assign_leave;

//                 // Update remaining leaves for each user
//                 await db.query(`
//                     UPDATE users 
//                     SET remaining_leaves = ? 
//                     WHERE id = ?
//                 `, [countTotalLeaves, row.id]);

//                 console.log(`Updated user ${row.id}: Remaining leaves = ${countTotalLeaves}`);
//             }
//         } else {
//             console.log("No users to update.");
//         }
//     } catch (error) {
//         console.error("Error fetching leave counts:", error);
//     }
// });

module.exports = { applyLeave, getAllLeaveApplications, updateLeaveApplication, getSingleLeaveApplication, leaveApplicationSoftDelete, getCountLeaves, getAllLeaveBalance }