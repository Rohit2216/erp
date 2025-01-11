import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import {
  getAllSalesAreaNameForMeasurement,
  getAllOutletNameForPTM,
  getAllRegionalNameForPTM,
  getAllOrderByForPTM,
  getAllSalesAreaNameForBilling,
  getAllOutletNameForBilling,
  getAllRegionalNameForBilling,
  getAllOrderByForBilling,
} from "../../services/contractorApi";
import { useTranslation } from "react-i18next";

export const FilterComponentInMeasurement = ({
  setSalesAreaId,
  setOutletId,
  setRegionalOfficeId,
  setOrderById,
  className = "pb-3",
  children,
  status,
  filterFor,
}) => {
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allOutletArea, setAllOutletArea] = useState([]);
  const [allRoOffice, setAllRoOffice] = useState([]);
  const [allsetOrderBy, setAllsetOrderBy] = useState([]);
  const { t } = useTranslation();

  const fetchSalesArea = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllSalesAreaNameForMeasurement(status)
        : await getAllSalesAreaNameForBilling(status);
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };
  const fetchOutletArea = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllOutletNameForPTM(status)
        : await getAllOutletNameForBilling(status);
    if (res.status) {
      setAllOutletArea(res.data);
    } else {
      setAllOutletArea([]);
    }
  };
  const fetchRoOffice = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllRegionalNameForPTM(status)
        : await getAllRegionalNameForBilling(status);
    if (res.status) {
      setAllRoOffice(res.data);
    } else {
      setAllRoOffice([]);
    }
  };

  const fetchOrderBy = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllOrderByForPTM(status)
        : await getAllOrderByForBilling(status);
    if (res.status) {
      setAllsetOrderBy(res.data);
    } else {
      setAllsetOrderBy([]);
    }
  };
  useEffect(() => {
    fetchSalesArea();
    fetchOutletArea();
    fetchRoOffice();
    fetchOrderBy();
  }, []);
  return (
    <div className={className}>
      <div className="shadow p-2 rounded">
        <Row className="g-2">
          <Col md={3}>
            <Select
              placeholder={t("outlet area")}
              menuPortalTarget={document.body}
              options={allOutletArea?.map((user) => ({
                label: user.outlet_name,
                value: user.id,
              }))}
              onChange={(e) => {
                setOutletId(e ? e.value : null);
              }}
              isClearable
            />
          </Col>
          <Col md={3}>
            <Select
              placeholder={t("regional_office")}
              menuPortalTarget={document.body}
              options={allRoOffice?.map((user) => ({
                label: user.regional_office_name,
                value: user.id,
              }))}
              onChange={(e) => {
                setRegionalOfficeId(e ? e.value : null);
              }}
              isClearable
            />
          </Col>
          <Col md={3}>
            <Select
              placeholder={t("Sales Area")}
              menuPortalTarget={document.body}
              options={allSalesArea?.map((user) => ({
                label: user.sales_area_name,
                value: user.id,
              }))}
              onChange={(e) => {
                setSalesAreaId(e ? e.value : null);
              }}
              isClearable
            />
          </Col>
          <Col md={3}>
            <Select
              placeholder={t("ORDER BY")}
              menuPortalTarget={document.body}
              options={allsetOrderBy?.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              onChange={(e) => {
                setOrderById(e ? e.value : null);
              }}
              isClearable
            />
          </Col>
          {children}
        </Row>
      </div>
    </div>
  );
};
