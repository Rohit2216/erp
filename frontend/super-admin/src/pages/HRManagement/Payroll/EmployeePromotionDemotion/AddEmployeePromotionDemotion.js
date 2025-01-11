import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../../components/CardComponent";
import { Helmet } from "react-helmet";
import Select from "react-select";
import ReactDropzone from "../../../../components/ReactDropzone";
import { ErrorMessage, Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CreateEmployeePromotionDemotion,
  UpdateEmployeePromotionDemotion,
  getAdminAllHRTeams,
  getAllRolesForDropDown,
  getAllUsers,
  getSingleDetailsEmployeePromotionDemotion,
} from "../../../../services/authapi";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import { checkPermission } from "../../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../../utils/constants";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/auth/authSlice";
import { addEmployeePromotionDemotionSchema } from "../../../../utils/formSchema";

const AddEmployeePromotionDemotion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [edit, setEdit] = useState({});
  const [allUserData, setAllUserData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allHrTeams, setAllHrTeams] = useState([]);

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchRolesData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      setRoles(res.data);
    } else {
      setRoles([]);
    }
  };

  const fetchAllHrTeamsData = async () => {
    const res = await getAdminAllHRTeams();
    if (res.status) {
      setAllHrTeams(res.data);
    } else {
      setAllHrTeams([]);
    }
  };

  const fetchSingleData = async () => {
    const res = await getSingleDetailsEmployeePromotionDemotion(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("document", e.target.files[0]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const formData = new FormData();
    formData.append("user_id", values.user_id.value);
    formData.append("purpose", values.purpose.value);
    formData.append("reason", values.reason);
    formData.append("new_designation", values.new_designation.value);
    formData.append("new_team", values.new_team.value);
    formData.append("change_in_salary", values.change_in_salary.value);
    formData.append(
      "change_in_salary_type",
      values.change_in_salary_type.value
    );
    formData.append("change_in_salary_value", values.change_in_salary_value);
    formData.append("document", values.document);
    if (edit?.id) {
      formData.append("id", edit?.id);
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    // return console.log('sData', ...formData)
    const res = edit?.id
      ? await UpdateEmployeePromotionDemotion(formData, params)
      : await CreateEmployeePromotionDemotion(formData, params);
    if (res.status) {
      toast.success(res.message);
      navigate("/EmployeePromotionDemotion");
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    const textarea = document.querySelector('[name="reason"]');
    textarea.value = "";
  };

  useEffect(() => {
    fetchAllUsersData();
    fetchRolesData();
    fetchAllHrTeamsData();
    if (id) {
      fetchSingleData();
    }
  }, []);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Employee Promotion/Demotion · CMS Electricals</title>
      </Helmet>
      <CardComponent title={"Employee Promotion / Demotion"}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            user_id: edit.user_id
              ? { label: edit.user_name, value: edit.user_id }
              : "",
            purpose: edit.purpose
              ? { label: edit.purpose, value: edit.purpose }
              : "",
            new_team: edit.new_team
              ? { label: edit.team_name, value: edit.new_team }
              : "",
            change_in_salary_type: edit.change_in_salary_type
              ? {
                  label: edit.change_in_salary_type,
                  value: edit.change_in_salary_type,
                }
              : "",
            change_in_salary: edit.change_in_salary
              ? { label: edit.change_in_salary, value: edit.change_in_salary }
              : "",
            new_designation: edit.new_designation
              ? { label: edit.role_name, value: edit.new_designation }
              : "",
            reason: edit.reason || "",
            change_in_salary_value: edit.change_in_salary_value || "",
            document: edit.document || null,
          }}
          validationSchema={addEmployeePromotionDemotionSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-4">
                <Col md={12}>
                  <Row className="g-4">
                    <Form.Group as={Col} md={6}>
                      <Form.Label>
                        Employee Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        className="text-primary w-100"
                        menuPortalTarget={document.body}
                        name="user_id"
                        options={allUserData?.map((user) => ({
                          label: user.name,
                          value: user.id,
                        }))}
                        value={props.values.user_id}
                        onChange={(val) => props.setFieldValue("user_id", val)}
                      />
                      <ErrorMessage
                        name="user_id"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={6}>
                      <Form.Label>
                        PURPOSE <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        name="purpose"
                        value={props.values.purpose}
                        onChange={(val) => props.setFieldValue("purpose", val)}
                        className="text-primary"
                        options={[
                          { value: "promotion", label: "Promotion" },
                          { value: "demotion", label: "Demotion" },
                        ]}
                      />
                      <ErrorMessage
                        name="purpose"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={12}>
                      <Form.Label>
                        REASON <span className="text-danger">*</span>
                      </Form.Label>
                      <div>
                        <div className="form-shadow position-relative">
                          <TextareaAutosize
                            className="shadow-none edit-textarea resize-none"
                            onChange={props.handleChange}
                            name="reason"
                            value={props.values.reason}
                            minRows={2}
                          />
                          <i className="Position-absolute small p-2 bottom-0 d-flex justify-content-end">
                            Powered by:{" "}
                            <span className="text-secondary">
                              Cms Electricals
                            </span>
                          </i>
                        </div>
                        <div
                          onClick={(e) => handleButtonClick(e)}
                          className="social-btn purple-combo d-align ms-auto px-5"
                        >
                          Clear
                        </div>
                      </div>
                      <ErrorMessage
                        name="reason"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={6}>
                      <Form.Label>
                        New Designation <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        className="text-primary w-100"
                        menuPortalTarget={document.body}
                        name="new_designation"
                        options={roles?.map((role) => ({
                          label: role.name,
                          value: role.id,
                        }))}
                        value={props.values.new_designation}
                        onChange={(val) =>
                          props.setFieldValue("new_designation", val)
                        }
                      />
                      <ErrorMessage
                        name="new_designation"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={6}>
                      <Form.Label>
                        <>
                          New Team <small>(Optional)</small>
                        </>
                      </Form.Label>
                      <Select
                        className="text-primary w-100"
                        menuPortalTarget={document.body}
                        name="new_team"
                        options={allHrTeams?.map((team) => ({
                          label: team.team_name,
                          value: team.team_id,
                        }))}
                        value={props.values.new_team}
                        onChange={(val) => props.setFieldValue("new_team", val)}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        Changes in Salary (Basic){" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        name="change_in_salary"
                        value={props.values.change_in_salary}
                        onChange={(val) =>
                          props.setFieldValue("change_in_salary", val)
                        }
                        className="text-primary"
                        options={[
                          { value: "hike", label: "hike" },
                          { value: "deduction", label: "deduction" },
                        ]}
                      />
                      <ErrorMessage
                        name="change_in_salary"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    {props.values.change_in_salary.value === "hike" ||
                    props.values.change_in_salary.value === "deduction" ? (
                      <>
                        <Form.Group as={Col} md={4}>
                          <Form.Label>
                            PERCENTAGE/AMOUNT{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            name="change_in_salary_type"
                            value={props.values.change_in_salary_type}
                            onChange={(val) =>
                              props.setFieldValue("change_in_salary_type", val)
                            }
                            className="text-primary"
                            options={[
                              { value: "Percentage", label: "Percentage" },
                              { value: "Amount", label: "Amount" },
                            ]}
                          />
                          <ErrorMessage
                            name="change_in_salary_type"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={4}>
                          <Form.Label>
                            Value <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            name="change_in_salary_value"
                            onChange={props.handleChange}
                            value={props.values.change_in_salary_value}
                            type={"text"}
                          />
                          <ErrorMessage
                            name="change_in_salary_value"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>
                      </>
                    ) : null}
                  </Row>
                </Col>
                <div className="hr-border2" />

                {id ? (
                  <>
                    <Form.Group as={Col} md={2}>
                      <img
                        width={50}
                        className="my-bg p-1 rounded"
                        src={`${process.env.REACT_APP_API_URL}/${edit?.document}`}
                        alt={edit?.name}
                      />{" "}
                    </Form.Group>
                    <Form.Group as={Col} md={10}>
                      <ReactDropzone
                        title={"Relevant Documents / Upload"}
                        name={"document"}
                        onChange={(e) =>
                          handleFileChange(e, props.setFieldValue)
                        }
                      />
                    </Form.Group>
                  </>
                ) : (
                  <Form.Group as={Col} md={12}>
                    <ReactDropzone
                      title={"Relevant Documents / Upload"}
                      name={"document"}
                      onChange={(e) => handleFileChange(e, props.setFieldValue)}
                    />
                  </Form.Group>
                )}

                <Form.Group as={Col} md={12}>
                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      disabled={props?.isSubmitting}
                      className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                    >
                      {props?.isSubmitting ? (
                        <>
                          <Spinner
                            animation="border"
                            variant="primary"
                            size="sm"
                          />{" "}
                          PLEASE WAIT...
                        </>
                      ) : (
                        <>{edit.id ? "UPDATE" : "SAVE"}</>
                      )}
                    </button>
                  </div>
                </Form.Group>
              </Row>
            </Form>
          )}
        </Formik>
      </CardComponent>
    </Col>
  );
};

export default AddEmployeePromotionDemotion;
