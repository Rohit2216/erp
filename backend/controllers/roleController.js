require("dotenv").config();
const { con, makeDb } = require("../db");
require("dotenv").config();
const db = makeDb();
const { createDefaultPermission } = require('../helpers/general')

const createRole = async(req, res) => {
    try 
    {
        const {name} = req.body
        const sqlQuery = `INSERT INTO roles(name) VALUES('${name}')`;
        db.query(sqlQuery, async (err, results) => {
            if(err) return res.status(403).json({status: false, message: err})
            if(results.insertId > process.env.VALUE_ZERO)
            {   
                await createDefaultPermission(results.insertId);
                res.status(200).json({status: true, message: 'Roles created successfully.'})
            }
            else
            {
                res.status(500).json({status: false, message: "No data inserted.Please try again."})
            }
        })
    } 
    catch (error)
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}

const getAllRoles = async (req, res) => {
    try 
    {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1 ;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM roles WHERE status = '1'`
        constTotalLength = await db.query(countSelectQuery, [process.env.NOT_DELETED]);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != '') 
        {
            searchDataCondition = `AND roles.name LIKE '%${searchData}%'`;
            queryParams.unshift(`%${searchData}%`);
        }


        const sql = `SELECT * FROM roles WHERE status = 1 ${searchDataCondition} ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`

        db.query(sql, (err, results) => {
            if(err) return res.status(403).json({status: false, message: err})

            if(results.length > process.env.VALUE_ZERO)
            {
                 const pageStartResult = (currentPage - 1) * pageSize + 1;
                const pageEndResult = Math.min(currentPage * pageSize, total);
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult})

                res.status(200).json({
                    status: true,
                    message: 'success.',
                    data: results,
                    pageDetails: pageDetails[0]
                })
            }
            else
            {
                res.status(400).json({
                    status: false,
                    message: "Details not found."
                })
            }
        })    
    } 
    catch (error)
    {
        return res.status(400).json({status: false, message:error.message})    
    }
}

const editRole = async(req, res) => {
    try 
    {
        const id = req.params.id       
        const selectQuery = `SELECT * FROM roles WHERE id='${id}'`
        db.query(selectQuery, (err, results) => {
            if(err) return res.status(403).json({status: false, message: err})

            if(results.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Fetch successfully", data: results[0]})
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        })

    } 
    catch (error)
    {
        return res.status(400).json({status:false, message: error.message})
    }
}


const updateRole = async(req, res) => {

    try 
    {
        const {role_id,name} = req.body

        const updateQuery = `UPDATE roles SET name='${name}' WHERE id='${role_id}'`
        db.query(updateQuery, (err, results) => {
            if(err) return res.status(400).json({status: false, message: err})

            if(results.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Roles updated successfully'})
            }
            else
            {
                return res.status(500).json({status: false, message: 'Something went wrong, please try after sometime'})
            }
        })

    }
    catch (error)
    {
        return res.status(405).json({
            status: false,
            message: error.message
        })    
    }
}

const deleteRole = async (req, res) => {

    try
    {
        const role_id = req.params.id
        const deleteQuery = `DELETE FROM roles WHERE id='${role_id}'`
        db.query(deleteQuery, (err, results) => {
            if(err) return res.status(403).json({status: false, message: err})

            if(results.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Role deleted successfully'})
            }
            else
            {
                res.status(403).json({status: false, message: "Something went wrong, please try after sometime"})
            }
        })
    } 
    catch (error)
    {
        return res.status(400).json({
            status: false,
            message: error.message
        })    
    }
}

const getAllRolesForDropdown = async(req, res) => {
    try
    {
        const selectQuery = `SELECT id, name FROM roles WHERE status = '1'`;
        db.query(selectQuery, async(err, results) => {
            if(err) return res.status(403).json({status: false, message: err})

            if(results.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Role Fetched successfully', data: results});
            }
            else
            {
                res.status(403).json({status: false, message: "Roles not found"})
            }
        })
    } 
    catch (error)
    {
        return res.status(400).json({
            status: false,
            message: error.message
        })    
    }
}

module.exports = { getAllRoles, createRole, editRole, updateRole, deleteRole, getAllRolesForDropdown}