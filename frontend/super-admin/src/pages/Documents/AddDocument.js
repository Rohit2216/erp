import React, { useEffect, useRef, useState } from "react";
import { Form, Row, Col, Card, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import ReactDropzone from "../../components/ReactDropzone";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import {
  getAdminAddDocumentList,
  getAdminAllDocument,
  getAllRolesForDropDown,
  getAdminUsersbyRole,
  getAdminUpdateDocumentList,
  getAdminViewDocumentList,
} from "../../services/authapi";
import { ErrorMessage, Formik } from "formik";
import { toast } from "react-toastify";
import { addDocumentSchema } from "../../utils/formSchema";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
const AddDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userNameRef = useRef(null);
  const [documentData, setDocumentData] = useState([]);
  const [edit, setEdit] = useState({});
  const [allUserName, setAllUserName] = useState([]);
  const [userType, setAllUserType] = useState([]);
  const { user } = useSelector(selectUser);

  const fetchDocumentData = async () => {
    const res = await getAdminAllDocument();
    if (res.status) {
      setDocumentData(res.data);
    } else {
      setDocumentData([]);
    }
  };
  const fetchSingleDocumentData = async () => {
    const res = await getAdminViewDocumentList(id);
    if (res.status) {
      setEdit(res.data);
      fetchUserNameData(res.data.user_type);
    } else {
      setEdit([]);
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("images", e.target.files);
    }
  };
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // const images = JSON.parse(values.images);

    // return console.log(values.images)
    const UserId = JSON?.stringify(
      values.user_id.map((user) => {
        return user.value;
      })
    );
    const formData = new FormData();
    formData.append("category_id", values.category_id.value);
    formData.append("user_type", values.user_type.value);
    formData.append("user_id", UserId);
    formData.append("remarks", values.remark);
    formData.append("createdBy", user.id);
    if (edit?.id) {
      formData.append("updated_by", user.id);
      formData.append("id", edit?.id);
    }

    if (typeof values.images === "string") {
      formData.append("images", values.images);
    } else {
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i]);
      }
    }

    // return console.log("first", ...formData);
    const res = edit?.id
      ? await getAdminUpdateDocumentList(formData)
      : await getAdminAddDocumentList(formData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate("/DocumentsLists");
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };
  const fetchUserTypeData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      setAllUserType(res.data);
    } else {
      setAllUserType([]);
      toast.error(res.message);
    }
  };
  const fetchUserNameData = async (id, setFieldValue) => {
    const res = await getAdminUsersbyRole(id);
    if (res.status) {
      setAllUserName(res.data);
    } else {
      setAllUserName([]);
      userNameRef.current.clearValue();
      toast.error(res.message);
      setFieldValue("user_id", "");
    }
  };
  const handleUserTypeChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      userNameRef.current.clearValue();
      setFieldValue("user_type", val);
    }
    if (!val) return false;
    fetchUserNameData(val.value, setFieldValue);
  };
  const handleUserNameChange = async (e, setFieldValue) => {
    // const ids = e.map((item) => item.value);
    if (setFieldValue) {
      setFieldValue("user_id", e);
    }
  };
  useEffect(() => {
    fetchDocumentData();
    fetchUserTypeData();
    if (edit?.id) {
      fetchUserNameData();
    }
    if (id) {
      fetchSingleDocumentData();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Add Document · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        {/* {console.log('edit', edit)} */}
        <Formik
          enableReinitialize={true}
          initialValues={{
            category_id: edit.document_category_id
              ? { label: edit.title, value: edit.document_category_id }
              : "",
            user_type: edit.user_type
              ? { label: edit.user_type_name, value: edit.user_type }
              : "",
            user_id: edit.users
              ? edit.users?.map((itm) => {
                  return { label: itm.user_name, value: itm.user_id };
                })
              : [],
            images: edit?.image || [],
            remark: edit?.remark || "",
          }}
          validationSchema={addDocumentSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-4">
                <Col md={8} data-aos={"fade-up"} data-aos-delay={300}>
                  <CardComponent
                    title={edit?.id ? "Update Document" : "Add Document"}
                  >
                    <Row className="g-3">
                      <Form.Group as={Col} md={12}>
                        <Form.Label>Select Document Category</Form.Label>
                        <Select
                          className="text-primary w-100"
                          menuPortalTarget={document.body}
                          name={"category_id"}
                          options={documentData.map((categoryType) => ({
                            label: categoryType.title,
                            value: categoryType.id,
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
                      <Form.Group as={Col} md="6">
                        <Form.Label>Select User Type</Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          className="text-primary"
                          name={"user_type"}
                          options={userType.map((usert) => ({
                            label: usert.name,
                            value: usert.id,
                          }))}
                          value={props.values.user_type}
                          onChange={(e) => {
                            handleUserTypeChange(e, props.setFieldValue);
                          }}
                        />
                        <ErrorMessage
                          name="user_type"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="6">
                        <Form.Label>Select User Name</Form.Label>
                        <Select
                          ref={userNameRef}
                          closeMenuOnSelect={false}
                          isMulti={true}
                          menuPortalTarget={document.body}
                          name={"user_id"}
                          options={allUserName.map((usert) => ({
                            label: usert.user_name,
                            value: usert.user_id,
                          }))}
                          value={props.values.user_id}
                          onChange={(e) => {
                            handleUserNameChange(e, props.setFieldValue);
                          }}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={12}>
                        <TextareaAutosize
                          minRows={4}
                          className="edit-textarea"
                          placeholder="Remarks..."
                          name="remark"
                          value={props.values.remark}
                          onChange={props.handleChange}
                        />
                        <ErrorMessage
                          name="remark"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Row>
                  </CardComponent>
                </Col>
                <Col md={4} data-aos={"fade-up"} data-aos-delay={400}>
                  <Card className="card-bg h-100">
                    <Card.Body className="d-grid align-items-center">
                      <ReactDropzone
                        name="images"
                        onChange={(e) =>
                          handleFileChange(e, props.setFieldValue)
                        }
                        title={`Upload Document`}
                      />
                      <Row className="g-2">
                        {edit?.image
                          ? JSON.parse(edit?.image)?.map((itm, index) => {
                              return (
                                <Col key={index} md={4}>
                                  <div className="shadow p-1">
                                    {edit?.fileExtension === "pdf" ||
                                    edit?.fileExtension === "docx" ? (
                                      <a
                                        download
                                        target="_blank"
                                        className="small text-decoration-none d-block text-secondary"
                                        href={
                                          process.env.REACT_APP_API_URL +
                                          itm?.storePath
                                        }
                                      >
                                        Attachment
                                      </a>
                                    ) : (
                                      <img
                                        className="object-fit img-fluid"
                                        src={
                                          process.env.REACT_APP_API_URL +
                                          itm?.storePath
                                        }
                                      />
                                    )}
                                  </div>
                                </Col>
                              );
                            })
                          : null}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Form.Group as={Col} md={12}>
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={props?.isSubmitting}
                      className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
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
                        <>{edit.id ? "UPDATE" : "SAVE"}</>
                      )}
                    </button>
                  </div>
                </Form.Group>
              </Row>
            </Form>
          )}
        </Formik>
      </Col>
    </>
  );
};
export default AddDocument;
