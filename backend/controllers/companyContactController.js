var moment = require('moment');
require('dotenv').config();
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { companyContactValidation, checkPositiveInteger, sendMessageValidation, updateMessageValidation } = require('../helpers/validation');
const { calculatePagination, generateRandomAlphanumeric, getUserDetails} = require('../helpers/general');
const cron = require('node-cron');
const { mailSent } = require('../helpers/sendEmail');

const createContacts = async (req, res) => {

    try {

        const {company_id, first_name, last_name, phone, email, position, notes, status} = req.body

        const {error} = companyContactValidation.validate(req.body);

        if(error)
        {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        var storePath = ''

        if (req.files != null) {
            const image = req.files.image
            const imageName = Date.now() + image.name
            const uploadPath = process.cwd() + '/public/contact_images/' + imageName;
            storePath = '/contact_images/' + imageName;

            image.mv(uploadPath, async(err, response) => {
                if (err) {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({
                            status: false,
                            message: err.message
                        })
                }
            })
        }

        const insertData = {
            contact_unique_id: await generateRandomAlphanumeric(6),
            company_id,
            first_name,
            last_name,
            phone: JSON.stringify(phone),
            email: JSON.stringify(email),
            position,
            image: storePath,
            notes,
            status,
            created_by: req.user.user_id,
        }
        const insertQuery = await db.query(`INSERT INTO contacts SET ?`, [insertData]);

        if(insertQuery.affectedRows > process.env.VALUE_ZERO)
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Contact details saved successfully"
                });
        }
        else
        {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: "Error! something went wrong, please try again later"
                });
        }
        
    } 
    catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });    
    }
}

const getAllStoredContacts = async(req, res) => {

    try {
        
        //pagination code for

        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ['companies.company_id','companies.company_name', 'company_types.company_type_name', 'contacts.first_name', 'contacts.last_name', 'contacts.position'];
        const searchConditions = [];

        if (searchData != null && searchData != '') {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY contacts.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
        const query = `SELECT contacts.*, companies.company_name, companies.company_address, company_types.company_type_name FROM contacts LEFT JOIN companies ON companies.company_id = contacts.company_id LEFT JOIN company_types ON company_types.company_type_id = companies.company_type ${
            searchConditions.length > 0 ? `WHERE ${searchConditions.join(' OR ')} ` : ''
        } ${orderLimitQuery}`;

        const queryResult = await db.query(query);
       
        // remove order by limit for totaL PAGINATION COUNT
        const modifiedQueryString = query.substring(0, query.indexOf('ORDER BY'));
        const totalResult = await db.query(modifiedQueryString);

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                
                finalData.push({
                    id: row.id,
                    company_id: row.company_id,
                    company_name: row.company_name,
                    company_address: row.company_address,
                    company_type_name: row.company_type_name,
                    contact_unique_id: row.contact_unique_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    phone: JSON.parse(row.phone),
                    email: JSON.parse(row.email),
                    position: row.position,
                    image: row.image,
                    notes: row.notes,
                    status: row.status,
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: finalData,
                    pageDetails: pageDetails
                });
        }
        else
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Data not found",
                });
        }

    } 
    catch (error) {
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ 
                status: false, 
                message: error.message 
            });
    }
}


const getStoredContactDetailById = async(req, res) => {

    try {
        
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id});

        if(error)
        {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const query = `SELECT contacts.*, companies.company_name, companies.company_address, company_types.company_type_name FROM contacts LEFT JOIN companies ON companies.company_id = contacts.company_id LEFT JOIN company_types ON company_types.company_type_id = companies.company_type WHERE contacts.id = ?`;

        const queryResult = await db.query(query, [id]);
    
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var finalData = [];

            for (const row of queryResult) {
                
                finalData.push({
                    id: row.id,
                    company_id: row.company_id,
                    company_name: row.company_name,
                    company_address: row.company_address,
                    company_type_name: row.company_type_name,
                    contact_unique_id: row.contact_unique_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    phone: JSON.parse(row.phone),
                    email: JSON.parse(row.email),
                    position: row.position,
                    image: row.image,
                    notes: row.notes,
                    status: row.status,
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: finalData[0],
                });
        }
        else
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Data not found",
                });
        }

    } 
    catch (error) {
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ 
                status: false, 
                message: error.message 
            });
    }
}

const updateContacts = async (req, res) => {

    try {

        const {company_id, first_name, last_name, phone, email, position, notes, status, id} = req.body

        const {error} = companyContactValidation.validate(req.body);

        if(error)
        {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        var storePath = ''

        if (req.files != null) {
            const image = req.files.image
            const imageName = Date.now() + image.name
            const uploadPath = process.cwd() + '/public/contact_images/' + imageName;
            storePath = '/contact_images/' + imageName;

            image.mv(uploadPath, async(err, response) => {
                if (err) {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({
                            status: false,
                            message: err.message
                        })
                }
            })
        }

        const updateData = {
            company_id,
            first_name,
            last_name,
            phone: JSON.stringify(phone),
            email: JSON.stringify(email),
            position,
            image: storePath,
            notes,
            status,
            updated_by: req.user.user_id,
            updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        }
        const insertQuery = await db.query(`UPDATE contacts SET ? WHERE id = ?`, [updateData, id]);

        if(insertQuery.affectedRows > process.env.VALUE_ZERO)
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Contact details updated successfully"
                });
        }
        else
        {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: "Error! something went wrong, please try again later"
                });
        }
        
    } 
    catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });    
    }
}

