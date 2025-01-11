require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger, profileValidations } = require("../helpers/validation");
const { roleById, getEmployeeBaseSalary, historyTimeLine, calculatePagination, getUserDetails } = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');


// const getAllStoredEmployeeDetails = async (req, res) => {

//     try {
//         const user_id = req.user.user_id;
//         const user_type = req.user.user_type;
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || '';
//         const pageFirstResult = (currentPage - 1) * pageSize;
//         const hasDropdown = req.query.isDropdown;

//         var searchDataCondition = '';
//         var queryParams = [pageFirstResult, pageSize];

//         if (searchData != null && searchData != '') {
//             searchDataCondition += `AND (name LIKE '%${searchData}%' OR email LIKE '%${searchData}%' OR mobile LIKE '%${searchData}%' OR joining_date LIKE '%${searchData}%') `;
//         }

//         const selectQuery = `SELECT id, name, employee_id, email, mobile, joining_date, image, status, user_type, created_by FROM users WHERE  (is_deleted = '0' AND created_by ='${user_id}')  ${searchDataCondition} ORDER BY id DESC LIMIT ?, ?`

//         let queryResult;

//         // pagination remove on all dropdown
//         if (hasDropdown != null && hasDropdown != '') {
//             const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//             queryResult = await db.query(modifiedQueryString, queryParams);
//         }
//         else {
//             queryResult = await db.query(selectQuery, queryParams);
//         }

//         const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
//         const totalResult = await db.query(modifiedQueryString);
//         if (queryResult.length > 0) {
//             var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
//             var modifiedResult = [];
//             for (let result of queryResult) {

//                 if (result.employee_id) {
//                     result.name = `${result.name} (${result.employee_id})`;
//                 }
//                 const employeeBaseSalary = await getEmployeeBaseSalary(result.id);
//                 modifiedResult.push({
//                     id: result.id,
//                     name: result.name,
//                     email: result.email,
//                     mobile: result.mobile,
//                     joining_date: result.joining_date,
//                     image: result.image,
//                     status: result.status,
//                     user_type: result.user_type,
//                     created_by: result.created_by,
//                     salary: employeeBaseSalary.salary,
//                     employee_id: result.employee_id
//                 });
//             }

