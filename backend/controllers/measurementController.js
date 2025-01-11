var moment = require('moment');
require('dotenv').config();
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { measurementValidation, checkPositiveInteger } = require('../helpers/validation');
const { calculatePagination, getCreatedByDetails, getCreatedUserNameFromAdmin, getPoDetailById, getComplaintTypeById, generateRandomAlphanumeric, getComplaintUsingIds, getComplaintById, getComplaintAndComplaintTypeById, getOutletById, getRegionalNameById, getSaleAreaNameById, getEnergyCompaniesById, getComplaintsApprovalAccess, complaintApprovedBy, complaintRaiseBy, getUserDetails, getCompanyDetailsById, getOrderById, getComplaintDetails, getAdminAndUserDetails, getComplaintUniqueId } = require('../helpers/general');
const { getMeasurementsItemsById, getMeasurementsItemsSubChildById, getPoUsedAmount } = require('../helpers/commonHelper');
const { allApprovedComplaintsData } = require('./officeInspectionController');
const { query } = require('express');
const { getUsedQty } = require('./purchaseOrderController');
const { getBillingToData } = require('./proformaInvoiceController');

const createMeasurement = async (req, res) => {

    try {
        const { measurement_date, financial_year, ro_office_id, sale_area_id, outlet_id, po_id, complaint_id, complaint_for, status, amount, items_data, po_for, energy_company_id } = req.body;
         
        let required_outlet_id = null;

        if (complaint_for == '1') {
            if (outlet_id) {
                required_outlet_id = outlet_id;
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Outlet ID is required " })
            }
        } else {
            required_outlet_id = null;
        }

        const { error } = measurementValidation.validate(req.body);

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        // check po limit and used amount or remaining amount
        const poRemainingAmount = await getPoUsedAmount(po_id, amount);
        if (poRemainingAmount) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: 'Measurement amount is too large from po amount'
                });
        }

        // insert in measurement tables

        const insertQuery = "INSERT INTO measurements (measurement_unique_id, measurement_date, financial_year, ro_office_id, sale_area_id, outlet_id, po_id, complaint_id, status, amount, po_for, energy_company_id, complaint_for, created_by) VALUES (? , ? , ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const created_by = req.user.user_id;
        const measurement_date_format = moment(measurement_date).format('YYYY-MM-DD');
        const unique_id = await generateRandomAlphanumeric(10);

        const insertValues = [unique_id, measurement_date_format, financial_year, ro_office_id, sale_area_id, required_outlet_id, po_id, complaint_id, status, amount, po_for, energy_company_id, complaint_for, created_by];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const measurement_id = queryResult.insertId;

            // Update PO for used amount or remaining amount
            if (po_id != null) {
                const getPoLimit = await db.query(`SELECT po_limit, po_amount FROM purchase_orders WHERE id = ?`, [po_id]);
                const po_used_amount = (Number(getPoLimit[0].po_amount) + Number(amount));
                await db.query("UPDATE purchase_orders SET po_amount = ? WHERE id = ?", [po_used_amount, po_id]);
            }

            await updateComplaintStatus(complaint_id, status);

            if (items_data != null) {
                const insertItemQuery = `
                    INSERT INTO measurement_items(
                        measurement_id, po_id, complaint_id, order_line_number, unit_id, 
                        description, number, length, breadth, depth, quantity, 
                        rate, amount, total_quantity, created_by
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                for (const item of items_data) {
                    await updateQuantityInPo(item.total_qty, item.order_line_number, po_id);
                    if (Array.isArray(item.childArray) && item.childArray.length > 0) {
                        for (const child of item.childArray) {
                            const amount = child.qty * item.rate;

                            const insertItemsValues = [
                                measurement_id,
                                po_id,
                                complaint_id,
                                item.order_line_number,
                                item.unit,
                                child.description,
                                child.no,
                                child.length,
                                child.breadth,
                                child.depth,
                                parseFloat(child.qty).toFixed(2),
                                item.rate,
                                amount,
                                item.total_qty,
                                created_by
                            ];

                            try {
                                const itemInsertResult = await db.query(insertItemQuery, insertItemsValues);

                                await insertIntoPtmTimeline(
                                    itemInsertResult.insertId, measurement_id, po_id, complaint_id, item.order_line_number, item.unit, child.description, child.no, child.length, child.breadth, child.depth, child.qty, item.rate, amount, item.total_qty, created_by
                                );
                            } catch (error) {
                                // Silently handle the error and continue
                            }
                        }
                    } else {
                        // Skip processing for empty or null childArray
                    }
                }
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Measurement created successfully"
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Failed to create measurement"
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

async function insertIntoPtmTimeline(measurement_item_id, measurement_id, po_id, complaint_id, item_id, unit, description, number, length, breadth, depth, quantity, rate, amount, total_quantity, created_by) {
    try {

        const insertQuery = "INSERT INTO ptm_timeline (measurement_item_id, measurement_id, po_id, complaint_id, order_line_number, unit_id, description, number, length, breadth, depth, quantity, rate, amount, total_quantity,  created_by) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const insertValues = [measurement_item_id, measurement_id, po_id, complaint_id, item_id, unit, description, number, length, breadth, depth, quantity, rate, amount, total_quantity, created_by];

        await db.query(insertQuery, insertValues);


    } catch (error) {
        throw error
    }
}


const getAllCreatedMeasurements = async (req, res) => {

    try {

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR sales_area.sales_area_name LIKE '%${searchData}%') OR measurements.measurement_date LIKE '${searchData}'`;
        }

        const selectQuery = `SELECT measurements.*, regional_offices.regional_office_name, sales_area.sales_area_name, outlets.outlet_name, complaints.complaint_unique_id FROM measurements LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id LEFT JOIN outlets ON outlets.id = measurements.outlet_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.status IN ('0', '1') ${search_value} ORDER BY measurements.measurement_date DESC LIMIT ${pageFirstResult} , ${pageSize}`

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                // const complaintTypeDetail = await getComplaintTypeById(row.complaint_id);
                const complaintTypeDetail = await getComplaintAndComplaintTypeById(row.complaint_id);

                // get all measurments item list
                const items = await getMeasurementsItemsById(row.id);
                finalData.push({
                    id: row.id,
                    measurement_amount: row.amount,
                    measurement_date: moment(row.measurement_date).format('DD-MM-YYYY'),
                    financial_year: row.financial_year,
                    ro_office_id: row.ro_office_id,
                    sale_area_id: row.sale_area_id,
                    outlet_id: row.outlet_id,
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    po_limit: PoDetails.po_limit,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id ? row.complaint_unique_id : null,
                    complaint_type_name: complaintTypeDetail.complaint_type_name ? complaintTypeDetail.complaint_type_name : null,
                    // created_by: createdBy[0].name,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
                    outlet_name: row.outlet_name,
                    status: row.status,
                    items: items
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


// const getMeasurementsDetailsById = async (req, res) => {
//     try {
//         const id = req.params.id;

//         const { error } = checkPositiveInteger.validate({ id });

//         if (error) {
//             return res.status(StatusCodes.OK).json({
//                 status: false,
//                 message: error.message
//             });
//         }

//         const selectQuery = `SELECT measurements.*, complaints.complaint_for, regional_offices.regional_office_name, sales_area.sales_area_name, outlets.outlet_name FROM measurements LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id LEFT JOIN outlets ON outlets.id = measurements.outlet_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.id = ?`;

//         let queryResult = await db.query(selectQuery, [id]);

//         if (queryResult.length > 0) {
//             const finalData = [];
//             const uniqueItemsMap = new Map();
//             const uniqueItemsMapNew = new Map();
//             const getDetails = await allApprovedComplaintsData(queryResult[0].complaint_id);
//             const [supervisors, managers, endUsers] = await getSuperVisorOfAssignDetails(queryResult[0].complaint_id);
//             for (const row of queryResult) {
//                 const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
//                 const PoDetails = await getPoDetailById(row.po_id);
//                 // const complaintTypeDetail = await getComplaintById(row.complaint_id);
//                 const complaintTypeDetail = await getComplaintAndComplaintTypeById(row.complaint_id);
//                 const items = await getMeasurementsItemsById(row.id);

//                 const pi_attachment = await getPiAttachmentDetails(row.complaint_id)
//                 if (items && items.length > 0) { // Check if items exist and are iterable
//                     for (const item of items) {
//                         const key = item.order_line_number;
//                         if (!uniqueItemsMap.has(key)) {
//                             uniqueItemsMap.set(key, {
//                                 order_line_number: item.order_line_number,
//                                 label: `${item.item_name}`,
//                                 hsn_code: item.hsn_code,
//                                 rate: item.measurement_item_rate,
//                                 unit_name: item.unit_name,
//                                 unit_id: item.unit_id,
//                                 total_qty: item.total_quantity,
//                                 measurement_id: item.measurement_id,
//                                 remaining_quantity: item.remaining_quantity,
//                                 value:item.order_line_number,
//                             });
//                         }
//                         if (!uniqueItemsMapNew.has(key)) {
//                             uniqueItemsMapNew.set(key, {
//                                 order_line_number: item.order_line_number,
//                                 item_name: `${item.item_name}`,
//                                 hsn_code: item.hsn_code,
//                                 rate: item.measurement_item_rate,
//                                 unit: item.unit_name,
//                                 unit_id: item.unit_id,
//                                 total_qty: item.total_quantity,
//                                 measurement_id: item.measurement_id,
//                                 remaining_quantity: item.remaining_quantity
//                             });
//                         }
//                         item.item_name = `${item.hsn_code} - ${item.items_name}`;
//                     }
//                 }

//                 finalData.push({
//                     id: row.id,
//                     measurement_amount: row.amount,
//                     measurement_date: moment(row.measurement_date).format('YYYY-MM-DD'),
//                     measurement_unique_id: row.measurement_unique_id,
//                     financial_year: row.financial_year,
//                     ro_office_id: row.ro_office_id,
//                     sale_area_id: row.sale_area_id,
//                     outlet_id: row.outlet_id,
//                     po_id: row.po_id,
//                     po_number: PoDetails.po_number,
//                     po_limit: PoDetails.po_limit,
//                     po_for: row.po_for,
//                     energy_company_id:row.energy_company_id,
//                     complaint_id: row.complaint_id,
//                     complaint_for: row.complaint_for,
//                     complaint_unique_id: complaintTypeDetail.complaint_unique_id || null,
//                     complaint_type_name: complaintTypeDetail.complaint_type_name ? complaintTypeDetail.complaint_type_name : null,
//                     created_by: createdBy[0].name,
//                     regional_office_name: row.regional_office_name,
//                     sales_area_name: row.sales_area_name,
//                     outlet_name: row.outlet_name,
//                     status: row.status,
//                     po_details: PoDetails,
//                     stock: getDetails,
//                     pi_attachment: pi_attachment,
//                 });
//             }
//             const uniqueItemsArray = Array.from(uniqueItemsMap.values());
//             const uniqueItemsSubChildArray = Array.from(uniqueItemsMapNew.values());

//             if (uniqueItemsSubChildArray.length > 0) {
//                 for (const childArray of uniqueItemsSubChildArray) {
//                     const measurementSubDetails = await getMeasurementsItemsSubChildById(childArray.measurement_id, childArray.order_line_number);
//                     childArray.childArray = measurementSubDetails;
//                 }
//             }

//             finalData[0].supervisorDetails = [...new Set(supervisors)];
//             finalData[0].managersDetails = [...new Set(managers)];
//             finalData[0].endUsers = [...new Set(endUsers)];
//             finalData.forEach(data => {
//                 data.items_id = uniqueItemsArray;
//                 data.items_data = uniqueItemsSubChildArray;

//             });

//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Fetched successfully",
//                 data: finalData
//             });
//         } else {
//             return res.status(StatusCodes.OK).json({
//                 status: false,
//                 message: "Data not found"
//             });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message
//         });
//     }
// }


const getMeasurementsDetailsById = async (req, res) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = `
        SELECT measurements.*, complaints.complaint_for, complaints.energy_company_id, complaints.order_by_id AS complaint_order_by, users.name AS user_name, complaint_types.complaint_type_name, regional_offices.regional_office_name, sales_area.sales_area_name, outlets.outlet_name, outlets.location AS outlet_location, outlets.address AS outlet_address, outlets.outlet_ccnoms AS outlet_cc_number, outlets.outlet_category
        FROM measurements 
        LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id 
        LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id 
        LEFT JOIN outlets ON outlets.id = measurements.outlet_id 
        LEFT JOIN complaints ON complaints.id = measurements.complaint_id
        LEFT JOIN users ON users.id = complaints.order_by_id
        LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type 
        WHERE measurements.id = ?`;

        let queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > 0) {
            const finalData = [];
            const uniqueItemsMap = new Map();
            const uniqueItemsMapNew = new Map();
            const getDetails = await allApprovedComplaintsData(queryResult[0].complaint_id);
            const [supervisors, managers, endUsers] = await getSuperVisorOfAssignDetails(queryResult[0].complaint_id);

            for (const row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                const complaintTypeDetail = await getComplaintAndComplaintTypeById(row.complaint_id);
                const items = await getMeasurementsItemsById(row.id);

                const pi_attachment = await getPiAttachmentDetails(row.complaint_id);
                if (items && items.length > 0) {
                    // Check if items exist and are iterable
                    for (const item of items) {
                        const key = item.order_line_number;
                        if (!uniqueItemsMap.has(key)) {
                            uniqueItemsMap.set(key, {
                                order_line_number: item.order_line_number,
                                label: `${item.item_name}`,
                                hsn_code: item.hsn_code,
                                rate: item.measurement_item_rate,
                                unit_name: item.unit_name,
                                unit_id: item.unit_id,
                                total_qty: parseFloat(item.total_quantity).toFixed(2),
                                measurement_id: item.measurement_id,
                                remaining_quantity: item.remaining_quantity,
                                value: item.order_line_number,
                            });
                        }
                        if (!uniqueItemsMapNew.has(key)) {
                            uniqueItemsMapNew.set(key, {
                                order_line_number: item.order_line_number,
                                item_name: `${item.item_name}`,
                                hsn_code: item.hsn_code,
                                rate: item.measurement_item_rate,
                                unit: item.unit_name,
                                unit_id: item.unit_id,
                                total_qty: parseFloat(item.total_quantity).toFixed(2),
                                measurement_id: item.measurement_id,
                                remaining_quantity: item.remaining_quantity,
                            });
                        }
                        item.item_name = `${item.hsn_code} - ${item.items_name}`;
                    }
                }
                // fetch company details
                const fetchCompanyDetails = await getBillingToData(row.energy_company_id, row.complaint_for)

                finalData.push({
                    id: row.id,
                    measurement_amount: row.amount,
                    measurement_date: moment(row.measurement_date).format("YYYY-MM-DD"),
                    measurement_unique_id: row.measurement_unique_id,
                    financial_year: row.financial_year,
                    ro_office_id: row.ro_office_id,
                    sale_area_id: row.sale_area_id,
                    outlet_id: row.outlet_id,
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    po_limit: PoDetails.po_limit,
                    po_for: row.po_for,
                    complaint_id: row.complaint_id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: complaintTypeDetail.complaint_unique_id || null,
                    complaint_type_name: complaintTypeDetail.complaint_type_name ? complaintTypeDetail.complaint_type_name : null,
                    created_by: createdBy[0].name,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
                    outlet_name: row.outlet_name,
                    outlet_location: row.outlet_location,
                    outlet_address: row.outlet_address,
                    outelet_cc_number: row.outlet_cc_number,
                    outlet_category: row.outlet_category,
                    company_details: fetchCompanyDetails,
                    complaint_order_by: row.user_name,
                    status: row.status,
                    po_details: PoDetails,
                    stock: getDetails,
                    pi_attachment: pi_attachment,
                });
            }
            /* save ItemsArray in a variable */
            const uniqueItemsArray = Array.from(uniqueItemsMap.values());
            /** save ItemsChildArray in a variable */
            const uniqueItemsSubChildArray = Array.from(uniqueItemsMapNew.values());

            if (uniqueItemsSubChildArray.length > 0) {
                for (const childArray of uniqueItemsSubChildArray) {
                    const measurementSubDetails = await getMeasurementsItemsSubChildById(
                        childArray.measurement_id,
                        childArray.order_line_number
                    );
                    childArray.childArray = measurementSubDetails;
                }
            }

            finalData[0].supervisorDetails = [...new Set(supervisors)];
            finalData[0].managersDetails = [...new Set(managers)];
            finalData[0].endUsers = [...new Set(endUsers)];
            finalData.forEach((data) => {
                data.items_id = uniqueItemsArray;
                data.items_data = uniqueItemsSubChildArray;
            });

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
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
            message: error.message,
        });
    }
};

