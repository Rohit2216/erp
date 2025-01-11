var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger } = require('../helpers/validation');
const { getZoneUsers, getReginalOfficeUsers, getSaleAreaUsers, getZoneSubUsers, getRegionalOfficeSubUsers, getSaleAreaSubUsers } = require('../helpers/general');


const getEnergyCompanies = async (req, res, next) => {

try 
{
    const selectQuery = `SELECT admins.id as user_id, admins.name as user_name, roles.name as user_type, zone_assigns.zone_id, zones.zone_name, regional_office_assigns.regional_office_id, regional_offices.regional_office_name, sale_area_assigns.sale_area_id, sales_area.sales_area_name FROM admins INNER JOIN roles ON roles.id=admins.user_type INNER JOIN zone_assigns ON zone_assigns.energy_company_id = admins.id INNER JOIN zones ON zones.zone_id=zone_assigns.zone_id INNER JOIN regional_office_assigns ON regional_office_assigns.energy_company_id=admins.id INNER JOIN regional_offices ON regional_offices.id=regional_office_assigns.regional_office_id INNER JOIN sale_area_assigns ON sale_area_assigns.energy_company_id=admins.id INNER JOIN sales_area ON sales_area.id=sale_area_assigns.sale_area_id WHERE admins.user_type='${process.env.ENERGY_COMPANY_ROLE_ID}'` 

    db.query(selectQuery, async (err, result) => {

        if(err) return request.status(400).json({status: false, message: err})

        if(result.length > process.env.VALUE_ZERO)
        {
            res.status(200).json({status: true, message: "Fetched successfully.",  data: result})
        }
        else
        {
            return res.status(400).json({status: false, message:"No data found"})
        }
    })
} 
catch (error) 
{
    return res.status(500).json({status: false, message: error.message})    
}
}


const getEnergyCompaniesContacts = async (req, res, next) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})

        const selectQuery = `SELECT admins.id, admins.name as user_name,admins.contact_no, admins.address_1, roles.name as user_type, energy_companies.name as company_name, zone_assigns.zone_id, regional_office_assigns.regional_office_id, sale_area_assigns.sale_area_id, admins.image FROM admins INNER JOIN roles ON roles.id=admins.user_type INNER JOIN energy_companies ON energy_companies.admin_id=admins.id INNER JOIN zone_assigns ON zone_assigns.energy_company_id=admins.id INNER JOIN regional_office_assigns ON regional_office_assigns.energy_company_id=admins.id INNER JOIN sale_area_assigns ON sale_area_assigns.energy_company_id=admins.id WHERE admins.id='${id}'` 
       
        db.query(selectQuery, async (err, result) => {

            if(err) return request.status(400).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map( async (element) => {
                    return {...element,
                        zones: await getZoneUsers(element.zone_id),
                        regional_name: await getReginalOfficeUsers(element.regional_office_id),
                        sale_area_name: await getSaleAreaUsers(element.sale_area_id),
                    }
                });

                Promise.all(final).then((values) =>{
                    res.status(200).json({status: true, message: "Fetched successfully.",  data: values})
                });
            }
            else
            {
                return res.status(400).json({status: false, message:"No data found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}


const getEnergyCompanyZoneSubUsers = async (req, res) => {

    try 
    {
        const zone_id = req.params.zone_id
        const user_id = req.params.user_id
        const {error} = checkPositiveInteger.validate({id: zone_id, id: user_id})
        if(error) return res.status(400).json({status: false, message: error.message})

        const selectQuery  =`SELECT name, email, image,mobile,joining_date,zone_id,id FROM users WHERE id='${user_id}'`
        db.query(selectQuery, async (err, result) => {
            
            if(err) return request.status(400).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map( async (element) => {
                    return {...element,
                        sub_users: await getZoneSubUsers(element.zone_id, element.id)

                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message: "Fetched successfully.",  data: values})
                })
                
            }
            else
            {
                return  res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getEnergyCompanyRegionalOfficeSubUsers = async (req, res) => {

    try 
    {
        const regional_id = req.params.regional_id
        const user_id = req.params.user_id
        const {error} = checkPositiveInteger.validate({id: regional_id, id: user_id})
        if(error) return res.status(400).json({status: false, message: error.message})

        const selectQuery  =`SELECT name, email, image,mobile,joining_date,regional_id,id FROM users WHERE id='${user_id}'`
        db.query(selectQuery, async (err, result) => {
            
            if(err) return request.status(400).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map( async (element) => {
                    return {...element,
                        sub_users: await getRegionalOfficeSubUsers(element.regional_id, element.id)

                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message: "Fetched successfully.",  data: values})
                })
                
            }
            else
            {
                return  res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getEnergyCompanySaleAreaSubUsers = async (req, res) => {

    try 
    {
        const sale_area_id = req.params.sale_area_id;
        const user_id = req.params.user_id
        const {error} = checkPositiveInteger.validate({id: sale_area_id, id: user_id})
        if(error) return res.status(400).json({status: false, message: error.message})

        const selectQuery  =`SELECT name, email, image,mobile,joining_date,sale_area_id,id FROM users WHERE id='${user_id}'`
        db.query(selectQuery, async (err, result) => {
            
            if(err) return request.status(400).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map( async (element) => {
                    return {...element,
                        sub_users: await getSaleAreaSubUsers(element.sale_area_id, element.id)

                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message: "Fetched successfully.",  data: values})
                })
                
            }
            else
            {
                return  res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getEnergyCompanyUserDetailsById = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})

        const selectQuery = `SELECT users.id, users.name, users.email, users.mobile, users.joining_date, users.image, users.zone_id, users.regional_id, users.sale_area_id, zones.zone_name, regional_offices.regional_office_name, sales_area.sales_area_name FROM users LEFT JOIN zones ON zones.zone_id=users.zone_id LEFT JOIN regional_offices ON regional_offices.id = users.regional_id LEFT JOIN sales_area ON sales_area.id=users.sale_area_id WHERE users.id='${id}' AND users.user_type='${process.env.USER_ROLE_ID}'`

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(402).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "success", data: result[0]})
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }

}

const getEnergyCompanySubUserDetailById = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})

        const selectQuery = `SELECT users.id, users.name, users.email, users.mobile, users.joining_date, users.image, users.zone_id, users.regional_id, users.sale_area_id, zones.zone_name, regional_offices.regional_office_name, sales_area.sales_area_name FROM users LEFT JOIN zones ON zones.zone_id=users.zone_id LEFT JOIN regional_offices ON regional_offices.id = users.regional_id LEFT JOIN sales_area ON sales_area.id=users.sale_area_id WHERE users.id='${id}' AND users.user_type='${process.env.SUB_USER_ROLE_ID}'`

        db.query(selectQuery, async (err, result) => {
            if (err) return res.status(402).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "success", data: result[0]})
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}



module.exports = {getEnergyCompaniesContacts, getEnergyCompanies, getEnergyCompanyZoneSubUsers, getEnergyCompanyRegionalOfficeSubUsers, getEnergyCompanySaleAreaSubUsers, getEnergyCompanySubUserDetailById, getEnergyCompanyUserDetailsById}