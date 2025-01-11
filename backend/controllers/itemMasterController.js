var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger } = require('../helpers/validation');
const { calculatePagination, generateRandomNumber } = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const { parseInt } = require('lodash');



// const createItemMaster = async (req, res) => {

//     try {
//         const { name, rate, hsncode, rucode, supplier_id, item_unique_id, description, unit_id, category } = req.body
//         const createdBy = req.user.user_id
//         var storePath = '';

//         if (req.files != null) {
//             const image = req.files.image
//             const imageName = Date.now() + image.name
//             const uploadPath = process.cwd() + '/public/item_masters/' + imageName;
//             storePath = '/item_masters/' + imageName;

//             image.mv(uploadPath, (err, response) => {
//                 if (err) return res.status(403).json({ status: false, message: err.message })
//             })
//         }

//         let unique_id;
//         if (item_unique_id == null || item_unique_id == '') {
//             const generateAutomatically = await generateRandomNumber(10);
//             unique_id = generateAutomatically;
//         }
//         else {
//             unique_id = item_unique_id;
//         }
//         const insertQuery = `INSERT INTO item_masters (name, rate, image, created_by, hsncode, rucode, supplier_id, unique_id, description, unit_id, category) VALUES('${name}', '${rate}', '${storePath}', '${createdBy}', ' ${hsncode}', '${rucode}', '${supplier_id}', '${unique_id}', '${description}', '${unit_id}', '${category}')`
//         db.query(insertQuery, async (err, result) => {
//             if (err) return res.status(500).json({ status: false, message: err.message })

//             if (result.affectedRows > process.env.VALUE_ZERO) {
//                 res.status(200).json({ status: true, message: "Item created successfully" })
//             }
//             else {
//                 return res.status(403).json({ status: false, message: "Something went wrong, please try again" })
//             }
//         })
//     }
//     catch (error) {
//         return res.status(500).json({ status: true, message: error.message })
//     }
// }


// const createItemMaster = async (req, res) => {
//     try {
//         const { name, rates, hsncode, rucode, supplier_id, item_unique_id, description, unit_id, category } = req.body;
//         const createdBy = req.user.user_id;
//         let storePath = '';

//         if (req.files && req.files.image) {
//             const image = req.files.image;
//             const imageName = Date.now() + image.name;
//             const uploadPath = process.cwd() + '/public/item_masters/' + imageName;
//             storePath = '/item_masters/' + imageName;

//             image.mv(uploadPath, (err) => {
//                 if (err) return res.status(403).json({ status: false, message: err.message });
//             });
//         }

//         let unique_id = item_unique_id || await generateRandomNumber(10);

//         const insertQuery = `INSERT INTO item_masters (name, image, created_by, hsncode, rucode, supplier_id, unique_id, description, unit_id, category) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//         db.query(insertQuery, [name, storePath, createdBy, hsncode, rucode, supplier_id, unique_id, description, unit_id, category], async (err, result) => {
//             if (err) return res.status(500).json({ status: false, message: err.message });

//             if (result.affectedRows > 0) {
//                 const itemId = result.insertId;

//                 // Insert rates associated with brands
//                 const rateInsertQuery = `INSERT INTO item_rates (item_id, brand, rate) VALUES ?`;
//                 const rateValues = rates.map(rate => [itemId, rate.brand, rate.rate]);
//                 db.query(rateInsertQuery, [rateValues], (rateErr, rateResult) => {
//                     if (rateErr) return res.status(500).json({ status: false, message: rateErr.message });

//                     res.status(200).json({ status: true, message: "Item and rates created successfully" });
//                 });
//             } else {
//                 res.status(200).json({ status: false, message: "Something went wrong, please try again" });
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ status: false, message: error.message });
//     }
// };


// const createItemMaster = async (req, res) => {
//     try {
//         console.log("Request body:", req.body);
//         const { name, rates, hsncode, rucode, supplier_id, item_unique_id, description, unit_id, category } = req.body;
//         const createdBy = req.user.user_id;
//         console.log("User ID:", createdBy);
//         let storePath = '';

//         if (req.files && req.files.image) {
//             const image = req.files.image;
//             const imageName = Date.now() + image.name;
//             const uploadPath = process.cwd() + '/public/item_masters/' + imageName;
//             storePath = '/item_masters/' + imageName;

//             console.log("Uploading image to:", uploadPath);
//             image.mv(uploadPath, (err) => {
//                 if (err) {
//                     console.error("Error uploading image:", err);
//                     return res.status(403).json({ status: false, message: err.message });
//                 }
//             });
//         }

//         let unique_id = item_unique_id || await generateRandomNumber(10);
//         console.log("Unique ID:", unique_id);

//         const insertQuery = `INSERT INTO item_masters (name, image, created_by, hsncode, rucode, supplier_id, unique_id, description, unit_id, category) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//         await db.query(insertQuery, [name, storePath, createdBy, hsncode, rucode, supplier_id, unique_id, description, unit_id, category], async (err, result) => {
//             if (err) {
//                 console.error("Error inserting into item_masters:", err);
//                 return res.status(500).json({ status: false, message: err.message });
//             }

//             console.log("Insert result:", result);
//             if (result.affectedRows > 0) {
//                 const itemId = result.insertId;
//                 console.log("Inserted item ID:", itemId);

