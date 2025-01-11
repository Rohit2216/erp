var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger } = require('../helpers/validation');
const { StatusCodes } = require('http-status-codes');
// const fs = require('fs')
// const path = require("path");
const sharp = require('sharp');
const { getComplaintDetails } = require('../helpers/general');
const { promises: fsPromises } = require('fs');
const path = require('path');

const filesUploadInBilling = async (req, res) => {
    try {
        const { complaint_id, docs } = req.body;
        
        if (!docs || docs.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Files are required" })
        }
        if (!complaint_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Complaint id is required" })
        }

        /** upload file */
        let filePath = []
        let getFilePath;
        
        if (docs.length > 0) {
            for (let files of docs) {
                getFilePath = await convertBase64File(files.file, '/public/pi_attachment/', '/pi_attachment/', files.title)
                filePath.push(getFilePath)
            }
        }

        const insertQuery = `INSERT INTO pi_attachment (complaint_id, filePath, created_by)  VALUES (?,?,?)`;
        const insertData = await db.query(insertQuery, [complaint_id, JSON.stringify(filePath), req.user.user_id])

        if (insertData.affectedRows > process.env.VALUE_ZERO) {
            /** update inside complaints table attachment status=1 */
            const updateQuery = `update  complaints set attachment_status = 1 where id = ?`
            await db.query(updateQuery, [complaint_id])
            return res.status(StatusCodes.OK).json({ status: true, message: "File uploaded successfully" })

        }

        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "File upload failed ." })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}


const updatePiAttachmentInBilling = async (req, res) => {
    try {
        const { id, docs } = req.body

        const { error } = checkPositiveInteger.validate({ id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        if (!docs || docs.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "Files are required" })
        }

        /**get old files */
        const getQuery = `SELECT * FROM pi_attachment WHERE id = ?`
        const getQueryResult = await db.query(getQuery, [id])
        if (getQueryResult.length === 0) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" })
        }

        const getFiles = getQueryResult[0].filePath ? JSON.parse(getQueryResult[0].filePath) : []

        /** file upload for Pi attachment like doc, pdf, image */
        let filePath = []
        if (docs.length > 0) {
            for (let files of docs) {
                let getFilePath;
                if (files.file.startsWith('/pi_attachment/')) {
                    // If file path starts with '/pi_attachment/', use it directly
                    getFilePath = files.file;
                    filePath.push({ title: files.title, file: files.file, fileFormat: files.fileFormat });

                } else {
                    // Convert base64 and push
                    getFilePath = await convertBase64File(files.file, '/public/pi_attachment/', '/pi_attachment/', files.title)
                    filePath.push(getFilePath)
                }
            }
        }


        const updateQuery = `UPDATE pi_attachment SET filePath = ? WHERE id = ?`
        const updateQueryResult = await db.query(updateQuery, [JSON.stringify(filePath), id])

        if (updateQueryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({ status: true, message: "File updated successfully" })
        }

        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "File not updated" })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}



const getPiAttachmentByComplaintId = async (req, res) => {
    try {
        const { complaint_id } = req.params
        if (!complaint_id) {
            return res.status(StatusCodes.OK).json({ status: false, message: "Complaint id is required" })
        }
        const query = `SELECT * FROM pi_attachment WHERE complaint_id = ?`
        const queryResult = await db.query(query, [complaint_id])


        for (let item of queryResult) {
            item.filePath = item.filePath ? JSON.parse(item.filePath) : []
        }

        const complainsDetails = await getComplaintDetails(complaint_id)

        if (queryResult.length > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true, message: "Fetched successfully", data: {
                    attachment_details: queryResult,
                    complaints_Details: complainsDetails
                }
            })
        }

        return res.status(StatusCodes.OK).json({ status: false, message: "Data not found", })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })

    }
}


async function convertBase64File(base64File, fileDirectory, paths, title) {
    try {
        let fileExtension, base64Data;

        // Extract file extension and base64 data based on MIME type
        if (base64File.startsWith('data:application/pdf')) {
            fileExtension = 'pdf';
            base64Data = base64File.replace(/^data:application\/pdf;base64,/, '');
        } else if (base64File.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            fileExtension = 'docx';
            base64Data = base64File.replace(/^data:application\/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,/, '');
        } else if (base64File.startsWith('data:image/jpeg')) {
            fileExtension = 'jpg';
            base64Data = base64File.replace(/^data:image\/jpeg;base64,/, '');
        } else if (base64File.startsWith('data:image/png')) {
            fileExtension = 'png';
            base64Data = base64File.replace(/^data:image\/png;base64,/, '');
        } else if (base64File.startsWith('data:application/msword')) {
            fileExtension = 'doc';
            base64Data = base64File.replace(/^data:application\/msword;base64,/, '');
        } else {
            throw new Error("Unsupported file type");
        }

        // Generate unique file name
        const fileName = `${Date.now()}.${fileExtension}`;

        // Specify the output directory path
        const outputDir = path.join(process.cwd(), fileDirectory);
        const realPath = path.join(outputDir, fileName);

        // Convert Base64 to buffer
        const fileBuffer = Buffer.from(base64Data, 'base64');

        // Write file to folder
        await fsPromises.writeFile(realPath, fileBuffer);

        // Return the relative file path
        const normalizedPaths = paths.endsWith('/') ? paths : paths + '/';

        const dbFilePath = `${normalizedPaths}${fileName}`;

        return {title: title, file: dbFilePath, fileFormat: fileExtension };

    } catch (error) {
        console.error("Error in convertBase64File:", error);
        throw new Error("Failed to convert base64 file.");
    }
}


module.exports = {
    filesUploadInBilling,
    getPiAttachmentByComplaintId,
    updatePiAttachmentInBilling
}