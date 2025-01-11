const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require("dotenv").config();
const { con, makeDb } = require("../db");
const { adminCreateValidation } = require("../helpers/validation");
const { getDealerAllUserById, getPendingContractorUsersById, roleById } = require('../helpers/general');
const { generatePanelIdForAdmin } = require('../helpers/panelHelper');
const Joi = require("joi");
const { StatusCodes } = require('http-status-codes');


const db = makeDb();

const superAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = `SELECT * FROM admins WHERE email='${email}' AND user_type='${process.env.SUPER_ADMIN_ROLE_ID}'`;

        db.query(sql, async (error, result) => {
            if (error) {
                return res.status(500).json({ status: false, message: error })
            }

            if (result.length > process.env.VALUE_ZERO) {
                const isCorrectPassword = await bcrypt.compare(password, result[0].password)
                if (isCorrectPassword) {
                    delete result[0].password;
                    const token = jwt.sign({ user_id: result[0].id, user_type: result[0].user_type }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
                    return res.status(200).json({ status: true, message: "Login Successfully", data: result[0], token: token })
                }
                else {
                    return res.status(400).json({ status: false, message: "Wrong Credentials" })
                }
            }
            else {
                return res.status(500).json({ status: false, message: "Email Invalid" })
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}


// const getProfileDetails = async (req, res) => {

//     try {
//         const loggedUserId = req.user.user_type;
//         const userId = req.user.user_id;
//         const sql = `SELECT admins.*, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price, admins.name, roles.name AS role FROM admins LEFT JOIN plans ON admins.plan_id = plans.id INNER JOIN roles ON roles.id = admins.user_type WHERE admins.user_type='${loggedUserId}'`
//         db.query(sql, async (error, result) => {
//             console.log(error, "error")
//             if (error) return res.status(403).json({ status: false, message: error });

//             if (result.length > process.env.VALUE_ZERO) {
//                 res.status(200).json({ status: true, message: 'success', data: result[0] });
//             }
//             else {
//                 const sql = `SELECT users.*, users.name, roles.name AS role FROM users INNER JOIN roles ON roles.id = users.user_type WHERE users.user_type='${loggedUserId}'`
//                 db.query(sql, async (error, result) => {
//                     if (error) return res.status(403).json({ status: false, message: error });
        
//                     if (result.length > process.env.VALUE_ZERO) {
//                         res.status(200).json({ status: true, message: 'success', data: result[0] });
//                     }
//                 })
//             }
//         })
//     }
//     catch (error) {
//         res.status(400).json({
//             status: false,
//             message: error.message
//         })
//     }
// }

const getProfileDetails = async (req, res) => {
    try {
        const loggedUserType = req.user.user_type;
        const userId = req.user.user_id;

        let query;
        let queryParams;

        // Check user type and assign query accordingly
        if (loggedUserType === 3) {
            // Admin query
            query = `
                SELECT admins.*, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price, admins.name, roles.name AS role FROM admins LEFT JOIN plans ON admins.plan_id = plans.id INNER JOIN roles ON roles.id = admins.user_type 
                WHERE admins.id = ?`;
            queryParams = [userId];
        } else {
            // User query
            query = `
                SELECT users.*, users.name, roles.name AS role FROM users INNER JOIN roles ON roles.id = users.user_type 
                WHERE users.id = ?`;
            queryParams = [userId];
        }

        // Execute the query
        const result = await db.query(query, queryParams);

        if (result.length > 0) {
            // Return the first row of the result
            return res.status(200).json({
                status: true,
                message: 'Profile fetched successfully',
                data: result[0],
            });
        } else {
            return res.status(404).json({
                status: false,
                message: 'No profile found for the user type',
            });
        }
    } catch (error) {
        console.error("Error in getProfileDetails:", error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};




const updateProfile = async (req, res) => {

    try {
        const { name, email, contact_no } = req.body
        const updatedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const loggedUserId = req.user.user_id;
        // const user_type = process.env.SUPER_ADMIN_ROLE_ID;

        if (req.files != null) {
            const image = req.files.image
            const imageName = Date.now() + image.name
            const uploadPath = process.cwd() + '/public/super_admin_images/' + imageName;
            const storePath = '/super_admin_images/' + imageName;

            image.mv(uploadPath, (error, response) => {
                if (error) return res.status(403).json({ status: false, message: error.message });

            })
            var updateSql = `UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', image='${storePath}', updated_at='${updatedTime}' WHERE id='${loggedUserId}'`
        }
        else {
            var updateSql = `UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', updated_at='${updatedTime}' WHERE id='${loggedUserId}'`
        }

        db.query(updateSql, (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO)
                return res.status(200).json({ status: true, message: "Data Updated Successfully" });
        })
    }
    catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// const changePassword = async (req, res) => {

//     try {
//         const { old_password, new_password, confirm_password } = req.body
//         const loggedUserId = req.user.user_id;
//         console.log("loggedUserId", loggedUserId)
//         const getLoggedUserPassword = `SELECT password FROM admins WHERE id='${loggedUserId}'`
//         db.query(getLoggedUserPassword, async (err, result) => {
//             if (err) return res.status(200).json({ status: false, message: err })

//             if (result.length > process.env.VALUE_ZERO) {
//                 const isCorrectPassword = await bcrypt.compare(old_password, result[0].password)
//                 if (isCorrectPassword) {
//                     if (new_password == confirm_password) { 
//                         const salt = bcrypt.genSaltSync(10);
//                         const hashPassword = await bcrypt.hash(new_password, salt);
//                         const updateQuery = `UPDATE admins SET password='${hashPassword}' WHERE id='${loggedUserId}'`
//                         //  res.status(200).send(updateQuery);
//                         db.query(updateQuery, async (err, result) => {
//                             if (err) return res.status(200).json({ status: false, message: err });

//                             if (result.affectedRows > process.env.VALUE_ZERO) {
//                                 res.status(200).json({ status: true, message: "Password changed successfully" })
//                             }
//                             else {
//                                 res.status(200).json({ status: false, message: "There is some error to change password, please try after sometime." })
//                             }
//                         })
//                     }
//                     else {
//                         return res.status(403).json({ status: false, message: "Confirm password is not equal to new password." })
//                     }
//                 }
//                 else {
//                     return res.status(200).json({ status: false, message: "Old password wrong" })
//                 }
//             }
//             else {
//                 return res.status(400).json({ status: false, message: "Something went wrong, please try after sometime" })
//             }
//         })
//     }
//     catch (error) {
//         return res.status(400).json({
//             status: false,
//             message: error.message
//         })
//     }
// }


const changePassword = async (req, res) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;
        const loggedUserId = req.user.user_id;

        if (new_password !== confirm_password) {
            return res.status(403).json({ status: false, message: "Confirm password is not equal to new password." });
        }

        const getLoggedUserPasswordFromAdmins = `SELECT password FROM admins WHERE id='${loggedUserId}'`;
        db.query(getLoggedUserPasswordFromAdmins, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (result.length > process.env.VALUE_ZERO) {
                const isCorrectPassword = await bcrypt.compare(old_password, result[0].password);
                if (isCorrectPassword) {
                    await updatePasswordInTable('admins', loggedUserId, new_password, res);
                } else {
                    return res.status(200).json({ status: false, message: "Old password wrong" });
                }
            } else {
                const getLoggedUserPasswordFromUsers = `SELECT password FROM users WHERE id='${loggedUserId}'`;
                db.query(getLoggedUserPasswordFromUsers, async (err, result) => {
                    if (err) return res.status(500).json({ status: false, message: err.message });

                    if (result.length > process.env.VALUE_ZERO) {
                        const isCorrectPassword = await bcrypt.compare(old_password, result[0].password);
                        if (isCorrectPassword) {
                            await updatePasswordInTable('users', loggedUserId, new_password, res);
                        } else {
                            return res.status(200).json({ status: false, message: "Old password wrong" });
                        }
                    } else {
                        return res.status(400).json({ status: false, message: "User not found in both admins and users tables." });
                    }
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

const updatePasswordInTable = async (table, userId, newPassword, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const updateQuery = `UPDATE ${table} SET password='${hashPassword}' WHERE id='${userId}'`;
    
    db.query(updateQuery, (err, result) => {
        if (err) return res.status(500).json({ status: false, message: err.message });

        if (result.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Password changed successfully" });
        } else {
            res.status(500).json({ status: false, message: "There is some error to change password, please try after sometime." });
        }
    });
};


const createEnergyCompany = async (req, res) => {

    try {
        const { username, email, password, contact_no, alt_number, company_name, website_url, address_1, gst_number, zone_id, ro_id, sale_area_id, status, country, city, pin_code, description } = req.body

        const { error } = adminCreateValidation.validate({ email: req.body.email, password: req.body.password, contact_no: req.body.contact_no })
        if (error) return res.status(400).json({ status: false, message: error.message })

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const createdBy = req.user.user_id;
        const user_type = process.env.ENERGY_COMPANY_ROLE_ID;
        const panel_id = await generatePanelIdForAdmin(process.env.ENERGY_COMPANY_ROLE_ID, company_name);
        var storePath = '';
        if (req.files != null) {
            const image = req.files.image
            const imageName = Date.now() + image.name
            const uploadPath = process.cwd() + '/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, (err, response) => {

                if (err) return res.status(400).json({ status: false, message: err.message });
            })
        }

        const userInsertQuery = `INSERT INTO admins (name, email, password, contact_no, alt_number, user_type, address_1, status, country, city, pin_code, image, description, gst_number, created_by, panel_id) VALUES ('${username}', '${email}', '${hashPassword}', '${contact_no}', '${alt_number}', '${user_type}', '${address_1}', '${status}', '${country}', '${city}', '${pin_code}',  '${storePath}', '${description}', '${gst_number}', '${createdBy}','${panel_id}')`
        db.query(userInsertQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err });

            if (result.affectedRows > process.env.VALUE_ZERO) {
                const energy_company_id = result.insertId;
                //energy company create
                const insertEnergyCompanyQuery = `INSERT INTO energy_companies (admin_id, name, website) VALUES('${energy_company_id}', '${company_name}', '${website_url}')`
                const insertEnergyCompanyResult = await db.query(insertEnergyCompanyQuery)

                res.status(200).json({ status: true, message: "Energy company created Successfully" })
            }
            else {
                res.status(200).json({ status: false, message: "There is some error to insert data, please try after sometime." })
            }
        })
    }
    catch (error) {
        return res.status(400).json({ status: false, message: error.message })
    }
}

const getAllSubUserForSuperAdmin = async (req, res) => {

    try {
        const loggedUserId = req.user.user_id;
        const selectQuery = `SELECT * FROM users WHERE created_by = '${loggedUserId}'`

        db.query(selectQuery, (err, result) => {

            if (err) return res.status(500).json({ status: false, message: err });

            if (result.length > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: 'Success', data: result })
            }
            else {
                return res.status(200).json({ status: false, message: 'No Data Found' })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const getAllSuperAdminAndUsersWithPendingAccountStatus = async (req, res) => {
    try {

        const adminRole = process.env.ADMIN_ROLE_ID
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(admins.id) as total FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${adminRole}' AND admins.is_deleted='0' AND admins.status='0'`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';

        if (searchData != null && searchData != '') {
            searchDataCondition = `AND admins.name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT admins.id as admin_id, admins.image, admins.name,admins.email, admins.status, admins.contact_no, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${adminRole}' AND admins.is_deleted='0' AND admins.status='0' ${searchDataCondition} ORDER   BY admins.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({ status: false, message: err })

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        users: await getPendingContractorUsersById(element.admin_id)
                    }
                });

                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult })

                    res.status(200).json({ status: true, message: 'Fetched successfully', data: values, pageDetails: pageDetails[0] });
                })
            }
            else {
                return res.status(403).json({ status: false, message: 'Data not found' });
            }
        })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const superAdminAccountStatusAction = async (req, res) => {

    try {
        const { admin_id, status, user_type } = req.body;
        const accountStatusValidation = Joi.object({
            admin_id: Joi.number().required(),
            status: Joi.number().required(),
            user_type: Joi.string().required(),
        })

        const { error } = accountStatusValidation.validate(req.body)

        if (error) return res.status(403).json({ status: false, message: error.message })

        var responseMessage = '';

        if (status == '1') {
            responseMessage = 'Activated'
        }
        else {
            responseMessage = 'Rejected'
        }

        if (user_type == 'Admin') {
            var updateQuery = `UPDATE admins SET status = '${status}' WHERE id = '${admin_id}'`
        }
        else {
            var updateQuery = `UPDATE users SET status = '${status}' WHERE id = '${admin_id}'`
        }

        const queryResult = await db.query(updateQuery)

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "User account status changed to " + responseMessage + " successfully" })
        }
        else {
            res.status(404).json({ status: true, message: "Error! User account status not changed" })
        }
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


// const markAsResolvedComplaints = async (req, res) => {
//     try {
//         const { complaints_id, assign_to } = req.body;

//         const loggedUserId = req.user.user_id;
//         const loggedUserType = req.user.user_type;
//         const title = 'Complaint assigned to user';
//         const roleDetailsData = await roleById(loggedUserType);
//         const remark = 'Complaint assigned by ' + roleDetailsData.name;
//         const resolvedRemark = 'Complaint resolved by' + roleDetailsData.name;
//         const status = 'assigned';
//         const resolvedStatus = 'resolved'

//         const checkComplaintisAssignOrNot = await db.query('SELECT * FROM complaints_timeline WHERE complaints_id = ? AND status IN (?, ?)', [complaints_id, 'approved', 'assigned']);
//         let query, values;
//         if (checkComplaintisAssignOrNot.length > 0) {
//             /**here to resolved the complaint*/
//             query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
//             values = [complaints_id, title, resolvedRemark, roleDetailsData.id, null, resolvedStatus, loggedUserId];
//         } else {
//             /**here to approved the complaint*/
//             query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
//             values = [complaints_id, title, remark, roleDetailsData.id, null, 'approved', loggedUserId];
//             /**here to assign the complalints its may be assign the end users multiple (assign_to)*/
//             query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
//             values = [complaints_id, title, remark, roleDetailsData.id, assign_to, status, loggedUserId];
//             /**here to resolved the complaint*/
//             query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
//             values = [complaints_id, title, resolvedRemark, roleDetailsData.id, null, resolvedStatus, loggedUserId];

//         }

//         const updateQuery= `UPDATE complaints SET status= 5 WHERE id = ? `
//         const updateValues= [complaints_id];

//         const execQuery = await db.query(query, values)
//         const execUpdateQuery= await db.query(updateQuery, updateValues)
//         if (execQuery.affectedRows > 0) {
//             return res.status(StatusCodes.OK).json({ status: true, message: 'Complaint marked as resolved' })
//         } else {
//             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "some thing went wrong" })
//         }


//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

const markAsResolvedComplaints = async (req, res) => {
    try {
        const { complaints_id, area_manager_id, supervisor_id, assign_to } = req.body;

        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        const title = 'Complaint assigned to user';
        const roleDetailsData = await roleById(loggedUserType);
        const remark = 'Complaint assigned by ' + roleDetailsData.name;
        const resolvedRemark = 'Complaint resolved by ' + roleDetailsData.name;
        const status = 'assigned';
        const resolvedStatus = 'resolved';

        const checkComplaintisAssignOrNot = await db.query('SELECT * FROM complaints_timeline WHERE complaints_id = ? ORDER BY created_at DESC LIMIT 1', [complaints_id]);

        let query, values;
        const checkStatus = checkComplaintisAssignOrNot[0].status;

        if (checkComplaintisAssignOrNot.length > 0) {
            if (checkStatus == 'approved') {
                if (assign_to.length > 0) {
                    // Assign the complaint to end users
                    const assignToPlaceholders = Array(assign_to.length).fill('(?, ?, ?, ?, ?, ?, ?)').join(',');
                    query = `INSERT INTO complaints_timeline (complaints_id, title, remark, role_id,area_manager_id, supervisor_id, assign_to, status, created_by, free_end_users) VALUES ${assignToPlaceholders}`;
                    values = assign_to.flatMap((assignToValue) => [
                        complaints_id, title, remark, roleDetailsData.id, area_manager_id, supervisor_id, assignToValue, status, loggedUserId, 1
                    ]);
                    await db.query(query, values);

                    // Resolve the complaints
                    query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by, free_end_users) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                    values = [complaints_id, title, resolvedRemark, roleDetailsData.id, null, resolvedStatus, loggedUserId, 0];
                }
            } else if (checkStatus == 'assigned') {
                // Directly mark the complaint as resolved
                query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by, free_end_users) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                values = [complaints_id, title, resolvedRemark, roleDetailsData.id, null, resolvedStatus, loggedUserId, 0];
            } else if (checkStatus == 'resolved') {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "complaint already resolved" })
            } else {
                // If no record found, the complaint is in 'created' state
                // To approve the complaint
                query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
                values = [complaints_id, title, remark, roleDetailsData.id, null, 'approved', loggedUserId];
                // await db.query(query, values);
                if (assign_to.length > 0) {
                    // Assign the complaint to end users
                    const assignToPlaceholders = Array(assign_to.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
                    query = `INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, area_manager_id, supervisor_id, assign_to, status, created_by, free_end_users) VALUES ${assignToPlaceholders}`;
                    values = assign_to.flatMap((assignToValue) => [
                        complaints_id, title, remark, roleDetailsData.id, area_manager_id, supervisor_id, assignToValue, status, loggedUserId, 1
                    ]);
                    // await db.query(query, values);

                    // Resolve the complaints
                    query = 'INSERT INTO complaints_timeline (complaints_id, title, remark, role_id, assign_to, status, created_by, free_end_users) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                    values = [complaints_id, title, resolvedRemark, roleDetailsData.id, null, resolvedStatus, loggedUserId, 0];

                }
            }
        }

        // Update the status of the complaint
        const updateQuery = 'UPDATE complaints SET status = 5 WHERE id = ?';
        const updateValues = [complaints_id];

        // Execute all queries
        const execQuery = await db.query(query, values);
        if (execQuery.affectedRows > 0) {

            await db.query(updateQuery, updateValues);

            return res.status(StatusCodes.OK).json({ status: true, message: 'Complaint marked as resolved' });
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: true, message: 'Error! complaint status not changed.' });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


module.exports = { superAdminLogin, getProfileDetails, updateProfile, changePassword, createEnergyCompany, getAllSubUserForSuperAdmin, getAllSuperAdminAndUsersWithPendingAccountStatus, superAdminAccountStatusAction, markAsResolvedComplaints }