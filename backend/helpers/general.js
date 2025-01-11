const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger } = require('./validation');
const { StatusCodes } = require('http-status-codes');
const moment = require('moment');
// Load the full build.
var _ = require('lodash');
const { json } = require("express");
const crypto = require('crypto');
const { func } = require("joi");


async function getAllStoredActiveRoles() {

    try {
        const queryResult = await db.query(`SELECT * FROM roles WHERE status = '1'`);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return { status: true, data: queryResult };
        }
        else {
            return { status: false, data: [] };
        }

    } catch (error) {
        return error.message;
    }
}
async function getTeamMemberList(parent_id) {
    const sql = `SELECT teams.user_id, teams.id, users.name FROM teams LEFT JOIN users on teams.user_id = users.id WHERE teams.parent_id='${parent_id}'`;
    return await db.query(sql);
}

async function getTeamMemberOnId(memberIds, search = null) {
    const teamMembersId = JSON.parse(memberIds)
    let sql;

    if (search != null && search != '') {
        sql = `SELECT id, name, image, mobile, email, employee_id, role_id FROM users WHERE (id IN(${teamMembersId.team_member})) AND (name LIKE '%${search}%' OR employee_id LIKE '%${search}%' )`
    }
    else {
        sql = `SELECT id, name, image, mobile, email, employee_id, role_id FROM users WHERE id IN(${teamMembersId.team_member})`
    }
    return await db.query(sql)
}

async function getSubModule(module_id) {
    const sql = `SELECT * FROM sub_modules WHERE module_id='${module_id}'`;
    return await db.query(sql);
}

async function getSubModuleWithSubModules(module_id) {
    const sql = `SELECT * FROM sub_modules WHERE module_id='${module_id}' AND status = '1'`;
    const sqlResult = await db.query(sql);
    const final = sqlResult.map(async (row) => {
        return {
            ...row,
            modulesOfSubModule: await db.query(`SELECT * FROM module_of_sub_modules WHERE sub_module_id = '${row.id}' AND status = '1'`)
        }
    });
    const values = await Promise.all(final);
    return values;
}

async function getZoneNameById(zone_id) {
    const zoneId = JSON.parse(zone_id)
    var sql = '';
    if (typeof zoneId == 'object') {
        const commaSeparated = zoneId.join(",");
        sql = `SELECT zone_id, zone_name FROM zones WHERE zone_id IN(${commaSeparated})`
    }
    else {
        sql = `SELECT zone_name FROM zones WHERE zone_id='${zone_id}'`;
    }

    return await db.query(sql);
}

async function getZoneUsers(zone_id) {
    const sql = `SELECT users.id as users_id, users.name as user_name,users.zone_id, zones.zone_name as zone_name, users.regional_id, users.sale_area_id, roles.name as user_type FROM zones LEFT JOIN users ON users.zone_id=zones.zone_id INNER JOIN roles ON roles.id=users.user_type WHERE users.zone_id='${zone_id}' AND users.user_id IS NULL`
    return await db.query(sql);
}

async function getZoneSubUsers(zone_id, user_id) {
    const sql = `SELECT users.id as users_id, users.name as user_name,users.zone_id, users.image, users.joining_date, zones.zone_name as zone_name, roles.name as user_type FROM zones LEFT JOIN users ON users.zone_id=zones.zone_id INNER JOIN roles ON roles.id=users.user_type WHERE users.zone_id='${zone_id}' AND users.user_id='${user_id}'`

    return await db.query(sql);
}

async function getReginalOfficeUsers(regional_id) {
    const sql = `SELECT users.id as user_id, users.name as user_name, users.zone_id, users.regional_id, regional_offices.regional_office_name, users.sale_area_id, roles.name as user_type FROM regional_offices LEFT JOIN users ON users.regional_id=regional_offices.id INNER JOIN roles ON roles.id=users.user_type WHERE users.regional_id='${regional_id}'  AND users.user_id IS NULL`
    return await db.query(sql);
}

async function getRegionalOfficeSubUsers(regional_id, user_id) {
    const sql = `SELECT users.id as user_id, users.name as user_name, users.zone_id, users.regional_id, regional_offices.regional_office_name, users.sale_area_id, roles.name as user_type FROM regional_offices LEFT JOIN users ON users.regional_id=regional_offices.id INNER JOIN roles ON roles.id=users.user_type WHERE users.regional_id='${regional_id}' AND users.user_id='${user_id}'`
    return await db.query(sql);
}


async function getSaleAreaUsers(sale_area_id) {
    const sql = `SELECT users.id as user_id, users.name as user_name, users.zone_id, users.regional_id, sales_area.sales_area_name, roles.name as user_type FROM sales_area LEFT JOIN users ON users.sale_area_id=sales_area.id INNER JOIN roles ON roles.id=users.sale_area_id WHERE sales_area.id='${sale_area_id}'`
    return await db.query(sql);
}

async function getSaleAreaSubUsers(sale_area_id, user_id) {

    const sql = `SELECT users.id as user_id, users.name as user_name, users.zone_id, users.regional_id, users.sale_area_id, users.image, users.joining_date, sales_area.sales_area_name, roles.name as user_type FROM sales_area LEFT JOIN users ON users.sale_area_id=sales_area.id INNER JOIN roles ON roles.id=users.user_type WHERE users.sale_area_id='${sale_area_id}'AND users.user_id='${user_id}' `
    return await db.query(sql);
}

async function getRegionalNameById(regional_id) {
    const regionalId = JSON.parse(regional_id)
    var sql = '';
    if (typeof regionalId == 'object') {
        const commaSeparated = regionalId.join(",");
        sql = `SELECT id, regional_office_name FROM regional_offices WHERE id IN('${commaSeparated}')`
    }
    else {
        sql = `SELECT id, regional_office_name FROM regional_offices WHERE id='${regional_id}'`;
    }

    return await db.query(sql);
}

async function getSaleAreaNameById(sale_area_id) {
    const saleAreaId = JSON.parse(sale_area_id)
    var sql = '';
    if (typeof saleAreaId == 'object') {
        const commaSeparated = saleAreaId.join(",");
        sql = `SELECT id , sales_area_name FROM sales_area WHERE id IN('${commaSeparated}')`
    }
    else {
        sql = `SELECT id as id, sales_area_name FROM sales_area WHERE id='${sale_area_id}'`;
    }

    return await db.query(sql);
}

async function getOrderById(order_by_id) {
    const orderById = JSON.parse(order_by_id)
    var sql = '';
    if (typeof orderById == 'object') {
        const commaSeparated = orderById.join(",");
        sql = `SELECT id , name FROM users WHERE id IN(${commaSeparated})`
    }
    else {
        sql = `SELECT id , name FROM users WHERE id='${order_by_id}'`;
    }

    return await db.query(sql);
}


async function getDistrictById(district_id, sale_area_id) {
    const districtId = JSON.parse(district_id);
    var sql = '';
    if (Array.isArray(districtId) && districtId.some(e => e !== null)) {
        // Code for when districtId is a non-empty array with non-null elements
        const commaSeparated = districtId.join(",");
        sql = `SELECT id as district_id, district_name FROM districts WHERE id IN (${commaSeparated})`;
    } else {
        // Code for when districtId is not an array or is an empty array or has only null elements
        sql = `SELECT id as district_id, district_name FROM districts WHERE id='${sale_area_id}'`;
    }
    return await db.query(sql);
}


async function getOutletById(outlet_id) {
    const outletId = JSON.parse(outlet_id);
    var sql = '';
    if (typeof outletId == 'object') {
        const commaSeparated = outletId.join(",");
        sql = `SELECT id, outlet_unique_id, outlet_name FROM outlets WHERE id IN('${commaSeparated}')`
    }
    else {
        sql = `SELECT id, outlet_unique_id, outlet_name FROM outlets WHERE id='${outlet_id}'`;
    }
    
    const result = await db.query(sql);

    if (result.length > process.env.VALUE_ZERO) {
        return result;
    }
    else {
        return [{ outlet_name: '', outlet_id: '' }];
    }
}

async function getUsersById(admin_id) {
    const sql = `SELECT * FROM users WHERE admin_id='${admin_id}'`;
    return await db.query(sql);
}

async function getContractorUsersById(admin_id) {
    const sql = `SELECT users.id as admin_id, users.name, users.email, users.status, users.image, users.mobile as contact_no, users.employee_id, roles.name as user_type FROM users INNER JOIN roles ON roles.id=users.user_type WHERE admin_id='${admin_id}' AND users.is_deleted='0'`;
    return await db.query(sql);
}

async function getPendingContractorUsersById(admin_id) {
    const sql = `SELECT users.id as admin_id, users.name, users.email, users.status, users.image, users.mobile as contact_no, roles.name as user_type FROM users INNER JOIN roles ON roles.id=users.user_type WHERE admin_id='${admin_id}' AND users.is_deleted='0' AND users.status='0'`;
    return await db.query(sql);
}

async function getDealerAllUserById(admin_id) {
    const sql = `SELECT users.id as admin_id, users.name, users.email, users.status, users.image, roles.name as user_type, users.mobile as contact_no FROM users INNER JOIN roles ON roles.id=users.user_type WHERE admin_id='${admin_id}' AND users.is_deleted='0'`;
    return await db.query(sql);
}

async function getPlanModuleById(module_id) {
    const module_idStr = JSON.parse(JSON.parse(module_id)).join(',');
    if (module_idStr != '') {
        const sql = `SELECT id as module_id, title as module_name FROM modules WHERE id in(${module_idStr})`
        return await db.query(sql);
    }
    else {
        return null;
    }

}

async function getPlanCheckLists(planId) {
    const sql = `SELECT id  as check_list_id,plan_id,checklist_name FROM plan_checklists WHERE plan_id='${planId}'`;
    return await db.query(sql);
}

async function getSurveyQuestions(surveyId) {
    const sql = `SELECT id as question_id, survey_id, question, assign_to, assign_to_sub_user, survey_response FROM survey_questions WHERE survey_id='${surveyId}'`;
    const data = await db.query(sql);
    if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
            data[index].question = JSON.parse(data[index].question);
        }
        return data;
    } else {
        return data;
    }
}

async function getCreatedUserNameFromAdmin(createdById) {
    const selectAdminUserName = `SELECT name FROM admins WHERE id = '${createdById}'`
    return await db.query(selectAdminUserName);
}

async function getAssignFromAdmin(assignTo) {
    const selectAdminUserName = `SELECT name FROM admins WHERE id = '${assignTo}'`
    return await db.query(selectAdminUserName);
}

async function getAssignToSubUser(assignToSubUser) {
    const selectUserName = `SELECT name FROM users WHERE id = '${assignToSubUser}'`
    return await db.query(selectUserName);
}

async function getUploadedFileExtension(file) {
    const files = JSON.parse(file);

    if (files != null && files != '') {
        for (let i = 0; i < files.length; i++) {
            const fileName = files[i].storePath;
            const replaceFolderFromFileName = fileName.replace('/documents/', '')
            const extension = replaceFolderFromFileName.split('.').pop();
            return extension;
        }
    }
    else {
        return null;
    }
}