//                 // Insert rates associated with brands
//                 const rateInsertQuery = `INSERT INTO item_rates (item_id, brand, rate) VALUES ?`;
//                 const rateValues = rates.map(rate => [itemId, rate.brand, rate.rate]);
//                 console.log("Rate values:", rateValues);
//                 await db.query(rateInsertQuery, [rateValues], (rateErr, rateResult) => {
//                     if (rateErr) {
//                         console.error("Error inserting rates:", rateErr);
//                         return res.status(500).json({ status: false, message: rateErr.message });
//                     }

//                     console.log("Rates insert result:", rateResult);
//                     res.status(200).json({ status: true, message: "Item and rates created successfully" });
//                 });
//             } else {
//                 console.warn("No rows affected.");
//                 res.status(200).json({ status: false, message: "Something went wrong, please try again" });
//             }
//         });
//     } catch (error) {
//         console.error("Catch error:", error);
//         return res.status(500).json({ status: false, message: error.message });
//     }
// };


const createItemMaster = async (req, res) => {
    try {

        const { name, rates, hsncode, rucode, supplier_id, item_unique_id, description, unit_id, category } = req.body;

        const createdBy = req.user.user_id;
        let storePath = '';

        if (req.files != null) {
            const image = req.files.image
            const imageName = Date.now() + image.name
            const uploadPath = process.cwd() + '/public/item_masters/' + imageName;
            storePath = '/item_masters/' + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(403).json({ status: false, message: err.message })
            })
        }

        let unique_id = item_unique_id || await generateRandomNumber(10);

        const insertItemMaster = `INSERT INTO item_masters (name, image, created_by, hsncode, rucode, supplier_id, unique_id, description, unit_id, category) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const insertResult = await db.query(insertItemMaster, [name, storePath, createdBy, hsncode, rucode, supplier_id, unique_id, description, unit_id, category]);

        if (insertResult.affectedRows > 0) {
            const itemId = insertResult.insertId;

            if (rates && rates.length > 0) {
                const parse = JSON.parse(rates)
                const rateInsertQuery = `INSERT INTO item_rates (item_id, brand_id, brand, rate) VALUES ?`;
                const rateValues = parse.map(rate => [itemId, rate.brand_id, rate.brand, rate.rate]);

                const rateInsertResult = await db.query(rateInsertQuery, [rateValues])

                if (rateInsertResult.affectedRows > 0) {

                    return res.status(200).json({ status: true, mesage: "Item and rates created successfully" });
                } else {
                    return res.status(500).json({ status: false, message: "Error inserting rates" });
                }
            } else {
                return res.status(200).json({ status: true, message: "Item created successfully, but no rates provided." });
            }
        } else {
            res.status(500).json({ status: false, message: "Something went wrong, please try again" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};


// const getAllItemMasters = async (req, res) => {

//     try {
//         //pagination data
//         const category = req.query.category;
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         // var search_value = "";

//         //check logged user id
//         const loggedUserType = req.user.user_type;
//         const loggedUserId = req.user.user_id;
//         // let searchCondition;
//         // let whereCondition = '';

//         // if(category){
//         //     whereCondition = `WHERE item_masters.category = '${category}'`;
//         // }

//         // if (loggedUserType == process.env.SUPER_ADMIN_ROLE_ID) {
//         //     if (searchData != null && searchData != '') {
//         //         search_value = `WHERE item_masters.name LIKE '%${searchData}%' OR suppliers.supplier_name LIKE '%${searchData}%'`;
//         //     }
//         //     searchCondition = '';
//         // }
//         // else {
//         //     if (searchData != null && searchData != '') {
//         //         search_value = `WHERE item_masters.name LIKE '%${searchData}%' OR suppliers.supplier_name LIKE '%${searchData}%'`;
//         //     }
//         //     searchCondition = `WHERE item_masters.created_by = '${loggedUserId}'`;
//         // }



//         // var selectQuery = `SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name FROM item_masters LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id LEFT JOIN units ON units.id = item_masters.unit_id ${whereCondition} ${search_value} ORDER BY item_masters.id DESC LIMIT ${pageFirstResult} , ${pageSize}`

//         let searchCondition = '';
//         let whereCondition = '';

//         if (category) {
//             whereCondition = `item_masters.category = '${category}'`;
//         }

//         let search_value = '';

//         if (searchData != null && searchData != '') {
//             search_value = `item_masters.name LIKE '%${searchData}%' OR suppliers.supplier_name LIKE '%${searchData}%'`;
//         }

//         if (loggedUserType == process.env.SUPER_ADMIN_ROLE_ID) {
//             if (search_value) {
//                 searchCondition = search_value;
//             }
//         } else {
//             if (search_value) {
//                 searchCondition = `${search_value} AND item_masters.created_by = '${loggedUserId}'`;
//             } else {
//                 searchCondition = `item_masters.created_by = '${loggedUserId}'`;
//             }
//         }

//         // Combine whereCondition and searchCondition
//         let finalCondition = '';
//         if (whereCondition && searchCondition) {
//             finalCondition = `WHERE ${whereCondition} AND ${searchCondition}`;
//         } else if (whereCondition) {
//             finalCondition = `WHERE ${whereCondition}`;
//         } else if (searchCondition) {
//             finalCondition = `WHERE ${searchCondition}`;
//         }

//         var selectQuery = `
//             SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name 
//             FROM item_masters 
//             LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id 
//             LEFT JOIN units ON units.id = item_masters.unit_id 
//             ${finalCondition} 
//             ORDER BY item_masters.id DESC 
//             LIMIT ${pageFirstResult}, ${pageSize}
//         `;

