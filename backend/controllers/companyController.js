require("dotenv").config();
const moment = require("moment");
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
const { generatePanelIdForAdmin } = require('../helpers/panelHelper');

const { companyValidation, checkPositiveInteger, loginValidation, emailValidation } = require('../helpers/validation');
const { getGstDetailsByCompanyId, getAdminDetailsById, calculatePagination } = require('../helpers/general');
const { checkCompanyGstDefaultMarkOrNot } = require('../helpers/commonHelper');
const { log } = require("console");

const createCompany = async (req, res) => {

    try {

        const { company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, gst_details, place_of_supply, my_company, enable_company_type, email, password } = req.body


        const { error } = companyValidation.validate(req.body)
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        // check gst mark default address or not
        const checkGstMarkDefaultOrNot = await checkCompanyGstDefaultMarkOrNot(gst_details);
        if (!checkGstMarkDefaultOrNot) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Please set one gst address as a default address" })
        }
        const createdBy = req.user.user_id;
        const companyUniqueId = Math.floor(100000 + Math.random() * 900000);
        let is_company_login_enable = '0';
        let login_id;

        // create login details for company 
        if (enable_company_type) {
            const { error } = loginValidation.validate(req.body)
            if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const user_type = process.env.ADMIN_ROLE_ID;
            const panel_id = await generatePanelIdForAdmin(process.env.ADMIN_ROLE_ID, company_name);

            const userInsertQuery = `INSERT INTO admins (name, email, password, contact_no, user_type, address_1, created_by, panel_id, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const insertValues = [company_name, email, hashPassword, company_contact, user_type, company_address, createdBy, panel_id, '1'];
            const loginQueryResult = await db.query(userInsertQuery, insertValues);
            is_company_login_enable = '1';
            login_id = loginQueryResult.insertId;

        }

        const insertQuery = `INSERT INTO companies(company_unique_id, company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, place_of_supply, is_superadmin_company, is_company_login_enable, login_id, status, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const queryResult = await db.query(insertQuery, [companyUniqueId, company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, place_of_supply, my_company, is_company_login_enable, login_id, '1', createdBy])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const companyId = queryResult.insertId
            if (gst_details != null) {

                for (let i = 0; i < gst_details.length; i++) {
                    const gst_number = gst_details[i].gst_number;
                    const shipping_address = gst_details[i].shipping_address;
                    const billing_address = gst_details[i].billing_address;
                    const is_default = gst_details[i].is_default;

                    const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                    const result = await db.query(gstDetailInsertQuery, [companyId, gst_number, shipping_address, billing_address, is_default, createdBy])

                }
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Company created successfully" })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! company not created" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error })
    }
}

