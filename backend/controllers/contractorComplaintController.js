let moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const cron = require('node-cron');
const PDFDocument = require('pdfkit-table');

const { complaintTypeValidations, checkPositiveInteger } = require('../helpers/validation');
const { getComplaintsApprovalAccess, getEnergyCompaniesById, getZoneNameById, getRegionalNameById, getSaleAreaNameById, getDistrictById, getOutletById, getComplaintTypeById, complaintApprovedBy, complaintStatusChangedBy, complaintResolvedBy, complaintRaiseBy, complaintsTimeLineApprovedHelper, roleById, getComplaintTimeline, complaintApprovalDetails, complaintAssignByDetails, complaintAssignToDetails, calculatePagination, getFreeEndUsersCount, countFreeUser, getUserDetails, getOrderViaDetails, getCreatedByDetails, getCompanyDetailsById, checkComplaintAssignOrNot, getCreatedUserNameFromAdmin, complaintsTimeLineHelper, getComplaintsTimelineId, checkComplaintAssignToGetEndUser, usersToManager, updateComplaintsTimeLineHelper, getOrderById } = require('../helpers/general');
const { json } = require('express');
const { xor, assign } = require('lodash');
const path = require('path');
const ExcelJS  = require('exceljs');
const fs = require('fs')
const { checkUserHasNoActiveComplaints } = require('../helpers/commonHelper');


// const   getAllRequestedComplaints = async (req, res) => {

//     try {
//         const outlet_id = req.query.outlet_id;
//         const regional_office_id = req.query.regional_office_id;
//         const sales_area_id = req.query.sales_area_id;
//         const order_by_id = req.query.order_by_id;

//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';

//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var search_value = "";

//         if (searchData != null && searchData != '') {
//             search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%') `;
//         }

//         const checkApprovalAccess = await getComplaintsApprovalAccess();
//         let whereConditions;
//         const loggedUserType = req.user.user_type;


//         const finalData = [];
//         let status;
//         let complaintRaiseType;
//         let hasComplaintApprovedAccess = false;

//         if (checkApprovalAccess == loggedUserType) {
//             whereConditions = 'WHERE complaints.complaints_approval_by = 0';
//             hasComplaintApprovedAccess = true;
//         }
//         else {
//             whereConditions = `WHERE complaints.complaints_approval_by = 0 AND complaints.created_by = '${req.user.user_id}'`
//         }

//         if (outlet_id) {
//             whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', complaints.outlet_id) > 0`;
//         }

//         if (regional_office_id) {
//             whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', complaints.ro_id) > 0`;
//         }

//         if (sales_area_id) {
//             whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', complaints.sale_area_id) > 0`;
//         }
//         if (order_by_id) {
//             whereConditions += ` AND  complaints.order_by_id ='${order_by_id}' `;
//         }

//         const selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id  = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id  ${whereConditions} ${search_value} ORDER BY complaints.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

//         const result = await db.query(selectQuery);

//         // console.log("selectQuery", selectQuery)

//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);

//         if (result.length > process.env.VALUE_ZERO) {

//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
//             let outletDetails;
//             let company_name;
//             let districtDetailsData = [];

//             for (row of result) {

//                 const complaintType = await getComplaintTypeById(row.complaint_type);

//                 if (row.complaint_for == '1') {
//                     const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                     company_name = energyCompanyName.name ? energyCompanyName.name : "sss";
//                     const selectedOutlets = await getOutletById(row.outlet_id);
//                     outletDetails = selectedOutlets;
//                 }
//                 else {
//                     const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
//                     company_name = energyCompanyName.company_name;
//                     outletDetails = '';

//                 }

//                 const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
//                 const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
//                 if (row.district_id != null && row.district_id != '') {
//                     districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
//                 }
//                 const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
//                 const getOrderByDetails = await getUserDetails(row.order_by_id);
//                 var order_by_name = '';
//                 if (getOrderByDetails.length > 0) {
//                     order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
//                 }

//                 //--------complaint status handle--------------------------------
//                 if (row.status == 1) {
//                     status = 'pending';
//                 }
//                 else if (row.status == 2) {
//                     status = 'approved';
//                 }
//                 else if (row.status == 3) {
//                     status = 'working';
//                 }
//                 else if (row.status == 4) {
//                     status = 'rejected';
//                 }
//                 else if (row.status == 5) {
//                     status = 'resolved';
//                 }

//                 //-------------Complaints raise type like own/others --------------------------------

//                 if (row.created_by == req.user.user_id) {
//                     complaintRaiseType = 'own';
//                 }
//                 else {
//                     complaintRaiseType = 'other';
//                 }

//                 finalData.push({
//                     id: row.id,
//                     complaint_for: row.complaint_for,
//                     complaint_unique_id: row.complaint_unique_id,
//                     energy_company_name: company_name,
//                     complaint_type: row.complaint_type_name,
//                     outlet: outletDetails,
//                     regionalOffice: regionalOfficeDetails,
//                     saleAreaDetails: saleAreaDetails,
//                     districtDetails: districtDetailsData ? districtDetailsData : [],
//                     description: row.description,
//                     status: status,
//                     complaintRaiseType: complaintRaiseType,
//                     complaint_raise_by: complaintRaiseDetails ? complaintRaiseDetails.name : '',
//                     created_at: moment(row.created_at).format('YYYY-MM-DD'),
//                     hasComplaintApprovedAccess: hasComplaintApprovedAccess,
//                     order_via: row.order_via,
//                     order_via_id: row.order_via_id,
//                     order_by_details: order_by_name,
//                     order_by_id: row.order_by_id,
//                 });

//             }

//             return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
//         }
//         else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     }
//     catch (error) {
//         console.error(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error });
//     }
// }


const   getAllRequestedComplaints = async (req, res) => {

    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;

        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const columns = req.query.columns ? JSON.parse(req.query.columns) : ""
        const type = req.query.type || '1';

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%') `;
        }

        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;


        let finalData = [];
        let status;
        let complaintRaiseType;
        let hasComplaintApprovedAccess = false;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = 'WHERE complaints.complaints_approval_by = 0';
            hasComplaintApprovedAccess = true;
        }
        else {
            whereConditions = `WHERE complaints.complaints_approval_by = 0 AND complaints.created_by = '${req.user.user_id}'`
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

        let selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id  = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id  ${whereConditions} ${search_value} ORDER BY complaints.id`;

        if(pageSize){
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`
        }
        const result = await db.query(selectQuery);

        // console.log("selectQuery", selectQuery)

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (result.length > process.env.VALUE_ZERO) {

            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            let outletDetails;
            let company_name;
            let districtDetailsData = [];

            for (row of result) {

                const complaintType = await getComplaintTypeById(row.complaint_type);

                if (row.complaint_for == '1') {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name ? energyCompanyName.name : "sss";
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                }
                else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = '';

                }

                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                if (row.district_id != null && row.district_id != '') {
                    districtDetailsData = await getDistrictById(row.district_id, row.sale_area_id);
                }
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                var order_by_name = '';
                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
                }

                //--------complaint status handle--------------------------------
                if (row.status == 1) {
                    status = 'pending';
                }
                else if (row.status == 2) {
                    status = 'approved';
                }
                else if (row.status == 3) {
                    status = 'working';
                }
                else if (row.status == 4) {
                    status = 'rejected';
                }
                else if (row.status == 5) {
                    status = 'resolved';
                }

                //-------------Complaints raise type like own/others --------------------------------

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = 'own';
                }
                else {
                    complaintRaiseType = 'other';
                }

                finalData.push({
                    id: row.id,
                    complaint_for: row.complaint_for,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: row.complaint_type_name,
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    districtDetails: districtDetailsData ? districtDetailsData : [],
                    description: row.description,
                    status: status,
                    complaintRaiseType: complaintRaiseType,
                    complaint_raise_by: complaintRaiseDetails ? complaintRaiseDetails.name : '',
                    created_at: moment(row.created_at).format('YYYY-MM-DD'),
                    hasComplaintApprovedAccess: hasComplaintApprovedAccess,
                    order_via: row.order_via,
                    order_via_id: row.order_via_id,
                    order_by_details: order_by_name,
                    order_by_id: row.order_by_id,
                });

            }

            if(!pageSize){
                finalData = finalData.map( (item) => {
                    return { 
                        ...item,
                        outlet: item.outlet[0]?.outlet_name, 
                        regionalOffice: item.regionalOffice[0]?.regional_office_name, 
                        saleAreaDetails: item.saleAreaDetails[0]?.sales_area_name
                    }
                    
                })
                let filePath;
                if(type == '1'){
                    filePath = await exportToExcel(finalData, 'requested-complaints', columns);
                }
                else{
                    filePath = await exportToPDF(finalData, 'requested-complaints','Requested Complaints', columns);
                }
                return res.status(StatusCodes.OK).json({ status: true, message: "excel exported successfully", filePath  });
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    }
    catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error });
    }
}

const getComplaintsDetailsById = async (req, res) => {

    try {
        const complaintId = req.params.id;
        const finalData = [];
        let status;
        let complaintRaiseType;
        let hasComplaintApprovedAccess = false;
        const loggedUserType = req.user.user_type;

        const { error } = checkPositiveInteger.validate({ id: complaintId });

        if (error) return res.status(400).json({ status: false, message: error.message })

        // check contract has approval of complaint by super admin or not

        const checkApprovalAccess = await getComplaintsApprovalAccess();
        if (checkApprovalAccess == loggedUserType) {
            hasComplaintApprovedAccess = true;
        }

        const selectQuery = `SELECT * FROM complaints WHERE id = ?`
        const result = await db.query(selectQuery, [complaintId]);
        if (result.length > process.env.VALUE_ZERO) {

            let company_name;
            let outlet_name;

            for (row of result) {

                if (row.complaint_for == '1') {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name;
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outlet_name = selectedOutlets;
                }
                else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;
                    outletDetails = '';


                }

                const selectedZones = await getZoneNameById(row.zone_id)
                const selectedRegionalOffices = await getRegionalNameById(row.ro_id)
                const selectedSaleAreas = await getSaleAreaNameById(row.sale_area_id)
                const selectedDistricts = await getDistrictById(row.district_id)
                const complaintType = await getComplaintTypeById(row.complaint_type);
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                const orderViaDetails = await getOrderViaDetails(row.order_via_id);
                //--------complaint status handle--------------------------------
                if (row.status == 1) {
                    status = 'pending';
                }
                else if (row.status == 2) {
                    status = 'approved';
                }
                else if (row.status == 3) {
                    status = 'working';
                }
                else if (row.status == 4) {
                    status = 'rejected';
                }
                else if (row.status == 5) {
                    status = 'resolved';
                }

                //-------------Complaints raise type like own/others --------------------------------

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = 'own';
                }
                else {
                    complaintRaiseType = 'other';
                }

                finalData.push({
                    id: row.id,
                    energy_company_name: company_name,
                    energy_company_id: row.energy_company_id,
                    zones: selectedZones,
                    regionalOffices: selectedRegionalOffices,
                    saleAreas: selectedSaleAreas,
                    districts: selectedDistricts,
                    outlets: outlet_name,
                    complaint_type: complaintType.complaint_type_name,
                    complaint_type_id: row.complaint_type,
                    complaint_unique_id: row.complaint_unique_id,
                    complaint_for: row.complaint_for,
                    work_permit: row.work_permit,
                    description: row.description,
                    status: status,
                    complaintRaiseType: complaintRaiseType,
                    complaint_raise_by: complaintRaiseDetails.name,
                    complaint_raise_by_image: complaintRaiseDetails.image,
                    created_at: moment(row.created_at).format('YYYY-MM-DD'),
                    hasComplaintApprovedAccess: hasComplaintApprovedAccess,
                    order_by_id: row.order_by_id ? row.order_by_id : "",
                    order_by_details: (getOrderByDetails && getOrderByDetails[0] && getOrderByDetails[0].name) ? getOrderByDetails[0].name : "",
                    order_via_id: row.order_via_id,
                    getOrderViaDetails: orderViaDetails.order_via
                })
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData[0] });
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: true, message: "Data not found" });
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}


// const getAllApprovedComplaints = async (req, res) => {
//     try {

//         const outlet_id = req.query.outlet_id;
//         const regional_office_id = req.query.regional_office_id;
//         const sales_area_id = req.query.sales_area_id;
//         const order_by_id = req.query.order_by_id;
//         const area_manager_id = req.query.area_manager_id;
//         const supervisor_id = req.query.supervisor_id;
//         const end_user_id = req.query.end_user_id;

//         //pagination data
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var search_value = "";

//         if (searchData != null && searchData != '') {
//             search_value = `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%')`;
//         }


//         const checkApprovalAccess = await getComplaintsApprovalAccess();

//         let whereConditions;
//         const loggedUserType = req.user.user_type;
//         const finalData = [];
//         let status;
//         let complaintRaiseType;

//         if (checkApprovalAccess == loggedUserType) {
//             whereConditions = `WHERE complaints.complaints_approval_by > 0 AND complaints.status = '3'`;
//         } else {
//             whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '3'`;
//         }

//         if (outlet_id) {
//             whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', complaints.outlet_id) > 0`;
//         }

//         if (regional_office_id) {
//             whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', complaints.ro_id) > 0`;
//         }

//         if (sales_area_id) {
//             whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', complaints.sale_area_id) > 0`;
//         }
//         if (order_by_id) {
//             whereConditions += ` AND  complaints.order_by_id ='${order_by_id}' `;
//         }

//         if (area_manager_id) {
//             whereConditions += ` AND complaints_timeline.area_manager_id ='${area_manager_id}' AND complaints_timeline.status= 'assigned'`;
//         }

//         if (supervisor_id) {
//             whereConditions += ` AND complaints_timeline.supervisor_id ='${supervisor_id}' AND complaints_timeline.status= 'assigned'`;
//         }

//         if (end_user_id) {
//             whereConditions += ` AND complaints_timeline.assign_to ='${end_user_id}' AND complaints_timeline.status = 'assigned'`;
//         }

//         const selectQuery = `SELECT DISTINCT  complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id LEFT JOIN complaints_timeline ON complaints.id = complaints_timeline.complaints_id AND complaints_timeline.status = 'assigned' AND complaints_timeline.free_end_users = '1' ${whereConditions} ${search_value} ORDER BY complaints.id DESC LIMIT ${pageFirstResult}, ${pageSize};`


//         const result = await db.query(selectQuery);

//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);

//         if (result.length > process.env.VALUE_ZERO) {
//             let outletDetails;
//             let company_name;

//             for (const row of result) {

