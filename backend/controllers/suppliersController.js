require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes, OK } = require("http-status-codes");
const {
    supplierSchema,
    checkPositiveInteger,
} = require("../helpers/validation");
const { calculatePagination } = require("../helpers/general");
const {
    getSupplierAddresses,
    convertBase64Image,
    generateSupplierCode,
    supplier_status,
} = require("../helpers/commonHelper");

const createSuppliers = async (req, res) => {
    try {
        const { error } = supplierSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const {
            supplier_name,
            owner_name,
            cashier_name,
            bank_id,
            account_holder_name,
            account_number,
            branch_name,
            ifsc_code,
            upi_id,
            address,
        } = req.body;
        // return
        let storePath;
        if (req.body.upi_image) {
            let base64File = req.body.upi_image.replace(
                /^data:image\/\w+;base64,/,
                ""
            );
            storePath = await convertBase64Image(
                base64File,
                "./public/supplier_upi_images/",
                "/supplier_upi_images/"
            );
        }

        const supplierData = {
            supplier_name,
            owner_name,
            cashier_name,
            bank_id,
            account_holder_name,
            account_number,
            branch_name,
            ifsc_code,
            upi_id,
            upi_image: storePath,
            created_by: req.user.user_id,
        };

        // check gst mark default settings
        if (address.length > process.env.VALUE_ZERO) {
            // Check if at least one "is_default" value is greater than or equal to 1
            const defaultCount = address.filter(
                (address) => parseInt(address.is_default) >= 1
            ).length;

            if (defaultCount < 1) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: false, message: "No address is set as default" });
            }
        }

        const result = await db.query("INSERT INTO suppliers SET ?", [
            supplierData,
        ]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            // insert addresses into
            if (address.length > process.env.VALUE_ZERO) {
                for (let i = 0; i < address.length; i++) {
                    const addressData = address[i];
                    addressData.supplier_id = result.insertId;
                    // addressData.state =  addressData.state.label;
                    const addressQuery = await db.query(
                        "INSERT INTO supplier_addresses SET ?",
                        [addressData]
                    );
                }
            }
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "suppliers created successfully" });
        } else {
            return res
                .status(StatusCodes.OK)
                .json({ status: false, message: "Error creating a new company" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.OK)
            .json({ status: false, message: error.message });
    }
};


/** get suppliers based on status */
// const getSuppliers = async (req, res) => {
//     try {
//         const hasDropdown = req.query.isDropdown === "true" || "false";

//         const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
//         const currentPage = parseInt(req.query.pageNo) || 1;
//         const searchData = req.query.search || "";
//         const pageFirstResult = (currentPage - 1) * pageSize;

//         const searchColumns = [
//             "suppliers.supplier_name",
//             "suppliers.owner_name",
//             "suppliers.cashier_name",
//             "suppliers.supplier_code",
//             "banks.bank_name",
//             "suppliers.account_holder_name",
//             "suppliers.account_number",
//             "suppliers.branch_name",
//             "suppliers.ifsc_code",
//             "suppliers.upi_id",
//         ];
//         const status = req.query.status || "";
//         var searchConditions = [];
//         var conditionString = "";
//         let whereCondition = "";

//         if (status) {
//             whereCondition = `WHERE suppliers.status = ${status}`;
//         }

//         if (searchData != null && searchData != "") {
//             searchColumns.forEach((column) => {
//                 searchConditions.push(`${column} LIKE '%${searchData}%'`);
//             });
//             conditionString = "AND " + (searchConditions.join(" OR "));
//         }

//         const query = `
//             SELECT suppliers.*, banks.bank_name 
//             FROM suppliers 
//             LEFT JOIN banks On banks.id = suppliers.bank_id ${whereCondition} ${conditionString}
//             ORDER BY suppliers.id 
//             DESC 
//             LIMIT 
//             ${pageFirstResult}, ${pageSize}`;
//         let suppliers;

