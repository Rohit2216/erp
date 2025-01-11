import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Form, Table } from "react-bootstrap";
import { BsArrowLeftRight, BsPlus, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import {
  getAllPendingTransferStockRequest,
  postRejectFundRequest,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Link } from "react-router-dom";
import ImageViewer from "../../components/ImageViewer";
import AllTransferStock from "./AllTransferStock";
import AllStock from "./AllStock";
import TooltipComponent from "../../components/TooltipComponent";
import RescheduledStockTransfer from "./RescheduledStockTransfer";
import { useTranslation } from "react-i18next";

const StockTransfer = () => {
  const [pendingStockTransfer, setPendingStockTransfer] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchPendingStockTransferData = async () => {
    const res = await getAllPendingTransferStockRequest(pageSize, pageNo);
    if (res.status) {
      setPendingStockTransfer(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setPendingStockTransfer([]);
      setPageDetail({});
    }
    setLoading(false);
  };

  const handleRejected = async () => {
    const res = await postRejectFundRequest(storeId.id);
    if (res.status) {
      toast.success(res.message);
      fetchPendingStockTransferData();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
  };

  const results = !searchTerm
    ? pendingStockTransfer
    : pendingStockTransfer.filter(
        (itm) =>
          itm?.request_by
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          itm?.request_by_employee_id
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase())
      );

  useEffect(() => {
    fetchPendingStockTransferData();
  }, [pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Fund Transfer · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab
              className="pe-none fs-15 fw-bold"
              title={t("Stock Transfer")}
            />
            <Tab className="ms-auto" title={t("Pending Transfer")}>
              {activeTab == "2" && (
                <>
                  {" "}
                  <span className="d-align mt-3 me-3 justify-content-end gap-2">
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
                            <th>{t("Unique Id")}</th>
                            <th>{t("Request For")}</th>
                            <th>{t("Request Date")}</th>
                            <th>{t("Request Quantity")}</th>
                            <th>{t("Total Approved Quantity")}</th>
                            <th>{t("Supplier")}</th>
                            <th>{t("total Items")}</th>
                            <th>{t("status")}</th>
                            <th>{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan={8}>
                                <img
                                  className="p-3"
                                  width="250"
                                  src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                                  alt="Loading"
                                />
                              </td>
                            </tr>
                          ) : results.length > 0 ? (
                            results.map((data, id1) => (
                              <tr key={id1}>
                                <td>{data?.unique_id}</td>
                                <td>
                                  <ImageViewer
                                    src={
                                      data?.request_for_image
                                        ? `${process.env.REACT_APP_API_URL}${data?.request_for_image}`
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                    }
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <img
                                        width={30}
                                        height={30}
                                        className="my-bg object-fit p-1 rounded-circle"
                                        src={
                                          data?.request_for_image
                                            ? `${process.env.REACT_APP_API_URL}${data?.request_for_image}`
                                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                        }
                                      />{" "}
                                      <span className="d-grid">
                                        {data?.request_for}{" "}
                                        <span>
                                          {data?.request_for_employee_id
                                            ? data?.request_for_employee_id
                                            : null}
                                        </span>
                                      </span>
                                    </span>
                                  </ImageViewer>
                                </td>
                                <td>{data.request_date}</td>
                                <td
                                  className={`fw-bolder text-${
                                    data.total_request_amount > 0
                                      ? "green"
                                      : "danger"
                                  }`}
                                >
                                  {data?.total_request_qty}
                                </td>

                                <td
                                  className={`fw-bolder text-${
                                    data.total_approved_qty > 0
                                      ? "green"
                                      : "danger"
                                  }`}
                                >
                                  {data?.total_approved_qty}
                                </td>
                                <td>{data?.supplier_name ?? "--"}</td>
                                <td>
                                  <Badge
                                    bg="orange"
                                    className="fw-normal"
                                    style={{ fontSize: 11 }}
                                  >
                                    {data.total_request_items} old
                                  </Badge>
                                  &ensp;
                                  <Badge
                                    bg="secondary"
                                    className="fw-normal"
                                    style={{ fontSize: 11, marginTop: "5px" }}
                                  >
                                    {data.total_new_request_items} new
                                  </Badge>
                                </td>

                                <td
                                  className={`text-${
                                    data?.status === "1" ? "danger" : "green"
                                  }`}
                                >
                                  {data?.status === "1" ? "Pending" : "Partial"}
                                </td>
                                <td>
                                  <ActionButton
                                    hideDelete={"d-none"}
                                    hideEdit={"d-none"}
                                    eyelink={`/stock-request/create-stock-request/${data.id}?type=view`}
                                    custom={
                                      <>
                                        <div className={`vr hr-shadow`} />

                                        {data?.active ? (
                                          <TooltipComponent
                                            align={"left"}
                                            title={"Transfer"}
                                          >
                                            <Link
                                              to={`/stock-transfer/create-stock-transfer/${data.id}?type=transfer`}
                                            >
                                              <BsArrowLeftRight
                                                className={`social-btn danger-combo`}
                                              />
                                            </Link>
                                          </TooltipComponent>
                                        ) : (
                                          <Link
                                            to={`/stock-transfer/create-stock-transfer/${data.id}?type=transfer`}
                                            style={{ pointerEvents: "none" }}
                                          >
                                            <BsArrowLeftRight
                                              className={`social-btn `}
                                            />
                                          </Link>
                                        )}
                                      </>
                                    }
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8}>
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
                              <ConfirmAlert
                                size={"sm"}
                                deleteFunction={handleRejected}
                                hide={setShowAlert}
                                show={showAlert}
                                title={"Confirm Reject"}
                                description={
                                  "Are you sure you want to reject this!!"
                                }
                              />
                              <ReactPagination
                                pageSize={pageSize}
                                prevClassName={
                                  pageNo === 1
                                    ? "danger-combo-disable pe-none"
                                    : "red-combo"
                                }
                                nextClassName={
                                  pageSize == pageDetail?.total
                                    ? pendingStockTransfer.length - 1 < pageSize
                                      ? "danger-combo-disable pe-none"
                                      : "success-combo"
                                    : pendingStockTransfer.length < pageSize
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
              )}
            </Tab>
            <Tab title={t("Rescheduled Stock")}>
              {activeTab == "3" && <RescheduledStockTransfer />}
            </Tab>
            <Tab title={t("Transfered Stock")}>
              {activeTab == "4" && <AllTransferStock />}
            </Tab>
            <Tab title={t("All")} className="me-1">
              {activeTab == "5" && <AllStock />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default StockTransfer;
