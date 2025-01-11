require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { countUserTotalWorkingDaysInMonth, checkUserHasActiveLoan, getEmployeeSalary, countUserTotalLeaveDaysInMonth, getUserInsuranceDetails, getInsuranceCompanyDetailsById, checkUserSalaryDisbursed, getAppliedAllowance, getAppliedDeductions, calculateTaxAmount,
    calculateAppliedAllowanceForUser, calculateUserActiveLoan, calculateAppliedDeductionForUser,
    calculateTotalWorkingDay } = require("../helpers/general")
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { getUserSalaryDisburseHistory, getUserSalaryDueAmount, getUserSalaryDisbursedAmount } = require("../helpers/commonHelper");


// const getAllUserSalaryForDisbursal = async (req, res) => {

//     try {
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         var totalPages = process.env.VALUE_ZERO;
//         var search_cond = "";
//         if (searchData != "") {
//             search_cond = `AND users.name LIKE '%${searchData}%'`;
//         }

//         const selectQuery = `SELECT users.id as user_id, users.user_type, users.name, users.image, salaries.salary FROM salaries LEFT JOIN users ON salaries.user_id = users.id
//         WHERE users.is_deleted='0' GROUP BY users.id ORDER BY users.id ASC`
//         const queryResult1 = await db.query(selectQuery)

//         const constTotalLength = queryResult1.length;
//         totalPages = Math.round((constTotalLength / pageSize));
//         const total = constTotalLength;
//         const pageFirstResult = (currentPage - 1) * pageSize;

//         const month = req.query.month || moment(new Date()).format("YYYY-MM");

//         const selectQuery2 = `SELECT users.id as user_id, users.user_type, users.name, users.image, users.employee_id, users.joining_date, salaries.salary FROM salaries LEFT JOIN users ON salaries.user_id = users.id WHERE users.is_deleted='0' AND DATE_FORMAT(users.joining_date, '%Y-%m') <= '${month}' ${search_cond} GROUP BY users.id ORDER BY users.id ASC LIMIT ${pageFirstResult}, ${pageSize};`


//         const queryResult = await db.query(selectQuery2);

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             var values = [];
//             let loanAmount = 0;
//             let totalDeductionAmount = 0;
//             let totalAllowanceAmount = 0;
//             let finalGrossSalaryAmount = 0;
//             let insuranceAmount = 0;
//             let allowanceAmount = 0;
//             let deductionAmount = 0;
//             const getNumberOfDaysInMonth = 30;
//             for (const row of queryResult) {

//                 //total working days in month
//                 const getUserTotalWorkingDaysInMOnth = await countUserTotalWorkingDaysInMonth(row.user_id, month)

//                 const finalTotalWorkingDays = await calculateTotalWorkingDay(getUserTotalWorkingDaysInMOnth);

//                 //get user insurance premium details 
//                 const getInsuranceDetails = await getUserInsuranceDetails(row.user_id)
//                 const insuranceObj = getInsuranceDetails
//                 if (insuranceObj != null) {
//                     insuranceAmount = parseInt(insuranceObj.insurance_deduction_amount)
//                 } else {
//                     insuranceAmount = 0;
//                 }

//                 //get allowance details
//                 const appliedAllowance = await getAppliedAllowance(row.user_id, row.user_type);
//                 allowanceAmount = await calculateAppliedAllowanceForUser(appliedAllowance, row.salary);

//                 //get all deductions if applied to the specified user or on designations
//                 const appliedDeduction = await getAppliedDeductions(row.user_id, row.user_type)

//                 deductionAmount = await calculateAppliedDeductionForUser(appliedDeduction, row.salary, allowanceAmount);


//                 //get active loan of user
//                 const getUserActiveLoan = await checkUserHasActiveLoan(row.user_id, month);

//                 //loan calculation start here
//                 loanAmount = await calculateUserActiveLoan(getUserActiveLoan, month);
//                 //loan calculation end here    

//                 totalAllowanceAmount = allowanceAmount;
//                 totalDeductionAmount = (deductionAmount + loanAmount + insuranceAmount);
//                 const dailyGrossSalary = ((row.salary + totalAllowanceAmount) / getNumberOfDaysInMonth).toFixed(2);

