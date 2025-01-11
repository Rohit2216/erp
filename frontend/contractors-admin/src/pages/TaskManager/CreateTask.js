import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAdminAllHREmployees,
  getAdminAllTaskCategory,
  getAdminAllTasklist,
  getAdminCreateTask,
  getAdminUpdateTask,
  getAllUsers,
} from "../../services/authapi";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import { ErrorMessage, Formik } from "formik";
import CardComponent from "../../components/CardComponent";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { addTaskSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";

const CreateTask = () => {
  const [taskList, setTaskList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [taskCategory, setTaskCategory] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [allHrEmployees, setAllHrEmployees] = useState([]);

  const { id } = useParams();
  const location = useLocation();
  const list = location.state?.list;
  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchTaskListData = async () => {
    const res = await getAdminAllTasklist();
    console.log("tasklist", res.data);
    if (res.status) {
      setTaskList(res.data);
    } else {
      setTaskList([]);
    }
  };

  const fetchTaskCategoryData = async () => {
    const res = await getAdminAllTaskCategory();
    console.log("tesk catego", res.data);
    if (res.status) {
      setTaskCategory(res.data);
    } else {
      setTaskCategory([]);
    }
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    console.log("uesrdata", res.data);
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchAllHrEmployeesData = async () => {
    const isDropdown = "false";
    const res = await getAdminAllHREmployees({ isDropdown });
    console.log("he employee", res.data);
    if (res.status) {
      setAllHrEmployees(res.data);
    } else {
      setAllHrEmployees([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchTaskListData();
    }
    fetchAllUsersData();
    fetchAllHrEmployeesData();
    fetchTaskCategoryData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const collaborator = values.collaborators?.map((itm) => itm.value);
    const sData = {
      title: values.title,
      project_name: values.project_name,
      collaborators: collaborator,
      assign_to: values.assign_to.value,
      start_date: values.start_date,
      end_date: values.end_date,
      status: values.status.value,
      category_id: values.category_id.value,
    };
    if (list?.id) {
      sData["id"] = list?.id;
    }

    const res = list?.id
      ? await getAdminUpdateTask(sData)
      : await getAdminCreateTask(sData);
    if (res.status) {
      fetchTaskListData();
      toast.success(res.message);
      resetForm();
      navigate("/task/request");
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };
  return (
    <>
      <Helmet>
        <title>Task Manager · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`${list?.id ? "Update" : "Create"} Task`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: list?.id || "",
              title: list?.title || "",
              project_name: list?.project_name || "",
              collaborators: list?.collaborators_list
                ? list?.collaborators_list?.map((itm) => {
                    return { label: itm?.name, value: itm?.id };
                  })
                : "",
              assign_to: list?.assign_to
                ? { label: list?.assign_user_name, value: list?.assign_to }
                : {},
              category_id: list?.category_id
                ? { label: list?.category_name, value: list?.category_id }
                : {},
              start_date: list?.start_date
                ? moment(list?.start_date).format("YYYY-MM-DD")
                : "",
              end_date: list?.end_date
                ? moment(list?.end_date).format("YYYY-MM-DD")
                : "",
              status: list?.status
                ? { label: list?.status, value: list?.status }
                : {},
            }}
            validationSchema={addTaskSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Select Category")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name={"category_id"}
                      options={taskCategory.map((category) => ({
                        label: category.name,
                        value: category.id,
                      }))}
                      value={props.values.category_id}
                      onChange={(selectedOption) => {
                        props.setFieldValue("category_id", selectedOption);
                      }}
                    />
                    <ErrorMessage
                      name="category_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Create Task")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"title"}
                      value={props.values.title}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.title && props.errors.title
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.title}
                    </Form.Control.Feedback>
                    <ErrorMessage
                      name="title"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      {t("Select Collaborators")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      isMulti
                      name={"collaborators"}
                      options={allUserData?.map((user) => ({
                        label: user.name,
                        value: user.id,
                      }))}
                      value={props.values.collaborators}
                      onChange={(selectedOption) => {
                        props.setFieldValue("collaborators", selectedOption);
                      }}
                    />
                    <ErrorMessage
                      name="collaborators"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <p className="mt-3 mb-0 small fw-bolder">
                    -- {t("Assign To")} --
                  </p>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>{t("Select Team Member")}</Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name={"assign_to"}
                      options={allHrEmployees.map((member) => ({
                        label: member.name,
                        value: member.id,
                      }))}
                      value={props.values.assign_to}
                      onChange={(selectedOption) => {
                        props.setFieldValue("assign_to", selectedOption);
                      }}
                    />{" "}
                    <ErrorMessage
                      name="assign_to"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>{t("Project Name")}</Form.Label>
                    <Form.Control
                      type="text"
                      name={"project_name"}
                      value={props.values.project_name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.project_name && props.errors.project_name
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.project_name}
                    </Form.Control.Feedback>
                    <ErrorMessage
                      name="project_name"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>{t("Start Date")}</Form.Label>
                    <Form.Control
                      type="date"
                      name={"start_date"}
                      value={props.values.start_date}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.start_date && props.errors.start_date
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.start_date}
                    </Form.Control.Feedback>
                    <ErrorMessage
                      name="start_date"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>{t("End Date")}</Form.Label>
                    <Form.Control
                      type="date"
                      name={"end_date"}
                      value={props.values.end_date}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.end_date && props.errors.end_date
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.end_date}
                    </Form.Control.Feedback>
                    <ErrorMessage
                      name="end_date"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>{t("Select Status")}</Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name={"status"}
                      options={[
                        { value: "assign", label: "assign" },
                        { value: "in progress", label: "in progress" },
                        { value: "completed", label: "completed" },
                      ]}
                      value={props.values.status}
                      onChange={(selectedOption) => {
                        props.setFieldValue("status", selectedOption);
                      }}
                    />
                    <ErrorMessage
                      name="status"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${list?.id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(list?.id && true)}
                        disabled={props?.isSubmitting}
                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      >
                        {props?.isSubmitting ? (
                          <>
                            <Spinner
                              animation="border"
                              variant="primary"
                              size="sm"
                            />
                            {t("PLEASE WAIT")}...
                          </>
                        ) : (
                          <>{list?.id ? t("UPDATE") : t("CREATE")}</>
                        )}
                      </button>
                      <ConfirmAlert
                        size={"sm"}
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Confirm UPDATE"}
                        description={"Are you sure you want to update this!!"}
                      />
                    </div>
                  </Form.Group>
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateTask;
