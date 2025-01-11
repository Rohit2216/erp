import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Col, Form, Row } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";
import { BsPlus, BsTelephoneOutbound, BsXLg } from "react-icons/bs";
import {
  deleteAdminSingleHRTeams,
  getAdminSingleHRTeams,
  getAdminUserListToAddTeams,
  postAdminUserListToAddTeams,
} from "../../services/authapi";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useParams } from "react-router-dom";
import TooltipComponent from "../../components/TooltipComponent";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { ErrorMessage, Formik } from "formik";
import Modaljs from "../../components/Modal";
import { addTeamMemberListSchema } from "../../utils/formSchema";
import ImageViewer from "../../components/ImageViewer";

const HrTeamMembers = () => {
  const [singleData, setSingleData] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allUserList, setAllUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { id } = useParams();

  const fetchSingleHrTeamsData = async () => {
    const res = await getAdminSingleHRTeams(id, search);
    if (res.status) {
      setSingleData(res.data);
    } else {
      setSingleData({});
    }
    setIsLoading(false);
  };

  const fetchAllUserList = async () => {
    const res = await getAdminUserListToAddTeams(id);
    if (res.status) {
      setAllUserList(res.data);
    } else {
      setAllUserList([]);
    }
  };

  const handleDelete = async () => {
    const sData = {
      team_id: id,
      user_id: idToDelete,
    };
    // return console.log("sData", sData);
    const res = await deleteAdminSingleHRTeams(sData);
    if (res.status) {
      fetchSingleHrTeamsData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const userId = values.user_id?.map((itm) => itm.value);
    const sData = {
      team_id: id,
      user_id: userId,
    };
    // return console.log("sData", sData);
    const res = await postAdminUserListToAddTeams(sData);
    if (res.status) {
      toast.success(res.message);
      fetchSingleHrTeamsData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowModal(false);
  };

  useEffect(() => {
    fetchSingleHrTeamsData();
    if (showModal) {
      fetchAllUserList();
    }
  }, [search, showModal]);

  const { t } = useTranslation();
  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Team Members · CMS Electricals</title>
      </Helmet>
      <CardComponent
        className={"after-bg-light"}
        title={`Team Members - ${singleData?.team_name}`}
        icon={<BsPlus />}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        onclick={() => setShowModal(true)}
        tag={"Create"}
      >
        <Row className="g-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">Team Details</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>Team Name :</th>
                      <td>{singleData?.team_name}</td>
                    </tr>
                    <tr>
                      <th className="align-middle">Manager :</th>
                      <td>
                        <ImageViewer
                          src={
                            singleData.manager_image
                              ? `${process.env.REACT_APP_API_URL}${singleData.manager_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              singleData.manager_image
                                ? `${process.env.REACT_APP_API_URL}${singleData.manager_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                        {singleData?.manager_name}{" "}
                        {singleData?.employee_id ? "-" : null}{" "}
                        {singleData?.employee_id}
                      </td>
                    </tr>
                    <tr>
                      <th className="align-middle">Supervisor :</th>
                      <td>
                        <ImageViewer
                          src={
                            singleData.supervisor_image
                              ? `${process.env.REACT_APP_API_URL}${singleData.supervisor_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              singleData.supervisor_image
                                ? `${process.env.REACT_APP_API_URL}${singleData.supervisor_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                        {singleData?.supervisor_name}{" "}
                        {singleData?.employee_id ? "-" : null}{" "}
                        {singleData?.employee_id}
                      </td>
                    </tr>
                    <tr>
                      <th>Description :</th>
                      <td>{singleData?.team_short_description}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          {isLoading ? (
            <div className="text-center">
              <img
                className="p-3"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                alt="Loading"
              />
            </div>
          ) : singleData?.members?.length > 0 ? (
            <>
              {singleData?.members?.map((teams) => {
                return (
                  <Col md={3} key={teams.id}>
                    <div
                      style={{
                        backgroundColor: "#FFDEE9",
                        backgroundImage:
                          "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)",
                      }}
                      className="bg-new h-100 p-3 text-center position-relative"
                    >
                      <span className="position-absolute top-0 end-0">
                        <TooltipComponent align={"left"} title={t("Remove")}>
                          <BsXLg
                            onClick={() => {
                              setIdToDelete(teams.id);
                              setShowAlert(true);
                            }}
                            className={`social-btn red-combo`}
                            style={{ borderRadius: "11px 0" }}
                          />
                        </TooltipComponent>
                      </span>
                      <div
                        style={{ width: 100, height: 100 }}
                        className="mx-auto rounded-circle"
                      >
                        <img
                          width={100}
                          height={100}
                          className="rounded-circle object-fit p-2 shadow"
                          src={
                            teams.image
                              ? `${process.env.REACT_APP_API_URL}${teams.image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                          alt="img"
                        />
                      </div>
                      <strong className="d-block py-2 text-black">
                        {teams.name}
                        <span className="small text-muted fw-lighter">
                          {" "}
                          ({teams.role})
                        </span>
                      </strong>
                      <span className="d-block text-black">
                        {teams.employee_id}
                      </span>
                      {teams.mobile && (
                        <a
                          className="small text-decoration-none d-block text-secondary"
                          href={`tel:${teams.mobile}`}
                        >
                          <BsTelephoneOutbound /> {teams?.mobile}
                        </a>
                      )}
                      {teams.email && (
                        <a
                          href={`mailto:${teams.email}`}
                          className="small text-decoration-none text-gray"
                        >
                          {teams.email}
                        </a>
                      )}
                    </div>
                  </Col>
                );
              })}
            </>
          ) : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
        </Row>
      </CardComponent>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Remove"}
        description={"Are you sure you want to remove this!!"}
      />

      <Formik
        enableReinitialize={true}
        initialValues={{
          user_id: "",
        }}
        validationSchema={addTeamMemberListSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={showModal}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setShowModal(false)}
            title={"Create Team Member"}
            formikProps={props}
          >
            <Row className="g-2">
              <Form.Group as={Col} md={12}>
                <Form.Label>Team Member</Form.Label>
                <Select
                  menuPosition="fixed"
                  isMulti
                  name="user_id"
                  value={props.values.user_id}
                  onChange={(val) => props.setFieldValue("user_id", val)}
                  options={allUserList?.map((user) => ({
                    value: user.id,
                    label: user.name,
                  }))}
                />
                <ErrorMessage
                  name="user_id"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </Col>
  );
};

export default HrTeamMembers;
