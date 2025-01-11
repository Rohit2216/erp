import React from "react";
import { useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Card, Col, Row, Form, Table, Button } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
// import SecurityDeposit from "./SecurityDeposit";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import {
  deleteSalesOrderById,
  getAllSalesOrder,
  postChangeSoStatus,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ActionButton from "../../components/ActionButton";
import Switch from "../../components/Switch";
import { useTranslation } from "react-i18next";
import SecurityEligible from "./SecurityEligible";
import SecurityDeposit from "./SecurityDeposit";
import SecurityProcess from "./SecurityProcess";
import SecurityPaid from "./SecurityPaid";

const SalesOrder = () => {
  const [poData, setPoData] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchSaleOrderData = async () => {
    const res = await getAllSalesOrder(search, pageSize, pageNo);
    console.log(res.data, "sales");
    if (res.status) {
      setPoData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setPoData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteSalesOrderById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setPoData((prev) => prev.filter((itm) => itm.id !== idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
  };

  const handleChangePoStatus = async (e, event) => {
    const sData = {
      so_id: e.id,
      status: event.target.checked === true ? "2" : "1",
    };
    const res = await postChangeSoStatus(sData);
    if (res.status) {
      toast.success(res.message);
      fetchSaleOrderData();
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchSaleOrderData();
  }, [search, pageNo, pageSize]);

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
        <title>sales order · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold" title={t("sales order")} />
            <Tab className="ms-auto" title={t("sales order")}>
              {activeTab == "2" && (
                <>
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
                    <Button
                      as={Link}
                      to={"/createSalesOrder/new"}
                      variant="light"
                      className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
                    >
                      <BsPlus /> {t("Create")}
                    </Button>
                  </span>
                  <div className="overflow-auto p-3 mb-2">
                    <Table className="text-body bg-new Roles">
                      <thead className="text-truncate">
                        <tr>
                          <th>{t("Sr No.")}</th>
                          <th>{t("SO Number")}</th>
                          <th>{t("so date")}</th>
                          <th>{t("Regional office")}</th>
                          <th>{t("SO Limit")}</th>
                          <th>{t("used Limit")}</th>
                          <th>{t("remaining limit")}</th>
                          <th>{t("Cr Number")}</th>
                          <th>{t("Cr Date")}</th>
                          <th>{t("So Status")}</th>
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
                        ) : poData.length > 0 ? (
                          <>
                            {poData.map((data, id1) => (
                              <tr key={id1}>
                                <td>{serialNumber[id1]}</td>
                                <td>{data?.so_number}</td>
                                <td>{data?.so_date}</td>
                                <td>{data?.regional_office_name}</td>
                                <td>{data?.limit}</td>
                                <td>{data.used_so_amount}</td>
                                <td>{data.remaining_so_amount}</td>
                                <td>{data?.cr_number}</td>
                                <td>{data?.cr_date}</td>
                                <td>
                                  <Switch
                                    checked={data.so_status === "2"}
                                    onChange={(event) =>
                                      handleChangePoStatus(data, event)
                                    }
                                  />
                                  <span
                                    className={`text-${
                                      data.so_status === "2"
                                        ? "green"
                                        : "orange"
                                    }`}
                                  >
                                    {data.so_status === "2"
                                      ? "Done"
                                      : "Working"}
                                  </span>
                                </td>
                                <td>
                                  <ActionButton
                                    eyelink={`/sale-order/view-details/${data.id}?type=sales-order`}
                                    editlink={`/createSalesOrder/${data.id}`}
                                    deleteOnclick={() => {
                                      setIdToDelete(data.id);
                                      setShowDelete(true);
                                    }}
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
                      <ConfirmAlert
                        size={"sm"}
                        deleteFunction={handleDelete}
                        hide={setShowDelete}
                        show={showDelete}
                        title={"Confirm Delete"}
                        description={"Are you sure you want to delete this!!"}
                      />
                    </Table>
                  </div>
                  <ReactPagination
                    pageSize={pageSize}
                    prevClassName={
                      pageNo === 1
                        ? "danger-combo-disable pe-none"
                        : "red-combo"
                    }
                    nextClassName={
                      pageSize == pageDetail?.total
                        ? poData.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : poData.length < pageSize
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
              )}
            </Tab>
            <Tab title={t("Security Deposit")}>
              {activeTab == "3" && <SecurityDeposit />}
            </Tab>
            <Tab title={t("Security Eligible")}>
              {activeTab == "4" && <SecurityEligible />}
            </Tab>
            <Tab title={t("Security Process")}>
              {activeTab == "5" && <SecurityProcess />}
            </Tab>
            <Tab title={t("Security Paid")}>
              {activeTab == "6" && <SecurityPaid />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default SalesOrder;
