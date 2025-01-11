import React, { useEffect, useRef } from "react";
import { Card, Col, Form, Image, Row, Spinner, Stack } from "react-bootstrap";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";

import {
  getAllBankListForDropdown,
  getAllGstTypes,
  getAllROData,
  getAllState,
  getCheckPoIsExists,
  getFromCompanyList,
  getSinglePurchaseOrderById,
  getToCompanyList,
  postPurchaseOrder,
  updatePurchaseOrder,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addPoSchema } from "../../utils/formSchema";
import TextareaAutosize from "react-textarea-autosize";
import { Helmet } from "react-helmet";
import moment from "moment";
import Papa from "papaparse";
import ImageViewer from "../../components/ImageViewer";
import TablePurchaseOrder from "./TablePurchaseOrder";
import { useTranslation } from "react-i18next";

const CreatePurchaseOrder = () => {
  const [edit, setEdit] = useState({});
  const [stateData, setStateData] = useState([]);
  const [roData, setRoData] = useState([]);
  const [gstTypesData, setGstTypesData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [allBankData, setAllBankData] = useState([]);
  const [fromCompany, setFromCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toCompany, setToCompany] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const cr_file_ref = useRef(null);
  const sd_copy_ref = useRef(null);
  const { t } = useTranslation();

  const fetchPurchaseOrderData = async () => {
    const res = await getSinglePurchaseOrderById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const fetchFromCompanyList = async () => {
    const res = await getFromCompanyList();
    if (res.status) {
      setFromCompany(res.data);
    } else {
      setFromCompany([]);
    }
  };

  const fetchToCompanyList = async () => {
    const res = await getToCompanyList();
    if (res.status) {
      setToCompany(res.data);
    } else {
      setToCompany([]);
    }
  };

  const handleFileUpload = (event, props) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;

        Papa.parse(text, {
          header: true,
          complete: (result) => {
            const data = result.data.map((item) => {
              if (item.Name) return item;
            });

            props.setFieldValue(
              "po_items",
              data.filter((item) => item)
            );
          },
        });
      };
      reader.readAsText(file);
    }
    setLoading(false);
  };

  const showStateApi = async () => {
    const res = await getAllState();
    if (res.status) {
      setStateData(res.data);
    } else {
      setStateData([]);
    }
  };
  const showROApi = async () => {
    const res = await getAllROData();
    if (res.status) {
      setRoData(res.data);
    } else {
      setRoData([]);
    }
  };

  const fetchAllGstTypes = async () => {
    const res = await getAllGstTypes();
    if (res.status) {
      setGstTypesData(res.data);
    } else {
      setGstTypesData([]);
    }
  };
  const fetchAllBank = async () => {
    const res = await getAllBankListForDropdown();
    if (res.status) {
      setAllBankData(res.data);
    } else {
      setAllBankData([]);
    }
  };
  const handleCheckPoIsExists = async (e, setFieldValue) => {
    const poNumber = e.target.value;
    const res = await getCheckPoIsExists(poNumber);
    if (res.status) {
      toast.error(res.message);
    }
    if (setFieldValue) {
      setFieldValue("po_number", poNumber);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchPurchaseOrderData();
    }
  }, []);

  useEffect(() => {
    fetchToCompanyList();
    fetchFromCompanyList();
    showStateApi();
    fetchAllGstTypes();
    showROApi();
    fetchAllBank();
  }, [id]);

  const getAttachmentFormatAndLink = (file) => {
    const type = file?.name ? "new" : "edit";
    if (type == "new") {
      const url = URL.createObjectURL(file);
      if (
        file?.name.split(".")?.[1] == "png" ||
        file?.name.split(".")?.[1] == "jpeg" ||
        file?.name.split(".")?.[1] == "jpg" ||
        file?.name.split(".")?.[1] == "jfif"
      )
        return { url, type: "image" };
      else if (file?.name.split(".")?.[1] == "pdf") return { url, type: "pdf" };
      else if (
        file?.name.split(".")?.[1] == "doc" ||
        file?.name.split(".")?.[1] == "docx"
      )
        return { url, type: "document" };
    } else {
      const url = `${process.env.REACT_APP_API_URL}${file}`;
      if (
        file?.split(".")?.[1] == "png" ||
        file?.split(".")?.[1] == "jpeg" ||
        file?.split(".")?.[1] == "jpg" ||
        file?.split(".")?.[1] == "jfif"
      )
        return { url, type: "image" };
      else if (file?.split(".")?.[1] == "pdf") return { url, type: "pdf" };
      else if (
        file?.split(".")?.[1] == "doc" ||
        file?.split(".")?.[1] == "docx"
      )
        return { url, type: "document" };
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const modifiedPoItems = values?.po_items?.map((item) => ({
      order_line_number: item.OrderLineNumber,
      hsn_code: item.HsnCode,
      ru_code: item.ru_code,
      description: item.description,
      name: item.Name,
      unit: item.Unit,
      change_gst_type: item.change_gst_type,
      gst_id: item.gst_id,
      gst_percent: item.gst_percent,
      rate: item.Rate,
      qty: item.Qty,
      totalGSTAmount: item.totalGSTAmount,
      amount: item.Amount,
    }));

    const totalItemAmount =
      values.po_items
        .reduce((total, item) => +item.Amount + total, 0)
        .toFixed(2) || 0;

    const formData = new FormData();
    formData.append("po_date", values.po_date);
    formData.append("from_company", values.from_company.value);
    formData.append("to_company", values.to_company.value);
    formData.append("ro_office", values.ro_office.value);
    formData.append("state", values.state.value);
    formData.append("po_number", values.po_number);
    formData.append(
      "limit",
      values.po_for == "1"
        ? totalItemAmount
        : parseFloat(values.limit).toFixed(2)
    );
    formData.append("security_deposit_date", values.security_deposit_date);
    formData.append("security_deposit_amount", values.security_deposit_amount);
    formData.append("tender_date", values.tender_date);
    formData.append("tender_number", values.tender_number);
    formData.append("bank", values.bank.value);
    formData.append("dd_bg_number", values.dd_bg_number);
    formData.append("cr_date", values.cr_date);
    formData.append("cr_number", values.cr_number);
    formData.append("cr_code", values.cr_code);
    formData.append("work", values.work);
    formData.append("cr_copy", values.cr_copy);
    formData.append("cr_copy_title", values.cr_copy_title);
    formData.append("sd_letter", values.sd_letter);
    formData.append("sd_letter_title", values.sd_letter_title);

    formData.append(
      "amount",
      values.po_for == "1" ? totalItemAmount : values.po_amount
    );
    formData.append("po_for", values.po_for.toString());
    formData.append("po_items", JSON.stringify(modifiedPoItems));
    if (values.gst_percent) {
      formData.append("gst_id", values.gst_id.value);
      formData.append("gst_percent", values.gst_percent);
    }

    if (edit.id) {
      formData.append("id", edit.id);
    }
    const res = edit?.id
      ? await updatePurchaseOrder(formData)
      : await postPurchaseOrder(formData);
    if (res.status) {
      toast.success(res.message);
      navigate("/PurchaseOrder");
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

  const data = [
    [
      "OrderLineNumber",
      "RuCode",
      "Name",
      "Unit",
      "HsnCode",
      "description",
      "Rate",
      "Qty",
      "Amount",
    ],
    [
      1,
      "RU001",
      "SURFACE DRESSINGSITE",
      "each",
      "HSN001",
      "Description 1",
      100,
      2,
      200,
    ],
    [
      2,
      "RU002",
      "EXCAVATIONF/FNDTNBTWN 3-4.5M",
      "meter",
      "HSN002",
      "Description 2",
      150,
      3,
      450,
    ],
    [
      3,
      "RU003",
      "FNDTNBTWN 3-4.5M",
      "sqm",
      "HSN003",
      "Description 3",
      200,
      1,
      200,
    ],
  ];

  const convertToCSV = (data) => {
    const csv = data.map((row) => row.join(",")).join("\n");
    return "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  };

  const DownloadCsvFile = async () => {
    const csvData = convertToCSV(data);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", csvData);
    downloadLink.setAttribute("download", "data.csv");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const validate = (values) => {
    const errors = {};
    values.po_items.forEach((item, index) => {
      if (!item.Qty) {
        errors.po_items = errors.po_items || [];
        errors.po_items[index] = {
          ...errors.po_items[index],
          Qty: "is required",
        };
      }
    });
    return errors;
  };
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {edit?.id ? "Update Purchase Order" : "Create Purchase Order"} · CMS
          Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`${edit?.id ? t("Update") : t("Create")} ${t(
            "Purchase Order"
          )}`}
        >
          <Formik
            initialValues={{
              po_date: edit.po_date
                ? moment(edit?.po_date).format("YYYY-MM-DD")
                : "",

              ro_office: edit.ro_office_id
                ? {
                    label: edit?.regional_office_name,
                    value: edit.ro_office_id,
                  }
                : "",
              state: edit.state
                ? {
                    label: edit.state_name,
                    value: edit.state,
                  }
                : "",
              po_tax: edit.po_tax || "",
              from_company: edit?.fromCompanyDetails
                ? {
                    label: edit.fromCompanyDetails.company_name,
                    value: edit.fromCompanyDetails.company_id,
                  }
                : "",

              to_company: edit?.toCompanyDetails
                ? {
                    label: edit.toCompanyDetails.company_name,
                    value: edit.toCompanyDetails.company_id,
                  }
                : "",
              cr_copy_title: edit?.cr_copy_title ? edit.cr_copy_title : "",
              sd_letter_title: edit?.sd_letter_title
                ? edit.sd_letter_title
                : "",

              po_amount: edit.po_amount || "",
              po_number: edit.po_number || "",
              limit: edit?.limit || "",
              security_deposit_date: edit.security_deposit_date
                ? moment(edit?.security_deposit_date).format("YYYY-MM-DD")
                : "",
              security_deposit_amount: edit.security_deposit_amount || "",
              tender_date: edit.tender_date
                ? moment(edit?.tender_date).format("YYYY-MM-DD")
                : "",
              tender_number: edit.tender_number || "",
              dd_bg_number: edit.dd_bg_number || "",
              cr_date: edit.cr_date
                ? moment(edit?.cr_date).format("YYYY-MM-DD")
                : "",
              cr_number: edit.cr_number || "",
              cr_code: edit.cr_code || "",
              cr_copy: edit.cr_copy || null,
              sd_letter: edit.sd_letter || null,
              work: edit.work || "",
              bank: edit.bank
                ? {
                    label: edit.bank_name,
                    value: parseInt(edit.bank),
                    logo: `${process.env.REACT_APP_API_URL}${edit.bank_logo}`,
                  }
                : "",
              gst_id: edit.gst_id
                ? {
                    label: edit.gst_title,
                    value: edit.gst_id,
                  }
                : "",
              gst_percent: edit.gst_percent || "",
              total_gst: edit.total_gst || "",

              po_items: edit?.purchase_order_item?.data?.map((itm) => {
                return {
                  ...itm,
                  item_id: {
                    value: itm.item_id,
                    label: itm.name,
                  },
                  gst_id: {
                    value: itm.gst_id,
                    label: itm.title,
                  },
                };
              }) || [
                {
                  item_id: "",
                  gst_id: "",
                  gst_percent: "",
                  amount: "",
                  qty: "",
                  Amount: 0,
                },
              ],
              po_for: edit?.po_for || "1",
            }}
            validationSchema={addPoSchema}
            // validate={validate}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {(props) => {
              const po_limit = props.values.po_items.reduce(
                (total, item) => +item.Amount + total,
                0
              );

              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3 align-items-center">
                    {loading ? (
                      <Col className="d-flex justify-content-center">
                        <img
                          className="p-3"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                          alt="Loading"
                        />
                      </Col>
                    ) : (
                      <>
                        <Form.Group as={Col} md={12}>
                          <Stack
                            className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto ${
                              edit?.id ? "cursor-none" : null
                            }`}
                            direction="horizontal"
                            gap={4}
                          >
                            <span className="ps-3">
                              {t("purchase order")}:{" "}
                            </span>
                            <label className="fw-bolder">
                              <Field
                                type="radio"
                                name="po_for"
                                value="1"
                                disabled={Boolean(edit?.id)}
                                onChange={props.handleChange}
                                className="form-check-input"
                              />
                              {t("with quantity")}
                            </label>
                            <div className={`vr hr-shadow`} />
                            <label className="fw-bolder">
                              <Field
                                type="radio"
                                name="po_for"
                                value="2"
                                disabled={Boolean(edit?.id)}
                                onChange={props.handleChange}
                                className="form-check-input"
                              />
                              {t("without quantity")}
                            </label>
                          </Stack>
                        </Form.Group>

                        {console.log("it called")}

                        <Form.Group className="ms-2" as={Col} md={4}>
                          <Form.Label>{t("from company")}</Form.Label>
                          <Select
                            className="text-primary w-100"
                            menuPortalTarget={document.body}
                            name={`from_company`}
                            value={props.values.from_company}
                            options={fromCompany?.map((itm) => ({
                              label: itm.company_name,
                              value: itm.company_id,
                            }))}
                            onChange={(e) =>
                              props.setFieldValue("from_company", e)
                            }
                          />
                        </Form.Group>

                        <Form.Group className="ms-2" as={Col} md={4}>
                          <Form.Label>{t("to company")}</Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            name={`to_company`}
                            value={props.values.to_company}
                            placeholder="select.."
                            options={toCompany?.map((itm) => ({
                              label: itm.company_name,
                              value: itm.company_id,
                            }))}
                            onChange={(e) =>
                              props.setFieldValue("to_company", e)
                            }
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={6}>
                          <div className="shadow p-3">
                            <div className="mb-2">
                              <Form.Label className="fw-bolder">
                                {t("regional_office")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                className="text-primary w-100"
                                menuPortalTarget={document.body}
                                name={"ro_office"}
                                value={props.values.ro_office}
                                options={roData?.map((itm) => ({
                                  label: itm.regional_office_name,
                                  value: itm.id,
                                }))}
                                onChange={(selectedOption) => {
                                  props.setFieldValue(
                                    "ro_office",
                                    selectedOption
                                  );
                                }}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.ro_office &&
                                    props.errors.ro_office
                                )}
                              />
                              <ErrorMessage
                                name="ro_office"
                                component="small"
                                className="text-danger"
                              />
                            </div>
                            <Form.Label className="fw-bolder">
                              {t("Select State")}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                              className="text-primary w-100"
                              menuPortalTarget={document.body}
                              name={"state"}
                              value={props.values.state}
                              options={stateData?.map((itm) => ({
                                label: itm.name,
                                value: itm.id,
                              }))}
                              onChange={(selectedOption) => {
                                props.setFieldValue("state", selectedOption);
                              }}
                              onBlur={props.handleBlur}
                              isInvalid={Boolean(
                                props.touched.state && props.errors.state
                              )}
                            />
                            <ErrorMessage
                              name="state"
                              component="small"
                              className="text-danger"
                            />
                          </div>
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                          <div className="shadow p-3">
                            <Row>
                              <Col md={12}>
                                <div className="mb-2">
                                  <Form.Label className="fw-bolder">
                                    {t("po date")}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="po_date"
                                    value={props.values.po_date}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    isInvalid={Boolean(
                                      props.touched.po_date &&
                                        props.errors.po_date
                                    )}
                                  />
                                  <ErrorMessage
                                    name="po_date"
                                    component="small"
                                    className="text-danger"
                                  />
                                </div>
                              </Col>

                              <Col md={6}>
                                <Form.Label className="fw-bolder">
                                  {t("PO Number")}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="po_number"
                                  value={props.values.po_number}
                                  onBlur={(e) => {
                                    if (props.values.po_number) {
                                      handleCheckPoIsExists(
                                        e,
                                        props.setFieldValue
                                      );
                                    }
                                  }}
                                  onChange={props.handleChange}
                                  isInvalid={Boolean(
                                    props.touched.po_number &&
                                      props.errors.po_number
                                  )}
                                />
                                <ErrorMessage
                                  name="po_number"
                                  component="small"
                                  className="text-danger"
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Label className="fw-bolder">
                                  {t("limit")}
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="limit"
                                  disabled={props.values.po_for == "1" && true}
                                  value={
                                    props.values.po_for == "1"
                                      ? po_limit.toFixed(2)
                                      : props.values.limit
                                  }
                                  onChange={props.handleChange}
                                />
                              </Col>
                            </Row>
                          </div>
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                          <div className="shadow p-3">
                            <Row className="g-3 align-items-center">
                              <Form.Group as={Col} md={4}>
                                <Form.Label>
                                  {t("security deposit amount")}{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="security_deposit_amount"
                                  value={props.values.security_deposit_amount}
                                  placeholder="enter security deposit amount"
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.security_deposit_amount &&
                                      props.errors.security_deposit_amount
                                  )}
                                />
                                <ErrorMessage
                                  name="security_deposit_amount"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={4}>
                                <Form.Label>
                                  {t("security deposit date")}{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="security_deposit_date"
                                  value={props.values.security_deposit_date}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.security_deposit_date &&
                                      props.errors.security_deposit_date
                                  )}
                                />
                                <ErrorMessage
                                  name="security_deposit_date"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <Form.Label>{t("Bank")}</Form.Label>
                                <Select
                                  menuPortalTarget={document.body}
                                  name={`bank`}
                                  value={props.values.bank}
                                  options={allBankData?.map((itm) => ({
                                    label: itm.bank_name,
                                    value: itm.id,
                                    logo: `${process.env.REACT_APP_API_URL}${itm.logo}`,
                                  }))}
                                  onChange={(e) => {
                                    props.setFieldValue(`bank`, e);
                                  }}
                                  formatOptionLabel={formatOptionLabel}
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <Form.Label>
                                  {t("tender number")}{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="tender_number"
                                  value={props.values.tender_number}
                                  placeholder="enter tender number"
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.tender_number &&
                                      props.errors.tender_number
                                  )}
                                />
                                <ErrorMessage
                                  name="tender_number"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <Form.Label>
                                  {t("tender date")}{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="tender_date"
                                  value={props.values.tender_date}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.tender_date &&
                                      props.errors.tender_date
                                  )}
                                />
                                <ErrorMessage
                                  name="tender_date"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <Form.Label>
                                  {t("DD/BG No")}{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="dd_bg_number"
                                  value={props.values.dd_bg_number}
                                  placeholder="enter dd/bg no."
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.dd_bg_number &&
                                      props.errors.dd_bg_number
                                  )}
                                />
                                <ErrorMessage
                                  name="dd_bg_number"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <Form.Label>{t("Cr Number")} </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="cr_number"
                                  value={props.values.cr_number}
                                  onChange={props.handleChange}
                                  placeholder="enter cr number"
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.cr_number &&
                                      props.errors.cr_number
                                  )}
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={4}>
                                <Form.Label>{t("cr date")} </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="cr_date"
                                  value={props.values.cr_date}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.cr_date &&
                                      props.errors.cr_date
                                  )}
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={4}>
                                <Form.Label>{t("cr code")} </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="cr_code"
                                  value={props.values.cr_code}
                                  placeholder="enter cr code"
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.cr_code &&
                                      props.errors.cr_code
                                  )}
                                />
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md={12}
                                className="shadow p-20"
                              >
                                <Form.Label id="cr_copy" className="fw-bold">
                                  {" "}
                                  {t("cr copy")}
                                </Form.Label>
                                <div className="row ">
                                  <div className=" col-md-3 my-2">
                                    <Form.Control
                                      type="text"
                                      name="cr_copy_title"
                                      placeholder=" enter the title"
                                      value={props.values.cr_copy_title}
                                      onChange={props.handleChange}
                                    />
                                  </div>

                                  <div className="col-md-4">
                                    <Form.Control
                                      type="file"
                                      name="cr_copy"
                                      className="my-2"
                                      ref={cr_file_ref}
                                      accept="image/png, image/jpeg ,image/jpg ,image/jfif ,application/pdf ,application/msword ,.doc,.docx"
                                      onChange={(e) => {
                                        props.setFieldValue(
                                          "cr_copy",
                                          e.target?.files?.[0]
                                        );
                                      }}
                                    />
                                  </div>

                                  {getAttachmentFormatAndLink(
                                    props.values?.cr_copy
                                  ) ? (
                                    <Form.Group as={Col} md={4}>
                                      <div className=" position-relative d-flex">
                                        {getAttachmentFormatAndLink(
                                          props.values?.cr_copy
                                        )?.type == "image" && (
                                          <ImageViewer
                                            src={
                                              getAttachmentFormatAndLink(
                                                props.values?.cr_copy
                                              ).url
                                            }
                                          >
                                            <Image
                                              style={{
                                                height: "120px",
                                                width: "100%",
                                                maxWidth: "100%",
                                              }}
                                              className="object-fit mt-1"
                                              src={
                                                getAttachmentFormatAndLink(
                                                  props.values?.cr_copy
                                                ).url
                                              }
                                            />
                                          </ImageViewer>
                                        )}

                                        {getAttachmentFormatAndLink(
                                          props.values?.cr_copy
                                        )?.type == "pdf" && (
                                          <a
                                            href={
                                              getAttachmentFormatAndLink(
                                                props.values?.cr_copy
                                              ).url
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            <Card.Img
                                              width={200}
                                              height={100}
                                              className="object-fit"
                                              src={`/assets/images/pdf.jpg`}
                                            />
                                          </a>
                                        )}

                                        {getAttachmentFormatAndLink(
                                          props.values?.cr_copy
                                        )?.type == "document" && (
                                          <a
                                            href={
                                              getAttachmentFormatAndLink(
                                                props.values?.cr_copy
                                              ).url
                                            }
                                            download={true}
                                          >
                                            <Card.Img
                                              width={200}
                                              height={130}
                                              className="object-fit"
                                              src={`/assets/images/docs.png`}
                                            />
                                          </a>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() => {
                                            props.setFieldValue("cr_copy", "");
                                            if (cr_file_ref.current) {
                                              cr_file_ref.current.value = "";
                                            }
                                          }}
                                          className="shadow border-0 danger-combo cursor-pointer px-4 py-1 my-1"
                                        >
                                          X
                                        </button>
                                      </div>
                                    </Form.Group>
                                  ) : (
                                    <Form.Group as={Col} md={6}></Form.Group>
                                  )}
                                </div>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md={12}
                                className="shadow p-20"
                              >
                                <Form.Label id="sd_letter" className="fw-bold">
                                  {" "}
                                  {t("sd Letter")}
                                </Form.Label>
                                <div className="row ">
                                  <div className=" col-md-3 ">
                                    <Form.Control
                                      type="text"
                                      name="sd_letter_title"
                                      placeholder="enter the title"
                                      value={props.values.sd_letter_title}
                                      onChange={props.handleChange}
                                    />
                                  </div>

                                  <div className="col-md-4">
                                    <Form.Control
                                      type="file"
                                      name="sd_letter"
                                      ref={sd_copy_ref}
                                      accept="image/png, image/jpeg ,image/jpg ,image/jfif ,application/pdf ,application/msword ,.doc,.docx"
                                      onChange={(e) => {
                                        props.setFieldValue(
                                          "sd_letter",
                                          e.target.files[0]
                                        );
                                      }}
                                    />
                                  </div>

                                  {getAttachmentFormatAndLink(
                                    props.values?.sd_letter
                                  ) ? (
                                    <Form.Group as={Col} md={4}>
                                      <div className=" position-relative d-flex">
                                        {getAttachmentFormatAndLink(
                                          props.values?.sd_letter
                                        )?.type == "image" && (
                                          <ImageViewer
                                            src={
                                              getAttachmentFormatAndLink(
                                                props.values?.sd_letter
                                              ).url
                                            }
                                          >
                                            <Image
                                              style={{
                                                height: "120px",
                                                width: "100%",
                                                maxWidth: "100%",
                                              }}
                                              className="object-fit mt-1"
                                              src={
                                                getAttachmentFormatAndLink(
                                                  props.values?.sd_letter
                                                ).url
                                              }
                                            />
                                          </ImageViewer>
                                        )}

                                        {getAttachmentFormatAndLink(
                                          props.values?.sd_letter
                                        )?.type == "pdf" && (
                                          <a
                                            href={
                                              getAttachmentFormatAndLink(
                                                props.values?.sd_letter
                                              ).url
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            <Card.Img
                                              width={200}
                                              height={100}
                                              className="object-fit"
                                              src={`/assets/images/pdf.jpg`}
                                            />
                                          </a>
                                        )}

                                        {getAttachmentFormatAndLink(
                                          props.values?.sd_letter
                                        )?.type == "document" && (
                                          <a
                                            href={
                                              getAttachmentFormatAndLink(
                                                props.values?.sd_letter
                                              ).url
                                            }
                                            download={true}
                                          >
                                            <Card.Img
                                              width={200}
                                              height={130}
                                              className="object-fit"
                                              src={`/assets/images/docs.png`}
                                            />
                                          </a>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() => {
                                            props.setFieldValue(
                                              "sd_letter",
                                              ""
                                            );

                                            if (sd_copy_ref.current) {
                                              sd_copy_ref.current.value = "";
                                            }
                                          }}
                                          className="shadow border-0 danger-combo cursor-pointer px-4 py-1 my-1"
                                        >
                                          X
                                        </button>
                                      </div>
                                    </Form.Group>
                                  ) : (
                                    <Form.Group as={Col} md={6}></Form.Group>
                                  )}
                                </div>
                              </Form.Group>

                              <Form.Group as={Col} md={12}>
                                <Form.Label>
                                  {t("work")}{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <TextareaAutosize
                                  className="edit-textarea"
                                  minRows={3}
                                  name="work"
                                  value={props.values.work}
                                  onChange={props.handleChange}
                                />
                                <ErrorMessage
                                  name="work"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>

                              <Form.Group className="ms-2" as={Col} md={4}>
                                <Form.Label>{t("gst type")}</Form.Label>
                                <Select
                                  menuPortalTarget={document.body}
                                  name={`gst_id`}
                                  value={props.values.gst_id}
                                  options={gstTypesData?.map((itm) => ({
                                    label: itm.title,
                                    value: itm.id,
                                    percentage: itm.percentage,
                                  }))}
                                  onChange={(e) => {
                                    props.setFieldValue(
                                      "gst_percent",
                                      e.percentage
                                    );
                                    props.setFieldValue(`gst_id`, e);
                                    if (props.values.po_for == "2") {
                                      props.setFieldValue(
                                        "po_tax",
                                        (props.values.po_amount *
                                          e.percentage) /
                                          100
                                      );
                                    }
                                  }}
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={2}>
                                <Form.Label>{t("gst percentage")}%</Form.Label>
                                <Form.Control
                                  name="gst_percent"
                                  value={props.values.gst_percent}
                                  onChange={props.handleChange}
                                  disabled
                                />
                              </Form.Group>

                              <Col md={6} className="my-4">
                                <Form.Label className="fw-bolder">
                                  {t("upload excel file")}
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  // accept=".csv,.xlsx"
                                  accept=".csv"
                                  onChange={(e) => handleFileUpload(e, props)}
                                />
                              </Col>

                              <Col md={6} className="m-6 ">
                                <button
                                  className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                                  type="button"
                                  onClick={() => DownloadCsvFile()}
                                >
                                  {" "}
                                  <RiFileExcel2Fill className="fs-4 text-green"></RiFileExcel2Fill>
                                  {t("sample excel")}{" "}
                                  <MdDownload className="fs-6 " />
                                </button>
                              </Col>

                              <Form.Group as={Col} md={12}>
                                <div className="">
                                  <Row className="g-3 align-items-center">
                                    <Form.Group as={Col} md={12}>
                                      <FieldArray name="po_items">
                                        {({ remove, push }) => (
                                          <div className="table-scroll ">
                                            {props.values.po_items.length >
                                              0 && (
                                              <TablePurchaseOrder
                                                props={props}
                                                edit={edit}
                                                gstTypesData={gstTypesData}
                                                loading={loading}
                                              />
                                            )}
                                          </div>
                                        )}
                                      </FieldArray>
                                    </Form.Group>

                                    {props.values.po_for == "1" && (
                                      <div className=" d-flex justify-content-end fs-6 ">
                                        <div className="mx-4 fw-bold">
                                          PO Amount :
                                          <span className="text-green fw-bold ">
                                            {" "}
                                            ₹
                                            {props.values.po_items
                                              .reduce(
                                                (total, item) =>
                                                  +item.Amount + total,
                                                0
                                              )
                                              .toFixed(2) || 0}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </Row>
                                </div>
                              </Form.Group>
                            </Row>
                          </div>
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
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>{edit.id ? "UPDATE" : "CREATE PO"}</>
                              )}
                            </button>
                            <ConfirmAlert
                              size={"sm"}
                              deleteFunction={props.handleSubmit}
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
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreatePurchaseOrder;