async function getGstDetailsByCompanyId(companyId) {
    const { error } = checkPositiveInteger.validate({ id: companyId })
    if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

    const sql = `SELECT id, company_id, gst_number, shipping_address, billing_address, is_default FROM company_gst_details WHERE company_id = ? `
    return await db.query(sql, [companyId])
}

async function getCompanyTypeById(typeId) {
    const { error } = checkPositiveInteger.validate({ id: typeId })
    if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

    const sql = `SELECT company_type_name FROM company_types WHERE company_type_id = ? `
    return await db.query(sql, [typeId])
}

async function roleById(roleId) {
    const sql = `SELECT * FROM roles WHERE id=?`
    const result = await db.query(sql, [roleId])
    return result[0]
}

async function getDayNameOnDate(clockInDate) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(clockInDate);
    let day = weekday[date.getDay()];
    return day;
}

async function getDifferenceBetweenTime(clockIn, clockOut) {
    var difference = clockOut - clockIn;
    // difference = difference / 60 / 60 / 1000;
    var timeDiff = Math.abs(clockIn.getTime() - clockOut.getTime());

    //hour calculate
    var hh = Math.floor(timeDiff / 1000 / 60 / 60);
    hh = ('0' + hh).slice(-2)

    //minute calculate
    timeDiff -= hh * 1000 * 60 * 60;
    var mm = Math.floor(timeDiff / 1000 / 60);
    mm = ('0' + mm).slice(-2)

    //seconds calculate
    timeDiff -= mm * 1000 * 60;
    var ss = Math.floor(timeDiff / 1000);
    ss = ('0' + ss).slice(-2)

    return hh + ":" + mm + ":" + ss;
}

async function getTotalTime(date1, date2) {
    // Add the time values together
    const result = new Date(date1.getTime() + date2.getTime());

    // Format the result as a time string
    const formattedResult = result.toLocaleTimeString({ hour12: false });
    return formattedResult;
}

async function calculateAbsentPercentage(totalWorkingDays, absentDays) {
    return ((absentDays / totalWorkingDays) * 100).toFixed(1);
}

async function calculateInTimePercentage(totalWorkingDays, inTimeDays) {
    return ((inTimeDays / totalWorkingDays) * 100).toFixed(1);
}

async function getMultipleUsersOnId(ids) {
    const user_idStr = JSON.parse(JSON.parse(ids)).join(',');
    if (user_idStr != '') {
        const sql = `SELECT id as user_id, name as user_name FROM users WHERE id in(${user_idStr})`
        return await db.query(sql);
    }
    else {
        return null;
    }
}

