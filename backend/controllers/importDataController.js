require("dotenv").config();
const moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { checkEmailDuplicacys } = require("../helpers/general");
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const fs = require('fs');
const csv = require('fast-csv');
const bcrypt = require('bcrypt');
const { generatePanelIdForUser, generateSuperAdminEmpId } = require('../helpers/panelHelper');
const { type } = require("os");

const importData = async (req, res) => {

    try {

        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
        }

        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + '/public/importData/' + imageName;
        storePath = '/importData/' + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            let stream = fs.createReadStream(uploadPath);
            let csvDataColl = [];
            let isFirstRow = true;
            let blankFields = []; // to store row numbers with blank fields
            let rowNumber = 1;
            let hasExtraColumns = false;
            let allowOnlyLetterInNames = false;
            let nameRegexError = [];
            let statusValueCheck = false;
            let allowOnlyNumberInPhones = false;
            let phoneNumberError = [];
            let roleIdError = false;
            let roleIdErrorArray = [];
            let statusValueCheckError = [];
            let emailError = [];
            let emailExistError = false;

            let fileStream = csv
                .parse()
                .on("data", async function (data) {
                    // skip the header row
                    if (isFirstRow) {
                        isFirstRow = false;
                        return;
                    }
                    rowNumber++;

                    // Check if csv file has extra column/value then throw error
                    if (data.length != 20) {
                        hasExtraColumns = true;
                    }

                    // Check if name is blank and add default value
                    if (!data[0]) {
                        blankFields.push(rowNumber);
                    }

                    // Check if name contains only letters
                    const nameRegex = /^[a-zA-Z]+$/;
                    if (!nameRegex.test(data[0])) {
                        allowOnlyLetterInNames = true;
                        nameRegexError.push(rowNumber);
                    }

                    // check if password is empty then add default password value 
                    if (!data[3]) {
                        data[3] = "12345678";
                    }

                    // Validate phone number
                    phoneNumber = data[4];
                    if (!phoneNumber || !/^[0-9]{1,10}$/.test(phoneNumber)) {
                        allowOnlyNumberInPhones = true;
                        phoneNumberError.push(rowNumber);
                    }

                    // Check if status value is valid (0 or 1 )
                    if (data[18] != '0' && data[18] != '1') {
                        statusValueCheck = true;
                        statusValueCheckError.push(rowNumber);
                    }


                    // role_id validation 31
                    roleId = data[19];
                    if (!roleId || !/^[1-9][0-9]*$/.test(roleId)) {
                        roleIdError = true;
                        roleIdErrorArray.push(rowNumber)
                    }
                    csvDataColl.push(data);
                })
                .on("end", async function () {

                    if (hasExtraColumns) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "CSV file has extra columns" });
                    }


                    if (blankFields.length > 0) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Filed is blank in rows: ' + blankFields.join(", ") });
                    }

                    if (allowOnlyLetterInNames) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Name contains invalid characters at rows " + nameRegexError.join(", ") });
                    }

                    if (allowOnlyNumberInPhones) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid phone number at row ' + phoneNumberError.join(", ") });
                    }

                    if (roleIdError) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid role id at row ' + roleIdErrorArray.join(', ') });
                    }


                    if (statusValueCheck) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Status should be either 0 or 1 at rows " + statusValueCheckError.join(", ") });
                    }

                    //csvDataColl.shift();

                    // Hash the password before inserting it into the database
                    const hashedData = csvDataColl.map((row) => {
                        const [name, email, password, base_64_password, mobile, joining_date, address, skills, team_id, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, bank_documents, department, status, role_id
                        ] = row;

                        const salt = bcrypt.genSaltSync(10);
                        const hashedPassword = bcrypt.hashSync(password, salt);

                        return [name, email, password, base_64_password, mobile, joining_date, address, skills, team_id, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, bank_documents, department, status, role_id];
                    });

                    const insertQuery = `INSERT INTO users (name,email,password,base_64_password,mobile,joining_date,address,skills,team_id,employment_status,pan,aadhar,epf_no,esi_no,bank_name,ifsc_code,account_number,bank_documents,department,status,role_id) VALUES (?)`;
                    const queryResult = await db.query(insertQuery, hashedData);

                    if (queryResult.affectedRows > 0) {
                        fs.unlinkSync(uploadPath);
                        return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
                    } else {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
                    }
                });

            stream.pipe(fileStream);
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

