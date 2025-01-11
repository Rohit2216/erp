var moment = require('moment');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const { promisify } = require('util');
const Joi = require('joi');
const { hrTeamValidations, checkPositiveInteger } = require('../helpers/validation');
const {
    getTeamMemberOnId,
    getUsersById,
    calculatePagination,
    roleById,
    getUserDetails,
} = require('../helpers/general');
const { response } = require('express');

const createHrTeam = async (req, res) => {
    try {
        const { team_name, team_short_description, manager_id, supervisor_id, members } = req.body;
        const { error } = hrTeamValidations.validate({ manager_id, supervisor_id, team_name });
        if (error)
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message,
            });

        const createdBy = req.user.user_id;
        const teamMember = JSON.stringify({ team_member: members });
        const insertQuery = `INSERT INTO hr_teams (manager_id, supervisor_id, team_name, team_short_description, team_member, created_by) VALUES(?, ?, ?, ?, ?, ?)`;

        const queryResult = await db.query(insertQuery, [
            manager_id,
            supervisor_id,
            team_name,
            team_short_description,
            teamMember,
            createdBy,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: 'Team created successfully' });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: 'Something went wrong, please try again later' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

// const getAllHrTeamWithMember = async (req, res) => {
//     try {
//         const pageSize = req.query.pageSize || 10;
//         const currentPage = req.query.pageNo || 1;
//         const searchData = req.query.search || '';
//         const user_id = req.user.user_id;
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         var searchCondition = `WHERE hr_teams.created_by= '${user_id}'`;

//         if (searchData != null && searchData != '') {
//             searchCondition += ` AND (hr_teams.team_name LIKE '%${searchData}%' OR hr_teams.team_short_description LIKE '%${searchData}%' OR users.name LIKE '%${searchData}%') `;
//         }
//         var selectQuery = `SELECT hr_teams.id as team_id, hr_teams.team_name, hr_teams.team_short_description, hr_teams.team_member, hr_teams.created_by, hr_teams.manager_id, hr_teams.supervisor_id, users.name as manager_name, users.employee_id as manager_employee_id, users.image, users.user_type FROM hr_teams LEFT JOIN users ON users.id=hr_teams.manager_id ${searchCondition} ORDER BY team_id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

//         const queryResult = await promisify(db.query)(selectQuery);
//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf('ORDER BY'));
//         const totalResult = await db.query(modifiedQueryString);
//         if (queryResult.length > process.env.VALUE_ZERO) {
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
//             const values = [];
//             for (const element of queryResult) {
//                 const teamMember = await getTeamMemberOnId(element.team_member);
//                 const getSupervisorDetail = await getUserDetails(element.supervisor_id);
//                 const getUserTypeName = await roleById(element.user_type);
               
//                 values.push({
//                     team_id: element.team_id,
//                     team_name: element.team_name,
//                     team_short_description: element.team_short_description,
//                     manager_id: element.manager_id,
//                     manager_employee_id: element.manager_employee_id,
//                     manager_name: element.manager_name,
//                     manager_image: element.image,
//                     manager_role: getUserTypeName ? getUserTypeName.name : "",
//                     supervisor_id: getSupervisorDetail ? getSupervisorDetail[0].id : "",
//                     supervisor_name: getSupervisorDetail ? getSupervisorDetail[0].name : "",
//                     supervisor_image: getSupervisorDetail ? getSupervisorDetail[0].image : "",
//                     total_members: teamMember.length,
//                     members: teamMember,
//                 });
//             }
//             res.status(StatusCodes.OK).json({
//                 status: true,
//                 message: 'Fetched data successfully',
//                 data: values,
//                 pageDetails: pageDetails,
//             });
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
//         }
//     } catch (error) {
//         return res
//             .status(StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({ status: false, message: error.message });
//     }
// };