async function getDifferenceBetweenTwoDays(startDate, endDate) {
    const diffInMs = new Date(endDate) - new Date(startDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays;
}

async function getNewDifferenceBetweenTwoDays(startDate, endDate, leaveDuration = "Full Day") {
    // Calculate the difference in milliseconds
    const diffInMs = new Date(endDate) - new Date(startDate);

    // Convert the difference to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Define working hours for each leave type
    const workingHours = {
        "Full Day": 9,       // Full Day = 9 hours
        "Half Day": 4.5,     // Half Day = 4.5 hours
        "Short Leave": 2     // Short Leave = 2 hours
    };

    // Determine total hours based on leave duration
    const totalHours = workingHours[leaveDuration] || 9; // Default to Full Day if not provided

    // Return the difference in days and total hours
    return {
        days: diffInDays,
        totalHours: diffInDays * totalHours
    };
}



async function getRoleInGroupById(roleIds) {
    const roles = JSON.parse(roleIds)
    sql = `SELECT id, name as designation_name FROM roles WHERE id IN(${roles[0].insurance_applied_on})`
    return await db.query(sql)
}

async function getUserInGroupById(userIds) {
    const users = JSON.parse(userIds)
    sql = `SELECT id, name as employee_name FROM users WHERE id IN(${users[0].insurance_applied_on})`
    return await db.query(sql)
}


async function getUserDetails(id) {
    const userId = id
    sql = `SELECT * FROM users WHERE id ='${userId}'`
    const result = await db.query(sql)

    if (result.length > process.env.VALUE_ZERO) {
        return result;
    }
    else {
        return [];
    }
}
async function getAdminAndUserDetails(id) {
    const userId = id
    sql = `SELECT * FROM users WHERE id ='${userId}' `
    const result = await db.query(sql)

    if (result.length > process.env.VALUE_ZERO) {
        return result;
    }
    else {
        sql = `SELECT * FROM admins WHERE id ='${userId}'`
        const result = await db.query(sql)

        if (result.length > process.env.VALUE_ZERO) {
            return result;
        }
    }
}

async function countUserTotalWorkingDaysInMonth(userId, dbMonth) {
    const dateObj = moment(dbMonth, "YYYY-MM");
    const year = dateObj.format("YYYY");
    const month = dateObj.format("MM");
    var finalData = [];
    // var sql = `SELECT COUNT(DISTINCT in_time) AS total_working_days FROM attendances WHERE user_id = '${userId}' AND MONTH(in_time) = '${month}' AND YEAR(in_time) = '${year}' AND status = 'incomplete' GROUP BY user_id`;

    var sql = `SELECT COUNT(DISTINCT in_time) AS total_working_days FROM attendances WHERE user_id = '${userId}' AND MONTH(in_time) = '${month}' AND YEAR(in_time) = '${year}' AND status = 'incomplete' AND attendance_status="2" GROUP BY user_id`;

    const result = await db.query(sql);

    if (result != null && result.length > process.env.VALUE_ZERO) {

        var half_day_sql = `SELECT COUNT(DISTINCT in_time) AS total_working_days FROM attendances WHERE user_id = '${userId}' AND MONTH(in_time) = '${month}' AND YEAR(in_time) = '${year}' AND status = 'incomplete' AND attendance_status="3" GROUP BY user_id`;
        const half_day_result = await db.query(half_day_sql);
        if (half_day_result.length > 0) {
            return {
                "present_days": result[0].total_working_days,
                "half_day": half_day_result[0].total_working_days
            };
        } else {
            return {
                "present_days": result[0].total_working_days,
                "half_day": 0
            };
        }

    }
    else {
        return {
            "present_days": 0,
            "half_day": 0
        };
    }

}


async function generateRandomNumber(length) {
    let randomNumber = '';
    for (let i = 0; i < length; i++) {
        randomNumber += Math.floor(Math.random() * 10); // Generate random digit between 0 and 9
    }
    return String(randomNumber);
}



async function checkUserHasActiveLoan(userId, dbMonth) {
    const sql = `SELECT * FROM loans WHERE user_id = '${userId}' AND status = 'active'`
    const result = await db.query(sql)

    if (result.length > process.env.VALUE_ZERO) {
        var data = {
            loan_id: result[0].loan_id,
            repayment_date: result[0].repayment_date,
            repayment_amount: result[0].repayment_amount,
            payment_type: result[0].payment_type,
            loan_amount: result[0].loan_amount,
            loan_term: result[0].loan_term
        }
    }
    else {
        var data = {
            loan_id: 0,
            repayment_date: 0,
            repayment_amount: 0,
            payment_type: 0,
            loan_amount: 0,
            loan_term: 0
        }
    }
    return data;
}

async function getEmployeeSalary(userId) {
    const sql = `SELECT * FROM salaries WHERE user_id = '${userId}' AND is_deleted = '0'`
    const result = await db.query(sql)
    return result
}

async function countUserTotalLeaveDaysInMonth(userId, dbMonth) {
    const dateObj = moment(dbMonth, "YYYY-MM");
    const year = dateObj.format("YYYY");
    const month = dateObj.format("MM");

    // const sql = `SELECT total_days, COUNT(*) as total_leaves FROM leave_applications WHERE applicant_id = '${userId}' AND MONTH(start_date) = '${month}' AND YEAR(start_date) = '${year}' GROUP BY applicant_id`

    const sql = `SELECT * FROM leave_applications WHERE applicant_id = '${userId}' AND MONTH(start_date) = '${month}' AND YEAR(start_date) = '${year}'`;

    const result = await db.query(sql)
    var daysDifference = 0;
    if (result.length > process.env.VALUE_ZERO) {
        result.forEach(element => {

            const start_date = moment(element.start_date);
            const end_date = moment(element.end_date);

            if (moment(element.start_date).format("YYYY-MM-DD") == moment(element.end_date).format("YYYY-MM-DD")) {
                daysDifference += 1;
            } else {
                daysDifference += end_date.diff(start_date, 'days') + 1;
            }

        });
        return {
            "total_days": daysDifference,
            "total_leaves": result.length
        };
    }
    else {
        return {
            "total_days": 0,
            "total_leaves": 0
        };
    }
}

async function getUserInsuranceDetails(userId) {
    const sql = `SELECT * FROM group_insurances`
    const result = await db.query(sql)
    var values = [];
    let userIds;

    for (const row of result) {
        const insuranceAppliedOn = JSON.parse(row.insurance_applied_on)
        for (const insurance of insuranceAppliedOn) {
            userIds = insurance.insurance_applied_on
        }
        const arr = userIds.split(',').map(Number);
        values.push({
            id: row.id,
            insurance_deduction_amount: row.insurance_deduction_amount,
            insurance_applied_on: arr
        })
    }
    const num = parseInt(userId);
    const arrayToCheck = [num];

    const matchingObjects = values.filter(obj => obj.insurance_applied_on.includes(...arrayToCheck));

    const finalResult = matchingObjects.length > 0 ? matchingObjects[0] : null;

    return finalResult;
}

async function getInsuranceCompanyDetailsById(insuranceGroupId) {
    const sql = `SELECT group_insurances.insurance_deduction_amount, insurance_companies.company_name, insurance_company_plans.policy_name FROM group_insurances INNER JOIN insurance_companies ON insurance_companies.id = group_insurances.insurance_company_id INNER JOIN insurance_company_plans ON insurance_company_plans.plan_id = group_insurances.insurance_plan_id WHERE group_insurances.id = '${insuranceGroupId}'`

    return await db.query(sql)
}

async function getEmployeeFullMonthWorkHours(userId, dbMonth) {
    const date = new Date(dbMonth)
    const formattedDate = moment(date, 'DD-MM-YY').format('YYYY-MM-DD')

    const sql = `SELECT user_id, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(out_time, in_time)))) AS total_work_hours FROM attendances WHERE user_id = ${userId} AND status = 'incomplete' AND out_time IS NOT NULL AND MONTH(in_time) = MONTH('${formattedDate}') GROUP BY user_id`

    const result = await db.query(sql)

    if (result.length > process.env.VALUE_ZERO) {
        return result[0];
    }
    else {
        return '0';
    }
}

async function checkUserSalaryDisbursed(userId, dbMonth, netPayAble) {
    const dateObj = moment(dbMonth, "YYYY-MM");
    const year = dateObj.format("YYYY");
    const month = dateObj.format("MM");

    const sql = `SELECT gross_salary FROM salary_disburses WHERE user_id = '${userId}' AND YEAR(month) = '${year}' AND MONTH(month) = '${month}'`

    const result = await db.query(sql);

    if (result.length > process.env.VALUE_ZERO) {

        if (result[0].gross_salary >= netPayAble) {
            return 1;
        }
        else {
            return 0;
        }
    }
    else {
        return 0;
    }
}

async function getUserGrossSalaryInMonth(userId, dbMonth) {
    const dateObj = moment(dbMonth, "YYYY-MM");
    const year = dateObj.format("YYYY");
    const month = dateObj.format("MM");

//     const sql = `SELECT * FROM salary_disburses WHERE user_id = '${userId}' AND YEAR(month) = '${year}' AND MONTH(month) = '${month}'`
// console.log(sql)
const check = await db.query(`SELECT * 
FROM salary_disburses 
LEFT JOIN salary_disburse_histories 
ON salary_disburses.id = salary_disburse_histories.gross_salary_id 
WHERE salary_disburses.user_id = '${userId}' 
AND YEAR(salary_disburses.month) ='${year}'
AND MONTH(salary_disburses.month) = '${month}';
`)
console.log("check", check)
    const result = await db.query(sql);

    if (check.length > process.env.VALUE_ZERO) {
        return check[0];
    }
    else {
        return 0;
    }
}

async function getAppliedAllowance(userId, userType = null) {
    const sql = `SELECT * FROM allowances`
    const result = await db.query(sql)
    var values = [];
    let userIds;
    let matchingObjects;
    let finalResult;
    //first get on user id
    for (const row of result) {
        const allowanceAppliedOn = JSON.parse(row.applied_on)
        for (const allowance of allowanceAppliedOn) {
            userIds = allowance.applied_on
        }
        const arr = userIds.split(',').map(Number);

        values.push({
            id: row.id,
            name: row.name,
            value: row.value,
            value_type: row.value_type,
            applied_type: row.applied_type,
            allowance_applied_on: arr
        })
    }
    if (values.length > process.env.VALUE_ZERO) {

        const allowancesWithTypeEmployeeWise = values.filter(allowance => allowance.applied_type === "1");
        const allowancesWithTypeDesignationWise = values.filter(allowance => allowance.applied_type === "2");


        if (allowancesWithTypeEmployeeWise.length > 0) {
            //check on user id

            const num = parseInt(userId);
            const arrayToCheck = [num];

            matchingObjects = allowancesWithTypeEmployeeWise.filter(obj => obj.allowance_applied_on.includes(...arrayToCheck));
            if (!_.isEmpty(matchingObjects)) {
                finalResult = matchingObjects.length > 0 ? matchingObjects : null;
                return finalResult;
            }
            else {
                //check designation wised
                const num = parseInt(userType);
                const arrayToCheck = [num];

                matchingObjects = allowancesWithTypeDesignationWise.filter(obj => obj.allowance_applied_on.includes(...arrayToCheck));

                finalResult = matchingObjects.length > 0 ? matchingObjects : null;
                return finalResult;
            }
        }
    }
    else {
        return 0;
    }
}

async function getAppliedDeductions(userId, userType = null) {
    const sql = `SELECT * FROM deductions`
    const result = await db.query(sql);

    var values = [];
    let userIds;
    let matchingObjects;
    let finalResult;
    //first get on user id
    for (const row of result) {
        const allowanceAppliedOn = JSON.parse(row.applied_on)

        for (const allowance of allowanceAppliedOn) {
            userIds = allowance.applied_on
        }
        const arr = userIds.split(',').map(Number);


        values.push({
            id: row.id,
            name: row.name,
            value: row.value,
            value_type: row.value_type,
            applied_type: row.applied_type,
            allowance_applied_on: arr,
            by_employee: row.by_employee,
            by_employer: row.by_employer
        })
    }

    if (values.length > process.env.VALUE_ZERO) {
        const allowancesWithTypeEmployeeWise = values.filter(allowance => allowance.applied_type === "1");
        const allowancesWithTypeDesignationWise = values.filter(allowance => allowance.applied_type === "2");

        if (allowancesWithTypeEmployeeWise.length > 0) {
            //check on user id

            const num = parseInt(userId);
            const arrayToCheck = [num];

            matchingObjects = allowancesWithTypeEmployeeWise.filter(obj => obj.allowance_applied_on.includes(...arrayToCheck));
            if (!_.isEmpty(matchingObjects)) {
                finalResult = matchingObjects.length > 0 ? matchingObjects : null;
                return finalResult;
            }
            else {
                //check designation wised
                const num = parseInt(userType);
                const arrayToCheck = [num];

                matchingObjects = allowancesWithTypeDesignationWise.filter(obj => obj.allowance_applied_on.includes(...arrayToCheck));
                finalResult = matchingObjects.length > 0 ? matchingObjects : null;
                return finalResult;
            }
        }
    }
    else {
        return 0;
    }
}

async function getAppliedOnAllowanceEmployeeWise(appliedOn) {
    var appliedOnFormatted = JSON.parse(appliedOn);
    var userIds = appliedOnFormatted[0].applied_on;

    const selectQuery = `SELECT id, name, image, employee_id FROM users WHERE id IN (${userIds})`
    return await db.query(selectQuery);
}

async function getAppliedOnAllowanceDesignationWise(appliedOn) {
    var appliedOnFormatted = JSON.parse(appliedOn);
    var designationIds = appliedOnFormatted[0].applied_on;

    const selectQuery = `SELECT id, name FROM roles WHERE id IN (${designationIds})`
    return await db.query(selectQuery);
}

async function getReceiverSocketId(receiverId) {
    const selectQuery = `SELECT * FROM messages WHERE recipient_id = '${receiverId}' ORDER BY message_id DESC LIMIT 1`
    const result = await db.query(selectQuery);

    if (result.length > process.env.VALUE_ZERO) {
        return result[0].receiver_socket_id;
    }
    else {
        return process.env.VALUE_ZERO;
    }
}


async function saveMessages(data) {

    //current timestamp
    const now = new Date();
    const timestamp = now.getTime();

    const insertQuery = `INSERT INTO messages(sender_id, recipient_id, message_content, timestamp) VALUES(?, ?, ?, ?)`

    const insertValues = [data.senderId, data.receiverId, data.message, timestamp]
    const queryResult = await db.query(insertQuery, insertValues)
    if (queryResult.affectedRows > process.env.VALUE_ZERO) {
        return true;
    }
    else {
        return false;
    }
}

async function getLoggedUserDetails(userId, userType) {
    if (userType == process.env.SUPER_ADMIN_ROLE_ID || userType == process.env.ENERGY_COMPANY_ROLE_ID || userType == process.env.CONTRACTOR_ROLE_ID) {
        sql = `SELECT id, name, image FROM admins WHERE id ='${userId}'`
        return await db.query(sql)
    }
    else {
        sql = `SELECT id, name, image FROM users WHERE id ='${userId}'`
        return await db.query(sql)
    }
}

async function getEmployeeBaseSalary(userId) {
    sql = `SELECT * FROM salaries WHERE user_id ='${userId}'`
    $data = await db.query(sql)

    if ($data.length > process.env.VALUE_ZERO) {
        return $data[0];
    }
    else {
        return 0;
    }
}

async function checkEmailDuplicacys(email) {
    sql = `SELECT * FROM users WHERE email ='${email}'`
    data = await db.query(sql)

    if (data.length > process.env.VALUE_ZERO) {
        return true;
    }
    else {
        return false;
    }
}

async function historyTimeLine(id) {
    sql = `SELECT user_status_timeline.* , admins.name as updated_by_name
    FROM user_status_timeline 
    LEFT JOIN admins ON user_status_timeline.updated_by = admins.id
    WHERE user_status_timeline.user_id='${id}';`
    return await db.query(sql);
}


async function getQuestionList(question_id) {
    sql = `SELECT  id, question FROM survey_questions WHERE id IN (${question_id.toString()});`
    const questionData = await db.query(sql);
    if (questionData.length > 0) {
        for (let index = 0; index < questionData.length; index++) {
            questionData[index].question = JSON.parse(questionData[index].question);
        }
    }
    return questionData;
}

async function getRecipientMessages(recipient_id, sender_id) {
    sql = `SELECT * FROM messages where recipient_id="${recipient_id}" AND sender_id="${sender_id}" ORDER BY message_id DESC LIMIT 1; `
    return await db.query(sql);
}

async function createDefaultPermission(role_id) {
    const selectQuery = `SELECT modules.id as module_id, IFNULL(sub_modules.id,0) as sub_module_id, IFNULL(module_of_sub_modules.id,0) as module_of_sub_modules_id
    FROM modules
    LEFT JOIN sub_modules ON modules.id = sub_modules.module_id
    LEFT JOIN module_of_sub_modules on sub_modules.id = module_of_sub_modules.sub_module_id
    ORDER BY modules.id ASC;`;
    const result = await db.query(selectQuery);
    if (result.length > 0) {
        result.forEach(async (element) => {
            var insertQuery = `INSERT INTO permissions(module_id, sub_module_id, module_of_sub_module, role_id) VALUES ('${element.module_id}','${element.sub_module_id}','${element.module_of_sub_modules_id}','${role_id}')`;
            await db.query(insertQuery);
        });
    }
}

/**
 * function created but not included in any code.
 * @param {*} total 
 * @param {*} currentPage 
 * @param {*} pageSize 
 * @returns 
 */
async function calculatePagination(total, currentPage, pageSize) {
    var pageDetails = [];
    const totalPages = Math.ceil((total / pageSize));
    const pageStartResult = (currentPage - 1) * pageSize + 1;
    const pageEndResult = Math.min(currentPage * pageSize, total);
    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
    return pageDetails[0];
}



async function complaintsTimeLineHelper(complaints_id, title, rejected_remark, role_id, status, created_by, timeline_id = null) {

    let insertQuery = `INSERT INTO complaints_timeline(complaints_id,title, remark, role_id, status, created_by) VALUES ("${complaints_id}","${title}","${rejected_remark}","${role_id}", "${status}", "${created_by}")`;
    return await db.query(insertQuery);
}

async function updateComplaintsTimeLineHelper(complaints_id, title, rejected_remark, role_id, status, created_by) {

    let updateQuery = `UPDATE complaints_timeline SET title = "${title}", remark = "${rejected_remark}", role_id = "${role_id}", status = "${status}", created_by = "${created_by}", free_end_users = 0 WHERE complaints_id = "${complaints_id}" AND status='assigned'; `;
    return await db.query(updateQuery);

}

async function complaintsTimeLineApprovedHelper(complaints_id, title, remark, role_id, created_by) {
    const insertQuery = `INSERT INTO complaints_timeline(complaints_id, title, remark, role_id, status, created_by) VALUES ("${complaints_id}","${title}","${remark}","${role_id}", "approved", "${created_by}")`;
    return await db.query(insertQuery);
}

async function complaintsTimeLineAssignTimeLine(complaints_id, title, remark, role_id, assign_to, created_by) {
    const insertQuery = `INSERT INTO complaints_timeline(complaints_id,title, remark, role_id, assign_to,  status, created_by) VALUES ("${complaints_id}","${title}","${remark}","${role_id}", "${assign_to}", "assigned", "${created_by}")`;
    return await db.query(insertQuery);
}

async function getComplaintTimeline(complaints_id) {
    var selectQuery = `SELECT id, complaints_id, title, remark, created_at FROM complaints_timeline WHERE complaints_id = "${complaints_id}" ORDER BY complaints_timeline.id DESC`;
    return await db.query(selectQuery);
}

// async function getComplaintsToAreaManager(complaints_id) {
//     var selectQuery = `SELECT area_manager_id FROM complaints_timeline WHERE complaints_id = "${complaints_id}" AND area_manager_id IS NOT NULL ORDER BY id DESC`;
//     return await db.query(selectQuery);
// }


async function getComplaintsToAreaManager(complaints_id) {
    var selectQuery = `
        SELECT 
            complaints_timeline.area_manager_id,
            users.name As user_name
        FROM 
            complaints_timeline 
        JOIN 
            users 
        ON 
            complaints_timeline.area_manager_id = users.id 
        WHERE 
            complaints_timeline.complaints_id = "${complaints_id}" 
            AND complaints_timeline.area_manager_id IS NOT NULL 
        ORDER BY 
            complaints_timeline.id DESC
    `;
    return await db.query(selectQuery);
}



async function getComplaintsApprovalAccess() {
    const selectQuery = `SELECT * FROM complaint_approval_settings`;
    const result = await db.query(selectQuery);

    if (result.length > process.env.VALUE_ZERO) {
        return result[0].approved_by;
    }
    else {
        return null;
    }
}

async function getEnergyCompaniesById(id) {
    const selectQuery = `SELECT * FROM energy_companies WHERE id = ?`;
    const result = await db.query(selectQuery, id);

    if (result.length > process.env.VALUE_ZERO) {
        return result[0];
    }
    else {
        return null;
    }
}

async function getComplaintTypeById(id) {
    const selectQuery = `SELECT * FROM complaint_types WHERE id = ?`;
    const result = await db.query(selectQuery, id);

    if (result.length > process.env.VALUE_ZERO) {
        return result[0];
    }
    else {
        return null;
    }
}

async function complaintApprovedBy(id) {
    if (id > 0) {
        const selectQuery = `SELECT * FROM admins WHERE id = ?`;
        const result = await db.query(selectQuery, id);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            const data = { "name": "", "image": "" }
            return data;
        }
    }
    else {
        return null;
    }
}

