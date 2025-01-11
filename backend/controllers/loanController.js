require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger, loanValidation } = require("../helpers/validation");
const { generateRandomNumber } = require("../helpers/general");
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

// const createLoan = async(req, res) => {

//     try {

//         const {user_id, loan_amount, loan_type, loan_term, payment_type, remarks} = req.body;

//         const {error} = loanValidation.validate(req.body)

//         if(error) return res.status(StatusCodes.OK).json({status: false, message: error.message})

//         //get already active loan status for that user
//         const getLoanDetailsQuery = `SELECT * FROM loans WHERE user_id = ?`
//         const getLoanStatus = await db.query(getLoanDetailsQuery, [user_id])

//         if(getLoanStatus.length > process.env.VALUE_ZERO && getLoanStatus[0].status === 'active')
//         {
//             return res.status(StatusCodes.OK).json({status: false, message: "Your have already an active loan, your loan number is " + getLoanStatus[0].loan_id})
//         }

//         const loanId = await generateRandomNumber(10)
//         const createdBy = req.user.user_id;

//         const insertQuery = `INSERT INTO loans (loan_id, user_id, loan_amount, loan_type, loan_term, payment_type, remarks, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

//         const insertValues = [loanId, user_id, loan_amount, loan_type, loan_term, payment_type, remarks, createdBy]

//         const queryResult = await db.query(insertQuery, insertValues);

//         if(queryResult.affectedRows > process.env.VALUE_ZERO)
//         {
//             res.status(StatusCodes.OK).json({status: true, message: "Loan details submitted successfully"})
//         }
//         else
//         {
//             res.status(StatusCodes.OK).json({status: false, message: "Error! loan not submitted"})
//         }

//     } 
//     catch (error) 
//     {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
//     }
// }


const createLoan = async (req, res) => {
    try {
        const { error } = loanValidation.validate(req.body);

        if (error)
            return res
                .status(StatusCodes.OK)
                .json({ status: false, message: error.message });

        const {
            user_id,
            loan_type,
            loan_date,
            emi_start_from,
            interest_rate,
            interest_mode,
            no_of_payments,
            emi,
            payment_date,
            payment_mode,
            cheque_number,
            cheque_date,
            bank,
            branch,
            loan_amount,
            loan_term,
            payment_type,
            remarks,
        } = req.body;
        //get already active loan status for that user
        const getLoanDetailsQuery = `SELECT * FROM loans WHERE user_id = ?`;
        const getLoanStatus = await db.query(getLoanDetailsQuery, [user_id]);

        if (
            getLoanStatus.length > process.env.VALUE_ZERO &&
            getLoanStatus[0].status === "active"
        ) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message:
                    "Your have already an active loan, your loan number is " +
                    getLoanStatus[0].loan_id,
            });
        }

        const loanId = await generateRandomNumber(10);
        const createdBy = req.user.user_id;

        const insertQuery = `INSERT INTO loans (loan_id, user_id, loan_date, emi_start_from, interest_rate, interest_mode, no_of_payments, emi, payment_date, payment_mode, cheque_number, cheque_date, bank, branch, loan_amount, loan_type, loan_term, payment_type, remarks, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const insertValues = [
            loanId,
            user_id,
            loan_date,
            emi_start_from,
            interest_rate,
            interest_mode,
            no_of_payments,
            emi,
            payment_date,
            payment_mode,
            cheque_number,
            cheque_date,
            bank,
            branch,
            loan_amount,
            loan_type,
            loan_term,
            payment_type,
            remarks,
            createdBy,
        ];

        const queryResult = await db.query(insertQuery, insertValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Loan details submitted successfully" });
        } else {
            res
                .status(StatusCodes.OK)
                .json({ status: false, message: "Error! loan not submitted" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const updateLoanDetails = async (req, res) => {
    try {
        const {
            user_id,
            loan_date,
            emi_start_from,
            interest_rate,
            interest_mode,
            no_of_payments,
            emi,
            payment_date,
            payment_mode,
            cheque_number,
            cheque_date,
            bank,
            branch,
            loan_amount,
            loan_type,
            loan_term,
            payment_type,
            remarks,
            id,
        } = req.body;

        const { error } = loanValidation.validate(req.body);

        if (error)
            return res
                .status(StatusCodes.OK)
                .json({ status: false, message: error.message });

        //get loan status for the update request
        const getLoanStatusQuery = `SELECT status FROM loans WHERE id = ?`;
        const getLoanStatus = await db.query(getLoanStatusQuery, [id]);

        if (
            getLoanStatus.length > process.env.VALUE_ZERO &&
            getLoanStatus[0].status != "pending"
        ) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Loan is active now so you won't able to update this loan",
            });
        }

        const updateAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const updateQuery = `UPDATE loans SET user_id = ?, loan_date = ?, emi_start_from = ?, interest_rate = ?, interest_mode = ?, no_of_payments = ?, emi = ?, payment_date = ?, payment_mode = ?, cheque_number = ?, cheque_date = ?, bank = ?, branch = ?, loan_amount = ?, loan_type = ?, loan_term = ?, payment_type= ?, remarks = ?, updated_at = ? WHERE id = ?`;

        const updateValues = [
            user_id,
            loan_date,
            emi_start_from,
            interest_rate,
            interest_mode,
            no_of_payments,
            emi,
            payment_date,
            payment_mode,
            cheque_number,
            cheque_date,
            bank,
            branch,
            loan_amount,
            loan_type,
            loan_term,
            payment_type,
            remarks,
            updateAt,
            id,
        ];

        const queryResult = await db.query(updateQuery, updateValues);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Loan details updated successfully" });
        } else {
            res
                .status(StatusCodes.OK)
                .json({ status: false, message: "Error! loan not updated" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};


// const getAllLoanRequests = async (req, res) => {

//     try {

//         const selectQuery = `SELECT loans.*, users.name, users.image
//          FROM loans INNER JOIN users ON users.id = loans.user_id WHERE loans.status = 'pending' AND loans.is_deleted = '0' ORDER BY loans.id DESC`
//         const queryResults = await promisify(db.query)(selectQuery)

