require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger, messageValidation } = require("../helpers/validation");
const { StatusCodes } = require('http-status-codes');
const { getUserDetails, getLoggedUserDetails, getRecipientMessages } = require('../helpers/general')

const sendMessage = async (req, res) => {

    try {
        const { sender_id, recipient_id, message_content } = req.body

        const { error } = messageValidation.validate(req.body)

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        var storePath = null
        const now = new Date();
        const timestamp = now.getTime();
        //const sender_id = //req.user.user_id;

        if (req.files != null) {
            const image = req.files.attachment
            const imageName = Date.now() + image.name
            const uploadPath = process.cwd() + '/public/message_attachments/' + imageName;
            storePath = '/message_attachments/' + imageName;

            image.mv(uploadPath, (error, response) => {
                if (error) return res.status(403).json({ status: false, message: error.message });

            })
        }

        const insertQuery = `INSERT INTO messages(sender_id, recipient_id, message_content, attachment, timestamp) VALUES(?, ?, ?, ?, ?)`

        const insertValues = [sender_id, recipient_id, message_content, storePath, timestamp]
        const queryResult = await db.query(insertQuery, insertValues)

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "message send successfully" })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Failed! message not sent" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

// const getMessages = async (req, res) => {

//     try {

//         const id = req.user.user_id;
//         // const id = '1';
//         // const selectQuery = `SELECT DISTINCT sender_id as user_id FROM messages WHERE recipient_id = '${id}' UNION 
//         // SELECT DISTINCT recipient_id as user_id FROM messages WHERE sender_id = '${id}';`
//         const selectQuery = `
//         SELECT DISTINCT 
//             CASE 
//                 WHEN sender_id = '${id}' THEN recipient_id
//                 ELSE sender_id
//             END AS user_id
//         FROM messages
//         WHERE sender_id = '${id}' OR recipient_id = '${id}'
//     `;

//         const queryResult = await db.query(selectQuery);

//         if (queryResult.length > process.env.VALUE_ZERO) {
//             var values = [];

//             for (let index = 0; index < queryResult.length; index++) {
//                 var recipient_id = queryResult[index].user_id;
//                 console.log("recipient_id", recipient_id, id)
//                 const getMessages = await getRecipientMessages(recipient_id, id)
//                 console.log("getMessages", getMessages)
//                 const getSenderDetails = await getUserDetails(getMessages[0].recipient_id);
//                 values.push({
//                     message_id: getMessages[0].message_id,
//                     sender_id: getMessages[0].sender_id,
//                     recipient_id: getMessages[0].recipient_id,
//                     message_content: getMessages[0].message_content,
//                     attachment: getMessages[0].attachment,
//                     is_read: getMessages[0].is_read,
//                     timestamp: getMessages[0].timestamp,
//                     total_unread: getMessages[0].total_unread,
//                     sender_details: getSenderDetails[0]
//                 })
//             }
//             values.sort((a, b) => b.message_id - a.message_id);
//             res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values })
//         }
//         else {
//             res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
//         }


//         // const selectQuery = `SELECT m.*, latest.total_unread FROM messages m INNER JOIN ( SELECT sender_id, MAX(timestamp) AS latest_time, SUM(CASE WHEN is_read = '0' THEN 1 ELSE 0 END) AS total_unread FROM messages WHERE recipient_id = ? GROUP BY sender_id ) latest ON m.sender_id = latest.sender_id AND m.timestamp = latest.latest_time WHERE m.recipient_id = ? ORDER BY m.timestamp DESC`
//         // const queryResult = await db.query(selectQuery, [id, id]);

//         // if(queryResult.length > process.env.VALUE_ZERO)
//         // {
//         //     var values = [];

//         //     for(const row of queryResult)
//         //     {
//         //         const getSenderDetails = await getUserDetails(row.sender_id) 
//         //         values.push({
//         //             message_id: row.message_id,
//         //             sender_id: row.sender_id,
//         //             recipient_id: row.recipient_id,
//         //             message_content: row.message_content,
//         //             attachment: row.attachment,
//         //             is_read: row.is_read,
//         //             timestamp: row.timestamp,
//         //             total_unread: row.total_unread,
//         //             sender_details: getSenderDetails[0]
//         //         })
//         //     }