const getMyCompany = async (req, res) => {
    try {
        const loggedUserId = req.user.user_id
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != '') {
            searchDataCondition += ` AND (companies.company_name LIKE '%${searchData}%' OR companies.company_email LIKE '%${searchData}%' OR companies.pan_number LIKE '%${searchData}%' OR companies.company_contact LIKE '%${searchData}%')`;
        }


        const selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type WHERE companies.is_superadmin_company= ? AND companies.created_by = ? AND companies.is_deleted = ? ${searchDataCondition} ORDER BY companies.company_id DESC LIMIT ?, ?`

        queryParams.unshift(process.env.ACTIVE_STATUS, loggedUserId, process.env.INACTIVE_STATUS);
        const queryResult = await db.query(selectQuery, queryParams)

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString, [process.env.ACTIVE_STATUS, loggedUserId, process.env.INACTIVE_STATUS]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];

            for (const row of queryResult) {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);
                var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

                values.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    company_contact_person: row.company_contact,
                    primary_contact_number: row.primary_contact_,
                    primary_contact_email: row.primary_contact_email,
                    designation: row.designation,
                    department: row.department,
                    company_website: row.company_website,
                    gst_treatment_type: row.gst_treatment_type,
                    business_legal_name: row.business_legal_name,
                    business_trade_name: row.business_trade,
                    pan_number: row.pan_number,
                    place_of_supply: row.place_of_supply,
                    is_superadmin_company: row.is_superadmin_company,
                    company_type: row.company_type,
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails
                })
            }
            res.send({ status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error })
    }
}

const getMyCompanySingleDetailsById = async (req, res) => {
    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id })

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const loggedUserId = req.user.user_id
        const selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, companies.is_company_login_enable, companies.login_id, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type WHERE companies.is_superadmin_company= ? AND companies.created_by = ? AND companies.company_id = ?`
        const queryResult = await db.query(selectQuery, [process.env.ACTIVE_STATUS, loggedUserId, id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];

            for (const row of queryResult) {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);
                if (row.is_company_login_enable >= '1') {
                    const loginId = row.login_id;
                    const loginDetails = await getAdminDetailsById(loginId);
                    if (loginDetails) {
                        row.email = loginDetails.email;
                        row.password = loginDetails.password;
                    }
                    else {
                        row.email = "";
                        row.password = "";
                    }
                }

                values.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    company_contact_person: row.company_contact_person,
                    primary_contact_number: row.primary_contact_number,
                    primary_contact_email: row.primary_contact_email,
                    designation: row.designation,
                    department: row.department,
                    company_website: row.company_website,
                    gst_treatment_type: row.gst_treatment_type,
                    business_legal_name: row.business_legal_name,
                    business_trade_name: row.business_trade_name,
                    pan_number: row.pan_number,
                    place_of_supply: row.place_of_supply,
                    is_superadmin_company: row.is_superadmin_company,
                    is_company_login_enable: row.is_company_login_enable,
                    login_id: row.login_id,
                    email: row.email,
                    password: row.password,
                    company_type: row.company_type,
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails
                })
            }

            res.send({ status: true, message: "Fetched successfully", data: values[0] })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const updateMyCompanyDetails = async (req, res) => {

    try {
        const { company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, gst_details, place_of_supply, my_company, enable_company_type, email, password, login_id, id } = req.body

        const { error } = companyValidation.validate(req.body)
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        // check gst mark default address or not
        const checkGstMarkDefaultOrNot = await checkCompanyGstDefaultMarkOrNot(gst_details);
        if (!checkGstMarkDefaultOrNot) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: "Please set one gst address as a default address" })
        }

        let is_company_login_enable = '0';

        // update login details for company 
        if (enable_company_type) {

            const { error } = emailValidation.validate({ email: email });
            if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

            if (password != "") {
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = await bcrypt.hash(password, salt);
                const updateQuery = `UPDATE admins SET name = ?, email = ?, password = ?, contact_no = ?, address_1 = ? WHERE id = ?`;
                const updateValues = [company_name, email, hashPassword, company_contact, company_address, login_id];
                const loginQueryResult = await db.query(updateQuery, updateValues);
            }
            else {
                const updateQuery = `UPDATE admins SET name = ?, email = ?, contact_no = ?, address_1 = ? WHERE id = ?`;
                const updateValues = [company_name, email, company_contact, company_address, login_id];
                const loginQueryResult = await db.query(updateQuery, updateValues);
            }

            is_company_login_enable = '1';
        }

        const updateQuery = `UPDATE companies SET company_name = ?, company_type = ?, company_email = ?, company_contact = ?, company_mobile = ?, company_address = ?, company_contact_person = ?, primary_contact_number = ?, primary_contact_email = ?, designation = ?, department = ?, company_website = ?, gst_treatment_type = ?, business_legal_name = ?, business_trade_name = ?, pan_number = ?, place_of_supply = ?, is_superadmin_company = ?, is_company_login_enable = ?, updated_at = ? WHERE company_id = ?`;

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const createdBy = req.user.user_id

        const queryResult = await db.query(updateQuery, [company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, place_of_supply, my_company, is_company_login_enable, updatedAt, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            if (gst_details != null) {
                const deleteExistCompanyGstDetails = `DELETE FROM company_gst_details WHERE company_id = ?`
                const deleteExistCompanyGstDetailsResult = await db.query(deleteExistCompanyGstDetails, [id])

                for (let i = 0; i < gst_details.length; i++) {
                    const gst_number = gst_details[i].gst_number;
                    const shipping_address = gst_details[i].shipping_address;
                    const billing_address = gst_details[i].billing_address;
                    const is_default = gst_details[i].is_default;
                    const gst_details_id = gst_details[i].id;

                    if (deleteExistCompanyGstDetailsResult.affectedRows > process.env.VALUE_ZERO) {
                        const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                        const result = await db.query(gstDetailInsertQuery, [id, gst_number, shipping_address, billing_address, is_default, createdBy])
                    }
                }
            }


            res.status(StatusCodes.OK).json({ status: true, message: "Company details updated successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Company details not updated" })
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const deleteMyCompany = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const deleteQuery = `UPDATE companies SET is_deleted = ? WHERE company_id = ?`
        const queryResult = await db.query(deleteQuery, [process.env.ACTIVE_STATUS, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Company deleted successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Company details not updated" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const getCompanyTypes = async (req, res) => {

    try {
        const selectQuery = `SELECT * FROM  company_types`
        const result = await promisify(db.query)(selectQuery)

        if (result.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: result })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

//all company with my/sale/purchase company
const getAllCompany = async (req, res) => {

    try {

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(companies.company_id) as total, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id = companies.company_type WHERE companies.is_deleted = ?`
        
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != '') {
            searchDataCondition = "AND companies.company_name LIKE ? ";
            queryParams.unshift(`%${searchData}%`);
        }

        const selectQuery = `SELECT companies.*, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id = companies.company_type WHERE companies.is_deleted = ? ${searchDataCondition} ORDER BY companies.company_id DESC LIMIT ?, ?`

        queryParams.unshift(process.env.NOT_DELETED);
        const queryResult = await db.query(selectQuery, queryParams);

        if (queryResult.length > process.env.VALUE_ZERO) {

            var values = [];

            for (const row of queryResult) {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);

                values.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    company_contact_person: row.company_contact,
                    primary_contact_number: row.primary_contact_,
                    primary_contact_email: row.primary_contact_email,
                    designation: row.designation,
                    department: row.department,
                    company_website: row.company_website,
                    gst_treatment_type: row.gst_treatment_type,
                    business_legal_name: row.business_legal_name,
                    business_trade_name: row.business_trade,
                    pan_number: row.pan_number,
                    place_of_supply: row.place_of_supply,
                    is_superadmin_company: row.is_superadmin_company,
                    company_type: row.company_type,
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails
                })
            }

            const pageStartResult = (currentPage - 1) * pageSize + 1;
            const pageEndResult = Math.min(currentPage * pageSize, total);
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult })

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails[0] });
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error })
    }
}

const getCompanySingleDetailsById = async (req, res) => {
    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id })

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type WHERE companies.company_id = ?`
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];

            for (const row of queryResult) {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);

                values.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    company_contact_person: row.company_contact_person,
                    primary_contact_number: row.primary_contact_number,
                    primary_contact_email: row.primary_contact_email,
                    designation: row.designation,
                    department: row.department,
                    company_website: row.company_website,
                    gst_treatment_type: row.gst_treatment_type,
                    business_legal_name: row.business_legal_name,
                    business_trade_name: row.business_trade_name,
                    pan_number: row.pan_number,
                    place_of_supply: row.place_of_supply,
                    is_superadmin_company: row.is_superadmin_company,
                    company_type: row.company_type,
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails
                })
            }

            res.send({ status: true, message: "Fetched successfully", data: values[0] })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}


const updateCompanyDetails = async (req, res) => {

    try {
        const { company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, gst_details, place_of_supply, my_company, id } = req.body

        const { error } = companyValidation.validate(req.body)
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const updateQuery = `UPDATE companies SET company_name = ?, company_type = ?, company_email = ?, company_contact = ?, company_mobile = ?, company_address = ?, company_contact_person = ?, primary_contact_number = ?, primary_contact_email = ?, designation = ?, department = ?, company_website = ?, gst_treatment_type = ?, business_legal_name = ?, business_trade_name = ?, pan_number = ?, place_of_supply = ?, is_superadmin_company = ?, updated_at = ? WHERE company_id = ?`

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const createdBy = req.user.user_id

        const queryResult = await db.query(updateQuery, [company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, place_of_supply, my_company, updatedAt, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            if (gst_details != null) {
                const deleteExistCompanyGstDetails = `DELETE FROM company_gst_details WHERE company_id = ?`
                const deleteExistCompanyGstDetailsResult = await db.query(deleteExistCompanyGstDetails, [id])

                for (let i = 0; i < gst_details.length; i++) {
                    const gst_number = gst_details[i].gst_number;
                    const shipping_address = gst_details[i].shipping_address;
                    const billing_address = gst_details[i].billing_address;
                    const is_default = gst_details[i].is_default;
                    const gst_details_id = gst_details[i].id;

                    if (deleteExistCompanyGstDetailsResult.affectedRows > process.env.VALUE_ZERO) {
                        const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                        const result = await db.query(gstDetailInsertQuery, [id, gst_number, shipping_address, billing_address, is_default, createdBy])
                    }
                }
            }


            res.status(StatusCodes.OK).json({ status: true, message: "Company details updated successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Company details not updated" })
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const getAllCompanyForDropdown = async (req, res) => {

    try {
        const query = `SELECT company_id, company_name FROM companies`;
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

const getCompanyDetailsById = async (req, res) => {

    try {

        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const queryResult = await db.query(`SELECT * FROM companies WHERE company_id = ?`, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            for (const row of queryResult) {
                finalData.push({
                    company_id: row.company_id,
                    company_unique_id: row.company_unique_id,
                    company_type: row.company_type,
                    company_name: row.company_name,
                    company_email: row.company_email,
                    company_contact: row.company_contact,
                    company_mobile: row.company_mobile,
                    company_address: row.company_address,
                    company_contact_person: row.company_contact_person,
                    primary_contact_number: row.primary_contact_number,
                    primary_contact_email: row.primary_contact_email,
                    designation: row.designation,
                    department: row.department,
                    company_website: row.company_website,
                    gst_treatment_type: row.gst_treatment_type,
                    business_legal_name: row.business_legal_name,
                    business_trade_name: row.business_trade_name,
                    pan_number: row.pan_number,
                    gst_number: row.gst_number,
                    place_of_supply: row.place_of_supply,
                    billings_address: row.billings_address,
                    shipping_address: row.shipping_address,
                });
            }
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Company details found",
                    data: finalData[0]
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Company details not found",
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

const getComplaintName = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id || !Array.isArray(id)) {
            return res.status(400).json({
                status: false,
                message: "Invalid ID format. Expected an array of IDs."
            });
        }

        const selectQuery = await db.query(`SELECT energy_company_id, complaint_for FROM complaints WHERE id IN (${id.map(() => '?').join(',')})`, id);

        if (selectQuery.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No complaints found for the provided IDs."
            });
        }

        const final = [];
        for (const row of selectQuery) {
            let query;
            if (row.complaint_for == '1') {
                query = await db.query(`SELECT id, name FROM energy_companies WHERE id = ?`, [row.energy_company_id]);
            } else {
                query = await db.query(`SELECT company_id AS id, company_name as name FROM companies WHERE company_id = ?`, [row.energy_company_id]);
            }
            final.push(...query);
        }

        const filteredResults = {}
        final.forEach(record => {
            if (!filteredResults[record.id]) {
                filteredResults[record.id] = record
            }
        });

        return res.status(200).json({
            status: true,
            data: Object.values(filteredResults)
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};


async function getComplaint(id) {
    try {
        if (!id || !Array.isArray(id) || id.length === 0) {
            throw new Error("Invalid ID format. Expected a non-empty array of IDs.");
        }

        const selectQuery = await db.query(`SELECT energy_company_id, complaint_for FROM complaints WHERE id IN (${id.map(() => '?').join(',')})`, id);

        if (selectQuery.length === 0) {
            throw new Error("No complaints found for the provided IDs.");
        }

        const final = [];
        for (const row of selectQuery) {
            let query;
            if (row.complaint_for === '1') {
                query = await db.query(`SELECT id, name FROM energy_companies WHERE id = ?`, [row.energy_company_id]);
            } else {
                query = await db.query(`SELECT company_id AS id, company_name AS name FROM companies WHERE company_id = ?`, [row.energy_company_id]);
            }
            final.push(...query);
        }

        const uniqueResults = final.reduce((acc, record) => {
            if (!acc.some(item => item.id === record.id)) {
                acc.push(record);
            }
            return acc;
        }, []);

        return uniqueResults;
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = { createCompany, getMyCompany, getMyCompanySingleDetailsById, updateMyCompanyDetails, deleteMyCompany, getCompanyTypes, getAllCompany, getCompanySingleDetailsById, updateCompanyDetails, getAllCompanyForDropdown, getCompanyDetailsById, getComplaintName }