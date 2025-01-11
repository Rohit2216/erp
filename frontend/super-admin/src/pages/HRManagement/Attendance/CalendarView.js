import React, { useState, useEffect } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import Select from "react-select";
import {
  getAllUsersAttendanceInCalendar,
  postMarkManualAttendance,
} from "../../../services/authapi";
import TextareaAutosize from "react-textarea-autosize";
import Modaljs from "../../../components/Modal";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { createManuallyAttendanceSchema } from "../../../utils/formSchema";
import moment from "moment";

const CalendarView = ({ selectedMonth, changeView }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allCalendarData, setAllCalendarData] = useState([]);
  const [attendanceView, setAttendanceView] = useState(false);
  const [attendanceId, setAttendanceId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");

  const fetchAllgetAllCalendarData = async () => {
    const res = await getAllUsersAttendanceInCalendar(selectedMonth);
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
    // return console.log("sData", sData);
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
            alt="Loading"
          />
        </div>
      ) : allCalendarData?.length > 0 ? (
        <div className="table-container bg-new">
          <Table className="text-body sticky-table table-bordered border-primary">
            <thead>
              <tr>
                <th className="sticky-cell sticky-column">
                  <div>
                    <th style={{ width: "60px" }}>Sr No.</th>
                    <th style={{ width: "100px" }}>Emp Code</th>
                    <th>Employee Name</th>
                    <th style={{ width: "80px" }}>Pay Days</th>
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
                    </div>
                  </td>
                  {data?.attendanceReports?.map((itm, idx2) => (
                    <td
                      onClick={() => {
                        handleOpen(data?.id);
                        setAttendanceDate(idx2 + 1);
                      }}
                      className={`cursor-pointer text-${
                        itm === "AB"
                          ? "danger"
                          : itm === "HF"
                          ? "orange"
                          : "green"
                      } `}
                    >
                      {itm}
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
              `YYYY-MM-${
                attendanceDate <= 9 ? "0" + attendanceDate : attendanceDate
              } 09:00`
            ) || "",
          out_time:
            moment(selectedMonth).format(
              `YYYY-MM-${
                attendanceDate <= 9 ? "0" + attendanceDate : attendanceDate
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
            title={"Mark Manual Attendance"}
            formikProps={props}
          >
            <Row className="g-3 align-items-center">
              <Form.Group as={Col} md={12}>
                <Form.Label>
                  Attendance Status{" "}
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
                        `YYYY-MM-DD ${
                          selectedOption.value === 3 ? "14:00" : "18:00"
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
                    <Form.Label>In Time</Form.Label>
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
              )}
              <Form.Group as={Col} md={12}>
                <Form.Label>Note</Form.Label>
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
    </>
  );
};

export default CalendarView;
