import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import Select from "react-select";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import {
  getAllEndUserBySupervisorId,
  getApprovedComplaintsDetailsById,
  getManagerListWithTotalFreeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
  updateAssignComplaintToUser,
} from "../../services/contractorApi";
import { updateAllocateSchema } from "../../utils/formSchema";
import { BsTrash } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import ImageViewer from "../../components/ImageViewer";

const UpdateAllocate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const [allHrTeamManagers, setAllHrTeamManagers] = useState([]);
  const [removeId, setRemoveId] = useState(null);

  const fetchSingleData = async () => {
    const res = await getApprovedComplaintsDetailsById(id);
    if (res.status) {
      setEdit(res.data);
      fetchFreeSupervisorData(
        res.data?.manager_and_supevisor?.areaManagerDetails.id,
        id
      );
      fetchFreeUsersData(
        res.data?.manager_and_supevisor?.superVisorDetails.id,
        id
      );
    } else {
      setEdit({});
    }
  };

  //All Managers
  const fetchAllHrTeamsManagersData = async () => {
    const res = await getManagerListWithTotalFreeUser(id);
    if (res.status) {
      setAllHrTeamManagers(res.data);
    } else {
      setAllHrTeamManagers([]);
    }
  };

  //All Supervisors By Manager Id
  const fetchFreeSupervisorData = async (value) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(value, id);
    if (res.status) {
      setFreeSupervisorData(res.data);
    } else {
      setFreeSupervisorData([]);
      toast.error(res.message);
    }
  };

  const filterFreeUser = freeSupervisorData?.filter(
    (prev) => prev.id === edit?.manager_and_supevisor?.superVisorDetails?.id
  );

  const handleSupervisorChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("supervisor_id", value);
      setvalue("assign_to", "");
    }
    if (!value) return setFreeUserData([]);
    fetchFreeUsersData(value);
  };

  //All End Users By Supervisor Id
  const fetchFreeUsersData = async (id) => {
    const res = await getAllEndUserBySupervisorId(id);
    if (res.status) {
      setFreeUserData(res.data);
    } else {
      setFreeUserData([]);
      toast.error(res.message);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const userId = values?.assign_to?.map((itm) => itm?.value);
    const sData = {
      complaints_id: +id,
      area_manager_id: values.manger_id.value,
      supervisor_id: values.supervisor_id.value,
      action: [
        {
          [removeId ? "remove" : "add"]: {
            assign_to: removeId ? [removeId] : userId,
          },
        },
      ],
    };

    // return console.log("sData", sData);
    const res = await updateAssignComplaintToUser(sData);
    // const res = await postAssignComplaintToUser(sData);
    if (res.status) {
      toast.success(res.message);
      fetchSingleData();
      if (edit?.manager_and_supevisor?.length === 0) {
        navigate("/ApprovedComplaints");
      }
      setShowAlert(false);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setRemoveId(null)
  };

  const supervisorOption = ({
    employee_id,
    image,
    label,
    freeEndUsersCount,
  }) => (
    <div className="d-flex justify-content-between px-2 align-items-center cursor-pointer">
      <span>
        <img
          className="avatar me-2"
          src={
            image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={""}
        />
        {employee_id} {employee_id && "-"} {label}
      </span>
      <div className="small">
        Free Users
        <span className="badge ms-2 rounded-pill bg-success">
          {" "}
          {freeEndUsersCount === null ? 0 : freeEndUsersCount}
        </span>
      </div>
    </div>
  );

  const userOption = ({ employee_id, value, image, label, isDisabled }) => (
    <div
      className={`${isDisabled ? "danger-combo-disable pe-none1" : ""
        } d-flex justify-content-between px-2 align-items-center cursor-pointer`}
    >
      <span className="d-flex align-items-center">
        <img
          className="avatar me-2"
          src={
            image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={""}
        />
        {employee_id} {employee_id && "-"} {label}{" "}
        {isDisabled && (
          <>
            <div className={`vr hr-shadow mx-1`} />
            <TooltipComponent align="left" title={"Free user"}>
              <span
                onClick={() => {
                  setRemoveId(value);
                  setShowAlert(true);
                }}
                className="text-danger fw-bold"
              >
                <BsTrash fontSize={15} />
              </span>
            </TooltipComponent>
          </>
        )}
      </span>
      {isDisabled && (
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

  useEffect(() => {
    if (id) {
      fetchSingleData();
    }
    fetchAllHrTeamsManagersData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Update Allocate · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent className={"after-bg-light"} title={`Update Allocate`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              manger_id: edit?.manager_and_supevisor?.areaManagerDetails
                ? {
                  employee_id:
                    edit?.manager_and_supevisor?.areaManagerDetails
                      .employee_id,
                  value: edit?.manager_and_supevisor?.areaManagerDetails.id,
                  label: edit?.manager_and_supevisor?.areaManagerDetails.name,
                  image: edit?.manager_and_supevisor?.areaManagerDetails.image
                    ? `${process.env.REACT_APP_API_URL}${edit?.manager_and_supevisor?.areaManagerDetails.image}`
                    : null,
                  freeEndUsersCount:
                    edit?.manager_and_supevisor?.areaManagerDetails
                      .free_end_users,
                }
                : "",
              supervisor_id: edit?.manager_and_supevisor?.superVisorDetails
                ? {
                  employee_id:
                    edit?.manager_and_supevisor?.superVisorDetails
                      .employee_id,
                  value: edit?.manager_and_supevisor?.superVisorDetails.id,
                  label: edit?.manager_and_supevisor?.superVisorDetails.name,
                  image: edit?.manager_and_supevisor?.superVisorDetails.image
                    ? `${process.env.REACT_APP_API_URL}${edit?.manager_and_supevisor?.superVisorDetails.image}`
                    : null,
                  freeEndUsersCount: filterFreeUser[0]?.free_end_users,
                }
                : "",
              assign_to: edit?.manager_and_supevisor?.endUserDetails
                ? edit?.manager_and_supevisor?.endUserDetails?.map((itm) => {
                  if (itm?.isAssigned)
                    return {
                      employee_id: itm.employee_id,
                      value: itm.id,
                      label: itm.name,
                      image: itm.image
                        ? `${process.env.REACT_APP_API_URL}${itm.image}`
                        : null,
                    };
                }).filter((a) => a)
                : "",
            }}
            validationSchema={updateAllocateSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="p-20 shadow rounded h-100">
                      <strong className="text-secondary">
                        Company Details
                      </strong>
                      <div className="mt-2">
                        <table className="table-sm table">
                          <tbody>
                            {edit?.energy_company_name && (
                              <tr>
                                <th>Company Name :</th>
                                <td>{edit?.energy_company_name}</td>
                              </tr>
                            )}
                            {edit?.regionalOffices && (
                              <tr>
                                <th>Regional Office :</th>
                                <td className="fw-bolds border-last-child text-dark">
                                  {edit?.regionalOffices?.map((ro, id3) => {
                                    return (
                                      <span
                                        key={id3}
                                        className="hr-border px-2"
                                      >
                                        {/* {id3 + 1}.{" "} */}
                                        <span
                                          style={{ padding: "0 5px" }}
                                        // className="bg-light"
                                        >
                                          {ro.regional_office_name}
                                        </span>
                                      </span>
                                    );
                                  })}
                                </td>
                              </tr>
                            )}
                            {edit?.saleAreas && (
                              <tr>
                                <th>Sales Area :</th>
                                <td className="fw-bolds border-last-child text-dark">
                                  {edit?.saleAreas?.map((sale, id4) => {
                                    return (
                                      <span
                                        key={id4}
                                        className="hr-border px-2"
                                      >
                                        {/* {id4 + 1}.{" "} */}
                                        <span
                                          style={{ padding: "0 5px" }}
                                        // className="bg-light"
                                        >
                                          {sale.sales_area_name}
                                        </span>
                                      </span>
                                    );
                                  })}
                                </td>
                              </tr>
                            )}
                            {edit?.districts && (
                              <tr>
                                <th>District :</th>
                                <td className="fw-bolds border-last-child text-dark">
                                  {edit?.districts?.map((dict, id5) => {
                                    return (
                                      <span
                                        key={id5}
                                        className="hr-border px-2"
                                      >
                                        {/* {id5 + 1}.{" "} */}
                                        <span
                                          style={{ padding: "0 5px" }}
                                        // className="bg-light"
                                        >
                                          {dict.district_name}
                                        </span>
                                      </span>
                                    );
                                  })}
                                </td>
                              </tr>
                            )}
                            {edit?.outlets && (
                              <tr>
                                <th>Outlet :</th>
                                <td className="fw-bolds border-last-child text-dark">
                                  {edit?.outlets?.map((on, id2) => {
                                    return (
                                      <span
                                        key={id2}
                                        className="hr-border px-2"
                                      >
                                        {/* {id2 + 1}.{" "} */}
                                        <span
                                          style={{ padding: "0 5px" }}
                                        // className="bg-light"
                                        >
                                          {on.outlet_name}
                                        </span>
                                      </span>
                                    );
                                  })}
                                </td>
                              </tr>
                            )}
                            {edit?.order_by_details && (
                              <tr>
                                <th>Order By :</th>
                                <td>{edit?.order_by_details}</td>
                              </tr>
                            )}
                            {edit?.order_via_details && (
                              <tr>
                                <th>Order Via :</th>
                                <td>{edit?.order_via_details}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-20 shadow rounded h-100">
                      <strong className="text-secondary">
                        Complaint Details
                      </strong>
                      <div className="mt-2">
                        <table className="table-sm table">
                          <tbody>
                            {edit?.complaint_raise_by && (
                              <tr>
                                <th>Complaint Raise By :</th>
                                <td>{edit?.complaint_raise_by}</td>
                              </tr>
                            )}
                            {edit?.complaint_type && (
                              <tr>
                                <th>Complaint Type :</th>
                                <td>{edit?.complaint_type}</td>
                              </tr>
                            )}
                            {edit?.complaint_unique_id && (
                              <tr>
                                <th>Complaint Id :</th>
                                <td>{edit?.complaint_unique_id}</td>
                              </tr>
                            )}
                            {edit?.manager_and_supevisor?.areaManagerDetails
                              ?.id && (
                                <tr>
                                  <th className="align-middle">Manager :</th>
                                  <td>
                                    <ImageViewer
                                      src={
                                        edit?.manager_and_supevisor
                                          ?.areaManagerDetails?.image
                                          ? `${process.env.REACT_APP_API_URL}${edit?.manager_and_supevisor?.areaManagerDetails?.image}`
                                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                      }
                                    >
                                      <img
                                        width={35}
                                        height={35}
                                        className="my-bg object-fit p-1 rounded-circle"
                                        src={
                                          edit?.manager_and_supevisor
                                            ?.areaManagerDetails?.image
                                            ? `${process.env.REACT_APP_API_URL}${edit?.manager_and_supevisor?.areaManagerDetails?.image}`
                                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                        }
                                      />{" "}
                                    </ImageViewer>
                                    {
                                      edit?.manager_and_supevisor
                                        ?.areaManagerDetails?.name
                                    }{" "}
                                    -{" "}
                                    {
                                      edit?.manager_and_supevisor
                                        ?.areaManagerDetails?.employee_id
                                    }
                                  </td>
                                </tr>
                              )}
                            {edit?.manager_and_supevisor?.superVisorDetails
                              ?.id && (
                                <tr>
                                  <th className="align-middle">SuperVisor :</th>
                                  <td>
                                    <ImageViewer
                                      src={
                                        edit?.manager_and_supevisor
                                          ?.superVisorDetails?.image
                                          ? `${process.env.REACT_APP_API_URL}${edit?.manager_and_supevisor?.superVisorDetails?.image}`
                                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                      }
                                    >
                                      <img
                                        width={35}
                                        height={35}
                                        className="my-bg object-fit p-1 rounded-circle"
                                        src={
                                          edit?.manager_and_supevisor
                                            ?.superVisorDetails?.image
                                            ? `${process.env.REACT_APP_API_URL}${edit?.manager_and_supevisor?.superVisorDetails?.image}`
                                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                        }
                                      />{" "}
                                    </ImageViewer>
                                    {
                                      edit?.manager_and_supevisor
                                        ?.superVisorDetails?.name
                                    }{" "}
                                    -{" "}
                                    {
                                      edit?.manager_and_supevisor
                                        ?.superVisorDetails?.employee_id
                                    }
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>
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
                      isDisabled={edit?.isComplaintAssigned}
                      onChange={(val) => {
                        props.setFieldValue("manger_id", val);
                        props.setFieldValue("supervisor_id", null);
                        props.setFieldValue("assign_to", null);
                      }}
                      options={allHrTeamManagers?.map((data) => {
                        return {
                          value: data.id,
                          label: data.name,
                        };
                      })}
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
                      onChange={(val) => {
                        if (val && val.value) {
                          const selectedUser = freeSupervisorData.find(
                            (user) => user.id === val.value
                          );

                          if (selectedUser && selectedUser.free_end_users > 0) {
                            handleSupervisorChange(
                              val.value,
                              props.setFieldValue
                            );
                            props.setFieldValue("supervisor_id", val);
                            props.setFieldValue("assign_to", null);
                          } else {
                            toast.error(
                              "Selected supervisor has no free end users."
                            );
                          }
                        }
                      }}
                      options={freeSupervisorData?.map((user) => {
                        return {
                          employee_id: user.employee_id,
                          value: user.id,
                          label: user.name,
                          image: user.image
                            ? `${process.env.REACT_APP_API_URL}${user.image}`
                            : null,
                          freeEndUsersCount: user.free_end_users,
                        };
                      })}
                      formatOptionLabel={supervisorOption}
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
                      isMulti
                      menuPortalTarget={document.body}
                      className="text-primary remove-icon"
                      name="assign_to"
                      value={props.values.assign_to}
                      onChange={(val) => props.setFieldValue("assign_to", val)}
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
                      isClearable
                      formatOptionLabel={userOption}
                    />
                    <ErrorMessage
                      name="assign_to"
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
                        title={`Confirm ${removeId ? "Remove" : "Update"}`}
                        description={`Are you sure you want to ${removeId ? "remove" : "update"
                          } this!!`}
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

export default UpdateAllocate;
