import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Card, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  getAllFinancialYearsForDashboard,
  getAllInvoiceforDashboard,
  getAllMeasurementDetails,
  getAllPaymentforDashboard,
  getAllProformaInvoiceforDashboard,
} from "../../services/contractorApi";
import CardComponent from "../CardComponent";
import Select from "react-select";

const ComplaintTypeStatusCount = () => {
  const { t } = useTranslation();
  const [details, setDetails] = useState([]);
  const [proformaInvoice, setProformaInvoice] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [allPayment, setAllPayment] = useState([]);
  const [yearValue, setYearValue] = useState(null);

  const fetchMeasurementAmount = async (year) => {
    const res = await getAllMeasurementDetails(year);
    if (res.status) {
      setDetails(res?.data?.amounts);
    } else {
      setDetails([]);
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
  const fetchInvoice = async (year) => {
    const res = await getAllInvoiceforDashboard(year);

    if (res.status) {
      setInvoice(res?.data?.amounts);
    } else {
      setInvoice([]);
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

  const valuesArray = orderedMonths?.map((month) => details[month]);
  const valuesArray2 = orderedMonths?.map((month) => proformaInvoice[month]);
  const valuesArray3 = orderedMonths?.map((month) => invoice[month]);
  const valuesArray4 = orderedMonths?.map((month) => allPayment?.[month]);
  const chartData = {
    series: [
      {
        name: "measurement",
        data:
          valuesArray[0] == undefined
            ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            : valuesArray,
      },
    ],
    options: {
      chart: {
        toolbar: { show: true },
        offsetX: -10,
        offsetY: 10,
      },
      colors: ["#3e88c7"],
      stroke: {
        curve: "smooth",
        width: 1,
      },
      dataLabels: {
        enabled: false,
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
        max: 500000, // Maximum value on the y-axis
        tickAmount: 8,
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
  const chartData2 = {
    series: [
      {
        name: "Proforma Invoice",
        data:
          valuesArray2[0] == undefined
            ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            : valuesArray2,
      },
    ],
    options: {
      chart: {
        toolbar: { show: true },
        offsetX: -10,
        offsetY: 10,
      },
      colors: ["#3e88c7"],
      stroke: {
        curve: "smooth",
        width: 1,
      },
      dataLabels: {
        enabled: false,
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
        max: 500000, // Maximum value on the y-axis
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
  const chartData3 = {
    series: [
      {
        name: "Invoice",
        data:
          valuesArray3[0] == undefined
            ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            : valuesArray3,
      },
    ],
    options: {
      chart: {
        toolbar: { show: true },
        offsetX: -10,
        offsetY: 10,
      },
      colors: ["#3e88c7"],
      stroke: {
        curve: "smooth",
        width: 1,
      },
      dataLabels: {
        enabled: false,
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
        max: 500000, // Maximum value on the y-axis
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
  const chartData4 = {
    series: [
      {
        name: "payment",
        data:
          valuesArray4[0] == undefined
            ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            : valuesArray4,
      },
    ],
    options: {
      chart: {
        toolbar: { show: true },
        offsetX: -10,
        offsetY: 10,
      },
      colors: ["#3e88c7"],
      stroke: {
        curve: "smooth",
        width: 1,
      },
      dataLabels: {
        enabled: false,
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
    },
  };
  return (
    <>
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
      <Row className="g-4 row-cols-1 row-cols-md-2 text-center">
        <Col>
          <Card className="card-bg">
            <Card.Body>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={200}
              />
              <p className="mb-0">{t("Total Measurement")}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="card-bg">
            <Card.Body>
              <Chart
                options={chartData2.options}
                series={chartData2.series}
                type="bar"
                height={200}
              />
              <p className="mb-0">{t("Total Proforma invoice")}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="card-bg">
            <Card.Body>
              <Chart
                options={chartData3.options}
                series={chartData3.series}
                type="bar"
                height={200}
              />
              <p className="mb-0">{t("Total Invoice")}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="card-bg">
            <Card.Body>
              <Chart
                options={chartData4.options}
                series={chartData4.series}
                type="bar"
                height={200}
              />
              <p className="mb-0">{t("Total Payment")}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ComplaintTypeStatusCount;