async function complaintStatusChangedBy(id) {
    if (id > 0) {
        const selectQuery = `SELECT * FROM admins WHERE id = ?`;
        const result = await db.query(selectQuery, id);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0].name;
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}


async function complaintResolvedBy(id) {
    if (id > 0) {
        const selectQuery = `SELECT * FROM users WHERE id = ?`;
        const result = await db.query(selectQuery, id);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

async function complaintRaiseBy(id) {
    if (id > 0) {
        const selectQuery = `SELECT * FROM admins WHERE id = ?`;
        const result = await db.query(selectQuery, id);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            const data = { "name": "", "image": "" }
            return data;
        }
    }
    else {
        return null;
    }
}


async function complaintApprovalDetails(id) {
    if (id > 0) {
        const selectQuery = `SELECT * FROM admins WHERE id = ?`;
        const result = await db.query(selectQuery, id);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

async function complaintAssignByDetails(roleId, userId) {
    if (roleId == 1 || roleId == 2 || roleId == 3 || roleId == 4) {
        const selectQuery = `SELECT * FROM admins WHERE id = ? AND user_type = ?`;
        const result = await db.query(selectQuery, [userId, roleId]);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            const data = { "name": "", "image": "" }
            return data;
        }
    }
    else {
        const selectQuery = `SELECT * FROM users WHERE id = ? AND user_type = ?`;
        const result = await db.query(selectQuery, [userId, roleId]);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            const data = { "name": "", "image": "" }
            return data;
        }
    }
}

async function complaintAssignToDetails(roleId, userId) {
    if (roleId == 1 || roleId == 2 || roleId == 3 || roleId == 4) {
        const selectQuery = `SELECT * FROM admins WHERE id = ? AND user_type = ?`;
        const result = await db.query(selectQuery, [userId, roleId]);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            const data = { "name": "", "image": "" }
            return data;
        }
    }
    else {
        const selectQuery = `SELECT * FROM users WHERE id = ? AND user_type = ?`;
        const result = await db.query(selectQuery, [userId, roleId]);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            const data = { "name": "", "image": "" }
            return data;
        }
    }
}

async function getFreeEndUsersCount(id) {
    const query = `WITH RECURSIVE user_hierarchy AS (
        SELECT id, name, admin_id, 1 AS level
        FROM users
        WHERE admin_id = ${id}
    
        UNION ALL
    
        SELECT u.id, u.name, u.admin_id, uh.level + 1
        FROM users u
        INNER JOIN user_hierarchy uh ON u.admin_id = uh.id
    )
    SELECT *
    FROM user_hierarchy
    ORDER BY level`

    return await db.query(query);
}

async function countFreeUser(userId) {

    const complaintQuery = `SELECT complaints.id, complaints.description, complaints_timeline.complaints_id, complaints_timeline.title, complaints_timeline.assign_to FROM complaints INNER JOIN complaints_timeline ON complaints_timeline.complaints_id = complaints.id WHERE complaints_timeline.status != 'resolved' AND complaints_timeline.assign_to IS NOT NULL GROUP BY complaints_timeline.complaints_id`;

    const queryResult = await db.query(complaintQuery);
    return queryResult;
}


async function getDbLastComplaintUniqueId(energy_company_id, complaint_for) {
    const selectQuery = `SELECT complaint_unique_id FROM complaints ORDER BY id DESC LIMIT 1`;
    const queryResult = await db.query(selectQuery);

    if (queryResult.length > process.env.VALUE_ZERO && queryResult[0].complaint_unique_id != null) {
        return queryResult[0].complaint_unique_id;
    }
    else {
        const companyId = energy_company_id.toString().padStart(2, '0')

        const dbCompanyName = await getCompanyName(energy_company_id)

        const charactersOfCompanyName = (dbCompanyName.substring(0, 3)).toUpperCase()

        const financialYears = await getFinancialYear()

        const complaintPrefix = charactersOfCompanyName + companyId + financialYears

        let prefix; // Declare the prefix variable outside the if-else blocks

        if (complaint_for == 1) {
            prefix = complaintPrefix + 'EC' + '00';
        } else {
            prefix = complaintPrefix + 'OC' + '00';
        }
        return prefix;
    }
}



async function getDbLastComplaintUniqueIdInPi(energy_company_id, complaint_for) {
    const selectQuery = `SELECT complaint_unique_id FROM complaints ORDER BY id DESC LIMIT 1`;
    const queryResult = await db.query(selectQuery);

    if (queryResult.length > process.env.VALUE_ZERO && queryResult[0].complaint_unique_id != null) {
        return queryResult[0].complaint_unique_id;
    }
    else {
        const companyId = energy_company_id.toString().padStart(2, '0')

        const dbCompanyName = await getCompanyName(energy_company_id)

        const charactersOfCompanyName = (dbCompanyName.substring(0, 3)).toUpperCase()

        const complaintPrefix = charactersOfCompanyName + companyId + "PI" + "00"

        return complaintPrefix;
    }
}


async function getSupplierDetails(supplier_id) {
    const selectQuery = `SELECT company_name FROM companies WHERE company_id = '${supplier_id}'`;
    const queryResult = await db.query(selectQuery);

    if (queryResult.length > process.env.VALUE_ZERO) {
        return queryResult[0];
    }
    else {
        return '';
    }
}


// Function to calculate tax amount
async function calculateTaxAmount(taxPercentage, totalAmount) {
    if (typeof taxPercentage !== 'number' || typeof totalAmount !== 'number') {
        throw new Error('Invalid input. Tax percentage and total amount should be numbers.');
    }

    return (taxPercentage / 100) * totalAmount;
};

async function getCreatedByDetails(userId) {
    if (userId > process.env.VALUE_ZERO) {
        // first search in users table
        const selectUserQuery = `SELECT id, name, image, employee_id, credit_limit FROM users WHERE id = ?`;
        const queryResult = await db.query(selectUserQuery, [userId]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        }
        else {
            // check in admins table
            const selectUserQuery = `SELECT id, name, image, employee_id, credit_limit FROM admins WHERE id = ?`;
            const queryResult = await db.query(selectUserQuery, [userId]);
            return queryResult[0];
        }
    }
    else {
        return { data: 'User is not valid' };
    }
}

async function getPoDetailById(id) {
    const selectQuery = `SELECT * FROM purchase_orders WHERE id = '${id}'`;
    const queryResult = await db.query(selectQuery);
    if (queryResult.length > process.env.VALUE_ZERO) {
        for (const row of queryResult) {
            row.po_date = moment(row.po_date).format('YYYY-MM-DD');
        }
        return queryResult[0];
    }
    else {
        return '';
    }
}


async function generateRandomAlphanumeric(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charactersLength);
        result += characters.charAt(randomIndex);
    }
    return result;
}



async function generateRandomAlphanumerics(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const suffix = 'CMS';

    let result = suffix;

    // Subtracting the length of the suffix from the desired length
    length -= suffix.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charactersLength)
        result += characters.charAt(randomIndex).toUpperCase();
    }

    return result;
}
async function checkFinancialYearFormat(start_date) {
    // Create Date objects from the ISO date strings
    const startDate = new Date(start_date);

    // Get the year values from the start and end dates
    const startYear = startDate.getFullYear();

    // Otherwise, consider the previous year (startYear - 1) as the financial year's starting year.
    const financialYearStart = startYear;
    // Financial year ends on March 31 of the following year
    const financialYearEnd = startYear + 1;

    // Extract the last two digits from the full year
    const lastTwoDigitsOFEndYear = financialYearEnd % 100;

    // Combine the start and end years to represent the financial year
    const financialYear = financialYearStart + '-' + lastTwoDigitsOFEndYear;

    return financialYear;
}


async function getCashRequestStatus(id) {
    const selectQuery = `SELECT * FROM cash_requests WHERE id = '${id}'`;
    const queryResult = await db.query(selectQuery);

    if (queryResult.length > process.env.VALUE_ZERO) {
        return queryResult[0];
    }
    else {
        return [];
    }
}


async function getUsersData(id) {
    const outletId = JSON.parse(id)
    var sql = '';
    if (typeof outletId == 'object') {
        const commaSeparated = outletId.join(",");
        sql = `SELECT id as user_id, name, image FROM users WHERE id IN(${commaSeparated})`
    }
    else {
        sql = `SELECT id as outlet_id, outlet_name FROM outlets WHERE id='${id}'`;
    }

    const result = await db.query(sql);

    if (result.length > process.env.VALUE_ZERO) {
        return result;
    }
    else {
        return [{ outlet_name: '', outlet_id: '' }];
    }
}

