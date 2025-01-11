var moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { fundRequestValidation, checkPositiveInteger, checkString } = require('../helpers/validation');
const { calculatePagination, getUserDetails, getCreatedByDetails, generateRandomAlphanumerics, updateOrNotFund, generateRandomNumber, getComplaintsApprovalAccess } = require('../helpers/general');
const { getItemDetailsById, convertBase64Image } = require('../helpers/commonHelper');
const { query, request } = require('express');


const fundRequest = async (req, res) => {

    try {
        if (req.body.request_data != null) {
            const { fund_request_for, user_id } = req.body;

            const requestData = req.body.request_data;

            if (!Array.isArray(requestData) || requestData.length === 0) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Request data is missing or empty."
                });
            }


            // Iterate over each object in the request_data array
            for (const data of requestData) {
                // Check if either request_fund or new_request_fund has data with non-empty item_name and request_quantity
                if ((data.request_fund && data.request_fund.length > 0 && data.request_fund.some(item => item.item_name && item.request_quantity)) ||
                    (data.new_request_fund && data.new_request_fund.length > 0 && data.new_request_fund.some(item => item.title && item.qty))) {
                    // Proceed with your logic if validation passes
                } else {
                    return res.status(StatusCodes.OK).json({
                        status: false,
                        message: "Please filled the Item Name and Quantity. No field can be left empty."
                    });
                }
            }

            for (const imageData of requestData) {
                // Check if new_request_fund exists and is not empty
                if (imageData.new_request_fund && imageData.new_request_fund.length > 0) {
                    // Perform the validation only if new_request_fund is not empty
                    if (!imageData.new_request_fund.every(item => item.item_image)) {
                        return res.status(StatusCodes.OK).json({ status: false, message: "Please select an item image for New Request Fund." });
                    }
                }
            }


            if (requestData.length > process.env.VALUE_ZERO) {

                const request_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                const created_by = req.user.user_id;
                let queryResult;

                const unique_id = await generateRandomAlphanumerics(10);
                for (let i = 0; i < requestData.length; i++) {
                    const element = requestData[i];
                    const supplier_id = element.supplier_id?.value ?? null;
                    const officeUsers = element.office_users_id;
                    const area_manager_id = element.area_manager_id;
                    const supervisor_id = element.supervisor_id;
                    const end_users_id = element.end_users_id;
                    const self_request_id = user_id;
                    const request_by = end_users_id || supervisor_id || area_manager_id;
                    const total_request_amount = element.total_request_amount;
                    // const request_data = JSON.stringify(element.request_fund);
                    const finalData = {
                        request_fund: element.request_fund,
                        new_request_fund: element.new_request_fund
                    };

                    const request_data = JSON.stringify(finalData);

                    // Validation based on fund_request_for value
                    if (fund_request_for == 1) {
                        // Self request - only user_id is needed
                        if (!self_request_id) {
                            return res.status(StatusCodes.OK).json({ status: false, message: "For self_request, user_id is required" });
                        }
                    } else {
                        // Other request - at least one of area_manager_id, supervisor_id, end_users_id is required
                        if (!officeUsers && !area_manager_id && !supervisor_id && !end_users_id) {
                            return res.status(StatusCodes.OK).json({ status: false, message: "Please select at least one area manager, supervisor, or end users" });
                        }
                    }


                    const insertQuery = `INSERT INTO new_fund_requests (request_by, area_manager_id,  supervisor_id, end_users_id, request_data, total_request_amount, request_date, created_by, fund_request_for, unique_id, supplier_id, office_users_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

                    queryResult = await db.query(insertQuery, [request_by || officeUsers || self_request_id, area_manager_id, supervisor_id, end_users_id, request_data, total_request_amount, request_date, created_by, fund_request_for, unique_id, supplier_id, officeUsers]);
                }

                if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                    return res.status(StatusCodes.OK).json({ status: true, message: "Fund requested successfully" });
                }
                else {
                    return res.status(StatusCodes.OK).json({ status: false, message: "Error! fund not requested" });
                }
            }
            else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Please send valid request" });
            }
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Please send valid request" });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getAllFundRequests = async (req, res) => {

    try {

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";
        let hasComplaintApprovedAccess = false;
        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;
        // Determine where conditions based on approval access and user type
        if (checkApprovalAccess === loggedUserType) {
            // If user has complaint approval access, no need to filter by `request_by`
            whereConditions = "WHERE status = '0'";
            hasComplaintApprovedAccess = true;
        } else {
            // Otherwise, filter data to show only records requested by the logged-in user
            whereConditions = `WHERE status = '0' AND request_by = '${req.user.user_id}'`;
        }

        // const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE status = '0' ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

        const area_manager_id = req.query.area_manager_id;
        const supervisor_id = req.query.supervisor_id;
        const end_users_id = req.query.end_users_id;

        if (searchData != null && searchData != '') {
            search_value += `AND ( new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }
        const selectQuery = `
        SELECT new_fund_requests.* 
        FROM new_fund_requests 
        ${whereConditions} ${search_value} 
        ORDER BY new_fund_requests.id ASC 
        LIMIT ${pageFirstResult}, ${pageSize}
        `;

        const queryResult = await db.query(selectQuery);

        // const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE status = '0' ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;
        // const queryResult = await db.query(selectQuery);
        // 
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);

                const request_data = JSON.parse(row.request_data);
                const checkUpdateOrNot = await updateOrNotFund(row.request_date)

                // Initialize total sum
                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }

                }

                let totalSums = 0;
                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSums += item.fund_amount;
                    }

                }

                let total = Number(totalSum) + Number(totalSums);

                const totalItemsInRequestFund = request_data.request_fund.length;

                let totalTitlesInNewRequestFund = 0;
                if (request_data.new_request_fund && typeof request_data.new_request_fund[Symbol.iterator] === 'function') {
                    // Iterate over new_request_fund
                    for (const item of request_data.new_request_fund) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : '',
                    request_by: created_by_details.name ? created_by_details.name : '',
                    request_by_image: created_by_details.image ? created_by_details.image : '',
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : '',
                    request_date: moment(row.request_date).format('DD-MM-YYYY HH:mm:ss A'),
                    area_manager_id: row.area_manager_id,
                    supervisor_id: row.supervisor_id,
                    end_users_id: row.end_users_id,
                    total_request_amount: total,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_data: request_data,
                    active: i === 0 && currentPage === 1,
                    fund_request_for: row.fund_request_for,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    update_fund_request: checkUpdateOrNot,
                    request_for_id: request_by_details.id ? request_by_details.id : '',
                    request_for: request_by_details.name ? request_by_details.name : '',
                    request_for_image: request_by_details.image ? request_by_details.image : '',
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : '',
                })
            }

            var finalResult = [];
            // Remove undefined values from the finalData array
            if (area_manager_id != null && area_manager_id != "" && supervisor_id != null && supervisor_id != "") {
                // Both area_manager_id and supervisor_id are present
                finalResult = finalData.filter((item) => {
                    return item.area_manager_id === area_manager_id && item.supervisor_id === supervisor_id;
                });
            }
            else if (area_manager_id != null && area_manager_id != "") {
                finalResult = finalData.filter((item) => item.area_manager_id == area_manager_id);
            }
            else if (supervisor_id != null && supervisor_id != "") {
                finalResult = finalData.filter((item) => item.supervisor_id == supervisor_id);
            }
            else if (end_users_id != null && end_users_id != "") {
                finalResult = finalData.filter((item) => item.end_users_id == end_users_id);
            }
            else {
                finalResult = finalData;
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalResult, pageDetails: pageDetails });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getAllApprovedFundRequests = async (req, res) => {

    try {

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        let hasComplaintApprovedAccess = false;
        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;
        // Determine where conditions based on approval access and user type
        if (checkApprovalAccess === loggedUserType) {
            // If user has complaint approval access, no need to filter by `request_by`
            whereConditions = "WHERE status = '1'";
            hasComplaintApprovedAccess = true;
        } else {
            // Otherwise, filter data to show only records requested by the logged-in user
            whereConditions = `WHERE status = '1' AND request_by = '${req.user.user_id}'`;
        }

        if (searchData != null && searchData != '') {
            search_value += `AND ( new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests ${whereConditions} ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`


        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);


        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);
                const request_data = JSON.parse(row.request_data);

                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }

                }

                let totalSums = 0;
                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSums += item.fund_amount;
                    }

                }

                let total = Number(totalSum) + Number(totalSums);


                const totalItemsInRequestFund = request_data.request_fund.length;

                let totalTitlesInNewRequestFund = 0;
                if (request_data.new_request_fund && typeof request_data.new_request_fund[Symbol.iterator] === 'function') {
                    // Iterate over new_request_fund
                    for (const item of request_data.new_request_fund) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;


                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : '',
                    request_by: created_by_details.name ? created_by_details.name : '',
                    request_by_image: created_by_details.image ? created_by_details.image : '',
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : '',
                    request_date: moment(row.request_date).format('DD-MM-YYYY HH:mm:ss A'),
                    total_request_amount: total,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_data: request_data,
                    approved_by: approved_by_details.name ? approved_by_details.name : '',
                    approved_by_image: approved_by_details.image ? approved_by_details.image : '',
                    approved_by_employee_id: approved_by_details.employee_id ? approved_by_details.employee_id : '',
                    approved_date: moment(row.approved_at).format('DD-MM-YYYY HH:mm:ss A'),
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    designation_amount: row.total_request_amount - row.total_approved_amount,
                    request_for_id: request_by_details.id ? request_by_details.id : '',
                    request_for: request_by_details.name ? request_by_details.name : '',
                    request_for_image: request_by_details.image ? request_by_details.image : '',
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : '',

                })
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    }

    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getAllRejectedFundRequests = async (req, res) => {

    try {

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND (new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }

        let hasComplaintApprovedAccess = false;
        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;
        // Determine where conditions based on approval access and user type
        if (checkApprovalAccess === loggedUserType) {
            // If user has complaint approval access, no need to filter by `request_by`
            whereConditions = "WHERE status = '2'";
            hasComplaintApprovedAccess = true;
        } else {
            // Otherwise, filter data to show only records requested by the logged-in user
            whereConditions = `WHERE status = '2' AND request_by = '${req.user.user_id}'`;
        }

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests ${whereConditions} ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`

        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);

                const rejected_by_details = await getCreatedByDetails(row.approved_by);
                const request_data = JSON.parse(row.request_data);
                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }
                }

                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSum += item.fund_amount;
                    }
                }

                const totalItemsInRequestFund = request_data.request_fund.length;

                let totalTitlesInNewRequestFund = 0;

                if (request_data.new_request_fund && typeof request_data.new_request_fund[Symbol.iterator] === 'function') {
                    // Iterate over new_request_fund
                    for (const item of request_data.new_request_fund) {
                        if (item.title) {
                            totalTitlesInNewRequestFund++;
                        }
                    }
                }
                let itemCount = totalTitlesInNewRequestFund + totalItemsInRequestFund;

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : '',
                    request_by: created_by_details.name ? created_by_details.name : '',
                    request_by_image: created_by_details.image ? created_by_details.image : '',
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : '',
                    request_date: moment(row.request_date).format('DD-MM-YYYY HH:mm:ss A'),
                    total_request_amount: totalSum
                    ,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_data: JSON.parse(row.request_data),
                    rejected_by: rejected_by_details.name ? rejected_by_details.name : '',
                    rejected_by_image: rejected_by_details.image ? rejected_by_details.image : '',
                    rejected_by_employee_id: rejected_by_details.employee_id ? rejected_by_details.employee_id : '',
                    rejected_date: moment(row.approved_at).format('DD-MM-YYYY HH:mm:ss A'),
                    rejected_remarks: row.rejected_remarks,
                    total_item: itemCount,
                    total_request_items: totalItemsInRequestFund,
                    total_new_request_items: totalTitlesInNewRequestFund,
                    request_for_id: request_by_details.id ? request_by_details.id : '',
                    request_for: request_by_details.name ? request_by_details.name : '',
                    request_for_image: request_by_details.image ? request_by_details.image : '',
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : '',
                })
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getFundRequestById = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE new_fund_requests.id = ?`

        const queryResult = await db.query(selectQuery, [id]);

        let getSupplierValue;

        if (queryResult[0].supplier_id === null) {
            getSupplierValue = {
                label: '',
                value: null
            };
        } else {
            const getSupplierDetails = await db.query(`SELECT * FROM suppliers WHERE id = '${queryResult[0].supplier_id}'`);

            getSupplierValue = {
                label: getSupplierDetails[0].supplier_name,
                value: getSupplierDetails[0].id
            };
        }


        if (queryResult.length > process.env.VALUE_ZERO) {

            var finalData = [];

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                const getResultManagerQuery = `SELECT users.name, users.image, users.id AS userId FROM users WHERE id IN (?, ?, ?, ?)`;

                const execResultManager = await db.query(getResultManagerQuery, [row.office_users_id, row.area_manager_id, row.supervisor_id, row.end_users_id]);
                const userDetails = {};

                execResultManager.forEach(user => {
                    const userType = (() => {
                        switch (user.userId) {
                            case row.office_users_id: return "Office User";
                            case row.area_manager_id: return "Area Manager";
                            case row.supervisor_id: return "Supervisor";
                            case row.end_users_id: return "End User";
                            default: return "Unknown"; // Handle unexpected cases
                        }
                    })();

                    userDetails[userType] = {
                        name: user.name,
                        image: user.image,
                        id: user.userId
                    };
                });

                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);
                const approvedByDetails = await getCreatedByDetails(row.approved_by);
                const dbRequestFund = JSON.parse(row.request_data);
                const dbApprovedFund = JSON.parse(row.approval_data);

                const requestFundDetails = dbRequestFund.request_fund;
                let fund_request;
                if (requestFundDetails.every(item => item.item_name == '' && item.request_quantity == '')) {
                    fund_request = []
                }

                let combinedData = [];

                // Concatenate the arrays
                if (Array.isArray(dbRequestFund.request_fund)) {
                    combinedData = combinedData.concat(dbRequestFund.request_fund);
                }

                if (Array.isArray(dbRequestFund.new_request_fund)) {
                    combinedData = combinedData.concat(dbRequestFund.new_request_fund);
                }

                let itemCount = 0;

                // Iterate over each object in the combinedData array   
                combinedData.forEach(item => {
                    // Check if the item has an item_name property
                    if (item.hasOwnProperty('item_name')) {
                        // Increment the counter if item_name is present
                        itemCount++;
                    }
                });

                if (dbApprovedFund != null) {
                    if (dbApprovedFund.length > 0) {
                        for (let i = 0; i < dbApprovedFund.length; i++) {
                            const element = dbApprovedFund[i];
                            const requestElement = dbRequestFund[i];
                            // for request fund key

                            dbRequestFund[i]['approved_price'] = element.price;
                            dbRequestFund[i]['approved_quantity'] = parseInt(element.quantity);
                            dbRequestFund[i]['total_approved_amount'] = (element.price * element.quantity);
                            dbRequestFund[i]['remaining_amount'] = (dbRequestFund[i].fund_amount - dbRequestFund[i]['total_approved_amount']);

                            // for approved fund key
                            element['approved_price'] = element.price;
                            element['approved_quantity'] = parseInt(element.quantity);
                            element['total_approved_amount'] = (element.price * element.quantity);
                            element['remaining_amount'] = (dbRequestFund[i].fund_amount - dbRequestFund[i]['total_approved_amount']);
                        }
                    }
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : '',
                    request_by: created_by_details.name ? created_by_details.name : '',
                    request_by_image: created_by_details.image ? created_by_details.image : '',
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : '',
                    request_date: moment(row.request_date).format('DD-MM-YYYY HH:mm:ss A'),
                    request_date: moment(row.request_date).format('DD-MM-YYYY HH:mm:ss A'),
                    area_manager_id: userDetails["Area Manager"] || {},
                    supervisor_id: userDetails["Supervisor"] || {},
                    end_users_id: userDetails["End User"] || {},
                    office_users_id: userDetails["Office User"] || {},
                    total_request_amount: row.total_request_amount,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_fund: dbRequestFund, //JSON.parse(row.request_data),
                    approved_data: dbApprovedFund,//row.approval_data ? JSON.parse(row.approval_data) : null,
                    approved_at: row.approved_at ? moment(row.approved_at).format('YYYY-MM-DD HH:mm:ss A') : null,
                    approved_by_name: approvedByDetails.name ? approvedByDetails.name : null,
                    approved_image: approvedByDetails.image ? approvedByDetails.image : null,
                    approved_employee_id: approvedByDetails.employee_id ? approvedByDetails.employee_id : null,
                    transfer_data: row.transfer_data ? JSON.parse(row.transfer_data) : null,
                    fund_request_for: row.fund_request_for,
                    total_item: itemCount,
                    request_for_id: request_by_details.id ? request_by_details.id : '',
                    request_for: request_by_details.name ? request_by_details.name : '',
                    request_for_image: request_by_details.image ? request_by_details.image : '',
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : '',
                    request_for_credit_limt: request_by_details.credit_limit ? request_by_details.credit_limit : '',
                    supplier_id: getSupplierValue ?? null,
                });
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: finalData[0] });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const updateFundRequest = async (req, res) => {

    try {

        const { fund_request_for, status } = req.body;
        if (req.body.request_data != null) {

            const requestData = req.body.request_data;
            const id = req.body.id;

            if (requestData.length > process.env.VALUE_ZERO) {
                const updated_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                const updated_by = req.user.user_id;

                let queryResult;

                for (let i = 0; i < requestData.length; i++) {
                    const element = requestData[i];
                    const area_manager_id = element.area_manager_id;
                    const supervisor_id = element.supervisor_id;
                    const end_users_id = element.end_users_id;
                    const office_users_id = element.office_users_id;
                    const self_request_id = element.user_id; // const request_by = element.user_id;
                    const request_by = office_users_id || end_users_id || supervisor_id || area_manager_id;
                    const total_request_amount = element.total_request_amount;

                    const finalData = {
                        request_fund: element.request_fund,
                        new_request_fund: element.new_request_fund
                    };


                    const request_data = JSON.stringify(finalData);


                    if (fund_request_for == 1) {
                        // Self request - only user_id is needed
                        if (!self_request_id) {
                            return res.status(StatusCodes.OK).json({ status: false, message: "For self_request, user_id is required" });
                        }
                    } else {
                        // Other request - at least one of area_manager_id, supervisor_id, end_users_id is required
                        if (!office_users_id && !area_manager_id && !supervisor_id && !end_users_id) {
                            return res.status(StatusCodes.OK).json({ status: false, message: "Please select at least one area manager, supervisor, end users" });
                        }
                    }
                    if (status === "1") {

                        const insertQuery = `UPDATE new_fund_requests SET request_by = ?,area_manager_id=?,  supervisor_id=?, end_users_id=?, request_data  = ?, total_request_amount = ?, approved_by = ?, approved_at = ?, status='1' WHERE id = ?`

                        queryResult = await db.query(insertQuery, [request_by || self_request_id, area_manager_id, supervisor_id, end_users_id, request_data, total_request_amount, updated_by, updated_at, id]);

                    } else {

                        const insertQuery = `UPDATE new_fund_requests SET request_by = ?,area_manager_id=?,  supervisor_id=?, end_users_id=?, request_data  = ?, total_request_amount = ?, updated_by = ?, updated_at = ?, status='0', supplier_id = ? WHERE id = ?`

                        queryResult = await db.query(insertQuery, [request_by || self_request_id, area_manager_id, supervisor_id, end_users_id, request_data, total_request_amount, updated_by, updated_at, element.supplier_id.value, id]);
                    }

                }

                if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                    return res.status(StatusCodes.OK).json({ status: true, message: "Fund requested details updated successfully" });
                }
                else {
                    return res.status(StatusCodes.OK).json({ status: false, message: "Error! fund not requested" });
                }
            }
            else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Please send valid request" });
            }
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Please send valid request" });
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const deleteFundRequest = async (req, res) => {

    try {

        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        //----------------First check request id approved or not--------------------------------
        const checkRequestApprovedQuery = `SELECT status FROM new_fund_requests WHERE id = ? AND approval_data IS NOT NULL`
        const checkRequestApprovedQueryResult = await db.query(checkRequestApprovedQuery, [id]);

        if (checkRequestApprovedQueryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Request is approved so you can't delete it" });
        }
        else {
            //delete request query
            const deleteRequestQuery = `DELETE FROM new_fund_requests WHERE id = ?`;
            const queryResult = await db.query(deleteRequestQuery, [id]);

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Fund requests deleted successfully" });
            }
            else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Error! fund request not deleted" });
            }
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getFundRequestOnComplaintUniqueId = async (req, res) => {

    try {

        const complaint_id = req.params.complaint_id;

        const complaintUniqueIdValidation = Joi.object({
            complaint_id: Joi.string().required(),
        })

        const { error } = complaintUniqueIdValidation.validate({ complaint_id: complaint_id });

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const selectQuery = `SELECT * FROM fund_requests WHERE complaint_id = ?`;

        const queryResult = await db.query(selectQuery, [complaint_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const changeStatusOfFundRequest = async (req, res) => {

    try {

        const { fund_request_for, request_data, id, status } = req.body;

        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        let itemIndex = 0;
        if (itemIndex !== undefined && itemIndex >= 0 && itemIndex < request_data[0].new_request_fund.length) {
            const item = request_data[0].new_request_fund[itemIndex];

            // Check if view_status is not already 1, if yes, no need to update
            if (item.view_status !== true) {
                return res.status(StatusCodes.OK).json({ status: false, message: 'Please view the image first.' });
            }

            // Update view_status to 1 as the image is viewed
            request_data[0].new_request_fund[itemIndex].view_status = true;
        }


        const approved_by = req.user.user_id;
        const approved_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        //Get already approved data for that stock request
        const approvedData = await db.query(`SELECT * FROM new_fund_requests WHERE id = ?`, [id]);

        var finalItem = [];
        let total_approved_amount;
        let totalSum = 0;

        // Iterate over request_fund array and sum up fund_amount
        if (request_data[0].request_fund) {
            for (const item of request_data[0].request_fund) {
                totalSum += Number(item.price) * Number(item.quantity);
            }
        }

        let totalSums = 0;
        // Iterate over new_request_fund array and sum up fund_amount
        if (request_data[0].new_request_fund) {
            for (const item of request_data[0].new_request_fund) {
                totalSums += Number(item.fund_amount);
            }
        }
        let total = Number(totalSum) + Number(totalSums);

        const total_body_approved_amount = total;

        const quantities = [];
        const prices = [];

        request_data.forEach(request => {
            // Check if `request.request_fund` is valid before iterating over its contents
            if (!Array.isArray(request.request_fund) || request.request_fund.length === 0) {
                // Handle invalid request.request_fund: log error, send appropriate response, etc.
                console.error("Invalid request.request_fund encountered:", request.request_fund);
                // Replace with your desired error handling logic, e.g., return specific error message
                return;
            }

            request.request_fund.forEach(item => {
                quantities.push(item.quantity);
                prices.push(item.price);
            });
        });

        // Only perform quantity and price checks if both arrays have been populated
        if (quantities.length > 0 && prices.length > 0) {
            const invalidQuantities = quantities.some(qty => qty == null || qty === 0 || qty === '');
            const invalidPrices = prices.some(price => price == null || price === 0 || price === '');

            if (invalidQuantities) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: 'Quantity Value must be greater than 0.',
                });
            }

            if (invalidPrices) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: 'Price Value must be greater than 0.',
                });
            }
        }

        if (approvedData[0].status == '1') {
            const removeExistingPrice = removeItemToFundRequest(id)
        }

        finalItem = {
            request_fund: request_data[0].request_fund,
            new_request_fund: request_data[0].new_request_fund
        }

        total_approved_amount = total_body_approved_amount;

        const newRequestData = request_data[0].new_request_fund;

        const approved_amount = total_approved_amount;
        const approved_data = JSON.stringify(finalItem);

        const statusChangedQuery = `UPDATE new_fund_requests SET total_approved_amount = ?, approval_data = ?, status = ?, approved_by = ?, approved_at = ? WHERE id = ?`;
        const queryResult = await db.query(statusChangedQuery, [approved_amount, approved_data, status, approved_by, approved_at, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {

            if (newRequestData != null && newRequestData.length > 0) {
                let getItemId = await addItemFromFundRequestToItemMasters(newRequestData)
            }

            if (request_data != null) {
                const addItemToFundRequestData = await addItemToFundRequest(request_data, id);

            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Status changed successfully" });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Error! status not changed" });
        }

    }
    catch (error) {
        return res.status(StatusCodes.OK).json({ status: false, message: error.message });
    }
}

async function addAmountToRequestedUserWallet(id, approved_by) {
    const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM new_fund_requests WHERE id = ?`, [id]);


    if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
        const requestedData = getApprovedRequestedFundDetails[0];
        const user_id = requestedData.request_by;
        const amount = requestedData.total_approved_amount;
        const request_by = approved_by;
        //---check if user id is in wallet then update balance otherwise put request approved amount in wallet---

        const getWalletBalance = await db.query(`SELECT * FROM user_wallets WHERE user_id = ?`, [user_id]);

        if (getWalletBalance.length > process.env.VALUE_ZERO) {
            //---------------update wallet balance-------------------------------- 
            const walletBalanceId = getWalletBalance[0].id;
            const dbWalletBalance = getWalletBalance[0].balance;
            const updatedWalletBalance = (dbWalletBalance + amount);
            const updateQuery = `UPDATE user_wallets SET balance  = ?, updated_by = ? WHERE id = ?`;
            const queryResult = await db.query(updateQuery, [updatedWalletBalance, request_by, walletBalanceId]);
        }
        else {
            //---------------add user to wallet--------------------------------
            const insertQuery = `INSERT INTO user_wallets (user_id, balance, created_by) VALUES(?, ?, ?)`;
            const queryResult = await db.query(insertQuery, [user_id, amount, request_by]);
        }

    }
}


// async function addItemToFundRequest(approvalData, id) {
//     try {
//         const currentMonthYear = moment().format('YYYY-MM');
//         // no need in this query for request date because its already stored in current date
//         const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM new_fund_requests WHERE id = ? `, [id]);

//         if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
//             const requestedData = getApprovedRequestedFundDetails[0];
//             const request_by = requestedData.request_by;

//             const request_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
//             const created_by = requestedData.created_by;

//             if (approvalData != null) {
//                 for (const data of approvalData) {
//                     const allRequests = data.request_fund.concat(data.new_request_fund);
//                     for (const row of allRequests) {

//                         if (row.item_name && row.item_name.value) {
//                             const existingItem = await db.query(`SELECT * FROM fund_requests WHERE request_by = ? AND item_id = ? AND item_price = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`, [request_by, row.item_name.value, row.price, currentMonthYear]);

//                             if (existingItem.length > process.env.VALUE_ZERO) {
//                                 const request_qty = Number(row.quantity) + Number(existingItem[0].request_qty);
//                                 const request_amount = Number(row.quantity * row.price) + Number(existingItem[0].request_amount);
//                                 const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE request_by = ? AND item_id = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`;
//                                 await db.query(updateQuery, [request_qty, request_amount, created_by, request_by, row.item_name.value, currentMonthYear]);
//                             } else {
//                                 const getTotalAmount = Number(row.price) * Number(row.quantity)
//                                 const insertQueryNew = `INSERT INTO fund_requests (item_id, item_price, request_by, request_amount, request_qty, request_date, created_by) VALUES ('${row.item_name.value}', '${row.price}', '${request_by}', '${getTotalAmount}', '${row.quantity}', '${request_date}', '${created_by}')`;
//                                 const insertRequestRecord = await db.query(insertQueryNew);
//                             }
//                         } else if (row.title && (row.title.label || row.title.value)) {
//                             if (!isNaN(row.title.value) && Number(row.title.value) !== 0) {
//                                 const existingItem = await db.query(`SELECT * FROM fund_requests WHERE item_id = ? AND  item_price = ? AND request_by = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`, [row.title.value, row.rate, request_by, currentMonthYear]);
//                                 if (existingItem.length > 0) {
//                                     const request_qty = Number(row.qty) + Number(existingItem[0].request_qty);
//                                     const request_amount = Number(row.qty * row.rate) + Number(existingItem[0].request_amount);
//                                     const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE item_id = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`;
//                                     await db.query(updateQuery, [request_qty, request_amount, created_by, row.title.value, currentMonthYear]);
//                                 } else {
//                                     const insertQuery = `INSERT INTO fund_requests (item_id, item_price, request_by, request_amount, request_qty, request_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`;
//                                     await db.query(insertQuery, [row.title.value, row.rate, request_by, row.fund_amount, row.qty, request_date, created_by]);
//                                 }
//                             } else if (row.title && typeof row.title.label === 'string' && typeof row.title.value === 'string') {

//                                 const request_qty = row.qty;
//                                 const request_amount = Number(row.rate) * Number(row.qty);
//                                 const insertQuery = `
//                                     INSERT INTO fund_requests 
//                                     (item_id, new_item, item_price, request_by, request_amount, request_qty, request_date, created_by) 
//                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//                                 `;
//                                 const insertResult = await db.query(insertQuery, [row.title.value, row.title.value, row.rate, request_by, request_amount, request_qty, request_date, created_by]);

//                                 // Check if item exists in item_masters table
//                                 const selectQuery = await db.query(`SELECT id FROM item_masters WHERE name = ?`, [row.title.value]);

//                                 if (selectQuery.length > 0) {
//                                     const getId = selectQuery[0].id;

//                                     // Update item_id in fund_requests table
//                                     await db.query(`UPDATE fund_requests SET item_id = ? WHERE new_item = ?`, [getId, row.title.value]);
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         return error.message;
//     }
// }


async function addItemToFundRequest(approvalData, id) {
    try {
        const currentMonthYear = moment().format('YYYY-MM');
        // no need in this query for request date because its already stored in current date
        const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM new_fund_requests WHERE id = ? `, [id]);

        if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
            const requestedData = getApprovedRequestedFundDetails[0];
            const request_by = requestedData.request_by;

            const request_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const created_by = requestedData.created_by;

            if (approvalData != null) {
                for (const data of approvalData) {
                    const allRequests = data.request_fund.concat(data.new_request_fund);
                    for (const row of allRequests) {

                        if (row.item_name && row.item_name.value) {
                            const existingItem = await db.query(`SELECT * FROM fund_requests WHERE request_by = ? AND item_id = ? AND item_price = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`, [request_by, row.item_name.value, row.price, currentMonthYear]);

                            if (existingItem.length > process.env.VALUE_ZERO) {
                                const request_qty = Number(row.quantity) + Number(existingItem[0].request_qty);
                                const request_amount = Number(row.quantity * row.price) + Number(existingItem[0].request_amount);
                                const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE request_by = ? AND item_id = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`;
                                await db.query(updateQuery, [request_qty, request_amount, created_by, request_by, row.item_name.value, currentMonthYear]);
                            } else {
                                const getTotalAmount = Number(row.price) * Number(row.quantity)
                                const insertQueryNew = `INSERT INTO fund_requests (item_id, item_price, request_by, request_amount, request_qty, request_date, created_by) VALUES ('${row.item_name.value}', '${row.price}', '${request_by}', '${getTotalAmount}', '${row.quantity}', '${request_date}', '${created_by}')`;
                                const insertRequestRecord = await db.query(insertQueryNew);
                            }
                        } else if (row.title && (row.title.label || row.title.value)) {
                            if (!isNaN(row.title.value) && Number(row.title.value) !== 0) {
                                const existingItem = await db.query(`SELECT * FROM fund_requests WHERE item_id = ? AND  item_price = ? AND request_by = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`, [row.title.value, row.rate, request_by, currentMonthYear]);
                                if (existingItem.length > 0) {
                                    const request_qty = Number(row.qty) + Number(existingItem[0].request_qty);
                                    const request_amount = Number(row.qty * row.rate) + Number(existingItem[0].request_amount);
                                    const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE item_id = ? AND DATE_FORMAT(request_date, '%Y-%m') = ?`;
                                    await db.query(updateQuery, [request_qty, request_amount, created_by, row.title.value, currentMonthYear]);
                                } else {
                                    const insertQuery = `INSERT INTO fund_requests (item_id, item_price, request_by, request_amount, request_qty, request_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                    await db.query(insertQuery, [row.title.value, row.rate, request_by, row.fund_amount, row.qty, request_date, created_by]);
                                }
                            } else if (row.title && typeof row.title.label === 'string' && typeof row.title.value === 'string') {

                                const request_qty = row.qty;
                                const request_amount = Number(row.rate) * Number(row.qty);
                                const insertQuery = `
                                    INSERT INTO fund_requests 
                                    (item_id, new_item, item_price, request_by, request_amount, request_qty, request_date, created_by) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                                `;
                                const insertResult = await db.query(insertQuery, [row.title.value, row.title.value, row.rate, request_by, request_amount, request_qty, request_date, created_by]);

                                // Check if item exists in item_masters table
                                const selectQuery = await db.query(`SELECT id FROM item_masters WHERE name = ?`, [row.title.value]);

                                if (selectQuery.length > 0) {
                                    const getId = selectQuery[0].id;

                                    // Update item_id in fund_requests table
                                    await db.query(`UPDATE fund_requests SET item_id = ? WHERE new_item = ?`, [getId, row.title.value]);
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        return error.message;
    }
}

const getFundDetailsOnItemId = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const request_by = req.user.user_id;
        const queryResult = await db.query(`SELECT item_id, request_qty, request_amount as item_price, transfer_qty, transfer_amount FROM fund_requests WHERE item_id = ? AND request_by = ?`, [id, request_by]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const rejectFundRequest = async (req, res) => {

    try {
        const id = req.params.id;
        const remarks = req.body.remarks;

        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const approved_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const approved_by = req.user.user_id;
        const queryResult = await db.query(`UPDATE new_fund_requests SET status = '2', approved_at = '${approved_at}', approved_by = '${approved_by}', rejected_remarks='${remarks}' WHERE id = '${id}'`);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const removeItem = await removeItemToFundRequest(id)

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Request rejected successfully"
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Error! something went wrong, please try again later"
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


const getAllApprovedFundAndPartialTransfer = async (req, res) => {

    try {

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR new_fund_requests.request_by LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE status = '1' AND total_approved_amount < total_transfer_amount ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const request_by_details = await getCreatedByDetails(row.request_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);

                finalData.push({
                    id: row.id,
                    request_by: request_by_details.name ? request_by_details.name : '',
                    request_by_image: request_by_details.image ? request_by_details.image : '',
                    request_by_employee_id: request_by_details.employee_id ? request_by_details.employee_id : '',
                    request_date: moment(row.request_date).format('DD-MM-YYYY HH:mm:ss A'),
                    total_request_amount: row.total_request_amount,
                    total_approved_amount: row.total_approved_amount,
                    status: row.status,
                    request_data: JSON.parse(row.request_data),
                    approved_by: approved_by_details.name ? approved_by_details.name : '',
                    approved_by_image: approved_by_details.image ? approved_by_details.image : '',
                    approved_by_employee_id: approved_by_details.employee_id ? approved_by_details.employee_id : '',
                    approved_date: moment(row.approved_at).format('DD-MM-YYYY HH:mm:ss A'),
                })
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getPendingTransferFund = async (req, res) => {

    try {

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        // let hasComplaintApprovedAccess = false;
        // const checkApprovalAccess = await getComplaintsApprovalAccess();
        // let whereConditions;
        // const loggedUserType = req.user.user_type;
        // // Determine where conditions based on approval access and user type
        // if (checkApprovalAccess === loggedUserType) {
        //     // If user has complaint approval access, no need to filter by `request_by`
        //     whereConditions = "WHERE status = '0'";
        //     hasComplaintApprovedAccess = true;
        // } else {
        //     // Otherwise, filter data to show only records requested by the logged-in user
        //     whereConditions = `WHERE status = '0' AND request_by = '${req.user.user_id}'`;
        // }

        // if (searchData != null && searchData != '') {
        //     search_value += ` AND (new_fund_requests.unique_id LIKE '%${searchData}%')`;
        // }

        // const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE status IN ('1', '4') AND reschedule_transfer = 1 AND total_approved_amount IS NOT NULL AND total_approved_amount <> 0 ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;
        let hasComplaintApprovedAccess = false;
        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;

        // Set conditions based on approval access and user type
        if (checkApprovalAccess === loggedUserType) {
            // If user has complaint approval access, show data for status 1 and 4 without filtering by `request_by`
            whereConditions = `status IN ('1', '4')`;
            hasComplaintApprovedAccess = true;
        } else {
            // If user doesn't have access, filter by `request_by` and status values
            whereConditions = `status IN ('1', '4') AND request_by = '${req.user.user_id}'`;
        }

        // Handle search data if provided
        if (searchData != null && searchData !== '') {
            search_value = `AND (new_fund_requests.unique_id LIKE '%${searchData}%')`;
        } else {
            search_value = '';  // No additional search conditions
        }

        // Construct the final select query with dynamic where conditions
        const selectQuery = `
            SELECT new_fund_requests.* 
            FROM new_fund_requests 
            WHERE ${whereConditions} 
            AND reschedule_transfer = 1 
            AND total_approved_amount IS NOT NULL 
            AND total_approved_amount <> 0 
            ${search_value} 
            ORDER BY new_fund_requests.id ASC 
            LIMIT ${pageFirstResult}, ${pageSize}
        `;

        // Execute the query
        // const queryResult = await db.query(selectQuery);

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);
                const request_data = JSON.parse(row.request_data);



                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }

                }

                let totalSums = 0;
                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSums += item.fund_amount;
                    }

                }

                let total = Number(totalSum) + Number(totalSums);

                let status;
                if (row.status == '1') {
                    status = 'Pending';
                } else if (row.status == '4') {
                    status = "partial"
                }

                finalData.push({
                    id: row.id,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : '',
                    request_by: created_by_details.name ? created_by_details.name : '',
                    request_by_image: created_by_details.image ? created_by_details.image : '',
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : '',
                    request_date: moment(row.request_date).format('DD-MM-YYYY HH:mm:ss A'),
                    total_request_amount: total,
                    total_approved_amount: row.total_approved_amount,
                    transfer_data: row.transfer_data ? JSON.parse(row.transfer_data) : null,
                    total_transfer_amount: row.total_transfer_amount || 0,
                    status: status,
                    request_data: request_data,
                    approved_by: approved_by_details.name ? approved_by_details.name : '',
                    approved_by_image: approved_by_details.image ? approved_by_details.image : '',
                    approved_by_employee_id: approved_by_details.employee_id ? approved_by_details.employee_id : '',
                    approved_date: moment(row.approved_at).format('DD-MM-YYYY HH:mm:ss A'),
                    designation_amount: row.total_request_amount - row.total_approved_amount,
                    active: i === 0 && currentPage === 1,
                    request_for_id: request_by_details.id ? request_by_details.id : '',
                    request_for: request_by_details.name ? request_by_details.name : '',
                    request_for_image: request_by_details.image ? request_by_details.image : '',
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : '',

                })
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    }
    catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


// const getFundRequestFourLowPrice = async (req, res) => {

//     try {
//         const hsncode = req.params.hsncode;

//         const { error } = checkString.validate({ hsncode });
//         if (error) {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: error.message
//                 });
//         }

//         // Query to select the lowest 4 priced items for the given HSNCODE
//         // const query = ` SELECT item_masters.id AS item_id, item_masters.name AS item_name, item_masters.rate AS item_rate, item_masters.image, item_masters.hsncode,item_masters.rucode, item_masters.unique_id as item_unique_id, suppliers.id AS supplier_id, suppliers.supplier_name AS supplier_name FROM item_masters LEFT JOIN suppliers ON item_masters.supplier_id = suppliers.id WHERE item_masters.hsncode = ? ORDER BY CAST(item_masters.rate AS DECIMAL(10,2)) ASC LIMIT 4; `;

//         const query = ` SELECT item_masters.id AS item_id, item_masters.name AS item_name, item_masters.rate AS item_rate, item_masters.image, item_masters.hsncode, item_masters.rucode, item_masters.unique_id AS item_unique_id, suppliers.id AS supplier_id, suppliers.supplier_name AS supplier_name, supplier_addresses.shop_office_number, supplier_addresses.street_name, supplier_addresses.city, supplier_addresses.state, supplier_addresses.pin_code FROM item_masters LEFT JOIN suppliers ON item_masters.supplier_id = suppliers.id LEFT JOIN supplier_addresses ON supplier_addresses.id = suppliers.id WHERE item_masters.hsncode = ? ORDER BY CAST(item_masters.rate AS DECIMAL(10,2)) ASC LIMIT 4; `;

//         const queryResult = await db.query(query, [hsncode]);
//         if (queryResult.length > 0) {
//             return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


const getFundRequestFourLowPrice = async (req, res) => {
    try {
        const hsncode = req.params.hsncode;
        const category = req.params.category;
        // Validate the hsncode
        const { error } = checkString.validate({ hsncode });
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message
            });
        }

        // Query to select the lowest 4 priced items for the given HSNCODE
        const query = `
            SELECT 
                item_masters.id AS item_id, 
                item_masters.name AS item_name, 
                item_masters.image, 
                item_masters.hsncode, 
                item_masters.rucode, 
                item_masters.unique_id AS item_unique_id, 
                suppliers.id AS supplier_id, 
                suppliers.supplier_name AS supplier_name, 
                supplier_addresses.shop_office_number, 
                supplier_addresses.street_name, 
                supplier_addresses.city, 
                supplier_addresses.state, 
                supplier_addresses.pin_code, 
                item_rates.brand, 
                item_rates.rate AS item_rate 
            FROM item_masters 
            LEFT JOIN suppliers ON item_masters.supplier_id = suppliers.id 
            LEFT JOIN supplier_addresses ON supplier_addresses.id = suppliers.id 
            LEFT JOIN item_rates ON item_masters.id = item_rates.item_id 
            WHERE item_masters.hsncode = ? AND category = ? 
            ORDER BY CAST(item_rates.rate AS DECIMAL(10, 2)) ASC 
            LIMIT 4;
        `;

        const queryResult = await db.query(query, [hsncode, category]);

        if (queryResult.length > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found"
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
};


const reActiveToRejectedFundRequest = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: error.message
                });
        }
        const updated_by = req.user.user_id;
        const queryResult = await db.query(`UPDATE new_fund_requests SET status = '0', updated_by = '${updated_by}' WHERE id = '${id}'`);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Request Reactive successfully"
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Error! something went wrong, please try again later"
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

