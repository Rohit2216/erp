import React, { useEffect, useState } from "react";

import { BsSearch } from "react-icons/bs";
import Select from "react-select";
import { Col, Form, Table } from "react-bootstrap";
import ReactPagination from "../../components/ReactPagination";
import {
  getEmployeeList,
  getFundTransactionsOfEmployee,
  getLastBalanceOfEmployee,
  getStockTransactionOfSupplier,
} from "../../services/contractoApi2";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getAllSuppliers,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function StockBalance_Supplier() {
  const [allAccounts, setallAccounts] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState();
  const [suppliersData, setSuppliersData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchSuppliersData();
  }, []);

  useEffect(() => {
    getAccountBalance();
  }, [employeeId, pageSize, pageNo, searchTerm]);

  const fetchSuppliersData = async () => {
    const isDropdown = "false";
    const res = await getAllSuppliers({ isDropdown });
    if (res.status) {
      setSuppliersData(res.data);
    } else {
      setSuppliersData([]);
    }
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const getAccountBalance = async () => {
    setLoading(true);
    const res = await getStockTransactionOfSupplier(
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
        <div className="container">
          <div className="row">
            <Form.Group as={Col} md={3}>
              <Form.Label className="small">{t("Supplier Name")} </Form.Label>

              <Select
                menuPortalTarget={document.body}
                autoFocus
                placeholder={t("Supplier Name")}
                className="text-primary"
                options={suppliersData?.map((typ) => ({
                  value: typ.id,
                  label: typ.supplier_name,
                }))}
                onChange={(e) => setEmployeeId(e.value)}
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
                  <th>{t("Supplier Name")}</th>
                  <th>{t("Supplier Id")}</th>
                  <th>{t("Bill Number")}</th>
                  <th>{t("Total Transfer Amount")}</th>
                  <th>{t("Bill Date")}</th>
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
                      <td>{data?.supplier_name}</td>
                      <td>{data?.supplier_id ?? "--"}</td>
                      <td>{data?.bill_number}</td>
                      <td>{data?.total_transfer_amount ?? "--"}</td>
                      <td>{data?.bill_date ?? "--"}</td>
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
