var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, surveyValidations } = require('../helpers/validation');
const { getSurveyQuestions, getCreatedUserNameFromAdmin, getAssignFromAdmin, getAssignToSubUser, getUserDetails, getQuestionList, calculatePagination} = require('../helpers/general')
const Joi = require('joi');
const { assign } = require('nodemailer/lib/shared');

const createSurvey = async (req, res) => {

    try {
        const { title, description, format, questions } = req.body
        const { error } = surveyValidations.validate({ title: title, description: description, format: format })
        if (error) return res.status(403).json({ status: false, message: error.message })

        const createdBy = req.user.user_id
        const insertQuery = `INSERT INTO survey(title, description, format, status, created_by) VALUES('${title}', '${description}', '${format}',  '1', '${createdBy}')`

        db.query(insertQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: err })

            if (result.affectedRows > process.env.VALUE_ZERO) {
                const surveyId = result.insertId
                for (let i = 0; i < questions.length; i++) {
                    const questionFormat = JSON.stringify(questions[i])
                    
                    const insertQuestionQuery = `INSERT INTO survey_questions(survey_id, question, created_by) VALUES('${surveyId}', '${questionFormat}', '${createdBy}')`
                    const insertQuestionResult = await db.query(insertQuestionQuery)
                }
                res.status(200).json({ status: true, message: "Survey created successfully" })
            }
            else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again later" })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

const getAllSurvey = async (req, res) => {

    try {
        const user_type = req.user.user_type;
        const user_id = req.user.user_id;       

        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(survey.id) as total FROM survey WHERE survey.assign_to IS NULL AND survey.assign_to_sub_user IS NULL AND survey.status != 0`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        var whereCond = "";
        if (searchData != null && searchData != '') {          
            whereCond =`AND survey.title LIKE '%${searchData}%'`;
        
        }
        if (user_type!=1) {          
            whereCond +=` AND survey.created_by = '${user_id}'`;
        }

        var selectAllSurveyQuery = `SELECT * FROM survey WHERE survey.assign_to IS NULL AND survey.assign_to_sub_user IS NULL AND survey.status != 0 ${whereCond} ORDER BY survey.id DESC LIMIT ${pageFirstResult} , ${pageSize}`

        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: err })

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        created_by: await getCreatedUserNameFromAdmin(element.created_by),
                        assign_to: await getAssignFromAdmin(element.assign_to),
                        assign_to_sub_user: await getAssignToSubUser(element.assign_to_sub_user),
                        survey_questions: await getSurveyQuestions(element.id),
                        created_at: moment(element.created_at).format('DD-MM-YYYY'),
                    }
                });

                Promise.all(final).then((values) => {

                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult })

                    res.status(200).json({ status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails[0] })
                })
            }
            else {
                return res.status(200).json({ status: false, message: "Data not found" })
            }

        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const getSurveyById = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message })

        const selectSurveyByIdQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.created_by, survey.status,survey.assign_to, survey.assign_to_sub_user , survey.format FROM survey WHERE id='${id}'`

        db.query(selectSurveyByIdQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err })

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        created_by_name: await getCreatedUserNameFromAdmin(element.created_by),
                        survey_questions: await getSurveyQuestions(element.survey_id)
                    }
                })

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully", data: values[0] })
                })
            }
            else {
                return res.status(403).json({ status: false, message: "Data not found" })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const editSurveyDetails = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message })

        const selectSurveyByIdQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.created_by,survey.status FROM survey WHERE id='${id}'`

        db.query(selectSurveyByIdQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err })

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        survey_questions: await getSurveyQuestions(element.survey_id)

                    }
                })

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully", data: values[0] })
                })
            }
            else {
                return res.status(403).json({ status: false, message: "Data not found" })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


const updateSurveyDetails = async (req, res) => {

    try {
        const { title, description, format, questions, id } = req.body
        const { error } = surveyValidations.validate({ title: title, description: description, format: format })
        if (error) return res.status(403).json({ status: false, message: error.message })

        const { error: idErrorCheck } = checkPositiveInteger.validate({ id: id })
        if (idErrorCheck) return res.status(403).json({ status: false, message: idErrorCheck.message })

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const updateQuery = `UPDATE survey SET title='${title}', description='${description}', updated_at='${updatedAt}' WHERE id='${id}'`;

        const createdBy = req.user.user_id;
        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err })

            if (result.affectedRows > process.env.VALUE_ZERO) {
                // const getQuestionsId = `SELECT id FROM survey_questions where survey_id='${id}'`
                // const questionIds = await db.query(getQuestionsId)
                // const ids = [];
                // for (let j = 0; j < questionIds.length; j++) {
                //     ids.push(questionIds[j]);
                // }

                const getQuestionsId = `DELETE FROM survey_questions where survey_id='${id}'`
                const questionIds = await db.query(getQuestionsId)

                for (let i = 0; i < questions.length; i++) {
                    // const resultFormatIds = JSON.stringify(ids[i])
                    // const jsonParsedIds = JSON.parse(resultFormatIds).id

                    const questionFormat = JSON.stringify(questions[i])
                    
                    // const insertQuestionQuery = `UPDATE survey_questions SET question='${questionFormat}', updated_at='${updatedAt}' WHERE id='${jsonParsedIds}'`
                    // const insertQuestionResult = await db.query(insertQuestionQuery)

                    const insertQuestionQuery = `INSERT INTO survey_questions(survey_id, question, created_by) VALUES('${id}', '${questionFormat}', '${createdBy}')`
                    const insertQuestionResult = await db.query(insertQuestionQuery)
                }

                res.status(200).json({ status: true, message: "Survey details updated successfully" })
            }
            else {
                return res.status(403).json({ status: false, message: "Something went wrong, please try again later" })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const deleteSurvey = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id: id });
        if (error) return res.status(403).json({ status: false, message: error.message })

        const deleteQuery = `UPDATE survey SET status='0' WHERE id='${id}'`

        db.query(deleteQuery, async (err, result) => {
            if (err) return res.status(500).json({ status: false, message: err })

            if (result.affectedRows > process.env.VALUE_ZERO) {
                res.status(200).json({ status: true, message: "Survey deleted successfully" })
            }
            else {
                return res.status(500).json({ status: false, message: "Something went wrong, please try again later" })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


const getAssignedSurvey = async (req, res) => {

    try {
     
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;

        
        const countSelectQuery = `SELECT COUNT(survey.id) as total FROM survey WHERE (survey.assign_to IS NOT NULL OR survey.assign_to_sub_user IS NOT NULL)`      
        const constTotalLength = await db.query(countSelectQuery);

        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = "";
        if (searchData != null && searchData != '') {
            searchDataCondition = `AND survey.title LIKE '%${searchData}%'`;
        }
     
        const selectAllSurveyQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.status, survey.assign_to, survey.assign_to_sub_user, survey.created_by FROM survey WHERE (survey.assign_to IS NOT NULL OR survey.assign_to_sub_user IS NOT NULL) ${searchDataCondition} ORDER BY survey.id DESC LIMIT ${pageFirstResult}, ${pageSize} `      
     
        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: err })

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        created_by: await getCreatedUserNameFromAdmin(element.created_by),
                        assign: await getAssignFromAdmin(element.assign_to),
                        assign_to_sub_user: await getAssignToSubUser(element.assign_to_sub_user),
                        survey_questions: await getSurveyQuestions(element.survey_id)
                    }
                });

                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult })

                    res.status(200).json({ status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails[0]})
                })
            }
            else {
                return res.status(200).json({ status: false, message: "Data not found" })
            }

        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