//         // remove after order by
//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);

//         db.query(selectQuery, async (err, result) => {
//             if (err) return res.status(500).json({ status: false, message: err.message })

//             if (result.length > process.env.VALUE_ZERO) {
//                 var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

//                 res.status(200).json({ status: true, message: "Fetched successfully", data: result, pageDetails: pageDetails })
//             }
//             else {
//                 return res.status(500).json({ status: false, message: "data not found" })
//             }
//         })
//     }
//     catch (error) {
//         return res.status(500).json({ status: true, message: error.message });
//     }
// }

const getAllItemMasters = async (req, res) => {

    try {
        //pagination data
        const category = req.query.category;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        // var search_value = "";

        //check logged user id
        const loggedUserType = req.user.user_type;
        const loggedUserId = req.user.user_id;

        let searchCondition = '';
        let whereCondition = '';

        if (category) {
            whereCondition = `item_masters.category = '${category}'`;
        }

        let search_value = '';

        if (searchData != null && searchData != '') {
            search_value = `item_masters.name LIKE '%${searchData}%' OR suppliers.supplier_name LIKE '%${searchData}%'`;
        }

        if (loggedUserType == process.env.SUPER_ADMIN_ROLE_ID) {
            if (search_value) {
                searchCondition = search_value;
            }
        } else {
            if (search_value) {
                searchCondition = `${search_value} AND item_masters.created_by = '${loggedUserId}' AND is_status = 1 `;
            } else {
                searchCondition = `item_masters.created_by = '${loggedUserId}' AND is_status = 1 `;
            }
        }

        // Combine whereCondition and searchCondition
        let finalCondition = '';
        if (whereCondition && searchCondition) {
            finalCondition = `WHERE ${whereCondition} AND ${searchCondition}`;
        } else if (whereCondition) {
            finalCondition = `WHERE ${whereCondition}`;
        } else if (searchCondition) {
            finalCondition = `WHERE ${searchCondition}`;
        }


        const selectQuery = `
        SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name FROM item_masters LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id LEFT JOIN units ON units.id = item_masters.unit_id
        ${finalCondition}  
        ORDER BY item_masters.id DESC   
        LIMIT ${pageFirstResult} , ${pageSize} `;


        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString); // This should ideally be a separate query to count total results

        const result = await db.query(selectQuery)

        if (result.length > 0) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            const items = result.reduce((acc, row) => {
                const { item_rates_id, brand, rate, ...itemData } = row;

                if (!acc[itemData.id]) {
                    acc[itemData.id] = { ...itemData, rates: [] };
                }

                if (item_rates_id) {
                    acc[itemData.id].rates.push({ item_rates_id, brand, rate });
                }

                return acc;
            }, {});

            res.status(200).json({ status: true, message: "Fetched successfully", data: Object.values(items), pageDetails: pageDetails });
        }

    }
    catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}


// const getSingleItemMaster = async (req, res) => {

//     try {
//         const id = req.params.id;
//         const { error } = checkPositiveInteger.validate({ id: id })
//         if (error) return res.status(400).json({ status: false, message: error.message })

//         const selectQuery = `SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name FROM item_masters LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id LEFT JOIN units ON units.id = item_masters.unit_id WHERE item_masters.id = ${id}`

//         db.query(selectQuery, async (err, result) => {
//             if (err) return res.status(500).json({ status: false, message: err.message })

//             if (result.length > process.env.VALUE_ZERO) {
//                 res.status(200).json({ status: true, message: "Fetched successfully", data: result[0] })
//             }
//             else {
//                 return res.status(403).json({ status: false, message: "Data not found" })
//             }
//         })
//     }
//     catch (error) {
//         return res.status(500).json({ status: true, message: error.message })
//     }
// }

