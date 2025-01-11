import React, { useEffect, useRef } from "react";
import { Col, Form, Row, Spinner, Image } from "react-bootstrap";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import { ErrorMessage, FieldArray, Formik } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllBankData,
  getAllState,
  getSingleSuppliersById,
  postSuppliers,
  updateSuppliers,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSupplierSchema } from "../../utils/formSchema";
import { Helmet } from "react-helmet";
import { BsPlusLg, BsTrash } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import { useTranslation } from "react-i18next";
import ViewSupplier from "../../components/ModalContent/ViewSupplier";
import ImageViewer from "../../components/ImageViewer";

const CreateSupplier = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const qr_file_ref = useRef(null);

  const fetchPurchaseOrderData = async () => {
    const res = await getSingleSuppliersById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };
  const fetchBankData = async () => {
    const res = await getAllBankData();
    if (res.status) {
      setBankData(res.data);
    } else {
      setBankData([]);
    }
  };
  const showStateApi = async () => {
    const res = await getAllState();
    if (res.status) {
      setStateData(res.data);
    } else {
      setStateData([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchPurchaseOrderData();
    }
    showStateApi();
    fetchBankData();
  }, [id]);

  const getQrImageLink = (file) => {
    const type = file?.split(":")[0] == "data" ? "new" : "edit";
    if (type == "new") {
      return file;
    } else {
      const url = `${process.env.REACT_APP_API_URL}${file}`;
      return url;
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      supplier_name: values.supplier_name,
      owner_name: values.owner_name,
      cashier_name: values.cashier_name,
      bank_id: values.bank_id.value,
      account_holder_name: values.account_holder_name,
      account_number: values.account_number,
      branch_name: values.branch_name,
      ifsc_code: values.ifsc_code,
      upi_id: values.upi_id,
      upi_image: values.upi_image,
      address: values.address,
    };

    // return console.log("sData", sData);
    const res = edit?.id
      ? await updateSuppliers(edit?.id, sData)
      : await postSuppliers(sData);
    if (res.status) {
      toast.success(res.message);
      navigate("/request-supplier");
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
  };

  const formatOptionLabel = ({ label, logo }) => (
    <div>
      <img src={logo} className="avatar me-2" />
      {label}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          {type === "view" ? "View" : edit?.id ? "Update" : "Create"} Suppliers
          · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view" ? "View" : edit?.id ? "Update" : "Create"
          } Supplier`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              supplier_name: edit?.supplier_name || "",
              owner_name: edit?.owner_name || "",
              cashier_name: edit?.cashier_name || "",
              upi_image: edit.upi_image || null,
              bank_id: edit.bank_id
                ? {
                    label: edit?.bank_name,
                    value: edit.bank_id,
                    logo: process.env.REACT_APP_API_URL + edit?.bank_logo,
                  }
                : "",
              account_holder_name: edit?.account_holder_name || "",
              account_number: edit?.account_number || "",
              branch_name: edit?.branch_name || "",
              ifsc_code: edit?.ifsc_code || "",
              upi_id: edit?.upi_id || "",
              upi_image: edit?.upi_image || "",
              address: edit?.supplier_addresses || [
                {
                  shop_office_number: "",
                  street_name: "",
                  city: "",
                  state: "",
                  pin_code: "",
                  landmark: "",
                  gst_number: "",
                  is_default: false,
                },
              ],
            }}
            // validationSchema={addSupplierSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  {type === "view" ? (
                    <ViewSupplier edit={edit} />
                  ) : (
                    <>
                      <Form.Group as={Col} md={6}>
                        <div className="shadow p-3">
                          <div className="mb-2">
                            <Form.Label className="fw-bolder">
                              {t("Supplier Name")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="supplier_name"
                              onChange={props.handleChange}
                              value={props.values.supplier_name}
                              onBlur={props.handleBlur}
                              isInvalid={Boolean(
                                props.touched.supplier_name &&
                                  props.errors.supplier_name
                              )}
                            />
                            <ErrorMessage
                              name="supplier_name"
                              component="small"
                              className="text-danger"
                            />
                          </div>
                          <Form.Label className="fw-bolder">
                            {t("Owner Name")}{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="owner_name"
                            onChange={props.handleChange}
                            value={props.values.owner_name}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.owner_name &&
                                props.errors.owner_name
                            )}
                          />
                          <ErrorMessage
                            name="owner_name"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </Form.Group>
                      <Form.Group as={Col} md={6}>
                        <div className="shadow p-3">
                          <div className="mb-2">
                            <Form.Label className="fw-bolder">
                              {t("Cashier Name")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="cashier_name"
                              onChange={props.handleChange}
                              value={props.values.cashier_name}
                            />
                            <ErrorMessage
                              name="cashier_name"
                              component="small"
                              className="text-danger"
                            />
                          </div>
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
                        <div className="shadow p-3">
                          <Row className="g-3 align-items-center">
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("Bank Name")}
                                <span className="text-danger fw-bold">*</span>
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"bank_id"}
                                value={props.values.bank_id}
                                options={bankData?.map((itm) => ({
                                  label: itm.bank_name,
                                  value: itm.id,
                                  logo: itm.logo
                                    ? `${process.env.REACT_APP_API_URL}${itm.logo}`
                                    : null,
                                }))}
                                onChange={(selectedOption) => {
                                  props.setFieldValue(
                                    "bank_id",
                                    selectedOption
                                  );
                                  props.setFieldValue(
                                    "account_holder_name",
                                    ""
                                  );
                                  props.setFieldValue("account_number", "");
                                  props.setFieldValue("branch_name", "");
                                  props.setFieldValue("ifsc_code", "");
                                  props.setFieldValue("upi_id", "");
                                }}
                                formatOptionLabel={formatOptionLabel}
                              />
                              <ErrorMessage
                                name="bank_id"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("account holder name")}
                                <span className="text-danger fw-bold">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="account_holder_name"
                                value={props.values.account_holder_name}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.account_holder_name &&
                                    props.errors.account_holder_name
                                )}
                              />
                              <ErrorMessage
                                name="account_holder_name"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("account number")}
                                <span className="text-danger fw-bold">*</span>
                              </Form.Label>
                              <Form.Control
                                type="number"
                                name="account_number"
                                value={props.values.account_number}
                                onChange={(e) => {
                                  if (e.target.value.length <= 18) {
                                    props.handleChange(e);
                                  }
                                }}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.account_number &&
                                    props.errors.account_number
                                )}
                              />
                              <ErrorMessage
                                name="account_number"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("branch name")}
                                <span className="text-danger fw-bold">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="branch_name"
                                value={props.values.branch_name}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.branch_name &&
                                    props.errors.branch_name
                                )}
                              />
                              <ErrorMessage
                                name="branch_name"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("ifsc code")}
                                <span className="text-danger fw-bold">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="ifsc_code"
                                value={props.values.ifsc_code}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.ifsc_code &&
                                    props.errors.ifsc_code
                                )}
                              />
                              <ErrorMessage
                                name="ifsc_code"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>{t("upi id")}</Form.Label>
                              <Form.Control
                                type="text"
                                name="upi_id"
                                value={props.values.upi_id}
                                onChange={props.handleChange}
                              />
                            </Form.Group>

                            <Form.Group as={Col} md={12} className="">
                              <Form.Label id="upi_image" className="fw-bold">
                                {t("qr image")}
                              </Form.Label>
                              <div className="row">
                                <div className="col-md-4">
                                  <Form.Control
                                    ref={qr_file_ref}
                                    type="file"
                                    name="upi_image"
                                    className="my-2"
                                    accept="image/png, image/jpeg, image/jpg, image/jfif "
                                    onChange={(e) => {
                                      const file = e?.target?.files?.[0];
                                      if (file?.size > 1000000 * 5) {
                                        return toast.error(
                                          "File size Is Too Large"
                                        );
                                      }
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (data) => {
                                          props.setFieldValue(
                                            "upi_image",
                                            data.target.result
                                          );
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </div>

                                {props.values.upi_image && (
                                  <Form.Group as={Col} md={4}>
                                    <div className="position-relative d-flex">
                                      <ImageViewer
                                        src={getQrImageLink(
                                          props.values.upi_image
                                        )}
                                      >
                                        <Image
                                          style={{
                                            height: "120px",
                                            width: "100%",
                                            maxWidth: "100%",
                                          }}
                                          className="object-fit mt-1"
                                          src={getQrImageLink(
                                            props.values.upi_image
                                          )}
                                        />
                                      </ImageViewer>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          props.setFieldValue("upi_image", "");
                                          if (qr_file_ref.current) {
                                            qr_file_ref.current.value = "";
                                          }
                                        }}
                                        className="shadow border-0 danger-combo cursor-pointer px-4 py-1 my-1"
                                      >
                                        X
                                      </button>
                                    </div>
                                  </Form.Group>
                                )}
                              </div>
                            </Form.Group>
                          </Row>
                        </div>
                      </Form.Group>

                      <FieldArray name="address">
                        {({ remove, push }) => (
                          <>
                            {props.values.address.length > 0 &&
                              props.values.address.map((itm, index) => (
                                <Form.Group as={Col} md={12}>
                                  <div className="shadow border-orange border-5 border-start rounded p-3">
                                    <Row className="g-3 align-items-end">
                                      <Form.Group as={Col} md={4}>
                                        <Form.Label>
                                          {t("shop office number")}
                                        </Form.Label>
                                        <Form.Control
                                          type="text"
                                          name={`address.${index}.shop_office_number`}
                                          value={itm.shop_office_number}
                                          onChange={props.handleChange}
                                        />
                                      </Form.Group>
                                      <Form.Group as={Col} md={4}>
                                        <Form.Label>
                                          {t("street name")}
                                        </Form.Label>
                                        <Form.Control
                                          type="text"
                                          name={`address.${index}.street_name`}
                                          value={itm.street_name}
                                          onChange={props.handleChange}
                                        />
                                      </Form.Group>
                                      <Form.Group as={Col} md={4}>
                                        <Form.Label>{t("city")}</Form.Label>
                                        <Form.Control
                                          type="text"
                                          name={`address.${index}.city`}
                                          value={itm.city}
                                          onChange={props.handleChange}
                                        />
                                      </Form.Group>

                                      <Form.Group as={Col} md={4}>
                                        <Form.Label className="fw-bolder">
                                          {t("Select State")}
                                          <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Select
                                          className="text-primary w-100"
                                          menuPortalTarget={document.body}
                                          name={`address.${index}.state`}
                                          value={{
                                            label: itm?.state,
                                            value: itm?.state,
                                          }}
                                          options={stateData?.map((itm) => ({
                                            label: itm.name,
                                            value: itm.name,
                                          }))}
                                          onChange={(selectedOption) => {
                                            props.setFieldValue(
                                              `address[${index}].state`,
                                              selectedOption.label
                                            );
                                          }}
                                          onBlur={props.handleBlur}
                                          isInvalid={Boolean(
                                            props.touched.state &&
                                              props.errors.state
                                          )}
                                        />
                                      </Form.Group>
                                      <Form.Group as={Col} md={4}>
                                        <Form.Label>{t("pin code")}</Form.Label>
                                        <Form.Control
                                          type="text"
                                          name={`address.${index}.pin_code`}
                                          value={itm.pin_code}
                                          onChange={props.handleChange}
                                        />
                                      </Form.Group>
                                      <Form.Group as={Col} md={4}>
                                        <Form.Label>{t("landmark")}</Form.Label>
                                        <Form.Control
                                          type="text"
                                          name={`address.${index}.landmark`}
                                          value={itm.landmark}
                                          onChange={props.handleChange}
                                        />
                                      </Form.Group>
                                      <Form.Group as={Col} md={4}>
                                        <Form.Label>
                                          {t("gst number")}
                                        </Form.Label>
                                        <Form.Control
                                          type="text"
                                          name={`address.${index}.gst_number`}
                                          value={itm.gst_number}
                                          onChange={props.handleChange}
                                        />
                                      </Form.Group>
                                      <Form.Group as={Col} md={4}></Form.Group>
                                    </Row>
                                  </div>

                                  <div className="d-flex align-items-center gap-2 m-2 ">
                                    <TooltipComponent title={t("Duplicate")}>
                                      <BsPlusLg
                                        onClick={() =>
                                          push({
                                            shop_office_number: "",
                                            street_name: "",
                                            city: "",
                                            state: "",
                                            pin_code: "",
                                            landmark: "",
                                            gst_number: "",
                                            is_default: false,
                                          })
                                        }
                                        className="social-btn success-combo"
                                      />
                                    </TooltipComponent>
                                    {index === 0 ? null : (
                                      <TooltipComponent title={t("Delete")}>
                                        <BsTrash
                                          onClick={() =>
                                            index !== 0 && remove(index)
                                          }
                                          className="social-btn red-combo"
                                        />
                                      </TooltipComponent>
                                    )}
                                    <div className="vr hr-shadow" />
                                    <span>
                                      <Form.Label className="d-align">
                                        <Form.Check
                                          type="radio"
                                          name={`address.${index}.is_default`}
                                          id={`address.${index}.is_default`}
                                          value="1"
                                          checked={itm.is_default === "1"}
                                          onChange={() => {
                                            props.setFieldValue(
                                              `address.${index}.is_default`,
                                              "1"
                                            );
                                            props.values.address.forEach(
                                              (_, i) => {
                                                if (i !== index) {
                                                  props.setFieldValue(
                                                    `address.${i}.is_default`,
                                                    "0"
                                                  );
                                                }
                                              }
                                            );
                                          }}
                                        />
                                        {t("Mark Default")}
                                      </Form.Label>
                                    </span>
                                  </div>
                                </Form.Group>
                              ))}
                          </>
                        )}
                      </FieldArray>

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
                                />{" "}
                                {t("PLEASE WAIT")}...
                              </>
                            ) : (
                              <>{edit.id ? t("UPDATE") : t("CREATE")}</>
                            )}
                          </button>
                          <ConfirmAlert
                            size={"sm"}
                            deleteFunction={
                              props.isValid
                                ? props.handleSubmit
                                : setShowAlert(false)
                            }
                            hide={setShowAlert}
                            show={showAlert}
                            title={"Confirm UPDATE"}
                            description={
                              "Are you sure you want to update this!!"
                            }
                          />
                        </div>
                      </Form.Group>
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateSupplier;