const reschduleTransferFund = async (req, res) => {
    try {

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        let hasComplaintApprovedAccess = false;
        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;

        // Set conditions based on approval access and user type
        if (checkApprovalAccess === loggedUserType) {
            // If user has complaint approval access, show data for status 1 and 4 without filtering by `request_by`
            whereConditions = `status IN ('1', '4')`;
            hasComplaintApprovedAccess = true;
        } else {
            // If user doesn't have access, filter by `request_by` and status values
            whereConditions = `status IN ('1', '4') AND request_by = '${req.user.user_id}'`;
        }

        // Initialize search conditions if search data is provided
        let search_value = '';
        if (searchData != null && searchData !== '') {
            search_value = `AND (new_fund_requests.unique_id LIKE '%${searchData}%')`;
        }

        // Construct the final select query with the dynamic where conditions
        const selectQuery = `
    SELECT new_fund_requests.* 
    FROM new_fund_requests 
    WHERE ${whereConditions} 
    AND reschedule_transfer = 0 
    AND total_approved_amount IS NOT NULL 
    AND total_approved_amount <> 0 
    ${search_value} 
    ORDER BY new_fund_requests.id ASC 
    LIMIT ${pageFirstResult}, ${pageSize}
`;

        const queryResult = await db.query(selectQuery);


        // const selectQuery = `SELECT new_fund_requests.* FROM new_fund_requests WHERE reschedule_transfer = 0 AND status IN ('1', '4') AND total_approved_amount IS NOT NULL AND total_approved_amount <> 0 ${search_value} ORDER BY new_fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;
        // const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (let i = 0; i < queryResult.length; i++) {
                const row = queryResult[i];
                let actualStatus;
                if (row.status == '4') {
                    actualStatus = 'Rescheduled';
                } else if (row.status == '1') {
                    actualStatus = 'Rescheduled';
                }

                const request_by_details = await getCreatedByDetails(row.request_by);
                const created_by_details = await getCreatedByDetails(row.created_by);
                const approved_by_details = await getCreatedByDetails(row.approved_by);
                const request_data = JSON.parse(row.request_data);

                let totalSum = 0;

                // Iterate over request_fund array and sum up fund_amount
                if (request_data.request_fund) {
                    for (const item of request_data.request_fund) {
                        totalSum += item.fund_amount;
                    }

                }

                let totalSums = 0;
                // Iterate over new_request_fund array and sum up fund_amount
                if (request_data.new_request_fund) {
                    for (const item of request_data.new_request_fund) {
                        totalSums += item.fund_amount;
                    }

                }

                let total = Number(totalSum) + Number(totalSums);

                finalData.push({
                    id: row.id,
                    reschdule_transfer: row.reschdule_transfer,
                    unique_id: row.unique_id,
                    request_by_id: created_by_details.id ? created_by_details.id : '',
                    request_by: created_by_details.name ? created_by_details.name : '',
                    request_by_image: created_by_details.image ? created_by_details.image : '',
                    request_by_employee_id: created_by_details.employee_id ? created_by_details.employee_id : '',
                    request_date: moment(row.request_date).format('DD-MM-YYYY HH:mm:ss A'),
                    total_request_amount: total,
                    total_approved_amount: row.total_approved_amount,
                    transfer_data: row.transfer_data ? JSON.parse(row.transfer_data) : null,
                    total_transfer_amount: row.total_transfer_amount || 0,
                    status: actualStatus,
                    request_data: request_data,
                    approved_by: approved_by_details.name ? approved_by_details.name : '',
                    approved_by_image: approved_by_details.image ? approved_by_details.image : '',
                    approved_by_employee_id: approved_by_details.employee_id ? approved_by_details.employee_id : '',
                    approved_date: moment(row.approved_at).format('DD-MM-YYYY HH:mm:ss A'),
                    designation_amount: row.total_request_amount - row.total_approved_amount,
                    request_for_id: request_by_details.id ? request_by_details.id : '',
                    request_for: request_by_details.name ? request_by_details.name : '',
                    request_for_image: request_by_details.image ? request_by_details.image : '',
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : '',
                })
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getAllPreviousPrice = async (req, res) => {

    try {

        const request_for_id = req.params.request_for_id;
        const { error } = checkPositiveInteger.validate({ id: request_for_id });

        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const queryResult = await db.query(`SELECT SUM(request_amount) AS total_request_amount, SUM(transfer_amount) AS total_transfer_amount, request_by FROM fund_requests WHERE request_by = ?`, [request_for_id]);

        const finalBalance = queryResult[0].total_request_amount - queryResult[0].total_transfer_amount || 0;

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult, finalBalance: finalBalance });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getAllOldItemInFunds = async (req, res) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }
        const queryResult = await db.query(`SELECT fr.id, im.name AS item_name, fr.item_price, fr.request_by, fr.request_qty, fr.request_amount,  DATE_FORMAT(fr.request_date, '%d-%m-%Y') as date FROM fund_requests AS fr LEFT JOIN item_masters AS im ON fr.item_id = im.id WHERE fr.request_by ='${id}'`);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


async function addItemFromFundRequestToItemMasters(newRequestData) {
    try {
        const insertIds = [];

        for (const requestData of newRequestData) {
            const {
                supplier_id,
                unit_id,
                description,
                item_image,
                title,
                rate,
                qty,
                hsncode,
            } = requestData;

            if (typeof title.value == 'string') {
                var storePath = '';
                const processedImages = [];

                const base64File = item_image.replace(/^data:image\/\w+;base64,/, '');
                const result = await convertBase64Image(base64File, './public/item_masters/', '/item_masters/');
                processedImages.push(result);

                storePath = processedImages.join(', ');
                const generateAutomatically = await generateRandomNumber(10);

                const insertQuery = `INSERT INTO item_masters SET name = '${title.value}', rate = '${rate}', qty = '${qty}', image = '${storePath}', hsncode = '${hsncode}', supplier_id = '${supplier_id}', unique_id = '${generateAutomatically}', status = '1', unit_id = '${unit_id.value}'`;

                const getResult = await db.query(insertQuery);

                if (getResult.affectedRows > 0) {
                    insertIds.push(getResult.insertId);

                }
            }
        }

        return insertIds;
    } catch (error) {
        return error.message;
    }
}


const getLastThreePrevPrice = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const selectQuery = await db.query(`SELECT fr.id, im.name AS item_name, fr.item_price, fr.request_by, fr.request_qty, fr.request_amount, fr.request_date as date  FROM fund_requests AS fr JOIN item_masters AS im ON fr.item_id = im.id WHERE fr.item_id = '${id}' AND fr.request_by = '${userId}' ORDER BY fr.request_date DESC LIMIT 3;`)
        if (selectQuery.length > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: selectQuery });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

