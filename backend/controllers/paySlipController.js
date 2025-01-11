require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger} = require("../helpers/validation");
const {countUserTotalWorkingDaysInMonth, checkUserHasActiveLoan, getEmployeeSalary, countUserTotalLeaveDaysInMonth, getUserInsuranceDetails, getInsuranceCompanyDetailsById, getAssignFromAdmin, getEmployeeFullMonthWorkHours, getAppliedAllowance, getAppliedDeductions, getUserGrossSalaryInMonth, calculateTaxAmount} = require("../helpers/general")
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const numberToWords = require('number-to-words');

// const getUsersPaySlip = async(req, res) => {

//     try {
//         const queryMonth = req.query.month || moment(new Date()).format("YYYY-MM");
//         const dateObj = moment(queryMonth, "YYYY-MM");
//         const year = dateObj.format("YYYY");
//         const month = dateObj.format("MM");

//         const selectQuery = `SELECT users.name as user_name, users.email, users.image as user_image, users.joining_date, salary_disburses.user_id, salary_disburses.gross_salary, salary_disburses.month, salary_disburses.created_by, roles.name as employee_role FROM salary_disburses INNER JOIN users ON users.id = salary_disburses.user_id INNER JOIN roles ON roles.id = users.user_type WHERE MONTH(salary_disburses.month) = '${month}' AND YEAR(salary_disburses.month) = '${year}'`;
        
//         const queryResult = await promisify(db.query)(selectQuery)
//         if(queryResult.length > process.env.VALUE_ZERO)
//         {
//             var values = [];
//             for(const row of queryResult)
//             {
//                 const salaryDisbursedBy = await getAssignFromAdmin(row.created_by)
//                 values.push({
//                     user_id: row.user_id,
//                     user_name: row.user_name,
//                     email: row.email,
//                     user_image: row.user_image,
//                     joining_date: moment(row.joining_date, 'YYYY-MM-DD').format('DD-MM-YYYY'),
//                     gross_salary: row.gross_salary,
//                     month: moment(row.month, 'YYYY-MM-DD').format('DD-MM-YYYY'),
//                     employee_role: row.employee_role,
//                     salaryDisbursedBy: salaryDisbursedBy[0].name

//                 })

//             }
//             res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: values});
//         }
//         else
//         {
//             res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"});
//         }
//     } 
//     catch (error) 
//     {
//         console.error("error", error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
//     }
// }

