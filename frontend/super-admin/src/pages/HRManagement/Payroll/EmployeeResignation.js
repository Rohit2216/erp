import React, { Fragment, useEffect, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col, Form, Table, Row, Card } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  BsCheckLg,
  BsEyeFill,
  BsXLg,
  BsFileEarmarkPdf,
  BsPlus,
  BsPencilSquare,
} from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import TextareaAutosize from "react-textarea-autosize";
import CardComponent from "../../../components/CardComponent";
import { ErrorMessage, Formik } from "formik";
import Select from "react-select";
import Modaljs from "../../../components/Modal";
import {
  CreateResignations,
  UpdateResignations,
  UpdateResignationsRequest,
  getAllGeneratedFNF,
  getAllResignationsApprovedRequest,
  getAllResignationsPendingRequest,
  getAllResignationsRejectedRequest,
  getAllUsers,
} from "../../../services/authapi";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { addEmployeeResignationSchema } from "../../../utils/formSchema";

const EmployeeResignation = () => {
  const [resignationData, setResignationData] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const [edit, setEdit] = useState({});
  const [allRequestsData, setAllRequestsData] = useState([]);
  const [allApprovedData, setAllApprovedData] = useState([]);
  const [allRejectedData, setAllRejectedData] = useState([]);
  const [allFnfData, setAllFnfData] = useState([]);
  const [getValue, setGetValue] = useState({});
  const [singlePlans, setSinglePlans] = useState(false);

  const tabs = [
    { title: "Requests", className: "ms-auto", page: <ResignationRequests /> },
    { title: "Approval", page: <ResignationApproval /> },
    { title: "Rejected", page: <ResignationRejected /> },
    { title: "FNF Statement", page: <FNF /> },
  ];

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchAllRequestsData = async () => {
    const res = await getAllResignationsPendingRequest();
    if (res.statusL) {
      setAllRequestsData(res.data);
    } else {
      setAllRequestsData([]);
    }
  };
  const fetchAllApprovedData = async () => {
    const res = await getAllResignationsApprovedRequest();
    if (res.statusL) {
      setAllApprovedData(res.data);
    } else {
      setAllApprovedData([]);
    }
  };
  const fetchAllRejectedData = async () => {
    const res = await getAllResignationsRejectedRequest();
    if (res.statusL) {
      setAllRejectedData(res.data);
    } else {
      setAllRejectedData([]);
    }
  };
  const fetchAllFnfData = async () => {
    const res = await getAllGeneratedFNF();
    if (res.status) {
      setAllFnfData(res.data);
    } else {
      setAllFnfData([]);
    }
  };

  // Approved/Rejected Resignation Requests
  const handleApproved = async (id) => {
    const res = await UpdateResignationsRequest(id, 1);
    if (res.status) {
      toast.success(res.message);
      setAllRequestsData((prev) => prev.filter((itm) => itm.id !== +id));
    } else {
      toast.error(res.message);
    }
  };
  const handleRejected = async (id) => {
    const res = await UpdateResignationsRequest(id, 2);
    if (res.status) {
      toast.success(res.message);
      setAllRequestsData((prev) => prev.filter((itm) => itm.id !== +id));
    } else {
      toast.error(res.message);
    }
  };

  function ResignationRequests() {
    return (
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "Employee Name",
              "Resignation Date",
              "Last Day of Work",
              "Action",
            ].map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allRequestsData?.length > 0 ? null : (
            <tr>
              <td colSpan={5}>
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </td>
            </tr>
          )}
          {allRequestsData?.map((req, id1) => (
            <tr key={id1}>
              <td>{id1 + 1}</td>
              <td>
                <div className="text-truncate">
                  <img
                    className="avatar me-2"
                    src={
                      req?.image
                        ? `${process.env.REACT_APP_API_URL}${req?.image}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                    }
                  />
                  {req?.user_name}
                </div>
              </td>
              <td>{moment(req?.resignation_date).format("DD/MM/YYYY")}</td>
              <td>03/30/2023 | Thursday</td>
              <td>
                <span className="d-align gap-2">
                  <TooltipComponent title={"Edit"}>
                    <span
                      onClick={() => setResignationData(true)}
                      className="social-btn-re d-align gap-2 px-3 w-auto danger-combo"
                    >
                      <BsPencilSquare />
                    </span>
                  </TooltipComponent>
                  <div className="vr hr-shadow"></div>
                  <TooltipComponent title={"View"}>
                    <span
                      onClick={() => handleView(req)}
                      className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                    >
                      <BsEyeFill />
                    </span>
                  </TooltipComponent>
                  <div className="vr hr-shadow"></div>
                  <TooltipComponent title={"Reject"}>
                    <span
                      onClick={() => handleRejected(req.id)}
                      className="social-btn-re d-align gap-2 px-3 w-auto red-combo"
                    >
                      <BsXLg />
                    </span>
                  </TooltipComponent>
                  <div className="vr hr-shadow"></div>
                  <TooltipComponent title={"Approve"}>
                    <span
                      onClick={() => handleApproved(req.id)}
                      className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                    >
                      <BsCheckLg />
                    </span>
                  </TooltipComponent>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  function ResignationApproval() {
    return (
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "Employee Name",
              "Resignation Date",
              "Last Day of Work",
              "Approved Resignation",
              "Action",
            ].map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allApprovedData?.length > 0 ? null : (
            <tr>
              <td colSpan={7}>
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </td>
            </tr>
          )}
          {allApprovedData?.map((app, id2) => (
            <tr key={id2}>
              <td>{id2 + 1}</td>
              <td>
                <div className="text-truncate">
                  <img
                    className="avatar me-2"
                    src={
                      app?.image
                        ? `${process.env.REACT_APP_API_URL}${app?.image}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                    }
                  />
                  {app?.user_name}
                </div>
              </td>
              <td>{moment(app?.resignation_date).format("DD/MM/YYYY")}</td>
              <td>03/30/2023 | Thursday</td>
              <td className="text-green">Approve</td>
              <td>
                <span className="d-align gap-2">
                  <TooltipComponent title={"View"}>
                    <span
                      onClick={() => handleView(app)}
                      className="social-btn  success-combo"
                    >
                      <BsEyeFill />
                    </span>
                  </TooltipComponent>
                  <div className="vr hr-shadow"></div>
                  <TooltipComponent title={"FNF Statement"}>
                    <BsFileEarmarkPdf className="social-btn success-combo" />
                  </TooltipComponent>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  function ResignationRejected() {
    return (
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "Employee Name",
              "Resignation Date",
              "Last Day of Work",
              "Rejected Resignation",
              "Action",
            ].map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allRejectedData?.length > 0 ? null : (
            <tr>
              <td colSpan={7}>
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </td>
            </tr>
          )}
          {allRejectedData?.map((rejected, id3) => (
            <tr key={id3}>
              <td>{id3 + 1}</td>
              <td>
                <div className="text-truncate">
                  <img
                    className="avatar me-2"
                    src={
                      rejected?.image
                        ? `${process.env.REACT_APP_API_URL}${rejected?.image}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                    }
                  />
                  {rejected?.user_name}
                </div>
              </td>
              <td>{moment(rejected?.resignation_date).format("DD/MM/YYYY")}</td>
              <td>03/30/2023 | Thursday</td>
              <td className="text-danger">Rejected</td>
              <td>
                <span className="d-align gap-2">
                  <TooltipComponent title={"View"}>
                    <span
                      onClick={() => handleView(rejected)}
                      className="social-btn  success-combo"
                    >
                      <BsEyeFill />
                    </span>
                  </TooltipComponent>
                  <div className="vr hr-shadow"></div>
                  <TooltipComponent title={"FNF Statement"}>
                    <BsFileEarmarkPdf className="social-btn success-combo" />
                  </TooltipComponent>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  function FNF() {
    return (
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "Employee Name",
              "Remarks",
              "generated by",
              "Action",
            ].map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFnfData?.length > 0 ? null : (
            <tr>
              <td colSpan={5}>
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </td>
            </tr>
          )}
          {allFnfData?.map((data, idx) => (
            <tr key={data?.id}>
              <td>{idx + 1}</td>
              <td>
                <div className="text-truncate">
                  <img
                    className="avatar me-2"
                    src={
                      data?.image
                        ? `${process.env.REACT_APP_API_URL}${data?.image}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                    }
                  />
                  {data?.user_name}
                </div>
              </td>
              <td>{data?.remarks}</td>
              <td>{data?.generated_by}</td>
              <td>
                <span className="d-align gap-2">
                  <TooltipComponent title={"View"}>
                    <span
                      onClick={() => handleView(data)}
                      className="social-btn success-combo"
                    >
                      <BsEyeFill />
                    </span>
                  </TooltipComponent>
                  <div className="vr hr-shadow"></div>
                  <TooltipComponent title={"FNF Statement"}>
                    <BsFileEarmarkPdf className="social-btn success-combo" />
                  </TooltipComponent>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  function handleClick(e) {
    setGetValue(e.target);
    if (e.target.textContent === "Approval") {
      fetchAllApprovedData();
    }
    if (e.target.textContent === "Rejected") {
      fetchAllRejectedData();
    }
    if (e.target.textContent === "FNF Statement") {
      fetchAllFnfData();
    }
  }

  const handleView = async (data) => {
    setEdit(data);
    setSinglePlans(true);
  };
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const sData = {
      user_id: values.user_id.value,
      resignation_date: values.resignation_date,
      last_working_day: values.last_working_day,
      reason: values.reason,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log("sData", sData);
    const res = edit.id
      ? await UpdateResignations(sData)
      : await CreateResignations(sData);
    if (res.status) {
      fetchAllRequestsData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setResignationData(false);
  };

  const singleoutletsList = [
    { id: 1, title: "approved at", value: edit?.approved_at },
    { id: 2, title: "approved by", value: edit?.approved_by },
    { id: 3, title: "assign asset", value: edit?.assign_asset },
    { id: 4, title: "fnf", value: edit?.fnf },
    {
      id: 5,
      title: "image",
      src: `${process.env.REACT_APP_API_URL}${edit?.image}`,
    },
    {
      id: 6,
      title: "last working day",
      value: edit?.last_working_day
        ? moment(edit?.last_working_day).format("YYYY-MM-DD | h:mm:ss a")
        : "",
    },
    { id: 7, title: "notice period day", value: edit?.notice_period_day },
    { id: 8, title: "reason", value: edit?.reason },
    {
      id: 9,
      title: "resignation date",
      value: edit?.resignation_date
        ? moment(edit?.resignation_date).format("YYYY-MM-DD | h:mm:ss a")
        : "",
    },
    {
      id: 10,
      title: "resignation status",
      value: +edit?.resignation_status === "0" ? "InActive" : "Active",
    },
    { id: 11, title: "term", value: edit?.term },
    { id: 12, title: "user name", value: edit?.user_name },
  ];

  useEffect(() => {
    fetchAllUsersData();
    fetchAllRequestsData();
    if (getValue && getValue.textContent === "Approval") {
      fetchAllApprovedData();
    }
    if (getValue && getValue.textContent === "Rejected") {
      fetchAllRejectedData();
    }
    if (getValue && getValue.textContent === "FNF Statement") {
      fetchAllFnfData();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Employee Resignation · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"Employee Resignation"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setResignationData(true);
          }}
          tag={"Create"}
        >
          <Tabs
            onClick={(e) => handleClick(e)}
            activeTab="1"
            ulClassName="border-primary py-2 border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <Card.Body className="overflow-auto px-4 mt-3">
                  {tab.page}
                </Card.Body>
              </Tab>
            ))}
          </Tabs>
        </CardComponent>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          user_id: edit.user_id
            ? { label: edit.user_name, value: edit.user_id }
            : "",
          resignation_date: edit?.resignation_date || "",
          last_working_day: edit?.last_working_day || "",
          reason: edit?.reason || "",
        }}
        validationSchema={addEmployeeResignationSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={resignationData}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Save"}
            close={() => setResignationData(false)}
            title={
              edit.id
                ? "Update Employee Resignation"
                : "Create Employee Resignation"
            }
          >
            <Row className="g-2">
              <Col md={12}>
                <Form.Label>
                  Select User <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  menuPosition="fixed"
                  className="text-primary w-100"
                  name="user_id"
                  options={allUserData?.map((user) => ({
                    label: user.name,
                    value: user.id,
                  }))}
                  value={props.values.user_id}
                  onChange={(selectedOption) =>
                    props.setFieldValue("user_id", selectedOption)
                  }
                />
                <ErrorMessage
                  name="user_id"
                  component="small"
                  className="text-danger"
                />
              </Col>
              <Col md={6}>
                <Form.Label>
                  Resignation Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="resignation_date"
                  onChange={props.handleChange}
                  value={props.values.resignation_date}
                  type="date"
                />
                <ErrorMessage
                  name="resignation_date"
                  component="small"
                  className="text-danger"
                />
              </Col>
              <Col md={6}>
                <Form.Label>
                  Last Working Day <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="last_working_day"
                  onChange={props.handleChange}
                  value={props.values.last_working_day}
                  type="date"
                />
                <ErrorMessage
                  name="last_working_day"
                  component="small"
                  className="text-danger"
                />
              </Col>
              <Col md={12}>
                <Form.Label>
                  Resignation Reason <span className="text-danger">*</span>
                </Form.Label>
                <TextareaAutosize
                  name="reason"
                  onChange={props.handleChange}
                  value={props.values.reason}
                  minRows={2}
                  className="edit-textarea"
                />
                <ErrorMessage
                  name="reason"
                  component="small"
                  className="text-danger"
                />
              </Col>
            </Row>
          </Modaljs>
        )}
      </Formik>

      <Modaljs
        open={singlePlans}
        size={"md"}
        closebtn={"Cancel"}
        Savebtn={"Ok"}
        close={() => setSinglePlans(false)}
        title={"View Resignation Data"}
      >
        <Row className="g-2 align-items-center">
          {singleoutletsList.map((details, id1) => (
            <Fragment key={id1}>
              {details?.value || details?.src ? (
                <>
                  <Col md={4}>{details.title}</Col>
                  <Col md={8}>
                    <Form.Control
                      type={details.id === 5 ? "image" : "text"}
                      className="fw-bolder"
                      style={{ width: details.id === 5 ? "50px" : null }}
                      src={details.src}
                      value={details.value}
                      disabled
                    />
                  </Col>
                </>
              ) : null}
            </Fragment>
          ))}
        </Row>
      </Modaljs>
    </>
  );
};

export default EmployeeResignation;
