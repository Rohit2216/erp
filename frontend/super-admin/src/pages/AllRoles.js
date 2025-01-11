import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsChevronDoubleRight, BsPlus } from "react-icons/bs";
import CardComponent from "../components/CardComponent";
import Modaljs from "../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import ActionButton from "../components/ActionButton";
import {
  getAdminAllRoles,
  postAdminCreateRoles,
  getAdminDeleteRoles,
  getAdminUpdateRoles,
} from "../services/authapi";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addRolesSchema } from "../utils/formSchema";
import ConfirmAlert from "../components/ConfirmAlert";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import CustomTable from "../components/CustomTable";
import { checkPermission } from "../utils/checkPermissions";
import { CREATED, DELETED, UPDATED } from "../utils/constants";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

const AllRoles = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [rolesData, setRolesData] = useState(false);
  const [roles, setRoles] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState(0);
  const [pageSize, setPageSize] = useState(90000000000);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRolesData = async () => {
    const res = await getAdminAllRoles(search, pageSize);
    if (res.status) {
      setRoles(res.data);
    } else {
      setRoles([]);
    }
    setIsLoading(false);
  };

  const handleEdit = async (role) => {
    setEdit(role);
    setRolesData(true);
  };

  const handleDelete = async () => {
    const params = await checkPermission({ user_id: user.id, pathname });
    params["action"] = DELETED;
    const res = await getAdminDeleteRoles(idToDelete, params);
    if (res.status) {
      toast.success(res.message);
      setRoles((prev) => prev.filter((itm) => itm.id !== idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      name: values.name,
    };

    if (edit.id) {
      sData["role_id"] = edit.id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    // console.log('sData', sData)
    const res = edit.id
      ? await getAdminUpdateRoles(sData, params)
      : await postAdminCreateRoles(sData, params);
    if (res.status) {
      fetchRolesData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setRolesData(false);
  };

  useEffect(() => {
    fetchRolesData();
  }, [search]);

  const columns = ["Sr No.", "Roles", "Date", "Roles & Permissions", "Action"];
  const rowData = roles.map((role, index) => [
    index + 1,
    role.name,
    moment(role.created_at).format("DD-MM-YYYY"),
    <Link
      className="text-green text-decoration-none"
      to={`/AllRoles/ViewRolesPermissions/${role.id}`}
    >
      View Permissions
      <BsChevronDoubleRight />
    </Link>,
    <ActionButton
      deleteOnclick={() => {
        setIdToDelete(role.id);
        setShowAlert(true);
      }}
      hideEye={"d-none"}
      editOnclick={() => handleEdit(role)}
    />,
  ]);

  return (
    <>
      <Helmet>
        <title>All Roles · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Roles"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setRolesData(true);
          }}
          tag={"Create"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <div className="overflow-auto p-2">
            <CustomTable
              isLoading={isLoading}
              columns={columns}
              rowData={rowData}
            />
          </div>
        </CardComponent>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit?.id || "",
          name: edit?.name || "",
        }}
        validationSchema={addRolesSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={rolesData}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Save"}
            close={() => setRolesData(false)}
            title={edit.id ? "Update Roles" : "Create Roles"}
          >
            <Form.Group>
              <Form.Label>
                Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                onChange={props.handleChange}
                value={props.values.name}
                name="name"
              />
              <ErrorMessage
                name="name"
                component="small"
                className="text-danger"
              />
            </Form.Group>
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

export default AllRoles;
