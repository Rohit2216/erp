require('dotenv').config();
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const { invoiceSchema, checkPositiveInteger } = require('../helpers/validation');
var moment = require('moment');
const Joi = require('joi');
var {calculatePagination, getCreatedByDetails} = require('../helpers/general');
const {generateRandomNumber} = require('../helpers/commonHelper');

const createInvoiceNumberFormat = async (req, res) => {

    try {
        const {prefix, separation_symbol, financial_year_format, start_bill_number, financial_year} = req.body;

        const invoiceNumberFormatSchema = Joi.object({
            prefix: Joi.required(),
            financial_year_format: Joi.required(),
            start_bill_number: Joi.required(),
            financial_year: Joi.required(),
            separation_symbol: Joi.required(),
        });

        const {error} = invoiceNumberFormatSchema.validate(req.body);

        if(error)
        {
            return res
               .status(StatusCodes.BAD_REQUEST)
               .json({
                    status: false,
                    message: (error.message).replace("_", " ")
                });
        }

        // check that financial year already exists or not 
        const financialYearQueryResult = await db.query(`SELECT * FROM invoice_no_format WHERE financial_year = ?`, [financial_year]);
        if(financialYearQueryResult.length > process.env.VALUE_ZERO)
        {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: "That financial year "+financial_year+" already exists",
                });
        }

        const sample_format = prefix+separation_symbol+financial_year_format+separation_symbol+start_bill_number;
        const insertData = {
            prefix,
            separation_symbol,
            financial_year_format,
            start_bill_number,
            financial_year,
            sample_format,
            created_by: req.user.user_id
        };

        const queryResult = await db.query(`INSERT INTO invoice_no_format SET ?`, [insertData]);
        
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            return res
            .status(StatusCodes.OK)
            .json({
                status: true,
                message: "Invoice number format created successfully"
            });
        }
        else
        {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({
                    status: false,
                    message: "Error! Something went wrong creating the invoice number format."
                });
        }
    } catch (error) {
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error
            });
    }
}

const getAllGeneratedInvoiceFormat = async (req, res) => {

    try {

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ['financial_year', 'financial_year_format'];
        const searchConditions = [];
    
        if (searchData != null && searchData != '') {
            searchColumns.forEach((column) => {
            searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }
    
        const orderLimitQuery = `ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT * FROM invoice_no_format ${
            searchConditions.length > 0 ? `WHERE ${searchConditions.join(' OR ')} ` : ''
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        const modifiedQueryString = query.substring(0, query.indexOf('ORDER BY'));
        const totalResult = await db.query(modifiedQueryString);

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Invoice number format fetched successfully",
                    data: queryResult,
                    pageDetails: pageDetails
                })
        }
        else
        {
            return res
              .status(StatusCodes.OK)
              .json({
                    status: false,
                    message: "Data not found"
                });
        }
    } catch (error) {
        
        return res
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json({
                status: false,
                message: error
            });
    }
}

const getAllGeneratedInvoiceFormatById = async (req, res) => {

    try {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id});

        if(error)
        {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({
                    status: false,
                    message: error.message
                });
        }
        const queryResult = await db.query(`SELECT * FROM invoice_no_format WHERE id = ?`, [id]);

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Invoice number format fetched successfully",
                    data: queryResult[0]
                })
        }
        else
        {
            return res
              .status(StatusCodes.OK)
              .json({
                    status: false,
                    message: "No invoice number format found"
                });
        }
    } catch (error) {
        
        return res
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json({
                status: false,
                message: error
            });
    }
}

const updateInvoiceNumberFormat = async (req, res) => {

    try {
        const {prefix, separation_symbol, financial_year_format, start_bill_number, financial_year, id} = req.body;

        const invoiceNumberFormatSchema = Joi.object({
            prefix: Joi.required(),
            separation_symbol: Joi.required(),
            financial_year_format: Joi.required(),
            start_bill_number: Joi.required(),
            financial_year: Joi.required(),
            id: Joi.required(),
        });

        const {error} = invoiceNumberFormatSchema.validate(req.body);

        if(error)
        {
            return res
               .status(StatusCodes.BAD_REQUEST)
               .json({
                    status: false,
                    message: error.message
                });
        }

        const sample_format = prefix+separation_symbol+financial_year_format+separation_symbol+start_bill_number;
        const insertData = {
            prefix,
            separation_symbol,
            financial_year_format,
            start_bill_number,
            financial_year,
            sample_format,
        };

        // check financial year is already created or not
        const financialYearQueryResult = await db.query(`SELECT * FROM invoice_no_format`);
        if(financialYearQueryResult.length > process.env.VALUE_ZERO)
        {
            const result = financialYearQueryResult.filter(item => item.financial_year == financial_year);
            let checkValidFinancialYearForUpdate = false;

            if (result.length > process.env.VALUE_ZERO) {
                
                if(result[0].id == id)
                {
                    checkValidFinancialYearForUpdate = false;
                }
                else
                {
                    checkValidFinancialYearForUpdate = true;
                }
            }
            else
            {
                checkValidFinancialYearForUpdate = false;
            }
            
            if(checkValidFinancialYearForUpdate)
            {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({
                        status: false,
                        message: "That financial year "+financial_year+" already exists",
                    });
            }
        }

        const queryResult = await db.query(`UPDATE invoice_no_format SET ? WHERE id = ?`, [insertData, id]);
        
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            return res
            .status(StatusCodes.OK)
            .json({
                status: true,
                message: "Invoice number format updated successfully"
            });
        }
        else
        {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({
                    status: false,
                    message: "Error! Something went wrong creating the invoice number format."
                });
        }
    } catch (error) {
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

const deleteGeneratedInvoiceFormatById = async (req, res) => {

    try {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id});

        if(error)
        {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({
                    status: false,
                    message: error.message
                });
        }
        const queryResult = await db.query(`DELETE FROM invoice_no_format WHERE id = ?`, [id]);

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Invoice number format deleted successfully",
                    data: queryResult[0]
                })
        }
        else
        {
            return res
              .status(StatusCodes.OK)
              .json({
                    status: false,
                    message: "Error! something went wrong, please try again later",
                });
        }
    } catch (error) {
        
        return res
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json({
                status: false,
                message: error.message,
            });
    }
}

module.exports = {createInvoiceNumberFormat, getAllGeneratedInvoiceFormat, getAllGeneratedInvoiceFormatById, updateInvoiceNumberFormat, deleteGeneratedInvoiceFormatById}