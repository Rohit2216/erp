import React, { useEffect, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Allowances from "./Allowances";
import Deductions from "./Deductions";
import { BsPencilSquare, BsPlus } from "react-icons/bs";
import Modaljs from "../../../components/Modal";
import { ErrorMessage, Formik } from "formik";
import {
  CreatePayrollMaster,
  UpdatePayrollMaster,
  UpdatePayrollMasterSetting,
  getAllRolesForDropDown,
  getAllPayrollMaster,
  getAllUsers,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import TooltipComponent from "../../../components/TooltipComponent";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../utils/constants";
import { addPayrollMasterSettingSchema } from "../../../utils/formSchema";

const PayrollMaster = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [payrollMaster, setPayrollMaster] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const [edit, setEdit] = useState({});
  const [roles, setRoles] = useState([]);
  const [allUserData, setAllUserData] = useState([]);

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchRolesData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      setRoles(res.data);
    } else {
      setRoles([]);
    }
  };

  useEffect((val) => {
    fetchRolesData();
    fetchAllUsersData();
  }, []);

  const tabs = [
    { title: "Payroll Master", className: "fw-bold px-0 pe-none" },
    { title: "Settings", className: "ms-auto", page: <Settings /> },
    {
      title: "Allowances",
      page: <Allowances allUserData={allUserData} roles={roles} />,
    },
    {
      title: "Deductions",
      page: <Deductions allUserData={allUserData} roles={roles} />,
    },
  ];

  const fetchPayrollMasterData = async () => {
    const res = await getAllPayrollMaster();
    if (res.status) {
      setMasterData(res.data);
    } else {
      setMasterData([]);
    }
  };

  function Settings() {
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      // return console.log('values', values)
      const sData = {
        label: values.label,
        active_setting: values.active_setting.value,
        input_type: "radio",
      };

      if (edit.id) {
        sData["id"] = edit.id;
      }

      const params = await checkPermission({
        user_id: user.id,
        pathname: `/${pathname.split("/")[1]}`,
      });
      params["action"] = edit.id ? UPDATED : CREATED;

      // return console.log('sData', sData)
      const res = edit.id
        ? await UpdatePayrollMasterSetting(sData, params)
        : await CreatePayrollMaster(sData, params);
      if (res.status) {
        fetchPayrollMasterData();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      resetForm();
      setSubmitting(false);
      setPayrollMaster(false);
    };

    const handleSettingUpdate = async (
      values,
      { setSubmitting, resetForm }
    ) => {
      // return console.log('values', values)
      const sData = {
        id: values.id,
      };

      const params = await checkPermission({
        user_id: user.id,
        pathname: `/${pathname.split("/")[1]}`,
      });
      params["action"] = UPDATED;
      // return console.log('sData', sData)
      const res = await UpdatePayrollMaster(sData, params);
      if (res.status) {
        fetchPayrollMasterData();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      resetForm();
      setSubmitting(false);
    };

    const handleEdit = async (data) => {
      setEdit(data);
      setPayrollMaster(true);
    };

    return (
      <Card className={`shadow border-0 h-100`}>
        <Card.Header
          className={`d-align justify-content-between bg-transparent border-primary p-3`}
        >
          <strong className={`d-align justify-content-between`}>
            All Settings
          </strong>{" "}
          <span className="d-align justify-content-between gap-2">
            <Button
              variant="light"
              className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
              onClick={() => {
                setEdit({});
                setPayrollMaster(true);
              }}
            >
              <BsPlus />
              Create
            </Button>
          </span>
        </Card.Header>
        <Card.Body>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id:
                masterData?.filter((d) => +d.active_setting === 1)[0]?.id || "",
            }}
            onSubmit={handleSettingUpdate}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                {masterData?.map((data, index) => (
                  <div className="bg-primary-light1 d-flex gap-3 mb-2 px-2 py-1">
                    <Form.Check
                      type="radio"
                      name="id"
                      id={`id_${data.id}`}
                      value={data?.id}
                      checked={props.values.id === data.id ? true : false}
                      onChange={() => {
                        // console.log(data.id);
                        props.setFieldValue("id", data.id);
                      }}
                    />
                    <TextareaAutosize
                      minRows={1}
                      className="edit-textarea resize-none"
                      name="label"
                      value={data.label}
                      disabled
                    />
                    <TooltipComponent title={"Edit"}>
                      <BsPencilSquare
                        onClick={() => handleEdit(data)}
                        className={`social-btn danger-combo`}
                      />
                    </TooltipComponent>
                  </div>
                ))}
                <Form.Group as={Col} md={12}>
                  <div className="text-center mt-4">
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
                        <>SAVE</>
                      )}
                    </button>
                  </div>
                </Form.Group>
              </Form>
            )}
          </Formik>

          <Formik
            enableReinitialize={true}
            initialValues={{
              label: edit?.label || "",
              active_setting: edit.active_setting
                ? {
                    label: edit.active_setting == "1" ? "Active" : "DeActive",
                    value: edit.active_setting,
                  }
                : "",
            }}
            validationSchema={addPayrollMasterSettingSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Modaljs
                formikProps={props}
                open={payrollMaster}
                size={"md"}
                closebtn={"Cancel"}
                Savebtn={edit.plan_id ? "Update" : "Save"}
                close={() => setPayrollMaster(false)}
                title={edit.plan_id ? "Update Settings" : "Create Settings"}
              >
                <Row className="g-2">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      Payroll Setting Name{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <TextareaAutosize
                      className="edit-textarea"
                      minRows={1}
                      type="text"
                      name={"label"}
                      value={props.values.label}
                      onChange={props.handleChange}
                    />
                    <ErrorMessage
                      name="label"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      Select active setting{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPosition="fixed"
                      name={"active_setting"}
                      options={[
                        { label: "DeActive", value: "0" },
                        { label: "Active", value: "1" },
                      ]}
                      value={props.values.active_setting}
                      onChange={(selectedOption) => {
                        props.setFieldValue("active_setting", selectedOption);
                      }}
                    />
                    <ErrorMessage
                      name="active_setting"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                </Row>
              </Modaljs>
            )}
          </Formik>
        </Card.Body>
      </Card>
    );
  }

  function MyCard({ children }) {
    return (
      <Card className="card-bg h-100">
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }

  useEffect(() => {
    fetchPayrollMasterData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Payroll Master · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <MyCard>
          <Tabs
            activeTab="2"
            ulClassName="border-primary border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <div className="mt-4">{tab.page}</div>
              </Tab>
            ))}
          </Tabs>
        </MyCard>
      </Col>
    </>
  );
};

export default PayrollMaster;
