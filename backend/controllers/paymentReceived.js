require('dotenv').config();
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { calculatePagination, getComplaintUniqueId, getRegionalNameById, getPoDetailById, getComplaintTypeById, getOutletById, getComplaintsToAreaManager, getComplaintUniqueIdInPayment, getComplaintUniqueIdInPaymentForRo } = require('../helpers/general');
const { checkPositiveInteger, addPaymentReceiveValidationSchema, updatePaymentReceiveValidation, updateRetentionStatusValidation, updatePaymentAmountRetentionValidation } = require('../helpers/validation');
const cron = require('node-cron');
const moment = require('moment');
const { getComplaintsAndOutlets, getSalesAreaById, getDeductionAmount, getPromotionDeduction } = require('./invoiceController');
const { getMeasurementDetails, insertIntoAreaManagerWallet, getExpensePunchAndStockTotalAmounts } = require('./paymentSettingController');
const { get } = require('lodash');
const { parse } = require('dotenv');



const addPaymentReceive = async (req, res) => {
    try {
        // Validate the request body

        const { error, value } = addPaymentReceiveValidationSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const created_by = req.user.user_id;

        // Process each item in the request body
        for (let item of req.body) {
            // Generate a unique payment ID
            item.payment_unique_id = await generatePaymentReceiveId();

            // Default values for optional fields
            item.tds = item.tds ? item.tds : 2;
            item.tds_on_gst = item.tds_on_gst ? item.tds_on_gst : 2;
            item.retention = item.retention ? item.retention : 10;

            // Calculate the gross amount
            item.gross_amount = parseFloat(item.net_amount) + parseFloat(item.gst_amount);

            // Calculate total deductions
            let deduction =
                parseFloat(item.other_deduction ?? 0) +
                parseFloat(item.retention_amount ?? 0) +
                parseFloat(item.tds_amount ?? 0) +
                parseFloat(item.tds_on_gst_amount ?? 0) +
                parseFloat(item.covid19_amount_hold ?? 0) +
                parseFloat(item.ld_amount ?? 0) +
                parseFloat(item.hold_amount ?? 0);

            // Calculate the final amount
            item.amount = (parseFloat(item.gross_amount) - deduction).toFixed(2);

            // Determine the status
            item.status = item.amount_received && parseFloat(item.amount_received) === parseFloat(item.amount) ? 2 : 1;

            // Set created_by field
            item.created_by = created_by;

            // Calculate balance amount
            const balanceAmount = parseFloat(item.amount) - parseFloat(item.amount_received);
            // Insert the item into the database
            const insert = await db.query(`INSERT INTO payment_receive SET ?`, [item]);

            if (insert.affectedRows > 0) {
                // Record payment history
                await paymentHistory(item.invoice_id, insert.insertId, item.pv_number, item.pv_amount, item.amount, item.amount_received, balanceAmount, item.receipt_date, created_by);
                // Update invoice details if needed
                await updateInvoiceDetails(item.invoice_id);
            }
        }

        return res.status(201).json({
            status: true,
            message: "Payment received successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to receive payment",
        });
    }
};


async function updateInvoiceDetails(invoice_id) {
    try {
        const update = await db.query(`UPDATE invoices SET payment_status = '2' WHERE id = ?`, [invoice_id]);
        return update;
    } catch (error) {
        throw error;
    }
}


async function generatePaymentReceiveId() {
    const paymentReceiveQuery = `SELECT payment_unique_id FROM payment_receive WHERE payment_unique_id IS NOT NULL AND payment_unique_id != '' ORDER BY id DESC LIMIT 1`;
    const result = await db.query(paymentReceiveQuery);
    if (result.length) {
        const currentID = result[0].payment_unique_id;
        const numberPart = parseInt(currentID.slice(2), 10);
        const nextNumber = numberPart + 1;
        return `PU${nextNumber.toString().padStart(3, "0")}`;
    }
    return "PU001";
}


const getAllPaymentReceive = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status ?? 1;
        const pv_number = req.query.pv_number || "";
        let search_value = "";
        let whereCondition = "";

        if (searchData) {
            search_value += ` AND (invoice_number LIKE '%${searchData}%' OR invoice_date LIKE '%${searchData}%' OR pv_number LIKE '%${searchData}%')`;
        }

        if (pv_number) {
            whereCondition += `AND pv_number LIKE '%${pv_number}%' `
        }

        const selectQuery = `SELECT * FROM payment_receive WHERE status = ${status} ${whereCondition} ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(
            0,
            selectQuery.indexOf("ORDER BY")
        );
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(
                totalResult.length,
                currentPage,
                pageSize
            );

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "No data found",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};




// cron.schedule("*/2 * * * *", async () => {
//     try {
//         // 1. get all messages from contact_messages table
//         const today = moment().format("YYYY-MM-DD");

//         const selectQuery = await db.query(`SELECT * FROM payment_receive WHERE status = 2 and receiving_status = 0`);

//         if (selectQuery.length > 0) {
//             const resultData = [];

//             for (const data of selectQuery) {
//                 const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);
//                 for (const row of invoiceQuery) {
//                     const pi_ids = row.pi_id;
//                     const complaintIds = await getComplaintsAndOutlets(pi_ids);
//                     for (const complaintId of complaintIds.finalComplaints) {
//                         const complaint = await getComplaintUniqueIdInPayment(complaintId.trim());
//                         const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);
//                         console.log(getAreaManager)
//                         const [measurement_detail] = await getMeasurementDetails(complaint.id);
//                         const stockAndFund = await getExpensePunchAndStockTotalAmounts(complaint.id)
//                         const getDeductionAmounts = await getDeductionAmount(row.billing_ro, measurement_detail.amount, getAreaManager.area_manager_id, stockAndFund);

//                         const transaction = await insertIntoAreaManagerWallets(getAreaManager.area_manager_id, getDeductionAmounts, otp, paid_amount);
//                     }


//                     // Update payment status in the database
//                     const updateQuery = 'UPDATE payment_receive SET receiving_status = ? WHERE id = ?';
//                     await db.query(updateQuery, ['1', data.invoice_id]);

//                 }
//             }
//         }


//         console.log("message sending cron job executed successfully");

//     } catch (error) {
//         console.error(error.message);
//     }
// });




// for area manager
// cron.schedule("*/2 * * * *", async () => {
//     try {
//         // Query to get all messages from the payment_receive table with specific status and receiving status
//         const selectQuery = await db.query(`SELECT * FROM payment_receive WHERE status = 2 and receiving_status = 0`);

//         if (selectQuery.length > 0) {
//             for (const data of selectQuery) {
//                 // Query to get invoice details
//                 const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ?`, [data.invoice_id]);
//                 for (const row of invoiceQuery) {
//                     const pi_ids = row.pi_id;
//                     const complaintIds = await getComplaintsAndOutlets(pi_ids);

