require("dotenv").config();
const { con, makeDb } = require("../db");
const Joi = require("joi");
const { checkPositiveInteger } = require("../helpers/validation");
const db = makeDb();
var moment = require('moment');
const { StatusCodes } = require('http-status-codes');


const createRegionalOffice = async (req, res) => {

    try {
        const { energy_company_id, zone_id, regional_office_name, code, address_1, regional_status } = req.body;

        const JoiSchema = Joi.object({
            zone_id: Joi.number().required(),
            regional_office_name: Joi.string().required(),
            address_1: Joi.string().required()
        }).options({ allowUnknown: true });

        const { error, value } = JoiSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }

        const isCodeUnique = await checkCodeForRo(code)
        if (isCodeUnique == false) {
            return res.status(400).json({ status: false, message: "code should be unique." });
        }

        const createdBy = req.user.user_id;
        const insertQuery = `INSERT INTO regional_offices (energy_company_id, zone_id, regional_office_name, code, address_1, status, created_by) VALUES ('${energy_company_id}', '${zone_id}','${regional_office_name}', '${code}', '${address_1}', '${regional_status}', '${createdBy}')`;
        db.query(insertQuery, async (err, result) => {

            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Regional office created successfully." });
            }
            else {
                res.status(400).json({ status: false, message: "Something went wrong, please try after sometime." });
            }
        })
    }
    catch (error) {
        return res.status(400).json({ status: false, message: error });
    }
}

async function checkCodeForRo(code) {
    try {
        const selectQuery = await db.query(`select * from regional_offices where code = ${code}`)
        if (selectQuery.length > 0) {
            return false
        }
        return true;
    } catch (error) {
        return error.message;
    }
}

const getAllRegionalOffices = async (req, res) => {

    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(regional_offices.id) as total FROM regional_offices INNER JOIN zones ON zones.zone_id = regional_offices.zone_id INNER JOIN energy_companies ON energy_companies.id=regional_offices.energy_company_id`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        if (searchData != null && searchData != '') {
            var selectQuery = `SELECT regional_offices.id as ro_id, regional_offices.regional_office_name, regional_offices.code, regional_offices.address_1, regional_offices.status, zones.zone_id as zone_id, zones.zone_name, energy_companies.name as ec_name, regional_offices.energy_company_id FROM regional_offices INNER JOIN zones ON zones.zone_id = regional_offices.zone_id INNER JOIN energy_companies ON energy_companies.id=regional_offices.energy_company_id WHERE regional_offices.regional_office_name LIKE '%${searchData}%' ORDER BY regional_offices.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }
        else {
            var selectQuery = `SELECT regional_offices.id as ro_id, regional_offices.regional_office_name, regional_offices.code, regional_offices.address_1, regional_offices.status, zones.zone_id as zone_id, zones.zone_name, energy_companies.name as ec_name, regional_offices.energy_company_id FROM regional_offices INNER JOIN zones ON zones.zone_id = regional_offices.zone_id INNER JOIN energy_companies ON energy_companies.id=regional_offices.energy_company_id ORDER BY regional_offices.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total, pageStartResult, pageEndResult })

                res.status(200).json({ status: true, message: "Regional offices fetched successfully.", data: result, pageDetails: pageDetails[0] });
            }
            else {
                res.status(200).json({ status: false, message: "Data not found" });
            }
        })

    }
    catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}


const getRegionalOfficeById = async (req, res) => {

    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM regional_offices WHERE id = '${id}'`;
        db.query(selectQuery, async (err, result) => {

            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Regional office fetched successfully.", data: result });
            }
            else {
                return res.status(400).json({ status: false, message: "Data not found." });

            }
        })
    }
    catch (error) {
        return res.status(400).json({ status: false, message: error });
    }
}

