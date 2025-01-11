import React, { useEffect } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import { useState } from "react";
import moment from "moment";
import {
  CreateSalaryDisbursal,
  getAllSalaryDisbursal,
  getAllModuleByRoleId,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BsCheckLg, BsEyeFill } from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import { Formik } from "formik";
import Modaljs from "../../../components/Modal";
import {
  addSalaryDisbursalSchema,
  addSalarySchema,
} from "../../../utils/formSchema";
import ReactPagination from "../../../components/ReactPagination";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";

const SalaryDisbursal = () => {
  const [dateValue, setDateValue] = useState(
    moment(new Date()).format("YYYY-MM")
  );
  const [generatePaySlip, setGeneratePaySlip] = useState(false);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [salaryDisbursal, setSalaryDisbursal] = useState([]);
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);

  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: false,
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
  const datehandler = (e) => {
    const date = e.target.value;
    setDateValue(date);
  };

  const fetchData = async () => {
    const res = await getAllSalaryDisbursal(
      dateValue,
      search,
      pageSize,
      pageNo
    );

    console.log("res", res)
    if (res.status) {
      setSalaryDisbursal(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setSalaryDisbursal([]);
      setPageDetail({});
    }
  };

  const handleDisbursed = async (data) => {
    setEdit(data);
    setGeneratePaySlip(true);
  };

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
              (moduleOfSubModule) => moduleOfSubModule.title === "Salary Disbursal"
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


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      user_id: edit?.user_id,
      gross_salary: edit?.grossSalary,
      amount: values.amount,
      payable_amount: edit?.payable_salary,
      due_amount: edit?.due_amount,
      final_pay_amount: edit?.final_pay_amount,
      transaction_number: values.transaction_number,
      transaction_mode: values.transaction_mode,
      month: `${dateValue}-${moment(new Date()).format("DD")}`,
    };
    // return console.log("sData", sData);
    const res = await CreateSalaryDisbursal(sData);
    if (res.status) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.warn(res.message);
    }
    resetForm();
    setSubmitting(false);
    setGeneratePaySlip(false);
  };

  useEffect(() => {
    fetchData();
    fetchPermissions();
  }, [dateValue, search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Salary Disbursal · CMS Electricals</title>
      </Helmet>
      <CardComponent
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        title={"Salary Disbursal"}
        custom={
          <Form.Control
            className="w-auto"
            value={dateValue}
            onChange={datehandler}
            type="month"
            name={"date"}
          />
        }
      >
        <div className="table-scroll p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Employee Code")}</th>
                <th>{t("Employee Name")}</th>
                <th>{t("Month")}</th>
                <th>{t("Basic Salary")}</th>
                <th>{t("Allowance")}</th>
                <th>{t("Deduction")}</th>
                <th>{t("payble salary")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {salaryDisbursal?.length > 0 ? null : (
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
              {salaryDisbursal?.map((data, idx) => (
                <tr key={data?.user_id}>
                  <td>{serialNumber[idx]}</td>
                  <td>{data?.employee_code}</td>
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
                  <td>{data?.month}</td>
                  <td>₹ {data?.salary}</td>
                  <td>₹ {data?.allowance}</td>
                  <td className="text-danger">₹ -{data?.deduction}</td>
                  <td className="text-green">₹ {data?.payable_salary}</td>
                  <td>
                    <span className="d-align gap-2">
                      <TooltipComponent title={"View"}>
                        <Link
                          to={`/SalaryDisbursal/ViewSalaryDisbursal/${data?.user_id}/${dateValue}`}
                          className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                        >
                          <BsEyeFill />
                        </Link>
                      </TooltipComponent>
                      <div className="vr hr-shadow"></div>
                      {/* <TooltipComponent title={"Disbursed"}>
                        <span
                          style={{ backgroundColor: "secondary" }}
                          onClick={() => handleDisbursed(data)}
                          className={`social-btn-re d-align gap-2 px-3 w-auto ${data?.is_salary_disbursed == 0
                            ? "danger-combo"
                            : "danger-combo-disable pe-none"
                            }`}
                        >
                          <BsCheckLg />
                        </span>
                      </TooltipComponent> */}
                      {permissions.update && (
                        <TooltipComponent title={"Disbursed"}>
                          <span
                            style={{ backgroundColor: "secondary" }}
                            onClick={() => handleDisbursed(data)} // Only called if the button is rendered
                            className={`social-btn-re d-align gap-2 px-3 w-auto ${data?.is_salary_disbursed == 0
                                ? "danger-combo" // Active button if salary is not disbursed
                                : "danger-combo-disable pe-none" // Disabled button if salary is disbursed
                              }`}
                          >
                            <BsCheckLg />
                          </span>
                        </TooltipComponent>
                      )}


                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? salaryDisbursal.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : salaryDisbursal.length < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
            }
            title={`Showing ${pageDetail?.pageStartResult || 0} to ${pageDetail?.pageEndResult || 0
              } of ${pageDetail?.total || 0}`}
            handlePageSizeChange={handlePageSizeChange}
            prevonClick={() => setPageNo(pageNo - 1)}
            nextonClick={() => setPageNo(pageNo + 1)}
          />
        </div>
      </CardComponent>

      <Formik
        enableReinitialize={true}
        initialValues={{
          transaction_number: "",
        }}
        validationSchema={addSalarySchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={generatePaySlip}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setGeneratePaySlip(false)}
            title={t("Generate PaySlip Number")}
          >
            <Row className="g-2">
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Employee Name")}</Form.Label>
                <Form.Control value={edit?.name} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Month")}</Form.Label>
                <Form.Control value={edit?.month} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Gross Salary")}</Form.Label>
                <Form.Control value={edit?.grossSalary} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Payable Salary")}</Form.Label>
                <Form.Control value={edit?.payable_salary} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Due Amount")}</Form.Label>
                <Form.Control value={edit?.due_amount} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Final Pay Amount")}</Form.Label>
                <Form.Control value={edit?.final_pay_amount} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Amount")}</Form.Label>
                <Form.Control
                  type="number"
                  className="fw-bold"
                  name={"amount"}
                  value={props.values.amount}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={
                    Boolean(props.touched.amount && props.errors.amount) ||
                    props.values.amount > edit?.final_pay_amount
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.amount ||
                    " Amount cannot be greater than payable salary."}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Transaction Number")}</Form.Label>
                <Form.Control
                  type="text"
                  className="fw-bold"
                  name={"transaction_number"}
                  value={props.values.transaction_number}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.transaction_number &&
                    props.errors.transaction_number
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.transaction_number}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Transaction Mode")}</Form.Label>
                <Form.Control
                  type="text"
                  className="fw-bold"
                  name={"transaction_mode"}
                  value={props.values.transaction_mode}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.transaction_mode &&
                    props.errors.transaction_mode
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.transaction_mode}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </Col>
  );
};
export default SalaryDisbursal;
