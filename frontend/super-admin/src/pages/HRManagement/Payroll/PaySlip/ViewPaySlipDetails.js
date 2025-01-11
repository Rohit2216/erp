import React from "react";
import { Col, Table } from "react-bootstrap";
import { BsFiletypeCsv, BsFiletypePdf, BsPrinter } from "react-icons/bs";
import CardComponent from "../../../../components/CardComponent";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getViewPaySlip } from "../../../../services/authapi";
import { useEffect } from "react";
import moment from "moment";

const ViewPaySlipDetails = () => {
  const { id } = useParams();
  const { month } = useParams();
  const [viewPaySlipData, setViewPaySlipData] = useState({});

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
  return (
    <Col md={12}>
      <CardComponent
        title={"View PaySlip"}
        custom2={
          <div className="d-align fs-5 justify-content-end gap-2">
            <BsFiletypeCsv title="Csv" className="text-orange cursor-pointer" />
            <div className="vr hr-shadow" />
            <BsFiletypePdf title="Pdf" className="text-danger cursor-pointer" />
            <div className="vr hr-shadow" />
            <BsPrinter title="Printer" className="text-green cursor-pointer" />
          </div>
        }
      >
        <div className="invoice-box my-3" data-aos={"fade-up"}>
          <Table cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr className="top">
                <td colSpan={2} style={{ border: "none" }}>
                  <Table>
                    <tbody>
                      <tr>
                        <td align="center" style={{ border: "none" }}>
                          <strong>
                            Payslip for the month of{" "}
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
                          <div className="fw-bold text-secondary fs-5">
                            CMS Electricals
                          </div>
                          <br />
                          Lorem Ipsum Technologies
                          <br />
                          12345 Lorem Road,
                          <br />
                          Loremville, CA 12345
                          <br />
                          <br />
                          <strong>{viewPaySlipData?.user_name}</strong>
                          <br />
                          {viewPaySlipData?.user_mobile && (
                            <>
                              User Mobile:{" "}
                              <span className="fw-bold">
                                {viewPaySlipData?.user_mobile}
                              </span>
                              <br />
                            </>
                          )}
                          {viewPaySlipData?.user_email && (
                            <>
                              {" "}
                              User Email:{" "}
                              <span className="fw-bold">
                                {viewPaySlipData?.user_email}
                              </span>
                              <br />{" "}
                            </>
                          )}
                          Joining Date:{" "}
                          <span className="fw-bold">
                            {viewPaySlipData?.joining_date}
                          </span>
                        </td>
                        <td style={{ border: "none" }}>
                          <strong>
                            Payslip {viewPaySlipData?.paySlipNumber}
                          </strong>
                          <br />
                          <br />
                          {viewPaySlipData?.insurance?.company_name && (
                            <>
                              company name:{" "}
                              <span className="fw-bold">
                                {viewPaySlipData?.insurance?.company_name}
                              </span>
                            </>
                          )}
                          <br />
                          {viewPaySlipData?.insurance?.policy_name && (
                            <>
                              policy name:{" "}
                              <span className="fw-bold">
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
                      <th scope="col">Allowance</th>
                    </tr>
                  </thead>
                  <tbody className="my-border">
                    {viewPaySlipData?.allowance?.map((allow, id3) => (
                      <tr key={id3}>
                        <th>{allow?.name}</th>
                        <td>{allow?.value}</td>
                      </tr>
                    ))}
                    <tr>
                      <th>Basic Salary</th>
                      <td className="fw-bold">
                        {viewPaySlipData?.base_salary}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width={"50%"}>
                  <thead>
                    <tr>
                      <th scope="col">Deduction</th>
                    </tr>
                  </thead>
                  <tbody className="my-border">
                    {viewPaySlipData?.deduction?.map((deduc, id3) => (
                      <tr key={id3}>
                        <th>{deduc?.name}</th>
                        <td>{deduc?.by_employee}</td>
                      </tr>
                    ))}
                    {viewPaySlipData?.insurance?.insurance_deduction_amount && (
                      <tr>
                        <th>insurance deduction amount</th>
                        <td className="fw-bold">
                          {" "}
                          {
                            viewPaySlipData?.insurance
                              ?.insurance_deduction_amount
                          }
                        </td>
                      </tr>
                    )}
                    {viewPaySlipData?.totalDeductionAmount && (
                      <tr>
                        <th>Total Deductions</th>
                        <td className="fw-bold">
                          {" "}
                          {viewPaySlipData?.totalDeductionAmount}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </tbody>
            <p className="small">
              <b>Gross Salary:</b> ₹ {viewPaySlipData?.gross_salary} (
              {viewPaySlipData?.gross_salary_in_word})
            </p>
            <table width={"50%"} className="my-4">
              <tbody className="my-border">
                {viewPaySlipData?.total_work_hours_in_month ? (
                  <tr>
                    <th>total work hours in month</th>
                    <td>{viewPaySlipData?.total_work_hours_in_month}</td>
                  </tr>
                ) : null}
                {viewPaySlipData?.loan_number ? (
                  <tr>
                    <th>loan number</th>
                    <td>{viewPaySlipData?.loan_number}</td>
                  </tr>
                ) : null}
                {viewPaySlipData?.loan_amount ? (
                  <tr>
                    <th>loan amount</th>
                    <td>{viewPaySlipData?.loan_amount}</td>
                  </tr>
                ) : null}
                {viewPaySlipData?.loan_term ? (
                  <tr>
                    <th>loan term</th>
                    <td>{viewPaySlipData?.loan_term}</td>
                  </tr>
                ) : null}
                {viewPaySlipData?.total_working_days ? (
                  <tr>
                    <th>Total Working Days</th>
                    <td>{viewPaySlipData?.total_working_days}</td>
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