async function supplierDetails(supplier_id) {
    try {
        const sql = `SELECT id , supplier_name FROM suppliers WHERE id = ?`;
        const result = await db.query(sql, supplier_id);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            return [{ id: '', supplier: '' }];
        }
    }
    catch (error) {
        return error.message;
    }
}

async function getAdminDetailsById(id) {
    try {
        const sql = `SELECT * FROM admins WHERE id = ?`;
        const result = await db.query(sql, [id]);

        if (result.length > process.env.VALUE_ZERO) {
            return result[0];
        }
        else {
            return [{ id: '', name: '', email: '', password: '' }];
        }
    }
    catch (error) {
        return error.message;
    }
}

async function calculateAppliedAllowanceForUser(appliedAllowance, salary) {
    
    let valueArray = [];
    let totalValue = 0;
    if (appliedAllowance != null) {
        if (appliedAllowance.length > 0) {
            for (let i = 0; i < appliedAllowance.length; i++) {
                if (appliedAllowance[i].value_type === '1') {
                    totalValue += appliedAllowance[i].value;
                }
                else {
                    // get by employee percentage
                    const getEmployeePercentageValue = await calculateTaxAmount(salary, appliedAllowance[i].value);
                    totalValue += getEmployeePercentageValue;
                }
            }
        }
    }
    return totalValue;
}


async function calculateAppliedDeductionForUser(appliedDeduction, salary, allowanceAmount) {
    let deductionValueArray = [];
    let deductionTotalValue = 0;
    if (appliedDeduction != null) {
        for (let i = 0; i < appliedDeduction.length; i++) {
            let getEmployeePercentageValue = 0;
            // for fixed amount of deduction
            if (appliedDeduction[i].value_type === '1') {
                deductionTotalValue += (appliedDeduction[i].by_employee + appliedDeduction[i].by_employer)
            }
            else if (appliedDeduction[i].value_type === '2') {
                deductionTotalValue += await calculateTaxAmount(salary, appliedDeduction[i].by_employee);
            }
            else {
                getEmployeePercentageValue = await calculateTaxAmount((salary + allowanceAmount), appliedDeduction[i].by_employee);

                // get by employer percentage
                const getEmployerPercentageValue = await calculateTaxAmount(salary, appliedDeduction[i].by_employer);

                deductionTotalValue += (getEmployeePercentageValue);

                //------------- shalu changes ----
                // deductionTotalValue += (getEmployeePercentageValue + getEmployerPercentageValue);

            }

        }
    }
    return deductionTotalValue;
}


async function calculateUserActiveLoan(getUserActiveLoan, month) {
    let loanAmount = 0;

    if (getUserActiveLoan != null) {

        const repayment_date = getUserActiveLoan.repayment_date

        const loan_id = getUserActiveLoan.loan_id
        const repayment_amount = getUserActiveLoan.repayment_amount || 0;
        const payment_type = getUserActiveLoan.payment_type
        const loan_amount = getUserActiveLoan.loan_amount

        if (payment_type === 'emi') {
            loanAmount = repayment_amount
        }
        else if (payment_type === 'one time') {
            const paymentDate = moment(repayment_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM')

            if (paymentDate == month) {
                loanAmount = loan_amount
            }
            else {
                loanAmount = 0
            }
        }
        else {
            loanAmount = repayment_amount
        }
    }
    return loanAmount;
}

async function calculateTotalWorkingDay(getUserTotalWorkingDaysInMOnth) {
    var halfDay = 0.0;
    if (getUserTotalWorkingDaysInMOnth.half_day >= 1) {
        // Calculate the result by adding 0.5 to the number
        halfDay = 0.5 + (getUserTotalWorkingDaysInMOnth.half_day - 1) * 0.5;
    } else {
        // Handle the case where the number is less than 1 (optional)
        halfDay = 0.0; // You can customize this message as needed
    }
    return (getUserTotalWorkingDaysInMOnth.present_days + halfDay);
}

async function getOrderViaDetails(id) {
    try {
        const queryResult = await db.query(`SELECT id, order_via FROM order_vias WHERE id = ?`, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        }
        else {
            return {id: "", order_via: ""};
        }
    } catch (error) {
        return error.message;
    }
}

async function getpurchase_order_item(id) {
    const sql = `SELECT purchase_order_item.id, purchase_order_item.purchase_order_id, purchase_order_item.item_id, purchase_order_item.qty, purchase_order_item.amount, purchase_order_item.sub_total, purchase_order_item.gst_id, purchase_order_item.gst_percent, purchase_order_item.total_gst, item_masters.name, item_masters.unique_id, gst_master.title
    FROM purchase_order_item
    LEFT JOIN item_masters ON purchase_order_item.item_id = item_masters.id LEFT JOIN gst_master ON gst_master.id = purchase_order_item.gst_id
    WHERE purchase_order_item.purchase_order_id='${id}';`;
    return await db.query(sql);
}


async function get_new_purchase_order_item(id, pageSize, pageFirstResult, currentPage, searchData) {
    const searchCondition = "";
    if(searchData){
        searchCondition += `AND poi.name LIKE %'${searchData}'% OR poi.order_line_number LIKE %'${searchData}'% OR poi.unit LIKE %'${searchData}'% OR poi.rate LIKE %'${searchData}'%`
    }

    const sql = `SELECT poi.purchase_order_id, poi.change_gst_type, poi.order_line_number as OrderLineNumber, poi.ru_code as RuCode, poi.hsn_code as HsnCode, poi.name as Name, poi.unit AS Unit, poi.rate as Rate, poi.qty As Qty, poi.amount as Amount, poi.total_gst as totalGSTAmount, IFNULL(poi.description, '') as description, poi.created_at, gst_master.id as gst_id, gst_master.title as gst_type, gst_master.percentage as gst_percent FROM purchase_order_item poi LEFT JOIN gst_master ON gst_master.id = poi.gst_id WHERE poi.purchase_order_id='${id}' ${searchCondition}  ORDER BY poi.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

    const queryResult = await db.query(sql);

    // remove after order by
    const modifiedQueryString = sql.substring(0, sql.indexOf("ORDER BY"));
    const totalResult = await db.query(modifiedQueryString);

    if (queryResult.length > 0) {
        var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
        return {
            pageDetails: pageDetails,
            data: queryResult
        }
    } else {
        return [];
    }

    // return await db.query(sql);

}


async function getComplaintUsingIds(complaint_id) {
    const complaintIds = JSON.parse(complaint_id);
    var complaintsName = "";
    if (complaintIds.length > 0) {
        for (let index = 0; index < complaintIds.length; index++) {
            const element = complaintIds[index];
            const sql = `SELECT complaint_unique_id FROM complaints WHERE id ='${element}';`;
            const resultData = await db.query(sql);
            complaintsName += resultData[0].complaint_unique_id + ", ";
        }
    }
    return complaintsName;
}

async function getRoleByUserId(user_id) {

    const selectQuery = `SELECT user_type FROM users WHERE id = ?`;
    const result = await db.query(selectQuery, user_id);

    if (result.length > process.env.VALUE_ZERO) {
        return result[0].user_type;
    }
    else {
        const selectQuery = `SELECT user_type FROM admins WHERE id = ?`;
        const result = await db.query(selectQuery, user_id);
        return result[0].user_type;
    }
}

async function getComplaintById(complaint_id) {
    const sql = `SELECT * FROM complaints WHERE id ='${complaint_id}'`;
    const resultData = await db.query(sql);
    if (resultData.length > 0) {
        return resultData[0];
    }
    else {
        return [];
    }
}

async function getComplaintAndComplaintTypeById(complaint_id) {

    const sql = `SELECT complaints.*, complaint_types.complaint_type_name FROM complaints LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE complaints.id ='${complaint_id}'`;
    const resultData = await db.query(sql);
    if (resultData.length > 0) {
        return resultData[0];
    }
    else {
        return [];
    }
}

async function getCompanyDetailsById(company_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: company_id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT * FROM companies WHERE company_id =?`, [company_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        }
        else {
            return [];
        }

    } catch (error) {
        return error.message;
    }
}


async function checkAlreadyExistOrNot(module_id, sub_module_id, module_of_sub_module, role_id) {
    var sql_query = "";
    if (sub_module_id > 0 && module_of_sub_module == 0) {
        sql_query = `SELECT id, module_id, sub_module_id, module_of_sub_module, role_id, user_id, created, viewed, updated, deleted FROM permissions WHERE module_id='${module_id}' AND sub_module_id='${sub_module_id}' AND role_id='${role_id}';`;

    } else if (sub_module_id > 0 && module_of_sub_module > 0) {
        sql_query = `SELECT id, module_id, sub_module_id, module_of_sub_module, role_id, user_id, created, viewed, updated, deleted FROM permissions WHERE module_id='${module_id}' AND sub_module_id='${sub_module_id}' AND module_of_sub_module='${module_of_sub_module}' AND role_id='${role_id}';`;

    } else {
        sql_query = `SELECT id, module_id, sub_module_id, module_of_sub_module, role_id, user_id, created, viewed, updated, deleted FROM permissions WHERE module_id='${module_id}' AND role_id='${role_id}';`;
    }
    const resultData = await db.query(sql_query);
    if (resultData.length > 0) {
        return resultData[0].id;
    } else {
        return 0;
    }
}


async function insertOrUpdatePermission(module_id, sub_module_id, module_of_sub_module_id, role_id, is_exist, create, view, update, deleted) {
    var create_value = create;
    var view_value = view;
    var update_value = update;
    var deleted_value = deleted;
    if (is_exist > 0) {
        console.log("updated or not")
        const update_query = `UPDATE permissions SET module_id='${module_id}',sub_module_id='${sub_module_id}',module_of_sub_module='${module_of_sub_module_id}',role_id='${role_id}', created='${create_value}',viewed='${view_value}',updated='${update_value}',deleted='${deleted_value}' WHERE id='${is_exist}'`;
        await db.query(update_query);
    } else {
        console.log("inserted or not")
        const insert_query = `INSERT INTO permissions(module_id, sub_module_id, module_of_sub_module, role_id, created, viewed, updated, deleted) VALUES ('${module_id}','${sub_module_id}','${module_of_sub_module_id}','${role_id}','${create_value}','${view_value}','${update_value}','${deleted_value}')`;
        await db.query(insert_query);
    }

}


async function getPermissionOfModulesUsingRoleId(module_id, sub_module_id, module_of_sub_module, role_id) {
    
    var sql_query = "";
    if (sub_module_id > 0 && module_of_sub_module == 0) {
        console.log("cross check 1")
        sql_query = `SELECT id, module_id, sub_module_id, module_of_sub_module, role_id, user_id, created, viewed, updated, deleted FROM permissions WHERE module_id='${module_id}' AND sub_module_id='${sub_module_id}' AND role_id='${role_id}'`;

    } else if (sub_module_id > 0 && module_of_sub_module > 0) {
        console.log("cross check 2")

        sql_query = `SELECT id, module_id, sub_module_id, module_of_sub_module, role_id, user_id, created, viewed, updated, deleted FROM permissions WHERE module_id='${module_id}' AND sub_module_id='${sub_module_id}' AND module_of_sub_module='${module_of_sub_module}' AND role_id='${role_id}'`;

    } else {
        console.log("cross check 3")

        sql_query = `SELECT id, module_id, sub_module_id, module_of_sub_module, role_id, user_id, created, viewed, updated, deleted FROM permissions WHERE module_id='${module_id}' AND role_id='${role_id}'`;
    }
    const resultData = await db.query(sql_query);
    if (resultData.length > 0) {
        return resultData;
    } else {
        return [];
    }
}

