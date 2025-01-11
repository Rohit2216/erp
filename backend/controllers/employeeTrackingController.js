require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger} = require("../helpers/validation");
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

const trackEmployeeHistory = async(req, res) => {

    try {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id})

        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        
        const selectQuery = `SELECT trackings.*, users.name AS user_name FROM trackings INNER JOIN users ON users.id = trackings.user_id WHERE trackings.user_id = ?`

        const queryResult = await db.query(selectQuery, [id])

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult})
        }
        else
        {
            res.status(StatusCodes.OK).json({status: true, message: "History not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}


module.exports = {trackEmployeeHistory}