//             res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: modifiedResult, pageDetails: pageDetails })
//         }
//         else {
//             return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
//         }
//     }
//     catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
//     }
// }



  // const getAllStoredEmployeeDetails = async (req, res) => {
  //   try {
  //     const user_id = req.user.user_id;
  //     const user_type = req.user.user_type;
  //     const pageSize = parseInt(req.query.pageSize) || 10;
  //     const currentPage = parseInt(req.query.pageNo) || 1;
  //     const searchData = req.query.search || "";
  //     const pageFirstResult = (currentPage - 1) * pageSize;
  //     const hasDropdown = req.query.isDropdown;

  //     var searchDataCondition = "";
  //     var queryParams = [pageFirstResult, pageSize];

  //     if (searchData != null && searchData != "") {
  //       searchDataCondition += `AND (users.name LIKE '%${searchData}%' OR users.email LIKE '%${searchData}%' OR users.mobile LIKE '%${searchData}%' OR users.joining_date LIKE '%${searchData}%') `;
  //     }

  //     const selectQuery = `SELECT users.id, users.name, users.employee_id, users.email, users.mobile, users.joining_date, users.image, users.status, users.user_type,roles.name as role_name,  users.created_by  FROM users LEFT JOIN roles ON roles.id = users.user_type  WHERE  (users.is_deleted = '0' )  ${searchDataCondition} ORDER BY id DESC LIMIT ?, ?`;


  //     let queryResult;

  //     // pagination remove on all dropdown
  //     if (hasDropdown != null && hasDropdown != "") {
  //       const modifiedQueryString = selectQuery.substring(
  //         0,
  //         selectQuery.indexOf("ORDER BY")
  //       );
  //       queryResult = await db.query(modifiedQueryString, queryParams);
  //     } else {
  //       queryResult = await db.query(selectQuery, queryParams);
  //     }

  //     const modifiedQueryString = selectQuery.substring(
  //       0,
  //       selectQuery.indexOf("ORDER BY")
  //     );
  //     const totalResult = await db.query(modifiedQueryString);
  //     if (queryResult.length > 0) {
  //       var pageDetails = await calculatePagination(
  //         totalResult.length,
  //         currentPage,
  //         pageSize
  //       );
  //       var modifiedResult = [];
  //       for (let result of queryResult) {
  //         if (result.employee_id) {
  //           result.name = `${result.name} (${result.employee_id})`;
  //         }
  //         const employeeBaseSalary = await getEmployeeBaseSalary(result.id);
  //         modifiedResult.push({
  //           id: result.id,
  //           name: result.name,
  //           email: result.email,
  //           mobile: result.mobile,
  //           joining_date: result.joining_date,
  //           image: result.image,
  //           status: result.status,
  //           user_type: result.user_type,
  //           created_by: result.created_by,
  //           salary: employeeBaseSalary.salary,
  //           employee_id: result.employee_id,
  //           role_name: result.role_name,
  //         });
  //       }

  //       res.status(StatusCodes.OK).json({
  //         status: true,
  //         message: "Fetched successfully",
  //         data: modifiedResult,
  //         pageDetails: pageDetails,
  //       });
  //     } else {
  //       return res
  //         .status(StatusCodes.OK)
  //         .json({ status: false, message: "Data not found" });
  //     }
  //   } catch (error) {
  //     return res
  //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //       .json({ status: false, message: error.message });
  //   }
  // };


  // last working
  // const getAllStoredEmployeeDetails = async (req, res) => {
  //   try {
  //     const { user_id, user_type } = req.user;
  //     console.log("user_id", user_type)
  //     const pageSize = parseInt(req.query.pageSize) || 10;
  //     const currentPage = parseInt(req.query.pageNo) || 1;
  //     const searchData = req.query.search || "";
  //     const pageFirstResult = (currentPage - 1) * pageSize;
  //     const hasDropdown = req.query.isDropdown;
  
  //     // Start constructing the base query
  //     let searchDataCondition = "";
  //     let queryParams = [];
  
  //     // Add search condition if searchData is provided
  //     if (searchData) {
  //       searchDataCondition = `AND (users.name LIKE ? OR users.email LIKE ? OR users.mobile LIKE ? OR users.joining_date LIKE ?) `;
  //       queryParams.push(`%${searchData}%`, `%${searchData}%`, `%${searchData}%`, `%${searchData}%`);
  //     }
  
  //     // Filter data by user type (if user_type is not 3, restrict to the specific user_id)
  //     let userTypeCondition = "";
  //     console.log("user_type !== 3", user_type !== 3);
  //     if (user_type !== 3) {

  //       userTypeCondition = `AND users.id = ? `;
  //       queryParams.push(user_id);
  //     }
  
  //     // Construct the select query
  //     let selectQuery = `SELECT users.id, users.name, users.employee_id, users.email, users.mobile, 
  //                        users.joining_date, users.image, users.status, users.user_type, roles.name as role_name, 
  //                        users.created_by 
  //                        FROM users 
  //                        LEFT JOIN roles ON roles.id = users.user_type 
  //                        WHERE users.is_deleted = '0' ${searchDataCondition} ${userTypeCondition} 
  //                        ORDER BY users.id DESC`;
  
  //     // Remove pagination if hasDropdown is true
  //     if (!hasDropdown) {
  //       selectQuery += ` LIMIT ?, ?`;
  //       queryParams.push(pageFirstResult, pageSize);
  //     }
  
  //     // Execute the query
  //     const queryResult = await db.query(selectQuery, queryParams);
      
  //     console.log(`SELECT COUNT(*) as count 
  //     FROM users 
  //     WHERE users.is_deleted = '0' ${searchDataCondition} ${userTypeCondition} `)
  //     // Total records without pagination (for page details)
  //     const totalResult = await db.query(`SELECT COUNT(*) as count 
  //       FROM users 
  //       WHERE users.is_deleted = '0' ${searchDataCondition} ${userTypeCondition} `, queryParams.slice(0, -2));
        
  //       if (queryResult.length > 0) {
  //       // Pagination details
  //       const totalRecords = totalResult[0].count;
  //       const pageDetails = hasDropdown ? null : await calculatePagination(totalRecords, currentPage, pageSize);
  
  //       const modifiedResult = [];
  //       for (let result of queryResult) {
  //         if (result.employee_id) {
  //           result.name = `${result.name} (${result.employee_id})`;
  //         }
  //         const employeeBaseSalary = await getEmployeeBaseSalary(result.id);
  //         modifiedResult.push({
  //           id: result.id,
  //           name: result.name,
  //           email: result.email,
  //           mobile: result.mobile,
  //           joining_date: result.joining_date,
  //           image: result.image,
  //           status: result.status,
  //           user_type: result.user_type,
  //           created_by: result.created_by,
  //           salary: employeeBaseSalary.salary,
  //           employee_id: result.employee_id,
  //           role_name: result.role_name,
  //         });
  //       }
  
  //       res.status(StatusCodes.OK).json({
  //         status: true,
  //         message: "Fetched successfully",
  //         data: modifiedResult,
  //         pageDetails,
  //       });
  //     } else {
  //       return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  //   }
  // };

  // const getAllStoredEmployeeDetails = async (req, res) => {
  //   try {
  //     const { user_id, user_type } = req.user;
  //     console.log(user_id, user_type);
  //     const pageSize = parseInt(req.query.pageSize) || 10;
  //     const currentPage = parseInt(req.query.pageNo) || 1;
  //     const searchData = req.query.search || "";
  //     const pageFirstResult = (currentPage - 1) * pageSize;
  //     const hasDropdown = req.query.isDropdown;
  
  //     let searchDataCondition = "";
  //     let queryParams = [];
  //     let countQueryParams = [];
  
  //     if (searchData) {
  //       searchDataCondition = `AND (users.name LIKE ? OR users.email LIKE ? OR users.mobile LIKE ? OR users.joining_date LIKE ?) `;
  //       queryParams.push(`%${searchData}%`, `%${searchData}%`, `%${searchData}%`, `%${searchData}%`);
  //       countQueryParams.push(`%${searchData}%`, `%${searchData}%`, `%${searchData}%`, `%${searchData}%`);
  //     }
  
  //     let userTypeCondition = "";
  //     if (user_type !== 3) {
  //       userTypeCondition = `AND users.id = ? `;
  //       queryParams.push(user_id);
  //       countQueryParams.push(user_id);
  //     }
  
  //     let selectQuery = `SELECT users.id, users.name, users.employee_id, users.email, users.mobile, 
  //                        users.joining_date, users.image, users.status, users.user_type, roles.name as role_name, 
  //                        users.created_by 
  //                        FROM users 
  //                        LEFT JOIN roles ON roles.id = users.user_type 
  //                        WHERE users.is_deleted = '0' ${searchDataCondition} ${userTypeCondition} 
  //                        ORDER BY users.id DESC`;
  
  //     if (!hasDropdown) {
  //       selectQuery += ` LIMIT ?, ?`;
  //       queryParams.push(pageFirstResult, pageSize);
  //     }

  //     console.log(selectQuery, queryParams)
  
  //     const queryResult = await db.query(selectQuery, queryParams);
  
  //     const countQuery = `SELECT COUNT(*) as count 
  //                         FROM users 
  //                         WHERE users.is_deleted = '0' ${searchDataCondition} ${userTypeCondition}`;
  //     const totalResult = await db.query(countQuery, countQueryParams);
  
  //     if (queryResult.length > 0) {
  //       const totalRecords = totalResult[0].count;
  //       const pageDetails = hasDropdown ? null : await calculatePagination(totalRecords, currentPage, pageSize);
  
  //       const modifiedResult = [];
  //       for (let result of queryResult) {
  //         if (result.employee_id) {
  //           result.name = `${result.name} (${result.employee_id})`;
  //         }
  //         const employeeBaseSalary = await getEmployeeBaseSalary(result.id);
  //         modifiedResult.push({
  //           id: result.id,
  //           name: result.name,
  //           email: result.email,
  //           mobile: result.mobile,
  //           joining_date: result.joining_date,
  //           image: result.image,
  //           status: result.status,
  //           user_type: result.user_type,
  //           created_by: result.created_by,
  //           salary: employeeBaseSalary.salary,
  //           employee_id: result.employee_id,
  //           role_name: result.role_name,
  //         });
  //       }
  
  //       res.status(StatusCodes.OK).json({
  //         status: true,
  //         message: "Fetched successfully",
  //         data: modifiedResult,
  //         pageDetails,
  //       });
  //     } else {
  //       return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  //   }
  // };
  
  const getAllStoredEmployeeDetails = async (req, res) => {
    try {
      const { user_id, user_type } = req.user;
      console.log(user_id, user_type);
      const pageSize = parseInt(req.query.pageSize) || 10;
      const currentPage = parseInt(req.query.pageNo) || 1;
      const searchData = req.query.search || "";
      const pageFirstResult = (currentPage - 1) * pageSize;
      const hasDropdown = req.query.isDropdown;
  
      let searchDataCondition = "";
      let queryParams = [];
      let countQueryParams = [];
  
      if (searchData) {
        searchDataCondition = `AND (users.name LIKE ? OR users.email LIKE ? OR users.mobile LIKE ? OR users.joining_date LIKE ?) `;
        queryParams.push(`%${searchData}%`, `%${searchData}%`, `%${searchData}%`, `%${searchData}%`);
        countQueryParams.push(`%${searchData}%`, `%${searchData}%`, `%${searchData}%`, `%${searchData}%`);
      }
  
      let userTypeCondition = "";
      if (user_type == 3) {
        // When user_type is 3, filter data by `created_by` field
        userTypeCondition = `AND users.created_by = ? `;
        queryParams.push(user_id);
        countQueryParams.push(user_id);
      } else {
        // For other user types, filter data by `id` field
        userTypeCondition = `AND users.id = ? `;
        queryParams.push(user_id);
        countQueryParams.push(user_id);
      }
  
      let selectQuery = `SELECT users.id, users.name, users.employee_id, users.email, users.mobile, 
                         users.joining_date, users.image, users.status, users.user_type, roles.name as role_name, 
                         users.created_by 
                         FROM users 
                         LEFT JOIN roles ON roles.id = users.user_type 
                         WHERE users.is_deleted = '0' ${searchDataCondition} ${userTypeCondition} 
                         ORDER BY users.id DESC`;
  
      if (!hasDropdown) {
        selectQuery += ` LIMIT ?, ?`;
        queryParams.push(pageFirstResult, pageSize);
      }
  
      console.log(selectQuery, queryParams);
  
      const queryResult = await db.query(selectQuery, queryParams);
  
      const countQuery = `SELECT COUNT(*) as count 
                          FROM users 
                          WHERE users.is_deleted = '0' ${searchDataCondition} ${userTypeCondition}`;
      const totalResult = await db.query(countQuery, countQueryParams);
  
      if (queryResult.length > 0) {
        const totalRecords = totalResult[0].count;
        const pageDetails = hasDropdown ? null : await calculatePagination(totalRecords, currentPage, pageSize);
  
        const modifiedResult = [];
        for (let result of queryResult) {
          if (result.employee_id) {
            result.name = `${result.name} (${result.employee_id})`;
          }
          const employeeBaseSalary = await getEmployeeBaseSalary(result.id);
          modifiedResult.push({
            id: result.id,
            name: result.name,
            email: result.email,
            mobile: result.mobile,
            joining_date: result.joining_date,
            image: result.image,
            status: result.status,
            user_type: result.user_type,
            created_by: result.created_by,
            salary: employeeBaseSalary.salary,
            employee_id: result.employee_id,
            role_name: result.role_name,
          });
        }
  
        res.status(StatusCodes.OK).json({
          status: true,
          message: "Fetched successfully",
          data: modifiedResult,
          pageDetails,
        });
      } else {
        return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
  };
  

const getSingleEmployeeDetailById = async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = checkPositiveInteger.validate({ id });
    if (error)
      return res
        .status(StatusCodes.OK)
        .json({ status: false, message: error.message });

    const selectQuery = `SELECT users.*, roles.name as role_name, hr_teams.team_name
      FROM users LEFT JOIN roles ON roles.id = users.user_type 
      LEFT JOIN hr_teams ON hr_teams.id = users.team_id LEFT JOIN assets ON assets.asset_assigned_to = users.id WHERE users.id = ?`;

    const queryResult = await db.query(selectQuery, [id]);


    if (queryResult.length > process.env.VALUE_ZERO) {
      const employeeBaseSalary = await getEmployeeBaseSalary(id);
      queryResult[0].status_timeline = await historyTimeLine(id);
      queryResult[0].family_info = JSON.parse(queryResult[0].family_info);
      queryResult[0].manager_id = await getUserDetails(queryResult[0].manager_id);
      queryResult[0].supervisor_id = await getUserDetails(queryResult[0].supervisor_id);
      queryResult[0].skills =
        queryResult[0].skills && typeof queryResult[0].skills != "string"
          ? JSON.parse(queryResult[0].skills)
          : null;
      queryResult[0].assets = await fetchAssetDetails(queryResult[0].id)    

      delete queryResult[0].password;
      res.status(StatusCodes.OK).json({
        status: true,
        message: "Fetched successfully",
        data: {
          ...queryResult[0],
          salary: employeeBaseSalary.salary,
          salary_term: employeeBaseSalary.salary_term,
        },
      });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ status: false, message: "Data not found" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: error.message });
  }
};


