import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardComponent from "../../../components/CardComponent";
import {
  addAdminEnergy,
  getAdminSingleEnergy,
  updateAdminEnergy,
} from "../../../services/authapi";
import { addEnergySchema } from "../../../utils/formSchema";
import TextareaAutosize from "react-textarea-autosize";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../utils/constants";

const AddEnergyCompany = () => {
  const { id } = useParams();
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const navigate = useNavigate();

  const fetchEnergyById = async () => {
    const res = await getAdminSingleEnergy(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("energy_company_id", edit.ec_id);
    formData.append("id", edit.user_id);
    formData.append("company_name", values.company_name);
    formData.append("website_url", values.website_url);
    formData.append("email", values.email);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("contact_no", values.contact_no);
    formData.append("alt_number", values.alt_number);
    formData.append("address_1", values.address_1);
    formData.append("gst_number", values.gst_number);
    formData.append("zone_id", values.zone_id);
    formData.append("ro_id", values.ro_id);
    formData.append("sale_area_id", values.sale_area_id);
    formData.append("status", values.status);
    formData.append("country", values.country);
    formData.append("city", values.city);
    formData.append("pin_code", values.pin_code);
    formData.append("description", values.description);

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.ec_id ? UPDATED : CREATED;

    // return console.log(formData);
    const res = edit.ec_id
      ? await updateAdminEnergy(formData, params)
      : await addAdminEnergy(formData, params);
    if (res.status) {
      toast.success(res.message);
      navigate("/EnergyMasterdata");
    } else {
      toast.error(res.message);
      setShowAlert(false);
    }
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchEnergyById();
    }
  }, [id]);

  return (
    <>
      <Col md={12}>
        <CardComponent
          title={
            edit.ec_id ? "Update - Energy Company" : "Add - Energy Company"
          }
        >
          <Row className="g-3">
            <Formik
              enableReinitialize={true}
              initialValues={{
                company_name: edit.company_name || "",
                website_url: edit.website_url || "",
                email: edit.email || "",
                username: edit.username || "",
                password: edit.password || "",
                contact_no: edit.contact_no || "",
                alt_number: edit.alt_number || "",
                gst_number: edit.gst_number || "",
                address_1: edit.address_1 || "",
                zone_id: edit.zone_id || "",
                ro_id: edit.ro_id || "",
                sale_area_id: edit.sale_area_id || "",
                status: edit.status || 1,
                country: edit.country || "",
                city: edit.city || "",
                pin_code: edit.pin_code || "",
                image: edit.image || null,
                description: edit.description || "",
              }}
              validationSchema={addEnergySchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    <Form.Group as={Col} md="4">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        name={"company_name"}
                        value={props.values.company_name}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.company_name &&
                            props.errors.company_name
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.company_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>website url</Form.Label>
                      <Form.Control
                        type="text"
                        name={"website_url"}
                        value={props.values.website_url}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.website_url && props.errors.website_url
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.website_url}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Email <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name={"email"}
                        value={props.values.email}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.email && props.errors.email
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        user name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"username"}
                        value={props.values.username}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.username && props.errors.username
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {!edit.ec_id ? (
                      <Form.Group as={Col} md="4">
                        <Form.Label>
                          Password <span className="text-danger">*</span>
                        </Form.Label>
                        <span className="position-relative pass">
                          <Form.Control
                            type={passwordShown ? "text" : "password"}
                            name={"password"}
                            value={props.values.password}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.password && props.errors.password
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.password}
                          </Form.Control.Feedback>
                          <span
                            className="float-end text-gray cursor-pointer pass-icon"
                            onClick={togglePassword}
                          >
                            {passwordShown ? <BsEye /> : <BsEyeSlash />}
                          </span>
                        </span>
                      </Form.Group>
                    ) : null}
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        contact no <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        name={"contact_no"}
                        value={props.values.contact_no}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.contact_no && props.errors.contact_no
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.contact_no}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>alt number</Form.Label>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        name={"alt_number"}
                        value={props.values.alt_number}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.alt_number && props.errors.alt_number
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.alt_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>address</Form.Label>
                      <Form.Control
                        type="text"
                        name={"address_1"}
                        value={props.values.address_1}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.address_1 && props.errors.address_1
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.address_1}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>gst number</Form.Label>
                      <Form.Control
                        type="text"
                        name={"gst_number"}
                        value={props.values.gst_number}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.gst_number && props.errors.gst_number
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.gst_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name={"status"}
                        value={props.values.status}
                        onChange={props.handleChange}
                      >
                        <option>--Select--</option>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>country</Form.Label>
                      <Form.Control
                        type="text"
                        name={"country"}
                        value={props.values.country}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.country && props.errors.country
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.country}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>city</Form.Label>
                      <Form.Control
                        type="text"
                        name={"city"}
                        value={props.values.city}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.city && props.errors.city
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>pin code</Form.Label>
                      <Form.Control
                        type="text"
                        name={"pin_code"}
                        value={props.values.pin_code}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.pin_code && props.errors.pin_code
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.pin_code}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                      <Form.Label>Description</Form.Label>
                      <TextareaAutosize
                        minRows={0}
                        className="edit-textarea"
                        name={"description"}
                        value={props.values.description}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                      <div className="text-center">
                        <button
                          type={`${edit.ec_id ? "button" : "submit"}`}
                          onClick={() => setShowAlert(edit.ec_id && true)}
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
                            <>{edit.ec_id ? "UPDATE" : "SAVE"}</>
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
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default AddEnergyCompany;
