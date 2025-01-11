import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Select from "react-select";
import {
  BsEyeFill,
  BsPencilSquare,
  BsPersonAdd,
  BsPersonPlus,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import { Helmet } from "react-helmet";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
  deleteAdminEnergy,
  getAdminAllRegionalOffices,
  getAdminZone,
  getAllAreaNameByAreaId,
  getAllEnergyCompanyOnly,
  getEnergyCheckRelated,
  getEnergyDeleteRelated,
  postZoneUser,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import Modaljs from "../../../components/Modal";
import { ErrorMessage, Formik } from "formik";
import { Form } from "react-bootstrap";
import {
  addEnergySchema,
  addEnergySchemaOnly,
} from "../../../utils/formSchema";
import TextareaAutosize from "react-textarea-autosize";
import TooltipComponent from "../../../components/TooltipComponent";
import { t } from "i18next";
import { Link, useLocation } from "react-router-dom";
import { checkPermission } from "../../../utils/checkPermissions";
import { DELETED } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";

const EnergyMasterdata = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [energyShow, setEnergyShow] = useState(false);
  const [allEnergy, setAllEnergy] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [permanentDlt, setPermanentDlt] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [deleteCompany, setDeleteCompany] = useState(false);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [edit, setEdit] = useState({});
  const [deleteData, setDeleteData] = useState([]);
  const [allAreaName, setAllAreaName] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [energyData, setEnergyData] = useState({});
  const [typeModal, setTypeModal] = useState("");

  // all Energy
  const fetchAllEnergyData = async () => {
    const res = await getAllEnergyCompanyOnly();
    if (res.status) {
      setAllEnergy(res.data);
      setEdit(res.data);
    } else {
      setAllEnergy([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log(values)
    const sData = {
      email: values.email,
      username: values.username,
      password: values.password,
      contact_no: values.contact_no,
      alt_number: values.alt_number,
      address_1: values.address_1,
      gst_number: values.gst_number,
      status: values.status.value,
      country: values.country,
      city: values.city,
      pin_code: values.pin_code,
      description: values.description,
    };

    if (typeModal) {
      sData["energy_company_id"] = energyData?.energy_company_id;
      sData["joining_date"] = values.joining_date;
      sData["area_name"] = values.area_name.value;
      sData["area_selected"] = values.area_selected.value;
    }

    // return console.log("sData", sData);
    const res = typeModal
      ? await postZoneUser(sData)
      : await deleteAdminEnergy(idToDelete, sData);
    if (res.status) {
      toast.success(res.message);
      setEnergyShow(false);
    } else {
      toast.error(res.message);
    }
    fetchAllEnergyData();
    setIdToDelete("");
    resetForm();
    setSubmitting(false);
  };
  // all zones
  const fetchZoneData = async () => {
    const res = await getAdminZone();
    if (res.status) {
      setAllZones(res.data);
    } else {
      setAllZones([]);
    }
  };
  // all ro
  const fetchRoData = async () => {
    const res = await getAdminAllRegionalOffices();
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };

  const handleAreaChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("area_name", val);
    }
    if (!val) return false;
    fetchAllAreaByAreaId(val);
  };

  const fetchAllAreaByAreaId = async (type) => {
    const res = await getAllAreaNameByAreaId(
      energyData?.energy_company_id,
      type
    );
    if (res.status) {
      setAllAreaName(res.data);
      setSelectedValue(res?.selectedValue);
    } else {
      setAllAreaName([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAllEnergyData();
    fetchZoneData();
    fetchRoData();
  }, []);

  const assignclickhandler = (ec, new_user) => {
    setIdToDelete(ec.user_id);
    setTypeModal(new_user);
    setEnergyShow(true);
    setEnergyData(ec);
  };

  const deleteclickhandler = async (ec) => {
    const res = await getEnergyCheckRelated(ec.energy_company_id);
    if (res.status) {
      setDeleteData(res.data);
    } else {
      setDeleteData([]);
    }
    setDeleteId(ec.energy_company_id);
    setDeleteCompany(true);
  };

  const handleDeleteSubmit = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    // const value = permanentDlt == true ? 1 : 0
    const sData = {
      energy_company_id: deleteId,
      delete_all: permanentDlt === "1" ? 1 : 0,
    };
    // return console.log('sData', sData)
    const res = await getEnergyDeleteRelated(sData, params);
    if (res.status) {
      toast.success(res.message);
      if (permanentDlt === "1") {
        setAllEnergy((prev) =>
          prev.filter((itm) => itm.energy_company_id !== deleteId)
        );
      }
    } else {
      toast.error(res.message);
    }
    setDeleteCompany(false);
  };
  return (
    <>
      <Helmet>
        <title>Energy · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent title={"Energy"}>
          <Row className="g-4">
            <Col md={9}>
              <CardComponent
                title={"Energy Company Users"}
                icon={<BsPlus />}
                link={"/EnergyMasterdata/AddEnergyCompany/new"}
                tag={"Add Company"}
              >
                <div className=" gap-2">
                  {allEnergy.length > 0 ? null : (
                    <div className="text-center">
                      <img
                        className="p-3"
                        alt="no-result"
                        width="300"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </div>
                  )}
                  {allEnergy.map((ec, id3) => (
                    <div key={id3} className="hstack gap-2 m-2">
                      <div className="social-btn px-2 w-100 lh-1 text-truncate">
                        ({ec?.energy_company_id}){ec?.name}
                        <span className="small text-danger">
                          {ec?.is_deleted === 1 && "(Soft Delete)"}
                        </span>
                      </div>
                      <span className={`d-align gap-2`}>
                        <TooltipComponent title={t("View")}>
                          <Button
                            className="view-btn"
                            variant="light"
                            as={Link}
                            to={`/EnergyMasterdata/ViewEnergyCompanyDetails/${ec.energy_company_id}`}
                          >
                            <BsEyeFill className={`social-btn success-combo`} />
                          </Button>
                        </TooltipComponent>
                        <div className={`vr hr-shadow`} />
                        <TooltipComponent title={t("Edit")}>
                          <Button
                            className="view-btn"
                            variant="light"
                            as={Link}
                            to={`/EnergyMasterdata/AddEnergyCompany/${ec.energy_company_id}`}
                          >
                            <BsPencilSquare
                              className={`social-btn danger-combo`}
                            />
                          </Button>
                        </TooltipComponent>
                        <div className={`vr hr-shadow`} />
                        <TooltipComponent title={t("Assign New User")}>
                          <BsPersonPlus
                            onClick={() => assignclickhandler(ec)}
                            className={`social-btn danger-combo`}
                          />
                        </TooltipComponent>
                        <div className={`vr hr-shadow`} />
                        <TooltipComponent title={t("Add New User")}>
                          <BsPersonAdd
                            onClick={() => assignclickhandler(ec, "new user")}
                            className={`social-btn danger-combo`}
                          />
                        </TooltipComponent>
                        <div className={`vr hr-shadow`} />
                        <TooltipComponent title={t("Delete")}>
                          <BsTrash
                            onClick={() => deleteclickhandler(ec)}
                            className={`social-btn red-combo`}
                          />
                        </TooltipComponent>
                      </span>
                    </div>
                  ))}
                </div>
              </CardComponent>
            </Col>
            <Col md={3}>
              <Row className="g-4 position-sticky top-0">
                <Col md={12}>
                  <CardComponent classbody={"feedback-area"} title={"Zones"}>
                    <SimpleBar className="area">
                      <div className="d-grid gap-2 last-child-none">
                        {allZones.length > 0 ? null : (
                          <div className="text-center">
                            <img
                              alt="no-result"
                              width="100"
                              src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                            />
                          </div>
                        )}
                        {allZones.map((zone, id1) => (
                          <p
                            key={id1}
                            className="hr-border2 mb-0 pb-1 text-truncate"
                          >
                            {zone.zone_name}
                          </p>
                        ))}
                      </div>
                    </SimpleBar>
                  </CardComponent>
                </Col>
                <Col md={12}>
                  <CardComponent
                    classbody={"feedback-area"}
                    title={"Regional Offices"}
                  >
                    <SimpleBar className="area">
                      <div className="d-grid gap-2 last-child-none">
                        {allRo.length > 0 ? null : (
                          <div className="text-center">
                            <img
                              alt="no-result"
                              width="100"
                              src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                            />
                          </div>
                        )}
                        {allRo.map((ro, id2) => (
                          <p
                            key={id2}
                            className="hr-border2 mb-0 pb-1 text-truncate"
                          >
                            {ro.regional_office_name}
                          </p>
                        ))}
                      </div>
                    </SimpleBar>
                  </CardComponent>
                </Col>
              </Row>
            </Col>

            <ConfirmAlert
              size={"sm"}
              deleteFunction={() => setEnergyShow(true)}
              hide={setShowAlert}
              show={showAlert}
              title={"Confirm Delete"}
              description={
                "If you want to delete that energy company you have to assign new user!!"
              }
            />
            <Formik
              enableReinitialize={true}
              initialValues={{
                email: edit.email || "",
                username: edit.username || "",
                password: edit.password || "",
                contact_no: edit.contact_no || "",
                alt_number: edit.alt_number || "",
                gst_number: edit.gst_number || "",
                address_1: edit.address_1 || "",
                // zone_id: edit.zone_id || "",
                // ro_id: edit.ro_id || "",
                // sale_area_id: edit.sale_area_id || "",
                status: edit.status
                  ? {
                      label: edit.status === "1" ? "Active" : "InActive",
                      value: parseInt(edit.status),
                    }
                  : { label: "Active", value: 1 },
                joining_date: edit.joining_date || "",
                area_name: edit.area_name || "",
                area_selected: edit.area_selected || "",
                country: edit.country || "",
                city: edit.city || "",
                pin_code: edit.pin_code || "",
                description: edit.description || "",
              }}
              validationSchema={
                typeModal ? addEnergySchemaOnly : addEnergySchema
              }
              onSubmit={handleSubmit}
            >
              {/* {console.log(initialValues)} */}
              {(props) => (
                <Modaljs
                  formikProps={props}
                  open={energyShow}
                  size={"md"}
                  closebtn={"Cancel"}
                  Savebtn={`${typeModal ? "Add" : "Assign"}`}
                  close={() => setEnergyShow(false)}
                  title={`${typeModal ? "Add" : "Assign"} New User For ${
                    energyData?.name
                  }`}
                >
                  <Form onSubmit={props.handleSubmit}>
                    {typeModal !== "new user" ? (
                      <small className="text-gray">
                        {" "}
                        If you want to delete that energy company you have to
                        assign new user!!{" "}
                      </small>
                    ) : null}
                    <Row className="mt-2 g-2">
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
                          username <span className="text-danger">*</span>
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
                          <Form.Label>password</Form.Label>
                          <Form.Control
                            type="password"
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
                      <Form.Group as={Col} md="12">
                        <Form.Label>address</Form.Label>
                        <TextareaAutosize
                          minRows={2}
                          className="edit-textarea"
                          name={"address_1"}
                          value={props.values.address_1}
                          onChange={props.handleChange}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="6">
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
                      <Form.Group as={Col} md="6">
                        <Form.Label>Status</Form.Label>
                        <Select
                          menuPosition="fixed"
                          name={"status"}
                          options={[
                            { label: "Active", value: 1 },
                            { label: "Inactive", value: 0 },
                          ]}
                          value={props.values.status}
                          onChange={(selectedOption) => {
                            props.setFieldValue("status", selectedOption);
                          }}
                        />
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
                      {typeModal ? (
                        <>
                          <Form.Group as={Col} md="6">
                            <Form.Label>
                              Joining Date{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name={"joining_date"}
                              value={props.values.joining_date}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              isInvalid={Boolean(
                                props.touched.joining_date &&
                                  props.errors.joining_date
                              )}
                            />
                            <Form.Control.Feedback type="invalid">
                              {props.errors.joining_date}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="6">
                            <Form.Label>
                              Area Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                              className="text-primary w-100"
                              menuPosition="fixed"
                              name="area_name"
                              options={[
                                {
                                  label: "Zone",
                                  value: 1,
                                },
                                {
                                  label: "Regional",
                                  value: 2,
                                },
                                {
                                  label: "Sales Area",
                                  value: 3,
                                },
                                {
                                  label: "District",
                                  value: 4,
                                },
                                {
                                  label: "Outlets",
                                  value: 5,
                                },
                              ]}
                              value={props.values.area_name}
                              onChange={(val) => {
                                handleAreaChange(
                                  val.value,
                                  props.setFieldValue
                                );
                                props.setFieldValue("area_name", val);
                                props.setFieldValue("area_selected", null);
                              }}
                            />
                            <ErrorMessage
                              name="area_name"
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>
                          {selectedValue ? (
                            <Form.Group as={Col} md="6">
                              <Form.Label>
                                {selectedValue}{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                menuPosition="fixed"
                                name={"area_selected"}
                                options={allAreaName.map((type) => ({
                                  label: type.area_name,
                                  value: type.id,
                                }))}
                                value={props.values.area_selected}
                                onChange={(selectedOption) => {
                                  props.setFieldValue(
                                    "area_selected",
                                    selectedOption
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="area_selected"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                          ) : null}
                        </>
                      ) : null}
                      <Form.Group as={Col} md="12">
                        <Form.Label>Description</Form.Label>
                        <TextareaAutosize
                          minRows={2}
                          className="edit-textarea"
                          name={"description"}
                          value={props.values.description}
                          onChange={props.handleChange}
                        />
                      </Form.Group>
                    </Row>
                  </Form>
                </Modaljs>
              )}
            </Formik>

            <Formik
              enableReinitialize={true}
              initialValues={{
                energy_company_id: "",
                delete_all: "",
              }}
              // validationSchema={addEnergySchema}
              onSubmit={handleDeleteSubmit}
            >
              {/* {console.log(initialValues)} */}
              {(props) => (
                <Modaljs
                  formikProps={props}
                  newButtonType={"submit"}
                  newButtonOnclick={() => setPermanentDlt("1")}
                  newButtonTitle={"Permanent Delete"}
                  open={deleteCompany}
                  size={"md"}
                  closebtn={"Cancel"}
                  newButtonClass={"red-combo"}
                  Savebtn={"Soft Delete"}
                  close={() => setDeleteCompany(false)}
                  title={`Delete Company`}
                >
                  <Form onSubmit={props.handleSubmit}>
                    <Row className="g-2">
                      {deleteData?.length > 0 ? null : (
                        <div className="text-center">
                          <img
                            className="p-3"
                            alt="no-result"
                            width="250"
                            src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                          />
                        </div>
                      )}
                      {deleteData?.map((data, id1) => (
                        <Fragment key={id1}>
                          {data?.complaint_type_data?.map((data1, idx) => (
                            <Fragment key={idx}>
                              {idx == 0 && <span> Complaint Type Data</span>}
                              <Form.Group key={idx} as={Col} md="6">
                                <Form.Control
                                  disabled
                                  value={data1?.complaint_type_name}
                                />
                              </Form.Group>
                            </Fragment>
                          ))}
                          {data?.complaint_data?.map((data2, id2) => (
                            <Fragment key={id2}>
                              {id2 == 0 && (
                                <>
                                  <Form.Group
                                    className="py-1 hr-border2"
                                    md="12"
                                  />
                                  <span>Complaint Data</span>
                                </>
                              )}
                              <Form.Group as={Col} md="6">
                                <Form.Control
                                  disabled
                                  value={data2?.complaint_type_name}
                                />
                              </Form.Group>
                            </Fragment>
                          ))}
                        </Fragment>
                      ))}
                    </Row>
                  </Form>
                </Modaljs>
              )}
            </Formik>
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default EnergyMasterdata;
