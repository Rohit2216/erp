import React, { useEffect, useState } from "react";

import { BsSearch } from "react-icons/bs";
import Select from "react-select";
import { Col, Form, Table } from "react-bootstrap";
import ReactPagination from "../../components/ReactPagination";
import {
  getEmployeeList,
  getFundTransactionsOfEmployee,
  getLastBalanceOfEmployee,
} from "../../services/contractoApi2";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { elementClosest } from "@fullcalendar/core/internal";
import { useTranslation } from "react-i18next";

export default function FundTransactionEmployee() {
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
  const { t } = useTranslation();

  useEffect(() => {
    fetchEmployeeList();
    fetchOfficeUser();
    fetchManagers();
  }, [employeeType]);

  useEffect(() => {
    getAccountBalance();
  }, [employeeId, pageSize, pageNo, searchTerm]);

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

  const userFormatOptionLabel = ({ label, logo }) => (
    <div>
      {/* {logo ? (
        <img
          src={process.env.REACT_APP_API_URL + logo}
          className="avatar me-2"
        />
      ) : null} */}
      {label}
    </div>
  );

  const getAccountBalance = async () => {
    setLoading(true);
    const res = await getFundTransactionsOfEmployee(
      employeeId,
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
      <>
        {/* <span className="d-flex mt-3 mx-3 gap-2">
          <span>
            <Select
              menuPortalTarget={document.body}
              placeholder="Select Employee Type"
              options={[
                { label: "manager", value: "manager" },
                { label: "Supervisor", value: "supervisor" },
                { label: "Enduser", value: "enduser" },
              ]}
              defaultValue={{ label: "manager", value: "manager" }}
              onChange={(e) => {
                setEmployeeType(e.value);
              }}
              //   formatOptionLabel={userFormatOptionLabel}
            />
          </span>

          <span>
            <Select
              placeholder={`Select ${employeeType} `}
              menuPortalTarget={document.body}
              options={EmployeeList}
              onChange={(e) => {
                setEmployeeId(e?.value);
              }}
              formatOptionLabel={userFormatOptionLabel}
            />
          </span>

          <span className="position-relative ms-auto">
            <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
            <Form.Control
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
              aria-label="Search"
            />
          </span>
        </span> */}

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
                  setEmployeeId(e?.value);
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
                  setEmployeeId(e?.value);
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
                  setEmployeeId(e?.value);
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
                  setEmployeeId(e?.value);
                }}
              />
            </Form.Group>
          </div>
        </div>

        <div className="p-3">
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Name")}</th>
                  <th>{t("Employee Id")}</th>
                  <th>{t("Role")}</th>
                  <th>{t("Amount")}</th>
                  <th>{t("Balance")}</th>
                  <th>{t("Transaction Type")}</th>
                  <th>{t("Status")}</th>
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
                        alt="Loading"
                      />
                    </td>
                  </tr>
                ) : allAccounts?.length > 0 ? (
                  allAccounts?.map((data, id1) => (
                    <tr key={id1}>
                      <td>{id1 + 1}</td>
                      <td>{data?.username}</td>
                      <td>{data?.employee_id ?? "--"}</td>
                      <td>{data?.role_name}</td>
                      <td>{data?.amount ?? "--"}</td>
                      <td>{data?.balance}</td>
                      <td>{data?.transaction_type}</td>
                      <td>{data?.status}</td>
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
      </>
    </div>
  );
}
