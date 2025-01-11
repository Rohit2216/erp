require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger, pensionFormValidation} = require("../helpers/validation");
const { calculatePagination }  = require("../helpers/general")
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

const registerPensionForEmployee = async(req, res) => {

    try 
    {
        const {user_id, retirement_date, asset_recovery, pension_status, pension_amount, pension_duration, allow_commutation, commute_percentage, retirement_gratuity, service_gratuity} = req.body

        const {error} = pensionFormValidation.validate(req.body)
        if(error) return res.status(StatusCodes.OK).json({status: false, message: error.message})

        const insertQuery = `INSERT INTO  employee_retirements(user_id, retirement_date, asset_recovery, pension_status, pension_amount, pension_duration, allow_commutation, commute_percentage, retirement_gratuity, service_gratuity, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const createdBy = req.user.user_id
        const insertValues = [user_id, retirement_date, asset_recovery, pension_status, pension_amount, pension_duration, allow_commutation, commute_percentage, retirement_gratuity, service_gratuity, createdBy]

        const queryResult = await db.query(insertQuery, insertValues)
        
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "User registered for pension successfully"})
        }
        else
        {
            return res.status(StatusCodes.OK).json({status: false, message: "Error! User not registered for pension"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error});    
    }
}

// const getAllRegisteredPension = async(req, res) => {

//     try 
//     {
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1 ;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;

//         var searchDataCondition = '';
//         var queryParams = [pageFirstResult, pageSize];

//         if (searchData != null && searchData != '') {
//             searchDataCondition = ` WHERE users.name LIKE '%${searchData}%' OR employee_retirements.retirement_date LIKE '%${searchData}%' OR employee_retirements.asset_recovery LIKE '%${searchData}%' OR employee_retirements.pension_amount LIKE '%${searchData}%' OR employee_retirements.pension_duration LIKE '%${searchData}%' `;
//         }
//         const selectQuery = `SELECT employee_retirements.*, users.name FROM employee_retirements INNER JOIN users ON users.id=employee_retirements.user_id ${searchDataCondition} ORDER BY employee_retirements.id DESC LIMIT ?, ?`
//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString); 
        
//         const queryResult = await db.query(selectQuery, queryParams);
//         if(queryResult.length > process.env.VALUE_ZERO){
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
//             res.status(StatusCodes.OK).json({status: true, message:"Fetched successfully", data: queryResult, pageDetails: pageDetails })
//         }
//         else
//         {
//             res.status(StatusCodes.OK).json({status: false, message:"Data not found"})
//         }
//     } 
//     catch (error)
//     {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})
//     }
// }

const getAllRegisteredPension = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        const userId = req.user.user_id; // Current user's ID
        const userType = req.user.user_type; // Current user's type

        let searchDataCondition = '';
        let queryParams = [];

        // Restrict data based on userType
        if (userType != 3) {
            searchDataCondition = `WHERE employee_retirements.user_id = ?`;
            queryParams.push(userId);
        }

        // Add search conditions dynamically
        if (searchData) {
            const likeQuery = `%${searchData}%`;
            const condition = `
                ${searchDataCondition ? 'AND' : 'WHERE'}
                (users.name LIKE ? 
                OR employee_retirements.retirement_date LIKE ? 
                OR employee_retirements.asset_recovery LIKE ? 
                OR employee_retirements.pension_amount LIKE ? 
                OR employee_retirements.pension_duration LIKE ?)`;
            searchDataCondition += condition;
            queryParams.push(likeQuery, likeQuery, likeQuery, likeQuery, likeQuery);
        }

        queryParams.push(pageFirstResult, pageSize);

        // Main query
        const selectQuery = `
            SELECT employee_retirements.*, users.name 
            FROM employee_retirements 
            INNER JOIN users ON users.id = employee_retirements.user_id 
            ${searchDataCondition}
            ORDER BY employee_retirements.id DESC 
            LIMIT ?, ?
        `;

        // Count total records for pagination
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM employee_retirements 
            INNER JOIN users ON users.id = employee_retirements.user_id 
            ${searchDataCondition}
        `;

        const queryResult = await db.query(selectQuery, queryParams);
        const totalResult = await db.query(countQuery, queryParams.slice(0, queryParams.length - 2));

        if (queryResult.length > 0) {
            const pageDetails = await calculatePagination(totalResult[0].total, currentPage, pageSize);
            res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails,
            });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


const getRegisteredPensionById = async(req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        
        const selectQuery = `SELECT employee_retirements.*, users.name FROM employee_retirements INNER JOIN users ON users.id=employee_retirements.user_id WHERE employee_retirements.id = ?`

        const queryResult = await db.query(selectQuery, [id])

        if(queryResult.length > process.env.VALUE_ZERO) 
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult[0]})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message:"Data not found"})
        }
    } 
    catch (error) 
    {
        
    }
}

const updatePensionDetails = async(req, res) => {

    try 
    {
        
        const {user_id, retirement_date, asset_recovery, pension_status, pension_amount, pension_duration, allow_commutation, commute_percentage, retirement_gratuity, service_gratuity, id} = req.body

        const {error} = pensionFormValidation.validate(req.body)
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const updateQuery = `UPDATE employee_retirements SET user_id = ?, retirement_date  = ?, asset_recovery = ?, pension_status = ?, pension_amount = ?, pension_duration = ?, allow_commutation = ?, commute_percentage = ?, retirement_gratuity = ?, service_gratuity = ?, updated_at = ? WHERE id= ?`

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateValues = [user_id, retirement_date, asset_recovery, pension_status, pension_amount, pension_duration, allow_commutation, commute_percentage, retirement_gratuity, service_gratuity, updatedAt, id]

        const queryResult = await db.query(updateQuery, updateValues)

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Pension details updated successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Error! Pension details not updated"})
        }
        
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const deletePensionById = async(req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id})
        if (error) return res.status(StatusCodes.OK).json({status: false, message: error.message})
        
        const deleteQuery = `DELETE FROM employee_retirements WHERE id = ?`
        const queryResult = await db.query(deleteQuery, [id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Data deleted successfully"})
        }
        else
        {
            res.status(StatusCodes.OK).json({status: false, message: "Error! data not deleted"})
        }

    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})     
    }
}

module.exports = {registerPensionForEmployee, getAllRegisteredPension, getRegisteredPensionById, updatePensionDetails, deletePensionById}