import { FieldArray, Formik } from "formik";
import React from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { CreateAllowances } from "../../../services/authapi";
import { CREATED } from "../../../utils/constants";
import { checkPermission } from "../../../utils/checkPermissions";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";

const Allowances = ({ allUserData, roles }) => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = values.allowance.map((itm) => {
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
    const res = await CreateAllowances(sData, params);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  return (
    <Col md={12}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          allowance: [
            {
              name: "House Rent Allowance",
              applied_type: "",
              applied_on: "",
              value_type: "",
              value: "",
            },
            {
              name: "Medical Allowance",
              applied_type: "",
              applied_on: "",
              value_type: "",
              value: "",
            },
            {
              name: "Leave Travel Allowance",
              applied_type: "",
              applied_on: "",
              value_type: "",
              value: "",
            },
            {
              name: "Conveyance",
              applied_type: "",
              applied_on: "",
              value_type: "",
              value: "",
            },
            {
              name: "Dearness Allowance",
              applied_type: "",
              applied_on: "",
              value_type: "",
              value: "",
            },
            {
              name: "Children Education Allowance",
              applied_type: "",
              applied_on: "",
              value_type: "",
              value: "",
            },
            {
              name: "Pre-Requisites",
              applied_type: "",
              applied_on: "",
              value_type: "",
              value: "",
            },
            {
              name: "" || "Others",
              applied_type: "",
              applied_on: "",
              value_type: "",
              value: "",
            },
          ],
        }}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Form onSubmit={props?.handleSubmit}>
            <Row className="g-3">
              <FieldArray name="allowance">
                {() => (
                  <>
                    {props.values.allowance.length > 0 &&
                      props.values.allowance.map((allow, index) => (
                        <Form.Group as={Col} md={6} key={index}>
                          <div className="shadow p-3">
                            <p className="fw-bold">
                              {index == 7 ? "Others" : allow?.name}
                            </p>
                            <div className="d-align justify-content-start gap-4">
                              <Form.Check
                                type="radio"
                                name={`allowance.${index}.applied_type`}
                                id={`allowance.${index}.applied_type_employee`}
                                label="Employee-Wise"
                                value={1}
                                checked={
                                  props.values.allowance[index].applied_type ===
                                  1
                                }
                                onChange={() => {
                                  props.setFieldValue(
                                    `allowance.${index}.applied_type`,
                                    1
                                  );
                                  props.setFieldValue(
                                    `allowance.${index}.applied_on`,
                                    null
                                  );
                                }}
                              />
                              <Form.Check
                                type="radio"
                                name={`allowance.${index}.applied_type`}
                                id={`allowance.${index}.applied_type_designation`}
                                label="Designation-Wise"
                                value={2}
                                checked={
                                  props.values.allowance[index].applied_type ===
                                  2
                                }
                                onChange={() => {
                                  props.setFieldValue(
                                    `allowance.${index}.applied_type`,
                                    2
                                  );
                                  props.setFieldValue(
                                    `allowance.${index}.applied_on`,
                                    null
                                  );
                                }}
                              />
                            </div>
                            <Form.Group className="my-3" as={Col} md={12}>
                              {props.values.allowance[index].applied_type ===
                                1 && (
                                <>
                                  <Form.Label>Select Employee:</Form.Label>
                                  <Select
                                    isMulti
                                    className="text-primary w-100"
                                    menuPortalTarget={document.body}
                                    name={`allowance.${index}.applied_on`}
                                    options={allUserData?.map((user) => ({
                                      label: user.name,
                                      value: user.id,
                                    }))}
                                    value={
                                      props.values.allowance[index].applied_on
                                    }
                                    onChange={(selectedOption) => {
                                      props.setFieldValue(
                                        `allowance.${index}.applied_on`,
                                        selectedOption
                                      );
                                    }}
                                  />
                                </>
                              )}
                              {props.values.allowance[index].applied_type ===
                                2 && (
                                <>
                                  <Form.Label>Select Designation:</Form.Label>
                                  <Select
                                    isMulti
                                    className="text-primary w-100"
                                    menuPortalTarget={document.body}
                                    name={`allowance.${index}.applied_on`}
                                    options={roles?.map((role) => ({
                                      label: role.name,
                                      value: role.id,
                                    }))}
                                    value={
                                      props.values.allowance[index].applied_on
                                    }
                                    onChange={(selectedOption) => {
                                      props.setFieldValue(
                                        `allowance.${index}.applied_on`,
                                        selectedOption
                                      );
                                    }}
                                  />
                                </>
                              )}
                            </Form.Group>
                            <div className="d-align justify-content-start gap-4">
                              <div className="w-100 position-relative">
                                <p className="mb-1">Allowance Type</p>
                                <Select
                                  menuPortalTarget={document.body}
                                  value={
                                    props.values.allowance[index].value_type
                                  }
                                  onChange={(selectedOption) => {
                                    props.setFieldValue(
                                      `allowance.${index}.value_type`,
                                      selectedOption
                                    );
                                  }}
                                  name={`allowance.${index}.value_type`}
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
                              <div>
                                <p className="mb-1">Value</p>
                                <Form.Control
                                  name={`allowance.${index}.value`}
                                  onChange={props.handleChange}
                                  value={props.values.allowance[index].value}
                                  type="number"
                                />
                              </div>
                            </div>
                            {index == 7 && (
                              <Col md={12} className="mt-3">
                                <p className="mb-1">Allowance Name</p>
                                <Form.Control
                                  name={`allowance.${index}.name`}
                                  onChange={props.handleChange}
                                  value={props.values.allowance[index].name}
                                  type="text"
                                />
                              </Col>
                            )}
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
  );
};

export default Allowances;
