import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Select from "react-select";
import {
  getAllComplaintsDetails,
  getAllFinancialYearsForDashboard,
} from "../../services/contractorApi";
import CardComponent from "../CardComponent";
import { useTranslation } from "react-i18next";

const TotalComplaints = ({ MyCard }) => {
  const [details, setDetails] = useState({});
  const [finanacialData, setFinancialData] = useState({});
  const [currentData, setCurrentData] = useState({});
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const { t } = useTranslation();
  const fetchAllComplaintsDetails = async (year) => {
    const res = await getAllComplaintsDetails(year);
    if (res.status) {
      setDetails(res?.data);
      setFinancialData(res?.data?.financialYearData?.status);
      setCurrentData(res?.data?.currentMonthData?.status);
    } else {
      setDetails({});
      setFinancialData({});
      setCurrentData({});
    }
  };
  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYearsForDashboard();
    if (res.status) {
      const financialYears = res.data;
      setAllFinancialYear(financialYears);
      const defaultYear = financialYears[0];
      setYearValue({
        label: defaultYear.year_name,
        value: defaultYear.year_name,
      });

      fetchAllComplaintsDetails(defaultYear.year_name);
    } else {
      setAllFinancialYear([]);
    }
  };

  useEffect(() => {
    showFinancialYearApi();
  }, []);
  function MyCard({ children, className }) {
    return (
      <Card className={className}>
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }
  // const date = new Date();
  // const month = date.toLocaleString("default", { month: "long" });
  // const options = [
  //   {
  //     id: 1,
  //     value: 22,
  //     title: "total",
  //     date: month,
  //   },
  //   {
  //     id: 2,
  //     value: 223,
  //     title: "dues",
  //     date: month,
  //   },
  //   {
  //     id: 3,
  //     value: 223,
  //     title: "working",
  //     date: month,
  //   },
  //   {
  //     id: 4,
  //     value: 223,
  //     title: "done",
  //     date: month,
  //   },
  //   {
  //     id: 5,
  //     value: 223,
  //     title: "hold",
  //     date: month,
  //   },
  // ];
  return (
    <>
      <CardComponent title={t("Complaints Details")}>
        <Row className="d-align justify-content-end">
          <Col md={2}>
            <Select
              placeholder={"--select--"}
              menuPortalTarget={document.body}
              options={allFinancialYear?.map((data) => ({
                label: data?.year_name,
                value: data?.year_name,
              }))}
              value={yearValue}
              onChange={(e) => {
                if (e) {
                  setYearValue({ value: e?.value, label: e?.label });
                  fetchAllComplaintsDetails(e?.value);
                } else {
                  setYearValue(null);
                }
              }}
              isClearable
            />
          </Col>
        </Row>
        <Card.Body>
          <Row className="g-4">
            <Col md={3} className="text-center text-secondary text-shadow-1">
              <MyCard className={"bg-new h-100"}>
                <MyCard className={"card-bg p-0"}>
                  <p className=" fw-bold fs-5">
                    {details?.financialYearData?.totalComplaints} <br />
                    <strong className="fs-5">Total Complaints</strong>
                  </p>
                  <hr />
                  <div className="d-align justify-content-between">
                    <p className=" fs-6 mb-0">
                      {details?.currentMonthData?.current_month_and_year}
                    </p>
                    <p className=" fs-6 mb-0">
                      {details?.currentMonthData?.totalComplaints}
                    </p>
                  </div>
                </MyCard>
              </MyCard>
            </Col>

            {Object.keys(finanacialData).map((item, i) => {
              return (
                <Col
                  md={3}
                  className="text-center text-secondary text-shadow-1"
                >
                  <MyCard className={"bg-new h-100"}>
                    <MyCard className={"card-bg p-0"}>
                      <p className=" fw-bold fs-5" key={i}>
                        <span>{finanacialData[item]}</span>
                        <br />
                        <strong className="fs-5">{item}</strong>
                      </p>
                      <hr />
                      <div className="d-align justify-content-between">
                        <p className=" fs-6 mb-0">
                          {details?.currentMonthData?.current_month_and_year}
                        </p>
                        <p className=" fs-6 mb-0">{currentData[item]}</p>
                      </div>
                    </MyCard>
                  </MyCard>
                </Col>
              );
            })}

            <Col md={3} className="text-center text-secondary text-shadow-1">
              <MyCard className={"bg-new h-100"}>
                <MyCard className={"card-bg p-0"}>
                  <p className=" fw-bold fs-5">
                    <span>{details?.getPaymentData?.financialYearCount}</span>
                    <br />
                    <strong className="fs-5">Payment recieved</strong>
                  </p>
                  <hr />
                  <div className="d-align justify-content-between">
                    <p className=" fs-6 mb-0">
                      {details?.currentMonthData?.current_month_and_year}
                    </p>
                    <p className=" fs-6 mb-0">
                      {details.getPaymentData?.currentMonthCount}
                    </p>
                  </div>
                </MyCard>
              </MyCard>
            </Col>
          </Row>
        </Card.Body>
      </CardComponent>
    </>
  );
};

export default TotalComplaints;