const getRequestedSurvey = async (req, res) => {

    try {
        const superAdminRoleId = process.env.SUPER_ADMIN_ROLE_ID;
        const status = req.query.status;
        const selectAllSurveyQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.status, survey.assign_to, survey.assign_to_sub_user, survey.created_by FROM survey WHERE survey.created_by !='${superAdminRoleId}' AND survey.status = '${status}'`


        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: err })

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        requested_by: await getCreatedUserNameFromAdmin(element.created_by)
                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully", data: values })
                })
            }
            else {
                return res.status(200).json({ status: false, message: "Data not found" })
            }

        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const getSurveyQuestionResponse = async (req, res) => {

    try {

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1 ;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        var search_cond= "";
        if(searchData!=""){
            search_cond=`WHERE survey.title like '%${searchData}%'`;
        }
        const countSelectQuery = `SELECT COUNT(id) as total FROM survey_question_responses`
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        const selectAllSurveyQuery = `SELECT survey_question_responses.*, survey.title as survey_title, survey.created_by, IFNULL(survey.assign_to,0) as assign_to, IFNULL(survey.assign_to_sub_user,0) as assign_to_sub_user
        FROM survey_question_responses
        LEFT JOIN survey ON survey_question_responses.survey_id = survey.id 
        ${search_cond} ORDER BY survey_question_responses.id DESC LIMIT ${pageFirstResult}, ${pageSize};`;

        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: err })

            if (result.length > process.env.VALUE_ZERO) {
                const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult})

                const final = result.map(async (element) => {
                    return {
                        ...element,
                        created_by: await getCreatedUserNameFromAdmin(element.created_by),
                        assign_to: await getAssignFromAdmin(element.assign_to),
                        assign_to_sub_user: await getAssignToSubUser(element.assign_to_sub_user),
                        question_response_by: await getUserDetails(element.response_by),
                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully", data: values,pageDetails: pageDetails[0] })
                })
            }
            else {
                return res.status(200).json({ status: false, message: "Data not found" })
            }

        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const assignToSurvey = async (req, res) => {

    try {
        const { survey_id, assign_to } = req.body;

        const formValidate = Joi.object({
            survey_id: Joi.number().required(),
            assign_to: Joi.number().required(),
        }).options({ allowUnknown: true });

        const { error } = formValidate.validate(req.body)
        if (error) return res.status(403).json({ status: false, message: error.message });

        const assignQuery = `UPDATE survey SET assign_to = ? WHERE id = ?`
        const queryResult = await db.query(assignQuery, [assign_to, survey_id]);

        if (queryResult.affectedRows > 0) {
            res.status(200).json({ status: true, message: "Survey assigned successfully" })
        }
        else {
            res.status(403).json({ status: false, message: "Error! survey not assigned" })
        }
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const updateRequestedSurveyStatus = async (req, res) => {

    try {

        const { survey_id, status } = req.body;

        const formValidation = Joi.object({

            survey_id: Joi.number().required(),
            status: Joi.number().required(),

        }).options({ allowUnknown: true });

        const { error } = formValidation.validate(req.body);

        if (error) return res.status(403).json({ status: false, message: error.message })

        const approvedQuery = `UPDATE survey SET status = ? WHERE id = ?`

        const queryResult = await db.query(approvedQuery, [status, survey_id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Survey status changed successfully" })
        }
        else {
            res.status(403).json({ status: false, message: "Error! survey status not changed" })
        }
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


const surveyQuestionFormResponse = async (req, res) => {

    try {
        
        const {survey_id, question_id, response} = req.body;

        const formValidation = Joi.object({
            survey_id: Joi.number().required(),
            question_id: Joi.required(),
            response: Joi.required()
        })

        const {error} = formValidation.validate(req.body)

        if(error)
        return res.status(403).json({ status: false, message: error.message });
        
        const answerSubmitQuery = `INSERT INTO survey_question_responses(survey_id, question_id, response, response_by) VALUES(?, ?, ?, ?)`
        
        const response_by = req.user.user_id;
        const questionResponseFormat = {response};
        const responseJSONString = JSON.stringify(questionResponseFormat);
        
        const insertValues = [survey_id, JSON.stringify(question_id), responseJSONString, response_by];
        
        const queryResult = await db.query(answerSubmitQuery, insertValues);
        
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(200).json({status: true, message: "Response submitted successfully"})
        }
        else
        {
            res.status(403).json({status: true, message: "Error! response not submitted"})
        }

    } catch (error) 
    {
        return res.status(500).json({ status: false, message: error.message });    
    }
}


const otpSendSurvey = async(req, res)=>{
    try{
        const { id, mobile }  = req.body;
        const updateQuery = `UPDATE survey SET otp='123456' WHERE id='${id}'`
        const queryResult = await db.query(updateQuery);
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Otp send successfully" })
        }else {
            res.status(403).json({ status: false, message: "Error! Otp send unsuccessfully" })
        }
    }catch(error){
        return res.status(500).json({ status:false, message:error.message });
    }
}

const VerifyOtpSurvey = async(req, res)=>{
    try{
        const { id, otp }  = req.body;
        const selectQuery = `select * FROM survey WHERE id='${id}' and otp='${otp}'`
        const selectResult = await db.query(selectQuery);
        if (selectResult.length > process.env.VALUE_ZERO) {
            res.status(200).json({ status: true, message: "Otp Verify successfully" })
        }else {
            res.status(403).json({ status: false, message: "Error! Otp Verify unsuccessfully" })
        }
    }catch(error){
        return res.status(500).json({ status:false, message:error.message });
    }
}


// const getSurveyResponseById = async(req, res)=>{
//     try{
//         const id = req.params.id;
//         const selectAllSurveyQuery = `SELECT survey_question_responses.*,survey.format, survey.title as survey_title, survey.created_by, IFNULL(survey.assign_to,0) as assign_to, IFNULL(survey.assign_to_sub_user,0) as assign_to_sub_user
//         FROM survey_question_responses
//         LEFT JOIN survey ON survey_question_responses.survey_id = survey.id
//         WHERE survey.id="${id}";`;

//         console.log("selectAllSurveyQuery", selectAllSurveyQuery)
//         db.query(selectAllSurveyQuery, async (error, result) => {
//             if (error) return res.status(500).json({ status: false, message: err })

//             if (result.length > process.env.VALUE_ZERO) {
//                 result[0].created_by = await getCreatedUserNameFromAdmin(result[0].created_by);
//                 result[0].assign_to = await getCreatedUserNameFromAdmin(result[0].assign_to);
//                 result[0].assign_to_sub_user = await getCreatedUserNameFromAdmin(result[0].assign_to_sub_user);
//                 result[0].question_response_by = await getCreatedUserNameFromAdmin(result[0].response_by);
//                 result[0].response = JSON.parse(result[0].response);
//                 result[0].question_list = await getQuestionList(JSON.parse(result[0].question_id));

//                 res.status(200).json({ status: true, message: "Fetched successfully", data: result });               
//             }
//             else {
//                 return res.status(500).json({ status: false, message: "Data not found" })
//             }

//         })
//     }catch(error){
//         return res.status(500).json({ status:false, message:error.message });
//     }
// }

// const getSurveyResponseById = async(req, res) => {
//     try {
//         const id = req.params.id;
//         const selectAllSurveyQuery = `
//             SELECT survey_question_responses.*, 
//                    survey.format, 
//                    survey.title as survey_title, 
//                    survey.created_by, 
//                    IFNULL(survey.assign_to, 0) as assign_to, 
//                    IFNULL(survey.assign_to_sub_user, 0) as assign_to_sub_user
//             FROM survey_question_responses
//             LEFT JOIN survey ON survey_question_responses.survey_id = survey.id
//             WHERE survey.id = "${id}";
//         `;
        
//         db.query(selectAllSurveyQuery, async (error, result) => {
//             if (error) return res.status(500).json({ status: false, message: error.message });

//             if (result.length > process.env.VALUE_ZERO) {
//                 const mappedResults = await Promise.all(result.map(async (row) => {
//                     row.created_by = await getCreatedUserNameFromAdmin(row.created_by);
//                     row.assign_to = await getCreatedUserNameFromAdmin(row.assign_to);
//                     row.assign_to_sub_user = await getCreatedUserNameFromAdmin(row.assign_to_sub_user);
//                     row.question_response_by = await getCreatedUserNameFromAdmin(row.response_by);
//                     row.response = JSON.parse(row.response);
//                     row.question_list = await getQuestionList(JSON.parse(row.question_id));
//                     return row;
//                 }));

//                 res.status(200).json({ status: true, message: "Fetched successfully", data: mappedResults });
//             } else {
//                 return res.status(500).json({ status: false, message: "Data not found" });
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ status: false, message: error.message });
//     }
// };


