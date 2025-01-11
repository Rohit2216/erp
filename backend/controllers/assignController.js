var moment = require('moment');
require('dotenv').config();
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { checkPositiveInteger } = require('../helpers/validation');
const { getManagerFreeTeamMember, getSuperVisorUsers, checkUserHasNoActiveComplaints } = require('../helpers/commonHelper');
const { getUserDetails } = require('../helpers/general');


const getALLmanagersWIthTeamMembers = async (req, res) => {

    try {
        const complaintId = req.query.complaintId;

        const managerRoleId = process.env.MANAGER_ROLE_ID
        const selectQuery = `SELECT * FROM users WHERE user_type = ?`
        const queryResult = await db.query(selectQuery, [managerRoleId])
        if (queryResult.length > 0) {

            var finalData = [];
            var isManagerAssigned = false;
            let managerDetails;

            if (complaintId != null && complaintId != undefined) {
                const checkManagerAssignedOrNot = await getComplaintAssignUserManagerAndSupervisor(complaintId, "manager");
                managerDetails = checkManagerAssignedOrNot;
            }

            for (const row of queryResult) {
                //const freeEndUsersCount = await getManagerFreeTeamMember(row.id);
                if (managerDetails != null && managerDetails != undefined) {
                    if (managerDetails.manager_id == row.id) {
                        isManagerAssigned = true;
                    }
                }
                finalData.push({
                    id: row.id,
                    employee_id: row.employee_id,
                    name: row.name,
                    image: row.image,
                    user_type: row.user_type,
                    isManagerAssigned: isManagerAssigned,
                    //free_end_users: freeEndUsersCount.finalData.length,
                    //users: freeEndUsersCount.finalData
                });
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: finalData })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getALLSupervisors = async (req, res) => {

    try {

        const roleId =  req.params.role_id;
        const selectQuery = `SELECT * FROM users WHERE user_type = ?`
        const queryResult = await db.query(selectQuery, [roleId])
        
        if (queryResult.length > 0) {
            var finalData = [];

            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    employee_id: row.employee_id,
                    name: row.name,
                    image: row.image,
                    user_type: row.user_type,
                });
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: finalData })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

// const getSuperVisorOnManagerId = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const complaintId = req.query.complaintId;
//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) {
//             return res
//                 .status(StatusCodes.FORBIDDEN)
//                 .json({
//                     status: false,
//                     message: error.message
//                 });
//         }

//         const queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE manager_id = ?`, [id]);

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             var finalData = [];
//             var isSupervisorAssigned = false;
//             let supervisorDetails;

//             if (complaintId != null && complaintId != undefined) {
//                 const checkSupervisorAssignedOrNot = await getComplaintAssignUserManagerAndSupervisor(complaintId, "supervisor");
//                 supervisorDetails = checkSupervisorAssignedOrNot;
//             }

//             for (const row of queryResult) {
//                 const supervisorUsers = await getSuperVisorUsers(row.id);

//                 if (supervisorUsers.length > process.env.VALUE_ZERO) {
//                     const usersWithNoComplaints = [];
                    
//                     for (const supervisorUser of supervisorUsers) {
//                         const userComplaints = await checkUserHasNoActiveComplaints(supervisorUser.id);

//                         // Check if userComplaints is an array before using filter
//                         if (Array.isArray(userComplaints) && userComplaints.length === 0) {
//                             usersWithNoComplaints.push({
//                                 ...supervisorUser,
//                             });
//                         }
//                     }
//                     if (supervisorDetails != null && supervisorDetails != undefined) {
//                         if (supervisorDetails.supervisor_id == row.id) {
//                             isSupervisorAssigned = true;
//                         }
//                     }

//                     finalData.push({
//                         id: row.id,
//                         name: row.name,
//                         employee_id: row.employee_id,
//                         image: row.image,
//                         isSupervisorAssigned: isSupervisorAssigned,
//                         free_end_users: usersWithNoComplaints.length,
//                         users: usersWithNoComplaints
//                     });
//                 }
//             }

//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "Supervisors found",
//                     data: finalData
//                 });
//         } else {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: "Supervisors not found"
//                 });
//         }
//     } catch (error) {
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: error.message
//             });
//     }
// };

// const getFreeEndUsersOnSuperVisorId = async (req, res) => {
 
//     try {
//         const id = req.params.id;
//         const { error } = checkPositiveInteger.validate({ id });
//         if (error) {
//             return res
//                 .status(StatusCodes.FORBIDDEN)
//                 .json({
//                     status: false,
//                     message: error.message
//                 });
//         }

//         const queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE supervisor_id = ?`, [id]);

//         if (queryResult.length > process.env.VALUE_ZERO) {  
//             var finalData = [];

//             for (const row of queryResult) {
//                 const userComplaints = await checkUserHasNoActiveComplaints(row.id);
//                 const isAssigned = userComplaints.length > 0 && userComplaints.some(complaint => complaint.assign_to === row.id);
//                 finalData.push({
//                     id: row.id, 
//                     name: row.name,
//                     employee_id: row.employee_id,   
//                     image: row.image,
//                     isAssigned: isAssigned
//                 });
//             }

//             console.log("fialData", finalData);

//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: true,
//                     message: "end users found",
//                     data: finalData
//                 });
//         } else {
//             return res
//                 .status(StatusCodes.OK)
//                 .json({
//                     status: false,
//                     message: "end users not found"
//                 });
//         }
//     } catch (error) {
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: error.message
//             });
//     }
// }

const getSuperVisorOnManagerId = async (req, res) => {
    try {
        const id = req.params.id;
        const complaintId = req.query.complaintId;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: error.message
                });
        }
        const queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE manager_id = ?`, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            var isSupervisorAssigned = false;
            let supervisorDetails;
            if (complaintId != null && complaintId != undefined) {
                const checkSupervisorAssignedOrNot = await getComplaintAssignUserManagerAndSupervisor(complaintId, "supervisor");
                supervisorDetails = checkSupervisorAssignedOrNot;
            }
            for (const row of queryResult) {
                const supervisorUsers = await getSuperVisorUsers(row.id);
                if (supervisorUsers.length > process.env.VALUE_ZERO) {
                    const usersWithNoComplaints = [];
                    for (const supervisorUser of supervisorUsers) {
                        const userComplaints = await checkUserHasNoActiveComplaints(supervisorUser.id);
                        // Check if userComplaints is an array before using filter
                        // if (Array.isArray(userComplaints) && userComplaints.length === 0) {
                            usersWithNoComplaints.push({
                                ...supervisorUser,
                            });
                        // }
                    }
                    if (supervisorDetails != null && supervisorDetails != undefined) {
                        if (supervisorDetails.supervisor_id == row.id) {
                            isSupervisorAssigned = true;
                        }
                    }
                    finalData.push({
                        id: row.id,
                        name: row.name,
                        employee_id: row.employee_id,
                        image: row.image,
                        isSupervisorAssigned: isSupervisorAssigned,
                        free_end_users: usersWithNoComplaints.length,
                        users: usersWithNoComplaints
                    });
                }
            }
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Supervisors found",
                    data: finalData
                });
        } else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Supervisors not found"
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
};
const getFreeEndUsersOnSuperVisorId = async (req, res) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: error.message
                });
        }
        const queryResult = await db.query(`SELECT id, name, employee_id, image FROM users WHERE supervisor_id = ?`, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            var finalData = [];
            for (const row of queryResult) {
                const userComplaints = await checkUserHasNoActiveComplaints(row.id);
                const isAssigned = userComplaints.length > 0 && userComplaints.some(complaint => complaint.assign_to === row.id);
                finalData.push({
                    id: row.id,
                    name: row.name,
                    employee_id: row.employee_id,
                    image: row.image,
                    isAssigned: isAssigned
                });
            }
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "end users found",
                    data: finalData
                });
        } else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "end users not found"
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

const getAreaManagerOfUser = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const queryResult = await db.query(`SELECT id, name, employee_id, image, supervisor_id FROM users WHERE id = ?`, [id]);
        if (queryResult.length > process.env.VALUE_ZERO) {
            const supervisor_id = queryResult[0].supervisor_id;
            const getManagerDetailsQueryResult = await db.query(`SELECT id, name, employee_id, image, manager_id FROM users WHERE id = ?`, [supervisor_id]);

            if (getManagerDetailsQueryResult.length > process.env.VALUE_ZERO) {
                const manager_id = getManagerDetailsQueryResult[0].manager_id;
                const areaManagerDetails = await db.query(`SELECT id, name, employee_id, image FROM users WHERE id = ?`, [manager_id]);

                if (areaManagerDetails.length > process.env.VALUE_ZERO) {
                    return res
                        .status(StatusCodes.OK)
                        .json({
                            status: true,
                            message: "Area Manager found",
                            data: areaManagerDetails[0],
                        });
                }
                else {
                    return res
                        .status(StatusCodes.OK)
                        .json({
                            status: false,
                            message: "Area Manager not found"
                        });
                }
            }
            else {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: false,
                        message: "Area Manager not found"
                    });
            }
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Area Manager not found"
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

async function getComplaintAssignUserManagerAndSupervisor(complaintId, userType) {

    try {
        const { error } = checkPositiveInteger.validate({ id: complaintId });

        if (error) {
            return error.message;
        }

        const assignComplaintDetails = await db.query(`SELECT * FROM complaints_timeline WHERE complaints_id = '${complaintId}' AND status = 'assigned' ORDER BY id DESC LIMIT 1`);

        if (assignComplaintDetails.length > 0) {
            var finalData = [];
            const assignTo = assignComplaintDetails[0].assign_to;
            if (assignTo) {
                // get assign user details
                const getAssignUserDetails = await getUserDetails(assignTo);
                if (getAssignUserDetails.length > 0) {
                    const supervisorId = getAssignUserDetails[0].supervisor_id;
                    // get assign user supervisor details
                    const getAssignUserSupervisorDetails = await getUserDetails(supervisorId);

                    if (getAssignUserSupervisorDetails.length > 0) {
                        const assignUserSupervisorDetails = {
                            "supervisor_id": getAssignUserSupervisorDetails[0].id,
                            "supervisor_name": getAssignUserSupervisorDetails[0].name,
                            "supervisor_employee_id": getAssignUserSupervisorDetails[0].employee_id,
                            "supervisor_image": getAssignUserSupervisorDetails[0].image,

                        };

                        if (userType == 'supervisor') {
                            return assignUserSupervisorDetails;
                        }

                        const managerId = getAssignUserSupervisorDetails[0].manager_id;
                        // get assign user manager details
                        const getAssignUserManagerDetails = await getUserDetails(managerId);

                        if (getAssignUserManagerDetails.length > 0) {   

                            const assignUserManagerDetails = {
                                "manager_id": getAssignUserManagerDetails[0].id,
                                "manager_name": getAssignUserManagerDetails[0].name,
                                "manager_employee_id": getAssignUserManagerDetails[0].employee_id,
                                "manager_image": getAssignUserManagerDetails[0].image,

                            };

                            if (userType == 'manager') {
                                return assignUserManagerDetails;
                            }

                        }
                    }
                    return finalData;
                }
            }
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: 'Assign Complaint Details found',
                    data: finalData,
                })
        }
        else {
            return [];
        }

    } catch (error) {
        return error.message;
    }
}



module.exports = { getALLmanagersWIthTeamMembers, getSuperVisorOnManagerId, getFreeEndUsersOnSuperVisorId, getAreaManagerOfUser, getALLSupervisors }