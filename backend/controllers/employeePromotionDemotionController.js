require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger} = require("../helpers/validation");
const { StatusCodes } = require('http-status-codes');
const { calculatePagination }  = require("../helpers/general")
const Joi = require('joi');

const employeeAddAction =  async(req, res) => {

    try 
    {
        const {user_id, purpose, reason, new_designation, new_team, change_in_salary, change_in_salary_type, change_in_salary_value}  = req.body
        
        const formValidation = Joi.object({
            user_id: Joi.number().required(),
            purpose: Joi.string().required(),
        })

        const {error} = formValidation.validate({user_id, purpose})
        if(error) return res.status(StatusCodes.OK).json({status: false, message: error.message})

        var storePath = ''
        if(req.files != null)
        {
            const image = req.files.document
            const imageName = Date.now()+image.name
            const uploadPath = process.cwd() +'/public/user_images/' + imageName
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, async(err, response) => {
                if(err) return res.status(HTTP_STATUS_CODES.OK).json({status: false, message: err.message})
            })
        }
        const insertQuery = `INSERT INTO employee_promotion_demotions(user_id, purpose, reason, new_designation, new_team, change_in_salary, change_in_salary_type, change_in_salary_value, document,created_by) VALUES(?,?,?,?,?,?,?,?,?,?)`

        const createdBy = req.user.user_id
        const insertValues = [user_id, purpose, reason, new_designation, new_team, change_in_salary, change_in_salary_type, change_in_salary_value, storePath, createdBy]

        const queryResult = await db.query(insertQuery, insertValues);

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message:"Employee " +purpose+ " added successfully"})
        }
        else
        {
            return res.status(StatusCodes.OK).json({status: false, message: "Error! Please try again later"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

// const getAllEmployeePromotionDemotion = async (req, res) => {

//     try 
//     {   
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1 ;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var searchDataCondition = '';
//         var queryParams = [pageFirstResult, pageSize];

//         if (searchData != null && searchData != '') 
//         {
//             searchDataCondition = `WHERE employee_promotion_demotions.purpose LIKE '%${searchData}%' OR employee_promotion_demotions.reason LIKE '%${searchData}%' OR users.name LIKE '%${searchData}%' OR roles.name LIKE '%${searchData}%' OR hr_teams.team_name LIKE '%${searchData}%'`;
//         }

//         const selectQuery = `SELECT employee_promotion_demotions.*, users.name as user_name, roles.name as role_name, hr_teams.team_name FROM employee_promotion_demotions INNER JOIN users ON users.id = employee_promotion_demotions.user_id INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation INNER JOIN hr_teams ON hr_teams.id = employee_promotion_demotions.new_team ${searchDataCondition} ORDER BY employee_promotion_demotions.id DESC LIMIT ?, ?`
        
//         const queryResult = await db.query(selectQuery, queryParams);
        
//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString); 
//         if(queryResult.length > process.env.VALUE_ZERO)
//         {           
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
//             res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails });
//         }
//         else
//         {
//             res.status(StatusCodes.OK).json({status: false, message: "Data not found"})
//         }
//     } 
//     catch (error) 
//     {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
//     }
// }


const getAllEmployeePromotionDemotion = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        const userId = req.user.user_id; // Current user's ID
        const userType = req.user.user_type; // Current user's type

        let searchDataCondition = '';
        let queryParams = [];

        if (userType != 3) {
            // Restrict data to the current user's records if userType is not admin
            searchDataCondition = `WHERE employee_promotion_demotions.user_id = ?`;
            queryParams.push(userId);
        }

        if (searchData) {
            // Add search filters if searchData is provided
            const likeQuery = `%${searchData}%`;
            const condition = `
                ${searchDataCondition ? 'AND' : 'WHERE'}
                (employee_promotion_demotions.purpose LIKE ? 
                OR employee_promotion_demotions.reason LIKE ? 
                OR users.name LIKE ? 
                OR roles.name LIKE ? 
                OR hr_teams.team_name LIKE ?)`;
            searchDataCondition += condition;
            queryParams.push(likeQuery, likeQuery, likeQuery, likeQuery, likeQuery);
        }

        queryParams.push(pageFirstResult, pageSize);

        const selectQuery = `
            SELECT employee_promotion_demotions.*, 
                   users.name as user_name, 
                   roles.name as role_name, 
                   hr_teams.team_name
            FROM employee_promotion_demotions
            INNER JOIN users ON users.id = employee_promotion_demotions.user_id
            INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation
            INNER JOIN hr_teams ON hr_teams.id = employee_promotion_demotions.new_team
            ${searchDataCondition}
            ORDER BY employee_promotion_demotions.id DESC
            LIMIT ?, ?
        `;

        const queryResult = await db.query(selectQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM employee_promotion_demotions
            INNER JOIN users ON users.id = employee_promotion_demotions.user_id
            INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation
            INNER JOIN hr_teams ON hr_teams.id = employee_promotion_demotions.new_team
            ${searchDataCondition}
        `;

        const totalResult = await db.query(countQuery, queryParams.slice(0, queryParams.length - 2));

        if (queryResult.length > 0) {
            const pageDetails = await calculatePagination(totalResult[0].total, currentPage, pageSize);
            res.status(200).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails
            });
        } else {
            res.status(200).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};


const getAllEmployeePromotionDemotionById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id});
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        
        const selectQuery = `SELECT employee_promotion_demotions.*, users.name as user_name, roles.name as role_name, hr_teams.team_name FROM employee_promotion_demotions INNER JOIN users ON users.id = employee_promotion_demotions.user_id INNER JOIN roles ON roles.id = employee_promotion_demotions.new_designation INNER JOIN hr_teams ON hr_teams.id = employee_promotion_demotions.new_team WHERE employee_promotion_demotions.id = ?`
        const queryResult = await db.query(selectQuery, [id])  
        
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult[0]});
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
        }
    }
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

const updateEmployeePromotionDemotionDetails = async (req, res) => {

    try 
    {
        const {user_id, purpose, reason, new_designation, new_team, change_in_salary, change_in_salary_type, change_in_salary_value, document, id}  = req.body
        
        const formValidation = Joi.object({
            user_id: Joi.number().required(),
            purpose: Joi.string().required(),
            id: Joi.number().integer().positive().required(),
        })

        const {error} = formValidation.validate({user_id, purpose, id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        var storePath = ''
        if(req.files != null)
        {
            const image = req.files.document
            const imageName = Date.now()+image.name
            const uploadPath = process.cwd() +'/public/user_images/' + imageName
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, async(err, response) => {
                if(err) return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({status: false, message: err.message})
            })
        }
        else
        {
            storePath = document
        }

        const updateQuery = `UPDATE employee_promotion_demotions SET user_id = ?, purpose = ?, reason = ?, new_designation = ?, new_team = ?, change_in_salary = ?, change_in_salary_type = ?, change_in_salary_value = ?, document = ?, updated_at = ? WHERE id = ?`

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const queryResult = await db.query(updateQuery, [user_id, purpose, reason, new_designation, new_team, change_in_salary, change_in_salary_type, change_in_salary_value, storePath, updatedAt, id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message:"Employee " +purpose+ " updated successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Error! Please try again later"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

module.exports = {employeeAddAction, getAllEmployeePromotionDemotion, getAllEmployeePromotionDemotionById, updateEmployeePromotionDemotionDetails}