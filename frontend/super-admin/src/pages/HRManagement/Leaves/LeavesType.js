import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import Modaljs from "../../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import ActionButton from "../../../components/ActionButton";
import {
  getAdminAllLeavesType,
  getAdminCreateLeavesType,
  getAdminDeleteLeavesType,
  getAdminUpdateLeavesType,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addLeavesTypeSchema } from "../../../utils/formSchema";
import ConfirmAlert from "../../../components/ConfirmAlert";
import moment from "moment";
import Select from "react-select";
import ReactPagination from "../../../components/ReactPagination";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, DELETED, UPDATED } from "../../../utils/constants";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";

const LeavesType = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);

  // console.log(pathname);

  const [leavesTypeData, setLeavesTypeData] = useState(false);
  const [leavet, setLeavet] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchLeaveData = async () => {
    const res = await getAdminAllLeavesType(search, pageSize, pageNo);
    if (res.status) {
      setLeavet(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setLeavet([]);
      setPageDetail({});
    }
  };

  const handleEdit = async (leavet) => {
    setEdit(leavet);
    setLeavesTypeData(true);
  };

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await getAdminDeleteLeavesType(idToDelete, params);
    if (res.status) {
      toast.success(res.message);
      setLeavet((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchLeaveData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchLeaveData();
  }, [search, pageSize, pageNo]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const leaveStatus = values.status.value;
    const sData = {
      leave_type: values.name,
      description: values.description,
      status: leaveStatus,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }

    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = edit.id ? UPDATED : CREATED;

    const res = edit.id
      ? await getAdminUpdateLeavesType(sData, params)
      : await getAdminCreateLeavesType(sData, params);
    if (res.status) {
      fetchLeaveData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setLeavesTypeData(false);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Leaves Type · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"Leaves Type"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setLeavesTypeData(true);
          }}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Leaves Type",
                    "Description",
                    "Date",
                    "Status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leavet?.length > 0 ? null : (
                  <tr>
                    <td colSpan={6}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="230"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {leavet.map((leavet, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>{leavet.leave_type}</td>
                    <td>{leavet.description}</td>
                    <td>{moment(leavet.created_at).format("DD-MM-YYYY")}</td>
                    <td
                      className={`text-${
                        leavet.status === 1 ? "green" : "danger"
                      }`}
                    >
                      {leavet.status === 1 ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <ActionButton
                        deleteOnclick={() => {
                          setIdToDelete(leavet.id);
                          setShowAlert(true);
                        }}
                        hideEye={"d-none"}
                        editOnclick={() => handleEdit(leavet)}
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
                  ? leavet.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : leavet.length < pageSize
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
          id: edit?.id || "",
          name: edit?.leave_type || "",
          description: edit?.description || "",
          status:
            +edit.status === 1
              ? { label: "Active", value: 1 }
              : { label: "InActive", value: 0 } || {
                  label: "InActive",
                  value: 0,
                },
        }}
        validationSchema={addLeavesTypeSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={leavesTypeData}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Save"}
            close={() => setLeavesTypeData(false)}
            title={edit.id ? "Update Leave" : "Create Leave"}
          >
            <Row className="g-2">
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />
                <ErrorMessage
                  name="name"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Status</Form.Label>
                <Select
                  // ref={selectRef}
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
              <Form.Group as={Col} md={12}>
                <Form.Label>Description</Form.Label>
                <TextareaAutosize
                  onChange={props.handleChange}
                  value={props.values.description}
                  name="description"
                  className="edit-textarea"
                />
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

export default LeavesType;
