var moment = require('moment');
require('dotenv').config();
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { proformaInvoiceValidation, checkPositiveInteger, poChangeValidation } = require('../helpers/validation');
const { calculatePagination, getCreatedByDetails, getCreatedUserNameFromAdmin, getPoDetailById, getComplaintAndComplaintTypeById, getRegionalNameById, getComplaintUniqueId, getEnergyCompaniesById, getCompanyName } = require('../helpers/general');
const { getCompanyDetailsById, getStateById, getRegionalOfficeById, measurementDetailsWithPoAndComplaint, getLastFinancialYearBillNoForPI, getMeasurementsItemsSubChildById, measurementDetailsWithPoAndComplaints, getMeasurementsItemsById, getLastBillNoForMergedPI, generatePINumber, generateMPINumber } = require('../helpers/commonHelper');
const { getOutletById } = require('./outletController');
const { get } = require('lodash');


const generateProformaInvoice = async (req, res) => {
    try {
        const { billing_from, billing_from_state, billing_to, billing_to_ro_office, financial_year, po_number, measurements, work, complaint_id, complaint_for } = req.body;
// return
        const created_by = req.user.user_id;
        const lastBillNumber = await generatePINumber(billing_to, complaint_for);

        const insertQuery = "INSERT INTO proforma_invoices (billing_from, billing_from_state, billing_to, billing_to_ro_office, financial_year, bill_no, po_number, measurements, work, created_by, complaint_id, complaint_for) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const insertValues = [billing_from, billing_from_state, billing_to, billing_to_ro_office, financial_year, lastBillNumber, po_number, JSON.stringify(measurements), work, created_by, complaint_id.join(','), complaint_for];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows === 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Error! Proforma invoice not created"
            });
        }

        for (let item of measurements) {
            const updatePiStatus = await changePiStatusMeasurements(item.measurement_list, '1')
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Proforma invoice created successfully"
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}


