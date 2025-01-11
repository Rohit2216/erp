var moment = require('moment');
require('dotenv').config();
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { expensePunchValidation, checkPositiveInteger } = require('../helpers/validation');
const { calculatePagination, getCreatedByDetails, getComplaintDetails, getComplaintUniqueId, getUserFundAmount, countUniqueItems, countAllTransactions, getUserDetails, getSupplierDetailsById, insertTransactionsForExpenseImages, updateFundRequests, getTotalExpenseItems, getAdminAndUserDetails } = require('../helpers/general');
const { saveTransactionDetails, getUserWalletBalance, manageUserWallet, convertBase64Image } = require('../helpers/commonHelper');
const { query } = require('express');

/**
 * add expense punch function
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

// const addExpensePunch = async (req, res) => {
//     try {

//         var { regional_office, complaint_id, items, user_id, area_manager_id, supervisor_id, end_users_id, expense_punch_for } = req.body;

//         console.log("req.body", req.body)
//         return 
//         const { error } = expensePunchValidation.validate(req.body);
//         if (error) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 status: false,
//                 message: error.message,
//             });
//         }
//         const punch_by = req.user.user_id;
//         const itemsdata = JSON.stringify(items);
//         const self_request_id = user_id;
//         const request_by = end_users_id || supervisor_id || area_manager_id;
//         let userId;
//         if (expense_punch_for == 1) {
//             userId = self_request_id
//             if (!self_request_id) {

//                 return res.status(StatusCodes.OK).json({ status: false, message: "For self_request, user_id is required" });
//             }
//         } else {
//             userId = end_users_id || supervisor_id || area_manager_id

//             // Other request - at least one of area_manager_id, supervisor_id, end_users_id is required
//             if (!area_manager_id && !supervisor_id && !end_users_id) {
//                 return res.status(StatusCodes.OK).json({ status: false, message: "Please select at least one area manager, supervisor, or end users" });
//             }
//         }

//         const wallet_balance = await getUserWalletBalance(userId);
//         const balanceAmount = wallet_balance.balance ? wallet_balance.balance : 0;

//         const sumOfSubTotal = items.reduce((acc, item) => acc + parseFloat(item.sub_total), 0);

//         if (balanceAmount >= sumOfSubTotal) {
//             for (const details of items) {

//                 const { fund_id, item_id, qty, price, sub_total } = details;

//                 const insertQuery = 'INSERT INTO expense_punch_history(user_id, complaint_id, ro_id, area_manager_id, supervisor_id, end_users_id, expense_punch_for, fund_id, item_id, item_qty, punch_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
//                 const insertValues = [request_by || self_request_id, complaint_id, regional_office, area_manager_id, supervisor_id, end_users_id, expense_punch_for, fund_id, item_id, qty, punch_by]
//                 const queryResult = await db.query(insertQuery, insertValues);

//                 if (queryResult.affectedRows > 0) {
//                     const [getStock] = await db.query(`SELECT * FROM fund_requests WHERE id=?`, [fund_id]);

//                     if (getStock) {
//                         const updateQty = Number(getStock.expense_transfer_quantity) + Number(qty);
//                         const getTotalTransferAmount = Number(getStock.item_price) * Number(qty) + Number(getStock.expense_transfer_amounts);

//                         await db.query(`UPDATE fund_requests SET expense_transfer_quantity = ?, expense_transfer_amounts = ? WHERE id = ?`, [updateQty, getTotalTransferAmount, fund_id]);
//                     }
//                 }

//             }

//             const wallet = await manageUserWallet(user_id, sumOfSubTotal, process.env.DEDUCT_AMOUNT);
//             // add details to transaction table
//             const transactionData = {
//                 user_id: userId,
//                 transaction_type: process.env.DEBIT,
//                 transaction_date: moment(new Date()).format('YYYY-MM-DD'),
//                 amount: sumOfSubTotal,
//                 balance: (balanceAmount - sumOfSubTotal),
//                 description: 'Amount debit for expense punch.',
//                 created_by: user_id,
//                 complaints_id: complaint_id,
//             }

//             await saveTransactionDetails(transactionData);

//             return res.status(StatusCodes.OK).json({ status: true, message: "Expense punch Sucessfully." })
//         } else {
//             return res.status(StatusCodes.OK).json({
//                 status: false,
//                 message: 'User does not have sufficient amount in his wallet',
//             });
//         }

//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

const addExpensePunch = async (req, res) => {
    try {
        // Extracting and destructuring necessary fields from the request body
        let { regional_office, complaint_id, items, user_id, area_manager_id, supervisor_id, end_users_id, expense_punch_for } = req.body;

        // Convert empty string values to null for proper handling
        regional_office = regional_office || null;
        area_manager_id = area_manager_id || null;
        supervisor_id = supervisor_id || null;
        end_users_id = end_users_id || null;

        // Validate request payload
        const { error } = expensePunchValidation.validate(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const punch_by = req.user.user_id;
        const self_request_id = user_id;
        const request_by = end_users_id || supervisor_id || area_manager_id;

        let userId;
        if (expense_punch_for == '1') {
            userId = self_request_id;
            if (!self_request_id) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "For self_request, user_id is required" });
            }
        } else {
            userId = request_by;
            if (!area_manager_id && !supervisor_id && !end_users_id) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Please select at least one area manager, supervisor, or end users" });
            }
        }

        // Fetch user's wallet balance
        const wallet_balance = await getUserWalletBalance(userId);
        const balanceAmount = wallet_balance.balance ? parseFloat(wallet_balance.balance) : 0;

        // Calculate the total cost of items
        const sumOfSubTotal = items.reduce((acc, item) => acc + parseFloat(item.sub_total), 0);

        if (balanceAmount >= sumOfSubTotal) {
            for (const details of items) {
                const { fund_id, item_id, qty, price, sub_total } = details;

                const insertQuery = 'INSERT INTO expense_punch_history(user_id, complaint_id, ro_id, area_manager_id, supervisor_id, end_users_id, expense_punch_for, fund_id, item_id, item_qty, punch_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
                const insertValues = [request_by || self_request_id, complaint_id, regional_office, area_manager_id, supervisor_id, end_users_id, expense_punch_for, fund_id, item_id, qty, punch_by];
                const queryResult = await db.query(insertQuery, insertValues);

                if (queryResult.affectedRows > 0) {
                    const [getStock] = await db.query(`SELECT * FROM fund_requests WHERE id=?`, [fund_id]);

                    if (getStock) {
                        const updateQty = Number(getStock.expense_transfer_quantity) + Number(qty);
                        const getTotalTransferAmount = Number(getStock.item_price) * Number(qty) + Number(getStock.expense_transfer_amounts);

                        await db.query(`UPDATE fund_requests SET expense_transfer_quantity = ?, expense_transfer_amounts = ? WHERE id = ?`, [updateQty, getTotalTransferAmount, fund_id]);
                    }
                }
            }

            const wallet = await manageUserWallet(user_id, sumOfSubTotal, process.env.DEDUCT_AMOUNT);
            // Add details to transaction table
            const transactionData = {
                user_id: userId,
                transaction_type: process.env.DEBIT,
                transaction_date: moment(new Date()).format('YYYY-MM-DD'),
                amount: sumOfSubTotal,
                balance: (balanceAmount - sumOfSubTotal),
                description: 'Amount debited for expense punch.',
                created_by: user_id,
                complaints_id: complaint_id,
            }

            await saveTransactionDetails(transactionData);

            return res.status(StatusCodes.OK).json({ status: true, message: "Expense punch successful." });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'User does not have sufficient amount in their wallet',
            });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

async function saveExpenseHistory(items, user_id) {
    try {

        const results = [];
        const totalAmount = [];
        for (let i = 0; i < items.length; i++) {
            const itemId = items[i].item_name.value;
            const items_price = items[i].price;
            const subTotal = items[i].sub_total;
            const updateQty = items[i].qty;

            const getUserDetailsQuery = 'SELECT * FROM fund_requests WHERE item_id = ? AND request_by = ? AND item_price=?';
            const queryResult = await db.query(getUserDetailsQuery, [itemId, user_id, items_price]);
            results.push(queryResult);
            let remainingQty = updateQty; // Initialize remaining quantity to the requested quantity

            for (const row of queryResult) {
                // Check if remaining quantity is 0, then move to the next item
                if (remainingQty <= 0) break;

                // Check if expense_transfer_quantity is not null and request_qty is equal to expense_transfer_quantity
                if (row.expense_transfer_quantity !== null && row.request_qty === row.expense_transfer_quantity) continue;

                // Calculate the quantity to update based on available quantity and remaining quantity
                const request_qty = Math.min(row.request_qty - row.expense_transfer_quantity || row.request_qty, remainingQty);

                if (request_qty <= 0) continue; // Skip if there is no quantity to update

                // Calculate amount to update based on the calculated quantity
                const expense_transfer_amounts = row.item_price * request_qty;
                totalAmount.push(expense_transfer_amounts);


                // Assuming row.item_price and request_qty are arrays
                // remainingQty -= request_qty;
                // Uncomment below line to update database
                await db.query(`UPDATE fund_requests SET expense_transfer_amounts = COALESCE(expense_transfer_amounts, 0) + ?, expense_transfer_quantity = COALESCE(expense_transfer_quantity, 0) + ? WHERE id = ?`, [expense_transfer_amounts, request_qty, row.id]);
            }
        }

        const getResults = results.filter(result => result.length > 0);

        const sumWithInitial = totalAmount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return sumWithInitial;

    } catch (error) {
        console.error('Error saving expense history:', error);
        throw error; // Throw the error to handle it at a higher level if needed
    }
}

/**
 * function for get all expense punch table data.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

const getAllExpensePunchList = async (req, res) => {

    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = '';


        if (searchData != null && searchData != '') {
            search_value = `AND (complaints.complaint_unique_id LIKE '%${searchData}%' OR users.username LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%' OR admins.name LIKE '%${searchData}%' OR admins.employee_id LIKE '%${searchData}%')`;
        }

        const selectQuery = ` SELECT expense_punch_history.*, complaints.complaint_unique_id FROM expense_punch_history LEFT JOIN complaints ON complaints.id = expense_punch_history.complaint_id LEFT JOIN users ON users.id = expense_punch_history.user_id LEFT JOIN admins ON admins.id = expense_punch_history.user_id WHERE 1 ${search_value} GROUP BY expense_punch_history.user_id, expense_punch_history.complaint_id HAVING (SUM(expense_punch_history.item_qty) - SUM(expense_punch_history.approved_qty)) != 0 ORDER BY expense_punch_history.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            for (row of queryResult) {
                const userDetails = await getAdminAndUserDetails(row.user_id);
                const getPunch = await giveCurrentPunch(row.user_id, row.complaint_id)


                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: userDetails[0].name ? userDetails[0].name : "",
                    employee_id: userDetails[0].employee_id ? userDetails[0].employee_id : "",
                    user_image: userDetails[0].image,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    punch_at: moment(getPunch).format('YYYY-MM-DD HH:mm:ss A'),

                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Request fetched successfully",
                    data: finalData,
                    pageDetails: pageDetails
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

/**
 * function for stock punch using id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

const getExpensePunchById = async (req, res) => {
    try {
        const { id, user_id } = req.params;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message
            });
        }

        const selectQuery = `SELECT expense_punch_history.*, fund_requests.item_price as item_price, DATE_FORMAT(expense_punch_history.punch_at, '%y-%m-%d %H:%i:%s %p') AS punch_at, complaints.complaint_unique_id, users.name AS user_name, users.employee_id AS employee_id, users.image AS user_image, item_masters.name AS item_name, item_masters.id AS item_id, item_masters.image as item_images, fund_requests.id as fund_id FROM expense_punch_history LEFT JOIN complaints ON complaints.id = expense_punch_history.complaint_id LEFT JOIN users ON users.id = expense_punch_history.user_id LEFT JOIN item_masters ON item_masters.id = expense_punch_history.item_id LEFT JOIN fund_requests ON fund_requests.id = expense_punch_history.fund_id WHERE expense_punch_history.complaint_id = '${id}' AND expense_punch_history.user_id = '${user_id}'`;

        const queryResult = await db.query(selectQuery);
        if (queryResult.length > 0) {
            const finalData = await Promise.all(queryResult.map(async (row) => {
                // const getSupplierName = await getSupplierDetailsById(row.supplier_id);
                const complainsDetails = await getComplaintDetails(row.complaint_id, row.complaint_unique_id)
                const getRemainingQty = Number(row.item_qty) - Number(row.approved_qty)

                const getResultManagerQuery = `SELECT users.name, users.image, users.id AS userId FROM users WHERE id IN (?, ?, ?)`;

                const execResultManager = await db.query(getResultManagerQuery, [row.area_manager_id, row.supervisor_id, row.end_users_id]);
                const userDetail = {};

                execResultManager.forEach(user => {
                    const userType = (() => {
                        switch (user.userId) {
                            case row.area_manager_id: return "Area Manager";
                            case row.supervisor_id: return "Supervisor";
                            case row.end_users_id: return "End User";
                            default: return "Unknown"; // Handle unexpected cases
                        }
                    })();

                    userDetail[userType] = {
                        name: user.name,
                        image: user.image,
                        id: user.userId
                    };
                });
                const userDetails = await getAdminAndUserDetails(row.user_id);


                return {
                    id: row.id,
                    user_id: row.user_id,
                    user_name: userDetails[0].name ? userDetails[0].name : "",
                    employee_id: userDetails[0].employee_id ? userDetails[0].employee_id : "",
                    user_image: userDetails[0].image,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    item_name: row.item_name,
                    item_id: row.item_id,
                    item_qty: row.item_qty,
                    item_price: row.item_price,
                    item_images: row.item_images,
                    total_Amount: Number(row.item_price) * Number(row.item_qty),
                    transaction_id: row.transaction_id ? row.transaction_id : null,
                    punch_at: row.punch_at,
                    fund_id: row.fund_id,
                    complainsDetails: complainsDetails,
                    remaining_approved_qty: getRemainingQty,
                };
            }));

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Request fetched successfully",
                data: finalData,
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

const getAllCheckAndApprove = async (req, res) => {
    try {

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = '';
        const finalData = [];

        if (searchData != null && searchData != '') {
            search_value += `WHERE (complaints.complaint_unique_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT * FROM fund_requests WHERE expense_transfer_quantity <> 0 AND expense_transfer_amounts <> 0 ${search_value} ORDER BY fund_requests.id ASC LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
        if (queryResult.length > 0) {
            for (const row of queryResult) {
                const request_by_details = await getCreatedByDetails(row.request_by);


                finalData.push({
                    id: row.id,
                    expense_transfer_quantity: row.expense_transfer_quantity,
                    expense_transfer_amounts: row.expense_transfer_amounts,
                    expense_transfer_date: row.expense_transfer_date,
                    status: row.status,
                    request_for_id: request_by_details.id ? request_by_details.id : '',
                    request_for: request_by_details.name ? request_by_details.name : '',
                    request_for_image: request_by_details.image ? request_by_details.image : '',
                    request_for_employee_id: request_by_details.employee_id ? request_by_details.employee_id : '',
                })
            }

            return res.status(StatusCodes.OK).json({ status: true, data: finalData, pageDetails: pageDetails });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const changeStatusOfCheckAndApprove = async (req, res) => {
    try {
        const { id, status } = req.body;

        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }

        const selectQuery = await db.query(`SELECT * FROM fund_requests WHERE id = ?`)

        if (selectQuery.length > 0) {
            const updateQuery = `UPDATE fund_requests SET status = '${status}' WHERE id = '${id}'`;
            const queryResult = await db.query(updateQuery);

            if (queryResult.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({ status: true, message: "Status changed successfully" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const updateExpensePunch = async (req, res) => {
    try {
        const { items, transaction_images, user_id, complaint_id } = req.body;
        const approve_by = req.user.user_id;
        const approve_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Approve Expense Punch field is missing or empty."
            });
        }

        for (const data of items) {
            if (!data.item_qty || data.item_qty <= 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Approve Quantity should be provided and greater than 0!" });
            }
        }

        for (const imageObj of transaction_images) {
            // Check if the image property is not empty
            if (imageObj.image != null && imageObj.image != '' && imageObj.image.length > 0) {
                const processedImages = [];
                const base64File = imageObj.image.replace(/^data:image\/\w+;base64,/, '');
                const result = await convertBase64Image(base64File, './public/transaction_images/', '/transaction_images/');
                processedImages.push({ title: imageObj.title, images: result });

                const req_images = JSON.stringify(processedImages);

                const insertTransaction = await insertTransactionsForExpenseImages(user_id, complaint_id, req_images);
            }
        }
        for (const data of items) {
            const { id, item_qty, transaction_id, payment_mode } = data;
            const selectQuery = await db.query(`SELECT * FROM expense_punch_history WHERE id ='${id}'`);
            const approve_quantity = selectQuery[0].approved_qty;
            const totalQty = Number(approve_quantity) + Number(item_qty)
            let status;
            if (totalQty == selectQuery[0].item_qty) {
                status = '1'
            } else {
                status = '0'
            }

            const stockPunchApprove = await db.query(
                `UPDATE expense_punch_history SET approved_qty = COALESCE(approved_qty, 0) + ?, status = ?, approved_by = ?, approved_at = ?, transaction_id= ?, payment_mode =? WHERE id = ?`,
                [item_qty, status, approve_by, approve_at, transaction_id || null, payment_mode || null, id]
            );
        }


        await updateFundRequests(items);

        return res.status(StatusCodes.OK).json({ status: true, message: "Expense Punch Approved Successfully" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getListExpensePunchApprove = async (req, res) => {

    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = '';

        if (searchData != null && searchData != '') {
            search_value = `AND (complaints.complaint_unique_id LIKE '%${searchData}%' OR users.username LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT expense_punch_history.*, item_masters.name AS item_name, item_masters.id AS item_id, DATE_FORMAT(expense_punch_history.approved_at, '%y-%m-%d %H:%i:%s') AS approve_at, complaints.complaint_unique_id, count_transactions.count_transactions FROM expense_punch_history LEFT JOIN complaints ON complaints.id = expense_punch_history.complaint_id LEFT JOIN users ON users.id = expense_punch_history.user_id LEFT JOIN item_masters ON item_masters.id = expense_punch_history.item_id LEFT JOIN fund_requests ON fund_requests.id = expense_punch_history.fund_id LEFT JOIN (SELECT user_id, complaint_id, COUNT(transaction_id) AS count_transactions FROM expense_punch_history GROUP BY user_id, complaint_id ) AS count_transactions ON count_transactions.user_id = expense_punch_history.user_id AND count_transactions.complaint_id = expense_punch_history.complaint_id WHERE expense_punch_history.status IN ('0', '1') AND expense_punch_history.approved_qty <> 0 ${search_value} GROUP BY expense_punch_history.user_id, expense_punch_history.complaint_id HAVING count_transactions.count_transactions <> 0 ORDER BY expense_punch_history.id DESC LIMIT ${pageFirstResult}, ${pageSize};`

        const queryResult = await db.query(selectQuery);


        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            for (row of queryResult) {
                const userDetails = await getAdminAndUserDetails(row.user_id);
                const complainsDetails = await getComplaintDetails(row.complaint_id, row.complaint_unique_id)
                const getItems = await getTotalExpenseItems(row.user_id, row.complaint_id)
                const getPunch = await giveApprovePunch(row.user_id, row.complaint_id)

                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: userDetails[0].name ? userDetails[0].name : "",
                    employee_id: userDetails[0].employee_id ? userDetails[0].employee_id : "",
                    user_image: userDetails[0].image,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    item_name: row.item_name,
                    item_id: row.item_id,
                    item_qty: row.item_qty,
                    punch_at: moment(row.punch_at).format('YYYY-MM-DD HH:mm:ss A'),
                    item_approved_qty: row.approved_qty,
                    approved_at: moment(getPunch).format('YYYY-MM-DD HH:mm:ss A'),
                    total_transactions: row.count_transactions,
                    complainsDetails: complainsDetails,
                    total_items: getItems[0].total_items,
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Request fetched successfully",
                    data: finalData,
                    pageDetails: pageDetails
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

function calculateTotalPriceSum(itemsArray) {
    let totalPriceSum = 0;

    itemsArray.forEach(item => {
        const price = item.price || 0; // Default to 0 if price is undefined
        const approvedQty = parseInt(item.approved_qty) || 0; // Default to 0 if approved_qty is not a valid number

        const totalItemPrice = price * approvedQty;
        totalPriceSum += totalItemPrice; // Add to the total sum
    });

    return totalPriceSum;
}


const getListExpensePunchApproveAccordingToItems = async (req, res) => {

    try {
        //pagination data
        const { user_id, complaint_id } = req.query;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = '';

        if (searchData != null && searchData != '') {
            search_value = `WHERE (complaints.complaint_unique_id LIKE '%${searchData}%' OR users.username LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
        }

        const selectQuery = ` SELECT expense_punch_history.*, item_masters.name AS item_name, item_masters.id AS item_id, item_masters.image as item_images, DATE_FORMAT(expense_punch_history.approved_at, '%y-%m-%d %H:%i:%s %p') AS approve_at, complaints.complaint_unique_id, fund_requests.item_price as item_price FROM expense_punch_history LEFT JOIN complaints ON complaints.id = expense_punch_history.complaint_id LEFT JOIN item_masters ON item_masters.id = expense_punch_history.item_id LEFT JOIN fund_requests  ON fund_requests .id = expense_punch_history.fund_id WHERE expense_punch_history.status IN ('0', '1') AND expense_punch_history.approved_qty <> 0 AND expense_punch_history.user_id= '${user_id}' AND expense_punch_history.complaint_id = '${complaint_id}' ORDER BY expense_punch_history.id DESC`;
        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
           const approveImageDetails = await getApproveExpensePunch(complaint_id, user_id)

           for (row of queryResult) {
                const userDetails = await getAdminAndUserDetails(row.user_id);
                const complainsDetails = await getComplaintDetails(row.complaint_id, row.complaint_unique_id)

                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: userDetails[0].name ? userDetails[0].name : "",
                    employee_id: userDetails[0].employee_id ? userDetails[0].employee_id : "",
                    user_image: userDetails[0].image,
                    complaint_id: row.complaint_id,
                    complaint_unique_id: row.complaint_unique_id,
                    item_name: row.item_name,
                    item_id: row.item_id,
                    item_punch_qty: row.item_qty,
                    item_price: row.item_price,
                    item_images: row.item_images,
                    total_Amount: Number(row.item_price) * Number(row.item_qty),
                    transaction_id: row.transaction_id ? row.transaction_id : null,
                    punch_at: moment(row.punch_at).format('YYYY-MM-DD HH:mm:ss A'),
                    item_approved_qty: row.approved_qty,
                    approved_at: row.approve_at,
                    complainsDetails: complainsDetails,
                    approve_images: approveImageDetails,
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Request fetched successfully",
                    data: finalData,
                    pageDetails: pageDetails
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


async function getApproveExpensePunch(complaint_id, user_id){
    const selectQuery =  await db.query(`SELECT images FROM expense_transaction_images WHERE complaint_id = '${complaint_id}' AND user_id = '${user_id}'`);
    return selectQuery
}

const fundItemLists = async (req, res) => {

    try {
        const { id } = req.params;

        const query = `SELECT fund_requests.*, item_masters.name AS item_name, item_masters.image AS item_image, COALESCE(users.name, admins.name) AS user_name, COALESCE(users.employee_id, admins.employee_id) AS employee_id, COALESCE(users.image, admins.image) AS user_image FROM fund_requests LEFT JOIN item_masters ON item_masters.id = fund_requests.item_id LEFT JOIN users ON users.id = fund_requests.request_by LEFT JOIN admins ON admins.id = fund_requests.request_by WHERE fund_requests.request_by = '${id}' AND fund_requests.request_qty != 0  AND fund_requests.request_qty - fund_requests.expense_transfer_quantity != 0 GROUP BY fund_requests.item_id`;

        const queryResult = await db.query(query);

        return res.status(StatusCodes.OK)
            .json({
                status: true,
                message: "Request fetched successfully",
                data: queryResult,
            });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

async function giveCurrentPunch(userId, complaintId) {

    const selectQuery = `SELECT * FROM expense_punch_history WHERE user_id = '${userId}' AND complaint_id = '${complaintId}' ORDER BY id DESC`;
    const queryResult = await db.query(selectQuery);

    return queryResult[0].punch_at;

}

async function giveApprovePunch(userId, complaintId) {

    const selectQuery = `SELECT * FROM expense_punch_history WHERE user_id = '${userId}' AND complaint_id = '${complaintId}' AND approved_at IS NOT NULL ORDER BY id DESC`;
    const queryResult = await db.query(selectQuery);

    return queryResult[0].approved_at;

}



module.exports = { addExpensePunch, getAllExpensePunchList, getExpensePunchById, getAllCheckAndApprove, changeStatusOfCheckAndApprove, updateExpensePunch, getListExpensePunchApprove, getListExpensePunchApproveAccordingToItems, fundItemLists };
