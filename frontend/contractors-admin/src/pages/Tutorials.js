import React, { useEffect, useRef, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import ReactDropzone from "../components/ReactDropzone";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import {
  getAdminAllModule,
  getAllRolesForDropDown,
  getAdminCreateTutorials,
  getAdminDeleteTutorials,
  getAdminSingleTutorials,
  getAdminTutorials,
  getAdminUpdateTutorials,
} from "../services/authapi";
import { Formik } from "formik";
import Select from "react-select";
import { addTutorialsSchema } from "../utils/formSchema";
import ConfirmAlert from "../components/ConfirmAlert";
import ActionButton from "../components/ActionButton";
import Modaljs from "../components/Modal";
import CardComponent from "../components/CardComponent";
import { BsPlus } from "react-icons/bs";

const Tutorials = () => {
  const [tutorial, setTutorial] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [allModule, setAllModule] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [openTutorials, setOpenTutorials] = useState(false);
  const [tutorialType, setTutorialType] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const selectRef = useRef(null);
  const [search, setSearch] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);

  const tabs = [
    { title: "all", className: "ms-auto", page: <TutorialsBox /> },
    { title: "video", page: <TutorialType /> },
    { title: "audio", page: <TutorialType /> },
    { title: "text", page: <TutorialType /> },
    { title: "pdf", page: <TutorialType /> },
    { title: "all phone image", page: <TutorialType /> },
  ];

  const fetchAllTutorialData = async () => {
    const res = await getAdminTutorials(search);
    if (res.status) {
      setTutorial(res.data);
    } else {
      setTutorial([]);
    }
    setIsLoading(false);
  };

  const fetchAllRolesData = async () => {
    const res = await getAllRolesForDropDown();

    if (res.status) {
      setAllRoles(res.data);
    } else {
      setAllRoles([]);
    }
  };

  const fetchAllModuleData = async () => {
    const res = await getAdminAllModule();
    if (res.status) {
      setAllModule(res.data);
    } else {
      setAllModule([]);
    }
  };

  const handleEdit = async (tutorial) => {
    setEdit(tutorial);
    setOpenTutorials(true);
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteTutorials(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setTutorial((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchAllTutorialType();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("attachment", e.target.files[0]);
    }
  };

  const fetchAllTutorialType = async () => {
    const res = await getAdminSingleTutorials(typeData);
    if (res.status) {
      setTutorialType(res.data);
    } else {
      setTutorialType([]);
    }
    setIsLoading2(false);
  };

  const handleClick = async (e) => {
    setTypeData(e.target.textContent);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const userType = values.user_type.value;
    const applicationType = values.application_type.value;
    const tutorialFormat = values.tutorial_format.value;
    const moduleType = values.module_type.value;
    const formData = new FormData();
    formData.append("user_type", userType);
    formData.append("application_type", applicationType);
    formData.append("module_type", moduleType);
    formData.append("tutorial_format", tutorialFormat);
    formData.append("attachment", values.attachment);
    formData.append("description", values.description);

    if (edit.id) {
      formData.append("id", values.id);
    }
    const res = edit.id
      ? await getAdminUpdateTutorials(formData)
      : await getAdminCreateTutorials(formData);
    if (res.status) {
      fetchAllTutorialData();
      fetchAllTutorialType();
      setOpenTutorials(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
      selectRef.current.clearValue();
    }
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    fetchAllTutorialData();
    fetchAllRolesData();
    fetchAllModuleData();
  }, [search]);

  useEffect(() => {
    if (
      typeData === "video" ||
      typeData === "audio" ||
      typeData === "text" ||
      typeData === "pdf"
    ) {
      fetchAllTutorialType();
    }
  }, [typeData]);

  function MyCard({ children }) {
    return (
      <Card className="bg-new h-100">
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }
  function TutorialsBox() {
    return (
      <>
        <Row className="g-3 tutorial">
          {isLoading ? (
            <div className="text-center">
              <img
                className="p-3"
                width="350"
                src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                alt="Loading"
              />
            </div>
          ) : tutorial.length > 0 ? (
            <>
              {tutorial.map((tutorialData, index) => (
                <Col key={index} md={4}>
                  <MyCard>
                    <div className="mb-3">
                      <ActionButton
                        hideEye={"d-none"}
                        editOnclick={() => handleEdit(tutorialData)}
                        deleteOnclick={() => {
                          setIdToDelete(tutorialData.id);
                          setShowAlert(true);
                        }}
                      />
                    </div>
                    <div className="object-fit bg-new-re p-2">
                      {tutorialData.tutorial_format === "video" ||
                      tutorialData.tutorial_format === "audio" ? (
                        <video
                          controls
                          autoPlay={false}
                          width="250"
                          height={130}
                          poster={`${
                            tutorialData.tutorial_format === "audio"
                              ? "https://www.freeiconspng.com/thumbs/sound-png/sound-png-3.png"
                              : "/assets/images/video-logo.png"
                          }`}
                        >
                          <source
                            src={`${process.env.REACT_APP_API_URL}${tutorialData.attachment}`}
                            type="video/mp4"
                          />
                        </video>
                      ) : null}

                      {tutorialData.tutorial_format === "pdf" ? (
                        <a
                          href={`${process.env.REACT_APP_API_URL}${tutorialData.attachment}`}
                          download={true}
                        >
                          <Card.Img
                            width={200}
                            height={130}
                            className="object-fit"
                            src={`/assets/images/pdf.jpg`}
                          />
                        </a>
                      ) : null}

                      {tutorialData.tutorial_format === "docs" ||
                      tutorialData.tutorial_format === "text" ? (
                        <a
                          href={`${process.env.REACT_APP_API_URL}${tutorialData.attachment}`}
                          download={true}
                        >
                          <Card.Img
                            width={200}
                            height={130}
                            className="object-fit"
                            src={`/assets/images/docs.png`}
                          />
                        </a>
                      ) : null}
                    </div>
                    <div className="d-flex my-2 justify-content-between">
                      <span>{tutorialData.tutorial_format}</span>
                      <small className="text-gray">
                        ({tutorialData.module_type}/
                        {tutorialData.application_type})
                      </small>
                    </div>
                    <p className="small mb-0 text-truncate2 line-clamp-2">
                      {tutorialData.description}
                    </p>
                  </MyCard>
                </Col>
              ))}
            </>
          ) : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="350"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
        </Row>
      </>
    );
  }
  function TutorialType() {
    return (
      <>
        <Row className="g-3 tutorial">
          {isLoading2 ? (
            <div className="text-center">
              <img
                className="p-3"
                width="350"
                src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                alt="Loading"
              />
            </div>
          ) : tutorialType.length > 0 ? (
            <>
              {tutorialType?.map((data, index) => (
                <Col key={index} md={4}>
                  <MyCard>
                    <div className="mb-3">
                      <ActionButton
                        hideEye={"d-none"}
                        editOnclick={() => handleEdit(data)}
                        deleteOnclick={() => {
                          setIdToDelete(data?.id);
                          setShowAlert(true);
                        }}
                      />
                    </div>
                    <div className="object-fit bg-new-re p-2">
                      {data?.tutorial_format === "video" ||
                      data?.tutorial_format === "audio" ? (
                        <video
                          controls
                          autoPlay={false}
                          width="250"
                          height={130}
                          poster={`${
                            data.tutorial_format === "audio"
                              ? "https://www.freeiconspng.com/thumbs/sound-png/sound-png-3.png"
                              : "/assets/images/video-logo.png"
                          }`}
                        >
                          <source
                            src={`${process.env.REACT_APP_API_URL}${data.attachment}`}
                            type="video/mp4"
                          />
                        </video>
                      ) : null}

                      {data?.tutorial_format === "pdf" ? (
                        <a
                          href={`${process.env.REACT_APP_API_URL}${data.attachment}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Card.Img
                            width={200}
                            height={130}
                            className="object-fit"
                            src={`/assets/images/pdf.jpg`}
                          />
                        </a>
                      ) : null}
                      {data?.tutorial_format === "docs" ||
                      data?.tutorial_format === "text" ? (
                        <a
                          href={`${process.env.REACT_APP_API_URL}${data.attachment}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Card.Img
                            width={200}
                            height={130}
                            className="object-fit"
                            src={`/assets/images/docs.png`}
                          />
                        </a>
                      ) : null}
                    </div>
                    <div className="d-flex my-2 justify-content-between">
                      <span>{data?.tutorial_format}</span>
                      <small className="text-gray">
                        ({data?.module_type}/{data?.application_type})
                      </small>
                    </div>
                    <p className="small mb-0 text-truncate2 line-clamp-2">
                      {data?.description}
                    </p>
                  </MyCard>
                </Col>
              ))}
            </>
          ) : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="350"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
        </Row>
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>Tutorials · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"Tutorials"}
          icon={<BsPlus />}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          onclick={() => {
            setEdit({});
            setOpenTutorials(true);
          }}
          tag={"Create"}
        >
          <Tabs
            onClick={(e) => handleClick(e)}
            activeTab="1"
            ulClassName="border-primary me-1 py-2 border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab
                key={idx}
                title={tab.title}
                className={tab.className}
                disabled
              >
                <Card.Body className="mt-2">{tab.page}</Card.Body>
              </Tab>
            ))}
          </Tabs>
        </CardComponent>
      </Col>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit.id || "",
          user_type: edit.user_type
            ? { label: edit.user_type_name, value: edit.user_type }
            : {},
          application_type: edit.application_type
            ? { label: edit.application_type, value: edit.application_type }
            : {},
          module_type: edit.module_type
            ? { label: edit.module_type, value: edit.module_type }
            : {},
          tutorial_format: edit.tutorial_format
            ? { label: edit.tutorial_format, value: edit.tutorial_format }
            : {},
          attachment: edit.attachment || null,
          description: edit.description || "",
        }}
        validationSchema={addTutorialsSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={openTutorials}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Upload"}
            close={() => setOpenTutorials(false)}
            formikProps={props}
            title={edit.id ? "Update Tutorial" : "Upload Tutorial"}
          >
            <Row className="g-3 py-2">
              <Col md={12}>
                <MyCard>
                  <ReactDropzone
                    name="attachment"
                    onChange={(e) => handleFileChange(e, props.setFieldValue)}
                    className={"text-center"}
                    title={"Upload Pdf Documents, Audio and Video"}
                  />
                </MyCard>
              </Col>
              <Form.Group as={Col} md={6}>
                <Form.Label>Software User Type </Form.Label>
                <Select
                  ref={selectRef}
                  menuPosition="fixed"
                  name={"user_type"}
                  options={allRoles.map((roles) => ({
                    label: roles.name,
                    value: roles.id,
                  }))}
                  value={props.values.user_type}
                  onChange={(selectedOption) => {
                    props.setFieldValue("user_type", selectedOption);
                  }}
                />
              </Form.Group>

              <Form.Group as={Col} md={6}>
                <Form.Label>Application Type</Form.Label>
                <Select
                  ref={selectRef}
                  menuPosition="fixed"
                  name={"application_type"}
                  options={[
                    { label: "Mobile", value: "mobile" },
                    { label: "Web", value: "web" },
                  ]}
                  value={props.values.application_type}
                  onChange={(selectedOption) => {
                    props.setFieldValue("application_type", selectedOption);
                  }}
                />
              </Form.Group>

              <Form.Group ref={selectRef} as={Col} md={6}>
                <Form.Label>Module Type</Form.Label>
                <Select
                  ref={selectRef}
                  menuPosition="fixed"
                  name={"module_type"}
                  options={allModule.map((module) => ({
                    label: module.title,
                    value: module.title,
                  }))}
                  value={props.values.module_type}
                  onChange={(selectedOption) => {
                    props.setFieldValue("module_type", selectedOption);
                  }}
                />
              </Form.Group>

              <Form.Group ref={selectRef} as={Col} md={6}>
                <Form.Label>Tutorial Format</Form.Label>
                <Select
                  ref={selectRef}
                  menuPosition="fixed"
                  name={"tutorial_format"}
                  options={[
                    { label: "video", value: "video" },
                    { label: "audio", value: "audio" },
                    { label: "text", value: "text" },
                    { label: "pdf", value: "pdf" },
                  ]}
                  value={props.values.tutorial_format}
                  onChange={(selectedOption) => {
                    props.setFieldValue("tutorial_format", selectedOption);
                  }}
                />
              </Form.Group>

              <Col md={12}>
                <TextareaAutosize
                  name="description"
                  value={props.values.description}
                  onChange={props.handleChange}
                  minRows={2}
                  className="edit-textarea"
                  placeholder="Add Description..."
                />
              </Col>
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

export default Tutorials;
