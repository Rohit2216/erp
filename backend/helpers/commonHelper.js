const { con, makeDb } = require('../db');
const db = makeDb();
const { checkPositiveInteger } = require('./validation');
const { StatusCodes } = require('http-status-codes');
const moment = require('moment');
const sharp = require('sharp');
const fs = require('fs');
const { getUsedQty } = require('../controllers/purchaseOrderController');
const { getCompanyName, getDbLastComplaintUniqueId, getDbLastComplaintUniqueIdInPi } = require('./general');
const { states } = require('../controllers/states')
async function getCompanyDetailsById(companyId) {
    try {
        const { error } = checkPositiveInteger.validate({ id: companyId });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });
        }

        const selectQuery = 'SELECT * FROM companies WHERE company_id = ?';

        const queryResult = await db.query(selectQuery, [companyId]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return { company_name: '', company_id: '', company_address: '', gst_number: '' };
        }
    } catch (error) {
        throw new Error();
    }
}

async function getStateById(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return error.message;
        }

        const selectQuery = 'SELECT * FROM states WHERE id = ?';

        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return { name: '' };
        }
    } catch (error) {
        return error.message;
    }
}

async function getRegionalOfficeById(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return error.message;
        }

        const selectQuery = 'SELECT * FROM regional_offices WHERE id = ?';

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function manageUserWallet(user_id, amount, type) {
    try {
        const { error } = checkPositiveInteger.validate({ id: user_id });

        if (error) {
            return error.message;
        }

        // get user wallet balance and details
        const selectQuery = 'SELECT * FROM user_wallets WHERE user_id = ?';
        const queryResult = await db.query(selectQuery, [user_id]);
        const walletDbData = queryResult[0];
        const dbWalletBalance = walletDbData.balance;
        var finalAmount = 0;

        if (type === 'deduct') {
            finalAmount = dbWalletBalance - amount;
        } else {
            finalAmount = dbWalletBalance + amount;
        }

        // update user wallet balance

        const walletBalance = await db.query(
            'UPDATE user_wallets SET balance = ? WHERE user_id = ?',
            [finalAmount, user_id]
        );

        if (walletBalance.affectedRows > process.env.VALUE_ZERO) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return error.message;
    }
}

async function generateRandomNumber(length) {
    const min = 10 ** (length - 1); // Minimum value of the random number (e.g., for length 4, min = 1000)
    const max = 10 ** length - 1; // Maximum value of the random number (e.g., for length 4, max = 9999)

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getUserExpenseDetailById(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return error.message;
        }

        // get user wallet balance and details
        const selectQuery = 'SELECT * FROM expenses WHERE id = ?';
        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return {};
        }
    } catch (error) {
        return error.message;
    }
}

async function saveTransactionDetails(transactionData) {
    try {
        if (Object.keys(transactionData).length !== process.env.VALUE_ZERO) {
            const data = {
                user_id: transactionData.user_id,
                transaction_type: transactionData.transaction_type,
                transaction_date: transactionData.transaction_date,
                amount: transactionData.amount,
                balance: transactionData.balance,
                description: transactionData.description,
                created_by: transactionData.created_by,
                complaints_id: transactionData.complaints_id,
            };

            const result = await db.query('INSERT INTO transactions SET ?', [data]);

            if (result.affectedRows > process.env.VALUE_ZERO) {
                return true;
            } else {
                return false;
            }

        } else {
            return 'Transactions not save due to empty data';
        }
    } catch (error) {
        return error.message;
    }
}


async function getUserCashRequestDetailById(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return error.message;
        }

        // get user wallet balance and details
        const selectQuery = 'SELECT * FROM cash_requests WHERE id = ?';
        const queryResult = await db.query(selectQuery, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return {};
        }
    } catch (error) {
        return error.message;
    }
}

async function getUserWalletBalance(user_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: user_id });

        if (error) {
            return error.message;
        }
        // get user wallet balance and details
        const selectQuery = 'SELECT balance FROM user_wallets WHERE user_id = ?';
        const queryResult = await db.query(selectQuery, [user_id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult[0];
        } else {
            return 0;
        }
    } catch (error) {
        return error.message;
    }
}