//                 const dailyDeduction = ((totalDeductionAmount) / getNumberOfDaysInMonth).toFixed(2);
//                 const netGross = (dailyGrossSalary * finalTotalWorkingDays);
//                 const netDeduction = (dailyDeduction * finalTotalWorkingDays);
//                 finalGrossSalaryAmount = (netGross - netDeduction).toFixed(2);
//                 const totalSalaryWithAllowance = (totalAllowanceAmount + row.salary);
//                 //check user salary disbursed or not in that particular month
//                 const userSalaryDisbursed = await checkUserSalaryDisbursed(row.user_id, month, finalGrossSalaryAmount);

//                 // get user previous due salary amount
//                 const currentMonth = moment(month, 'YYYY-MM');
//                 const oneMonthAgo = currentMonth.subtract(1, 'months');
//                 const oneMonthAgoDateFormatted = oneMonthAgo.format('YYYY-MM');
//                 const userSalaryDueAmount = await getUserSalaryDueAmount(row.user_id, oneMonthAgoDateFormatted);

//                 // get user current month disbursed total saalry
//                 const userSalaryDisbursedAmount = await getUserSalaryDisbursedAmount(row.user_id, month);


//                 let final_pay_amounts = 0;
//                 if (moment(userSalaryDueAmount.date).format("YYYY-MM") == month) {
//                     final_pay_amounts = (Number(finalGrossSalaryAmount) - Number(userSalaryDisbursedAmount));
//                 }
//                 else {
//                     const user_due_amount = userSalaryDueAmount.due_amount ? userSalaryDueAmount.due_amount : 0;
//                     final_pay_amounts = (Number(user_due_amount) + Number(finalGrossSalaryAmount) - Number(userSalaryDisbursedAmount));
//                 }
//                 // const final_pay_amount = (userSalaryDueAmount + Number(finalGrossSalaryAmount));

//                 values.push({
//                     user_id: row.user_id,
//                     name: row.name,
//                     image: row.image,
//                     employee_code: row.employee_id,
//                     month: moment(month, "YYYY-MM").format("MMMM"),
//                     allowance: allowanceAmount.toFixed(2),
//                     deduction: totalDeductionAmount.toFixed(2),
//                     salary: row.salary,
//                     totalWorkingDays: finalTotalWorkingDays,
//                     grossSalary: totalSalaryWithAllowance.toFixed(2),
//                     payable_salary: finalGrossSalaryAmount,
//                     is_salary_disbursed: userSalaryDisbursed,
//                     due_amount: userSalaryDueAmount.due_amount,
//                     final_pay_amount: final_pay_amounts.toFixed(2),
//                 });
//             }

//             const pageStartResult = (currentPage - 1) * pageSize + 1;
//             const pageEndResult = Math.min(currentPage * pageSize, total);
//             var pageDetails = [];
//             pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
//             res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", pageDetails: pageDetails[0], data: values })
//         }
//         else {
//             res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
//         }
//     }
//     catch (error) {
//         console.error(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
//     }
// }


// const getAllUserSalaryForDisbursal = async (req, res) => {
//     try {
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const month = req.query.month || moment(new Date()).format("YYYY-MM");
//         let totalPages = 0;
//         let searchCond = "";

//         // Prepare search condition if search data is provided
//         if (searchData) {
//             searchCond = `AND users.name LIKE ?`;
//         }

//         // Initial query to count total records without pagination
//         const countQuery = `SELECT users.id AS user_id, users.user_type, users.name, users.image, salaries.salary 
//                             FROM salaries 
//                             LEFT JOIN users ON salaries.user_id = users.id 
//                             WHERE users.is_deleted = '0' 
//                             GROUP BY users.id, users.user_type, users.name, users.image, salaries.salary 
//                             ORDER BY users.id ASC`;

//         const queryResult1 = await db.query(countQuery, searchData ? [`%${searchData}%`] : []);
//         const totalRecords = queryResult1.length;
//         totalPages = Math.ceil(totalRecords / pageSize);
//         const pageFirstResult = (currentPage - 1) * pageSize;

