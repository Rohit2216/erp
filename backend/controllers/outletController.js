var moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const Joi = require("joi");
const bcrypt = require('bcrypt');
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const { outletFormValidation, checkPositiveInteger, importOutletValidation } = require('../helpers/validation');
const { generatePanelIdForUser, generateSuperAdminEmpId } = require('../helpers/panelHelper');
const { getOutLetUserDetailsByOutletId } = require('../helpers/commonHelper');
const { calculatePagination } = require('../helpers/general');



const addOutlet = async (req, res) => {
  try {
    const { energy_company_id, zone_id, regional_id, sales_area_id, district_id, outlet_name, outlet_contact_person_name, outlet_contact_number, primary_number, secondary_number, primary_email, secondary_email, customer_code, outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude, outlet_unique_id, status, email, password } = req.body;
    const created_by = req.user.user_id;
    var storePath = '';
    return console.log(req.body)
    const joiSchema = Joi.object({
      energy_company_id: Joi.number().required(),
      zone_id: Joi.number().required(),
      regional_id: Joi.number().required(),
      sales_area_id: Joi.number().required(),
      //district_id: Joi.number().optional(),
      outlet_name: Joi.string().required(),
      outlet_contact_number: Joi.number().required(),
      customer_code: Joi.string().required(),
      outlet_category: Joi.string().required(),
      outlet_ccnoms: Joi.string().required(),
      outlet_ccnohsd: Joi.string().required(),
      outlet_unique_id: Joi.string().required(),
      status: Joi.string().required(),
      address: Joi.string().required(),
      email: Joi.string().optional(),
      password: Joi.string().optional(),

    }).options({ allowUnknown: true });

    const { error, value } = joiSchema.validate(req.body)

    if (error) return res.status(200).json({ status: false, message: error.message });

    const check = await checkOutletUniqueId(outlet_unique_id)

    if (check === false) return res.status(200).json({ status: false, message: "Outlet unique ID already exists." });

    if (req.files != null) {
      const image = req.files.image
      const imageName = Date.now() + image.name
      const uploadPath = process.cwd() + '/public/outlet_images/' + imageName;
      storePath = '/outlet_images/' + imageName;
      image.mv(uploadPath, (err, response) => {

        if (err) return res.status(200).json({ status: false, message: err.message });
      })
    }

    const insertQuery = `INSERT INTO outlets (energy_company_id, zone_id, regional_office_id, sales_area_id, district_id, outlet_unique_id, outlet_name, outlet_contact_person_name, outlet_contact_number, primary_number, secondary_number, primary_email, secondary_email, customer_code, outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude, created_by, outlet_image, status) VALUES ('${energy_company_id}', '${zone_id}', '${regional_id}', '${sales_area_id}', '${district_id}', '${outlet_unique_id}', '${outlet_name}', '${outlet_contact_person_name}', '${outlet_contact_number}', '${primary_number}', '${secondary_number}', '${primary_email}', '${secondary_email}', '${customer_code}', '${outlet_category}', '${location}', '${address}', '${outlet_ccnoms}', '${outlet_ccnohsd}', '${outlet_resv}', '${outlet_lattitude}', '${outlet_longitude}', '${created_by}', '${storePath}', '${status}')`


    db.query(insertQuery, async (err, result) => {
      if (err) return res.status(500).json({ status: false, message: err.message });

      if (result.affectedRows > process.env.VALUE_ZERO) {
        const outletId = result.insertId;
        // create outlet user
        if (outletId > 0) {
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const user_type = process.env.USER_ROLE_ID;
          const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
          const employee_id = await generateSuperAdminEmpId();
          const joining_date = moment(new Date()).format('YYYY-MM-DD');

          const userInsertQuery = `INSERT INTO users (name, username, email, password, mobile, user_type, address, created_by, panel_id, status, image, outlet_id, employee_id, joining_date) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const insertValues = [outlet_name, outlet_name, email, hashPassword, outlet_contact_number, user_type, address, created_by, panel_id, status, storePath, outletId, employee_id, joining_date];
          const loginQueryResult = await db.query(userInsertQuery, insertValues);
        }
        res.status(200).json({ status: true, message: "Outlet created successfully" })
      }
      else {
        return res.status(200).json({ status: false, message: "Something went wrong, please try again" })
      }
    })
  }
  catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}


// const importOutlet = async (req, res) => {
//   try {
//     const { outlets } = req.body; // Assuming 'outlets' is an array of outlet objects
//     const created_by = req.user.user_id;

//     const insertValues = [];
//     const userInsertValues = [];

//     for (let outlet of outlets) {
//       const {
//         energy_company_id, zone_id, regional_id, sales_area_id, district_id, outlet_name,
//         outlet_contact_person_name, outlet_contact_number, primary_number, secondary_number,
//         primary_email, secondary_email, customer_code, outlet_category, location, address,
//         outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude,
//         outlet_unique_id, status, email, password
//       } = outlet;

//       // Check if the outlet unique ID already exists
//       const check = await checkOutletUniqueId(outlet_unique_id);
//       if (check === false) {
//         return res.status(400).json({ status: false, message: `Outlet unique ID ${outlet_unique_id} already exists.` });
//       }

//       insertValues.push([
//         energy_company_id, zone_id, regional_id, sales_area_id, district_id, outlet_unique_id,
//         outlet_name, outlet_contact_person_name, outlet_contact_number, primary_number,
//         secondary_number, primary_email, secondary_email, customer_code, outlet_category,
//         location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude,
//         outlet_lattitude, created_by, status
//       ]);

//       if (password) {
//         const salt = bcrypt.genSaltSync(10);
//         const hashPassword = await bcrypt.hash(password, salt);
//         const user_type = process.env.USER_ROLE_ID;
//         const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
//         const employee_id = await generateSuperAdminEmpId();
//         const joining_date = moment().format('YYYY-MM-DD');

//         userInsertValues.push([
//           outlet_name, outlet_name, email, hashPassword, outlet_contact_number, user_type,
//           address, created_by, panel_id, status, employee_id, joining_date
//         ]);
//       }
//     }

//     if (insertValues.length === 0) {
//       return res.status(400).json({ status: false, message: "No valid outlet data to insert." });
//     }

//     // Insert multiple outlets
//     const outletInsertQuery = `
//       INSERT INTO outlets (
//         energy_company_id, zone_id, regional_office_id, sales_area_id, district_id,
//         outlet_unique_id, outlet_name, outlet_contact_person_name, outlet_contact_number,
//         primary_number, secondary_number, primary_email, secondary_email, customer_code,
//         outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv,
//         outlet_longitude, outlet_lattitude, created_by, status
//       )
//       VALUES ?
//     `;

//     const result = await db.query(outletInsertQuery, [insertValues]);

//     if (result.affectedRows > 0) {
//       const outletIds = result.insertId; // Note: This assumes that you are inserting a single outlet at a time
//       console.log("outletIds", outletIds)
//       if (userInsertValues.length > 0) {
//         const userInsertQuery = `
//           INSERT INTO users (
//             name, username, email, password, mobile, user_type, address, created_by,
//             panel_id, status, employee_id, joining_date, outlet_id
//           )
//           VALUES ?
//         `;
//         // Map userInsertValues to include outlet ID
//         const userInsertValuesWithOutletId = userInsertValues.map(user => [
//           ...user, outletIds // Add the outletId to each user entry
//         ]);
//         await db.query(userInsertQuery, [userInsertValuesWithOutletId]);
//       }

//       res.status(200).json({ status: true, message: "Outlets created successfully" });
//     } else {
//       res.status(500).json({ status: false, message: "No rows affected. Something went wrong, please try again" });
//     }
//   } catch (error) {
//     console.error("Unexpected error: ", error.message);
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };


const importOutlet = async (req, res) => {
  try {
    const { outlets } = req.body; // Assuming 'outlets' is an array of outlet objects
    const created_by = req.user.user_id;

    const { error } = importOutletValidation.validate(outlets);
    if (error) return res.status(400).json({ status: false, message: error.message });

    for (let outlet of outlets) {
      const {
        energy_company_id, zone_id, regional_id, sales_area_id, district_id, outlet_name,
        outlet_contact_person_name, outlet_contact_number, primary_number, secondary_number,
        primary_email, secondary_email, customer_code, outlet_category, location, address,
        outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude,
        outlet_unique_id, status, email, password
      } = outlet;

      // Check if the outlet unique ID already exists
      const check = await checkOutletUniqueId(outlet_unique_id);
      if (check === false) {
        return res.status(400).json({ status: false, message: `Outlet unique ID ${outlet_unique_id} already exists.` });
      }

      // Insert a single outlet
      const outletInsertQuery = `
        INSERT INTO outlets (
          energy_company_id, zone_id, regional_office_id, sales_area_id, district_id,
          outlet_unique_id, outlet_name, outlet_contact_person_name, outlet_contact_number,
          primary_number, secondary_number, primary_email, secondary_email, customer_code,
          outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv,
          outlet_longitude, outlet_lattitude, created_by, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.query(outletInsertQuery, [
        energy_company_id, zone_id, regional_id, sales_area_id, district_id, outlet_unique_id,
        outlet_name, outlet_contact_person_name, outlet_contact_number, primary_number,
        secondary_number, primary_email, secondary_email, customer_code, outlet_category,
        location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude,
        outlet_lattitude, created_by, status
      ]);

      if (result.affectedRows > 0) {
        const outletId = result.insertId;
        // If user details are provided, insert the user with the correct outlet ID
        if (password) {
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const user_type = process.env.USER_ROLE_ID;
          const panel_id = await generatePanelIdForUser(req.user.user_type, req.user.user_id);
          const employee_id = await generateSuperAdminEmpId();
          const joining_date = moment().format('YYYY-MM-DD');

          const userInsertQuery = `
            INSERT INTO users (
              name, username, email, password, mobile, user_type, address, created_by,
              panel_id, status, employee_id, joining_date, outlet_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          await db.query(userInsertQuery, [
            outlet_name, outlet_name, email, hashPassword, outlet_contact_number, user_type,
            address, created_by, panel_id, status, employee_id, joining_date, outletId
          ]);
        }
      } else {
        return res.status(500).json({ status: false, message: "Failed to insert outlet. Something went wrong, please try again" });
      }
    }

    res.status(200).json({ status: true, message: "Outlets created successfully" });

  } catch (error) {
    console.error("Unexpected error: ", error.message);
    return res.status(500).json({ status: false, message: error.message });
  }
};


async function checkOutletUniqueId(outlet_unique_id) {
  try {
    const selectQuery = await db.query(`select * from outlets where outlet_unique_id = '${outlet_unique_id}'`)
    if (selectQuery.length > 0) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error(error.message)
  }
}



// chagnes by tariq
const getAllOutlet = async (req, res) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : null;
    const currentPage = req.query.pageNo || 1;
    const searchData = req.query.search || "";
    const status = req.query.status || "";
    const pageFirstResult = (currentPage - 1) * pageSize;

    var search_where = "";

    if (searchData != null && searchData != "") {
      search_where = `WHERE outlets.outlet_name LIKE '%${searchData}%'`;
    }

    status
      ? search_where
        ? (search_where += `AND outlets.status = ${status}`)
        : (search_where += `WHERE outlets.status = ${status}`)
      : "";

    if (req.user.user_type == process.env.USER_ROLE_ID) {
      search_where = search_where
        ? ` AND users.user_type = ${process.env.USER_ROLE_ID}`
        : `WHERE users.user_type = ${process.env.USER_ROLE_ID}`;
    }

    var selectQuery = `SELECT outlets.id, outlets.energy_company_id, outlets.zone_id, outlets.regional_office_id, outlets.sales_area_id, outlets.district_id, outlets.outlet_unique_id, outlets.outlet_name, outlets.outlet_contact_person_name, outlets.outlet_contact_number, outlets.primary_number, outlets.secondary_number, outlets.primary_email, outlets.secondary_email, outlets.customer_code, outlets.outlet_category, outlets.location, outlets.address, outlets.outlet_ccnoms, outlets.outlet_ccnohsd, outlets.outlet_resv, outlets.outlet_longitude, outlets.outlet_lattitude, outlets.outlet_image, outlets.created_by, outlets.created_at, energy_companies.name as energy_company_name, zones.zone_name, regional_offices.regional_office_name, sales_area.sales_area_name, districts.district_name,  outlets.status FROM outlets LEFT JOIN users ON users.outlet_id = outlets.id LEFT JOIN energy_companies ON energy_companies.id=outlets.energy_company_id INNER JOIN zones ON zones.zone_id=outlets.zone_id INNER JOIN regional_offices ON regional_offices.id=outlets.regional_office_id INNER JOIN sales_area ON sales_area.id=outlets.sales_area_id INNER JOIN districts ON districts.id=outlets.district_id ${search_where} ORDER BY outlets.id `;


    if(pageSize){
      selectQuery += `DESC LIMIT ${pageFirstResult}, ${pageSize}`
    }else{
      selectQuery += `DESC`;
    }

    const modifiedQueryString = selectQuery.substring(
      0,
      selectQuery.indexOf("ORDER BY")
    );
    const totalResult = await db.query(modifiedQueryString);

    db.query(selectQuery, async (err, result) => {
      if (err) return res.status(500).json({ status: false, message: err });

      if (result.length > process.env.VALUE_ZERO) {
        var pageDetails = await calculatePagination(
          totalResult.length,
          currentPage,
          pageSize
        );

        res.status(200).json({
          status: true,
          message: "Outlet fetched successfully",
          data: result,
          pageDetails: pageDetails,
        });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Data not found" });
      }
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

const getOutletById = async (req, res) => {

  try {
    const id = req.params.id;
    // const selectQuery = `SELECT * FROM outlets WHERE id = '${id}'`
    const selectQuery = `SELECT outlets.id, outlets.energy_company_id, outlets.zone_id, outlets.regional_office_id, outlets.sales_area_id, outlets.district_id, outlets.outlet_unique_id, outlets.outlet_name, outlets.outlet_contact_person_name, outlets.outlet_contact_number, outlets.primary_number, outlets.secondary_number, outlets.primary_email, outlets.secondary_email, outlets.customer_code, outlets.outlet_category, outlets.location, outlets.address, outlets.outlet_ccnoms, outlets.outlet_ccnohsd, outlets.outlet_resv, outlets.outlet_longitude, outlets.outlet_lattitude, outlets.outlet_image, outlets.created_by, outlets.created_at, energy_companies.name as energy_company_name, zones.zone_name, regional_offices.regional_office_name, sales_area.sales_area_name, districts.district_name,  outlets.status, users.email AS user_email FROM outlets LEFT JOIN users ON users.outlet_id = outlets.id LEFT JOIN energy_companies ON energy_companies.id=outlets.energy_company_id INNER JOIN zones ON zones.zone_id=outlets.zone_id INNER JOIN regional_offices ON regional_offices.id=outlets.regional_office_id INNER JOIN sales_area ON sales_area.id=outlets.sales_area_id LEFT JOIN districts ON districts.id=outlets.district_id WHERE outlets.id = '${id}'`;
    db.query(selectQuery, async (err, result) => {
      if (err) return res.status(500).json({ status: false, message: err });

      if (result.length > process.env.VALUE_ZERO) {
        const outletUserDetails = await getOutLetUserDetailsByOutletId(result[0].id);
        for (const row of result) {
          row.email = outletUserDetails.email;
          row.user_id = outletUserDetails.id;
        }
        res.status(200).json({ status: true, message: "Outlet fetched successfully", data: result[0] })
      }
      else {
        return res.status(400).json({ status: false, message: "Data not found" })
      }
    })
  }
  catch (error) {
    return res.status(500).json({ status: false, message: error.message })
  }
}


const editOutlet = async (req, res) => {

  try {
    const id = req.params.id;
    const selectQuery = `SELECT * FROM outlets WHERE id = '${id}'`

    db.query(selectQuery, async (err, result) => {
      if (err) return res.status(500).json({ status: false, message: err });

      if (result.length > process.env.VALUE_ZERO) {
        const outletUserDetails = await getOutLetUserDetailsByOutletId(result[0].id);
        for (const row of result) {
          row.email = outletUserDetails.email;
        }

        res.status(200).json({ status: true, message: "Outlet fetched successfully", data: result[0] })
      }
      else {
        return res.status(400).json({ status: false, message: "Data not found" })
      }
    })
  }
  catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

// const updateOutlet = async (req, res) => {

//     try 
//     {
//         const id = req.body.id;

//         const {energy_company_id, zone_id, regional_id, sales_area_id, district_id, outlet_name, outlet_contact_person_name, outlet_conatct_number, primary_number, secondary_number, primary_email, secondary_email, customer_code, outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude, outlet_unique_id, status, email, password, user_id} = req.body; 

//         const {error, value} = outletFormValidation.validate(req.body);

//         if(error) return res.status(400).json({status: false, message: error})

//         const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
//         var storePath = '';

//         if(req.files != null)
//         {
//             const image = req.files.image
//             const imageName = Date.now()+image.name
//             const uploadPath =  process.cwd() +'/public/outlet_images/' + imageName;
//             storePath = '/outlet_images/' + imageName;
//             image.mv(uploadPath, (err, response) => {

//                 if (err) return res.status(403).json({status: false, message: err});
//             })
//         }
//         else
//         {
//             storePath = req.body.image
//         }

//         const updateQuery = `UPDATE outlets SET energy_company_id = '${energy_company_id}', zone_id='${zone_id}', regional_office_id='${regional_id}', sales_area_id='${sales_area_id}', district_id='${district_id}', outlet_unique_id='${outlet_unique_id}', outlet_name='${outlet_name}', outlet_contact_person_name='${outlet_contact_person_name}', outlet_contact_number='${outlet_conatct_number}', primary_number='${primary_number}', secondary_number='${secondary_number}', primary_email='${primary_email}', secondary_email='${secondary_email}', customer_code='${customer_code}', outlet_category='${outlet_category}', location='${location}', address='${address}', outlet_ccnoms='${outlet_ccnoms}', outlet_ccnohsd='${outlet_ccnohsd}', outlet_resv='${outlet_resv}', outlet_longitude='${outlet_longitude}', outlet_lattitude='${outlet_lattitude}', updated_at='${updatedAt}', outlet_image='${storePath}', status='${status}' WHERE id = '${id}'`;

//         db.query(updateQuery, async(err, result) => {
//             if (err) return res.status(500).json({status: false, message: err});

//             if(result.affectedRows > process.env.VALUE_ZERO)
//             {
//                 // update outlet user details
//                 if(password != '')
//                 {
//                     const salt = bcrypt.genSaltSync(10);
//                     const hashPassword = await bcrypt.hash(password, salt);

//                     const userUpdateQuery = `UPDATE users SET name = ?, username = ?, email = ?, password = ?, mobile = ?, address = ?, status = ?, image = ? WHERE id = ?`;
//                     const updateValues = [outlet_name, outlet_name, email, hashPassword, outlet_conatct_number, address, status, storePath, user_id];
//                     const loginQueryResult = await db.query(userUpdateQuery, updateValues);
//                 }
//                 else
//                 {
//                     const userUpdateQuery = `UPDATE users SET name = ?, username = ?, email = ?, mobile = ?, address = ?, status = ?, image = ?  WHERE id = ?`;
//                     const updateValues = [outlet_name, outlet_name, email, outlet_conatct_number, address, status, storePath, user_id];
//                     const loginQueryResult = await db.query(userUpdateQuery, updateValues);
//                 }

//                 res.status(200).json({status: true, message: "Outlet updated successfully"})
//             }
//             else
//             {
//                 return res.status(400).json({status: false, message: "Something went wrong, please try again"})
//             }
//         })
//     } 
//     catch (error) 
//     {
//         return res.status(400).json({status: false, message: error.message})    
//     }
// }


const updateOutlet = async (req, res) => {
  try {
    const id = req.body.id;

    const {
      energy_company_id,
      zone_id,
      regional_id,
      sales_area_id,
      district_id,
      outlet_name,
      outlet_contact_person_name,
      outlet_contact_number,
      primary_number,
      secondary_number,
      primary_email,
      secondary_email,
      customer_code,
      outlet_category,
      location,
      address,
      outlet_ccnoms,
      outlet_ccnohsd,
      outlet_resv,
      outlet_longitude,
      outlet_lattitude,
      outlet_unique_id,
      status,
      email,
      password,
      user_id,
    } = req.body;
    // return 
    const { error, value } = outletFormValidation.validate(req.body);

    if (error)
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });

    const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    var storePath = "";

    if (req.files != null) {
      const image = req.files.image;
      const imageName = Date.now() + image.name;
      const uploadPath = process.cwd() + "/public/outlet_images/" + imageName;
      storePath = "/outlet_images/" + imageName;
      image.mv(uploadPath, (err, response) => {
        if (err) return res.status(403).json({ status: false, message: err });
      });
    } else {
      storePath = req.body.image;
    }

    const updateQuery = `UPDATE outlets SET energy_company_id = '${energy_company_id}', zone_id='${zone_id}', regional_office_id='${regional_id}', sales_area_id='${sales_area_id}', district_id='${district_id}', outlet_unique_id='${outlet_unique_id}', outlet_name='${outlet_name}', outlet_contact_person_name='${outlet_contact_person_name}', outlet_contact_number='${outlet_contact_number}', primary_number='${primary_number}', secondary_number='${secondary_number}', primary_email='${primary_email}', secondary_email='${secondary_email}', customer_code='${customer_code}', outlet_category='${outlet_category}', location='${location}', address='${address}', outlet_ccnoms='${outlet_ccnoms}', outlet_ccnohsd='${outlet_ccnohsd}', outlet_resv='${outlet_resv}', outlet_longitude='${outlet_longitude}', outlet_lattitude='${outlet_lattitude}', updated_at='${updatedAt}', outlet_image='${storePath}', status='${status}' WHERE id = '${id}'`;

    db.query(updateQuery, async (err, result) => {
      if (err) return res.status(500).json({ status: false, message: err });

      if (result.affectedRows > process.env.VALUE_ZERO) {
        // update outlet user details
        if (password != "") {
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = await bcrypt.hash(password, salt);

          const userUpdateQuery = `UPDATE users SET name = ?, username = ?, email = ?, password = ?, mobile = ?, address = ?, status = ?, image = ? WHERE id = ?`;
          const updateValues = [
            outlet_name,
            outlet_name,
            email,
            hashPassword,
            outlet_contact_number,
            address,
            status,
            storePath,
            user_id,
          ];
          const loginQueryResult = await db.query(
            userUpdateQuery,
            updateValues
          );
        } else {
          const userUpdateQuery = `UPDATE users SET name = ?, username = ?, email = ?, mobile = ?, address = ?, status = ?, image = ?  WHERE id = ?`;
          const updateValues = [
            outlet_name,
            outlet_name,
            email,
            outlet_contact_number,
            address,
            status,
            storePath,
            user_id,
          ];
          const loginQueryResult = await db.query(
            userUpdateQuery,
            updateValues
          );
        }

        res
          .status(200)
          .json({ status: true, message: "Outlet updated successfully" });
      } else {
        return res.status(400).json({
          status: false,
          message: "Something went wrong, please try again",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

const removeOutletById = async (req, res) => {

  try {
    // return 
    const id = req.params.id;
    const deleteQuery = `DELETE FROM outlets WHERE id = '${id}'`

    db.query(deleteQuery, (err, result) => {
      if (err) return res.status(500).json({ status: false, message: err });

      if (result.affectedRows > process.env.VALUE_ZERO) {
        return res.status(200).json({ status: true, message: "Outlet deleted successfully" })
      }
      else {
        return res.status(400).json({ status: false, message: "Something went wrong, please try again" })
      }
    })
  }
  catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}


const getOutletByDistrictId = async (req, res) => {
  try {
    const id = req.params.id;
    const sale_area_id = req.query.sale_area_id;
    var selectQuery;
    if (id > 0) {
      selectQuery = `SELECT * FROM outlets WHERE district_id = '${id}'`
    } else if (sale_area_id > 0) {
      selectQuery = `SELECT * FROM outlets WHERE sales_area_id = '${sale_area_id}'`
    }

    db.query(selectQuery, (err, result) => {
      if (err) return res.status(500).json({ status: false, message: err });
      if (result.length > process.env.VALUE_ZERO) {
        res.status(200).json({ status: true, message: "Outlet fetched successfully", data: result })
      }
      else {
        return res.status(400).json({ status: false, message: "Data not found" })
      }
    })
  }
  catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

const getOutletBySalesId = async (req, res) => {
  try {
    const id = req.params.id;
    const selectQuery = `SELECT outlet_name FROM outlets WHERE sales_area_id = '${id}' AND district_id != 0;`

    db.query(selectQuery, (err, result) => {
      if (err) return res.status(500).json({ status: false, message: err });
      if (result.length > process.env.VALUE_ZERO) {
        res.status(200).json({ status: true, message: "Outlet fetched successfully", data: result })
      }
      else {
        return res.status(400).json({ status: false, message: "Data not found" })
      }
    })
  }
  catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

const getOutletByEnergyCompanyId = async (req, res) => {

  try {
    const ecId = req.params.id;
    const { error } = checkPositiveInteger.validate({ id: ecId })

    if (error) return res.status(403).status({ status: false, message: error.message })

    const selectQuery = `SELECT * FROM outlets WHERE energy_company_id = ?`
    const queryResult = await db.query(selectQuery, [ecId]);

    if (queryResult.length > process.env.VALUE_ZERO) {
      res.status(200).json({ status: true, message: "Fetched successfully", data: queryResult });
    }
    else {
      res.status(403).json({ status: false, message: "Data not found" });
    }
  }
  catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}

const getAllOutletForDropdown = async (req, res) => {

  try {
    const query = `SELECT id, outlet_name FROM outlets`;
    const queryResult = await db.query(query);

    if (queryResult.length > process.env.VALUE_ZERO) {
      return res
        .status(StatusCodes.OK)
        .json({
          status: true,
          message: "Fetch successfully",
          data: queryResult
        });
    }
    else {
      return res
        .status(StatusCodes.OK)
        .json({
          status: false,
          message: "Data not found",
        })
    }
  }
  catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        status: false,
        message: error.message
      })
  }
}


const approveRejectOutletByStatus = async (req, res) => {
  try {
    // return 
    const id = req.query.id;
    const status = req.query.status;

    // Check if status is either '2' or '3'
    if (status === "2" || status === "3") {
      const updateQuery = `UPDATE outlets SET status = ? WHERE id = ?`;

      await db.query(updateQuery, [status, id]);

      const message =
        status === "2"
          ? "Outlet approved successfully"
          : "Outlet rejected successfully";
      return res.status(200).json({ status: true, message });
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid status",
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { addOutlet, getAllOutlet, getOutletById, editOutlet, updateOutlet, removeOutletById, getOutletByDistrictId, getOutletByEnergyCompanyId, getOutletBySalesId, getAllOutletForDropdown, approveRejectOutletByStatus, importOutlet }