// const getSingleEmployeeDetailById = async (req, res) => {
//   try {
//     const id = req.params.id;

//     // Validate ID
//     const { error } = checkPositiveInteger.validate({ id });
//     if (error) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         status: false,
//         message: "Invalid ID format",
//       });
//     }

//     // Query to fetch user details
//     const selectQuery = `
//       SELECT users.*, roles.name AS role_name, hr_teams.team_name 
//       FROM users 
//       LEFT JOIN roles ON roles.id = users.user_type 
//       LEFT JOIN hr_teams ON hr_teams.id = users.team_id 
//       WHERE users.id = ?
//     `;

//     const queryResult = await db.query(selectQuery, [id]);

//     if (queryResult.length > 0) {
//       const user = queryResult[0];

//       // Fetch additional details
//       const employeeBaseSalary = await getEmployeeBaseSalary(id);
//       const statusTimeline = await historyTimeLine(id);
//       const managerDetails = await getUserDetails(user.manager_id);
//       const supervisorDetails = await getUserDetails(user.supervisor_id);

//       // Parse JSON fields safely
//       const familyInfo = user.family_info ? JSON.parse(user.family_info) : null;
//       const skills = user.skills ? JSON.parse(user.skills) : null;
      
//       // Remove sensitive information
//       delete user.password;

