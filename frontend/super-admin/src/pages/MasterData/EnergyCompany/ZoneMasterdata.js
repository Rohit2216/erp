import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Table, Row } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import Modaljs from "../../../components/Modal";
import {
  addAdminZone,
  deleteAdminZone,
  getAdminAllEnergy,
  getAdminZone,
  updateAdminZone,
} from "../../../services/authapi";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { addZoneSchema } from "../../../utils/formSchema";
import TextareaAutosize from "react-textarea-autosize";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, DELETED, UPDATED } from "../../../utils/constants";

const ZoneMasterdata = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [zoneShow, setZoneShow] = useState(false);
  const [allEnergy, setAllEnergy] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allZones, setAllZones] = useState([]);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchZoneData = async () => {
    const res = await getAdminZone(search, pageSize, pageNo);
    if (res.status) {
      setAllZones(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllZones([]);
      setPageDetail({});
    }
  };

  const handleEdit = (zone) => {
    setEdit(zone);
    setZoneShow(true);
  };

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await deleteAdminZone(idToDelete, params);
    if (res.status) {
      toast.success(res.message);
      setAllZones((prev) => prev.filter((itm) => itm.zone_id !== idToDelete));
      fetchZoneData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      energy_company_id: values.energy_company_id,
      name: values.zone_name,
      description: values.description,
    };

    if (edit.zone_id) {
      sData["id"] = edit.zone_id;
      sData["status"] = edit.zone_status;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.zone_id ? UPDATED : CREATED;

    const res = edit.zone_id
      ? await updateAdminZone(sData, params)
      : await addAdminZone(sData, params);
    if (res.status) {
      fetchZoneData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setZoneShow(false);
  };

  // all Energy
  const fetchAllEnergyData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      setAllEnergy(res.data);
      setEdit(res.data);
    } else {
      setAllEnergy([]);
    }
  };

  useEffect(() => {
    fetchAllEnergyData();
    fetchZoneData();
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
        <title>Energy · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"All - Zones"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setZoneShow(true);
          }}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr no.",
                    "Zone id",
                    "Zone Name",
                    "Zone Description",
                    "Energy Company Name",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allZones.length > 0 ? null : (
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
                {allZones?.map((zone, idx) => (
                  <tr key={zone?.zone_id}>
                    <td>{serialNumber[idx]}</td>
                    <td>{zone?.zone_id}</td>
                    <td>{zone?.zone_name}</td>
                    <td>{zone?.zone_description}</td>
                    <td>{zone?.ec_name}</td>
                    <td>
                      <ActionButton
                        hideEye={"d-none"}
                        deleteOnclick={() => {
                          setIdToDelete(zone.zone_id);
                          setShowAlert(true);
                        }}
                        editOnclick={() => handleEdit(zone)}
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
                  ? allZones.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : allZones.length < pageSize
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
          zone_name: edit.zone_name || "",
          description: edit.zone_description || "",
        }}
        validationSchema={addZoneSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={zoneShow}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={edit.zone_id ? "Update" : "ADD"}
            close={() => setZoneShow(false)}
            title={"Zone"}
            formikProps={props}
          >
            <Row className="g-2">
              <Form.Group as={Col} md="12">
                <Form.Label>
                  Select Energy Company <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name={"energy_company_id"}
                  value={props.values.energy_company_id}
                  onChange={props.handleChange}
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
              <Form.Group md="12">
                <Form.Label>
                  Zone Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name={"zone_name"}
                  value={props.values.zone_name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.zone_name && props.errors.zone_name
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.zone_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group md="12">
                <Form.Label>Description</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  className="edit-textarea"
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

export default ZoneMasterdata;
