require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger, resignationStatusValidation } = require("../helpers/validation");
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { Console } = require("console");

const registerResignation = async (req, res) => {

    try {
        const { user_id, resignation_date, last_working_day, reason } = req.body

        const formValidation = Joi.object({
            user_id: Joi.required(),
            resignation_date: Joi.date().required(),
            last_working_day: Joi.date().required(),
            reason: Joi.string().required()
        })

        const { error } = formValidation.validate({ user_id: user_id, resignation_date: resignation_date, last_working_day: last_working_day, reason: reason })

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message })

        const insertQuery = `INSERT INTO employee_resignations(user_id, resignation_date, last_working_day, reason, created_by) VALUES(?, ?, ?, ?, ?)`;

        const createdBy = req.user.user_id

        const queryResult = await db.query(insertQuery, [user_id, resignation_date, last_working_day, reason, createdBy])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Resignation submitted successfully" })
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! Resignation not submitted" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

// const getPendingResignationRequests = async (req, res) => {

//     try {

//         const selectQuery = `SELECT employee_resignations.*, users.name as user_name,users.image FROM employee_resignations LEFT JOIN users ON users.id = employee_resignations.user_id WHERE resignation_status = ?`
//         const queryResult = await db.query(selectQuery, [process.env.PENDING])
//         if (queryResult.length > process.env.VALUE_ZERO) {
//             res.status(StatusCodes.OK).json({ statusL: true, message: "Fetched successfully", data: queryResult })
//         }
//         else {
//             res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
//         }
//     }
//     catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

// const getApprovedResignationRequests = async (req, res) => {

//     try 
//     {
//         const selectQuery = `SELECT employee_resignations.*, users.name as user_name,users.image FROM employee_resignations INNER JOIN users ON users.id = employee_resignations.user_id WHERE resignation_status = ?`
//         const queryResult = await db.query(selectQuery, [process.env.APPROVED])   

//         if(queryResult.length > process.env.VALUE_ZERO)
//         {
//             res.status(StatusCodes.OK).json({statusL: true, message: "Fetched successfully", data: queryResult})
//         }
//         else
//         {
//             res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
//         }
//     } 
//     catch (error) 
//     {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
//     }
// }

