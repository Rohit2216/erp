import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { addAllocateSchema } from "../../../utils/formSchema";
import CardComponent from "../../../components/CardComponent";
import {
  getAllEndUserBySupervisorId,
  getApprovedComplaintsDetailsById,
  getManagerListWithTotalFreeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
  postAssignComplaintToUser,
  updateAssignComplaintToUser,
} from "../../../services/authapi";
import ConfirmAlert from "../../../components/ConfirmAlert";

const UpdateResolved = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const [managerId, setManagerId] = useState(null);
  const [supervisorId, setSupervisorId] = useState(null);
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const [allHrTeamManagers, setAllHrTeamManagers] = useState([]);

  const fetchSingleData = async () => {
    const res = await getApprovedComplaintsDetailsById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  //All team mangers
  const fetchAllHrTeamsManagersData = async () => {
    const res = await getManagerListWithTotalFreeUser(id);
    if (res.status) {
      setAllHrTeamManagers(res.data);
    } else {
      setAllHrTeamManagers([]);
    }
  };

  const fetchFreeSupervisorData = async () => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(
      managerId || managerWithAssignedFlag.id,
      id
    );
    if (res.status) {
      setFreeSupervisorData(res.data);
    } else {
      setFreeSupervisorData([]);
      toast.error(res.message);
    }
  };
  const fetchFreeUsersData = async () => {
    const res = await getAllEndUserBySupervisorId(
      supervisorId || supervisorWithAssignedFlag?.id
    );
    if (res.status) {
      setFreeUserData(res.data);
    } else {
      setFreeUserData([]);
      toast.error(res.message);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      complaint_id: id,
      user_id: values.user_id.value,
    };
    // return console.log("sData", sData);
    const res = edit?.isComplaintAssigned
      ? await updateAssignComplaintToUser(sData)
      : await postAssignComplaintToUser(sData);
    if (res.status) {
      toast.success(res.message);
      navigate("/ApprovedComplaints");
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  const SupervisorOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className="d-flex justify-content-between px-2 align-items-center cursor-pointer"
    >
      <span>
        <img
          className="avatar me-2"
          src={
            data.image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={data.name}
        />
        {data.employee_id} {data.employee_id && "-"} {label}
      </span>
      {/* {data.freeEndUsersCount && ( */}
      <div className="small">
        Free Users
        <span className="badge ms-2 rounded-pill bg-success">
          {" "}
          {data.freeEndUsersCount === null ? 0 : data.freeEndUsersCount}
        </span>
      </div>
      {/* )} */}
    </div>
  );

  const UserOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className={`${
        data?.isDisabled ? "danger-combo-disable pe-none1" : ""
      } d-flex justify-content-between px-2 align-items-center cursor-pointer`}
    >
      <span>
        <img
          className="avatar me-2"
          src={
            data.image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={data.name}
        />
        {data.employee_id} {data.employee_id && "-"} {label}
      </span>
      {data?.isDisabled && (
        <div className="small">
          <span
            className="badge fw-normal ms-2 rounded-pill bg-success"
            style={{ letterSpacing: 2 }}
          >
            Assigned
          </span>
        </div>
      )}
    </div>
  );

  const managerWithAssignedFlag = allHrTeamManagers.find(
    (user) => user.isManagerAssigned
  );
  const initialManagerId = managerWithAssignedFlag
    ? {
        label: managerWithAssignedFlag.name,
        value: managerWithAssignedFlag?.id,
      }
    : "";
  const supervisorWithAssignedFlag = freeSupervisorData.find(
    (user) => user.isSupervisorAssigned
  );
  const initialSupervisorId = supervisorWithAssignedFlag
    ? {
        label: supervisorWithAssignedFlag.name,
        value: supervisorWithAssignedFlag?.id,
      }
    : "";

  useEffect(() => {
    if (id) {
      fetchSingleData();
    }
    if (supervisorId || supervisorWithAssignedFlag?.id) {
      fetchFreeUsersData();
    }
    if (managerId || managerWithAssignedFlag?.id) {
      fetchFreeSupervisorData();
    }
    fetchAllHrTeamsManagersData();
  }, [
    managerId,
    supervisorWithAssignedFlag?.id,
    managerWithAssignedFlag?.id,
    supervisorId,
  ]);

  const filteredOptions = allHrTeamManagers
    ?.filter((user) => user.isManagerAssigned)
    .map((user) => ({
      employee_id: user.employee_id,
      value: user.id,
      label: user.name,
      image: user.image
        ? `${process.env.REACT_APP_API_URL}${user.image}`
        : null,
      freeEndUsersCount: user.isManagerAssigned,
    }));

  const allOptions = allHrTeamManagers?.map((user) => ({
    employee_id: user.employee_id,
    value: user.id,
    label: user.name,
    image: user.image ? `${process.env.REACT_APP_API_URL}${user.image}` : null,
    freeEndUsersCount: user.isManagerAssigned,
  }));

  const options = filteredOptions.length > 0 ? filteredOptions : allOptions;

  // superviseors

  const filteredSuperviseorOptions = freeSupervisorData
    ?.filter((user) => user.isManagerAssigned)
    .map((user) => ({
      employee_id: user.employee_id,
      value: user.id,
      label: user.name,
      image: user.image
        ? `${process.env.REACT_APP_API_URL}${user.image}`
        : null,
      // freeEndUsersCount: user.isManagerAssigned,
      freeEndUsersCount: user.free_end_users,
    }));

  const allSuperviseor = freeSupervisorData?.map((user) => ({
    employee_id: user.employee_id,
    value: user.id,
    label: user.name,
    image: user.image ? `${process.env.REACT_APP_API_URL}${user.image}` : null,
    // freeEndUsersCount: user.isManagerAssigned,
    freeEndUsersCount: user.free_end_users,
  }));

  const optionSuperviseor =
    filteredOptions.length > 0 ? filteredSuperviseorOptions : allSuperviseor;

  return (
    <>
      <Helmet>
        <title>Resolved · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`Resolved`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              manger_id: initialManagerId,
              supervisor_id: initialSupervisorId,
              user_id: "",
            }}
            validationSchema={addAllocateSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      Manager Name{" "}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      className="text-primary"
                      name={"manger_id"}
                      value={props.values.manger_id}
                      isDisabled={managerWithAssignedFlag}
                      onChange={(val) => {
                        // console.log("val", val);
                        setManagerId(val.value);
                        props.setFieldValue("manger_id", val);
                        props.setFieldValue("supervisor_id", null);
                        props.setFieldValue("user_id", null);
                      }}
                      options={options}
                      components={{ Option: UserOption }}
                    />

                    <ErrorMessage
                      name="manger_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      Supervisor <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      className="text-primary"
                      name="supervisor_id"
                      value={props.values.supervisor_id}
                      isDisabled={supervisorWithAssignedFlag}
                      onChange={(val) => {
                        if (val && val.value) {
                          const selectedUser = freeSupervisorData.find(
                            (user) => user.id === val.value
                          );

                          if (selectedUser && selectedUser.free_end_users > 0) {
                            setSupervisorId(val.value);
                            props.setFieldValue("supervisor_id", val);
                            props.setFieldValue("user_id", null);
                          } else {
                            toast.error(
                              "Selected supervisor has no free end users."
                            );
                          }
                        }
                      }}
                      options={optionSuperviseor}
                      components={{ Option: SupervisorOption }}
                    />
                    <ErrorMessage
                      name="supervisor_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      Free End Users Count{" "}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      className="text-primary"
                      name="user_id"
                      value={props.values.user_id}
                      onChange={(val) => props.setFieldValue("user_id", val)}
                      options={freeUserData?.map((user) => ({
                        employee_id: user.employee_id,
                        value: user.id,
                        label: user.name,
                        image: user.image
                          ? `${process.env.REACT_APP_API_URL}${user.image}`
                          : null,
                        // isAssigned: user.isAssigned,
                        isDisabled: user.isAssigned,
                        freeEndUsersCount: user.free_end_users,
                      }))}
                      components={{ Option: UserOption }}
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
                        type={`button`}
                        onClick={() => setShowAlert(true)}
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
                            PLEASE WAIT...
                          </>
                        ) : (
                          "ALLOCATE"
                        )}
                      </button>
                      <ConfirmAlert
                        size={"sm"}
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Confirm ?"}
                        description={
                          "Are you sure you want to allowcate this!!"
                        }
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

export default UpdateResolved;