//         //     res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: values})
//         // }
//         // else
//         // {
//         //     res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
//         // }
//     }
//     catch (error) {
//         console.error(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }


// const getMessages = async (req, res) => {
//     const id = req.user.user_id;

//     try {
//         // Separate queries for sender_id and recipient_id
//         const senderQuery = `SELECT DISTINCT recipient_id as user_id FROM messages WHERE sender_id = '${id}'`;
//         const recipientQuery = `SELECT DISTINCT sender_id as user_id FROM messages WHERE recipient_id = '${id}'`;

//         const senderResults = await db.query(senderQuery);
//         const recipientResults = await db.query(recipientQuery);

//         // Combine the results ensuring no duplicates
//         const combinedResults = [...new Set([...senderResults, ...recipientResults])];

//         if (combinedResults.length > 0) {
//             var values = [];

//             for (let index = 0; index < combinedResults.length; index++) {
//                 var recipient_id = combinedResults[index].user_id;
//                 console.log("recipient_id", recipient_id, id);

//                 const getMessages = await getRecipientMessages(recipient_id, id);
//                 console.log("getMessages", getMessages);

//                 if (getMessages.length > 0) {
//                     const getSenderDetails = await getUserDetails(getMessages[0].recipient_id);

//                     values.push({
//                         message_id: getMessages[0].message_id,
//                         sender_id: getMessages[0].sender_id,
//                         recipient_id: getMessages[0].recipient_id,
//                         message_content: getMessages[0].message_content,
//                         attachment: getMessages[0].attachment,
//                         is_read: getMessages[0].is_read,
//                         timestamp: getMessages[0].timestamp,
//                         total_unread: getMessages[0].total_unread,
//                         sender_details: getSenderDetails[0]
//                     });
//                 }
//             }

//             values.sort((a, b) => b.message_id - a.message_id);
//             res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values });
//         } else {
//             res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (err) {
//         res.status(500).json({ status: false, message: err.message });
//     }

// }