//       // Handle null cases for manager and supervisor details
//       const managerName = managerDetails && managerDetails.length > 0 ? managerDetails[0].name : null;
//       const supervisorName = supervisorDetails && supervisorDetails.length > 0 ? supervisorDetails[0].name : null;

//       // Respond with the full employee data
//       res.status(StatusCodes.OK).json({
//         status: true,
//         message: "Fetched successfully",
//         data: {
//           ...user,
//           salary: employeeBaseSalary.salary,
//           salary_term: employeeBaseSalary.salary_term,
//           status_timeline: statusTimeline,
//           family_info: familyInfo,
//           manager_id: managerName,
//           supervisor_id: supervisorName,
//           skills: skills,
//         },
//       });
//     } else {
//       res.status(StatusCodes.OK).json({ status: false, message: "Data not found" });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "An error occurred while fetching employee details",
//     });
//   }
// };


const updateEmployeeDetails = async (req, res) => {

  try {
    const { name, email, mobile, joining_date, status, role_id, address, skills, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, dob, id } = req.body

    const { error } = profileValidations.validate({ name: name, email: email, joining_date: joining_date, mobile: mobile, })
    if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

    const { error: idError } = checkPositiveInteger.validate({ id })
    if (idError) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: idError.message })

    const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    var storePath = '';
    var graduationStorePath = '';
    var postGraduationStorePath = '';
    var doctorateStorePath = '';

    if (req.files != null) {
      const image = req.files.image
      const graduation = req.files.graduation
      const post_graduation = req.files.post_graduation
      const doctorate = req.files.doctorate
      const imageName = Date.now() + image.name
      const graduationImageName = Date.now() + graduation.name
      const postGraduationImageName = Date.now() + post_graduation.name
      const doctorateImageName = Date.now() + doctorate.name

      const uploadPath = process.cwd() + '/public/user_images/' + imageName;
      const graduationUploadPath = process.cwd() + '/public/user_images/' + graduationImageName;
      const postGraduationUploadPath = process.cwd() + '/public/user_images/' + postGraduationImageName;
      const doctorateUploadPath = process.cwd() + '/public/user_images/' + doctorateImageName;
      storePath = '/user_images/' + imageName;
      graduationStorePath = '/user_images/' + graduationImageName;
      postGraduationStorePath = '/user_images/' + postGraduationImageName;
      doctorateStorePath = '/user_images/' + doctorateImageName

      image.mv(uploadPath, async (err, response) => {
        if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
      })

      graduation.mv(graduationUploadPath, async (err, response) => {
        if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
      })
      post_graduation.mv(postGraduationUploadPath, async (err, response) => {
        if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
      })
      doctorate.mv(doctorateUploadPath, async (err, response) => {
        if (err) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
      })
    }


    const getRoleOnId = await roleById(role_id)
    const userType = getRoleOnId.role

    const updateQuery = `UPDATE users SET name = ?, email = ?, mobile = ?, joining_date = ?, image = ?, status = ?, role_id = ?, user_type = ?, address = ?, graduation = ?, post_graduation = ?, doctorate = ?, skills = ?, employment_status = ?, pan = ?, aadhar = ?, epf_no = ?, esi_no = ?, bank_name = ?, ifsc_code = ?, account_number = ?, department = ?, dob = ?, updated_at = ? WHERE id = ?`

    const queryResult = await db.query(updateQuery, [name, email, mobile, joining_date, storePath, status, role_id, userType, address, graduationStorePath, postGraduationStorePath, doctorateStorePath, skills, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, dob, updatedAt, id])

    if (queryResult.affectedRows > process.env.VALUE_ZERO) {
      res.status(StatusCodes.OK).json({ status: true, message: "Employee details updated successfully" })
    }
    else {
      return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Employee details Not updated" })
    }

  }
  catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  }
}

