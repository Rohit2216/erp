var moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { complaintTypeValidations, checkPositiveInteger } = require('../helpers/validation');
const { getZoneNameById, complaintsTimeLineHelper, getRegionalNameById, getSaleAreaNameById, getDistrictById, getOutletById, roleById, getCreatedUserNameFromAdmin, getComplaintTimeline, calculatePagination, getDbLastComplaintUniqueId, getEnergyCompaniesById, getUserDetails, getOrderViaDetails, getCompanyName, getFinancialYear, updateComplaintsTimeLineHelper } = require('../helpers/general')


const addComplaintType = async (req, res) => {
    try {
        const { energy_company_id, zone_id, ro_id, sale_area_id, district_id, outlet_id, complaint_type, description, order_by_id, order_via_id, work_permit, complaint_for } = req.body;

        const { error } = complaintTypeValidations.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }
        const formatZoneId = JSON.stringify(zone_id)
        const formatRoId = JSON.stringify(ro_id)
        const formatSaleAreaId = JSON.stringify(sale_area_id)
        const formatDistrictId = JSON.stringify(district_id)
        const formatOutletId = JSON.stringify(outlet_id)

        const loggedUserId = req.user.user_id;
        const user_type = req.user.user_type;

        //----------get last complaint unique id from database------------------------
        const complaint_unique_id = await complaintUniqueIdFormatted(energy_company_id, complaint_for);
        const insertQuery = `INSERT INTO complaints (energy_company_id, zone_id, ro_id, sale_area_id, district_id, outlet_id, complaint_unique_id, complaint_type, description, created_by, order_by_id, order_via_id, work_permit, complaint_for) VALUES ('${energy_company_id}', '${formatZoneId}', '${formatRoId}', '${formatSaleAreaId}', '${formatDistrictId}', '${formatOutletId}', '${complaint_unique_id}', '${complaint_type}',  '${description}', '${loggedUserId}','${order_by_id}', '${order_via_id}', '${work_permit}', '${complaint_for}')`;

        
        await db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });
            const complaints_id = result.insertId;
            if (complaints_id > process.env.VALUE_ZERO) {
                const roleDetials = await roleById(user_type);
                const getUserName = await getCreatedUserNameFromAdmin(loggedUserId);
                var title = "Complaint Created.";
                var remark = `New Complaint created by ${roleDetials.name}.`;
                await complaintsTimeLineHelper(complaints_id, title, remark, user_type, 'created', loggedUserId, null);
                res.status(200).json({ status: true, message: "Complaint Type Added successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        });

    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const getAllComplaintTypes = async (req, res) => {

    try {
        const todayDate = moment().format('YYYY-MM-DD');
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        var finalData = [];
        var total = 0;
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value = `complaints.complaint_type LIKE '%${searchData}%' AND`;
        }

        // ------------ all new request --------------
        var selectQuery_all_new = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        LEFT JOIN admins ON complaints.status_changed_by = admins.id
        LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
        WHERE ${search_value} date(complaints.created_at) = "${todayDate}" ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const allNewComplaints = await db.query(selectQuery_all_new);
        var all_length = allNewComplaints.length;
        totalPages = Math.round((all_length / pageSize));
        var pageStartResult = (currentPage - 1) * pageSize + 1;
        var pageEndResult = Math.min(currentPage * pageSize, total);
        var pageDetails = [];
        pageDetails.push({ pageSize, currentPage, totalPages, all_length, pageStartResult, pageEndResult });

        if (allNewComplaints.length > process.env.VALUE_ZERO) {
            for (let index = 0; index < all_length; index++) {
                const element = allNewComplaints[index];

                const selectedZones = await getZoneNameById(element.zone_id);
                const selectedRegionalOffices = await getRegionalNameById(element.ro_id);
                const selectedSaleAreas = await getSaleAreaNameById(element.sale_area_id);
                const selectedDistricts = await getDistrictById(element.district_id);
                const selectedOutlets = await getOutletById(element.outlet_id);

                allNewComplaints[index].complaint_create_date = moment(element.created_at).format('YYYY-MM-DD');
                allNewComplaints[index].zones = selectedZones;
                allNewComplaints[index].regionalOffices = selectedRegionalOffices;
                allNewComplaints[index].saleAreas = selectedSaleAreas;
                allNewComplaints[index].districts = selectedDistricts;
                allNewComplaints[index].outlets = selectedOutlets;
            }
        }
        finalData.push({
            all_new_complaints: {
                data: allNewComplaints,
                pageDetails: pageDetails[0]
            }
        });

        // ------------ all pending request --------------
        var select_pending_query = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        LEFT JOIN admins ON complaints.status_changed_by = admins.id LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
        WHERE ${search_value} complaints.status='1' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const allPendingComplaints = await db.query(select_pending_query);
        var all_length = allPendingComplaints.length;
        totalPages = Math.round((all_length / pageSize));
        var pageStartResult = (currentPage - 1) * pageSize + 1;
        var pageEndResult = Math.min(currentPage * pageSize, total);
        var pageDetails = [];
        pageDetails.push({ pageSize, currentPage, totalPages, all_length, pageStartResult, pageEndResult });

        if (allPendingComplaints.length > process.env.VALUE_ZERO) {
            for (let index = 0; index < all_length; index++) {
                const element = allPendingComplaints[index];

                const selectedZones = await getZoneNameById(element.zone_id);
                const selectedRegionalOffices = await getRegionalNameById(element.ro_id);
                const selectedSaleAreas = await getSaleAreaNameById(element.sale_area_id);
                const selectedDistricts = await getDistrictById(element.district_id);
                const selectedOutlets = await getOutletById(element.outlet_id);

                allPendingComplaints[index].complaint_create_date = moment(element.created_at).format('YYYY-MM-DD');
                allPendingComplaints[index].zones = selectedZones;
                allPendingComplaints[index].regionalOffices = selectedRegionalOffices;
                allPendingComplaints[index].saleAreas = selectedSaleAreas;
                allPendingComplaints[index].districts = selectedDistricts;
                allPendingComplaints[index].outlets = selectedOutlets;
            }
        }
        finalData.push({
            all_pending_complaints: {
                data: allPendingComplaints,
                pageDetails: pageDetails[0]
            }
        });

        // ------------ all approved request --------------
        var select_approved_query = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
         LEFT JOIN admins ON complaints.status_changed_by = admins.id
         LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
         WHERE ${search_value} complaints.status='3' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        const allApprovedComplaints = await db.query(select_approved_query);

        var all_length = allApprovedComplaints.length;
        totalPages = Math.round((all_length / pageSize));
        var pageStartResult = (currentPage - 1) * pageSize + 1;
        var pageEndResult = Math.min(currentPage * pageSize, total);
        var pageDetails = [];
        pageDetails.push({ pageSize, currentPage, totalPages, all_length, pageStartResult, pageEndResult });

        if (allApprovedComplaints.length > process.env.VALUE_ZERO) {
            let all_length = allApprovedComplaints.length;
            totalPages = Math.round((all_length / pageSize));
            const pageStartResult = (currentPage - 1) * pageSize + 1;
            const pageEndResult = Math.min(currentPage * pageSize, total);
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, totalPages, all_length, pageStartResult, pageEndResult });
            for (let index = 0; index < all_length; index++) {
                const element = allApprovedComplaints[index];

                const selectedZones = await getZoneNameById(element.zone_id);
                const selectedRegionalOffices = await getRegionalNameById(element.ro_id);
                const selectedSaleAreas = await getSaleAreaNameById(element.sale_area_id);
                const selectedDistricts = await getDistrictById(element.district_id);
                const selectedOutlets = await getOutletById(element.outlet_id);

                allApprovedComplaints[index].complaint_create_date = moment(element.created_at).format('YYYY-MM-DD');
                allApprovedComplaints[index].zones = selectedZones;
                allApprovedComplaints[index].regionalOffices = selectedRegionalOffices;
                allApprovedComplaints[index].saleAreas = selectedSaleAreas;
                allApprovedComplaints[index].districts = selectedDistricts;
                allApprovedComplaints[index].outlets = selectedOutlets;
            }
        }
        finalData.push({
            all_approved_complaints: {
                data: allApprovedComplaints,
                pageDetails: pageDetails[0]
            }
        });


        // ------------ all rejected request --------------
        var select_rejected_query = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
         LEFT JOIN admins ON complaints.status_changed_by = admins.id
         LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
         WHERE ${search_value} complaints.status='4' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const allRejectedComplaints = await db.query(select_rejected_query);

        var all_length = allRejectedComplaints.length;
        totalPages = Math.round((all_length / pageSize));
        var pageStartResult = (currentPage - 1) * pageSize + 1;
        var pageEndResult = Math.min(currentPage * pageSize, total);
        var pageDetails = [];
        pageDetails.push({ pageSize, currentPage, totalPages, all_length, pageStartResult, pageEndResult });

        if (allRejectedComplaints.length > process.env.VALUE_ZERO) {
            let all_length = allRejectedComplaints.length;
            totalPages = Math.round((all_length / pageSize));
            const pageStartResult = (currentPage - 1) * pageSize + 1;
            const pageEndResult = Math.min(currentPage * pageSize, total);
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, totalPages, all_length, pageStartResult, pageEndResult });
            for (let index = 0; index < all_length; index++) {
                const element = allRejectedComplaints[index];

                const selectedZones = await getZoneNameById(element.zone_id);
                const selectedRegionalOffices = await getRegionalNameById(element.ro_id);
                const selectedSaleAreas = await getSaleAreaNameById(element.sale_area_id);
                const selectedDistricts = await getDistrictById(element.district_id);
                const selectedOutlets = await getOutletById(element.outlet_id);

                allRejectedComplaints[index].complaint_create_date = moment(element.created_at).format('YYYY-MM-DD');
                allRejectedComplaints[index].zones = selectedZones;
                allRejectedComplaints[index].regionalOffices = selectedRegionalOffices;
                allRejectedComplaints[index].saleAreas = selectedSaleAreas;
                allRejectedComplaints[index].districts = selectedDistricts;
                allRejectedComplaints[index].outlets = selectedOutlets;
            }
        }
        finalData.push({
            all_rejected_complaints: {
                data: allRejectedComplaints,
                pageDetails: pageDetails[0]
            }
        });


        // ------------ all resolved request --------------
        var select_resolved_query = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
         LEFT JOIN admins ON complaints.status_changed_by = admins.id
         LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
         WHERE ${search_value} complaints.status='5' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const allResolvedComplaints = await db.query(select_resolved_query);

        var all_length = allResolvedComplaints.length;
        totalPages = Math.round((all_length / pageSize));
        var pageStartResult = (currentPage - 1) * pageSize + 1;
        var pageEndResult = Math.min(currentPage * pageSize, total);
        var pageDetails = [];
        pageDetails.push({ pageSize, currentPage, totalPages, all_length, pageStartResult, pageEndResult });

        if (allResolvedComplaints.length > process.env.VALUE_ZERO) {
            let all_length = allResolvedComplaints.length;
            totalPages = Math.round((all_length / pageSize));
            const pageStartResult = (currentPage - 1) * pageSize + 1;
            const pageEndResult = Math.min(currentPage * pageSize, total);
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, totalPages, all_length, pageStartResult, pageEndResult });
            for (let index = 0; index < all_length; index++) {
                const element = allResolvedComplaints[index];

                const selectedZones = await getZoneNameById(element.zone_id);
                const selectedRegionalOffices = await getRegionalNameById(element.ro_id);
                const selectedSaleAreas = await getSaleAreaNameById(element.sale_area_id);
                const selectedDistricts = await getDistrictById(element.district_id);
                const selectedOutlets = await getOutletById(element.outlet_id);

                allResolvedComplaints[index].complaint_create_date = moment(element.created_at).format('YYYY-MM-DD');
                allResolvedComplaints[index].zones = selectedZones;
                allResolvedComplaints[index].regionalOffices = selectedRegionalOffices;
                allResolvedComplaints[index].saleAreas = selectedSaleAreas;
                allResolvedComplaints[index].districts = selectedDistricts;
                allResolvedComplaints[index].outlets = selectedOutlets;
            }
        }
        finalData.push({
            all_resoved_complaints: {
                data: allResolvedComplaints,
                pageDetails: pageDetails[0]
            }
        });

        res.status(200).json({ status: true, message: "Complaint Types fetched successfully", data: finalData });
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const getComplaintTypeById = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) return res.status(400).json({ status: false, message: error.message })

        const selectQuery = `SELECT complaints.*,  complaint_types.complaint_type_name  FROM complaints INNER JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE complaints.id = '${id}'`;

        db.query(selectQuery, async (err, result) => {

            if (err) return res.status(500).json({ status: false, message: err });
            if (result.length > process.env.VALUE_ZERO) {
                var values = [];

                for (const row of result) {
                    const selectedEnergyCompany = await getEnergyCompaniesById(row.energy_company_id);
                    const selectedZones = await getZoneNameById(row.zone_id)
                    const selectedRegionalOffices = await getRegionalNameById(row.ro_id)
                    const selectedSaleAreas = await getSaleAreaNameById(row.sale_area_id)
                    const selectedDistricts = await getDistrictById(row.district_id)
                    const selectedOutlets = await getOutletById(row.outlet_id)
                    const timeline = await getComplaintTimeline(row.id);

                    const getOrderByDetails = await getUserDetails(row.order_by_id);
                    const orderViaDetails = await getOrderViaDetails(row.order_via_id);

                    values.push({
                        id: row.id,
                        energy_company_id: row.energy_company_id,
                        complaint_unique_id: row.complaint_unique_id,
                        energy_company_name: selectedEnergyCompany.name ? selectedEnergyCompany.name : null,
                        ec_name: row.ec_name,
                        complaint_type: row.complaint_type,
                        complaint_type_name: row.complaint_type_name,
                        complaint_for: row.complaint_for,
                        description: row.description,
                        status: row.status,
                        complaint_create_date: moment(row.created_at).format('YYYY-MM-DD'),
                        zones: selectedZones,
                        regionalOffices: selectedRegionalOffices,
                        saleAreas: selectedSaleAreas,
                        districts: selectedDistricts,
                        outlets: selectedOutlets,
                        order_by: getOrderByDetails[0].name,
                        order_via_id: row.order_via_id,
                        order_via: orderViaDetails.order_via,
                        timeline: timeline
                    })
                }
                res.status(200).json({ status: true, message: "Complaint Type fetched successfully", data: values[0] });
            }
            else {
                return res.status(400).json({ status: false, message: "Data not found" });
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const updateComplaintType = async (req, res) => {

    try {
        const { energy_company_id, zone_id, ro_id, sale_area_id, district_id, outlet_id, complaint_type, description, id, order_via_id, order_by_id, work_permit } = req.body;

        const { error } = complaintTypeValidations.validate(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.message });
        }

        const formatZoneId = JSON.stringify(zone_id)
        const formatRoId = JSON.stringify(ro_id)
        const formatSaleAreaId = JSON.stringify(sale_area_id)
        const formatDistrictId = JSON.stringify(district_id)
        const formatOutletId = JSON.stringify(outlet_id)
        const loggedUserId = req.user.user_id;
        const user_type = req.user.user_type;

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const updateQuery = `UPDATE complaints SET energy_company_id = '${energy_company_id}', zone_id = '${formatZoneId}', ro_id = '${formatRoId}', sale_area_id = '${formatSaleAreaId}', district_id= '${formatDistrictId}', outlet_id = '${formatOutletId}', complaint_type = '${complaint_type}', description='${description}', updated_at = '${updatedAt}', order_by_id='${order_by_id}', order_via_id='${order_via_id}', work_permit = '${work_permit}' WHERE id = '${id}'`;
        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                const roleDetails = await roleById(user_type);
                const getUserName = await getCreatedUserNameFromAdmin(loggedUserId);
                var title = "Complaint Updated.";
                var remark = `Complaint updated by ${roleDetails.name}.`;
                await complaintsTimeLineHelper(id, title, remark, user_type, loggedUserId, 'updated', null);
                return res.status(200).json({ status: true, message: "Complaint Type Updated successfully" });
            }
            else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const updateComplaintStatus = async (req, res) => {

    try {
        const { id, status, rejected_remark } = req.body;
        const todayDate = moment().format('YYYY-MM-DD HH:mm:ss');
        const { error } = checkPositiveInteger.validate({ id: id })
        if (error) return res.status(403).json({ status: false, message: error.message })
        var status_cond = "";
        var complaintStatus = '';
        var complaintTimelineStatus = 'pending';
        let user_type = req.user.user_type;
        let status_changed_by = req.user.user_id;

        const roleDetials = await roleById(user_type);
        const getUserName = await getCreatedUserNameFromAdmin(status_changed_by);
        //let user_type = 3;
        var notificationData = [];

        if (status == 1) {
            complaintStatus = 'Pending'
            status_cond = `status_changed_by = '${status_changed_by}', status_changed_on='${todayDate}'`;
        }
        else if (status == 2) {
            const complaints_approval = await db.query(`SELECT complaints_approval_by FROM complaints WHERE id='${id}'`);
            if (complaints_approval.length > 0) {
                if (complaints_approval[0].complaints_approval_by != user_type) {
                    return res.status(400).json({ status: false, message: "You are not allowed to approve these complaints." });
                }
            }

            const previous_complaints = await db.query(`SELECT id, status FROM complaints WHERE id < ${id} ORDER BY id DESC LIMIT 1;`);
            if (previous_complaints.length > 0) {
                if (previous_complaints[0].status == 1) {
                    return res.status(400).json({ status: false, message: "First approved previous complaints" });
                }
            }
            complaintStatus = 'approved';
            complaintTimelineStatus = "approved";
            status_cond = `status_changed_by = '${status_changed_by}', status_changed_on='${todayDate}'`;


            notificationData.push({
                "complaint_id": id,
                "title": "Compaints Approved.",
                "remark": `This complaint was approved by the ${roleDetials.name} ${getUserName[0].name} and auto-assigned to this ${roleDetials.name}.`,
                "user_type": user_type,
                "user_id": status_changed_by
            });
        }
        else if (status == 3) {
            notificationData.push({
                "complaint_id": id,
                "title": "Compaints Working.",
                "remark": `This complaint assigned to sub user by ${roleDetials.name} ${getUserName[0].name}.`,
                "user_type": user_type,
                "user_id": status_changed_by
            });
            complaintStatus = 'Working';
            complaintTimelineStatus = "approved";
            status_cond = `complaints_approval_by = '${status_changed_by}', status_changed_by = '${status_changed_by}', status_changed_on='${todayDate}'`;
        }
        else if (status == 4) {
            notificationData.push({
                "complaint_id": id,
                "title": "Compaints Rejected.",
                "remark": `This complaint rejected by ${roleDetials.name} ${getUserName[0].name}.`,
                "user_type": user_type,
                "user_id": status_changed_by,
                "rejected_remark": rejected_remark + ` (${getUserName[0].name})`
            });
            complaintStatus = 'Rejected';
            complaintTimelineStatus = "rejected";
            status_cond = `complaints_approval_by = '${status_changed_by}', status_changed_by = '${status_changed_by}', status_changed_on='${todayDate}'`;
        }
        else if (status == 5) {
            notificationData.push({
                "complaint_id": id,
                "title": "Complaints Done.",
                "remark": `This complaint done by ${roleDetials.name} ${getUserName.name}.`,
                "user_type": user_type,
                "user_id": status_changed_by
            });

            complaintStatus = 'Done';
            complaintTimelineStatus = "done";
            status_cond = `resolved_by = '${status_changed_by}', resolved_on='${todayDate}'`;
        }

        const updateQuery = `UPDATE complaints SET status='${status}' , ${status_cond}, rejected_remark ='${rejected_remark}' WHERE id='${id}'`;
        const queryResult = await db.query(updateQuery)
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            await complaintsTimeLineHelper(notificationData[0].complaint_id, notificationData[0].title, notificationData[0].rejected_remark, notificationData[0].user_type, complaintTimelineStatus, status_changed_by);
            res.status(200).json({
                status: true, message: "Complaint status change to " + complaintStatus
                    + " successfully"
            })
        }
        else {
            return res.status(400).json({ status: false, message: "Error! complaint status not changed" })
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const complaintFlitter = async (req, res) => {
    try {
        const { custom_date, regional_id, zone_id, status, complaint_status } = req.body;
        var where_cond = "";
        var finalData = [];
        if (custom_date != "") {
            var formattedDate = moment(custom_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            where_cond = `AND date(complaints.created_at) = "${formattedDate}"`;
        }
        var select_filter_query = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        LEFT JOIN admins ON complaints.status_changed_by = admins.id
        LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
        WHERE complaints.status="${complaint_status}" AND energy_companies.status='${status}' ${where_cond}  ORDER BY complaints.id DESC`;

        con.query(select_filter_query, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: error });
            if (result.length > 0) {
                const filteredArray = result.filter(item => {
                    const zoneId = JSON.parse(item.zone_id)[0];
                    const roId = JSON.parse(item.ro_id)[0];
                    if (regional_id > 0 && zone_id == 0) {
                        return roId == regional_id;
                    } else if (regional_id == 0 && zone_id > 0) {
                        return zoneId == zone_id;
                    } else {
                        return zoneId == zone_id && roId == regional_id;
                    }
                });
                return res.status(200).json({ status: true, message: "Record Found", data: filteredArray });
            } else {
                return res.status(400).json({ status: false, message: "No Record Found", data: result });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const allNewComplaints = async (req, res) => {
    try {
        const { regional_id, zone_id } = req.body;
        const todayDate = moment().format('YYYY-MM-DD');
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';

        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(id) as total FROM complaints WHERE date(created_at)= "${todayDate}" and status="1"`;
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;

        const pageFirstResult = (currentPage - 1) * pageSize;


        var search_value = "";
        if (searchData != null && searchData != '') {
            search_value = `complaint_types.complaint_type_name LIKE '%${searchData}%' AND`;
        }
        var selectQuery_all_new = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        LEFT JOIN admins ON complaints.status_changed_by = admins.id
        LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
        WHERE ${search_value} date(complaints.created_at) = "${todayDate}"  AND energy_companies.status='1' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        const allNewComplaints = await db.query(selectQuery_all_new);

        if (allNewComplaints.length > process.env.VALUE_ZERO) {
            const allNewComplaintsFullData = await getcomplainsData(allNewComplaints);
            if (regional_id > 0 || zone_id > 0) {
                if (allNewComplaintsFullData.length > 0) {
                    const filteredArray = allNewComplaintsFullData.filter(item => {
                        const zoneId = JSON.parse(item.zone_id)[0];
                        const roId = JSON.parse(item.ro_id)[0];
                        if (regional_id > 0 && zone_id == 0) {
                            return roId == regional_id;
                        } else if (regional_id == 0 && zone_id > 0) {
                            return zoneId == zone_id;
                        } else {
                            return zoneId == zone_id && roId == regional_id;
                        }
                    });
                    if (filteredArray.length > 0) {

                        var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                        return res.status(200).json({ status: true, message: "Record Found", data: filteredArray });
                    } else {
                        return res.status(400).json({ status: false, message: "NO Record Found" });
                    }
                }
            } else {
                var all_length = total;
                var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                return res.status(200).json({ status: true, message: "Record Found", data: allNewComplaintsFullData, pageDetails: pageDetails[0] });
            }
        } else {
            return res.status(400).json({ status: false, message: "NO Record Found" });
        }

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const allPendingComplaints = async (req, res) => {
    try {
        const { custom_date, regional_id, zone_id } = req.body;
        var where_cond = "";
        if (custom_date != "") {
            var formattedDate = moment(custom_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            where_cond = `AND date(complaints.created_at) = "${formattedDate}"`;
        }
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';

        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(id) as total FROM complaints WHERE status= "1"`;
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value = `complaint_types.complaint_type_name LIKE '%${searchData}%' AND`;
        }

        var select_approved_query = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        LEFT JOIN admins ON complaints.status_changed_by = admins.id
        LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
        WHERE ${search_value} complaints.status='1' AND energy_companies.status='1' AND complaints.complaints_approval_by <= 0 ${where_cond} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const allApprovedComplaints = await db.query(select_approved_query);

        if (allApprovedComplaints.length > process.env.VALUE_ZERO) {
            const allApprovedComplaintsFullData = await getcomplainsData(allApprovedComplaints);
            if (regional_id > 0 || zone_id > 0) {
                if (allApprovedComplaintsFullData.length > 0) {
                    const filteredArray = allApprovedComplaintsFullData.filter(item => {
                        const zoneId = JSON.parse(item.zone_id)[0];
                        const roId = JSON.parse(item.ro_id)[0];
                        if (regional_id > 0 && zone_id == 0) {
                            return roId == regional_id;
                        } else if (regional_id == 0 && zone_id > 0) {
                            return zoneId == zone_id;
                        } else {
                            return zoneId == zone_id && roId == regional_id;
                        }
                    });
                    if (filteredArray.length > 0) {
                        var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                        return res.status(200).json({ status: true, message: "Record Found", data: filteredArray });
                    } else {
                        return res.status(400).json({ status: false, message: "NO Record Found" });
                    }
                }
            } else {
                var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                return res.status(200).json({ status: true, message: "Record Found", data: allApprovedComplaintsFullData, pageDetails: pageDetails[0] });
            }
        } else {
            return res.status(200).json({ status: false, message: "NO Record Found" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const allApprovedComplaints = async (req, res) => {
    try {
        const { custom_date, regional_id, zone_id } = req.body;
        var where_cond = "";
        if (custom_date != "") {
            var formattedDate = moment(custom_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            where_cond = ` AND date(complaints.created_at) = "${formattedDate}"`;
        }

        if (zone_id) {
            where_cond = ` AND FIND_IN_SET('[${zone_id}]', complaints.zone_id)`
        }

        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(id) as total FROM complaints WHERE status= "3"`;
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var search_value = "";
        if (searchData != null && searchData != '') {
            search_value = `complaint_types.complaint_type_name LIKE '%${searchData}%' OR energy_companies.name LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%' AND`;
        }

        var select_approved_query = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id
        LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        LEFT JOIN admins ON complaints.status_changed_by = admins.id
        LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
        WHERE ${search_value} complaints.status='3' AND energy_companies.status='1' ${where_cond} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        const allApprovedComplaints = await db.query(select_approved_query);

        if (allApprovedComplaints.length > process.env.VALUE_ZERO) {
            const allApprovedComplaintsFullData = await getcomplainsData(allApprovedComplaints);
            if (regional_id > 0 || zone_id > 0) {
                const filteredArray = allApprovedComplaintsFullData.filter(item => {
                    const zoneId = JSON.parse(item.zone_id)[0];
                    const roId = JSON.parse(item.ro_id)[0];
                    if (regional_id > 0 && zone_id > 0) {
                        return zoneId == zone_id && roId == regional_id;
                    } else if (regional_id > 0) {
                        return roId == regional_id;
                    } else if (zone_id > 0) {
                        return zoneId == zone_id;
                    }

                    return true;
                });

                if (filteredArray.length > 0) {
                    var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                    return res.status(200).json({ status: true, message: "Record Found", data: filteredArray, pageDetails: pageDetails[0] });
                } else {
                    return res.status(400).json({ status: false, message: "NO Record Found" });
                }
            } else {
                var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                return res.status(200).json({ status: true, message: "Record Found", data: allApprovedComplaintsFullData, pageDetails: pageDetails[0] });
            }
        } else {
            return res.status(400).json({ status: false, message: "No Record Found" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const allRejectedComplaints = async (req, res) => {
    try {
        const { custom_date, regional_id, zone_id } = req.body;
        var where_cond = "";
        if (custom_date != "") {
            var formattedDate = moment(custom_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            where_cond = `AND date(complaints.created_at) = "${formattedDate}"`;
        }

        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';

        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(id) as total FROM complaints WHERE status= "4"`;
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var search_value = "";
        if (searchData != null && searchData != '') {
            search_value = `complaint_types.complaint_type_name LIKE '%${searchData}%' AND`;
        }

        var select_rejected_query = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id
        LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        LEFT JOIN admins ON complaints.status_changed_by = admins.id
        LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
        WHERE ${search_value} complaints.status='4' AND energy_companies.status='1' ${where_cond} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const allRejectedComplaints = await db.query(select_rejected_query);

        if (allRejectedComplaints.length > process.env.VALUE_ZERO) {
            const allRejectedComplaintsFullData = await getcomplainsData(allRejectedComplaints);
            if (regional_id > 0 || zone_id > 0) {
                if (allRejectedComplaintsFullData.length > 0) {
                    const filteredArray = allRejectedComplaintsFullData.filter(item => {
                        const zoneId = JSON.parse(item.zone_id)[0];
                        const roId = JSON.parse(item.ro_id)[0];
                        if (regional_id > 0 && zone_id == 0) {
                            return roId == regional_id;
                        } else if (regional_id == 0 && zone_id > 0) {
                            return zoneId == zone_id;
                        } else {
                            return zoneId == zone_id && roId == regional_id;
                        }
                    });
                    if (filteredArray.length > 0) {
                        var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                        return res.status(200).json({ status: true, message: "Record Found", data: filteredArray });
                    } else {
                        return res.status(400).json({ status: false, message: "NO Record Found" });
                    }
                }
            } else {
                var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                return res.status(200).json({ status: true, message: "Record Found", data: allRejectedComplaintsFullData, pageDetails: pageDetails[0] });
            }
        } else {
            return res.status(400).json({ status: false, message: "NO Record Found" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const allResolvedComplaints = async (req, res) => {
    try {
        const { custom_date, regional_id, zone_id } = req.body;
        var where_cond = "";
        if (custom_date != "") {
            var formattedDate = moment(custom_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            where_cond = `AND date(complaints.created_at) = "${formattedDate}"`;
        }

        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';

        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(id) as total FROM complaints WHERE status= "5"`;
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var search_value = "";
        if (searchData != null && searchData != '') {
            search_value = `complaint_types.complaint_type_name LIKE '%${searchData}%' AND`;
        }
        var select_resolved_query = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id
        LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        LEFT JOIN admins ON complaints.status_changed_by = admins.id
        LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
        WHERE ${search_value} complaints.status='5' AND energy_companies.status='1' ${where_cond} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const allResolvedComplaints = await db.query(select_resolved_query);

        if (allResolvedComplaints.length > process.env.VALUE_ZERO) {
            const allResolvedComplaintsFullData = await getcomplainsData(allResolvedComplaints);
            if (regional_id > 0 || zone_id > 0) {
                if (allResolvedComplaintsFullData.length > 0) {
                    const filteredArray = allResolvedComplaintsFullData.filter(item => {
                        const zoneId = JSON.parse(item.zone_id)[0];
                        const roId = JSON.parse(item.ro_id)[0];
                        if (regional_id > 0 && zone_id == 0) {
                            return roId == regional_id;
                        } else if (regional_id == 0 && zone_id > 0) {
                            return zoneId == zone_id;
                        } else {
                            return zoneId == zone_id && roId == regional_id;
                        }
                    });
                    if (filteredArray.length > 0) {
                        var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                        return res.status(200).json({ status: true, message: "Record Found", data: filteredArray });
                    } else {
                        return res.status(400).json({ status: false, message: "NO Record Found" });
                    }
                }
            } else {
                var pageDetails = await calculatePageDetails(total, pageSize, currentPage, total);
                return res.status(200).json({ status: true, message: "Record Found", data: allResolvedComplaintsFullData, pageDetails: pageDetails[0] });
            }
        } else {
            return res.status(400).json({ status: false, message: "NO Record Found" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

async function getcomplainsData(allComplaints) {
    var all_length = allComplaints.length;
    for (let index = 0; index < all_length; index++) {
        const element = allComplaints[index];

        const selectedZones = await getZoneNameById(element.zone_id);
        const selectedRegionalOffices = await getRegionalNameById(element.ro_id);
        const selectedSaleAreas = await getSaleAreaNameById(element.sale_area_id);
        const selectedDistricts = await getDistrictById(element.district_id);
        const selectedOutlets = await getOutletById(element.outlet_id);

        allComplaints[index].complaint_create_date = moment(element.created_at).format('YYYY-MM-DD');
        allComplaints[index].zones = selectedZones;
        allComplaints[index].regionalOffices = selectedRegionalOffices;
        allComplaints[index].saleAreas = selectedSaleAreas;
        allComplaints[index].districts = selectedDistricts;
        allComplaints[index].outlets = selectedOutlets;
        allComplaints[index].timeline = await getComplaintTimeline(element.id);
    }
    return allComplaints;
}

async function calculatePageDetails(total, pageSize, currentPage, total) {
    let totalPages = Math.round((total / pageSize));
    let pageStartResult = (currentPage - 1) * pageSize + 1;
    let pageEndResult = Math.min(currentPage * pageSize, total);
    let pageDetails = [];
    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
    return pageDetails;
}

const complaintAssignTo = async (req, res) => {
    try {
        const { complaint_id, assigned_to_id } = req.body;
        const user_id = req.user.user_id;
        const user_type = req.user.user_type;

        var updateQuery = "";
        if (user_type == process.env.SUPER_ADMIN_ROLE_ID) {
            updateQuery = `UPDATE complaints SET assign_to_contractor='${assigned_to_id}', assign_by_superadmin='${user_id}' WHERE id='${complaint_id}'`;
        } else {
            updateQuery = `UPDATE complaints SET assign_to_user='${assigned_to_id}',
            assigned_by_contractor='${user_id}' WHERE id='${complaint_id}'`;
        }
        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Complaint Assigned successfully" });
            } else {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later" });
            }
        })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const getApprovelList = async (req, res) => {
    try {
        const result = await db.query(`SELECT id,name FROM roles WHERE id IN(2,3,4)`);
        if (result.length > 0) {
            return res.status(200).json({ status: true, data: result, message: "Successful" });
        } else {
            return res.status(400).json({ status: false, data: result, message: "Unsuccessfull" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

// complaint approval settings changed by rahul
const setComplaintApproval = async (req, res) => {

    try {
        const { complaint_list, role_id } = req.body;
        const created_by = req.user.user_id;

        //get if already exists complaint approval

        const data = await db.query(`SELECT * FROM complaint_approval_settings`);
        if (data.length > process.env.VALUE_ZERO) {
            const deletePreviousApproval = await db.query(`DELETE FROM complaint_approval_settings`)
        }

        const insertNewApprovalSettings = await db.query(`INSERT INTO complaint_approval_settings (approved_by, created_by) VALUES('${role_id}', '${created_by}')`)

        return res.status(200).json({ status: true, message: "Approval set successfully" });
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const setComplaintApprovalOld = async (req, res) => {
    try {
        const { complaint_list, role_id } = req.body;
        const user_id = req.user.user_id;
        const user_type = req.user.user_type;
        const roleDetials = await roleById(role_id);
        const roleDetialsData = await roleById(user_type);
        if (complaint_list.length > 0) {
            for (let index = 0; index < complaint_list.length; index++) {
                const element = complaint_list[index];
                var title = "Compaints Approval Set.";
                var remark = `This complaint will be approved by any ${roleDetials.name} and this permission set by the ${roleDetialsData.name}.`;
                await complaintsTimeLineHelper(element, title, remark, user_type, 'approval set', user_id);
                await db.query(`UPDATE complaints SET complaints_approval_by='${role_id}' WHERE id='${element}'`);
            }
        }
        return res.status(200).json({ status: true, message: "Approvel set successfully" });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const notApprovalSetComplaint = async (req, res) => {
    try {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        var search_value = "";
        if (searchData != null && searchData != '') {
            search_value = `complaint_types.complaint_type_name LIKE '%${searchData}%' AND`;
        }
        var selectQuery_all_new = `SELECT complaints.*, energy_companies.name as ec_name, complaint_types.complaint_type_name, admins.name as status_changed_by_name, admins_new.name as resolved_by_name FROM complaints LEFT JOIN energy_companies ON energy_companies.id=complaints.energy_company_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type
        LEFT JOIN admins ON complaints.status_changed_by = admins.id
        LEFT JOIN admins as admins_new ON complaints.resolved_by = admins_new.id
        WHERE ${search_value} complaints.complaints_approval_by="0" ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        const allNewComplaints = await db.query(selectQuery_all_new);
        const modifiedQueryString = selectQuery_all_new.substring(0, selectQuery_all_new.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (allNewComplaints.length > process.env.VALUE_ZERO) {
            for (let index = 0; index < allNewComplaints.length; index++) {
                const element = allNewComplaints[index];
                allNewComplaints[index].timeline = await getComplaintTimeline(element.id);
            }
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(200).json({ status: true, message: "Record Found", data: allNewComplaints, pageDetails: pageDetails });
        } else {
            return res.status(400).json({ status: true, message: "NO Record Found" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

async function complaintUniqueIdFormatted(energy_company_id, complaint_for) {

    const companyId = energy_company_id.toString().padStart(2, '0')

    const dbCompanyName = await getCompanyName(energy_company_id, complaint_for)
    // get the 3 character of company name
    // const charactersOfCompanyName= (dbCompanyName.substring(0,3)).toUpperCase()
    const trimmedDbCompanyName = dbCompanyName.trim();
    const charactersOfCompanyName = (trimmedDbCompanyName.substring(0, 3)).toUpperCase();

    // get the current financial years
    const financialYears = await getFinancialYear()

    const complaintPrefix = charactersOfCompanyName + companyId + financialYears;
    let prefix; // Declare the prefix variable outside the if-else blocks

    if (complaint_for == 1) {
        prefix = complaintPrefix + 'EC' + '00';
    } else {
        prefix = complaintPrefix + 'OC' + '00';
    }

    const padLength = 2;

    const dbLastComplaintUniqueId = await getDbLastComplaintUniqueId(energy_company_id, complaint_for);
    // Extract the numeric part of the previous complaint ID
    const latestComplaintNumericNumber = parseInt(dbLastComplaintUniqueId.substring(prefix.length)) || 0;
    // Increment the latest complaint ID by 1, ensuring a minimum value of 10
    const nextComplaintID = latestComplaintNumericNumber + 1;
    // Generate the padded number using toString(10) for consistent padding
    const paddedNumber = nextComplaintID.toString(10).padStart(padLength, '0');
    // Construct the unique complaint ID
    const complaintUniqueId = prefix + paddedNumber;
    return complaintUniqueId;
}

/**
 * get complaints data using id for edit complaints.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getComplaintsById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query(`SELECT * FROM complaints WHERE id="${id}";`);
        if (result.length > 0) {
            return res.status(200).json({ status: true, data: result, message: "Successful" });
        } else {
            return res.status(400).json({ status: false, data: result, message: "Unsuccessfull" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

module.exports = { addComplaintType, getAllComplaintTypes, getComplaintTypeById, updateComplaintType, updateComplaintStatus, complaintFlitter, allNewComplaints, allPendingComplaints, allApprovedComplaints, allRejectedComplaints, allResolvedComplaints, complaintAssignTo, getApprovelList, setComplaintApproval, notApprovalSetComplaint, getComplaintsById }


