import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Spinner, Form } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { BiPaperPlane } from "react-icons/bi";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  getSendMessagesById,
  postMessages,
  updateMessages,
} from "../../services/contractorApi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSendMessage } from "../../utils/formSchema";

const SendMessages = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const { t } = useTranslation();

  const location = useLocation();
  const { id, data, selectedId } = location.state || {};

  const navigate = useNavigate();

  const fetchMessageById = async () => {
    const res = await getSendMessagesById(selectedId);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const filteredCompany = data?.filter((item) =>
    id.includes(item.id || item.user_id)
  );
  const companyData = filteredCompany?.map((item) => {
    const phoneNumbers = Array.isArray(item.email) ? item.email : [item.email];
    return phoneNumbers?.map((phone) => phone?.email).join(", ");
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const ids = values.to.map((itm) => {
      return itm.value;
    });

    const sData = {
      to: values.to?.map((option) => option.value).join(", "),
      user_ids: ids,
      title: values.title,
      message: values.message,
      date: values.date,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    const res = edit.id
      ? await updateMessages(sData)
      : await postMessages(sData);
    if (res?.status) {
      toast.success(res?.message);
      navigate(`/contacts/energy`);
    } else {
      toast.error(res?.message);
    }
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchMessageById();
    }
  }, [id]);

  const options =
    data?.map((item) => ({
      value: item.id,
      label: item.email || item.ifsc_code,
    })) || [];

  const preSelectedOptions =
    filteredCompany?.map((item, index) => ({
      value: item.id,
      label: companyData[index] || item.email || item.ifsc_code,
    })) || [];

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Contacts · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          showBackButton={true}
          title={`${edit?.id ? "Update" : "Create"} Send Messages`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              title: edit.title || "",
              message: edit.message || "",
              date: edit.date || "",
              to: edit.users
                ? edit.users.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })
                : preSelectedOptions,
            }}
            validationSchema={addSendMessage}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <div className="shadow p-3">
                    <Form.Group as={Col} md={3} className=" mb-3">
                      <Form.Control
                        value={props.values.date}
                        onChange={props.handleChange}
                        type="date"
                        name="date"
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.date && props.errors.date
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.date}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                      <div className="p-3 mb-3 rounded h-900">
                        <Form.Label>
                          {t("To")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Select
                          isMulti
                          menuPortalTarget={document.body}
                          name="to"
                          value={props.values.to}
                          onChange={(selectedOptions) =>
                            props.setFieldValue("to", selectedOptions)
                          }
                          isOptionDisabled={(option) =>
                            preSelectedOptions.some(
                              (pre) => pre.value === option.value
                            )
                          }
                        />
                      </div>
                      <Col md={12}>
                        <Form.Label className="fw-bolder ms-3">
                          {t("Title")}
                        </Form.Label>
                        <div className="p-3 rounded h-100">
                          <Form.Control
                            type="text"
                            name="title"
                            value={props.values.title}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.title && props.errors.title
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.title}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={12}>
                        <Form.Label className="fw-bolder ms-3">
                          {t("Message")}
                        </Form.Label>
                        <div className="p-3 rounded h-100">
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="message"
                            value={props.values.message}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.message && props.errors.message
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.message}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </div>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`submit`}
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
                          <>
                            {t("Send")} <BiPaperPlane />
                          </>
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
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default SendMessages;
