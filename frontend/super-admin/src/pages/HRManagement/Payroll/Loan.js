import React, { useEffect, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col, Form, Table, Row, Card } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  BsCheckLg,
  BsEyeFill,
  BsXLg,
  BsPlus,
  BsPencilSquare,
} from "react-icons/bs";
import { FaBan } from "react-icons/fa";
import TooltipComponent from "../../../components/TooltipComponent";
import TextareaAutosize from "react-textarea-autosize";
import CardComponent from "../../../components/CardComponent";
import { ErrorMessage, Formik } from "formik";
import Select from "react-select";
import Modaljs from "../../../components/Modal";
import {
  getCreateLoans,
  getUpdateLoans,
  ChangedLoanStatus,
  getAllClosedLoans,
  getAllActiveLoans,
  getAllLoans,
  getAllRejectedLoans,
  getAllUsers,
} from "../../../services/authapi";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { Fragment } from "react";
import ImageViewer from "../../../components/ImageViewer";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../utils/constants";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { addLoanSchema } from "../../../utils/formSchema";

const Loan = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [resignationData, setResignationData] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const [edit, setEdit] = useState({});
  const [allPendingData, setAllPendingData] = useState([]);
  const [allActiveData, setAllActiveData] = useState([]);
  const [allRejectedData, setAllRejectedData] = useState([]);
  const [allClosedLoansData, setAllClosedLoansData] = useState([]);
  const [getValue, setGetValue] = useState({});
  const [singlePlans, setSinglePlans] = useState(false);

  const tabs = [
    { title: "Pending", className: "ms-auto", page: <PendingLoans /> },
    { title: "Active", page: <ActiveLoans /> },
    { title: "Rejected", page: <RejectedLoans /> },
    { title: "Closed Loans", page: <ClosedLoans /> },
  ];

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const handleEdit = async (req) => {
    setEdit(req);
    setResignationData(true);
  };

  const fetchAllPendingData = async () => {
    const res = await getAllLoans();
    if (res.status) {
      setAllPendingData(res.data);
    } else {
      setAllPendingData([]);
    }
  };
  const fetchAllActiveData = async () => {
    const res = await getAllActiveLoans();
    if (res.status) {
      setAllActiveData(res.data);
    } else {
      setAllActiveData([]);
    }
  };
  const fetchAllRejectedData = async () => {
    const res = await getAllRejectedLoans();
    if (res.status) {
      setAllRejectedData(res.data);
    } else {
      setAllRejectedData([]);
    }
  };
  const fetchAllClosedLoansData = async () => {
    const res = await getAllClosedLoans();
    if (res.status) {
      setAllClosedLoansData(res.data);
    } else {
      setAllClosedLoansData([]);
    }
  };

  // Approved/Rejected Resignation Requests
  const handleActive = async (id) => {
    const sData = {
      id: id,
      status: "active",
    };
    const res = await ChangedLoanStatus(sData);
    if (res.status) {
      toast.success(res.message);
      setAllPendingData((prev) => prev.filter((itm) => itm.id !== +id));
    } else {
      toast.error(res.message);
    }
  };
  const handleRejected = async (id) => {
    const sData = {
      id: id,
      status: "reject",
    };
    const res = await ChangedLoanStatus(sData);
    if (res.status) {
      toast.success(res.message);
      setAllPendingData((prev) => prev.filter((itm) => itm.id !== +id));
    } else {
      toast.error(res.message);
    }
  };
  const handleClosed = async (id) => {
    const sData = {
      id: id,
      status: "closed",
    };
    const res = await ChangedLoanStatus(sData);
    if (res.status) {
      toast.success(res.message);
      setAllPendingData((prev) => prev.filter((itm) => itm.id !== +id));
      fetchAllActiveData();
    } else {
      toast.error(res.message);
    }
  };

  // All Pages
  function PendingLoans() {
    return (
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "Name",
              "loan type",
              "Loan Amount",
              "loan term",
              "Action",
            ].map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allPendingData?.length > 0 ? null : (
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
          {allPendingData?.map((req, id1) => (
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
                  {req?.name}
                </div>
              </td>
              <td>{req?.loan_type}</td>
              <td>₹ {req?.loan_amount}</td>
              <td>{req?.loan_term}</td>
              <td>
                <span className="d-align gap-2">
                  <TooltipComponent title={"Edit"}>
                    <span
                      onClick={() => handleEdit(req)}
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
                      onClick={() => handleActive(req.id)}
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
  function ActiveLoans() {
    return (
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "Name",
              "loan type",
              "Loan Amount",
              "loan term",
              "Active Date",
              "Approved By",
              "Action",
            ].map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allActiveData?.length > 0 ? null : (
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
          {allActiveData?.map((app, id2) => (
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
                  {app?.name}
                </div>
              </td>
              <td>{app?.loan_type}</td>
              <td>₹ {app?.loan_amount}</td>
              <td>{app?.loan_term}</td>
              <td>
                {moment(app?.loan_status_changed_date).format(
                  "YYYY-MM-DD | h:mm"
                )}
              </td>
              <td>{app?.loan_status_changed_by}</td>
              <td>
                <span className={`d-align gap-2`}>
                  <TooltipComponent title={"View"}>
                    <BsEyeFill
                      onClick={() => handleView(app)}
                      className="social-btn success-combo"
                    />
                  </TooltipComponent>
                  <div className={`vr hr-shadow`}></div>
                  <TooltipComponent title={"Close Loan"}>
                    <FaBan
                      onClick={() => handleClosed(app.id)}
                      className="social-btn red-combo"
                    />
                  </TooltipComponent>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  function RejectedLoans() {
    return (
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "Name",
              "loan type",
              "Loan Amount",
              "loan term",
              "Rejected Date",
              "Rejected By",
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
                  {rejected?.name}
                </div>
              </td>
              <td>{rejected?.loan_type}</td>
              <td>₹ {rejected?.loan_amount}</td>
              <td>{rejected?.loan_term}</td>
              <td>
                {moment(rejected?.loan_status_changed_date).format(
                  "YYYY-MM-DD | h:mm"
                )}
              </td>
              <td>{rejected?.loan_status_changed_by}</td>
              <td>
                <TooltipComponent title={"View"}>
                  <BsEyeFill
                    onClick={() => handleView(rejected)}
                    className="social-btn success-combo"
                  />
                </TooltipComponent>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  function ClosedLoans() {
    return (
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "Name",
              "loan type",
              "Loan Amount",
              "loan term",
              "Closed Date",
              "Closed By",
              "Action",
            ].map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allClosedLoansData?.length > 0 ? null : (
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
          {allClosedLoansData?.map((data, idx) => (
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
                  {data?.name}
                </div>
              </td>
              <td>{data?.loan_type}</td>
              <td>₹ {data?.loan_amount}</td>
              <td>{data?.loan_term}</td>
              <td>
                {moment(data?.loan_status_changed_date).format(
                  "YYYY-MM-DD | h:mm"
                )}
              </td>
              <td>{data?.loan_status_changed_by}</td>
              <td>
                <TooltipComponent title={"View"}>
                  <BsEyeFill
                    onClick={() => handleView(data)}
                    className="social-btn success-combo"
                  />
                </TooltipComponent>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  // **Pages-End** //

  function handleClick(e) {
    setGetValue(e.target);
    if (e.target.textContent === "Active") {
      fetchAllActiveData();
    }
    if (e.target.textContent === "Rejected") {
      fetchAllRejectedData();
    }
    if (e.target.textContent === "Closed Loans") {
      fetchAllClosedLoansData();
    }
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const sData = {
      user_id: values.user_id.value,
      loan_amount: values.loan_amount,
      loan_type: values.loan_type,
      loan_term: values.loan_term,
      remarks: values.remarks,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;
    // return console.log('sData', sData)
    const res = edit.id
      ? await getUpdateLoans(sData, params)
      : await getCreateLoans(sData, params);
    if (res.status) {
      fetchAllPendingData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setResignationData(false);
  };

  const handleView = async (data) => {
    setEdit(data);
    setSinglePlans(true);
  };

  const singleoutletsList = [
    { id: 1, title: "Name", value: edit?.name },
    { id: 2, title: "interest rate", value: edit?.interest_rate },
    { id: 3, title: "loan amount", value: edit?.loan_amount },
    { id: 4, title: "loan id", value: edit?.loan_id },
    { id: 8, title: "loan term", value: edit?.loan_term },
    { id: 9, title: "loan type", value: edit?.loan_type },
    { id: 10, title: "payment type", value: edit?.payment_type },
    { id: 11, title: "remarks", value: edit?.remarks },
    { id: 12, title: "repayment amount", value: edit?.repayment_amount },
    { id: 13, title: "repayment date", value: edit?.repayment_date },
    { id: 14, title: "status", value: edit?.status },
    // { id: 15, title: 'image', src: edit?.image ? `${process.env.REACT_APP_API_URL}${edit?.image}` : null },
    {
      id: 5,
      title: "loan status changed by",
      value: edit?.loan_status_changed_by,
    },
    // { id: 7, title: 'loan status changed image', src: edit?.loan_status_changed_image ? `${process.env.REACT_APP_API_URL}${edit?.loan_status_changed_image}` : null },
    {
      id: 6,
      title: "loan status changed date",
      value: edit?.loan_status_changed_date
        ? moment(edit?.loan_status_changed_date).format(
            "YYYY-MM-DD | h:mm:ss a"
          )
        : "",
    },
  ];

  useEffect(() => {
    fetchAllUsersData();
    fetchAllPendingData();
    if (getValue && getValue.textContent === "Active") {
      fetchAllActiveData();
    }
    if (getValue && getValue.textContent === "Rejected") {
      fetchAllRejectedData();
    }
    if (getValue && getValue.textContent === "Closed Loans") {
      fetchAllClosedLoansData();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>All Loans · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Loans"}
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
            ulClassName="border-primary me-1 py-2 border-bottom"
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
            ? { label: edit.name, value: edit.user_id }
            : "",
          loan_amount: edit?.loan_amount || "",
          loan_type: edit?.loan_type || "",
          loan_term: edit?.loan_term || "",
          remarks: edit?.remarks || "",
        }}
        validationSchema={addLoanSchema}
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
            title={edit.id ? "Update loan" : "Create loan"}
          >
            <Row className="g-2">
              <Col md={6}>
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
                  loan amount <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="loan_amount"
                  onChange={props.handleChange}
                  value={props.values.loan_amount}
                  type="number"
                />
                <ErrorMessage
                  name="loan_amount"
                  component="small"
                  className="text-danger"
                />
              </Col>
              <Col md={6}>
                <Form.Label>
                  loan type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="loan_type"
                  onChange={props.handleChange}
                  value={props.values.loan_type}
                  type="text"
                />
                <ErrorMessage
                  name="loan_type"
                  component="small"
                  className="text-danger"
                />
              </Col>
              <Col md={6}>
                <Form.Label>
                  loan term <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="loan_term"
                  onChange={props.handleChange}
                  value={props.values.loan_term}
                  type="text"
                />
                <ErrorMessage
                  name="loan_term"
                  component="small"
                  className="text-danger"
                />
              </Col>
              <Col md={12}>
                <Form.Label>
                  remarks <span className="text-danger">*</span>
                </Form.Label>
                <TextareaAutosize
                  name="remarks"
                  onChange={props.handleChange}
                  value={props.values.remarks}
                  minRows={2}
                  className="edit-textarea"
                />
                <ErrorMessage
                  name="remarks"
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
        title={"View Loan Data"}
      >
        <Row className="g-2 align-items-center">
          {singleoutletsList.map((details, id1) => (
            <Fragment key={id1}>
              {details?.value || details?.src ? (
                <>
                  <Col md={4}>{details.title}</Col>
                  <Col md={8}>
                    <ImageViewer
                      src={`${process.env.REACT_APP_API_URL}${details.src}`}
                    >
                      <Form.Control
                        type={
                          details.id === 15 || details.id === 7
                            ? "image"
                            : "text"
                        }
                        className="fw-bolder"
                        style={{
                          width:
                            details.id === 15 || details.id === 7
                              ? "100px"
                              : null,
                        }}
                        src={details.src}
                        value={details.value}
                        disabled
                      />
                    </ImageViewer>
                  </Col>
                </>
              ) : null}
            </Fragment>
          ))}
          {edit?.image && (
            <>
              <Col md={4}>User image</Col>
              <Col md={8}>
                <ImageViewer
                  src={`${process.env.REACT_APP_API_URL}${edit?.image}`}
                >
                  <img
                    className="shadow bg-primary-light p-1 rounded-circle"
                    width={70}
                    src={`${process.env.REACT_APP_API_URL}${edit?.image}`}
                  />
                </ImageViewer>
              </Col>
            </>
          )}

          {edit?.loan_status_changed_image && (
            <>
              <Col md={4}>loan status changed image</Col>
              <Col md={8}>
                <ImageViewer
                  src={`${process.env.REACT_APP_API_URL}${edit?.loan_status_changed_image}`}
                >
                  <img
                    className="shadow bg-primary-light p-1 rounded-circle"
                    width={70}
                    src={`${process.env.REACT_APP_API_URL}${edit?.loan_status_changed_image}`}
                  />
                </ImageViewer>
              </Col>
            </>
          )}
        </Row>
      </Modaljs>
    </>
  );
};

export default Loan;