const getAllProformaInvoices = async (req, res) => {
    try {

        const status = req.query.status;

        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_value = "";
        const { regional_office_id, po_id, bill_number } = req.query
        let whereConditions = ''

        if (regional_office_id) {
            whereConditions += ` and proforma_invoices.billing_to_ro_office='${regional_office_id}'`
        }
        if (po_id) {
            whereConditions += ` and proforma_invoices.po_number='${po_id}'`
        }
        if (bill_number) {
            whereConditions += ` and proforma_invoices.bill_no='${bill_number}'`
        }

        if (searchData !== null && searchData !== '') {
            search_value += ` and (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT proforma_invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id 
            FROM proforma_invoices 
            LEFT JOIN regional_offices ON regional_offices.id = proforma_invoices.billing_to_ro_office 
            LEFT JOIN purchase_orders ON purchase_orders.id = proforma_invoices.po_number
            WHERE proforma_invoices.status = '${status}' ${whereConditions}  ${search_value} 
            ORDER BY proforma_invoices.id DESC  LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            const finalData = [];
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const getMeasurement = row.measurements ? JSON.parse(row.measurements) : null;

                if (getMeasurement) {
                    const complaintDetails = [];
                    for (let item of getMeasurement) {
                        const getComplaintId = await getComplaintIdMeasurement(item.measurement_list);
                        const complaint = await getComplaintUniqueId(getComplaintId.complaint_id);
                        complaintDetails.push(complaint);
                    }

                    row.complaintDetails = complaintDetails;

                }

                const getOutletDetail = await getOutletDetails(row.complaintDetails);


                // Fetching other details for the final data structure
                const billingFrom = await getCompanyDetailsById(row.billing_from);
                const billingFromData = { company_id: billingFrom.company_id, company_name: billingFrom.company_name };

                const state = await getStateById(row.billing_from_state);

                // const billingTo = await getCompanyDetailsById(row.billing_to);
                // const billingToData = { company_id: billingTo.company_id, company_name: billingTo.company_name };

                const billingToData = await getBillingToData(queryResult[0].billing_to, queryResult[0].complaint_for);

                const regionalOffice = await getRegionalOfficeById(row.billing_to_ro_office);
                const regionalOfficeData = { ro_id: regionalOffice.id, ro_name: regionalOffice.regional_office_name };

                const createdByDetails = await getCreatedByDetails(row.created_by);

                finalData.push({
                    id: row.id,
                    billing_from: billingFromData,
                    billing_from_state: state.name,
                    billing_to: billingToData,
                    billing_to_ro_office: regionalOfficeData,
                    financial_year: row.financial_year,
                    bill_no: row.bill_no,
                    po_number: row.po_number,
                    po_id: row.po_id,
                    measurements: JSON.parse(row.measurements),
                    work: row.work,
                    created_by: row.created_by,
                    created_by_name: createdByDetails.name,
                    created_at: moment(row.created_at).format('DD-MM-YYYY'),
                    complaintDetails: row.complaintDetails,
                    is_merged: row.is_merged,
                    outletDetails: getOutletDetail
                });
            }


            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                pageDetails: pageDetails
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}


// const getProformaInvoicesDetailsById = async (req, res) => {

//     try {
//         const id = req.params.id;

//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) {
//             return res
//                 .status(StatusCodes.FORBIDDEN)
//                 .json({
//                     status: false,
//                     message: error.message
//                 });
//         }

//         const selectQuery = `SELECT proforma_invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id, purchase_orders.po_date, measurements.id as measurement_id, measurements.measurement_unique_id, proforma_invoices.measurements FROM proforma_invoices LEFT JOIN regional_offices ON regional_offices.id = proforma_invoices.billing_to_ro_office LEFT JOIN purchase_orders ON purchase_orders.id = proforma_invoices.po_number LEFT JOIN measurements ON measurements.id = proforma_invoices.measurement_list WHERE proforma_invoices.id = ?`

//         const queryResult = await db.query(selectQuery, [id]);

//         if (queryResult.length > 0) {

//             const getMeasurements = queryResult[0].measurements ? JSON.parse(queryResult[0].measurements) : null
//             const getDetail = queryResult[0]

//             const complaintDetails = []
//             if (Array.isArray(getMeasurements) && getMeasurements.length > 0) {
//                 for (let item of getMeasurements) {
//                     const getComplaintId = await getComplaintIdMeasurement(item.measurement_list)
//                     const complaint = await getComplaintUniqueId(getComplaintId.complaint_id)

//                     complaintDetails.push(complaint)
//                 }

//             }

//             // var outletDetails = []
//             // for (let i = 0; i < complaintDetails.length; i++) {
//             //     const outletData = complaintDetails[i]

//             //     if (outletData.complaint_for == '1') {
//             //         // Use parameterized query to get the outlet_id from complaints
//             //         const selectOutlets = await db.query('SELECT outlet_id FROM complaints WHERE id = ?', [outletData.id]);

//             //         if (selectOutlets.length > 0) {
//             //             let outletId = selectOutlets[0].outlet_id;

//             //             // If outletId is a string, check if it needs to be parsed
//             //             if (typeof outletId === 'string') {
//             //                 // Check if outletId is a string in the format '[number]'
//             //                 if (outletId.startsWith('[') && outletId.endsWith(']')) {
//             //                     outletId = outletId.slice(1, -1); // Remove the square brackets
//             //                 }
//             //             }

//             //             // Use parameterized query with FIND_IN_SET
//             //             const query = `SELECT outlet_name, id FROM outlets WHERE FIND_IN_SET(id, ?)`;
//             //             const outlets = await db.query(query, [outletId]);

//             //             if (outlets.length > 0) {
//             //                 outletDetails.push(...outlets);
//             //             } else {
//             //                 outletDetails = [];
//             //             }
//             //         } else {
//             //             outletDetails = [];
//             //         }
//             //     } else {
//             //         outletDetails = [];
//             //     }

//             // }

//             const getOutletDetail = await getOutletDetails(complaintDetails);

//             // add complaint details
//             getDetail.complaintDetails = complaintDetails
//             getDetail.getOutletDetail = getOutletDetail
//             const billingFrom = await getCompanyDetailsById(getDetail.billing_from);

//             const billingFromData = { company_id: billingFrom.company_id, company_name: billingFrom.company_name, company_address: billingFrom.company_address, gst_number: billingFrom.gst_number };
//             // state details
//             const state = await getStateById(getDetail.billing_from_state);


//             const billingToData = await getBillingToData(getDetail.billing_to, queryResult[0].complaint_for);

//             // get regional office details
//             const regionalOffice = await getRegionalOfficeById(getDetail.billing_to_ro_office);
//             const regionalOfficeData = { ro_id: regionalOffice.id, ro_name: regionalOffice.regional_office_name };
//             const createdByDetails = await getCreatedByDetails(getDetail.created_by);

//             const field = {
//                 billing_from: billingFromData,
//                 billing_from_state: state.name,
//                 billing_from_state_id: getDetail.billing_from_state,
//                 billing_to: billingToData,
//                 billing_to_ro_office: regionalOfficeData,
//                 financial_year: getDetail.financial_year,
//                 bill_no: getDetail.bill_no,
//                 po_id: getDetail.po_id,
//                 po_number: getDetail.po_number,
//                 po_date: moment(getDetail.po_date).format('DD-MM-YYYY'),
//                 work: getDetail.work,
//                 created_by: getDetail.created_by,
//                 created_by_name: createdByDetails.name,
//                 created_at: moment(getDetail.created_at).format('DD-MM-YYYY'),
//                 regional_office_name: getDetail.regional_office_name,
//                 complaintDetails: getDetail.complaintDetails,
//                 complaint_for: getDetail.complaint_for,
//                 outletDetails: getDetail.getOutletDetail
//             }

//             if (Array.isArray(getMeasurements) && getMeasurements.length > 0) {
//                 for (const item of getMeasurements) {
//                     // Get Complaint details

//                     const getComplaintId = await getComplaintIdMeasurement(item.measurement_list);
//                     const complaint = await getComplaintUniqueId(getComplaintId.complaint_id);

//                     // Move the complaint details to a nested complainsDetails object within each item
//                     item.complaintDetails = {
//                         complaint_id: complaint.id,
//                         complaint_unique_id: complaint.complaint_unique_id,
//                         id: id
//                     };

//                     let total_amount = 0;

//                     // Function to process item details
//                     const processItemDetails = async (detailsArray, measurementList) => {
//                         if (!detailsArray || detailsArray.length === 0) {
//                             return [];
//                         }
//                         const uniqueItemsMap = new Map();
//                         const itemIds = detailsArray.map(detail => detail.order_line_number);
//                         const itemDetails = await getItemsDetailsById(itemIds, measurementList, queryResult[0].po_id);
//                         if (itemDetails.length > 0) {
//                             for (const mainItem of itemDetails) {
//                                 // Get all subChild data
//                                 const subChildData = await getMeasurementsItemsSubChildById(mainItem.measurement_id, mainItem.order_line_number);
//                                 total_amount += mainItem.amount;

//                                 const key = mainItem.order_line_number;
//                                 if (!uniqueItemsMap.has(key)) {
//                                     uniqueItemsMap.set(key, {
//                                         order_line_number: mainItem.order_line_number,
//                                         item_name: mainItem.item_name,
//                                         rate: mainItem.rate,
//                                         unit: mainItem.unit_name,
//                                         total_qty: mainItem.total_quantity,
//                                         measurement_id: mainItem.measurement_id,
//                                         is_status: detailsArray.find(detail => detail.item_id === mainItem.order_line_number)?.is_status,
//                                         childArray: subChildData
//                                     });
//                                 }
//                             }
//                         }
//                         return Array.from(uniqueItemsMap.values());
//                     };

//                     // Process items_data
//                     item.items_data = await processItemDetails(item.item_details, item.measurement_list);
//                 }
//             }


//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Fetched successfully",
//                     data: { ...field, getMeasurements },
//                 })
//         }
//         else {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: "Data not found",
//                 })
//         }

//     }
//     catch (error) {
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: error.message
//             })
//     }
// }


const getProformaInvoicesDetailsById = async (req, res) => {

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

        const selectQuery = `SELECT proforma_invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id, purchase_orders.po_date, measurements.id as measurement_id, measurements.measurement_unique_id, proforma_invoices.measurements FROM proforma_invoices LEFT JOIN regional_offices ON regional_offices.id = proforma_invoices.billing_to_ro_office LEFT JOIN purchase_orders ON purchase_orders.id = proforma_invoices.po_number LEFT JOIN measurements ON measurements.id = proforma_invoices.measurement_list WHERE proforma_invoices.id = ?`

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > 0) {

            const getMeasurements = queryResult[0].measurements ? JSON.parse(queryResult[0].measurements) : null
            const getDetail = queryResult[0]

            const complaintDetails = []
            if (Array.isArray(getMeasurements) && getMeasurements.length > 0) {
                for (let item of getMeasurements) {
                    const getComplaintId = await getComplaintIdMeasurement(item.measurement_list)
                    const complaint = await getComplaintUniqueId(getComplaintId.complaint_id)

                    complaintDetails.push(complaint)
                }

            }

            const getOutletDetail = await getOutletDetails(complaintDetails);

            // add complaint details
            getDetail.complaintDetails = complaintDetails
            getDetail.getOutletDetail = getOutletDetail
            const billingFrom = await getCompanyDetailsById(getDetail.billing_from);

            const billingFromData = { company_id: billingFrom.company_id, company_name: billingFrom.company_name, company_address: billingFrom.company_address, gst_number: billingFrom.gst_number };
            // state details
            const state = await getStateById(getDetail.billing_from_state);


            const billingToData = await getBillingToData(getDetail.billing_to, queryResult[0].complaint_for);

            // get regional office details
            const regionalOffice = await getRegionalOfficeById(getDetail.billing_to_ro_office);
            const regionalOfficeData = { ro_id: regionalOffice.id, ro_name: regionalOffice.regional_office_name };
            const createdByDetails = await getCreatedByDetails(getDetail.created_by);

            const field = {
                billing_from: billingFromData,
                billing_from_state: state.name,
                billing_from_state_id: getDetail.billing_from_state,
                billing_to: billingToData,
                billing_to_ro_office: regionalOfficeData,
                financial_year: getDetail.financial_year,
                bill_no: getDetail.bill_no,
                po_id: getDetail.po_id,
                po_number: getDetail.po_number,
                po_date: moment(getDetail.po_date).format('DD-MM-YYYY'),
                work: getDetail.work,
                created_by: getDetail.created_by,
                created_by_name: createdByDetails.name,
                created_at: moment(getDetail.created_at).format('DD-MM-YYYY'),
                regional_office_name: getDetail.regional_office_name,
                complaintDetails: getDetail.complaintDetails,
                complaint_for: getDetail.complaint_for,
                outletDetails: getDetail.getOutletDetail
            }

            if (Array.isArray(getMeasurements) && getMeasurements.length > 0) {
                for (const item of getMeasurements) {
                    // Get Complaint details
                    const getItemDetails = await db.query(`SELECT DISTINCT order_line_number FROM measurement_items WHERE measurement_id = ?`, [item.measurement_list]);

                    const getComplaintId = await getComplaintIdMeasurement(item.measurement_list);
                    const complaint = await getComplaintUniqueId(getComplaintId.complaint_id);

                    // Move the complaint details to a nested complaintDetails object within each item
                    item.complaintDetails = {
                        complaint_id: complaint.id,
                        complaint_unique_id: complaint.complaint_unique_id,
                        id: id
                    };

                    let total_amount = 0;

                    // Function to process item details
                    const processItemDetails = async (itemDetailsArray, measurementList) => {
                        if (!itemDetailsArray || itemDetailsArray.length === 0) {
                            return [];
                        }
                        const uniqueItemsMap = new Map();
                        const itemIds = itemDetailsArray.map(detail => detail.order_line_number);
                        const itemDetails = await getItemsDetailsById(itemIds, measurementList, queryResult[0].po_id);

                        if (itemDetails.length > 0) {
                            for (const mainItem of itemDetails) {
                                // Get all subChild data
                                const subChildData = await getMeasurementsItemsSubChildById(mainItem.measurement_id, mainItem.order_line_number);
                                total_amount += mainItem.amount;

                                const key = mainItem.order_line_number;
                                if (!uniqueItemsMap.has(key)) {
                                    uniqueItemsMap.set(key, {
                                        order_line_number: mainItem.order_line_number,
                                        item_name: mainItem.item_name,
                                        rate: mainItem.rate,
                                        unit: mainItem.unit_name,
                                        total_qty: mainItem.total_quantity,
                                        measurement_id: mainItem.measurement_id,
                                        is_status: itemDetailsArray.find(detail => detail.order_line_number === mainItem.order_line_number)?.is_status,
                                        childArray: subChildData
                                    });
                                }
                            }
                        }
                        return Array.from(uniqueItemsMap.values());
                    };

                    // Process items_data
                    item.items_data = await processItemDetails(getItemDetails, item.measurement_list);
                }
            }


            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: { ...field, getMeasurements },
                })
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


const getBillingToData = async (billingToId, isEnergyCompany) => {
    let queryResult;

    if (isEnergyCompany == 1) {
        queryResult = await db.query(`SELECT id, name FROM energy_companies WHERE id = ?`, [billingToId]);
    } else {
        queryResult = await db.query(`SELECT company_id AS id, company_name AS name, company_address, gst_number FROM companies WHERE company_id = ?`, [billingToId]);
    }

    if (queryResult.length === 0) {
        throw new Error('Company not found');
    }

    const billingTo = queryResult[0];

    return {
        company_id: billingTo.id,
        company_name: billingTo.name,
        company_address: billingTo.company_address || '',
        gst_number: billingTo.gst_number || ''
    };
};

    
const updateProformaInvoiceDetails = async (req, res) => {

    try {

        const { billing_from, billing_from_state, billing_to, billing_to_ro_office, financial_year, po_number, measurements, work, id, status } = req.body;
        // return 
        const { error } = proformaInvoiceValidation.validate(req.body);

        if (error) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const updateQuery = "UPDATE proforma_invoices SET billing_from = ?, billing_from_state = ?, billing_to = ?, billing_to_ro_office = ?, financial_year = ?, po_number = ?, measurements = ?, work = ?, updated_by = ?, status = ? WHERE id = ?";

        const updated_by = req.user.user_id;

        const updateValues = [billing_from, billing_from_state, billing_to, billing_to_ro_office, financial_year, po_number, JSON.stringify(measurements), work, updated_by, status, id];
        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "proforma invoice update successfully"
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Error! proforma invoice not created"
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


const deleteProformaInvoices = async (req, res) => {

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

        const deleteQuery = "DELETE FROM proforma_invoices WHERE id = ?";
        const queryResult = await db.query(deleteQuery, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "proforma invoice delete successfully"
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Error! proforma invoice not deleted"
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


const getAllProformaInvoiceOnPoId = async (req, res) => {

    try {

        const po_id = req.params.po_id;

        if (po_id != null && po_id != undefined) {

            const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
            const currentPage = parseInt(req.query.pageNo) || 1;
            const searchData = req.query.search || '';
            const pageFirstResult = (currentPage - 1) * pageSize;
            var search_value = "";

            if (searchData != null && searchData != '') {
                search_value += `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
            }

            const selectQuery = `SELECT proforma_invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, measurements.id as measurement_id, measurements.measurement_unique_id, measurements.po_id FROM proforma_invoices LEFT JOIN regional_offices ON regional_offices.id = proforma_invoices.billing_to_ro_office LEFT JOIN purchase_orders ON purchase_orders.id = proforma_invoices.po_number LEFT JOIN measurements ON measurements.id = proforma_invoices.measurement_list WHERE proforma_invoices.po_number = '${po_id}' ${search_value} ORDER BY proforma_invoices.id DESC LIMIT ${pageFirstResult} , ${pageSize}`

            const queryResult = await db.query(selectQuery);

            const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
            const totalResult = await db.query(modifiedQueryString);

            if (queryResult.length > process.env.VALUE_ZERO) {

                var finalData = [];
                var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

                for (const row of queryResult) {
                    // get complaint number and outlet name
                    const poComplaintAndOutletData = await measurementDetailsWithPoAndComplaint(row.po_id);

                    //from company details
                    const billingFrom = await getCompanyDetailsById(row.billing_from);
                    const billingFromData = { company_id: billingFrom.company_id, company_name: billingFrom.company_name };
                    // state details
                    const state = await getStateById(row.billing_from_state);

                    const billingTo = await getCompanyDetailsById(row.billing_to);
                    const billingToData = { company_id: billingTo.company_id, company_name: billingTo.company_name };
                    // get regional office details
                    const regionalOffice = await getRegionalOfficeById(row.billing_to_ro_office);
                    const regionalOfficeData = { ro_id: regionalOffice.id, ro_name: regionalOffice.regional_office_name };
                    const createdByDetails = await getCreatedByDetails(row.created_by);

                    finalData.push({

                        id: row.id,
                        billing_from: billingFromData,
                        billing_from_state: state.name,
                        billing_to: billingToData,
                        billing_to_ro_office: regionalOfficeData,
                        financial_year: row.financial_year,
                        bill_no: row.bill_no,
                        po_number: row.po_number,
                        measurement_list: row.measurement_list,
                        work: row.work,
                        created_by: row.created_by,
                        created_by_name: createdByDetails.name,
                        created_at: moment(row.created_at).format('DD-MM-YYYY'),
                        measurement_id: row.measurement_id,
                        measurement_unique_id: row.measurement_unique_id,
                        complaint_unique_id: poComplaintAndOutletData.data.complaint_unique_id,
                        outlet_name: poComplaintAndOutletData.data.outlet_name,
                        item_details_format: JSON.parse(row.item_details),
                        is_merged: row.is_merged,
                    });
                }

                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: true,
                        message: "Fetched successfully",
                        data: finalData,
                        pageDetails: pageDetails
                    })
            }
            else {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: false,
                        message: "No data found"
                    })
            }
        }
        else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: "Purchase order is required"
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