/**
 * function to import user data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
// const importUserData = async (req, res) => {

//     try {
//         if (!req.files || !req.files.data) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
//         }

//         let insertedRecord = 0;
//         const created_by = req.params.id;
//         const fileName = req.files.data;
//         const imageName = Date.now() + fileName.name;
//         const uploadPath = process.cwd() + '/public/importData/' + imageName;
//         storePath = '/importData/' + imageName;

//         fileName.mv(uploadPath, async (err, response) => {
//             if (err) {
//                 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
//             }

//             let stream = fs.createReadStream(uploadPath);
//             let password = '12345678';
//             const salt = bcrypt.genSaltSync(10);
//             const hashedPassword = bcrypt.hashSync(password, salt);
//             const base64String = Buffer.from(password).toString('base64');
//             let csvDataColl = [];
//             let isFirstRow = true;
//             let blankFields = []; // to store row numbers with blank fields
//             let rowNumber = 1;
//             let hasExtraColumns = false;
//             let allowOnlyLetterInNames = false;
//             let nameRegexError = [];
//             let statusValueCheck = false;
//             let allowOnlyNumberInPhones = false;
//             let phoneNumberError = [];
//             let roleIdError = false;
//             let roleIdErrorArray = [];
//             let statusValueCheckError = [];


//             // let fileStream = csv
//             //     .parse()
//             //     .on("data", async function (data) {                

//             //         // skip the header row
//             //         if (isFirstRow) {
//             //             isFirstRow = false;
//             //             return;
//             //         }
//             //         rowNumber++;

//             //         // Check if csv file has extra column/value then throw error
//             //         if (data.length != 11) {
//             //             hasExtraColumns = true;
//             //         }

//             //         // Check if name is blank and add default value
//             //         if (!data[0]) {
//             //             blankFields.push(rowNumber);
//             //         }

//             //         // Check if name contains only letters
//             //         const nameRegex = /^[a-zA-Z]+$/;
//             //         if (!nameRegex.test(data[0])) {
//             //             allowOnlyLetterInNames = true;
//             //             nameRegexError.push(rowNumber);
//             //         }

//             //         // Validate phone number
//             //         phoneNumber = data[3];
//             //         if (!phoneNumber || !/^[0-9]{1,10}$/.test(phoneNumber)) {
//             //             allowOnlyNumberInPhones = true;
//             //             phoneNumberError.push(rowNumber);
//             //         }

//             //         // role_id validation 
//             //         roleId = data[8];
//             //         if (!roleId || !/^[1-9][0-9]*$/.test(roleId)) {
//             //             roleIdError = true;
//             //             roleIdErrorArray.push(rowNumber)
//             //         }
//             //         csvDataColl.push(data);
//             //     })
//             //     .on("end", async function () {

//             //         if (hasExtraColumns) {
//             //             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "CSV file has extra columns" });
//             //         }


//             //         if (blankFields.length > 0) {
//             //             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Filed is blank in rows: ' + blankFields.join(", ") });
//             //         }

//             //         if (allowOnlyLetterInNames) {
//             //             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Name contains invalid characters at rows " + nameRegexError.join(", ") });
//             //         }

//             //         if (allowOnlyNumberInPhones) {
//             //             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid phone number at row ' + phoneNumberError.join(", ") });
//             //         }

//             //         if (roleIdError) {
//             //             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid role id at row ' + roleIdErrorArray.join(', ') });
//             //         }


//             //         if (statusValueCheck) {
//             //             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Status should be either 0 or 1 at rows " + statusValueCheckError.join(", ") });
//             //         }

//             let fileStream = csv
//                 .parse()
//                 .on("data", async function (data) {
//                     // Log the raw data from each row
//                     console.log("Row Data:", data);

//                     // Skip the header row
//                     if (isFirstRow) {
//                         console.log("Header Row Skipped:", data);
//                         isFirstRow = false;
//                         return;
//                     }
//                     rowNumber++;

//                     // Check if the CSV file has extra columns/values
//                     if (data.length != 11) {
//                         console.log("Extra Columns Detected at Row:", rowNumber);
//                         hasExtraColumns = true;
//                     }

//                     // Check if name is blank
//                     if (!data[0]) {
//                         console.log("Blank Field Found in Name at Row:", rowNumber);
//                         blankFields.push(rowNumber);
//                     }

//                     // Validate name format
//                     const nameRegex = /^[a-zA-Z]+$/;
//                     if (!nameRegex.test(data[0])) {
//                         console.log("Invalid Name Format at Row:", rowNumber, "Value:", data[0]);
//                         allowOnlyLetterInNames = true;
//                         nameRegexError.push(rowNumber);
//                     }

//                     // Validate phone number
//                     phoneNumber = data[3];
//                     if (!phoneNumber || !/^[0-9]{1,10}$/.test(phoneNumber)) {
//                         console.log("Invalid Phone Number at Row:", rowNumber, "Value:", phoneNumber);
//                         allowOnlyNumberInPhones = true;
//                         phoneNumberError.push(rowNumber);
//                     }

//                     // Validate role ID
//                     roleId = data[8];
//                     if (!roleId || !/^[1-9][0-9]*$/.test(roleId)) {
//                         console.log("Invalid Role ID at Row:", rowNumber, "Value:", roleId);
//                         roleIdError = true;
//                         roleIdErrorArray.push(rowNumber);
//                     }

//                     // Add the processed row to the collection
//                     csvDataColl.push(data);
//                 })
//                 .on("end", async function () {
//                     // Log the complete collection of CSV data after processing
//                     console.log("CSV Data Collection:", csvDataColl);

//                     if (hasExtraColumns) {
//                         console.log("CSV File Contains Extra Columns.");
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "CSV file has extra columns" });
//                     }

//                     if (blankFields.length > 0) {
//                         console.log("Blank Fields Found in Rows:", blankFields);
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Field is blank in rows: ' + blankFields.join(", ") });
//                     }

//                     if (allowOnlyLetterInNames) {
//                         console.log("Name Validation Errors in Rows:", nameRegexError);
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Name contains invalid characters at rows " + nameRegexError.join(", ") });
//                     }

//                     if (allowOnlyNumberInPhones) {
//                         console.log("Phone Number Validation Errors in Rows:", phoneNumberError);
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid phone number at row ' + phoneNumberError.join(", ") });
//                     }

//                     if (roleIdError) {
//                         console.log("Role ID Validation Errors in Rows:", roleIdErrorArray);
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid role id at row ' + roleIdErrorArray.join(', ') });
//                     }

//                     if (statusValueCheck) {
//                         console.log("Status Value Check Errors in Rows:", statusValueCheckError);
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Status should be either 0 or 1 at rows " + statusValueCheckError.join(", ") });
//                     }





//                     // csvDataColl.shift();
//                     var csvLength = csvDataColl.length;
//                     for (let index = 0; index < csvLength; index++) {

//                         const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
//                         var employee_id = "";
//                         if (req.user.user_type == "1") {
//                             employee_id = await generateSuperAdminEmpId();
//                         }

//                         const row = csvDataColl[index];
//                         const insertQuery = `INSERT INTO users (name, username, email, password, base_64_password, mobile, joining_date, dob, address, pan,  aadhar,epf_no, esi_no, bank_name, ifsc_code, account_number, precise_location, location_id role_id, user_type, created_by, panel_id,employee_id ) VALUES ("${row[0]}", "${row[1]}", "${row[2]}", "${hashedPassword}", "${base64String}", "${row[3]}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD')}", "${row[5]}",  ${row[6]},  "${row[7]}", "${row[8]}","${row[8]}","${created_by}","${panel_id}","${employee_id}")`;
//                         const queryResult = await db.query(insertQuery);
//                         var insertId = queryResult.insertId;

//                         const salaryInsert = `INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by) VALUES("${insertId}", "${row[8]}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD')}", "${row[9]}", "${row[10]}", "${created_by}")`;
//                         await db.query(salaryInsert);
//                         insertedRecord++;
//                     }

//                     if (insertedRecord > 0) {
//                         fs.unlinkSync(uploadPath);
//                         return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
//                     } else {
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
//                     }

//                 });
//             stream.pipe(fileStream);
//         });

//     }
//     catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }

// const importUserData = async (req, res) => {
//     try {
//         if (!req.files || !req.files.data) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
//         }

//         let insertedRecord = 0;
//         const created_by = req.params.id;
//         const fileName = req.files.data;
//         const imageName = Date.now() + fileName.name;
//         const uploadPath = process.cwd() + '/public/importData/' + imageName;
//         const storePath = '/importData/' + imageName;

//         fileName.mv(uploadPath, async (err) => {
//             if (err) {
//                 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
//             }

//             let stream = fs.createReadStream(uploadPath);
//             let password = '12345678';
//             const salt = bcrypt.genSaltSync(10);
//             const hashedPassword = bcrypt.hashSync(password, salt);
//             const base64String = Buffer.from(password).toString('base64');
//             let csvDataColl = [];
//             let isFirstRow = true;
//             let blankFields = [];
//             let rowNumber = 1;
//             let hasExtraColumns = false;
//             let allowOnlyLetterInNames = false;
//             let nameRegexError = [];
//             let allowOnlyNumberInPhones = false;
//             let phoneNumberError = [];
//             let roleIdError = false;
//             let roleIdErrorArray = [];

//             let fileStream = csv
//                 .parse()
//                 .on("data", async function (data) {
//                     console.log("Row Data:", data);

//                     if (isFirstRow) {
//                         console.log("Header Row Skipped:", data);
//                         isFirstRow = false;
//                         return;
//                     }

//                     rowNumber++;

//                     if (data.length != 20) {
//                         console.log("Extra Columns Detected at Row:", rowNumber);
//                         hasExtraColumns = true;
//                     }

//                     if (!data[0]) {
//                         console.log("Blank Field Found in Name at Row:", rowNumber);
//                         blankFields.push(rowNumber);
//                     }

//                     const nameRegex = /^[a-zA-Z]+$/;
//                     if (!nameRegex.test(data[0])) {
//                         console.log("Invalid Name Format at Row:", rowNumber, "Value:", data[0]);
//                         allowOnlyLetterInNames = true;
//                         nameRegexError.push(rowNumber);
//                     }

//                     const phoneNumber = data[5];
//                     if (!phoneNumber || !/^[0-9]{1,10}$/.test(phoneNumber)) {
//                         console.log("Invalid Phone Number at Row:", rowNumber, "Value:", phoneNumber);
//                         allowOnlyNumberInPhones = true;
//                         phoneNumberError.push(rowNumber);
//                     }

//                     const roleId = data[18];
//                     if (!roleId || !/^[1-9][0-9]*$/.test(roleId)) {
//                         console.log("Invalid Role ID at Row:", rowNumber, "Value:", roleId);
//                         roleIdError = true;
//                         roleIdErrorArray.push(rowNumber);
//                     }

//                     csvDataColl.push(data);
//                 })
//                 .on("end", async function () {
//                     console.log("CSV Data Collection:", csvDataColl);

//                     if (hasExtraColumns > 0) {
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "CSV file has extra columns" });
//                     }

//                     if (blankFields.length > 0) {
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Field is blank in rows: ' + blankFields.join(", ") });
//                     }

//                     if (allowOnlyLetterInNames) {
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Name contains invalid characters at rows " + nameRegexError.join(", ") });
//                     }

//                     if (allowOnlyNumberInPhones) {
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid phone number at row ' + phoneNumberError.join(", ") });
//                     }

//                     if (roleIdError) {
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid role id at row ' + roleIdErrorArray.join(', ') });
//                     }

//                     for (let index = 0; index < csvDataColl.length; index++) {
//                         const row = csvDataColl[index];
//                         const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
//                         const employee_id = req.user.user_type == "1" ? await generateSuperAdminEmpId() : "";
//                         console.log("testing kro kya problem hai ")
//                         console.log(`
//                             Name: ${row[0]}
//                             Username: ${row[1]}
//                             Email: ${row[2]}
//                             Hashed Password: ${hashedPassword}
//                             Base64 Password: ${base64String}
//                             Mobile: ${row[3]}
//                             Joining Date: ${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD')}
//                             DOB: ${moment(row[5], 'DD-MM-YYYY').format('YYYY-MM-DD')}
//                             Address: ${row[6]}
//                             PAN: ${row[7]}
//                             Aadhar: ${row[8]}
//                             EPF No: ${row[9]}
//                             ESI No: ${row[10]}
//                             Bank Name: ${row[11]}
//                             IFSC Code: ${row[12]}
//                             Account Number: ${row[13]}
//                             Precise Location: ${row[14]}
//                             Location ID: ${row[15]}
//                             Role ID: ${row[16]}
//                             User Type: ${row[17]}
//                             Created By: ${created_by}
//                             Panel ID: ${panel_id}
//                             Employee ID: ${employee_id}
//                         `);
//                         return 
//                         const insertQuery = `INSERT INTO users (
//                             name, username, email, password, base_64_password, mobile, joining_date, dob, address, 
//                             pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, precise_location, 
//                             location_id, role_id, user_type, created_by, panel_id, employee_id
//                         ) VALUES (
//                             "${row[0]}", "${row[1]}", "${row[2]}", "${hashedPassword}", "${base64String}", "${row[3]}", 
//                             "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD')}", "${moment(row[5], 'DD-MM-YYYY').format('YYYY-MM-DD')}", 
//                             "${row[6]}", "${row[7]}", "${row[8]}", "${row[9]}", "${row[10]}", "${row[11]}", 
//                             "${row[12]}", "${row[13]}", "${row[14]}", "${row[15]}", "${row[16]}", "${row[17]}", 
//                             "${row[18]}", "${created_by}", "${panel_id}", "${employee_id}"
//                         )`;

//                         const queryResult = await db.query(insertQuery);
//                         const insertId = queryResult.insertId;

//                         const salaryInsert = `INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by) 
//                             VALUES ("${insertId}", "${row[18]}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD')}", "${row[19]}", "${row[20]}", "${created_by}")`;

//                         await db.query(salaryInsert);
//                         insertedRecord++;
//                     }

//                     return 
//                     fs.unlinkSync(uploadPath);

//                     if (insertedRecord > 0) {
//                         return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
//                     } else {
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
//                     }
//                 });

//             stream.pipe(fileStream);
//         });
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


// const importUserData = async (req, res) => {
//     try {
//         if (!req.files || !req.files.data) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
//         }

//         const created_by = req.params.id;
//         const fileName = req.files.data;
//         const imageName = Date.now() + fileName.name;
//         const uploadPath = process.cwd() + '/public/importData/' + imageName;
//         const storePath = '/importData/' + imageName;

//         let insertedRecord = 0;

//         // Move the uploaded file
//         fileName.mv(uploadPath, async (err) => {
//             if (err) {
//                 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
//             }

//             // Set up CSV parsing
//             const stream = fs.createReadStream(uploadPath);
//             const fileStream = csv.parse();

//             const MIN_COLUMNS = 15; // Set your minimum required columns here
//             const MAX_COLUMNS = 25; // Max columns you can handle
//             const csvDataColl = [];
//             let rowNumber = 0;

//             let hasInvalidColumns = false;
//             let invalidRows = [];
//             let blankFields = [];

//             fileStream
//                 .on("data", async (data) => {
//                     rowNumber++;

//                     console.log(`Row ${rowNumber} Data (${data.length} columns):`, data);

//                     // Skip header row
//                     if (rowNumber === 1) {
//                         console.log("Header Row Skipped:", data);
//                         return;
//                     }

//                     // Validate column count (minimum and maximum)
//                     if (data.length < MIN_COLUMNS || data.length > MAX_COLUMNS) {
//                         console.log(`Row ${rowNumber} has an invalid number of columns (${data.length}).`);
//                         invalidRows.push(rowNumber);
//                         hasInvalidColumns = true;
//                         return;
//                     }

//                     // Validate for blank fields (in mandatory columns)
//                     for (let i = 0; i < MIN_COLUMNS; i++) {
//                         if (!data[i]) {
//                             console.log(`Blank field found in column ${i + 1} at row ${rowNumber}`);
//                             blankFields.push(rowNumber);
//                             return;
//                         }
//                     }

//                     // Store valid data
//                     csvDataColl.push(data);
//                 })
//                 .on("end", async () => {
//                     console.log("CSV Parsing Completed.");
//                     console.log("CSV Data Collection:", csvDataColl);

//                     // Handle validation errors
//                     if (hasInvalidColumns) {
//                         return res.status(StatusCodes.FORBIDDEN).json({
//                             status: false,
//                             message: `Rows with invalid column count: ${invalidRows.join(", ")}`
//                         });
//                     }

//                     if (blankFields.length > 0) {
//                         return res.status(StatusCodes.FORBIDDEN).json({
//                             status: false,
//                             message: `Blank fields found in rows: ${blankFields.join(", ")}`
//                         });
//                     }

//                     // Process each valid row
//                     for (let index = 0; index < csvDataColl.length; index++) {
//                         const row = csvDataColl[index];
//                         const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
//                         const employee_id = req.user.user_type === "1" ? await generateSuperAdminEmpId() : "";

//                         console.log("Processing Row:", row);

//                         // Prepare dynamic data for insertion (handle missing optional columns)
//                         const salary = row[18] || 0;
//                         const salaryTerm = row[19] || "N/A";

// console.log("testing kro kya problem hai ")
// console.log(`
//     Name: ${row[0]}
//     Username: ${row[1]}
//     Email: ${row[2]}
//     Hashed Password: ${hashedPassword}
//     Base64 Password: ${base64String}
//     Mobile: ${row[3]}
//     Joining Date: ${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD')}
//     DOB: ${moment(row[5], 'DD-MM-YYYY').format('YYYY-MM-DD')}
//     Address: ${row[6]}
//     PAN: ${row[7]}
//     Aadhar: ${row[8]}
//     EPF No: ${row[9]}
//     ESI No: ${row[10]}
//     Bank Name: ${row[11]}
//     IFSC Code: ${row[12]}
//     Account Number: ${row[13]}
//     Precise Location: ${row[14]}
//     Location ID: ${row[15]}
//     Role ID: ${row[16]}
//     User Type: ${row[17]}
//     Created By: ${created_by}
//     Panel ID: ${panel_id}
//     Employee ID: ${employee_id}
// `);
// return 

//                         const insertQuery = `INSERT INTO users (
//                             name, username, email, password, base_64_password, mobile, joining_date, dob, 
//                             address, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, 
//                             precise_location, location_id, role_id, user_type, created_by, panel_id, 
//                             employee_id, salary, salary_term
//                         ) VALUES (
//                             "${row[0] || ''}", "${row[1] || ''}", "${row[2] || ''}", "${hashedPassword}", "${base64String}", 
//                             "${row[3] || ''}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", 
//                             "${moment(row[5], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", "${row[6] || ''}", 
//                             "${row[7] || ''}", "${row[8] || ''}", "${row[9] || ''}", "${row[10] || ''}", "${row[11] || ''}", 
//                             "${row[12] || ''}", "${row[13] || ''}", "${row[14] || ''}", "${row[15] || ''}", "${row[16] || ''}", 
//                             "${row[17] || ''}", "${created_by}", "${panel_id}", "${employee_id}", 
//                             "${salary}", "${salaryTerm}"
//                         )`;

//                         const queryResult = await db.query(insertQuery);
//                         const insertId = queryResult.insertId;

//                         // Insert salary data
//                         const salaryInsert = `INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by) 
//                             VALUES ("${insertId}", "${row[17] || ''}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", "${salary}", "${salaryTerm}", "${created_by}")`;

//                         await db.query(salaryInsert);
//                         insertedRecord++;
//                     }

//                     // Cleanup and respond
//                     fs.unlinkSync(uploadPath);

//                     if (insertedRecord > 0) {
//                         return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
//                     } else {
//                         return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
//                     }
//                 });

//             stream.pipe(fileStream);
//         });
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


const importUserData = async (req, res) => {
    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
        }

        const created_by = req.params.id;
        const fileName = req.files.data;

        if (fileName.mimetype !== 'text/csv' && !fileName.name.endsWith('.csv')) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'Please upload a CSV file.'
            });
        }
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + '/public/importData/' + imageName;

        let insertedRecord = 0;

        fileName.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            const stream = fs.createReadStream(uploadPath);
            const fileStream = csv.parse();

            const csvDataColl = [];
            let rowNumber = 0;

            // fileStream
            //     .on("data", async (data) => {
            //         rowNumber++;

            //         // Skip header row
            //         if (rowNumber === 1) {
            //             console.log("Header Row Skipped:", data);
            //             return;
            //         }

            //         csvDataColl.push(data);
            //     })
            //     .on("end", async () => {
            //         console.log("CSV Parsing Completed.");
            //         console.log("CSV Data Collection:", csvDataColl);
            //         return con
            //         for (let index = 0; index < csvDataColl.length; index++) {
            //             const row = csvDataColl[index];

            //             // Check and set password
            //             const password = row[2]?.trim() || '12345678'; // Use default password if missing
            //             const salt = bcrypt.genSaltSync(10);
            //             const hashedPassword = bcrypt.hashSync(password, salt);
            //             const base64String = Buffer.from(password).toString('base64');

            //             const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
            //             // const employee_id = req.user.user_type === "1" ? await generateSuperAdminEmpId() : "";
            //             const employee_id = "cms";
            //             const preciseLocation = row[14] && !isNaN(Number(row[14])) ? row[14] : 0; // Use 0 if invalid


            //             console.log("check krouser ka data", created_by, panel_id, employee_id)

            //             console.log("Processing Row:", row);

            //             // const insertQuery = `INSERT INTO users (
            //             //     name, username, email, password, base_64_password, mobile, joining_date, dob, 
            //             //     address, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, 
            //             //     precise_location, locationId, role_id, user_type, created_by, panel_id, employee_id
            //             // ) VALUES (
            //             //     "${row[0] || ''}", "${row[0] || ''}", "${row[1] || ''}", "${hashedPassword}", "${base64String}", 
            //             //     "${row[2] || ''}", "${moment(row[3], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", 
            //             //     "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", "${row[5] || ''}", 
            //             //     "${row[6] || ''}", "${row[7] || ''}", "${row[8] || ''}", "${row[9] || ''}", "${row[10] || ''}", 
            //             //     "${row[11] || ''}", "${row[12] || ''}", "${row[13] || ''}", "${row[14] || ''}", "${row[15] || ''}", 
            //             //     "${row[16] || ''}", "${created_by}", "${panel_id}", "${employee_id}"
            //             // )`;
            //             const insertQuery = `INSERT INTO users (
            //                 name, username, email, password, base_64_password, mobile, joining_date, dob, 
            //                 address, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, 
            //                 precise_location, locationId, role_id, user_type, credit_limit, created_by, panel_id, employee_id, status
            //             ) VALUES (
            //                 "${row[0] || ''}", "${row[0] || ''}", "${row[1] || ''}", "${hashedPassword}", "${base64String}", 
            //                 "${row[3] || ''}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", 
            //                 "${moment(row[5], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", "${row[6] || ''}", 
            //                  "${row[7] || ''}", "${row[8] || ''}", "${row[9] || ''}", "${row[10] || ''}", 
            //                 "${row[11] || ''}", "${row[12] || ''}", "${row[13] || ''}", "${preciseLocation}", "${row[15] || ''}", "${row[16] || ''}", 
            //                 "${row[16] || ''}", "${row[20] || ''}", "${created_by}", "${panel_id}", "${employee_id}", "1"
            //             )`;

            //             const queryResult = await db.query(insertQuery);
            //             const insertId = queryResult.insertId;

            //             const salaryInsert = `INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by) 
            //                 VALUES ("${insertId}", "${row[15] || ''}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", "${row[16] || 0}", "${row[19] || 'N/A'}", "${created_by}")`;

            //             await db.query(salaryInsert);
            //             insertedRecord++;
            //         }

            //         fs.unlinkSync(uploadPath);

            //         if (insertedRecord > 0) {
            //             return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
            //         } else {
            //             return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
            //         }
            //     });

            fileStream
                .on("data", async (data) => {
                    rowNumber++;

                    // Skip header row
                    if (rowNumber === 1) {
                        console.log("Header Row Skipped:", data);
                        return;
                    }

                    // Check if the name field (data[0]) has a valid value
                    if (data[0] && data[0].trim() !== "") {
                        csvDataColl.push(data);
                    }
                })
                .on("end", async () => {
                    console.log("CSV Parsing Completed.");
                    console.log("Filtered CSV Data Collection:", csvDataColl);
 
                    for (let index = 0; index < csvDataColl.length; index++) {
                        const row = csvDataColl[index];

                        // Check and set password
                        const password = row[2]?.trim() || '12345678'; // Use default password if missing
                        const salt = bcrypt.genSaltSync(10);
                        const hashedPassword = bcrypt.hashSync(password, salt);
                        const base64String = Buffer.from(password).toString('base64');

                        // const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
                        const employee_id = await generateEmployeeId();
                        const preciseLocation = row[14] && !isNaN(Number(row[14])) ? row[14] : 0; // Use 0 if invalid

                        console.log("Processing Row:", row);

                        const insertQuery = `INSERT INTO users (
                name, username, email, password, base_64_password, mobile, joining_date, dob, 
                address, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, 
                precise_location, locationId, role_id, user_type, credit_limit, created_by, panel_id, employee_id, status
            ) VALUES (
                "${row[0] || ''}", "${row[0] || ''}", "${row[1] || ''}", "${hashedPassword}", "${base64String}", 
                "${row[3] || ''}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", 
                "${moment(row[5], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", "${row[6] || ''}", 
                 "${row[7] || ''}", "${row[8] || ''}", "${row[9] || ''}", "${row[10] || ''}", 
                "${row[11] || ''}", "${row[12] || ''}", "${row[13] || ''}", "${preciseLocation}", "${row[15] || ''}", "${row[16] || ''}", 
                "${row[16] || ''}", "${row[20] || ''}", "${created_by}", "${employee_id}", "${employee_id}", "1"
            )`;

                        const queryResult = await db.query(insertQuery);
                        const insertId = queryResult.insertId;

                        const salaryInsert = `INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by) 
                VALUES ("${insertId}", "${row[15] || ''}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}", "${row[16] || 0}", "${row[19] || 'N/A'}", "${created_by}")`;

                        await db.query(salaryInsert);
                        insertedRecord++;
                    }

                    fs.unlinkSync(uploadPath);

                    if (insertedRecord > 0) {
                        return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
                    } else {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
                    }
                });

            stream.pipe(fileStream);
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};



const generateEmployeeId = async () => {
    try {
        // Query to get the last employee_id from the users table
        const queryResult = await db.query(
            `SELECT employee_id FROM users ORDER BY id DESC LIMIT 1`
        );

        let lastEmployeeId = queryResult.length > 0 ? queryResult[0].employee_id : null;

        if (!lastEmployeeId) {
            // No previous employee_id exists, start with the first one
            return "ERP0001";
        }
        
        // Extract the numeric part from the last employee_id
        const numericPart = parseInt(lastEmployeeId.replace("ERP", ""), 10);

        if (isNaN(numericPart)) {
            throw new Error("Invalid employee_id format in database.");
        }

        // Increment the numeric part and format it back to the desired format
        const newEmployeeId = `ERP${String(numericPart + 1).padStart(4, "0")}`;
        return newEmployeeId;
    } catch (error) {
        console.error("Error generating employee ID:", error.message);
        throw error;
    }
};





/**
 * function to import bank details data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const importBankDetailData = async (req, res) => {

    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
        }
        let insertedRecord = 0;
        const created_by = req.params.id;
        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + '/public/importData/' + imageName;
        storePath = '/importData/' + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            let stream = fs.createReadStream(uploadPath);
            let csvDataColl = [];
            let isFirstRow = true;
            let blankFields = []; // to store row numbers with blank fields
            let rowNumber = 1;
            let hasExtraColumns = false;
            let allowOnlyLetterInNames = false;
            let nameRegexError = [];
            let statusValueCheck = false;
            let statusValueCheckError = [];


            let fileStream = csv
                .parse()
                .on("data", async function (data) {

                    // skip the header row
                    if (isFirstRow) {
                        isFirstRow = false;
                        return;
                    }
                    rowNumber++;

                    // Check if csv file has extra column/value then throw error
                    if (data.length != 4) {
                        hasExtraColumns = true;
                    }

                    // Check if name is blank and add default value
                    if (!data[1]) {
                        blankFields.push(rowNumber);
                    }

                    // Check if name contains only letters
                    const nameRegex = /^[a-zA-Z]+$/;
                    if (!data[1]) {
                        allowOnlyLetterInNames = true;
                        nameRegexError.push(rowNumber);
                    }

                    csvDataColl.push(data);
                })
                .on("end", async function () {

                    if (hasExtraColumns) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "CSV file has extra columns" });
                    }


                    if (blankFields.length > 0) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Filed is blank in rows: ' + blankFields.join(", ") });
                    }

                    if (allowOnlyLetterInNames) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Name contains invalid characters at rows " + nameRegexError.join(", ") });
                    }


                    if (statusValueCheck) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Status should be either 0 or 1 at rows " + statusValueCheckError.join(", ") });
                    }
                    // csvDataColl.shift();
                    var csvLength = csvDataColl.length;
                    for (let index = 0; index < csvLength; index++) {

                        const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
                        var employee_id = "";
                        if (req.user.user_type == "1") {
                            employee_id = await generateSuperAdminEmpId();
                        }

                        const row = csvDataColl[index];

                        const salaryInsert = `INSERT INTO banks (bank_name, website, logo) VALUES("${row[1]}", "${row[2]}", "${row[3]}")`;
                        await db.query(salaryInsert);
                        insertedRecord++;
                    }

                    if (insertedRecord > 0) {
                        fs.unlinkSync(uploadPath);
                        return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
                    } else {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
                    }

                });
            stream.pipe(fileStream);
        });

    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getSpecificColumnValueFromCsv = async (req, res) => {

    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
        }

        let columns = req.body.columns;

        // Ensure that columns is an array
        if (!Array.isArray(columns)) {
            columns = columns;
        }
        // Check if columns is a string, and split it into an array if needed
        if (typeof columns === 'string') {
            columns = JSON.parse(columns.replace(/'/g, "\""));
        }

        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + '/public/importData/' + imageName;
        var storePath = '/importData/' + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            const filePath = uploadPath;

            const columnValues = [];

            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true }))
                .on('data', (row) => {
                    // Loop through the specified columns and store their values in the result object
                    const rowData = {};
                    columns.forEach((column) => {
                        rowData[column] = row[column] || null; // Use null if the column doesn't exist in the row
                    });
                    columnValues.push(rowData);

                })
                .on('end', () => {
                    // Now, you can use 'columnValues' to access the values of the specified columns
                    fs.unlinkSync(filePath);
                    return res.status(StatusCodes.OK).json({ status: true, columnValues });
                })
                .on('error', (error) => {
                    console.error('Error processing CSV file:', error.message);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
                });

        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


module.exports = { importData, importUserData, importBankDetailData, getSpecificColumnValueFromCsv };
