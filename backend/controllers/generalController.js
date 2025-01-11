const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require('http-status-codes');

/**
 * get all countries list
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const allCountries = async (req, res) => {

    try {
        const selectQuery =`SELECT * FROM countries`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > 0) {            
            res.status(StatusCodes.OK).json({ status: true, message: "successfull", data:queryResult })
        }else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! company not created", data:queryResult })
        }
    }catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

/**
 * get all status by country id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getStates = async (req, res) => {

    try {   
        const id = req.params.id;
        const selectQuery =`SELECT * FROM states WHERE country_id='${id}';`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {            
            res.status(StatusCodes.OK).json({ status: true, message: "successfull", data:queryResult })
        }else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! company not created", data:queryResult })
        }
    }catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

/**
 * get all cities by using states id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const allCities = async (req, res) => {
    try {   
        const id = req.params.id;
        const selectQuery =`SELECT * FROM cities WHERE state_id ='${id}';`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > 0) {            
            res.status(StatusCodes.OK).json({ status: true, message: "successfull", data:queryResult })
        }else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No record found", data:queryResult })
        }
    }catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

module.exports = { allCountries, getStates, allCities }