// const getSurveyResponseById = async(req, res) => {
//     try {
//         const id = req.params.id;
//         const selectAllSurveyQuery = `
//             SELECT survey_question_responses.*, 
//                    survey.format, 
//                    survey.title as survey_title, 
//                    survey.created_by, 
//                    IFNULL(survey.assign_to, 0) as assign_to, 
//                    IFNULL(survey.assign_to_sub_user, 0) as assign_to_sub_user
//             FROM survey_question_responses
//             LEFT JOIN survey ON survey_question_responses.survey_id = survey.id
//             WHERE survey.id = "${id}";
//         `;

        
//         db.query(selectAllSurveyQuery, async (error, result) => {
//             if (error) return res.status(500).json({ status: false, message: error.message });

//             if (result.length > process.env.VALUE_ZERO) {
//                 const mappedResults = await Promise.all(result.map(async (row) => {
//                     row.created_by = await getCreatedUserNameFromAdmin(row.created_by);
//                     row.assign_to = await getCreatedUserNameFromAdmin(row.assign_to);
//                     row.assign_to_sub_user = await getCreatedUserNameFromAdmin(row.assign_to_sub_user);
//                     row.question_response_by = await getCreatedUserNameFromAdmin(row.response_by);
//                     row.response = JSON.parse(row.response);
//                     row.question_list = await getQuestionList(JSON.parse(row.question_id));

