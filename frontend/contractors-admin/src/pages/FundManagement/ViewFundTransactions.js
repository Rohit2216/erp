import React, { useEffect, useState } from "react";
import { Card, Col, Form, Stack, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import Select from "react-select";
import {
  getAllAccountByBankId,
  getAllBankListForDropdown,
} from "../../services/contractorApi";
import { getAllAccountTransactionsByBank } from "../../services/contractoApi2";
import ReactPagination from "../../components/ReactPagination";
import FundTransactionEmployee from "./FundTransactionEmployee";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ViewFundTransactions = () => {
  const [allAccounts, setallAccounts] = useState([]);
  const [bankId, setBankId] = useState();
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [allBanksData, setAllBanksData] = useState([]);
  const [allAccountByBankId, setAllAccountByBankId] = useState([]);
  const [accountDetails, setAccountDetails] = useState("");
  const [filterBy, setFilterby] = useState("last12Months");
  const [BalanceFor, setBalanceFor] = useState("bank");
  const [dateRange, setDateRange] = useState([
    moment().startOf("month").format("YYYY-MM-DD"),
    moment(),
  ]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllBanksData();
  }, []);

  useEffect(() => {
    handleAccountByBankIdChange();
  }, [bankId, filterBy, pageSize, pageNo, searchTerm]);

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

  const BankFormatOptionLabel = ({ account_holder_name, logo }) => (
    <div>
      {logo ? (
        <img
          src={process.env.REACT_APP_API_URL + logo}
          className="avatar me-2"
        />
      ) : null}
      {account_holder_name}
    </div>
  );

  const getAllBankAccountByBankId = (id) => {
    if (!id) return false;
    fetchAllAccountByBankId(id);
  };

  const fetchAllAccountByBankId = async (id) => {
    const res = await getAllAccountByBankId(id);
    if (res.status) {
      const rData = res?.data?.map((itm) => {
        return {
          id: itm.id,
          label: itm.account_number,
          account_holder_name: itm?.account_holder_name,
          account_type: itm?.account_type,
          logo: itm.res?.data?.bank_logo,
          balance: itm.balance,
        };
      });
      setAllAccountByBankId(rData);
    } else {
      setAllAccountByBankId([]);
    }
  };

  const handledateChange = (e) => {
    setDateRange(e);
    const start = new Date(e[0]).getFullYear();
    const end = new Date(e[1]).getFullYear();
    const year = start + "-" + end;
    setFilterby(year);
  };

  const handleAccountByBankIdChange = async () => {
    const type = "fund";
    setLoading(true);
    const res = await getAllAccountTransactionsByBank(
      bankId,
      type,
      filterBy,
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
          <h6 className=" fw-bold mx-3 my-3">{t("View Fund Transactions")}</h6>

          <Form.Group className="mb-3" as={Col} md={12}>
            <Stack
              className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto `}
              direction="horizontal"
              gap={4}
            >
              <span className="ps-3">{t("Transactions Overview For")} : </span>
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
            </Stack>
          </Form.Group>

          {BalanceFor == "bank" ? (
            <>
              <span className="d-flex  mt-3 mx-3  gap-2">
                <span>
                  <Select
                    menuPortalTarget={document.body}
                    placeholder={t("Select Bank")}
                    options={allBanksData}
                    onChange={(e) => {
                      getAllBankAccountByBankId(e.value);
                      setBankId("");
                      setAccountDetails("");
                    }}
                    formatOptionLabel={userFormatOptionLabel}
                  />
                </span>

                <Form.Group as={Col} md={3}>
                  <Select
                    menuPortalTarget={document.body}
                    placeholder={t("Select Account")}
                    options={allAccountByBankId}
                    onChange={(e) => {
                      setBankId(e.id);
                      setAccountDetails(e);
                    }}
                    formatOptionLabel={BankFormatOptionLabel}
                  />
                </Form.Group>

                <span className="position-relative ms-auto fw-bold">
                  {" "}
                  {t("A/C Holder Name")}-
                  <span className="text-green">
                    {accountDetails?.account_holder_name}
                  </span>
                  <br />
                  {t("Account Number")}-
                  <span className="text-green">{accountDetails?.label} </span>
                </span>
              </span>

              <div className="container m-1">
                <div className="row">
                  <div className="col-md-3">
                    <DateRangePicker
                      value={dateRange}
                      onChange={(e) => handledateChange(e)}
                    />
                  </div>
                  <Form.Group as={Col} md={3}>
                    <Select
                      menuPortalTarget={document.body}
                      placeholder={t("Select Date")}
                      defaultValue={{
                        label: "Last 12 Months",
                        value: "last12Months",
                      }}
                      options={[
                        { label: "Today", value: "today" },
                        { label: "Yesterday", value: "yesterday" },
                        { label: "This Week", value: "thisWeek" },
                        { label: "Last Week", value: "lastWeek" },
                        { label: "This Month", value: "thisMonth" },
                        { label: "Last Month", value: "lastMonth" },
                        { label: "this Quarter", value: "thisQuarter" },
                        { label: "Last Quarter", value: "lastQuarter" },
                        { label: "Last 6 Months", value: "last6Months" },
                        { label: "Last 12 Months", value: "last12Months" },
                      ]}
                      onChange={(e) => {
                        setFilterby(e ? e.value : null);
                      }}
                    />
                  </Form.Group>

                  <div className="position-relative ms-auto col-md-3">
                    <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                    <Form.Control
                      type="text"
                      placeholder={t("Search")}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="me-2"
                      aria-label="Search"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="table-scroll">
                  <Table className="text-body bg-new Roles">
                    <thead className="text-truncate">
                      <tr>
                        <th>{t("Sr No.")}</th>
                        <th>{t("Account No.")}</th>
                        <th>{t("Account Type")}</th>
                        <th>{t("IFSC code")}</th>
                        <th>{t("Branch")}</th>
                        <th>{t("Transaction")}</th>
                        <th>{t("Status")}</th>
                        <th>{t("Description")}</th>
                        <th>{t("Transaction Id")}</th>
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
                            <td>{data?.account_number}</td>
                            <td>{data?.account_type}</td>
                            <td>{data?.ifsc_code}</td>
                            <td>{data?.branch}</td>
                            <td>{data?.transaction}</td>
                            <td
                              className={`text-${
                                data?.status == "debit" ? "danger" : "green"
                              }`}
                            >
                              {data?.status}
                            </td>
                            <td>{data?.description}</td>
                            <td>{data?.transaction_id}</td>
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
          ) : (
            <FundTransactionEmployee />
          )}
        </Card>
      </Col>
    </div>
  );
};

export default ViewFundTransactions;