const getSingleItemMaster = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id })
        if (error) return res.status(400).json({ status: false, message: error.message })

        const selectQuery = `
        SELECT item_masters.*, 
               suppliers.supplier_name, 
               units.name as unit_name, 
               item_rates.id as item_rates_id,
               item_rates.brand,
               item_rates.rate
        FROM item_masters
        LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id
        LEFT JOIN units ON units.id = item_masters.unit_id
        LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
        WHERE item_masters.id = ?
    `;

        // Execute the query
        const results = await db.query(selectQuery, [id]);

        // Process results to group rates by item
        const items = results.reduce((acc, row) => {
            const { item_rates_id, brand, rate, ...itemData } = row;

            if (!acc[itemData.id]) {
                acc[itemData.id] = { ...itemData, rates: [] };
            }

            if (item_rates_id) {
                acc[itemData.id].rates.push({ item_rates_id, brand, rate });
            }

            return acc;
        }, {});

        if (Object.keys(items).length > 0) {
            res.status(200).json({ status: true, message: "Fetched successfully", data: Object.values(items)[0] });
        } else {
            res.status(404).json({ status: false, message: "Item not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ status: true, message: error.message })
    }
}

// const updateItemMaster = async (req, res) => {

//     try {
//         const { name, rate, id, rucode, hsncode, supplier_id, description, unit_id, category } = req.body
//         const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
//         var storePath = '';
//         const { error } = checkPositiveInteger.validate({ id: id })
//         if (error) return res.status(403).json({ status: false, message: error.message })

//         const selectQuery = `SELECT * FROM item_masters WHERE id = '${id}'`
//         const getExistData = await db.query(selectQuery);

//         if (req.files != null) {
//             const image = req.files.image
//             const imageName = Date.now() + image.name
//             const uploadPath = process.cwd() + '/public/item_masters/' + imageName;
//             storePath = '/item_masters/' + imageName;
//             image.mv(uploadPath, (err, response) => {
//                 if (err) return res.status(403).json({ status: false, message: err.message })
//             })
//         }
//         else {
//             storePath = getExistData[0].image
//         }

//         const updateQuery = `UPDATE item_masters SET name = '${name}', rate = '${rate}', image = '${storePath}', updated_at = '${updatedAt}', rucode = '${rucode}', hsncode= '${hsncode}', supplier_id='${supplier_id}', description = '${description}', unit_id = '${unit_id}', category = '${category}' WHERE id = '${id}'`

//         db.query(updateQuery, async (err, result) => {
//             if (err) return res.status(500).json({ status: false, message: err.message })

//             if (result.affectedRows > process.env.VALUE_ZERO) {
//                 res.status(200).json({ status: true, message: "Item updated successfully" })
//             }
//             else {
//                 return res.status(403).json({ status: false, message: "Something went wrong, please try again" })
//             }
//         })
//     }
//     catch (error) {
//         return res.status(500).json({ status: true, message: error.message })
//     }
// }

// const updateItemMaster = async (req, res) => {
//     try {
//         const { name, image, rates, id, rucode, hsncode, supplier_id, description, unit_id, category } = req.body;
//         const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
//         // let storePath = '';

//         // Validate item ID
//         const { error } = checkPositiveInteger.validate({ id: id });
//         if (error) return res.status(403).json({ status: false, message: error.message });

//         // Check if item exists
//         const selectQuery = `SELECT * FROM item_masters WHERE id = ?`;
//         const [existingItem] = await db.query(selectQuery, [id]);

//         if (existingItem.length === 0) {
//             return res.status(404).json({ status: false, message: "Item not found" });
//         }


//         let storePath = existingItem.image || null;
//         // Handle image upload
//         if (req.files && req.files.image) {
//             const image = req.files.image;
//             const imageName = Date.now() + image.name;
//             const uploadPath = process.cwd() + '/public/item_masters/' + imageName;
//             storePath = '/item_masters/' + imageName;

//             // Upload the new image
//             await new Promise((resolve, reject) => {
//                 image.mv(uploadPath, (err) => {
//                     if (err) return reject(err);
//                     resolve();
//                 });
//             });
//         }

//         // Update item_masters
//         const updateQuery = `
//             UPDATE item_masters 
//             SET name = ?, 
//                 image = ?, 
//                 updated_at = ?, 
//                 rucode = ?, 
//                 hsncode = ?, 
//                 supplier_id = ?, 
//                 description = ?, 
//                 unit_id = ?, 
//                 category = ? 
//             WHERE id = ?
//         `;
//         await db.query(updateQuery, [name, storePath, updatedAt, rucode, hsncode, supplier_id, description, unit_id, category, id]);

//         // Update or insert item_rates
//         if (rates && Array.isArray(rates)) {
//             // Delete existing rates for this item
//             const deleteRatesQuery = `DELETE FROM item_rates WHERE item_id = ?`;
//             await db.query(deleteRatesQuery, [id]);

//             // Insert new rates
//             const parse = JSON.parse(rates)
//             const rateInsertQuery = `INSERT INTO item_rates (item_id, brand_id, brand, rate) VALUES ?`;
//             const rateValues = parse.map(rate => [id, rate.brand_id, rate.brand, rate.rate]);
//             console.log("rateValues", rateValues)
//             await db.query(rateInsertQuery, [rateValues]);
//         }

//         res.status(200).json({ status: true, message: "Item and rates updated successfully" });
//     } catch (error) {
//         console.error("Error updating item master:", error);
//         return res.status(500).json({ status: false, message: error.message });
//     }
// };


const updateItemMaster = async (req, res) => {
    try {
        const { name, image, rates, id, rucode, hsncode, supplier_id, description, unit_id, category } = req.body;
        const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

        // Validate item ID
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message });

        // Check if item exists
        const selectQuery = `SELECT * FROM item_masters WHERE id = ?`;
        const [existingItem] = await db.query(selectQuery, [id]);

        if (!existingItem || existingItem.length === 0) {
            return res.status(404).json({ status: false, message: "Item not found" });
        }

        let storePath = existingItem.image || null;

        // Handle image upload
        if (req.files && req.files.image) {
            const image = req.files.image;
            const imageName = Date.now() + '_' + image.name;
            const uploadPath = process.cwd() + '/public/item_masters/' + imageName;
            storePath = '/item_masters/' + imageName;

            // Upload the new image
            await new Promise((resolve, reject) => {
                image.mv(uploadPath, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }


        let parsedRates = rates;

        console.log("typeof rates === 'string'", typeof rates === 'string')
        if (typeof rates === 'string') {
            try {
                parsedRates = JSON.parse(rates);
            } catch (error) {
                return res.status(400).json({ status: false, message: "Invalid rates format" });
            }
        }

        // Update item_masters
        const updateQuery = `
            UPDATE item_masters 
            SET name = ?, 
                image = ?, 
                updated_at = ?, 
                rucode = ?, 
                hsncode = ?, 
                supplier_id = ?, 
                description = ?, 
                unit_id = ?, 
                category = ? 
            WHERE id = ?
        `;
        await db.query(updateQuery, [name, storePath, updatedAt, rucode, hsncode, supplier_id, description, unit_id, category, id]);

        if (parsedRates && Array.isArray(parsedRates)) {
            // Delete existing rates for this item
            const deleteRatesQuery = `DELETE FROM item_rates WHERE item_id = ?`;
            await db.query(deleteRatesQuery, [id]);

            // Insert new rates
            const rateInsertQuery = `INSERT INTO item_rates (item_id, brand_id, brand, rate) VALUES ?`;
            const rateValues = parsedRates.map(rate => [id, rate.brand_id, rate.brand, rate.rate]);
            await db.query(rateInsertQuery, [rateValues]);
        }
        res.status(200).json({ status: true, message: "Item and rates updated successfully" });
    } catch (error) {
        console.error("Error updating item master:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};


// const deleteItemMaster = async (req, res) => {

//     try {
//         const id = req.params.id
//         const { error } = checkPositiveInteger.validate({ id: id })
//         if (error) return res.status(400).json({ status: false, message: error.message })

//         const deleteQuery = `DELETE FROM item_masters WHERE id = '${id}'`

//         db.query(deleteQuery, async (err, result) => {
//             if (err) return res.status(500).json({ status: false, message: err.message })

//             if (result.affectedRows > process.env.VALUE_ZERO) {
//                 res.status(200).json({ status: true, message: "Item deleted successfully" })
//             }
//             else {
//                 return res.status(403).json({ status: false, message: "Something went wrong, please try again" })
//             }
//         })
//     }
//     catch (error) {
//         return res.status(500).json({ status: true, message: error.message })
//     }
// }

const deleteItemMaster = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id: id })
        if (error) return res.status(400).json({ status: false, message: error.message })

        const deleteQuery = `update item_masters set is_status = 1 WHERE id = '${id}'`

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message })

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Item deleted successfully" })
            }
            else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: true, message: error.message })
    }
}


