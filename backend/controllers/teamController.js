var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { subUserFormValidation, teamValidations, checkPositiveInteger} = require('../helpers/validation');
const { getTeamMemberList } = require('../helpers/general');

const createTeam = async (req, res, next) => {
   
    try 
    {
        const {team_head, team_name, team_short_description, name, email, password, joining_date} = req.body;
        const {error} = teamValidations.validate(req.body);
        if(error) return res.status(400).json({status: false, message: error.message})

        const {error: userError} = subUserFormValidation.validate(req.body);
        if(userError) return res.status(400).json({status: false, message: userError.message})

        const user_id = team_head;
        const createdBy = req.user.user_id;
        const user_type = process.env.SUB_USER_ROLE_ID
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        var storePath = '';

        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, (err, response) => {

                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }

        const insertUserQuery = `INSERT INTO users (name, username, email, password, joining_date, image, user_type, admin_id, user_id, created_by) VALUES('${name}', '${email}', '${name}','${hashPassword}', '${joining_date}', '${storePath}', '${user_type}', '${createdBy}', '${user_id}', '${createdBy}')`;

        db.query(insertUserQuery, (err, result) => {
            if(err) return res.status(500).json({status: false, message:err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const userInsertId = result.insertId;
                const insertTeamQuery = `INSERT INTO teams (user_id, team_name, team_short_description, parent_id, child_id, created_by) VALUES('${userInsertId}', '${team_name}', '${team_short_description}', '${user_id}', '${userInsertId}', '${createdBy}')`;

                db.query(insertTeamQuery, (err, result) => {
                    if(err) return res.status(500).json({status: false, message:err});

                    if(result.affectedRows > process.env.VALUE_ZERO)
                    {
                        return res.status(200).json({status: true, message: 'Team created successfully',});
                    }
                    else
                    {
                        return res.status(403).json({status: false, message: 'Something went wrong, please try again later'});
                    }
                })
                
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'});
            }
        });

    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})
    }
}


const getParentTeamHead = async (req, res, next) => {

    try 
    {
        const selectQuery = `SELECT users.id as team_head_id, users.name as team_head_name FROM users INNER JOIN teams ON teams.user_id = users.id;`
        
        db.query(selectQuery, (err, result) => {
            if(err) return res.status(500).json({status: false, message:err});
            if(result.length > process.env.VALUE_ZERO)
            {
                return res.status(200).json({status: true, message: "Team head fetched successfully", data: result});
            }
            else
            {
                return res.status(403).json({status: false, message: 'No team head found'});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getTeamDetailsById = async (req, res, next) => {

    try 
    {
        const team_id = req.params.id;
        const {error} = checkPositiveInteger.validate({id: team_id});
        if(error) return res.status(400).json({status: false, message: error.message})

        const selectQuery = `SELECT * FROM teams WHERE teams.id = '${team_id}'`

        db.query(selectQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message:err});

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Team fetched successfully", data: result[0]});
            }
            else
            {
                return res.status(403).json({status: false, message: 'No team found'});
            }
        });
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const updateTeamDetails = async (req, res, next) => {

    try 
    {
        const team_id = req.body.team_id;
        const {error} = checkPositiveInteger.validate({id: team_id});
        if (error) return res.status(400).json({status: false, message:error.message})
        
        const {team_name, team_short_description, team_head} = req.body;
        const {error: teamError} = teamValidations.validate(req.body);
        if(teamError) return res.status(400).json({status: false, message: teamError.message})

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateQuery = `UPDATE teams SET team_name = '${team_name}', team_short_description = '${team_short_description}', parent_id = '${team_head}', updated_at='${updatedAt}' WHERE id='${team_id}'`;

        db.query(updateQuery, (err, result) => {
            if(err) return res.status(500).json({status: false, message:err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Team updated successfully"});
            }
            else
            {
                return res.status(403).json({status: false, message: 'Something went wrong, please try again later'});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getTeamGroup = async (req, res) => {

    try 
    {
        const loggedUserId = req.user.user_id
        
        const getAllTeamHead = `SELECT users.name as team_head_name, teams.team_name, teams.team_short_description, COUNT(teams.parent_id) as number_of_member, teams.parent_id, teams.user_id FROM users INNER JOIN teams ON teams.parent_id = users.id GROUP BY team_head_name`


        db.query(getAllTeamHead, async (err, result) => {
            
            if(err) return res.status(500).json({status: false, message: err});
            
            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map(async (element)=>{
                    return {...element,
                        member_name: await getTeamMemberList(element.parent_id)
                    };
                })
                Promise.all(final).then((values) => {
                    return res.status(200).json({ status: true, data:values });
                });
            }
            else
            {
                return res.status(403).json({status: false, message: 'No team found'});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}




module.exports = {createTeam, getParentTeamHead, getTeamDetailsById, updateTeamDetails, getTeamGroup}