async function getItemsDetailsById(id, measurement_id, po_id) {
    try {
        let mainIds

        if (typeof id === "object") {
            mainIds = id.join(",")
        } else {
            mainIds = id
        }
        const query = `SELECT DISTINCT measurement_items.id, measurement_items.measurement_id,purchase_order_item.name AS item_name, purchase_order_item.hsn_code, measurement_items.order_line_number, measurement_items.unit_id AS unit_name, measurement_items.number, measurement_items.length, measurement_items.breadth, measurement_items.depth, measurement_items.quantity, measurement_items.total_quantity, measurement_items.rate, measurement_items.amount, measurements.po_id, complaints.id AS complaint_id, complaints.complaint_unique_id FROM measurement_items LEFT JOIN purchase_order_item ON purchase_order_item.order_line_number = measurement_items.order_line_number LEFT JOIN measurements ON measurements.id = measurement_items.measurement_id LEFT JOIN complaints ON measurements.complaint_id = complaints.id WHERE measurement_items.measurement_id = ${measurement_id} AND measurement_items.po_id = ${po_id} AND measurement_items.order_line_number IN (${mainIds});`

        const queryResult = await db.query(query);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        }
        else {
            return [];
        }

    } catch (error) {

        return error.message;
    }
}


const multiComplaints = async (req, res) => {
    try {
        const { complaint_id } = req.body;

        for (let i = 0; i < complaint_id.length; i++) {
            const selectQuery = await db.query(`SELECT * FROM measurements WHERE id = '${complaint_id[i]}' AND status = '5' `)
            if (selectQuery.length > 0) {
                const selectQuery2 = await db.query()
            }

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


const getAllMeasurementsInPIStatus = async (req, res) => {

    try {

        const status = req.query.status;
        const po_id = req.query.po_id;
        const regional_office_id = req.query.regional_office_id;
        const complaint_id = req.query.complaint_id;
        const energy_company_id = req.query.energy_company_id;
        const complaint_for = req.query.complaint_for;
        let whereConditions;

        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (!status) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Error! Measurement status is required."
                });
        }

        if (searchData != null && searchData != '') {
            search_value += `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR measurements.measurement_date LIKE '${searchData}'`;
        }

        if (status) {
            whereConditions = ` WHERE measurements.status = '${status}' AND pi_status = '0'`
        }

        if (po_id) {
            whereConditions += ` AND measurements.po_id = '${po_id}'`;
        }

        if (regional_office_id) {
            whereConditions += ` AND measurements.ro_office_id = '${regional_office_id}'`;
        }

        if (energy_company_id) {
            whereConditions += ` AND measurements.energy_company_id = '${energy_company_id}' AND measurements.complaint_for = '${complaint_for}'`;
        }

        if (complaint_id) {
            whereConditions += ` AND measurements.complaint_id = '${complaint_id}'`;
        }
        
        const selectQuery = `SELECT measurements.*, regional_offices.regional_office_name, sales_area.sales_area_name, outlets.outlet_name, complaints.complaint_unique_id, complaints.complaint_for, complaints.order_by_id, complaints.energy_company_id, users.name AS order_by_name FROM measurements LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id LEFT JOIN outlets ON outlets.id = measurements.outlet_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id LEFT JOIN users ON users.id = complaints.order_by_id ${whereConditions} ${search_value} ORDER BY measurements.measurement_date DESC LIMIT ${pageFirstResult} , ${pageSize}`

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        let actualStatus;
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                const complaintTypeDetail = await getComplaintAndComplaintTypeById(row.complaint_id);

                let query;
                if (row.complaint_for === '1') {
                    query = await db.query(`SELECT id, name FROM energy_companies WHERE id = ?`, [row.energy_company_id]);

                } else {
                    query = await db.query(`SELECT company_id AS id, company_name AS name FROM companies WHERE company_id = ?`, [row.energy_company_id]);

                }




                // get all measurments item list
                const items = await getMeasurementsItemsById(row.id);

                if (status == '2') {
                    actualStatus = 'Discard'
                } else if (status == '3') {
                    actualStatus = 'Draft'
                } else if (status == '4') {
                    actualStatus = 'Pending To PI'
                } else if (status == '5') {
                    actualStatus = 'Ready To PI'
                }


                finalData.push({
                    id: row.id,
                    measurement_amount: "₹ " + row.amount,
                    measurement_date: moment(row.measurement_date).format('DD-MM-YYYY'),
                    financial_year: row.financial_year,
                    ro_office_id: row.ro_office_id,
                    sale_area_id: row.sale_area_id,
                    outlet_id: row.outlet_id,
                    order_by_id: row.order_by_id,
                    order_by_name: row.order_by_name,
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    po_limit: "₹ " + PoDetails.po_limit,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id ? row.complaint_unique_id : null,
                    complaint_type_name: complaintTypeDetail.complaint_type_name ? complaintTypeDetail.complaint_type_name : null,
                    complaint_for: row.complaint_for,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
                    outlet_name: row.outlet_name,
                    status: actualStatus,
                    items: items,
                    company_details: query[0]
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: finalData,
                    pageDetails: pageDetails,
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Data not found"
                });
        }

    }
    catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
}


const getAllPOFilters = async (req, res) => {
    try {
        const status = req.query.status;

        if (status) {
            selectQuery = await db.query(`SELECT * FROM measurements WHERE status='${status}' AND pi_status = '0' group by po_id ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT * FROM measurements group by po_id  ORDER BY id ASC;`)
        }

        if (selectQuery.length > process.env.VALUE_ZERO) {

            const getPo = selectQuery.map(item => item.po_id);
            const dataFilter = getPo.filter((value, index) => getPo.indexOf(value) === index)
            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const poDetails = await getPoById(dataFilter[i]);
                finalData.push(poDetails);
            }

            const flattenedData = finalData.flat();

            if (flattenedData.length > process.env.VALUE_ZERO) {

                return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: flattenedData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }

        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });

    }
}