//         // Main query to fetch user salaries with pagination
//         const selectQuery = `SELECT users.id AS user_id, users.user_type, users.name, users.image, salaries.salary 
//                              FROM salaries 
//                              LEFT JOIN users ON salaries.user_id = users.id 
//                              WHERE users.is_deleted = '0' AND DATE_FORMAT(users.joining_date, '%Y-%m') <= ? ${searchCond} 
//                              GROUP BY users.id, users.user_type, users.name, users.image, salaries.salary 
//                              ORDER BY users.id ASC 
//                              LIMIT ?, ?`;

//         const queryResult = await db.query(selectQuery, [month, pageFirstResult, pageSize]);

//         if (queryResult.length > 0) {
//             let values = [];
//             const getNumberOfDaysInMonth = 30; // Assuming a constant value

//             for (const row of queryResult) {
//                 // Fetch total working days for the user in the specified month
//                 const userTotalWorkingDays = await countUserTotalWorkingDaysInMonth(row.user_id, month);
//                 const finalTotalWorkingDays = await calculateTotalWorkingDay(userTotalWorkingDays);

//                 // Get user insurance premium details
//                 const insuranceDetails = await getUserInsuranceDetails(row.user_id);
//                 const insuranceAmount = insuranceDetails ? parseInt(insuranceDetails.insurance_deduction_amount) : 0;

//                 // Get allowance details
//                 const appliedAllowance = await getAppliedAllowance(row.user_id, row.user_type);
//                 const allowanceAmount = await calculateAppliedAllowanceForUser(appliedAllowance, row.salary);

//                 // Get all deductions for the user
//                 const appliedDeduction = await getAppliedDeductions(row.user_id, row.user_type);
//                 const deductionAmount = await calculateAppliedDeductionForUser(appliedDeduction, row.salary, allowanceAmount);

//                 // Get active loan of user
//                 const activeLoan = await checkUserHasActiveLoan(row.user_id, month);
//                 const loanAmount = await calculateUserActiveLoan(activeLoan, month);

//                 const totalAllowanceAmount = allowanceAmount;
//                 const totalDeductionAmount = deductionAmount + loanAmount + insuranceAmount;
//                 const dailyGrossSalary = ((row.salary + totalAllowanceAmount) / getNumberOfDaysInMonth).toFixed(2);
//                 const dailyDeduction = (totalDeductionAmount / getNumberOfDaysInMonth).toFixed(2);
//                 const netGross = dailyGrossSalary * finalTotalWorkingDays;
//                 const netDeduction = dailyDeduction * finalTotalWorkingDays;
//                 const finalGrossSalaryAmount = (netGross - netDeduction).toFixed(2);
//                 const totalSalaryWithAllowance = (totalAllowanceAmount + row.salary).toFixed(2);

//                 // Check if user salary is disbursed for the month
//                 const userSalaryDisbursed = await checkUserSalaryDisbursed(row.user_id, month, finalGrossSalaryAmount);

//                 // Get user previous due salary amount
//                 const oneMonthAgo = moment(month, 'YYYY-MM').subtract(1, 'months').format('YYYY-MM');
//                 const userSalaryDueAmount = await getUserSalaryDueAmount(row.user_id, oneMonthAgo);

//                 // Get user current month disbursed total salary
//                 const userSalaryDisbursedAmount = await getUserSalaryDisbursedAmount(row.user_id, month);

//                 let finalPayAmount = 0;
//                 if (moment(userSalaryDueAmount.date).format("YYYY-MM") === month) {
//                     finalPayAmount = (Number(finalGrossSalaryAmount) - Number(userSalaryDisbursedAmount));
//                 } else {
//                     const userDueAmount = userSalaryDueAmount.due_amount || 0;
//                     finalPayAmount = (Number(userDueAmount) + Number(finalGrossSalaryAmount) - Number(userSalaryDisbursedAmount));
//                 }

//                 // Push calculated data into the values array
//                 values.push({
//                     user_id: row.user_id,
//                     name: row.name,
//                     image: row.image,
//                     employee_code: row.employee_id,
//                     month: moment(month, "YYYY-MM").format("MMMM"),
//                     allowance: allowanceAmount.toFixed(2),
//                     deduction: totalDeductionAmount.toFixed(2),
//                     salary: row.salary,
//                     totalWorkingDays: finalTotalWorkingDays,
//                     grossSalary: totalSalaryWithAllowance,
//                     payable_salary: finalGrossSalaryAmount,
//                     is_salary_disbursed: userSalaryDisbursed,
//                     due_amount: userSalaryDueAmount.due_amount,
//                     final_pay_amount: finalPayAmount.toFixed(2),
//                 });
//             }