const getAllHrTeamWithMember = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const user_id = req.user.user_id;           // Logged-in user's ID
        const user_type = req.user.user_type;       // Logged-in user's type

        const pageFirstResult = (currentPage - 1) * pageSize;

        // Construct the search condition based on user type
        let searchCondition = '';
        if (user_type === 3) {
            searchCondition = ''; // Admin users see all teams, so no filtering by `created_by`
        } else {
            searchCondition = `WHERE hr_teams.created_by = '${user_id}'`;
        }

        // Add search filters if search data is present
        if (searchData) {
            searchCondition += `${searchCondition ? ' AND ' : ' WHERE '}
                (hr_teams.team_name LIKE '%${searchData}%'
                OR hr_teams.team_short_description LIKE '%${searchData}%'
                OR users.name LIKE '%${searchData}%')`;
        }

        // Main query with pagination and search
        const selectQuery = `
            SELECT hr_teams.id AS team_id, hr_teams.team_name, hr_teams.team_short_description,
                   hr_teams.team_member, hr_teams.created_by, hr_teams.manager_id, hr_teams.supervisor_id,
                   users.name AS manager_name, users.employee_id AS manager_employee_id, 
                   users.image, users.user_type
            FROM hr_teams
            LEFT JOIN users ON users.id = hr_teams.manager_id
            ${searchCondition}
            ORDER BY team_id DESC
            LIMIT ${pageFirstResult}, ${pageSize}`;

        // Execute main query
        const queryResult = await promisify(db.query)(selectQuery);

        // Count total results for pagination
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf('ORDER BY'));
        const totalResult = await db.query(modifiedQueryString);
        
        if (queryResult.length > 0) {
            // Calculate pagination details
            const pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            const values = [];

            for (const element of queryResult) {
                const teamMember = await getTeamMemberOnId(element.team_member);
                const getSupervisorDetail = await getUserDetails(element.supervisor_id);
                const getUserTypeName = await roleById(element.user_type);
                
                // Construct team data
                values.push({
                    team_id: element.team_id,
                    team_name: element.team_name,
                    team_short_description: element.team_short_description,
                    manager_id: element.manager_id,
                    manager_employee_id: element.manager_employee_id,
                    manager_name: element.manager_name,
                    manager_image: element.image,
                    manager_role: getUserTypeName ? getUserTypeName.name : "",
                    supervisor_id: getSupervisorDetail ? getSupervisorDetail[0].id : "",
                    supervisor_name: getSupervisorDetail ? getSupervisorDetail[0].name : "",
                    supervisor_image: getSupervisorDetail ? getSupervisorDetail[0].image : "",
                    total_members: teamMember.length,
                    members: teamMember,
                });
            }

            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched data successfully',
                data: values,
                pageDetails: pageDetails,
            });
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const getHrTeamDetailsById = async (req, res) => {
    try {
        const id = req.params.id;
        const search = req.query.search || '';
        const { error } = checkPositiveInteger.validate({ id });
        if (error)
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        var selectQuery = `SELECT hr_teams.id as team_id, hr_teams.team_name, hr_teams.team_short_description, hr_teams.team_member, hr_teams.created_by, hr_teams.manager_id, hr_teams.supervisor_id, users.name as manager_name,users.image, users.employee_id as manager_employee_id, users.user_type FROM hr_teams LEFT JOIN users ON users.id=hr_teams.manager_id  WHERE hr_teams.id = ?`;

        const queryResult = await db.query(selectQuery, [id]);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            for (const row of queryResult) {
                const teamMember = await getTeamMemberOnId(row.team_member, search);
                const getSupervisorDetail = await getUserDetails(row.supervisor_id);

                // push role name in team members
                if (teamMember.length > process.env.VALUE_ZERO) {
                    for (const row of teamMember) {
                        const getTeamMemberRole = await roleById(row.role_id);
                        row.role = getTeamMemberRole.name;
                    }
                }

                values.push({
                    team_id: row.team_id,
                    team_name: row.team_name,
                    team_short_description: row.team_short_description,
                    manager_id: row.manager_id,
                    manager_name: row.manager_name,
                    manager_image: row.image,
                    supervisor_id: getSupervisorDetail ? getSupervisorDetail[0].id : "",
                    supervisor_name: getSupervisorDetail ? getSupervisorDetail[0].name : "",
                    supervisor_image: getSupervisorDetail ? getSupervisorDetail[0].image : "",
                    supervisor_employee_id: getSupervisorDetail ? getSupervisorDetail[0].employee_id : "",
                    manager_employee_id: row.manager_employee_id ? row.manager_employee_id : "",
                    members: teamMember,
                });
            }

            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: values[0],
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const updateHrTeamDetails = async (req, res) => {
    try {
        const { team_name, team_short_description, manager_id, members, team_id, supervisor_id } = req.body;
        const { error } = hrTeamValidations.validate({ manager_id, team_name, supervisor_id });
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: error.message });

        const teamMember = JSON.stringify({ team_member: members });
        const updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const updateQuery = `UPDATE hr_teams SET manager_id=?, team_name=?, team_short_description=?, team_member=?, updated_at=? WHERE id=?`;
        const queryResult = await db.query(updateQuery, [
            manager_id,
            team_name,
            team_short_description,
            teamMember,
            updatedAt,
            team_id,
        ]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: 'Team updated successfully' });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: 'Something went wrong, please try again later.' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const deleteHrTeam = async (req, res) => {
    try {
        const team_id = req.params.team_id;
        const { error } = checkPositiveInteger.validate({ id: team_id });
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: error.message });

        const deleteQuery = `DELETE FROM hr_teams WHERE id=?`;
        const queryResult = await db.query(deleteQuery, [team_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: 'Team deleted successfully' });
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: 'Something went wrong, please try again later' });
        }
    } catch (error) {
        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
    }
};

