import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  getAllFinancialYearsForDashboard,
  getBillingDetailsOfRegionalOffice,
} from "../../../services/contractorApi";

export default function RegionalOfficeBilling() {
  const [data, setData] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const { t } = useTranslation();

  const fetchTransferDetails = async (year) => {
    const res = await getBillingDetailsOfRegionalOffice(year);
    if (res.status) {
      setData(res.data);
    } else {
      setData([]);
    }
  };

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYearsForDashboard();
    if (res.status) {
      const financialYears = res.data;
      setAllFinancialYear(financialYears);
      const defaultYear = financialYears[0];
      setYearValue({
        label: defaultYear.year_name,
        value: defaultYear.year_name,
      });

      fetchTransferDetails(defaultYear.year_name);
    } else {
      setAllFinancialYear([]);
    }
  };

  useEffect(() => {
    showFinancialYearApi();
  }, []);

  return (
    <div>
      <Col md={12} className="my-2">
        <Row className="d-align mb-3 justify-content-end">
          <Col md={2}>
            <Select
              placeholder={"--select--"}
              menuPortalTarget={document.body}
              options={allFinancialYear?.map((data) => ({
                label: data?.year_name,
                value: data?.year_name,
              }))}
              value={yearValue}
              onChange={(e) => {
                if (e) {
                  setYearValue({ value: e?.value, label: e?.label });
                  fetchTransferDetails(e?.value);
                } else {
                  setYearValue(null);
                }
              }}
              isClearable
            />
          </Col>
        </Row>
        <div className="p-20 shadow rounded h-100">
          <div className="mt-2">
            <Table className="table-sm table Roles">
              <thead>
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("regional office")}</th>
                  <th>{t("measurements amounts")}</th>
                  <th>{t("performa amounts")}</th>
                  <th>{t("invoices amounts")}</th>
                  <th>{t("Payment Paid")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 &&
                  data?.map((itm, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{itm?.manager?.regional_office_name}</td>
                        <td>{(itm?.measurements_amounts).toFixed(2)}</td>
                        <td>{(itm?.performa_amounts).toFixed(2)}</td>
                        <td>{(itm?.invoices_amounts).toFixed(2)}</td>
                        <td>{(itm?.payment_amounts).toFixed(2)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      </Col>
    </div>
  );
}