//                 let isComplaintAssigned = false;
//                 const complaintType = await getComplaintTypeById(row.complaint_type);
//                 const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
//                 const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
//                 //const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                 //const outletDetails = await getOutletById(row.outlet_id);
//                 const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
//                 const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
//                 const getOrderByDetails = await getUserDetails(row.order_by_id);
//                 const checkComplaintAssignedOrNot = await checkComplaintAssignOrNot(row.id)
//                 const getAssignUsers = await checkComplaintAssignToGetEndUser(row.id)
//                 const checkUsersAssign = await checkUserAssignComplaints(row.id)

//                 const assignUserId = getAssignUsers.length > 0 ? getAssignUsers[0].assign_to : null;

//                 if (assignUserId != null && assignUserId != undefined) {
//                     managerAndSupervisorDetails = await usersToManager(assignUserId);

//                     if (managerAndSupervisorDetails != null && managerAndSupervisorDetails != undefined) {
//                         if (getAssignUsers.length > 0) {
//                             var endUsersData = [];
//                             const uniqueEndUserIds = new Set();

//                             for (const row of getAssignUsers) {

//                                 if (row.assign_to != null) {
//                                     const endUserDetails = await getUserDetails(row.assign_to);
                                  
//                                     if (endUserDetails.length > 0) {
//                                         const userId = endUserDetails[0].id;
//                                         if (!uniqueEndUserIds.has(userId)) {
//                                             const userComplaints = await checkUserHasNoActiveComplaints(userId);
//                                             const isAssigned = userComplaints.some(complaint => complaint.assign_to === userId);

//                                             endUsersData.push({
//                                                 id: endUserDetails[0].id,
//                                                 name: endUserDetails[0].name,
//                                                 employee_id: endUserDetails[0].employee_id,
//                                                 image: endUserDetails[0].image,
//                                                 isAssigned: isAssigned,
//                                             });
//                                             uniqueEndUserIds.add(userId);
//                                         }
//                                     }
//                                 }
//                             }
//                             managerAndSupervisorDetails['data'][0]['endUserDetails'] = endUsersData;
//                         }
//                     }
//                 }
//                 if (checkComplaintAssignedOrNot) {
//                     isComplaintAssigned = true;
//                 }
//                 var order_by_name = '';

//                 if (row.complaint_for == '1') {
//                     const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                     company_name = energyCompanyName.name;
//                     const selectedOutlets = await getOutletById(row.outlet_id);
//                     outletDetails = selectedOutlets;
//                 }
//                 else {
//                     const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
//                     company_name = energyCompanyName.company_name;
//                     outletDetails = '';

//                 }

//                 if (getOrderByDetails.length > 0) {
//                     order_by_name = getOrderByDetails[0].name;
//                 }

//                 //--------complaint status handle--------------------------------
//                 if (row.status == 1) {
//                     status = 'pending';
//                 } else if (row.status == 2) {
//                     status = 'approved';
//                 } else if (row.status == 3) {
//                     status = 'working';
//                 } else if (row.status == 4) {
//                     status = 'rejected';
//                 } else if (row.status == 5) {
//                     status = 'resolved';
//                 }

//                 //-------------Complaints raise type like own/others --------------------------------

//                 if (row.created_by == req.user.user_id) {
//                     complaintRaiseType = 'own';
//                 } else {
//                     complaintRaiseType = 'other';
//                 }

//                 //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
//                 const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
//                 const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
//                 const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;
//                 finalData.push({
//                     id: row.id,
//                     complaint_unique_id: row.complaint_unique_id,
//                     energy_company_name: company_name,
//                     complaint_type: complaintTypeValue,
//                     complaint_for: row.complaint_for,
//                     work_permit: row.work_permit,
//                     description: row.description,
//                     status: status,
//                     complaintRaiseType: complaintRaiseType,
//                     complaints_approval_by: complaintApprovalByName,
//                     complaint_raise_by: complaintRaiseByName,
//                     created_at: moment(row.created_at).format('YYYY-MM-DD'),
//                     isComplaintAssigned: isComplaintAssigned,
//                     outlet: outletDetails,
//                     regionalOffice: regionalOfficeDetails,
//                     saleAreaDetails: saleAreaDetails,
//                     order_via: row.order_via,
//                     order_via_id: row.order_via_id,
//                     order_by_details: order_by_name,
//                     order_by_id: row.order_by_id,
//                     manager_and_supevisor: managerAndSupervisorDetails ? managerAndSupervisorDetails.data[0] : [],
//                     manager_and_supevisor: managerAndSupervisorDetails ? managerAndSupervisorDetails.data[0] : [],
//                     area_manager_name: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].areaManagerDetails.name : '',
//                     area_manager_id: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].areaManagerDetails.id : '',
//                     supervisor_name: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].superVisorDetails.name : '',
//                     supervisor_id: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].superVisorDetails.id : '',
//                     end_user_details_id: endUsersData[0].id,
//                     end_user_details_name: endUsersData[0].name,
//                     checkUsersAssign: checkUsersAssign,

//                 });
//             }

//             let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//             return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });

//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


const getAllApprovedComplaints = async (req, res) => {
    try {

        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;
        const area_manager_id = req.query.area_manager_id;
        const supervisor_id = req.query.supervisor_id;
        const end_user_id = req.query.end_user_id;

        //pagination data
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const columns = req.query.columns ? JSON.parse(req.query.columns) : ""
        const type = req.query.type || '1'
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value = `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%')`;
        }


        const checkApprovalAccess = await getComplaintsApprovalAccess();

        let whereConditions;
        const loggedUserType = req.user.user_type;
        let finalData = [];
        let status;
        let complaintRaiseType;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = `WHERE complaints.complaints_approval_by > 0 AND complaints.status = '3'`;
        } else {
            whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '3'`;
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

        if (area_manager_id) {
            whereConditions += ` AND complaints_timeline.area_manager_id ='${area_manager_id}' AND complaints_timeline.status= 'assigned'`;
        }

        if (supervisor_id) {
            whereConditions += ` AND complaints_timeline.supervisor_id ='${supervisor_id}' AND complaints_timeline.status= 'assigned'`;
        }

        if (end_user_id) {
            whereConditions += ` AND complaints_timeline.assign_to ='${end_user_id}' AND complaints_timeline.status = 'assigned'`;
        }

        let selectQuery = `SELECT DISTINCT  complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id LEFT JOIN complaints_timeline ON complaints.id = complaints_timeline.complaints_id AND complaints_timeline.status = 'assigned' AND complaints_timeline.free_end_users = '1' ${whereConditions} ${search_value} ORDER BY complaints.id`

        if(pageSize){
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`
        }

        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (result.length > process.env.VALUE_ZERO) {
            let outletDetails;
            let company_name;

            for (const row of result) {

                let isComplaintAssigned = false;
                const complaintType = await getComplaintTypeById(row.complaint_type);
                const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                //const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                //const outletDetails = await getOutletById(row.outlet_id);
                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                const checkComplaintAssignedOrNot = await checkComplaintAssignOrNot(row.id)
                const getAssignUsers = await checkComplaintAssignToGetEndUser(row.id)
                const checkUsersAssign = await checkUserAssignComplaints(row.id)

                const assignUserId = getAssignUsers.length > 0 ? getAssignUsers[0].assign_to : null;

                if (assignUserId != null && assignUserId != undefined) {
                    managerAndSupervisorDetails = await usersToManager(assignUserId);

                    if (managerAndSupervisorDetails != null && managerAndSupervisorDetails != undefined) {
                        if (getAssignUsers.length > 0) {
                            var endUsersData = [];
                            const uniqueEndUserIds = new Set();

                            for (const row of getAssignUsers) {

                                if (row.assign_to != null) {
                                    const endUserDetails = await getUserDetails(row.assign_to);
                                  
                                    if (endUserDetails.length > 0) {
                                        const userId = endUserDetails[0].id;
                                        if (!uniqueEndUserIds.has(userId)) {
                                            const userComplaints = await checkUserHasNoActiveComplaints(userId);
                                            const isAssigned = userComplaints.some(complaint => complaint.assign_to === userId);

                                            endUsersData.push({
                                                id: endUserDetails[0].id,
                                                name: endUserDetails[0].name,
                                                employee_id: endUserDetails[0].employee_id,
                                                image: endUserDetails[0].image,
                                                isAssigned: isAssigned,
                                            });
                                            uniqueEndUserIds.add(userId);
                                        }
                                    }
                                }
                            }
                            managerAndSupervisorDetails['data'][0]['endUserDetails'] = endUsersData;
                        }
                    }
                }
                if (checkComplaintAssignedOrNot) {
                    isComplaintAssigned = true;
                }
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

                //--------complaint status handle--------------------------------
                if (row.status == 1) {
                    status = 'pending';
                } else if (row.status == 2) {
                    status = 'approved';
                } else if (row.status == 3) {
                    status = 'working';
                } else if (row.status == 4) {
                    status = 'rejected';
                } else if (row.status == 5) {
                    status = 'resolved';
                }

                //-------------Complaints raise type like own/others --------------------------------

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = 'own';
                } else {
                    complaintRaiseType = 'other';
                }

                //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
                const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
                const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
                const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;
                finalData.push({
                    id: row.id,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: complaintTypeValue,
                    complaint_for: row.complaint_for,
                    work_permit: row.work_permit,
                    description: row.description,
                    status: status,
                    complaintRaiseType: complaintRaiseType,
                    complaints_approval_by: complaintApprovalByName,
                    complaint_raise_by: complaintRaiseByName,
                    created_at: moment(row.created_at).format('YYYY-MM-DD'),
                    isComplaintAssigned: isComplaintAssigned,
                    outlet: outletDetails,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    order_via: row.order_via,
                    order_via_id: row.order_via_id,
                    order_by_details: order_by_name,
                    order_by_id: row.order_by_id,
                    manager_and_supevisor: managerAndSupervisorDetails ? managerAndSupervisorDetails.data[0] : [],
                    manager_and_supevisor: managerAndSupervisorDetails ? managerAndSupervisorDetails.data[0] : [],
                    area_manager_name: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].areaManagerDetails.name : '',
                    area_manager_id: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].areaManagerDetails.id : '',
                    supervisor_name: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].superVisorDetails.name : '',
                    supervisor_id: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].superVisorDetails.id : '',
                    end_user_details_id: endUsersData[0].id,
                    end_user_details_name: endUsersData[0].name,
                    checkUsersAssign: checkUsersAssign,

                });
            }

            if(!pageSize){
                finalData = finalData.map( (item) => {
                    return { 
                        ...item,
                        outlet: item.outlet[0]?.outlet_name, 
                        regionalOffice: item.regionalOffice[0]?.regional_office_name, 
                        saleAreaDetails: item.saleAreaDetails[0]?.sales_area_name
                    }
                    
                })
                let filePath;
                if(type == '1'){
                    filePath = await exportToExcel(finalData, 'allocate-complaints', columns);
                }
                else{
                    filePath = await exportToPDF(finalData, 'allocate-complaints','Allocated Complaints', columns);
                }
                return res.status(StatusCodes.OK).json({ status: true, message: "excel exported successfully", filePath  });
        }

            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });

        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};




