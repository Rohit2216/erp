import React, { useState } from "react"; // Add useState here
import { Card, Col, Form, Button } from "react-bootstrap"; // Add Button here
import CardComponent from "../components/CardComponent";
import { Helmet } from "react-helmet";
import TimeBar from "../components/BarCharts/TimeBar";
import TotalComplaint from "../components/BarCharts/TotalComplaint";
import TotalComplaintTypes from "../components/BarCharts/TotalComplaintTypes";
import ComplaintStatusCount from "../components/BarCharts/ComplaintStatusCount";
import ComplaintTypeStatusCount from "../components/BarCharts/ComplaintTypeStatusCount";
import TotalMeasurementCount from "../components/BarCharts/TotalMeasurementCount";
import TotalMeasurementStatusCount from "../components/BarCharts/TotalMeasurementStatusCount";
import TotalPerformaInvoiceCount from "../components/BarCharts/TotalPerformaInvoiceCount";
import TotalInvoiceStatusCount from "../components/BarCharts/TotalInvoiceStatusCount";
import TotalPerformaInvoiceStatusCount from "../components/BarCharts/TotalPerformaInvoiceStatusCount";
import TotalInvoiceCount from "../components/BarCharts/TotalInvoiceCount";
import TotalInvoiceStatusValue from "../components/BarCharts/TotalInvoiceStatusValue";
import HolidayCalender from "../components/BarCharts/HolidayCalender";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import AreaManagerDashBoard from "../components/BarCharts/AreaManagerDashBoard";
import EndUserDashBoard from "../components/BarCharts/EndUserDashBoard";
import ClockIn from "../components/BarCharts/clockInClockOut";
import { options } from "@fullcalendar/core/preact.js";
import BillingChart from "../components/BarCharts/BillingChart";
import TotalComplaints from "../components/BarCharts/TotalComplaints";
import AreaManagerBillingDashboard from "../components/BarCharts/AreaManagerBillingDashboard";
import RegionalOfficeDashboard from "../components/BarCharts/RegionalOfficeDashboard";
import RegionalOfficeBilling from "../components/BarCharts/AnalyticsBar/RegionalOfficeBilling";
import DashboardOverview from "../components/BarCharts/userActivityData";
const Home = () => {
  const { t } = useTranslation();
  
  // Add state for clock in/out functionality
  const [isClockedIn, setIsClockedIn] = useState(false);

  const handleClockInOut = () => {
    setIsClockedIn(!isClockedIn); // Toggle between clocking in and out
  };

  function Calendar() {
    const options = [
      { value: 2010, label: "2010-11" },
      { value: 2011, label: "2011-12" },
      { value: 2012, label: "2012-13" },
      { value: 2013, label: "2013-14" },
      { value: 2014, label: "2014-15" },
      { value: 2015, label: "2015-16" },
      { value: 2016, label: "2016-17" },
      { value: 2017, label: "2017-18" },
      { value: 2018, label: "2018-19" },
      { value: 2019, label: "2019-20" },
      { value: 2020, label: "2020-21" },
      { value: 2021, label: "2021-22" },
      { value: 2022, label: "2022-23" },
      { value: 2023, label: "2023-24" },
      { value: 2024, label: "2024-25" },
    ];
    return (
      <Select
        className="fs-11 text-primary"
        defaultValue={options[14]}
        options={options}
      />
    );
  }
  
  function Date() {
    return <Form.Control type="date" className="fs-11 w-auto" />;
  }

  function NavDrop() {
    return (
      <Select
        className="fs-11 text-primary"
        options={[
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly" },
        ]}
      />
    );
  }

  const dashboard = [
    // {
    //   id: 1,
    //   col: 12,
    //   title: t("Total Complaints"),
    //   chart: <TotalComplaint />,
    //   select: (
    //     <>
    //       {/* <Date /> */}
    //       {/* <Calendar /> */}
    //     </>
    //   ),
    // },
    // {
    //   id: 2,
    //   col: 5,
    //   title: t("Complaint Types"),
    //   chart: <TotalComplaintTypes />,
    //   select: (
    //     <>
    //       <Date />
    //       <Calendar />
    //     </>
    //   ),
    // },
    // {
    //   id: 3,
    //   col: 12,
    //   title: t("Complaint Status Count"),
    //   chart: <ComplaintStatusCount />,
    //   select: <></>,
    // },
    // {
    //   id: 4,
    //   col: 5,
    //   title: t("Holiday Calender"),
    //   classbody: "px-0",
    //   chart: <HolidayCalender />,
    // },
    // {
    //   id: 5,
    //   col: 12,
    //   title: t("Complaint Type Status Count"),
    //   chart: <ComplaintTypeStatusCount />,
    //   select: <></>,
    // },

    // {
    //   id: 5,
    //   col: 12,
    //   title: t("Billing chart"),
    //   chart: <BillingChart />,
    //   select: <></>,
    // },
    // {
    //   id: 6,
    //   col: 6,
    //   title: t("Measurement Count"),
    //   chart: <TotalMeasurementCount />,
    //   select: (
    //     <>
    //       <Date />
    //       <Calendar />
    //       <NavDrop />
    //     </>
    //   ),
    // },
    // {
    //   id: 7,
    //   col: 6,
    //   title: t("Measurement Status Count"),
    //   chart: <TotalMeasurementStatusCount />,
    //   select: (
    //     <>
    //       <Date />
    //       <Calendar />
    //     </>
    //   ),
    // },
    // {
    //   id: 8,
    //   col: 12,
    //   title: t("Performa Invoice Count"),
    //   chart: <TotalPerformaInvoiceCount />,
    //   select: (
    //     <>
    //       <Date />
    //       <Calendar />
    //     </>
    //   ),
    // },
    // {
    //   id: 9,
    //   col: 7,
    //   title: t("Performa Invoice Status Count"),
    //   chart: <TotalPerformaInvoiceStatusCount />,
    //   select: (
    //     <>
    //       <Date />
    //       <Calendar />
    //     </>
    //   ),
    // },
    // {
    //   id: 10,
    //   col: 5,
    //   title: t("Invoice Count"),
    //   chart: <TotalInvoiceCount />,
    //   select: (
    //     <>
    //       <Date />
    //       <Calendar />
    //     </>
    //   ),
    // },
    // {
    //   id: 11,
    //   col: 6,
    //   title: t("Invoice Status Count"),
    //   chart: <TotalInvoiceStatusCount />,
    //   select: (
    //     <>
    //       <Date />
    //       <Calendar />
    //     </>
    //   ),
    // },
    // {
    //   id: 12,
    //   col: 6,
    //   title: t("Invoice Status Value"),
    //   chart: <TotalInvoiceStatusValue />,
    //   select: (
    //     <>
    //       <Date />
    //       <Calendar />
    //     </>
    //   ),
    // },
    // {
    //   id: 13,
    //   col: 12,
    //   title: t("Area Manager Complaint details"),
    //   chart: <AreaManagerDashBoard />,
    //   select: <></>,
    // },
    // {
    //   id: 14,
    //   col: 12,
    //   title: t("Regional Office Complaint details"),
    //   chart: <RegionalOfficeDashboard />,
    //   select: <></>,
    // },
    {
      id: 15,
      col: 12,
      title: t("End User Complaint details"),
      chart: <EndUserDashBoard />,
      select: <></>,
    },
    // {
    //   id: 16,
    //   col: 12,
    //   title: t("Area Manager Billing details"),
    //   chart: <AreaManagerBillingDashboard />,
    //   select: <></>,
    // },
    // {
    //   id: 17,
    //   col: 12,
    //   title: t("Regional Office Billing details"),
    //   chart: <RegionalOfficeBilling />,
    //   select: <></>,
    // },
  ];

  // return (
  //   <>
  //     <Helmet>
  //       <title>CMS Electricals</title>
  //     </Helmet>
  //     <Col md={12}>
  //       <Card className="card-bg">
  //         <Card.Body>
  //           <TimeBar />
  //         </Card.Body>
  //       </Card>
  //     </Col>
  //     {/* <Col md={12}>
  //       <TotalComplaints />
  //     </Col> */}
  //     {dashboard.map((items, idx) => (
  //       <Col key={idx} md={items.col}>
  //         <CardComponent
  //           align={items.align}
  //           headclass={""}
  //           heading2={items.date}
  //           classbody={items.classbody}
  //           custom={items.select}
  //           icon={items.drop}
  //           title={items.title}
  //         >
  //           {items.chart}
  //         </CardComponent>
  //       </Col>
  //     ))}
  //   </>
  // );
  // return (
  //   <>
  //     <Helmet>
  //       <title>CMS Electricals</title>
  //     </Helmet>

  //     <Col md={12}>
  //       <Card className="card-bg">
  //         <Card.Body>
  //           <TimeBar />
  //         </Card.Body>
  //       </Card>
  //     </Col>

  //     {/* Clock-in/Clock-out Button */}
  //     <Col md={12} className="mb-4">
  //       <Card className="card-bg">
  //         <Card.Body>
  //           <Button
  //             variant={isClockedIn ? "danger" : "success"}
  //             onClick={handleClockInOut}
  //           >
  //             {isClockedIn ? "Clock Out" : "Clock In"}
  //           </Button>
  //         </Card.Body>
  //       </Card>
  //     </Col>

  //     {dashboard.map((items, idx) => (
  //       <Col key={idx} md={items.col}>
  //         <CardComponent
  //           align={items.align}
  //           headclass={""}
  //           heading2={items.date}
  //           classbody={items.classbody}
  //           custom={items.select}
  //           icon={items.drop}
  //           title={items.title}
  //         >
  //           {items.chart}
  //         </CardComponent>
  //       </Col>
  //     ))}
  //   </>
  // );

  return (
    <>
      <Helmet>
        <title>CMS Electricals</title> {/* Set the page title */}
      </Helmet>

       {/* ClockIn/ClockOut Section using ClockIn Component */}
       {/* <Col md={12} className="mb-4">
        <Card className="card-bg">
          <Card.Body>
            <ClockIn /> {/* Render the ClockIn component here */}
          {/* </Card.Body>
        </Card>
      </Col> */} 

      {/* TimeBar Component */}
      <Col md={12}>
        <Card className="card-bg">
          <Card.Body>
            <TimeBar />
          </Card.Body>
        </Card>
      </Col>

     {/* user activity data Component */}
     <Col md={12}>
        <Card className="card-bg">
          <Card.Body>
            <DashboardOverview />
          </Card.Body>
        </Card>
      </Col>

      {/* TotalComplaint Component */}
      {/* <Col md={12}>
        <Card className="card-bg">
          <Card.Body>
            <TotalComplaint />
          </Card.Body>
        </Card>
      </Col> */}
    </>
  );
};


export default Home;
