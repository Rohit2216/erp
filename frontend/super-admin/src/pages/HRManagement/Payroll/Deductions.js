import React, { useState } from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Select from "react-select";
import { CreateDeductions } from "../../../services/authapi";
import { FieldArray, Formik } from "formik";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { CREATED } from "../../../utils/constants";
import { checkPermission } from "../../../utils/checkPermissions";

const Deductions = ({ allUserData, roles }) => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = values.deduction.map((itm) => {
      if (typeof itm.applied_on === "object") {
        return {
          ...itm,
          applied_on: itm.applied_on.map((item) => item.value).join(","),
          value_type:
            typeof itm.value_type === "object"
              ? itm.value_type.value
              : itm.value_type,
        };
      } else {
        return {
          ...itm,
          value_type:
            typeof itm.value_type === "object"
              ? itm.value_type.value
              : itm.value_type,
        };
      }
    });

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = CREATED;

    // return console.log('sData', sData)
    const res = await CreateDeductions(sData, params);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Payroll Master · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            deduction: [
              {
                name: "Provident Fund",
                applied_type: "",
                applied_on: "",
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "Employees State Insurance Corporation",
                applied_type: "",
                applied_on: "",
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "Professional Tax",
                applied_type: "",
                applied_on: "",
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "Labor Welfare Fund",
                applied_type: "",
                applied_on: "",
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "National Pension Scheme",
                applied_type: "",
                applied_on: "",
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "Advance Salary Deductions",
                applied_type: "",
                applied_on: "",
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "" || "Others",
                applied_type: "",
                applied_on: "",
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
            ],
          }}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-3">
                <FieldArray name="deduction">
                  {() => (
                    <>
                      {props.values.deduction.length > 0 &&
                        props.values.deduction.map((allow, index) => (
                          <Form.Group as={Col} md={6} key={index}>
                            <div className="shadow p-3">
                              <p className="fw-bold">
                                {index == 6 ? "Others" : allow?.name}
                              </p>
                              <div className="d-align justify-content-start gap-4">
                                <Form.Check
                                  type="radio"
                                  name={`deduction.${index}.applied_type`}
                                  id={`deduction.${index}.applied_type_employee`}
                                  label="Employee-Wise"
                                  value={1}
                                  checked={
                                    props.values.deduction[index]
                                      .applied_type === 1
                                  }
                                  onChange={() => {
                                    props.setFieldValue(
                                      `deduction.${index}.applied_type`,
                                      1
                                    );
                                    props.setFieldValue(
                                      `deduction.${index}.applied_on`,
                                      null
                                    );
                                  }}
                                />
                                <Form.Check
                                  type="radio"
                                  name={`deduction.${index}.applied_type`}
                                  id={`deduction.${index}.applied_type_designation`}
                                  label="Designation-Wise"
                                  value={2}
                                  checked={
                                    props.values.deduction[index]
                                      .applied_type === 2
                                  }
                                  onChange={() => {
                                    props.setFieldValue(
                                      `deduction.${index}.applied_type`,
                                      2
                                    );
                                    props.setFieldValue(
                                      `deduction.${index}.applied_on`,
                                      null
                                    );
                                  }}
                                />
                              </div>
                              <Form.Group className="my-3" as={Col} md={12}>
                                {props.values.deduction[index].applied_type ===
                                  1 && (
                                  <>
                                    <Form.Label>Select Employee:</Form.Label>
                                    <Select
                                      isMulti
                                      className="text-primary w-100"
                                      menuPortalTarget={document.body}
                                      name={`deduction.${index}.applied_on`}
                                      options={allUserData?.map((user) => ({
                                        label: user.name,
                                        value: user.id,
                                      }))}
                                      value={
                                        props.values.deduction[index].applied_on
                                      }
                                      onChange={(selectedOption) => {
                                        props.setFieldValue(
                                          `deduction.${index}.applied_on`,
                                          selectedOption
                                        );
                                      }}
                                    />
                                  </>
                                )}
                                {props.values.deduction[index].applied_type ===
                                  2 && (
                                  <>
                                    <Form.Label>Select Designation:</Form.Label>
                                    <Select
                                      isMulti
                                      className="text-primary w-100"
                                      menuPortalTarget={document.body}
                                      name={`deduction.${index}.applied_on`}
                                      options={roles?.map((role) => ({
                                        label: role.name,
                                        value: role.id,
                                      }))}
                                      value={
                                        props.values.deduction[index].applied_on
                                      }
                                      onChange={(selectedOption) => {
                                        props.setFieldValue(
                                          `deduction.${index}.applied_on`,
                                          selectedOption
                                        );
                                      }}
                                    />
                                  </>
                                )}
                              </Form.Group>
                              <div className="d-align mb-3 justify-content-start gap-4">
                                <div className="w-100 position-relative">
                                  <p className="mb-1">Allowance Type</p>
                                  <Select
                                    menuPortalTarget={document.body}
                                    value={
                                      props.values.deduction[index].value_type
                                    }
                                    onChange={(selectedOption) => {
                                      props.setFieldValue(
                                        `deduction.${index}.value_type`,
                                        selectedOption
                                      );
                                    }}
                                    name={`deduction.${index}.value_type`}
                                    className="text-primary"
                                    options={[
                                      { value: 1, label: "Fixed Amount" },
                                      {
                                        value: 2,
                                        label: "Percentage of Basic Salary",
                                      },
                                      {
                                        value: 3,
                                        label: "Percentage of Gross Salary",
                                      },
                                    ]}
                                  />
                                </div>
                              </div>
                              <Row className="g-3">
                                {/* {console.log('first', index)} */}
                                <Col md={6}>
                                  <p className="mb-1">By Employee</p>
                                  <Form.Control
                                    name={`deduction.${index}.by_employee`}
                                    onChange={props.handleChange}
                                    value={
                                      props.values.deduction[index].by_employee
                                    }
                                    type="number"
                                  />
                                </Col>
                                <Col md={6}>
                                  <p className="mb-1">By Employer</p>
                                  <Form.Control
                                    name={`deduction.${index}.by_employer`}
                                    onChange={props.handleChange}
                                    value={
                                      props.values.deduction[index].by_employer
                                    }
                                    type="number"
                                  />
                                </Col>
                                {index == 6 && (
                                  <Col md={12}>
                                    <p className="mb-1">Deduction Name</p>
                                    <Form.Control
                                      name={`deduction.${index}.name`}
                                      onChange={props.handleChange}
                                      value={props.values.deduction[index].name}
                                      type="text"
                                    />
                                  </Col>
                                )}
                              </Row>
                            </div>
                          </Form.Group>
                        ))}
                    </>
                  )}
                </FieldArray>
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
                          />
                          PLEASE WAIT...
                        </>
                      ) : (
                        <>SAVE</>
                      )}
                    </button>
                  </div>
                </Form.Group>
              </Row>
            </Form>
          )}
        </Formik>
      </Col>
    </>
  );
};

export default Deductions;
