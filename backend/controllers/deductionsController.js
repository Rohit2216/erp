require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const {getAppliedOnAllowanceEmployeeWise, getAppliedOnAllowanceDesignationWise, calculatePagination} = require('../helpers/general')

const createDeductionsType = async (req, res) => {

    try {

        const formData = req.body;
        var submittedStatus = false;

        if (formData.length > process.env.VALUE_ZERO) {
            for (let index = 0; index < formData.length; index++) {
                const element = formData[index];
                const name = element.name;
                const applied_type = element.applied_type;
                const appliedOnFormat = JSON.stringify([{ applied_on: element.applied_on }])
                const value_type = element.value_type;
                const by_employee = element.by_employee;
                const by_employer = element.by_employer;
                const createdBy = req.user.user_id;
                const value = by_employee

                const validation = Joi.object({
                    //type: Joi.required(),
                    name: Joi.string().required(),
                    applied_type: Joi.required(),
                    applied_on: Joi.required(),
                    value_type: Joi.required(),
                    by_employee: Joi.required(),
                    by_employer: Joi.required(),

                }).options({ allowUnknown: true })

                const { error } = validation.validate({ name: name, applied_type: applied_type, applied_on: appliedOnFormat, value_type: value_type, by_employee: by_employee, by_employer: by_employer })
                if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message })

                const insertQuery = `INSERT INTO deductions(name, applied_type, applied_on, value_type, value, by_employee, by_employer, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

                const insertValues = [name, applied_type, appliedOnFormat, value_type, value, by_employee, by_employer, createdBy];

                // Only insert if all keys have valid values
                if (name && applied_type && value_type && value && appliedOnFormat && by_employee && by_employer) {
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
                res.status(StatusCodes.OK).json({ status: true, message: "Deduction created successfully" })
            }
            else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Error! Deductions not created" })
            }
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! Deductions not created" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}


const getAllCreatedDeductionTypes = async (req, res) => {

    try {

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1 ;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != '') 
        {
            searchDataCondition = ` WHERE name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT * FROM deductions ${searchDataCondition} ORDER BY id DESC LIMIT ?, ?`
        const queryResult = await db.query(selectQuery, queryParams)
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);   
        if (queryResult.length > process.env.VALUE_ZERO) {
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
                    valueType = 'Fixed amount';
                    valueWithSign = "\u20B9"+row.value;
                }
                else if(row.value_type === '2')
                {
                    valueType = 'Percentage of basic salary';
                    valueWithSign = row.value+"\u0025";
                }
                else 
                {
                    valueType = 'Percentage of gross salary';
                    valueWithSign = row.value+"\u0025";
                }


                values.push({
                    id: row.id,
                    name: row.name,
                    applied_type: appliedType,
                    value_type: valueType,
                    value: valueWithSign,
                    created_by: row.created_by,
                    created_at: moment(row.created_at).format('DD-MM-YYYY'),
                    applied_on: appliedOn
                });
            }            
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails})
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const updateDeductionTypes = async (req, res) => {

    try {
        const { name, status, id } = req.body
        const validation = Joi.object({
            name: Joi.string().required(),
            status: Joi.number().required(),
            id: Joi.number().integer().positive().required()
        })

        const { error } = validation.validate(req.body)
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const updateQuery = `UPDATE deduction_types SET name = ?, status= ?, updated_at = ? WHERE id= ?`      
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const queryResult = await db.query(updateQuery, [name, status, updatedAt, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Deduction type updated successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Deduction type not updated" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const deleteDeductionTypes = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const deleteQuery = `DELETE FROM deduction_types WHERE id = ?`
        const queryResult = await db.query(deleteQuery, [id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: false, message: "Deduction types deleted successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Deduction types not deleted" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


module.exports = { createDeductionsType, getAllCreatedDeductionTypes, updateDeductionTypes, deleteDeductionTypes }