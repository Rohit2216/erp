import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import {
  getAllEndUserBySupervisorId,
  getApprovedComplaintsDetailsById,
  getManagerListWithTotalFreeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
  postAssignComplaintToUser,
  postHoldComplaintToUser,
} from "../../services/contractorApi";
import { addAllocateSchema } from "../../utils/formSchema";
import ImageViewer from "../../components/ImageViewer";

const HoldComplaints = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      area_manager_id: values.manger_id.value,
      supervisor_id: values.supervisor_id.value,
      user_id: values.user_id.value,
    };
    // return console.log("sData", sData);
    const res = await postHoldComplaintToUser(sData);
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
      className={`${data?.isDisabled ? "danger-combo-disable pe-none1" : ""
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

  const supervisorWithAssignedFlag = freeSupervisorData.find(
    (user) => user.isSupervisorAssigned
  );
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

  const allSuperviseor = freeSupervisorData?.map((user) => ({
    employee_id: user.employee_id,
    value: user.id,
    label: user.name,
    image: user.image ? `${process.env.REACT_APP_API_URL}${user.image}` : null,
    // freeEndUsersCount: user.isManagerAssigned,
    freeEndUsersCount: user.free_end_users,
  }));

  return (
    <>
      <Helmet>
        <title>Allocate · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent className={"after-bg-light"} title={`Hold Complaint`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              manger_id:
                "",
              supervisor_id:
                {
                  label: edit?.manager_and_supevisor?.superVisorDetails?.name,
                  value: edit?.manager_and_supevisor?.superVisorDetails?.id,
                } || "",
              user_id: edit?.manager_and_supevisor?.endUserDetails
                ? edit?.manager_and_supevisor?.endUserDetails?.map((itm) => {
                  return { label: itm.name, value: itm.id };
                })
                : [],
            }}
            validationSchema={addAllocateSchema}
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
                      // isDisabled={managerWithAssignedFlag}
                      isDisabled={edit?.isComplaintAssigned}
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
                      // isDisabled={supervisorWithAssignedFlag}
                      isDisabled={edit?.isComplaintAssigned}
                      onChange={(val) => {
                        if (val && val.value) {
                          const selectedUser = freeSupervisorData.find(
                            (user) => user.id === val.value
                          );

                          if (selectedUser) {
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
                      options={allSuperviseor}
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
                        // isAssigned: user.isAssigned,`
                        // isDisabled: user.isAssigned,
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
                        type={`submit`}
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
                          "Hold Complaint"
                        )}
                      </button>
                      {/* <ConfirmAlert
                        size={"sm"}
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Confirm Allowcate"}
                        description={
                          "Are you sure you want to allowcate this!!"
                        }
                      /> */}
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

export default HoldComplaints;