const updateMeasurementDetails = async (req, res) => {
    try {
        const {
            measurement_date,
            financial_year,
            ro_office_id,
            sale_area_id,
            outlet_id,
            po_id,
            status,
            complaint_id,
            items_data,
            id,
            complaint_for,
            amount,
            po_for
        } = req.body;
        
        const { error } = measurementValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message
            });
        }

        let required_outlet_id = null;
        if (complaint_for === '1') {
            if (!outlet_id) {
                return res.status(StatusCodes.OK).json({ status: false, message: "Outlet ID is required" });
            }
            required_outlet_id = outlet_id;
        }
        
        const remainingAmount = await deductAmountInsidePo(id, po_id)
        const subtractQuantity = await subtractQuantityInPo(id)

        const getPoLimit = await db.query(`SELECT po_limit, po_amount, actual_po_amount, (po_limit - po_amount) AS remaining_po_amount FROM purchase_orders WHERE id = ?`, [po_id]);

        if (getPoLimit.length == 0) {   
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Data not found" })
        }

        if (getPoLimit[0].remaining_po_amount < amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Amount should be less than or equal to purchase order Amount" });
        }

        const complaint_ids = complaint_id;
        const updateQuery = "UPDATE measurements SET measurement_date = ?, financial_year  = ?, ro_office_id  = ?, sale_area_id  = ?, outlet_id = ?, po_id  = ?, complaint_id  = ?, status = ?, amount = ?, po_for = ?, updated_by = ? WHERE id = ?";

        const updated_by = req.user.user_id;
        const measurement_date_format = moment(measurement_date).format('YYYY-MM-DD');

        const updateValues = [measurement_date_format, financial_year, ro_office_id, sale_area_id, required_outlet_id, po_id, complaint_ids, status, parseFloat(amount).toFixed(2), po_for, updated_by, id];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const complaintStatus = await updateComplaintStatus(complaint_ids, status);

            // update PO for used amount or remaining amount
            if (po_id != null) {
                const getPoLimit = await db.query(`SELECT po_limit, po_amount, actual_po_amount FROM purchase_orders WHERE id = ?`, [po_id]);
                const po_used_amount = (Number(getPoLimit[0].po_amount) + Number(amount));
                const updatePoQuery = await db.query("UPDATE purchase_orders SET po_amount = ? WHERE id = ?", [po_used_amount, po_id]);
            }
        }

        const existingMeasurement = await db.query(`SELECT * FROM measurement_items WHERE measurement_id= ?`, [id]);

        let dataChanged = false; // Assume data is unchanged until proven otherwise

        // Check if any of the new items data is different from existing data
        for (const item of items_data) {
            for (const child of item.childArray) {
                const matchingExistingData = existingMeasurement.find(existingData =>
                    existingData.description === child.description &&
                    existingData.number === child.no &&
                    existingData.length === child.length &&
                    existingData.breadth === child.breadth &&
                    existingData.depth === child.depth &&
                    existingData.quantity === child.qty
                );
                if (!matchingExistingData) {
                    dataChanged = true; // Data changed
                    break;
                }
            }
            if (dataChanged) break;
        }

        if (dataChanged) {
            // Data changed, insert only changed items into ptm_timeline
            for (const item of items_data) {
                for (const child of item.childArray) {
                    const matchingExistingData = existingMeasurement.find(existingData =>
                        existingData.description === child.description &&
                        existingData.number === child.no &&
                        existingData.length === child.length &&
                        existingData.breadth === child.breadth &&
                        existingData.depth === child.depth &&
                        existingData.quantity === child.qty
                    );
                    if (!matchingExistingData) {
                        // Insert only if data is different
                        await insertIntoPtmTimelines(
                            id,
                            po_id,
                            complaint_id,
                            item.order_line_number,
                            item.unit,
                            child.description,
                            child.no,
                            child.length,
                            child.breadth,
                            child.depth,
                            parseFloat(child.qty).toFixed(2),
                            item.rate,
                            item.total_qty,
                            req.user.user_id
                        );
                    }
                }
            }
        }

        // Delete existing items
        for (const existingData of existingMeasurement) {
            await db.query(`DELETE FROM measurement_items WHERE id = ?`, [existingData.id]);
        }

        // Insert new items
        for (const item of items_data) {

            const updateQty = await updateQuantityInPo(item.total_qty, item.order_line_number, po_id);
            for (const child of item.childArray) {
                await insertMeasurementItem(
                    id,
                    po_id,
                    complaint_id,
                    item.order_line_number,
                    item.unit,
                    child.description,
                    child.no,
                    child.length,
                    child.breadth,
                    child.depth,
                    parseFloat(child.qty).toFixed(2),
                    item.rate,
                    item.total_qty,
                    req.user.user_id
                );

            }
        }

        return res.status(StatusCodes.OK).json({ status: true, message: "Measurement updated successfully" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


async function insertMeasurementItem(measurement_id, po_id, complaint_id, order_line_number, unit_id, description, number, length, breadth, depth, quantity, rate, total_quantity, created_by) {
    try {
        const insertItemQuery = "INSERT INTO measurement_items (measurement_id, po_id, complaint_id, order_line_number, unit_id, description, number, length, breadth, depth, quantity, rate, total_quantity, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertItemValues = [
            measurement_id,
            po_id,
            complaint_id,
            order_line_number,
            unit_id,
            description,
            number,
            length,
            breadth,
            depth,
            parseFloat(quantity).toFixed(2),
            rate,
            total_quantity,
            created_by
        ];
        await db.query(insertItemQuery, insertItemValues);
    } catch (error) {
        console.error("Error inserting measurement item:", error);
        throw error;
    }
}

async function insertIntoPtmTimelines(measurement_id, po_id, complaint_id, order_line_number, unit_id, description, number, length, breadth, depth, quantity, rate, total_quantity, created_by) {
    try {

        const insertQuery = "INSERT INTO ptm_timeline (measurement_id, po_id, complaint_id, order_line_number, unit_id, description, number, length, breadth, depth, quantity, rate, total_quantity, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertValues = [measurement_id, po_id, complaint_id, order_line_number, unit_id, description, number, length, breadth, depth, parseFloat(quantity).toFixed(2), rate, total_quantity, created_by];
        await db.query(insertQuery, insertValues);
    } catch (error) {
        console.error("Timeline insertion error:", error);
        throw error;
    }
}


const deleteMeasurementDetails = async (req, res) => {

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

        const deleteQuery = await db.query("DELETE FROM measurements WHERE id = ?", [id]);

        if (deleteQuery.affectedRows > process.env.VALUE_ZERO) {
            await db.query(`DELETE FROM measurement_items WHERE measurement_id='${id}'`);

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Measurement deleted successfully"
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Error! measurement not deleted"
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


const discardMeasurementDetails = async (req, res) => {
    try {
        // const id = req.params.id;
        // const complaint_id = req.params.complaint_id;

        const { id, complaint_id, measurement_amount, po_id } = req.body;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message
            });
        }

        let status = '1';
        const updateMeasurementQuery = await db.query(`UPDATE measurements SET status = '2' WHERE id = ?`, [id]);

        if (updateMeasurementQuery.affectedRows > 0) {

            const updateItemsQuery = await db.query(`UPDATE measurement_items SET status = '2' WHERE measurement_id = ?`, [id]);

            if (updateItemsQuery.affectedRows > 0) {
                const poAmountUpdate = await subtractPoAmount(measurement_amount, po_id)
                const complaintStatus = await updateComplaintStatus(complaint_id, status);

                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: "Measurement Discard Successfully."
                });
            } else {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Error! Measurement items status not updated"
                });
            }
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Error! Measurement status not updated"
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}


