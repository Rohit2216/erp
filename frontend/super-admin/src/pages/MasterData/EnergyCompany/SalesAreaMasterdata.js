import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import {
  addAdminSalesArea,
  deleteAdminSalesArea,
  getAdminAllEnergy,
  getAdminEnergyCompanyassignZone,
  getAdminSalesArea,
  getRoOnZoneId,
  updateAdminSalesArea,
} from "../../../services/authapi";
import { addSalesAreaSchema } from "../../../utils/formSchema";
import CardComponent from "../../../components/CardComponent";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import Modaljs from "../../../components/Modal";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useLocation } from "react-router-dom";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, DELETED, UPDATED } from "../../../utils/constants";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";

const SalesAreaMasterdata = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [salesShow, setSalesAreaShow] = useState(false);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [allEnergy, setAllEnergy] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [edit, setEdit] = useState({});
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchSalesAreaData = async () => {
    const res = await getAdminSalesArea(search, pageSize, pageNo);
    if (res.status) {
      setAllSalesArea(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllSalesArea([]);
      setPageDetail({});
    }
  };

  const handleEdit = async (Sa) => {
    await fetchRoData(Sa.zone_id);
    await fetchZoneDataByEc_Id(Sa.energy_company_id);
    setEdit(Sa);
    setSalesAreaShow(true);
  };

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await deleteAdminSalesArea(idToDelete, params);
    if (res.status) {
      toast.success(res.message);
      setAllSalesArea((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchSalesAreaData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log(values)

    const sData = {
      energy_company_id: values.energy_company_id,
      zone_id: values.zone_id,
      regional_office_id: values.regional_office_name,
      sales_area_name: values.sales_area_name,
      sales_area_status: values.sales_area_status,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    // return console.log(sData)
    const res = edit.id
      ? await updateAdminSalesArea(sData, params)
      : await addAdminSalesArea(sData, params);
    if (res.status) {
      fetchSalesAreaData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setSalesAreaShow(false);
  };

  const handleEnergyChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("energy_company_id", val);
    }
    if (!val) return false;
    fetchZoneDataByEc_Id(val);
  };

  const handleZoneChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("zone_id", val);
    }
    if (!val) return false;
    fetchRoData(val);
  };

  // Only Use for Zone Name
  const fetchZoneDataByEc_Id = async (energy_company_id) => {
    const res = await getAdminEnergyCompanyassignZone(energy_company_id);
    if (res.status) {
      setAllZones(res.data);
      // setEdit
    } else {
      setAllZones([]);
      toast.error(res.message);
    }
  };

  // all Energy
  const fetchAllEnergyData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      setAllEnergy(res.data);
      setEdit(res.data);
    } else {
      setAllEnergy([]);
      // toast.error(res.message);
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
  };

  useEffect(() => {
    fetchAllEnergyData();
    fetchSalesAreaData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );
  return (
    <>
      <Helmet>
        <title>Sales Area · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CardComponent
          title={"All - Sales Area"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setSalesAreaShow(true);
          }}
          custom={
            <span className="position-relative">
              {" "}
              <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
              <Form.Control
                type="text"
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="me-2"
                aria-label="Search"
              />
            </span>
          }
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Sales Area id",
                    "Sales Area",
                    "Zone",
                    "Regional Office",
                    "Status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSalesArea.length > 0 ? null : (
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
                {allSalesArea.map((Sa, index) => (
                  <tr key={Sa.id}>
                    <td>{serialNumber[index]}</td>
                    <td>{Sa.id}</td>
                    <td>{Sa.sales_area_name}</td>
                    <td>{Sa.zone_name}</td>
                    <td>{Sa.regional_office_name}</td>
                    <td
                      className={`text-${Sa.status === 1 ? "green" : "danger"}`}
                    >
                      {Sa.status === 1 ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <ActionButton
                        hideEye={"d-none"}
                        deleteOnclick={() => {
                          setIdToDelete(Sa.id);
                          setShowAlert(true);
                        }}
                        editOnclick={() => handleEdit(Sa)}
                      />
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
                  ? allSalesArea.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : allSalesArea.length < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
              }
              title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                pageDetail?.pageEndResult || 0
              } of ${pageDetail?.total || 0}`}
              handlePageSizeChange={handlePageSizeChange}
              prevonClick={() => setPageNo(pageNo - 1)}
              nextonClick={() => setPageNo(pageNo + 1)}
            />
          </div>
        </CardComponent>
      </Col>
      <Formik
        enableReinitialize={true}
        initialValues={{
          energy_company_id: edit?.energy_company_id || "",
          zone_id: edit.zone_id || "",
          regional_office_name: edit.regional_office_id || "",
          sales_area_name: edit.sales_area_name || "",
          sales_area_status:
            edit?.status === 0 ? edit?.status : edit?.status || 1,
        }}
        validationSchema={addSalesAreaSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={salesShow}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.zone_id ? "Update" : "ADD"}
            close={() => setSalesAreaShow(false)}
            title={"Sales Area"}
            formikProps={props}
          >
            <Row className="g-2">
              <Form.Group as={Col} md="6">
                <Form.Label>
                  Energy Company <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name={"energy_company_id"}
                  value={props.values.energy_company_id}
                  onChange={(e) =>
                    handleEnergyChange(e.target.value, props.setFieldValue)
                  }
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.energy_company_id &&
                      props.errors.energy_company_id
                  )}
                >
                  <option>--Select--</option>
                  {allEnergy.map((ec, id3) => (
                    <option key={id3} value={ec.energy_company_id}>
                      {ec.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {props.errors.energy_company_id}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6">
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
              <Form.Group as={Col} md="12">
                <Form.Label>
                  Regional Office Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name={"regional_office_name"}
                  value={props.values.regional_office_name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.regional_office_name &&
                      props.errors.regional_office_name
                  )}
                >
                  <option>--Select--</option>
                  {allRo.map((ro) => (
                    <option key={ro.ro_id} value={ro.ro_id}>
                      {ro.regional_office_name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {props.errors.regional_office_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="12">
                <Form.Label>
                  Sales Area Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name={"sales_area_name"}
                  value={props.values.sales_area_name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.sales_area_name &&
                      props.errors.sales_area_name
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.sales_area_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="12">
                <Form.Label>Sales Area Status</Form.Label>
                <Form.Select
                  name={"sales_area_status"}
                  value={props.values.sales_area_status}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.sales_area_status &&
                      props.errors.sales_area_status
                  )}
                >
                  <option>--Select--</option>
                  <option value={"1"}>Active</option>
                  <option value={"0"}>Inactive</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {props.errors.sales_area_status}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default SalesAreaMasterdata;
