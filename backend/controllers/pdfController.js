const dotenv = require("dotenv");
const url = require("url");
const { dirname } = require("path");
const path = require("path");
const { makeDb } = require("../db");
const moment = require("moment");
const fs = require("fs");
const mammoth = require("mammoth");
const htmlPdf = require("html-pdf-node");
const { PDFDocument } = require("pdf-lib");
const { StatusCodes } = require("http-status-codes");

dotenv.config();

const PuppeteerHTMLPDF = require("puppeteer-html-pdf");
const { checkPositiveInteger } = require("../helpers/validation");
const sharp = require('sharp');
const { fetchMergedProformaInvoicesDetailsById } = require("./proformaInvoiceController");
const { calculateGstAmount } = require("./invoiceController");

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// Convert millimeters to pixels assuming 72 DPI
const A4_WIDTH_PX = Math.floor(A4_WIDTH_MM * 72 / 25.4);
const A4_HEIGHT_PX = Math.floor(A4_HEIGHT_MM * 72 / 25.4);
/** html puppeteer */
const htmlPDF = new PuppeteerHTMLPDF();
const db = makeDb();

const currentModuleUrl = url.pathToFileURL(__filename).href;
// Convert the URL to the file path
const currentModulePath = url.fileURLToPath(currentModuleUrl);

// Get the directory name
const currentModuleDir = dirname(currentModulePath);
let publicFolder = path.join(currentModuleDir, "../public/measurement_pdf");


