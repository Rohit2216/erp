import React, { useState, useEffect } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import Select from "react-select";
import {
  getAllUsersAttendanceInCalendar,
  postMarkAttendance,
  postMarkManualAttendance,
} from "../../../services/contractorApi";
import TextareaAutosize from "react-textarea-autosize";
import Modaljs from "../../../components/Modal";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { createManuallyAttendanceSchema } from "../../../utils/formSchema";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { SlCalender } from "react-icons/sl";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";

const CalendarView = ({ selectedMonth, changeView }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allCalendarData, setAllCalendarData] = useState([]);
  const [attendanceView, setAttendanceView] = useState(false);
  const [markAttendanceView, setMarkAttendanceView] = useState(false);
  const [attendanceId, setAttendanceId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);
  const userID = user.user_type;

  const fetchAllgetAllCalendarData = async () => {
    const res = await getAllUsersAttendanceInCalendar(selectedMonth);
    console.log(res.data, "----", selectedMonth, "calneder");
    if (res.status) {
      setAllCalendarData(res.data);
    } else {
      setAllCalendarData([]);
    }
    setIsLoading(false);
  };

  const handleOpen = (id) => {
    setAttendanceId(id);
    setAttendanceView(true);
  };
  const handleModal = (id) => {
    setAttendanceId(id);
    setMarkAttendanceView(true);
  };

  const handleSubmitMarkAttendance = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    let selectedData = selectedMonth;
    const currentMonth = new Date(selectedData);
    const id = [attendanceId];
    const sData = {
      user_ids: id,
      month: currentMonth.getMonth() + 1,
      // month_name: date.toLocaleString("default", { month: "long" }),
      date: values.date?.split(",").map((range) => range.trim()),
      attendance_status: String(values.attendance_status.value),
    };
    // return console.log(date, "mionthhh");
    console.log("sData", sData);
    const res = await postMarkAttendance(sData);
    if (res.status) {
      toast.success(res.message);
      fetchAllgetAllCalendarData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setMarkAttendanceView(false);
  };
  const handleSubmitAttendance = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    const sData = {
      user_id: attendanceId,
      in_time: values.is_default_time == true ? "" : values.in_time,
      out_time: values.is_default_time == true ? "" : values.out_time,
      is_default_time: values.is_default_time,
      note: values.note,
      attendance_status: values.attendance_status.value,
    };
    // return console.log(date, "mionthhh");
    console.log("sData", sData);
    const res = await postMarkManualAttendance(sData);
    if (res.status) {
      toast.success(res.message);
      fetchAllgetAllCalendarData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setAttendanceView(false);
  };

  useEffect(() => {
    if (changeView) {
      fetchAllgetAllCalendarData();
    }
  }, [changeView, selectedMonth]);

  const options = [
    { label: "Absent", value: 1 },
    { label: "Present", value: 2 },
    { label: "Half Day", value: 3 },
  ];

  const defaultOption = options.find((option) => option.value === 1);

  return (
    <>
      {isLoading ? (
        <div className="bg-new text-center">
          <img
            className="p-3"
            width="320"
            src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
            alt={t("Loading")}
          />
        </div>
      ) : allCalendarData?.length > 0 ? (
        <div className="table-container bg-new">
          <Table className="text-body sticky-table table-bordered border-primary">
            <thead>
              <tr>
                <th className="sticky-cell sticky-column">
                  <div>
                    <th style={{ width: "60px" }}>{t("Sr No.")}</th>
                    <th style={{ width: "100px" }}>{t("Employee Code")}</th>
                    <th>{t("Employee Name")}</th>
                    <th style={{ width: "80px" }}>{t("Pay Days")}</th>
                    <th style={{ width: "80px" }}>{t("Mark Attendance")}</th>
                  </div>
                </th>
                {allCalendarData[0]?.attendanceReports?.map((itm, idx) => (
                  <th key={idx}>{idx + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCalendarData?.map((data, index) => (
                <tr key={index}>
                  <td className="sticky-cell sticky-column">
                    <div>
                      <td style={{ width: "60px" }}>{index + 1}</td>
                      <td style={{ width: "100px" }}>{data?.employee_id}</td>
                      <td>
                        <p>{data?.name}</p>
                      </td>
                      <td
                        className="text-green fw-bolder text-center"
                        style={{ width: "80px" }}
                      >
                        {data?.total_pay_days}
                      </td>
                      <td
                        style={{ width: "80px" }}
                        className="text-center fw-bolder"
                      >
                        {/* {userID === 6 && (<SlCalender
                          onClick={() => {
                            handleModal(data?.id);
                          }}
                          className="text-orange cursor-pointer"
                        />)} */}
                        <SlCalender
                          onClick={userID == 3 ? () => handleModal(data?.id) : undefined}
                          className="text-orange cursor-pointer"
                        />

                      </td>
                    </div>
                  </td>
                  {/* {data?.attendanceReports?.map((itm, idx2) => (
                    <td
                      onClick={() => {
                        handleOpen(data?.id);
                        setAttendanceDate(idx2 + 1);
                      }}
                      className={`cursor-pointer text-${itm === "AB"
                          ? "danger"
                          : itm === "HF"
                            ? "orange"
                            : "green"
                        } `}
                    >
                      {itm}
                    </td>
                  ))} */}
                  {data?.attendanceReports?.map((itm, idx2) => (
                    <td
                      onClick={() => {
                        // Open modal only if userID is 6
                        if (userID == 3) {
                          handleOpen(data?.id);
                          setAttendanceDate(idx2 + 1);
                        }
                      }}
                      className={`cursor-pointer text-${itm === "AB"
                          ? "danger" // Absent
                          : itm === "HF"
                            ? "orange" // Half-day
                            : "green" // Present
                        }`}
                    >
                      {itm === "AB" ? "AB" : itm === "HF" ? "H" : "P"} {/* Short form */}
                    </td>
                  ))}


                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="bg-new text-center">
          <img
            className="p-3"
            alt="no-result"
            width="230"
            src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
          />
        </div>
      )}

      <Formik
        enableReinitialize={true}
        initialValues={{
          in_time:
            moment(selectedMonth).format(
              `YYYY-MM-${attendanceDate <= 9 ? "0" + attendanceDate : attendanceDate
              } 09:00`
            ) || "",
          out_time:
            moment(selectedMonth).format(
              `YYYY-MM-${attendanceDate <= 9 ? "0" + attendanceDate : attendanceDate
              } 18:00`
            ) || "",
          is_default_time: false,
          note: "",
          attendance_status: defaultOption,
        }}
        validationSchema={createManuallyAttendanceSchema}
        onSubmit={handleSubmitAttendance}
      >
        {(props) => (
          <Modaljs
            open={attendanceView}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setAttendanceView(false)}
            title={t("Mark Manual Attendance")}
            formikProps={props}
          >
            <Row className="g-3 align-items-center">
              <Form.Group as={Col} md={12}>
                <Form.Label>
                  {t("Attendance Status")}
                  <span className="text-danger fw-bold">*</span>
                </Form.Label>
                <Select
                  menuPosition="fixed"
                  name="attendance_status"
                  options={options}
                  onChange={(selectedOption) => {
                    props.setFieldValue("attendance_status", selectedOption);
                    props.setFieldValue(
                      "out_time",
                      moment().format(
                        `YYYY-MM-DD ${selectedOption.value === 3 ? "14:00" : "18:00"
                        }`
                      )
                    );
                  }}
                  value={props.values.attendance_status}
                />
                <ErrorMessage
                  name="attendance_status"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Form.Check
                  id="is_default_time"
                  type="checkbox"
                  label="Is Default Time"
                  name={"is_default_time"}
                  onChange={props.handleChange}
                />
              </Form.Group>
              {!props.values.is_default_time && (
                <>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>{t("In Time")}</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name={"in_time"}
                      value={props.values.in_time}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>{t("Out Time")}</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name={"out_time"}
                      value={props.values.out_time}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                </>
              )}

              <Form.Group as={Col} md={12}>
                <Form.Label>{t("Note")}</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  className="edit-textarea"
                  name={"note"}
                  value={props.values.note}
                  onChange={props.handleChange}
                />
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
      <Formik
        enableReinitialize={true}
        initialValues={{
          in_time:
            moment(selectedMonth).format(
              `YYYY-MM-${attendanceDate <= 9 ? "0" + attendanceDate : attendanceDate
              } 09:00`
            ) || "",
          out_time:
            moment(selectedMonth).format(
              `YYYY-MM-${attendanceDate <= 9 ? "0" + attendanceDate : attendanceDate
              } 18:00`
            ) || "",
          is_default_time: false,
          note: "",
          attendance_status: defaultOption,
        }}
        validationSchema={createManuallyAttendanceSchema}
        onSubmit={handleSubmitMarkAttendance}
      >
        {(props) => (
          <Modaljs
            open={markAttendanceView}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setMarkAttendanceView(false)}
            title={t("Mark Manual Attendance")}
            formikProps={props}
          >
            <Row className="g-3 align-items-center">
              <Form.Group as={Col} md={12}>
                <Form.Label>
                  {t("Attendance Status")}
                  <span className="text-danger fw-bold">*</span>
                </Form.Label>
                <Select
                  menuPosition="fixed"
                  name="attendance_status"
                  options={options}
                  onChange={(selectedOption) => {
                    props.setFieldValue("attendance_status", selectedOption);
                    props.setFieldValue(
                      "out_time",
                      moment().format(
                        `YYYY-MM-DD ${selectedOption.value === 3 ? "14:00" : "18:00"
                        }`
                      )
                    );
                  }}
                  value={props.values.attendance_status}
                />
                <ErrorMessage
                  name="attendance_status"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>
              {/* <Form.Group as={Col} md={12}>
                <Form.Check
                  id="is_default_time"
                  type="checkbox"
                  label="Is Default Time"
                  name={"is_default_time"}
                  onChange={props.handleChange}
                />
              </Form.Group> */}
              {/* {!props.values.is_default_time && (
                <>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>In Timeyyyyyy</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name={"in_time"}
                      value={props.values.in_time}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Out Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name={"out_time"}
                      value={props.values.out_time}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                </>
              )} */}

              <Form.Group as={Col} md={12}>
                <Form.Label>{t("Date")}</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  className="edit-textarea"
                  name={"date"}
                  value={props.values.date}
                  onChange={props.handleChange}
                />
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default CalendarView;
