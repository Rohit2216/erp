// import React from "react";
// import { Col, Table } from "react-bootstrap";
// import { BsFiletypeCsv, BsFiletypePdf, BsPrinter } from "react-icons/bs";
// import CardComponent from "../../../../components/CardComponent";
// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import { getViewPaySlip } from "../../../../services/authapi";
// import { useEffect } from "react";
// import moment from "moment";
// import { useTranslation } from "react-i18next";

// const ViewPaySlipDetails = () => {
//   const { id } = useParams();
//   const { month } = useParams();
//   const [viewPaySlipData, setViewPaySlipData] = useState({});
//   const { t } = useTranslation();
//   const fetchViewPaySlipData = async () => {
//     const res = await getViewPaySlip(id, month);
//     if (res.status) {
//       setViewPaySlipData(res.data);
//     } else {
//       setViewPaySlipData({});
//     }
//   };
//   useEffect(() => {
//     fetchViewPaySlipData();
//   }, []);
//   return (
//     <Col md={12}>
//       <CardComponent
//         title={"View PaySlip"}
//         custom2={
//           <div className="d-align fs-5 justify-content-end gap-2">
//             <BsFiletypeCsv title="Csv" className="text-orange cursor-pointer" />
//             <div className="vr hr-shadow" />
//             <BsFiletypePdf title="Pdf" className="text-danger cursor-pointer" />
//             <div className="vr hr-shadow" />
//             <BsPrinter title="Printer" className="text-green cursor-pointer" />
//           </div>
//         }
//       >
//         <div className="invoice-box my-3" data-aos={"fade-up"}>
//           <Table cellPadding={0} cellSpacing={0}>
//             <tbody>
//               <tr className="top">
//                 <td colSpan={2} style={{ border: "none" }}>
//                   <Table>
//                     <tbody>
//                       <tr>
//                         <td align="center" style={{ border: "none" }}>
//                           <strong>
//                             {t("Payslip for the month of ")}
//                             {moment(month).format("MMMM, YYYY")}
//                           </strong>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </Table>
//                 </td>
//               </tr>
//               <tr className="information">
//                 <td colSpan={2} style={{ border: "none" }}>
//                   <Table>
//                     <tbody>
//                       <tr>
//                         <td style={{ border: "none" }}>
//                           <div className="fw-bold text-secondary fs-5">
//                             CMS Electricals
//                           </div>
//                           <br />
//                           JMD GALLERIA, SECTOR-148, SOHNA ROAD
//                           <br />
//                           GURGRAM, HARYANA                          <br />
//                           <br />
//                           <br />
//                           <strong>{viewPaySlipData?.user_name}</strong>
//                           <br />
//                           {viewPaySlipData?.user_mobile && (
//                             <>
//                               User Mobile:{" "}
//                               <span className="fw-bold">
//                                 {viewPaySlipData?.user_mobile}
//                               </span>
//                               <br />
//                             </>
//                           )}
//                           {viewPaySlipData?.user_email && (
//                             <>
//                               {" "}
//                               User Email:{" "}
//                               <span className="fw-bold">
//                                 {viewPaySlipData?.user_email}
//                               </span>
//                               <br />{" "}
//                             </>
//                           )}
//                           Joining Date:{" "}
//                           <span className="fw-bold">
//                             {viewPaySlipData?.joining_date}
//                           </span>
//                         </td>
//                         <td style={{ border: "none" }}>
//                           <strong>
//                             Payslip {viewPaySlipData?.paySlipNumber}
//                           </strong>
//                           <br />
//                           <br />
//                           {viewPaySlipData?.insurance?.company_name && (
//                             <>
//                               company name:{" "}
//                               <span className="fw-bold">
//                                 {viewPaySlipData?.insurance?.company_name}
//                               </span>
//                             </>
//                           )}
//                           <br />
//                           {viewPaySlipData?.insurance?.policy_name && (
//                             <>
//                               policy name:{" "}
//                               <span className="fw-bold">
//                                 {viewPaySlipData?.insurance?.policy_name}
//                               </span>
//                             </>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </Table>
//                 </td>
//               </tr>
//               <div className="d-flex align-items-baseline gap-4 mb-3">
//                 <table width={"50%"}>
//                   <thead>
//                     <tr>
//                       <th scope="col">Allowance</th>
//                     </tr>
//                   </thead>
//                   <tbody className="my-border">
//                     {viewPaySlipData?.allowance?.map((allow, id3) => (
//                       <tr key={id3}>
//                         <th>{allow?.name}</th>
//                         <td>{allow?.value}</td>
//                       </tr>
//                     ))}
//                     <tr>
//                       <th>Basic Salary</th>
//                       <td className="fw-bold">
//                         {viewPaySlipData?.base_salary}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 <table width={"50%"}>
//                   <thead>
//                     <tr>
//                       <th scope="col">Deduction</th>
//                     </tr>
//                   </thead>
//                   <tbody className="my-border">
//                     {viewPaySlipData?.deduction?.map((deduc, id3) => (
//                       <tr key={id3}>
//                         <th>{deduc?.name}</th>
//                         <td>{deduc?.by_employee}</td>
//                       </tr>
//                     ))}
//                     {viewPaySlipData?.insurance?.insurance_deduction_amount && (
//                       <tr>
//                         <th>insurance deduction amount</th>
//                         <td className="fw-bold">
//                           {" "}
//                           {
//                             viewPaySlipData?.insurance
//                               ?.insurance_deduction_amount
//                           }
//                         </td>
//                       </tr>
//                     )}
//                     {viewPaySlipData?.totalDeductionAmount && (
//                       <tr>
//                         <th>Total Deductions</th>
//                         <td className="fw-bold">
//                           {" "}
//                           {viewPaySlipData?.totalDeductionAmount}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </tbody>
//             <p className="small">
//               <b>Gross Salary:</b> ₹ {viewPaySlipData?.gross_salary} (
//               {viewPaySlipData?.gross_salary_in_word})
//             </p>
//             <table width={"50%"} className="my-4">
//               <tbody className="my-border">
//                 {viewPaySlipData?.total_work_hours_in_month ? (
//                   <tr>
//                     <th>total work hours in month</th>
//                     <td>{viewPaySlipData?.total_work_hours_in_month}</td>
//                   </tr>
//                 ) : null}
//                 {viewPaySlipData?.loan_number ? (
//                   <tr>
//                     <th>loan number</th>
//                     <td>{viewPaySlipData?.loan_number}</td>
//                   </tr>
//                 ) : null}
//                 {viewPaySlipData?.loan_amount ? (
//                   <tr>
//                     <th>loan amount</th>
//                     <td>{viewPaySlipData?.loan_amount}</td>
//                   </tr>
//                 ) : null}
//                 {viewPaySlipData?.loan_term ? (
//                   <tr>
//                     <th>loan term</th>
//                     <td>{viewPaySlipData?.loan_term}</td>
//                   </tr>
//                 ) : null}
//                 {viewPaySlipData?.total_working_days ? (
//                   <tr>
//                     <th>Total Working Days</th>
//                     <td>{viewPaySlipData?.total_working_days}</td>
//                   </tr>
//                 ) : null}
//               </tbody>
//             </table>
//           </Table>
//         </div>
//       </CardComponent>
//     </Col>
//   );
// };

