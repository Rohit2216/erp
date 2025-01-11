import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import TextareaAutosize from "react-textarea-autosize";
import Select from "react-select";
import {
  addHrTeam,
  getAdminAllHRTeamManagers,
  getAdminSingleHRTeams,
  getAllEndUserBySupervisorId,
  getSupervisorListWithTotalFreeUserByManagerId,
  getUsersListWithOutTeams,
  updateHrTeam,
} from "../../../services/authapi";
import { addHrTeamSchema } from "../../../utils/formSchema";
import { ErrorMessage, Field, Formik } from "formik";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import CardComponent from "../../../components/CardComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";

const CreateTeams = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const { id } = useParams();
  const navigate = useNavigate();
  const [allHrTeamManagers, setAllHrTeamManagers] = useState([]);
  const [allHrTeamMembers, setAllHrTeamMembers] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const fetchSingleData = async () => {
    const res = await getAdminSingleHRTeams(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  //All team mangers
  const fetchAllHrTeamsManagersData = async () => {
    const res = await getAdminAllHRTeamManagers();
    if (res.status) {
      const rData = res.data
        .filter((itm) => itm.id !== 1)
        .map((itm) => {
          return {
            value: itm.id,
            label: itm.name,
            employee_id: itm.employee_id,
            image: itm.image
              ? `${process.env.REACT_APP_API_URL}${itm.image}`
              : null,
          };
        });
      setAllHrTeamManagers(rData);
    } else {
      setAllHrTeamManagers([]);
    }
  };

  //All team members
  // const fetchAllHrTeamsMemebersData = async (id) => {
  //   const res = await getAllEndUserBySupervisorId(id);
  //   if (res.status) {
  //     const rData = res.data.map((itm) => {
  //       return {
  //         value: itm.id,
  //         label: itm.name,
  //         employee_id: itm.employee_id,
  //         image: itm.image
  //           ? `${process.env.REACT_APP_API_URL}${itm.image}`
  //           : null,
  //       };
  //     });
  //     setAllHrTeamMembers(rData);
  //   } else {
  //     setAllHrTeamMembers([]);
  //   }
  // };

  const fetchAllHrTeamsMemebersData = async () => {
    const res = await getUsersListWithOutTeams();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.name,
          employee_id: itm.employee_id,
          image: itm.image
            ? `${process.env.REACT_APP_API_URL}${itm.image}`
            : null,
        };
      });
      setAllHrTeamMembers(rData);
    } else {
      setAllHrTeamMembers([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const member = values.members?.map((itm) => itm.value);
    const rData = {
      manager_id: values.manager_id.value,
      supervisor_id: values.supervisor_id.value,
      team_name: values.team_name,
      team_short_description: values.team_short_description,
      members: JSON.stringify(member).replace(/[\[\]']+/g, ""),
    };
    if (edit?.team_id) {
      rData["team_id"] = edit.team_id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.team_id ? UPDATED : CREATED;

    const res = edit?.team_id
      ? await updateHrTeam(rData, params)
      : await addHrTeam(rData, params);
    if (res.status) {
      toast.success(res.message);
      navigate("/Teams");
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowAlert(false);
  };

  const handleManagerChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("manager_id", val);
      setFieldValue("supervisor_id", null);
      setFieldValue("members", null);
    }
    if (!val) return false;
    setAllSupervisor([]);
    fetchSupervisorData(val);
  };

  const handleSupervisorChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("supervisor_id", val);
      setFieldValue("members", null);
    }
    if (!val) return false;
    setAllHrTeamMembers([]);
    fetchAllHrTeamsMemebersData(val);
  };

  const fetchSupervisorData = async (e) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(e);
    if (res.status) {
      const rData = res.data?.map((itm) => {
        return {
          value: itm.id,
          label: itm.name,
          employee_id: itm.employee_id,
          image: itm.image
            ? `${process.env.REACT_APP_API_URL}${itm.image}`
            : null,
        };
      });
      setAllSupervisor(rData);
    } else {
      toast.error(res.message);
      setAllSupervisor([]);
    }
  };

  const OptionDetails = ({ innerProps, label, data }) => (
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
        {label} {data.employee_id && "-"} {data.employee_id}
      </span>
    </div>
  );

  const formatOptionLabel = ({ label, image, data }) => (
    <div>
      <img src={image} className="avatar me-2" />
      {label} {data?.employee_id && "-"} {data?.employee_id}
    </div>
  );

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchAllHrTeamsManagersData();
    fetchAllHrTeamsMemebersData();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {edit?.team_id ? "Update" : "Create"} Team · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`${edit?.team_id ? "Update" : "Create"} Team`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              team_name: edit?.team_name ? edit?.team_name : "",
              team_short_description: edit?.team_short_description
                ? edit?.team_short_description
                : "",
              members: edit.members
                ? edit.members?.map((itm) => {
                    return { label: itm.name, value: itm.id };
                  })
                : [],
              manager_id: edit?.manager_id
                ? {
                    label: edit?.manager_name,
                    value: edit?.manager_id,
                    employee_id: edit.manager_employee_id,
                    image: process.env.REACT_APP_API_URL + edit?.manager_image,
                  }
                : "",
              supervisor_id: edit?.supervisor_id
                ? {
                    label: edit?.supervisor_name,
                    value: edit?.supervisor_id,
                    employee_id: edit.supervisor_employee_id,
                    image:
                      process.env.REACT_APP_API_URL + edit?.supervisor_image,
                  }
                : "",
            }}
            validationSchema={addHrTeamSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      Team Manager <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      className="text-primary"
                      name="manager_id"
                      value={props.values.manager_id}
                      onChange={(val) => {
                        handleManagerChange(val.value, props.setFieldValue);
                        props.setFieldValue("manager_id", val);
                      }}
                      options={allHrTeamManagers}
                      formatOptionLabel={formatOptionLabel}
                    />
                    <ErrorMessage
                      name="manager_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      Team Supervisor <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name="supervisor_id"
                      value={props.values.supervisor_id}
                      onChange={(val) => {
                        handleSupervisorChange(val.value, props.setFieldValue);
                        props.setFieldValue("supervisor_id", val);
                      }}
                      className="text-primary"
                      options={allSupervisor}
                      // components={{ Option: OptionDetails }}
                      formatOptionLabel={formatOptionLabel}
                    />
                    <ErrorMessage
                      name="supervisor_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      Team Members <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      closeMenuOnSelect={false}
                      isMulti
                      name="members"
                      value={props.values.members}
                      onChange={(selectedOption) =>
                        props.setFieldValue("members", selectedOption)
                      }
                      className="text-primary"
                      options={allHrTeamMembers}
                      components={{ Option: OptionDetails }}
                    />
                    <ErrorMessage
                      name="members"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      Team Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"team_name"}
                      value={props.values.team_name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.team_name && props.errors.team_name
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.team_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      Description
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <Field
                      as={TextareaAutosize}
                      type="text"
                      name={"team_short_description"}
                      value={props.values.team_short_description}
                      onChange={props.handleChange}
                      minRows={2}
                      className="edit-textarea"
                    />

                    <ErrorMessage
                      name="team_short_description"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit?.team_id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit?.team_id && true)}
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
                          <>{edit?.team_id ? "UPDATE" : "SAVE"}</>
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

export default CreateTeams;