//         // pagination remove on all dropdown
//         if (!hasDropdown) {
//             const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
//             suppliers = await db.query(modifiedQueryString);

//             // return only dropdown data

//             if (suppliers.length > process.env.VALUE_ZERO) {
//                 var finalData = [];

//                 for (const row of suppliers) {
//                     finalData.push({
//                         id: row.id,
//                         supplier_name: row.supplier_name,
//                     });
//                 }
//                 return res.status(StatusCodes.OK).json({
//                     status: true,
//                     message: "Data fetch successfully",
//                     data: finalData,
//                 });
//             } else {
//                 // If no data is found, return an empty array and appropriate message
//                 return res.status(StatusCodes.OK).json({
//                     status: false,
//                     message: "Data not found",
//                 });
//             }
//         } else {
//             suppliers = await db.query(query);

//             // remove after order by
//             const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
//             const totalResult = await db.query(modifiedQueryString);

//             if (suppliers.length > process.env.VALUE_ZERO) {
//                 var finalData = [];
//                 var pageDetails = await calculatePagination(
//                     totalResult.length,
//                     currentPage,
//                     pageSize
//                 );

//                 for (const row of suppliers) {
//                     const getSupplierAddressesData = await getSupplierAddresses(row.id);
//                     finalData.push({
//                         id: row.id,
//                         supplier_name: row.supplier_name,
//                         owner_name: row.owner_name,
//                         cashier_name: row.cashier_name,
//                         supplier_code: row.supplier_code,
//                         bank_id: row.bank_id,
//                         bank_name: row.bank_name,
//                         account_holder_name: row.account_holder_name,
//                         account_number: row.account_number,
//                         branch_name: row.branch_name,
//                         ifsc_code: row.ifsc_code,
//                         status: supplier_status[row.status],
//                         upi_id: row.upi_id,
//                         supplier_addresses: getSupplierAddressesData,
//                     });
//                 }
//                 return res.status(StatusCodes.OK).json({
//                     status: true,
//                     message: "Data fetch successfully",
//                     data: finalData,
//                     pageDetails: pageDetails,
//                 });
//             } else {
//                 // If no data is found, return an empty array and appropriate message
//                 return res.status(StatusCodes.OK).json({
//                     status: false,
//                     message: "Data not found",
//                 });
//             }
//         }

//         //const suppliers = await db.query(query);
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message,
//         });
//     }
// };

