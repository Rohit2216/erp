import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsReceiptCutoff } from "react-icons/bs";
import CardComponent from "../../../../components/CardComponent";
import TooltipComponent from "../../../../components/TooltipComponent";
import { Link } from "react-router-dom";
import moment from "moment";
import { getAllPaySlip } from "../../../../services/authapi";
import { useTranslation } from "react-i18next";

const PaySlip = () => {
  const [payslipData, setPayslipData] = useState([]);
  const [dateValue, setDateValue] = useState(
    moment(new Date()).format("YYYY-MM")
  );
  const { t } = useTranslation();

  const fetchData = async () => {
    const res = await getAllPaySlip(dateValue);
    if (res.status) {
      setPayslipData(res.data);
    } else {
      setPayslipData([]);
    }
  };
  const datehandler = (e) => {
    const date = e.target.value;
    setDateValue(date);
  };
  useEffect(() => {
    fetchData();
  }, [dateValue]);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Pay Slip · Pacific Technoproducts India Pvt. Ltd.</title>
      </Helmet>
      <CardComponent
        title={"PaySlip"}
        custom2={
          <div>
            <Form.Control
              value={dateValue}
              onChange={datehandler}
              type="month"
              name={"date"}
            />
          </div>
        }
      >
        <div className="table-scroll p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Employee Name")}</th>
                <th>{t("Role")}</th>
                <th>{t("Month")}</th>
                <th>{t("Email")}</th>
                <th>{t("Join Date")}</th>
                <th>{t("Gross Salary")}</th>
                <th>{t("Pay Slip")}</th>
              </tr>
            </thead>
            <tbody>
              {payslipData?.length > 0 ? null : (
                <tr>
                  <td colSpan={8}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              )}
              {payslipData?.map((data, id1) => (
                <tr key={data}>
                  <td>{id1 + 1}</td>
                  <td>
                    <div className="text-truncate">
                      <img
                        className="avatar me-2"
                        src={
                          data?.user_image
                            ? `${process.env.REACT_APP_API_URL}${data?.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                        alt={data?.user_name}
                      />
                      {data?.user_name}
                    </div>
                  </td>
                  <td>{data?.employee_role}</td>
                  <td>
                    <div className="text-truncate">{data?.month}</div>
                  </td>
                  {/* <td>{data?.salaryDisbursedBy}</td> */}
                  <td>{data?.email}</td>
                  <td>{data?.joining_date}</td>
                  <td>
                    <div className="text-green">₹ {data?.gross_salary}</div>
                  </td>
                  <td>
                    <TooltipComponent align={"left"} title={"Generate Slip"}>
                      <Link
                        to={`/PaySlip/ViewPaySlipDetails/${data?.user_id}/${dateValue}`}
                      >
                        <BsReceiptCutoff className="social-btn danger-combo" />
                      </Link>
                    </TooltipComponent>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardComponent>
    </Col>
  );
};

export default PaySlip;