const getAllApprovedAssignComplaints = async (req, res) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;
        const area_manager_id = req.query.area_manager_id;
        const supervisor_id = req.query.supervisor_id;
        const end_user_id = req.query.end_user_id;
        // Pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchValue = searchData !== '' ? `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%')` : '';

        const checkApprovalAccess = await getComplaintsApprovalAccess();
        const loggedUserType = req.user.user_type;
        let whereConditions;
        const finalData = [];
        let status;
        let complaintRaiseType;
        let getManager;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = `AND complaints.complaints_approval_by > 0 AND complaints.status = '3'`;
        } else {
            whereConditions = `AND complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '3'`;
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

        if (area_manager_id) {
            whereConditions += ` AND complaints_timeline.area_manager_id ='${area_manager_id}' AND complaints_timeline.status= 'assigned'`;
        }

        if (supervisor_id) {
            whereConditions += ` AND complaints_timeline.supervisor_id ='${supervisor_id}' AND complaints_timeline.status= 'assigned'`;
        }

        if (end_user_id) {
            whereConditions += ` AND complaints_timeline.assign_to ='${end_user_id}' AND complaints_timeline.status = 'assigned'`;
        }


        const selectQuery = `SELECT DISTINCT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id LEFT JOIN complaints_timeline ON complaints.id = complaints_timeline.complaints_id AND complaints_timeline.status = 'assigned' WHERE complaints_timeline.status IS NOT NULL AND complaints_timeline.free_end_users = '1' ${whereConditions} ${searchValue} ORDER BY complaints.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (result.length > 0) {

            for (const row of result) {

                const isComplaintAssigned = await checkComplaintAssignOrNot(row.id);

                // Include records where isComplaintAssigned is true
                if (isComplaintAssigned) {
                    let outletDetails;
                    let company_name;
                    // const getEndUsers = await checkComplaintAssignToGetEndUser(row.id)
                    // const getManager = await usersToManager(getEndUsers[0].assign_to)
                    const complaintType = await getComplaintTypeById(row.complaint_type);
                    const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
                    const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                    const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                    const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                    const getOrderByDetails = await getUserDetails(row.order_by_id);
                    const checkComplaintAssignedOrNot = await checkComplaintAssignOrNot(row.id)
                    const getAssignUsers = await checkComplaintAssignToGetEndUser(row.id)
                    const checkUsersAssign = await checkUserAssignComplaints(row.id)
                     const assignUserId = getAssignUsers.length > 0 ? getAssignUsers[0].assign_to : null;
                    if (assignUserId != null && assignUserId != undefined) {
                        managerAndSupervisorDetails = await usersToManager(assignUserId);

                        if (managerAndSupervisorDetails != null && managerAndSupervisorDetails != undefined) {
                            if (getAssignUsers.length > 0) {
                                var endUsersData = [];
                                const uniqueEndUserIds = new Set();
                                for (const row of getAssignUsers) {

                                    if (row.assign_to != null) {
                                        const endUserDetails = await getUserDetails(row.assign_to);

                                        if (endUserDetails.length > 0) {
                                            const userId = endUserDetails[0].id;
                                            if (!uniqueEndUserIds.has(userId)) {
                                                const userComplaints = await checkUserHasNoActiveComplaints(userId);
                                                const isAssigned = userComplaints.some(complaint => complaint.assign_to === userId);

                                                endUsersData.push({
                                                    id: endUserDetails[0].id,
                                                    name: endUserDetails[0].name,
                                                    employee_id: endUserDetails[0].employee_id,
                                                    image: endUserDetails[0].image,
                                                    isAssigned: isAssigned,
                                                });
                                                uniqueEndUserIds.add(userId);
                                            }
                                        }
                                    }
                                }
                                managerAndSupervisorDetails['data'][0]['endUserDetails'] = endUsersData;
                            }
                        }
                    }


                    var order_by_name = '';

                    if (row.complaint_for == '1') {
                        const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                        company_name = energyCompanyName.name;
                        const selectedOutlets = await getOutletById(row.outlet_id);
                        outletDetails = selectedOutlets;
                    } else {
                        const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                        company_name = energyCompanyName.company_name;
                        outletDetails = '';

                    }

                    if (getOrderByDetails.length > 0) {
                        order_by_name = getOrderByDetails[0].name;
                    }

                    //--------complaint status handle--------------------------------
                    if (row.status == 1) {
                        status = 'pending';
                    } else if (row.status == 2) {
                        status = 'approved';
                    } else if (row.status == 3) {
                        status = 'working';
                    } else if (row.status == 4) {
                        status = 'rejected';
                    } else if (row.status == 5) {
                        status = 'resolved';
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
                        work_permit: row.work_permit,
                        description: row.description,
                        status: status,
                        complaintRaiseType: complaintRaiseType,
                        complaints_approval_by: complaintApprovalByName,
                        complaint_raise_by: complaintRaiseByName,
                        created_at: moment(row.created_at).format('YYYY-MM-DD'),
                        isComplaintAssigned: isComplaintAssigned,
                        outlet: outletDetails,
                        regionalOffice: regionalOfficeDetails,
                        saleAreaDetails: saleAreaDetails,
                        order_via: row.order_via,
                        order_via_id: row.order_via_id,
                        order_by_details: order_by_name,
                        order_by_id: row.order_by_id,
                        manager_and_supevisor: managerAndSupervisorDetails ? managerAndSupervisorDetails.data[0] : [],
                        area_manager_name: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].areaManagerDetails.name : '',
                        area_manager_id: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].areaManagerDetails.id : '',
                        supervisor_name: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].superVisorDetails.name : '',
                        supervisor_id: managerAndSupervisorDetails.data[0] ? managerAndSupervisorDetails.data[0].superVisorDetails.id : '',
                        end_user_details_id: endUsersData[0].id,
                        end_user_details_name: endUsersData[0].name,
                        checkUsersAssign: checkUsersAssign,
                    });
                }
            };


            let pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


// const getAllApprovedUnAssignComplaints = async (req, res) => {
//     try {
//         const outlet_id = req.query.outlet_id;
//         const regional_office_id = req.query.regional_office_id;
//         const sales_area_id = req.query.sales_area_id;
//         const order_by_id = req.query.order_by_id;
//         // Pagination data
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         const searchValue = searchData !== '' ? `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%')` : '';

//         const checkApprovalAccess = await getComplaintsApprovalAccess();
//         const loggedUserType = req.user.user_type;
//         let whereConditions;
//         const finalData = [];
//         let status;
//         let complaintRaiseType;

//         if (checkApprovalAccess == loggedUserType) {
//             whereConditions = `WHERE complaints.complaints_approval_by > 0 AND complaints.status = '2'`;
//         } else {
//             whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '2'`;
//         }

//         if (outlet_id) {
//             whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', complaints.outlet_id) > 0`;
//         }

//         if (regional_office_id) {
//             whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', complaints.ro_id) > 0`;
//         }

//         if (sales_area_id) {
//             whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', complaints.sale_area_id) > 0`;
//         }
//         if (order_by_id) {
//             whereConditions += ` AND  complaints.order_by_id ='${order_by_id}' `;
//         }

//         const selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id ${whereConditions} ${searchValue} ORDER BY complaints.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

//         const result = await db.query(selectQuery);

//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);

//         if (result.length > 0) {
//             const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//             for (const row of result) {
//                 const isComplaintAssigned = await checkComplaintAssignOrNot(row.id);

//                 // Include records where isComplaintAssigned is true
//                 if (!isComplaintAssigned) {
//                     let outletDetails;
//                     let company_name;

//                     const complaintType = await getComplaintTypeById(row.complaint_type);
//                     const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
//                     const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
//                     const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
//                     const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
//                     const getOrderByDetails = await getUserDetails(row.order_by_id);

//                     var order_by_name = '';

//                     if (row.complaint_for == '1') {
//                         const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                         company_name = energyCompanyName.name;
//                         const selectedOutlets = await getOutletById(row.outlet_id);
//                         outletDetails = selectedOutlets;
//                     } else {
//                         const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
//                         company_name = energyCompanyName.company_name;
//                         outletDetails = '';

//                     }

//                     if (getOrderByDetails.length > 0) {
//                         order_by_name = getOrderByDetails[0].name;
//                     }

//                     //--------complaint status handle--------------------------------
//                     if (row.status == 1) {
//                         status = 'pending';
//                     } else if (row.status == 2) {
//                         status = 'approved';
//                     } else if (row.status == 3) {
//                         status = 'working';
//                     } else if (row.status == 4) {
//                         status = 'rejected';
//                     } else if (row.status == 5) {
//                         status = 'resolved';
//                     }

//                     //-------------Complaints raise type like own/others --------------------------------
//                     if (row.created_by == req.user.user_id) {
//                         complaintRaiseType = 'own';
//                     } else {
//                         complaintRaiseType = 'other';
//                     }

//                     const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
//                     const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
//                     const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;

//                     finalData.push({
//                         id: row.id,
//                         complaint_unique_id: row.complaint_unique_id,
//                         energy_company_name: company_name,
//                         complaint_type: complaintTypeValue,
//                         complaint_for: row.complaint_for,
//                         work_permit: row.work_permit,
//                         description: row.description,
//                         status: status,
//                         complaintRaiseType: complaintRaiseType,
//                         complaints_approval_by: complaintApprovalByName,
//                         complaint_raise_by: complaintRaiseByName,
//                         created_at: moment(row.created_at).format('YYYY-MM-DD'),
//                         isComplaintAssigned: isComplaintAssigned,
//                         outlet: outletDetails,
//                         regionalOffice: regionalOfficeDetails,
//                         saleAreaDetails: saleAreaDetails,
//                         order_via: row.order_via,
//                         order_via_id: row.order_via_id,
//                         order_by_details: order_by_name,
//                         order_by_id: row.order_by_id,
//                     });
//                 }
//             };

//             return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


const getAllApprovedUnAssignComplaints = async (req, res) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;
        // Pagination data
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        const columns = req.query.columns ? JSON.parse(req.query.columns) : ""
        const type = req.query.type || '1';
        const searchValue = searchData !== '' ? `AND (complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%')` : '';

        const checkApprovalAccess = await getComplaintsApprovalAccess();
        const loggedUserType = req.user.user_type;
        let whereConditions;
        let finalData = [];
        let status;
        let complaintRaiseType;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = `WHERE complaints.complaints_approval_by > 0 AND complaints.status = '2'`;
        } else {
            whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '2'`;
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

        let selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id ${whereConditions} ${searchValue} ORDER BY complaints.id`;
        if(pageSize){
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`
        }

        const result = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (result.length > 0) {
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of result) {
                const isComplaintAssigned = await checkComplaintAssignOrNot(row.id);

                // Include records where isComplaintAssigned is true
                if (!isComplaintAssigned) {
                    let outletDetails;
                    let company_name;

                    const complaintType = await getComplaintTypeById(row.complaint_type);
                    const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
                    const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                    const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                    const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                    const getOrderByDetails = await getUserDetails(row.order_by_id);

                    var order_by_name = '';

                    if (row.complaint_for == '1') {
                        const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                        company_name = energyCompanyName.name;
                        const selectedOutlets = await getOutletById(row.outlet_id);
                        outletDetails = selectedOutlets;
                    } else {
                        const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                        company_name = energyCompanyName.company_name;
                        outletDetails = '';

                    }

                    if (getOrderByDetails.length > 0) {
                        order_by_name = getOrderByDetails[0].name;
                    }

                    //--------complaint status handle--------------------------------
                    if (row.status == 1) {
                        status = 'pending';
                    } else if (row.status == 2) {
                        status = 'approved';
                    } else if (row.status == 3) {
                        status = 'working';
                    } else if (row.status == 4) {
                        status = 'rejected';
                    } else if (row.status == 5) {
                        status = 'resolved';
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
                        work_permit: row.work_permit,
                        description: row.description,
                        status: status,
                        complaintRaiseType: complaintRaiseType,
                        complaints_approval_by: complaintApprovalByName,
                        complaint_raise_by: complaintRaiseByName,
                        created_at: moment(row.created_at).format('YYYY-MM-DD'),
                        isComplaintAssigned: isComplaintAssigned,
                        outlet: outletDetails,
                        regionalOffice: regionalOfficeDetails,
                        saleAreaDetails: saleAreaDetails,
                        order_via: row.order_via,
                        order_via_id: row.order_via_id,
                        order_by_details: order_by_name,
                        order_by_id: row.order_by_id,
                    });
                }
            };

            if(!pageSize){
                finalData = finalData.map( (item) => {
                    return { 
                        ...item,
                        outlet: item.outlet[0]?.outlet_name, 
                        regionalOffice: item.regionalOffice[0]?.regional_office_name, 
                        saleAreaDetails: item.saleAreaDetails[0]?.sales_area_name
                    }
                    
                })
                let filePath;
                if(type == '1'){
                    filePath = await exportToExcel(finalData, 'approved-complaints', columns);
                }
                else{
                    filePath = await exportToPDF(finalData, 'approved-complaints','Approved Complaints', columns);
                }
                return res.status(StatusCodes.OK).json({ status: true, message: "excel exported successfully", filePath  });
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

// const getAllRejectedComplaints = async (req, res) => {
//     try {
//         const outlet_id = req.query.outlet_id;
//         const regional_office_id = req.query.regional_office_id;
//         const sales_area_id = req.query.sales_area_id;
//         const order_by_id = req.query.order_by_id;
//         //pagination data
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var search_value = "";

//         if (searchData != null && searchData != '') {
//             search_value = `AND complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%'`;
//         }

//         const checkApprovalAccess = await getComplaintsApprovalAccess();
//         let whereConditions;
//         const loggedUserType = req.user.user_type;
//         const finalData = [];
//         let status;
//         let complaintRaiseType;

//         if (checkApprovalAccess == loggedUserType) {
//             whereConditions = `WHERE complaints.complaints_approval_by > 0 AND complaints.status = '4'`;
//         } else {
//             whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '4'`;
//         }

//         if (outlet_id) {
//             whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', complaints.outlet_id) > 0`;
//         }

//         if (regional_office_id) {
//             whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', complaints.ro_id) > 0`;
//         }

//         if (sales_area_id) {
//             whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', complaints.sale_area_id) > 0`;
//         }
//         if (order_by_id) {
//             whereConditions += ` AND  complaints.order_by_id ='${order_by_id}' `;
//         }

//         const selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id ${whereConditions} ${search_value} ORDER BY complaints.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
//         const result = await db.query(selectQuery);

//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);

//         if (result.length > process.env.VALUE_ZERO) {
//             let outletDetails;
//             let company_name;
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
//             for (const row of result) {

//                 const complaintType = await getComplaintTypeById(row.complaint_type);
//                 const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
//                 const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
//                 //const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                 //const outletDetails = await getOutletById(row.outlet_id);
//                 const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
//                 const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
//                 const getOrderByDetails = await getUserDetails(row.order_by_id);
//                 var order_by_name = '';

//                 if (row.complaint_for == '1') {
//                     const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                     company_name = energyCompanyName.name;
//                     const selectedOutlets = await getOutletById(row.outlet_id);
//                     outletDetails = selectedOutlets;
//                 }
//                 else {
//                     const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
//                     company_name = energyCompanyName.company_name;
//                     outletDetails = '';

//                 }

//                 if (getOrderByDetails.length > 0) {
//                     order_by_name = getOrderByDetails[0].name;
//                 }

//                 //--------complaint status handle--------------------------------
//                 if (row.status == 1) {
//                     status = 'pending';
//                 } else if (row.status == 2) {
//                     status = 'approved';
//                 } else if (row.status == 3) {
//                     status = 'working';
//                 } else if (row.status == 4) {
//                     status = 'rejected';
//                 } else if (row.status == 5) {
//                     status = 'resolved';
//                 }

//                 //-------------Complaints raise type like own/others --------------------------------

//                 if (row.created_by == req.user.user_id) {
//                     complaintRaiseType = 'own';
//                 } else {
//                     complaintRaiseType = 'other';
//                 }

//                 //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
//                 const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
//                 const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
//                 const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;

//                 finalData.push({
//                     id: row.id,
//                     complaint_unique_id: row.complaint_unique_id,
//                     energy_company_name: company_name,
//                     complaint_type: complaintTypeValue,
//                     complaint_for: row.complaint_for,
//                     work_permit: row.work_permit,
//                     description: row.description,
//                     status: status,
//                     complaintRaiseType: complaintRaiseType,
//                     complaints_approval_by: complaintApprovalByName,
//                     complaint_raise_by: complaintRaiseByName,
//                     created_at: moment(row.created_at).format('YYYY-MM-DD'),
//                     outlet: outletDetails,
//                     regionalOffice: regionalOfficeDetails,
//                     saleAreaDetails: saleAreaDetails,
//                     order_via: row.order_via,
//                     order_via_id: row.order_via_id,
//                     order_by_details: order_by_name,
//                     order_by_id: row.order_by_id,
//                 });
//             }

//             return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };



const getAllRejectedComplaints = async (req, res) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;
        //pagination data
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const columns = req.query.columns ? JSON.parse(req.query.columns) : ""
        const type = req.query.type || '1';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value = `AND complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%'`;
        }

        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;
        let finalData = [];
        let status;
        let complaintRaiseType;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = `WHERE complaints.complaints_approval_by > 0 AND complaints.status = '4'`;
        } else {
            whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '4'`;
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

        let selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id ${whereConditions} ${search_value} ORDER BY complaints.id`;

        if(pageSize){
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`
        }
        const result = await db.query(selectQuery);

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

                //--------complaint status handle--------------------------------
                if (row.status == 1) {
                    status = 'pending';
                } else if (row.status == 2) {
                    status = 'approved';
                } else if (row.status == 3) {
                    status = 'working';
                } else if (row.status == 4) {
                    status = 'rejected';
                } else if (row.status == 5) {
                    status = 'resolved';
                }

                //-------------Complaints raise type like own/others --------------------------------

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = 'own';
                } else {
                    complaintRaiseType = 'other';
                }

                //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
                const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
                const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
                const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;

                finalData.push({
                    id: row.id,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: complaintTypeValue,
                    complaint_for: row.complaint_for,
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
                    order_via_id: row.order_via_id,
                    order_by_details: order_by_name,
                    order_by_id: row.order_by_id,
                });
            }

            if(!pageSize){
                finalData = finalData.map( (item) => {
                    return { 
                        ...item,
                        outlet: item.outlet[0]?.outlet_name, 
                        regionalOffice: item.regionalOffice[0]?.regional_office_name, 
                        saleAreaDetails: item.saleAreaDetails[0]?.sales_area_name
                    }
                    
                })
                let filePath;
                if(type == '1'){
                    filePath = await exportToExcel(finalData, 'rejected-complaints', columns);
                }
                else{
                    filePath = await exportToPDF(finalData, 'rejected-complaints','Rejected Complaints', columns);
                }
                return res.status(StatusCodes.OK).json({ status: true, message: "excel exported successfully", filePath  });
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

// const getAllResolvedComplaints = async (req, res) => {
//     try {
//         const outlet_id = req.query.outlet_id;
//         const regional_office_id = req.query.regional_office_id;
//         const sales_area_id = req.query.sales_area_id;
//         const order_by_id = req.query.order_by_id;
//         //pagination data
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var search_value = "";

//         if (searchData != null && searchData != '') {
//             search_value = `AND complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%'`;
//         }

//         const checkApprovalAccess = await getComplaintsApprovalAccess();
//         let whereConditions;
//         const loggedUserType = req.user.user_type;
//         const finalData = [];
//         let status;
//         let complaintRaiseType;

//         if (checkApprovalAccess == loggedUserType) {
//             whereConditions = `WHERE complaints.complaints_approval_by > 0 AND complaints.status = '5'`;
//         } else {
//             whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '5'`;
//         }

//         if (outlet_id) {
//             whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', complaints.outlet_id) > 0`;
//         }

//         if (regional_office_id) {
//             whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', complaints.ro_id) > 0`;
//         }

//         if (sales_area_id) {
//             whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', complaints.sale_area_id) > 0`;
//         }
//         if (order_by_id) {
//             whereConditions += ` AND  complaints.order_by_id ='${order_by_id}' `;
//         }


//         const selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id ${whereConditions} ${search_value} ORDER BY complaints.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
//         const result = await db.query(selectQuery);

//         // remove after order by
//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);

//         if (result.length > process.env.VALUE_ZERO) {
//             let outletDetails;
//             let company_name;
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
//             for (const row of result) {

//                 const complaintType = await getComplaintTypeById(row.complaint_type);
//                 const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
//                 const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
//                 //const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                 //const outletDetails = await getOutletById(row.outlet_id);
//                 const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
//                 const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
//                 const getOrderByDetails = await getUserDetails(row.order_by_id);
//                 var order_by_name = '';

//                 if (row.complaint_for == '1') {
//                     const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                     company_name = energyCompanyName.name;
//                     const selectedOutlets = await getOutletById(row.outlet_id);
//                     outletDetails = selectedOutlets;
//                 }
//                 else {
//                     const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
//                     company_name = energyCompanyName.company_name;
//                     outletDetails = '';

//                 }

//                 if (getOrderByDetails.length > 0) {
//                     order_by_name = getOrderByDetails[0].name;
//                 }

//                 //--------complaint status handle--------------------------------
//                 if (row.status == 1) {
//                     status = 'pending';
//                 } else if (row.status == 2) {
//                     status = 'approved';
//                 } else if (row.status == 3) {
//                     status = 'working';
//                 } else if (row.status == 4) {
//                     status = 'rejected';
//                 } else if (row.status == 5) {
//                     status = 'resolved';
//                 }

//                 //-------------Complaints raise type like own/others --------------------------------

//                 if (row.created_by == req.user.user_id) {
//                     complaintRaiseType = 'own';
//                 } else {
//                     complaintRaiseType = 'other';
//                 }

//                 //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
//                 const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
//                 const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
//                 const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;

//                 finalData.push({
//                     id: row.id,
//                     complaint_unique_id: row.complaint_unique_id,
//                     energy_company_name: company_name,
//                     complaint_type: complaintTypeValue,
//                     complaint_for: row.complaint_for,
//                     work_permit: row.work_permit,
//                     description: row.description,
//                     status: status,
//                     complaintRaiseType: complaintRaiseType,
//                     complaints_approval_by: complaintApprovalByName,
//                     complaint_raise_by: complaintRaiseByName,
//                     created_at: moment(row.created_at).format('YYYY-MM-DD'),
//                     outlet: outletDetails,
//                     regionalOffice: regionalOfficeDetails,
//                     saleAreaDetails: saleAreaDetails,
//                     order_via: row.order_via,
//                     order_via_id: row.order_via_id,
//                     order_by_details: order_by_name,
//                     order_by_id: row.order_by_id,
//                 });
//             }

//             return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


const getAllResolvedComplaints = async (req, res) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;
        //pagination data
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const columns = req.query.columns ? JSON.parse(req.query.columns) : ""
        const type = req.query.type || '1';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value = `AND complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%'`;
        }

        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;
        let finalData = [];
        let status;
        let complaintRaiseType;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = `WHERE complaints.complaints_approval_by > 0 AND complaints.status = '5'`;
        } else {
            whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 AND complaints.status = '5'`;
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


        let selectQuery = `SELECT complaints.*, complaint_types.complaint_type_name, order_vias.order_via FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id ${whereConditions} ${search_value} ORDER BY complaints.id`;

        if(pageSize){
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`
        }
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

                //--------complaint status handle--------------------------------
                if (row.status == 1) {
                    status = 'pending';
                } else if (row.status == 2) {
                    status = 'approved';
                } else if (row.status == 3) {
                    status = 'working';
                } else if (row.status == 4) {
                    status = 'rejected';
                } else if (row.status == 5) {
                    status = 'resolved';
                }

                //-------------Complaints raise type like own/others --------------------------------

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = 'own';
                } else {
                    complaintRaiseType = 'other';
                }

                //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
                const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
                const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
                const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;

                finalData.push({
                    id: row.id,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: complaintTypeValue,
                    complaint_for: row.complaint_for,
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
                    order_via_id: row.order_via_id,
                    order_by_details: order_by_name,
                    order_by_id: row.order_by_id,
                });
            }

            if(!pageSize){
                finalData = finalData.map( (item) => {
                    return { 
                        ...item,
                        outlet: item.outlet[0]?.outlet_name, 
                        regionalOffice: item.regionalOffice[0]?.regional_office_name, 
                        saleAreaDetails: item.saleAreaDetails[0]?.sales_area_name
                    }
                    
                })
                let filePath;
                if(type == '1'){
                    filePath = await exportToExcel(finalData, 'resolved-complaints', columns);
                }
                else{
                    filePath = await exportToPDF(finalData, 'resolved-complaints','Resolved Complaints', columns);
                }
                return res.status(StatusCodes.OK).json({ status: true, message: "excel exported successfully", filePath  });
        }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

