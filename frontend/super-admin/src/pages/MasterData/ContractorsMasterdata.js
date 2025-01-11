import React, { Fragment, useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import Modaljs from "../../components/Modal";
import { Helmet } from "react-helmet";
import ImageViewer from "../../components/ImageViewer";
import { Formik } from "formik";
import { addContractorsSchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addAdminContractors,
  deleteAdminContractors,
  getAdminContractors,
  getAdminSingleContractors,
  updateAdminContractors,
} from "../../services/authapi";
import ReactPagination from "../../components/ReactPagination";
import { checkPermission } from "../../utils/checkPermissions";
import { CREATED, DELETED, UPDATED } from "../../utils/constants";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const ContractorsMasterdata = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [Contractors, setContractors] = useState(false);
  const [allContractors, setAllContractors] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const navigate = useNavigate();

  const fetchContractorData = async () => {
    const res = await getAdminContractors(search, pageSize, pageNo);
    if (res.status) {
      setAllContractors(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllContractors([]);
      setPageDetail({});
    }
  };

  // View Contractors User
  const handleView = async (id, user_type, Contractor) => {
    const res = await getAdminSingleContractors(id, user_type);
    if (res.status) {
      navigate(`/ContractorsMasterdata/ContractorUsers/${id}`, {
        state: res.data,
      });
      // console.log('dealer123', res.data)
    }
  };

  // Edit Contractors User
  const handleEdit = async (id, user_type) => {
    const res = await getAdminSingleContractors(id, user_type);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
    setContractors(true);
  };

  // Delete Contractors User
  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    // return console.log(allContractors, idToDelete);
    const res = await deleteAdminContractors(idToDelete, "Contractor", params);
    if (res.status) {
      toast.success(res.message);
      setAllContractors((prev) =>
        prev.filter((itm) => itm.admin_id !== idToDelete)
      );
      fetchContractorData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("image", e.target.files[0]);
    }
  };

  // Sumbit Form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("contact_no", values.contact_no);
    // formData.append("mobile", values.contact_no);
    formData.append("alt_number", values.alt_number);
    formData.append("address_1", values.address_1);
    formData.append("country", values.country);
    formData.append("city", values.city);
    formData.append("pin_code", values.pin_code);
    formData.append("image", values.image);
    formData.append("password", values.password);
    formData.append("id", values.admin_id);
    formData.append("status", values.status);
    formData.append("type", "Contractor");

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.admin_id ? UPDATED : CREATED;

    // return console.log(sData)
    const res = edit.admin_id
      ? await updateAdminContractors(formData, params)
      : await addAdminContractors(formData, params);

    if (res.status) {
      fetchContractorData();
      toast.success(res.message);
      setContractors(false);
    } else {
      setContractors(false);
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    fetchContractorData();
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
        <title>Contractors · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"All - Contractors"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setContractors(true);
          }}
          tag={"Add"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Image",
                    "Name",
                    "Email",
                    "Contact No.",
                    "Status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allContractors.length > 0 ? null : (
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
                {allContractors.map((contractor, id1) => (
                  <Fragment key={id1}>
                    <tr>
                      <td>{serialNumber[id1]}</td>
                      <td>
                        <ImageViewer
                          src={`${process.env.REACT_APP_API_URL}${contractor.image}`}
                        >
                          <img
                            width={50}
                            className="my-bg p-1 rounded"
                            src={`${process.env.REACT_APP_API_URL}${contractor.image}`}
                            alt="user-img"
                          />
                        </ImageViewer>
                      </td>
                      <td>{contractor.name}</td>
                      <td>{contractor.email}</td>
                      <td>{contractor.contact_no}</td>
                      <td
                        className={`text-${
                          contractor?.status == 1 ? "green" : "danger"
                        }`}
                      >
                        {contractor?.status == 1 ? "Active" : "Inactive"}{" "}
                      </td>
                      <td>
                        <ActionButton
                          eyeOnclick={() =>
                            handleView(
                              contractor.admin_id,
                              contractor.user_type
                            )
                          }
                          deleteOnclick={() => {
                            setIdToDelete(contractor.admin_id);
                            setShowAlert(true);
                          }}
                          editOnclick={() =>
                            handleEdit(
                              contractor.admin_id,
                              contractor.user_type
                            )
                          }
                        />
                      </td>
                    </tr>
                  </Fragment>
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
                  ? allContractors.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : allContractors.length < pageSize
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
          name: edit.name || "",
          email: edit.email || "",
          userType: edit.user_type_number || "",
          contractor_id: edit.contractor_id || "",
          password: edit.password || "",
          contact_no: edit.contact_no || "",
          joining_date: edit.joining_date
            ? moment(edit.joining_date).format("YYYY-MM-DD")
            : "",
          alt_number: edit.alt_number || "",
          address_1: edit.address_1 || "",
          country: edit.country || "",
          city: edit.city || "",
          pin_code: edit.pin_code || "",
          admin_id: edit.admin_id || "",
          status: edit.status || 1,
          image: edit.image || null,
        }}
        validationSchema={addContractorsSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={Contractors}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.admin_id ? "Update" : "Add"}
            close={() => setContractors(false)}
            title={edit.admin_id ? "Update Contractor" : "Add Contractor"}
            formikProps={props}
          >
            <Row className="g-2 align-items-end pb-1">
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name={"name"}
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.name && props.errors.name)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name={"email"}
                  value={props.values.email}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.email && props.errors.email)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              {!edit.admin_id ? (
                <Form.Group as={Col} md={6}>
                  <Form.Label>
                    Password <span className="text-danger">*</span>
                  </Form.Label>
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
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  Contact No. <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  maxLength={10}
                  type="text"
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
              <Form.Group as={Col} md={6}>
                <Form.Label>Alt No.</Form.Label>
                <Form.Control
                  maxLength={10}
                  type="text"
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
              <Form.Group as={Col} md={6}>
                <Form.Label>Address</Form.Label>
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
              <Form.Group as={Col} md={6}>
                <Form.Label>Country</Form.Label>
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
              <Form.Group as={Col} md={6}>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name={"city"}
                  value={props.values.city}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.city && props.errors.city)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.city}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Pin Ccode</Form.Label>
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
              <Form.Group as={Col} md="6">
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
              <Form.Group as={Col} md={edit.admin_id ? 6 : 12}>
                <Form.Label>Image</Form.Label>
                <div
                  className={edit.admin_id && "d-flex align-items-center gap-2"}
                >
                  {edit.admin_id && (
                    <img
                      width={50}
                      className="my-bg p-1 rounded"
                      src={`${process.env.REACT_APP_API_URL}/${edit?.image}`}
                      alt={edit?.name}
                    />
                  )}
                  <Form.Control
                    type="file"
                    name={"image"}
                    onChange={(e) => handleFileChange(e, props.setFieldValue)}
                  />
                </div>
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

export default ContractorsMasterdata;
