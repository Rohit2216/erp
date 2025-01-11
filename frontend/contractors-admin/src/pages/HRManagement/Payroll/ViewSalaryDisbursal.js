import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import CardComponent from "../../../components/CardComponent";
import { useParams } from "react-router-dom";
import { getSingleSalaryDisbursal } from "../../../services/authapi";
import {
  BsBuildings,
  BsCalendar2Event,
  BsEnvelope,
  BsTelephoneForward,
} from "react-icons/bs";
import moment from "moment";

const ViewSalaryDisbursal = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { month } = useParams();
  const [disbursalData, setDisbursalData] = useState({});

  const fetchDisbursalData = async () => {
    const res = await getSingleSalaryDisbursal(id, month);
    if (res.status) {
      setDisbursalData(res.data);
    } else {
      setDisbursalData({});
    }
  };

  // console.log('disbursalData', disbursalData)

  useEffect(() => {
    fetchDisbursalData();
  }, []);

  const proinput = [
    {
      id: 1,
      col: 4,
      name: t("Base Salary"),
      value: `₹ ${disbursalData?.base_salary}`,
    },
    {
      id: 3,
      col: 4,
      name: t("Total Working Days"),
      value: disbursalData?.total_working_days,
    },
    {
      id: 3,
      col: 4,
      name: t("Total Leaves"),
      value: disbursalData?.total_leaves,
    },
    {
      id: 3,
      col: 6,
      name: t("total working day salary"),
      value: `₹ ${disbursalData?.total_working_day_salary}`,
    },
    {
      id: 5,
      col: 6,
      name: t("Company name"),
      value: disbursalData?.insurance?.company_name,
    },
    {
      id: 5,
      col: 6,
      name: t("policy name"),
      value: disbursalData?.insurance?.policy_name,
    },
    {
      id: 5,
      col: 4,
      name: t("loan number"),
      value: disbursalData?.loan_number,
    },
    { id: 5, col: 4, name: t("loan term"), value: disbursalData?.loan_term },
  ];

  return (
    <>
      <Helmet>
        <title>View Salary Disbursal · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <Card
          className="card-bg h-100"
          data-aos={"fade-up"}
          data-aos-delay={100}
        >
          <Card.Body className="py-2">
            <img
              className="img-fluid my-btn"
              src={
                disbursalData?.user_image
                  ? `${process.env.REACT_APP_API_URL}${disbursalData?.user_image}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
              }
            />
            <span className="ms-2"> {disbursalData?.user_name}</span>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card
          className="card-bg h-100"
          data-aos={"fade-left"}
          data-aos-delay={300}
        >
          <Card.Body>
            <div className="d-flex align-items-center justify-content-center">
              <div className="d-flex flex-column text-center align-items-center justify-content-between ">
                <div className="fs-italic">
                  <h5>
                    <strong>{disbursalData?.user_name}</strong>
                  </h5>
                  <div className="text-muted-50 mb-3">
                    <small>
                      {disbursalData?.user_role}{" "}
                      <span className="text-gray">
                        ({disbursalData.employee_code})
                      </span>
                    </small>
                  </div>
                </div>
                <div className="card-profile-progress">
                  <div className="d-align my-bg p-2 rounded-circle">
                    <img
                      className="rounded-circle"
                      height={130}
                      width={130}
                      src={
                        disbursalData?.user_image
                          ? `${process.env.REACT_APP_API_URL}${disbursalData?.user_image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                      alt={disbursalData?.user_name}
                    />
                  </div>
                </div>
                <div className="mt-3 text-center text-muted-50">
                  <p className="mb-2 text-gray">
                    <BsCalendar2Event /> {moment(month).format("MMMM, YYYY")}
                  </p>
                  {disbursalData?.employee_code && (
                    <a className="d-block mb-2 text-gray text-decoration-none">
                      {disbursalData?.employee_code}
                    </a>
                  )}
                  {disbursalData?.user_email ? (
                    <a
                      href={`mailto:${disbursalData?.user_email}`}
                      className="d-block mb-2 text-gray text-decoration-none"
                    >
                      <BsEnvelope /> {disbursalData?.user_email}
                    </a>
                  ) : null}
                  {disbursalData?.user_mobile ? (
                    <a
                      className="text-decoration-none text-secondary"
                      href={`tel:${disbursalData?.user_mobile}`}
                    >
                      <BsTelephoneForward /> {disbursalData?.user_mobile}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8} data-aos={"fade-right"} data-aos-delay={400}>
        <CardComponent title={t("About User")}>
          <Row className="g-3">
            {proinput.map((input, ida) =>
              input.value ? (
                <Col key={ida} md={input?.col}>
                  <Form.Label>{input.name}</Form.Label>
                  <Form.Control value={input.value} disabled />
                </Col>
              ) : null
            )}
            <Row className="g-3">
              <Col md={6}>
                <strong>{t("Allowance")}</strong>
                <Table
                  striped
                  bordered
                  hover
                  className="bg-primary-light Roles"
                >
                  <thead>
                    <tr>
                      <th className="fs-11 text-start">{t("name")}</th>
                      <th className="fs-11">{t("value")}</th>
                      {/* <th className='fs-11'>employee</th> */}
                      {/* <th className='fs-11'>employer</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {disbursalData?.allowance?.map((data1, id3) => (
                      <tr key={id3}>
                        <td className="text-start">{data1?.name}</td>
                        <td>{data1?.value}</td>
                        {/* <td>{data1?.by_employee}</td> */}
                        {/* <td>{data1?.by_employer}</td> */}
                      </tr>
                    ))}
                    {disbursalData?.totalAllowanceAmount ? (
                      <tr>
                        <th className="text-start">{t("Total Amount")}</th>
                        <td className="fw-bold">
                          <span className=" text-green">
                            ₹ {disbursalData?.totalAllowanceAmount}
                          </span>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <strong>{t("Deduction")}</strong>
                <Table
                  striped
                  bordered
                  hover
                  className="bg-primary-light Roles"
                >
                  <thead>
                    <tr>
                      <th className="fs-11 text-start">{t("name")}</th>
                      <th className="fs-11">{t("employer")}</th>
                      <th className="fs-11">{t("employee")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disbursalData?.deduction?.map((data2, id3) => (
                      <tr key={id3}>
                        <td className="text-start">{data2?.name}</td>
                        <td>{data2?.by_employer}</td>
                        <td>{data2?.by_employee}</td>
                      </tr>
                    ))}
                    {disbursalData?.loan_amount ? (
                      <tr>
                        <th colSpan={2} className="text-start">
                          {t("loan amount")}
                        </th>
                        <td className="fw-bold">
                          <span className=" text-danger">
                            ₹ {disbursalData?.loan_amount}
                          </span>
                        </td>
                      </tr>
                    ) : null}
                    {disbursalData?.insurance?.insurance_deduction_amount && (
                      <tr>
                        <th colSpan={2} className="text-start">
                          {t("Insurance Deduction Amount")}
                        </th>
                        <td className="fw-bold">
                          <span className=" text-danger">
                            ₹{" "}
                            {
                              disbursalData?.insurance
                                ?.insurance_deduction_amount
                            }
                          </span>
                        </td>
                      </tr>
                    )}
                    {disbursalData?.totalDeductionAmount ? (
                      <tr>
                        <th colSpan={2} className="text-start">
                          {t("Total Deduction")}
                        </th>
                        <td className="fw-bold">
                          <span className=" text-danger">
                            ₹ {disbursalData?.totalDeductionAmount}
                          </span>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </Table>
              </Col>
              <Col md={12}>
                <div className="mt-4 fw-bold">
                  {t("Total Gross Salary")}
                  <span className="float-end success-combo form-shadow px-2 py-1">
                    ₹ {disbursalData?.gross_salary}
                  </span>
                </div>
              </Col>
            </Row>
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default ViewSalaryDisbursal;