//                     // Combine questions with corresponding answers
//                     row.questions_with_answers = row.question_list.map((question, index) => {
//                         return {
//                             question: question.question.question.title,
//                             answer: row.response.response[index] ? row.response.response[index].answer : null
//                         };
//                     });

//                     return row;
//                 }));

//                 res.status(200).json({ status: true, message: "Fetched successfully", data: mappedResults });
//             } else {
//                 return res.status(500).json({ status: false, message: "Data not found" });
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ status: false, message: error.message });
//     }
// };


const getSurveyResponseById = async(req, res) => {
    try {
        const id = req.params.id;
        const selectAllSurveyQuery = `
            SELECT survey_question_responses.*, 
                   survey.format, 
                   survey.title as survey_title, 
                   survey.created_by, 
                   IFNULL(survey.assign_to, 0) as assign_to, 
                   IFNULL(survey.assign_to_sub_user, 0) as assign_to_sub_user
            FROM survey_question_responses
            LEFT JOIN survey ON survey_question_responses.survey_id = survey.id
            WHERE survey.id = "${id}";
        `;
        
        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: error.message });

            if (result.length > process.env.VALUE_ZERO) {
                const mappedResults = await Promise.all(result.map(async (row) => {
                    row.created_by = await getCreatedUserNameFromAdmin(row.created_by);
                    row.assign_to = await getCreatedUserNameFromAdmin(row.assign_to);
                    row.assign_to_sub_user = await getCreatedUserNameFromAdmin(row.assign_to_sub_user);
                    row.question_response_by = await getCreatedUserNameFromAdmin(row.response_by);
                    row.response = JSON.parse(row.response);
                    row.question_list = await getQuestionList(JSON.parse(row.question_id));

                    // Combine questions with corresponding answers
                    row.questions_with_answers = row.question_list.map((question, index) => {
                        // Assuming 'question.question' contains the question details.
                        return {
                            question: question.question,
                            answer: row.response.response[index] ? row.response.response[index].answer : null
                        };
                    });

                    return row;
                }));

                res.status(200).json({ status: true, message: "Fetched successfully", data: mappedResults });
            } else {
                return res.status(500).json({ status: false, message: "Data not found" });
            }
        }); 
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};