//                     for (const complaintId of complaintIds.finalComplaints) {
//                         const complaint = await getComplaintUniqueIdInPayment(complaintId.trim());
//                         const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);
//                         const [measurement_detail] = await getMeasurementDetails(complaint.id);
//                         const stockAndFund = await getExpensePunchAndStockTotalAmounts(complaint.id);
//                         const getDeductionAmounts = await getDeductionAmount(row.billing_ro, measurement_detail.amount, getAreaManager.area_manager_id, stockAndFund);
//                         const amount = parseFloat(measurement_detail.amount) - parseFloat(getDeductionAmounts)
//                         console.log("amount", amount)
//                         await insertIntoAreaManagerWallets(getAreaManager.area_manager_id, amount);
//                     }

//                     // Update payment status in the database
//                     await db.query('UPDATE payment_receive SET receiving_status = ? WHERE id = ?', [1, data.id]);
//                 }
//             }
//         }

//         console.log("Message sending cron job executed successfully");

//     } catch (error) {
//         console.error("Error executing cron job: ", error.message);
//     }
// });


// for ro
cron.schedule("*/2 * * * *", async () => {
    try {
        // Query to get all messages from the payment_receive table with specific status and receiving status
        const selectQuery = await db.query(`SELECT * FROM payment_receive WHERE status = 2 and ro_receiving_status = 0`);

        if (selectQuery.length > 0) {
            for (const data of selectQuery) {
                // Query to get invoice details
                const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ?`, [data.invoice_id]);
                for (const row of invoiceQuery) {
                    const pi_ids = row.pi_id;
                    const complaintIds = await getComplaintsAndOutlets(pi_ids);
                    const po_detail = await getPoDetailById(row.po_number);
                    const [ro_detail] = await getRegionalNameById(row.billing_ro);

                    for (const complaintId of complaintIds.finalComplaints) {
                        
                        const complaint = await getComplaintUniqueIdInPaymentForRo(complaintId.trim());
                        const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);
                        const [measurement_detail] = await getMeasurementDetails(complaint.id);
                        const stockAndFund = await getExpensePunchAndStockTotalAmounts(complaint.id);
                        const getDeductionAmounts = await getPromotionDeduction(row.billing_ro, measurement_detail.amount, stockAndFund);
                        const {deduction, promotion_expense}= getDeductionAmounts;
                        const amount = parseFloat(measurement_detail.amount) - parseFloat(deduction)
                        await insertIntoRoWallets(row.billing_ro, row.po_number, amount);
                    }

                    // Update payment status in the database
                    await db.query('UPDATE payment_receive SET ro_receiving_status = ? WHERE id = ?', [1, data.id]);
                }
            }
        }   
        console.log("Ro executed successfully");

    } catch (error) {
        console.error(error)
        console.error("Error executing cron job: ", error.message);
    }
});


// async function insertIntoAreaManagerWallets(area_manager_id, received_amount) {
//     try {
//         console.log("area_manager_id, received_amount", area_manager_id, received_amount)
//         // Fetch the current balance for the area manager
//         const selectQuery = `SELECT balance FROM area_manager_wallet WHERE area_manager_id = '${area_manager_id}' ORDER BY id DESC LIMIT 1`;
//         console.log("selectQuery", selectQuery)
//         const queryResult = await db.query(selectQuery);
//         console.log("queryResult", queryResult)
//         return 
//         let newBalance = 0;

//         // If there's an existing balance, update the new balance
//         if (queryResult.length > 0) {
//             const currentBalance = parseFloat(queryResult[0].balance);
            
//             newBalance = currentBalance + newBalance;
//         }else{
//             newBalance = received_amount;
//         }

//         // Insert the new record with the updated balance
//         const insertQuery = `INSERT INTO area_manager_wallet (area_manager_id, received_amount, balance) VALUES ('${area_manager_id}', '${received_amount}', '${newBalance}')`;
//         await db.query(insertQuery);

//     } catch (error) {
//         throw new Error(error.message);
//     }
// }


cron.schedule("*/2 * * * *", async () => {
    try {
        // Query to get all messages from the payment_receive table with specific status and receiving status
        const selectQuery = await db.query(`SELECT * FROM payment_receive WHERE status = 2 and receiving_status = 0`);

        if (selectQuery.length > 0) {
            for (const data of selectQuery) {
                // Query to get invoice details
                const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ?`, [data.invoice_id]);
                for (const row of invoiceQuery) {
                    const pi_ids = row.pi_id;
                    const complaintIds = await getComplaintsAndOutlets(pi_ids);

                    for (const complaintId of complaintIds.finalComplaints) {
                        const complaint = await getComplaintUniqueIdInPayment(complaintId.trim());
                        const [getAreaManager] = await getComplaintsToAreaManager(complaint.id);
                        const [measurement_detail] = await getMeasurementDetails(complaint.id);
                        const stockAndFund = await getExpensePunchAndStockTotalAmounts(complaint.id);
                        const getDeductionAmounts = await getDeductionAmount(row.billing_ro, measurement_detail.amount, getAreaManager.area_manager_id, stockAndFund);
                        const amount = parseFloat(measurement_detail.amount) - parseFloat(getDeductionAmounts.deduction);

                        await insertIntoAreaManagerWallets(getAreaManager.area_manager_id, getDeductionAmounts.manager_ratio);
                    }

                    // Update payment status in the database
                    await db.query('UPDATE payment_receive SET receiving_status = ? WHERE id = ?', [1, data.id]);
                }
            }
        }

        console.log("Message sending cron job executed successfully");

    } catch (error) {
        console.error("Error executing cron job: ", error.message);
    }
});