async function subtractPoAmount(measurement_amount, po_id) {
    const update = await db.query(
        `UPDATE purchase_orders SET po_amount = po_amount - ? WHERE id = ?`,
        [measurement_amount, po_id]
    )
}

const getAllDiscardMeasurements = async (req, res) => {

    try {

        //pagination data
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR sales_area.sales_area_name LIKE '%${searchData}%') OR measurements.measurement_date LIKE '${searchData}'`;
        }

        const selectQuery = `SELECT measurements.*, regional_offices.regional_office_name, sales_area.sales_area_name, outlets.outlet_name, complaints.complaint_unique_id FROM measurements LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id LEFT JOIN outlets ON outlets.id = measurements.outlet_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.status = '2' ${search_value} ORDER BY measurements.measurement_date DESC LIMIT ${pageFirstResult} , ${pageSize}`

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                // const complaintTypeDetail = await getComplaintTypeById(row.complaint_id);
                const complaintTypeDetail = await getComplaintAndComplaintTypeById(row.complaint_id);

                // get all measurments item list
                const items = await getMeasurementsItemsById(row.id);
                finalData.push({
                    id: row.id,
                    measurement_amount: "₹ " + row.amount,
                    measurement_date: moment(row.measurement_date).format('DD-MM-YYYY'),
                    financial_year: row.financial_year,
                    ro_office_id: row.ro_office_id,
                    sale_area_id: row.sale_area_id,
                    outlet_id: row.outlet_id,
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    po_limit: "₹ " + PoDetails.po_limit,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id ? row.complaint_unique_id : null,
                    complaint_type_name: complaintTypeDetail.complaint_type_name ? complaintTypeDetail.complaint_type_name : null,
                    // created_by: createdBy[0].name,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
                    outlet_name: row.outlet_name,
                    status: row.status,
                    items: items
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


const getDiscardMeasurementsDetailsById = async (req, res) => {

    try {

        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const selectQuery = `SELECT measurements.*, regional_offices.regional_office_name, sales_area.sales_area_name, outlets.outlet_name FROM measurements LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id LEFT JOIN outlets ON outlets.id = measurements.outlet_id WHERE measurements.id = ? AND measurements.status = '2'`;

        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var uniqueItemsMap = new Map(); // Use Set to store unique items
            var uniqueItemsMapNew = new Map(); // Use Set to store unique items

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                // const complaintTypeDetail = await getComplaintTypeById(row.complaint_id);
                const complaintTypeDetail = await getComplaintById(row.complaint_id);

                // get all measurments item list
                const items = await getMeasurementsItemsById(row.id);

                // Add each item to the Set
                items.forEach(item => {
                    // Include additional information in the Map
                    const key = item.item_id; // Use item_id as the key
                    if (!uniqueItemsMap.has(key)) {
                        uniqueItemsMap.set(key, {
                            item_id: item.item_id,
                            label: item.unique_id + " - " + item.item_name,
                            rate: item.rate,
                            unit_name: item.unit_name,
                            unit_id: item.unit_id,
                            total_qty: item.total_quantity
                        });
                    }
                });

                // Add each item to the Set for childArray
                items.forEach(item => {
                    // Include additional information in the Map
                    const key = item.item_id; // Use item_id as the key
                    if (!uniqueItemsMapNew.has(key)) {
                        uniqueItemsMapNew.set(key, {
                            item_id: item.item_id,
                            item_name: item.unique_id + " - " + item.item_name,
                            rate: item.rate,
                            unit: item.unit_name,
                            unit_id: item.unit_id,
                            total_qty: item.total_quantity,
                            measurement_id: item.measurement_id
                        });
                    }
                });

                for (const item of items) {
                    item.item_name = item.unique_id + ' - ' + item.item_name
                }

                finalData.push({
                    id: row.id,
                    measurement_amount: row.amount,
                    measurement_date: moment(row.measurement_date).format('YYYY-MM-DD'),
                    financial_year: row.financial_year,
                    ro_office_id: row.ro_office_id,
                    sale_area_id: row.sale_area_id,
                    outlet_id: row.outlet_id,
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    po_limit: PoDetails.po_limit,
                    complaint_id: row.complaint_id,
                    complaint_type_name: complaintTypeDetail.complaint_unique_id ? complaintTypeDetail.complaint_unique_id : null,
                    created_by: createdBy[0].name,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
                    outlet_name: row.outlet_name,
                    status: row.status,
                    //items: items,
                    po_details: PoDetails,
                })
            }

            // Convert Map values back to an array
            const uniqueItemsArray = Array.from(uniqueItemsMap.values());
            const uniqueItemsSubChildArray = Array.from(uniqueItemsMapNew.values());

            // get all  measurement items sub child data like number, depth breadth etc...
            if (uniqueItemsSubChildArray.length > 0) {
                for (const childArray of uniqueItemsSubChildArray) {
                    const measurementSubDetails = await getMeasurementsItemsSubChildById(childArray.measurement_id, childArray.item_id); // Update row.id to childArray.id
                    childArray.childArray = measurementSubDetails;
                }
            }

            // Include unique items in the finalData array
            finalData.forEach(data => {
                data.items_id = uniqueItemsArray;
                data.items_data = uniqueItemsSubChildArray;
            });

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: finalData[0],
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


const measurementDetailsWithPoAndComplaint = async (req, res) => {

    try {
        const po_id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id: po_id });

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const selectQuery = "SELECT measurements.*, purchase_orders.po_number, purchase_orders.po_work, purchase_orders.po_limit, purchase_orders.po_amount, complaints.complaint_unique_id, complaints.id as complaint_id FROM measurements LEFT JOIN purchase_orders ON purchase_orders.id = measurements.po_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.po_id = ? AND measurements.status = '5' ";

        const queryResult = await db.query(selectQuery, [po_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (row of queryResult) {
                // get sale area details
                const saleArea = await db.query("SELECT id, sales_area_name FROM sales_area WHERE id = ?", [row.sale_area_id]);

                //get outlet details
                const outletDetails = await db.query("SELECT id, outlet_name FROM outlets WHERE regional_office_id = ? AND sales_area_id = ?", [row.ro_office_id, row.sale_area_id]);

                //get regional office details
                const regionalOfficeDetails = await db.query("SELECT id, regional_office_name FROM regional_offices WHERE id = ?", [row.ro_office_id]);

                // get location details
                const locationDetails = await db.query("SELECT id, district_name FROM districts WHERE regional_office_id = ? AND sales_area_id = ?", [row.ro_office_id, row.sale_area_id]);

                // order by details
                const orderByDetails = await getCreatedByDetails(row.created_by);

                finalData.push({
                    measurement_id: row.id,
                    measurement_date: moment(row.measurement_date).format('DD-MM-YYYY'),
                    measurement_no: row.measurement_unique_id,
                    po_number: row.po_number,
                    title: row.work,
                    po_limit: row.po_limit,
                    po_amount: row.po_amount,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_id: row.complaint_id,
                    work: '',
                    area_manager: '',
                    team_technician: '',
                    letter_status: '',
                    attachments: '',
                    outlet_name: outletDetails[0].outlet_name,
                    outlet_id: outletDetails[0].id,
                    ro_office: regionalOfficeDetails[0].regional_office_name,
                    sale_area: saleArea[0].sales_area_name,
                    location: locationDetails[0].district_name,
                    order_by: orderByDetails.name,
                    financial_year: row.financial_year
                });
            }

            // all items list
            const itemLists = await getFullItemList();
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: finalData,
                    items: itemLists
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Data not found",
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


const measurementDetailsWithPo = async (req, res) => {

    try {
        const { po_id, measurement_ids } = req.query;
        const measurementArray = measurement_ids.split(',').map(Number);

        const selectQuery = "SELECT measurements.*, purchase_orders.po_number, purchase_orders.po_work, purchase_orders.po_limit, purchase_orders.po_amount, complaints.complaint_unique_id, complaints.id as complaint_id FROM measurements LEFT JOIN purchase_orders ON purchase_orders.id = measurements.po_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.po_id = ? AND measurements.id IN (?) AND measurements.status = '5' ";

        const queryResult = await db.query(selectQuery, [po_id, measurementArray]);

        if (queryResult.length > 0) {
            var finalData = [];

            for (row of queryResult) {
                // get sale area details
                const saleArea = await db.query("SELECT id, sales_area_name FROM sales_area WHERE id = ?", [row.sale_area_id]);

                //get outlet details
                const outletDetails = await db.query("SELECT id, outlet_name FROM outlets WHERE regional_office_id = ? AND sales_area_id = ?", [row.ro_office_id, row.sale_area_id]);

                //get regional office details
                const regionalOfficeDetails = await db.query("SELECT id, regional_office_name FROM regional_offices WHERE id = ?", [row.ro_office_id]);

                // get location details
                const locationDetails = await db.query("SELECT id, district_name FROM districts WHERE regional_office_id = ? AND sales_area_id = ?", [row.ro_office_id, row.sale_area_id]);

                // order by details
                const orderByDetails = await getCreatedByDetails(row.created_by);

                finalData.push({
                    measurement_id: row.id,
                    measurement_date: moment(row.measurement_date).format('DD-MM-YYYY'),
                    measurement_no: row.measurement_unique_id,
                    po_number: row.po_number,
                    title: row.work,
                    po_limit: row.po_limit,
                    po_amount: row.po_amount,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_id: row.complaint_id,
                    work: '',
                    area_manager: '',
                    team_technician: '',
                    letter_status: '',
                    attachments: '',
                    outlet_name: outletDetails[0].outlet_name,
                    outlet_id: outletDetails[0].id,
                    ro_office: regionalOfficeDetails[0].regional_office_name,
                    sale_area: saleArea[0].sales_area_name,
                    location: locationDetails[0].district_name,
                    order_by: orderByDetails.name,
                    financial_year: row.financial_year
                });
            }

            // all items list
            const itemLists = await getFullItemList();
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData,
                items: itemLists
            });
        }
        else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}


const ItemsOnMeasurementId = async (req, res) => {

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

        const queryResult = await db.query(`SELECT Distinct measurement_items.complaint_id, measurement_items.id, measurement_items.measurement_id, measurement_items.order_line_number, measurement_items.unit_id, measurement_items.number, measurement_items.length, measurement_items.breadth, measurement_items.depth, measurement_items.quantity, measurement_items.total_quantity, measurement_items.rate As measurement_item_rate, measurement_items.amount, purchase_order_item.name AS item_name, purchase_order_item.hsn_code, purchase_order_item.unit AS unit_name, purchase_order_item.rate AS rate FROM measurement_items LEFT JOIN purchase_order_item ON purchase_order_item.order_line_number = measurement_items.order_line_number  WHERE measurement_items.measurement_id = ?`, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var uniqueItemsMap = new Map(); // Use Set to store unique items
            var uniqueItemsMapNew = new Map(); // Use Set to store unique items

            // Add each item to the Set
            let complaintDetails = await getComplaintUniqueId(queryResult[0].complaint_id)
            queryResult.forEach(async (item) => {
                // Include additional information in the Map
                const key = item.order_line_number; // Use item_id as the key
                if (!uniqueItemsMap.has(key)) {
                    uniqueItemsMap.set(key, {
                        order_line_number: item.order_line_number,
                        label: `${item.item_name}`,
                        hsn_code: item.hsn_code,
                        rate: item.measurement_item_rate,
                        unit_name: item.unit_name,
                        unit_id: item.unit_id,
                        total_qty: item.total_quantity,
                        measurement_id: item.measurement_id
                    });
                }
            });

            // Add each item to the Set for childArray
            queryResult.forEach(item => {
                // Include additional information in the Map
                const key = item.order_line_number; // Use item_id as the key
                if (!uniqueItemsMapNew.has(key)) {
                    uniqueItemsMapNew.set(key, {
                        order_line_number: item.order_line_number,
                        item_name: `${item.item_name}`,
                        hsn_code: item.hsn_code,
                        rate: item.measurement_item_rate,
                        unit: item.unit_name,
                        unit_id: item.unit_id,
                        total_qty: item.total_quantity,
                        measurement_id: item.measurement_id
                    });
                }
            });

            // Convert Map values back to an array
            const uniqueItemsArray = Array.from(uniqueItemsMap.values());
            const uniqueItemsSubChildArray = Array.from(uniqueItemsMapNew.values());

            // get all  measurement items sub child data like number, depth breadth etc...
            if (uniqueItemsSubChildArray.length > 0) {
                for (const childArray of uniqueItemsSubChildArray) {
                    const measurementSubDetails = await getMeasurementsItemsSubChildById(childArray.measurement_id, childArray.order_line_number); // Update row.id to childArray.id
                    childArray.childArray = measurementSubDetails;
                }
            }

            finalData.push({
                items_id: uniqueItemsArray,
                items_data: uniqueItemsSubChildArray,
                complaintDetails: complaintDetails,
                measurement_list:id
            });


            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: finalData[0],
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Items not found",
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

// get all items listed in measurement details with PO 
async function getFullItemList() {
    try {
        const selectQuery = `SELECT id, name, rate FROM item_masters`;
        const queryResult = await db.query(selectQuery);
        return queryResult;
    } catch (error) {
        // Re-throw the error so the caller can handle it appropriately
        throw error;
    }
}

// get approved complaints from site inspections    
const getComplaintsDetailsById = async (req, res) => {
    try {
        const { id } = req.params.id;;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const selectQuery = await db.query(`SELECT * FROM complaints WHERE id = '${id}'`)

        if (selectQuery.length > 0) {
            const finalData = [];
            const getOutletId = selectQuery[0].outlet_id;
            const getRoId = selectQuery[0].ro_id;
            const getSaleAreaId = selectQuery[0].sale_area_id;

            const regionalOfficeDetails = await getRegionalNameById(selectQuery[0].ro_id);
            const saleAreaDetails = await getSaleAreaNameById(selectQuery[0].sale_area_id);

            if (selectQuery[0].complaint_for == '1') {
                const energyCompanyName = await getEnergyCompaniesById(selectQuery[0].energy_company_id);
                company_name = energyCompanyName.name;
                const selectedOutlets = await getOutletById(selectQuery[0].outlet_id);
                outletDetails = selectedOutlets;
            }
            else {
                const energyCompanyName = await getCompanyDetailsById(selectQuery[0].energy_company_id);
                company_name = energyCompanyName.company_name;
            }


            finalData.push({
                id: row.id,
                complaint_unique_id: row.complaint_unique_id,
                energy_company_name: company_name,
                complaint_type: complaintTypeValue,
                complaint_for: row.complaint_for,
                outlet: outletDetails,
                regionalOffice: regionalOfficeDetails,
                saleAreaDetails: saleAreaDetails,
                order_via: row.order_via,
                order_via_id: row.order_via_id,
                order_by_details: order_by_name,
                order_by_id: row.order_by_id,
            })

            return res.status(StatusCodes.OK).json({ status: true, data: finalData })
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getAllComplaintsFromSite = async (req, res) => {
    try {
        const selectQuery1 = await db.query(`SELECT DISTINCT(stock_punch_histories.complaint_id ) AS stock_punch_complaint_id FROM stock_punch_histories WHERE stock_punch_histories.site_approved_status = '2'`);

        const finalData = [];

        for (const row of selectQuery1) {
            const selectQuery = await db.query(`SELECT * FROM complaints WHERE id = '${row.stock_punch_complaint_id}'`);

            if (selectQuery.length > 0) {
                const complaint = selectQuery[0];
                const outletDetails = complaint.complaint_for === '1' ? await getOutletById(complaint.outlet_id) : null;
                const regionalOfficeDetails = await getRegionalNameById(complaint.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(complaint.sale_area_id);
                const energyCompanyName = await getEnergyCompaniesById(complaint.energy_company_id);

                finalData.push({
                    id: complaint.id,
                    complaint_unique_id: complaint.complaint_unique_id,
                    energy_company_name: energyCompanyName.name,
                    complaint_type: complaint.complaint_type,
                    complaint_for: complaint.complaint_for,
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    order_via: complaint.order_via,
                    order_via_id: complaint.order_via_id,
                    order_by_details: complaint.order_by_name,
                    order_by_id: complaint.order_by_id,
                });
            }
        }

        if (finalData.length > 0) {
            return res.status(StatusCodes.OK).json({ status: true, data: finalData });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getResolvedComplaintsInBilling = async (req, res) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;
        const attachment = req.query.status;
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value = `AND complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%'`;
        }

        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;
        const finalData = [];
        let status;
        let attachmentStatus;

        let complaintRaiseType;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = `WHERE complaints.complaints_approval_by > 0 AND complaints.status = '5'`;
        } else {
            whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '5' `;
        }

        if (attachment) {
            whereConditions += ` AND attachment_status = '${attachment}'`
        }

        if (outlet_id) {
            whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', complaints.outlet_id) > 0`;
        }

        if (regional_office_id) {
            whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', complaints.ro_id) > 0`;
        }

        if (sales_area_id) {
            whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', complaints.sale_area_id) > 0`;
        }
        if (order_by_id) {
            whereConditions += ` AND  complaints.order_by_id ='${order_by_id}' `;
        }


        const selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id ${whereConditions} ${search_value} ORDER BY complaints.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const result = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (result.length > process.env.VALUE_ZERO) {
            let outletDetails;
            let company_name;
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            for (const row of result) {
                const complaintType = await getComplaintTypeById(row.complaint_type);
                const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                //const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                //const outletDetails = await getOutletById(row.outlet_id);
                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                var order_by_name = '';

                if (row.complaint_for == '1') {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name;
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                }
                else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = '';
                }

                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name;
                }

                if (row.attachment_status == 0) {
                    status = 'Resolved'
                } else if (row.attachment_status == 1) {
                    status = 'HardCopy-PTM'
                } else if (row.attachment_status == 2) {
                    status = 'Discard'
                } else if (row.attachment_status == 3) {
                    status = 'Draft'
                } else if (row.attachment_status == 4) {
                    status = 'Pending to PI'
                } else if (row.attachment_status == 5) {
                    status = 'Ready to PI'
                }

                //-------------Complaints raise type like own/others --------------------------------

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = 'own';
                } else {
                    complaintRaiseType = 'other';
                }

                const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
                const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
                const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;

                finalData.push({
                    id: row.id,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: complaintTypeValue,
                    complaint_for: row.complaint_for,
                    energy_company_id:row.energy_company_id,
                    work_permit: row.work_permit,
                    description: row.description,
                    status: status,
                    complaintRaiseType: complaintRaiseType,
                    complaints_approval_by: complaintApprovalByName,
                    complaint_raise_by: complaintRaiseByName,
                    created_at: moment(row.created_at).format('YYYY-MM-DD'),
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    order_via: row.order_via,
                    attachmentStatus: attachmentStatus,
                    order_via_id: row.order_via_id,
                    order_by_details: order_by_name,
                    order_by_id: row.order_by_id,
                });
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


