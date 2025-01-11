import { ErrorMessage, FieldArray, Formik } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import { Col, Form, FormText, Row, Spinner } from "react-bootstrap";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import { getAdminCompanyTypes } from "../../services/authapi";
import CardComponent from "../../components/CardComponent";
import { addMyCompanySchema } from "../../utils/formSchema";
import TooltipComponent from "../../components/TooltipComponent";
import {
  getAdminAllCompaniesData,
  updateAdminAllCompanies,
} from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import Switch from "../../components/Switch";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const AddAllCompanies = () => {
  const [edit, setEdit] = useState({});
  const [types, setTypes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [sameAsDefault, setSameAsDefault] = useState(false);
  const { id } = useParams();
  // console.log('id', id)
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchMyCompaniesDetailsData = async () => {
    const res = await getAdminAllCompaniesData(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };
  const fetchCompanyTypesData = async () => {
    const res = await getAdminCompanyTypes();
    if (res.status) {
      setTypes(res.data);
    } else {
      setTypes([]);
    }
  };
  // console.log('edit', edit)

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values);
    const sData = {
      company_name: values.company_name,
      company_email: values.company_email,
      company_contact: values.company_contact,
      company_mobile: values.company_mobile,
      company_address: values.company_address,
      company_contact_person: values.company_contact_person,
      primary_contact_number: values.primary_contact_number,
      primary_contact_email: values.primary_contact_email,
      designation: values.designation,
      department: values.department,
      company_website: values.company_website,
      gst_treatment_type: values.gst_treatment_type.value,
      business_legal_name: values.business_legal_name,
      business_trade_name: values.business_trade_name,
      pan_number: values.pan_number,
      place_of_supply: values.place_of_supply,
      enable_company_type: values.enable_company_type === true ? 1 : 0,
      email: values.enable_company_type === true ? values.email : "",
      password: values.enable_company_type === true ? values.password : "",
      company_type: values.company_type,
      gst_details: values.gst_details || [
        {
          gst_number: "",
          shipping_address: "",
          billing_address: "",
          is_default: "0",
        },
      ],
      id: edit?.company_id,
      my_company: 1,
    };

    if (edit?.company_id) {
      sData["login_id"] = edit?.login_id;
    }

    // return console.log('values', sData);

    const res = edit?.company_id ? await updateAdminAllCompanies(sData) : "";
    if (res.status) {
      toast.success(res.message);
      navigate("/AllCompanies");
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  function handleSameAsDefaultChange(e) {
    setSameAsDefault(e.target.checked);
  }

  useEffect(() => {
    fetchCompanyTypesData();
    if (id !== "new") {
      fetchMyCompaniesDetailsData();
    }
  }, []);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>
          {edit.company_id ? "Update My Company" : "Add My Company"} · CMS
          Electricals
        </title>
      </Helmet>
      <CardComponent
        title={edit.company_id ? "Update My Company" : "Add My Company"}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            company_name: edit.company_name,
            company_email: edit.company_email,
            company_contact: edit.company_contact,
            company_mobile: edit.company_mobile,
            company_address: edit.company_address,
            company_contact_person: edit.company_contact_person,
            primary_contact_number: edit.primary_contact_number,
            primary_contact_email: edit.primary_contact_email,
            designation: edit.designation,
            department: edit.department,
            company_website: edit.company_website,
            gst_treatment_type: edit.gst_treatment_type
              ? {
                  label: edit.gst_treatment_type,
                  value: edit.gst_treatment_type,
                }
              : "",
            business_legal_name: edit.business_legal_name,
            business_trade_name: edit.business_trade_name,
            pan_number: edit.pan_number,
            place_of_supply: edit.place_of_supply,
            enable_company_type:
              edit.is_company_login_enable === "1" ? true : false || false,
            email: edit.email || "",
            password: "",
            company_type: edit.company_type,
            gst_details: edit.gst_details || [
              {
                gst_number: "",
                shipping_address: "",
                billing_address: "",
                is_default: "1",
              },
            ],
          }}
          validationSchema={addMyCompanySchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-3 align-items-center">
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    {t("Company Name")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={"company_name"}
                    value={props.values.company_name}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.company_name && props.errors.company_name
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.company_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>{t("Company Email")}</Form.Label>
                  <Form.Control
                    type="email"
                    name={"company_email"}
                    value={props.values.company_email}
                    onChange={(e) => {
                      props.handleChange(e);
                      props.setFieldValue("email", e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    {t("Company Contact")}{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={10}
                    name={"company_contact"}
                    value={props.values.company_contact}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.company_contact &&
                        props.errors.company_contact
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.company_contact}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    {t("Company Mobile")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={10}
                    name={"company_mobile"}
                    value={props.values.company_mobile}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.company_mobile &&
                        props.errors.company_mobile
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.company_mobile}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>{t("Company Website")}</Form.Label>
                  <Form.Control
                    type="url"
                    name={"company_website"}
                    value={props.values.company_website}
                    onChange={props.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    {t("Company Contact Person")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={"company_contact_person"}
                    value={props.values.company_contact_person}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.company_contact_person &&
                        props.errors.company_contact_person
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.company_contact_person}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>
                    {t("Company Address")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <TextareaAutosize
                    minRows={2}
                    className="edit-textarea"
                    name={"company_address"}
                    value={props.values.company_address}
                    onChange={props.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    {t("primary contact number")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={10}
                    name={"primary_contact_number"}
                    value={props.values.primary_contact_number}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.primary_contact_number &&
                        props.errors.primary_contact_number
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.primary_contact_number}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>{t("primary contact email")}</Form.Label>
                  <Form.Control
                    type="email"
                    name={"primary_contact_email"}
                    value={props.values.primary_contact_email}
                    onChange={props.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>{t("designation")}</Form.Label>
                  <Form.Control
                    type="text"
                    name={"designation"}
                    value={props.values.designation}
                    onChange={props.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>{t("department")}</Form.Label>
                  <Form.Control
                    type="text"
                    name={"department"}
                    value={props.values.department}
                    onChange={props.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    {t("GST Treatment Type")}{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Select
                    menuPortalTarget={document.body}
                    name={"gst_treatment_type"}
                    options={[
                      {
                        label: "Registered Business – Regular",
                        value: "Registered Business – Regular",
                      },
                      {
                        label: "Registered Business – Composition",
                        value: "Registered Business – Composition",
                      },
                      {
                        label: "Unregistered Business",
                        value: "Unregistered Business",
                      },
                      { label: "Consumer", value: "Consumer" },
                    ]}
                    value={props.values.gst_treatment_type}
                    onChange={(selectedOption) => {
                      props.setFieldValue("gst_treatment_type", selectedOption);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.gst_treatment_type}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    {t("business legal name")}{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={"business_legal_name"}
                    value={props.values.business_legal_name}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.business_legal_name &&
                        props.errors.business_legal_name
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.business_legal_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>{t("business trade name")}</Form.Label>
                  <Form.Control
                    type="text"
                    name={"business_trade_name"}
                    value={props.values.business_trade_name}
                    onChange={props.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    {t("pan number")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={10}
                    name={"pan_number"}
                    value={props.values.pan_number}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.pan_number && props.errors.pan_number
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.pan_number}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>{t("place of supply")}</Form.Label>
                  <Form.Control
                    type="text"
                    name={"place_of_supply"}
                    value={props.values.place_of_supply}
                    onChange={props.handleChange}
                  />
                </Form.Group>

                <div className="hr-border2 mt-3" />
                <Form.Group as={Col} md={12}>
                  <Form.Label className="fw-bold pb-2">
                    {t("Enable Company Login")}
                    <Switch
                      name={"enable_company_type"}
                      checked={props.values.enable_company_type}
                      onChange={props.handleChange}
                    />
                  </Form.Label>
                  {props.values.enable_company_type && (
                    <div className="shadow p-3">
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column>{t("User Email")}</Form.Label>
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
                          <div className="d-grid gap-1">
                            <Form.Control
                              type="password"
                              value={props.values.password}
                              onChange={props.handleChange}
                              name="password"
                            />
                            {edit?.company_id ? (
                              <FormText>
                                Password is encrypted. If you don't want to
                                change it, leave it blank.
                              </FormText>
                            ) : null}
                          </div>
                        </Col>
                      </Form.Group>
                    </div>
                  )}
                </Form.Group>

                <FieldArray name="gst_details">
                  {({ remove, push }) => (
                    <>
                      {props.values.gst_details.length > 0 &&
                        props.values.gst_details.map((gst, index) => (
                          <Row key={index} className="align-items-center g-3">
                            <div className="hr-border2 mt-3" />
                            <Form.Group as={Col} md="12">
                              <Form.Label>
                                {t("gst number")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={`gst_details.${index}.gst_number`}
                                value={gst.gst_number}
                                onChange={props.handleChange}
                              />
                              <ErrorMessage
                                name={`gst_details.${index}.gst_number`}
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md="5">
                              <Form.Label>
                                {t("billings address")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <TextareaAutosize
                                minRows={2}
                                className="edit-textarea"
                                name={`gst_details.${index}.billing_address`}
                                value={
                                  sameAsDefault == true
                                    ? gst.shipping_address
                                    : gst.billing_address
                                }
                                onChange={props.handleChange}
                              />
                              <ErrorMessage
                                name={`gst_details.${index}.billing_address`}
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>

                            <Form.Group as={Col} md="1" className="text-center">
                              <input
                                className="form-check-input mb-2"
                                type="checkbox"
                                onChange={(e) => {
                                  const updatedGstDetails = [
                                    ...props.values.gst_details,
                                  ];
                                  if (e.target.checked) {
                                    updatedGstDetails[index].shipping_address =
                                      updatedGstDetails[index].billing_address;
                                  } else {
                                    updatedGstDetails[index].shipping_address =
                                      "";
                                  }
                                  props.setFieldValue(
                                    "gst_details",
                                    updatedGstDetails
                                  );
                                }}
                              />
                              <Form.Label>{t("Same")}</Form.Label>
                            </Form.Group>

                            <Form.Group as={Col} md={index === 0 ? null : "5"}>
                              <Form.Label>
                                {t("shipping address")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <TextareaAutosize
                                minRows={2}
                                className="edit-textarea"
                                name={`gst_details.${index}.shipping_address`}
                                value={gst.shipping_address}
                                onChange={props.handleChange}
                              />
                              <ErrorMessage
                                name={`gst_details.${index}.shipping_address`}
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            {index === 0 ? null : (
                              <Form.Group
                                as={Col}
                                md="1"
                                className="text-center mb-2 m-auto"
                              >
                                <TooltipComponent
                                  align="left"
                                  title={"Delete Row"}
                                >
                                  <BsXLg
                                    onClick={() => remove(index)}
                                    className="social-btn red-combo"
                                  />
                                </TooltipComponent>
                              </Form.Group>
                            )}

                            <Form.Group as={Col} md="6">
                              <Form.Check
                                label="Mark Default"
                                type="radio"
                                name={`gst_details.${index}.is_default`}
                                id={`gst_details.${index}.is_default`}
                                checked={+gst.is_default === 1}
                                onChange={(e) => {
                                  const updatedGstDetails = [
                                    ...props.values.gst_details,
                                  ];
                                  updatedGstDetails.forEach((item, idx) => {
                                    if (idx === index) {
                                      item.is_default = "1";
                                    } else {
                                      item.is_default = "0";
                                    }
                                  });
                                  props.setFieldValue(
                                    "gst_details",
                                    updatedGstDetails
                                  );
                                }}
                              />
                            </Form.Group>
                          </Row>
                        ))}
                      <Form.Group as={Col} md={3} className="ms-auto">
                        <div
                          onClick={() =>
                            push({
                              gst_number: "",
                              shipping_address: "",
                              billing_address: "",
                              is_default: "0",
                            })
                          }
                          className="shadow py-1 px-3 success-combo cursor-pointer d-align gap-1"
                        >
                          <BsPlusLg className="cursor-pointer" /> {t("Add")}
                        </div>
                      </Form.Group>
                    </>
                  )}
                </FieldArray>

                <div className="hr-border2 mt-3" />
                <Form.Group as={Col} md={12}>
                  <div className="my-4 text-truncate d-grid d-md-flex d-align gap-3">
                    {types?.map((companytyp, index) => (
                      <Fragment key={index}>
                        <Form.Check
                          inline
                          label={companytyp.company_type_name}
                          name="company_type"
                          type="radio"
                          checked={
                            +props.values.company_type ===
                            companytyp.company_type_id
                          }
                          id={companytyp.company_type_id}
                          value={companytyp.company_type_id}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.company_type &&
                              props.errors.company_type
                          )}
                        />
                        <Form.Control.Feedback type="invalid">
                          {props.errors.company_type}
                        </Form.Control.Feedback>
                      </Fragment>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group as={Col} md={12}>
                  <div className="text-center">
                    <button
                      type={`${edit.company_id ? "button" : "submit"}`}
                      onClick={() => setShowAlert(edit.company_id && true)}
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
                          {t("PLEASE WAIT")}...
                        </>
                      ) : (
                        <>{edit.company_id ? "UPDATE" : "SAVE"}</>
                      )}
                    </button>
                    <ConfirmAlert
                      size={"sm"}
                      deleteFunction={props.handleSubmit}
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
    </Col>
  );
};

export default AddAllCompanies;