const deleteEmployee = async (req, res) => {

  try {
    const id = req.params.id
    const { error } = checkPositiveInteger.validate({ id })
    if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

    const deleteQuery = `UPDATE users SET is_deleted = ? WHERE id = ?`;
    const queryResult = await db.query(deleteQuery, ['1', id])

    if (queryResult.affectedRows > process.env.VALUE_ZERO) {
      res.status(StatusCodes.OK).json({ status: true, message: "Employee deleted successfully" })
    }
    else {
      return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Employee not deleted" })
    }

  }
  catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error })
  }
}

const getEmployeeTaskById = async (req, res) => {

  try {
    const id = req.query.id;
    const project = req.query.project;
    const status = req.query.status;

    const { error } = checkPositiveInteger.validate({ id })

    if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

    var queryParams = [];
    var searchDataCondition = '';

    if (project != null && project != '') {
      searchDataCondition += "AND tasks.project_name LIKE ? ";
      queryParams.push(`%${project}%`);
    }

    if (status != null && status != '') {
      searchDataCondition += "AND tasks.status LIKE ? ";
      queryParams.push(`%${status}%`);
    }

    queryParams.unshift(id);

    const selectQuery = `SELECT tasks.*, users.name as user_name, task_categories.name as task_category_name FROM tasks LEFT JOIN users ON users.id = tasks.assign_to LEFT JOIN task_categories ON task_categories.id = tasks.category_id WHERE tasks.assign_to = ? ${searchDataCondition}`
    const queryResult = await db.query(selectQuery, queryParams)

    if (queryResult.length > process.env.VALUE_ZERO) {
      res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResult })
    }
    else {
      res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Task not found" })
    }
  }
  catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
  }
}