async function getSupplierAddresses(supplier_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: supplier_id });

        if (error) {
            return error.message;
        }

        // get user wallet balance and details
        const selectQuery = 'SELECT id, supplier_id, shop_office_number, street_name, city, state, pin_code, landmark, gst_number, is_default FROM supplier_addresses WHERE supplier_id = ? ORDER BY id DESC';
        const queryResult = await db.query(selectQuery, [supplier_id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}


async function getItemUsedDetailsInComplaint(itemId) {
    try {
        const query = `SELECT items_used.item_id, items_used.complaint_id, items_used.quantity, items_used.item_price, items_used.created_at, complaints.complaint_unique_id, complaint_types.complaint_type_name FROM items_used LEFT JOIN complaints ON complaints.complaint_unique_id = items_used.complaint_id LEFT JOIN complaint_types ON complaint_types.id = complaints.complaint_type WHERE items_used.used_item = ?`

        return await db.query(query, [itemId]);
    }
    catch (error) {
        return error.message;
    }

}

async function getSubModuleForReports(module_id) {
    const sql = `SELECT id as sub_module_id, title as sub_module_name FROM sub_modules WHERE module_id='${module_id}' AND status= '1'`;
    return await db.query(sql);
}

async function getModuleOfSubModuleForReports(sub_module_id) {
    const sql = `SELECT id as module_of_sub_module_id, title as module_of_sub_module_name, path as module_of_sub_module_path, status as module_of_sub_module_status, app_icon  FROM module_of_sub_modules WHERE sub_module_id='${sub_module_id}' AND status= '1'`;
    return await db.query(sql);
}

async function isPlural(str) {
    // Remove leading and trailing spaces and convert to lowercase
    str = str.trim().toLowerCase();

    // Check if the string ends with 's'
    return str.endsWith('s');
}

async function makePlural(str) {
    // Remove leading and trailing spaces and convert to lowercase
    str = str.trim().toLowerCase();

    // Check if the string ends with 's', 'x', 'z', 'sh', or 'ch'
    if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z') || str.endsWith('sh') || str.endsWith('ch')) {
        return str + 'es'; // Add 'es' to make it plural
    } else if (str.endsWith('y') && str.length > 1) {
        // If the word ends with 'y' preceded by a consonant, replace 'y' with 'ies'
        return str.slice(0, -1) + 'ies';
    } else {
        return str + 's'; // Add 's' in other cases
    }
}

async function getUserSalaryDisburseHistory(user_id, monthYear) {
    try {

        if (user_id != null && monthYear != null) {

            const dateObj = moment(monthYear, "YYYY-MM");
            const year = dateObj.format("YYYY");
            const month = dateObj.format("MM");
            var values = [];

            const sqlQuery = await db.query(`SELECT date, amount, transaction_number, transaction_mode, opening_balance, due_amount FROM salary_disburse_histories WHERE user_id = '${user_id}' AND YEAR(date) = '${year}' AND MONTH(date) = '${month}' ORDER BY ID ASC`);

            if (sqlQuery.length > process.env.VALUE_ZERO) {
                for (row of sqlQuery) {
                    values.push({
                        date: moment(row.date).format('DD-MM-YYYY'),
                        amount: row.amount,
                        transaction_number: row.transaction_number,
                        transaction_mode: row.transaction_mode,
                        opening_balance: row.opening_balance,
                        due_amount: row.due_amount

                    })
                }

                return values;
            }
            else {
                return [];
            }
        }
        else {
            return [];
        }
    }
    catch (error) {
        return error.message;
    }

}

