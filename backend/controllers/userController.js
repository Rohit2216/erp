require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger, userCreateValidations, loginValidation } = require("../helpers/validation");
const { roleById, getUserDetails, calculatePagination } = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const { insertEmployeeActivityLog } = require("../helpers/activityLog");
const requestIp = require('request-ip')
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var Buffer = require('buffer/').Buffer
const Joi = require("joi");
const { generatePanelIdForUser, generateSuperAdminEmpId } = require('../helpers/panelHelper');

const createUsers = async (req, res) => {

    try {

        var response = '';
        var logRoleId = 0
        var logUserId = 0
        var team_id_val = 0;

        const { name, email, password, mobile, joining_date, status, role_id, address, graduation, post_graduation, doctorate, skills, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, family_info, salary, salary_term, dob, team_id, credit_limit, geofencing, location_id } = req.body


        if (team_id != "undefined") {
            team_id_val = req.body.team_id;
        }

        const { error } = userCreateValidations.validate({ name: name, joining_date: joining_date, salary: salary, mobile: mobile, })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const checkUniqu = await checkUnique(email, pan, aadhar, mobile)

        if (checkUniqu.status == false) {
            return res.status(StatusCodes.OK).json({ status: false, message: `${checkUniqu.data} has been already exist` })
        }

        const createdBy = req.user.user_id;
        var storePath = '';
        var graduationStorePath = '';
        var postGraduationStorePath = '';
        var doctorateStorePath = '';
        var panCardStorePath = ''
        var aadharCard1StorePath = '';
        var aadharCard2StorePath = '';
        var bankDocumentsStorePath = '';

        response = "Trying to create user";

        if (req.files != null) {

            //upload image
            if (req.files.image != null) {
                const image = req.files.image
                const imageName = Date.now() + image.name
                const uploadPath = process.cwd() + '/public/user_images/' + imageName;
                storePath = '/user_images/' + imageName;

                image.mv(uploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })

            }

            if (req.files.graduation != null) {
                const graduation = req.files.graduation
                const graduationImageName = Date.now() + graduation.name
                const graduationUploadPath = process.cwd() + '/public/user_images/' + graduationImageName;
                graduationStorePath = '/user_images/' + graduationImageName;

                graduation.mv(graduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            if (req.files.post_graduation != null) {

                const post_graduation = req.files.post_graduation
                const postGraduationImageName = Date.now() + post_graduation.name
                const postGraduationUploadPath = process.cwd() + '/public/user_images/' + postGraduationImageName;
                postGraduationStorePath = '/user_images/' + postGraduationImageName;

                post_graduation.mv(postGraduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            if (req.files.doctorate != null) {
                const doctorate = req.files.doctorate
                const doctorateImageName = Date.now() + doctorate.name
                const doctorateUploadPath = process.cwd() + '/public/user_images/' + doctorateImageName;
                doctorateStorePath = '/user_images/' + doctorateImageName

                doctorate.mv(doctorateUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            //pan card image upload
            if (req.files.upload_pan_card != null) {
                const pan_card = req.files.upload_pan_card;
                const panCardName = Date.now() + pan_card.name
                const panCardUploadPath = process.cwd() + '/public/user_images/' + panCardName
                panCardStorePath = '/user_images/' + panCardName;

                pan_card.mv(panCardUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            //Aadhar card image upload
            if (req.files.upload_aadhar_card_image1 != null) {

                const aadharCard1 = req.files.upload_aadhar_card_image1
                const aadharCard1Name = Date.now() + aadharCard1.name
                const aadharCard1dUploadPath = process.cwd() + '/public/user_images/' + aadharCard1Name
                aadharCard1StorePath = '/user_images/' + aadharCard1Name;

                aadharCard1.mv(aadharCard1dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }


            if (req.files.upload_aadhar_card_image2 != null) {
                const aadharCard2 = req.files.upload_aadhar_card_image2
                const aadharCard2Name = Date.now() + aadharCard2.name
                const aadharCard2dUploadPath = process.cwd() + '/public/user_images/' + aadharCard2Name
                aadharCard2StorePath = '/user_images/' + aadharCard2Name;

                aadharCard2.mv(aadharCard2dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            //upload bank documents
            if (req.files.upload_bank_documents != null) {

                const bankDocuments = req.files.upload_bank_documents
                const bankDocumentsName = Date.now() + bankDocuments.name
                const bankDocumentsUploadPath = process.cwd() + '/public/user_images/' + bankDocumentsName
                bankDocumentsStorePath = '/user_images/' + bankDocumentsName;

                bankDocuments.mv(bankDocumentsUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            response = "Error in upload user images"
        }

        const getRoleOnId = await roleById(role_id)
        const userType = getRoleOnId.role
        logRoleId = role_id
        const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
        var employee_id = "";
        if (req.user.user_type == "1" || req.user.user_type == "3") {
            employee_id = await generateSuperAdminEmpId();
        }


        let manager_id = null;
        let supervisor_id = null;


        if (role_id == 40) {
            manager_id = team_id;
        } else if (role_id == 7) {
            supervisor_id = team_id;
        }


        const insertQuery = `INSERT INTO users(name, username, email, password, mobile, joining_date, image, status, role_id, user_type, created_by, address, graduation, post_graduation, doctorate, skills, team_id, employment_status, pan, pan_card_image, aadhar, aadhar_card_front_image, aadhar_card_back_image, epf_no, esi_no, bank_name, ifsc_code, account_number, bank_documents, department, family_info, panel_id, manager_id, supervisor_id, employee_id, dob, credit_limit, precise_location, locationId) VAlUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const pass = password ? password : '12345678';
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(pass, salt);

        // return 
        const queryResult = await db.query(insertQuery, [name, name, email, hashPassword, mobile, joining_date, storePath, status, role_id, role_id, createdBy, address, graduationStorePath, postGraduationStorePath, doctorateStorePath, skills, team_id_val, employment_status, pan, panCardStorePath, aadhar, aadharCard1StorePath, aadharCard2StorePath, epf_no, esi_no, bank_name, ifsc_code, account_number, bankDocumentsStorePath, department, family_info, panel_id, manager_id, supervisor_id, employee_id, dob, credit_limit, geofencing, location_id])

        // Determine manager_id or supervisor_id based on role_id

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            logUserId = queryResult.insertId

            //salary generated from
            const salaryInsert = `INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by) VALUES(?, ?, ?, ?, ?, ?)`
            const salaryValues = [logUserId, role_id, joining_date, salary, salary_term, createdBy]

            const salaryQueryResult = await db.query(salaryInsert, salaryValues);


            response = "User created successfully"
            res.status(StatusCodes.OK).json({ status: true, message: response })
        }
        else {
            response = "Something went wrong, please try again later"
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response })
        }

    } catch (error) {
        response = error.message
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response })
    }

    const logData = [{
        userId: logUserId,
        roleId: logRoleId,
        timestamp: moment().unix(),
        action: 'createUsers method of userController ',
        ipAddress: requestIp.getClientIp(req),
        userAgent: req.useragent.source,
        logResult: response
    }]

    const userActivityLog = await insertEmployeeActivityLog(logData)
}


async function checkUnique(email, pan, aadhar, mobile) {
    try {
        let nonUniqueFields = [];

        // Check email uniqueness
        let emailQuery = `SELECT email FROM users WHERE email = ?`;
        let emailRows = await db.query(emailQuery, [email]);
        if (emailRows.length > 0) {
            nonUniqueFields.push("Email");
        }

        // Check mobile uniqueness
        let mobileQuery = `SELECT mobile FROM users WHERE mobile = ?`;
        let mobileRows = await db.query(mobileQuery, [mobile]);
        if (mobileRows.length > 0) {
            nonUniqueFields.push("Mobile");
        }

        // Check aadhar uniqueness
        let aadharQuery = `SELECT aadhar FROM users WHERE aadhar = ?`;
        let aadharRows = await db.query(aadharQuery, [aadhar]);
        if (aadharRows.length > 0) {
            nonUniqueFields.push("Aadhar Card");
        }

        // Check pan uniqueness (if provided)
        if (pan) {
            let panQuery = `SELECT pan FROM users WHERE pan = ?`;
            let panRows = await db.query(panQuery, [pan]);
            if (panRows.length > 0) {
                nonUniqueFields.push("PAN");
            }
        }

        let dataResult = { status: nonUniqueFields.length === 0, data: nonUniqueFields };

        return dataResult;
    } catch (err) {
        throw err;
    }
}


const updateUsers = async (req, res) => {

    try {

        var response = '';
        var logRoleId = 0
        var logUserId = 0
        var team_id_val = 0;

        const { name, email, password, mobile, joining_date, status, role_id, address, graduation, post_graduation, doctorate, skills, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, family_info, team_id, employee_id, image, upload_pan_card, upload_aadhar_card_image1, salary, salary_term, upload_aadhar_card_image2, upload_bank_documents, dob, credit_limit, geofencing, location_id } = req.body;



        if (team_id != "undefined") {
            team_id_val = req.body.team_id;
        }

        const { error } = userCreateValidations.validate({ name: name, joining_date: joining_date, salary: salary, mobile: mobile, })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const createdBy = req.user.user_id
        var storePath = '';
        var graduationStorePath = '';
        var postGraduationStorePath = '';
        var doctorateStorePath = '';
        var panCardStorePath = '';
        var aadharCard1StorePath = '';
        var aadharCard2StorePath = '';
        var bankDocumentsStorePath = '';

        response = "Trying to create user";

        if (req.files != null) {
            //upload image
            if (req.files.image != null) {
                const image = req.files.image
                const imageName = Date.now() + image.name
                const uploadPath = process.cwd() + '/public/user_images/' + imageName;
                storePath = '/user_images/' + imageName;

                image.mv(uploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })

            }

            if (req.files.graduation != null) {
                const graduation = req.files.graduation
                const graduationImageName = Date.now() + graduation.name
                const graduationUploadPath = process.cwd() + '/public/user_images/' + graduationImageName;
                graduationStorePath = '/user_images/' + graduationImageName;

                graduation.mv(graduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            if (req.files.post_graduation != null) {

                const post_graduation = req.files.post_graduation
                const postGraduationImageName = Date.now() + post_graduation.name
                const postGraduationUploadPath = process.cwd() + '/public/user_images/' + postGraduationImageName;
                postGraduationStorePath = '/user_images/' + postGraduationImageName;

                post_graduation.mv(postGraduationUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            if (req.files.doctorate != null) {
                const doctorate = req.files.doctorate
                const doctorateImageName = Date.now() + doctorate.name
                const doctorateUploadPath = process.cwd() + '/public/user_images/' + doctorateImageName;
                doctorateStorePath = '/user_images/' + doctorateImageName

                doctorate.mv(doctorateUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            //pan card image upload
            if (req.files.upload_pan_card != null) {
                const pan_card = req.files.upload_pan_card;
                const panCardName = Date.now() + pan_card.name
                const panCardUploadPath = process.cwd() + '/public/user_images/' + panCardName
                panCardStorePath = '/user_images/' + panCardName;

                pan_card.mv(panCardUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            //Aadhar card image upload
            if (req.files.upload_aadhar_card_image1 != null) {

                const aadharCard1 = req.files.upload_aadhar_card_image1
                const aadharCard1Name = Date.now() + aadharCard1.name
                const aadharCard1dUploadPath = process.cwd() + '/public/user_images/' + aadharCard1Name
                aadharCard1StorePath = '/user_images/' + aadharCard1Name;

                aadharCard1.mv(aadharCard1dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }


            if (req.files.upload_aadhar_card_image2 != null) {
                const aadharCard2 = req.files.upload_aadhar_card_image2
                const aadharCard2Name = Date.now() + aadharCard2.name
                const aadharCard2dUploadPath = process.cwd() + '/public/user_images/' + aadharCard2Name
                aadharCard2StorePath = '/user_images/' + aadharCard2Name;

                aadharCard2.mv(aadharCard2dUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            //upload bank documents
            if (req.files.upload_bank_documents != null) {

                const bankDocuments = req.files.upload_bank_documents
                const bankDocumentsName = Date.now() + bankDocuments.name
                const bankDocumentsUploadPath = process.cwd() + '/public/user_images/' + bankDocumentsName
                bankDocumentsStorePath = '/user_images/' + bankDocumentsName;

                bankDocuments.mv(bankDocumentsUploadPath, async (err, response) => {
                    if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                })
            }

            response = "Error in upload user images"
        }
        else {
            storePath = image;
            graduationStorePath = graduation;
            postGraduationStorePath = post_graduation;
            doctorateStorePath = doctorate;
            panCardStorePath = upload_pan_card,
                aadharCard1StorePath = upload_aadhar_card_image1;
            aadharCard2StorePath = upload_aadhar_card_image2;
            bankDocumentsStorePath = upload_bank_documents;
        }

        const getRoleOnId = await roleById(role_id)
        const userType = getRoleOnId.role
        logRoleId = role_id
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        let manager_id = null;
        let supervisor_id = null;

        if (role_id == 40) {
            manager_id = team_id;
        } else if (role_id == 7) {
            supervisor_id = team_id;
        }


        // let updateQuery = `UPDATE users SET name = ?, username = ?, email = ?, mobile = ?, joining_date = ?, image = ?, status = ?, role_id = ?, user_type = ?, created_by = ?, address = ?, graduation = ?, post_graduation = ?, doctorate = ?, skills = ?, team_id = ?, employment_status = ?, pan = ?, pan_card_image = ?, aadhar = ?, aadhar_card_front_image = ?, aadhar_card_back_image = ?, epf_no = ?, esi_no = ?, bank_name = ?, ifsc_code = ?, account_number = ?, bank_documents = ?, department = ?, family_info = ?, dob = ?, updated_at = ?, manager_id = ?, supervisor_id = ?, credit_limit = ?, precise_location = ?, locationId = ?,`;
        // const values = [
        //     name,
        //     name,
        //     email,
        //     mobile,
        //     joining_date,
        //     storePath,
        //     status,
        //     role_id,
        //     role_id,
        //     createdBy,
        //     address,
        //     graduationStorePath,
        //     postGraduationStorePath,
        //     doctorateStorePath,
        //     skills,
        //     team_id_val,
        //     employment_status,
        //     pan,
        //     panCardStorePath,
        //     aadhar,
        //     aadharCard1StorePath,
        //     aadharCard2StorePath,
        //     epf_no,
        //     esi_no,
        //     bank_name,
        //     ifsc_code,
        //     account_number,
        //     bankDocumentsStorePath,
        //     department,
        //     family_info,
        //     dob,
        //     updatedAt,
        //     manager_id,
        //     supervisor_id,
        //     credit_limit,
        //     geofencing,
        //     location_id
        // ];

        // if (password) {
        //     const salt = bcrypt.genSaltSync(10);
        //     const hashPassword = await bcrypt.hash(password, salt);
        //     updateQuery += `, password = ?`;
        //     values.push(hashPassword);
        // }

        // updateQuery += ` WHERE id = ?`;
        // values.push(employee_id);

        // const queryResult = await db.query(updateQuery, values);
        let updateQuery = `
        UPDATE users SET 
        name = ?, username = ?, email = ?, mobile = ?, 
        joining_date = ?, image = ?, status = ?, role_id = ?, 
        user_type = ?, created_by = ?, address = ?, graduation = ?, 
        post_graduation = ?, doctorate = ?, skills = ?, team_id = ?, 
        employment_status = ?, pan = ?, pan_card_image = ?, aadhar = ?, 
        aadhar_card_front_image = ?, aadhar_card_back_image = ?, epf_no = ?, 
        esi_no = ?, bank_name = ?, ifsc_code = ?, account_number = ?, 
        bank_documents = ?, department = ?, family_info = ?, dob = ?, 
        updated_at = ?, manager_id = ?, supervisor_id = ?, credit_limit = ?, 
        precise_location = ?, locationId = ?`;
        const values = [
            name,
            name,
            email,
            mobile,
            joining_date,
            storePath,
            status,
            role_id,
            role_id,
            createdBy,
            address,
            graduationStorePath,
            postGraduationStorePath,
            doctorateStorePath,
            skills,
            team_id_val,
            employment_status,
            pan,
            panCardStorePath,
            aadhar,
            aadharCard1StorePath,
            aadharCard2StorePath,
            epf_no,
            esi_no,
            bank_name,
            ifsc_code,
            account_number,
            bankDocumentsStorePath,
            department,
            family_info,
            dob,
            updatedAt,
            manager_id,
            supervisor_id,
            credit_limit,
            geofencing,
            location_id,
        ];

        // Append password if provided
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(password, salt);
            updateQuery += `, password = ?`;
            values.push(hashPassword);
        }

        // Finalize the query
        updateQuery += ` WHERE id = ?`;
        values.push(employee_id);

        const queryResult = await db.query(updateQuery, values);



        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            //salary generated from
            const salaryInsert = `UPDATE salaries SET user_type='${role_id}',date_of_hire='${joining_date}',salary='${salary}',salary_term='${salary_term}' WHERE user_id="${employee_id}"`;
            await db.query(salaryInsert);

            logUserId = employee_id
            response = "User updated successfully"
            res.status(StatusCodes.OK).json({ status: true, message: response })
        }
        else {
            response = "Something went wrong, please try again later"
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response })
        }

    } catch (error) {
        console.error(error)
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }

    const logData = [{
        userId: logUserId,
        roleId: logRoleId,
        timestamp: moment().unix(),
        action: 'updateUsers method of userController ',
        ipAddress: requestIp.getClientIp(req),
        userAgent: req.useragent.source,
        logResult: response
    }]

    const userActivityLog = await insertEmployeeActivityLog(logData)
}


const getAllManagerUsers = async (req, res) => {

    try {
        const managerRoleId = process.env.MANAGER_ROLE_ID
        const selectQuery = `SELECT * FROM users WHERE user_type = ?`
        const queryResult = await db.query(selectQuery, [managerRoleId])
        if (queryResult.length > 0) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getEmployeeDocumentsById = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id })

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const selectQuery = `SELECT graduation, post_graduation, doctorate, pan, pan_card_image, aadhar, aadhar_card_front_image, aadhar_card_back_image FROM users WHERE id = ?`
        const queryResult = await db.query(selectQuery, [id])

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Documents not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getEmployeeLoginDetailsById = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id })

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const selectQuery = `SELECT id, name, email, password, base_64_password, mobile FROM users WHERE id = ?`
        const queryResult = await db.query(selectQuery, [id])

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const sendLoginCredentialsViaEmail = async (req, res) => {

    try {
        const { email, password, id } = req.body;
        const { error } = loginValidation.validate(req.body)

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, error: error.message })

        const selectQuery = `SELECT id, name, email, password, base_64_password, mobile FROM users WHERE id = ?`
        const queryResult = await db.query(selectQuery, [id])
        const name = queryResult[0].name

        //password convert in to base64
        const decodedData = Buffer.from(password, 'base64').toString('utf8');
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'mail.sartiaglobal.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'devtest@sartiaglobal.com',
                pass: 'LXpC5mfC9A.-'
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Sartia Dev" <devtest@sartiaglobal.com>', // sender address
            to: email, // list of receivers
            subject: 'Your login credentials', // Subject line
            // text: 'Hello world?', // plain text body
            html: '<h3><b>Hello, ' + name + '</b><h3><br><h5>Here is your login credentials</h5><br><p><b>Email:</b> ' + email + ' </p><p><b>password:</b> ' + decodedData + ' </p>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Login credentials send successfully" })
        });


    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const sendLoginCredentialsViaWhatsApp = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id })

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, error: error.message })

        const selectQuery = `SELECT id, name, email, password, base_64_password, mobile FROM users WHERE id = ?`
        const queryResult = await db.query(selectQuery, [id])
        const name = queryResult[0].name
        const email = queryResult[0].email
        const password = queryResult[0].password
        const mobileNumber = queryResult[0].mobile

        //password convert in to base64
        const decodedPassword = Buffer.from(password, 'base64').toString('utf8');
        const textMessage = "Hello, " + name + " Here is your login credentials, Email: " + email + " Password: " + decodedPassword
        const encodedText = JSON.stringify(textMessage);

        if (mobileNumber != '' && mobileNumber != undefined) {
            const whatsAppLink = 'https://wa.me/' + mobileNumber + '?text=' + textMessage;
            res.status(StatusCodes.OK).json({ status: true, message: "WhatsApp link ready to share with employee", link: whatsAppLink })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Message user has no mobile number." })
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const changeUserStatus = async (req, res) => {

    try {
        const { status, id, remark, updated_by } = req.body;
        const statusValidation = Joi.object({
            status: Joi.number().required(),
            id: Joi.number().required(),
            remark: Joi.string().required(),
            updated_by: Joi.number().required(),
        })

        const { error } = statusValidation.validate(req.body)
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })
        const updateQuery = `UPDATE users SET status = ? WHERE id = ?`
        const queryResult = await db.query(updateQuery, [status, id]);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {

            var insertQuery = `INSERT INTO user_status_timeline(user_id, remark, updated_status, updated_by) VALUES ('${id}','${remark}','${status}','${updated_by}')`;
            await db.query(insertQuery);

            res.status(StatusCodes.OK).json({ status: true, message: "Status changed successfully" })
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Error! Status not changed" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getUsersByRoleId = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.OK).json({ status: false, message: error.message });

        const selectQuery = `SELECT id as user_id, name as user_name FROM users where user_type = ?`
        const queryResult = await db.query(selectQuery, [id])

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult })
        }
        else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getAdminsByRoleId = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT id as admin_id, name as admin_name FROM admins where user_type = ?`
        const queryResult = await db.query(selectQuery, [id])

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            for (const row of queryResult) {
                values.push({
                    admin_id: row.admin_id,
                    admin_name: row.admin_name,
                })
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getUsersByAdminId = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const selectQuery = `SELECT id as user_id, name as user_name FROM users where admin_id = ?`
        const queryResult = await db.query(selectQuery, [id])

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            for (const row of queryResult) {
                values.push({
                    user_id: row.user_id,
                    user_name: row.user_name,
                })
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getAllUsers = async (req, res) => {

    try {
        const selectQuery = `SELECT id, name, image, employee_id FROM users WHERE is_deleted = ?`
        const queryResult = await db.query(selectQuery, [process.env.NOT_DELETED])
        if (queryResult.length > process.env.VALUE_ZERO) {

            for (const row of queryResult) {
                if (row.employee_id) {
                    row.name = `${row.name} (${row.employee_id})`;
                }
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Users not found" });
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const getUserById = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id })
        if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })

        const selectQuery = `SELECT id, name, email, image, mobile, user_type, employee_id FROM users WHERE id = ?`
        const queryResult = await db.query(selectQuery, [id])

        if (queryResult.length > process.env.VALUE_ZERO) {
            var values = [];
            for (const row of queryResult) {
                const getRoleName = await roleById(row.user_type);
                values.push({
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    image: row.image,
                    mobile: row.mobile,
                    role_name: getRoleName.name,
                    employee_id: row.employee_id,
                })
            }

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values[0] });
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Users not found" });
        }

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const userStatusTimeLine = async (req, res) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT user_status_timeline.* , users.name as updated_by_name
        FROM user_status_timeline
        LEFT JOIN users ON user_status_timeline.user_id = users.id
        WHERE user_status_timeline.user_id='${id}';`;
        const timeline_list = await db.query(selectQuery);
        if (timeline_list.length > 0) {
            return res.status(200).json({ status: true, data: timeline_list, message: "Record found" });
        } else {
            return res.status(400).json({ status: true, data: timeline_list, message: "No record found" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const getEndUserManagerAndSupervisor = async (req, res) => {

    try {

        const userId = req.params.userId;
        const { error } = checkPositiveInteger.validate({ id: userId });

        if (error) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const getEndUserDetails = await getUserDetails(userId);

        if (getEndUserDetails.length > 0) {

            var finalData = {};
            const supervisorId = getEndUserDetails[0].supervisor_id;
            if (supervisorId) {
                // get end user supervisor details
                const getEndUserSupervisorDetails = await getUserDetails(supervisorId);

                if (getEndUserSupervisorDetails.length > 0) {
                    const endUserSupervisorDetails = {
                        "supervisor_id": getEndUserSupervisorDetails[0].id,
                        "supervisor_name": getEndUserSupervisorDetails[0].name,
                        "supervisor_employee_id": getEndUserSupervisorDetails[0].employee_id,
                        "supervisor_image": getEndUserSupervisorDetails[0].image,

                    };
                    finalData = { ...finalData, ...endUserSupervisorDetails };
                    const managerId = getEndUserSupervisorDetails[0].manager_id;

                    if (managerId) {
                        // get end user manager details
                        const getEndUserManagerDetails = await getUserDetails(managerId);

                        if (getEndUserManagerDetails.length > 0) {
                            const endUserManagerDetails = {
                                "manager_id": getEndUserManagerDetails[0].id,
                                "manager_name": getEndUserManagerDetails[0].name,
                                "manager_employee_id": getEndUserManagerDetails[0].employee_id,
                                "manager_image": getEndUserManagerDetails[0].image,

                            };

                            finalData = { ...finalData, ...endUserManagerDetails };
                        }
                    }

                }
            }
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "User related found",
                    data: finalData
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "User not found",
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

const getAllSupervisorUsers = async (req, res) => {

    try {
        const supervisorRoleId = process.env.SUPERVISOR
        const selectQuery = `SELECT * FROM users WHERE user_type = ?`
        const queryResult = await db.query(selectQuery, [supervisorRoleId])
        if (queryResult.length > 0) {

            var finalData = [];
            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    employee_id: row.employee_id,
                    image: row.image
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



const getAllDealerUsers = async (req, res) => {
    try {

        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search = ""
        if (searchData) {
            search = ` AND (name LIKE '%${searchData}%' OR email LIKE '%${searchData}%')`
        }

        const selectQuery = `SELECT id, name as dealer_name, mobile,email, address, status, image FROM users WHERE user_type = ${process.env.DEALER_ROLE_ID} ${search} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`
        const queryResult = await db.query(selectQuery)
        if (queryResult.length == 0) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found." })
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(
            totalResult.length,
            currentPage,
            pageSize
        );
        res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getDealerById = async (req, res) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT id, name as dealer_name, mobile,email, address, status, image FROM users WHERE user_type = ${process.env.DEALER_ROLE_ID} AND id = ?`
        const queryResult = await db.query(selectQuery, [id])
        if (queryResult.length > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] })
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Data not found" })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const getAllAdmins = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;

        let search = ""
        if (searchData) {
            search = ` AND (name LIKE '%${searchData}%' OR email LIKE '%${searchData}%')`
        }

        const selectQuery = `SELECT id, name as client_name, contact_no as mobile ,email, address_1 as address, country, city, pin_code, status, image FROM admins WHERE user_type = ${process.env.ADMIN_ROLE_ID} ${search} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`
        const queryResult = await db.query(selectQuery)
        if (queryResult.length == 0) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Data not found." })
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(
            totalResult.length,
            currentPage,
            pageSize
        );
        res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const allUserFromAdmin = async (req, res) => {
    try {
        const userId =  req.user.user_id;

        const selectQuery = `select * from users where created_by = '${userId}'`
        const queryResult = await db.query(selectQuery)

        if (queryResult.length > 0) {
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult })
        }else{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "No data found" })
        }

       
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

module.exports = { createUsers, updateUsers, getAllManagerUsers, getEmployeeDocumentsById, sendLoginCredentialsViaEmail, sendLoginCredentialsViaWhatsApp, getEmployeeLoginDetailsById, changeUserStatus, getUsersByRoleId, getAdminsByRoleId, getUsersByAdminId, getAllUsers, getUserById, userStatusTimeLine, getEndUserManagerAndSupervisor, getAllSupervisorUsers, getDealerById, getAllDealerUsers, getAllAdmins, allUserFromAdmin }

