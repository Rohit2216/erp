var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, adminCreateValidation, contractorValidations, contractorValidationsForUpdate} = require('../helpers/validation');
const {getContractorUsersById, getPendingContractorUsersById, getRecord} = require('../helpers/general');
const { generatePanelIdForAdmin } = require('../helpers/panelHelper');
var Buffer = require('buffer/').Buffer
const Joi = require("joi");


const contractorCreate = async (req, res) => {

    try 
    {     
        const {name, email, password, contact_no, alt_number, address_1, country, city, pin_code, description, gst_number, pan_number, status} = req.body
        const {error} = contractorValidations.validate({name: name, email: email, password: password, contact_no: contact_no})
        if(error) return res.status(400).json({status: false, message: error.message})

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

        const created_by = req.user.user_id
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
        // const [planRecord] = await getRecord("plans", "id", plan_id);
        // if(!planRecord){
        //     return res.status(400).json({status: false, message: 'Invalid Plan ID'})
        // }
        const daysObject = {
            "week": 7,
            "month":30,
            "year": 365
        }
        //  let plan_expire_date = new Date();
        //  plan_expire_date.setDate(plan_expire_date.getDate() + daysObject[planRecord.duration]);
        //  plan_expire_date = plan_expire_date.toISOString().split('T')[0];
        const insertQuery = `INSERT INTO admins (name, email, password, contact_no, alt_number, user_type, address_1, country, city, pin_code, image, description, gst_number, pan_number, status, created_by, panel_id) VALUES('${name}', '${email}', '${hashPassword}', '${contact_no}', '${alt_number}', '${user_type}', '${address_1}', '${country}', '${pin_code}', '${city}', '${storePath}', '${description}', '${gst_number}', '${ pan_number}', '${status}', '${created_by}', '${panel_id}')`

        db.query(insertQuery, async (err, result) => {
            if (err) return res.status(500).json({status: false, message: err});

            if(result.insertId > process.env.VALUE_ZERO)
            {
                return res.status(200).json({status: true, message: 'Contractor Created Successfully'})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
        })
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getContractorById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const selectQuery = `SELECT id as admin_id, name, email, contact_no, alt_number, address_1, country, city, pin_code, description, image, status FROM admins WHERE id='${id}' AND user_type ='${process.env.CONTRACTOR_ROLE_ID}' AND is_deleted = '0'`

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({status: false, message: err})

            db.query(selectQuery, async (err, result) => {
                if (err) return res.status(403).json({status: false, message: err})

                if(result.length > process.env.VALUE_ZERO)
                {
                    return res.status(200).json({status: true, message: "Fetched successfully", data: result[0]})
                }
                else
                {
                    return res.status(404).json({status: false, message: "Contractor not found"})
                }
            })

        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const updateContractorDetailsById = async (req, res) =>{

    try 
    {
        const {name, email, contact_no, alt_number, address_1, country, city, pin_code, description, id, type, status, joining_date, gst_number, pan_number} = req.body
      
        const {error} = contractorValidationsForUpdate.validate({name:name, email:email, contact_no:contact_no})
        if(error) return res.status(400).json({status: false, message: error.message})
        const {error: formError} = checkPositiveInteger.validate({id: id})
        if(formError) return res.status(400).json({status: false, message: formError})
        
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
        
        var storePath = ''
        var updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        if(type == 'Contractor')
        {

       
            if(req.files != null)
            {
                const image = req.files.image
                const imageName = Date.now()+image.name
                const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
                storePath = '/user_images/' + imageName;
                image.mv(uploadPath, (err, response) => {

                    if (err) return res.status(400).json({status: false, message: err.message});

                })

                var  updateQuery = `UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', alt_number='${alt_number}', address_1='${address_1}', country='${country}', city='${city}', pin_code='${pin_code}', description='${description}', image='${storePath}', updated_at='${updatedAt}', status='${status}', gst_number='${gst_number}', pan_number='${ pan_number}' WHERE id='${id}'`;
            }
            else
            {
                var  updateQuery = `UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', alt_number='${alt_number}', address_1='${address_1}', country='${country}', city='${city}', pin_code='${pin_code}', description='${description}', updated_at='${updatedAt}', status='${status}', gst_number='${gst_number}', pan_number='${ pan_number}' WHERE id='${id}'`;
            }
        }
        else
        {
            if(req.files != null)
            {
                const image = req.files.image
                const imageName = Date.now()+image.name
                const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
                storePath = '/user_images/' + imageName;
                image.mv(uploadPath, (err, response) => {

                    if (err) return res.status(400).json({status: false, message: err.message});

                })

                var  updateQuery = `UPDATE users SET name='${name}', email='${email}', mobile='${contact_no}', status='${status}', joining_date='${joining_date}', image='${storePath}', updated_at='${updatedAt}' WHERE id='${id}'`;
            }
            else
            {
                var  updateQuery = `UPDATE users SET name='${name}', email='${email}', mobile='${contact_no}', status='${status}', joining_date='${joining_date}', updated_at='${updatedAt}' WHERE id='${id}'`;
            }
        }

        db.query(updateQuery, async (err, result) => {
            if (err) return res.status(403).json({status: false, message: err})
            
            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Contractor Updated Successfully'})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}


const createContractorUser = async (req, res) => {

    try 
    {
        const {name, email, password, mobile, joining_date, status} = req.body;
     
        const {error} = adminCreateValidation.validate({email: email, password: password, contact_no: mobile})
        if(error) return res.status(400).json({status: false, message: error.message})

        const createdBy = req.user.user_id
        var adminId = '';
        const loggedUserType = req.user.user_type
        if(loggedUserType == process.env.SUPER_ADMIN_ROLE_ID)
        {
            adminId = req.body.contractor_id
        }
        else
        {
            adminId = req.user.user_id
        }
        const user_type = process.env.USER_ROLE_ID
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const encodedPassword = Buffer.from(password).toString('base64');
        var storePath = ''

        if(req.files!= null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }
        
        const userCreateQuery = `INSERT INTO users (name, username, email, password, base_64_password, mobile, joining_date, image, user_type, admin_id, created_by, status) VALUES('${name}', '${name}', '${email}', '${hashPassword}', '${encodedPassword}', '${mobile}', '${joining_date}', '${storePath}', '${user_type}', '${adminId}', '${createdBy}', '${status}')`

        db.query(userCreateQuery, async (err, result) => {
            if (err) return res.status(500).json({status: false, message: err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Contractor user created successfully'})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getAllContractorAndUsers = async (req, res) => {

    try 
    {

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(admins.id) as total FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${process.env.CONTRACTOR_ROLE_ID}' AND admins.is_deleted='0'`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';

        if (searchData != null && searchData != '') {
            searchDataCondition = `AND admins.name LIKE '%${searchData}%'`;
        }

        const contractorRole = process.env.CONTRACTOR_ROLE_ID
        const selectQuery = `SELECT admins.id as admin_id, admins.image, admins.name,admins.email, admins.status, admins.contact_no, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${contractorRole}' AND admins.is_deleted='0' ${searchDataCondition} ORDER BY admins.id DESC LIMIT ${pageFirstResult}, ${pageSize}`

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map(async (element) => {
                    return {...element,
                        users: await getContractorUsersById(element.admin_id)
                    }
                });

                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult })
                    res.status(200).json({status: true, message: 'Fetched successfully', data: values, pageDetails: pageDetails[0]});
                })
            }
            else
            {
                return res.status(403).json({status: false, message: 'Data not found' });
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getContractorAndUsersFullDetailByIdAndType = async (req, res) => {

    try 
    {
      const id = req.params.id;
      const type = req.params.type;
      
      const{error} = checkPositiveInteger.validate({id: id})
      if(error) return res.status(403).json({status: false, message: error.message})

      if(type == 'Contractor')
      {
        var selectQuery = `SELECT admins.id as admin_id, admins.name, admins.email, admins.contact_no, admins.alt_number, admins.address_1, admins.country, admins.city, admins.pin_code, admins.description, admins.image, admins.status, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.id='${id}' AND admins.user_type ='${process.env.CONTRACTOR_ROLE_ID}'`
      }
      else
      {
        var selectQuery = `SELECT users.id as admin_id, users.name, users.email, users.mobile, users.joining_date, users.image, users.status, roles.name as user_type FROM users INNER JOIN roles ON roles.id=users.user_type WHERE users.id='${id}' AND users.user_type ='${process.env.USER_ROLE_ID}'`
      }

      db.query(selectQuery, async(err, result) => {
        if (err) return res.status(403).json({status: false, message: err})

        if(result.length > process.env.VALUE_ZERO) 
        {
            res.status(200).json({status: true, message:'Fetched successfully', data:result[0]})
        }
        else
        {
            return res.status(403).json({status: false, message: 'Data not found' });
        }

      })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});     
    }
}

const deleteContractorAndUsers = async (req, res) =>{

    try 
    {
        const id = req.params.id;
        const type = req.params.type;
        const{error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(403).json({status: false, message: error.message})
  
        if(type == 'Contractor')
        {
          var updateQuery = `UPDATE admins SET is_deleted='1' WHERE id='${id}' AND user_type ='${process.env.CONTRACTOR_ROLE_ID}'`
        }
        else
        {
          var updateQuery = `UPDATE users SET is_deleted='1' WHERE id='${id}' AND user_type ='${process.env.USER_ROLE_ID}'`
        }
  
        db.query(updateQuery, async(err, result) => {
          if (err) return res.status(403).json({status: false, message: err})
  
          if(result.affectedRows > process.env.VALUE_ZERO) 
          {
            res.status(200).json({status: true, message:'Account has been deleted successfully'})
          }
          else
          {
            res.status(403).json({status: false, message: 'Something went wrong, please try after sometime' });
          }
  
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getAllContractorAndUsersWithPendingAccountStatus = async (req, res) => {

    try 
    {

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        
        const countSelectQuery = `SELECT COUNT(admins.id) as total FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${process.env.CONTRACTOR_ROLE_ID}' AND admins.is_deleted='0' AND admins.status='0'`

        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';

        if (searchData != null && searchData != '') {
            searchDataCondition = `AND admins.name LIKE '%${searchData}%'`;
        }


        const contractorRole = process.env.CONTRACTOR_ROLE_ID
        const selectQuery = `SELECT admins.id as admin_id, admins.image, admins.name,admins.email, admins.status, admins.contact_no, roles.name as user_type FROM admins INNER JOIN roles ON roles.id=admins.user_type WHERE admins.user_type='${contractorRole}' AND admins.is_deleted='0' AND admins.status='0' '${searchDataCondition}' ORDER BY admins.id DESC LIMIT ${pageFirstResult}, ${pageSize}`

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(403).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map(async (element) => {
                    return {...element,
                        users: await getPendingContractorUsersById(element.admin_id)
                    }
                });

                Promise.all(final).then((values) => {
                    const pageStartResult = (currentPage - 1) * pageSize + 1;
                    const pageEndResult = Math.min(currentPage * pageSize, total);
                    var pageDetails = [];
                    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult })
                    
                    res.status(200).json({status: true, message: 'Fetched successfully', data: values, pageDetails: pageDetails[0]});
                })
            }
            else
            {
                return res.status(200).json({status: false, message: 'Data not found' });
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const contractorAccountStatusAction = async(req, res) => {

    try 
    {
        const {admin_id, status, user_type} = req.body;
        const accountStatusValidation = Joi.object({
            admin_id: Joi.number().required(),
            status: Joi.number().required(),
            user_type: Joi.string().required(),
        })     

        const {error} = accountStatusValidation.validate(req.body)

        if(error) return res.status(403).json({status: false, message: error.message})

        var responseMessage = '';

        if(status === 1)
        {
            responseMessage = 'Activated'
        }
        else
        {
            responseMessage = 'Rejected'
        }
        if(user_type == 'Contractor')
        {
            var updateQuery = `UPDATE admins SET status = '${status}' WHERE id = '${admin_id}'`
        }
        else
        {
            var updateQuery = `UPDATE users SET status = '${status}' WHERE id = '${admin_id}` 
        }

       // res.send({data: updateQuery, status: status})
        const queryResult = await db.query(updateQuery)

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(200).json({status: true, message: "User account status changed to " + responseMessage+ " successfully"})
        }
        else
        {
            res.status(404).json({status: true, message: "Error! User account status not changed"})
        }
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
} 

const getContractorSidebar = async(req, res)=>{
    try{
        const [userDetails] = await getRecord("admins", "id", req.user.user_id);
        if(!userDetails){
            return res.status(403).json({status: false, message: 'User not found'})
        }
        const [userPlanDetails] = await getRecord("plans", "id", userDetails?.plan_id)
        if(!userPlanDetails){
            return res.status(403).json({status: false, message: 'Plan not found'})
        }
        const planModules = JSON.parse(JSON.parse(userPlanDetails.module))
        const getModulesQuery = `SELECT * FROM modules WHERE id IN (${planModules})`    
        const modules = await db.query(getModulesQuery);
        const moduleIds = modules.map((e)=> e.id)
        const modulesObj =  {};
        for (const module of modules) {
            modulesObj[module.id] = module;
            module.submodules = [];
        }
        const getSubModulesQuery = `SELECT * FROM sub_modules WHERE module_id IN (${moduleIds})`    
        const subModules = moduleIds.length === 0 ? []: await db.query(getSubModulesQuery);
        const subModulesObj =  {};
        for (const subMod of subModules) {
            subModulesObj[subMod.id] = subMod;
            subMod.modulesOfSubModule = [];
        }
        const subModIds = subModules.map(subMod => subMod.id)
        const getSubSubModulesQuery = `SELECT * FROM module_of_sub_modules WHERE sub_module_id IN (${subModIds})`    
        const subSubModules = subModIds.length === 0 ? [] : await db.query(getSubSubModulesQuery);
        const subSubModulesObj =  {};
        for (const subSubMod of subSubModules) {
            subSubModulesObj[subSubMod.id] = subSubMod;
        }
        for(const subMod in subModulesObj) {
            subModulesObj[subMod].modulesOfSubModule = subSubModules.filter(e=> e.sub_module_id == subMod);
            console.log(subModulesObj[subMod], "subModulesObj[subMod]")
        }
        for (const module in modulesObj) {
            console.log(module,)
            modulesObj[module].submodules = subModules.filter(e=> e.module_id == module);
            console.log(modulesObj[module], "modulesObj[module]")
        }
        const sidebarList = Object.values(modulesObj)
        return res.status(200).json({
            status: true,
            message: 'sidebar Fetched successfully',
            data: sidebarList
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({status: false, message: error.message})
    }
}

const getContractorSidebarTest = async(req, res)=>{
    try{
        const getModulesQuery = `SELECT * FROM modules`    
        const modules = await db.query(getModulesQuery);
        const moduleIds = modules.map((e)=> e.id)
        const modulesObj =  {};
        for (const module of modules) {
            modulesObj[module.id] = module;
            module.submodules = [];
        }
        const getSubModulesQuery = `SELECT * FROM sub_modules WHERE module_id IN (${moduleIds})`    
        const subModules = moduleIds.length === 0 ? []: await db.query(getSubModulesQuery);
        const subModulesObj =  {};
        for (const subMod of subModules) {
            subModulesObj[subMod.id] = subMod;
            subMod.modulesOfSubModule = [];
        }
        const subModIds = subModules.map(subMod => subMod.id)
        const getSubSubModulesQuery = `SELECT * FROM module_of_sub_modules WHERE sub_module_id IN (${subModIds})`    
        const subSubModules = subModIds.length === 0 ? [] : await db.query(getSubSubModulesQuery);
        const subSubModulesObj =  {};
        for (const subSubMod of subSubModules) {
            subSubModulesObj[subSubMod.id] = subSubMod;
        }
        for(const subMod in subModulesObj) {
            subModulesObj[subMod].subModules = subSubModules.filter(e=> e.sub_module_id == subMod);
            // console.log(subModulesObj[subMod], "subModulesObj[subMod]")
        }
        for (const module in modulesObj) {
            console.log(module,)
            modulesObj[module].submodules = subModules.filter(e=> e.module_id == module);
            // console.log(modulesObj[module], "modulesObj[module]")
        }
        const sidebarList = Object.values(modulesObj)
        return res.status(200).json({
            status: true,
            message: 'sidebar Fetched successfully',
            data: sidebarList
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({status: false, message: error.message})
    }
}

module.exports = {contractorCreate, getContractorById, updateContractorDetailsById, createContractorUser, getAllContractorAndUsers, getContractorAndUsersFullDetailByIdAndType, deleteContractorAndUsers, getAllContractorAndUsersWithPendingAccountStatus, contractorAccountStatusAction , getContractorSidebar , getContractorSidebarTest}