const getMessages = async (req, res) => {
    const id = req.user.user_id;
    try {
        // Separate queries for sender_id and recipient_id
        const senderQuery = `SELECT distinct recipient_id as user_id FROM messages WHERE sender_id = '${id}'`;
        const recipientQuery = `SELECT distinct sender_id as sender_id FROM messages WHERE recipient_id = '${id}'`;

        const senderResults = await db.query(senderQuery);
        const recipientResults = await db.query(recipientQuery);

        // Combine and deduplicate the results ensuring no duplicates
        const combinedResultsMap = new Map();

        senderResults.forEach(result => combinedResultsMap.set(result.user_id, result));
        recipientResults.forEach(result => combinedResultsMap.set(result.user_id, result));

        const combinedResults = Array.from(combinedResultsMap.values());

        if (combinedResults.length > 0) {
            const values = [];

            for (let index = 0; index < combinedResults.length; index++) {
                const recipient_id = combinedResults[index].user_id;

                const getMessages = await getRecipientMessages(recipient_id, id); // recipient id 

                if (getMessages.length > 0) {
                    const getSenderDetails = await getUserDetails(getMessages[0].recipient_id); // sender_id 

                    values.push({
                        message_id: getMessages[0].message_id,
                        sender_id: getMessages[0].sender_id,
                        recipient_id: getMessages[0].recipient_id,
                        message_content: getMessages[0].message_content,
                        attachment: getMessages[0].attachment,
                        is_read: getMessages[0].is_read,
                        timestamp: getMessages[0].timestamp,
                        total_unread: getMessages[0].total_unread,
                        sender_details: getSenderDetails[0]
                    });
                }
            }

            values.sort((a, b) => b.message_id - a.message_id);

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


// const getMessages = async (req, res) => {
//     const id = req.user.user_id;
//     try {
//         // Separate queries for sender_id and recipient_id
//         const senderQuery = `SELECT DISTINCT recipient_id as user_id FROM messages WHERE sender_id = '${id}'`;
//         const recipientQuery = `SELECT DISTINCT sender_id as user_id FROM messages WHERE recipient_id = '${id}'`;

//         const senderResults = await db.query(senderQuery);
//         const recipientResults = await db.query(recipientQuery);

//         // Combine and deduplicate the results ensuring no duplicates
//         const combinedResultsMap = new Map();

//         senderResults.forEach(result => combinedResultsMap.set(result.user_id, result));
//         recipientResults.forEach(result => combinedResultsMap.set(result.user_id, result));

//         const combinedResults = Array.from(combinedResultsMap.values());

//         if (combinedResults.length > 0) {
//             const values = [];

//             for (let index = 0; index < combinedResults.length; index++) {
//                 const user_id = combinedResults[index].user_id;

//                 // Get messages where either sender_id or recipient_id matches the current user_id
//                 const messages = await getRecipientMessages(user_id, id);

//                 if (messages.length > 0) {
//                     // Determine the sender and recipient
//                     const message = messages[0];
//                     const isSender = message.sender_id === id;
                    
//                     const sender_id = isSender ? id : message.sender_id;
//                     const recipient_id = isSender ? message.recipient_id : id;

//                     // Fetch sender and recipient details
//                     const [senderDetails, recipientDetails] = await Promise.all([
//                         getUserDetails(sender_id),
//                         getUserDetails(recipient_id)
//                     ]);

//                     values.push({
//                         message_id: message.message_id,
//                         sender_id: sender_id,
//                         recipient_id: recipient_id,
//                         message_content: message.message_content,
//                         attachment: message.attachment,
//                         is_read: message.is_read,
//                         timestamp: message.timestamp,
//                         total_unread: message.total_unread,
//                         sender_details: isSender ? senderDetails[0] : recipientDetails[0],
//                         recipient_details: isSender ? recipientDetails[0] : senderDetails[0],
//                     });
//                 }
//             }

//             // Sort the results based on the message_id
//             values.sort((a, b) => b.message_id - a.message_id);

//             res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values });
//         } else {
//             res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//         }
//     } catch (err) {
//         res.status(500).json({ status: false, message: err.message });
//     }
// };




const getSenderAllMessages = async (req, res) => {

    try {
        const sender_id = req.params.id;
        const recipient_id = req.user.user_id
        console.log(sender_id, recipient_id);
        const { error } = checkPositiveInteger.validate({ id: sender_id });
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const pageSize = parseInt(req.query.pageSize) || 30;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;

        const countSelectQuery = `SELECT COUNT(*) as total FROM messages WHERE (sender_id = '${sender_id}' AND recipient_id = '${recipient_id}') OR (sender_id = '${recipient_id}' AND recipient_id = '${sender_id}') ORDER BY timestamp DESC`

        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var queryParams = [pageFirstResult, pageSize];

        const selectQuery = `SELECT * FROM messages WHERE (sender_id = '${sender_id}' AND recipient_id = '${recipient_id}') OR (sender_id = '${recipient_id}' AND recipient_id = '${sender_id}') ORDER BY timestamp ASC LIMIT ?, ?`

        // const selectQuery = `SELECT * FROM messages WHERE (sender_id = 10 AND recipient_id = 1) OR (sender_id = 1 AND recipient_id = 10) ORDER BY timestamp DESC`
        const queryResult = await db.query(selectQuery, queryParams);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total })

            var values = [];
            const loggedUserId = recipient_id;
            const loggedUserType = req.user.user_type;

            for (const row of queryResult) {
                const getSenderDetails = await getLoggedUserDetails(loggedUserId, loggedUserType)
                const getRecipientDetails = await getUserDetails(sender_id)
                values.push({
                    message_id: row.message_id,
                    sender_id: row.sender_id,
                    recipient_id: row.recipient_id,
                    message_content: row.message_content,
                    attachment: row.attachment,
                    is_read: row.is_read,
                    timestamp: row.timestamp,
                    total_unread: row.total_unread,
                    sender_details: getSenderDetails[0],
                    recipient_details: getRecipientDetails[0]
                })
            }
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails[0] })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error });
    }
}