const getSuppliers = async (req, res) => {
    try {
      const hasDropdown = req.query.isDropdown === "true";
      const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
      const currentPage = parseInt(req.query.pageNo) || 1;
      const searchData = req.query.search || "";
      const pageFirstResult = (currentPage - 1) * pageSize;
  
      const searchColumns = [
        "suppliers.supplier_name",
        "suppliers.owner_name",
        "suppliers.cashier_name",
        "suppliers.supplier_code",
        "banks.bank_name",
        "suppliers.account_holder_name",
        "suppliers.account_number",
        "suppliers.branch_name",
        "suppliers.ifsc_code",
        "suppliers.upi_id",
      ];
  
      const status = req.query.status || "";
      let searchConditions = [];
      let conditionString = "";
      let whereCondition = "";
  
      if (status) {
        whereCondition = `WHERE suppliers.status = ${status}`;
      }
  
      if (searchData != null && searchData != "") {
        searchColumns.forEach((column) => {
          searchConditions.push(`${column} LIKE '%${searchData}%'`);
        });
        conditionString = "AND (" + searchConditions.join(" OR ") + ")";
      }
  
      let query = `
        SELECT suppliers.*, banks.bank_name 
        FROM suppliers 
        LEFT JOIN banks On banks.id = suppliers.bank_id 
        ${whereCondition} ${conditionString}
        ORDER BY suppliers.id DESC`;
  
      if (!hasDropdown) {
        query += ` LIMIT ${pageFirstResult}, ${pageSize}`;
      }
  
      let suppliers;
  
      if (hasDropdown) {
        whereCondition = `WHERE suppliers.status = 3`;
        query = `
          SELECT suppliers.id, suppliers.supplier_name 
          FROM suppliers 
          ${whereCondition}
          ORDER BY suppliers.supplier_name ASC`;
        suppliers = await db.query(query);
  
        if (suppliers.length > 0) {
          const finalData = suppliers.map(row => ({
            id: row.id,
            supplier_name: row.supplier_name,
          }));
  
          return res.status(StatusCodes.OK).json({
            status: true,
            message: "Data fetched successfully",
            data: finalData,
          });
        } else {
          return res.status(StatusCodes.OK).json({
            status: false,
            message: "Data not found",
          });
        }
      } else {
        suppliers = await db.query(query);
        const modifiedQueryString = query.substring(0, query.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);
  
        if (suppliers.length > 0) {
          const pageDetails = await calculatePagination(
            totalResult.length,
            currentPage,
            pageSize
          );
  
          const finalData = await Promise.all(
            suppliers.map(async (row) => {
              const getSupplierAddressesData = await getSupplierAddresses(row.id);
              return {
                id: row.id,
                supplier_name: row.supplier_name,
                owner_name: row.owner_name,
                cashier_name: row.cashier_name,
                supplier_code: row.supplier_code,
                bank_id: row.bank_id,
                bank_name: row.bank_name,
                account_holder_name: row.account_holder_name,
                account_number: row.account_number,
                branch_name: row.branch_name,
                ifsc_code: row.ifsc_code,
                status: supplier_status[row.status],
                upi_id: row.upi_id,
                supplier_addresses: getSupplierAddressesData,
              };
            })
          );
  
          return res.status(StatusCodes.OK).json({
            status: true,
            message: "Data fetched successfully",
            data: finalData,
            pageDetails: pageDetails,
          });
        } else {
          return res.status(StatusCodes.OK).json({
            status: false,
            message: "Data not found",
          });
        }
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  };
  

const getSuppliersById = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const { error } = checkPositiveInteger.validate({ id: supplierId });
        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: error.message });
        }

        const query = `SELECT suppliers.*, banks.bank_name, banks.logo FROM suppliers LEFT JOIN banks On banks.id = suppliers.bank_id WHERE suppliers.id = ?`;

        const suppliers = await db.query(query, [supplierId]);

        if (suppliers.length > process.env.VALUE_ZERO) {
            var finalData = [];

            for (const row of suppliers) {
                const getSupplierAddressesData = await getSupplierAddresses(row.id);

                finalData.push({
                    id: row.id,
                    supplier_name: row.supplier_name,
                    owner_name: row.owner_name,
                    cashier_name: row.cashier_name,
                    supplier_code: row.supplier_code,
                    bank_id: row.bank_id,
                    bank_name: row.bank_name,
                    bank_logo: row.logo,
                    account_holder_name: row.account_holder_name,
                    account_number: row.account_number,
                    branch_name: row.branch_name,
                    ifsc_code: row.ifsc_code,
                    status: supplier_status[row.status],
                    upi_id: row.upi_id,
                    upi_image: row.upi_image,
                    supplier_addresses: getSupplierAddressesData,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data fetch successfully",
                data: finalData[0],
            });
        } else {
            // If no data is found, return an empty array and appropriate message
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found",
            });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const updateSuppliers = async (req, res) => {
    try {
        const supplierId = req.params.id;
        // return   
        const { error } = supplierSchema.validate(req.body);
        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message,
            });
        }

        const {
            supplier_name,
            owner_name,
            cashier_name,
            supplier_code,
            bank_id,
            account_holder_name,
            account_number,
            branch_name,
            ifsc_code,
            upi_id,
            address,
        } = req.body;

        let storePath;

        if (req.body.upi_image) {
            // Check if the image path is the specified one
            if (req.body.upi_image.startsWith("/supplier_upi_images/")) {
                storePath = req.body.upi_image;
            } else {
                let base64File = req.body.upi_image.replace(
                    /^data:image\/\w+;base64,/,
                    ""
                );
                storePath = await convertBase64Image(
                    base64File,
                    "./public/supplier_upi_images/",
                    "/supplier_upi_images/"
                );
            }
        }



        const supplierData = {
            supplier_name,
            owner_name,
            cashier_name,
            supplier_code,
            bank_id,
            account_holder_name,
            account_number,
            branch_name,
            ifsc_code,
            upi_id,
            upi_image: storePath,
            updated_by: req.user.user_id,
        };

        // check gst mark default settings
        if (address.length > process.env.VALUE_ZERO) {
            // Check if at least one "is_default" value is greater than or equal to 1
            const defaultCount = address.filter(
                (address) => parseInt(address.is_default) >= 1
            ).length;

            if (defaultCount < 1) {
                return res
                    .status(StatusCodes.OK)
                    .json({ status: false, message: "No address is set as default" });
            }
        }

        const result = await db.query("UPDATE suppliers SET ? WHERE id = ?", [
            supplierData,
            supplierId,
        ]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            // insert addresses into
            if (address.length > process.env.VALUE_ZERO) {
                // delete previous all addresses of supplier
                const deleteAddress = await db.query(
                    "DELETE FROM supplier_addresses WHERE supplier_id = ?",
                    [supplierId]
                );
                for (let i = 0; i < address.length; i++) {
                    const addressData = address[i];
                    addressData.supplier_id = supplierId;
                    // addressData.state =  addressData.state.label;
                    const addressQuery = await db.query(
                        "INSERT INTO supplier_addresses SET ?",
                        [addressData]
                    );
                }
            }
            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "suppliers updated successfully" });
        } else {
            return res
                .status(StatusCodes.OK)
                .json({ status: false, message: "Error creating a new company" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.OK)
            .json({ status: false, message: error.message });
    }
};