const fetchAssetDetails = async (assetId) => {
  try {
      const query = `
          SELECT 
              assets.*, 
              suppliers.supplier_name, 
              assigned_user.name AS assigned_to_name, 
              assigned_by_user.name AS assigned_by_name,
              assigned_user.id AS assigned_to_id,
              assigned_by_user.id AS assigned_by_id
          FROM assets 
          LEFT JOIN suppliers ON suppliers.id = assets.asset_supplier_id
          LEFT JOIN users AS assigned_user ON assigned_user.id = assets.asset_assigned_to
          LEFT JOIN users AS assigned_by_user ON assigned_by_user.id = assets.asset_assigned_by
          WHERE assets.asset_assigned_to = ?`;

      // Execute the query
      const queryResult = await db.query(query, [assetId]);

      // If no data is found, return an empty array
      if (queryResult.length === 0) return [];

      const finalData = [];

      // Iterate through each row
      for (const row of queryResult) {
          finalData.push({
              id: row.id,
              asset_name: row.asset_name,
              asset_model_number: row.asset_model_number,
              asset_uin_number: row.asset_uin_number,
              asset_price: row.asset_price,
              asset_purchase_date: moment(row.asset_purchase_date).format('YYYY-MM-DD'),
              asset_warranty_guarantee_period: row.asset_warranty_guarantee_period,
              asset_warranty_guarantee_start_date: moment(row.asset_warranty_guarantee_start).format('YYYY-MM-DD'),
              asset_warranty_guarantee_end_date: moment(row.asset_warranty_guarantee_end).format('YYYY-MM-DD'),
              asset_warranty_guarantee_value: row.asset_warranty_guarantee_value,
              asset_supplier_id: row.asset_supplier_id,
              asset_status: row.asset_status,
              asset_created_at: moment(row.asset_created_at).format('YYYY-MM-DD'),
              supplier_name: row.supplier_name,
              asset_image: row.asset_image,
              asset_assign_status: row.asset_assigned_to ? 'assigned' : 'not assigned',
              asset_assign_to: row.assigned_to_name || null,
              asset_assign_at: row.asset_assigned_at
                  ? moment(row.asset_assigned_at).format('YYYY-MM-DD')
                  : null,
              asset_assign_by: row.assigned_by_name || null,
          });
      }

      return finalData;
  } catch (error) {
      throw new Error(`Error fetching asset details: ${error.message}`);
  }
};


module.exports = { getAllStoredEmployeeDetails, getSingleEmployeeDetailById, updateEmployeeDetails, deleteEmployee, getEmployeeTaskById }