// export default ViewPaySlipDetails;


import React from "react";
import { Col, Table } from "react-bootstrap";
import { BsFiletypeCsv, BsFiletypePdf, BsPrinter } from "react-icons/bs";
import CardComponent from "../../../../components/CardComponent";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getViewPaySlip } from "../../../../services/authapi";
import { useEffect } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ViewPaySlipDetails = () => {
  const { id, month } = useParams();
  const [viewPaySlipData, setViewPaySlipData] = useState({});
  const { t } = useTranslation();

  const fetchViewPaySlipData = async () => {
    const res = await getViewPaySlip(id, month);
    if (res.status) {
      setViewPaySlipData(res.data);
    } else {
      setViewPaySlipData({});
    }
  };

  useEffect(() => {
    fetchViewPaySlipData();
  }, []);

  // Inline styles
  const styles = {
    invoiceBox: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #eaeaea",
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    cardComponent: {
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
    },
    tableHeader: {
      backgroundColor: "#f2f2f2",
      color: "#333",
      padding: "10px",
      borderBottom: "1px solid #dee2e6",
    },
    tableCell: {
      padding: "10px",
      borderBottom: "1px solid #dee2e6",
      color: "#555",
    },
    bold: {
      fontWeight: "bold",
    },
    invoiceTitle: {
      margin: "0",
      fontSize: "1.5rem",
      color: "#333",
    },
    smallText: {
      fontSize: "0.875rem",
      color: "#777",
    },
    iconColor: {
      textOrange: { color: "#ff7f50" },
      textDanger: { color: "#dc3545" },
      textGreen: { color: "#28a745" },
    },
    hrShadow: {
      borderLeft: "1px solid #dee2e6",
      height: "30px",
      margin: "0 10px",
    },
  };

  return (
    <Col md={12}>
      <CardComponent title={"View PaySlip"} custom2={
        <div className="d-align fs-5 justify-content-end gap-2">
          <BsFiletypeCsv title="Csv" style={styles.iconColor.textOrange} className="cursor-pointer" />
          <div style={styles.hrShadow} />
          <BsFiletypePdf title="Pdf" style={styles.iconColor.textDanger} className="cursor-pointer" />
          <div style={styles.hrShadow} />
          <BsPrinter title="Printer" style={styles.iconColor.textGreen} className="cursor-pointer" />
        </div>
      }>
        <div style={styles.invoiceBox} data-aos={"fade-up"}>
          <Table cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr className="top">
                <td colSpan={2} style={{ border: "none" }}>
                  <Table>
                    <tbody>
                      <tr>
                        <td align="center" style={{ border: "none" }}>
                          <strong style={styles.invoiceTitle}>
                            {t("Payslip for the month of ")}
                            {moment(month).format("MMMM, YYYY")}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
              </tr>
              <tr className="information">
                <td colSpan={2} style={{ border: "none" }}>
                  <Table>
                    <tbody>
                      <tr>
                        <td style={{ border: "none" }}>
                          <div style={{ fontWeight: "bold", color: "#6c757d", fontSize: "1.25rem" }}>
                          Pacific Technoproducts India Pvt. Ltd.
                          </div>
                          <br />
                          JMD GALLERIA, SECTOR-148, SOHNA ROAD
                          <br />
                          GURGRAM, HARYANA                          <br />
                          <br />
                          <br />
                          <strong>{viewPaySlipData?.user_name}</strong>
                          <br />
                          {viewPaySlipData?.user_mobile && (
                            <>
                              User Mobile:{" "}
                              <span style={styles.bold}>
                                {viewPaySlipData?.user_mobile}
                              </span>
                              <br />
                            </>
                          )}
                          {viewPaySlipData?.user_email && (
                            <>
                              User Email:{" "}
                              <span style={styles.bold}>
                                {viewPaySlipData?.user_email}
                              </span>
                              <br />
                            </>
                          )}
                          Joining Date:{" "}
                          <span style={styles.bold}>
                            {viewPaySlipData?.joining_date}
                          </span>
                        </td>
                        <td style={{ border: "none" }}>
                          <strong>Payslip {viewPaySlipData?.paySlipNumber}</strong>
                          <br />
                          <br />
                          {viewPaySlipData?.insurance?.company_name && (
                            <>
                              Company Name:{" "}
                              <span style={styles.bold}>
                                {viewPaySlipData?.insurance?.company_name}
                              </span>
                            </>
                          )}
                          <br />
                          {viewPaySlipData?.insurance?.policy_name && (
                            <>
                              Policy Name:{" "}
                              <span style={styles.bold}>
                                {viewPaySlipData?.insurance?.policy_name}
                              </span>
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
              </tr>
              <div className="d-flex align-items-baseline gap-4 mb-3">
                <table width={"50%"}>
                  <thead>
                    <tr>
                      <th scope="col" style={styles.tableHeader}>Allowance</th>
                    </tr>
                  </thead>
                  <tbody className="my-border">
                    {viewPaySlipData?.allowance?.map((allow, id3) => (
                      <tr key={id3}>
                        <th style={styles.tableHeader}>{allow?.name}</th>
                        <td style={styles.tableCell}>{allow?.value}</td>
                      </tr>
                    ))}
                    <tr>
                      <th style={styles.tableHeader}>Basic Salary</th>
                      <td className="fw-bold" style={styles.tableCell}>
                        {viewPaySlipData?.base_salary}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width={"50%"}>
                  <thead>
                    <tr>
                      <th scope="col" style={styles.tableHeader}>Deduction</th>
                    </tr>
                  </thead>
                  <tbody className="my-border">
                    {viewPaySlipData?.deduction?.map((deduc, id3) => (
                      <tr key={id3}>
                        <th style={styles.tableHeader}>{deduc?.name}</th>
                        <td style={styles.tableCell}>{deduc?.by_employee}</td>
                      </tr>
                    ))}
                    {viewPaySlipData?.insurance?.insurance_deduction_amount && (
                      <tr>
                        <th style={styles.tableHeader}>Insurance Deduction Amount</th>
                        <td className="fw-bold" style={styles.tableCell}>
                          {viewPaySlipData?.insurance?.insurance_deduction_amount}
                        </td>
                      </tr>
                    )}
                    {viewPaySlipData?.totalDeductionAmount && (
                      <tr>
                        <th style={styles.tableHeader}>Total Deductions</th>
                        <td className="fw-bold" style={styles.tableCell}>
                          {viewPaySlipData?.totalDeductionAmount}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </tbody>
            <p className="small" style={styles.smallText}>
              <b>Gross Salary:</b> ₹ {viewPaySlipData?.gross_salary} (
              {viewPaySlipData?.gross_salary_in_word})
            </p>
            <table width={"50%"} className="my-4">
              <tbody className="my-border">
                {viewPaySlipData?.total_working_days ? (
                  <tr>
                    <th>Total Work Days in Month</th>
                    <td>{viewPaySlipData?.total_working_days}</td>
                  </tr>
                ) : null}
                {viewPaySlipData?.loan_number ? (
                  <tr>
                    <th>Loan Number</th>
                    <td>{viewPaySlipData?.loan_number}</td>
                  </tr>
                ) : null}
                {viewPaySlipData?.leave_days ? (
                  <tr>
                    <th>Leave Days</th>
                    <td>{viewPaySlipData?.leave_days}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </Table>
        </div>
      </CardComponent>
    </Col>
  );
};

export default ViewPaySlipDetails;