const getApprovedComplaintsDetailsById = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const finalData = [];
        let status;
        let complaintRaiseType;
        const { error } = checkPositiveInteger.validate({ id: complaintId });

        if (error) return res.status(400).json({ status: false, message: error.message })

        const selectQuery = `SELECT * FROM complaints WHERE id = ?`
        const result = await db.query(selectQuery, [complaintId]);

        if (result.length > process.env.VALUE_ZERO) {

            let outletDetails;
            let company_name;
            var order_by_name = '';
            var order_via = '';
            let managerAndSupervisorDetails;

            for (const row of result) {
                isComplaintAssigned = false;
                const selectedZones = await getZoneNameById(row.zone_id);
                const selectedRegionalOffices = await getRegionalNameById(row.ro_id);
                const selectedSaleAreas = await getSaleAreaNameById(row.sale_area_id);
                const selectedDistricts = await getDistrictById(row.district_id);
                // const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                // const selectedOutlets = await getOutletById(row.outlet_id);
                const complaintType = await getComplaintTypeById(row.complaint_type);
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                const orderViaDetails = await getOrderViaDetails(row.order_via_id);
                const checkComplaintAssignedOrNot = await checkComplaintAssignOrNot(row.id)
                const getAssignUsers = await checkComplaintAssignToGetEndUser(row.id)
                const assignUserId = getAssignUsers.length > 0 ? getAssignUsers[0].assign_to : null;

                if (assignUserId != null && assignUserId != undefined) {
                    managerAndSupervisorDetails = await usersToManager(assignUserId);
                    if (managerAndSupervisorDetails != null && managerAndSupervisorDetails != undefined) {
                        if (getAssignUsers.length > 0) {
                            const endUsersData = [];
                            const uniqueEndUserIds = new Set();

                            for (const row of getAssignUsers) {
                                if (row.assign_to != null) {
                                    const endUserDetails = await getUserDetails(row.assign_to);
                                    if (endUserDetails.length > 0) {
                                        const userId = endUserDetails[0].id;
                                        if (!uniqueEndUserIds.has(userId)) {
                                            const userComplaints = await checkUserHasNoActiveComplaints(userId);
                                            const isAssigned = userComplaints.some(complaint => complaint.assign_to === userId);

                                            endUsersData.push({
                                                id: endUserDetails[0].id,
                                                name: endUserDetails[0].name,
                                                employee_id: endUserDetails[0].employee_id,
                                                image: endUserDetails[0].image,
                                                isAssigned: isAssigned,
                                            });
                                            uniqueEndUserIds.add(userId);
                                        }
                                    }
                                }
                            }

                            managerAndSupervisorDetails['data'][0]['endUserDetails'] = endUsersData;
                        }

                    }
                }
                if (checkComplaintAssignedOrNot) {
                    isComplaintAssigned = true;
                }

                if (row.complaint_for == '1') {
                    const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                    company_name = energyCompanyName.name;
                    const selectedOutlets = await getOutletById(row.outlet_id);
                    outletDetails = selectedOutlets;
                }
                else {
                    const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
                    company_name = energyCompanyName.company_name;

                }

                if (orderViaDetails != null) {
                    order_via = orderViaDetails.order_via;
                }
                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name;
                }


                //--------complaint status handle--------------------------------
                if (row.status === 1) {
                    status = 'pending';
                } else if (row.status === 2) {
                    status = 'approved';
                } else if (row.status === 3) {
                    status = 'working';
                } else if (row.status === 4) {
                    status = 'rejected';
                } else if (row.status === 5) {
                    status = 'resolved';
                }

                //-------------Complaints raise type like own/others --------------------------------
                if (row.created_by === req.user.user_id) {
                    complaintRaiseType = 'own';
                } else {
                    complaintRaiseType = 'other';
                }

                //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
                const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
                const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
                const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;

                finalData.push({
                    id: row.id,
                    energy_company_name: company_name,
                    zones: selectedZones,
                    regionalOffices: selectedRegionalOffices,
                    saleAreas: selectedSaleAreas,
                    districts: selectedDistricts,
                    outlets: outletDetails,
                    complaint_type: complaintTypeValue,
                    complaint_for: row.complaint_for,
                    work_permit: row.work_permit,
                    description: row.description,
                    complaint_unique_id: row.complaint_unique_id,
                    status: status,
                    complaints_approval_by: complaintApprovalByName,
                    complaints_approval_by_image: complaintApprovalBy ? complaintApprovalBy.image : null,
                    complaintRaiseType: complaintRaiseType,
                    complaint_raise_by: complaintRaiseByName,
                    isComplaintAssigned: isComplaintAssigned,
                    order_by_id: row.order_by_id,
                    order_by_details: order_by_name,
                    order_via_id: row.order_via_id,
                    order_via_details: order_via,
                    manager_and_supevisor: managerAndSupervisorDetails ? managerAndSupervisorDetails.data[0] : [],
                    created_at: moment(row.created_at).format('YYYY-MM-DD')
                });
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData[0] });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: true, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


