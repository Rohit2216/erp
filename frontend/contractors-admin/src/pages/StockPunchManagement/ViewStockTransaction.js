import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Select from "react-select";
import { Card, Col, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getEmployeeList,
  getExpenseTransactionDetails,
} from "../../services/contractoApi2";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import moment from "moment";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";

export default function ViewStockTransaction() {
  const [allAccounts, setallAccounts] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [EmployeeList, setEmployeeList] = useState([]);
  const [employeeType, setEmployeeType] = useState("manager");
  const [employeeId, setEmployeeId] = useState("");
  const [allOfficeUser, setAllofficeUser] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const [selected, setSelected] = useState("");
  const [dateRange, setDateRange] = useState([
    moment().startOf("month").format("YYYY-MM-DD"),
    moment(),
  ]);

  const [filterBy, setFilterby] = useState("last12Months");
  const { t } = useTranslation();

  useEffect(() => {
    fetchEmployeeList();
    fetchOfficeUser();
    fetchManagers();
  }, [employeeType]);

  // set Delay time to get data on search
  const debounceValue = useDebounce(searchTerm, 500);

  useEffect(() => {
    getAccountBalance();
  }, [employeeId, pageSize, pageNo, debounceValue, filterBy]);

  const fetchEmployeeList = async () => {
    const res = await getEmployeeList(employeeType);
    if (res?.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.name,
          logo: itm.image,
        };
      });
      setEmployeeList(rData);
    } else {
      setEmployeeList([]);
    }
  };

  const handleManagerChange = async (value, setvalue) => {
    if (!value) return setFreeSupervisorData([]);
    fetchFreeSupervisorData(value);
  };

  const handledateChange = (e) => {
    setDateRange(e);
    const start = new Date(e[0]).getFullYear();
    const end = new Date(e[1]).getFullYear();
    const year = start + "-" + end;
    setFilterby(year);
  };

  const handleSupervisorChange = async (value, setvalue) => {
    if (!value) return setFreeUserData([]);
    fetchFreeUsersData(value);
  };

  const fetchFreeUsersData = async (id) => {
    const res = await getAllEndUserBySupervisorId(id);
    if (res.status) {
      setFreeUserData(res.data);
    } else {
      setFreeUserData([]);
      toast.error(res.message);
    }
  };

  //All Supervisors By Manager Id
  const fetchFreeSupervisorData = async (id) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(id);
    if (res.status) {
      setFreeSupervisorData(res.data);
    } else {
      setFreeSupervisorData([]);
      toast.error(res.message);
    }
  };

  const fetchManagers = async () => {
    const res = await getAllManagersUser();
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  const fetchOfficeUser = async () => {
    const res = await getAllOfficeUser();
    if (res.status) {
      setAllofficeUser(res.data);
    } else {
      setAllofficeUser([]);
    }
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const getAccountBalance = async () => {
    setLoading(true);
    const res = await getExpenseTransactionDetails(
      employeeId?.value,
      filterBy,
      searchTerm,
      pageSize,
      pageNo
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
    <Col md={12} data-aos={"fade-up"}>
      <Card className="card-bg">
        <h6 className=" fw-bold mx-3 my-3">{t("view expense transaction")}</h6>
        <div className="container">
          <div className="row">
            <Form.Group as={Col} md={3}>
              <Form.Label className="small">{t("Office")} </Form.Label>
              <Select
                placeholder={t("Office")}
                menuPortalTarget={document.body}
                options={allOfficeUser?.map((user) => ({
                  label: user.name,
                  value: user.id,
                }))}
                isDisabled={selected == "manager"}
                isClearable
                onChange={(e) => {
                  setEmployeeId(e);
                  if (e) setSelected("office");
                  else setSelected("");
                }}
              />
            </Form.Group>

            <Form.Group as={Col} md={3}>
              <Form.Label className="small">{t("Manager")}</Form.Label>
              <Select
                placeholder={t("Manager")}
                menuPortalTarget={document.body}
                // value={main?.area_manager_id}
                options={allManagers?.map((user) => ({
                  label: user.name,
                  value: user.id,
                }))}
                isDisabled={selected == "office"}
                isClearable
                onChange={(e) => {
                  handleManagerChange(e?.value);
                  // props.setFieldValue(managerName, e);
                  setEmployeeId(e);
                  if (e) setSelected("manager");
                  else setSelected("");
                }}
              />
            </Form.Group>
            <Form.Group as={Col} md={3}>
              <Form.Label className="small">{t("Supervisor")}</Form.Label>
              <Select
                placeholder={t("Supervisor")}
                menuPortalTarget={document.body}
                options={freeSupervisorData?.map((user) => ({
                  label: user.name,
                  value: user.id,
                }))}
                isClearable
                onChange={(e) => {
                  handleSupervisorChange(e?.value);
                  setEmployeeId(e);
                }}
              />
            </Form.Group>

            <Form.Group as={Col} md={3}>
              <Form.Label className="small">{t("End User")}</Form.Label>
              <Select
                placeholder={t("End User")}
                menuPortalTarget={document.body}
                options={freeUserData?.map((user) => ({
                  label: user.name,
                  value: user.id,
                }))}
                isClearable
                onChange={(e) => {
                  setEmployeeId(e);
                }}
              />
            </Form.Group>
          </div>
        </div>

        <div className="container my-3">
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
                // isClearable
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

        <span className="mx-3 my-3">
          {t("End User")} : <b>{employeeId?.label ?? "--"} </b>
        </span>

        <div className="p-3">
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("complain No")}.</th>
                  <th>{t("Credit")}</th>
                  <th>{t("Debit")}</th>
                  <th>{t("Amount")}</th>
                  <th>{t("Balance")}</th>
                  <th>{t("Transaction Date")}</th>
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
                        alt={t("Loading")}
                      />
                    </td>
                  </tr>
                ) : allAccounts?.length > 0 ? (
                  allAccounts?.map((data, id1) => (
                    <tr key={id1}>
                      <td>{id1 + 1}</td>

                      <td>
                        {data?.complaint_details?.complaint_unique_id ?? "--"}
                      </td>

                      <td className="text-green">
                        {data?.transaction_type == "credit"
                          ? data?.transaction_type
                          : "--"}
                      </td>

                      <td className="text-danger">
                        {data?.transaction_type == "debit"
                          ? data?.transaction_type
                          : "--"}
                      </td>
                      <td className="text-green">₹ {data?.amount}</td>
                      <td className="text-green">₹ {data?.balance}</td>

                      <td>{data?.transaction_date}</td>
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
                      title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                        pageDetail?.pageEndResult || 0
                      } of ${pageDetail?.total || 0}`}
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
      </Card>
    </Col>
  );
}
