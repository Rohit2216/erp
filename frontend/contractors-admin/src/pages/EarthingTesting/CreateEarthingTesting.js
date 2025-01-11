import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addEarthingTestingSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";

import { useNavigate, useParams } from "react-router-dom";
import {
  getAllComplaintList,
  getAllOutletList,
  getSingleEarthingTestingById,
  postEarthingTesting,
  updateEarthingTesting,
} from "../../services/contractorApi";
import { getAllUsers } from "../../services/authapi";
import { useTranslation } from "react-i18next";

const CreateEarthingTesting = () => {
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [complaintList, setComplaintList] = useState([]);
  const [outletList, setOutletList] = useState([]);

  const { t } = useTranslation();

  const fetchEarthingTestingData = async () => {
    const res = await getSingleEarthingTestingById(id);
    console.log("earthing", res.data);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const fetchAllComplaintList = async () => {
    const res = await getAllComplaintList();
    if (res.status) {
      setComplaintList(res.data);
    } else {
      setComplaintList([]);
    }
  };
  const fetchAllOutletList = async () => {
    const res = await getAllOutletList();
    if (res.status) {
      setOutletList(res.data);
    } else {
      setOutletList([]);
    }
  };

  const fetchAllUsers = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUsers(res.data);
    } else {
      setAllUsers([]);
    }
  };

  const complaintName = complaintList?.filter(
    (itm) => itm?.id == edit?.complaint_id
  );

  useEffect(() => {
    if (id !== "new") {
      fetchEarthingTestingData();
    }
    fetchAllUsers();
    fetchAllComplaintList();
    fetchAllOutletList();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const OutletId = values?.outlet_id?.map((user) => {
      return user.value;
    });
    const UserId = values?.user_id?.map((user) => {
      return user.value;
    });
    const sData = {
      complaint_id: values.complaint_id.value,
      outlet_id: OutletId,
      user_id: UserId,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    console.log("sData", sData);
    const res = edit?.id
      ? await updateEarthingTesting(sData)
      : await postEarthingTesting(sData);
    if (res.status) {
      toast.success(res.message);
      navigate("/earthing-testing/all");
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img
        src={
          image
            ? `${process.env.REACT_APP_API_URL}${image}`
            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
        className="avatar me-2"
      />
      {label}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Earthing Testing · CMS Electricals
        </title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${edit?.id ? "Update" : "Create"} Earthing Testing`}
        >
          {console.log(edit, "edit..")}
          <Formik
            enableReinitialize={true}
            initialValues={{
              complaint_id: edit.complaint_id
                ? {
                    label: complaintName[0]?.complaints,
                    value: edit.complaint_id,
                  }
                : "",
              outlet_id: edit.outlet_id
                ? edit?.outletData?.map((itm) => {
                    return {
                      label: itm.outlet_name,
                      value: itm.id,
                    };
                  })
                : "",
              user_id: edit.user_id
                ? edit?.user_data?.map((itm) => {
                    return {
                      label: itm.name,
                      value: itm.user_id,
                      image: itm.image,
                    };
                  })
                : "",
            }}
            validationSchema={addEarthingTestingSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      {t("Select Complaint")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name="complaint_id"
                      value={props.values.complaint_id}
                      onChange={(val) =>
                        props.setFieldValue("complaint_id", val)
                      }
                      options={complaintList?.map((user) => ({
                        value: user.id,
                        label: user.complaints,
                      }))}
                    />
                    <ErrorMessage
                      name="complaint_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Select Outlet")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      isMulti
                      menuPortalTarget={document.body}
                      name="outlet_id"
                      value={props.values.outlet_id}
                      onChange={(val) => props.setFieldValue("outlet_id", val)}
                      options={outletList?.map((user) => ({
                        value: user.outlet_id,
                        label: user.outlet,
                      }))}
                    />
                    <ErrorMessage
                      name="outlet_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Select Users")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      isMulti
                      menuPortalTarget={document.body}
                      name="user_id"
                      value={props.values.user_id}
                      onChange={(val) => props.setFieldValue("user_id", val)}
                      options={allUsers?.map((user) => ({
                        value: user.id,
                        label: user.name,
                        image: user.image,
                      }))}
                      formatOptionLabel={formatOptionLabel}
                    />
                    <ErrorMessage
                      name="user_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit.id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit.id && true)}
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
                          <>{edit.id ? "UPDATE" : "Save"}</>
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

export default CreateEarthingTesting;
