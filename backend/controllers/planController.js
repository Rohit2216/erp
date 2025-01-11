var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, planValidations, adminCreateValidation} = require('../helpers/validation');
const {getPlanModuleById, getPlanCheckLists} = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const { generatePanelIdForAdmin } = require('../helpers/panelHelper');
const {getPlanDetailById} = require('../helpers/commonHelper');


const createPlan = async (req, res) => {

    try 
    {
        const {name, price, duration, description, module, planCheckLists, submodule , subsubmodule} = req.body
        const {error} = planValidations.validate({name: name, price: price, duration: duration, description: description})
        if(error) return res.status(200).json({status: false, message: error.message})

        const moduleJson = JSON.stringify(module);
        const createdBy = req.user.user_id
        var storePath = ''

        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/plan_images/' + imageName;
            storePath = '/plan_images/' + imageName;
            image.mv(uploadPath, (err, response) => {

                if (err) return res.status(200).json({status: false, message: err.message});
            })
        }
        const insertQuery = `INSERT INTO plans (name, price, duration, description, module, image, created_by) VALUES('${name}', '${price}', '${duration}', '${description}', '${moduleJson}', '${storePath}', '${createdBy}')`
        
        db.query(insertQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const PlanId = result.insertId
                if(planCheckLists != null)
                {
                    const formateCheckList = JSON.parse(planCheckLists);
                   
                    for(let i = 0; i < formateCheckList.length; i++)
                    {
                        const checkList = formateCheckList[i];
                       
                        const checkListQuery = `INSERT INTO plan_checklists (plan_id, checklist_name, created_by) VALUES('${PlanId}', '${checkList}', '${createdBy}')`
                        const result = await db.query(checkListQuery)
                    }
                }
                res.status(200).json({status: true, message: "Plans created successfully"})
            }
            else
            {
                return res.status(200).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getAllPlans = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM plans`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var query = `SELECT * FROM plans WHERE name LIKE '%${searchData}%' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }
        else
        {
            var query = `SELECT * FROM plans ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }

        db.query(query, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {                    
                const final = result.map( async (element) => {
                    return {...element,
                        planCheckLists: await getPlanCheckLists(element.id),
                        modules: await getPlanModuleById(element.module)
                    }
                });

                 const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult})

                Promise.all(final).then( (values) => {
                    res.status(200).json({status: true, message: 'Fetched successfully', data: values, pageDetails: pageDetails[0]})
                }) 
            }
            else
            {
                return res.status(200).json({status: false, message: "Data not found"})
            }
        })    
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});     
    }
}

const getPlanById = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const query = `SELECT id, name, price, duration, description, module, created_at, image FROM plans WHERE id='${id}'`
        db.query(query, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.length > process.env.VALUE_ZERO)
            {                    
                const final = result.map( async (element) => {

                    return {...element,
                        planCheckLists: await getPlanCheckLists(element.id),
                        modules: await getPlanModuleById(element.module)
                    }
                });

                Promise.all(final).then( (values) => {
                    res.status(200).json({status: true, message: 'Fetched successfully', data: values[0]})
                }) 
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        }) 
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const updatePlanDetails = async (req, res) => {

    try 
    {
        const {name, price, duration, description, module, planCheckLists, image, id} = req.body
        const {error} = planValidations.validate({name: name, price: price, duration: duration, description: description})
        if(error) return res.status(400).json({status: false, message: error.message})

       
        const {error: idValidateError} = checkPositiveInteger.validate({id: id})
        if(idValidateError) return res.status(400).json({status: false, message: idValidateError.message})
      
        const moduleJson = JSON.stringify(module)
        const createdBy = req.user.user_id
        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        var storePath = ''

        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/plan_images/' + imageName;
            storePath = '/plan_images/' + imageName;
            image.mv(uploadPath, (err, response) => {

                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }
        else
        {
            storePath = image
        }

        const updateQuery = `UPDATE plans SET name='${name}', price='${price}', duration='${duration}', description='${description}', module='${moduleJson}', image='${storePath}', updated_at='${updatedAt}' WHERE id='${id}'`
       
        db.query(updateQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const PlanId = id
                if(planCheckLists != null)
                {
                    const deletePlanExistQuery = await db.query(`DELETE FROM plan_checklists WHERE plan_id = ?`, [id])
                    const formateCheckList = JSON.parse(planCheckLists);
                    
                    if(deletePlanExistQuery.affectedRows > process.env.VALUE_ZERO)
                    {
                        for(let i = 0; i < formateCheckList.length; i++)
                        {
                            const checkList = formateCheckList[i];
                            const checkListQuery = `INSERT INTO plan_checklists (plan_id, checklist_name, created_by) VALUES('${id}', '${checkList}', '${createdBy}')`
                            const result = await db.query(checkListQuery)
                        }
                    }
                    else
                    {
                        res.status(403).json({status: false, message: "Error! plan checklist not updated"})
                    }
                }
                res.status(200).json({status: true, message: "plans updated successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const deletePlan = async (req, res) => {

    try 
    { 
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const query = `DELETE FROM plans WHERE id='${id}'`
        db.query(query, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const deletePlanExistQuery = await db.query(`DELETE FROM plan_checklists WHERE plan_id = ?`, [id])

                res.status(200).json({status: true, message: "Plan deleted successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const buyPlan = async(req, res) => {

    try {
        const {name, email, password, contact_no, alt_number, address_1, country, city, pin_code, description, gst_number, pan_number, plan_id, amount} = req.body;

        const {error} = adminCreateValidation.validate(req.body);

        if(error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        // get plan details and match db plan amount or requested plan amount
        const planDetails = await getPlanDetailById(plan_id);
        if(planDetails.length > 0)
        {
            const plan = planDetails[0];

            if(plan.price != amount)
            {
                return res.status(StatusCodes.BAD_REQUEST).json({status: false, message: 'Amount is not valid for that plan, please check again.'});
            }
        }
        else
        {
            return res.status(StatusCodes.BAD_REQUEST).json({status: false, message: 'Oops! Please Select Valid plan'});
        }
        const checkUniqueGstNumber = `SELECT gst_number FROM admins WHERE gst_number=? `
        const checkUniqueGstNumberQueryResult = await db.query(checkUniqueGstNumber, [gst_number])

        const checkUniquePanNumber = `SELECT  pan_number FROM admins WHERE pan_number=? `
        const checkUniquePanNumberQueryResult = await db.query(checkUniquePanNumber, [pan_number])

        if(checkUniqueGstNumberQueryResult.length > process.env.VALUE_ZERO )
        {
            return res.status(403).json({status: false, message: "Gst number must be unique"})
        }

        if(checkUniquePanNumberQueryResult.length > process.env.VALUE_ZERO )
        {
            return res.status(403).json({status: false, message: "Pan number must be unique"})
        }

        const user_type = process.env.CONTRACTOR_ROLE_ID
        var storePath = ''

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

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const panel_id = await generatePanelIdForAdmin(user_type,name);

        const insertQuery = `INSERT INTO admins (name, email, password, contact_no, alt_number, user_type, address_1, country, city, pin_code, image, description, gst_number, pan_number, status, created_by, panel_id, plan_id) VALUES('${name}', '${email}', '${hashPassword}', '${contact_no}', '${alt_number}', '${user_type}', '${address_1}', '${country}', '${pin_code}', '${city}', '${storePath}', '${description}', '${gst_number}', '${ pan_number}', '0', '0', '${panel_id}', '${plan_id}')`

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({status: false, message: err});

            if(result.insertId > process.env.VALUE_ZERO)
            {
                return res.status(StatusCodes.OK).json({status: true, message: 'Contractor Created Successfully'});
            }
            else
            {
                return res.status(StatusCodes.BAD_REQUEST).json({status: false, message: 'Something went wrong, please try again later'});
            }
        })

    } catch (error) {
        
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false, 
                message: error.message
            })
    }
}

module.exports = {createPlan, getAllPlans, getPlanById, updatePlanDetails, deletePlan, buyPlan}