async function getUserSalaryDueAmount(userId, monthYear) {
    try {

        if (userId != null && monthYear != null) {

            const dateObj = moment(monthYear, "YYYY-MM");
            const year = dateObj.format("YYYY");
            const month = dateObj.format("MM");
            var values = [];

            // get user due for all previous month
            const sqlQuery = await db.query(`SELECT due_amount, date FROM salary_disburse_histories WHERE user_id = '${userId}' ORDER BY ID DESC LIMIT 1`);
            if (sqlQuery.length > process.env.VALUE_ZERO) {
                return sqlQuery[0];
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    }
    catch (error) {
        return error.message;
    }
}

async function getUserSalaryDisbursedAmount(userId, monthYear) {
    try {

        if (userId != null && monthYear != null) {

            const dateObj = moment(monthYear, "YYYY-MM");
            const year = dateObj.format("YYYY");
            const month = dateObj.format("MM");
            var values = [];

            const sqlQuery = await db.query(`SELECT gross_salary FROM salary_disburses WHERE user_id = '${userId}' AND YEAR(month) = '${year}' AND MONTH(month) = '${month}' ORDER BY ID DESC LIMIT 1`);

            if (sqlQuery.length > process.env.VALUE_ZERO) {
                return sqlQuery[0].gross_salary;
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    }
    catch (error) {
        return error.message;
    }
}

async function getItemDetailsById(id) {
    try {

        const sqlQuery = await db.query(`SELECT * FROM item_masters WHERE id = '${id}'`);

        if (sqlQuery.length > process.env.VALUE_ZERO) {
            return sqlQuery[0];
        }
        else {
            return [];
        }

    } catch (error) {
        return error.message;
    }
}


async function measurementDetailsWithPoAndComplaint(po_id) {

    try {
        const selectQuery = "SELECT measurements.*, purchase_orders.po_number, purchase_orders.po_work, purchase_orders.po_limit, purchase_orders.po_amount, complaints.complaint_unique_id, complaints.id as complaint_id FROM measurements LEFT JOIN purchase_orders ON purchase_orders.id = measurements.po_id LEFT JOIN complaints ON complaints.id = measurements.complaint_id WHERE measurements.po_id = ?";

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
                //const orderByDetails = await getCreatedByDetails(row.created_by);

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
                    //order_by: orderByDetails.name,
                    financial_year: row.financial_year
                });
            }
            // all items list
            const itemLists = await getFullItemList();
            return ({ data: finalData[0], items: itemLists });
        }
        else {
            return [];
        }

    }
    catch (error) {
        return error.message;
    }
}


async function measurementDetailsWithPoAndComplaints(po_id) {
    try {

        const selectQuery = `
            SELECT measurements.*, purchase_orders.po_number, purchase_orders.po_work, purchase_orders.po_limit, purchase_orders.po_amount, complaints.complaint_unique_id, complaints.id as complaint_id 
            FROM measurements 
            LEFT JOIN purchase_orders ON purchase_orders.id = measurements.po_id 
            LEFT JOIN complaints ON complaints.id = measurements.complaint_id 
            WHERE measurements.po_id = ? AND measurements.status = '5'`;

        const queryResult = await db.query(selectQuery, [po_id]);

        if (queryResult.length > 0) {
            var finalData = [];
            var allComplaints = [];

            for (row of queryResult) {
                // get sale area details
                const saleArea = await db.query("SELECT id, sales_area_name FROM sales_area WHERE id = ?", [row.sale_area_id]);
                //get outlet details
                const outletDetails = await db.query("SELECT id, outlet_name FROM outlets WHERE regional_office_id = ? AND sales_area_id = ?", [row.ro_office_id, row.sale_area_id]);
                //get regional office details
                const regionalOfficeDetails = await db.query("SELECT id, regional_office_name FROM regional_offices WHERE id = ?", [row.ro_office_id]);
                // get location details
                const locationDetails = await db.query("SELECT id, district_name FROM districts WHERE regional_office_id = ? AND sales_area_id = ?", [row.ro_office_id, row.sale_area_id]);

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
                    financial_year: row.financial_year
                });

                if (row.complaint_id) { // If a complaint is linked
                    allComplaints.push({
                        complaint_id: row.complaint_id,
                        complaint_unique_id: row.complaint_unique_id
                        // Add other complaint details if needed
                    });
                }
            }
            // all items list
            const itemLists = await getFullItemList();
            return { data: finalData, items: itemLists, complaints: allComplaints };
        } else {
            return { data: [], items: [], complaints: [] }; // No data found
        }

    } catch (error) {
        return { error: error.message, complaints: [] }; // Return error message
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
        return error.message;
    }
}