const getAllComplaintsInPI = async (req, res) => {
    const { status, ro_id, po_id } = req.query;
    let selectQuery;

    if (status) {
        selectQuery = await db.query(`SELECT * FROM measurements WHERE status='${status}' AND ro_office_id='${ro_id}' AND po_id='${po_id}' AND pi_status='0' ORDER BY id ASC;`);
    } else {
        selectQuery = await db.query('SELECT * FROM measurements ORDER BY id ASC;');
    }

    if (selectQuery.length > process.env.VALUE_ZERO) {
        const getPo = selectQuery.map(item => item.complaint_id);
        const dataFilter = getPo.filter((value, index) => getPo.indexOf(value) === index);
        const finalData = [];

        for (let i = 0; i < dataFilter.length; i++) {
            const poDetails = await getUniqueComplaint(dataFilter[i]);
            finalData.push(poDetails);
        }

        const flattenedData = finalData.flat();
        const uniqueData = [];
        const seen = new Set();

        for (const item of flattenedData) {
            const key = `${item.company_id}-${item.complaint_for}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueData.push(item);
            }
        }

        if (uniqueData.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: uniqueData });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } else {
        return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
    }
};


const getUniqueComplaint = async (complaintId) => {
    if (complaintId != null) {
        const selectQuery = `SELECT id, complaints.energy_company_id, complaints.complaint_unique_id, complaint_for FROM complaints WHERE id = ?`
        const result = await db.query(selectQuery, complaintId);
        if (result.length > 0) {
            for (const row of result) {
                const companyName = await getCompanyNames(row.energy_company_id, row.complaint_for)
                return companyName;
            }

        }
    } else {
        return '';
    }
}

async function getCompanyNames(energy_company_id, complaint_for = null) {
    let queryResult;

    if (complaint_for == 1) {
        queryResult = await db.query(`SELECT name, id FROM energy_companies WHERE id = ?`, [energy_company_id]);
    } else {
        queryResult = await db.query(`SELECT company_name AS name, company_id AS id FROM companies WHERE company_id = ?`, [energy_company_id]);
    }

    if (queryResult.length === 0) {
        throw new Error(`No company found with the provided ID: ${energy_company_id}`);
    }

    return { company_name: queryResult[0].name, company_id: queryResult[0].id, complaint_for: complaint_for };
}


async function getPoById(poID) {
    const poIds = JSON.parse(poID)
    var sql = '';
    if (typeof poIds == 'object') {
        const commaSeparated = poIds.join(",");
        sql = `SELECT id , po_number FROM purchase_orders WHERE id IN('${commaSeparated}')`
    }
    else {
        sql = `SELECT id as id, po_number FROM purchase_orders
        WHERE id='${poID}'`;
    }

    return await db.query(sql);
}


const getAllROBasedOnPo = async (req, res) => {
    try {
        const status = req.query.status;
        const po_id = req.query.po_id;
        let selectQuery;
        if (status) {
            selectQuery = await db.query(`SELECT ro_office_id as ro_id, po_id, regional_office_name FROM measurements left join regional_offices ON regional_offices.id = measurements.ro_office_id WHERE measurements.status='${status}' AND measurements.po_id ='${po_id}' AND measurements.pi_status = '0' group by measurements.ro_office_id ORDER BY measurements.id ASC;`)
            
        } else {
            selectQuery = await db.query(`SELECT ro_office_id as ro_id, regional_office_name, po_id FROM measurements left join regional_offices ON regional_offices.id = measurements.ro_office_id  group by measurements.ro_office_id  ORDER BY measurements.id ASC;`)
        }

        if (selectQuery.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })

        }

        return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: selectQuery });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });

    }
}


const getAllROBasedOnComplaint = async (req, res) => {
    try {
        const status = req.query.status;
        const roId = req.query.ro_id
        const poId = req.query.po_id;
        if (!roId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Ro Id is required" })
        }
        if (status) {
            selectQuery = await db.query(`SELECT ro_office_id ,complaint_id FROM measurements WHERE status='${status}' AND ro_office_id='${roId}' AND po_id = '${poId}' AND pi_status = '0' ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT ro_office_id,complaint_id FROM measurements ORDER BY id ASC;`)
        }

        if (selectQuery.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
        for (let item of selectQuery) {
            const complaint = await getComplaintUniqueId(item.complaint_id);
            item.complaintDetails = complaint
        }
        return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: selectQuery });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const discardProformaInvoices = async (req, res) => {
    try {
        const { id } = req.params;
         
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Id is required." });
        }

        const selectQuery = `select * from  proforma_invoices where id=?`
        const getData = await db.query(selectQuery, [id])
        if (getData.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found." });
        }

        const getMeasurements = getData[0].measurements ? JSON.parse(getData[0].measurements) : null

        /** update measurement status */
        if (typeof getMeasurements === 'object' && getMeasurements) {
            for (let item of getMeasurements) {
                const updatePiStatus = await changePiStatusMeasurements(item.measurement_list, '0')
            }
        }

        const discardQuery = `update proforma_invoices set status=3 where id=?`
        const updateData = await db.query(discardQuery, [id])
        if (updateData.affectedRows === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Failed to discard." });
        }

        return res.status(StatusCodes.OK).json({ status: true, message: "Discarded successfully." });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


async function changePiStatusMeasurements(measurementId, pi_status = '0') {
    try {

        const updateQuery = await db.query('UPDATE measurements SET pi_status = ? WHERE id = ?', [pi_status, measurementId]);

    } catch (error) {
        throw error
    }
}


const getAllPOForProforma = async (req, res) => {
    try {
        const status = req.query.status;
        const invoice = req.query.invoice;
        if (invoice) {
            selectQuery = await db.query(`SELECT * FROM  proforma_invoices WHERE status IN('2', '4') group by po_number ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT * FROM  proforma_invoices WHERE status IN(${status}) group by po_number ORDER BY id ASC;`)
        }

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getPi = selectQuery.map(item => item.po_number);
            const dataFilter = getPi.filter((value, index) => getPi.indexOf(value) === index)
            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {

                const poDetails = await getPoById(dataFilter[i]);
                finalData.push(poDetails);
            }
            const flattenedData = finalData.flat();
            if (flattenedData.length > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: flattenedData });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });

    }
}


const getAllROFromProforma = async (req, res) => {
    try {
        const status = req.query.status;
        const po = req.query.po_id;
        const invoice = req.query.invoice;

        if (invoice && po) {
            selectQuery = await db.query(`SELECT id,billing_to_ro_office FROM  proforma_invoices WHERE status IN ('2', '4') AND po_number='${po}' group by billing_to_ro_office ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT id,billing_to_ro_office FROM  proforma_invoices WHERE status='${status}' AND po_number='${po}' group by billing_to_ro_office ORDER BY id ASC;`)
        }

        if (selectQuery.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
        const finalData = [];
        for (let item of selectQuery) {
            const ro = await getRegionalNameById(item.billing_to_ro_office);
            finalData.push({
                id: item.id,
                billing_to_ro_office: item.billing_to_ro_office,
                ro_id: ro[0].id,
                regional_office_name: ro[0].regional_office_name
            })

        }
        return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData });


    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


// const getAllBillNumberFromProforma = async (req, res) => {
//     try {
//         const { status, po_id, ro_id, invoice } = req.query;

//         let whereClause = ' WHERE status = ?';
//         if(invoice ){
//             const queryParams = [2, 4]
//         }else{
//             const queryParams = [status];
//         }


//         // Append conditions for `po_id` and `ro_id`
//         if (po_id) {
//             whereClause += ' AND po_number = ?';
//             queryParams.push(po_id);
//         }
//         if (ro_id) {
//             whereClause += ' AND billing_to_ro_office = ?';
//             queryParams.push(ro_id);
//         }

//         const query = `SELECT bill_no FROM proforma_invoices${whereClause}`;

//         const selectQuery = await db.query(query, queryParams);
//         if (selectQuery.length === 0) {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
//         }
//         return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: selectQuery });
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }


const getAllBillNumberFromProforma = async (req, res) => {
    try {
        const { status, po_id, ro_id, invoice } = req.query;
        let whereClause = '';

        // Handle the status and invoice conditions
        if (invoice) {
            whereClause = `WHERE status IN ('2', '4')`;
        } else if (status) {
            whereClause = `WHERE status = ${status}`;
        }

        // Add additional conditions to the whereClause
        if (po_id && ro_id) {
            whereClause += (whereClause ? ' AND' : ' WHERE') + ' po_number = ? AND billing_to_ro_office = ?';
        } else if (po_id) {
            whereClause += (whereClause ? ' AND' : ' WHERE') + ' po_number = ?';
        } else if (ro_id) {
            whereClause += (whereClause ? ' AND' : ' WHERE') + ' billing_to_ro_office = ?';
        }
        const query = `SELECT bill_no FROM proforma_invoices ${whereClause}`;

        const values = [];
        if (po_id) values.push(po_id);
        if (ro_id) values.push(ro_id);

        const selectQuery = await db.query(query, values); // Destructure to get the result array

        if (selectQuery.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
        return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: selectQuery });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getSamePoExistsOrNot = async (req, res) => {
    try {

        const po = req.query.po;
        const ro = req.query.ro;

        const getRo = await db.query(`Select ro_office from purchase_orders where id = '${po}'`)

        if (getRo.length > 0) {
            const getRoId = getRo[0].ro_office;
            const selectQuery = `SELECT po.id AS purchase_order_id, po_number FROM purchase_orders po WHERE po.ro_office = '${getRoId}' AND (SELECT COUNT(DISTINCT order_line_number) FROM purchase_order_item WHERE purchase_order_id = po.id) = (SELECT COUNT(DISTINCT order_line_number) FROM purchase_order_item WHERE purchase_order_id = '${po}') AND (SELECT COUNT(*) FROM purchase_order_item poi1 JOIN purchase_order_item poi2 ON poi1.order_line_number = poi2.order_line_number AND poi1.name = poi2.name WHERE poi1.purchase_order_id = po.id AND poi2.purchase_order_id = '${po}') = (SELECT COUNT(*) FROM purchase_order_item WHERE purchase_order_id = '${po}');`;

            const getData = await db.query(selectQuery);

            if (getData.length > 0) {
                return res.status(StatusCodes.OK).json({ status: true, data: getData })
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });

    }
}




const changePoInMeasurements = async (req, res) => {
    try {
        const { measurement_id, po_id, item } = req.body;

        const { error } = poChangeValidation.validate(req.body);
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message
            });
        }

        const updateMeasurement = await updateMeasurementItems(po_id, measurement_id, item)
        const updateQuery = `UPDATE measurements SET po_id = '${po_id}' WHERE id = '${measurement_id}'`
        const execQuery = await db.query(updateQuery)

        if (execQuery.affectedRows > 0) {
            const updates = `UPDATE measurement_items SET po_id = '${po_id}' WHERE measurement_id = '${measurement_id}'`
            const query = await db.query(updates)
            return res.status(StatusCodes.OK).json({ status: true, message: "Updated successfully" })
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Failed to update" })
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


async function updateMeasurementItems(po_id, measurement_id, items) {
    const updates = `UPDATE measurement_items SET po_id = ? WHERE measurement_id = ?`;
    const query = await db.query(updates, [po_id, measurement_id]);

    if (query.affectedRows > 0) {
        for (const item of items) {
            const { rate, order_line_number } = item; 
            const updateItem = `UPDATE measurement_items SET rate = ? WHERE measurement_id = ? AND order_line_number = ?`;
            await db.query(updateItem, [rate, measurement_id, order_line_number]);
        }
    }
}


async function getComplaintIdMeasurement(measurementId) {

    try {
        const query = `SELECT complaint_id FROM measurements WHERE id ='${measurementId}'`
        const getData = await db.query(query)
        return getData[0]

    } catch (error) {
        throw error
    }
}


const reactiveToDiscardPi = async (req, res) => {
    try {
        const { id } = req.params;

        const selectQuery = await db.query(`SELECT * FROM proforma_invoices WHERE id = '${id}' AND status != '3' `)

        if (selectQuery.length > 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "PI is already in progress." })
        }

        const status = '2';
        const updateQuery = await db.query("Update proforma_invoice SET status = ? WHERE id = ?", [status, id]);
        if (updateQuery.affectedRows > 0) {
            const getData = await db.query(`SELECT measurements FROM proforma_invoice WHERE id ='${id}'`)
            const getMeasurements = getData[0].measurements ? JSON.parse(getData[0].measurements) : null

            if (typeof getMeasurements === 'object' && getMeasurements) {
                for (let item of getMeasurements) {
                    const measurementsUpdates = await updateMeasurement(item.measurement_list)
                }
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Proforma invoice Reactive successfully." })
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Proforma invoice Reactive failed." })
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


async function updateMeasurement(id) {
    const updateQuery = await db.query(`UPDATE measurements SET pi_status = '1' WHERE id = '${id}' `)
}


async function getOutletDetails(complaintDetails) {
    let outletDetails = [];

    for (let i = 0; i < complaintDetails.length; i++) {
        const outletData = complaintDetails[i];

        if (outletData.complaint_for == '1') {
            // Use parameterized query to get the outlet_id from complaints
            const selectOutlets = await db.query('SELECT outlet_id FROM complaints WHERE id = ?', [outletData.id]);

            if (selectOutlets.length > 0) {
                let outletId = selectOutlets[0].outlet_id;

                // If outletId is a string in the format '[number]', remove the square brackets
                if (typeof outletId === 'string' && outletId.startsWith('[') && outletId.endsWith(']')) {
                    outletId = outletId.slice(1, -1); // Remove the square brackets
                }

                // Use parameterized query with FIND_IN_SET
                const query = `SELECT outlet_name, id FROM outlets WHERE FIND_IN_SET(id, ?)`;
                const outlets = await db.query(query, [outletId]);

                if (outlets.length > 0) {
                    outletDetails.push(...outlets);
                }
            }
        } else {
            outletDetails = [];
        }
    }

    const filteredResult = {};

    outletDetails.forEach(record => {
        if (!filteredResult[record.id]) {
            filteredResult[record.id] = record;
        }
    });

    const uniqueRecords = Object.values(filteredResult);
    return uniqueRecords;
}


// merged Performa invoice 




const roToBillingFromCompany = async (req, res) => {
    try {
        const { po_id, ro_id, invoice } = req.query;

        let whereConditions;
        if (invoice) {
            whereConditions = `AND proforma_invoices.status IN ('2', '4')`
        } else {
            whereConditions = `AND proforma_invoices.status =2`
        }


        selectQuery = await db.query(`SELECT companies.company_id as id, companies.company_name FROM proforma_invoices LEFT JOIN companies ON companies.company_id =  proforma_invoices.billing_from WHERE 
        proforma_invoices.po_number ='${po_id}' AND proforma_invoices.billing_to_ro_office = '${ro_id}' ${whereConditions} `)

        if (selectQuery.length > 0) {
            const uniqueResults = selectQuery.reduce((acc, record) => {
                if (!acc.some(item => item.id === record.id)) {
                    acc.push(record);
                }
                return acc;
            }, []);

            return res.status(StatusCodes.OK).json({ status: true, data: uniqueResults })

        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' })
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


const fromBillingToCompany = async (req, res) => {
    try {
        const { po_id, ro_id, billing_from, invoice } = req.query;

        if (!po_id || !ro_id || !billing_from) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Missing required query parameters."
            });
        }

        if (invoice) {
            whereConditions = `AND proforma_invoices.status IN ('2', '4')`
        } else {
            whereConditions = `AND proforma_invoices.status =2`
        }

        const selectQuery = await db.query(
            `SELECT po_number, billing_to_ro_office, billing_from, billing_to, complaint_id 
             FROM proforma_invoices 
             WHERE po_number = ? AND billing_to_ro_office = ? AND billing_from = ? ${whereConditions}`,
            [po_id, ro_id, billing_from]
        );

        if (selectQuery.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
        }

        let combinedComplaintIds = [];

        for (const row of selectQuery) {
            const complaintIds = row.complaint_id.split(','); // Split the complaint_id string into an array
            combinedComplaintIds = combinedComplaintIds.concat(complaintIds); // Combine arrays
        }

        const complaints = selectQuery[0].complaint_id;

        const getComplaints = await db.query(
            `SELECT energy_company_id, complaint_for FROM complaints WHERE id IN (${combinedComplaintIds.map(() => '?').join(',')})`,
            combinedComplaintIds
        );

        if (getComplaints.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: 'Complaint data not found' });
        }

        const final = [];
        for (const row of getComplaints) {
            let query;
            if (row.complaint_for === '1') {
                query = await db.query(`SELECT id, name FROM energy_companies WHERE id = ?`, [row.energy_company_id]);
            } else {
                query = await db.query(`SELECT company_id AS id, company_name AS name FROM companies WHERE company_id = ?`, [row.energy_company_id]);
            }
            final.push(...query);
        }

        // Remove duplicate entries from the final array based on id
        const uniqueResults = final.reduce((acc, record) => {
            if (!acc.some(item => item.id === record.id)) {
                acc.push(record);
            }
            return acc;
        }, []);

        return res.status(StatusCodes.OK).json({ status: true, data: uniqueResults });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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


const mergedPi = async (req, res) => {
    try {
        const { id, billing_from, billing_from_state, billing_to, billing_to_ro_office, financial_year, po_number, complaint_for } = req.body;
        const userId = req.user.user_id;
        const ids = id.join(','); 

        const financialYear = await checkFinancialYear(id, financial_year)

        // Get the combined complaint IDs
        const getComplaintId = await getComplaintsIdbyPI(ids);

        // Generate the last bill number
        const lastBillNumber = await generateMPINumber(billing_to, complaint_for);

        // Construct the INSERT query
        const insertQuery = `
        INSERT INTO proforma_invoices (merged_pi_id, billing_from, billing_from_state, billing_to, billing_to_ro_office, financial_year, po_number, complaint_id, complaint_for, bill_no, created_by, status, mpi_status
        ) VALUES ('${ids}', '${billing_from}', '${billing_from_state}', '${billing_to}', '${billing_to_ro_office}', '${financial_year}', '${po_number}', '${getComplaintId}', '${complaint_for}', '${lastBillNumber}', '${userId}', '4', '1' )`;

        const query = await db.query(insertQuery)

        if (query.affectedRows > 0) {
            const updateQuery = `UPDATE proforma_invoices SET status = '3' WHERE id IN (${id.map(() => '?').join(',')})`;
            const updatePerforma = await db.query(updateQuery, id);

            if (updatePerforma.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'Performa Invoice Merged successfully'
                });
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: 'Something went wrong'
                });
            }

        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: 'Something went wrong'
            });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

async function checkFinancialYear(ids, expectedFinancialYear) {
    const formattedIds = ids.map(id => String(id)).join(',');

    try {
        const query = `SELECT financial_year FROM proforma_invoices WHERE id IN (${formattedIds})`;
        const rows = await db.query(query);

        const fetchedFinancialYears = rows.map(row => row.financial_year);

        if (!fetchedFinancialYears.every(year => year === expectedFinancialYear)) {
            throw new Error(`Please select the same financial year For merged pi.`);
        }

        return true;
    } catch (error) {
        throw error;
    }
}


async function getComplaintsIdbyPI(ids) {
    const formattedIds = ids.split(',').map(id => id.trim()).join(',');
    const pi = await db.query(`SELECT complaint_id FROM proforma_invoices WHERE id IN (${formattedIds})`);

    const allComplaintIds = pi.flatMap(row => row.complaint_id.split(','));

    return allComplaintIds;
}


const getMergedPiList = async (req, res) => {
    try {
        const { status } = req.query;

        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        const selectQuery = `SELECT * FROM merged_pi WHERE status = '${status}'  ORDER BY id DESC  LIMIT ${pageFirstResult}, ${pageSize} `;
        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length) {
            const finalData = [];
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const pi_details = row.pi_id;
                const pi_ids = pi_details.split(',').map(id => id.trim());
                // Fetch only the first proforma_invoices record for given pi_ids
                const getComplaint = await getComplaints(pi_ids)

                const [performa] = await db.query(
                    `SELECT proforma_invoices.*, purchase_orders.po_number AS po_num  FROM proforma_invoices LEFT JOIN purchase_orders ON proforma_invoices.po_number = purchase_orders.id WHERE proforma_invoices.id IN (${pi_ids.map(() => '?').join(',')}) LIMIT 1`,
                    pi_ids
                );

                if (!performa) {
                    continue;
                }

                // Fetch related details
                const billingFrom = await getCompanyDetailsById(performa.billing_from);
                const billingFromData = { company_id: billingFrom.company_id, company_name: billingFrom.company_name };

                const state = await getStateById(performa.billing_from_state);

                // const billingTo = await getCompanyDetailsById(performa.billing_to);
                // const billingToData = { company_id: billingTo.company_id, company_name: billingTo.company_name };
                const billingToData = await getBillingToData(performa.billing_to, queryResult[0].complaint_for);


                const regionalOffice = await getRegionalOfficeById(performa.billing_to_ro_office);
                const regionalOfficeData = { ro_id: regionalOffice.id, ro_name: regionalOffice.regional_office_name };

                const createdByDetails = await getCreatedByDetails(performa.created_by);

                finalData.push({
                    id: row.id,
                    performa_id: performa.id,
                    billing_from: billingFromData,
                    billing_from_state: state.name,
                    billing_to: billingToData,
                    billing_to_ro_office: regionalOfficeData,
                    financial_year: performa.financial_year,
                    merged_bill_number: row.merged_bill_number,
                    po_number: performa.po_num,
                    po_id: performa.po_number,
                    po_id: performa.po_id,
                    work: performa.work,
                    created_by: performa.created_by,
                    created_by_name: createdByDetails.name,
                    created_at: moment(performa.created_at).format('DD-MM-YYYY'),
                    complaintDetails: getComplaint, // Adjust if there's specific complaint detail handling
                    is_merged: performa.is_merged,

                    // outletDetails: getOutletDetail // Assuming getOutletDetail is defined elsewhere
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true, data: finalData, pageDetails: pageDetails
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


async function getComplaints(pi_ids) {
    try {

        const formattedPiIds = pi_ids.map(id => id.toString().trim());

        const selectQuery = await db.query(
            `SELECT id, complaint_id FROM proforma_invoices WHERE id IN (${formattedPiIds.map(() => '?').join(',')})`,
            formattedPiIds
        );

        const finalData = [];
        for (const row of selectQuery) {
            const complaintIds = row.complaint_id.split(',').map(id => id.trim());
            const query = await db.query(
                `SELECT id, complaint_unique_id FROM complaints WHERE id IN (${complaintIds.map(() => '?').join(',')})`,
                complaintIds
            );
            finalData.push(...query)
        }
        return finalData;
    } catch (error) {
        console.error("Error in getComplaints:", error.message);
        throw error;
    }
}


const discardMergedPI = async (req, res) => {
    try {
        const { id, merged_pi_id } = req.body;
        if (!id) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: 'ID is required'
            });
        }


        // Update the status of the merged PI
        const updateMergedPI = await db.query(`UPDATE proforma_invoices SET status = '5', mpi_status = '2' WHERE id = '${id}'`);

        if (updateMergedPI.affectedRows > 0) {
            const piIds = merged_pi_id.split(',').map(id => id.trim());

            // Update the status of the proforma invoices
            const updatePerforma = await db.query(
                `UPDATE proforma_invoices SET status = '2' WHERE id IN (${piIds.map(() => '?').join(',')})`,
                piIds
            );

            if (updatePerforma.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'Performa Invoice discarded successfully'
                });
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: 'Failed to Discard merged PI'
                });
            }
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: 'Failed to Discard merged PI'
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


const getAllProformaInvoicesInMergedPI = async (req, res) => {
    try {

        const status = req.query.status;

        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_value = "";
        const { regional_office_id, po_id, billing_from, billing_to } = req.query
        let whereConditions = ''

        if (regional_office_id) {
            whereConditions += ` and proforma_invoices.billing_to_ro_office='${regional_office_id}'`
        }
        if (po_id) {
            whereConditions += ` and proforma_invoices.po_number='${po_id}'`
        }
        if (billing_from) {
            whereConditions += ` and proforma_invoices.billing_from='${billing_from}'`
        }

        if (billing_to) {
            whereConditions += ` and proforma_invoices.billing_to='${billing_to}'`
        }

        if (searchData !== null && searchData !== '') {
            search_value += ` and (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT proforma_invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id 
            FROM proforma_invoices 
            LEFT JOIN regional_offices ON regional_offices.id = proforma_invoices.billing_to_ro_office 
            LEFT JOIN purchase_orders ON purchase_orders.id = proforma_invoices.po_number
            WHERE proforma_invoices.status = '${status}' ${whereConditions}  ${search_value} 
            ORDER BY proforma_invoices.id DESC  LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            const finalData = [];
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const getMeasurement = row.measurements ? JSON.parse(row.measurements) : null;

                if (getMeasurement) {
                    const complaintDetails = [];
                    for (let item of getMeasurement) {
                        const getComplaintId = await getComplaintIdMeasurement(item.measurement_list);
                        const complaint = await getComplaintUniqueId(getComplaintId.complaint_id);
                        complaintDetails.push(complaint);
                    }

                    row.complaintDetails = complaintDetails;

                }

                const getOutletDetail = await getOutletDetails(row.complaintDetails);


                // Fetching other details for the final data structure
                const billingFrom = await getCompanyDetailsById(row.billing_from);
                const billingFromData = { company_id: billingFrom.company_id, company_name: billingFrom.company_name };

                const state = await getStateById(row.billing_from_state);

                // const billingTo = await getCompanyDetailsById(row.billing_to);
                // const billingToData = { company_id: billingTo.company_id, company_name: billingTo.company_name };

                const billingToData = await getBillingToData(queryResult[0].billing_to, queryResult[0].complaint_for);

                const regionalOffice = await getRegionalOfficeById(row.billing_to_ro_office);
                const regionalOfficeData = { ro_id: regionalOffice.id, ro_name: regionalOffice.regional_office_name };

                const createdByDetails = await getCreatedByDetails(row.created_by);

                finalData.push({
                    id: row.id,
                    billing_from: billingFromData,
                    billing_from_state: state.name,
                    billing_from_state_id: row.billing_from_state,
                    billing_to: billingToData,
                    billing_to_ro_office: regionalOfficeData,
                    financial_year: row.financial_year,
                    bill_no: row.bill_no,
                    po_number: row.po_number,
                    po_id: row.po_id,
                    measurements: JSON.parse(row.measurements),
                    work: row.work,
                    created_by: row.created_by,
                    created_by_name: createdByDetails.name,
                    created_at: moment(row.created_at).format('DD-MM-YYYY'),
                    complaintDetails: row.complaintDetails,
                    is_merged: row.is_merged,
                    outletDetails: getOutletDetail,
                    complaint_for: row.complaint_for
                });
            }


            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                pageDetails: pageDetails
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}


const getMergedPerfomaInvoiceById = async (req, res) => {
    try {
        const id = req.params.id;
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        const selectQuery = `SELECT * FROM merged_pi WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (!queryResult.length) {
            return res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
        }

        const performa = await db.query(
            `SELECT proforma_invoices.*, purchase_orders.po_number AS po_num  
             FROM proforma_invoices 
             LEFT JOIN purchase_orders ON proforma_invoices.po_number = purchase_orders.id 
             WHERE proforma_invoices.id IN (${queryResult[0].pi_id})
            `
        );

        const performaData = [];

        for (const row of performa) {
            const getMeasurements = row.measurements ? JSON.parse(row.measurements) : null;

            const complaintDetails = [];
            if (Array.isArray(getMeasurements) && getMeasurements.length > 0) {
                for (let item of getMeasurements) {
                    const getComplaintId = await getComplaintIdMeasurement(item.measurement_list);
                    const complaint = await getComplaintUniqueId(getComplaintId.complaint_id);
                    complaintDetails.push(complaint);
                }
            }

            const getOutletDetail = await getOutletDetails(complaintDetails);

            const billingFrom = await getCompanyDetailsById(row.billing_from);
            const billingFromData = { company_id: billingFrom.company_id, company_name: billingFrom.company_name, company_address: billingFrom.company_address, gst_number: billingFrom.gst_number };

            const state = await getStateById(row.billing_from_state);

            const billingToData = await getBillingToData(row.billing_to, queryResult[0].complaint_for);

            const regionalOffice = await getRegionalOfficeById(row.billing_to_ro_office);
            const regionalOfficeData = { ro_id: regionalOffice.id, ro_name: regionalOffice.regional_office_name };

            const createdByDetails = await getCreatedByDetails(row.created_by);

            const field = {
                billing_from: billingFromData,
                billing_from_state: state.name,
                billing_from_state_id: row.billing_from_state,
                billing_to: billingToData,
                billing_to_ro_office: regionalOfficeData,
                financial_year: row.financial_year,
                bill_no: row.bill_no,
                po_id: row.po_number,
                po_number: row.po_number,
                po_date: moment(row.po_date).format('DD-MM-YYYY'),
                work: row.work,
                created_by: row.created_by,
                created_by_name: createdByDetails.name,
                created_at: moment(row.created_at).format('DD-MM-YYYY'),
                regional_office_name: row.regional_office_name,
                complaintDetails: complaintDetails,
                outletDetails: getOutletDetail
            };

            const itemsData = [];
            if (Array.isArray(getMeasurements) && getMeasurements.length > 0) {
                for (const item of getMeasurements) {
                    // Get item details
                    const getItemDetails = await db.query(`SELECT DISTINCT order_line_number FROM measurement_items WHERE measurement_id = ?`, [item.measurement_list]);

                    const processItemDetails = async (detailsArray, measurementList) => {
                        if (!detailsArray || detailsArray.length === 0) {
                            return [];
                        }
                        const uniqueItemsMap = new Map();
                        const itemIds = detailsArray.map(detail => detail.order_line_number);
                        const itemDetails = await getItemsDetailsById(itemIds, measurementList, row.po_number);
                        if (itemDetails.length > 0) {
                            for (const mainItem of itemDetails) {
                                const subChildData = await getMeasurementsItemsSubChildById(mainItem.measurement_id, mainItem.order_line_number);
                                const key = mainItem.order_line_number;
                                if (!uniqueItemsMap.has(key)) {
                                    uniqueItemsMap.set(key, {
                                        order_line_number: mainItem.order_line_number,
                                        item_name: mainItem.item_name,
                                        rate: mainItem.rate,
                                        unit: mainItem.unit_name,
                                        total_qty: mainItem.total_quantity,
                                        measurement_id: mainItem.measurement_id,
                                        is_status: detailsArray.find(detail => detail.order_line_number === mainItem.order_line_number)?.is_status,
                                        childArray: subChildData
                                    });
                                }
                            }
                        }
                        return Array.from(uniqueItemsMap.values());
                    };

                    // Process items_data using getItemDetails
                    const itemsDataOfItem = await processItemDetails(getItemDetails, item.measurement_list);
                    itemsData.push(...itemsDataOfItem); // Spread itemsDataOfItem to add elements instead of nested array
                }
            }

            performaData.push({ ...field, items_data: itemsData });

        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Fetched successfully",
            data: performaData
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


const getAllMergedProformaInvoice = async (req, res) => {
    try {

        const status = req.query.status;

        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_value = "";
        const { regional_office_id, po_id, bill_number } = req.query
        let whereConditions = ''

        if (regional_office_id) {
            whereConditions += ` and proforma_invoices.billing_to_ro_office='${regional_office_id}'`
        }
        if (po_id) {
            whereConditions += ` and proforma_invoices.po_number='${po_id}'`
        }
        if (bill_number) {
            whereConditions += ` and proforma_invoices.bill_no='${bill_number}'`
        }

        if (searchData !== null && searchData !== '') {
            search_value += ` and (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT proforma_invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id FROM proforma_invoices 
            LEFT JOIN regional_offices ON regional_offices.id = proforma_invoices.billing_to_ro_office 
            LEFT JOIN purchase_orders ON purchase_orders.id = proforma_invoices.po_number
            WHERE proforma_invoices.status = '${status}' ${whereConditions}  ${search_value} 
            ORDER BY proforma_invoices.id DESC  LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            const finalData = [];
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const getMeasurement = row.measurements ? JSON.parse(row.measurements) : null;

                // Split the complaint_id string into an array of IDs
                const complaintIds = row.complaint_id.split(',');
                // Create a new array for complaint details for each row
                const complaintDetails = [];

                // Fetch details for each complaint ID
                for (const id of complaintIds) {

                    const complaint = await getComplaintUniqueId(id.trim());
                    complaintDetails.push(complaint);
                }

                // Add complaint details to the row
                row.complaintDetails = complaintDetails;

                const getOutletDetail = await getOutletDetails(row.complaintDetails);


                // Fetching other details for the final data structure
                const billingFrom = await getCompanyDetailsById(row.billing_from);
                const billingFromData = { company_id: billingFrom.company_id, company_name: billingFrom.company_name };

                const state = await getStateById(row.billing_from_state);

                // const billingTo = await getCompanyDetailsById(row.billing_to);
                // const billingToData = { company_id: billingTo.company_id, company_name: billingTo.company_name };

                const billingToData = await getBillingToData(row.billing_to, row.complaint_for);

                const regionalOffice = await getRegionalOfficeById(row.billing_to_ro_office);
                const regionalOfficeData = { ro_id: regionalOffice.id, ro_name: regionalOffice.regional_office_name };

                const createdByDetails = await getCreatedByDetails(row.created_by);

                finalData.push({
                    id: row.id,
                    billing_from: billingFromData,
                    billing_from_state: state.name,
                    billing_to: billingToData,
                    billing_to_ro_office: regionalOfficeData,
                    financial_year: row.financial_year,
                    bill_no: row.bill_no,
                    po_number: row.po_number,
                    po_id: row.po_id,
                    measurements: JSON.parse(row.measurements),
                    work: row.work,
                    created_by: row.created_by,
                    created_by_name: createdByDetails.name,
                    created_at: moment(row.created_at).format('DD-MM-YYYY'),
                    complaintDetails: row.complaintDetails,
                    is_merged: row.is_merged,
                    outletDetails: getOutletDetail,
                    merged_pi_id: row.merged_pi_id
                });
            }


            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                pageDetails: pageDetails
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}



async function fetchMergedProformaInvoicesDetailsById(id) {
    const selectQuery = `SELECT proforma_invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id, purchase_orders.po_date, measurements.id as measurement_id, measurements.measurement_unique_id, proforma_invoices.measurements FROM proforma_invoices LEFT JOIN regional_offices ON regional_offices.id = proforma_invoices.billing_to_ro_office LEFT JOIN purchase_orders ON purchase_orders.id = proforma_invoices.po_number LEFT JOIN measurements ON measurements.id = proforma_invoices.measurement_list WHERE proforma_invoices.id = ?`;
  
    const queryResult = await db.query(selectQuery, [id]);
  
    if (queryResult.length > 0) {
      const getDetail = queryResult[0];
      const complaintIds = getDetail.complaint_id.split(",");
      const complaintDetails = [];
  
      for (const complaintId of complaintIds) {
        const complaint = await getComplaintUniqueId(complaintId.trim());
        complaintDetails.push(complaint);
      }
      const getOutletDetail = await getOutletDetails(complaintDetails);
  
      getDetail.complaintDetails = complaintDetails;
      getDetail.getOutletDetail = getOutletDetail;
  
      const billingFrom = await getCompanyDetailsById(getDetail.billing_from);
      const billingFromData = {
        company_id: billingFrom.company_id,
        company_name: billingFrom.company_name,
        company_address: billingFrom.company_address,
        gst_number: billingFrom.gst_number,
      };
  
      const state = await getStateById(getDetail.billing_from_state);
  
      const billingToData = await getBillingToData(
        getDetail.billing_to,
        getDetail.complaint_for
      );
  
      const regionalOffice = await getRegionalOfficeById(
        getDetail.billing_to_ro_office
      );
      const regionalOfficeData = {
        ro_id: regionalOffice.id,
        ro_name: regionalOffice.regional_office_name,
      };
  
      const createdByDetails = await getCreatedByDetails(getDetail.created_by);
  
      const field = {
        pi_id: getDetail.id,
        billing_from: billingFromData,
        billing_from_state: state.name,
        billing_from_state_id: getDetail.billing_from_state,
        billing_to: billingToData,
        billing_to_ro_office: regionalOfficeData,
        financial_year: getDetail.financial_year,
        bill_no: getDetail.bill_no,
        po_id: getDetail.po_id,
        po_number: getDetail.po_number,
        po_date: moment(getDetail.po_date).format("DD-MM-YYYY"),
        work: getDetail.work,
        created_by: getDetail.created_by,
        created_by_name: createdByDetails.name,
        created_at: moment(getDetail.created_at).format("DD-MM-YYYY"),
        regional_office_name: getDetail.regional_office_name,
        complaintDetails: getDetail.complaintDetails,
        outletDetails: getDetail.getOutletDetail,
        attachment: queryResult[0].attachment,
      };
  
      let merged = [];
  
      if (getDetail.mpi_status == null) {
        // Directly assign the parsed measurements if it's not null
        merged = JSON.parse(getDetail.measurements);
      } else {
        const mergedPi = getDetail.merged_pi_id.split(",");
  
        for (const id of mergedPi) {
          const selectQuery = await db.query(
            "SELECT measurements FROM proforma_invoices WHERE id = ?",
            [id.trim()]
          );
          if (selectQuery.length > 0) {
            // Parse the measurement and push to merged array
            merged.push(...JSON.parse(selectQuery[0].measurements));
          }
        }
      }
  
      // Ensure merged is an array of objects
      const parsedMeasurements = merged.map((measurement) => {
        if (typeof measurement === "string") {
          return JSON.parse(measurement);
        }
        return measurement;
      });
  
      const mergedMeasurements = parsedMeasurements.flat();
  
      if (Array.isArray(mergedMeasurements) && mergedMeasurements.length > 0) {
        for (const item of mergedMeasurements) {
          // Fetch item details
          const getItemDetails = await db.query(
            `SELECT DISTINCT order_line_number FROM measurement_items WHERE measurement_id = ?`,
            [item.measurement_list]
          );
  
          // Fetch complaint details
          const getComplaintId = await getComplaintIdMeasurement(
            item.measurement_list
          );
          const complaint = await getComplaintUniqueId(
            getComplaintId.complaint_id
          );
  
          // Assign complaint details to item
          item.complaintDetails = {
            complaint_id: complaint.id,
            complaint_unique_id: complaint.complaint_unique_id,
            id: getComplaintId.complaint_id,
          };
  
          let total_amount = 0;
  
          // Process item details
          const processItemDetails = async (
            itemDetailsArray,
            measurementList
          ) => {
            if (!itemDetailsArray || itemDetailsArray.length === 0) {
              return [];
            }
            const uniqueItemsMap = new Map();
            const itemIds = itemDetailsArray.map(
              (detail) => detail.order_line_number
            );
  
            // Assuming getDetail.po_id is part of the context where the function is called
            const po_id = getDetail.po_id; // Ensure po_id is correctly derived from the context
  
            const itemDetails = await getItemsDetailsById(
              itemIds,
              measurementList,
              po_id
            );
  
            if (itemDetails.length > 0) {
              for (const mainItem of itemDetails) {

                const subChildData = await getMeasurementsItemsSubChildById(
                  mainItem.measurement_id,
                  mainItem.order_line_number
                );
                total_amount += mainItem.amount;
  
                const key = mainItem.order_line_number;
                if (!uniqueItemsMap.has(key)) {
                  uniqueItemsMap.set(key, {
                    order_line_number: mainItem.order_line_number,
                    item_name: mainItem.item_name,
                    rate: mainItem.rate,
                    unit: mainItem.unit_name,
                    total_qty: mainItem.total_quantity,
                    measurement_id: mainItem.measurement_id,
                    is_status: itemDetailsArray.find(
                      (detail) =>
                        detail.order_line_number === mainItem.order_line_number
                    )?.is_status,
                    childArray: subChildData,
                  });
                }
              }
            }
            return Array.from(uniqueItemsMap.values());
          };
  
          // Assign processed item details to item
          item.items_data = await processItemDetails(
            getItemDetails,
            item.measurement_list
          );
        }
      }
      return { ...field, getMeasurements: mergedMeasurements };
    } else {
      throw new Error("Data not found");
    }
  }

  
  const getMergedProformaInvoicesDetailsById = async (req, res) => {
    try {
      const id = req.params.id;
  
      const { error } = checkPositiveInteger.validate({ id });
      if (error) {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: error.message,
        });
      }
  
      const data = await fetchMergedProformaInvoicesDetailsById(id);
  
      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Fetched successfully",
        data: data,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  };

const mergedPerformaInvoice = async (req, res) => {
    try {

    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message,
            });
    }
}