// const getAllItemMastersForDropdown = async (req, res) => {

//     try {
//         const category = req.query.category;
//         let selectQuery;
//         if (category) {
//             selectQuery = `SELECT * FROM item_masters WHERE item_type = 1 AND status = '1' AND category = '${category}'  ORDER BY id DESC`;

//         } else {
//             selectQuery = `SELECT * FROM item_masters WHERE item_type = 1 AND status = '1'  ORDER BY id DESC`;

//         }

//         console.log("selectQuery", selectQuery)


//         db.query(selectQuery, async (err, result) => {
//             if (err) return res.status(500).json({ status: false, message: err.message })

//             if (result.length > process.env.VALUE_ZERO) {
//                 for (const row of result) {
//                     row.rate = parseInt(row.rate);
//                     row.qty = parseInt(row.qty);
//                 }
//                 res.status(200).json({ status: true, message: "Fetched successfully", data: result })
//             }
//             else {
//                 return res.status(500).json({ status: false, message: "data not found" })
//             }
//         })
//     }
//     catch (error) {
//         return res.status(500).json({ status: true, message: error.message });
//     }
// }


const getAllItemMastersForDropdown = async (req, res) => {

    try {
        //pagination data
        const category = req.query.category;

        let whereCondition = '';

        if (category) {
            whereCondition = `WHERE item_masters.category = '${category}' AND item_masters.is_status = 1`;
        }

        // Combine whereCondition and searchCondition


        const selectQuery = `SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name, item_rates.id as item_rates_id, item_rates.brand, item_rates.rate FROM item_masters LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id LEFT JOIN units ON units.id = item_masters.unit_id LEFT JOIN item_rates ON item_masters.id = item_rates.item_id ${whereCondition} ORDER BY item_masters.id DESC;
`;

        db.query(selectQuery, (err, results) => {
            if (err) {
                return res.status(500).json({ status: false, message: err.message });
            }

            const items = results.reduce((acc, row) => {
                const { item_rates_id, brand, rate, ...itemData } = row;

                if (!acc[itemData.id]) {
                    acc[itemData.id] = { ...itemData, rates: [] };
                }

                if (item_rates_id) {
                    acc[itemData.id].rates.push({ item_rates_id, brand, rate });
                }

                return acc;
            }, {});

            res.status(200).json({ status: true, message: "Fetched successfully", data: Object.values(items) });
        });

    }
    catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}