const deleteContactDetailById = async(req, res) => {

    try {
        
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id});

        if(error)
        {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const query = `DELETE FROM contacts WHERE id = ?`;

        const queryResult = await db.query(query, [id]);
    
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Contacts deleted successfully",
                });
        }
        else
        {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: "Error! something went wrong, please try again later",
                });
        }

    } 
    catch (error) {
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ 
                status: false, 
                message: error.message 
            });
    }
}

const getAllPositionOfCompanyContacts = async(req, res) => {

    try {
        
        const queryResult = await db.query('SELECT DISTINCT position FROM contacts');

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: queryResult
                });
        }
        else
        {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Data not found"
                });
        }
    } 
    catch (error) {
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false, 
                message: error.message
            });
    }
}


// send message controller


const sendMessage = async (req, res) => {
    try {
      const { error, value } = sendMessageValidation.validate(req.body);
  
      if (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ status: false, message: error.message });
      }
  
      let {
        user_ids,
        title,
        message,
        date
      } = req.body;

      let created_by = req.user.user_id
      user_ids = JSON.stringify(user_ids)

      const insertQuery = `INSERT INTO contact_messages(user_ids, title, message, date, created_by) VALUES (?, ?, ?, ?, ?)`;
      const queryResult = await db.query(insertQuery, [user_ids, title, message, date, created_by]);
    
      if(queryResult.affectedRows > process.env.VALUE_ZERO){
        return res.status(StatusCodes.OK).json({
        status: true,
        message: "Message received successfully",
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to send message" });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
};

// const getAllMessages = async (req, res) => {
//     try {
//         const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || "";
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         const status = req.query.status;

//         let conditions = []
//         if(status != undefined && status != '' && status != null){
//             conditions.push(`status = '${status}'`)
//         }

//         if(searchData){
//             conditions.push(`(title LIKE '%${searchData}%' OR message LIKE '%${searchData}%')`)
//         }

//         let whereClause = ''
//         whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

//         const selectQuery = `SELECT * FROM contact_messages ${whereClause} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;
//         const queryResult = await db.query(selectQuery);
//         if(queryResult.length == 0){
//             return res.status(StatusCodes.OK).json({
//                 status: false,
//                 message: "Data not found.",
//             });
//         }

//         const modifiedQueryString = selectQuery.substring(0,selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);
//         const pageDetails = await calculatePagination(
//             totalResult.length,
//             currentPage,
//             pageSize
//           );

//         let result = []
//         for(let message_detail of queryResult){
//             let userIds = JSON.parse(message_detail.user_ids)
//             const userData = await getUserDetails(userIds)
//             let users = []
//             for(let user of userData){
//                 const userRole = await db.query('SELECT name FROM roles WHERE id = ?', [user.user_type])
//                 users.push({
//                     id: user.id,
//                     name: user.name,
//                     role_name: userRole[0].name
//                 })
//             }
//             let field = {
//                 id: message_detail.id,
//                 title: message_detail.title,
//                 message: message_detail.message,
//                 date: moment(message_detail.date).format("YYYY-MM-DD"),
//                 status: message_detail.status,
//                 users,
//             }
//             result.push(field)
//         }

//         res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully",  data: result, pageDetails: pageDetails });

//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// }

const getAllMessages = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || "";
        const pageFirstResult = (currentPage - 1) * pageSize;
        const status = req.query.status;
        const upcoming = req.query.upcoming || false;

        let conditions = []
        if (status != undefined && status != '' && status != null) {
            conditions.push(`status = '${status}'`);
        }

        if (searchData) {
            conditions.push(`(title LIKE '%${searchData}%' OR message LIKE '%${searchData}%')`);
        }

        if (upcoming == "true") {
            const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
            conditions.push(`DATE(date) = '${tomorrow}'`);
        }

        let whereClause = ''
        whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const selectQuery = `SELECT * FROM contact_messages ${whereClause} ORDER BY date LIMIT ${pageFirstResult}, ${pageSize}`;
        const queryResult = await db.query(selectQuery);
        if (queryResult.length == 0) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found.",
            });
        }

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
        const pageDetails = await calculatePagination(
            totalResult.length,
            currentPage,
            pageSize
        );

        let result = []
        for (let message_detail of queryResult) {
            let userIds = JSON.parse(message_detail.user_ids);
            const userData = await getUserDetails(userIds);
            let users = [];
            for (let user of userData) {
                const userRole = await db.query('SELECT name FROM roles WHERE id = ?', [user.user_type]);
                users.push({
                    id: user.id,
                    name: user.name,
                    role_name: userRole[0].name
                });
            }
            let field = {
                id: message_detail.id,
                title: message_detail.title,
                message: message_detail.message,
                date: moment(message_detail.date).format("YYYY-MM-DD"),
                status: message_detail.status,
                users,
            }
            result.push(field);
        }

        res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: result, pageDetails: pageDetails });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
}