async function removeItemToFundRequest(id) {
    try {
        const getApprovedRequestedFundDetails = await db.query(`SELECT * FROM new_fund_requests WHERE id = ?`, [id]);
        if (getApprovedRequestedFundDetails.length > process.env.VALUE_ZERO) {
            const requestedData = getApprovedRequestedFundDetails[0];
            const request_by = requestedData.request_by;

            const request_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const created_by = requestedData.created_by;

            if (requestedData.approval_data != null && requestedData.approval_data !== undefined) {
                const getApproval = requestedData.approval_data;
                const getApprovalData = JSON.parse(getApproval);
                const allRequests = getApprovalData.request_fund.concat(getApprovalData.new_request_fund);

                for (const row of allRequests) {

                    if (row.item_name && row.item_name.value) {
                        const existingItem = await db.query(`SELECT * FROM fund_requests WHERE request_by = ? AND item_id = ? AND item_price = ?`, [request_by, row.item_name.value, row.price]);

                        if (existingItem.length > process.env.VALUE_ZERO) {
                            //---------------update Fund request-------------------------------- 
                            const request_qty = Number(existingItem[0].request_qty) - Number(row.quantity);
                            const request_amount = Number(existingItem[0].request_amount) - Number(row.quantity * row.price);

                            const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE request_by = ? AND item_id = ?`;
                            await db.query(updateQuery, [request_qty, request_amount, created_by, request_by, row.item_name.value]);
                        }
                    } else if (row.title && (row.title.label || row.title.value)) {
                        // If item_name and item_name.value are not present, but title.label or title.value is present
                        if (!isNaN(row.title.value) && Number(row.title.value) !== 0) { // If title.value is a non-zero number

                            const existingItem = await db.query(`SELECT * FROM fund_requests WHERE item_id = ? AND  item_price = ? AND request_by = ? `, [row.title.value, row.rate, request_by]);
                            if (existingItem.length > 0) {

                                const request_qty = Number(existingItem[0].request_qty) - Number(row.qty);
                                const request_amount = Number(existingItem[0].request_amount) - Number(row.qty * row.rate);

                                const updateQuery = `UPDATE fund_requests SET request_qty = ?, request_amount = ?, updated_by = ? WHERE item_id = ?`;
                                await db.query(updateQuery, [request_qty, request_amount, created_by, row.title.value]);
                            }
                        } else {

                            const existingItem = await db.query(`SELECT * FROM fund_requests WHERE new_item = ? AND  item_price = ? AND request_by = ? `, [row.title.value, row.rate, request_by]);
                            if (existingItem.length > 0) {
                                const request_qty = Number(existingItem[0].request_qty) - Number(row.qty);
                                const request_amount = Number(existingItem[0].request_amount) - (Number(row.rate) * Number(row.qty));

                                const updateQuery = `UPDATE fund_requests SET request_amount = ?, request_qty = ? WHERE new_item = ? AND item_price = ? AND request_by = ?`;
                                await db.query(updateQuery, [request_amount, request_qty, row.title.value, row.rate, request_by]);
                            }

                        }
                    }

                }
            }
        }
    } catch (error) {
        return error.message;
    }
}

module.exports = { fundRequest, getAllFundRequests, getAllApprovedFundRequests, getAllRejectedFundRequests, getFundRequestById, updateFundRequest, deleteFundRequest, getFundRequestOnComplaintUniqueId, changeStatusOfFundRequest, getFundDetailsOnItemId, rejectFundRequest, getAllApprovedFundAndPartialTransfer, getPendingTransferFund, getFundRequestFourLowPrice, reActiveToRejectedFundRequest, reschduleTransferFund, getAllPreviousPrice, getAllOldItemInFunds, getLastThreePrevPrice }