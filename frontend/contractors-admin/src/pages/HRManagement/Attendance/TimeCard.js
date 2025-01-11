import React, { useState } from "react";
import moment from "moment";
import { Col, Form, Row, Table } from "react-bootstrap";
import ActionButton from "../../../components/ActionButton";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import { useEffect } from "react";
import { getAdminAllTimeCard } from "../../../services/authapi";
import { Link } from "react-router-dom";
import CalendarView from "./CalendarView";
import { BsCalendar4Week, BsTable } from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import { useTranslation } from "react-i18next";

const TimeCard = ({ refresh2 }) => {
  const [selectedMonth, setSelectedMonth] = useState(
    moment(new Date()).format("YYYY-MM") || ""
  );
  const [dateRange, setDateRange] = useState([
    moment().startOf("month").format("YYYY-MM-DD"),
    moment(),
  ]);
  const [changeView, setChangeView] = useState(false);
  const [apiData, setApiData] = useState([]);
  const { t } = useTranslation();

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const fetchTimeCardData = async () => {
    const startDate = moment(dateRange[0]).format("DD-MM-YYYY");
    const endDate = moment(dateRange[1]).format("DD-MM-YYYY");
    const res = await getAdminAllTimeCard(startDate, endDate);
    if (res.status) {
      setApiData(res.data);
    } else {
      setApiData([]);
    }
  };

  useEffect(() => {
    fetchTimeCardData();
  }, [dateRange, refresh2]);

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <div className="d-flex gap-3 align-items-center mb-2 justify-content-end">
          <div>
            {changeView === false ? (
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            ) : (
              <Form.Control
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
              />
            )}
          </div>

          <TooltipComponent
            title={changeView === false ? "Calendar View" : "Table View"}
          >
            <div
              onClick={() => setChangeView(!changeView)}
              className={`social-btn-re d-align gap-2 px-3 w-auto ${
                changeView === false ? "danger" : "success"
              }-combo`}
            >
              {changeView === false ? <BsCalendar4Week /> : <BsTable />}
            </div>
          </TooltipComponent>
        </div>
        {changeView === false ? (
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Employee Code")}</th>
                  <th>{t("Employee Name")}</th>
                  <th>{t("Date")}</th>
                  <th>{t("Login")}</th>
                  <th>{t("Logout")}</th>
                  <th>{t("Total Time")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {apiData?.length > 0 ? null : (
                  <tr>
                    <td colSpan={9}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="230"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {apiData?.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <Link
                        className="text-secondary text-none"
                        to={`/Attendance/UserAttendance/${data?.user_id}`}
                      >
                        {data?.employee_id}
                      </Link>
                    </td>
                    <td>
                      <img
                        className="avatar me-2"
                        src={
                          data?.user_image
                            ? `${process.env.REACT_APP_API_URL}${data?.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      />
                      {data?.user_name}
                    </td>
                    <td>{data?.date}</td>
                    <td>{data?.clockIn}</td>
                    <td>{data?.clockOut}</td>
                    <td>{data?.totalWorkDuration}</td>
                    <td>
                      <ActionButton
                        eyelink={`/Attendance/UserAttendance/${data?.user_id}`}
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <CalendarView selectedMonth={selectedMonth} changeView={changeView} />
        )}
      </Col>
    </>
  );
};

export default TimeCard;
