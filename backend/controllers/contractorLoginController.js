const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require("dotenv").config();
const { con, makeDb } = require("../db");
const { adminCreateValidation } = require("../helpers/validation");
const Joi = require("joi");
const { getRecord } = require('../helpers/general');
const db = makeDb();
const { v4: uuidv4 } = require('uuid'); // To generate UUID

const contractorLogin = async (req, res) => {
    try {
        const { emailOrMobile, password, location } = req.body;

        // Query to check both email and mobile for admins
        const adminQuery = await db.query(`
            SELECT admins.*, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price, admins.name, roles.name AS role 
            FROM admins 
            LEFT JOIN plans ON admins.plan_id = plans.id 
            INNER JOIN roles ON roles.id = admins.user_type 
            WHERE admins.email = '${emailOrMobile}' OR admins.contact_no = '${emailOrMobile}'
        `);

        if (adminQuery.length > 0) {
            if (adminQuery[0].status !== '1') {
                return res.status(400).json({ status: false, message: "Your account is not activated yet. Please contact our support team for assistance." });
            }

            const isCorrectPassword = await bcrypt.compare(password, adminQuery[0].password);

            if (isCorrectPassword) {
                delete adminQuery[0].password;

                const token = jwt.sign(
                    { user_id: adminQuery[0].id, user_type: adminQuery[0].user_type, employee_id: adminQuery[0].employee_id, user_data: adminQuery },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '10h' }
                );

                // Check if the user already has an entry for today
                const existingEntry = await db.query(`
                    SELECT * 
                    FROM user_login_details 
                    WHERE user_id = ? AND DATE(login_time) = CURDATE()
                `, [adminQuery[0].id]);

                if (existingEntry.length === 0) {
                    // Insert login details
                    await db.query(
                        `INSERT INTO user_login_details (user_id, longitude, latitude) VALUES (?, ?, ?)`,
                        [adminQuery[0].id, location.longitude, location.latitude]
                    );
                }

                return res.status(200).json({ status: true, message: "Login Successfully", data: adminQuery[0], token: token });
            } else {
                return res.status(400).json({ status: false, message: "Wrong Credentials" });
            }
        } else {
            // Query to check both email and mobile for users
            const userQuery = await db.query(`
                SELECT * 
                FROM users 
                WHERE email = '${emailOrMobile}' OR mobile = '${emailOrMobile}'
            `);

            if (userQuery.length > 0) {
                const isCorrectPassword = await bcrypt.compare(password, userQuery[0].password);

                if (isCorrectPassword) {
                    delete userQuery[0].password;

                    const token = jwt.sign(
                        { user_id: userQuery[0].id, user_type: userQuery[0].user_type, employee_id: userQuery[0].employee_id, user_data: userQuery },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '10h' }
                    );

                    // Check if the user already has an entry for today
                    const existingEntry = await db.query(`
                        SELECT * 
                        FROM user_login_details 
                        WHERE user_id = ? AND DATE(login_time) = CURDATE()
                    `, [userQuery[0].id]);

                    if (existingEntry.length === 0) {
                        // Insert login details
                        await db.query(
                            `INSERT INTO user_login_details (user_id, longitude, latitude) VALUES (?, ?, ?)`,
                            [userQuery[0].id, location.longitude, location.latitude]
                        );
                    }

                    return res.status(200).json({ status: true, message: "Login Successfully", data: userQuery[0], token: token });
                } else {
                    return res.status(400).json({ status: false, message: "Wrong Credentials" });
                }
            } else {
                return res.status(400).json({ status: false, message: "Invalid Email or Mobile Number" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
};


// const contractorLogin = async (req, res) => {
//     try {
//         const { emailOrMobile, password, location, device_uuid} = req.body;
//         // Generate a new unique ID if none is provided
//         let uniqueDeviceUUID = device_uuid;

//         // Query to check both email and mobile for admins
//         const adminQuery = await db.query(`
//             SELECT admins.*, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price, admins.name, roles.name AS role 
//             FROM admins 
//             LEFT JOIN plans ON admins.plan_id = plans.id 
//             INNER JOIN roles ON roles.id = admins.user_type 
//             WHERE admins.email = ? OR admins.contact_no = ?
//         `, [emailOrMobile, emailOrMobile]);

//         if (adminQuery.length > 0) {
//             if (adminQuery[0].status !== '1') {
//                 return res.status(400).json({ status: false, message: "Your account is not activated yet. Please contact our support team for assistance." });
//             }

//             const isCorrectPassword = await bcrypt.compare(password, adminQuery[0].password);

//             if (isCorrectPassword) {
//                 delete adminQuery[0].password;

//                 // Check if the deviceUUID matches or is being used for the first time
//                 if (adminQuery[0].device_uuid && adminQuery[0].device_uuid !== uniqueDeviceUUID) {
//                     return res.status(403).json({
//                         status: false,
//                         message: "Unauthorized device. Please contact support for assistance."
//                     });
//                 }

//                 // Save the device UUID for future validation
//                 if (!adminQuery[0].device_uuid) {
//                     await db.query(`UPDATE admins SET uuid = ? WHERE id = ?`, [uniqueDeviceUUID, adminQuery[0].id]);
//                 }

//                 const token = jwt.sign(
//                     { user_id: adminQuery[0].id, user_type: adminQuery[0].user_type, employee_id: adminQuery[0].employee_id, user_data: adminQuery },
//                     process.env.JWT_SECRET_KEY,
//                     { expiresIn: '10h' }
//                 );

//                 // Check if the user already has an entry for today
//                 const existingEntry = await db.query(`
//                     SELECT * 
//                     FROM user_login_details 
//                     WHERE user_id = ? AND DATE(login_time) = CURDATE()
//                 `, [adminQuery[0].id]);

//                 if (existingEntry.length === 0) {
//                     // Insert login details
//                     await db.query(
//                         `INSERT INTO user_login_details (user_id, longitude, latitude) VALUES (?, ?, ?)`,
//                         [adminQuery[0].id, location.longitude, location.latitude]
//                     );
//                 }

//                 return res.status(200).json({
//                     status: true,
//                     message: "Login Successfully",
//                     data: adminQuery[0],
//                     token: token,
//                     deviceUUID: uniqueDeviceUUID
//                 });
//             } else {
//                 return res.status(400).json({ status: false, message: "Wrong Credentials" });
//             }
//         } else {
//             // Query to check both email and mobile for users
//             const userQuery = await db.query(`
//                 SELECT * 
//                 FROM users 
//                 WHERE email = ? OR mobile = ?
//             `, [emailOrMobile, emailOrMobile]);

//             if (userQuery.length > 0) {
//                 const isCorrectPassword = await bcrypt.compare(password, userQuery[0].password);

//                 if (isCorrectPassword) {
//                     delete userQuery[0].password;
//                     console.log("userQuery[0].uuid", userQuery[0].uuid, uniqueDeviceUUID)
                    
//                     // Check if the deviceUUID matches or is being used for the first time
//                     if (userQuery[0].uuid && userQuery[0].uuid !== uniqueDeviceUUID) {
//                         return res.status(200).json({
//                             status: false,
//                             data : userQuery[0].uuid,
//                             message: "Unauthorized device. Please contact support for assistance.",
//                         });
//                     }

//                     // Save the device UUID for future validation
//                     if (!userQuery[0].uuid) {
//                         await db.query(`UPDATE users SET uuid = ? WHERE id = ?`, [uniqueDeviceUUID, userQuery[0].id]);
//                     }

//                     const token = jwt.sign(
//                         { user_id: userQuery[0].id, user_type: userQuery[0].user_type, employee_id: userQuery[0].employee_id, user_data: userQuery },
//                         process.env.JWT_SECRET_KEY,
//                         { expiresIn: '10h' }
//                     );

//                     // Check if the user already has an entry for today
//                     const existingEntry = await db.query(`
//                         SELECT * 
//                         FROM user_login_details 
//                         WHERE user_id = ? AND DATE(login_time) = CURDATE()
//                     `, [userQuery[0].id]);

//                     if (existingEntry.length === 0) {
//                         // Insert login details
//                         await db.query(
//                             `INSERT INTO user_login_details (user_id, longitude, latitude) VALUES (?, ?, ?)`,
//                             [userQuery[0].id, location.longitude, location.latitude]
//                         );
//                     }

//                     return res.status(200).json({
//                         status: true,
//                         message: "Login Successfully",
//                         data: userQuery[0],
//                         token: token,
//                         deviceUUID: uniqueDeviceUUID
//                     });
//                 } else {
//                     return res.status(400).json({ status: false, message: "Wrong Credentials" });
//                 }
//             } else {
//                 return res.status(400).json({ status: false, message: "Invalid Email or Mobile Number" });
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({
//             status: false,
//             message: error.message
//         });
//     }
// };


// const contractorLogin = async (req, res) => {
//     try {
//         const { emailOrMobile, password, location, device_uuid } = req.body;
//         // Generate a new unique ID if none is provided
//         const uniqueDeviceUUID = device_uuid || crypto.randomUUID();

//         // Query to check both email and mobile for admins
//         const adminQuery = await db.query(`
//             SELECT admins.*, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price, admins.name, roles.name AS role 
//             FROM admins 
//             LEFT JOIN plans ON admins.plan_id = plans.id 
//             INNER JOIN roles ON roles.id = admins.user_type 
//             WHERE admins.email = ? OR admins.contact_no = ?
//         `, [emailOrMobile, emailOrMobile]);

//         if (adminQuery.length > 0) {
//             const admin = adminQuery[0];

//             // Check admin account status
//             if (admin.status !== '1') {
//                 return res.status(400).json({ status: false, message: "Your account is not activated yet. Please contact support." });
//             }

//             // Validate password
//             const isCorrectPassword = await bcrypt.compare(password, admin.password);
//             if (!isCorrectPassword) {
//                 return res.status(400).json({ status: false, message: "Wrong Credentials" });
//             }

//             // Handle UUID validation and update
//             if (admin.device_uuid && admin.device_uuid !== uniqueDeviceUUID) {
//                 return res.status(403).json({
//                     status: false,
//                     message: "Unauthorized device. Please contact support for assistance."
//                 });
//             }

//             // Save the device UUID if not already set
//             if (!admin.device_uuid) {
//                 await db.query(`UPDATE admins SET device_uuid = ? WHERE id = ?`, [uniqueDeviceUUID, admin.id]);
//             }

//             const token = jwt.sign(
//                 { user_id: admin.id, user_type: admin.user_type },
//                 process.env.JWT_SECRET_KEY,
//                 { expiresIn: '10h' }
//             );

//             return res.status(200).json({
//                 status: true,
//                 message: "Login Successfully",
//                 data: admin,
//                 token: token,
//                 deviceUUID: uniqueDeviceUUID
//             });
//         }

//         // Query to check both email and mobile for users
//         const userQuery = await db.query(`
//             SELECT * 
//             FROM users 
//             WHERE email = ? OR mobile = ?
//         `, [emailOrMobile, emailOrMobile]);

//         if (userQuery.length > 0) {
//             const user = userQuery[0];

//             // Validate password
//             const isCorrectPassword = await bcrypt.compare(password, user.password);
//             if (!isCorrectPassword) {
//                 return res.status(400).json({ status: false, message: "Wrong Credentials" });
//             }

//             // Handle UUID validation and update with daily restriction
//             if (user.uuid && user.uuid !== uniqueDeviceUUID) {
//                 const lastUpdate = user.last_uuid_update;
//                 const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

//                 // Ensure lastUpdate is a Date object before comparing
//                 if (lastUpdate) {
//                     const lastUpdateDate = new Date(lastUpdate).toISOString().slice(0, 10); // Convert to YYYY-MM-DD string format
//                     if (lastUpdateDate === today) {
//                         return res.status(403).json({
//                             status: false,
//                             message: "Please login your own device. Try again tomorrow.",
//                         });
//                     }
//                 }

//                 // Update UUID if the condition passes
//                 await db.query(`UPDATE users SET uuid = ?, last_uuid_update = NOW() WHERE id = ?`, [uniqueDeviceUUID, user.id]);
//             }

//             // If UUID does not exist, assign it and update the last_uuid_update
//             if (!user.uuid) {
//                 await db.query(`UPDATE users SET uuid = ?, last_uuid_update = NOW() WHERE id = ?`, [uniqueDeviceUUID, user.id]);
//             }

//             const token = jwt.sign(
//                 { user_id: user.id, user_type: user.user_type },
//                 process.env.JWT_SECRET_KEY,
//                 { expiresIn: '10h' }
//             );

//             return res.status(200).json({
//                 status: true,
//                 message: "Login Successfully",
//                 data: user,
//                 token: token,
//                 deviceUUID: uniqueDeviceUUID
//             });
//         }

//         return res.status(400).json({ status: false, message: "Invalid Email or Mobile Number" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: false,
//             message: "An error occurred. Please try again later.",
//         });
//     }
// };


// const contractorLogin = async (req, res) => {
//     try {
//         const { emailOrMobile, password, location, device_uuid } = req.body;
//         // Generate a new unique ID if none is provided
//         const uniqueDeviceUUID = device_uuid || crypto.randomUUID();

//         // Query to check both email and mobile for admins
//         const adminQuery = await db.query(`
//             SELECT admins.*, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price, admins.name, roles.name AS role 
//             FROM admins 
//             LEFT JOIN plans ON admins.plan_id = plans.id 
//             INNER JOIN roles ON roles.id = admins.user_type 
//             WHERE admins.email = ? OR admins.contact_no = ?
//         `, [emailOrMobile, emailOrMobile]);

//         if (adminQuery.length > 0) {
//             const admin = adminQuery[0];

//             // Check admin account status
//             if (admin.status !== '1') {
//                 return res.status(400).json({ status: false, message: "Your account is not activated yet. Please contact support." });
//             }

//             // Validate password
//             const isCorrectPassword = await bcrypt.compare(password, admin.password);
//             if (!isCorrectPassword) {
//                 return res.status(400).json({ status: false, message: "Wrong Credentials" });
//             }

//             // Handle UUID validation and update
//             if (admin.device_uuid && admin.device_uuid !== uniqueDeviceUUID) {
//                 return res.status(403).json({
//                     status: false,
//                     message: "Unauthorized device. Please contact support for assistance."
//                 });
//             }

//             // Save the device UUID if not already set
//             if (!admin.device_uuid) {
//                 await db.query(`UPDATE admins SET device_uuid = ? WHERE id = ?`, [uniqueDeviceUUID, admin.id]);
//             }

//             const token = jwt.sign(
//                 { user_id: admin.id, user_type: admin.user_type },
//                 process.env.JWT_SECRET_KEY,
//                 { expiresIn: '10h' }
//             );

//             return res.status(200).json({
//                 status: true,
//                 message: "Login Successfully",
//                 data: admin,
//                 token: token,
//                 deviceUUID: uniqueDeviceUUID
//             });
//         }

//         // Query to check both email and mobile for users
//         const userQuery = await db.query(`
//             SELECT * 
//             FROM users 
//             WHERE email = ? OR mobile = ?
//         `, [emailOrMobile, emailOrMobile]);

//         if (userQuery.length > 0) {
//             const user = userQuery[0];

//             // Validate password
//             const isCorrectPassword = await bcrypt.compare(password, user.password);
//             if (!isCorrectPassword) {
//                 return res.status(400).json({ status: false, message: "Wrong Credentials" });
//             }

//             // Handle UUID validation and update
//             if (user.uuid && user.uuid !== uniqueDeviceUUID) {
//                 return res.status(403).json({
//                     status: false,
//                     message: "Unauthorized device. Please contact support for assistance.",
//                 });
//             }

//             // Save the device UUID if not already set
//             if (!user.uuid) {
//                 await db.query(`UPDATE users SET uuid = ? WHERE id = ?`, [uniqueDeviceUUID, user.id]);
//             }

//             const token = jwt.sign(
//                 { user_id: user.id, user_type: user.user_type },
//                 process.env.JWT_SECRET_KEY,
//                 { expiresIn: '10h' }
//             );

//             return res.status(200).json({
//                 status: true,
//                 message: "Login Successfully",
//                 data: user,
//                 token: token,
//                 deviceUUID: uniqueDeviceUUID
//             });
//         }

//         return res.status(400).json({ status: false, message: "Invalid Email or Mobile Number" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: false,
//             message: "An error occurred. Please try again later.",
//         });
//     }
// };


const resetLogin = async(req,res) => {
    try {
        const {emailOrMobile} = req.body;
        const user = await db.query(`select * from users where email = '${emailOrMobile}' or mobile = '${emailOrMobile}'`)
        if (user.length>0){
            const update =  await db.query(`update users set uuid = null where id = '${user[0].id}'`    
            )

            if (update.affectedRows > 0){
                return res.status(200).json({status:true, message: "Login reset successfully."})
            }else{
                return res.status(403).json({status:true, message:"An error occurred while updating"})
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "An error occurred. Please try again later.",
        });
    }
}


const renewPlan = async (req, res) => {
    try {
        const contractorId = req.user.user_id;
        const { plan_id } = req.body;
        /** renew the current contractor plan  */
        const [planRecord] = await getRecord("plans", 'id', plan_id)
        if (!planRecord) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }
        const daysObject = {
            "week": 7,
            "month": 30,
            "year": 365
        }
        const numberOfDays = daysObject[planRecord?.duration] || 0;
        const [userDetails] = await getRecord("admins", "id", contractorId)
        if (!userDetails) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }
        /** Renew Check can't update plan  */
        if (userDetails.plan_id != plan_id) {
            return res.status(400).json({
                status: false,
                message: "You can only renew your plan"
            });
        }
        const planRenewQuery = `UPDATE admins SET plan_expire_date = DATE_ADD(plan_expire_date, INTERVAL ? DAY) WHERE id = ?`
        await db.query(planRenewQuery, [
            numberOfDays,
            contractorId
        ])
        return res.status(200).json({
            status: true,
            message: "Plan renewed successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

module.exports = { contractorLogin, renewPlan, resetLogin }