async function getSubModuleWithSubModulesWithPermission(module_id, role_id) {
    const sql = `SELECT * FROM sub_modules WHERE module_id='${module_id}' AND status = '1'`;
    const sqlResult = await db.query(sql);
    if (sqlResult.length > 0) {
        let indexOfModuleId7 = -1;
        for (let index = 0; index < sqlResult.length; index++) {
            const element = sqlResult[index];
            var modulePermissData = await getPermissionOfModulesUsingRoleId(element.module_id, element.id, 0, role_id);

            var create_permission = 0;
            var view_permission = 0;
            var delete_permission = 0;
            var update_permission = 0;
            if (modulePermissData.length > 0) {
                create_permission = modulePermissData[0].created;
                view_permission = modulePermissData[0].viewed;
                delete_permission = modulePermissData[0].deleted;
                update_permission = modulePermissData[0].updated;
            }
            sqlResult[index].create = create_permission;
            sqlResult[index].view = view_permission;
            sqlResult[index].delete = delete_permission;
            sqlResult[index].update = update_permission;
            sqlResult[index].modulesOfSubModule = await moduleOfSubModulePermission(element.module_id, element.id, role_id);

            // Check if module_id is 7
            if (element.module_id === 7) {
                indexOfModuleId7 = index;
            }
        }

        // Move the record with module_id 7 to the top
        if (indexOfModuleId7 !== -1) {
            const module7Record = sqlResult.splice(indexOfModuleId7, 1)[0];
            sqlResult.unshift(module7Record);
        }
    }
    return sqlResult;
}


async function moduleOfSubModulePermission(module_id, sub_module_id, role_id) {
    const modulesOfSubModule = await db.query(`SELECT * FROM module_of_sub_modules WHERE sub_module_id = '${sub_module_id}' AND status = '1'`);

    if (modulesOfSubModule.length > 0) {
        for (let index = 0; index < modulesOfSubModule.length; index++) {
            const element = modulesOfSubModule[index];
            var modulePermissData = await getPermissionOfModulesUsingRoleId(module_id, sub_module_id, element.id, role_id);

            var create_permission = 0;
            var view_permission = 0;
            var delete_permission = 0;
            var update_permission = 0;
            if (modulePermissData.length > 0) {
                create_permission = modulePermissData[0].created;
                view_permission = modulePermissData[0].viewed;
                delete_permission = modulePermissData[0].deleted;
                update_permission = modulePermissData[0].updated;
            }
            modulesOfSubModule[index].create = create_permission;
            modulesOfSubModule[index].view = view_permission;
            modulesOfSubModule[index].delete = delete_permission;
            modulesOfSubModule[index].update = update_permission;
        }
    }
    return modulesOfSubModule;

}

async function getSubModuleWithSubModulesWithForPermissionCheck(sub_module_id, module_of_sub_module_id, role_id) {
    const sql = `SELECT * FROM sub_modules WHERE id='${sub_module_id}' AND status = '1'`;
    const sqlResult = await db.query(sql);
    if (sqlResult.length > 0) {
        for (let index = 0; index < sqlResult.length; index++) {
            const element = sqlResult[index];
            var modulePermissData = await getPermissionOfModulesUsingRoleId(element.module_id, element.id, 0, role_id);

            var create_permission = 0;
            var view_permission = 0;
            var delete_permission = 0;
            var update_permission = 0;
            if (modulePermissData.length > 0) {
                create_permission = modulePermissData[0].created;
                view_permission = modulePermissData[0].viewed;
                delete_permission = modulePermissData[0].deleted;
                update_permission = modulePermissData[0].updated;
            }
            sqlResult[index].create = create_permission;
            sqlResult[index].view = view_permission;
            sqlResult[index].delete = delete_permission;
            sqlResult[index].update = update_permission;
            sqlResult[index].modulesOfSubModule = await moduleOfSubModulePermissionCheck(element.module_id, element.id, module_of_sub_module_id, role_id);
        }
    }
    return sqlResult;
}

async function moduleOfSubModulePermissionCheck(module_id, sub_module_id, module_of_sub_module_id, role_id) {
    const modulesOfSubModule = await db.query(`SELECT * FROM module_of_sub_modules WHERE id = '${module_of_sub_module_id}' AND status = '1'`);

    if (modulesOfSubModule.length > 0) {
        for (let index = 0; index < modulesOfSubModule.length; index++) {
            const element = modulesOfSubModule[index];
            var modulePermissData = await getPermissionOfModulesUsingRoleId(module_id, sub_module_id, element.id, role_id);

            var create_permission = 0;
            var view_permission = 0;
            var delete_permission = 0;
            var update_permission = 0;
            if (modulePermissData.length > 0) {
                create_permission = modulePermissData[0].created;
                view_permission = modulePermissData[0].viewed;
                delete_permission = modulePermissData[0].deleted;
                update_permission = modulePermissData[0].updated;
            }
            modulesOfSubModule[index].create = create_permission;
            modulesOfSubModule[index].view = view_permission;
            modulesOfSubModule[index].delete = delete_permission;
            modulesOfSubModule[index].update = update_permission;
        }
    }
    return modulesOfSubModule;

}

