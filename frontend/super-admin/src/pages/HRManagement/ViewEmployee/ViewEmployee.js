import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { viewSingleEmployee } from "../../../services/authapi";
import CardComponent from "../../../components/CardComponent";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import moment from "moment";
import { BsClock } from "react-icons/bs";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import ImageViewer from "../../../components/ImageViewer";

const ViewEmployee = () => {
  const { id } = useParams();
  const [edit, setEdit] = useState({});

  const fetchEmployeesData = async () => {
    const res = await viewSingleEmployee(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const dataValue = [
    { id: 1, name: "name", value: edit?.name },
    { id: 2, name: "mobile", value: edit?.mobile },
    { id: 3, name: "address", value: edit?.address },
    { id: 4, name: "employee Id", value: edit?.employee_id },
    { id: 5, name: "department", value: edit?.department },
    { id: 6, name: "email", value: edit?.email },
    {
      id: 7,
      name: "employment status",
      value: edit?.employment_status ? edit?.employment_status : "",
    },
    { id: 8, name: "joining date", value: edit?.joining_date },
    { id: 9, name: "aadhar Number", value: edit?.aadhar },
    { id: 10, name: "pan Number", value: edit?.pan },
    { id: 11, name: "role name", value: edit?.role_name },
    { id: 12, name: "skills", value: edit?.skills },
    { id: 13, name: "team name", value: edit?.team_name },
  ];
  const documentValue = [
    {
      id: 1,
      name: "aadhar card back image",
      src: edit?.aadhar_card_back_image
        ? `${process.env.REACT_APP_API_URL}${edit?.aadhar_card_back_image}`
        : "",
    },
    {
      id: 2,
      name: "aadhar card front image",
      src: edit?.aadhar_card_front_image
        ? `${process.env.REACT_APP_API_URL}${edit?.aadhar_card_front_image}`
        : "",
    },
    {
      id: 3,
      name: "bank documents",
      src: edit?.bank_documents
        ? `${process.env.REACT_APP_API_URL}${edit?.bank_documents}`
        : "",
    },
    {
      id: 4,
      name: "doctorate",
      src: edit?.doctorate
        ? `${process.env.REACT_APP_API_URL}${edit?.doctorate}`
        : "",
    },
    {
      id: 5,
      name: "graduation",
      src: edit?.graduation
        ? `${process.env.REACT_APP_API_URL}${edit?.graduation}`
        : "",
    },
    {
      id: 6,
      name: "Profile Pic",
      src: edit?.image ? `${process.env.REACT_APP_API_URL}${edit?.image}` : "",
    },
    {
      id: 7,
      name: "pan card image",
      src: edit?.pan_card_image
        ? `${process.env.REACT_APP_API_URL}${edit?.pan_card_image}`
        : "",
    },
    {
      id: 8,
      name: "post graduation",
      src: edit?.post_graduation
        ? `${process.env.REACT_APP_API_URL}${edit?.post_graduation}`
        : "",
    },
  ];
  const bankDetailsValue = [
    { id: 1, name: "account number", value: edit?.account_number },
    { id: 2, name: "bank name", value: edit?.bank_name },
    { id: 3, name: "epf no", value: edit?.epf_no },
    { id: 4, name: "esi no", value: edit?.esi_no },
    { id: 5, name: "ifsc code", value: edit?.ifsc_code },
    { id: 6, name: "username", value: edit?.username },
  ];

  useEffect(() => {
    if (id) {
      fetchEmployeesData();
    }
  }, []);

  const tabs = [
    { title: `${edit?.username} - details`, className: "pe-none fw-bold" },
    { title: "Personal Info", className: "ms-auto", page: <PersonalInfo /> },
    { title: "Documents", page: <Documents /> },
    { title: "Family Info", page: <FamilyInfo /> },
    { title: "Bank Details", page: <BankDetails /> },
    { title: "Timeline History", page: <TimelineHistory /> },
  ];

  function PersonalInfo() {
    return (
      <>
        <Row className="g-2 align-items-center">
          {dataValue.map((details, ida) => (
            <Fragment key={ida}>
              {details?.value ? (
                <>
                  <Col md={4}>{details.name}</Col>
                  <Col md={8}>
                    <Form.Control
                      type={"text"}
                      className="fw-bolder"
                      value={details.value}
                      disabled
                    />
                  </Col>
                </>
              ) : null}
            </Fragment>
          ))}
        </Row>
      </>
    );
  }
  function Documents() {
    return (
      <>
        <Row className="g-3">
          {documentValue?.length > 0 ? null : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="420"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
          {documentValue.map((details, ida) => (
            <Fragment key={ida}>
              {details?.src ? (
                <Col md={4}>
                  <Card className="shadow h-100 rounded border-info border-5 border-top p-3">
                    <p className="fw-bolder">{details.name}</p>
                    <ImageViewer
                      downloadIcon
                      href={details.src}
                      src={details.src}
                    >
                      <Card.Img
                        height={100}
                        className="object-fit"
                        src={details.src}
                      />
                    </ImageViewer>
                  </Card>
                </Col>
              ) : null}
            </Fragment>
          ))}
        </Row>
      </>
    );
  }
  function FamilyInfo() {
    return (
      <>
        <Row className="g-2 align-items-center">
          {edit?.family_info?.length > 0 ? null : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="420"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
          {edit?.family_info?.map((gst, idb) => (
            <Form.Group key={idb} as={Row} className="hr-border2 g-3 py-3">
              <Form.Label column sm={2}>
                Member Name
              </Form.Label>
              <Col sm={4}>
                <Form.Control value={gst.member_name} disabled />
              </Col>
              <Form.Label column sm={2}>
                Member Relation
              </Form.Label>
              <Col sm={4}>
                <Form.Control value={gst.member_relation} disabled />
              </Col>
            </Form.Group>
          ))}
        </Row>
      </>
    );
  }
  function BankDetails() {
    return (
      <>
        <Row className="g-2 align-items-center">
          {bankDetailsValue?.length > 0 ? null : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="420"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
          {bankDetailsValue.map((details, ida) => (
            <Fragment key={ida}>
              {details?.value ? (
                <>
                  <Col md={4}>{details.name}</Col>
                  <Col md={8}>
                    <Form.Control
                      type={"text"}
                      className="fw-bolder"
                      value={details.value}
                      disabled
                    />
                  </Col>
                </>
              ) : null}
            </Fragment>
          ))}
        </Row>
      </>
    );
  }
  function TimelineHistory() {
    return (
      <>
        <Row className="g-2 align-items-center">
          <SimpleBar className="area ps-2 pe-3">
            <span className="p-2 d-grid justify-content-center text-start">
              {edit?.status_timeline?.length > 0 ? null : (
                <div className="text-center">
                  <img
                    className="p-3"
                    alt="no-result"
                    width="420"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </div>
              )}
              {edit?.status_timeline?.map((data) => (
                <span key={data?.id} className="hstack gap-4 px-3">
                  <div className="vr hr-shadow d-align align-items-baseline">
                    <span
                      className={`zIndex rounded-circle btn-play d-flex`}
                      style={{
                        padding: "7px",
                        backgroundColor: `#52${data?.id}${data?.id}FF`,
                      }}
                    />
                  </div>
                  <div className="small">
                    <p className="mb-1 text-gray">{data?.remark}</p>
                    <p className="mb-1">
                      Updated By -{" "}
                      <span className="fw-bold">{data?.updated_by_name}</span>
                    </p>
                    <p className="mb-1">
                      Updated Status -{" "}
                      <span
                        className={`fw-bold text-${
                          data?.updated_status == 1 ? "green" : "danger"
                        }`}
                      >
                        {data?.updated_status == 1 ? "Active" : "Inactive"}
                      </span>
                    </p>
                    <p className="text-gray">
                      <BsClock />{" "}
                      {moment(data?.updated_at).format("h:mm a | DD/MM/YYYY")}
                    </p>
                  </div>
                </span>
              ))}
            </span>
          </SimpleBar>
        </Row>
      </>
    );
  }

  return (
    <Col md={12} className="last-child-none" data-aos={"fade-up"}>
      <Card className="card-bg">
        <Tabs
          activeTab="2"
          ulClassName="border-primary me-1 py-2 border-bottom"
          activityClassName="bg-secondary"
        >
          {tabs.map((tab, idx) => (
            <Tab key={idx} title={tab.title} className={tab.className} disabled>
              <Card.Body className="mt-2">{tab.page}</Card.Body>
            </Tab>
          ))}
        </Tabs>
      </Card>
    </Col>
  );
};

export default ViewEmployee;
