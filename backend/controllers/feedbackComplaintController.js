const moment = require("moment");
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { createFeedbackComplaintValidation } = require("../helpers/validation");
const { getAdminAndUserDetails } = require("../helpers/general");

/**
 * ## Add Feedback or Complaint or Update Feedback or Complaint
 */
const addUpdateFeedbackComplaint = async (req, res) => {
    try {
        const { error } = createFeedbackComplaintValidation.validate(req.body);
        if (error)
            return res.status(StatusCodes.OK).json({ status: false, message: error.details[0].message });

        const { id } = req.body;

        if (id) {
            const selectQuery = `SELECT * FROM feedback_and_complaints WHERE title = ?`;
            const response = await db.query(selectQuery, [req.body.title]);

            if (response.length === 0) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: false, message: "Feedback or Complaint not found" });
            }

            req.body.updated_by = req.user.user_id;
            const updateQuery = `UPDATE feedback_and_complaints SET ? WHERE id = ?`;
            const queryValues = [req.body, id];
            const execQuery = await db.query(updateQuery, queryValues);

            if (execQuery.affectedRows > 0) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: true, message: "Feedback or Complaint updated successfully." });
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Failed to update data." });
            }
        }
        // Add the user who created the Feedback/Complaint
        req.body.created_by = req.user.user_id;
        const insertQuery = `INSERT INTO feedback_and_complaints SET ?`;
        const queryValues = [req.body];
        const execQuery = await db.query(insertQuery, queryValues);
        if (execQuery.affectedRows > 0) {
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Feedback or Complaint added successfully." });
        }
        return res.status(StatusCodes.OK).json({ status: false, message: "Failed to insert data." });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

/**
 * ## Get All Feedback or Complaint or Specific One
 */
// const getFeedbackComplaint = async (req, res) => {
//     try {
//         const status = req.query.status || "";
//         const pageSize = req.query.pageSize || 10;
//         const currentPage = req.query.pageNo || 1;
//         const searchData = req.query.search || "";
//         let totalPages = process.env.VALUE_ZERO;
//         const countSelectQuery = `SELECT COUNT(*) as total FROM feedback_and_complaints WHERE deleted =0`;
//         constTotalLength = await db.query(countSelectQuery);
//         totalPages = Math.round(constTotalLength[0].total / pageSize);
//         const total = constTotalLength[0].total;
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         let whereConditions = '';
//         let searchQuery = '';


//         if (searchData != null && searchData != "") {
//             if (status) {
//                 whereConditions += ` WHERE deleted=0 AND feedback_and_complaints.status = '${status}' AND (feedback_and_complaints.title LIKE '%${searchData}%' OR feedback_and_complaints.description LIKE '%${searchData}%')`;
//             } else {
//                 whereConditions += ` WHERE deleted =0 AND (feedback_and_complaints.title LIKE '%${searchData}%' OR feedback_and_complaints.description LIKE '%${searchData}%')`;
//             }
//         } else if (status) {
//             whereConditions += `WHERE deleted=0 AND feedback_and_complaints.status = '${status}' ORDER BY feedback_and_complaints.id DESC LIMIT ${pageFirstResult} , ${pageSize} `;
//         } else {
//             whereConditions += `WHERE deleted =0 ORDER BY feedback_and_complaints.id DESC LIMIT ${pageFirstResult} , ${pageSize} `;
//         }

//         searchQuery = `SELECT * FROM feedback_and_complaints ${whereConditions}`;
//         const response = await db.query(searchQuery);


//         if (response.length > 0) {
//             response.map((item) => {
//                 item.created_at = moment(item.created_at).format("DD-MM-YYYY hh:mm:ss A");
//                 item.updated_at = moment(item.updated_at).format("DD-MM-YYYY hh:mm:ss A");
//             })
//             const pageStartResult = (currentPage - 1) * pageSize + 1;
//             const pageEndResult = Math.min(currentPage * pageSize, total);
//             let pageDetails = [];
//             pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

//             return res.status(200).json({ status: true, message: "Feedback and Complaints Fetched successfully", data: response, pageDetails: pageDetails[0] });
//         } else {
//             return res.status(200).json({ status: false, message: "Data not found" });
//         }


//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


