import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { Col, Form, Table, Row } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import {
  addAdminRO,
  deleteAdminRO,
  getAdminAllEnergy,
  getAdminRegionalOffices,
  getAdminEnergyCompanyassignZone,
  updateAdminRO,
} from "../../../services/authapi";
import { addROSchema } from "../../../utils/formSchema";
import ActionButton from "../../../components/ActionButton";
import CardComponent from "../../../components/CardComponent";
import Modaljs from "../../../components/Modal";
import { toast } from "react-toastify";
import ReactPagination from "../../../components/ReactPagination";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../components/ConfirmAlert";
import TextareaAutosize from "react-textarea-autosize";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, DELETED, UPDATED } from "../../../utils/constants";

const RegionalMasterdata = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [regionalShow, setRegionalShow] = useState(false);
  const [allEnergy, setAllEnergy] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [edit, setEdit] = useState({});
  const [allZones, setAllZones] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchRoData = async () => {
    const res = await getAdminRegionalOffices(search, pageSize, pageNo);
    if (res.status) {
      setAllRo(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllRo([]);
    }
  };

  const handleEdit = async (editData) => {
    await fetchZoneDataByEc_Id(editData.energy_company_id);
    setEdit(editData);
    setRegionalShow(true);
  };

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await deleteAdminRO(idToDelete, params);
    if (res.status) {
      toast.success(res.message);
      setAllRo((prev) => prev.filter((itm) => itm.ro_id !== idToDelete));
      fetchRoData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      energy_company_id: values.energy_company_id,
      zone_id: values.zone_id,
      regional_office_name: values.regional_office_name,
      code: values.code,
      address_1: values.address_1,
      regional_status: values.regional_status,
    };

    if (edit.zone_id) {
      sData["regional_id"] = edit.ro_id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.zone_id ? UPDATED : CREATED;

    const res = edit.zone_id
      ? await updateAdminRO(sData, params)
      : await addAdminRO(sData, params);
    if (res.status) {
      fetchRoData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setRegionalShow(false);
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

  const handleEnergyChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("energy_company_id", val);
    }
    if (!val) return false;
    fetchZoneDataByEc_Id(val);
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

  useEffect(() => {
    fetchRoData();
    fetchAllEnergyData();
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
        <title>Regional Office · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CardComponent
          title={"All - Regional Office"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setRegionalShow(true);
          }}
          tag={"Create"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Reagional Office Id",
                    "Reagional Office",
                    "Zone Name",
                    "Code",
                    "Address",
                    "Status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allRo.length > 0 ? null : (
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
                {allRo.map((ro, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>{ro?.ro_id}</td>
                    <td>{ro?.regional_office_name}</td>
                    <td>{ro?.zone_name}</td>
                    <td>{ro?.code}</td>
                    <td>{ro?.address_1}</td>
                    <td
                      className={`text-${
                        ro?.status === 1 ? "green" : "danger"
                      }`}
                    >
                      {ro?.status === 1 ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <ActionButton
                        hideEye={"d-none"}
                        deleteOnclick={() => {
                          setIdToDelete(ro?.ro_id);
                          setShowAlert(true);
                        }}
                        editOnclick={() => handleEdit(ro)}
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
                  ? allRo.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : allRo.length < pageSize
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
          {console.log("first", allRo.length < pageSize)}
        </CardComponent>
      </Col>
      <Formik
        enableReinitialize={true}
        initialValues={{
          energy_company_id: edit?.energy_company_id || "",
          zone_id: edit?.zone_id || "",
          regional_office_name: edit?.regional_office_name || "",
          code: edit?.code || "",
          address_1: edit?.address_1 || "",
          regional_status:
            edit?.status === 0 ? edit?.status : edit?.status || 1,
        }}
        validationSchema={addROSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={regionalShow}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit?.zone_id ? "Update" : "ADD"}
            close={() => setRegionalShow(false)}
            title={"Regional Office"}
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
                  onChange={props.handleChange}
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
              <Form.Group as={Col} md="6">
                <Form.Label>
                  Regional Office Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name={"regional_office_name"}
                  value={props.values.regional_office_name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.regional_office_name &&
                      props.errors.regional_office_name
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.regional_office_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  name={"code"}
                  value={props.values.code}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />
              </Form.Group>
              <Form.Group as={Col} md="12">
                <Form.Label>Address</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  className="edit-textarea"
                  name={"address_1"}
                  value={props.values.address_1}
                  onChange={props.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.address_1}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="12">
                <Form.Label>Regional Status</Form.Label>
                <Form.Select
                  name={"regional_status"}
                  value={props.values.regional_status}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                >
                  <option>--Select--</option>
                  <option value={"1"}>Active</option>
                  <option value={"0"}>Inactive</option>
                </Form.Select>
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

export default RegionalMasterdata;