const addItemFromStockRequest = async (req, res) => {

    try {
        const { name, rate, qty, hsncode, rucode, supplier_id, item_unique_id, description } = req.body
        const createdBy = req.user.user_id
        var storePath = '';

        if (req.files != null) {
            const image = req.files.image
            const imageName = Date.now() + image.name
            const uploadPath = process.cwd() + '/public/item_masters/' + imageName;
            storePath = '/item_masters/' + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(403).json({ status: false, message: err.message })
            })
        }
        const insertQuery = `INSERT INTO item_masters (name, rate, qty, image, created_by, hsncode, rucode, supplier_id, unique_id, status, unique_id, description) VALUES('${name}', '${rate}', '${qty}', '${storePath}', '${createdBy}', '${hsncode}', '${rucode}', '${supplier_id}', '0', '${item_unique_id}', '${item_unique_id}', 'description')`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message })

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Item added successfully" })
            }
            else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again" })
            }
        });
    } catch (error) {

        return res
            .status(500)
            .json({
                status: false,
                message: error.message
            });
    }
}

const checkItemUniqueIdExist = async (req, res) => {

    try {
        const { item_unique_id } = req.body
        const queryResult = await db.query(`SELECT unique_id FROM item_masters WHERE unique_id = ?`, [item_unique_id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "item unique id already exists"
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "valid item unique id"
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

const addItemFromFundRequest = async (req, res) => {
    try {
        const { name, rate, hsncode, rucode, supplier_id, item_unique_id, description, unit_id } = req.body;
        const createdBy = req.user.user_id
        var storePath = '';

        // const checkHsncode = await getHsncode(name)
        // let hsncodeToInsert = checkHsncode.length > process.env.VALUE_ZERO ? checkHsncode : hsncode;

        if (req.files != null) {
            const image = req.files.image
            const imageName = Date.now() + image.name
            const uploadPath = process.cwd() + '/public/item_masters/' + imageName;
            storePath = '/item_masters/' + imageName;

            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message })
            })
        }
        // const unique_id = req.body.unique_id;
        let unique_ids;
        if (item_unique_id != null && item_unique_id !== '') { // Change || to &&
            unique_ids = item_unique_id;
        } else if (item_unique_id === '') { // Use strict equality here
            const generateAutomatically = await generateRandomNumber(10);
            unique_ids = generateAutomatically;
        }
        const insertQuery = `INSERT INTO item_masters (name, rate, image, created_by, hsncode, rucode, supplier_id, unique_id, status, description, unit_id) VALUES('${name}', '${qty}', '${storePath}', '${createdBy}', '${hsncode}', '${rucode}', '${supplier_id}', '${unique_ids}', '0', '${description}','${unit_id}' )`;

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message })

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(StatusCodes.OK).json({ status: true, message: "Item added successfully" })
            }
            else {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong, please try again" })
            }
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


const approvedAddItemFromFundRequest = async (req, res) => {
    try {
        const { id } = req.body;
        const { error } = checkPositiveInteger.validate({ id: id })
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: error.message })

        const updateQuery = await db.query(`UPDATE item_masters SET status = 1 WHERE id='${id}'`)

        if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Item has been approved." })
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Error, Item not approved." })
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}
//contractor panel Item masters

// const byNameToHsnCode = async (req, res) => {
//     try {
//         const name = req.body.name;
//         const searchData = req.body.name || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         const searchColumns = ['name'];
//         const searchConditions = [];

//         if (searchData != null && searchData != '') {
//             searchColumns.forEach((column) => {
//                 searchConditions.push(`${column} LIKE '%${searchData}%'`);
//             });
//         }
//         // Use parameterized queries to prevent SQL injection
//         const selectQuery = await db.query('SELECT * FROM item_masters WHERE name = ?', [name]);

//         if (selectQuery.length > 0) {
//             // Extracting data from the first row of the result
//             const item_id = selectQuery[0].id;
//             const item_name = selectQuery[0].name;
//             const hsncode = selectQuery[0].hsncode;

//             // Returning the fetched data
//             return res.status(StatusCodes.OK).json({ status: true, message: "Data fetched successfully.", data: { item_id, item_name, hsncode } });
//         } else {
//             // No data found
//             return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found." });
//         }
//     } catch (error) {
//         // Error handling
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

const byNameToHsnCode = async (req, res) => {
    try {
        let searchData = '';
        let searchConditions = [];
        let query;

        if (req.body.name || req.query.name) {
            searchData = req.body.name || req.query.name;
            searchConditions.push("name LIKE '%" + searchData + "%'");
            query = 'SELECT * FROM item_masters WHERE ' + searchConditions.join(' OR ');
        } else {
            query = 'SELECT * FROM item_masters';
        }

        const result = await db.query(query);

        if (result.length > 0) {
            if (query === 'SELECT * FROM item_masters') {
                // Return all item details
                return res.status(StatusCodes.OK).json({ status: true, message: "Data fetched successfully.", data: result });
            } else {
                // Return only details of the first item
                const item_id = result[0].id;
                const item_name = result[0].name;
                const hsncode = result[0].hsncode;
                return res.status(StatusCodes.OK).json({ status: true, message: "Data fetched successfully.", data: { item_id, item_name, hsncode } });
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Data not found." });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

async function getHsncode(name) {
    try {
        const selectQuery = await db.query(`select * from item_masters where name= '${name}'`)
        if (selectQuery.length > process.env.VALUE_ZERO) {
            return selectQuery[0].hsncode;
        } else {
            return [];
        }

    } catch (error) {

    }
}


const getAllItemsBySupplierId = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id })
        if (error) return res.status(400).json({ status: false, message: error.message })

        var selectQuery = `SELECT * FROM item_masters WHERE supplier_id = '${id}' AND item_type = 1 AND status = '1'  ORDER BY id DESC`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message })

            if (result.length > process.env.VALUE_ZERO) {
                for (const row of result) {
                    row.rate = parseInt(row.rate);
                    row.qty = parseInt(row.qty);
                }
                res.status(200).json({ status: true, message: "Fetched successfully", data: result })
            }
            else {
                return res.status(500).json({ status: false, message: "data not found" })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}