const convertDataToPDF = async (measurement_Id) => {
  try {
    // const measurement_Id = req.query.id;

    const apiUrl = `${process.env.MEASUREMENT_PDF}/${measurement_Id}`;
    // Fetch measurement data from the dynamic API endpoint
    const data = await fetch(apiUrl)
      .then((response) => response.json())
      .catch((error) => console.error(error));
    // Check if the API response is empty
    if (!data?.data) {
      return res.status(404).json({
        success: false,
        message: "Error Fetching Measurement Data",
      });
    }

    // Extract relevant information from the API response
    const {
      // id,
      measurement_amount,
      measurement_date,
      measurement_unique_id,
      outlet_id,
      po_number,
      complaint_for,
      complaint_unique_id,
      complaint_type_name,
      company_details,
      regional_office_name,
      sales_area_name,
      outlet_name,
      outlet_location,
      outlet_address,
      outelet_cc_number,
      outlet_category,
      po_details,
      complaint_order_by,
      items_data,
    } = data.data[0];

    const Logo = "./public/assets/CMS LOGO.jpg";

    // convert image to Base64 and then Inserted to htmlContent
    const base64Str = base64Encode(Logo);

    // check if outlet is available for Energy Company
    if (complaint_for == 1) {
      if (!outlet_id) {
        return res.status(404).json({
          success: false,
          message: "Outlet not found for Energy Company",
        })
      }
    }

    // Build the HTML content for the PDF
    const htmlContent =
      `
      <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>

          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }

              .invoice-box {
                  max-width: 800px;
                  margin: auto;
                  padding: 10px;
                  border: 1px solid #ddd;
                  background-color: #fff;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
              }

              .header {
                  text-align: right;
              }

              .bill-details {
                  display: flex;
                  justify-content: space-between;
                  /* margin-bottom: 20px; */
              }

              .bill-details .details-left,
              .bill-details .details-right {

                  text-align: left
              }

              .invoice-table {
                  /* width: 100%; */
                  border-collapse: collapse;
                  margin-bottom: 20px;
                  font-size: 13px;
              }

              .invoice-table th,
              .invoice-table td {
                  border: 1px solid #ddd;
                  padding: 8px;
              }

              .invoice-table th {
                  background-color: #f2f2f2;
                  text-align: left;
              }

              .invoice-table .total-label {
                  text-align: right;
                  background-color: #f9f9f9;
                  font-weight: bold;
              }



              .list {
                  list-style-type: none;
              }

              .font_size {
                  font-size: 14px;
              }

              .font-25 {
                  font-size: 18px;
                  text-decoration: underline;

              }

              .site-heading {
                  font-weight: bold;
                  text-align: right; 
                  font-size: 21px;
              }

              .title {
                  font-size: 25px;
                  font-weight: bold;
                  /* margin-bottom: 51px; */
              }

              .name-col{
              
              font-size:12px;
              font-weight:bold;}

              .col-md{
                  font-weight:bold;
                  font-size:12px;
              }

              .name-heading{
                  max-width:45px;
              }


              *{
                  text-transform: uppercase;
                  font-size: 11px;
              }

              .name-heading {
                  max-width: 140px;
                  white-space: normal;
                  font-weight: bold;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
              }

              .nameAndLogo {
                  display: flex;
                  justify-content: space-between;
              }

              .col-bold {
                  font-weight: bold;
              }
          </style>

      </head>

  <body>
      
      ${heading()}
      <div class="site-heading">Site Measurement Sheet</div>
      <hr>

          <div class="bill-details">
              <div class="details-left font_size">
                  <span class="font-20" style="text-decoration: underline;"><strong>&nbsp;Customer Details&nbsp;</strong></span>

                  <table style="margin-top: 1.2rem;">
                      <tr>
                          <th>Client</th>
                          <td>: <strong>${company_details?.company_name ?? ""}</strong></td>
                      </tr>
                      <tr>
                          <th>Regional Office</th>
                          <td>: ${regional_office_name ?? ""}</td>
                      </tr>
                      <tr>
                          <th>Sales Area</th>
                          <td>: ${sales_area_name ?? ""}</td>
                      </tr>
                      <tr>
                          <th>PO No.</th>
                          <td>: ${po_number ?? ""}</td>
                      </tr>
                      <tr>
                          <th>PO Date </th>
                          <td>: ${po_details?.po_date ?? ""}</td>
                      </tr>

                      <tr>
                          <th>Complaint No.</th>
                          <td>: ${complaint_unique_id ?? ""}</td>
                      </tr>
                  </table>
              </div>

              <div class="details-left font_size">
                  <span class="font-20" style="text-decoration: underline;"><strong>&nbsp;Billing Details&nbsp;</strong></span>


                  <table style="margin-top: 1.2rem;">
                      <tr>
                          <th>Measurement No.</th>
                          <td>: ${measurement_unique_id ?? ""}</td>
                      </tr>
                      <tr>
                          <th>Measurement Date</th>
                          <td>: ${moment(measurement_date).format("DD-MM-YYYY")}</td>
                      </tr>
                  </table>
              </div>
              <div class="details-right font_size">
                  <span class="font-20" style="text-decoration: underline;"><strong>&nbsp;Outlet Details&nbsp;</strong> </span>

                  <table style="margin-top: 1.2rem;">
                      <tr>
                          <th>Outlet Name </th>
                          <td>: ${outlet_name ?? " - "}</td>
                      </tr>
                      <tr>
                          <th>Location</th>
                          <td>: ${outlet_location ?? " - "} ${outlet_address ?? " - "}</td>
                      </tr>
                      <tr>
                          <th>CC Code</th>
                          <td>: ${outelet_cc_number ?? " - "}</td>
                      </tr>
                      <tr>
                          <th>Category </th>
                          <td>: ${outlet_category ?? " - "}</td>
                      </tr>

                      <tr>
                          <th>Order By </th>
                          <td>: ${complaint_order_by ?? ""}</td>
                      </tr>
                      <tr>
                          <th>Work</th>
                          <td>: ${complaint_type_name ?? ""}</td>
                      </tr>
                  </table>

              </div>
          </div>
          <hr />
          <table class="invoice-table">
              <thead>
                  <tr>
                      <th>S.No.</th>
                      <th>Order Line No.</th>
                      <th>Particular</th>
                      <th>No.</th>
                      <th>Length (IN METER)</th>
                      <th>Breadth (In METER)</th>
                      <th>Depth (IN METER)</th>
                      <th>quantity</th>
                      <th>Total qty</th>
                      <th>Unit</th>
                      <th>Rate</th>
                      <th>Amount</th>
                  </tr>
              </thead>

              <tbody>

              ${items_data?.map(
        (data, idx) => `
                      <tr key="${idx}">
                          <td class="col-bold">${idx + 1}</td>
                          <td class="col-bold">${data.order_line_number}</td>
                          <td class="name-heading">${data.item_name}</td>
                          <td class="col-bold"></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="col-bold">${parseFloat(data.total_qty).toFixed(2)}</td>
                          <td class="col-bold">${data.unit}</td>
                          <td class="col-bold">${parseFloat(data.rate).toFixed(2)}</td>
                          <td class="col-bold">${parseFloat(data.rate * data.total_qty).toFixed(2)}</td>
                          ${data.childArray?.map(
          (data, idx) => `
                                  <tr key="${idx}">
                                      <td></td>
                                      <td></td>
                                      <td>${data.description}</td>
                                      <td>${data.no}</td>
                                      <td>${data.length}</td>
                                      <td>${data.breadth}</td>
                                      <td>${data.depth}</td>
                                      <td>${parseFloat(data.qty).toFixed(2)}</td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                  </tr>
                                  `
        )}
                      
                      </tr>
                  `
      )}  
                  <tr>
                      <td colspan="11" class="total-label">Total</td>
                      <td class="col-bold">₹${measurement_amount}</td>
                  </tr>
              </tbody>
          </table>
      </div>
  </body>
</html>
      `;

    // Generate a unique filename for the PDF
    const filename = `${complaint_unique_id}-${measurement_Id}.pdf`;
    // Save the PDF to the public folder
    const filePath = path.join(publicFolder, filename);

    const options = {
      format: "A4",
      path: filePath, // you can pass path to save the file
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    };

    htmlPDF.setOptions(options);

    await htmlPDF.create(htmlContent);

    // Create the public URL
    const publicUrl = `/measurement_pdf/${filename}`;
    // Send the URL as the response
    return publicUrl;
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

/** Convert image to Base64 to be shown in PDF */
function base64Encode(file) {
  // read binary data
  const bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
}

const convertDocsToPdfs = async (docFiles, outputDir) => {
  const convertedPdfs = [];
  for (const docFile of docFiles) {
    const outputPdf = path.join(
      outputDir,
      path.basename(docFile).replace(/\.docx?$/, ".pdf")
    );
    if (path.extname(docFile) === ".docx") {
      await convertDocxToPdf(docFile, outputPdf);
    } else if (path.extname(docFile) === ".doc") {
      await convertDocxToPdf(docFile, outputPdf);
    }
    await convertDocxToPdf(docFile, outputPdf);
    convertedPdfs.push(outputPdf);
  }
  return convertedPdfs;
};

const categorizedAttachments = async (attachments) => {
  const pdfPaths = [];
  const docFiles = [];
  const imageFiles = [];

  if (!attachments || !attachments.filePath || !Array.isArray(attachments.filePath)) {
    throw new Error('Invalid attachments structure');
  }

  for (const fileData of attachments.filePath) {
    const fullPath = path.join(process.cwd(), "public", fileData.file);

    switch (fileData.fileFormat.toLowerCase()) {
      case "pdf":
        pdfPaths.push(fullPath);
        break;
      case "docx":
      case "doc":
        docFiles.push(fullPath);
        break;
      case "jpg":
      case "jpeg":
      case "png":
        const resizedImagePath = await resizeImageToA4(fullPath);
        imageFiles.push(resizedImagePath);
        break;
      default:
    }
  }

  return { pdfPaths, docFiles, imageFiles };
};

const resizeImageToA4 = async (imagePath) => {
  const outputImagePath = imagePath.replace(/(\.[\w\d_-]+)$/i, '_A4$1');
  try {
    await sharp(imagePath)
      .resize({
        width: Math.min(A4_WIDTH_PX, A4_HEIGHT_PX),
        height: Math.min(A4_WIDTH_PX, A4_HEIGHT_PX),
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(outputImagePath);
    return outputImagePath;
  } catch (err) {
    console.error(`Error resizing image: ${err.message}`);
    return imagePath;
  }
};

const attachAllDocumentsByMeasurementId = async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = checkPositiveInteger.validate({ id });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }

    const check = await getMeasurementDetails(id);

    if (check[0].pdf_attachment !== null) {
      return res.status(StatusCodes.OK).json({ status: true, url: check[0].pdf_attachment });
    }

    // Setup output directory
    const outputDir = path.join(process.cwd(), "public", "output");
    // If output directory doesn't exist, create it
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Creating output file name with measurement id
    const outputFileName = `measurement_attachment_${id}.pdf`;
    const outputPath = `/output/${outputFileName}`;
    const fullOutputPath = path.join(outputDir, outputFileName);


    // If output file already exists, return it
    if (fs.existsSync(fullOutputPath)) {
      return res.status(StatusCodes.OK).json({ status: true, message: "Already Attached", url: outputPath });
    }

    const billPdfPath = await convertDataToPDF(id);
    const fullBillPath = path.join(process.cwd(), "public", billPdfPath);

    const complaint = await getComplaintDetailByMeasurementId(id);
    if (complaint.length > 0) {
      const attachments = await getPiAttachmentDetails(complaint[0].complaint_id);

      // Storing full paths of all type of documents in corresponding variables
      const { pdfPaths, docFiles, imageFiles } = await categorizedAttachments(attachments);

      // Converting doc file to pdf
      const convertedPdfs = await convertDocsToPdfs(docFiles, outputDir);
      const allPdfs = [fullBillPath, ...pdfPaths, ...convertedPdfs];

      // Attaching all pdfs and images
      await attachPdfsAndImages(allPdfs, imageFiles, fullOutputPath);

      const updateQuery = `UPDATE measurements SET pdf_attachment = ? WHERE id = ?`;
      await db.query(updateQuery, [outputPath, id]);

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Attached Successfully",
        url: outputPath,
      });
    }

    return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "No Complaint Found" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  }
};