//         if (queryResults.length > process.env.VALUE_ZERO) {
//             //res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResults})
//             const final = queryResults.map(async (element) => {
//                 return {
//                     ...element,
//                     loan_status_changed_image: null
//                 }
//             });

//             Promise.all(final).then((values) => {
//                 res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values })
//             })
//         }
//         else {
//             res.status(StatusCodes.OK).json({ status: false, message: "data not found" })
//         }
//     }
//     catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

const getAllLoanRequests = async (req, res) => {
    try {
        // const userId = req.user.user_id;
        // const userType = req.user.user_type;

        // const selectQuery = `SELECT loans.*, users.name, users.image
        //  FROM loans INNER JOIN users ON users.id = loans.user_id 
        //  WHERE loans.status = 'pending' AND loans.is_deleted = '0' 
        //  ORDER BY loans.id DESC`;
        // const queryResults = await promisify(db.query)(selectQuery);

        const userId = req.user.user_id;
        const userType = req.user.user_type;


        let condition = `WHERE loans.status = 'pending' AND loans.is_deleted = '0'`;
        let queryParams = [];

        // Add condition for non-admin users
        if (userType != 3) {
            condition += ` AND loans.user_id = ?`;
            queryParams.push(userId);
        }

        const selectQuery = `
    SELECT loans.*, users.name, users.image
    FROM loans
    INNER JOIN users ON users.id = loans.user_id
    ${condition}
    ORDER BY loans.id DESC
`;

        // Execute the query with parameters
        const queryResults = await db.query(selectQuery, queryParams);


        if (queryResults.length > process.env.VALUE_ZERO) {
            const final = queryResults.map((element) => {
                return {
                    id: element.id,
                    loan_id: element.loan_id,
                    user_id: element.user_id,
                    loan_amount: element.loan_amount,
                    loan_type: element.loan_type,
                    interest_rate: element.interest_rate,
                    loan_term: element.loan_term,
                    repayment_date: element.repayment_date ? moment(element.repayment_date).format('YYYY-MM-DD') : null,
                    repayment_amount: element.repayment_amount,
                    bank: element.bank,
                    branch: element.branch,
                    payment_type: element.payment_type,
                    status: element.status,
                    remarks: element.remarks,
                    loan_status_changed_date: element.loan_status_changed_date ? moment(element.loan_status_changed_date).format('YYYY-MM-DD') : null,
                    loan_status_changed_by: element.loan_status_changed_by,
                    loan_date: element.loan_date ? moment(element.loan_date).format('YYYY-MM-DD') : null,
                    emi_start_from: element.emi_start_from,
                    interest_mode: element.interest_mode,
                    no_of_payments: element.no_of_payments,
                    emi: element.emi,
                    payment_date: element.payment_date ? moment(element.payment_date).format('YYYY-MM-DD') : null,
                    payment_mode: element.payment_mode,
                    cheque_number: element.cheque_number,
                    cheque_date: element.cheque_date ? moment(element.cheque_date).format('YYYY-MM-DD') : null,
                    is_deleted: element.is_deleted,
                    created_by: element.created_by,
                    created_at: element.created_at ? moment(element.created_at).format('YYYY-MM-DD') : null,
                    updated_at: element.updated_at ? moment(element.update_at).format('YYYY-MM-DD') : null,
                    name: element.name,
                    image: element.image,
                    loan_status_changed_image: null
                };
            });

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: final });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


const getAllActiveLoan = async (req, res) => {

    try {

        // const selectQuery = `SELECT loans.*, users.name, users.image, admins.name AS loan_status_changed_by, admins.image AS loan_status_changed_image FROM loans INNER JOIN users ON users.id = loans.user_id INNER JOIN admins ON admins.id = loans.loan_status_changed_by WHERE loans.status = 'active' AND loans.is_deleted = '0'`
        // const queryResults = await promisify(db.query)(selectQuery)

        const userId = req.user.user_id;
        const userType = req.user.user_type;


        let condition = `WHERE loans.status = 'active' AND loans.is_deleted = '0'`;
        let queryParams = [];

        // Add condition for non-admin users
        if (userType != 3) {
            condition += ` AND loans.user_id = ?`;
            queryParams.push(userId);
        }

        const selectQuery = `
    SELECT loans.*, users.name, users.image
    FROM loans
    INNER JOIN users ON users.id = loans.user_id
    ${condition}
    ORDER BY loans.id DESC
`;

        const queryResults = await db.query(selectQuery, queryParams);


        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getAllRejectedLoan = async (req, res) => {

    try {

        // const selectQuery = `SELECT loans.*, users.name, users.image, admins.name AS loan_status_changed_by, admins.image AS loan_status_changed_image FROM loans INNER JOIN users ON users.id = loans.user_id INNER JOIN admins ON admins.id = loans.loan_status_changed_by WHERE loans.status = 'reject' AND loans.is_deleted = '0'`
        // const queryResults = await promisify(db.query)(selectQuery)

        const userId = req.user.user_id;
        const userType = req.user.user_type;


        let condition = `WHERE loans.status = 'reject' AND loans.is_deleted = '0'`;
        let queryParams = [];

        // Add condition for non-admin users
        if (userType != 3) {
            condition += ` AND loans.user_id = ?`;
            queryParams.push(userId);
        }

        const selectQuery = `
    SELECT loans.*, users.name, users.image
    FROM loans
    INNER JOIN users ON users.id = loans.user_id
    ${condition}
    ORDER BY loans.id DESC
`;
        const queryResults = await db.query(selectQuery, queryParams);


        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getAllClosedLoan = async (req, res) => {

    try {

        // const selectQuery = `SELECT loans.*, users.name, users.image, admins.name AS loan_status_changed_by, admins.image AS loan_status_changed_image FROM loans INNER JOIN users ON users.id = loans.user_id INNER JOIN admins ON admins.id = loans.loan_status_changed_by WHERE loans.status = 'closed' AND loans.is_deleted = '0'`
        // const queryResults = await promisify(db.query)(selectQuery)
        const userId = req.user.user_id;
        const userType = req.user.user_type;


        let condition = `WHERE loans.status = 'closed' AND loans.is_deleted = '0'`;
        let queryParams = [];

        // Add condition for non-admin users
        if (userType != 3) {
            condition += ` AND loans.user_id = ?`;
            queryParams.push(userId);
        }

        const selectQuery = `
    SELECT loans.*, users.name, users.image
    FROM loans
    INNER JOIN users ON users.id = loans.user_id
    ${condition}
    ORDER BY loans.id DESC
`;
        const queryResults = await db.query(selectQuery, queryParams);


        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getLoanDetailById = async (req, res) => {

    try {

        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id })

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message })
        const selectQuery = `SELECT loans.*, 
        DATE_FORMAT(loans.loan_date, '%y-%m-%d') AS loan_dates, 
        DATE_FORMAT(loans.emi_start_from, '%y-%m-%d') AS emi_start_froms, 
        DATE_FORMAT(loans.cheque_date, '%y-%m-%d') AS cheque_dates,
        DATE_FORMAT(loans.payment_date, '%y-%m-%d') AS payment_dates, 
        users.name 
    FROM loans 
    INNER JOIN users ON users.id = loans.user_id 
    WHERE loans.id = ? AND loans.is_deleted = '0'`;

        const queryResults = await db.query(selectQuery, [id])

        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults[0] })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

// const updateLoanDetails = async(req, res) => {

//     try {

//         const {user_id, loan_amount, loan_type, loan_term, payment_type, remarks, id} = req.body;

//         const {error} = loanValidation.validate(req.body)

//         if(error) return res.status(StatusCodes.OK).json({status: false, message: error.message})

//         //get loan status for the update request
//         const getLoanStatusQuery = `SELECT status FROM loans WHERE id = ?`
//         const getLoanStatus = await db.query(getLoanStatusQuery, [id])

//         if(getLoanStatus.length > process.env.VALUE_ZERO && getLoanStatus[0].status != 'pending')
//         {
//             return res.status(StatusCodes.OK).json({status: false, message: "Loan is active now so you won't able to update this loan"})
//         }

//         const updateAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

//         const updateQuery = `UPDATE loans SET user_id = ?, loan_amount = ?, loan_type = ?, loan_term = ?, payment_type= ?, remarks = ?, updated_at = ? WHERE id = ?`

//         const updateValues = [user_id, loan_amount, loan_type, loan_term, payment_type, remarks, updateAt, id]

//         const queryResult = await db.query(updateQuery, updateValues);

//         if(queryResult.affectedRows > process.env.VALUE_ZERO)
//         {
//             res.status(StatusCodes.OK).json({status: true, message: "Loan details updated successfully"})
//         }
//         else
//         {
//             res.status(StatusCodes.OK).json({status: false, message: "Error! loan not updated"})
//         }

//     } 
//     catch (error) 
//     {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
//     }
// }

// verify and update loan status by super admin
const updateLoanStatus = async (req, res) => {

    try {

        const { id, status } = req.body;
        const statusValidation = Joi.object({
            id: Joi.number().required(),
            status: Joi.string().required()
        })

        const { error } = statusValidation.validate(req.body)

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message })

        const updateQuery = `UPDATE loans SET status = ?, loan_status_changed_date = ?, loan_status_changed_by = ? WHERE id = ?`
        const loanStatusChangedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        const loanStatusChangedBy = req.user.user_id;
        const queryResult = await db.query(updateQuery, [status, loanStatusChangedDate, loanStatusChangedBy, id])
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Loan " + status + " successfully" })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "Error! loan status not changed" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const deleteLoanDetailById = async (req, res) => {

    try {

        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id })

        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message })

        const getLoanStatusQuery = `SELECT status FROM loans WHERE id = ?`
        const getLoanStatus = await db.query(getLoanStatusQuery, [id])

        if (getLoanStatus.length > process.env.VALUE_ZERO && getLoanStatus[0].status === 'active') {
            return res.status(StatusCodes.OK).json({ status: false, message: "Loan is active now so you won't able to delete this loan" })
        }

        const selectQuery = `UPDATE loans SET is_deleted = ? WHERE id = ?`
        const queryResults = await db.query(selectQuery, [process.env.DELETED, id])

        if (queryResults.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Loans deleted successfully" })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "Error! loan not deleted" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

module.exports = { createLoan, getAllLoanRequests, getAllActiveLoan, getAllRejectedLoan, getAllClosedLoan, getLoanDetailById, updateLoanDetails, updateLoanStatus, deleteLoanDetailById }