const getPendingResignationRequests = async (req, res) => {
    try {
        const userId = req.user.user_id; // Current user's ID
        const userType = req.user.user_type; // Current user's type

        // Base query to fetch pending resignation requests
        let selectQuery = `SELECT employee_resignations.*, users.name as user_name, users.image 
                           FROM employee_resignations 
                           LEFT JOIN users ON users.id = employee_resignations.user_id 
                           WHERE resignation_status = ?`;

        // If user_type is not 3, filter by user_id
        if (userType != 3) {
            selectQuery += ` AND employee_resignations.user_id = ${userId}`;
        }

        const queryResult = await db.query(selectQuery, [process.env.PENDING]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getApprovedResignationRequests = async (req, res) => {
    try {
        const userId = req.user.user_id; // Current user's ID
        const userType = req.user.user_type; // Current user's type

        // Base query to fetch pending resignation requests
        let selectQuery = `SELECT employee_resignations.*, users.name as user_name, users.image 
                           FROM employee_resignations 
                           LEFT JOIN users ON users.id = employee_resignations.user_id 
                           WHERE resignation_status = ?`;

        // If user_type is not 3, filter by user_id
        if (userType != 3) {
            selectQuery += ` AND employee_resignations.user_id = ${userId}`;
        }

        const queryResult = await db.query(selectQuery, [process.env.APPROVED]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

// const getApprovedResignationRequests = async (req, res) => {
//     try {
//         const userId = req.user.user_id; // Current user's ID
//         const userType = req.user.user_type; // Current user's type

//         // Initialize query condition and parameters
//         let queryCondition = `WHERE resignation_status = ?`;
//         let queryParams = [process.env.APPROVED];

//         // Restrict data based on userType
//         if (userType != 3) { // If user is not admin
//             queryCondition += ` AND employee_resignations.user_id = ?`;
//             queryParams.push(userId);
//         }

//         // Main query with dynamic filtering
//         const selectQuery = `
//                 SELECT employee_resignations.*, users.name as user_name, users.image 
//                 FROM employee_resignations 
//                 INNER JOIN users ON users.id = employee_resignations.user_id 
//                 ${queryCondition}
//             `;

//         // Execute the query
//         const queryResult = await db.query(selectQuery, queryParams);

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Fetched successfully",
//                 data: queryResult,
//             });
//         } else {
//             res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };



const getRejectedResignationRequests = async (req, res) => {
    try {
        const userId = req.user.user_id; // Current user's ID
        const userType = req.user.user_type; // Current user's type

        // Base query to fetch pending resignation requests
        let selectQuery = `SELECT employee_resignations.*, users.name as user_name, users.image 
                           FROM employee_resignations 
                           LEFT JOIN users ON users.id = employee_resignations.user_id 
                           WHERE resignation_status = ?`;

        // If user_type is not 3, filter by user_id
        if (userType != 3) {
            selectQuery += ` AND employee_resignations.user_id = ${userId}`;
        }

        const queryResult = await db.query(selectQuery, [process.env.REJECTED]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}
// const getRejectedResignationRequests = async (req, res) => {

//     try {
//         const selectQuery = `SELECT employee_resignations.*, users.name as user_name,users.image FROM employee_resignations INNER JOIN users ON users.id = employee_resignations.user_id WHERE resignation_status = ?`
//         const queryResult = await db.query(selectQuery, [process.env.REJECTED])

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             res.status(StatusCodes.OK).json({ statusL: true, message: "Fetched successfully", data: queryResult })
//         }
//         else {
//             res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
//         }
//     }
//     catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

const getResignationDetailsById = async (req, res) => {

    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const selectQuery = `SELECT * FROM employee_resignations WHERE id = ?`
        const queryResult = await db.query(selectQuery, [id])

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ statusL: true, message: "Fetched successfully", data: queryResult[0] })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const updateResignationDetails = async (req, res) => {

    try {
        const { resignation_date, last_working_day, reason, id } = req.body;
        const formValidation = Joi.object({
            resignation_date: Joi.date().required(),
            last_working_day: Joi.date().required(),
            reason: Joi.string().required(),
            id: Joi.number().integer().positive().required(),
        })

        const { error } = formValidation.validate({ id: id, resignation_date: resignation_date, last_working_day: last_working_day, reason: reason })

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const updateQuery = `UPDATE employee_resignations SET resignation_date = ?, last_working_day = ?, reason = ?, updated_at = ? WHERE id = ?`

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const user_id = req.user.userId
        const queryResult = await db.query(updateQuery, [resignation_date, last_working_day, reason, updatedAt, id])


        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Resignation updated successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Resignation not updated" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const resignationRequestViewed = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const updateQuery = `UPDATE employee_resignations SET viewed_by = ?, viewed_at = ? WHERE id = ?`

        const viewedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const user_id = req.user.userId
        const queryResult = await db.query(updateQuery, [user_id, viewedAt, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Resignation request viewed successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Resignation not viewed" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const resignationStatusUpdateByAdmin = async (req, res) => {

    try {
        const id = req.params.id;
        const resignationStatus = req.params.status;
        const { error } = resignationStatusValidation.validate({ id: id, status: resignationStatus });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const updateQuery = `UPDATE employee_resignations SET resignation_status = ?, approved_by = ?, updated_by = ?, updated_at = ? WHERE id = ?`

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const user_id = req.user.userId
        const approvedBy = user_id
        const queryResult = await db.query(updateQuery, [resignationStatus, approvedBy, user_id, updatedAt, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Resignation request updated successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Resignation not updated" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const generateFnFStatement = async (req, res) => {

    try {

        const { user_id, remarks } = req.body

        const fnfValidation = Joi.object({
            user_id: Joi.number().required(),
            remarks: Joi.string().required(),

        }).options({ allowUnknown: true })

        const { error } = fnfValidation.validate(req.body)

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const insertQuery = `INSERT INTO fnf_statements(user_id, remarks, created_by) VALUES(?, ?, ?)`
        const insertValues = [user_id, remarks, req.user.user_id]

        const queryResult = await db.query(insertQuery, insertValues)

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fnf statements generated successfully" })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Fnf statements not generated" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

// const getFnfStatement = async (req, res) => {

//     try {
//         const selectQuery = `SELECT fnf_statements.*, users.name as user_name, users.image, admins.name as generated_by FROM fnf_statements INNER JOIN users ON users.id = fnf_statements.user_id INNER JOIN admins ON admins.id = fnf_statements.created_by`

//         const queryResult = await promisify(db.query)(selectQuery)

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult })
//         }
//         else {
//             res.status(StatusCodes.OK).json({ status: true, message: "Data not found" })
//         }
//     }
//     catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
//     }
// }


const getFnfStatement = async (req, res) => {
    try {
const userId = req.user.user_id;
const userType= req.user.user_type;
        // Check if the user_type is 3
        let selectQuery = `SELECT fnf_statements.*, users.name as user_name, users.image, admins.name as generated_by 
                            FROM fnf_statements 
                            INNER JOIN users ON users.id = fnf_statements.user_id 
                            INNER JOIN admins ON admins.id = fnf_statements.created_by`;

        // If user_type is not 3, add a condition to filter by user_id
        if (userType != 3) {
            selectQuery += ` WHERE fnf_statements.user_id = ${userId}`;
        }

        const queryResult = await promisify(db.query)(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            res.status(StatusCodes.OK).json({ status: true, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


module.exports = { registerResignation, getPendingResignationRequests, getApprovedResignationRequests, getRejectedResignationRequests, getResignationDetailsById, updateResignationDetails, resignationRequestViewed, resignationStatusUpdateByAdmin, generateFnFStatement, getFnfStatement }