const removeSpecificUserFromTeam = async (req, res) => {
    try {
        const { team_id, user_id } = req.body;
        const validationSchema = Joi.object({
            team_id: Joi.number().required(),
            user_id: Joi.number().required(),
        });
        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // get team members for remove specific member

        const getTeamMemberList = await db.query(
            'SELECT id, team_member FROM hr_teams WHERE id= ?',
            [team_id]
        );

        if (getTeamMemberList.length > process.env.VALUE_ZERO) {
            const teamDbData = getTeamMemberList[0];
            const teamDbMembers = teamDbData.team_member;
            const teamDbId = teamDbData.id;

            // Parse the JSON string into a JavaScript object
            const teamMemberList = JSON.parse(teamDbMembers);
            // Get the value associated with the "team_member" key and convert it to an array of numeric IDs
            const team_member_ids = teamMemberList.team_member.split(',').map(Number);
            const valueToRemove = parseInt(user_id);
            if(team_member_ids.length <= process.env.VALUE_ONE)
            {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Sorry! you can't delete the last member of team`,
                });
            }
            const updatedTeamMembers = team_member_ids.filter((member) => member !== valueToRemove);

            //Convert the modified JavaScript object back to a JSON string
            teamMemberList.team_member = updatedTeamMembers.join(',');
            const updatedJsonString = JSON.stringify(teamMemberList);

            // update team members with new members
            const updateQuery = await db.query('UPDATE hr_teams SET team_member = ? WHERE id = ?', [
                updatedJsonString,
                teamDbId,
            ]);

            if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'Team member removed successfully',
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: 'Error! Something went wrong, please try again later',
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'Invalid team member details.',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

const addNewMemberInTeam = async (req, res) => {
    try {
        const { team_id, user_id } = req.body;

        const validationSchema = Joi.object({
            team_id: Joi.number().required(),
            user_id: Joi.required(),
        });
        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // get team members to add new one
        const getTeamMemberList = await db.query(
            'SELECT id, team_member FROM hr_teams WHERE id= ?',
            [team_id]
        );
        if (getTeamMemberList.length > process.env.VALUE_ZERO) {
            const teamDbData = getTeamMemberList[0];
            const teamDbMembers = teamDbData.team_member;
            const teamDbId = teamDbData.id;

            // Parse the JSON string into a JavaScript object
            const teamMemberList = JSON.parse(teamDbMembers);
            // Get the value associated with the "team_member" key and convert it to an array of numeric IDs
            const team_member_ids = teamMemberList.team_member.split(',').map(Number);
            const valueToAdd = user_id; //JSON.parse(user_id);
            team_member_ids.push(...valueToAdd);

            //Convert the modified JavaScript object back to a JSON string
            teamMemberList.team_member = team_member_ids.join(',');
            const updatedJsonString = JSON.stringify(teamMemberList);

            // update team members with new members
            const updateQuery = await db.query('UPDATE hr_teams SET team_member = ? WHERE id = ?', [
                updatedJsonString,
                teamDbId,
            ]);

            if (updateQuery.affectedRows > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'Team member added successfully',
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: 'Error! Something went wrong, please try again later',
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'Invalid team member details.',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

const getMemberListToAddInTeam = async (req, res) => {
    try {
        const team_id = req.params.team_id;
        const { error } = checkPositiveInteger.validate({ id: team_id });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // get already added members from team
        const getTeamMemberList = await db.query(
            'SELECT id, team_member FROM hr_teams WHERE id= ?',
            [team_id]
        );

        if (getTeamMemberList.length > process.env.VALUE_ZERO) {
            const teamDbData = getTeamMemberList[0];
            const teamDbMembers = JSON.parse(teamDbData.team_member);
            const teamDbId = teamDbData.id;

            // get users which is not in that team already
            const sql = `SELECT id, name, image FROM users WHERE id NOT IN(${teamDbMembers.team_member})`;
            const queryResult = await db.query(sql);

            if (queryResult.length > process.env.VALUE_ZERO) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'New member found to add in team',
                    data: queryResult,
                });
            } else {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: 'New member not found to add in team',
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'Error! in loading, please try again later',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

const getMemberListWithoutTeam = async (req, res) => {

    try {
        var team_member_lists = [];
        const user_id = req.user.user_id;
        let combinedMembers;
        // get all teams and members
        const getTeamMemberList = await db.query('SELECT id, team_name, team_member FROM hr_teams WHERE created_by= ?', [user_id]);

        if (getTeamMemberList.length > process.env.VALUE_ZERO) 
        {
            for(const row of getTeamMemberList)
            {
                const teamDbData = row.team_member; // Assuming row.team_member is the JSON-encoded string
                const teamDbMembers = JSON.parse(teamDbData); // Parse the JSON-encoded string directly
                const members = teamDbMembers.team_member.split(',').map(member => member.trim()); // Split and clean up the member IDs
                team_member_lists.push(...members); // Push individual members into the array
            }
            // combinedMembers = team_member_lists.join(', '); // Join all the members with a comma and a space
            // combinedMembers = combinedMembers.slice(0, -2); // Remove the last two characters (comma and space)
            combinedMembers = team_member_lists.map(member => member.trim()).join(', ');
        }
       
        let membersQuery;
        if(combinedMembers != null)
        {
            membersQuery = `SELECT id, name, employee_id, email, mobile, joining_date, image, status, user_type, created_by FROM users WHERE (is_deleted = '0' AND created_by ='${user_id}') AND id NOT IN(${combinedMembers})`;
        }
        else
        {
            membersQuery = `SELECT id, name, employee_id, email, mobile, joining_date, image, status, user_type, created_by FROM users WHERE  (is_deleted = '0' AND created_by ='${user_id}')`;
        }
        
        const queryResult = await db.query(membersQuery);
        if(queryResult.length > process.env.VALUE_ZERO)
        {

            for (let result of queryResult) {

                if (result.employee_id) {
                    result.name = `${result.name} (${result.employee_id})`;
                }
            }
            
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Members fetched successfully",
                    data: queryResult
                });
        }
        else
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Members not found",
                });
        }
        
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

const getLoggedUserDetails = async(req, res) => {

    try {
        const loggedUserId = req.user.user_id;
        const loggedUserRoleId = req.user.user_type;
        var finalData = [];

        if(loggedUserRoleId == process.env.CONTRACTOR_ROLE_ID)
        {
            const getLoggedUserDetails = await db.query(`SELECT admins.id, admins.name, admins.employee_id, admins.image, roles.name as role_name FROM admins INNER JOIN roles ON roles.id = admins.user_type WHERE admins.id = ?`, [loggedUserId]);

            if(getLoggedUserDetails.length > process.env.VALUE_ZERO)
            {
                for(const row of getLoggedUserDetails)
                {
                    row['level'] = 1;
                }
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: true,
                        message: "Members fetched successfully",
                        data: getLoggedUserDetails[0]
                    });
            }
            else
            {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: false,
                        message: 'You are not authorized to perform this action',
                    });
            }
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: 'You are not authorized to perform this action',
            });
        }
    } catch (error) {
        
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }

}