const addNewUserToChat = async (req, res) => {

    try {
        // const selectQuery = `SELECT id, name, email, image FROM users WHERE id NOT IN ( SELECT sender_id FROM messages UNION SELECT recipient_id FROM messages )`

        const selectQuery = `SELECT id, name, email, image FROM users`

        const queryResult = await db.query(selectQuery);

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult });
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Data not found" });
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

// const startChatWIthNewUser = async (req, res) => {

//     try {

//         const id = req.params.id;

//         const { error } = checkPositiveInteger.validate({ id })

//         if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

//         const insertQuery = `INSERT INTO messages (sender_id, recipient_id, message_content, timestamp) VALUES (?, ?, ?, ?)`

//         const recipientId = id
//         const senderId = req.user.user_id;
//         const timestamp = Date.now();
//         const queryResult = await db.query(insertQuery, [senderId, recipientId, 'hello', timestamp])

//         if (queryResult.affectedRows > process.env.VALUE_ZERO) {
//             res.status(StatusCodes.OK).json({ status: true, message: "user added for chat successfully" })
//         }
//         else {
//             res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! user not added for chat" })
//         }
//     }
//     catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }
// }
const startChatWIthNewUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const insertQuery = `INSERT INTO messages (sender_id, recipient_id, message_content, timestamp) VALUES (?, ?, ?, ?)`;

        const recipientId = id;
        const senderId = req.user.user_id;
        const timestamp = Date.now();

        // Insert the original message
        const queryResult = await db.query(insertQuery, [senderId, recipientId, 'hello', timestamp]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            // Insert the opposite message (roles swapped)
            const oppositeQueryResult = await db.query(insertQuery, [recipientId, senderId, 'hello', timestamp]);

            if (oppositeQueryResult.affectedRows > process.env.VALUE_ZERO) {
                res.status(StatusCodes.OK).json({ status: true, message: "User added for chat successfully, and opposite data inserted" });
            } else {
                res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Opposite data not added for chat" });
            }
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! User not added for chat" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};




const getTotalUnreadMessages = async (req, res) => {

    try {
        const id = req.user.user_id;
        const selectQuery = `SELECT COUNT(*) as total FROM messages WHERE recipient_id = ? AND is_read = ?`
        const queryResult = await db.query(selectQuery, [id, process.env.VALUE_ZERO])

        if (queryResult.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult[0] })
        }
        else {
            res.status(StatusCodes.OK).json({ status: true, message: "Data not found" })
        }
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const markAllMessagesRead = async (req, res) => {

    try {

        const id = req.user.user_id
        const now = new Date();
        const timestamp = now.getTime();

        const { error } = checkPositiveInteger.validate({ id })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const updateQuery = `UPDATE messages SET is_read = ?, read_at = ? WHERE recipient_id = ?`
        const queryResult = await db.query(updateQuery, [process.env.VALUE_ONE, timestamp, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "messages read successfully" })
        }
        else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Error! Messages read failed" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

const markReadSenderAllMessages = async (req, res) => {

    try {
        const sender_id = req.params.id
        const recipient_id = req.user.user_id;

        const now = new Date();
        const timestamp = now.getTime();

        const { error } = checkPositiveInteger.validate({ id: sender_id })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const updateQuery = `UPDATE messages SET is_read = ?, read_at = ? WHERE sender_id = ? AND recipient_id = ?`

        const queryResult = await db.query(updateQuery, [process.env.VALUE_ONE, timestamp, sender_id, recipient_id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Messages read successfully" })
        }
        else {
            res.status(StatusCodes.OK).json({ status: true, message: "Nothing to read." })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


module.exports = { sendMessage, getMessages, getSenderAllMessages, addNewUserToChat, getTotalUnreadMessages, markAllMessagesRead, markReadSenderAllMessages, startChatWIthNewUser }