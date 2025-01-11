import React, { useState, useEffect } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col, Card, Table, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  getAllowancesPayroll,
  getDeductionsPayroll,
} from "../../../services/authapi";
import { BsSearch } from "react-icons/bs";
import ReactPagination from "../../../components/ReactPagination";
import { useTranslation } from "react-i18next";

const Payroll = () => {
  const { t } = useTranslation();
  const tabs = [
    { title: t("Payroll"), className: "fw-bold pe-none" },
    { title: t("Allowances"), className: "ms-auto", page: <Allowances /> },
    { title: t("Deductions"), page: <Deductions /> },
  ];

  function Allowances() {
    const [allowances, setAllowances] = useState([]);
    const [pageDetail, setPageDetail] = useState({});
    const [search, setSearch] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const fetchAllowancesData = async () => {
      const res = await getAllowancesPayroll(search, pageSize, pageNo);
      if (res.status) {
        setAllowances(res.data);
        setPageDetail(res.pageDetails);
      } else {
        setAllowances([]);
      }
    };
    useEffect(() => {
      fetchAllowancesData();
      setPageDetail({});
    }, [search, pageSize, pageNo]);
    const handlePageSizeChange = (selectedOption) => {
      setPageSize(selectedOption.value);
    };

    const serialNumber = Array.from(
      { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
      (_, index) => pageDetail?.pageStartResult + index
    );
    return (
      <>
        <div className="position-relative float-end mb-3">
          <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
          <Form.Control
            type="text"
            placeholder={t("Search")}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="me-2"
            aria-label="Search"
          />
        </div>
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              <th>{t("Sr No.")}</th>
              <th>{t("Name")}</th>
              <th>{t("Applied Type")}</th>
              <th>{t("Value Type")}</th>
              <th>{t("Value")}</th>
              <th>{t("Applied On")}</th>
              <th>{t("Created At")}</th>
            </tr>
          </thead>
          <tbody>
            {allowances.length > 0 ? null : (
              <tr>
                <td colSpan={7}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
              </tr>
            )}
            {allowances?.map((allowance, id1) => (
              <tr key={id1}>
                <td>{serialNumber[id1]}</td>
                <td>{allowance?.name}</td>
                <td>{allowance?.applied_type}</td>
                <td>{allowance?.value_type}</td>
                <td>{allowance?.value}</td>
                <td>
                  {allowance?.applied_on?.map((itm, id2) => {
                    return (
                      <>
                        <span key={itm?.id} className="d-block">
                          <span className="fw-bold pe-1">{id2 + 1}.</span>
                          {itm?.name}
                        </span>
                      </>
                    );
                  })}
                </td>
                <td>{allowance?.created_at}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <ReactPagination
          pageSize={pageSize}
          prevClassName={
            pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
          }
          nextClassName={
            pageSize == pageDetail?.total
              ? allowances.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : allowances.length < pageSize
              ? "danger-combo-disable pe-none"
              : "success-combo"
          }
          title={`Showing ${pageDetail?.pageStartResult || 0} to ${
            pageDetail?.pageEndResult || 0
          } of ${pageDetail?.total || 0}`}
          handlePageSizeChange={handlePageSizeChange}
          prevonClick={() => setPageNo(pageNo - 1)}
          nextonClick={() => setPageNo(pageNo + 1)}
        />
      </>
    );
  }
  function Deductions() {
    const [deductions, setDeductions] = useState([]);
    const [pageDetail, setPageDetail] = useState({});
    const [search, setSearch] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const fetchDeductionsData = async () => {
      const res = await getDeductionsPayroll(search, pageSize, pageNo);
      if (res.status) {
        setDeductions(res.data);
        setPageDetail(res.pageDetails);
      } else {
        setDeductions([]);
      }
    };
    useEffect(() => {
      fetchDeductionsData();
      setPageDetail({});
    }, [search, pageSize, pageNo]);
    const handlePageSizeChange = (selectedOption) => {
      setPageSize(selectedOption.value);
    };
    const serialNumber = Array.from(
      { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
      (_, index) => pageDetail?.pageStartResult + index
    );
    return (
      <>
        <div className="position-relative float-end mb-3">
          <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
          <Form.Control
            type="text"
            placeholder={t("Search")}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="me-2"
            aria-label="Search"
          />
        </div>
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              <th>{t("Sr No.")}</th>
              <th>{t("Name")}</th>
              <th>{t("Applied Type")}</th>
              <th>{t("Value Type")}</th>
              <th>{t("Value")}</th>
              <th>{t("Applied On")}</th>
              <th>{t("Created At")}</th>
            </tr>
          </thead>
          <tbody>
            {deductions.length > 0 ? null : (
              <tr>
                <td colSpan={7}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
              </tr>
            )}
            {deductions?.map((deduction, id2) => (
              <tr key={id2}>
                <td>{serialNumber[id2]}</td>
                <td>{deduction?.name}</td>
                <td>{deduction?.applied_type}</td>
                <td>{deduction?.value_type}</td>
                <td>{deduction?.value}</td>
                <td>
                  {deduction?.applied_on?.map((itm, id2) => {
                    return (
                      <>
                        <span key={itm?.id} className="d-block">
                          <span className="fw-bold pe-1">{id2 + 1}.</span>
                          {itm?.name}
                        </span>
                      </>
                    );
                  })}
                </td>
                <td>{deduction?.created_at}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <ReactPagination
          pageSize={pageSize}
          prevClassName={
            pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
          }
          nextClassName={
            pageSize == pageDetail?.total
              ? deductions.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : deductions.length < pageSize
              ? "danger-combo-disable pe-none"
              : "success-combo"
          }
          title={`Showing ${pageDetail?.pageStartResult || 0} to ${
            pageDetail?.pageEndResult || 0
          } of ${pageDetail?.total || 0}`}
          handlePageSizeChange={handlePageSizeChange}
          prevonClick={() => setPageNo(pageNo - 1)}
          nextonClick={() => setPageNo(pageNo + 1)}
        />
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>Payroll · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Card className="card-bg">
          <Tabs
            activeTab="2"
            ulClassName="border-primary py-2 border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <Card.Body className="overflow-auto px-4 mt-3">
                  {tab.page}
                </Card.Body>
              </Tab>
            ))}
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default Payroll;
