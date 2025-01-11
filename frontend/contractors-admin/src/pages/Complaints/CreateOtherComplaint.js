import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import {
  getAdminDistrictOnSaId,
  getSingleComplaint,
  getOfficersListOnRo,
  getRoOnZoneId,
  getSalesOnRoId,
  getSingleCompanyDetails,
  getAllZonesForDropdown,
} from "../../services/authapi";
import { ErrorMessage } from "formik";
import { addComplaintTypeSchema } from "../../utils/formSchema";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { getAllComapnyData } from "../../services/contractorApi";
import { useTranslation } from "react-i18next";

const CreateOtherComplaint = ({ props, allOrderVia, complaintType }) => {
  const { id } = useParams();
  const [allRo, setAllRo] = useState([]);
  const [allOrderBy, setAllOrderBy] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [companyDataById, setCompanyDataById] = useState({});
  const [edit, setEdit] = useState({});
  const [allZonesData, setAllZonesData] = useState([]);
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleComplaint(id);
    if (res.status) {
      setEdit(res.data);
      // fetchUserNameData(res.data.user_type);
      handleZoneChange(res.data.zones[0].zone_id);
      handleRoChange(res.data.regionalOffices[0].id);
      handleSaChange(res.data.saleAreas[0].id);
    } else {
      setEdit([]);
    }
  };

  //   get all zones Data
  const fetchAllZonesData = async () => {
    const res = await getAllZonesForDropdown();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.zone_id,
          label: itm.zone_name,
        };
      });
      setAllZonesData(rData);
    } else {
      setAllZonesData([]);
    }
  };

  // get Regional Office name data
  const handleZoneChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("zone_id", value);
      setvalue("ro_id", value);
      setvalue("order_by_id", value);
      setvalue("sale_area_id", value);
      setvalue("district_id", value);
    }
    if (!value) return;
    setAllRo([]);
    setAllOrderBy([]);
    setAllSa([]);
    setAllDistrict([]);
    const res = await getRoOnZoneId(value);

    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.ro_id,
          label: itm.regional_office_name,
        };
      });

      setAllRo(rData);
    } else {
      setAllRo([]);
      setvalue("zone_id", "");
      toast.error(res.message);
    }
  };

  //   get Sales area name data
  const handleRoChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("ro_id", value);
      setvalue("order_by_id", value);
      setvalue("sale_area_id", value);
      setvalue("district_id", value);
    }
    if (!value) return;
    setAllOrderBy([]);
    setAllDistrict([]);
    const res = await getSalesOnRoId(value);
    const res2 = await getOfficersListOnRo(value);

    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.sales_area_name,
        };
      });
      //   console.log(rData);
      setAllSa(rData);
      if (res2.status) {
        const rData2 = res2.data.map((itm) => {
          return {
            value: itm.id,
            label: itm.name,
          };
        });
        setAllOrderBy(rData2);
      } else {
        setAllOrderBy([]);
        toast.error(res2.message);
      }
      // console.log(rData2);
    } else {
      // setAllSa([]);
      // setvalue("ro_id", "");
      // setvalue("order_by_id", "");
      toast.error(res.message);
    }
  };

  //   get District Name Data
  const handleSaChange = async (value, setvalue) => {
    console.log(value, "sa");
    if (setvalue) {
      setvalue("sale_area_id", value);
      setvalue("district_id", value);
    }
    if (!value) return setAllDistrict([]);
    const res = await getAdminDistrictOnSaId(value);

    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.district_id,
          label: itm.district_name,
        };
      });

      setAllDistrict(rData);
    } else {
      setAllDistrict([]);
      setvalue("sale_area_id", "");
      toast.error(res.message);
    }
  };

  //   get other Company Data
  const handleCompanyChange = async (value, setvalue) => {
    const res = await getSingleCompanyDetails(value);
    if (res.status) {
      setCompanyDataById(res.data);
    } else {
      setCompanyDataById({});
      toast.error(res.message);
    }
  };

  const fetchCompanyData = async () => {
    const res = await getAllComapnyData();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.company_id,
          label: itm.company_name,
        };
      });
      setCompanyData(rData);
    } else {
      setCompanyData([]);
    }
  };

  useEffect(() => {
    fetchAllZonesData();
    fetchCompanyData();
    if (id !== "new") {
      fetchSingleData();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Complaint Types · CMS Electricals</title>
      </Helmet>

      <Form.Group as={Col} md="4">
        <Form.Label>
          {t("Company Name")} <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="energy_company_id"
          value={props.values.energy_company_id}
          onChange={(val) => {
            handleCompanyChange(val.value, props.setFieldValue);
            props.setFieldValue("energy_company_id", val);
          }}
          onBlur={props.handleBlur}
          options={companyData}
          isInvalid={Boolean(
            props.touched.energy_company_id && props.errors.energy_company_id
          )}
        />
        <ErrorMessage
          name="energy_company_id"
          component="small"
          className="text-danger"
        />
      </Form.Group>
      {companyDataById?.company_contact_person ? (
        <Form.Group as={Col} md="4">
          <Form.Label>{t("Company Contact Person")}</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={companyDataById?.company_contact_person}
          />
        </Form.Group>
      ) : null}
      {companyDataById?.company_email ? (
        <Form.Group as={Col} md="4">
          <Form.Label>{t("Company Email")}</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={companyDataById?.company_email}
          />
        </Form.Group>
      ) : null}
      {companyDataById?.company_contact ? (
        <Form.Group as={Col} md="4">
          <Form.Label>{t("Company Contact")}</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={companyDataById?.company_contact}
          />
        </Form.Group>
      ) : null}

      <Form.Group as={Col} md="4">
        <Form.Label>
          {t("Zone Name")} <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="zone_id"
          value={props.values.zone_id}
          onChange={(val) => {
            handleZoneChange(val.value, props.setFieldValue);
            props.setFieldValue("zone_id", val);
          }}
          options={allZonesData}
        />
        <ErrorMessage
          name="zone_id"
          component="small"
          className="text-danger"
        />
      </Form.Group>

      <Form.Group as={Col} md="4">
        <Form.Label>
          {t("Regional Office Name")}{" "}
          <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="ro_id"
          value={props.values.ro_id}
          onChange={(val) => {
            handleRoChange(val.value, props.setFieldValue);
            props.setFieldValue("ro_id", val);
          }}
          options={allRo}
        />
        <ErrorMessage name="ro_id" component="small" className="text-danger" />
      </Form.Group>

      <Form.Group as={Col} md="4">
        <Form.Label>
          {"Order By"} <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="order_by_id"
          value={props.values.order_by_id}
          onChange={(val) => props.setFieldValue("order_by_id", val)}
          options={allOrderBy}
        />
        <ErrorMessage
          name="order_by_id"
          component="small"
          className="text-danger"
        />
      </Form.Group>
      <Form.Group as={Col} md="4">
        <Form.Label>
          {t("Order Via")} <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="order_via_id"
          value={props.values.order_via_id}
          onChange={(val) => {
            props.setFieldValue("order_via_id", val);
          }}
          options={allOrderVia}
        />
        <ErrorMessage
          name="order_via_id"
          component="small"
          className="text-danger"
        />
      </Form.Group>

      <Form.Group as={Col} md="4">
        <Form.Label>
          {t("Sales Area Name")} <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="sale_area_id"
          value={props.values.sale_area_id}
          onChange={(val) => {
            handleSaChange(val.value, props.setFieldValue);
            props.setFieldValue("sale_area_id", val);
          }}
          options={allSa}
        />

        <ErrorMessage
          name="sale_area_id"
          component="small"
          className="text-danger"
        />
      </Form.Group>

      <Form.Group as={Col} md="4">
        <Form.Label>
          {t("District Name")}
          {/* <span className="text-danger fw-bold">*</span> */}
        </Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="district_id"
          value={props.values.district_id}
          onChange={(val) => {
            props.setFieldValue("district_id", val);
          }}
          options={allDistrict}
        />
        <ErrorMessage
          name="district_id"
          component="small"
          className="text-danger"
        />
      </Form.Group>

      <Form.Group as={Col} md="4">
        <Form.Label>{t("Complaint Type")}</Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="complaint_type"
          value={props.values.complaint_type}
          onChange={(val) => {
            props.setFieldValue("complaint_type", val);
          }}
          options={complaintType}
        />
      </Form.Group>
      <Form.Group as={Col} md="4">
        <Form.Label>{t("Work Permit")}</Form.Label>
        <Form.Control
          type="text"
          name={"work_permit"}
          value={props.values.work_permit}
          onChange={props.handleChange}
        />
      </Form.Group>

      <Form.Group as={Col} md="12">
        <Form.Label>
          {t("Description")} <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <TextareaAutosize
          minRows={3}
          className="edit-textarea"
          placeholder="Description..."
          name={"description"}
          value={props.values.description}
          onChange={props.handleChange}
        />
        <ErrorMessage
          name="description"
          component="small"
          className="text-danger"
        />
      </Form.Group>
    </>
  );
};

export default CreateOtherComplaint;