//             const pageStartResult = (currentPage - 1) * pageSize + 1;
//             const pageEndResult = Math.min(currentPage * pageSize, totalRecords);
//             const pageDetails = {
//                 pageSize,
//                 currentPage,
//                 totalPages,
//                 total: totalRecords,
//                 pageStartResult,
//                 pageEndResult
//             };

//             res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", pageDetails, data: values });
//         } else {
//             res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


const getAllUserSalaryForDisbursal = async (req, res) => {
    try {
        console.log("Starting to fetch all user salaries for disbursal...");

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const month = req.query.month || moment(new Date()).format("YYYY-MM");
        // let totalPages = 0;
        // let searchCond = "";

        // console.log(`Page Size: ${pageSize}, Current Page: ${currentPage}, Search Data: ${searchData}, Month: ${month}`);

        // // Prepare search condition if search data is provided
        // if (searchData) {
        //     searchCond = `AND users.name LIKE ?`;
        //     console.log("Search condition added for user name.");
        // }

        // // Initial query to count total records without pagination
        // const countQuery = `SELECT users.id AS user_id, users.user_type, users.name, users.image, salaries.salary 
        //                     FROM salaries 
        //                     LEFT JOIN users ON salaries.user_id = users.id 
        //                     WHERE users.is_deleted = '0' 
        //                     GROUP BY users.id, users.user_type, users.name, users.image, salaries.salary 
        //                     ORDER BY users.id ASC`;

        // const queryResult1 = await db.query(countQuery, searchData ? [`%${searchData}%`] : []);
        // const totalRecords = queryResult1.length;
        // totalPages = Math.ceil(totalRecords / pageSize);
        // const pageFirstResult = (currentPage - 1) * pageSize;

        // console.log(`Total Records: ${totalRecords}, Total Pages: ${totalPages}`);

        // // Main query to fetch user salaries with pagination
        // const selectQuery = `SELECT users.id AS user_id, users.user_type, users.name, users.image,users.employee_id, salaries.salary 
        //                      FROM salaries 
        //                      LEFT JOIN users ON salaries.user_id = users.id 
        //                      WHERE users.is_deleted = '0' AND DATE_FORMAT(users.joining_date, '%Y-%m') <= ? ${searchCond} 
        //                      GROUP BY users.id, users.user_type, users.name, users.image, salaries.salary 
        //                      ORDER BY users.id ASC 
        //                      LIMIT ?, ?`;



        // Assuming you already have `req.user.user_id` and `req.user.user_type`

        let searchCond = "";
        let whereConditions = "users.is_deleted = '0'";
        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;

        // Check if the user has access to view all records or only their own
        if (loggedUserType == 3) { // Replace 'SPECIFIC_TYPE' with actual type that has full access
            // Full access: no additional filter needed on user_id
            console.log("User has full access to view all salary records.");
        } else {
            // Limited access: only show data for the logged-in user
            whereConditions += ` AND users.id = '${loggedUserId}'`;
            console.log("User has limited access, showing only their own salary records.");
        }

        // Prepare search condition if search data is provided
        if (searchData) {
            searchCond = `AND users.name LIKE ?`;
            console.log("Search condition added for user name.");
        }

        // Initial query to count total records without pagination
        const countQuery = `SELECT users.id AS user_id, users.user_type, users.name, users.image, salaries.salary 
                    FROM salaries 
                    LEFT JOIN users ON salaries.user_id = users.id 
                    WHERE ${whereConditions} 
                    ${searchCond} 
                    GROUP BY users.id, users.user_type, users.name, users.image, salaries.salary 
                    ORDER BY users.id ASC`;

        const queryResult1 = await db.query(countQuery, searchData ? [`%${searchData}%`] : []);
        const totalRecords = queryResult1.length;
        totalPages = Math.ceil(totalRecords / pageSize);
        const pageFirstResult = (currentPage - 1) * pageSize;

        console.log(`Total Records: ${totalRecords}, Total Pages: ${totalPages}`);

        // Main query to fetch user salaries with pagination
        const selectQuery = `SELECT users.id AS user_id, users.user_type, users.name, users.image, users.employee_id, salaries.salary 
                     FROM salaries 
                     LEFT JOIN users ON salaries.user_id = users.id 
                     WHERE ${whereConditions} 
                     AND DATE_FORMAT(users.joining_date, '%Y-%m') <= ? 
                     ${searchCond} 
                     GROUP BY users.id, users.user_type, users.name, users.image, salaries.salary 
                     ORDER BY users.id ASC 
                     LIMIT ?, ?`;

        const queryResult = await db.query(selectQuery, [month, ...searchData ? [`%${searchData}%`] : [], pageFirstResult, pageSize]);

        console.log("Query executed successfully.");


        // const queryResult = await db.query(selectQuery, [month, pageFirstResult, pageSize]);
        console.log("Executing main query to fetch user salaries...", queryResult);

        if (queryResult.length > 0) {
            console.log(`Found ${queryResult.length} user salaries to process...`);
            let values = [];
            let salaryDay = 30;
            var getNumberOfDaysInMonth = 30; // Assuming a constant value

            for (const row of queryResult) {
                console.log(`Processing user ID: ${row.user_id}, Name: ${row.name}`);

                // Fetch total working days for the user in the specified month
                const userTotalWorkingDays = await countUserTotalWorkingDaysInMonth(row.user_id, month);
                const finalTotalWorkingDays = await calculateTotalWorkingDay(userTotalWorkingDays);
                console.log(`Total Working Days for user ID ${row.user_id}: ${finalTotalWorkingDays}`);

                if (finalTotalWorkingDays === 31) {
                    getNumberOfDaysInMonth = 30;
                } else {
                    getNumberOfDaysInMonth = finalTotalWorkingDays;
                }

                console.log("getNumberOfDaysInMonth", getNumberOfDaysInMonth);
                // Get user insurance premium details
                const insuranceDetails = await getUserInsuranceDetails(row.user_id);
                const insuranceAmount = insuranceDetails ? parseInt(insuranceDetails.insurance_deduction_amount) : 0;
                console.log(`Insurance Amount for user ID ${row.user_id}: ${insuranceAmount}`);

                // Get allowance details
                const appliedAllowance = await getAppliedAllowance(row.user_id, row.user_type);
                const allowanceAmount = await calculateAppliedAllowanceForUser(appliedAllowance, row.salary);
                console.log(`Allowance Amount for user ID ${row.user_id}: ${allowanceAmount}`);

                // Get all deductions for the user
                const appliedDeduction = await getAppliedDeductions(row.user_id, row.user_type);
                const deductionAmount = await calculateAppliedDeductionForUser(appliedDeduction, row.salary, allowanceAmount);
                console.log(`Deduction Amount for user ID ${row.user_id}: ${deductionAmount}`);

                // Get active loan of user
                const activeLoan = await checkUserHasActiveLoan(row.user_id, month);
                const loanAmount = await calculateUserActiveLoan(activeLoan, month);
                console.log(`Loan Amount for user ID ${row.user_id}: ${loanAmount}`);

                const totalAllowanceAmount = allowanceAmount;
                const totalDeductionAmount = deductionAmount + loanAmount + insuranceAmount;
                const dailyGrossSalary = ((row.salary + totalAllowanceAmount) / salaryDay).toFixed(2);
                const dailyDeduction = (totalDeductionAmount / salaryDay).toFixed(2);
                const netGross = dailyGrossSalary * getNumberOfDaysInMonth;
                const netDeduction = dailyDeduction * getNumberOfDaysInMonth;
                const finalGrossSalaryAmount = Math.ceil(netGross - netDeduction);
                const totalSalaryWithAllowance = (totalAllowanceAmount + row.salary).toFixed(2);

                console.log(`Final Gross Salary for user ID ${row.user_id}: ${finalGrossSalaryAmount}`);

                // Check if user salary is disbursed for the month
                const userSalaryDisbursed = await checkUserSalaryDisbursed(row.user_id, month, finalGrossSalaryAmount);
                console.log(`User ID ${row.user_id} salary disbursed status: ${userSalaryDisbursed}`);

                // Get user previous due salary amount
                const oneMonthAgo = moment(month, 'YYYY-MM').subtract(1, 'months').format('YYYY-MM');
                const userSalaryDueAmount = await getUserSalaryDueAmount(row.user_id, oneMonthAgo);

                // Get user current month disbursed total salary
                const userSalaryDisbursedAmount = await getUserSalaryDisbursedAmount(row.user_id, month);
                console.log(`User ID ${row.user_id} salary due amount: ${userSalaryDueAmount.due_amount}`);

                let finalPayAmount = 0;
                if (moment(userSalaryDueAmount.date).format("YYYY-MM") === month) {
                    finalPayAmount = (Number(finalGrossSalaryAmount) - Number(userSalaryDisbursedAmount));
                } else {
                    const userDueAmount = userSalaryDueAmount.due_amount || 0;
                    finalPayAmount = (Number(userDueAmount) + Number(finalGrossSalaryAmount) - Number(userSalaryDisbursedAmount));
                }

                // Push calculated data into the values array
                values.push({
                    user_id: row.user_id,
                    name: row.name,
                    image: row.image,
                    employee_code: row.employee_id,
                    month: moment(month, "YYYY-MM").format("MMMM"),
                    allowance: allowanceAmount.toFixed(2),
                    deduction: totalDeductionAmount.toFixed(2),
                    salary: row.salary,
                    totalWorkingDays: finalTotalWorkingDays,
                    grossSalary: totalSalaryWithAllowance,
                    payable_salary: finalGrossSalaryAmount,
                    is_salary_disbursed: userSalaryDisbursed,
                    due_amount: userSalaryDueAmount.due_amount,
                    final_pay_amount: finalPayAmount.toFixed(2),
                });
            }

            const pageStartResult = (currentPage - 1) * pageSize + 1;
            const pageEndResult = Math.min(currentPage * pageSize, totalRecords);
            const pageDetails = {
                pageSize,
                currentPage,
                totalPages,
                total: totalRecords,
                pageStartResult,
                pageEndResult
            };

            console.log("Successfully fetched user salaries for disbursal.");
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", pageDetails, data: values });
        } else {
            console.log("No user salary data found.");
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        console.error("Error fetching user salaries:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


const getUserSalaryDisbursalDetailsById = async (req, res) => {

    try {
        const id = req.query.id;
        const month = req.query.month;

        const queryValidate = Joi.object({
            id: Joi.number().positive().integer().required(),
            month: Joi.required()
        })

        const { error } = queryValidate.validate({ id, month })

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const selectQuery = `SELECT users.id as user_id, users.user_type, users.name,  users.image, users.email, users.mobile, users.employee_id, roles.name as role_name FROM users INNER JOIN roles ON roles.id = users.user_type WHERE users.id = ?`
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            let totalDeductionAmount;
            let totalAllowanceAmount;
            let finalGrossSalaryAmount;
            let allowanceAmount = 0;
            let loanAmount = 0;
            let insuranceAmount;
            let deductionAmount = 0;

            //get total working days of month 
            const getUserTotalWorkingDaysInMOnth = await countUserTotalWorkingDaysInMonth(id, month);
            //get total leave days of month
            const getUserTotalLeaveDaysInMOnth = await countUserTotalLeaveDaysInMonth(id, month);

            //get user insurance premium details 
            const getInsuranceDetails = await getUserInsuranceDetails(id);

            const insuranceObj = getInsuranceDetails
            let insuranceCompanyDetails;
            if (insuranceObj != null) {
                insuranceAmount = parseInt(insuranceObj.insurance_deduction_amount)
                // get insurance company,plan, and premium details
                insuranceCompanyDetails = await getInsuranceCompanyDetailsById(insuranceObj.id)
            }
            else {
                insuranceAmount = 0;
                insuranceCompanyDetails = [];
            }

            //get users salary
            const getUserSalary = await getEmployeeSalary(id);

            const userType = queryResult[0].user_type;

            //get allowance details
            const appliedAllowance = await getAppliedAllowance(id, userType)
            let allowanceDetails = [];
            if (appliedAllowance != null) {
                if (appliedAllowance.length > 0) {
                    for (let row of appliedAllowance) {

                        let employee_value;

                        if (row.value_type === '1') {
                            employee_value = '₹ ' + row.value;
                        }
                        else {
                            employee_value = row.value + '%';
                        }



                        allowanceDetails.push({
                            id: row.id,
                            name: row.name,
                            value: employee_value,
                        })
                    }
                }
            }
            allowanceAmount = await calculateAppliedAllowanceForUser(appliedAllowance);

            //get deduction details
            const appliedDeduction = await getAppliedDeductions(id, userType);

            let deductionDetails = [];
            if (appliedDeduction != null) {
                if (appliedDeduction.length > 0) {
                    for (let row of appliedDeduction) {
                        let employee_value;
                        let employer_value;

                        if (row.value_type === '1') {
                            employee_value = '₹' + row.by_employee;
                            employer_value = '₹' + row.by_employer
                        }
                        else {
                            employee_value = row.by_employee + '%';
                            employer_value = row.by_employer + '%';
                        }

                        deductionDetails.push({
                            id: row.id,
                            name: row.name,
                            value: row.value,
                            by_employee: employee_value,
                            by_employer: employer_value
                        })
                    }


                }
            }

            deductionAmount = await calculateAppliedDeductionForUser(appliedDeduction, getUserSalary[0].salary, allowanceAmount);

            //get active loan of user
            const getUserActiveLoan = await checkUserHasActiveLoan(id, month);

            loanAmount = await calculateUserActiveLoan(getUserActiveLoan, month);
            //loan calculation end here    
            let salaryDay = 30;
            var fixedWorkingDaysForSalary = 30; // Use 30 days for salary calculation
            const actualWorkingDaysInMonth = await calculateTotalWorkingDay(getUserTotalWorkingDaysInMOnth); // Actual working days

            if (actualWorkingDaysInMonth === 31) {
                fixedWorkingDaysForSalary = 30;
            } else {
                fixedWorkingDaysForSalary = actualWorkingDaysInMonth;
            }
            console.log("finalTotalWorkingDays", actualWorkingDaysInMonth);

            totalAllowanceAmount = allowanceAmount;
            totalDeductionAmount = deductionAmount + loanAmount + insuranceAmount;

            // Salary calculation based on 30 days
            const dailyGrossSalary = ((getUserSalary[0].salary + totalAllowanceAmount) / salaryDay).toFixed(2);
            const dailyDeduction = (totalDeductionAmount / salaryDay).toFixed(2);

            // Use actual working days to calculate net values
            const netGross = (dailyGrossSalary * fixedWorkingDaysForSalary);
            const netDeduction = (dailyDeduction * fixedWorkingDaysForSalary);

            console.log("check ----------------", dailyGrossSalary, actualWorkingDaysInMonth, netGross, netDeduction);

            // Final gross salary after deductions
            finalGrossSalaryAmount = Math.ceil(netGross - netDeduction);
            console.log("Final Gross Salary Amount:", finalGrossSalaryAmount);

            // get users salary disburse history
            const salaryDisburseHistory = await getUserSalaryDisburseHistory(id, month);

            for (const row of queryResult) {
                values.push({
                    user_id: row.user_id,
                    
                    user_name: row.name,
                    user_image: row.image,
                    user_email: row.email,
                    user_mobile: row.mobile,
                    employee_code: row.employee_id,
                    user_role: row.role_name,
                    loan_number: getUserActiveLoan.loan_id,
                    loan_amount: getUserActiveLoan.repayment_amount,
                    loan_term: getUserActiveLoan.loan_term,
                    total_working_days: actualWorkingDaysInMonth,
                    total_leaves: getUserTotalLeaveDaysInMOnth.total_days,
                    base_salary: getUserSalary[0].salary,
                    insurance: insuranceCompanyDetails, //insuranceCompanyDetails[0],
                    allowance: allowanceDetails,
                    deduction: deductionDetails,
                    total_working_day_salary: finalGrossSalaryAmount,
                    gross_salary: finalGrossSalaryAmount,
                    totalAllowanceAmount: totalAllowanceAmount.toFixed(2),
                    totalDeductionAmount: totalDeductionAmount.toFixed(2),
                    salaryDisburseHistory: salaryDisburseHistory
                })
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values[0] })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Details not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const markSalaryDisbursed = async (req, res) => {

    try {
        const { user_id, gross_salary, month, amount,
            transaction_number,
            transaction_mode, payable_amount, due_amount, final_pay_amount } = req.body

        const formValidation = Joi.object({
            user_id: Joi.number().required(),
            gross_salary: Joi.number().required(),
            month: Joi.required(),
            // amount: Joi.number().required(),

        }).options({ allowUnknown: true })
        const { error } = formValidation.validate(req.body)

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        //check user salary not disbursed in that month
        const dateObj = moment(month, "YYYY-MM-DD");
        const formattedMonth = dateObj.format("MM");
        const year = dateObj.format("YYYY");

        let slip_number;
        var queryResult;
        let gross_salary_sb_id;
        //get last pay slip number
        const checkSlipNumber = await db.query(`SELECT * FROM salary_disburses ORDER BY id dESC LIMIT 1`);

        if (checkSlipNumber.length > process.env.VALUE_ZERO) {
            const addedNumber = await incrementAfterZero(checkSlipNumber[0].slip_number);
            slip_number = addedNumber;
        } else {
            slip_number = "MCS" + moment(month).format("DDMMYYYY") + "001";
        }
        //check user salary not disbursed in that month
        const checkUserSalaryExistOrNot = await db.query(`SELECT * FROM salary_disburses WHERE user_id = ? AND MONTH(month) = ?`, [user_id, formattedMonth])
        if (checkUserSalaryExistOrNot.length > process.env.VALUE_ZERO) {

            const dbAmount = Number(checkUserSalaryExistOrNot[0].gross_salary);

            gross_salary_sb_id = checkUserSalaryExistOrNot[0].id
            const finalAmount = (dbAmount + Number(amount));
            // update disbursal amount

            const updateQuery = `UPDATE salary_disburses SET gross_salary = ? WHERE user_id = ? AND MONTH(month) = ?`;
            const updateValues = [finalAmount, user_id, formattedMonth];
            queryResult = await db.query(updateQuery, updateValues);

        }
        else {
            //insert salary disbursed
            const insertQuery = `INSERT INTO salary_disburses(user_id, gross_salary, month, slip_number, created_by) VALUES(?, ?, ?, ?, ?)`;

            const insertValues = [user_id, gross_salary, month, slip_number, req.user.user_id];
            queryResult = await db.query(insertQuery, insertValues);
            gross_salary_sb_id = queryResult.insertId;
        }

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            let db_due_amount = 0;
            let db_opening_balance = 0;
            // check user has alreadt opening balance and due amount is present in that month or not
            const sqlDisburseHistoryQuery = await db.query(`SELECT amount, due_amount, opening_balance FROM salary_disburse_histories WHERE user_id = '${user_id}' AND YEAR(date) = '${year}' AND MONTH(date) = '${formattedMonth}' ORDER BY id DESC LIMIT 1`);


            if (sqlDisburseHistoryQuery.length > process.env.VALUE_ZERO) {

                db_opening_balance = sqlDisburseHistoryQuery[0].due_amount;
                db_due_amount = (db_opening_balance - amount);
            }
            else {
                db_opening_balance = Number(final_pay_amount);
                db_due_amount = (db_opening_balance - Number(amount));
            }


            // manage salary disbursed history
            const gross_salary_id = gross_salary_sb_id;
            const historyInsertQuery = `INSERT INTO salary_disburse_histories(gross_salary_id, user_id, date, amount, opening_balance, due_amount, transaction_number, transaction_mode, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const historyInsertValues = [gross_salary_id, user_id, month, amount, db_opening_balance, db_due_amount, transaction_number, transaction_mode, req.user.user_id];
            const historyQueryResult = await db.query(historyInsertQuery, historyInsertValues);

            res.status(StatusCodes.OK).json({ status: true, message: "Salary disbursed successfully" })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! salary not disbursed" })
        }
    }
    catch (error) {
        console.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


async function incrementAfterZero(inputString) {
    // Use a regular expression to find '0' followed by a number
    const regex = /0(\d+)/g;

    // Replace each match with the incremented number
    const resultString = inputString.replace(regex, (match, capturedNumber) => {
        const incrementedNumber = parseInt(capturedNumber) + 1;
        return `0${incrementedNumber}`;
    });

    return resultString;
}

module.exports = { getAllUserSalaryForDisbursal, getUserSalaryDisbursalDetailsById, markSalaryDisbursed, calculateAppliedAllowanceForUser, calculateTotalWorkingDay }
