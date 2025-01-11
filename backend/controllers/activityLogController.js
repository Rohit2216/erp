require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { calculatePagination } = require("../helpers/general");
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

// const getAllActivityLog = async (req, res) => {

//     try {
//         var response = ''
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var searchDataCondition = '';

//         const userType = req.user.user_type;
//         const userId = req.user.user_id;

//         var queryParams = [pageFirstResult, pageSize];

//         if (searchData != null && searchData != '') {
//             searchDataCondition = `WHERE users.name LIKE '%${searchData}%' OR DATE_FORMAT(user_activity_logs.created_at, "%d-%m-%Y")  LIKE '%${searchData}%' OR user_activity_logs.action LIKE '%${searchData}%'`;
//         }

//         const selectQuery = `SELECT user_activity_logs.*, users.name as user_name, users.image, roles.name as role FROM user_activity_logs INNER JOIN users ON users.id=user_activity_logs.user_id INNER JOIN roles ON roles.id=user_activity_logs.role_id ${searchDataCondition} ORDER BY user_activity_logs.id DESC LIMIT ?, ?`
//         const queryResult = await db.query(selectQuery, queryParams);

//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);
//         if (queryResult.length > process.env.VALUE_ZERO) {
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
//             res.status(200).json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails })
//         }
//         else {
//             res.status(200).json({ status: false, message: "Data not found" })
//         }
//     }
//     catch (error) {
//         response = error
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
//     }
// }

const getAllActivityLog = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        const userType = req.user.user_type;
        const userId = req.user.user_id;

        let searchDataCondition = '';
        let additionalCondition = '';
        const queryParams = [pageFirstResult, pageSize];

        // Add search conditions
        if (searchData) {
            searchDataCondition = `AND (users.name LIKE '%${searchData}%' 
                                    OR DATE_FORMAT(user_activity_logs.created_at, "%d-%m-%Y") LIKE '%${searchData}%' 
                                    OR user_activity_logs.action LIKE '%${searchData}%')`;
        }

        // Restrict data visibility for non-admin users
        if (userType !== 3) {
            additionalCondition = `AND user_activity_logs.user_id = ${userId}`;
        }

        const selectQuery = `
            SELECT user_activity_logs.*, users.name as user_name, users.image, roles.name as role 
            FROM user_activity_logs 
            INNER JOIN users ON users.id = user_activity_logs.user_id 
            INNER JOIN roles ON roles.id = user_activity_logs.role_id 
            WHERE 1=1 ${additionalCondition} ${searchDataCondition} 
            ORDER BY user_activity_logs.id DESC 
            LIMIT ?, ?`;

        const queryResult = await db.query(selectQuery, queryParams);

        // Calculate total records for pagination
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM user_activity_logs 
            INNER JOIN users ON users.id = user_activity_logs.user_id 
            INNER JOIN roles ON roles.id = user_activity_logs.role_id 
            WHERE 1=1 ${additionalCondition} ${searchDataCondition}`;

        const totalResult = await db.query(countQuery);
        const totalRecords = totalResult[0].total;

        if (queryResult.length > 0) {
            const pageDetails = await calculatePagination(totalRecords, currentPage, pageSize);
            res.status(200).json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails });
        } else {
            res.status(200).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "An error occurred", error });
    }
};

const getActivityLogDetails = async (req, res) => {

    try {

        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id })

        if (error) return res.status(StatusCodes.OK).json({ Status: false, message: error.message })

        const selectQuery = `SELECT user_activity_logs.*, users.name as user_name, users.image, roles.name as role FROM user_activity_logs INNER JOIN users ON users.id=user_activity_logs.user_id INNER JOIN roles ON roles.id=user_activity_logs.role_id WHERE user_activity_logs.id = ?`

        const queryResult = await db.query(selectQuery, [id])

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Fetched successfully", data: queryResult[0] })
        }
        else {
            res.status(403).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

module.exports = { getAllActivityLog, getActivityLogDetails }