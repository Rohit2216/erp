import React, { useEffect, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsCheckLg, BsPlus, BsXLg } from "react-icons/bs";
import { toast } from "react-toastify";
import CardComponent from "../../../components/CardComponent";
// import Modaljs from "../../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import ViewedComplaint from "./ViewedComplaint";
import ApprovedComplaint from "./ApprovedComplaint";
import RejectedComplaint from "./RejectedComplaint";
import AllNewComplaint from "./AllNewComplaint";
import ResolvedComplaint from "./ResolvedComplaint";
import {
  addComplaintType,
  getAdminAllComplaintTypes,
  getAdminAllTypesComplaint,
  getAdminDistrictOnSaId,
  getAdminEnergyCompanyassignZone,
  getAllEneryComnies,
  getRoOnZoneId,
  getSalesOnRoId,
  updateComplaintType,
} from "../../../services/authapi";
import { Formik } from "formik";
import { addComplaintTypeSchema } from "../../../utils/formSchema";
import Select from "react-select";
import { useRef } from "react";
import {
  approvedComplaint,
  getOutletByDistrictId,
} from "../../../services/adminApi";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import TooltipComponent from "../../../components/TooltipComponent";

const AllComplaintsMasterdata = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [allComplaint, setAllComplaint] = useState([]);
  const [complaint, setComplaint] = useState(false);
  const [allEnergy, setAllEnergy] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [allOutlet, setOutlet] = useState([]);
  const [complaintType, setComplaintType] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [edit, setEdit] = useState({});

  const tabs = [
    {
      title: "All New Complaint",
      page: (
        <AllNewComplaint
          setEdit={setEdit}
          setComplaint={setComplaint}
          allComplaint={allComplaint.filter((e) => e.status === 1)}
        />
      ),
    },
    {
      title: "Viewed",
      page: (
        <ViewedComplaint data={allComplaint.filter((e) => e.status === 2)} />
      ),
    },
    {
      title: "Approved",
      page: (
        <ApprovedComplaint data={allComplaint.filter((e) => e.status === 3)} />
      ),
    },
    {
      title: "Rejected",
      page: (
        <RejectedComplaint data={allComplaint.filter((e) => e.status === 4)} />
      ),
    },
    {
      title: "Resolved",
      page: (
        <ResolvedComplaint data={allComplaint.filter((e) => e.status > 4)} />
      ),
    },
  ];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      energy_company_id: values.energy_company_id.value,
      zone_id: Array.of(values.zone_id.value),
      ro_id: Array.of(values.ro_id.value),
      sale_area_id: Array.of(values.sale_area_id.value),
      district_id: Array.of(values.district_id.value),
      outlet_id: Array.of(values.outlet_id.value),
      complaint_type: JSON.stringify(values.complaint_type.value),
      description: values.description,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }

    const res = edit.id
      ? await updateComplaintType(sData)
      : await addComplaintType(sData);
    if (res.status) {
      toast.success(res.message);
      setComplaint(false);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setRefresh(true);
    setSubmitting(false);
  };

  // get Zone name data on Change
  const handleEneryChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("energy_company_id", value.value);
    }
    if (!value.value) return setAllZones([]);
    const res = await getAdminEnergyCompanyassignZone(value.value);
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.zone_id,
          label: itm.zone_name,
        };
      });
      setAllZones(rData);
    } else {
      setAllZones([]);
      setvalue("energy_company_id", "");
      toast.error(res.message);
    }
  };

  // get Regional Office name data
  const handleZoneChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("zone_id", value.value);
    }
    if (!value.value) return setAllRo([]);
    const res = await getRoOnZoneId(value.value);

    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.ro_id,
          label: itm.regional_office_name,
        };
      });

      setAllRo(rData);
    } else {
      setAllRo([]);
      setvalue("zone_id", "");
      toast.error(res.message);
    }
  };

  //   get Sales area name data
  const handleRoChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("ro_id", value.value);
    }
    if (!value.value) return setAllSa([]);
    const res = await getSalesOnRoId(value.value);

    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.sales_area_name,
        };
      });
      //   console.log(rData);
      setAllSa(rData);
    } else {
      setAllSa([]);
      setvalue("ro_id", "");
      toast.error(res.message);
    }
  };

  //   get District Name Data
  const handleSaChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("sale_area_id", value.value);
    }
    if (!value.value) return setAllDistrict([]);
    const res = await getAdminDistrictOnSaId(value.value);

    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.district_id,
          label: itm.district_name,
        };
      });

      setAllDistrict(rData);
    } else {
      setAllDistrict([]);
      setvalue("sale_area_id", "");
      toast.error(res.message);
    }
  };

  //   get Outlet Name Data
  const handleOutletChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("district_id", value.value);
    }
    if (!value.value) return setOutlet([]);
    const res = await getOutletByDistrictId(value.value);

    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.outlet_name,
        };
      });
      setOutlet(rData);
    } else {
      setOutlet([]);
      setvalue("district_id", "");
      toast.error(res.message);
    }
  };

  // get Energy Company Data
  const fetchEnergyData = async () => {
    const res = await getAllEneryComnies();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.energy_company_id,
          label: itm.name,
        };
      });
      setAllEnergy(rData);
    } else {
      setAllEnergy([]);
    }
  };

  //   fetch Complain Type Data
  const fetchComplainTypeData = async () => {
    const res = await getAdminAllTypesComplaint();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.complaint_type_name,
        };
      });
      setComplaintType(rData);
    } else {
      setComplaintType([]);
    }
  };

  const fetchAllComplaintData = async () => {
    const res = await getAdminAllComplaintTypes();
    if (res.status) {
      setAllComplaint(res.data);
    } else {
      setAllComplaint([]);
    }
  };

  const handleApprovedComplaint = async () => {
    const rData = {
      id: edit.id,
      status: 3,
    };
    // return console.log(rData);
    const res = await approvedComplaint(rData);
    if (res.status) {
      toast.success(res.message);
      setComplaint(false);
    } else {
      toast.error(res.message);
    }
    setRefresh(true);
  };
  const handleRejectedComplaint = async () => {
    const rData = {
      id: edit.id,
      status: 4,
    };
    // return console.log(rData);
    const res = await approvedComplaint(rData);
    if (res.status) {
      toast.success(res.message);
      setComplaint(false);
    } else {
      toast.error(res.message);
    }
    setRefresh(true);
  };

  useEffect(() => {
    fetchAllComplaintData();
    fetchEnergyData();
    fetchComplainTypeData();
  }, [refresh]);

  const Modaljs = ({
    open,
    close,
    children,
    size,
    Savebtn,
    saveOnclick,
    className,
    closebtn,
    title,
    hideFooter,
    formikProps,
  }) => {
    const { t } = useTranslation();
    return (
      <Modal
        size={size}
        show={open}
        onHide={close}
        scrollable={true}
        backdrop="static"
        centered
        className="my-modal modal-area"
      >
        <Form onSubmit={formikProps?.handleSubmit} className="d-content">
          <Modal.Header className="table-bg py-2 m-3">
            <strong>{title}</strong>
            <div onClick={close} className="nav-link cursor-pointer">
              <BsXLg />
            </div>
          </Modal.Header>
          <Modal.Body className="pt-0">
            <SimpleBar className="area px-3">{children}</SimpleBar>
          </Modal.Body>
          <Modal.Footer className={`table-bg py-1 gap-2 ${hideFooter}`}>
            <Form.Control
              size="lg"
              type="text"
              className={`dnone ${className}`}
              placeholder="Type your comments..."
            />
            <Button className="bg-new text-uppercase text-gray" onClick={close}>
              {t(closebtn)}
            </Button>{" "}
            <div className="vr hr-shadow" />
            {edit.id ? (
              <>
                <TooltipComponent title={"Reject"}>
                  <span
                    onClick={() => handleRejectedComplaint()}
                    className="shadow social-btn-re d-align gap-2 px-3 w-auto red-combo"
                  >
                    <BsXLg />
                  </span>
                </TooltipComponent>
                <div className="vr hr-shadow" />
                <TooltipComponent title={"Approve"}>
                  <span
                    onClick={() => handleApprovedComplaint()}
                    className="shadow social-btn-re d-align gap-2 px-3 w-auto success-combo"
                  >
                    <BsCheckLg />
                  </span>
                </TooltipComponent>
              </>
            ) : (
              ""
            )}
            <div className="vr hr-shadow" />
            <Button
              onClick={saveOnclick}
              variant="primary"
              type="submit"
              className="bg-new text-uppercase text-secondary"
              disabled={formikProps?.isSubmitting}
            >
              {formikProps?.isSubmitting ? (
                <>
                  <Spinner animation="border" variant="primary" size="sm" />{" "}
                  PLEASE WAIT...
                </>
              ) : (
                <>{t(Savebtn)}</>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };

  return (
    <>
      <Helmet>
        <title>Complaint Types · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Complaints"}
          icon={<BsPlus />}
          onclick={() => setComplaint(true)}
          tag={"Create"}
        >
          <Tabs
            activeTab="1"
            ulClassName="border-primary me-1 border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <div className="mt-4">{tab.page}</div>
              </Tab>
            ))}
          </Tabs>
        </CardComponent>
      </Col>
      <Formik
        enableReinitialize={true}
        initialValues={{
          energy_company_id: edit?.energy_company_id
            ? { label: edit?.ec_name, value: edit?.energy_company_id }
            : [],
          zone_id: edit?.zones
            ? {
                label: edit?.zones[0]?.zone_name,
                value: edit?.zones[0]?.zone_id,
              }
            : [],
          ro_id: edit?.regionalOffices
            ? {
                label: edit?.regionalOffices[0]?.regional_office_name,
                value: edit?.regionalOffices[0]?.ro_id,
              }
            : [],
          sale_area_id: edit?.saleAreas
            ? {
                label: edit?.saleAreas[0]?.sales_area_name,
                value: edit?.saleAreas[0]?.sale_area_id_id,
              }
            : [],
          district_id: edit?.districts
            ? {
                label: edit?.districts[0]?.district_name,
                value: edit?.districts[0]?.district_id,
              }
            : [],
          outlet_id: edit?.outlets
            ? {
                label: edit?.outlets[0]?.outlet_name,
                value: edit?.outlets[0]?.outlet_id,
              }
            : [],
          complaint_type: edit?.complaint_type
            ? { label: edit?.complaint_type_name, value: edit?.complaint_type }
            : [],
          description: edit?.description || "",
        }}
        validationSchema={addComplaintTypeSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={complaint}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setComplaint(false)}
            title={
              edit.id ? "Update Complaint Types" : "Create Complaint Types"
            }
          >
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-2">
                <Form.Group as={Col} md="6">
                  <Form.Label>Energy Company Name</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    name="energy_company_id"
                    value={props.values.energy_company_id}
                    onChange={(val) => {
                      handleEneryChange(val, props.setFieldValue);
                      props.setFieldValue("energy_company_id", val);
                    }}
                    onBlur={props.handleBlur}
                    options={allEnergy}
                    isInvalid={Boolean(
                      props.touched.energy_company_id &&
                        props.errors.energy_company_id
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.energy_company_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6">
                  <Form.Label>Zone Name</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    name="zone_id"
                    value={props.values.zone_id}
                    onChange={(val) => {
                      handleZoneChange(val, props.setFieldValue);
                      props.setFieldValue("zone_id", val);
                    }}
                    options={allZones}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.zone_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6">
                  <Form.Label>Regional Office Name</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    name="ro_id"
                    value={props.values.ro_id}
                    onChange={(val) => {
                      handleRoChange(val, props.setFieldValue);
                      props.setFieldValue("ro_id", val);
                    }}
                    options={allRo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.ro_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6">
                  <Form.Label>Sales Area Name</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    name="sale_area_id"
                    value={props.values.sale_area_id}
                    onChange={(val) => {
                      handleSaChange(val, props.setFieldValue);
                      props.setFieldValue("sale_area_id", val);
                    }}
                    options={allSa}
                  />

                  <Form.Control.Feedback type="invalid">
                    {props.errors.sale_area_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6">
                  <Form.Label>District Name</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    name="district_id"
                    value={props.values.district_id}
                    onChange={(val) => {
                      handleOutletChange(val, props.setFieldValue);
                      props.setFieldValue("district_id", val);
                    }}
                    options={allDistrict}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.district_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6">
                  <Form.Label>Outlet Name</Form.Label>
                  <Select
                    menuPosition="fixed"
                    name={"outlet_id"}
                    options={allOutlet}
                    value={props.values.outlet_id}
                    onChange={(val) => props.setFieldValue("outlet_id", val)}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.outlet_id && props.errors.outlet_id
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.outlet_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6">
                  <Form.Label>Complaint Type</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    name="complaint_type"
                    value={props.values.complaint_type}
                    onChange={(val) => {
                      props.setFieldValue("complaint_type", val);
                    }}
                    options={complaintType}
                  />
                </Form.Group>

                <Form.Group as={Col} md="12">
                  <TextareaAutosize
                    minRows={2}
                    className="edit-textarea"
                    placeholder="Description..."
                    name={"description"}
                    value={props.values.description}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.description && props.errors.description
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Form>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default AllComplaintsMasterdata;
