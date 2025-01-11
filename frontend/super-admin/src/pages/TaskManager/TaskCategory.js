import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import Select from "react-select";
import ActionButton from "../../components/ActionButton";
import {
  getAdminAllTaskCategory,
  getAdminCreateTaskCategory,
  getAdminDeleteCategory,
  getAdminUpdateTaskCategory,
} from "../../services/authapi";
import moment from "moment";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Formik } from "formik";
import { addTaskCategorySchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import ReactPagination from "../../components/ReactPagination";

const TaskCategory = () => {
  const [viewCompany, setviewCompany] = useState(false);
  const [taskCategory, setTaskCategory] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchTaskCategoryData = async () => {
    const res = await getAdminAllTaskCategory(search, pageSize, pageNo);
    if (res.status) {
      setTaskCategory(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setTaskCategory([]);
      setPageDetail({});
    }
  };

  const handleEdit = async (task) => {
    setEdit(task);
    setviewCompany(true);
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteCategory(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setTaskCategory((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchTaskCategoryData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log(values)
    const sData = {
      name: values.name,
      status: values.status.value,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    const res = edit.id
      ? await getAdminUpdateTaskCategory(sData)
      : await getAdminCreateTaskCategory(sData);
    if (res.status) {
      fetchTaskCategoryData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setviewCompany(false);
  };

  useEffect(() => {
    fetchTaskCategoryData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CardComponent
        title={"Task Category"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        icon={<BsPlus />}
        onclick={() => {
          setEdit({});
          setviewCompany(true);
        }}
        tag={"Create"}
      >
        <div className="overflow-auto p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                {[
                  "Sr No.",
                  "Task Category",
                  "Created Date",
                  "Status",
                  "Action",
                ].map((thead) => (
                  <th key={thead}>{thead}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {taskCategory.length > 0 ? null : (
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
              {taskCategory.map((task, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{task.name}</td>
                  <td>{moment(task.created_at).format("DD-MM-YYYY")}</td>
                  <td
                    className={`text-${task?.status == 1 ? "green" : "danger"}`}
                  >
                    {task?.status == 1 ? "Active" : "Inactive"}{" "}
                  </td>
                  <td>
                    <ActionButton
                      deleteOnclick={() => {
                        setIdToDelete(task.id);
                        setShowAlert(true);
                      }}
                      hideEye={"d-none"}
                      editOnclick={() => handleEdit(task)}
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
              taskCategory.length < pageSize
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

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit.id || "",
          name: edit.name || "",
          status:
            +edit.status === 1
              ? { label: "Active", value: edit.status }
              : { label: "InActive", value: edit.status },
        }}
        validationSchema={addTaskCategorySchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={viewCompany}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={"Submit"}
            close={() => setviewCompany(false)}
            title={"Create Task Category"}
          >
            <Row className="g-2">
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
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Form.Label>Select Status</Form.Label>
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
    </Col>
  );
};

export default TaskCategory;
