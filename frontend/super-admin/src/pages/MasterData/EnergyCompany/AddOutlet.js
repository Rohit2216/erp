import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Form, FormText, Row, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardComponent from "../../../components/CardComponent";
import {
  addAdminOutlet,
  getAdminDistrictOnSaId,
  getAdminEnergyCompanyassignZone,
  getAllEneryComnies,
  getOutletById,
  getRoOnZoneId,
  getSalesOnRoId,
  updateAdminOutlet,
} from "../../../services/authapi";
import {
  addOutletsSchema,
  updateOutletsSchema,
} from "../../../utils/formSchema";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../utils/constants";

const AddOutlet = () => {
  const { id } = useParams();
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [allEnergy, setAllEnergy] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [edit, setEdit] = useState({});

  const navigate = useNavigate();

  const fetchOutletById = async () => {
    const res = await getOutletById(id);
    if (res.status) {
      fetchZoneData(res.data.energy_company_id);
      fetchRoData(res.data.zone_id);
      fetchSaData(res.data.regional_office_id);
      fetchDistrictData(res.data.sales_area_id);
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("outlet_image", e.target.files[0]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("id", values.id);
    formData.append("energy_company_id", values.energy_company_id);
    formData.append("zone_id", values.zone_id);
    formData.append("regional_id", values.regional_id);
    formData.append("sales_area_id", values.sales_area_id);
    formData.append("district_id", values.district_id || 0);
    formData.append("outlet_unique_id", values.outlet_unique_id);
    formData.append("outlet_name", values.outlet_name);
    formData.append("outlet_contact_number", values.outlet_contact_number);
    formData.append(
      "outlet_contact_person_name",
      values.outlet_contact_person_name
    );
    formData.append("customer_code", values.customer_code);
    formData.append("outlet_category", values.outlet_category);
    formData.append("outlet_ccnoms", values.outlet_ccnoms);
    formData.append("outlet_ccnohsd", values.outlet_ccnohsd);
    formData.append("image", values.outlet_image);
    formData.append("primary_number", values.primary_number);
    formData.append("secondary_number", values.secondary_number);
    formData.append("primary_email", values.primary_email);
    formData.append("secondary_email", values.secondary_email);
    formData.append("location", values.location);
    formData.append("address", values.address);
    formData.append("outlet_resv", values.outlet_resv);
    formData.append("outlet_longitude", values.outlet_longitude);
    formData.append("outlet_lattitude", values.outlet_lattitude);
    formData.append("status", values.status);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("user_id", edit.user_id);
    //return console.log(formData)

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    const res = edit.id
      ? await updateAdminOutlet(formData, params)
      : await addAdminOutlet(formData, params);
    if (res.status) {
      toast.success(res.message);
      navigate("/OutletsMasterdata");
      resetForm();
    } else {
      toast.error(res.message);
      setShowAlert(false);
    }
    setSubmitting(false);
  };

  const handleEneryChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("energy_company_id", val);
    }
    if (!val) return false;
    fetchZoneData(val);
  };

  const handleZoneChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("zone_id", val);
    }
    if (!val) return false;
    fetchRoData(val);
  };
  const handleRoChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("regional_id", val);
    }
    if (!val) return false;
    fetchSaData(val);
  };
  const handleSaChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("sales_area_id", val);
    }
    if (!val) return false;
    fetchDistrictData(val);
  };

  // Only Use for Zone Name
  const fetchZoneData = async (energy_company_id) => {
    const res = await getAdminEnergyCompanyassignZone(energy_company_id);
    if (res.status) {
      setAllZones(res.data);
    } else {
      setAllZones([]);
      toast.error(res.message);
    }
  };

  // Only Use for Regional Office
  const fetchRoData = async (zone_id) => {
    const res = await getRoOnZoneId(zone_id);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
      toast.error(res.message);
    }
    // console.log("ro", allRo);
  };

  // Only Use for Sales Area
  const fetchSaData = async (ro_id) => {
    const res = await getSalesOnRoId(ro_id);
    if (res.status) {
      setAllSa(res.data);
    } else {
      toast.error(res.message);
      setAllSa([]);
    }
  };

  // Only Use for District
  const fetchDistrictData = async (sales_area_id) => {
    const res = await getAdminDistrictOnSaId(sales_area_id);
    if (res.status) {
      setAllDistrict(res.data);
    } else {
      toast.error(res.message);
      setAllDistrict([]);
    }
  };

  // Only Use for Energy Company
  const fetchEnergyData = async () => {
    const res = await getAllEneryComnies();
    if (res.status) {
      setAllEnergy(res.data);
    } else {
      setAllEnergy([]);
    }
  };

  useEffect(() => {
    fetchEnergyData();
    if (id) {
      fetchOutletById();
    }
  }, []);
  return (
    <>
      <Col md={12}>
        <CardComponent
          title={edit.zone_id ? "UPDATE - Outlets" : "ADD - Outlets"}
        >
          <Row className="g-3">
            <Formik
              enableReinitialize={true}
              initialValues={{
                id: edit.id || "",
                energy_company_id: edit.energy_company_id || "",
                zone_id: edit.zone_id || "",
                regional_id: edit.regional_office_id || "",
                sales_area_id: edit.sales_area_id || "",
                district_id: edit.district_id || "",
                outlet_unique_id: edit.outlet_unique_id || "",
                outlet_name: edit.outlet_name || "",
                outlet_contact_number: edit.outlet_contact_number || "",
                customer_code: edit.customer_code || "",
                outlet_category: edit.outlet_category || "",
                outlet_ccnoms: edit.outlet_ccnoms || "",
                outlet_ccnohsd: edit.outlet_ccnohsd || "",
                outlet_image: edit.outlet_image || null,
                outlet_contact_person_name:
                  edit.outlet_contact_person_name || "",
                primary_number: edit.primary_number || "",
                secondary_number: edit.secondary_number || "",
                primary_email: edit.primary_email || "",
                secondary_email: edit.secondary_email || "",
                location: edit.location || "",
                address: edit.address || "",
                outlet_resv: edit.outlet_resv || "",
                outlet_longitude: edit.outlet_longitude || "",
                outlet_lattitude: edit.outlet_lattitude || "",
                status: edit?.status === 0 ? edit?.status : edit?.status || 1,
                email: edit.email || "",
                password: edit.password || "",
              }}
              validationSchema={
                edit?.id ? updateOutletsSchema : addOutletsSchema
              }
              onSubmit={handleSubmit}
            >
              {/* {console.log(initialValues)} */}
              {(props) => (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-2">
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Energy Company Name{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name={"energy_company_id"}
                        value={props.values.energy_company_id}
                        onChange={(e) =>
                          handleEneryChange(e.target.value, props.setFieldValue)
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.energy_company_id &&
                            props.errors.energy_company_id
                        )}
                      >
                        <option>--Select--</option>
                        {allEnergy.map((zone) => (
                          <option
                            key={zone.energy_company_id}
                            value={zone.energy_company_id}
                          >
                            {zone.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {props.errors.energy_company_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Zone Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name={"zone_id"}
                        value={props.values.zone_id}
                        onChange={(e) =>
                          handleZoneChange(e.target.value, props.setFieldValue)
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.zone_id && props.errors.zone_id
                        )}
                      >
                        <option>--Select--</option>
                        {allZones.map((zone) => (
                          <option key={zone.zone_id} value={zone.zone_id}>
                            {zone.zone_name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {props.errors.zone_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Regional Office Name{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name={"regional_id"}
                        value={props.values.regional_id}
                        onChange={(e) =>
                          handleRoChange(e.target.value, props.setFieldValue)
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.regional_id && props.errors.regional_id
                        )}
                      >
                        <option>--Select--</option>
                        {allRo.map((ro) => (
                          <option key={ro.regional_id} value={ro.ro_id}>
                            {ro.regional_office_name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {props.errors.regional_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Sales Area Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name={"sales_area_id"}
                        value={props.values.sales_area_id}
                        onChange={(e) =>
                          handleSaChange(e.target.value, props.setFieldValue)
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.sales_area_id &&
                            props.errors.sales_area_id
                        )}
                      >
                        <option>--Select--</option>
                        {allSa.map((sa) => (
                          <option key={sa.sales_area_id} value={sa.id}>
                            {sa.sales_area_name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {props.errors.sales_area_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        District Name
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <Form.Select
                        name={"district_id"}
                        value={props.values.district_id}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.district_id && props.errors.district_id
                        )}
                      >
                        <option>--Select--</option>
                        {allDistrict.map((district) => (
                          <option
                            key={district.id}
                            value={district.district_id}
                          >
                            {district.district_name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {props.errors.district_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        outlet unique id <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"outlet_unique_id"}
                        value={props.values.outlet_unique_id}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.outlet_unique_id &&
                            props.errors.outlet_unique_id
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.outlet_unique_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Outlet Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"outlet_name"}
                        value={props.values.outlet_name}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.outlet_name && props.errors.outlet_name
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.outlet_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Outlet Contact Number{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        name={"outlet_contact_number"}
                        value={props.values.outlet_contact_number}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.outlet_contact_number &&
                            props.errors.outlet_contact_number
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.outlet_contact_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Customer Code <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"customer_code"}
                        value={props.values.customer_code}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.customer_code &&
                            props.errors.customer_code
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.customer_code}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Outlet Category <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"outlet_category"}
                        value={props.values.outlet_category}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.outlet_category &&
                            props.errors.outlet_category
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.outlet_category}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Outlet ccnoms <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"outlet_ccnoms"}
                        value={props.values.outlet_ccnoms}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.outlet_ccnoms &&
                            props.errors.outlet_ccnoms
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.outlet_ccnoms}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Outlet ccnohsd <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"outlet_ccnohsd"}
                        value={props.values.outlet_ccnohsd}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.outlet_ccnohsd &&
                            props.errors.outlet_ccnohsd
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.outlet_ccnohsd}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {edit.zone_id ? (
                      <>
                        <Form.Group as={Col} md={1}>
                          <img
                            width={50}
                            className="my-bg p-1 rounded"
                            src={
                              process.env.REACT_APP_API_URL + edit?.outlet_image
                            }
                            alt={edit?.name}
                          />{" "}
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                          <Form.Control
                            type="file"
                            name={"outlet_image"}
                            onChange={(e) =>
                              handleFileChange(e, props.setFieldValue)
                            }
                          />
                        </Form.Group>
                      </>
                    ) : (
                      <Form.Group as={Col} md={4}>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                          type="file"
                          name={"outlet_image"}
                          onChange={(e) =>
                            handleFileChange(e, props.setFieldValue)
                          }
                        />
                      </Form.Group>
                    )}
                    <Form.Group as={Col} md="4">
                      <Form.Label>outlet Contact person name</Form.Label>
                      <Form.Control
                        type="text"
                        name={"outlet_contact_person_name"}
                        value={props.values.outlet_contact_person_name}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>primary number</Form.Label>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        name={"primary_number"}
                        value={props.values.primary_number}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>secondary number</Form.Label>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        name={"secondary_number"}
                        value={props.values.secondary_number}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>primary email</Form.Label>
                      <Form.Control
                        type="email"
                        name={"primary_email"}
                        value={props.values.primary_email}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>secondary email</Form.Label>
                      <Form.Control
                        type="email"
                        name={"secondary_email"}
                        value={props.values.secondary_email}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>location</Form.Label>
                      <Form.Control
                        type="text"
                        name={"location"}
                        value={props.values.location}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        address <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"address"}
                        value={props.values.address}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>outlet resv</Form.Label>
                      <Form.Control
                        type="text"
                        name={"outlet_resv"}
                        value={props.values.outlet_resv}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>outlet longitude</Form.Label>
                      <Form.Control
                        type="text"
                        name={"outlet_longitude"}
                        value={props.values.outlet_longitude}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>outlet lattitude</Form.Label>
                      <Form.Control
                        type="text"
                        name={"outlet_lattitude"}
                        value={props.values.outlet_lattitude}
                        onChange={props.handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Outlet Status</Form.Label>
                      <Form.Select
                        name={"status"}
                        value={props.values.status}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      >
                        <option>--Select--</option>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                      <div className="shadow mt-2 p-3">
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column>
                            User Email{" "}
                            <span className="text-danger fw-bold">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="email"
                              value={props.values.email}
                              onChange={props.handleChange}
                              name={"email"}
                              onBlur={props.handleBlur}
                              isInvalid={Boolean(
                                props.touched.email && props.errors.email
                              )}
                            />
                            <Form.Control.Feedback type="invalid">
                              {props.errors.email}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column>
                            Password{" "}
                            {edit?.id ? null : (
                              <span className="text-danger fw-bold">*</span>
                            )}
                          </Form.Label>
                          <Col sm={8}>
                            <div className="d-grid gap-1">
                              <Form.Control
                                type="password"
                                value={props.values.password}
                                onChange={props.handleChange}
                                name="password"
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.password &&
                                    props.errors.password
                                )}
                              />
                              <Form.Control.Feedback type="invalid">
                                {props.errors.password}
                              </Form.Control.Feedback>
                              {edit?.id ? (
                                <FormText>
                                  Password is encrypted. If you don't want to
                                  change it, leave it blank.
                                </FormText>
                              ) : null}
                            </div>
                          </Col>
                        </Form.Group>
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                      <div className="text-center">
                        <button
                          type={`${edit.zone_id ? "button" : "submit"}`}
                          onClick={() => setShowAlert(edit.zone_id && true)}
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
                            <>{edit.zone_id ? "UPDATE" : "SAVE"}</>
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

export default AddOutlet;