async function getAndCheckModulePermissionForAction(module_id, sub_module_id, module_of_module_id, role_id, action) {

    try {
        let sb_id = sub_module_id;
        let m_sb_id = module_of_module_id;
        if (sub_module_id == null || sub_module_id == '') {
            sb_id = 0
        }
        if (module_of_module_id == null || module_of_module_id == '') {
            m_sb_id = 0
        }

        var selectQuery = `SELECT ${action} FROM permissions WHERE module_id = '${module_id}' AND sub_module_id = '${sb_id}' AND module_of_sub_module = '${m_sb_id}' AND role_id = ${role_id}`;
        const queryResult = await db.query(selectQuery);
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

async function getGstMasterDetails(id) {
    const query = `SELECT title FROM gst_master WHERE id = ?`;
    const result = await db.query(query, [id]);
    return result[0]?.title ?? '';
}


async function accountsTransaction(account_id, user_id, transaction, amount, updated_balance, transaction_id, description) {
    const query = await db.query(`
        INSERT INTO account_transactions 
        SET user_id=?, account_id=?, status=?, transaction=?, transaction_id=?, updated_balance=?, description=?
    `, [user_id, account_id, transaction, amount, transaction_id, updated_balance, description]);
    return query;
}

async function getLastBalanceOfAccount(id) {
    const query = await db.query(`SELECT * FROM accounts WHERE id=? ORDER BY id DESC LIMIT 1 `, [id])
    return query[0].balance
}

async function checkComplaintAssignOrNot(id) {
    try {
        const query = await db.query(`SELECT * FROM complaints_timeline WHERE complaints_id=? AND status='assigned' AND free_end_users = 1 `, [id])
        if (query.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return error.message;
    }
}

async function checkComplaintAssignToGetEndUser(id) {
    try {
        const query = await db.query(`SELECT * FROM complaints_timeline WHERE complaints_id=? AND status='assigned' `, [id]) //AND free_end_users = 1
        if (query.length > 0) {
            return query;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}


async function getCompanyName(energy_company_id, complaint_for = null) {
    let queryResult;
    if (complaint_for == 1) {
        queryResult = await db.query(`SELECT * FROM energy_companies WHERE id = ?`, [energy_company_id]);
        return queryResult[0].name;

    } else {
        queryResult = await db.query(`SELECT * FROM companies WHERE company_id = ?`, [energy_company_id]);
        return queryResult[0].company_name;
    }
}


async function getFinancialYear() {
    const today = new Date();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    let financialYearStart;
    let financialYearEnd;

    if (currentMonth >= 3) {
        // If the current month is April or later, the financial year has started
        financialYearStart = new Date(today.getFullYear(), 3, 1);
        financialYearEnd = new Date(today.getFullYear() + 1, 2, 31);
    } else {
        // If the current month is before April, the financial year starts in the previous year
        financialYearStart = new Date(today.getFullYear() - 1, 3, 1);
        financialYearEnd = new Date(today.getFullYear(), 2, 31);
    }

    const startYear = financialYearStart.getFullYear().toString().slice(-2);
    const endYear = financialYearEnd.getFullYear().toString().slice(-2);

    return startYear + endYear + currentMonth;
}


async function getComplaintsTimelineId(assign_to) {
    const selectQuery = await db.query(
        'SELECT id FROM complaints_timeline WHERE status = ? AND assign_to IN (?)',
        ['assigned', assign_to]
    );
    // Assuming selectQuery is an array of objects with 'id' property
    const ids = selectQuery.map(item => item.id);
    return ids;
}


async function usersToManager(x) {
    try {
        const final = [];
        let result;
        const queryResult = await db.query(`SELECT id, name, employee_id, image, supervisor_id FROM users WHERE id = ?`, [x]);
        if (queryResult.length > 0) {
            const supervisor_id = queryResult[0].supervisor_id;
            const getManagerDetailsQueryResult = await db.query(`SELECT id, name, employee_id, image, manager_id FROM users WHERE id = ?`, [supervisor_id]);

            if (getManagerDetailsQueryResult.length > 0) {
                const manager_id = getManagerDetailsQueryResult[0].manager_id;
                const areaManagerDetails = await db.query(`SELECT id, name, employee_id, image FROM users WHERE id = ?`, [manager_id]);
                // get supervisor on manager id
                if (areaManagerDetails.length > 0) {

                    final.push({
                        areaManagerDetails: areaManagerDetails.map(row => ({ ...row }))[0],
                        superVisorDetails: getManagerDetailsQueryResult[0]
                    });

                    return {
                        status: true,
                        message: "Area Manager found",
                        data: final
                    };
                } else {
                    return {
                        status: false,
                        message: "Area Manager not found"
                    };
                }
            } else {
                return {
                    status: false,
                    message: "Area Manager not found"
                };
            }
        } else {
            return {
                status: false,
                message: "User not found"
            };
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        };
    }
}


async function toGetManagerToSupervisor(id) {
    let allUsers = [];

    // Check if the provided ID belongs to an area manager
    const isAreaManager = await db.query(`SELECT COUNT(*) as count FROM users WHERE id = '${id}' AND manager_id IS NULL`);

    if (isAreaManager[0].count > 0) {
        // If the provided ID belongs to an area manager, fetch all supervisors and end users under them
        const supervisors = await db.query(`SELECT id FROM users WHERE manager_id = '${id}'`);
        const endUsers = await db.query(`SELECT id FROM users WHERE supervisor_id IN (SELECT id FROM users WHERE manager_id = '${id}')`);
        allUsers = [id, ...supervisors.map(s => s.id), ...endUsers.map(e => e.id)];
    } else {
        // If the provided ID belongs to a supervisor, fetch all end users under them
        const supervisorEndUsers = await db.query(`SELECT id FROM users WHERE supervisor_id = '${id}'`);

        allUsers = [id, ...supervisorEndUsers.map(user => user.id)];

        // Check if the provided ID is an end user, if so, add it to the list of users
        const isEndUser = await db.query(`SELECT COUNT(*) as count FROM users WHERE id = '${id}' AND supervisor_id IS NOT NULL`);
        if (isEndUser[0].count > 0) {
            allUsers.push(id);
        }
    }

    // Fetch last balance for all users (supervisors and end users)
    // const getLastBalanceQuery = `SELECT user_wallets.*, users.name, users.username, users.image, users.email, users.mobile, users.employee_id FROM user_wallets left join users ON users.id = user_wallets.user_id WHERE user_id IN (${allUsers.map(userID => `'${userID}'`).join(',')})`;


    const getLastBalanceQuery = `SELECT user_wallets.*, users.name, users.username, users.image, users.email, users.mobile, users.employee_id FROM users LEFT JOIN user_wallets ON users.id = user_wallets.user_id WHERE user_wallets.user_id IN (${allUsers.map(userID => `'${userID}'`).join(',')})`;

    const result = await db.query(getLastBalanceQuery);
    return result;
}


// async function getUsersData(id) {
//     const outletId = JSON.parse(id)
//     var sql = '';
//     if (typeof outletId == 'object') {
//         const commaSeparated = outletId.join(",");
//         sql = `SELECT id as user_id, name, image FROM users WHERE id IN(${commaSeparated})`
//     }
//     else {
//         sql = `SELECT id as outlet_id, outlet_name FROM outlets WHERE id='${id}'`;
//     }

//     const result = await db.query(sql);

//     if (result.length > process.env.VALUE_ZERO) {
//         return result;
//     }
//     else {
//         return [{ outlet_name: '', outlet_id: '' }];
//     }
// }


async function checkAccountNumber(accounts) {
    const accountNumbers = accounts.map(account => account.account_number);
    const sql = `SELECT * FROM accounts WHERE account_number IN (?)`;
    const result = await db.query(sql, [accountNumbers]);

    if (result.length > 0) {
        return result;
    } else {
        return [];
    }
}


async function filterTransactionsByDate(date) {
    try {
        const currentDate = moment();
        let startDate, endDate;
        switch (date) {
            case 'today':
                startDate = moment(currentDate).startOf('day');
                endDate = moment(currentDate).endOf('day');
                break;
            case 'yesterday':
                startDate = moment(currentDate).subtract(1, 'day').startOf('day');
                endDate = moment(currentDate).subtract(1, 'day').endOf('day');
                break;
            case 'thisWeek':
                startDate = moment(currentDate).startOf('week');
                endDate = moment(currentDate).endOf('week');
                break;
            case 'lastWeek':
                startDate = moment(currentDate).subtract(1, 'week').startOf('week');
                endDate = moment(currentDate).subtract(1, 'week').endOf('week');
                break;
            case 'thisMonth':
                startDate = moment(currentDate).startOf('month');
                endDate = moment(currentDate).endOf('month');
                break;
            case 'lastMonth':
                startDate = moment(currentDate).subtract(1, 'month').startOf('month');
                endDate = moment(currentDate).subtract(1, 'month').endOf('month');
                break;
            case 'thisQuarter':
                startDate = moment(currentDate).startOf('quarter');
                endDate = moment(currentDate).endOf('quarter');
                break;
            case 'lastQuarter':
                startDate = moment(currentDate).subtract(1, 'quarter').startOf('quarter');
                endDate = moment(currentDate).subtract(1, 'quarter').endOf('quarter');
                break;
            case 'last6Months':
                startDate = moment(currentDate).subtract(6, 'months').startOf('month');
                endDate = moment(currentDate).endOf('month');
                break;
            case 'last12Months':
                startDate = moment(currentDate).subtract(12, 'months').startOf('month');
                endDate = moment(currentDate).endOf('month');
                break;
            default:
                // if (/^\d{4}$/.test(date)) { // Check if filter is a valid year
                //     startDate = moment(date, 'YYYY').startOf('year');
                //     endDate = moment(date, 'YYYY').endOf('year');
                if (/^\d{4}-\d{4}$/.test(date)) { // Check if filter is a valid financial year format
                    const [startYear, endYear] = date.split('-');
                    startDate = moment(`${startYear}-04-01`, 'YYYY-MM-DD').startOf('day');
                    endDate = moment(`${endYear}-03-31`, 'YYYY-MM-DD').endOf('day');
                } else {
                    throw new Error('Invalid filter');
                }

        }

        return { startDate, endDate }
    } catch (error) {
        return error;
    }
}

async function updateOrNotFund(lastUpdatedTimestamp) {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const currentTime = Date.now();
    const timeDifference = currentTime - lastUpdatedTimestamp;
    return timeDifference < TWENTY_FOUR_HOURS;
}

async function getSupplierDetailsById(id) {
    const selectQuery = await db.query(`SELECT id, supplier_name from suppliers where id = '${id}'`)
    // return ;
    if (selectQuery.length > 0) {
        return selectQuery;
    }else{
        return [{id:"", supplier_name:""}];
    }
}


async function totalComplaintsStockPunch(id) {

    const selectQuery = await db.query(`SELECT COUNT(DISTINCT complaint_id) as totalComplaintsPunch FROM stock_punch_histories WHERE user_id = '${id}' AND MONTH(punch_at) = MONTH(CURDATE()) AND YEAR(punch_at) = YEAR(CURDATE());`)
    if (selectQuery.length > 0) {
        return selectQuery[0].totalComplaintsPunch
    } else {
        return 0;
    }
}

async function totalComplaintsPunch(id) {

    const selectQuery = await db.query(`SELECT COUNT(DISTINCT complaint_id) as totalComplaintsPunch FROM expense_punch_history WHERE user_id = '${id}' AND MONTH(punch_at) = MONTH(CURDATE()) AND YEAR(punch_at) = YEAR(CURDATE());`)
    if (selectQuery.length > 0) {
        return selectQuery[0].totalComplaintsPunch
    } else {
        return 0;
    }
}

async function getComplaintDetails(complaintId, id) {
    try {
        let complaintDetails = {}
        let company_name
        const selectQuery = `SELECT * FROM complaints WHERE id = ?`
        const result = await db.query(selectQuery, complaintId);

        if (result.length > process.env.VALUE_ZERO) {
            //complaints type details
            const complaintType = await getComplaintTypeById(result[0].complaint_type);

            if (result[0].complaint_for == '1') {
                const energyCompanyName = await getEnergyCompaniesById(result[0].energy_company_id);
                company_name = energyCompanyName.name;
                // const selectedOutlets = await getOutletById(result[0].outlet_id);
                // outlet_name = selectedOutlets;
            }
            else {
                const energyCompanyName = await getCompanyDetailsById(result[0].energy_company_id);
                company_name = energyCompanyName.company_name;
            }
            const selectedRegionalOffices = await getRegionalNameById(result[0].ro_id);
            const selectedSaleAreas = await getSaleAreaNameById(result[0].sale_area_id);
            const selectedDistricts = await getDistrictById(result[0].district_id);
            const complaintRaiserData = await complaintRaiseBy(result[0].created_by);
            const complaintRaiserDetails = {
                "name": complaintRaiserData.name ? complaintRaiserData.name : "",
                "image": complaintRaiserData.image
            }

            const getOrderByDetails = await getUserDetails(result[0].order_by_id);
            var order_by_name = '';
            if (getOrderByDetails.length > 0) {
                order_by_name = getOrderByDetails[0].name ? getOrderByDetails[0].name : "";
            }



            complaintDetails = {
                "complaint_unique_id": result[0].complaint_unique_id,
                "complaint_id": result[0].id,
                "complaint_type": complaintType.complaint_type_name,
                "complaint_description": result[0].description,
                "complaint_generated_at": moment(result[0].created_at).format("YYYY-MM-DD HH:mm:ss A"),
                "complaintRaiserDetails": complaintRaiserDetails,
                companyDetails: {
                    selectedRegionalOffices: selectedRegionalOffices,
                    selectedSaleAreas: selectedSaleAreas,
                    selectedDistricts: selectedDistricts,
                    selectedOrdersBy: order_by_name,
                    company_name: company_name
                }
            }

        }
        return complaintDetails

    } catch (error) {
        return error.message
    }


}


const getComplaintUniqueId = async (complaintId) => {

    if (complaintId != null) {
        const selectQuery = `SELECT id, complaints.energy_company_id, complaints.complaint_unique_id, complaint_for, sale_area_id, outlet_id FROM complaints WHERE id = ?`
        const result = await db.query(selectQuery, complaintId);
        if (result.length > 0) {

            return result[0]
        }else{
            return '';
        }
    } else {
        return '';
    }
}


async function getComplaintUniqueIdInPayment(complaintId){
    if (complaintId != null) {
        const selectQuery = `SELECT id, complaints.energy_company_id, complaints.complaint_unique_id, complaint_for, sale_area_id, outlet_id FROM complaints WHERE id = ? AND payment_paid_status = '0'`
        const result = await db.query(selectQuery, complaintId)
        if (result.length > 0) {

            return result[0]
        }else{
            return '';
        }
    } else {
        return '';
    }
}

async function getComplaintUniqueIdInPaymentForRo(complaintId){
    if (complaintId != null) {
        const selectQuery = `SELECT id, complaints.energy_company_id, complaints.complaint_unique_id, complaint_for, sale_area_id, outlet_id, ro_id FROM complaints WHERE id = ? AND ro_paid_status = '0'`
        const result = await db.query(selectQuery, complaintId)
        if (result.length > 0) {

            return result[0]
        }else{
            return '';
        }
    } else {
        return '';
    }
}


async function getUserWalletBalance(userId) {
    if (userId) {
        const selectQuery = await db.query(`SELECT * FROM user_wallets WHERE user_id ='${userId}'`)
        if (selectQuery.length > 0) {
            return selectQuery[0].balance
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

async function getUserFundAmount(id) {

    const selectQuery = await db.query(`SELECT SUM(transfer_amount) as total_transfer_amount, SUM(expense_transfer_amounts) as expense_punch_amount FROM fund_requests WHERE request_by= '${id}'`);

    if (selectQuery.length > 0) {
        const remaining_amount = Number(selectQuery[0].total_transfer_amount) - Number(selectQuery[0].expense_punch_amount);
        return remaining_amount;
    } else {
        throw new Error("No data found for the user ID.");
    }

}


function groupDataByItemName(dataArray, currentMonthFormatted) {
    const groupedData = {};
    const prevMonthItems = {};
    const usersMap = {};
    let currentMonthTotalSum = 0; // Total sum for current month
    let prevMonthTotalSum = 0; // Total sum for previous month

    dataArray.forEach(item => {
        item.users.forEach(user => {
            if (!usersMap[user.id]) {
                usersMap[user.id] = user;
            }
        });

        item.data.forEach(dataItem => {
            const isCurrentMonth = dataItem.formattedMonth === currentMonthFormatted;
            const itemNameKey = dataItem.item_name || dataItem.new_item;
            const targetObject = isCurrentMonth ? groupedData : prevMonthItems;

            if (!targetObject[itemNameKey]) {
                targetObject[itemNameKey] = {
                    totalSum: 0,
                    remainingQty: 0,
                    remainingAmount: 0,
                    data: []
                };
            }

            const itemBalance = Math.abs(dataItem.balance || 0); // Convert to positive
            const requestQty = dataItem.request_qty || 0;
            const itemPrice = dataItem.item_price || 0;
            const expenseTransferQty = dataItem.expense_transfer_quantity || 0;
            const expenseTransferAmounts = dataItem.expense_transfer_amounts || 0;

            const remainingQty = requestQty - expenseTransferQty;
            const remainingAmount = (itemPrice * requestQty) - (expenseTransferQty * itemPrice);

            targetObject[itemNameKey].totalSum += itemBalance;
            targetObject[itemNameKey].remainingQty += remainingQty;
            targetObject[itemNameKey].remainingAmount += remainingAmount;
            targetObject[itemNameKey].data.push(dataItem);

            if (isCurrentMonth) {
                currentMonthTotalSum += itemBalance;
            } else {
                prevMonthTotalSum += itemBalance;
            }
        });
    });

    return {
        users: Object.values(usersMap),
        currentMonth: {
            items: groupedData,
            overallTotalSum: currentMonthTotalSum,
        },
        previousMonth: {
            items: prevMonthItems,
            overallTotalSum: prevMonthTotalSum,
        }
    };
}


async function insertTransactionsImages(user_id, complaint_id, transaction_images) {
    try {
        const insertQuery = await db.query(
            `INSERT INTO stock_transaction_images (user_id, complaint_id, images) VALUES (?,?,?)`,
            [user_id, complaint_id, transaction_images]
        );
        return insertQuery;
    } catch (error) {
        throw error;
    }
}


async function insertTransactionsForExpenseImages(user_id, complaint_id, transaction_images) {
    try {
        const insertQuery = await db.query(
            `INSERT INTO expense_transaction_images (user_id, complaint_id, images) VALUES (?,?,?)`,
            [user_id, complaint_id, transaction_images]
        );
        return insertQuery;
    } catch (error) {
        throw error;
    }
}

async function updateStockRequests(items) {
    try {
        for (const item of items) {
            const itemId = item.id;
            const quantity = item.item_qty;
            const selectQuery = await db.query(`SELECT * FROM stock_punch_histories WHERE id = ?`, [itemId]);
            for (const row of selectQuery) {
                await db.query(
                    `UPDATE stocks SET stock_punch_approve = COALESCE(stock_punch_approve, 0) + ? WHERE id = ?`,
                    [quantity, row.stock_id]
                );
            }
        }
    } catch (error) {
        throw error;
    }
}

async function updateFundRequests(items) {
    try {
        for (const item of items) {
            const itemId = item.id;
            const quantity = item.item_qty;
            const selectQuery = await db.query(`SELECT * FROM expense_punch_history WHERE id = ?`, [itemId]);
            for (const row of selectQuery) {
                await db.query(
                    `UPDATE fund_requests SET expense_approve_qty = COALESCE(expense_approve_qty, 0) + ? WHERE id = ?`,
                    [quantity, row.fund_id]
                );
            }
        }
    } catch (error) {
        throw error;
    }
}


function countUniqueItems(itemsArray) {
    const uniqueItems = new Set(); // Using a Set to store unique item names
    itemsArray.forEach(item => {
        if (item.item_name && item.item_name.label) {
            uniqueItems.add(item.item_name.label); // Add item name to Set
        }
    });
    return uniqueItems.size; // Return the size of unique items Set
}

function countAllTransactions(itemsArray) {
    let totalTransactions = 0; // Initialize total transactions count

    itemsArray.forEach(item => {
        if (item.transaction_id) {
            totalTransactions++; // Increment count for each transaction ID found
        }
    });

    return totalTransactions; // Return the total count of transactions
}


async function getTotalExpenseItems(user_id, complaint_id) {
    const selectQuery = await db.query(`SELECT COUNT(DISTINCT CASE WHEN approved_qty != 0 THEN item_id END) AS total_items, expense_punch_history.* FROM expense_punch_history WHERE user_id = '${user_id}' AND complaint_id = '${complaint_id}' GROUP BY user_id, complaint_id;`);
    return selectQuery;
}

async function getTotalStockPunchItems(user_id, complaint_id) {
    const selectQuery = await db.query(`SELECT COUNT(DISTINCT CASE WHEN approved_qty != 0 THEN item_id END) AS total_items, stock_punch_histories.* FROM stock_punch_histories WHERE user_id = '${user_id}' AND complaint_id = '${complaint_id}' GROUP BY user_id, complaint_id;`);
    return selectQuery;
}


async function getAdminAndUserDetail(id) {
    const userId = id
    sql = `SELECT id, username, employee_id, image FROM users WHERE id ='${userId}'`
    const result = await db.query(sql)

    if (result.length > process.env.VALUE_ZERO) {
        return result;
    }
    else {
        sql = `SELECT id, name as username, employee_id, image FROM admins WHERE id ='${userId}'`
        const result = await db.query(sql)

        if (result.length > process.env.VALUE_ZERO) {
            return result;
        }
    }
}


const getSalesAreaById = async (salesAreaId) => {
    try {
      // Debug log to ensure salesAreaId is what you expect
  
      // Parse salesAreaId if it's a string representation of an array
      if (typeof salesAreaId === "string") {
        salesAreaId = JSON.parse(salesAreaId);
      }
  
      // Ensure salesAreaId is treated as an array
      if (!Array.isArray(salesAreaId)) {
        throw new Error("salesAreaId is not an array");
      }
  
      // Construct a safe query using placeholders for ids to avoid SQL injection
      const placeholders = salesAreaId.map(() => "?").join(",");
  
      const salesAreaResult = await db.query(
        `SELECT id, sales_area_name FROM sales_area WHERE id IN (${placeholders})`,
        salesAreaId
      );
  
      if (salesAreaResult.length > 0) {
        // Return all sales area names as an array
        return salesAreaResult;
      } else {
        return []; // Return an empty array if no sales areas are found
      }
    } catch (error) {
      return []; // Return an empty array or handle the error appropriately
    }
};

const getRecord = async (tableName, fieldName, value)=>{
    try {
        const recordResult = await db.query(`SELECT * FROM ${tableName} WHERE ${fieldName} =?`, [value]);
        return recordResult;
    } catch (error) {
       console.log(error)
       return []    
    }
}


module.exports = { getAllStoredActiveRoles, getTeamMemberList, getTeamMemberOnId, getSubModule, getSubModuleWithSubModules, getZoneNameById, getRegionalNameById, getSaleAreaNameById, getUsersById, getZoneUsers, getReginalOfficeUsers, getSaleAreaUsers, getZoneSubUsers, getRegionalOfficeSubUsers, getSaleAreaSubUsers, getContractorUsersById, getDealerAllUserById, getPlanModuleById, getPlanCheckLists, getSurveyQuestions, getCreatedUserNameFromAdmin, getAssignFromAdmin, getAssignToSubUser, getUploadedFileExtension, getGstDetailsByCompanyId, getCompanyTypeById, getDistrictById, getOutletById, roleById, getDayNameOnDate, getDifferenceBetweenTime, getPendingContractorUsersById, getTotalTime, calculateAbsentPercentage, calculateInTimePercentage, getMultipleUsersOnId, getNewDifferenceBetweenTwoDays, getDifferenceBetweenTwoDays, getRoleInGroupById, getUserInGroupById, getUserDetails, countUserTotalWorkingDaysInMonth, generateRandomNumber, checkUserHasActiveLoan, getEmployeeSalary, countUserTotalLeaveDaysInMonth, getUserInsuranceDetails, getInsuranceCompanyDetailsById, getEmployeeFullMonthWorkHours, checkUserSalaryDisbursed, getAppliedAllowance, getAppliedDeductions, getUserGrossSalaryInMonth, getAppliedOnAllowanceEmployeeWise, getAppliedOnAllowanceDesignationWise, getReceiverSocketId, saveMessages, getLoggedUserDetails, getEmployeeBaseSalary, checkEmailDuplicacys, historyTimeLine, getQuestionList, getRecipientMessages, createDefaultPermission, calculatePagination, complaintsTimeLineHelper, getComplaintTimeline, getComplaintsApprovalAccess, getEnergyCompaniesById, getComplaintTypeById, complaintApprovedBy, complaintStatusChangedBy, complaintResolvedBy, complaintResolvedBy, complaintRaiseBy, complaintsTimeLineApprovedHelper, complaintsTimeLineAssignTimeLine, complaintApprovalDetails, complaintAssignByDetails, complaintAssignToDetails, getFreeEndUsersCount, countFreeUser, getDbLastComplaintUniqueId, getSupplierDetails, calculateTaxAmount, getCreatedByDetails, getPoDetailById, generateRandomAlphanumeric, checkFinancialYearFormat, getCashRequestStatus, getUsersData, supplierDetails, getAdminDetailsById, calculateAppliedAllowanceForUser, calculateAppliedDeductionForUser, calculateUserActiveLoan, calculateTotalWorkingDay, getOrderViaDetails, getpurchase_order_item, getComplaintUsingIds, getRoleByUserId, getComplaintById, getComplaintAndComplaintTypeById, getCompanyDetailsById, checkAlreadyExistOrNot, insertOrUpdatePermission, getPermissionOfModulesUsingRoleId, getSubModuleWithSubModulesWithPermission, getSubModuleWithSubModulesWithForPermissionCheck, moduleOfSubModulePermissionCheck, getAndCheckModulePermissionForAction, getGstMasterDetails, accountsTransaction, getLastBalanceOfAccount, checkComplaintAssignOrNot, getCompanyName, getFinancialYear, updateComplaintsTimeLineHelper, getComplaintsTimelineId, checkComplaintAssignToGetEndUser, usersToManager, getOrderById, checkAccountNumber, filterTransactionsByDate, generateRandomAlphanumerics, updateOrNotFund, toGetManagerToSupervisor, getSupplierDetailsById, totalComplaintsPunch, getComplaintDetails, getComplaintUniqueId, getUserWalletBalance, getUserFundAmount, groupDataByItemName, insertTransactionsImages, updateStockRequests, countUniqueItems, countAllTransactions, totalComplaintsStockPunch, insertTransactionsForExpenseImages, updateFundRequests, getTotalExpenseItems, getTotalStockPunchItems, getAdminAndUserDetails, getAdminAndUserDetail, get_new_purchase_order_item, getDbLastComplaintUniqueIdInPi, getComplaintsToAreaManager, getComplaintUniqueIdInPayment, getSalesAreaById, getComplaintUniqueIdInPaymentForRo , getRecord }