/** approve or reject survey based on status */
const approveRejectSurveyByStatus = async(req, res)=>{
    try{
        const id = req.query.id;
        const status = req.query.status;
        
        // Check if status is either '2' or '3'
        if (status === '2' || status === '3') {
            const updateQuery = `UPDATE survey SET status = ? WHERE id = ?`;

            await db.query(updateQuery, [status, id]);

            const message = status === '2' ? 'Survey approved successfully' : 'Survey rejected successfully';
            return res.status(200).json({ status: true, message });
        } else {
            return res.status(400)
                .json({ 
                    status: false, 
                    message: 'Invalid status' 
                });
        }
    }catch(error){
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ 
                status:false, 
                message:error.message 
        });
    }
}


// changes by nilanjan

/** get all requested survey based on status */
const getAllRequestedSurvey = async (req, res) => {

    try {
        const superAdminRoleId = process.env.SUPER_ADMIN_ROLE_ID
        const status = req.query.status || '';
        
        const selectAllSurveyQuery = `
        SELECT survey.id as survey_id, survey.title, survey.description, survey.status, survey.assign_to, survey.assign_to_sub_user, survey.created_by 
        FROM survey 
        WHERE survey.created_by !='${superAdminRoleId}' AND survey.status = ${status}`

        db.query(selectAllSurveyQuery, async (error, result) => {
            if (error) return res.status(500).json({ status: false, message: err })

            if (result.length > process.env.VALUE_ZERO) {
                const final = result.map(async (element) => {
                    return {
                        ...element,
                        requested_by: await getCreatedUserNameFromAdmin(element.created_by)
                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({ status: true, message: "Fetched successfully", data: values })
                })
            }
            else {
                return res.status(200).json({ status: false, message: "Data not found" })
            }

        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




/**New Function to create  survey */

const createSurveyNew = async (req, res)=>{
    try {
        const {survey_data , assigned_to } = req.body;
        const checkRecord = await getRecord
        if(! checkRecord[0]){
            return res.status(400).json({ status: false, message: 'Assigned User not exists' });
        }
        const CreateQuery = `INSERT INTO survey_new (survey_data, assigned_to, status) VALUES(?, ?, ?)`;
        const insertedData = await db.query(CreateQuery, [JSON.stringify(survey_data), assigned_to , "assigned"])
        if(insertedData.insertId > 0){
            return res.status(200).json({ status: true, message: 'Survey created successfully' });
        }else{
            return res.status(400).json({ status: false, message: 'Failed to create survey' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}


/**New Function to get survey*/

const getAllSurveyNew = async (req, res)=>{
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1 ;
        const searchData = req.query.search || '';
        const statusFilter = req.query.status ?  ` AND status = '${req.query.status}'` :  ''
        const pageFirstResult = (currentPage - 1) * pageSize;
        let whereCondition = "";
        if (searchData != null && searchData != '') {          
            whereCondition =`AND survey_new.survey_data LIKE '%${searchData}%'`;
        
        }
        const surveyNewQuery = `SELECT * FROM survey_new WHERE deleted = 0 ${whereCondition} ${statusFilter} ORDER BY survey.id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        const recordList = await db.query(surveyNewQuery);
        const totalRecordQueries = surveyNewQuery.substring(0, selectQuery.indexOf("ORDER BY"))        
        const totalRecord  = await db.query(totalRecordQueries)
        const paginationDetails = await calculatePagination(totalRecord.length, currentPage, pageSize);
        return res.status(200).json({
            status: true,
            message: "Request fetched successfully",
            data: recordList,
            pageDetails: paginationDetails
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

module.exports = { createSurvey, getAllSurvey, getSurveyById, editSurveyDetails, updateSurveyDetails, deleteSurvey, getAssignedSurvey, getRequestedSurvey, getSurveyQuestionResponse, assignToSurvey, updateRequestedSurveyStatus, surveyQuestionFormResponse, otpSendSurvey, VerifyOtpSurvey, getSurveyResponseById, getAllRequestedSurvey, createSurveyNew , getAllSurveyNew }
