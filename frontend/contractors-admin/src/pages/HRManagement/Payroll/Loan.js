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
import { Formik } from "formik";
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
  getAllModuleByRoleId,
} from "../../../services/authapi";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { Fragment } from "react";
import ImageViewer from "../../../components/ImageViewer";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";

const Loan = () => {
  const [resignationData, setResignationData] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const [edit, setEdit] = useState({});
  const [allPendingData, setAllPendingData] = useState([]);
  const [allActiveData, setAllActiveData] = useState([]);
  const [allRejectedData, setAllRejectedData] = useState([]);
  const [allClosedLoansData, setAllClosedLoansData] = useState([]);
  const [getValue, setGetValue] = useState({});
  const [singlePlans, setSinglePlans] = useState(false);
  const { t } = useTranslation();

  const { user } = useSelector(selectUser);

  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: false,
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);

  const tabs = [
    { title: t("Pending"), className: "ms-auto", page: <PendingLoans /> },
    { title: t("Active"), page: <ActiveLoans /> },
    { title: t("Rejected"), page: <RejectedLoans /> },
    { title: t("Closed Loans"), page: <ClosedLoans /> },
  ];

  const fetchPermissions = async () => {
    try {
      const userID = user.user_type; // Assuming `user_type` is the user's role identifier
      const res = await getAllModuleByRoleId(userID);
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "HR Management");
        if (hrModule && hrModule.submodules) {
          const employeesSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "Payroll"
          );
          if (employeesSubmodule && employeesSubmodule.modulesOfSubModule.length > 0) {
            const employeeModuleOfSubModule = employeesSubmodule.modulesOfSubModule.find(
              (moduleOfSubModule) => moduleOfSubModule.title === "Loan"
            )
            if (employeeModuleOfSubModule) {
              setPermissions({
                create: Boolean(employeeModuleOfSubModule.create),
                update: Boolean(employeeModuleOfSubModule.update),
                delete: Boolean(employeeModuleOfSubModule.delete),
                view: true, // Ensure view is set explicitly to true
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setIsPermissionsLoading(false);
    }
  };



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
            <th>{t("Sr No.")}</th>
            <th>{t("Name")}</th>
            <th>{t("Loan Type")}</th>
            <th>{t("Loan Amount")}</th>
            <th>{t("Loan Term")}</th>
            <th>{t("Action")}</th>
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
                {/* <span className="d-align gap-2">
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
                </span> */}
                {/* <span className="d-align gap-2">
                  {permissions.update && (
                    <TooltipComponent title={"Edit"}>
                      <span
                        onClick={() => handleEdit(req)}
                        className="social-btn-re d-align gap-2 px-3 w-auto danger-combo"
                      >
                        <BsPencilSquare />
                      </span>
                    </TooltipComponent>
                  )}
                  {permissions.update && <div className="vr hr-shadow"></div>}

                  {permissions.view && (
                    <TooltipComponent title={"View"}>
                      <span
                        onClick={() => handleView(req)}
                        className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                      >
                        <BsEyeFill />
                      </span>
                    </TooltipComponent>
                  )}
                  {permissions.view && <div className="vr hr-shadow"></div>}

                  {permissions.delete && (
                    <>
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
                    </>
                  )}
                </span> */}
                <span className="d-align gap-2">
                  {permissions.update && (
                    <>
                      <TooltipComponent title={"Edit"}>
                        <span
                          onClick={() => handleEdit(req)}
                          className="social-btn-re d-align gap-2 px-3 w-auto danger-combo"
                        >
                          <BsPencilSquare />
                        </span>
                      </TooltipComponent>
                      <div className="vr hr-shadow"></div>
                    </>
                  )}

                  {permissions.view && (
                    <>
                      <TooltipComponent title={"View"}>
                        <span
                          onClick={() => handleView(req)}
                          className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                        >
                          <BsEyeFill />
                        </span>
                      </TooltipComponent>
                      <div className="vr hr-shadow"></div>
                    </>
                  )}

                  {permissions.delete && (
                    <>
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
                    </>
                  )}
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
            <th>{t("Sr No.")}</th>
            <th>{t("Name")}</th>
            <th>{t("Loan Type")}</th>
            <th>{t("Loan Amount")}</th>
            <th>{t("Loan Term")}</th>
            <th>{t("Active Date")}</th>
            <th>{t("Approved By")}</th>
            <th>{t("Action")}</th>
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
                  {/* <TooltipComponent title={"Close Loan"}>
                    <FaBan
                    onClick={() => handleClosed(app.id)}
                    className="social-btn red-combo"
                    />
                    </TooltipComponent> */}
                  {permissions.delete && (
                    <>
                      <div className={`vr hr-shadow`}></div>
                      <TooltipComponent title={"Close Loan"}>
                        <FaBan
                          onClick={() => handleClosed(app.id)}
                          className="social-btn red-combo"
                        />
                      </TooltipComponent>
                    </>
                  )}

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
            <th>{t("Sr No.")}</th>
            <th>{t("Name")}</th>
            <th>{t("Loan Type")}</th>
            <th>{t("Loan Amount")}</th>
            <th>{t("Loan Term")}</th>
            <th>{t("Rejected Date")}</th>
            <th>{t("Rejected By")}</th>
            <th>{t("Action")}</th>
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
            <th>{t("Sr No.")}</th>
            <th>{t("Name")}</th>
            <th>{t("Loan Type")}</th>
            <th>{t("Loan Amount")}</th>
            <th>{t("Loan Term")}</th>
            <th>{t("Closed Date")}</th>
            <th>{t("Closed By")}</th>
            <th>{t("Action")}</th>
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
      loan_type: values.loan_type.value,
      loan_term: values.loan_term,
      remarks: values.remarks,
      loan_date: values.loan_date,
      emi_start_from: values.emi_start_from,
      interest_rate: values.interest_rate,
      interest_mode: values.interest_mode.value,
      no_of_payments: values.no_of_payments,
      emi: values.loan_amount / values.no_of_payments,
      payment_date: values.payment_date,
      payment_mode: values.payment_mode.value,
      cheque_number: values.cheque_number,
      cheque_date: values.cheque_date,
      bank: values.bank,
      branch: values.branch,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log('sData', sData)
    const res = edit.id
      ? await getUpdateLoans(sData)
      : await getCreateLoans(sData);
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
    { id: 1, title: t("Name"), value: edit?.name },
    { id: 2, title: t("Interest Rate"), value: edit?.interest_rate },
    { id: 3, title: t("loan amount"), value: edit?.loan_amount },
    { id: 4, title: t("loan id"), value: edit?.loan_id },
    { id: 8, title: t("loan term"), value: edit?.loan_term },
    { id: 9, title: t("loan type"), value: edit?.loan_type },
    { id: 10, title: "payment type", value: edit?.payment_type },
    { id: 11, title: t("remarks"), value: edit?.remarks },
    { id: 12, title: "repayment amount", value: edit?.repayment_amount },
    { id: 13, title: "repayment date", value: edit?.repayment_date },
    { id: 14, title: t("status"), value: edit?.status },
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
    fetchPermissions()
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
          title={t("All Loans")}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setResignationData(true);
          }}
          tag={permissions.create ? "Create" : undefined}
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
          interest_mode: edit.interest_mode
            ? {
              label:
                edit.interest_mode == "1"
                  ? "fixed"
                  : edit.interest_mode == "2"
                    ? "simple interest"
                    : edit.interest_mode == "3"
                      ? "accrued interest"
                      : edit.interest_mode == "4"
                        ? "compounding interest"
                        : "--Select--",
              value: edit.interest_mode,
            }
            : "",
          payment_mode: edit.payment_mode
            ? {
              label:
                edit.payment_mode == "1"
                  ? "Online"
                  : edit.payment_mode == "2"
                    ? "Cheque"
                    : edit.payment_mode == "3"
                      ? "credit/debit"
                      : "--Select--",
              value: edit.payment_mode,
            }
            : "",
          loan_amount: edit?.loan_amount || "",
          loan_type: edit?.loan_type
            ? {
              label:
                edit.loan_type == "1"
                  ? "Home Loan"
                  : edit.loan_type == "2"
                    ? "Education Loan"
                    : edit.loan_type == "3"
                      ? "Vehicle Loan"
                      : edit.loan_type == "4"
                        ? "Gold Loan"
                        : "--Select--",
              value: edit.loan_type,
            }
            : "",
          loan_term: edit?.loan_term || "",
          remarks: edit?.remarks || "",
          loan_date: edit?.loan_date || "",
          emi_start_from: edit?.emi_start_from || "",
          no_of_payments: edit?.no_of_payments || "",
          emi: edit?.emi || "",
          interest_rate: edit?.interest_rate || "",
          payment_date: edit?.payment_date || "",
          cheque_number: edit?.cheque_number || "",
          cheque_date: edit?.cheque_date || "",
          bank: edit?.bank || "",
          branch: edit?.branch || "",
        }}
        // validationSchema={addRolesSchema}
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
            title={edit.id ? t("Update loan") : t("Create loan")}
          >
            {console.log(edit, "edoitttt")}
            <Row className="g-2">
              <Col md={12} className="mb-2 mt-3 shadow border-3 p-2 fw-bold ">
                {t("Loans Details")}
              </Col>
              <Col md={6}>
                <Form.Label>{t("Select User")}</Form.Label>
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
              </Col>
              <Col md={6}>
                <Form.Label>{t("loan amount")}</Form.Label>
                <Form.Control
                  name="loan_amount"
                  placeholder={t("loan amount")}
                  onChange={props.handleChange}
                  value={props.values.loan_amount}
                  type="number"
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("loan type")}</Form.Label>
                <Select
                  menuPosition="fixed"
                  className="text-primary w-100"
                  name="loan_type"
                  options={[
                    { value: "1", label: "Home Loan" },
                    {
                      value: "2",
                      label: "Education Loan",
                    },
                    {
                      value: "3",
                      label: "Vehicle Loan",
                    },
                    {
                      value: "4",
                      label: "Gold Loan",
                    },
                  ]}
                  value={props.values.loan_type}
                  onChange={(selectedOption) =>
                    props.setFieldValue("loan_type", selectedOption)
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label>
                  {t("loan term")}{" "}
                  <small className="text-danger">({t("in years")})</small>
                </Form.Label>
                <Form.Control
                  name="loan_term"
                  placeholder={t("loan term")}
                  onChange={props.handleChange}
                  value={props.values.loan_term}
                  type="text"
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("loan date")}</Form.Label>
                <Form.Control
                  name="loan_date"
                  placeholder={t("loan date")}
                  onChange={props.handleChange}
                  value={props.values.loan_date}
                  type="date"
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("emi start from")}</Form.Label>
                <Form.Control
                  name="emi_start_from"
                  placeholder={t("emi start from")}
                  onChange={props.handleChange}
                  value={props.values.emi_start_from}
                  type="date"
                  required
                />
              </Col>

              <Col md={6}>
                <Form.Label>{t("No. of Payments")}</Form.Label>
                <Form.Control
                  name="no_of_payments"
                  placeholder={t("No. of Payments")}
                  onChange={props.handleChange}
                  value={props.values.no_of_payments}
                  type="number"
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("Emi")}</Form.Label>
                <Form.Control
                  name="emi"
                  // disabled={props.values?.no_of_payments}
                  placeholder={t("Emi")}
                  onChange={props.handleChange}
                  value={
                    props.values?.loan_amount && props.values?.no_of_payments
                      ? (
                        props.values?.loan_amount /
                        props.values?.no_of_payments
                      ).toFixed(2)
                      : ""
                  }
                  type="text"
                  required
                />
              </Col>

              <Col md={6}>
                <Form.Label>{t("Interest Mode")}</Form.Label>
                <Select
                  menuPosition="fixed"
                  className="text-primary w-100"
                  name="interest_mode"
                  options={[
                    { value: "1", label: "fixed" },
                    { value: "2", label: "simple interest" },
                    {
                      value: "3",
                      label: "accrued interest",
                    },
                    {
                      value: "4",
                      label: "compounding interest",
                    },
                  ]}
                  value={props.values.interest_mode}
                  onChange={(selectedOption) =>
                    props.setFieldValue("interest_mode", selectedOption)
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("Interest Rate")}</Form.Label>
                <Form.Control
                  name="interest_rate"
                  placeholder={t("Interest Rate")}
                  disabled={props.values.interest_mode?.label === "fixed"}
                  onChange={props.handleChange}
                  value={props.values.interest_rate}
                  type="number"
                  required
                />
              </Col>
              <Col md={12} className="mt-3 mb-2 shadow border-3 p-2 fw-bold ">
                {t("Payment Details")}
              </Col>
              <Col md={6}>
                <Form.Label>{t("Payment Date")}</Form.Label>
                <Form.Control
                  name="payment_date"
                  onChange={props.handleChange}
                  value={props.values.payment_date}
                  type="date"
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("Payment Mode")}</Form.Label>
                <Select
                  menuPosition="fixed"
                  className="text-primary w-100"
                  name="payment_mode"
                  options={[
                    { value: "1", label: "Online" },
                    {
                      value: "2",
                      label: "Cheque",
                    },
                    {
                      value: "3",
                      label: "credit/debit",
                    },
                  ]}
                  value={props.values.payment_mode}
                  onChange={(selectedOption) =>
                    props.setFieldValue("payment_mode", selectedOption)
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("Cheque Number")}</Form.Label>
                <Form.Control
                  name="cheque_number"
                  placeholder={t("Cheque Number")}
                  disabled={
                    props.values.payment_mode?.value == "1" ||
                    props.values.payment_mode?.value == "3"
                  }
                  onChange={props.handleChange}
                  value={props.values.cheque_number}
                  type="text"
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("Cheque Date")}</Form.Label>
                <Form.Control
                  name="cheque_date"
                  placeholder={t("Cheque Date")}
                  disabled={
                    props.values.payment_mode?.label == "Online" ||
                    props.values.payment_mode?.label == "credit/debit"
                  }
                  onChange={props.handleChange}
                  value={props.values.cheque_date}
                  type="date"
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("Bank")}</Form.Label>
                <Form.Control
                  name="bank"
                  placeholder={t("Bank")}
                  onChange={props.handleChange}
                  value={props.values.bank}
                  type="text"
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>{t("branch")}</Form.Label>
                <Form.Control
                  name="branch"
                  placeholder={t("branch")}
                  onChange={props.handleChange}
                  value={props.values.branch}
                  type="text"
                  required
                />
              </Col>
              <Col md={12}>
                <Form.Label>{t("remarks")}</Form.Label>
                <TextareaAutosize
                  name="remarks"
                  placeholder={t("remarks")}
                  onChange={props.handleChange}
                  value={props.values.remarks}
                  minRows={2}
                  className="edit-textarea"
                  required
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
        Savebtn={"Save"}
        close={() => setSinglePlans(false)}
        title={t("View Loan Data")}
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
              <Col md={4}>{t("User image")}</Col>
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
              <Col md={4}>{t("loan status changed image")}</Col>
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
