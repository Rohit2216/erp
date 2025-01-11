import React, { useState } from "react";
import { Formik } from "formik";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Card, Col, Button, Spinner, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { BsGeoAlt, BsPencilSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
import CardComponent from "../components/CardComponent";
import UploadPhoto from "../components/UploadPhoto";
import { selectUser, setUser } from "../features/auth/authSlice";
import {
  adminChangePassword,
  adminProfile,
  adminProfileUpdate,
} from "../services/authapi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ChangePasswordSchema, MyprofileSchema } from "../utils/formSchema";

const MyProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const tabs = [
    {
      title: (
        <div>
          <img
            src={
              user.image
                ? `${process.env.REACT_APP_API_URL}${user.image}`
                : "assets/images/default-image.png"
            }
            alt="User-Profile"
            className="img-fluid my-btn"
          />
          <span className="ms-2"> {user.name}</span>
        </div>
      ),
      className: "fw-bold d-none d-md-block pe-none",
    },
    { title: <>{t("Profile")}</>, className: "ms-md-auto", page: <Profile /> },
    { title: <>{t("Change Password")}</>, page: <ChangePassword /> },
  ];

  const getProfileData = async () => {
    const res = await adminProfile();
    if (res.status) {
      // console.log('first', res.data)
      dispatch(setUser(res.data));
    } else {
      // console.log("err", res.message);
    }
  };

  const handleSubmit = async (values) => {
    const res = await adminProfileUpdate(values);
    if (res.status) {
      toast.success(res.message);
      getProfileData();
    } else {
      toast.error(res.message);
    }
  };
  const handlePassSubmit = async (values) => {
    const res = await adminChangePassword(values);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  function Profile() {
    const [isdisabled, setIsDisabled] = useState(false);
    const Disabled = () => {
      setIsDisabled(!isdisabled);
    };
    return (
      <Row className="g-4">
        <Col md={4}>
          <Card
            className="bg-new-re h-100"
            data-aos={"fade-up"}
            data-aos-delay={200}
          >
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column text-center align-items-center justify-content-between ">
                  <UploadPhoto getProfileData={getProfileData} />
                  <div className="fs-italic mt-2">
                    <h5 className="m-0">
                      <strong>
                        {user.name} {/* {t('profile_name')} */}
                      </strong>
                    </h5>
                    {user.address_1 && (
                      <div className="text-muted-50 mb-3">
                        <small>
                          <BsGeoAlt /> {user.address_1}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: user.name || "",
              email: user.email || "",
              contact_no: user.contact_no || "",
              // image: user.image || ""
            }}
            validationSchema={MyprofileSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <CardComponent
                  title={"About User"}
                  icon={<BsPencilSquare />}
                  onclick={() => Disabled(false)}
                  tag={"Edit"}
                >
                  <Row className="g-3">
                    <Form.Group as={Col} md={12}>
                      <Form.Label>{t("Name")}</Form.Label>
                      <Form.Control
                        value={props.values.name}
                        disabled={isdisabled ? false : true}
                        type="text"
                        name={"name"}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.name && props.errors.name
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                      <Form.Label>{t("Email")}</Form.Label>
                      <Form.Control
                        value={props.values.email}
                        disabled={isdisabled ? false : true}
                        type="email"
                        name={"email"}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.email && props.errors.email
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                      <Form.Label>{t("contact number")}</Form.Label>
                      <Form.Control
                        value={props.values.contact_no}
                        disabled={isdisabled ? false : true}
                        type="number"
                        name={"contact_no"}
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
                    {isdisabled ? (
                      <>
                        <div className="hr-border2 pb-2" />
                        <Form.Group as={Col} md={12} className="mt-3">
                          <Button
                            disabled={props.isSubmitting ? true : false}
                            type="Submit"
                            className="btn-shadow rounded-1 bg-secondary border-0"
                          >
                            {props.isSubmitting ? (
                              <>
                                <Spinner
                                  animation="border"
                                  variant="light"
                                  size="sm"
                                />{" "}
                                {t("PLEASE WAIT")}...
                              </>
                            ) : (
                              <>
                                {t("Save")} {t("Profile")}
                              </>
                            )}
                          </Button>
                        </Form.Group>{" "}
                      </>
                    ) : null}
                  </Row>
                </CardComponent>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    );
  }

  function ChangePassword() {
    return (
      <Col md={12}>
        <CardComponent title={"Security"}>
          {/* <small>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            vulputate, ex ac venenatis mollis, diam nibh finibus leo
          </small> */}
          <Formik
            initialValues={{
              old_password: "",
              new_password: "",
              confirm_password: "",
            }}
            validationSchema={ChangePasswordSchema}
            onSubmit={handlePassSubmit}
          >
            {(props) => (
              <Form
                onSubmit={props.handleSubmit}
                className="form-horizontal mt-3"
              >
                <Form.Group className="row">
                  <Form.Label className="col-sm-3 align-self-center mb-0">
                    {t("Old Password")}:
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      placeholder={t("Old Password")}
                      type="password"
                      name={"old_password"}
                      value={props.values.old_password}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.old_password && props.errors.old_password
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.old_password}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group className="row my-3">
                  <Form.Label className="col-sm-3 align-self-center mb-0">
                    {t("New Password")}:
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      placeholder={t("New Password")}
                      type="password"
                      name={"new_password"}
                      value={props.values.new_password}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.new_password && props.errors.new_password
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.new_password}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group className="row mb-3">
                  <Form.Label className="col-sm-3 align-self-center mb-0">
                    {t("Confirm Password")}:
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      placeholder={t("Confirm Password")}
                      type="password"
                      name={"confirm_password"}
                      value={props.values.confirm_password}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.confirm_password &&
                          props.errors.confirm_password
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.confirm_password}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <div className="hr-border2 pb-2" />
                <Form.Group className="mt-3">
                  <Button
                    disabled={props.isSubmitting}
                    type="Submit"
                    className="btn-shadow rounded-1 bg-secondary border-0"
                  >
                    {props.isSubmitting ? (
                      <>
                        <Spinner animation="border" variant="light" size="sm" />{" "}
                        {t("PLEASE WAIT")}...
                      </>
                    ) : (
                      <>{t("Change Password")}</>
                    )}
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    );
  }
  return (
    <>
      <Helmet>
        <title>Profile · CMS Electricals</title>
      </Helmet>
      <Tabs
        activeTab="2"
        className="rb-tabs2"
        ulClassName="border-primary justify-content-around bg-new-re border-bottom"
        activityClassName="bg-secondary"
      >
        {tabs.map((tab, idx) => (
          <Tab key={idx} title={tab.title} className={tab.className}>
            <div className="mt-4">{tab.page}</div>
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

export default MyProfile;