const getAttachmentAndInspectionDetails = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: complaintId });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message
            });
        }

        const attachmentQuery = `SELECT * FROM pi_attachment WHERE complaint_id = ?`;
        const attachmentResult = await db.query(attachmentQuery, [complaintId]);

        for (let item of attachmentResult) {
            item.filePath = item.filePath ? JSON.parse(item.filePath) : [];
        }

        const details = await allApprovedComplaintsData(complaintId);
        const complainsDetails = await getComplaintDetails(complaintId)

        const responseData = {
            status: true,
            message: "Request fetched successfully",
            data: {
                details: details,
                attachments: attachmentResult,
                complaints_Details: complainsDetails
            }
        };

        return res.status(StatusCodes.OK).json(responseData);

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
};


const getAllMeasurements = async (req, res) => {

    try {

        const status = req.params.status;

        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        var search_value = "";
        let actualStatus;

        if (searchData != null && searchData != '') {
            search_value += `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR sales_area.sales_area_name LIKE '%${searchData}%') OR measurements.measurement_date LIKE '${searchData}'`;
        }

        const selectQuery = `SELECT measurements.*, regional_offices.regional_office_name, sales_area.sales_area_name, outlets.outlet_name, complaints.complaint_unique_id FROM measurements LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id LEFT JOIN outlets ON outlets.id = measurements.outlet_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.status = '${status}' ${search_value} ORDER BY measurements.measurement_date DESC LIMIT ${pageFirstResult} , ${pageSize}`

        const queryResult = await db.query(selectQuery);

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                // const complaintTypeDetail = await getComplaintTypeById(row.complaint_id);
                const complaintTypeDetail = await getComplaintAndComplaintTypeById(row.complaint_id);

                // get all measurments item list
                const items = await getMeasurementsItemsById(row.id);

                if (status == '2') {
                    actualStatus = 'Discard'
                } else if (status == '3') {
                    actualStatus = 'Draft'
                } else if (status == '4') {
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
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    po_limit: "₹ " + PoDetails.po_limit,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id ? row.complaint_unique_id : null,
                    complaint_type_name: complaintTypeDetail.complaint_type_name ? complaintTypeDetail.complaint_type_name : null,
                    // created_by: createdBy[0].name,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
                    outlet_name: row.outlet_name,
                    status: actualStatus,
                    items: items
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


const discardToReactiveMeasurement = async (req, res) => {
    try {
        // const id = req.params.id;
        // const complaint_id = req.params.complaint_id;
        const { id, complaint_id, measurement_amount, po_id } = req.body;
         
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const selectQuery = await db.query(`select * from measurements where complaint_id='${complaint_id}' AND status != '2'`)
        if (selectQuery.length > 0) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Measurements are already in progress. So you can not Active this measurements."
                });
        }
        const status = '3';

        const updateQuery = await db.query("Update measurements SET status = ? WHERE id = ?", [status, id]);

        if (updateQuery.affectedRows > 0) {
            const poAmountUpdate = await updatePoAmount(measurement_amount, po_id)

            const updateMeasurement = await updateMeasurementStatus(id, status)
            const updateComplaint = await updateComplaintStatus(complaint_id, status)

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Measurement reactive successfully."
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Error! measurement not reactive."
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

async function updatePoAmount(measurement_amount, po_id) {
    const update = await db.query(
        `UPDATE purchase_orders SET po_amount = po_amount + ? WHERE id = ?`,
        [measurement_amount, po_id]
    )
}


async function updateMeasurementStatus(id, status) {
    await db.query(`update measurement_items set status = '${status}' WHERE measurement_id='${id}'`);
}

async function updateComplaintStatus(complaintId, status) {
    await db.query(`update complaints  set attachment_status = '${status}' WHERE id='${complaintId}'`);
}


const getAllMeasurementsBasedOnStatus = async (req, res) => {

    try {

        //pagination data
        const status = req.query.status;
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;
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
            search_value += `AND (regional_offices.regional_office_name LIKE '%${searchData}%' OR sales_area.sales_area_name LIKE '%${searchData}%') OR measurements.measurement_date LIKE '${searchData}'`;
        }

        if (status) {
            whereConditions = ` WHERE measurements.status = '${status}' `
        }

        if (outlet_id) {
            whereConditions += ` AND measurements.outlet_id = '${outlet_id}'`;
        }

        if (regional_office_id) {
            whereConditions += ` AND measurements.ro_office_id = '${regional_office_id}'`;
        }

        if (sales_area_id) {
            whereConditions += ` AND measurements.sale_area_id = '${sales_area_id}'`;
        }

        if (order_by_id) {
            whereConditions += ` AND  complaints.order_by_id ='${order_by_id}'`;
        }

        const selectQuery = `SELECT measurements.*, regional_offices.regional_office_name, sales_area.sales_area_name, outlets.outlet_name, complaints.complaint_unique_id, complaints.order_by_id, users.name AS order_by_name FROM measurements LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id LEFT JOIN outlets ON outlets.id = measurements.outlet_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id LEFT JOIN users ON users.id = complaints.order_by_id ${whereConditions} ${search_value} ORDER BY measurements.measurement_date DESC LIMIT ${pageFirstResult} , ${pageSize}`

        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        let actualStatus;
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                // const complaintTypeDetail = await getComplaintTypeById(row.complaint_id);
                const complaintTypeDetail = await getComplaintAndComplaintTypeById(row.complaint_id);

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
                    measurement_amount: row.amount,
                    measurement_date: moment(row.measurement_date).format('DD-MM-YYYY'),
                    financial_year: row.financial_year,
                    ro_office_id: row.ro_office_id,
                    sale_area_id: row.sale_area_id,
                    outlet_id: row.outlet_id,
                    order_by_id: row.order_by_id,
                    order_by_name: row.order_by_name,
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    po_limit: PoDetails.po_limit,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id ? row.complaint_unique_id : null,
                    complaint_type_name: complaintTypeDetail.complaint_type_name ? complaintTypeDetail.complaint_type_name : null,
                    // created_by: createdBy[0].name,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
                    outlet_name: row.outlet_name,
                    status: actualStatus,
                    items: items
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


const saveIntoDraftMeasurement = async (req, res) => {
    try {
        const { measurement_date, financial_year, ro_office_id, sale_area_id, outlet_id, po_id, complaint_id, status, amount, items_data } = req.body;

        const { error } = measurementValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message });
        }

        const unique_id = await generateRandomAlphanumeric(10);

        const insertQuery = "INSERT INTO measurements (measurement_unique_id, measurement_date, financial_year, ro_office_id, sale_area_id, outlet_id, po_id, complaint_id, status, amount, created_by) VALUES (? , ? , ? , ?, ?, ?, ?, ?, ?, ?, ?)";

        const insertData = [unique_id, measurement_date, financial_year, ro_office_id, sale_area_id, outlet_id, po_id, complaint_id, status, amount, req.user.user_id];
        const queryResult = await db.query(insertQuery, insertData);

        if (queryResult.affectedRows) {

            const measurement_id = queryResult.insertId;

            // update PO for used amount or remaining amount
            if (po_id != null) {
                const getPoLimit = await db.query(`SELECT po_limit, po_amount, po_final_amount FROM purchase_orders WHERE id = ?`, [po_id]);

                const po_used_amount = (getPoLimit[0].po_amount + amount);
                const updatePoQuery = await db.query("UPDATE purchase_orders SET po_amount = ? WHERE id = ?", [po_used_amount, po_id]);
            }

            if (items_data != null) {

                const insertItemQuery = "INSERT INTO measurement_items(measurement_id, po_id, complaint_id, item_id, unit_id, description, number, length, breadth, depth, quantity, rate, amount, total_quantity, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                let amount = 0;
                for (const item of items_data) {

                    for (const child of item.childArray) {
                        amount = child.qty * item.rate;
                        const insertItemsValues = [
                            measurement_id,
                            po_id,
                            complaint_id,
                            item.item_id,
                            item.unit_id,
                            child.description,
                            child.no,
                            child.length,
                            child.breadth,
                            child.depth,
                            child.qty,
                            item.rate,
                            amount,
                            item.total_qty,
                            req.user.user_id
                        ];
                        try {
                            await db.query(insertItemQuery, insertItemsValues);
                        } catch (error) {
                            // Handle individual insert error here (optional)
                            console.error("Error inserting measurement item:", error);
                        }
                    }

                }
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Measurement saved in draft" });
        }
        return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Failed to save in draft." });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getRegionalByIdForPtm = async (req, res) => {
    try {
        const status = req.query.status;

        if (status) {
            selectQuery = await db.query(`SELECT * FROM complaints WHERE attachment_status='1' AND status='${status}' ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT * FROM  complaints where attachment_status='1' ORDER BY id ASC;`)
        }

        if (selectQuery.length > process.env.VALUE_ZERO) {

            const getOutlet = selectQuery.map(item => item.ro_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index)

            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getRegionalNameById(dataFilter[i]);
                finalData.push(outletDetails);
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


const getOutletByIdForPtm = async (req, res) => {
    try {
        const status = req.query.status;

        if (status) {
            selectQuery = await db.query(`SELECT * FROM complaints WHERE attachment_status='1' AND status='${status}' AND complaint_for = '1' ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT * FROM  complaints where attachment_status='1' ORDER BY id ASC;`)
        }

        if (selectQuery.length > process.env.VALUE_ZERO) {

            const getOutlet = selectQuery.map(item => item.outlet_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index)

            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getOutletById(dataFilter[i]);
                finalData.push(outletDetails);
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


const getOrderByIdForPtm = async (req, res) => {
    try {
        const status = req.query.status;

        const selectQuery = await db.query(`SELECT * FROM complaints WHERE attachment_status='1' AND status='${status}' ORDER BY id ASC;`)

        if (selectQuery.length > process.env.VALUE_ZERO) {

            const getOutlet = selectQuery.map(item => item.order_by_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index)
            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getOrderById(dataFilter[i]);
                finalData.push(outletDetails);
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


const getSaleByIdNewForPtm = async (req, res) => {
    try {
        const status = req.query.status;

        if (status) {
            selectQuery = await db.query(`SELECT * FROM complaints WHERE status='${status}' and attachment_status = '1' ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT * FROM complaints where  attachment_status = '1' ORDER BY id ASC;`)
        }

        if (selectQuery.length > process.env.VALUE_ZERO) {

            const getOutlet = selectQuery.map(item => item.sale_area_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index)

            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getSaleAreaNameById(dataFilter[i]);
                finalData.push(outletDetails);
            }

            // Flatten the finalData array
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


const getRegionalByIdInsideBilling = async (req, res) => {
    try {
        const status = req.query.status;

        if (!status) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Status is required" });
        }

        const selectQuery = await db.query(`SELECT * FROM measurements WHERE status='${status}'  ORDER BY id ASC;`)

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getOutlet = selectQuery.map(item => item.ro_office_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index)
            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getRegionalNameById(dataFilter[i]);
                finalData.push(outletDetails);
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


const getSalesByIdInsideBilling = async (req, res) => {
    try {
        const status = req.query.status;

        if (!status) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Status is required" });
        }

        const selectQuery = await db.query(`SELECT * FROM measurements WHERE status='${status}'  ORDER BY id ASC;`)


        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getOutlet = selectQuery.map(item => item.sale_area_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index)
            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getSaleAreaNameById(dataFilter[i]);
                finalData.push(outletDetails);
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


const getOutletByIdInsideBilling = async (req, res) => {
    try {
        const status = req.query.status;

        if (!status) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Status is required" });
        }

        const selectQuery = await db.query(`SELECT * FROM measurements WHERE status='${status}' AND outlet_id IS NOT NULL  ORDER BY id ASC;`)

        if (selectQuery.length > process.env.VALUE_ZERO) {
            const getOutlet = selectQuery.map(item => item.outlet_id);
            const dataFilter = getOutlet.filter((value, index) => getOutlet.indexOf(value) === index)
            const finalData = [];

            for (let i = 0; i < dataFilter.length; i++) {
                const outletDetails = await getOutletById(dataFilter[i]);
                finalData.push(outletDetails);
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


const getAllOrderByForMeasurements = async (req, res) => {
    try {
        const status = req.query.status;
        const pi_status = req.query.pi_status;
        const selectQuery = `select m.complaint_id, c.order_by_id from measurements m
        left join complaints c on c.id = m.complaint_id WHERE m.status = '${status}'`;

        const queryResult = await db.query(selectQuery)
        if (queryResult.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }

        for (let item of queryResult) {
            if (item.order_by_id) {
                const userDetails = await getUserDetails(item.order_by_id);
                item.name = userDetails[0].name ?? '';
                item.id = userDetails[0].id ?? '';
            }

        }

        const filteredResult = {};
        queryResult.forEach(record => {
            if (!filteredResult[record.id]) {
                filteredResult[record.id] = record;
            }
        });

        const uniqueRecords = Object.values(filteredResult);
        return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: uniqueRecords })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


async function deductAmountInsidePo(measurement_id, po_id) {

    const selectQuery = `Select amount from measurements where id='${measurement_id}'`;
    const totalItemsAmount = await db.query(selectQuery);

    const getPoData = await db.query(`Select po_amount from purchase_orders where id='${po_id}'`);
    if (totalItemsAmount.length > process.env.VALUE_ZERO) {
        const ItemsAmount = totalItemsAmount[0].amount;
        const po_amount = getPoData[0].po_amount;
        const updateAmount =  Math.abs(ItemsAmount - po_amount);
        await db.query(`Update purchase_orders set po_amount='${updateAmount}' where id='${po_id}'`);

    }
}


const getSimilarPurchaseOrders = async (req, res) => {
    try {
        const { id } = req.params;

        const itemsQuery = `SELECT * FROM purchase_orders WHERE id = ?`;
        const orderItems = await db.query(itemsQuery, [id]);

        if (orderItems.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Purchase order not found or has no items" });
        }

        // Extract item IDs from the current order
        const itemIds = orderItems.map(item => item.id);

        // Query to find other purchase orders containing the same items
        const similarOrdersQuery = `
            SELECT DISTINCT id 
            FROM purchase_order_item 
            WHERE id IN (?) 
            AND measurement_id != ?`;

        const similarOrders = await db.query(similarOrdersQuery, [itemIds, id]);

        // Extract the IDs of similar purchase orders
        const similarOrderIds = similarOrders.map(order => order.id);

        return res.status(StatusCodes.OK).json({ status: true, similarOrderIds });

    } catch (error) {
        console.error("Error in getSimilarPurchaseOrders:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getMeasurementsTimeLineDetailsById = async (req, res) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message
            });
        }

        const selectQuery = `SELECT measurements.*, complaints.complaint_for, regional_offices.regional_office_name, sales_area.sales_area_name, outlets.outlet_name FROM measurements
         LEFT JOIN regional_offices ON regional_offices.id = measurements.ro_office_id
          LEFT JOIN sales_area ON sales_area.id = measurements.sale_area_id 
          LEFT JOIN outlets ON outlets.id = measurements.outlet_id 
          LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.id = ?`;

        let queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > 0) {
            const finalData = [];
            const uniqueItemsMap = new Map();
            const uniqueItemsMapNew = new Map();
            const getDetails = await allApprovedComplaintsData(queryResult[0].complaint_id);

            for (const row of queryResult) {
                const createdBy = await getCreatedUserNameFromAdmin(row.created_by);
                const PoDetails = await getPoDetailById(row.po_id);
                const complaintTypeDetail = await getComplaintById(row.complaint_id);
                const items = await getMeasurementsItemsById(row.id);

                if (items && items.length > 0) { // Check if items exist and are iterable
                    for (const item of items) {
                        const key = item.order_line_number;
                        if (!uniqueItemsMap.has(key)) {
                            uniqueItemsMap.set(key, {
                                order_line_number: item.order_line_number,
                                label: `${item.item_name}`,
                                hsn_code: item.hsn_code,
                                rate: item.rate,
                                unit_name: item.unit_name,
                                unit_id: item.unit_id,
                                total_qty: item.total_quantity,
                                measurement_id: item.measurement_id,
                                remaining_quantity: item.remaining_quantity,
                            });
                        }
                        if (!uniqueItemsMapNew.has(key)) {
                            uniqueItemsMapNew.set(key, {
                                order_line_number: item.order_line_number,
                                item_name: `${item.item_name}`,
                                hsn_code: item.hsn_code,
                                rate: item.rate,
                                unit: item.unit_name,
                                unit_id: item.unit_id,
                                total_qty: item.total_quantity,
                                measurement_id: item.measurement_id,
                                remaining_quantity: item.remaining_quantity
                            });
                        }
                        item.item_name = `${item.hsn_code} - ${item.items_name}`;
                    }
                }

                finalData.push({
                    id: row.id,
                    measurement_amount: row.amount,
                    measurement_date: moment(row.measurement_date).format('YYYY-MM-DD'),
                    financial_year: row.financial_year,
                    ro_office_id: row.ro_office_id,
                    sale_area_id: row.sale_area_id,
                    outlet_id: row.outlet_id,
                    po_id: row.po_id,
                    po_number: PoDetails.po_number,
                    po_limit: PoDetails.po_limit,
                    complaint_id: row.complaint_id,
                    complaint_for: row.complaint_for,
                    complaint_type_name: complaintTypeDetail.complaint_unique_id || null,
                    created_by: createdBy[0].name,
                    regional_office_name: row.regional_office_name,
                    sales_area_name: row.sales_area_name,
                    outlet_name: row.outlet_name,
                    status: row.status,
                    po_details: PoDetails,
                    stock: getDetails
                });
            }

            const uniqueItemsArray = Array.from(uniqueItemsMap.values());
            const uniqueItemsSubChildArray = Array.from(uniqueItemsMapNew.values());

            if (uniqueItemsSubChildArray.length > 0) {
                for (const childArray of uniqueItemsSubChildArray) {
                    const measurementTimeLineSubDetails = await getMeasurementsItemsTimeLineSubChildById(childArray.measurement_id, childArray.order_line_number); // Update row.id to childArray.id
                    childArray.childArray = measurementTimeLineSubDetails;
                }
            }

            finalData.forEach(data => {
                data.items_id = uniqueItemsArray;
                data.items_data = uniqueItemsSubChildArray;

            });

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: finalData
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
}


async function getMeasurementsItemsTimeLineSubChildById(measurement_id, item_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: item_id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT  description, number as no, length, breadth, depth, quantity as qty, DATE_FORMAT(created_at, '%d-%m-%y %h:%i %p') as created_at FROM ptm_timeline WHERE measurement_id = ${measurement_id} AND order_line_number = ${item_id}`);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult
        }
        else {
            return [];
        }
        
    } catch (error) {
        return error.message;
    }
}


async function getSuperVisorOfAssignDetails(complaintId) {
    try {

        const selectQuery = await db.query(`SELECT * FROM complaints_timeline WHERE assign_to > 0 and status = 'assigned' and complaints_id='${complaintId}'`);

        const supervisors = []
        const managers = []
        const endUsers = []
        const userDetailsMap = new Map();

        if (selectQuery.length > 0) {

            for (let supervisor of selectQuery) {
                // Fetch supervisor details if not fetched already
                if (!userDetailsMap.has(supervisor.supervisor_id)) {
                    const supervisorDetail = await getAdminAndUserDetails(supervisor.supervisor_id);
                    userDetailsMap.set(supervisor.supervisor_id, supervisorDetail[0]);
                }
                // Fetch manager details if not fetched already
                if (!userDetailsMap.has(supervisor.area_manager_id)) {
                    const managerDetail = await getAdminAndUserDetails(supervisor.area_manager_id);
                    userDetailsMap.set(supervisor.area_manager_id, managerDetail[0]);
                }
                // Fetch end user details if not fetched already
                if (!userDetailsMap.has(supervisor.assign_to)) {
                    const endUserDetail = await getAdminAndUserDetails(supervisor.assign_to);
                    userDetailsMap.set(supervisor.assign_to, endUserDetail[0]);
                }
                const supervisorDetail = userDetailsMap.get(supervisor.supervisor_id);
                const managerDetail = userDetailsMap.get(supervisor.area_manager_id);
                const endUserDetail = userDetailsMap.get(supervisor.assign_to);

                managers.push({ id: managerDetail.id, username: managerDetail.username, profile: managerDetail.image });
                endUsers.push({ id: endUserDetail.id, username: endUserDetail.username, profile: endUserDetail.image });
                supervisors.push({ id: supervisorDetail.id, username: supervisorDetail.username, profile: supervisorDetail.image });
            }
        }

        const removeDuplicates = (arr) => {
            const seen = new Set();
            return arr.filter(obj => {
                const id = obj.id;
                return seen.has(id) ? false : seen.add(id);
            });
        };

        const uniqueSupervisors = removeDuplicates(supervisors);
        const uniqueManagers = removeDuplicates(managers);
        const uniqueEndUsers = removeDuplicates(endUsers);
        return [uniqueSupervisors, uniqueManagers, uniqueEndUsers];

    } catch (error) {
        throw error;
    }
}


const getAllPoItem = async (req, res) => {
    try {
        const { roId } = req.query;
        let roCheck = roId ? ` where ro_office='${roId}'` : ``
        const query = `select * from purchase_orders ${roCheck} `

        const queryResult = await db.query(query)

        for (let item of queryResult) {
            const getItems = await getPoItem(item.id)
            item.productDetails = getItems
        }

        return res.status(200).json({ status: true, data: queryResult })
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}


async function getPoItem(po_id) {

    const query = await db.query(`SELECT purchase_order_item.*, item_masters.name FROM purchase_order_item 
    left Join item_masters on item_masters.id = purchase_order_item.item_id WHERE purchase_order_id='${po_id}'`);

    let duplicate = [];

    if (query.length > 0) {
        for (let i = 0; i < query.length; i++) {
            const currentItem = query[i];
            // Check if the current item is not already added as a duplicate
            if (!duplicate.find(item => item.purchase_order_id === currentItem.purchase_order_id && item.item_id === currentItem.item_id)) {
                for (let j = i + 1; j < query.length; j++) {
                    const nextItem = query[j];
                    if (nextItem.purchase_order_id === currentItem.purchase_order_id && nextItem.item_id === currentItem.item_id) {
                        // If a duplicate is found, add it to the duplicate array
                        duplicate.push(currentItem);
                        break;
                    }
                }
            }
        }
    }

    return duplicate;
}


async function updateQuantityInPo(total_qty, order_line_number, po_id) {

    // Ensure that po_id, order_line_number, and total_qty are properly escaped or parameterized to avoid SQL injection
    const selectQuery = await db.query('SELECT * FROM used_po_details WHERE po_id = ? AND order_line_number = ?', [po_id, order_line_number]);

    if (selectQuery.length > 0) {
        const updateQty = 'UPDATE used_po_details SET used_qty = used_qty + ? WHERE order_line_number = ? AND po_id = ?';
        await db.query(updateQty, [total_qty, order_line_number, po_id]);
    } else {
        const insertQuery = 'INSERT INTO used_po_details (po_id, order_line_number, used_qty) VALUES (?, ?, ?)';
        await db.query(insertQuery, [po_id, order_line_number, total_qty]);
    }
}


async function subtractQuantityInPo(measurement_id) {
    try {
        const getOrderLineNumberQuery = 'SELECT order_line_number, po_id, quantity FROM measurement_items WHERE measurement_id = ?';
        const getOrderLineNumberResult = await db.query(getOrderLineNumberQuery, [measurement_id]);

        if (getOrderLineNumberResult.length === 0) {
            return {
                status: false,
                message: 'No records found for the given measurement_id'
            };
        }

        // Loop through each result and process
        for (const result of getOrderLineNumberResult) {
            const { order_line_number, po_id, quantity } = result;

            const selectQuery = 'SELECT used_qty FROM used_po_details WHERE po_id = ? AND order_line_number = ?';
            const [selectResult] = await db.query(selectQuery, [po_id, order_line_number]);

            if (!selectResult) {
                continue; // Skip to the next iteration if record not found
            }

            const usedQty = selectResult.used_qty;

            if (usedQty < quantity) {
                continue; // Skip to the next iteration if subtraction would result in a negative quantity
            }

            const updateQuery = 'UPDATE used_po_details SET used_qty = used_qty - ? WHERE order_line_number = ? AND po_id = ?';
            await db.query(updateQuery, [quantity, order_line_number, po_id]);
        }

        return {
            status: true,
            message: 'All quantities subtracted successfully'
        };
    } catch (error) {
        return {
            status: false,
            message: error.message
        };
    }
}


async function getPiAttachmentDetails(complaint_id) {


    const query = `SELECT * FROM pi_attachment WHERE complaint_id = ?`
    const queryResult = await db.query(query, [complaint_id])


    for (let item of queryResult) {
        item.filePath = item.filePath ? JSON.parse(item.filePath) : []
    }

    return queryResult[0];
}


const updatePoInMeasurementDetails = async (req, res) => {
    try {
        const {
            po_id,
            items_data,
            id,
            amount,
            po_for
        } = req.body;


        // const { error } = measurementValidation.validate(req.body);
        // if (error) {
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         status: false,
        //         message: error.message
        //     });
        // }

        const selectMeasurement = await db.query('SELECT * FROM measurements WHERE id= ?', [id]);
        if (selectMeasurement.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: 'No measurements found.' });
        }

        var complaint_id = selectMeasurement[0].complaint_id;

        const getPoLimit = await db.query('SELECT po_limit, po_amount, actual_po_amount, (po_limit - po_amount) AS remaining_po_amount FROM purchase_orders WHERE id = ?', [po_id]);

        if (getPoLimit.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'Data not found' });
        }

        if (getPoLimit[0].remaining_po_amount < amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'Amount should be less than or equal to purchase order Amount' });
        }

        await deductAmountInsidePo(id, selectMeasurement[0].po_id);
        await subtractQuantityInPo(id);

        const updateQuery = 'UPDATE measurements SET po_id = ?, amount = ?, po_for = ?, updated_by = ? WHERE id = ?';
        const updateValues = [po_id, amount, po_for, req.user.user_id, id];
        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > 0) {
            const getPoLimit = await db.query('SELECT po_amount FROM purchase_orders WHERE id = ?', [po_id]);
            const po_used_amount = Number(getPoLimit[0].po_amount) + Number(amount);
            await db.query('UPDATE purchase_orders SET po_amount = ? WHERE id = ?', [po_used_amount, po_id]);
        }

        const existingMeasurement = await db.query('SELECT * FROM measurement_items WHERE measurement_id= ?', [id]);
        let dataChanged = false;

        for (const item of items_data) {
            for (const child of item.childArray) {
                const matchingExistingData = existingMeasurement.find(existingData =>
                    existingData.description === child.description &&
                    existingData.number === child.no &&
                    existingData.length === child.length &&
                    existingData.breadth === child.breadth &&
                    existingData.depth === child.depth &&
                    existingData.quantity === child.qty
                );
                if (!matchingExistingData) {
                    dataChanged = true;
                    break;
                }
            }
            if (dataChanged) break;
        }

        if (dataChanged) {
            for (const item of items_data) {
                for (const child of item.childArray) {
                    const matchingExistingData = existingMeasurement.find(existingData =>
                        existingData.description === child.description &&
                        existingData.number === child.no &&
                        existingData.length === child.length &&
                        existingData.breadth === child.breadth &&
                        existingData.depth === child.depth &&
                        existingData.quantity === child.qty
                    );
                    if (!matchingExistingData) {
                        await insertIntoPtmTimelines(
                            id,
                            po_id,
                            selectMeasurement[0].complaint_id,
                            item.order_line_number,
                            item.unit,
                            child.description,
                            child.no,
                            child.length || 1,
                            child.breadth || 1,
                            child.depth || 1,
                            child.qty,
                            item.rate,
                            item.total_qty,
                            req.user.user_id
                        );
                    }
                }
            }
        }

        await db.query('DELETE FROM measurement_items WHERE measurement_id = ?', [id]);

        for (const item of items_data) {
            await updateQuantityInPo(item.total_qty, item.order_line_number, po_id);
            for (const child of item.childArray) {
                await insertMeasurementItem(
                    id,
                    po_id,
                    selectMeasurement[0].complaint_id,
                    item.order_line_number,
                    item.unit,
                    child.description,
                    child.no,
                    child.length || 1,
                    child.breadth || 1,
                    child.depth || 1,
                    child.qty,
                    item.rate,
                    item.total_qty,
                    req.user.user_id
                );
            }
        }

        return res.status(StatusCodes.OK).json({ status: true, message: 'Measurement updated successfully' });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

module.exports = { createMeasurement, getAllCreatedMeasurements, getMeasurementsDetailsById, updateMeasurementDetails, deleteMeasurementDetails, measurementDetailsWithPoAndComplaint, ItemsOnMeasurementId, getComplaintsDetailsById, getAllComplaintsFromSite, discardMeasurementDetails, getAllDiscardMeasurements, getDiscardMeasurementsDetailsById, getResolvedComplaintsInBilling, getAttachmentAndInspectionDetails, getAllMeasurements, discardToReactiveMeasurement, getAllMeasurementsBasedOnStatus, saveIntoDraftMeasurement, getRegionalByIdForPtm, getOutletByIdForPtm, getOrderByIdForPtm, getSaleByIdNewForPtm, getSalesByIdInsideBilling, getRegionalByIdInsideBilling, getOutletByIdInsideBilling, getAllOrderByForMeasurements, getSimilarPurchaseOrders, measurementDetailsWithPo, getMeasurementsTimeLineDetailsById, getAllPoItem, updatePoInMeasurementDetails }

