import React from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../CardComponent";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import TextareaAutosize from "react-textarea-autosize";
import { ErrorMessage, FieldArray, Formik } from "formik";
import { addEmployeeSchema } from "../../utils/formSchema";
import { Helmet } from "react-helmet";
import TooltipComponent from "../TooltipComponent";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import {
  addEmplyee,
  getAdminAllHRTeams,
  getAllAreaManagerName,
  getAllHRTeamsAreaManager,
  getAllRolesForDropDown,
  getpreciseLocationById,
  updateEmployee,
  viewSingleEmployee,
} from "../../services/authapi";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react";
import ConfirmAlert from "../ConfirmAlert";
import { useTranslation } from "react-i18next";

const AddEmployee = () => {
  const { id } = useParams();
  const [edit, setEdit] = useState({});
  const [allTeam, setAllTeam] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  function MyCard({ children, className }) {
    return (
      <Card className={`card-bg h-100 ${className}`}>
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }

  const fetchEmployeesData = async () => {
    const res = await viewSingleEmployee(id);
    if (res.status) {
      setEdit(res.data);
      if (res.data.role_id == "7") fetchAllEnduser(40);
      else if (res.data.role_id == "40") fetchAllEnduser(9);
    } else {
      setEdit({});
    }
  };

  const fetchAllPreciseLocations = async () => {
    try {
      const res = await getpreciseLocationById(); // Replace with your API call
      console.log("API Response:", res);

      if (res.data && res.data.length > 0) {
        // Map API response to format expected by Select
        const locations = res.data.map((location) => ({
          value: location.id, // `value` for Select
          label: location.name, // `label` for Select
        }));

        setAllLocations(locations); // Set mapped locations
      } else {
        setAllLocations([]); // Clear the list if no data
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setAllLocations([]);
    }
  };



  const fetchAllEnduser = async (id) => {
    const res = await getAllAreaManagerName(id);
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.name + " " + "(" + itm.employee_id + ")",
        };
      });
      setAllTeam(rData);
    } else {
      setAllTeam([]);
    }
  };

  const fetchAllRolesData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      const rData = res.data
        .filter((itm) => itm.id !== 1)
        .map((itm) => {
          return {
            value: itm.id,
            label: itm.name,
          };
        });
      setAllRoles(rData);
    } else {
      setAllRoles([]);
    }
  };

  const employementOptions = [
    { value: "permanent", label: "Permanent" },
    { value: "part-Time", label: "Part-Time" },
  ];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("mobile", values.mobile);
    formData.append("joining_date", values.joining_date);
    formData.append("dob", values.dob);
    formData.append("status", 1);
    formData.append("role_id", values.role_id.value);
    formData.append("address", values.address);
    formData.append("skills", values.skills.value);
    formData.append("employment_status", values.employment_status.label);
    formData.append("pan", values.pan);
    formData.append("aadhar", values.aadhar);
    formData.append("epf_no", values.epf_no);
    formData.append("esi_no", values.esi_no);
    formData.append("bank_name", values.bank_name);
    formData.append("ifsc_code", values.ifsc_code);
    formData.append("account_number", values.account_number);
    formData.append("department", "");
    formData.append("family_info", JSON?.stringify(values.family_info));
    formData.append("team_id", values.team_id.value);
    formData.append("salary", values.salary);
    formData.append("salary_term", values.salary_term.value);
    formData.append("image", values.image);
    formData.append("graduation", values.graduation);
    formData.append("post_graduation", values.post_graduation);
    formData.append("doctorate", values.doctorate);
    formData.append("upload_pan_card", values.upload_pan_card);
    formData.append("credit_limit", values.credit_limit);

    formData.append(
      "upload_aadhar_card_image1",
      values.upload_aadhar_card_image1
    );
    formData.append(
      "upload_aadhar_card_image2",
      values.upload_aadhar_card_image2
    );
    formData.append("upload_bank_documents", values.upload_bank_documents);
    if (edit.id) {
      formData.append("employee_id", edit.id);
    }

    if (values.id) {
      formData.append("location_id", values.id.value); // Assuming `id` is an object with `value`
    }

    // Append Geofencing value
    if (values.geofencing !== undefined) {
      formData.append("geofencing", values.geofencing); // Already `0` or `1`
    }

    const res = edit?.id
      ? await updateEmployee(formData)
      : await addEmplyee(formData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate("/Employees");
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };
  useEffect(() => {
    if (id) {
      fetchEmployeesData();
    }
    // fetchAllHrTeamsData();
    fetchAllRolesData();
  }, []);

  useEffect(() => {
    fetchAllPreciseLocations();
  }, [])

  return (
    <Col md={12}>
      <Helmet>
        <title>AddEmployee · CMS Electricals</title>
      </Helmet>
      <CardComponent title={edit?.id ? t("Edit Employee") : t("Add Employee")}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: edit.name || "",
            email: edit.email || "",
            password: edit.password || "",
            mobile: edit.mobile || "",
            joining_date: edit.joining_date || "",
            dob:edit.dob || "",
            role_id: edit.role_id
              ? { label: edit.role_name, value: edit.role_id }
              : "",
            address: edit.address || "",
            graduation: edit.graduation || null,
            post_graduation: edit.post_graduation || null,
            doctorate: edit.doctorate || null,
            image: edit.image || null,
            skills: edit.skills || "",
            credit_limit: edit.credit_limit || "",
            team_id: edit.team_id
              ? { label: edit.team_name, value: edit.team_id }
              : "",
            employment_status: edit.employment_status
              ? { label: edit.employment_status, value: edit.employment_status }
              : "",
            salary: edit.salary || "",
            salary_term: edit.salary_term
              ? { label: edit.salary_term, value: edit.salary_term }
              : "",
            pan: edit.pan || "",
            upload_pan_card: edit.pan_card_image || "",
            epf_no: edit.epf_no || "",
            aadhar: edit.aadhar || "",
            upload_aadhar_card_image1: edit.aadhar_card_front_image || "",
            upload_aadhar_card_image2: edit.aadhar_card_back_image || "",
            esi_no: edit.esi_no || "",
            bank_name: edit.bank_name || "",
            ifsc_code: edit.ifsc_code || "",
            account_number: edit.account_number || "",
            upload_bank_documents: edit.bank_documents || "",
            family_info: edit.family_info || [
              {
                member_name: "",
                member_relation: "",
                // addhar_card_front_image: "",
                // addhar_card_back_image: "",
                // pan_card: "",
              },
            ],
            // Added company locations field
            id: edit.location_id
              ? { label: edit.location_name, value: edit.location_id } // If editing, populate with existing data
              : "", // Default to empty for new entries

            // Added geofencing field
            geofencing: edit.geofencing !== undefined
              ? edit.geofencing
              : 0, // Use `null` or default value
          }}

        validationSchema={addEmployeeSchema}
        onSubmit={handleSubmit}
        >
        {(props) => (
          <Form onSubmit={props?.handleSubmit}>
            <Row className="g-3 align-items-center">
              <Form.Group as={Col} md="4">
                <Form.Label>
                  {t("Name")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name={"name"}
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.name && props.errors.name)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  {t("Phone Number")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  maxLength={10}
                  name={"mobile"}
                  value={props.values.mobile}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.mobile && props.errors.mobile
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.mobile}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>{t("Email")}</Form.Label>
                <Form.Control
                  type="email"
                  name={"email"}
                  value={props.values.email}
                  onChange={props.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>{t("Address")}</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  className="edit-textarea"
                  name={"address"}
                  value={props.values.address}
                  onChange={props.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>
                  {t("Joining Date")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name={"joining_date"}
                  value={props.values.joining_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.joining_date && props.errors.joining_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.joining_date}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3">
                <Form.Label>
                  {t("dob")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name={"dob"}
                  value={props.values.dob}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.dob && props.errors.dob
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.dob}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3">
                <Form.Label>{t("Graduation")}</Form.Label>

                {edit.id ? (
                  <>
                    <Form.Control
                      type="file"
                      name={"graduation"}
                      // onChange={}
                      onChange={(e) =>
                        props.setFieldValue("graduation", e.target.files[0])
                      }
                    />
                    <Form.Group as={Col} md={2}>
                      <img
                        width={100}
                        className="my-bg mt-2 p-1 rounded"
                        src={`${process.env.REACT_APP_API_URL}/${edit?.graduation}`}
                      />{" "}
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <Form.Control
                      type="file"
                      name={"graduation"}
                      // onChange={}
                      onChange={(e) =>
                        props.setFieldValue("graduation", e.target.files[0])
                      }
                    />
                  </>
                )}
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>{t("Post-Graduation")}</Form.Label>

                {edit.id ? (
                  <>
                    <Form.Control
                      type="file"
                      name={"post_graduation"}
                      onChange={(e) =>
                        props.setFieldValue(
                          "post_graduation",
                          e.target.files[0]
                        )
                      }
                    />
                    <Form.Group as={Col} md={2}>
                      <img
                        width={100}
                        className="my-bg mt-2 p-1 rounded"
                        src={`${process.env.REACT_APP_API_URL}/${edit?.post_graduation}`}
                      />{" "}
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <Form.Control
                      type="file"
                      name={"post_graduation"}
                      onChange={(e) =>
                        props.setFieldValue(
                          "post_graduation",
                          e.target.files[0]
                        )
                      }
                    />
                  </>
                )}
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>{t("Doctorate")}</Form.Label>
                {edit.id ? (
                  <>
                    <Form.Control
                      type="file"
                      name={"doctorate"}
                      onChange={(e) =>
                        props.setFieldValue("doctorate", e.target.files[0])
                      }
                    />
                    <Form.Group as={Col} md={2}>
                      <img
                        width={100}
                        className="my-bg mt-2 p-1 rounded"
                        src={`${process.env.REACT_APP_API_URL}/${edit?.doctorate}`}
                      />{" "}
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <Form.Control
                      type="file"
                      name={"doctorate"}
                      onChange={(e) =>
                        props.setFieldValue("doctorate", e.target.files[0])
                      }
                    />
                  </>
                )}
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>{t("Upload Photo")}</Form.Label>
                {edit.id ? (
                  <>
                    <Form.Control
                      type="file"
                      name={"image"}
                      onChange={(e) =>
                        props.setFieldValue("image", e.target.files[0])
                      }
                    />
                    <Form.Group as={Col} md={2}>
                      <img
                        width={100}
                        className="my-bg mt-2 p-1 rounded"
                        src={`${process.env.REACT_APP_API_URL}/${edit?.image}`}
                      />{" "}
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <Form.Control
                      type="file"
                      name={"image"}
                      onChange={(e) =>
                        props.setFieldValue("image", e.target.files[0])
                      }
                    />
                  </>
                )}
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>{t("Skills")}</Form.Label>
                <Select
                  menuPortalTarget={document.body}
                  className="text-primary"
                  value={props.values.skills}
                  options={[
                    { value: "Skilled", label: "Skilled" },
                    {
                      value: "Non Skilled",
                      label: "Non Skilled",
                    },
                  ]}
                  onChange={(val) => props.setFieldValue("skills", val)}
                  name={"skills"}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.skills && props.errors.skills
                  )}
                />
                <small className="text-danger">{props.errors.skills}</small>
              </Form.Group>

              {/* supervisor=40 , manager=9 , subuser=7 */}
              <Form.Group as={Col} md="4">
                <Form.Label>
                  {t("Role")} <span className="text-danger">*</span>
                </Form.Label>

                <Select
                  menuPortalTarget={document.body}
                  className="text-primary"
                  options={allRoles}
                  name={"role_id"}
                  value={props.values.role_id}
                  onChange={(val) => {
                    if (val.value == 40) {
                      props.setFieldValue("role_id", val);
                      fetchAllEnduser(9);
                    } else if (val.value == 7) {
                      props.setFieldValue("role_id", val);
                      fetchAllEnduser(40);
                    } else {
                      setAllTeam([]);
                      props.setFieldValue("role_id", val);
                      props.setFieldValue("team_id", "");
                    }
                  }}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.role_id && props.errors.role_id
                  )}
                />
                <ErrorMessage
                  name="role_id"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>

              <Form.Group as={Col} md="4">
                <Form.Label>
                  {/* {t("Team")} */}
                  {props.values.role_id.value == 7
                    ? "supervisor"
                    : props.values.role_id.value == 40
                      ? "area manager"
                      : "team"}
                  {/* <span className="text-danger">*</span> */}
                </Form.Label>

                <Select
                  menuPortalTarget={document.body}
                  className="text-primary"
                  options={allTeam}
                  name={"team_id"}
                  value={props.values.team_id}
                  onChange={(val) => props.setFieldValue("team_id", val)}
                />
                <ErrorMessage
                  name="team_id"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  {t("Employment Status")}{" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  menuPortalTarget={document.body}
                  className="text-primary"
                  options={employementOptions}
                  name={"employment_status"}
                  value={props.values.employment_status}
                  onChange={(val) =>
                    props.setFieldValue("employment_status", val)
                  }
                />
                <ErrorMessage
                  name="employment_status"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  {t("Salary")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name={"salary"}
                  value={props.values.salary}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.salary && props.errors.salary
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.salary}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  {t("Salary Term")} <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  menuPortalTarget={document.body}
                  className="text-primary"
                  name={"salary_term"}
                  options={[
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                  ]}
                  value={props.values.salary_term}
                  onChange={(selectedOption) => {
                    props.setFieldValue("salary_term", selectedOption);
                  }}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.salary_term && props.errors.salary_term
                  )}
                />
                <small className="text-danger">
                  {props.errors.salary_term}
                </small>
              </Form.Group>


              <Form.Group as={Col} md="4">
                <Form.Label>
                  {t("company locations")} <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  menuPortalTarget={document.body}
                  className={`text-primary ${props.touched.id && props.errors.id ? "is-invalid" : ""}`}
                  options={allLocations} // Use mapped `allLocations`
                  name="id"
                  value={props.values.id} // Ensure value is in { value, label } format
                  onChange={(val) => {
                    props.setFieldValue("id", val); // Set value for Formik
                    console.log("Selected location:", val); // Debug
                  }}
                  onBlur={props.handleBlur}
                />
                <ErrorMessage
                  name="id"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>

              <Form.Group as={Col} md="4">
                <Form.Label>
                  {t("Geofencing")} <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  menuPortalTarget={document.body}
                  className={`text-primary ${props.touched.geofencing && props.errors.geofencing ? "is-invalid" : ""}`}
                  name="geofencing"
                  options={[
                    { value: 0, label: "false" }, // Map `false` to `0`
                    { value: 1, label: "true" },  // Map `true` to `1`
                  ]}
                  value={props.values.geofencing !== undefined ? { value: props.values.geofencing, label: props.values.geofencing ? "true" : "false" } : null}
                  onChange={(selectedOption) => {
                    props.setFieldValue("geofencing", selectedOption.value); // Set value as 0 or 1
                    console.log("Selected Geofencing Value:", selectedOption.value); // Debug
                  }}
                  onBlur={props.handleBlur}
                />
                <small className="text-danger">{props.errors.geofencing}</small>
              </Form.Group>

              <div className="hr-border2 mt-4 mb-2" />

              <Form.Group as={Col} md="6" className="hr-border">
                <Row className="g-3">
                  <Form.Group as={Col} md="12">
                    <Form.Label>{t("Pan No")}</Form.Label>
                    <Form.Control
                      type="text"
                      name={"pan"}
                      value={props.values.pan}
                      onChange={props.handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="12">
                    <Form.Label>
                      {t("Aadhar No")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name={"aadhar"}
                      value={props.values.aadhar}
                      onChange={(e) => {
                        if (e.target.value.length <= 12) {
                          props.setFieldValue("aadhar", e.target.value);
                        }
                      }}
                    />
                    <small className="text-danger">
                      {props.errors.aadhar}
                    </small>
                  </Form.Group>

                  <Form.Group as={Col} md="12">
                    <Form.Label>{t("Epf No")}</Form.Label>
                    <Form.Control
                      type="text"
                      name={"epf_no"}
                      value={props.values.epf_no}
                      onChange={props.handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="12">
                    <Form.Label>{t("Esi No")}</Form.Label>
                    <Form.Control
                      type="text"
                      name={"esi_no"}
                      value={props.values.esi_no}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                </Row>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Row className="g-3">
                  <Form.Group as={Col} md="6">
                    {edit.id ? (
                      <>
                        <Form.Label>{t("Upload Pan Card")}</Form.Label>
                        <Form.Control
                          type="file"
                          name={"upload_pan_card"}
                          onChange={(e) =>
                            props.setFieldValue(
                              "upload_pan_card",
                              e.target.files[0]
                            )
                          }
                        />
                        <Form.Group as={Col} md={2}>
                          <img
                            width={100}
                            className="my-bg mt-2 p-1 rounded"
                            src={`${process.env.REACT_APP_API_URL}/${edit?.pan_card_image}`}
                          />{" "}
                        </Form.Group>
                      </>
                    ) : (
                      <>
                        <Form.Label>{t("Upload Pan Card")}</Form.Label>
                        <Form.Control
                          type="file"
                          name={"upload_pan_card"}
                          onChange={(e) =>
                            props.setFieldValue(
                              "upload_pan_card",
                              e.target.files[0]
                            )
                          }
                        />
                      </>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>{t("Aadhar Card Front Image")}</Form.Label>

                    {edit.id ? (
                      <>
                        <Form.Control
                          type="file"
                          name={"upload_aadhar_card_image1"}
                          onChange={(e) =>
                            props.setFieldValue(
                              "upload_aadhar_card_image1",
                              e.target.files[0]
                            )
                          }
                        />

                        <Form.Group as={Col} md={2}>
                          <img
                            width={100}
                            className="my-bg mt-2 p-1 rounded"
                            src={`${process.env.REACT_APP_API_URL}/${edit?.aadhar_card_front_image}`}
                          />{" "}
                        </Form.Group>
                      </>
                    ) : (
                      <>
                        <Form.Control
                          type="file"
                          name={"upload_aadhar_card_image1"}
                          onChange={(e) =>
                            props.setFieldValue(
                              "upload_aadhar_card_image1",
                              e.target.files[0]
                            )
                          }
                        />
                      </>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>{t("Aadhar Card Back Image")}</Form.Label>

                    {edit.id ? (
                      <>
                        <Form.Control
                          type="file"
                          name={"upload_aadhar_card_image2"}
                          onChange={(e) =>
                            props.setFieldValue(
                              "upload_aadhar_card_image2",
                              e.target.files[0]
                            )
                          }
                        />
                        <Form.Group as={Col} md={2}>
                          <img
                            width={100}
                            className="my-bg mt-2 p-1 rounded"
                            src={`${process.env.REACT_APP_API_URL}/${edit?.aadhar_card_back_image}`}
                          />{" "}
                        </Form.Group>
                      </>
                    ) : (
                      <>
                        <Form.Control
                          type="file"
                          name={"upload_aadhar_card_image2"}
                          onChange={(e) =>
                            props.setFieldValue(
                              "upload_aadhar_card_image2",
                              e.target.files[0]
                            )
                          }
                        />
                      </>
                    )}
                  </Form.Group>
                </Row>
              </Form.Group>

              <div className="hr-border2 mt-4 mb-2" />

              <Form.Group as={Col} md="4">
                <Form.Label>{t("Bank Name")}</Form.Label>
                <Form.Control
                  type="text"
                  name={"bank_name"}
                  value={props.values.bank_name}
                  onChange={props.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>{t("Ifsc Code")}</Form.Label>
                <Form.Control
                  type="text"
                  name={"ifsc_code"}
                  value={props.values.ifsc_code}
                  onChange={props.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>{t("Account Number")}</Form.Label>
                <Form.Control
                  type="text"
                  name={"account_number"}
                  value={props.values.account_number}
                  onChange={props.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>{t("Upload Bank Documents")}</Form.Label>

                {edit.id ? (
                  <>
                    <Form.Control
                      type="file"
                      name={"upload_bank_documents"}
                      onChange={(e) =>
                        props.setFieldValue(
                          "upload_bank_documents",
                          e.target.files[0]
                        )
                      }
                    />
                    <Form.Group as={Col} md={2}>
                      <img
                        width={100}
                        className="my-bg mt-2 p-1 rounded"
                        src={`${process.env.REACT_APP_API_URL}/${edit?.bank_documents}`}
                      />{" "}
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <Form.Control
                      type="file"
                      name={"upload_bank_documents"}
                      onChange={(e) =>
                        props.setFieldValue(
                          "upload_bank_documents",
                          e.target.files[0]
                        )
                      }
                    />
                  </>
                )}
              </Form.Group>

              <Form.Group as={Col} md="4">
                <Form.Label>{t("Fund & Stock Limit")}</Form.Label>
                <Form.Control
                  type="text"
                  name={"credit_limit"}
                  value={props.values.credit_limit}
                  onChange={props.handleChange}
                />
              </Form.Group>

              <div className="hr-border2 mt-4 mb-2" />
              <Form.Group as={Col} md={12}>
                <Form.Label className="fw-bold pb-2">
                  {t("Employee Login Credentials")}
                </Form.Label>
                <MyCard>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>{t("User Name")}</Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="email"
                        value={props.values.email}
                        onChange={props.handleChange}
                        name={"email"}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>{t("Password")}</Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="password"
                        value={props.values.password}
                        onChange={props.handleChange}
                        name="password"
                      />
                    </Col>
                  </Form.Group>
                  {/* <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Status</Form.Label>
                      <Col sm={8}>
                        <Form.Check inline label="1" id={1} name="group1" />
                        <Form.Check inline label="2" id={2} name="group1" />
                      </Col>
                      <Form.Control.Feedback type="invalid">
                        {props.errors.password}
                      </Form.Control.Feedback>
                    </Form.Group> */}
                </MyCard>
              </Form.Group>

              <div className="hr-border2 mt-4 mb-2" />

              <Form.Group as={Col} md={12}>
                <Form.Label className="fw-bold pb-2">
                  {t("Add Family")} ({t("optional")})
                </Form.Label>
                <div className={"shadow p-3"}>
                  <FieldArray name="family_info">
                    {({ remove, push }) => (
                      <>
                        <Row className="align-items-center g-3">
                          {props.values.family_info.length > 0 &&
                            props.values.family_info.map((ele, index) => (
                              <Fragment key={index}>
                                <Form.Group as={Col} md={6}>
                                  <Form.Label>{t("Name")}</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name={`family_info.${index}.member_name`}
                                    value={ele.member_name}
                                    onChange={props.handleChange}
                                  />
                                </Form.Group>
                                <Form.Group as={Col} md={6}>
                                  <Form.Label>{t("Relation")}</Form.Label>
                                  <div className="d-flex gap-2">
                                    <Select
                                      menuPortalTarget={document.body}
                                      className="w-100 text-primary"
                                      options={[
                                        {
                                          label: "Mother",
                                          value: "Mother",
                                        },
                                        {
                                          label: "Father",
                                          value: "Father",
                                        },
                                        {
                                          label: "Brother",
                                          value: "Brother",
                                        },
                                        {
                                          label: "Sister",
                                          value: "Sister",
                                        },
                                        {
                                          label: "husband",
                                          value: "husband",
                                        },
                                        {
                                          label: "Wife",
                                          value: "Wife",
                                        },
                                        {
                                          label: "Son",
                                          value: "Son",
                                        },
                                        {
                                          label: "Daughter",
                                          value: "Daughter",
                                        },
                                        {
                                          label: "Other",
                                          value: "Other",
                                        },
                                      ]}
                                      name={`family_info[${index}].member_relation`}
                                      value={{
                                        label: ele.member_relation,
                                        value: ele.member_relation,
                                      }}
                                      onChange={(e) =>
                                        props.setFieldValue(
                                          `family_info[${index}].member_relation`,
                                          e.value
                                        )
                                      }
                                    />
                                    <TooltipComponent
                                      align="left"
                                      title={"Remove"}
                                    >
                                      <BsXLg
                                        onClick={() =>
                                          index !== 0 && remove(index)
                                        }
                                        className="social-btn red-combo"
                                      />
                                    </TooltipComponent>
                                  </div>
                                </Form.Group>

                                {/* <Form.Group as={Col} md={4}>
                                    <Form.Label>
                                      Upload Aadhar Card Front Image
                                    </Form.Label>
                                    {edit.id ? (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.addhar_card_front_image`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.addhar_card_front_image`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                        <Form.Group as={Col} md={2}>
                                          <img
                                            width={100}
                                            className="my-bg mt-2 p-1 rounded"
                                            src={`${process.env.REACT_APP_API_URL}/${edit?.addhar_card_front_image}`}
                                          />{" "}
                                        </Form.Group>
                                      </>
                                    ) : (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.addhar_card_front_image`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.addhar_card_front_image`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                      </>
                                    )}
                                  </Form.Group>
                                  <Form.Group as={Col} md={4}>
                                    <Form.Label>
                                      Upload Aadhar Card Back Image
                                    </Form.Label>
                                    {edit.id ? (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.addhar_card_back_image`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.addhar_card_back_image`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                        <Form.Group as={Col} md={2}>
                                          <img
                                            width={100}
                                            className="my-bg mt-2 p-1 rounded"
                                            src={`${process.env.REACT_APP_API_URL}/${edit?.addhar_card_back_image}`}
                                          />{" "}
                                        </Form.Group>
                                      </>
                                    ) : (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.addhar_card_back_image`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.addhar_card_back_image`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                      </>
                                    )}
                                  </Form.Group>
                                  <Form.Group as={Col} md={4}>
                                    <Form.Label>Upload Pan Card</Form.Label>
                                    {edit.id ? (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.pan_card`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.pan_card`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                        <Form.Group as={Col} md={2}>
                                          <img
                                            width={100}
                                            className="my-bg mt-2 p-1 rounded"
                                            src={`${process.env.REACT_APP_API_URL}/${edit?.pan_card}`}
                                          />{" "}
                                        </Form.Group>
                                      </>
                                    ) : (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.pan_card`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.pan_card`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                      </>
                                    )}
                                  </Form.Group> */}

                                <div className="hr-border2 my-3" />
                              </Fragment>
                            ))}
                        </Row>
                        <Form.Group as={Col} md={12} className="d-grid">
                          <TooltipComponent title={"Add Family"}>
                            <div
                              onClick={() =>
                                push({
                                  member_name: "",
                                  member_relation: "",
                                  // addhar_card_front_image: null,
                                  // addhar_card_back_image: null,
                                  // pan_card: null,
                                })
                              }
                              className="social-btn-re w-auto success-combo d-align gap-2"
                            >
                              <BsPlusLg /> {t("Add")}
                            </div>
                          </TooltipComponent>
                        </Form.Group>
                      </>
                    )}
                  </FieldArray>
                </div>
              </Form.Group>

              <Form.Group as={Col} md={12}>
                <div className="text-center">
                  <button
                    type={`${edit?.id ? "button" : "submit"}`}
                    onClick={() => setShowAlert(edit?.id && true)}
                    disabled={props?.isSubmitting}
                    className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                  >
                    {props?.isSubmitting ? (
                      <>
                        <Spinner
                          animation="border"
                          variant="primary"
                          size="sm"
                        />
                        {t("PLEASE WAIT")}...
                      </>
                    ) : (
                      <>{edit?.id ? t("UPDATE") : t("CREATE")}</>
                    )}
                  </button>
                  <ConfirmAlert
                    size={"sm"}
                    deleteFunction={
                      props.isValid ? props.handleSubmit : setShowAlert(false)
                    }
                    hide={setShowAlert}
                    show={showAlert}
                    title={"Confirm UPDATE"}
                    description={"Are you sure you want to update this!!"}
                  />
                </div>
              </Form.Group>
            </Row>
          </Form>
        )}
      </Formik>
    </CardComponent>
    </Col >
  );
};

export default AddEmployee;