// helper


async function getMeasurementDetails(
  id
) {
  try {
    const query = `SELECT * FROM measurements 
        WHERE id = ${id}`;
    const result = await db.query(query);

    return result;
  } catch (error) {
    return error;
  }
}


async function getPiAttachmentDetails(complaint_id) {
  const query = `SELECT * FROM pi_attachment WHERE complaint_id = ?`;
  const queryResult = await db.query(query, [complaint_id]);

  for (let item of queryResult) {
    item.filePath = item.filePath ? JSON.parse(item.filePath) : [];
  }

  return queryResult[0];
}

async function getComplaintDetailByMeasurementId(measurement_id) {
  const selectQuery = `SELECT complaint_id FROM measurements WHERE id = ?`;
  const queryResult = await db.query(selectQuery, [measurement_id]);

  return queryResult;
}

async function convertDocxToPdf(inputPath, outputPath) {
  const result = await mammoth.convertToHtml({ path: inputPath });
  const htmlContent = result.value;

  const file = { content: htmlContent };
  const options = {
    format: "A4",
    margin: { top: 20, left: 20, right: 20, bottom: 20 },
  };

  const pdfBuffer = await htmlPdf.generatePdf(file, options);
  fs.writeFileSync(outputPath, pdfBuffer);
}

async function attachPdfsAndImages(pdfPaths, imagePaths, outputPath) {
  const pdfDoc = await PDFDocument.create();

  for (const pdfPath of pdfPaths) {
    const pdfBytes = fs.readFileSync(pdfPath);
    const existingPdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await pdfDoc.copyPages(
      existingPdf,
      existingPdf.getPageIndices()
    );
    copiedPages.forEach((page) => pdfDoc.addPage(page));
  }

  for (const imagePath of imagePaths) {
    const imageBytes = fs.readFileSync(imagePath);
    const imageExt = imagePath.split(".").pop().toLowerCase();
    let image;
    if (imageExt === "jpg" || imageExt === "jpeg") {
      image = await pdfDoc.embedJpg(imageBytes);
    } else if (imageExt === "png") {
      image = await pdfDoc.embedPng(imageBytes);
    }
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}


function heading() {
  const Logo = "./public/assets/CMS LOGO.jpg";
  const base64Str = base64Encode(Logo);
  return (
    `<div class="invoice-box"><div class="nameAndLogo">
          <img src="data:image/jpeg;base64, ` +
    base64Str +
    `" alt="cms-image" width="180px" height="70px">
          <header class="header">
              <span class="title">CMS Electricals Private Limited</span><br />
              2nd Floor ,plot No - 133 ,near Syndicate Bank Village </br>Tilpat ,Faridabad ,Haryana 121003
              </br><strong>Email</strong> :projects@cmselectricals.com</br><strong>web</strong>
              :www.cmselectricals.com</br><strong>Tel</strong> : +91
              -129-2279955
          </header>

      </div>
      <hr>`
  );
}

async function generateItemsTableRows(itemsData, publicDir, HSN) {
  let rows = "";
  let subtotal = 0;
  let tax = 0;
  let srNo = 1;
  const measurementPdfs = new Set();

  for (const item of itemsData) {
    const measurements = await getMeasurementDetails(item.measurement_id);
    if (!measurements[0]?.pdf_attachment) {
      throw new Error(`Please first create measurement pdf`);
    }
    measurementPdfs.add(path.join(publicDir, measurements[0].pdf_attachment));

    const itemAmount = parseFloat(
      parseFloat(item.total_qty) * parseFloat(item.rate)
    ).toFixed(2);
    const itemGst = await calculateGstAmount(item.measurement_id);

    subtotal += parseFloat(itemAmount);
    tax += parseFloat(itemGst);

    rows += `
          <tr>
              <td>${srNo++}</td>
              <td>${item.order_line_number}</td>
              <td>${item.item_name}</td>
              <td>${HSN?.hsn_code ?? "NA"}</td>
              <td>${item.unit}</td> 
              <td>${item.total_qty}</td>
              <td>${item.rate}</td>
              <td>${itemAmount}</td>
          </tr>
      `;
  }

  const total = subtotal + tax;

  rows += `
      <tr>
          <td colspan="7" class="total-label">Subtotal</td>
          <td>₹ ${parseFloat(subtotal).toFixed(2)}</td>
      </tr>
      <tr>
          <td colspan="7" class="total-label">Tax</td>
          <td>₹ ${parseFloat(tax).toFixed(2)}</td>
      </tr>
      <tr>
          <td colspan="7" class="total-label">Total</td>
          <td>₹ ${parseFloat(total).toFixed(2)}</td>
      </tr>
  `;

  return { rows, measurementPdfs };
}


async function getPOItemDetails(poId) {
  const query = `SELECT hsn_code FROM purchase_order_item WHERE purchase_order_id = ?`;
  const queryResult = await db.query(query, [poId]);
  return queryResult[0];
}

const getProformaInvoicePdf = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetchMergedProformaInvoicesDetailsById(id);

    const publicDir = path.join(process.cwd(), "public");

    const {
      billing_from,
      billing_from_state,
      billing_to,
      bill_no,
      created_at,
      work,
      po_number,
      po_date,
      getMeasurements,
      complaint_for,
      po_id,
    } = data;

    if (!getMeasurements) {
      throw new Error("Measurement not found");
    }
    const result = await getPOItemDetails(po_id);
    // const companyDetails = await getBillingToData(
    //   billing_to.company_id,
    //   complaint_for
    // );

    const itemsData = getMeasurements?.flatMap(
      (measurement) => measurement.items_data
    );
    const { measurementPdfs, rows } = await generateItemsTableRows(
      itemsData,
      publicDir,
      result
    );

    const header = heading();

    const htmlContent = `
        <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #F5F5F5;
      }
        .nameAndLogo {
          display: flex;
          justify-content: space-between;
        }
      .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 10px;
        border: 1px solid #ddd;
        background-color: #fff;
        border: 2px solid #000;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      }
      .header {
        text-align: right;
      }
      .bill-details {
        display: flex;
        justify-content: space-between;
      }
      .bill-details .details-left,
      .bill-details .details-right {
        text-align: left;
      }
      .invoice-table {
        border-collapse: collapse;
        font-size: 13px;
      }
      .invoice-table th,
      .invoice-table td {
        border: 1px solid #ddd;
        padding: 8px;
        border: 2px solid #616060;
      }
      .invoice-table th {
        background-color: #F2F2F2;
        text-align: left;
      }
      .invoice-table .total-label {
        text-align: right;
        background-color: #F9F9F9;
        font-weight: bold;
      }
      .list {
        list-style-type: none;
      }
      .font_size {
        font-size: 14px;
      }
      .font-25 {
        font-size: 18px;
        text-decoration: underline;
      }
      .site-heading {
        font-weight: bold;
        font-size: 21px;
      }
      .w-25 {
        min-width: 250px;
      }
      .w-10 {
        min-width: 100px;
      }
      .w-5 {
        min-width: 80px;
      }
      .title {
        font-size: 25px;
        font-weight: bold;
      }
      td {
        width: 25%;
      }
      .bold {
        font-weight: bold;
      }
      tr {
        border-left: 2px solid #000;
      }
      .hr {
        /* border-left: 2px solid #d4d2d2; */
        padding-left: 30px;
      }
      .underline {
        border-bottom: 2px solid !important;
      }
      .details {
        padding-top: 10px;
      }
      .title-underline {
        text-decoration: underline;
      }
      table {
        position: relative;
      }
      .dark {
        border: 1px solid #000;
      }
      .position {
        position: absolute;
        height: 15.6rem;
        top: 11.2rem;
        border-width: 2px;
        border-color: #fff;
        transform: translateX(25rem);
      }
    </style>
  </head>
  <body>
    ${header}
        <span class="site-heading">ESTIMATE</span>
        <hr class="dark" />
      </header>
      <table style="width: 100%">
        <tr>
          <td class="bold">Estimate No.</td>
          <td>: ${bill_no}</td>
          <td class="bold hr">Place of Supply</td>
          <td>: ${billing_to.place_of_supply ?? ""}</td>
        </tr>
        <tr>
          <td class="bold">Estimate Date</td>
          <td>: ${created_at}</td>
          <td class="bold hr">PO No.</td>
          <td>: ${po_number}</td>
        </tr>
        <tr>
          <td class="bold">work</td>
          <td>: ${work}</td>
          <td class="bold hr">PO Date</td>
          <td>: ${po_date}</td>
        </tr>
        <tr>
          <td colspan="4"><hr class="dark" /></td>
        </tr>
        <hr class="position" />
        <tr>
          <td colspan="2" class="details">
            <strong class="title-underline">BILL TO</strong>
            <p>
              <strong>${billing_to.company_name ?? ""}</strong> <br />
              ${billing_to.company_address ?? ""} <br />
              ${billing_to?.state ?? ""} - ${billing_to?.pincode ?? ""}<br />
              Office - ${billing_to.office ?? "NA"}<br />
              <strong> GSTIN </strong> : ${billing_to.gst_number ?? ""}<br />
            </p>
          </td>
          <td colspan="2" class="hr details">
            <strong class="title-underline">SHIP TO</strong>
            <p>
              <strong
                >${billing_from.company_name ?? ""}</strong
              >
              <br />
              ${billing_from.company_address ?? ""} <br />
              ${billing_from_state ?? "NA"} - ${
      billing_from?.pincode ?? ""
    }<br />
              Office - ${billing_from.office ?? ""}<br />
              <strong> GSTIN </strong> : ${billing_from.gst_number ?? ""} <br />
            </p>
          </td>
        </tr>
      </table>
      <hr class="dark" />
      <table class="invoice-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Order Line No.</th>
            <th class="w-25">Item & Description</th>
            <th>HSN/SAC</th>
            <th>Unit</th>
            <th class="w-10">QTY</th>
            <th>Rate</th>
            <th class="w-5">Amount</th>
          </tr>
        </thead>
        <tbody>
         ${rows}
      </table>
    </div>
  </body>
</html>
    `;
    const outputDir = path.join(publicDir, "proforma_invoices");

    // if output directory doesn't exist, create it
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Generate a unique filename for the PDF
    const filename = `${bill_no}-${id}.pdf`;
    // Save the PDF to the proforma_invoces folder
    const filePath = path.join(outputDir, filename);

    const options = {
      format: "A4",
      path: filePath, // you can pass path to save the file
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    };

    htmlPDF.setOptions(options);

    await htmlPDF.create(htmlContent);

    const finalOutputFilename = `proforma_invoice_${bill_no}.pdf`;
    const relativeOutputFilePath = `/proforma_invoices/${finalOutputFilename}`;

    const outputFilePath = path.join(outputDir, finalOutputFilename);
    attachPdfsAndImages([filePath, ...measurementPdfs], [], outputFilePath);

    const udpateQuery = `UPDATE proforma_invoices SET attachment = ? WHERE id = ?`;
    await db.query(udpateQuery, [relativeOutputFilePath, id]);

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "pdf generated",
      path: relativeOutputFilePath,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: error.message });
  }
};

module.exports = { attachAllDocumentsByMeasurementId, getProformaInvoicePdf };