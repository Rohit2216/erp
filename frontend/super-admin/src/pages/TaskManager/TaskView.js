import React, { useEffect, useState } from "react";
import { Col, Form, Image, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { IoCameraOutline, IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { useParams } from "react-router-dom";
import {
  getAdminAllTaskComment,
  getAdminCreateTaskComment,
  getAdminTaskStatus,
  getAdminUpdateTaskComment,
} from "../../services/authapi";
import Select from "react-select";
import moment from "moment";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import { Formik } from "formik";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ImageViewer from "../../components/ImageViewer";
import { BsPencilSquare } from "react-icons/bs";

const TaskView = () => {
  const { id } = useParams();
  const { user } = useSelector(selectUser);
  const [edit, setEdit] = useState({});
  const [taskData, setTaskData] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  const fetchAllTaskCommentData = async () => {
    const res = await getAdminAllTaskComment(id);
    if (res.status) {
      setTaskData(res.data);
      setTaskData(res.data.reverse());
      fetchTaskStatusData();
    } else {
      setTaskData([]);
    }
  };
  const fetchTaskStatusData = async (task_id, status) => {
    const res = await getAdminTaskStatus(task_id, status);
    if (res.status) {
      toast.success(res.message);
      fetchAllTaskCommentData();
    } else {
      toast.error(res.message);
    }
  };

  const handleEdit = async (activity) => {
    setEdit(toggle === true ? activity : !activity);
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("attachment", e.target.files[0]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log(values)

    const formData = new FormData();
    formData.append("task_id", values.task_id);
    formData.append("user_id", values.user_id);
    formData.append("remark", values.remark);
    formData.append("attachment", values.attachment);
    formData.append("status", values.status.value);
    formData.append("id", edit?.task_comments_id || "");

    const res = edit.task_comments_id
      ? await getAdminUpdateTaskComment(formData)
      : await getAdminCreateTaskComment(formData);
    if (res.status) {
      fetchAllTaskCommentData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setEdit([]);
    setSubmitting(false);
  };

  const toggleReadMore = (id) => {
    setExpandedIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((prevId) => prevId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  useEffect(() => {
    fetchAllTaskCommentData();
  }, []);

  return (
    <Col md={12}>
      <CardComponent title={"View Task"}>
        <Row className="g-2">
          <Col md={7}>
            <Row className="g-3">
              <div className="d-grid gap-3 p-2">
                <div className="shadow border-top border-3 rounded-top border-orange p-2">
                  <div className="d-align justify-content-between">
                    <div className="d-flex align-items-center">
                      <Image
                        className="my-btn"
                        src={
                          taskData.assign_user_image
                            ? `${process.env.REACT_APP_API_URL}${taskData.assign_user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                        alt="Admin"
                      />
                      <div className="flex-grow-1 ms-2">
                        <div>{taskData.assign_user_name}</div>
                        {/* <small className='text-gray'>Total Task <span className='shadow px-2 danger-combo'>4</span></small> */}
                      </div>
                    </div>
                    {/* <div><span className={`px-2 py-1 text-${taskData.status === 'assign' ? 'danger' : taskData.status === 'in progress' ? 'warning' : 'green'}`}><BsLightningCharge /> {taskData.status}</span></div> */}
                    <div>
                      <Select
                        menuPosition="fixed"
                        name={"status"}
                        options={[
                          { value: "assign", label: "assign" },
                          { value: "in progress", label: "in progress" },
                          { value: "completed", label: "completed" },
                        ]}
                        value={{
                          value: taskData.status,
                          label: taskData.status,
                        }}
                        onChange={(selectedOption) => {
                          selectedOption?.value !== "assign" &&
                            fetchTaskStatusData({
                              task_id: id,
                              status: selectedOption?.value,
                            });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="shadow p-2">
                  <Row className="g-">
                    <Col md={4}>
                      <div className="fw-bold">Task Name</div>
                    </Col>
                    <Col md={8}>
                      <div className="purple-combo px-3">{taskData.title}</div>
                    </Col>
                  </Row>
                </div>
                <div className="shadow p-2">
                  <Row className="g-">
                    <Col md={4}>
                      <div className="fw-bold">Project Name</div>
                    </Col>
                    <Col md={8}>
                      <div className="purple-combo px-3">
                        {taskData.project_name}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="shadow p-2">
                  <Row className="g-">
                    <Col md={4}>
                      <div className="fw-bold">Task Category</div>
                    </Col>
                    <Col md={8}>
                      <div className="purple-combo px-3">
                        {taskData.task_category_name}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="shadow p-2">
                  <Row className="g-">
                    <Col md={4}>
                      <div className="fw-bold">Task Collaborators</div>
                    </Col>
                    <Col md={8}>
                      <div className="purple-combo d-grid gap-2 py-2 px-3">
                        {taskData?.collaborators_list?.map((list, idx) => {
                          return (
                            <p
                              className="shadow small text-gray mb-0 px-1"
                              key={idx}
                            >
                              {idx + 1}. ({list.name}){" "}
                            </p>
                          );
                        })}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="shadow p-2">
                  <Row className="g-">
                    <Col md={4}>
                      <div className="fw-bold">Start Date</div>
                    </Col>
                    <Col md={8}>
                      <div className="success-combo px-3">
                        {moment(taskData.start_date).format("MM-DD-YYYY")}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="shadow p-2">
                  <Row className="g-">
                    <Col md={4}>
                      <div className="fw-bold">Deadline</div>
                    </Col>
                    <Col md={8}>
                      <div className="red-combo px-3">
                        {moment(taskData.end_date).format("MM-DD-YYYY")}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="shadow p-2">
                  <Row className="g-">
                    <Col md={4}>
                      <div className="fw-bold">Status</div>
                    </Col>
                    <Col md={8}>
                      <div className="red-combo px-3">
                        {taskData.previous_status ? (
                          <del
                            className={`px-2 py-1 text-${
                              taskData.status === "assign"
                                ? "danger"
                                : taskData.previous_status === "in progress"
                                ? "warning"
                                : "green"
                            }`}
                          >
                            {taskData.previous_status}{" "}
                          </del>
                        ) : null}
                        <ins
                          className={`px-2 py-1 text-${
                            taskData.status === "assign"
                              ? "danger"
                              : taskData.status === "in progress"
                              ? "warning"
                              : "green"
                          }`}
                        >
                          {" "}
                          {taskData.status}
                        </ins>
                      </div>
                    </Col>
                  </Row>
                </div>
                {taskData.status_changed_at ? (
                  <div className="shadow p-2">
                    <Row className="g-">
                      <Col md={4}>
                        <div className="fw-bold">Status changed at</div>
                      </Col>
                      <Col md={8}>
                        <div className="red-combo px-3">
                          {moment(taskData.status_changed_at).format(
                            "MM-DD-YYYY"
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ) : null}
              </div>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  id: edit.task_comments_id || "",
                  task_id: id || "",
                  user_id: user?.id || "",
                  remark: edit.remark || "",
                  status: edit.status || "",
                  attachment: edit.attachment || null,
                  status: edit.status
                    ? { label: edit.status, value: edit.status }
                    : {},
                }}
                // validationSchema={addTaskSchema}
                onSubmit={handleSubmit}
              >
                {(props) => (
                  <Form onSubmit={props?.handleSubmit}>
                    <Form.Group as={Col} md={12}>
                      <div className="form-shadow position-relative">
                        <TextareaAutosize
                          onChange={props.handleChange}
                          minRows={4}
                          className="shadow-none edit-textarea resize-none"
                          name="remark"
                          value={props.values.remark}
                          placeholder="write a Comment..."
                          as="textarea"
                          required
                        />
                        <div className="p-3 d-align justify-content-between">
                          <Form.Label for="filedata">
                            <span className="shadow cursor-pointer Position-absolute bottom-0 purple-combo px-3 py-1">
                              <IoCameraOutline /> Upload File
                            </span>
                            <Form.Control
                              id="filedata"
                              className="d-none"
                              type="file"
                              name={"attachment"}
                              onChange={(e) =>
                                handleFileChange(e, props.setFieldValue)
                              }
                            />
                          </Form.Label>

                          <button
                            type="submit"
                            disabled={props?.isSubmitting}
                            className="shadow border-0 cursor-pointer Position-absolute bottom-0 success-combo px-3 py-1"
                          >
                            {props?.isSubmitting ? (
                              <>
                                <Spinner
                                  animation="border"
                                  variant="primary"
                                  size="sm"
                                />{" "}
                                PLEASE WAIT...
                              </>
                            ) : (
                              <>
                                <IoSend /> Send
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </Form.Group>
                  </Form>
                )}
              </Formik>
            </Row>
          </Col>

          <Col md={5} className="sidebar">
            <SimpleBar color="red" className="area">
              <div className="p-2">
                <div className="shadow h-100 d-grid align-items-center px-3 last-child-none">
                  {taskData?.comments?.length > 0 ? null : (
                    <div>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </div>
                  )}
                  {taskData?.comments?.map((activity, id1) => (
                    <div key={id1} className="d-flex after-css hr-border2 py-3">
                      <span className="after-span">Activity</span>
                      <div className="flex-shrink-0">
                        <Image
                          className="my-btn"
                          src={
                            activity.user_image
                              ? `${process.env.REACT_APP_API_URL}${activity.user_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                          alt="Admin"
                        />
                      </div>
                      <div className="d-grid gap-2">
                        <div className="flex-grow-1 ms-2">
                          {activity.user_name}{" "}
                          <small className="text-muted">
                            {moment(activity.task_comment_date).format(
                              "DD-MM-YYYY | h:mm:ss a"
                            )}
                          </small>
                        </div>
                        <div className="flex-grow-1 ms-2">
                          <small>
                            <span
                              onClick={() => {
                                handleEdit(activity);
                                setToggle(!toggle);
                              }}
                              className="social-btn danger-combo"
                            >
                              <BsPencilSquare />
                            </span>{" "}
                            Task - {taskData.title}
                          </small>
                        </div>
                        <div className="flex-grow-1 small ms-2">
                          <li>
                            Remark -{" "}
                            <span className="fs-11 text-gray">
                              {expandedIds.includes(id1)
                                ? activity.remark
                                : activity.remark.slice(0, 150)}
                            </span>
                            {activity.remark.length > 150 && (
                              <div className="text-center mt-2">
                                <span
                                  className={`social-btn-re px-3 w-auto ${
                                    expandedIds.includes(id1)
                                      ? "danger-combo"
                                      : "success-combo"
                                  }`}
                                  onClick={() => toggleReadMore(id1)}
                                >
                                  {expandedIds.includes(id1)
                                    ? "Read less"
                                    : "Read more"}
                                </span>
                              </div>
                            )}
                          </li>
                          {activity.attachment ? (
                            <li>
                              Attachment -{" "}
                              <span className="fs-11 text-gray">
                                {" "}
                                <ImageViewer
                                  src={
                                    activity.attachment
                                      ? `${process.env.REACT_APP_API_URL}${activity.attachment}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                >
                                  <img
                                    width={50}
                                    className="my-bg p-1 rounded"
                                    src={
                                      activity.attachment
                                        ? `${process.env.REACT_APP_API_URL}${activity.attachment}`
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                    }
                                    alt="attachment-img"
                                  />
                                </ImageViewer>
                              </span>
                            </li>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SimpleBar>
          </Col>
        </Row>
      </CardComponent>
    </Col>
  );
};

export default TaskView;
