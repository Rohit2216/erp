const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require("dotenv").config();
const { con, makeDb } = require("../db");
const { loginValidation, checkPositiveInteger, adminCreateValidation, changePasswordValidations} = require("../helpers/validation");
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const { promisify } = require('util');
var moment = require('moment');


const  adminLogin = async (req, res) => {

    try 
    {
        const {email, password} = req.body;
        const {error} = loginValidation.validate(req.body);
        if(error) return res.status(400).json({status: false, message:error.message})

        const selectQuery = `SELECT * FROM admins WHERE email = '${email}'`;

        db.query(selectQuery, async(err, result) => {
            
            if(err) return res.status(500).json({status: false, message: err.message});
            
            if(result.length > process.env.VALUE_ZERO)
            {
                if(result[0].status == process.env.INACTIVE_STATUS)
                {
                    return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Your account is not verified yet, please wait for verify"})
                } 
                else if(result[0].status === process.env.ACCOUNT_SUSPENDED)
                {
                    return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Your account is suspended, please contact with super administrator"})
                }

                if(result[0].is_deleted === process.env.ACTIVE_STATUS)
                {
                    return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Your account is deleted with us"})
                }
                const isCorrectPassword = await bcrypt.compare(password, result[0].password);
                if(isCorrectPassword)
                {
                    const token = jwt.sign({user_id: result[0].id, user_type: result[0].user_type}, process.env.JWT_SECRET_KEY, {expiresIn: '30d'});
                    return res.status(200).json({status: true, message: "Login Successful", data: result[0], token: token});
                }
                else
                {
                    return res.status(400).json({status: false, message: "Wrong Credentials"})
                }
            }
            else
            {
                return res.status(400).json({status: false, message: "Email invalid"})
            }
        })

    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getAdminProfileDetails = async(req, res) => {

    try 
    {
        const loggedUserId = req.user.user_id;
        const {error} = checkPositiveInteger.validate({id: loggedUserId})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const sql = `SELECT admins.name, admins.email, admins.contact_no, admins.alt_number, admins.address_1, admins.status, admins.country, admins.city, admins.pin_code, admins.image, admins.description, admins.gst_number, admins.fb_url, admins.inst_url, admins.twitter_url, admins.linkedin_url, roles.name AS role FROM admins INNER JOIN roles ON roles.id = admins.user_type WHERE admins.id = ?`
        
        const sqlResult = await db.query(sql, [loggedUserId])

        if(sqlResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: 'success', data: sqlResult[0]});
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({
                status:false,
                message: 'Details not found.'
            })
        }
    } 
    catch (error) 
    {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        })    
    }
}

const updateAdminProfile = async(req, res) => {

    try 
    {
       const {name, email, contact_no, alt_number, address_1, status, country, city, pin_code, image, description, gst_number, fb_url, inst_url, twitter_url, linkedin_url} = req.body

       //dummy password for form validation
        const password = 'jh67b37';

       const {error} = adminCreateValidation.validate({email: req.body.email, password: password, contact_no: req.body.contact_no})
        if(error) return res.status(400).json({status: false, message: error.message})

        const loggedUserId = req.user.user_id;
        var storePath = ''
        const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;

            image.mv(uploadPath, (error, response) => {
                if(error) return res.status(403).json({status:false, message: error.message});

            })
        }
        else
        {
            storePath = image
        }

        const updateQuery = ` name = ?, email = ?, contact_no = ?, alt_number = ?, address_1 = ?, status = ?, country = ?, city = ?, pin_code = ?, image = ?, description = ?, gst_number = ?, fb_url = ?, inst_url = ?, twitter_url = ?, linkedin_url = ?, updated_at = ? WHERE id= ?`

        const queryResult = await db.query(updateQuery, [name, email, contact_no, alt_number, address_1, status, country, city, pin_code, storePath, description, gst_number, fb_url, inst_url, twitter_url, linkedin_url, updatedAt, loggedUserId])
       
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Profile details updated successfully"})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Error! Profile details not updated"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message}) 
    }
}

const adminChangePassword = async(req, res) => {

    try 
    {
        const{old_password, new_password, confirm_password} = req.body
        const {error} = changePasswordValidations.validate(req.body)
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const loggedUserId = req.user.user_id;

        const getLoggedUserPassword = `SELECT password FROM admins WHERE id= ?`
        const loggedUserPasswordResult = await db.query(getLoggedUserPassword, [loggedUserId])
        
        if(loggedUserPasswordResult.length > process.env.VALUE_ZERO)
        {
            const isCorrectPassword = await bcrypt.compare(old_password, loggedUserPasswordResult[0].password)
            if(isCorrectPassword)
            {
                if(new_password == confirm_password)
                {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = await bcrypt.hash(new_password, salt);
                    const updateQuery = `UPDATE admins SET password= ? WHERE id=?`
                    const updateResult = await db.query(updateQuery, [hashPassword, loggedUserId])

                    if(updateResult.affectedRows > process.env.VALUE_ZERO)
                    {
                        res.status(StatusCodesOk).json({status: true, message: "Password changed successfully"})
                    }
                    else
                    {
                        res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Error! password not updated"})
                    }
                }
                else
                {
                    return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Confirm password is not equal to new password."})
                }
            }
            else
            {
                return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Old password is wrong"})
            }
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Internal server error"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}


module.exports = {adminLogin, getAdminProfileDetails, updateAdminProfile, adminChangePassword}