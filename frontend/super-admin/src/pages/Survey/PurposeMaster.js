import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../components/ActionButton";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import {
  AdminCreateSurveyPurposeMaster,
  AdminDeleteSurveyPurposeMaster,
  AdminUpdateSurveyPurposeMaster,
  getAdminAllSurveyPurposeMaster,
} from "../../services/authapi";
import { Formik } from "formik";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSurveyPurposeMasterSchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import moment from "moment";
import Select from "react-select";
import ReactPagination from "../../components/ReactPagination";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { CREATED, DELETED, UPDATED } from "../../utils/constants";
import { checkPermission } from "../../utils/checkPermissions";

const PurposeMaster = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [smShow, setSmShow] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchAllSurveyData = async () => {
    const res = await getAdminAllSurveyPurposeMaster(search, pageSize, pageNo);
    if (res.status) {
      setItemMasterData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setItemMasterData([]);
      setPageDetail({});
    }
  };

  const handleEdit = async (data) => {
    setEdit(data);
    setSmShow(true);
  };

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await AdminDeleteSurveyPurposeMaster(idToDelete, params);
    if (res.status) {
      toast.success(res.message);
      setItemMasterData((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchAllSurveyData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const ItemMasterStatus = values.status.value;
    const sData = {
      name: values.name,
      status: ItemMasterStatus,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    const res = edit?.id
      ? await AdminUpdateSurveyPurposeMaster(sData, params)
      : await AdminCreateSurveyPurposeMaster(sData, params);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      setSmShow(false);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    fetchAllSurveyData();
  };

  useEffect(() => {
    fetchAllSurveyData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <Helmet>
        <title>Purpose Master · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"Purpose Master"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          onclick={() => {
            setEdit({});
            setSmShow(true);
          }}
          icon={<BsPlus />}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new  Roles">
              <thead className="text-truncate">
                <tr>
                  {["S.No", "Name", "Date", "Status", "Action"].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {itemMasterData.length > 0 ? null : (
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
                {itemMasterData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{moment(data.created_at).format("DD-MM-YYYY")}</td>
                    <td
                      className={`text-${
                        data?.status == 1 ? "green" : "danger"
                      }`}
                    >
                      {data?.status == 1 ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <ActionButton
                        deleteOnclick={() => {
                          setIdToDelete(data.id);
                          setShowAlert(true);
                        }}
                        hideEye={"d-none"}
                        editOnclick={() => handleEdit(data)}
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
                itemMasterData.length < pageSize
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
          name: edit?.name || "",
          status:
            +edit.status === 1
              ? { label: "Active", value: edit.status }
              : { label: "InActive", value: edit.status },
        }}
        validationSchema={addSurveyPurposeMasterSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={smShow}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Save"}
            close={() => setSmShow(false)}
            title={edit.id ? "Update Purpose Master" : "Create Purpose Master"}
          >
            <Row className="align-items-center g-2">
              <Form.Group as={Col} md={12}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name={"name"}
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.name && props.errors.name)}
                />
              </Form.Group>
              <Form.Group as={Col} md={12}>
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

export default PurposeMaster;
