import React, { useEffect, useRef, useState } from "react";
import { Form, Col, Row, Spinner, Image, FormText } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import { ErrorMessage, Formik } from "formik";
import {
  getAdminDistrictOnSaId,
  getAdminEnergyCompanyassignZone,
  getAllEneryComnies,
  getRoOnZoneId,
  getSalesOnRoId,
} from "../../services/authapi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllOutletById,
  updateOutlet,
  uploadOutlets,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";
import ViewOutlet from "./ViewOutlet";
import { useTranslation } from "react-i18next";
import { addOutletsSchema, updateOutletsSchema } from "../../utils/formSchema";
import Papa from "papaparse";
import { OutletData } from "../../utils/ExcelSamples";
// import { OutletData } from "../utils/ExcelSamples";

const ImportExcelOutlets = () => {
  const [edit, setEdit] = useState({});
  const [allEnergy, setAllEnergy] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const sampleFile = OutletData;

  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchOutletById = async () => {
    const res = await getAllOutletById(id);
    if (res.status) {
      setEdit(res.data);
      fetchZoneData(res.data.energy_company_id);
      fetchRoData(res.data.zone_id);
      fetchSaData(res.data.regional_office_id);
      fetchDistrictData(res.data.sales_area_id);
    } else {
      setEdit([]);
    }
  };
  const fetchEnergyCompanyData = async () => {
    const res = await getAllEneryComnies();
    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.energy_company_id,
          label: data.name,
        };
      });
      setAllEnergy(rData);
    } else {
      setAllEnergy([]);
    }
  };

  const fetchZoneData = async (value) => {
    const res = await getAdminEnergyCompanyassignZone(value);

    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.zone_id,
          label: data.zone_name,
        };
      });
      setAllZones(rData);
    } else {
      setAllZones([]);
    }
  };

  const fetchRoData = async (value) => {
    const res = await getRoOnZoneId(value);

    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.ro_id,
          label: data.regional_office_name,
        };
      });
      setAllRo(rData);
    } else {
      setAllRo([]);
    }
  };

  const fetchSaData = async (value) => {
    const res = await getSalesOnRoId(value);

    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.id,
          label: data.sales_area_name,
        };
      });
      setAllSa(rData);
    } else {
      setAllSa([]);
    }
  };

  const fetchDistrictData = async (value) => {
    const res = await getAdminDistrictOnSaId(value);
    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.district_id,
          label: data.district_name,
        };
      });
      setAllDistrict(rData);
    } else {
      setAllDistrict([]);
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
              if (item.outlet_name) return item;
            });

            setResult(data.filter((item) => item));
            // navigate(-1);
          },
        });
      };
      reader.readAsText(file);
    }
    setLoading(false);
  };

  const convertToCSV = (data) => {
    const csv = data.map((row) => row.join(",")).join("\n");
    return "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  };

  const DownloadCsvFile = async () => {
    const csvData = convertToCSV(sampleFile);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", csvData);
    downloadLink.setAttribute("download", "sampleFile.csv");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchOutletById();
    }
    fetchEnergyCompanyData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      outlets: result.map((itm) => {
        return {
          ...itm,
          energy_company_id: values.energy_company_id.value,
          zone_id: values.zone_id.value,
          regional_id: values.regional_id.value,
          sales_area_id: values.sales_area_id.value,
          district_id: values.district_id.value,
        };
      }),
    };
    // return console.log("sdata", sData);
    const res = await uploadOutlets(sData);
    console.log(res, "the response is ");

    if (res.status) {
      toast.success(res.message);
      navigate("/outlet/request");
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
  };
  return (
    <>
      <Helmet>
        <title> Outlet Management · CMS Electricals </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"import Outlet"} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              energy_company_id: edit.energy_company_id
                ? {
                    label: edit?.energy_company_name,
                    value: edit?.energy_company_id,
                  }
                : "",
              zone_id: edit.zone_id
                ? {
                    label: edit?.zone_name,
                    value: edit?.zone_id,
                  }
                : "",
              regional_id: edit.regional_office_id
                ? {
                    label: edit?.regional_office_name,
                    value: edit?.regional_office_id,
                  }
                : "",
              sales_area_id: edit.sales_area_id
                ? {
                    label: edit?.sales_area_name,
                    value: edit?.sales_area_id,
                  }
                : "",
              district_id: edit.district_id
                ? {
                    label: edit?.district_name,
                    value: edit?.district_id,
                  }
                : "",
            }}
            // validationSchema={edit.id ? updateOutletsSchema : addOutletsSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  {type === "view" ? (
                    <ViewOutlet edit={edit} />
                  ) : (
                    <>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Energy Company Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>

                        <Select
                          menuPortalTarget={document.body}
                          name="energy_company_id"
                          value={props?.values.energy_company_id}
                          className="text-primary "
                          placeholder="--Select--"
                          onChange={(val) => {
                            props.setFieldValue("energy_company_id", val);

                            fetchZoneData(val.value);
                            if (edit.id) {
                              props.setFieldValue("zone_id", "");
                              props.setFieldValue("regional_id", "");
                              props.setFieldValue("sales_area_id", "");
                              props.setFieldValue("district_id", "");
                            }
                          }}
                          options={allEnergy}
                          isInvalid={Boolean(
                            props.touched.energy_company_id &&
                              props.errors.energy_company_id
                          )}
                        />
                        <ErrorMessage
                          name="energy_company_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Zone Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          name="zone_id"
                          value={props?.values.zone_id}
                          className="text-primary w-100"
                          placeholder="--Select--"
                          onChange={(val) => {
                            props.setFieldValue("zone_id", val);
                            fetchRoData(val.value);
                            if (edit.id) {
                              props.setFieldValue("sales_area_id", "");
                              props.setFieldValue("district_id", "");
                              props.setFieldValue("regional_id", "");
                            }
                          }}
                          options={allZones}
                          isInvalid={Boolean(
                            props.touched.zone_id && props.errors.zone_id
                          )}
                        />

                        <ErrorMessage
                          name="zone_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Regional Office Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          name="regional_id"
                          value={props?.values.regional_id}
                          className="text-primary w-100"
                          placeholder="--Select--"
                          onChange={(val) => {
                            props.setFieldValue("regional_id", val);
                            fetchSaData(val.value);
                            if (edit.id) {
                              props.setFieldValue("sales_area_id", "");
                              props.setFieldValue("district_id", "");
                            }
                          }}
                          options={allRo}
                          isInvalid={Boolean(
                            props.touched.regional_id &&
                              props.errors.regional_id
                          )}
                        />

                        <ErrorMessage
                          name="regional_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Sales Area Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Select
                          name="sales_area_id"
                          value={props?.values.sales_area_id}
                          onChange={(val) => {
                            props.setFieldValue("sales_area_id", val);
                            fetchDistrictData(val.value);
                            if (edit.id) {
                              props.setFieldValue("district_id", "");
                            }
                          }}
                          className="text-primary w-100"
                          placeholder="--Select--"
                          options={allSa}
                          isInvalid={Boolean(
                            props.touched.sales_area_id &&
                              props.errors.sales_area_id
                          )}
                        />
                        <ErrorMessage
                          name="sales_area_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("District Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Select
                          name="district_id"
                          value={props?.values.district_id}
                          onChange={(val) => {
                            props.setFieldValue("district_id", val);
                          }}
                          className="text-primary w-100"
                          placeholder="--Select--"
                          options={allDistrict}
                          isInvalid={Boolean(
                            props.touched.district_id &&
                              props.errors.district_id
                          )}
                        />
                        <ErrorMessage
                          name="district_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Col md={6} className="my-4">
                        <Form.Label className="fw-bolder">
                          {t("upload excel file")}
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleFileUpload(e)}
                        />
                      </Col>

                      <Col md={6} className="my-5">
                        <button
                          className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                          type="button"
                          onClick={() => DownloadCsvFile()}
                        >
                          {" "}
                          <RiFileExcel2Fill className="fs-4 text-green"></RiFileExcel2Fill>
                          {t("sample excel")} <MdDownload className="fs-6 " />
                        </button>
                      </Col>

                      <Col md={12}>
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
                                {t("PLEASE WAIT")}...
                              </>
                            ) : (
                              <>{edit.id ? t("UPDATE") : t("CREATE")}</>
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
                      </Col>
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

export default ImportExcelOutlets;
