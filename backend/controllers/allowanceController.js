require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const {getAppliedOnAllowanceEmployeeWise, getAppliedOnAllowanceDesignationWise, calculatePagination} = require('../helpers/general')

const createAllowances = async (req, res,) => {

    try {
        if (req.body.length > process.env.VALUE_ZERO) {
            const formData = req.body
            var submittedStatus = false;

            for (let index = 0; index < formData.length; index++) {
                const element = formData[index];
                const allowance_name = element.name
                const applied_type = element.applied_type
                const value_type = element.value_type
                const value = element.value
                const appliedOnFormat = JSON.stringify([{ applied_on: element.applied_on }])
                const createdBy = req.user.user_id;

                const validation = Joi.object({
                    name: Joi.string().required(),
                    applied_type: Joi.required(),
                    value_type: Joi.required(),
                    value: Joi.required(),
                    applied_on: Joi.required(),

                }).options({ allowUnknown: true })

                const { error } = validation.validate({ name: allowance_name, applied_type: applied_type, value_type: value_type, value: value, applied_on: appliedOnFormat })
                if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message })

                const insertQuery = `INSERT INTO allowances(name, applied_type, applied_on, value_type, value, created_by) VALUES(?, ?, ?, ?, ?, ?)`

                const insertValues = [allowance_name, applied_type, appliedOnFormat, value_type, value, createdBy]

                // Only insert if all keys have valid values
                if (allowance_name && applied_type && value_type && value && appliedOnFormat) {
                    const queryResult = await db.query(insertQuery, insertValues)

                    if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                        submittedStatus = true;
                    }
                    else {
                        submittedStatus = false;
                    }
                }
            }

            if (submittedStatus) {
                res.status(StatusCodes.OK).json({ status: true, message: "Allowance submitted successfully" })
            }
            else {
                res.status(StatusCodes.OK).json({ status: false, message: "Error! allowance not submitted" })
            }
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "Error! allowance not submitted" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getAllCreatedAllowances = async (req, res) => {

    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1 ;
        const searchData = req.query.search || '';

        const pageFirstResult = (currentPage - 1) * pageSize;
        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];
        if (searchData != null && searchData != ''){
            searchDataCondition = `WHERE name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT * FROM allowances ${searchDataCondition} ORDER BY id DESC LIMIT ?, ?`;
        const queryResult = await db.query(selectQuery, queryParams);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);    
        if (queryResult.length > process.env.VALUE_ZERO) 
        {   
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var values = [];
            let appliedType;
            let valueType;
            let valueWithSign;

            for(const row  of queryResult)
            {

                if(row.applied_type === '1')
                {
                    appliedType = 'Employee wise';
                    var appliedOn = await getAppliedOnAllowanceEmployeeWise(row.applied_on);
                }
                else
                {
                    appliedType = 'Designation wise';
                    var appliedOn = await getAppliedOnAllowanceDesignationWise(row.applied_on);
                }

                if(row.value_type === '1')
                {
                    valueType = 'Fixed amount,';
                    valueWithSign = "\u20B9"+row.value;
                }
                else
                {
                    valueType = 'Percentage of basic salary';
                    valueWithSign = row.value+"\u0025";
                }


                values.push({
                    id: row.id,
                    name: row.name,
                    applied_type: appliedType,
                    value_type: valueType,
                    value: valueWithSign,
                    created_by:   row.created_by,
                    created_at: moment(row.created_at).format(`DD-MM-YYYY`),
                    applied_on: appliedOn
                });
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails })
        }
        else 
        {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getSingleAllowancesDetails = async (req, res) => {

    try {

        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id: id});

        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message});

        const selectQuery = `SELECT * FROM allowances WHERE id = ?`
        const queryResult = await db.query(selectQuery, [id])

        if (queryResult.length > process.env.VALUE_ZERO) {
            const values = [];
            let appliedType;
            let valueType;
            let valueWithSign;

            for (const row of queryResult) {
                
                if(row.applied_type === '1')
                {
                    appliedType = 'Employee wise';
                    var appliedOn = await getAppliedOnAllowanceEmployeeWise(row.applied_on);
                }
                else
                {
                    appliedType = 'Designation wise';
                    var appliedOn = await getAppliedOnAllowanceDesignationWise(row.applied_on);
                }

                if(row.value_type === '1')
                {
                    valueType = 'Fixed amount';
                    valueWithSign = "\u20B9"+row.value;
                }
                else
                {
                    valueType = 'Percentage of basic salary';
                    valueWithSign = row.value+"\u0025";
                }

                values.push({
                    id: row.id,
                    name: row.name,
                    applied_type: appliedType,
                    value_type: valueType,
                    value: valueWithSign,
                    created_by:   row.created_by,
                    created_at: moment(row.created_at).format(`DD-MM-YYYY`),
                    applied_on: appliedOn
                });
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values[0] })
        }
        else {
            return request.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const updateAllowances = async (req, res) => {

    try {
        const { name, id } = req.body
        const validation = Joi.object({
            name: Joi.string().required()
        })
        const { error } = validation.validate({ name })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const updateQuery = `UPDATE allowances SET name=? WHERE id=?`
        const queryResult = await db.query(updateQuery, [name, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: false, message: "Allowances updated successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong,please try again later" })
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const deleteAllowance = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM allowances WHERE id = ?`
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ sttaus: false, message: "Allowance deleted successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ sttaus: false, message: "Allowance not deleted" })
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


module.exports = { createAllowances, getAllCreatedAllowances, updateAllowances, deleteAllowance, getSingleAllowancesDetails }