const approvedComplaints = async (req, res) => {

    try {
        const { complaint_id } = req.body;
        if (complaint_id.length <= process.env.VALUE_ZERO) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Please select request." });
        }
        const checkApprovalAccess = await getComplaintsApprovalAccess();
        const loggedUserType = req.user.user_type;
        if (checkApprovalAccess == loggedUserType) {
            const approvedBy = req.user.user_id;
            const title = 'Complaint approved';
            const roleDetailsData = await roleById(loggedUserType);
            const remark = 'Complaint approved by ' + roleDetailsData.name;
            const role_id = loggedUserType;
            const created_by = approvedBy;
            const status_changed_on = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

            if (complaint_id) {

                await db.query(`UPDATE complaints SET status = '2', status_changed_on = '${status_changed_on}', status_changed_by= '${approvedBy}', complaints_approval_by='${approvedBy}' WHERE id='${complaint_id}'`);
                await complaintsTimeLineApprovedHelper(complaint_id, title, remark, role_id, created_by);

            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Complaints approved successfully" });
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "You are not allowed to approved complaints" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

// get complaints full timeline tree view
const getComplaintFullTimeline = async (req, res) => {

    try {
        const complaintId = req.params.id;
        var finalData = [];
        let status;
        let complaintApprovalName;
        let complaintApprovalImage;
        let complaintApprovalAt;
        let approvedTitle;
        let approvedRemark;
        let getAreaManager;
        let complaintAssignDetails = {};
        let itemStockPunchHistory = [];
        let fundExpensePunchHistory = [];

        const { error } = checkPositiveInteger.validate({ id: complaintId });
        if (error) return res.status(400).json({ status: false, message: error.message })

        const selectQuery = `SELECT * FROM complaints WHERE id = ?`
        const result = await db.query(selectQuery, complaintId);

        if (result.length > process.env.VALUE_ZERO) {
            //complaints type details
            const complaintType = await getComplaintTypeById(result[0].complaint_type);

            //compliant total assign timeline details
            const complaintTimeLine = await db.query(`SELECT * FROM complaints_timeline WHERE complaints_id = '${complaintId}' AND status IN ('created','assigned', 'approved', 'rejected', 'resolved', 'hold')`)
                
            // complaint approval details
            const compliantApprovalId = result[0].complaints_approval_by;
            if (compliantApprovalId > process.env.VALUE_ZERO) {
                // get approved at time
                const getApprovedAt = await db.query(`SELECT * FROM complaints_timeline WHERE complaints_id = '${complaintId}' AND created_by = '${compliantApprovalId}' AND status IN ('approved', 'rejected', 'resolved')`);


                const complaintApproval = await complaintApprovalDetails(result[0].complaints_approval_by);
                complaintApprovalName = complaintApproval.name;
                complaintApprovalImage = complaintApproval.image;
                complaintApprovalAt = moment(getApprovedAt[0].created_at).format('YYYY-MM-DD HH:mm:ss A');
                approvedTitle = getApprovedAt[0].title;
                approvedRemark = getApprovedAt[0].remark;
            }

            if (result[0].status == 1) {
                status = 'pending';
            }
            else if (result[0].status == 2) {
                status = 'approved';
            }
            else if (result[0].status == 3) {
                status = 'working';
            }
            else if (result[0].status == 4) {
                status = 'rejected';
            }
            else if (result[0].status == 5) {
                status = 'resolved';
            }

            const complaintDetails = {
                "complaint_id": result[0].id,
                "complaint_type": complaintType.complaint_type_name,
                "complaint_description": result[0].description,
                "complaint_Status": status,
                "complaint_generated_at": moment(result[0].created_at).format("YYYY-MM-DD HH:mm:ss A"),
            }
            const complaintRaiserData = await complaintRaiseBy(result[0].created_by);
            const complaintRaiserDetails = {
                "name": complaintRaiserData.name ? complaintRaiserData.name : "",
                "image": complaintRaiserData.image
            }

            const complaintApprovalData = {
                'name': complaintApprovalName,
                'image': complaintApprovalImage,
                'approve_title': approvedTitle,
                "approve_remarks": approvedRemark,
                "approved_at": complaintApprovalAt
            }

            // get all item details which is stock punch on that complaint

            if (complaintTimeLine.length > process.env.VALUE_ZERO) {
                let assignedRefinedData = [];
                for (const row of complaintTimeLine) {
                    //get assigned by details
                    const assignedByData = await complaintAssignByDetails(row.role_id, row.created_by);

                    const assignedUsersRoles = await db.query(`SELECT user_type FROM users WHERE id = ?`, [row.assign_to]);

                    const assignedToData = assignedUsersRoles.length > 0 ? await complaintAssignToDetails(assignedUsersRoles[0].user_type, row.assign_to) : { id: null, name: '', image: '' };

                    getAreaManager = await usersToManager(assignedToData.id);

                    if (assignedUsersRoles.length > 0) {
                        assignedRefinedData.push({
                            "id": row.id,
                            "complaint_unique_id": row.complaint_unique_id,
                            "title": row.title,
                            "remark": row.remark,
                            "assigned_by": assignedByData.name ? assignedByData.name : "",
                            "assigned_by_image": assignedByData.image,
                            "assigned_to": assignedToData.name,
                            "assigned_to_id": assignedToData.id,
                            "assigned_to_image": assignedToData.image,
                            "status": row.status,
                            "assigned_at": moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                            "is_end_user_free": row.free_end_users == 1 ? false : true,
                        });
                    } else {
                        assignedRefinedData.push({
                            "id": row.id,
                            "complaint_unique_id": row.complaint_unique_id,
                            "title": row.title,
                            "remark": row.remark,
                            "status": row.status,
                            "assigned_at": moment(row.created_at).format("YYYY-MM-DD HH:mm:ss A"),
                            "is_end_user_free": row.free_end_users == 1 ? false : true,
                        });
                    }
                }
                complaintAssignDetails = {
                    "assignData": assignedRefinedData
                };
            }



            const getItemHistory = await db.query(`SELECT * FROM stock_punch_histories WHERE complaint_id = ?`, [complaintId]);

            if (getItemHistory.length > process.env.VALUE_ZERO) {
                for (const item of getItemHistory) {
                    const punchByDetails = await getCreatedByDetails(item.punch_by);
                    itemStockPunchHistory.push({
                        id: item.id,
                        punch_at: moment(item.punch_at).format('YYYY-MM-DD HH:mm:ss A'),
                        punch_by: punchByDetails ? punchByDetails.name : "",
                        punch_by_image: punchByDetails ? punchByDetails.image : "",
                        punch_by_employee_id: punchByDetails ? punchByDetails.employee_id : "",
                        stock_punch_detail: JSON.parse(item.stock_punch_detail),
                    });
                }
            }


            // get all fund details which is fund  expense punch on that complaint
            const getFundExpensePunchHistory = await db.query(`SELECT * FROM expense_punch_history WHERE complaint_id = ?`, [complaintId]);

            if (getFundExpensePunchHistory.length > process.env.VALUE_ZERO) {
                for (const fund of getFundExpensePunchHistory) {
                    
                    const punchByDetails = await getCreatedByDetails(fund.user_id);
                    fundExpensePunchHistory.push({
                        id: fund.id,
                        punch_at: moment(fund.created_at).format('YYYY-MM-DD HH:mm:ss A'),
                        punch_by: punchByDetails ? punchByDetails.name : "",
                        punch_by_image: punchByDetails ? punchByDetails.image : "",
                        punch_by_employee_id: punchByDetails ? punchByDetails.employee_id : "",
                        expense_punch_detail: JSON.parse(fund.items),
                    });
                }
            }


            finalData.push({ complaintDetails: complaintDetails, complaintRaiserDetails: complaintRaiserDetails, complaintApprovalData: complaintApprovalData, complaintAssignDetails: complaintAssignDetails, itemStockPunchHistory: itemStockPunchHistory, fundExpensePunchHistory: fundExpensePunchHistory, areaManager: getAreaManager })

            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: finalData[0] })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}


const complaintStatusChanged = async (req, res) => {

    try {
        const { status, complaint_id } = req.body

        const { error } = checkPositiveInteger.validate({ id: status });

        if (error) return res.status(400).json({ status: false, message: error.message })

        const statusChangedBy = req.user.user_id;
        const statusChangedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const updateQuery = `UPDATE complaints SET status = ?, status_changed_by = ?, status_changed_on = ? WHERE id = ?`

        const queryResult = await db.query(updateQuery, [status, statusChangedBy, statusChangedAt, complaint_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "status changed successfully" });
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! status not changed" });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getTotalFreeEndUsers = async (req, res) => {
    try {
        const loggedUserId = req.user.user_id;
        const selectQuery = 'SELECT id, name, image, admin_id FROM users WHERE admin_id = ?';
        const queryResult = await db.query(selectQuery, [loggedUserId]);

        if (queryResult.length > 0) {
            const finalData = [];

            for (row of queryResult) {
                const totalUsersUnder = await getFreeEndUsersCount(row.id);
                let totalFreeUsers = 0;

                if (totalUsersUnder.length > 0) {
                    for (userId of totalUsersUnder) {
                        const freeUserCount = await countFreeUser(userId.id);

                        if (!freeUserCount.some(user => user.assign_to === row.id)) {
                            totalFreeUsers += 1;
                        }
                    }
                } else {
                    totalFreeUsers = 1;
                }

                finalData.push({
                    user_id: row.id,
                    admin_id: row.admin_id,
                    name: row.name,
                    image: row.image,
                    freeEndUsersCount: totalFreeUsers,
                });
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "users fetched successfully", data: finalData });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No users found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const assignedComplaintToUsers = async (req, res) => {

    try {

        const { complaint_id, area_manager_id, supervisor_id, user_id } = req.body;

        const formValidation = Joi.object({
            complaint_id: Joi.number().required(),
            user_id: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = formValidation.validate(req.body)
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        const title = 'Complaint assigned to user';
        const roleDetailsData = await roleById(loggedUserType);
        const remark = 'Complaint assigned by ' + roleDetailsData.name;
        const status = 'assigned';
        const updateStatus = await db.query(`UPDATE complaints SET status = '3' WHERE complaints.id = '${complaint_id}';`)

        if (updateStatus.affectedRows > 0) {
            const insertQuery = `INSERT INTO complaints_timeline (complaints_id, title, remark, role_id,  assign_to, status, created_by, area_manager_id, supervisor_id, free_end_users) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

            const queryResult = await db.query(insertQuery, [complaint_id, title, remark, loggedUserType, user_id, status, loggedUserId, area_manager_id, supervisor_id, 1]);

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Complaint assign successfully" })
            } else {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! complaint not assigned" });
            }

        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! complaint not assigned" });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const updateAssignedComplaintToUsers = async (req, res) => {

    try {
        const { complaints_id, area_manager_id, supervisor_id, action } = req.body;

        const formValidation = Joi.object({
            complaints_id: Joi.number().required(),
            action: Joi.array().items(
                Joi.object({
                    add: Joi.object({
                        assign_to: Joi.array().items(Joi.number()).required(),
                    }),
                    remove: Joi.object({
                        assign_to: Joi.array().items(Joi.number()).required(),
                    }),
                }).xor('add', 'remove')
            ).required(),
        });

        const { error } = formValidation.validate({ complaints_id, action });
        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }



        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        const title = 'Complaint assigned to user';
        const removeTitle = 'End user removed from this complaint.';
        const roleDetailsData = await roleById(loggedUserType);
        const remark = 'Complaint assigned by ' + roleDetailsData.name;
        const removeRemark = 'Complaint removed from ' + roleDetailsData.name;
        const status = 'assigned';

        let values, query;

        // Check if 'remove' action is present
        if (action[0].remove) {
            const { assign_to } = action[0].remove;

            // Fetch timeline IDs for the specified complaint ID and assign_to values
            const timeLineIds = await getComplaintsTimelineId(assign_to);

            if (assign_to.length > 0 && timeLineIds.length > 0) {
                const assignToPlaceholders = Array(assign_to.length).fill('?').join(',');
                const timelinePlaceholders = Array(timeLineIds.length).fill('?').join(',');

                query = `UPDATE complaints_timeline SET free_end_users = 0, remark=?, title=? WHERE assign_to IN (${assignToPlaceholders}) AND id IN (${timelinePlaceholders})`;
                values = [removeRemark, removeTitle, ...assign_to, ...timeLineIds];

            }
        }
        // Check if 'add' action is present
        else if (action[0].add) {
            const { assign_to } = action[0].add;

            if (assign_to.length > 0) {

                // Construct the placeholders for SQL IN clause based on the number of assign_to values
                const existingRecords = await db.query(
                    `SELECT * FROM complaints_timeline WHERE complaints_id = ? AND free_end_users = 1 AND assign_to IN (?)`,
                    [complaints_id, assign_to]
                );

                const existingAssignToValues = existingRecords.map(record => record.assign_to);

                // Filter out assign_to values that are not already present
                const assign_toToInsert = assign_to.filter(assignToValue => !existingAssignToValues.includes(assignToValue));

                if (assign_toToInsert.length > 0) {
                    // Construct the INSERT query
                    const assignToPlaceholders = Array(assign_toToInsert.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
                    const valuesToInsert = assign_toToInsert.flatMap((assignToValue) => [
                        complaints_id, area_manager_id, supervisor_id, 1, title, remark, roleDetailsData.id, assignToValue, status, loggedUserId
                    ]);

                    query = `INSERT INTO complaints_timeline (complaints_id, area_manager_id, supervisor_id, free_end_users, title, remark, role_id, assign_to, status, created_by) VALUES ${assignToPlaceholders}`;
                    values = valuesToInsert;
                } else {
                    return res.status(StatusCodes.OK).json({ status: true, message: 'End User updated successfully' });
                }
            }
        }
        // if no action is present, return false
        else {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'Invalid action format' });
        }

        // Execute the query if both query and values are defined
        if (query && values) {
            const result = await db.query(query, values);
            if (result.affectedRows > 0) {
                if (action[0].add) {
                    res.status(StatusCodes.OK).json({ status: true, message: 'End User added successfully' });
                } else if (action[0].remove) {
                    res.status(StatusCodes.OK).json({ status: true, message: 'End User removed successfully.' });
                }
            }
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error });
    }
};


const rejectedAssignComplaintToUsers = async (req, res) => {
    try {
        const { id, status, rejected_remark } = req.body;
        const todayDate = moment().format('YYYY-MM-DD HH:mm:ss');
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(403).json({ status: false, message: error.message });

        let user_type = req.user.user_type;
        let status_changed_by = req.user.user_id;

        const roleDetails = await roleById(user_type);
        const getUserName = await getCreatedUserNameFromAdmin(status_changed_by);

        let notificationData = [];
        // If status is 'Rejected'
        if (status == 4) {
            notificationData.push({
                "complaint_id": id,
                "title": "Compaints Rejected.",
                "remark": `This complaint rejected by ${roleDetails.name} ${getUserName[0].name}.`,
                "user_type": user_type,
                "user_id": status_changed_by,
                "rejected_remark": rejected_remark + ` (${getUserName[0].name})`,
            });

            const updateQuery = ` UPDATE complaints SET status = '${status}', complaints_approval_by = '${status_changed_by}', status_changed_by = '${status_changed_by}', status_changed_on = '${todayDate}', rejected_remark = '${rejected_remark}' WHERE id = '${id}' `;
            const queryResult = await db.query(updateQuery);

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                await updateComplaintsTimeLineHelper(notificationData[0].complaint_id, notificationData[0].title, notificationData[0].rejected_remark, notificationData[0].user_type, "rejected", status_changed_by);
                res.status(200).json({
                    status: true, message: "Complaint status changed to Rejected successfully"
                });
            } else {
                return res.status(400).json({ status: false, message: "Error! Complaint status not changed" });
            }
        } else {
            return res.status(400).json({ status: false, message: "Invalid status code" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};


const getManagerFreeTeamMember = async (req, res) => {

    try {
        const manager_id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: manager_id });

        if (error) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: error.message
                });
        }

        // get manager team and his members
        const teamMembers = await db.query("SELECT id, manager_id, team_name, team_member FROM hr_teams WHERE manager_id = ?", [manager_id]);

        if (teamMembers.length > process.env.VALUE_ZERO) {
            const members = teamMembers[0];
            const member_list = JSON.parse(members.team_member);
            // get member details
            const sql = `SELECT id, name, employee_id, image FROM users WHERE id IN(${member_list.team_member})`;
            const membersDetails = await db.query(sql);

            if (membersDetails.length > process.env.VALUE_ZERO) {
                var finalData = [];
                for (let member of membersDetails) {
                    const complaintQuery = `SELECT complaints.id, complaints.description, complaints_timeline.complaints_id, complaints_timeline.title, complaints_timeline.assign_to FROM complaints INNER JOIN complaints_timeline ON complaints_timeline.complaints_id = complaints.id WHERE complaints_timeline.status != 'resolved' AND complaints_timeline.assign_to = ? GROUP BY complaints_timeline.complaints_id`;

                    const queryResult = await db.query(complaintQuery, [member.id]);
                    if (!queryResult || queryResult.length === 0) {
                        // If queryResult is empty, meaning no unresolved complaints for the member
                        finalData.push({
                            id: member.id,
                            name: member.name,
                            employee_id: member.employee_id,
                            image: member.image,
                        });
                    }
                }

                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: true,
                        message: 'members found',
                        data: finalData,
                    });
            }
            else {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: false,
                        message: 'members not found',
                    });
            }

        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: 'Manager has no teams available',
                });
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const countTotalMemberOnSingleComplaint = async (req, res) => {

    try {
        const complaint_id = req.params.complaint_id;

        if (complaint_id != null && complaint_id != undefined) {
            const complaintQuery = `SELECT complaints.id, complaints.complaint_unique_id FROM complaints WHERE  complaints.id = ?`;

            const complaintQueryResult = await db.query(complaintQuery, [complaint_id]);
            if (complaintQueryResult.length > process.env.VALUE_ZERO) {
                const complaintId = complaintQueryResult[0].id;
                // count total users on that complaint
                const queryResult = await db.query(`SELECT count(*) as total FROM complaints_timeline WHERE complaints_id = ?`, [complaintId]);

                if (queryResult.length > process.env.VALUE_ZERO) {
                    return res
                        .status(StatusCodes.OK)
                        .json({
                            status: true,
                            message: "members count",
                            data: queryResult[0].total
                        });
                }
                else {
                    return res
                        .status(StatusCodes.OK)
                        .json({
                            status: false,
                            message: "members not found",
                            data: process.env.VALUE_ZERO
                        });
                }
            }
            else {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: false,
                        message: "Complaint not found",
                    });
            }
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Invalid complaint id provided"
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


const getAllComplaintListForDropdown = async (req, res) => {

    try {

        const queryResult = await db.query(`SELECT complaints.id as complaint_id, complaints.complaint_unique_id,  complaint_types.complaint_type_name FROM complaints LEFT JOIN complaint_types ON complaint_types.id  = complaints.complaint_type WHERE complaints.status = '3'`);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: queryResult
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
    } catch (error) {

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}


const getUserByComplaintId = async (req, res) => {

    try {
        const complaint_id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: complaint_id });

        if (error) {

            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const queryResult = await db.query(`SELECT id as timeline_id, complaints_id, assign_to FROM complaints_timeline WHERE complaints_id = '${complaint_id}' AND assign_to IS NOT NULL AND status = 'assigned' ORDER BY id DESC LIMIT 1`);

        if (queryResult.length > process.env.VALUE_ZERO) {
            const assign_to = queryResult[0].assign_to;
            const getUserDetails = await db.query(`SELECT id as user_id, name, image, employee_id FROM users WHERE id = ?`, [assign_to]);

            if (getUserDetails.length > process.env.VALUE_ZERO) {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: true,
                        message: "End user details found",
                        data: getUserDetails,
                    });
            }
            else {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: false,
                        message: "End user Details not found on that complaint number",
                    });
            }
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "End user not found on that complaint number",
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


// const getAllComplaints = async (req, res) => {
//     try {
//         const outlet_id = req.query.outlet_id;
//         const regional_office_id = req.query.regional_office_id;
//         const sales_area_id = req.query.sales_area_id;
//         const order_by_id = req.query.order_by_id;
//         const area_manager_id = req.query.area_manager_id;
//         const supervisor_id = req.query.supervisor_id;
//         const end_user_id = req.query.end_user_id;
//         //pagination data
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var search_value = "";

//         if (searchData != null && searchData != '') {
//             search_value = `AND complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%' OR companies.company_name LIKE '%${searchData}%'`;
//         }

//         const checkApprovalAccess = await getComplaintsApprovalAccess();
//         let whereConditions;
//         const loggedUserType = req.user.user_type;
//         const finalData = [];
//         let status;
//         let complaintRaiseType;

//         if (checkApprovalAccess == loggedUserType) {
//             whereConditions = `WHERE complaints.complaints_approval_by IS NOT NULL`;
//         } else {
//             whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 `;
//         }

//         if (outlet_id) {
//             whereConditions += ` AND FIND_IN_SET('[${outlet_id}]', complaints.outlet_id) > 0`;
//         }

//         if (regional_office_id) {
//             whereConditions += ` AND FIND_IN_SET('[${regional_office_id}]', complaints.ro_id) > 0`;
//         }

//         if (sales_area_id) {
//             whereConditions += ` AND FIND_IN_SET('[${sales_area_id}]', complaints.sale_area_id) > 0`;
//         }
//         if (order_by_id) {
//             whereConditions += ` AND  complaints.order_by_id ='${order_by_id}' `;
//         }

//         if (area_manager_id) {
//             whereConditions += ` AND latest_timeline.area_manager_id ='${area_manager_id}'`;
//         }

//         if (supervisor_id) {
//             whereConditions += ` AND latest_timeline.supervisor_id ='${supervisor_id}'`;
//         }

//         if (end_user_id) {
//             whereConditions += ` AND latest_timeline.assign_to ='${end_user_id}'`;
//         }

//         const selectQuery = `SELECT complaints.*, companies.company_name, complaint_types.complaint_type_name, order_vias.order_via, latest_timeline.area_manager_id, latest_timeline.supervisor_id, latest_timeline.assign_to FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id LEFT JOIN companies ON companies.company_id = complaints.energy_company_id LEFT JOIN (SELECT MAX(id) AS latest_id, complaints_id, area_manager_id, supervisor_id, assign_to FROM complaints_timeline WHERE status = 'assigned' And free_end_users IN ('0', '1') GROUP BY complaints_id) AS latest_timeline ON complaints.id = latest_timeline.complaints_id ${whereConditions} ${search_value} ORDER BY complaints.id DESC LIMIT ${pageFirstResult}, ${pageSize};`
//         const result = await db.query(selectQuery);
//         // remove after order by
//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);
//         if (result.length > process.env.VALUE_ZERO) {
//             let outletDetails;
//             let company_name;
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//             for (const row of result) {
//                 let isComplaintAssigned = false;
//                 const complaintType = await getComplaintTypeById(row.complaint_type);
//                 const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
//                 const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
//                 //const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                 //const outletDetails = await getOutletById(row.outlet_id);
//                 const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
//                 const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
//                 const getOrderByDetails = await getUserDetails(row.order_by_id);
//                 const checkComplaintAssignedOrNot = await checkComplaintAssignOrNot(row.id)
//                 const areaManagerDetails = await getUserDetails(row.area_manager_id);
//                 const supervisorDetails = await getUserDetails(row.supervisor_id);
//                 const assignToDetails = await getUserDetails(row.assign_to);
//                 const checkUsersAssign = await checkUserAssignComplaints(row.id)

//                 if (checkComplaintAssignedOrNot) {
//                     isComplaintAssigned = true;
//                 }


//                 var order_by_name = '';

//                 if (row.complaint_for == '1') {
//                     const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
//                     company_name = energyCompanyName.name;
//                     const selectedOutlets = await getOutletById(row.outlet_id);
//                     outletDetails = selectedOutlets;
//                 }
//                 else {
//                     const energyCompanyName = await getCompanyDetailsById(row.energy_company_id);
//                     company_name = energyCompanyName.company_name;
//                 }

//                 if (getOrderByDetails.length > 0) {
//                     order_by_name = getOrderByDetails[0].name;
//                 }

//                 //--------complaint status handle--------------------------------
//                 if (row.status == 1) {
//                     status = 'pending';
//                 } else if (row.status == 2) {
//                     status = 'approved';
//                 } else if (row.status == 3) {
//                     status = 'working';
//                 } else if (row.status == 4) {
//                     status = 'rejected';
//                 } else if (row.status == 5) {
//                     status = 'resolved';
//                 } else if (row.status == 6) {
//                     status = 'Hold';
//                 }

//                 //-------------Complaints raise type like own/others --------------------------------

//                 if (row.created_by == req.user.user_id) {
//                     complaintRaiseType = 'own';
//                 } else {
//                     complaintRaiseType = 'other';
//                 }
//                 //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
//                 const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
//                 const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
//                 const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;
//                 finalData.push({
//                     id: row.id,
//                     complaint_unique_id: row.complaint_unique_id,
//                     energy_company_name: company_name,
//                     complaint_type: complaintTypeValue,
//                     complaint_for: row.complaint_for,
//                     work_permit: row.work_permit,
//                     description: row.description,
//                     status: status,
//                     complaintRaiseType: complaintRaiseType,
//                     complaints_approval_by: complaintApprovalByName,
//                     complaint_raise_by: complaintRaiseByName,
//                     isComplaintAssigned: isComplaintAssigned,
//                     created_at: moment(row.created_at).format('YYYY-MM-DD'),
//                     outlet: outletDetails ? outletDetails : null,
//                     regionalOffice: regionalOfficeDetails,
//                     saleAreaDetails: saleAreaDetails,
//                     order_via: row.order_via,
//                     order_via_id: row.order_via_id,
//                     order_by_details: order_by_name,
//                     order_by_id: row.order_by_id,
//                     area_manager_name: areaManagerDetails.length > 0 ? areaManagerDetails[0].name : null,
//                     area_manager_id: row.area_manager_id || null,
//                     supervisor_name: supervisorDetails.length > 0 ? supervisorDetails[0].name : null,
//                     supervisor_id: row.supervisor_id || null,
//                     end_user_name: assignToDetails.length > 0 ? assignToDetails[0].name : null,
//                     end_user_id: row.assign_to || null,
//                     checkUsersAssign: checkUsersAssign
//                 });
//             }

//             return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };



const getAllComplaints = async (req, res) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;
        const area_manager_id = req.query.area_manager_id;
        const supervisor_id = req.query.supervisor_id;
        const end_user_id = req.query.end_user_id;
        //pagination data
        const pageSize = parseInt(req.query.pageSize) ? parseInt(req.query.pageSize) : null;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        const columns = req.query.columns ? JSON.parse(req.query.columns) : ""
        // key for if it is excel or pdf
        const type = req.query.type || '1';
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value = `AND complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%' OR companies.company_name LIKE '%${searchData}%'`;
        }

        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;
        let finalData = [];
        let status;
        let complaintRaiseType;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = `WHERE complaints.complaints_approval_by IS NOT NULL`;
        } else {
            whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 `;
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

        if (area_manager_id) {
            whereConditions += ` AND latest_timeline.area_manager_id ='${area_manager_id}'`;
        }

        if (supervisor_id) {
            whereConditions += ` AND latest_timeline.supervisor_id ='${supervisor_id}'`;
        }

        if (end_user_id) {
            whereConditions += ` AND latest_timeline.assign_to ='${end_user_id}'`;
        }

        let selectQuery = `SELECT complaints.*, companies.company_name, complaint_types.complaint_type_name, order_vias.order_via, latest_timeline.area_manager_id, latest_timeline.supervisor_id, latest_timeline.assign_to FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id LEFT JOIN companies ON companies.company_id = complaints.energy_company_id LEFT JOIN (SELECT MAX(id) AS latest_id, complaints_id, area_manager_id, supervisor_id, assign_to FROM complaints_timeline WHERE status = 'assigned' And free_end_users IN ('0', '1') GROUP BY complaints_id) AS latest_timeline ON complaints.id = latest_timeline.complaints_id ${whereConditions} ${search_value} ORDER BY complaints.id `

        if(pageSize){
            selectQuery += ` DESC LIMIT ${pageFirstResult}, ${pageSize}`
        }
        const result = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (result.length > process.env.VALUE_ZERO) {
            let outletDetails;
            let company_name;
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of result) {
                let isComplaintAssigned = false;
                const complaintType = await getComplaintTypeById(row.complaint_type);
                const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                //const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                //const outletDetails = await getOutletById(row.outlet_id);
                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                const checkComplaintAssignedOrNot = await checkComplaintAssignOrNot(row.id)
                const areaManagerDetails = await getUserDetails(row.area_manager_id);
                const supervisorDetails = await getUserDetails(row.supervisor_id);
                const assignToDetails = await getUserDetails(row.assign_to);
                const checkUsersAssign = await checkUserAssignComplaints(row.id)

                if (checkComplaintAssignedOrNot) {
                    isComplaintAssigned = true;
                }


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
                }

                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name;
                }

                //--------complaint status handle--------------------------------
                if (row.status == 1) {
                    status = 'pending';
                } else if (row.status == 2) {
                    status = 'approved';
                } else if (row.status == 3) {
                    status = 'working';
                } else if (row.status == 4) {
                    status = 'rejected';
                } else if (row.status == 5) {
                    status = 'resolved';
                } else if (row.status == 6) {
                    status = 'Hold';
                }

                //-------------Complaints raise type like own/others --------------------------------

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = 'own';
                } else {
                    complaintRaiseType = 'other';
                }
                //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
                const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
                const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
                const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;
                finalData.push({
                    id: row.id,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: complaintTypeValue,
                    complaint_for: row.complaint_for,
                    work_permit: row.work_permit,
                    description: row.description,
                    status: status,
                    complaintRaiseType: complaintRaiseType,
                    complaints_approval_by: complaintApprovalByName,
                    complaint_raise_by: complaintRaiseByName,
                    isComplaintAssigned: isComplaintAssigned,
                    created_at: moment(row.created_at).format('YYYY-MM-DD'),
                    outlet: outletDetails ? outletDetails : null,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    order_via: row.order_via,
                    order_via_id: row.order_via_id,
                    order_by_details: order_by_name,
                    order_by_id: row.order_by_id,
                    area_manager_name: areaManagerDetails.length > 0 ? areaManagerDetails[0].name : null,
                    area_manager_id: row.area_manager_id || null,
                    supervisor_name: supervisorDetails.length > 0 ? supervisorDetails[0].name : null,
                    supervisor_id: row.supervisor_id || null,
                    end_user_name: assignToDetails.length > 0 ? assignToDetails[0].name : null,
                    end_user_id: row.assign_to || null,
                    checkUsersAssign: checkUsersAssign
                });
            }

            if(!pageSize){
                finalData = finalData.map( (item) => {
                    return { 
                        ...item,
                        outlet: item.outlet[0].outlet_name, 
                        regionalOffice: item.regionalOffice[0].regional_office_name, 
                        saleAreaDetails: item.saleAreaDetails[0].sales_area_name
                    }
                    
                })
                let filePath;
                if(type == '1'){
                    filePath = await exportToExcel(finalData, 'Complaints', columns);
                }
                else{
                    filePath = await exportToPDF(finalData, 'Complaints','Complaints', columns);
                }
                return res.status(StatusCodes.OK).json({ status: true, message: "excel exported successfully", filePath  });
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};



const reworkForResolvedComplaints = async (req, res) => {
    try {
        const { user_id, complaint_id, supervisor_id, area_manager_id } = req.body;
        const formValidation = Joi.object({
            complaint_id: Joi.number().required(),
            user_id: Joi.number().required(),
            area_manager_id: Joi.number().required(),
            supervisor_id: Joi.number().required(),
        });

        const { error } = formValidation.validate(req.body)
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })
        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        const title = 'Complaint assigned to user';
        const roleDetailsData = await roleById(loggedUserType);
        const remark = 'Complaint assigned by ' + roleDetailsData.name;
        const status = 'assigned';

        const updateQuery = `UPDATE complaints SET status = '3', status_changed_by = '${loggedUserId}', updated_at = NOW() WHERE id = '${complaint_id}'`;

        const result = await db.query(updateQuery);
        if (result.affectedRows > process.env.VALUE_ZERO) {

            const insertTimeline = `INSERT INTO complaints_timeline (complaints_id, title, remark, role_id,  assign_to, status, created_by, area_manager_id, supervisor_id, free_end_users) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

            const queryResult = await db.query(insertTimeline, [complaint_id, title, remark, loggedUserType, user_id, status, loggedUserId, area_manager_id, supervisor_id, 1]);

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                return res.status(200).json({
                    status: true, message: "Complaint Rework sucessfully."
                });

            } else {
                return res.status(400).json({ status: false, message: "Error! Complaint status not changed" });
            }

        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });

    }
}

// if active complaint then it hold and  active re assign complaint
const getOutletByIdNew = async (req, res) => {
    try {
        const status = req.query.status;
        let selectQuery;

        if (status) {
            selectQuery = await db.query(`SELECT * FROM complaints WHERE status='${status}' AND complaint_for= 1 ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT * FROM complaints WHERE complaint_for = 1 ORDER BY id ASC;`)

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


const getRegionalByIdNew = async (req, res) => {
    try {
        const status = req.query.status;

        if (status) {
            selectQuery = await db.query(`SELECT * FROM complaints WHERE status='${status}' ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT * FROM complaints ORDER BY id ASC;`)
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


const getSaleByIdNew = async (req, res) => {
    try {
        const status = req.query.status;

        if (status) {
            selectQuery = await db.query(`SELECT * FROM complaints WHERE status='${status}' ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT * FROM complaints ORDER BY id ASC;`)
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


const getOrderByIdNew = async (req, res) => {
    try {
        const status = req.query.status;
        if (status) {
            selectQuery = await db.query(`SELECT * FROM complaints WHERE status='${status}' ORDER BY id ASC;`)
        } else {
            selectQuery = await db.query(`SELECT * FROM complaints ORDER BY id ASC;`)
        }

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

const getAreaManagerOfAssign = async (req, res) => {
    try {
        const selectQuery = await db.query(`SELECT * FROM complaints_timeline WHERE assign_to > 0 AND free_end_users = 1 `);

        if (selectQuery.length > 0) {
            const getQuery = selectQuery.map(item => item.assign_to);
            let supervisorIds = [];
            for (let i = 0; i < getQuery.length; i++) {
                const getSuperVisorDetails = await db.query(`SELECT id, name, employee_id, image, supervisor_id FROM users WHERE id = ?`, [getQuery[i]]);
                const supervisors = getSuperVisorDetails.map(item => item.supervisor_id);
                supervisorIds = supervisorIds.concat(supervisors);
            }

            supervisorIds = [...new Set(supervisorIds)];

            let managerIds = [];
            for (let i = 0; i < supervisorIds.length; i++) {
                const getManagerDetails = await db.query(`SELECT id, name, employee_id, image, manager_id FROM users WHERE id = ?`, [supervisorIds[i]]);
                const managerResult = getManagerDetails.map(item => item.manager_id);
                managerIds = managerIds.concat(managerResult);
            }

            managerIds = [...new Set(managerIds)];

            // Fetch manager details for all manager IDs
            const managerDetails = await db.query(`SELECT id, name FROM users WHERE id IN (?)`, [managerIds]);

            return res.status(StatusCodes.OK).json({
                status: true,
                data: managerDetails
            });

        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Area Manager not found"
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

// supervisor
const getSuperVisorOfAssign = async (req, res) => {
    try {
        const selectQuery = await db.query(`SELECT * FROM complaints_timeline WHERE assign_to > 0 and free_end_users > 0`);

        if (selectQuery.length > 0) {
            const getQuery = selectQuery.map(item => item.assign_to);

            let supervisorIds = [];
            for (let i = 0; i < getQuery.length; i++) {
                const getSuperVisorDetails = await db.query(`SELECT id, name, employee_id, image, supervisor_id FROM users WHERE id = ?`, [getQuery[i]]);
                const supervisors = getSuperVisorDetails.map(item => item.supervisor_id);
                supervisorIds = supervisorIds.concat(supervisors);
            }

            supervisorIds = [...new Set(supervisorIds)];
            // Fetch manager details for all manager IDs
            const supervisorDetails = await db.query(`SELECT id, name FROM users WHERE id IN (?)`, [supervisorIds]);

            return res.status(StatusCodes.OK).json({
                status: true,
                data: supervisorDetails
            });

        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "SuperVisor not found"
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

// endusers
const getEndUsersOfAssign = async (req, res) => {
    try {
        const selectQuery = await db.query(`SELECT * FROM complaints_timeline WHERE assign_to > 0 and free_end_users > 0`);

        if (selectQuery.length > 0) {
            const getQuery = selectQuery.map(item => item.assign_to);

            let endUserDetails = [];
            for (let i = 0; i < getQuery.length; i++) {
                const endUserID = getQuery[i];
                const endUserDetail = await db.query(`SELECT id, name, employee_id, image FROM users WHERE id = ?`, [endUserID]);
                endUserDetails.push(...endUserDetail); // Push endUser details to the array
            }
            // Filter out duplicates based on user ID
            endUserDetails = endUserDetails.filter((user, index, array) => {
                return array.findIndex(u => u.id === user.id) === index;
            });

            return res.status(StatusCodes.OK).json({
                status: true,
                data: endUserDetails
            });

        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "End Users not found."
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


const reActiveToRejectedComplaints = async (req, res) => {

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

        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        const title = 'Complaint Re Active to user';
        const roleDetailsData = await roleById(loggedUserType);
        const remarks = 'Complaint approved by ' + roleDetailsData.name;
        const status = 'approved';

        const queryResult = await db.query(`UPDATE complaints SET status = '2', rejected_remark = NULL, updated_by = '${loggedUserId}' WHERE id = '${id}';`);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            const insertTimelines = await complaintsTimeLineHelper(id, title, remarks, loggedUserType, status, loggedUserId);

            if (insertTimelines.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Request Reactive successfully" });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Request Reactive failed" });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Error! something went wrong, please try again later" });
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


const holdAndTransferComplaints = async (req, res) => {
    try {
        const { complaint_id, area_manager_id, supervisor_id, user_id } = req.body;

        const { error } = checkPositiveInteger.validate({ id: complaint_id });
        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        const roleDetailsData = await roleById(loggedUserType);
        const remarks = 'Complaint assigned by ' + roleDetailsData.name;
        // const title = 'Complaint assigned by' + roleDetailsData.name;

        const selectQuery = `SELECT * FROM complaints_timeline WHERE assign_to = '${user_id}' AND free_end_users = 1`
        const queryResult = await db.query(selectQuery);

        const insertQuery = `INSERT INTO complaints_timeline SET complaints_id ='${complaint_id}', title = 'Complaint Assigned to users', remark = '${remarks}', role_id = '${loggedUserType}', assign_to = '${user_id}', area_manager_id = '${area_manager_id}', supervisor_id = '${supervisor_id}', status = 'assigned', created_by = '${loggedUserId}', free_end_users = 1 `;

        if (queryResult.length > 0 && queryResult[0].complaints_id) {
            const checkTotalUsersAssigned = await db.query(`SELECT * FROM complaints_timeline WHERE status = 'assigned' AND complaints_id = '${queryResult[0].complaints_id}'`)

            if (checkTotalUsersAssigned.length === 1) {

                const transferAssigned = await db.query(insertQuery)
                if (transferAssigned.affectedRows > 0) {
                    const updateTimelines = await db.query(`UPDATE complaints_timeline SET free_end_users = 0, status = 'hold', new_complaint_id = '${complaint_id}' WHERE complaints_id = '${queryResult[0].complaints_id}' AND status = 'assigned' AND assign_to = '${user_id}' `)

                    const updateStatusInComplaints = await db.query(`UPDATE complaints SET status = '6' WHERE id= '${queryResult[0].complaints_id}'`)
                    if (updateTimelines.affectedRows > 0) {

                        return res.status(StatusCodes.OK).json({ status: true, message: "Complaint hold and user transfer successfully" });
                    }
                }
            } else if (checkTotalUsersAssigned.length > 1) {
                const transferAssigned = await db.query(insertQuery)

                if (transferAssigned.affectedRows > 0) {
                    const updateTimelines = await db.query(`UPDATE complaints_timeline SET title = 'complaints transfer', remark = 'complaints transfer', free_end_users = 0, status = 'transfer' WHERE complaints_id = '${queryResult[0].complaints_id}' AND status = 'assigned' AND assign_to = '${user_id}'`)

                    if (updateTimelines.affectedRows > 0) {
                        return res.status(StatusCodes.OK).json({ status: true, message: "Request Transfer successfully" });
                    }
                }
            }
        } else {
            const transferAssigned = await db.query(insertQuery);

            if (transferAssigned.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Complaints assigned Successfully" })
            }
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


async function reactiveComplaints(id) {
    const selectQuery = await db.query(`SELECT * FROM  complaints_timeline WHERE new_complaint_id = '${id}'`)

    if (selectQuery.length > 0) {
        await db.query(`UPDATE complaints_timeline SET status = 'assigned', free_end_users = 1, new_complaint_id = null  WHERE new_complaint_id = '${id}' AND status = 'hold'`);
    }
    
}


const allocateComplaintsToResolve = async (req, res) => {
    try {
        const { complaint_id, status } = req.body;
        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        const roleDetailsData = await roleById(loggedUserType);
        let title = '';
        let remark = '';
        let updateStatus = '';

        switch (status) {
            case 5:
                title = 'Complaint Resolved by users';
                remark = 'Complaint Resolved by ' + roleDetailsData.name;
                updateStatus = 'resolved';
                break;
            case 6:
                title = 'Complaint on Hold';
                remark = 'Complaint put on hold by ' + roleDetailsData.name;
                updateStatus = 'Hold';
                break;
            default:
                return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'Invalid status provided' });
        }
        const updateQuery = await db.query(`UPDATE complaints SET status = '${status}' WHERE id = '${complaint_id}'`);

        if (updateQuery.affectedRows > 0) {
            const message = status == 5 ? 'Complaint resolved successfully.' : 'Complaint put on hold successfully.';
            if (status == 5) {
                const queryValues = [complaint_id, title, remark, roleDetailsData.id, updateStatus, loggedUserId, 0];
                const query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, status, created_by, free_end_users) VALUES (?, ?, ?, ?, ?, ?, ?)';
                await db.query(query, queryValues);
                await db.query(`UPDATE complaints_timeline SET free_end_users = '0' WHERE complaints_id = '${complaint_id}' AND status = 'assigned'`);
                const againActivePrevComplaints = await reactiveComplaints(complaint_id);

            } else if (status == 6) {
                await db.query(`UPDATE complaints_timeline SET status = 'Hold', free_end_users = '0' WHERE complaints_id = '${complaint_id}' AND status= 'assigned'`);

            }

            return res.status(StatusCodes.OK).json({ status: true, message: message });

        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: 'Complaint not found or status not updated' });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Internal server error' });
    }
};

async function checkUserAssignComplaints(id) {
    const selectQuery = await db.query(`
        SELECT * 
        FROM complaints_timeline 
        WHERE complaints_id = '${id}' 
        AND ((status = 'assigned' AND free_end_users = 1) OR (status = 'hold' AND free_end_users = 0));
    `);
    const groupedDetails = {}; // Object to store grouped details
    
    for (const row of selectQuery) {

        // const managerKey = `${row.area_manager_id.employee_id}-${row.supervisor_id.employee_id}`;
        const managerKey = `${row.area_manager_id ? row.area_manager_id.employee_id : 'null'}-${row.supervisor_id ? row.supervisor_id.employee_id : 'null'}`;

        if (!groupedDetails[managerKey]) {
            // Initialize the manager key if not already present
            groupedDetails[managerKey] = {
                areaManagerDetails: extractDetails(await getUserDetails(row.area_manager_id)),
                supervisorDetails: [], // Array to store supervisor details
                endUserDetails: new Set(), // Use Set to store unique end user IDs
                endUserDetailsArray: [] // Array to store end user details
            };
        }

        const supervisorExists = groupedDetails[managerKey].supervisorDetails.some(supervisor => supervisor.employee_id === row.supervisor_id.employee_id);

        if (!supervisorExists) {
            // Add supervisor details to the supervisors array
            groupedDetails[managerKey].supervisorDetails.push(extractDetails(await getUserDetails(row.supervisor_id)));
        }

        // Add end user details only if it's unique for this managerKey
        if (!groupedDetails[managerKey].endUserDetails.has(row.assign_to)) {
            groupedDetails[managerKey].endUserDetails.add(row.assign_to);
            groupedDetails[managerKey].endUserDetailsArray.push(extractDetails(await getUserDetails(row.assign_to)));
        }
    }

    // Convert endUsers Sets to arrays
    for (const key in groupedDetails) {
        groupedDetails[key].endUserDetails = [...groupedDetails[key].endUserDetailsArray];
        delete groupedDetails[key].endUserDetailsArray;
    }

    // Convert object values to array for the final result
    const result = Object.values(groupedDetails);
    return result;
}


function extractDetails(details) {
    return {
        employee_id: details[0].employee_id,
        id: details[0].id,
        name: details[0].name
    };
}

const userToManagerArea = async (req, res) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const result = await usersToManager(id)

        return res.status(StatusCodes.OK).json({ status: true, message: "Data fetched successfully.", data: result })


    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getManagerToComplaints = async (req, res) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT complaints.*, complaints_timeline.area_manager_id, complaints_timeline.supervisor_id, complaints_timeline.assign_to AS end_users_id FROM complaints LEFT JOIN complaints_timeline ON complaints.id = complaints_timeline.complaints_id WHERE (complaints.status IN ('3', '5') AND complaints_timeline.status = 'assigned' AND complaints_timeline.area_manager_id = '${id}') OR (complaints.status = '3' AND complaints_timeline.status = 'assigned' AND (complaints_timeline.supervisor_id = '${id}' OR complaints_timeline.assign_to = '${id}'))`;

        const result = await db.query(selectQuery);

        if (result.length > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Data fetched successfully.", data: result })
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found." })
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const getRegionalOfficeToComplaints= async (req,res)=>{
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT complaints.*, regional_offices.regional_office_name FROM complaints LEFT JOIN regional_offices ON CAST(REPLACE(REPLACE(complaints.ro_id, '[', ''), ']', '') AS UNSIGNED) = regional_offices.id WHERE regional_offices.id = ${id} AND complaints.status IN ('3', '5');` 

        const queryResult = await db.query(selectQuery)
        const finalData=[]
        if(queryResult.length > 0) {
            for(const row of queryResult){
               finalData.push({
                id:row.id,
                complaint_unique_id:row.complaint_unique_id,
                regional_office_name:row.regional_office_name,
                ro_id:row.ro_id,
               })
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Data fetched successfully.", data: finalData })
        }else{
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found." })
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const getAllComplaintsExceptPending = async (req, res) => {
    try {
        const outlet_id = req.query.outlet_id;
        const regional_office_id = req.query.regional_office_id;
        const sales_area_id = req.query.sales_area_id;
        const order_by_id = req.query.order_by_id;
        const area_manager_id = req.query.area_manager_id;
        const supervisor_id = req.query.supervisor_id;
        const end_user_id = req.query.end_user_id;
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value = `AND complaint_types.complaint_type_name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%' OR companies.company_name LIKE '%${searchData}%'`;
        }

        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;
        const finalData = [];
        let status;
        let complaintRaiseType;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = `WHERE complaints.status != '1' AND complaints.complaints_approval_by IS NOT NULL`;
        } else {
            whereConditions = `WHERE complaints.status != '1' AND complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 `;
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

        if (area_manager_id) {
            whereConditions += ` AND latest_timeline.area_manager_id ='${area_manager_id}'`;
        }

        if (supervisor_id) {
            whereConditions += ` AND latest_timeline.supervisor_id ='${supervisor_id}'`;
        }

        if (end_user_id) {
            whereConditions += ` AND latest_timeline.assign_to ='${end_user_id}'`;
        }

        const selectQuery = `SELECT complaints.*, companies.company_name, complaint_types.complaint_type_name, order_vias.order_via, latest_timeline.area_manager_id, latest_timeline.supervisor_id, latest_timeline.assign_to FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id LEFT JOIN companies ON companies.company_id = complaints.energy_company_id LEFT JOIN (SELECT MAX(id) AS latest_id, complaints_id, area_manager_id, supervisor_id, assign_to FROM complaints_timeline WHERE complaints_timeline.status = 'assigned' And complaints_timeline.free_end_users = 1 GROUP BY complaints_id) AS latest_timeline ON complaints.id = latest_timeline.complaints_id ${whereConditions} ${search_value} ORDER BY complaints.id DESC LIMIT ${pageFirstResult}, ${pageSize};`

        const result = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        if (result.length > process.env.VALUE_ZERO) {
            let outletDetails;
            let company_name;
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of result) {
                let isComplaintAssigned = false;
                const complaintType = await getComplaintTypeById(row.complaint_type);
                const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                //const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                //const outletDetails = await getOutletById(row.outlet_id);
                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                const checkComplaintAssignedOrNot = await checkComplaintAssignOrNot(row.id)
                const areaManagerDetails = await getUserDetails(row.area_manager_id);
                const supervisorDetails = await getUserDetails(row.supervisor_id);
                const assignToDetails = await getUserDetails(row.assign_to);
                const checkUsersAssign = await checkUserAssignComplaints(row.id)
                if (checkComplaintAssignedOrNot) {
                    isComplaintAssigned = true;
                }


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
                }

                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name;
                }

                //--------complaint status handle--------------------------------
                if (row.status == 1) {
                    status = 'pending';
                } else if (row.status == 2) {
                    status = 'approved';
                } else if (row.status == 3) {
                    status = 'working';
                } else if (row.status == 4) {
                    status = 'rejected';
                } else if (row.status == 5) {
                    status = 'resolved';
                } else if (row.status == 6) {
                    status = 'Hold';
                }

                //-------------Complaints raise type like own/others --------------------------------

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = 'own';
                } else {
                    complaintRaiseType = 'other';
                }
                //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
                const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
                const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
                const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;
                finalData.push({
                    id: row.id,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: complaintTypeValue,
                    complaint_for: row.complaint_for,
                    work_permit: row.work_permit,
                    description: row.description,
                    status: status,
                    complaintRaiseType: complaintRaiseType,
                    complaints_approval_by: complaintApprovalByName,
                    complaint_raise_by: complaintRaiseByName,
                    isComplaintAssigned: isComplaintAssigned,
                    created_at: moment(row.created_at).format('YYYY-MM-DD'),
                    outlet: outletDetails ? outletDetails : null,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    order_via: row.order_via,
                    order_via_id: row.order_via_id,
                    order_by_details: order_by_name,
                    order_by_id: row.order_by_id,
                    area_manager_name: areaManagerDetails.length > 0 ? areaManagerDetails[0].name : null,
                    area_manager_id: row.area_manager_id || null,
                    supervisor_name: supervisorDetails.length > 0 ? supervisorDetails[0].name : null,
                    supervisor_id: row.supervisor_id || null,
                    end_user_name: assignToDetails.length > 0 ? assignToDetails[0].name : null,
                    end_user_id: row.assign_to || null,
                    checkUsersAssign: checkUsersAssign
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



const getAllComplaintsById = async (req, res) => {
    try {
       
        //pagination data
       const id = req.params.id;
        const checkApprovalAccess = await getComplaintsApprovalAccess();
        let whereConditions;
        const loggedUserType = req.user.user_type;
        const finalData = [];
        let status;
        let complaintRaiseType;

        if (checkApprovalAccess == loggedUserType) {
            whereConditions = `WHERE complaints.complaints_approval_by IS NOT NULL`;
        } else {
            whereConditions = `WHERE complaints.created_by = '${req.user.user_id}' AND complaints.complaints_approval_by > 0 `;
        }


        const selectQuery = `SELECT complaints.*, companies.company_name, complaint_types.complaint_type_name, order_vias.order_via, latest_timeline.area_manager_id, latest_timeline.supervisor_id, latest_timeline.assign_to FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type LEFT JOIN order_vias ON order_vias.id = complaints.order_via_id LEFT JOIN companies ON companies.company_id = complaints.energy_company_id LEFT JOIN (SELECT MAX(id) AS latest_id, complaints_id, area_manager_id, supervisor_id, assign_to FROM complaints_timeline WHERE status = 'assigned' And free_end_users IN ('0', '1') GROUP BY complaints_id) AS latest_timeline ON complaints.id = latest_timeline.complaints_id ${whereConditions} AND complaints.id = ${id}`
        
        const result = await db.query(selectQuery);
        // remove after order by
       
        if (result.length > process.env.VALUE_ZERO) {
            let outletDetails;
            let company_name;

            for (const row of result) {
                let isComplaintAssigned = false;
                const complaintType = await getComplaintTypeById(row.complaint_type);
                const complaintApprovalBy = await complaintApprovedBy(row.complaints_approval_by);
                const complaintRaiseDetails = await complaintRaiseBy(row.created_by);
                //const energyCompanyName = await getEnergyCompaniesById(row.energy_company_id);
                //const outletDetails = await getOutletById(row.outlet_id);
                const regionalOfficeDetails = await getRegionalNameById(row.ro_id);
                const saleAreaDetails = await getSaleAreaNameById(row.sale_area_id);
                const getOrderByDetails = await getUserDetails(row.order_by_id);
                const checkComplaintAssignedOrNot = await checkComplaintAssignOrNot(row.id)
                const areaManagerDetails = await getUserDetails(row.area_manager_id);
                const supervisorDetails = await getUserDetails(row.supervisor_id);
                const assignToDetails = await getUserDetails(row.assign_to);
                const checkUsersAssign = await checkUserAssignComplaints(row.id)

                if (checkComplaintAssignedOrNot) {
                    isComplaintAssigned = true;
                }


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
                }

                if (getOrderByDetails.length > 0) {
                    order_by_name = getOrderByDetails[0].name;
                }

                //--------complaint status handle--------------------------------
                if (row.status == 1) {
                    status = 'pending';
                } else if (row.status == 2) {
                    status = 'approved';
                } else if (row.status == 3) {
                    status = 'working';
                } else if (row.status == 4) {
                    status = 'rejected';
                } else if (row.status == 5) {
                    status = 'resolved';
                } else if (row.status == 6) {
                    status = 'Hold';
                }

                //-------------Complaints raise type like own/others --------------------------------

                if (row.created_by == req.user.user_id) {
                    complaintRaiseType = 'own';
                } else {
                    complaintRaiseType = 'other';
                }
                //const energyCompanyNameValue = energyCompanyName ? energyCompanyName.name : null;
                const complaintTypeValue = complaintType ? complaintType.complaint_type_name : null;
                const complaintApprovalByName = complaintApprovalBy ? complaintApprovalBy.name : null;
                const complaintRaiseByName = complaintRaiseDetails ? complaintRaiseDetails.name : null;
                finalData.push({
                    id: row.id,
                    complaint_unique_id: row.complaint_unique_id,
                    energy_company_name: company_name,
                    complaint_type: complaintTypeValue,
                    complaint_for: row.complaint_for,
                    work_permit: row.work_permit,
                    description: row.description,
                    status: status,
                    complaintRaiseType: complaintRaiseType,
                    complaints_approval_by: complaintApprovalByName,
                    complaint_raise_by: complaintRaiseByName,
                    isComplaintAssigned: isComplaintAssigned,
                    created_at: moment(row.created_at).format('YYYY-MM-DD'),
                    outlet: outletDetails ? outletDetails : null,
                    regionalOffice: regionalOfficeDetails,
                    saleAreaDetails: saleAreaDetails,
                    order_via: row.order_via,
                    order_via_id: row.order_via_id,
                    order_by_details: order_by_name,
                    order_by_id: row.order_by_id,
                    area_manager_name: areaManagerDetails.length > 0 ? areaManagerDetails[0].name : null,
                    area_manager_id: row.area_manager_id || null,
                    supervisor_name: supervisorDetails.length > 0 ? supervisorDetails[0].name : null,
                    supervisor_id: row.supervisor_id || null,
                    end_user_name: assignToDetails.length > 0 ? assignToDetails[0].name : null,
                    end_user_id: row.assign_to || null,
                    checkUsersAssign: checkUsersAssign
                });
            }

            return res.status(StatusCodes.OK).json({ status: true, message: "Request fetched successfully", data: finalData});
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};



async function exportToExcel(dataArray, fileName, columns) {

    const publicDirectory = path.join(process.cwd(), "public")
    const outputDir = path.join(publicDirectory, 'exportData');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        throw new Error('Invalid data array provided.');
    }

    if (!Array.isArray(columns) || columns.length === 0) {
        throw new Error('Invalid columns array provided.');
    }

    // Filter the data to include only the specified columns
    const filteredData = dataArray.map(item => {
        const filteredItem = {};
        columns.forEach(column => {
            filteredItem[column] = item[column] || null; // If the column doesn't exist, set it to null
        });
        return filteredItem;
    });

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Set the worksheet columns based on the filtered columns
    worksheet.columns = columns.map(column => ({ header: column, key: column }));

    // Add filtered data to the worksheet
    filteredData.forEach(item => {
        worksheet.addRow(item);
    });

    // Define the file path
    const filePath = path.join(outputDir, `${fileName}.xlsx`);

    // Write the workbook to a file
    await workbook.xlsx.writeFile(filePath);

    console.log(`Excel file created at: ${filePath}`);
    return `/exportData/${fileName}.xlsx`;
}


async function exportToPDF(dataArray, fileName, topCaption, columns) {

    const publicDirectory = path.join(process.cwd(), "public")
    const outputDir = path.join(publicDirectory, 'exportData');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        throw new Error('Invalid data array provided.');
    }

    if (!Array.isArray(columns) || columns.length === 0) {
        throw new Error('Invalid columns array provided.');
    }

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 30 });

    // Define the file path
    const filePath = path.join(outputDir, `${fileName}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    if (topCaption) {
        doc.fontSize(16).text(topCaption, { align: 'center', underline: true });
        doc.moveDown(); // Add some space after the caption
    }

    const tableWidth = 500; // Total width allocated for the table
    const columnCount = columns.length;
    const columnWidth = tableWidth / columnCount; // Evenly distribute width across all columns

    const columnWidths = columns.reduce((acc, col) => {
        acc[col] = columnWidth;
        return acc;
    }, {});
    // Define the table structure
    const table = {
        headers: columns,
        rows: dataArray.map(item => columns.map(col => item[col] || ''))
    };

    
    // Draw the table
    doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: (row, i) => doc.font('Helvetica').fontSize(8),
        columnSpacing: 5, // Adjust spacing between columns
        width: tableWidth, // Set table width
        columnWidths, // Apply dynamic column widths
        wrap: {
            header: true,
            cell: true // Enable wrapping for all cells
        }
    });

    // Finalize the PDF file
    doc.end();

    console.log(`PDF file created at: ${filePath}`);
    return `/exportData/${fileName}.pdf`;
}

module.exports = { getAllRequestedComplaints, getComplaintsDetailsById, getAllApprovedComplaints, getAllRejectedComplaints, getAllResolvedComplaints, getApprovedComplaintsDetailsById, approvedComplaints, getComplaintFullTimeline, complaintStatusChanged, getTotalFreeEndUsers, assignedComplaintToUsers, getManagerFreeTeamMember, countTotalMemberOnSingleComplaint, getAllComplaintListForDropdown, getUserByComplaintId, getAllComplaints, getAllApprovedAssignComplaints, getAllApprovedUnAssignComplaints, updateAssignedComplaintToUsers, rejectedAssignComplaintToUsers, reworkForResolvedComplaints, getOutletByIdNew, getRegionalByIdNew, getSaleByIdNew, getOrderByIdNew, reActiveToRejectedComplaints, getAreaManagerOfAssign, getSuperVisorOfAssign, getEndUsersOfAssign, holdAndTransferComplaints, allocateComplaintsToResolve, userToManagerArea, getManagerToComplaints, getRegionalOfficeToComplaints, getAllComplaintsExceptPending, getAllComplaintsById, exportToExcel }