async function getMeasurementsItemsById(measurementId) {
    try {
        const selectQuery = `
            SELECT DISTINCT measurement_items.id AS measurement_id_item_id, measurement_items.measurement_id, measurement_items.unit_id AS unit_name, measurement_items.length, measurement_items.number, measurement_items.breadth, measurement_items.depth, measurement_items.quantity, measurement_items.total_quantity, measurement_items.rate As measurement_item_rate, measurement_items.amount, measurement_items.created_by, measurements.id AS measurement_id, measurements.po_for, measurements.po_id, purchase_orders.po_number, complaints.complaint_unique_id AS complaint_id, measurement_items.order_line_number AS order_line_number, purchase_order_item.name AS item_name, purchase_order_item.rate, purchase_order_item.hsn_code, purchase_order_item.unit FROM measurement_items LEFT JOIN measurements ON measurements.id = measurement_items.measurement_id LEFT JOIN purchase_orders ON purchase_orders.id = measurement_items.po_id LEFT JOIN complaints ON complaints.id = measurement_items.complaint_id LEFT JOIN purchase_order_item ON purchase_order_item.order_line_number = measurement_items.order_line_number WHERE measurement_items.measurement_id = ?`;

        const queryResult = await db.query(selectQuery, [measurementId]);

        if (queryResult.length > 0) {
            // Fetch remaining quantity for each order line number
            for (const row of queryResult) {
                const remainigQuantity = await getUsedQty(row.po_for, row.po_id);
                const remainingQtyForOrderLine = remainigQuantity.data.find(entry => entry.order_line_number === row.order_line_number);
                if (remainingQtyForOrderLine) {
                    row.remaining_quantity = remainingQtyForOrderLine.remaining_quantity;
                } else {
                    row.remaining_quantity = null; // Set null if remaining quantity not found
                }
            }
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}


async function getMeasurementsItemsSubChildById(measurement_id, item_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: item_id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT  description, number as no, length, breadth, depth, quantity as qty, order_line_number FROM measurement_items WHERE measurement_id = ${measurement_id} AND order_line_number = ${item_id}`);

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

async function getManagerFreeTeamMember(manager_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: manager_id });

        if (error) {
            return error.message;
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

                return { finalData };
            }
            else {
                return { message: 'members not found' };
            }

        }
        else {
            return { message: 'Manager has no teams available' };
        }

    } catch (error) {
        return error.message;
    }
}

async function getSuperVisorUsers(supervisor_id) {

    try {

        const { error } = checkPositiveInteger.validate({ id: supervisor_id });
        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE supervisor_id = ?`, [supervisor_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult
        }
        else {
            return "end users not found";
        }
    } catch (error) {

        return error.message;
    }
}

async function checkUserHasNoActiveComplaints(assign_to) {

    try {
        const { error } = checkPositiveInteger.validate({ id: assign_to });
        if (error) {
            return error.message;
        }

        const complaintQuery = `SELECT complaints.id, complaints.description, complaints_timeline.complaints_id, complaints_timeline.title, complaints_timeline.assign_to FROM complaints INNER JOIN complaints_timeline ON complaints_timeline.complaints_id = complaints.id WHERE complaints_timeline.status != 'resolved' AND complaints_timeline.assign_to = ? AND free_end_users = 1 GROUP BY complaints_timeline.complaints_id`;

        const queryResult = await db.query(complaintQuery, [assign_to]);
        if (queryResult.length > 0) {
            return queryResult;
        }
        else {
            return []
        }

    } catch (error) {
        console.log(error);
        return [];
    }
}

async function todayFoodExpensePunch(date, user_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: user_id });
        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT * FROM expenses WHERE user_id =? AND expense_date =?`, [user_id, date]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        return error.message;
    }
}

async function convertBase64Image(base64File, imageFullDirectory, path) {
    try {
        // Convert the Base64 string to a buffer
        const imageBuffer = Buffer.from(base64File, 'base64');
        // Specify the output directory path
        const outputDir = imageFullDirectory;

        // Create the output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const imageName = Date.now() + '_output_resized.jpg'; // Include a file name here
        const imagePath = outputDir + imageName;
        const dbImagePath = path + imageName;
        // Use sharp to process the image
        sharp(imageBuffer)
            .toFile(outputDir + imageName, (err, info) => {
                if (err) {
                    return err;
                } else {
                    return imageName;
                }
            });

        return dbImagePath;

    } catch (error) {
        return error.message;
    }
}

// async function purchaseOrderItemsOnPoId(po_id) {
//     try {

//         const id = po_id;

//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) {
//             return error.message;
//         }

//         const queryResult = await db.query(`SELECT purchase_order_item.id as po_item_id,  purchase_order_item.po_for,  purchase_order_item.order_line_number, purchase_order_item.hsn_code,  purchase_order_item.name,  purchase_order_item.rate,  purchase_order_item.qty, purchase_order_item.unit as unit FROM  purchase_order_item WHERE  purchase_order_item.purchase_order_id = ?
//         `, [id])
//         if (queryResult.length > process.env.VALUE_ZERO) {
//             return queryResult;
//         }
//         else {
//             return [];
//         }
//     } catch (error) {

