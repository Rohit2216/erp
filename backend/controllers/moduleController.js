var moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { getSubModuleWithSubModules, getPermissionOfModulesUsingRoleId, getSubModuleWithSubModulesWithPermission, getAdminDetailsById, getUserDetails} = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const { checkPositiveInteger } = require('../helpers/validation');


const getAllModule = async (req, res) => {

    try {
        const role_id = req.params.role_id || req.user.user_type;
        console.log("role_id", role_id)

        // const role_id = 7;
        const searchData = req.query.search || '';
        if (searchData != null && searchData != '') {
            var selectQuery = `SELECT * FROM modules WHERE title LIKE '%${searchData}%' AND status = '1' ORDER BY order_number ASC`;
        }
        else {
            var selectQuery = `SELECT * FROM modules WHERE status = '1' ORDER BY order_number ASC`;
        }


        await db.query(selectQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err.message });
            console.log("result", result)
            if (result.length > process.env.VALUE_ZERO) {

                const final = result.map(async (element) => {
                    const modulePermissData = await getPermissionOfModulesUsingRoleId(element.id, 0, 0, role_id)
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
                    return {
                        ...element,
                        create: create_permission,
                        view: view_permission,
                        delete: delete_permission,
                        update: update_permission,
                        submodules: await getSubModuleWithSubModulesWithPermission(element.id, role_id)
                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Module fetched successfully", data: values });
                })
            }
            else {
                return res.status(200).json({ status: false, message: "No data found" });
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const getModuleByPlanId = async(req, res) => {

    try {
        
        const loggedUserId = req.user.user_id;
        const loggedUserType = req.user.user_type;
        var getLoggedUserDetails;

        if(loggedUserType == process.env.CONTRACTOR_ROLE_ID)
        {
            getLoggedUserDetails = await getAdminDetailsById(loggedUserId);
        }
        else
        {
            const usersDetails = await getUserDetails(loggedUserId);
            getLoggedUserDetails = usersDetails[0];
        }

       
        if(Object.keys(getLoggedUserDetails).length > 0)
        {
            const plan_id = getLoggedUserDetails.plan_id;
            const {error} = checkPositiveInteger.validate({id: plan_id});

            if(error)
            {
                return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: error.message
                });
            }

            const getPlainModules = await db.query("SELECT id as plan_id, module FROM plans WHERE id = ?", [plan_id]);
            const planModules = JSON.parse(JSON.parse(getPlainModules[0].module)).join(',');
           
            const selectQuery = `SELECT * FROM modules WHERE status = '1' AND id IN(${planModules}) ORDER BY order_number ASC`;

            await db.query(selectQuery, async (err, result) => {
                if (err) return res.status(500).json({ status: false, message: err.message });
    
                if (result.length > process.env.VALUE_ZERO) {
    
                    const final = result.map(async (element) => {
                        const modulePermissData = await getPermissionOfModulesUsingRoleId(element.id, 0, 0, loggedUserType)
    
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
                        return {
                            ...element,
                            create: create_permission,
                            view: view_permission,
                            delete: delete_permission,
                            update: update_permission,
                            submodules: await getSubModuleWithSubModulesWithPermission(element.id, loggedUserType)
                        }
                    });
    
                    Promise.all(final).then((values) => {
                        res.status(200).json({ status: true, message: "Module fetched successfully", data: values });
                    })
                }


                
                else {
                    return res.status(200).json({ status: false, message: "No data found" });
                }
            })
        }
        else
        {
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ 
                status: false, 
                message: "Sorry! users details not found"
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

module.exports = { getAllModule, getModuleByPlanId}