const getUsersPaySlip = async (req, res) => {
    try {
        // Get the month from the query string or default to the current month
        const queryMonth = req.query.month || moment(new Date()).format("YYYY-MM");
        const dateObj = moment(queryMonth, "YYYY-MM");
        const year = dateObj.format("YYYY");
        const month = dateObj.format("MM");

        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;

        // Base SELECT query with placeholders for month and year
        let selectQuery = `
            SELECT 
                users.name AS user_name, 
                users.email, 
                users.image AS user_image, 
                users.joining_date, 
                salary_disburses.user_id, 
                salary_disburses.gross_salary, 
                salary_disburses.month, 
                salary_disburses.created_by, 
                roles.name AS employee_role 
            FROM 
                salary_disburses 
            INNER JOIN 
                users ON users.id = salary_disburses.user_id 
            INNER JOIN 
                roles ON roles.id = users.user_type 
            WHERE 
                MONTH(salary_disburses.month) = ? 
                AND YEAR(salary_disburses.month) = ?`;

        // Prepare query parameters
        const queryParams = [month, year];

        // Modify the query for non-admin users to filter by their user_id
        if (loggedUserType !== 3) {
            selectQuery += ` AND salary_disburses.user_id = ?`;
            queryParams.push(loggedUserId);  // Adding the logged user's ID to the query parameters
        }

        // Execute the query and get the result
        const queryResult = await db.query(selectQuery, queryParams); // Assuming db.query returns a promise

        // Check if query result is not empty
        if (queryResult.length > 0) {
            let values = [];
            for (const row of queryResult) {
                // Fetch the name of the admin who created the salary disbursement record
                const salaryDisbursedBy = await getAssignFromAdmin(row.created_by);

                if (salaryDisbursedBy && salaryDisbursedBy.length > 0) {
                    values.push({
                        user_id: row.user_id,
                        user_name: row.user_name,
                        email: row.email,
                        user_image: row.user_image,
                        joining_date: moment(row.joining_date, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                        gross_salary: row.gross_salary,
                        month: moment(row.month, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                        employee_role: row.employee_role,
                        salaryDisbursedBy: salaryDisbursedBy[0].name // Assuming this is the correct field
                    });
                } else {
                    // Handle case if `getAssignFromAdmin` returns an empty array
                    console.error(`Admin info not found for created_by: ${row.created_by}`);
                }
            }

            // Send the response with the fetched data
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values });
        } else {
            // If no data found, return forbidden
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        // Log the error and return a server error response
        console.error("Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

const getUserPayslipDetailsById = async(req, res) => {

    try {
        
        const id = req.query.id;
        const month = req.query.month
        let insuranceCompanyDetails;
        let deductionAmount;
        let allowanceAmount;

        const queryValidate = Joi.object({
            id: Joi.number().positive().integer().required(),
            month: Joi.required()
        })

        const {error} = queryValidate.validate({id, month})

        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const selectQuery = `SELECT users.id as user_id, users.user_type, users.name,  users.joining_date, users.email, users.mobile, roles.name as role_name FROM users INNER JOIN roles ON roles.id = users.user_type WHERE users.id = ?`
        const queryResult = await db.query(selectQuery, [id])

        var now = new Date(month) || new Date();
        const totalDayInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var values = [];

            //get active loan of user
            const getUserActiveLoan = await checkUserHasActiveLoan(id, month);
            const loanEndDate = getUserActiveLoan.loan_term;
            
            //get total working days of month 
            const actualMonthDay =  30;
            let totalDaysWorking;
            const getUserTotalWorkingDaysInMOnth = await countUserTotalWorkingDaysInMonth(id, month)
            console.log("getUserTotalWorkingDaysInMOnth", getUserTotalWorkingDaysInMOnth);
            if(getUserTotalWorkingDaysInMOnth == 31){
                totalDaysWorking =  30;
            }else{
                totalDaysWorking =  getUserTotalWorkingDaysInMOnth;
            }
            //get total leave days of month
            const getUserTotalLeaveDaysInMOnth = await countUserTotalLeaveDaysInMonth(id, month);
            //get user insurance premium details 
            const getInsuranceDetails = await getUserInsuranceDetails(id)
            const insuranceObj = getInsuranceDetails
            //get users base salary
            const getUserSalary = await getEmployeeSalary(id);

            if(insuranceObj != null) {

                const matchValue = parseInt(id);
                const matchedValues = insuranceObj.insurance_applied_on.filter(val => val === matchValue);
                // get insurance company,plan, abd premium details
                const insuranceCompanyData  = await getInsuranceCompanyDetailsById(insuranceObj.id)
                insuranceCompanyDetails = insuranceCompanyData[0]
            }
            
            //get allowance details
            const userType = queryResult[0].user_type;
            const appliedAllowance = await getAppliedAllowance(id, userType)
            let allowanceDetails = [];

            if(appliedAllowance != null && appliedAllowance > 0)
            {
                for(let row of appliedAllowance)
                {   
                    let employee_value;

                    if(row.value_type === '1')
                    {
                        employee_value = '₹ ' + row.value;
                    }
                    else
                    {
                        employee_value = row.value+'%';
                    }

                    allowanceDetails.push({
                        id: row.id,
                        name: row.name,
                        value: employee_value
                    });

                    // total allowance amount is calculated
                    let totalValue = 0;

                    for (let i = 0; i < appliedAllowance.length; i++) {

                        if(appliedAllowance[i].value_type === '1')
                        {
                            totalValue += appliedAllowance[i].value;
                        }
                        else
                        {
                            // get by employee percentage
                            const getEmployeePercentageValue = await calculateTaxAmount(getUserSalary[0].salary, appliedAllowance[i].value);
                            totalValue += getEmployeePercentageValue;
                        }
                        
                    }

                    allowanceAmount = totalValue;
                }
            }
            else
            {
                allowanceDetails;
                allowanceAmount = 0;
            }

            // get deductions amounts details
            const appliedDeduction = await getAppliedDeductions(id, userType)
            let deductionDetails = [];

            if(appliedDeduction != null)
            {
                for(let row of appliedDeduction)
                {
                    let employee_value;
                    let employer_value;

                    if(row.value_type === '1')
                    {
                        employee_value = '₹' + row.by_employee;
                        employer_value = '₹' + row.by_employer
                    }
                    else
                    {
                        employee_value = row.by_employee+'%';
                        employer_value = row.by_employer+'%';
                    }

                    deductionDetails.push({
                        id: row.id,
                        name: row.name,
                        value: row.value,
                        by_employee: employee_value,
                        by_employer: employer_value
                    })
                }

                // total deduction amount calculation
                let deductionTotalValue = 0;

                for (let i = 0; i < appliedDeduction.length; i++) {
                    // for fixed amount of deduction
                    if(appliedDeduction[i].value_type === '1')
                    {
                        deductionTotalValue += (appliedDeduction[i].by_employee + appliedDeduction[i].by_employer)
                    }
                    else
                    {
                        // get by employee percentage
                        const getEmployeePercentageValue = await calculateTaxAmount(getUserSalary[0].salary, appliedDeduction[i].by_employee);
                        // get by employer percentage
                        const getEmployerPercentageValue = await calculateTaxAmount(getUserSalary[0].salary, appliedDeduction[i].by_employer);

                        deductionTotalValue = (getEmployeePercentageValue + getEmployerPercentageValue);
                    }
                    
                }

                deductionAmount = deductionTotalValue;

            }
            else
            {
                deductionDetails 
            }

             //get users gross in particular month salary
            const getUserGrossSalary = await getUserGrossSalaryInMonth(id, month)
            const gross_salary = getUserGrossSalary.amount;
            const gross_salary_in_word = gross_salary > 0 ? numberToWords.toWords(gross_salary) : '/-';
            const paySlipNumber = getUserGrossSalary.slip_number; 

            //get user total work hours in month
            const date = new Date(`${month}-01`);
            const dbFormattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
            
            const getUserTotalWorkHours = await getEmployeeFullMonthWorkHours(id, dbFormattedDate)            
            for(const row of queryResult)   
            {
                values.push({
                    user_id: row.user_id,
                    user_name: row.name,
                    joining_date: row.joining_date,
                    user_email: row.email,
                    user_mobile: row.mobile,
                    user_role: row.role_name,
                    loan_number: getUserActiveLoan.loan_id,
                    loan_amount: getUserActiveLoan.repayment_amount,
                    loan_term: getUserActiveLoan.loan_term,
                    total_working_days: `${getUserTotalWorkingDaysInMOnth.present_days}/${totalDayInMonth}`,
                    total_leaves: getUserTotalLeaveDaysInMOnth.total_leaves,
                    total_work_hours_in_month: getUserTotalWorkHours.total_work_hours,
                    base_salary: getUserSalary[0].salary,
                    gross_salary: gross_salary,
                    gross_salary_in_word: gross_salary_in_word,
                    insurance: insuranceCompanyDetails,
                    allowance: allowanceDetails,
                    totalAllowance: allowanceAmount,
                    deduction: deductionDetails,
                    totalDeductionAmount:deductionAmount,
                    paySlipNumber: paySlipNumber || '--',
                })
            }

            console.log(values)
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: values[0]})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Details not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}


module.exports = {getUsersPaySlip, getUserPayslipDetailsById}