//         return error.message;
//     }
// }



async function purchaseOrderItemsOnPoId(po_id) {
    try {
        const id = po_id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            throw new Error(error.message);
        }


        const queryResult = await db.query(`SELECT purchase_order_item.id as po_item_id, purchase_order_item.po_for, purchase_order_item.order_line_number, purchase_order_item.hsn_code, purchase_order_item.name, purchase_order_item.rate, purchase_order_item.qty, purchase_order_item.unit as unit FROM purchase_order_item WHERE purchase_order_item.purchase_order_id = ?`, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getPoUsedAmount(po_id, amount) {

    try {
        const id = po_id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT * FROM purchase_orders WHERE id =?`, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const poData = queryResult[0];

            const po_remaining_amount = (poData.po_limit - poData.po_amount);
            if (poData.po_limit < amount) {
                return true;
            }
            else if (po_remaining_amount < amount) {
                return true;
            }
            else {
                return false;
            }

        }
        else {
            return false;
        }
    } catch (error) {

        return error.message;
    }
}

async function getAllGeneratedInvoiceNumberFormat() {
    try {

        const queryResult = await db.query(`SELECT * FROM invoice_no_format`);

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


function convertFinancialYear(financialYear) {
    const parts = financialYear.split('-');
    const startYear = parts[0].slice(-2);
    const endYear = parts[1].slice(-2);
    return startYear + endYear;
}

async function getLastFinancialYearBillNoForPI(financial_year) {
    try {

        if (financial_year != null && financial_year != '') {
            const queryResult = await db.query(`SELECT bill_no FROM proforma_invoices WHERE financial_year = ? ORDER BY id DESC LIMIT 1`, [financial_year]);
            if (queryResult.length > process.env.VALUE_ZERO) {
                const lastBillNumber = queryResult[0].bill_no;

                if (lastBillNumber) {

                    // Extract the last character
                    const lastDigit = lastBillNumber.slice(-1);
                    // Increment the last digit
                    const incrementedDigit = (parseInt(lastDigit, 10) + 1).toString();
                    // Replace the last digit in the string
                    const resultString = lastBillNumber.slice(0, -1) + incrementedDigit;
                    return resultString;
                } else {
                    return "No numeric part found in the input string";
                }

            }
            else {
                const prefix = "CMS";
                const financial_year_format = financial_year;
                const start_bill_number = "0001";
                const finalFormat = prefix + financial_year_format + start_bill_number;
                return finalFormat

            }
        }
        else {
            return "Financial year not in correct format"
        }
    } catch (error) {
        return error.message;
    }
}


async function generatePINumber(energy_company_id, complaint_for) {
    const companyId = energy_company_id.toString().padStart(2, '0');

    const dbCompanyName = await getCompanyName(energy_company_id, complaint_for);

    const trimmedDbCompanyName = dbCompanyName.trim();
    const charactersOfCompanyName = (trimmedDbCompanyName.substring(0, 3)).toUpperCase();

    const complaintPrefix = charactersOfCompanyName + companyId + "PI" + "00";

    const selectQuery = await db.query(`SELECT bill_no FROM proforma_invoices WHERE bill_no LIKE "${complaintPrefix}%" ORDER BY bill_no DESC LIMIT 1`);

    let nextPiId;
    if (selectQuery.length > 0) {
        const lastBillNo = selectQuery[0].bill_no;
        const lastNumber = parseInt(lastBillNo.slice(-2), 10);
        nextPiId = lastNumber + 1;
    } else {
        nextPiId = 1;
    }

    const padLength = 2;
    const paddedNumber = nextPiId.toString().padStart(padLength, '0');
    const newBillNo = complaintPrefix + paddedNumber;

    return newBillNo;
}


async function generateInvoiceNumber(financial_year, billing_to, companies_for) {
    const formattedFinancialYear = convertFinancialYear(financial_year);
    const companyId = billing_to.toString().padStart(2, '0');
    const dbCompanyName = await getCompanyName(billing_to, companies_for);

    // Trim and extract the first three characters of the company name
    const trimmedDbCompanyName = dbCompanyName.trim();
    const charactersOfCompanyName = trimmedDbCompanyName.substring(0, 3).toUpperCase();

    // Construct the prefix for the complaint number
    const complaintPrefix = `${formattedFinancialYear}-${companyId}`;
    // Check for the latest bill number with the prefix
    const selectQuery = await db.query(`SELECT invoice_no FROM invoices WHERE invoice_no LIKE "${complaintPrefix}%" ORDER BY invoice_no DESC LIMIT 1`);

    let nextPiId;
    if (selectQuery.length > 0) {
        const lastBillNo = selectQuery[0].invoice_no;
        const lastNumber = parseInt(lastBillNo.split('-').pop(), 10);
        nextPiId = lastNumber + 1;
    } else {
        nextPiId = 1;
    }
    // Pad the incremented number with leading zeros to a length of 4
    const padLength = 4;
    const paddedNumber = nextPiId.toString().padStart(padLength, '0');
    // Construct the new bill number
    const newBillNo = `${formattedFinancialYear}-${companyId}-${paddedNumber}`;

    return newBillNo;
}

async function generateMPINumber(energy_company_id, complaint_for) {

    const companyId = energy_company_id.toString().padStart(2, '0');
    // const complaintExist = await db.query(`SELECT energy_company_id FROM complaints WHERE id = '${energy_company_id}'  `)
    const dbCompanyName = await getCompanyName(energy_company_id, complaint_for);

    const trimmedDbCompanyName = dbCompanyName.trim();
    const charactersOfCompanyName = (trimmedDbCompanyName.substring(0, 3)).toUpperCase();

    const complaintPrefix = charactersOfCompanyName + companyId + "MPI" + "00";

    const selectQuery = await db.query(`SELECT bill_no FROM proforma_invoices WHERE bill_no LIKE "${complaintPrefix}%" ORDER BY bill_no DESC LIMIT 1`);

    let nextPiId;
    if (selectQuery.length > 0) {
        const lastBillNo = selectQuery[0].bill_no;
        const lastNumber = parseInt(lastBillNo.slice(-2), 10);
        nextPiId = lastNumber + 1;
    } else {
        nextPiId = 1;
    }

    const padLength = 2;
    const paddedNumber = nextPiId.toString().padStart(padLength, '0');
    const newBillNo = complaintPrefix + paddedNumber;
    return newBillNo;
}


async function getLastBillNoForMergedPI(financial_year) {
    try {


        const queryResult = await db.query(`SELECT merged_bill_number FROM merged_pi ORDER BY id DESC LIMIT 1`);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const lastBillNumber = queryResult[0].merged_bill_number;

            if (lastBillNumber) {

                // Extract the last character
                const lastDigit = lastBillNumber.slice(-1);
                // Increment the last digit
                const incrementedDigit = (parseInt(lastDigit, 10) + 1).toString();
                // Replace the last digit in the string
                const resultString = lastBillNumber.slice(0, -1) + incrementedDigit;
                return resultString;
            } else {
                return "No numeric part found in the input string";
            }

        }
        else {
            const prefix = "CMS-MPI";
            // const financial_year_format = financial_year;
            const start_bill_number = "0001";
            const finalFormat = prefix + start_bill_number;
            return finalFormat

        }

    } catch (error) {
        return error.message;
    }
}

async function getLastFinancialYearBillNoForInvoice(financial_year, energy_company_id, complaint_for) {
    try {

        if (financial_year != null && financial_year != '') {
            const queryResult = await db.query(`SELECT invoice_no FROM invoices WHERE financial_year = ? AND billing_to = ? ORDER BY id DESC LIMIT 1`, [financial_year, energy_company_id]);

            if (queryResult.length > process.env.VALUE_ZERO) {
                const lastBillNumber = queryResult[0].invoice_no;

                if (lastBillNumber) {

                    // Extract the last character
                    const lastDigit = lastBillNumber.slice(-1);
                    // Increment the last digit
                    const incrementedDigit = (parseInt(lastDigit, 10) + 1).toString();
                    // Replace the last digit in the string
                    const resultString = lastBillNumber.slice(0, -1) + incrementedDigit;
                    return resultString;
                } else {
                    return "No numeric part found in the input string";
                }

            }
            else {
                const allGeneratedInvoiceNumberFormat = await getAllGeneratedInvoiceNumberFormat();
                const matchedData = allGeneratedInvoiceNumberFormat.filter(item => item.financial_year == financial_year);

                if (matchedData != null && matchedData.length > process.env.VALUE_ZERO) {

                    const finalFormat = matchedData[0].sample_format;
                    return finalFormat
                }
                else {
                    const prefix = "CMS";
                    const financial_year_format = financial_year;
                    const start_bill_number = "0001";
                    const finalFormat = prefix + '-' + financial_year_format + '-' + start_bill_number;
                    return finalFormat
                }
            }
        }
        else {
            return "Financial year not in correct format"
        }
    } catch (error) {
        return error.message;
    }
}

async function getItemsDetailsByMeasurementId(measurement_id) {
    try {
        const queryResult = await db.query(`SELECT measurement_items.*, item_masters.image as item_image, item_masters.name as item_name, units.name as unit_name FROM measurement_items LEFT JOIN item_masters ON item_masters.id = measurement_items.item_id LEFT JOIN units ON units.id = measurement_items.unit_id WHERE measurement_items.measurement_id = ${measurement_id}`);
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

async function getProformaInvoiceItemsDetailsById(id) {
    try {
        const ids = JSON.parse(id);

        //var stringWithoutQuotes = ids.replace(/"/g, '');

        const queryResult = await db.query(`SELECT measurement_items.*, item_masters.image as item_image, item_masters.name as item_name, units.name as unit_name FROM measurement_items LEFT JOIN item_masters ON item_masters.id = measurement_items.item_id LEFT JOIN units ON units.id = measurement_items.unit_id WHERE measurement_items.id IN (${ids})`);

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

async function calculatedPercentage(percentage, totalValue) {

    try {
        const calculatedValue = (totalValue * percentage) / 100;
        return calculatedValue;
    } catch (error) {
        return error.message;
    }
}

async function getPlanDetailById(id) {

    try {
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const selectQuery = `SELECT * FROM plans WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > 0) {
            return queryResult;
        }
        else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}

async function AllSubModuleOfEnergyCompany(index) {

    try {
        const subModuleArray = ['', 'zone_id', 'regional_id', 'sale_area_id', 'district_id', 'outlet_id'];
        const { error } = checkPositiveInteger.validate({ id: index });

        if (error) {
            return error.message;
        }
        return subModuleArray[index];

    } catch (error) {
        return error.message;
    }
}

async function checkCompanyGstDefaultMarkOrNot(gst_details) {
    try {
        const hasDefault = gst_details.some(item => item.is_default === '1');
        return hasDefault;
    } catch (error) {
        return error.message;
    }
}

async function getOutLetUserDetailsByOutletId(id) {
    try {
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT id, email, password FROM users WHERE outlet_id = ?`, [id]);
        if (queryResult.length > 0) {
            return queryResult[0];
        }
        else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}


async function generateSupplierCode(supplier_id) {
    let selectQuery = `SELECT suppliers.id, suppliers.supplier_code, supplier_addresses.state FROM suppliers JOIN supplier_addresses ON supplier_addresses.supplier_id = suppliers.id WHERE suppliers.id = ${supplier_id}`;
    const results = await db.query(selectQuery);

    let counter;

    if (results.length > 0) {
        const result = results[0];

        const supplierCodeQuery = `SELECT supplier_code FROM suppliers WHERE supplier_code IS NOT NULL AND supplier_code != '' ORDER BY id DESC LIMIT 1`;
        const supplierCodeResult = await db.query(supplierCodeQuery);

        if (supplierCodeResult.length) {
            counter = parseInt(supplierCodeResult[0].supplier_code.slice(-2));
            if (isNaN(counter)) {
                counter = 1;
            } else {
                counter += 1;
            }
        } else {
            counter = 1;
        }

        let id = counter < 10 ? `0${counter}` : counter;
        let state = states[result.state];

        const currentFinancialYear = moment().format("YY") + moment().add(1, "year").format("YY");

        return `${currentFinancialYear}${state}0${id}`;
    }
}



const supplier_status = {
    1: "request",
    2: "approved",
    3: "rejected",
};


/** Helper function for get QuotationItems by id */
async function getQuotationItemsById(quotationId) {
    try {
        const selectQuery = `
            SELECT DISTINCT 
            quotation_items.order_line_number AS order_line_number, 
            purchase_order_item.name AS item_name, 
            purchase_order_item.hsn_code, 
            quotation_items.rate, 
            quotation_items.unit AS unit_name, 
            quotations.id AS quotation_id, 
            quotation_items.length, 
            quotation_items.number, 
            quotation_items.breadth, 
            quotation_items.depth, 
            quotation_items.quantity, 
            quotation_items.amount, 
            quotation_items.created_by, 
            quotations.po_number,
            quotation_items.quantity, 
            purchase_order_item.rate,
            sq.total_qty 
            FROM quotation_items 
            LEFT JOIN quotations ON quotations.id = quotation_items.quotation_id 
            LEFT JOIN purchase_orders p ON p.id = quotation_items.po_id 
            LEFT JOIN purchase_order_item ON purchase_order_item.order_line_number = quotation_items.order_line_number LEFT JOIN ( SELECT order_line_number, SUM(quantity) AS total_qty  FROM quotation_items Where quotation_id = ? GROUP BY order_line_number ) sq ON sq.order_line_number = quotation_items.order_line_number 
            WHERE quotation_items.quotation_id = ?`;

        
        const queryResult = await db.query(selectQuery, [quotationId, quotationId]);
        if (queryResult.length > 0) {            
            return queryResult;
        } else {
            return [];
        }
    } catch (error) {
        return error.message;
    }
}


/** get measurements items sub child by id for Quotation */
async function getQuotationItemsSubChildById(quotation_id, item_id) {
    try {
        const { error } = checkPositiveInteger.validate({ id: item_id });

        if (error) {
            return error.message;
        }

        const queryResult = await db.query(`SELECT  description, number as no, length, breadth, depth, quantity as qty, order_line_number FROM quotation_items WHERE quotation_id = ${quotation_id} AND order_line_number = ${item_id}`);
        
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

module.exports = {
    getCompanyDetailsById,
    getStateById,
    getRegionalOfficeById,
    manageUserWallet,
    generateRandomNumber,
    getUserExpenseDetailById,
    saveTransactionDetails,
    getUserCashRequestDetailById,
    getUserWalletBalance,
    getSupplierAddresses,
    getItemUsedDetailsInComplaint,
    getSubModuleForReports,
    getModuleOfSubModuleForReports,
    isPlural,
    makePlural,
    getUserSalaryDisburseHistory,
    getUserSalaryDueAmount,
    getUserSalaryDisbursedAmount,
    getItemDetailsById,
    measurementDetailsWithPoAndComplaint,
    getMeasurementsItemsById,
    getMeasurementsItemsSubChildById,
    getManagerFreeTeamMember,
    getSuperVisorUsers,
    checkUserHasNoActiveComplaints,
    todayFoodExpensePunch,
    convertBase64Image,
    getPoUsedAmount,
    getAllGeneratedInvoiceNumberFormat,
    getLastFinancialYearBillNoForPI,
    getLastFinancialYearBillNoForInvoice,
    getItemsDetailsByMeasurementId,
    getProformaInvoiceItemsDetailsById,
    calculatedPercentage,
    getPlanDetailById,
    AllSubModuleOfEnergyCompany,
    checkCompanyGstDefaultMarkOrNot,
    getOutLetUserDetailsByOutletId,
    measurementDetailsWithPoAndComplaints,
    getLastBillNoForMergedPI,
    purchaseOrderItemsOnPoId,
    generatePINumber,
    generateMPINumber,
    generateInvoiceNumber,
    convertFinancialYear,
    supplier_status,
    generateSupplierCode,
    getQuotationItemsById,
    getQuotationItemsSubChildById
};