const getActiveRegionalOffices = async (req, res) => {

    try {
        const activeStatus = process.env.ACTIVE_STATUS;
        const selectQuery = `SELECT * FROM regional_offices WHERE status = '${activeStatus}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Regional offices fetched successfully.", data: result });
            }
            else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try after sometime." });
            }
        })
    }
    catch (error) {
        return res.status(400).json({ status: false, message: error });

    }
}

const editRegionalOffice = async (req, res) => {

    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM regional_offices WHERE id = '${id}'`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Regional office fetched successfully.", data: result[0] });
            }
            else {
                return res.status(400).json({ status: false, message: "Data not found." });
            }
        })
    }
    catch (error) {
        return res.status(400).json({ status: false, message: error });

    }
}

const updateRegionalOffice = async (req, res) => {

    try {
        const { regional_id, energy_company_id, zone_id, regional_office_name, address_1, regional_status, code } = req.body;
        const JoiSchema = Joi.object({
            regional_id: Joi.number().required(),
            zone_id: Joi.number().required(),
            regional_office_name: Joi.string().required(),
            zone_id: Joi.number().required(),
            address_1: Joi.string().required()
        }).options({ allowUnknown: true });

        const { error, value } = JoiSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }

        
        const id = regional_id;
        const updatedTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const updateQuery = `UPDATE regional_offices SET energy_company_id='${energy_company_id}', zone_id = '${zone_id}', regional_office_name = '${regional_office_name}', address_1 = '${address_1}', status = '${regional_status}', updated_at='${updatedTime}', code='${code}' WHERE id = '${id}'`
        // res.status(200).json({status: true, data:updateQuery})
        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Regional office updated successfully." });
            }
            else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try after sometime." });
            }
        })
    }
    catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const deleteRegionalOffice = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteQuery = `DELETE FROM regional_offices WHERE id = '${id}'`;

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Regional office deleted successfully.", data: result });
            }
            else {
                return res.status(400).json({ status: false, message: "Data not found." });
            }
        })
    }
    catch (error) {
        return res.status(400).json({ status: false, message: error });

    }
}


const getRegionalOfficesOnZoneId = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id: id })
        if (error) return res.status(403).json({ status: false, message: error.message })

        const getRegionalOfficesOnZoneIdQuery = `SELECT zones.zone_id, zones.zone_name, regional_offices.id as ro_id, regional_offices.regional_office_name FROM zones INNER JOIN regional_offices ON regional_offices.zone_id=zones.zone_id WHERE regional_offices.zone_id='${id}'`
        db.query(getRegionalOfficesOnZoneIdQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Regional offices fetched successfully.", data: result });
            }
            else {
                return res.status(400).json({ status: false, message: "Regional office not found for that zone" });
            }
        })
    }
    catch (error) {
        return res.status(400).json({ status: false, message: error.message })
    }
}

const getAllRegionalOfficeForDropdown = async (req, res) => {

    try {
        const query = `SELECT id, regional_office_name FROM regional_offices`;
        const queryResult = await db.query(query);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetch successfully",
                    data: queryResult
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Data not found",
                })
        }
    }
    catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            })
    }
}

const getRegionalOfficersOnRo = async (req, res) => {

    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const queryResult = await db.query(`SELECT id, name, image, employee_id FROM users WHERE regional_id = ?`, [id]);


        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Data Fetched successfully",
                    data: queryResult
                });
        }
        else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: "Officers Not Found for that Regional office"
                });
        }
    }
    catch (error) {

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

const getAllRegionalOfficers = async (req, res) => {
    try {

        const queryResult = await db.query(`SELECT id, name, image, employee_id FROM users WHERE regional_id > 0 AND regional_id IS NOT NULL`);


        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Data Fetched successfully",
                    data: queryResult
                });
        }
        else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: "Officers Not Found for that Regional office"
                });
        }
    }
    catch (error) {

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}


module.exports = { createRegionalOffice, getAllRegionalOffices, getRegionalOfficeById, getActiveRegionalOffices, editRegionalOffice, updateRegionalOffice, deleteRegionalOffice, getRegionalOfficesOnZoneId, getAllRegionalOfficeForDropdown, getRegionalOfficersOnRo, getAllRegionalOfficers };