const deleteSuppliers = async (req, res) => {
    try {
        const supplierId = req.params.id;
        // return
        const { error } = checkPositiveInteger.validate({ id: supplierId });
        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: false, message: error.message });
        }
        const existingSupplier = await db.query(
            "SELECT * FROM suppliers WHERE id = ?",
            [supplierId]
        );

        if (existingSupplier.length === process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ status: false, message: "Supplier not found" });
        }

        const result = await db.query("DELETE FROM suppliers WHERE id = ?", [
            supplierId,
        ]);

        if (result.affectedRows > process.env.VALUE_ZERO) {
            // delete previous all addresses of supplier
            const deleteAddress = await db.query(
                "DELETE FROM supplier_addresses WHERE supplier_id = ?",
                [supplierId]
            );

            return res
                .status(StatusCodes.OK)
                .json({ status: true, message: "Supplier deleted successfully" });
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Error deleting the supplier" });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

/** approve or reject status of suppliers by id */
const approveOrRejectSuppliersById = async (req, res) => {
    try {
        const status = req.query.status;
        const id = req.query.id;
        // Check if status is either '2' or '3'
        // return
        const supplier_code = await generateSupplierCode(id);

        if (status === "2" || status === "3") {
            let updateQuery = `UPDATE suppliers SET status = '${status}'`;
            if (status === "2") {
                updateQuery += `, supplier_code = '${supplier_code}'`;
            }
            updateQuery += ` WHERE id = ${id}`;
            const updateResults = await db.query(updateQuery);

            if (updateResults.affectedRows === 0) {
                return res.status(400).json({ status: false, message: "Invalid id" });
            }

            const message =
                status === "2"
                    ? "Supplier approved successfully"
                    : "Supplier rejected successfully";
            return res.status(200).json({ status: true, message });
        } else {
            return res
                .status(400)
                .json({ status: false, message: "Invalid status or id" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    createSuppliers,
    getSuppliers,
    getSuppliersById,
    updateSuppliers,
    deleteSuppliers,
    approveOrRejectSuppliersById,
};
