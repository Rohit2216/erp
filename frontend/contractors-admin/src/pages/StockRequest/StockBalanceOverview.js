import React, { useEffect, useState } from "react";
import { Card, Col, Form, Stack, Tab, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import ReactPagination from "../../components/ReactPagination";
import Select from "react-select";
import { getAllBankListForDropdown } from "../../services/contractorApi";
import { getAllAccountTransactions } from "../../services/contractoApi2";
import { Field } from "formik";
import FundBalanceEmployee from "../FundManagement/FundRequest/FundBalanceEmployee";
import StockBalance_Supplier from "./StockBalance_Supplier";
import { useTranslation } from "react-i18next";
// import FundBalanceEmployee from "./FundBalanceEmployee";

const StockBalanceOverview = () => {
  const [allAccounts, setallAccounts] = useState([]);
  const [allBanksData, setAllBanksData] = useState([]);
  const [bankId, setBankId] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [BalanceFor, setBalanceFor] = useState("bank");
  useEffect(() => {
    fetchAllBanksData();
  }, []);

  useEffect(() => {
    handleAccountByBankIdChange();
  }, [bankId, pageSize, pageNo, searchTerm]);

  const fetchAllBanksData = async () => {
    const res = await getAllBankListForDropdown();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.bank_name,
          logo: itm.logo,
        };
      });
      setAllBanksData(rData);
    } else {
      setAllBanksData([]);
    }
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const userFormatOptionLabel = ({ label, logo }) => (
    <div>
      {logo ? (
        <img
          src={process.env.REACT_APP_API_URL + logo}
          className="avatar me-2"
        />
      ) : null}
      {label}
    </div>
  );

  const handleAccountByBankIdChange = async () => {
    setLoading(true);
    const res = await getAllAccountTransactions(
      bankId,
      pageSize,
      pageNo,
      searchTerm
    );
    if (res.data) {
      setallAccounts(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setallAccounts([]);
      setPageDetail({});
    }
    setLoading(false);
  };
  return (
    <div>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <h6 className=" fw-bold mx-3 my-3">{t("stock balance overview")}</h6>

          <Form.Group className="mb-3" as={Col} md={12}>
            <Stack
              className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto `}
              direction="horizontal"
              gap={4}
            >
              <span className="ps-3">{t("Balance Overview For")} : </span>
              <label className="fw-bolder">
                <input
                  type="radio"
                  name="fund_request_for"
                  value={"1"}
                  onChange={() => {
                    setBalanceFor("bank");
                  }}
                  defaultChecked
                  className="form-check-input"
                />
                {t("Bank")}
              </label>
              <div className={`vr hr-shadow`} />
              <label className="fw-bolder">
                <input
                  type="radio"
                  name="fund_request_for"
                  value={"2"}
                  onChange={() => {
                    setBalanceFor("employee");
                  }}
                  className="form-check-input"
                />
                {t("Employee")}
              </label>

              <label className="fw-bolder">
                <input
                  type="radio"
                  name="fund_request_for"
                  value={"3"}
                  onChange={() => {
                    setBalanceFor("supplier");
                  }}
                  className="form-check-input"
                />
                {t("Supplier")}
              </label>
            </Stack>
          </Form.Group>

          {BalanceFor == "bank" ? (
            <>
              <span className="d-align mt-3 mx-3 justify-content-between gap-2">
                <span>
                  <Select
                    menuPortalTarget={document.body}
                    placeholder={t("Select Bank")}
                    options={allBanksData}
                    isClearable
                    onChange={(e) => {
                      if (e) setBankId(e?.value);
                      else setBankId("");
                    }}
                    formatOptionLabel={userFormatOptionLabel}
                  />
                </span>

                <span className="position-relative">
                  <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                  <Form.Control
                    type="text"
                    placeholder={t("Search")}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="me-2"
                    aria-label="Search"
                  />
                </span>
              </span>
              <div className="p-3">
                <div className="table-scroll">
                  <Table className="text-body bg-new Roles">
                    <thead className="text-truncate">
                      <tr>
                        <th>{t("Sr No.")}</th>
                        <th>{t("Account Holder Name")}</th>
                        <th>{t("Account No.")}</th>
                        <th>{t("Account Type")}</th>
                        <th>{t("IFSC code")}</th>
                        <th>{t("Branch")}</th>
                        <th>{t("Last balance")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={12}>
                            <img
                              className="p-3"
                              width="250"
                              src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                              alt="Loading"
                            />
                          </td>
                        </tr>
                      ) : allAccounts?.length > 0 ? (
                        allAccounts?.map((data, id1) => (
                          <tr key={id1}>
                            <td>{id1 + 1}</td>
                            <td>{data?.account_holder_name ?? "--"}</td>
                            <td>{data?.account_number}</td>
                            <td>{data?.account_type}</td>
                            <td>{data?.ifsc_code}</td>
                            <td>{data?.branch}</td>
                            <td>{data?.last_balance ?? "0"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10}>
                            <img
                              className="p-3"
                              alt="no-result"
                              width="250"
                              src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={10}>
                          <ReactPagination
                            pageSize={pageSize}
                            prevClassName={
                              pageNo === 1
                                ? "danger-combo-disable pe-none"
                                : "red-combo"
                            }
                            nextClassName={
                              pageSize == pageDetail?.total
                                ? allAccounts.length - 1 < pageSize
                                  ? "danger-combo-disable pe-none"
                                  : "success-combo"
                                : allAccounts.length < pageSize
                                ? "danger-combo-disable pe-none"
                                : "success-combo"
                            }
                            title={`Showing ${
                              pageDetail?.pageStartResult || 0
                            } to ${pageDetail?.pageEndResult || 0} of ${
                              pageDetail?.total || 0
                            }`}
                            handlePageSizeChange={handlePageSizeChange}
                            prevonClick={() => setPageNo(pageNo - 1)}
                            nextonClick={() => setPageNo(pageNo + 1)}
                          />
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </div>
            </>
          ) : BalanceFor == t("employee") ? (
            <FundBalanceEmployee />
          ) : (
            <StockBalance_Supplier />
          )}
        </Card>
      </Col>
    </div>
  );
};

export default StockBalanceOverview;
