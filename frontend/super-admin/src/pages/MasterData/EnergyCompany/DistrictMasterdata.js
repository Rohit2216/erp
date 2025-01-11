import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Form, Table, Row } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import {
  addAdminDistrict,
  deleteAdminDistrict,
  getAdminAllEnergy,
  getAdminDistrict,
  getAdminEnergyCompanyassignZone,
  getAdminZone,
  getRoOnZoneId,
  getSalesOnRoId,
  updateAdminDistrict,
} from "../../../services/authapi";
import CardComponent from "../../../components/CardComponent";
import ActionButton from "../../../components/ActionButton";
import Modaljs from "../../../components/Modal";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { addDistrictSchema } from "../../../utils/formSchema";
import ReactPagination from "../../../components/ReactPagination";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, DELETED, UPDATED } from "../../../utils/constants";

const DistrictMasterdata = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [districtShow, setDistrictShow] = useState(false);
  const [allDistrict, setallDistrict] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [allEnergy, setAllEnergy] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [edit, setEdit] = useState({});
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchDistrictData = async () => {
    const res = await getAdminDistrict(search, pageSize, pageNo);
    if (res.status) {
      setallDistrict(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setallDistrict([]);
      setPageDetail({});
    }
  };

  const handleEdit = async (district) => {
    // console.log(district);
    await fetchZoneDataByEc_Id(district.energy_company_id);
    await fetchRoData(district.zone_id);
    await fetchSaData(district.ro_id);
    setEdit(district);
    setDistrictShow(true);
  };

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await deleteAdminDistrict(idToDelete, params);
    if (res.status) {
      toast.success(res.message);
      setallDistrict((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchDistrictData();
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
      regional_office_id: values.ro_id,
      sales_area_id: values.sales_area_id,
      district_name: values.district_name,
      status: values.status,
    };

    if (edit.id) {
      sData["district_id"] = edit.id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    // return console.log(sData)
    const res = edit.id
      ? await updateAdminDistrict(sData, params)
      : await addAdminDistrict(sData, params);
    if (res.status) {
      fetchDistrictData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setDistrictShow(false);
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
  const handleRoChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("ro_id", val);
    }
    if (!val) return false;
    fetchSaData(val);
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
      // toast.success(res.message);
    } else {
      setAllSa([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAllEnergyData();
    fetchDistrictData();
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
        <title>District · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CardComponent
          title={"All - District"}
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
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setDistrictShow(true);
          }}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "District id",
                    "District",
                    "Zone",
                    "Regional Office",
                    "Sales Area",
                    "Status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allDistrict.length > 0 ? null : (
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
                {allDistrict.map((district, index) => (
                  <tr key={district.id}>
                    <td>{serialNumber[index]}</td>
                    <td>{district.id}</td>
                    <td>{district.district_name}</td>
                    <td>{district.zone_name}</td>
                    <td>{district.regional_office_name}</td>
                    <td>{district.sales_area_name}</td>
                    <td
                      className={`text-${
                        district.status === 1 ? "green" : "danger"
                      }`}
                    >
                      {district.status === 1 ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <ActionButton
                        hideEye={"d-none"}
                        deleteOnclick={() => {
                          setIdToDelete(district.id);
                          setShowAlert(true);
                        }}
                        editOnclick={() => handleEdit(district)}
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
                  ? allDistrict.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : allDistrict.length < pageSize
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
          energy_company_id: edit.energy_company_id || "",
          zone_id: edit.zone_id || "",
          ro_id: edit.ro_id || "",
          sales_area_id: edit.sale_area_id || "",
          district_name: edit.district_name || "",
          status: edit?.status === 0 ? edit?.status : edit?.status || 1,
        }}
        validationSchema={addDistrictSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={districtShow}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.zone_id ? "Update" : "ADD"}
            close={() => setDistrictShow(false)}
            title={"Add District"}
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
              <Form.Group as={Col} md="6">
                <Form.Label>
                  Regional Office Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name={"regional_office_id"}
                  value={props.values.ro_id}
                  onChange={(e) =>
                    handleRoChange(e.target.value, props.setFieldValue)
                  }
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.ro_id && props.errors.ro_id)}
                >
                  <option>--Select--</option>
                  {allRo.map((ro) => (
                    <option key={ro.ro_id} value={ro.ro_id}>
                      {ro.regional_office_name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {props.errors.ro_id}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>
                  Sales Area Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name={"sales_area_id"}
                  value={props.values.sales_area_id}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.sales_area_id && props.errors.sales_area_id
                  )}
                >
                  <option>--Select--</option>
                  {allSa.map((sa) => (
                    <option key={sa.id} value={sa.id}>
                      {sa.sales_area_name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {props.errors.sales_area_id}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="12">
                <Form.Label>
                  District Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name={"district_name"}
                  value={props.values.district_name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.district_name && props.errors.district_name
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.district_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="12">
                <Form.Label>District Status</Form.Label>
                <Form.Select
                  name={"status"}
                  value={props.values.status}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.status && props.errors.status
                  )}
                >
                  <option>--Select--</option>
                  <option value={"1"}>Active</option>
                  <option value={"0"}>Inactive</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {props.errors.status}
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

export default DistrictMasterdata;