const getAllProformaInvoicesInInvoice = async (req, res) => {
    try {

        const status = req.query.status;

        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search_value = "";
        const { regional_office_id, po_id, billing_from, billing_to } = req.query;
        let whereConditions = ''

        if (regional_office_id) {
            whereConditions += ` and proforma_invoices.billing_to_ro_office='${regional_office_id}'`
        }
        if (po_id) {
            whereConditions += ` and proforma_invoices.po_number='${po_id}'`
        }
        if (billing_from) {
            whereConditions += ` and proforma_invoices.billing_from='${billing_from}'`
        }
        if (billing_to) {
            whereConditions += ` and proforma_invoices.billing_to='${billing_to}'`
        }
        if (searchData !== null && searchData !== '') {
            search_value += ` and (regional_offices.regional_office_name LIKE '%${searchData}%' OR purchase_orders.po_number LIKE '%${searchData}%')`;
        }

        const selectQuery = `
            SELECT proforma_invoices.*, regional_offices.regional_office_name, purchase_orders.po_number, purchase_orders.id as po_id FROM proforma_invoices 
            LEFT JOIN regional_offices ON regional_offices.id = proforma_invoices.billing_to_ro_office 
            LEFT JOIN purchase_orders ON purchase_orders.id = proforma_invoices.po_number
            WHERE proforma_invoices.status IN ('2', '4') ${whereConditions}  ${search_value} 
            ORDER BY proforma_invoices.id DESC  LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            const finalData = [];
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                const getMeasurement = row.measurements ? JSON.parse(row.measurements) : null;

                // Split the complaint_id string into an array of IDs
                const complaintIds = row.complaint_id.split(',');

                // Create a new array for complaint details for each row
                const complaintDetails = [];

                // Fetch details for each complaint ID
                for (const id of complaintIds) {
                    const complaint = await getComplaintUniqueId(id.trim());
                    complaintDetails.push(complaint);
                }

                // Add complaint details to the row
                row.complaintDetails = complaintDetails;

                const getOutletDetail = await getOutletDetails(row.complaintDetails);


                // Fetching other details for the final data structure
                const billingFrom = await getCompanyDetailsById(row.billing_from);
                const billingFromData = { company_id: billingFrom.company_id, company_name: billingFrom.company_name };

                const state = await getStateById(row.billing_from_state);

                // const billingTo = await getCompanyDetailsById(row.billing_to);
                // const billingToData = { company_id: billingTo.company_id, company_name: billingTo.company_name };

                const billingToData = await getBillingToData(row.billing_to, row.complaint_for);

                const regionalOffice = await getRegionalOfficeById(row.billing_to_ro_office);
                const regionalOfficeData = { ro_id: regionalOffice.id, ro_name: regionalOffice.regional_office_name };

                const createdByDetails = await getCreatedByDetails(row.created_by);

                finalData.push({
                    id: row.id,
                    billing_from: billingFromData,
                    billing_from_state: state.name,
                    billing_to: billingToData,
                    billing_to_ro_office: regionalOfficeData,
                    financial_year: row.financial_year,
                    bill_no: row.bill_no,
                    po_number: row.po_number,
                    po_id: row.po_id,
                    measurements: JSON.parse(row.measurements),
                    work: row.work,
                    created_by: row.created_by,
                    created_by_name: createdByDetails.name,
                    created_at: moment(row.created_at).format('DD-MM-YYYY'),
                    complaintDetails: row.complaintDetails,
                    is_merged: row.is_merged,
                    outletDetails: getOutletDetail,
                    merged_pi_id: row.merged_pi_id
                });
            }


            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                pageDetails: pageDetails
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

const getPiList = async (req, res) => {
    try {
        const ids = req.body.id; // Extracting ids from req.body
        const formattedIds = ids.join(','); // Joining ids into a comma-separated string

        // Constructing the parameterized query
        const selectQuery = `SELECT * FROM proforma_invoices WHERE id IN (${formattedIds})`;
        // Executing the parameterized query using await
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}


module.exports = { generateProformaInvoice, getAllProformaInvoices, getProformaInvoicesDetailsById, updateProformaInvoiceDetails, deleteProformaInvoices, getAllProformaInvoiceOnPoId, multiComplaints, getAllPOFilters, getAllMeasurementsInPIStatus, getAllROBasedOnPo, getAllROBasedOnComplaint, discardProformaInvoices, getAllPOForProforma, getAllROFromProforma, getAllBillNumberFromProforma, getSamePoExistsOrNot, changePoInMeasurements, reactiveToDiscardPi, mergedPerformaInvoice, roToBillingFromCompany, fromBillingToCompany, getMergedPiList, discardMergedPI, mergedPi, getAllProformaInvoicesInMergedPI, getMergedPerfomaInvoiceById, getAllComplaintsInPI, getAllMergedProformaInvoice, getMergedProformaInvoicesDetailsById, getAllProformaInvoicesInInvoice, getPiList, getBillingToData, fetchMergedProformaInvoicesDetailsById }  