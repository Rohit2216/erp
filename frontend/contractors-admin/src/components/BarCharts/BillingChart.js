import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Card, Col, Row } from "react-bootstrap";
import Select from "react-select";
import {
  getAllFinancialYearsForDashboard,
  getAllInvoiceforDashboard,
  getAllMeasurementDetails,
  getAllPaymentforDashboard,
  getAllProformaInvoiceforDashboard,
} from "../../services/contractorApi";

const BillingChart = () => {
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const [details, setDetails] = useState([]);
  const [proformaInvoice, setProformaInvoice] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [allPayment, setAllPayment] = useState([]);

  const fetchMeasurementAmount = async (year) => {
    const res = await getAllMeasurementDetails(year);
    if (res.status) {
      setDetails(res?.data?.amounts);
    } else {
      setDetails([]);
    }
  };

  const fetchInvoice = async (year) => {
    const res = await getAllInvoiceforDashboard(year);
    if (res.status) {
      setInvoice(res?.data?.amounts);
    } else {
      setInvoice([]);
    }
  };

  const fetchProformaInvoice = async (year) => {
    const res = await getAllProformaInvoiceforDashboard(year);
    if (res.status) {
      setProformaInvoice(res?.data?.amounts);
    } else {
      setProformaInvoice([]);
    }
  };

  const fetchPayment = async (year) => {
    const res = await getAllPaymentforDashboard(year);

    if (res.status) {
      setAllPayment(res?.data?.amounts);
    } else {
      setAllPayment([]);
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

      fetchMeasurementAmount(defaultYear.year_name);
      fetchProformaInvoice(defaultYear.year_name);
      fetchInvoice(defaultYear.year_name);
      fetchPayment(defaultYear.year_name);
    } else {
      setAllFinancialYear([]);
    }
  };

  useEffect(() => {
    showFinancialYearApi();
  }, []);

  const orderedMonths = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ];

  const valuesArray = orderedMonths.map((month) => details[month]);
  const valuesArray2 = orderedMonths.map((month) => proformaInvoice[month]);
  const valuesArray3 = orderedMonths.map((month) => invoice[month]);
  const valuesArray4 = orderedMonths.map((month) => allPayment?.[month]);

  const chartData2 = {
    series: [
      {
        name: "Performa Invoice",
        data:
          valuesArray3[0] == undefined
            ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 5, 1, 9]
            : valuesArray3,
      },
      {
        name: "Invoice",
        data:
          valuesArray2[0] == undefined
            ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 5, 1, 9]
            : valuesArray2,
      },
      {
        name: "Total Payments",
        data:
          valuesArray4[0] == undefined
            ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 5, 1, 9]
            : valuesArray3,
      },
      {
        name: "Measurements",
        data:
          valuesArray[0] == undefined
            ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 5, 1, 9]
            : valuesArray,
      },
    ],
    options: {
      chart: {
        toolbar: { show: true },
        offsetX: -10,
        offsetY: 10,
      },
      colors: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
      stroke: {
        curve: "smooth",
        width: 1,
      },
      plotOptions: {
        bar: {
          columnWidth: "60%",
        },
      },
      grid: {
        borderColor: "transparent",
        padding: {
          left: 20,
          right: 10,
        },
      },
      dataLabels: {
        enabled: false,
      },

      xaxis: {
        categories: [
          "Apr",
          "May",
          "june",
          "july",
          "Aug",
          "Sep",
          "oct",
          "nov",
          "dec",
          "Jan",
          "Feb",
          "Mar",
        ],
      },

      yaxis: {
        min: 0, // Minimum value on the y-axis
        max: 50000, // Maximum value on the y-axis
        title: {
          text: "rupees", // Title of the y-axis
        },
        labels: {
          formatter: function (value) {
            return value.toFixed(0); // Format the y-axis labels as whole numbers
          },
        },
      },
    },
  };

  //   const totalcard = [
  //     {
  //       id: 1,
  //       title: "58.42 %",
  //       subtitle: "Lorem Ipsum is simply dummy",
  //       class: "green",
  //       icon: <BiTrendingUp className="align-top" />,
  //     },
  //     {
  //       id: 2,
  //       title: "68.42 %",
  //       subtitle: "Lorem Ipsum is simply dummy",
  //       class: "green",
  //       icon: <BiTrendingUp className="align-top" />,
  //     },
  //     {
  //       id: 3,
  //       title: "18.42 %",
  //       subtitle: "Lorem Ipsum is simply dummy",
  //       class: "danger",
  //       icon: <BiTrendingDown className="align-top" />,
  //     },
  //   ];
  return (
    <Row>
      {/* {totalcard.map((total, ida) => (
        <Col md={4} key={ida}>
          <Card className="card-bg h-100">
            <Card.Body>
              <p className="small mb-4 fw-bold">
                {total.title}{" "}
                <span className={`float-end fs-4 text-${total.class}`}>
                  {total.icon}
                </span>
              </p>
              <p className="mb-0 small text-truncate" title={total.subtitle}>
                {total.subtitle}
              </p>
            </Card.Body>
          </Card>
        </Col>
      ))} */}
      <Col md={12}>
        <Row className="d-align mb-3 justify-content-end">
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
                  fetchMeasurementAmount(e?.value);
                  fetchProformaInvoice(e?.value);
                  fetchInvoice(e?.value);
                  fetchPayment(e?.value);
                } else {
                  setYearValue(null);
                }
              }}
              isClearable
            />
          </Col>
        </Row>
        <Card className="card-bg">
          <Card.Body>
            <Chart
              options={chartData2.options}
              series={chartData2.series}
              type="bar"
              height={300}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default BillingChart;