const getMessageById = async (req, res) => {
    try {
        const id = req.params.id;

        const selectQuery = `SELECT * FROM contact_messages WHERE id = ?`;
        const queryResult = await db.query(selectQuery, [id]);
        if(queryResult.length == 0){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Data not found.",
            })
        }

        for(let message_detail of queryResult){
            let userIds = JSON.parse(message_detail.user_ids)
            const userData = await getUserDetails(userIds)
            let users = []
            for(let user of userData){
                const userRole = await db.query('SELECT name FROM roles WHERE id = ?', [user.user_type])
                users.push({
                    id: user.id,
                    name: user.name,
                    role_name: userRole[0].name
                })
            }

            let field = {
                id: message_detail.id,
                title: message_detail.title,
                message: message_detail.message,
                date: moment(message_detail.date).format("YYYY-MM-DD"),
                status: message_detail.status,
                users,
            }
            return res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully",  data: field });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
}

const updateMessage = async (req, res) => {
    try {
        const { error, value } = updateMessageValidation.validate(req.body);
        if(error){
            return res.status(StatusCodes.OK).json({status: false, message: error.message});
        }

        let { id, user_ids, title, message, date } = req.body;
        user_ids = JSON.stringify(user_ids);
        const updateQuery = `UPDATE contact_messages SET user_ids = ?, title = ?, message = ?, date = ? WHERE id = ?`;
        const queryResult = await db.query(updateQuery, [user_ids, title, message, date, id]);
        if(queryResult.affectedRows > process.env.VALUE_ZERO){
            return res.status(StatusCodes.OK).json({ status: true, message: "Message updated successfully" });
        }
        res.status(StatusCodes.OK).json({ status: false, message: "Something went wrong in updating message" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
}


async function sendEmailsAndNotifications(userData, subject, body) {
    try {
      for (let user of userData) {
        const response = await mailSent(
          process.env.EMAIL,
          user.email,
          subject,
          body
        );
        if (response.status) {
          console.log(response.message);
        } else {
          throw new Error(response.message);
        }
          const notificationData = [
            {
              userId: user.id,
              roleId: user.user_type,
              title: subject,
              message: body,
            },
          ];
          await insertNotifications(notificationData);
      }
    } catch (error) {
      throw new Error(error.message);
    }
}

const deleteMessage = async (req, res) => {
    try {
        const id = req.params.id

        const deleteQuery = `UPDATE contact_messages SET deleted = 1 WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, [id]);

        if(queryResult.affectedRows > process.env.VALUE_ZERO){
            return res.status(StatusCodes.OK).json({ status: true, message: "Message deleted successfully" });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: "Something went wrong in deleting message" });
    } catch (error) {
        
    }
}

async function sendBirthdayGreeting(today){
    try {
        const selectQuery = `SELECT * FROM users WHERE DATE_FORMAT(dob,'%m-%d') = ?`; 
        const queryResult = await db.query(selectQuery, [today]);

        const title = 'Happy Birthday!';
        const message = 'Wishing you a very happy birthday.';
        if(queryResult.length > process.env.VALUE_ZERO){
            await sendEmailsAndNotifications(queryResult, title, message);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

cron.schedule("*/2 * * * *", async () => {
	try {
	  // 1. get all messages from contact_messages table
	  const today = moment().format("YYYY-MM-DD");
      await sendBirthdayGreeting(today);
	  const query = `SELECT * FROM contact_messages WHERE date = ? AND status = 0`;
	  const queryResult = await db.query(query, [today]);
	  
	  if(queryResult.length > process.env.VALUE_ZERO){
		  for(let message_detail of queryResult){
			const userIds = JSON.parse(message_detail.user_ids);
			  // 2. get all users from users table
			const userData = await getUserDetails(userIds);
			// 3. send email and notification
			await sendEmailsAndNotifications(userData, message_detail.title, message_detail.message);
			// 4. update contact_messages table
			const updateQuery = `UPDATE contact_messages SET status = 1 WHERE id = ?`;
			await db.query(updateQuery, [message_detail.id]);
		  }
	  }

      console.log("message sending cron job executed successfully");
  
	} catch (error) {
	  console.error(error.message);
	}
});


module.exports = {createContacts, getAllStoredContacts, getStoredContactDetailById, updateContacts, deleteContactDetailById, getAllPositionOfCompanyContacts, updateMessage, getMessageById, getAllMessages, sendMessage, deleteMessage}