async function insertIntoAreaManagerWallets(area_manager_id, received_amount) {
    try {
        console.log("area_manager_id, received_amount", area_manager_id, received_amount);

        // Fetch the current balance for the area manager
        const selectQuery = `SELECT balance FROM area_manager_wallet WHERE area_manager_id = ? ORDER BY id DESC LIMIT 1`;
        const queryResult = await db.query(selectQuery, [area_manager_id]);

        let newBalance = received_amount;

        // If there's an existing balance, update the new balance
        if (queryResult.length > 0) {
            const currentBalance = parseFloat(queryResult[0].balance);
            newBalance += currentBalance;
        }

        // Insert the new record with the updated balance
        const insertQuery = `INSERT INTO area_manager_wallet (area_manager_id, received_amount, balance) VALUES (?, ?, ?)`;
        await db.query(insertQuery, [area_manager_id, received_amount, newBalance]);

    } catch (error) {
        throw new Error(`Error in insertIntoAreaManagerWallets: ${error.message}`);
    }
}




async function insertIntoRoWallets(ro_id, po_id, received_amount) {
    try {
        // Fetch the current balance for the area manager
        const selectQuery = `SELECT balance FROM ro_wallet WHERE ro_id = '${ro_id}' ORDER BY id DESC LIMIT 1`;
        const queryResult = await db.query(selectQuery);

        let newBalance = parseFloat(received_amount);

        // If there's an existing balance, update the new balance
        if (queryResult.length > 0) {
            const currentBalance = parseFloat(queryResult[0].balance);
            newBalance += currentBalance;
        } else {
            newBalance = received_amount;
        }

        // Insert the new record with the updated balance
        const insertQuery = `INSERT INTO ro_wallet (ro_id, po_id, amount_received, balance) VALUES ('${ro_id}', '${po_id}', '${received_amount}', '${newBalance}')`;
        await db.query(insertQuery);
    } catch (error) {
        throw new Error(error.message);
    }
}