const approveOrRejectItems = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;

        // Check if status is either '2' or '3'
        if (status === '2' || status === '3') {
            const updateQuery = `UPDATE item_masters SET status = ? WHERE id = ?`;

            await db.query(updateQuery, [status, id]);

            const message = status === '2' ? 'Item approved successfully' : 'Item rejected successfully';
            return res.status(200).json({ status: true, message });
        } else {
            return res.status(400).json({ status: false, message: 'Invalid status' });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

//changes by nilanjan

/** get all item_master based on status */
const getAllItemMaster = async (req, res) => {

    try {
        //pagination data
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status || '';
        var search_value = "";

        //check logged user id
        const loggedUserType = req.user.user_type;
        const loggedUserId = req.user.user_id;
        let searchCondition;

        if (loggedUserType == process.env.SUPER_ADMIN_ROLE_ID) {
            if (searchData != null && searchData != '') {
                search_value = `WHERE item_masters.name LIKE '%${searchData}%' OR suppliers.supplier_name LIKE '%${searchData}%'`;
            }
            searchCondition = '';
        }
        else {
            if (searchData != null && searchData != '') {
                search_value = `WHERE item_masters.name LIKE '%${searchData}%' OR suppliers.supplier_name LIKE '%${searchData}%'`;
            }
            searchCondition = `WHERE item_masters.created_by = '${loggedUserId}'`;
        }
        var selectQuery = `SELECT item_masters.*, suppliers.supplier_name FROM item_masters LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id where item_masters.status = '${status}' ${search_value} ORDER BY item_masters.id DESC LIMIT ${pageFirstResult} , ${pageSize}`

        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message })

            if (result.length > process.env.VALUE_ZERO) {
                var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

                res.status(200).json({ status: true, message: "Fetched successfully", data: result, pageDetails: pageDetails })
            }
            else {
                return res.status(500).json({ status: false, message: "data not found" })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
}


// const getItemPriceByBrand = async (req, res) => {
//     try {
//         const { category, item } = req.query;

//         // Initialize the where condition
//         let whereCondition = '';
//         let filterCondition = '';

//         if (category) {
//             filterCondition += `item_masters.category = '${category}'`;
//         }

//         if (item) {
//             if (filterCondition) filterCondition += ' AND ';
//             filterCondition += `item_masters.name LIKE '%${item}%'`;
//         }

//         if (filterCondition) {
//             whereCondition = `WHERE ${filterCondition} AND item_masters.is_status = 1`;
//         } else {
//             whereCondition = `WHERE item_masters.is_status = 1`;
//         }

//         // Query to get the last three lowest prices for each item
//         const selectQuery = `
//             WITH RankedPrices AS (
//                 SELECT item_masters.id, item_masters.name, item_rates.brand, item_rates.rate,
//                        ROW_NUMBER() OVER (PARTITION BY item_masters.id ORDER BY item_rates.rate ASC) as rank
//                 FROM item_masters
//                 LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
//                 ${whereCondition}
//             )
//             SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name, 
//                    rp.brand, rp.rate
//             FROM RankedPrices rp
//             JOIN item_masters ON item_masters.id = rp.id
//             LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id
//             LEFT JOIN units ON units.id = item_masters.unit_id
//             WHERE rp.rank <= 3
//             ORDER BY item_masters.id DESC;
//         `;

//         console.log("selectQuery", selectQuery);

//         db.query(selectQuery, (err, results) => {
//             if (err) {
//                 return res.status(500).json({ status: false, message: err.message });
//             }

//             const items = results.reduce((acc, row) => {
//                 const { brand, rate, ...itemData } = row;

//                 if (!acc[itemData.id]) {
//                     acc[itemData.id] = { ...itemData, rates: [] };
//                 }

//                 if (brand) {
//                     acc[itemData.id].rates.push({ brand, rate });
//                 }

//                 return acc;
//             }, {});

//             res.status(200).json({ status: true, message: "Fetched successfully", data: Object.values(items) });
//         });

//     } catch (error) {
//         return res.status(500).json({ status: true, message: error.message });
//     }
// };

// const getItemPriceByBrand = async (req, res) => {
//     try {
//         const { category, itemName } = req.query;

//         // Initialize the where condition
//         let whereCondition = '';

//         if (category) {
//             whereCondition += `item_masters.category = '${category}' AND item_masters.is_status = 1`;
//         }

//         if (itemName) {
//             if (whereCondition) whereCondition += ' AND ';
//             whereCondition += `item_masters.name LIKE '%${itemName}%'`;
//         }

//         if (whereCondition) {
//             whereCondition = `WHERE ${whereCondition}`;
//         } else {
//             whereCondition = `WHERE item_masters.is_status = 1`;
//         }

//         // Query to get the last three lowest prices for each item
//         const selectQuery = `
//             WITH RankedPrices AS (
//                 SELECT item_masters.id, item_masters.name, item_rates.brand, item_rates.rate,
//                        ROW_NUMBER() OVER (PARTITION BY item_masters.id ORDER BY item_rates.rate ASC) as rank
//                 FROM item_masters
//                 LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
//                 ${whereCondition}
//             )
//             SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name, 
//                    rp.brand, rp.rate
//             FROM RankedPrices rp
//             JOIN item_masters ON item_masters.id = rp.id
//             LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id
//             LEFT JOIN units ON units.id = item_masters.unit_id
//             WHERE rp.rank <= 3
//             ORDER BY item_masters.id DESC;
//         `;

//         console.log("selectQuery", selectQuery);

//         db.query(selectQuery, (err, results) => {
//             if (err) {
//                 return res.status(500).json({ status: false, message: err.message });
//             }

//             const items = results.map(row => {
//                 const { id, name, qty, image, hsncode, rucode, unique_id, unit_id, item_type, supplier_id, status, category, description, created_by, created_at, updated_at, is_status, supplier_name, unit_name, brand, rate } = row;

//                 return {
//                     id,
//                     name,
//                     qty,
//                     image,
//                     hsncode,
//                     rucode,
//                     unique_id,
//                     unit_id,
//                     item_type,
//                     supplier_id,
//                     status,
//                     category,
//                     description,
//                     created_by,
//                     created_at,
//                     updated_at,
//                     is_status,
//                     supplier_name,
//                     unit_name,
//                     brand,
//                     rate
//                 };
//             });

//             res.status(200).json({ status: true, message: "Fetched successfully", data: items });
//         });

//     } catch (error) {
//         return res.status(500).json({ status: true, message: error.message });
//     }
// };




// item price depends upon category like fund or stocks 

const getItemPriceByBrand = async (req, res) => {
    try {
        const { category, itemName } = req.query;

        // Initialize the where condition
        let whereCondition = '';

        if (category) {
            whereCondition += `item_masters.category = '${category}' AND item_masters.is_status = 1`;
        }

        if (itemName) {
            if (whereCondition) whereCondition += ' AND ';
            whereCondition += `item_masters.name LIKE '%${itemName}%'`;
        }

        if (whereCondition) {
            whereCondition = `WHERE ${whereCondition}`;
        } else {
            whereCondition = `WHERE item_masters.is_status = 1`;
        }

        // Query to get the last three lowest prices for each item
        // const selectQuery = `
        //     WITH RankedPrices AS (
        //         SELECT item_masters.id, item_masters.name, item_rates.brand, item_rates.rate,
        //                ROW_NUMBER() OVER (PARTITION BY item_masters.id ORDER BY item_rates.rate ASC) as rank
        //         FROM item_masters
        //         LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
        //         ${whereCondition}
        //     )
        //     SELECT item_masters.*, suppliers.supplier_name, units.name as unit_name, 
        //            rp.brand, rp.rate
        //     FROM RankedPrices rp
        //     JOIN item_masters ON item_masters.id = rp.id
        //     LEFT JOIN suppliers ON suppliers.id = item_masters.supplier_id
        //     LEFT JOIN units ON units.id = item_masters.unit_id
        //     WHERE rp.rank <= 3
        //     ORDER BY rp.rate ASC
        //     LIMIT 3;
        // `;

        const selectQuery = `SELECT im.*, s.supplier_name, u.name AS unit_name, ir.brand, ir.rate
FROM (
    SELECT item_masters.id, item_masters.name, item_rates.brand, item_rates.rate,
           ROW_NUMBER() OVER (PARTITION BY item_masters.id ORDER BY item_rates.rate ASC) AS rank
    FROM item_masters
    LEFT JOIN item_rates ON item_masters.id = item_rates.item_id
    ${whereCondition}
) AS ir
JOIN item_masters im ON im.id = ir.id
LEFT JOIN suppliers s ON s.id = im.supplier_id
LEFT JOIN units u ON u.id = im.unit_id
WHERE ir.rank <= 3
ORDER BY ir.rate ASC
LIMIT 3;
`

        db.query(selectQuery, (err, results) => {
            if (err) {
                return res.status(500).json({ status: false, message: err.message });
            }

            const items = results.map(row => {
                const { id, name, qty, image, hsncode, rucode, unique_id, unit_id, item_type, supplier_id, status, category, description, created_by, created_at, updated_at, is_status, supplier_name, unit_name, brand, rate } = row;

                return {
                    id,
                    name,
                    qty,
                    image,
                    hsncode,
                    rucode,
                    unique_id,
                    unit_id,
                    item_type,
                    supplier_id,
                    status,
                    category,
                    description,
                    created_by,
                    created_at,
                    updated_at,
                    is_status,
                    supplier_name,
                    unit_name,
                    brand,
                    rate
                };
            });

            res.status(200).json({ status: true, message: "Fetched successfully", data: items });
        });

    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
};

module.exports = { createItemMaster, getAllItemMasters, getSingleItemMaster, updateItemMaster, deleteItemMaster, getAllItemMastersForDropdown, addItemFromStockRequest, checkItemUniqueIdExist, addItemFromFundRequest, approvedAddItemFromFundRequest, getHsncode, byNameToHsnCode, getAllItemsBySupplierId, approveOrRejectItems, getItemPriceByBrand }