const getFeedbackComplaint = async (req, res) => {
    try {
        const status = req.query.status || "";
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || "";
        let totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM feedback_and_complaints WHERE deleted =0`;
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        let whereConditions = '';
        let searchQuery = '';


        if (searchData != null && searchData != "") {
            if (status) {
                whereConditions += ` WHERE deleted=0 AND feedback_and_complaints.status = '${status}' AND (feedback_and_complaints.title LIKE '%${searchData}%' OR feedback_and_complaints.description LIKE '%${searchData}%')`;
            } else {
                whereConditions += ` WHERE deleted =0 AND (feedback_and_complaints.title LIKE '%${searchData}%' OR feedback_and_complaints.description LIKE '%${searchData}%')`;
            }
        } else if (status) {
            whereConditions += `WHERE deleted=0 AND feedback_and_complaints.status = '${status}' ORDER BY feedback_and_complaints.id DESC LIMIT ${pageFirstResult} , ${pageSize} `;
        } else {
            whereConditions += `WHERE deleted =0 ORDER BY response IS NULL DESC LIMIT ${pageFirstResult} , ${pageSize} `;
        }

        searchQuery = `SELECT * FROM feedback_and_complaints ${whereConditions}`;
        const response = await db.query(searchQuery);


        if (response.length > 0) {
            await Promise.all(response.map( async (item) => {
                const [createdBy] = await getAdminAndUserDetails(item.created_by)
                item.created_by = {
                    id: createdBy.id,
                    name: createdBy.name,
                }
                if(item.response_by){
                    const [responseBy] = await getAdminAndUserDetails(item.response_by)
                    item.response_by = {
                        id: responseBy.id,
                        name: responseBy.name,
                    }
                }
                item.created_at = moment(item.created_at).format("DD-MM-YYYY hh:mm:ss A");
                item.updated_at = moment(item.updated_at).format("DD-MM-YYYY hh:mm:ss A");
            }))
            const pageStartResult = (currentPage - 1) * pageSize + 1;
            const pageEndResult = Math.min(currentPage * pageSize, total);
            let pageDetails = [];
            pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });

            return res.status(200).json({ status: true, message: "Feedback and Complaints Fetched successfully", data: response, pageDetails: pageDetails[0] });
        } else {
            return res.status(200).json({ status: false, message: "Data not found" });
        }


    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

// const getFeedbackComplaintById = async (req, res) => {
//     try {
//         const id = req.params.id;

//         // Validate ID
//         if (!id || isNaN(id)) {
//             return res.status(400).json({ status: false, message: "Invalid ID" });
//         }

//         // Query to fetch feedback and complaint by ID
//         const selectQuery = `SELECT * FROM feedback_and_complaints WHERE id = ? AND deleted = 0`;
//         const response = await db.query(selectQuery, [id]);

//         if (response.length > 0) {
//             response.map((item) => {
//                 item.created_at = moment(item.created_at).format("DD-MM-YYYY hh:mm:ss A");
//                 item.updated_at = moment(item.updated_at).format("DD-MM-YYYY hh:mm:ss A");
//             });

//             return res.status(200).json({ status: true, message: "Feedback and Complaint fetched successfully", data: response[0] });
//         } else {
//             return res.status(200).json({ status: false, message: "Data not found" });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };


const getFeedbackComplaintById = async (req, res) => {
    try {
        const id = req.params.id;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ status: false, message: "Invalid ID" });
        }

        // Query to fetch feedback and complaint by ID
        const selectQuery = `SELECT * FROM feedback_and_complaints WHERE id = ? AND deleted = 0`;
        let response = await db.query(selectQuery, [id]);

        if (response.length > 0) {
            response = response[0]
            response.created_at = moment(response.created_at).format("DD-MM-YYYY hh:mm:ss A");
            response.updated_at = moment(response.updated_at).format("DD-MM-YYYY hh:mm:ss A");
            const [user] = await getAdminAndUserDetails(response.created_by)
            response.created_by = {
                id: user.id,
                name: user.name,
            }
            if(response.response_by){
                const [responseBy] = await getAdminAndUserDetails(response.response_by)
                response.response_by = {
                    id: responseBy.id,
                    name: responseBy.name,
                }
            }

            return res.status(200).json({ status: true, message: "Feedback and Complaint fetched successfully", data: response});
        } else {
            return res.status(200).json({ status: false, message: "Data not found" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

/**
 * ## Add Response to Feedback or Complaint
 */
// const addResponseToFeedbackComplaint = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (id) {
//             const selectQuery = `SELECT * FROM feedback_and_complaints WHERE id = ?`;
//             const response = await db.query(selectQuery, [id]);

//             if (response.length > 0) {
//                 req.body.updated_by = req.user.user_id;
//                 const updateQuery = `UPDATE feedback_and_complaints SET ? WHERE id = ?`;
//                 const queryValues = [req.body, id];
//                 const execQuery = await db.query(updateQuery, queryValues);
//                 if (execQuery.affectedRows > 0) {
//                     return res.status(StatusCodes.OK).json({ status: true, message: "Response Added successfully." });
//                 } else {
//                     return res.status(StatusCodes.OK).json({ status: false, message: "Failed to add response." });
//                 }
//             } else {
//                 return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//             }
//         } else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "id is required to add response" });
//         }
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// };

const addResponseToFeedbackComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            const selectQuery = `SELECT * FROM feedback_and_complaints WHERE id = ?`;
            const response = await db.query(selectQuery, [id]);
            req.body.response_by = req.user.user_id
            if (response.length > 0) {
                req.body.updated_by = req.user.user_id;
                const updateQuery = `UPDATE feedback_and_complaints SET ? WHERE id = ?`;
                const queryValues = [req.body, id];
                const execQuery = await db.query(updateQuery, queryValues);
                if (execQuery.affectedRows > 0) {
                    return res.status(StatusCodes.OK).json({ status: true, message: "Response Added successfully." });
                } else {
                    return res.status(StatusCodes.OK).json({ status: false, message: "Failed to add response." });
                }
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }
        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "id is required to add response" });
        }
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


/**
 * ## Delete Feedback or Complaint
 */
const deleteFeedbackComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            const selectQuery = `SELECT * FROM feedback_and_complaints WHERE id = ${id}`;
            const response = await db.query(selectQuery);
            console.log(response)

            if (response.length > 0) {
                const deleteQuery = `UPDATE feedback_and_complaints SET deleted = 1 WHERE id = ${id}`;
                const execQuery = await db.query(deleteQuery);
                if (execQuery.affectedRows > 0) {
                    return res.status(StatusCodes.OK).json({ status: true, message: "Record deleted successfully." });
                } else {
                    return res.status(StatusCodes.OK).json({ status: false, message: "Failed to delete data." });
                }
            } else {
                return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
            }

        } else {
            return res.status(StatusCodes.OK).json({ status: false, message: "id is required to delete" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

module.exports = {
    addUpdateFeedbackComplaint,
    getFeedbackComplaint,
    addResponseToFeedbackComplaint,
    deleteFeedbackComplaint,
    getFeedbackComplaintById
};