const getPaymentReceiveDetailsById = async (req, res) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });
        if (error)
            res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const selectQuery = `SELECT id, payment_unique_id, receipt_date AS voucher_date, invoice_id, invoice_number, invoice_date, net_amount, igst, cgst, sgst, gst_amount, gross_amount, received_gst, other_deduction, retention, retention_amount, tds, tds_amount, tds_on_gst, tds_on_gst_amount, amount, amount_received AS received_amount, pv_number AS payment_voucher_number, pv_amount, ld_amount, hold_amount, covid19_amount_hold, status, retention_status, (amount - amount_received) AS balance FROM payment_receive  WHERE payment_receive.id = ${id}`;

        // LEFT JOIN payment_voucher_history ON payment_voucher_history.payment_update_id =  payment_receive.id
        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
            });
        } else {
            res.status(StatusCodes.OK).json({
                status: false,
                message: "Payment Not Found",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


const getListingofPaymentHistory = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const id = req.query.id || "";

        // const selectQuery = `SELECT pr.invoice_number, pr.invoice_date, pvh.pv_number, DATE_FORMAT(pvh.voucher_date, '%d-%m-%Y') AS voucher_date, pvh.balance, (pvh.amount - pvh.balance) AS total_amount_received, pvh.amount_received, DATE_FORMAT(pvh.created_at, '%d-%m-%Y') AS created_at FROM payment_voucher_history pvh LEFT JOIN payment_receive pr ON pvh.payment_update_id = pr.id WHERE pvh.payment_update_id = ${id} ORDER BY pvh.id DESC;`


        const selectQuery = `SELECT pr.invoice_number, pr.invoice_date, pvh.pv_number, DATE_FORMAT(pvh.voucher_date, '%d-%m-%Y') AS voucher_date, pvh.voucher_amount, pvh.amount - IFNULL((SELECT SUM(pvh_inner.amount_received) FROM payment_voucher_history pvh_inner WHERE pvh_inner.payment_update_id = pvh.payment_update_id AND pvh_inner.id <= pvh.id), 0) AS balance, (SELECT SUM(pvh_inner.amount_received) FROM payment_voucher_history pvh_inner WHERE pvh_inner.payment_update_id = pvh.payment_update_id AND pvh_inner.id <= pvh.id) AS total_amount_received, pvh.amount_received, DATE_FORMAT(pvh.created_at, '%d-%m-%Y') AS created_at FROM payment_voucher_history pvh LEFT JOIN payment_receive pr ON pvh.payment_update_id = pr.id WHERE pvh.payment_update_id = ${id} ORDER BY pvh.id ASC;
`
        const queryResult = await db.query(selectQuery);
        return res.status(StatusCodes.OK).json({ status: true, data: queryResult })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}



const updatePaymentReceive = async (req, res) => {
    try {
        const { error, value } = updatePaymentReceiveValidation.validate(req.body[0]);
        // return
        if (error) {
            return res
                .status(StatusCodes.OK)
                .json({ status: false, message: error.message });
        }
        const {
            id,
            pv_number,
            pv_amount,
            receipt_date,
            gross_amount,
            tds,
            tds_amount,
            tds_on_gst,
            tds_on_gst_amount,
            retention,
            retention_amount,
            ld_amount,
            hold_amount,
            covid19_amount_hold,
            amount_received,
            other_deduction,
            status
        } = req.body[0];

        // Calculate total deductions
        const deduction = [
            other_deduction,
            retention_amount,
            tds_amount,
            tds_on_gst_amount,
            covid19_amount_hold,
            ld_amount,
            hold_amount,
        ].reduce((sum, value) => sum + parseFloat(value ?? 0), 0);

        // Calculate the final amount
        const amounts = (parseFloat(gross_amount) - deduction).toFixed(2);

        // Get previous amount received
        const previousPayment = await getPreviousAmount(id);
        const totalAmountReceived = parseFloat(amount_received) + previousPayment.amount_received;
        const balanceAmount = parseFloat(amounts) - totalAmountReceived;
        let updatedStatus;
        if (status == 2) {
            updatedStatus = status;
        } else {
            updatedStatus = parseFloat(amounts) === parseFloat(totalAmountReceived) ? 2 : 1;
        }
        // Update payment receive history
        // Prepare data for update
        const paymentData = {
            pv_number,
            pv_amount,
            receipt_date,
            gross_amount,
            tds,
            tds_amount,
            tds_on_gst,
            tds_on_gst_amount,
            retention,
            retention_amount,
            ld_amount,
            hold_amount,
            covid19_amount_hold,
            other_deduction,
            amount_received: totalAmountReceived,
            amount: amounts,
            status: updatedStatus,
            updated_by: req.user.user_id
        };

        // Update payment receive table
        const updateQuery = `UPDATE payment_receive SET ? WHERE id = ?`;
        const queryResult = await db.query(updateQuery, [paymentData, id]);

        // Check if update was successful
        if (queryResult.affectedRows > 0) {
            // Record payment history
            await paymentHistory(previousPayment.invoice_id, id, paymentData.pv_number, paymentData.pv_amount, paymentData.amount, amount_received, balanceAmount, paymentData.receipt_date, paymentData.updated_by);
            return res.status(200).json({ status: true, message: "Payment updated successfully" });
        }

        return res.status(StatusCodes.OK).json({ status: false, message: "Error! Payment not found" });

    } catch (error) {
        console.error("Error updating payment receive:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Failed to update payment",
        });
    }
};


async function paymentHistory(invoiceId, paymentUpdateId, pvNumber, voucher_amount, amount, amount_received, balance, voucherDate, createdBy) {
    try {
        const paymentHistoryQuery = `
            INSERT INTO payment_voucher_history 
            SET invoice_id = ?, 
                payment_update_id = ?,  
                pv_number = ?, 
                voucher_amount = ?,
                amount = ?,
                amount_received = ?, 
                balance = ?, 
                voucher_date = ?, 
                created_by = ?
        `;
        const paymentHistoryParams = [invoiceId, paymentUpdateId, pvNumber, voucher_amount, amount, amount_received, balance, voucherDate, createdBy];
        const result = await db.query(paymentHistoryQuery, paymentHistoryParams);
    } catch (error) {
        throw error; // Throw error to handle it in the calling function if needed
    }
}


async function getPreviousAmount(id) {
    const selectQuery = await db.query(`select * from payment_receive where id = ${id}`)
    return selectQuery[0];
}


const listingOfPvNumber = async (req, res) => {
    try {
        const status = parseInt(req.query.status, 10); // Ensure status is an integer

        let selectQuery;
        let queryResult;

        if (status === 1 || status === 2) {
            selectQuery = `SELECT pv_number FROM payment_receive WHERE status = ? GROUP BY pv_number`;
            queryResult = await db.query(selectQuery, [status]);
        } else if (status === 3) {
            selectQuery = `SELECT pv_number FROM payment_receive WHERE status = '2' AND retention_status IS NULL GROUP BY pv_number`;
            queryResult = await db.query(selectQuery);
        } else if (status === 4 || status === 5 || status === 6) {
            let retentionStatus;
            if (status === 4) {
                retentionStatus = '1';
            } else if (status === 5) {
                retentionStatus = '2';
            } else if (status === 6) {
                retentionStatus = '3';
            }
            const selectQuery = `SELECT pv_number FROM payment_retention WHERE retention_status = '${retentionStatus}' GROUP BY pv_number`;
            queryResult = await db.query(selectQuery);


        }

        if (queryResult.length > parseInt(process.env.VALUE_ZERO, 10)) {
            return res.status(StatusCodes.OK).json({ status: true, data: queryResult });
        }

        return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};



// payment retention 

const getAllPaymentReceiveInPayment = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const pv_number = req.query.pv_number;

        let search_value = "";
        let whereCondition = "";
        if (searchData) {
            search_value += ` AND (invoice_number LIKE '%${searchData}%' OR invoice_date LIKE '%${searchData}%' OR pv_number LIKE '%${searchData}%')`;
        }

        if (pv_number) {
            whereCondition += `AND pv_number LIKE '%${pv_number}%'`
        }

        const selectQuery = `SELECT * FROM payment_receive WHERE status = '2' AND retention_status IS NULL ${whereCondition}${search_value} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(
            0,
            selectQuery.indexOf("ORDER BY")
        );
        const totalResult = await db.query(modifiedQueryString);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const pageDetails = await calculatePagination(
                totalResult.length,
                currentPage,
                pageSize
            );

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult,
                pageDetails: pageDetails,
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


const updatePaymentRetentionStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const { error } = updateRetentionStatusValidation.validate(req.body);

        if (error)
            return res.status(403).json({ status: false, message: error.message });

        const updateQuery = `UPDATE payment_retention SET retention_status = ? WHERE id = ?`;

        const queryResult = await db.query(updateQuery, [status, id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({
                status: true,
                message: "Payment retention status changed successfully",
            });
        } else {
            res.status(403).json({
                status: false,
                message: "Error! payment retention status not changed",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

async function checkAlreadyInserted(id) {
    try {
        const checkExistenceQuery = `SELECT * FROM payment_retention WHERE payment_unique_id = ?`;
        const checkExistenceResult = await db.query(checkExistenceQuery, [id]);
        return checkExistenceResult.length > 0;
    } catch (error) {
        return error.message;
    }
}

async function updateRetentionStatus(receipt_date) {
    try {
        const updateRetentionStatusQuery = `UPDATE payment_receive SET retention_status = ? WHERE receipt_date = ?`;
        await db.query(updateRetentionStatusQuery, [1, receipt_date]);
    } catch (error) {
        return error.message;
    }
}

cron.schedule("0 0 * * *", async () => {
    try {
        // calculate one year ago date
        const oneYearAgoDate = moment().subtract(0, "days").format("YYYY-MM-DD");

        const selectQuery = `SELECT * FROM payment_receive WHERE receipt_date = ?`;
        const paymentReceiveData = await db.query(selectQuery, [oneYearAgoDate]);

        if (paymentReceiveData.length > 0) {
            for (let payment of paymentReceiveData) {
                const isInserted = await checkAlreadyInserted(
                    payment.payment_unique_id
                );
                if (!isInserted) {
                    await updateRetentionStatus(oneYearAgoDate);
                    const { id, ...retentionData } = payment;
                    const insertRetentionQuery = `INSERT INTO payment_retention SET ?`;
                    await db.query(insertRetentionQuery, retentionData);
                }
            }
        }
        console.log("Payment retention cron job executed successfully");
    } catch (error) {
        console.log("Error in payment retention cron job: ", error);
    }
});


const updatePaymentReceiveInRetention = async (req, res) => {
    try {
        const { error, value } = updatePaymentReceiveValidation.validate(req.body[0]);

        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }
        // return 
        const {
            id,
            pv_number,
            pv_amount,
            receipt_date,
            retention,
            retention_amount,
        } = req.body;

        let paymentData = {
            pv_number,
            pv_amount,
            receipt_date,
            retention,
            retention_amount,
            updated_by: req.user.user_id,
        };

        const updateQuery = `UPDATE payment_retention SET ? WHERE id = ?`;
        const queryResult = await db.query(updateQuery, [paymentData, id]);

        if (queryResult.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Payment updated successfully" });
        }

        return res.status(StatusCodes.OK).json({ status: false, message: "Error! Payment not found" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Failed to update payment",
        });
    }
};



// tariq 

// const getAllPaymentRetention = async (req, res) => {
//     try {

//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || "";
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         // const status = req.query.status || 2;
//         const billing_ro = req.query.billing_ro;
//         const retention_status = req.query.retention_status;
//         const po_number = req.query.po_number;

//         let search_value = "";
//         if (searchData) {
//             search_value += ` AND (invoice_number LIKE '%${searchData}%' OR invoice_date LIKE '%${searchData}%' OR pv_number LIKE '%${searchData}%')`;
//         }

//         let whereConditions = "";

//         if (billing_ro) {
//             whereConditions += ` AND billing_ro = ${billing_ro}`;
//         }


//         if (po_number) {
//             whereConditions += ` AND po_number = '${po_number}'`
//         }


//         const selectQuery = `SELECT * FROM payment_retention WHERE retention_status = ${retention_status} ${searchData} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

//         const queryResult = await db.query(selectQuery);
//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);
//         const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//         let resultData = [];
//         if (queryResult.length > process.env.VALUE_ZERO) {

//             for (const data of queryResult) {
//                 const selectQuery = `SELECT * FROM invoices WHERE id = ${data.invoice_id} ${whereConditions}`;
//                 const invoiceQuery = await db.query(selectQuery)

//                 for (const row of invoiceQuery) {
//                     const pi_ids = row.pi_id;
//                     const complaintIds = await getComplaintsAndOutlets(pi_ids);
//                     const po_detail = await getPoDetailById(row.po_number);
//                     const [ro_detail] = await getRegionalNameById(row.billing_ro);
//                     const callupNumber = await getCallupNumber(row.id)
//                     const complaints = await getComplaintUniqueIds(complaintIds.finalComplaints);
//                     let complaintDetails = [];
//                     let outletDetails = [];
//                     let salesAreaDetails = [];

//                     for (const complaint of complaints) {
//                         const complaintTypeDetails = await getComplaintTypeById(complaint.complaint_type);
//                         complaintDetails.push({
//                             complaint_id: complaint.complaint_unique_id,
//                             complaint_type_id: complaintTypeDetails.id,
//                             complaint_type_name: complaintTypeDetails.complaint_type_name,
//                         });
//                         var outlet;
//                         if (complaint.complaint_for == 1) {
//                             outlet = await getOutletById(complaint.outlet_id);
//                         } else {
//                             outlet = "";
//                         }
//                         const outletDetail = outlet[0];
//                         if (outletDetail?.outlet_name) {
//                             outletDetails.push({ outlet_id: outletDetail.id ? outletDetail.id : "", outlet_name: outletDetail.outlet_name ? outletDetail.outlet_name : "", outlet_unique_id: outletDetail.outlet_unique_id ? outletDetail.outlet_unique_id : "", });
//                         }
//                         const [saleAreaDetail] = await getSalesAreaById(complaint.sale_area_id);

//                         salesAreaDetails.push({ sales_area_id: saleAreaDetail.id ? saleAreaDetail.id : "", sales_area_name: saleAreaDetail.sales_area_name ? saleAreaDetail.sales_area_name : "", });
//                     }

//                     resultData.push({
//                         id: data.id,
//                         invoice_no: row.invoice_no,
//                         invoice_date: row.invoice_date
//                             ? moment(row.invoice_date).format("YYYY-MM-DD")
//                             : moment(row.created_at).format("YYYY-MM-DD"),
//                         invoice_amount: data.net_amount,
//                         callup_number: row.callup_number,
//                         po_id: row.po_number,
//                         po_number: po_detail.po_number,
//                         po_date: moment(row.po_date).format("YYYY-MM-DD"),
//                         ro_id: row.billing_ro,
//                         ro_name: ro_detail.regional_office_name
//                             ? ro_detail.regional_office_name
//                             : "",
//                         pv_number: data.pv_number,
//                         pv_date: data.receipt_date,
//                         pv_amount: data.pv_amount,
//                         retention_unique_id: data.retention_unique_id,
//                         salesAreaDetails,
//                         outletDetails,
//                         complaintDetails,
//                     });
//                 }
//             }

//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Fetched successfully",
//                 data: resultData,
//                 pageDetails: pageDetails,
//             });
//         }
//         res.status(StatusCodes.OK).json({
//             status: false,
//             message: "Data not found",
//         });

//     } catch (error) {

//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };


const getAllPaymentRetention = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        // const status = req.query.status || 2;
        const billing_ro = req.query.billing_ro;
        const retention_status = req.query.retention_status;
        const po_number = req.query.po_number;
        const retentionId = req.query.retention_id;
        let search_value = "";

        if (retentionId) {
            search_value += ` AND retention_unique_id = '${retentionId}'`;
        }

        if (searchData) {
            search_value += ` AND (invoice_number LIKE '%${searchData}%' OR invoice_date LIKE '%${searchData}%' OR pv_number LIKE '%${searchData}%')`;
        }

        let whereConditions = "";

        if (billing_ro) {
            whereConditions += ` AND billing_ro = ${billing_ro}`;
        }

        if (po_number) {
            whereConditions += ` AND po_number = '${po_number}'`;
        }

        const selectQuery = `SELECT * FROM payment_retention WHERE retention_status = ${retention_status} ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(
            0,
            selectQuery.indexOf("ORDER BY")
        );
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(
            totalResult.length,
            currentPage,
            pageSize
        );

        let resultData = [];
        if (queryResult.length > process.env.VALUE_ZERO) {
            for (const data of queryResult) {
                const selectQuery = `SELECT * FROM invoices WHERE id = ${data.invoice_id} ${whereConditions}`;
                const invoiceQuery = await db.query(selectQuery);

                for (const row of invoiceQuery) {
                    const pi_ids = row.pi_id;
                    const complaintIds = await getComplaintsAndOutlets(pi_ids);
                    const po_detail = await getPoDetailById(row.po_number);
                    const [ro_detail] = await getRegionalNameById(row.billing_ro);
                    const callupNumber = await getCallupNumber(row.id);
                    const complaints = await getComplaintUniqueIds(
                        complaintIds.finalComplaints
                    );
                    let complaintDetails = [];
                    let outletDetails = [];
                    let salesAreaDetails = [];

                    for (const complaint of complaints) {
                        const complaintTypeDetails = await getComplaintTypeById(
                            complaint.complaint_type
                        );
                        complaintDetails.push({
                            complaint_id: complaint.complaint_unique_id,
                            complaint_type_id: complaintTypeDetails.id,
                            complaint_type_name: complaintTypeDetails.complaint_type_name,
                        });
                        var outlet;
                        if (complaint.complaint_for == 1) {
                            outlet = await getOutletById(complaint.outlet_id);
                        } else {
                            outlet = "";
                        }
                        const outletDetail = outlet[0];
                        if (outletDetail?.outlet_name) {
                            outletDetails.push({
                                outlet_id: outletDetail.id ? outletDetail.id : "",
                                outlet_name: outletDetail.outlet_name
                                    ? outletDetail.outlet_name
                                    : "",
                                outlet_unique_id: outletDetail.outlet_unique_id
                                    ? outletDetail.outlet_unique_id
                                    : "",
                            });
                        }
                        const [saleAreaDetail] = await getSalesAreaById(
                            complaint.sale_area_id
                        );

                        salesAreaDetails.push({
                            sales_area_id: saleAreaDetail.id ? saleAreaDetail.id : "",
                            sales_area_name: saleAreaDetail.sales_area_name
                                ? saleAreaDetail.sales_area_name
                                : "",
                        });
                    }

                    resultData.push({
                        id: data.id,
                        invoice_no: row.invoice_no,
                        invoice_date: row.invoice_date
                            ? moment(row.invoice_date).format("YYYY-MM-DD")
                            : moment(row.created_at).format("YYYY-MM-DD"),
                        invoice_amount: data.net_amount,
                        callup_number: row.callup_number,
                        po_id: row.po_number,
                        po_number: po_detail.po_number,
                        po_date: moment(row.po_date).format("YYYY-MM-DD"),
                        ro_id: row.billing_ro,
                        ro_name: ro_detail.regional_office_name
                            ? ro_detail.regional_office_name
                            : "",
                        pv_number: data.pv_number,
                        pv_date: data.receipt_date,
                        pv_amount: data.pv_amount,
                        retention_unique_id: data.retention_unique_id,
                        salesAreaDetails,
                        outletDetails,
                        complaintDetails,
                    });
                }
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: resultData,
                pageDetails: pageDetails,
            });
        }
        res.status(StatusCodes.OK).json({
            status: false,
            message: "Data not found",
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

const getRetentinIdForDropdown = async (req, res) => {
    try {
        const status = req.query.status;
        const ro = req.query.ro;

        let selectQuery = `SELECT DISTINCT retention_unique_id FROM payment_retention WHERE retention_status = ${status}`;

        if (ro) {
            selectQuery = `SELECT DISTINCT payment_retention.retention_unique_id FROM payment_retention LEFT JOIN invoices ON payment_retention.invoice_id = invoices.id WHERE invoices.payment_status = 2 AND payment_retention.retention_status = '${status}' AND invoices.billing_ro = '${ro}'`;
        }

        const result = await db.query(selectQuery);
        if (result.length > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                data: result,
            });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Data not found",
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};
const getRoForDropdown = async (req, res) => {
    try {
        const po = req.query.po;
        const retention_status = req.query.status || 1;
        const selectQuery = `SELECT DISTINCT invoices.billing_ro FROM payment_retention LEFT JOIN invoices ON payment_retention.invoice_id = invoices.id WHERE invoices.payment_status = 2 AND payment_retention.retention_status = ${retention_status} AND invoices.po_number = '${po}'`;

        const queryResult = await db.query(selectQuery);
        const result = [];
        for (let ro of queryResult) {
            const [ro_detail] = await getRegionalNameById(ro.billing_ro);
            result.push(ro_detail);
        }
        res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Fetched successfully", data: result });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

const getPoForDropdown = async (req, res) => {
    try {
        const retention_status = req.query.status || 1;
        const selectQuery = `SELECT DISTINCT invoices.po_number FROM payment_retention LEFT JOIN invoices ON payment_retention.invoice_id = invoices.id WHERE invoices.payment_status = 2 AND payment_retention.retention_status = ${retention_status}`;

        const queryResult = await db.query(selectQuery);

        const result = [];
        for (let po of queryResult) {
            const po_detail = await getPoDetailById(po.po_number);
            result.push(po_detail);
        }

        return res
            .status(StatusCodes.OK)
            .json({ status: true, message: "Fetched successfully", data: result });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

const approvePaymentRetention = async (req, res) => {
    try {
        const schema = Joi.object({
            ids: Joi.array().items(Joi.number().integer().required()).required(),
        }).required();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).json({ status: false, message: error.message });
        const retention_unique_id = await generateRetentionUniqueId();
        const data = {
            retention_unique_id,
            retention_status: 2,
        };

        const updateQuery = `UPDATE payment_retention SET ? WHERE id IN (?)`;

        const queryResult = await db.query(updateQuery, [data, req.body.ids]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Payment Retention approved successfully",
            });
        }
        res.status(StatusCodes.OK).json({
            status: false,
            message: "Something went wrong in approving payment retention.",
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


const getAllPaymentRetentionById = async (req, res) => {
    try {

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        // const status = req.query.status || 2;
        const billing_ro = req.query.billing_ro;
        const retention_status = req.query.status || 1;
        const pv_number = req.query.pv_number;

        let search_value = "";
        if (searchData) {
            search_value += ` AND (invoice_number LIKE '%${searchData}%' OR invoice_date LIKE '%${searchData}%' OR pv_number LIKE '%${searchData}%')`;
        }

        let whereConditions = "";
        let whereCondition = "";

        if (billing_ro) {
            whereConditions += ` AND billing_ro = '${billing_ro}'`;
        }


        if (pv_number) {
            whereCondition += `AND pv_number = '${pv_number}'`
        }


        const selectQuery = `SELECT * FROM payment_retention WHERE id = ${id} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        let resultData = [];
        if (queryResult.length > process.env.VALUE_ZERO) {

            for (const data of queryResult) {
                const invoiceQuery = await db.query(`SELECT * FROM invoices WHERE id = ${data.invoice_id}`);

                for (const row of invoiceQuery) {
                    const pi_ids = row.pi_id;
                    const complaintIds = await getComplaintsAndOutlets(pi_ids);
                    const po_detail = await getPoDetailById(row.po_number);
                    const [ro_detail] = await getRegionalNameById(row.billing_ro);
                    const callupNumber = await getCallupNumber(row.id)
                    const complaints = await getComplaintUniqueIds(complaintIds.finalComplaints);
                    let complaintDetails = [];
                    let outletDetails = [];
                    let salesAreaDetails = [];

                    for (const complaint of complaints) {
                        const complaintTypeDetails = await getComplaintTypeById(complaint.complaint_type);
                        complaintDetails.push({
                            complaint_id: complaint.complaint_unique_id,
                            complaint_type_id: complaintTypeDetails.id,
                            complaint_type_name: complaintTypeDetails.complaint_type_name,
                        });
                        var outlet;
                        if (complaint.complaint_for == 1) {
                            outlet = await getOutletById(complaint.outlet_id);
                        } else {
                            outlet = "";
                        }
                        const outletDetail = outlet[0];
                        if (outletDetail?.outlet_name) {
                            outletDetails.push({ outlet_id: outletDetail.id ? outletDetail.id : "", outlet_name: outletDetail.outlet_name ? outletDetail.outlet_name : "", outlet_unique_id: outletDetail.outlet_unique_id ? outletDetail.outlet_unique_id : "", });
                        }
                        const [saleAreaDetail] = await getSalesAreaById(complaint.sale_area_id);

                        salesAreaDetails.push({ sales_area_id: saleAreaDetail.id ? saleAreaDetail.id : "", sales_area_name: saleAreaDetail.sales_area_name ? saleAreaDetail.sales_area_name : "", });
                    }

                    resultData.push({
                        id: data.id,
                        invoice_no: row.invoice_no,
                        invoice_date: row.invoice_date
                            ? moment(row.invoice_date).format("YYYY-MM-DD")
                            : moment(row.created_at).format("YYYY-MM-DD"),
                        invoice_amount: data.net_amount,
                        callup_number: row.callup_number,
                        po_id: row.po_number,
                        po_number: po_detail.po_number,
                        po_date: moment(row.po_date).format("YYYY-MM-DD"),
                        ro_id: row.billing_ro,
                        ro_name: ro_detail.regional_office_name
                            ? ro_detail.regional_office_name
                            : "",
                        pv_number: data.pv_number,
                        pv_date: data.receipt_date,
                        pv_amount: data.pv_amount,
                        retention_unique_id: data.retention_unique_id,
                        salesAreaDetails,
                        outletDetails,
                        complaintDetails,
                    });
                }
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: resultData,
                pageDetails: pageDetails,
            });
        }
        res.status(StatusCodes.OK).json({
            status: false,
            message: "No data found",
        });

    } catch (error) {

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


async function getCallupNumber(id) {
    try {

        if (id) {
            const selectQuery = await db.query(`select * from invoices where id = ${id}`)
            if (selectQuery.length > 0) {
                if (selectQuery[0].merged_invoice_id === null) {
                    const invoice_ids = merged_invoice_id.split(',').map(id => parseInt(id.trim()));
                    const placeholders = invoice_ids.map(() => '?').join(',');
                    const callupQuery = `SELECT callup_number FROM invoices WHERE id IN (${placeholders})`;
                    const callupResult = await db.query(callupQuery, invoice_ids);

                    if (callupResult.length > 0) {
                        return callupResult[0].callup_number;
                    } else {
                        return null;
                    }
                } else {
                    const callupQuery = `SELECT callup_number FROM invoices WHERE id = ${id}`;
                    const callupResult = await db.query(callupQuery, invoice_ids);

                    if (callupResult.length > 0) {
                        return callupResult[0].callup_number;
                    } else {
                        return null;
                    }
                }

            }
        }

    } catch (error) {
        return error.message;
    }
}


const getPaymentRetentionDetailsById = async (req, res) => {
    try {
        const id = req.params.id;

        const { error } = checkPositiveInteger.validate({ id });
        if (error)
            res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const selectQuery = `SELECT id, payment_unique_id, receipt_date AS voucher_date, invoice_id, invoice_number, invoice_date, net_amount, igst, cgst, sgst, gst_amount, gross_amount, received_gst, other_deduction, retention, retention_amount, tds, tds_amount, tds_on_gst, tds_on_gst_amount, amount, amount_received AS received_amount, pv_number AS payment_voucher_number, pv_amount, ld_amount, hold_amount, covid19_amount_hold, status, retention_status, (amount - amount_received) AS balance FROM payment_retention  WHERE payment_retention.id = ${id}`;

        // LEFT JOIN payment_voucher_history ON payment_voucher_history.payment_update_id =  payment_receive.id
        const queryResult = await db.query(selectQuery);
        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({
                status: true,
                message: "Fetched successfully",
                data: queryResult[0],
            });
        } else {
            res.status(StatusCodes.OK).json({
                status: false,
                message: "Payment Not Found",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


const discardPaymentRetention = async (req, res) => {
    try {
        const id = req.params.id;
        const updateQuery = `UPDATE payment_retention SET retention_status = ? WHERE id = ?`;
        const queryResult = await db.query(updateQuery, [1, id]);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Payment Retention discarded successfully",
            });
        }
        res.status(StatusCodes.OK).json({
            status: false,
            message: "Something went wrong in discarding payment retention.",
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

// const updatePaymentAmountRetention = async (req, res) => {
//     try {
//         const { error, value } = updatePaymentAmountRetentionValidation.validate(
//             req.body
//         );

//         if (error) {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({ status: false, message: error.message });
//         }

//         const { id, payment_reference_number, date, amount, status } = req.body;
//         const data = {
//             payment_reference_number,
//             date,
//             amnt: amount,
//             retention_status: status
//         };

//         const updateQuery = `UPDATE payment_retention SET ? WHERE id = ?`;
//         const queryResult = await db.query(updateQuery, [data, id]);
//         if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Payment amount updated successfully",
//             });
//         }
//         res.status(StatusCodes.OK).json({
//             status: false,
//             message: "Something went wrong in updating payment amount.",
//         })
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// }




// const updatePaymentAmountRetention = async (req, res) => {
//     try {
//         const { error, value } = updatePaymentAmountRetentionValidation.validate(
//             req.body
//         );

//         if (error) {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({ status: false, message: error.message });
//         }

//         const { id, payment_reference_number, date, amount } =req.body;

//         const data = {
//             payment_reference_number,
//             date,
//             amnt: amount,
//         };

//         const updateQuery = `UPDATE payment_retention SET ? WHERE retention_unique_id = ? AND receipt_date < ?`;
//         const queryResult = await db.query(updateQuery, [
//             data,
//             retention_unique_id,
//             date,
//         ]);
//         if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Payment amount updated successfully",
//             });
//         }
//         res.status(StatusCodes.OK).json({
//             status: false,
//             message: "Cannot update payment, please check your values.",
//         });
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

const updatePaymentAmountRetention = async (req, res) => {
    try {
        const { error, value } = updatePaymentAmountRetentionValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({ status: false, message: error.message });
        }

        const { ids, payment_reference_number, date, amount } = req.body;

        // Check if ids is an array and has at least one element
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: 'ids must be a non-empty array' });
        }

        const data = {
            payment_reference_number,
            date,
            amnt: amount,
            retention_status: 3
        };

        // return 

        // Loop through each id and update the record
        for (const id of ids) {

            const updateQuery = `UPDATE payment_retention SET ? WHERE id = ? AND receipt_date < ?`;
            const queryResult = await db.query(updateQuery, [data, id, date]);

            if (queryResult.affectedRows <= process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Cannot update payment for retention_unique_id: ${id}, please check your values.`,
                });
            }
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Payment amounts updated successfully",
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


// const getRoForDropdown = async (req, res) => {
//     try {
//         const retention_status = req.query.status || 1;
//         const selectQuery = `SELECT invoices.billing_ro FROM payment_retention LEFT JOIN invoices ON payment_retention.invoice_id = invoices.id WHERE invoices.payment_status = 2 AND payment_retention.retention_status = ${retention_status}`;

//         const queryResult = await db.query(selectQuery);
//         const result = []
//         for (let ro of queryResult) {
//             const [ro_detail] = await getRegionalNameById(ro.billing_ro)
//             result.push(ro_detail)
//         }
//         res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: result })
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// }


// const getPoForDropdown = async (req, res) => {
//     try {
//         const retention_status = req.query.status || 1;
//         const selectQuery = `SELECT invoices.po_number FROM payment_retention LEFT JOIN invoices ON payment_retention.invoice_id = invoices.id WHERE invoices.payment_status = 2 AND payment_retention.retention_status = ${retention_status}`;

//         const queryResult = await db.query(selectQuery);

//         const result = []
//         for (let po of queryResult) {
//             const po_detail = await getPoDetailById(po.po_number)
//             result.push(po_detail)
//         }

//         return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: result })
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }

// }

// const approvePaymentRetention = async (req, res) => {
//     try {
//         const schema = Joi.object({
//             ids: Joi.array().items(Joi.number().integer().required()).required(),
//         }).required();
//         const { error } = schema.validate(req.body);

//         if (error) return res.status(400).json({ status: false, message: error.message });
//         const retention_unique_id = await generateRetentionUniqueId();
//         const data = {
//             retention_unique_id,
//             retention_status: 2,
//         }

//         const updateQuery = `UPDATE payment_retention SET ? WHERE id IN (?)`;

//         const queryResult = await db.query(updateQuery, [data, req.body.ids,]);

//         if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//             return res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: "Payment Retention approved successfully",
//             });
//         }
//         res.status(StatusCodes.OK).json({
//             status: false,
//             message: "Something went wrong in approving payment retention.",
//         });
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

const getComplaintUniqueIds = async (complaintId) => {
    if (complaintId != null) {
        let selectQuery;
        if (Array.isArray(complaintId)) {
            complaintId = complaintId.join(",");
            selectQuery = `SELECT id, complaints.energy_company_id,complaint_type, complaints.complaint_unique_id, complaint_for, sale_area_id, outlet_id FROM complaints WHERE id IN(${complaintId});`
        } else {
            selectQuery = `SELECT id, complaints.energy_company_id,complaint_type, complaints.complaint_unique_id, complaint_for, sale_area_id, outlet_id FROM complaints WHERE id = ${complaintId};`
        }
        const result = await db.query(selectQuery);

        if (result.length > 0) {
            return result;
        }
    } else {
        return "";
    }
};

async function generateRetentionUniqueId() {
    const retentinoQuery = `SELECT retention_unique_id FROM payment_retention WHERE retention_unique_id IS NOT NULL AND retention_unique_id != '' ORDER BY id DESC LIMIT 1`;
    const result = await db.query(retentinoQuery);
    if (result.length) {
        const currentID = result[0].retention_unique_id;
        const numberPart = parseInt(currentID.slice(3), 10);
        const nextNumber = numberPart + 1;
        return `RTM${nextNumber.toString().padStart(3, "0")}`;
    }
    return "RTM001";
}

module.exports = {
    addPaymentReceive,
    getAllPaymentReceive,
    getPaymentReceiveDetailsById,
    updatePaymentReceive,
    updatePaymentRetentionStatus,
    // get paypment retention 
    getAllPaymentRetention,
    getAllPaymentReceiveInPayment,
    listingOfPvNumber,
    updatePaymentReceiveInRetention,
    getListingofPaymentHistory,
    getRoForDropdown,
    updatePaymentAmountRetention,
    discardPaymentRetention,
    approvePaymentRetention,
    getPaymentRetentionDetailsById,
    getAllPaymentRetentionById,
    getPoForDropdown,
    getRetentinIdForDropdown
}