const getUsersOnRoleId = async (req, res) => {

    try {
        const role_id = req.params.role_id || '';
        let usersFinalData = [];

        const {error} = checkPositiveInteger.validate({id: role_id});

        if(error)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        // get users on roles 
            const usersDetailsOnRoleId = await db.query(`SELECT users.id, users.name, users.employee_id, users.image, roles.name as role_name FROM users INNER JOIN roles ON roles.id = users.user_type WHERE users.user_type = ?`, [role_id]);
            
            if(usersDetailsOnRoleId.length > process.env.VALUE_ZERO)
            {
                for(const row of usersDetailsOnRoleId)
                {
                    usersFinalData.push({
                            id: row.id,
                            name: row.name,
                            employee_id: row.employee_id,
                            image: row.image,
                            role_name: row.role_name
                    });
                }

                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: true,
                        message: "Members fetched successfully",
                        data: usersFinalData
                    });
            }
            else
            {
                return res
                    .status(StatusCodes.OK)
                    .json({
                        status: false,
                        message: "Members not found",
                    });
            }
       
    } catch (error) {
        
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
}

const saveUserHierarchyLevel = async(req, res) => {

    try {
        return console.log(req.body);
        
    } catch (error) {
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message,
            });
    }
}

module.exports = {
    createHrTeam,
    getAllHrTeamWithMember,
    getHrTeamDetailsById,
    updateHrTeamDetails,
    deleteHrTeam,
    removeSpecificUserFromTeam,
    addNewMemberInTeam,
    getMemberListToAddInTeam,
    getMemberListWithoutTeam,
    getLoggedUserDetails,
    getUsersOnRoleId,
    saveUserHierarchyLevel
};
