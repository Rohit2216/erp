import React, { useEffect, useState } from "react";
import { Col, Table, Row, Form } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import ReactPagination from "../../components/ReactPagination";
import ActionButton from "../../components/ActionButton";
import {
  getAllSalesOrder,
  getAllSoInSecurityEligible,
  getAllSecurityIdListingInSo,
  getAllRoForSoInSecurityEligible,
} from "../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Select from "react-select";

const SecurityPaid = () => {
  const [securityDeposit, setSecurityDeposit] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [allRo, setAllRo] = useState([]);
  const [roId, setRoId] = useState({ label: "", value: "" });
  const [allSo, setAllSo] = useState([]);
  const [soId, setSoId] = useState({ label: "", value: "" });
  const [security_id, setSecurity_id] = useState("");
  const [allSecurity, setAllSecurity] = useState([]);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchSecurityDepositData = async () => {
    const status = 3;
    const so_status = 2;
    const res = await getAllSalesOrder(
      search,
      pageSize,
      pageNo,
      status,
      so_status,
      roId?.value,
      soId?.label,
      security_id
    );
    console.log(res.data, "paid data");
    if (res.status) {
      setSecurityDeposit(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setSecurityDeposit([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const fetchAllRo = async () => {
    const status = 3;
    const res = await getAllRoForSoInSecurityEligible(status);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };
  const fetchAllSo = async () => {
    const status = 3;
    const res = await getAllSoInSecurityEligible(status, roId?.value);
    console.log(res.data, "so");
    if (res.status) {
      setAllSo(res.data);
    } else {
      setAllSo([]);
    }
  };
  const fetchAllSecurity = async () => {
    const status = 3;
    const res = await getAllSecurityIdListingInSo(status, soId.label);
    console.log(res, "security");
    if (res.status) {
      setAllSecurity(res.data);
    } else {
      setAllSecurity([]);
    }
  };

  useEffect(() => {
    fetchSecurityDepositData();
  }, [search, pageNo, pageSize, roId.value, soId.value, security_id]);

  useEffect(() => {
    fetchAllSo();
    fetchAllRo();
    fetchAllSecurity();
  }, [soId.value, roId.value, security_id]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Security Deposit · CMS Electricals</title>
      </Helmet>
      <Row className="p-2">
        <span className="d-align mt-3 me-3 justify-content-end gap-2">
          <span className="position-relative">
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
          </span>
        </span>
        <Col md={3}>
          <Select
            placeholder={t("select ro")}
            menuPortalTarget={document.body}
            isDisabled={soId.value}
            options={allRo?.map((data) => ({
              label: data.regional_office_name,
              value: data.id,
            }))}
            value={roId.value && roId}
            onChange={(e) => {
              if (e) {
                setRoId({ value: e?.value, label: e?.label });
              } else {
                setRoId({});
              }
            }}
            isClearable
          />
        </Col>
        <Col md={3}>
          <Select
            placeholder={t("select so")}
            menuPortalTarget={document.body}
            isDisabled={security_id}
            options={allSo?.map((data) => ({
              label: data.so_number,
              value: data.id,
            }))}
            value={soId.value && soId}
            onChange={(e) => {
              if (e) {
                setSoId({ value: e?.value, label: e?.label });
              } else {
                setSoId({});
              }
            }}
            isClearable
          />
        </Col>

        <Col md={3}>
          <Select
            placeholder={t("select Security")}
            menuPortalTarget={document.body}
            options={allSecurity.map((data) => ({
              label: data.security_unique_id,
              value: data.security_unique_id,
            }))}
            onChange={(e) => {
              setSecurity_id(e ? e.value : "");
            }}
            isClearable
          />
        </Col>
      </Row>
      <div className="overflow-auto p-3 mb-2">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              <th>{t("Sr No.")}</th>
              <th>{t("Security Unique Id")}</th>
              <th>{t("SO Number")}</th>
              <th>{t("Tender Date")}</th>
              <th>{t("Tender Number")}</th>
              <th>{t("security deposit date")}</th>
              <th>{t("security deposit amount")}</th>
              <th>{t("regional office name")}</th>
              <th>{t("payment reference number")}</th>
              <th>{t("Paid Date")}</th>
              <th>{t("Status")}</th>
              <th>{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <td colSpan={10}>
                <img
                  className="p-3"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                  alt={t("Loading")}
                />
              </td>
            ) : securityDeposit.length > 0 ? (
              <>
                {securityDeposit.map((data, id1) => (
                  <tr key={id1}>
                    <td>{serialNumber[id1]}</td>
                    <td>{data.security_unique_id}</td>
                    <td>{data.so_number}</td>
                    <td>{data.tender_date}</td>
                    <td>{data.tender_number}</td>
                    <td>{data.security_deposit_date}</td>
                    <td>{data.security_deposit_amount}</td>
                    <td>{data.regional_office_name}</td>
                    <td>{data.payment_reference_number}</td>
                    <td>{data.date}</td>
                    <td className={`text-${"green"}`}>Paid</td>

                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                        eyeOnclick={() =>
                          navigate(`/sales-Order/security-deposit/view`, {
                            state: {
                              id: data.id,
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <td colSpan={10}>
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </td>
            )}
          </tbody>
        </Table>
      </div>
      <ReactPagination
        pageSize={pageSize}
        prevClassName={
          pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
        }
        nextClassName={
          pageSize == pageDetail?.total
            ? securityDeposit.length - 1 < pageSize
              ? "danger-combo-disable pe-none"
              : "success-combo"
            : securityDeposit.length < pageSize
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

      {/* <Modaljs
        open={viewDetails}
        hideFooter={true}
        size={"md"}
        close={() => setViewDetails(false)}
        title={
          <>
            <BsEyeFill className="text-green" /> {t("Security Deposit Details")}
          </>
        }
      >
        <Row className="g-3 py-1">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {singleData?.date && (
                      <tr>
                        <th>{t("Date")} :</th>
                        <td>{singleData?.date}</td>
                      </tr>
                    )}
                    {singleData?.po_number && (
                      <tr>
                        <th>{t("po number")} :</th>
                        <td>{singleData?.po_number}</td>
                      </tr>
                    )}
                    {singleData?.amount && (
                      <tr>
                        <th>{t("Amount")} :</th>
                        <td>{singleData?.amount}</td>
                      </tr>
                    )}
                    {singleData?.method && (
                      <tr>
                        <th>{t("method")} :</th>
                        <td>{singleData?.method}</td>
                      </tr>
                    )}
                    {singleData?.security_deposit_status && (
                      <tr>
                        <th>{t("security deposit status")} :</th>
                        <td>{singleData?.security_deposit_status}</td>
                      </tr>
                    )}
                    {singleData?.payment_status && (
                      <tr>
                        <th>{t("payment status")} :</th>
                        <td
                          className={`text-${
                            (singleData.payment_status_id === "1" &&
                              "orange") ||
                            (singleData.payment_status_id === "2" && "green") ||
                            (singleData.payment_status_id === "3" && "danger")
                          }`}
                        >
                          {singleData?.payment_status}
                        </td>
                      </tr>
                    )}
                    {singleData?.details && (
                      <tr>
                        <th>{t("details")} :</th>
                        <td>{singleData?.details}</td>
                      </tr>
                    )}
                    {singleData?.created_by && (
                      <tr>
                        <th>{t("created by")} :</th>
                        <td>{singleData?.created_by}</td>
                      </tr>
                    )}
                    {singleData?.created_at && (
                      <tr>
                        <th>{t("created at")} :</th>
                        <td>{singleData?.created_at}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </Modaljs> */}
    </>
  );
};

export default SecurityPaid;
