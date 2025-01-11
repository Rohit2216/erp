import React, { useEffect, useState } from "react";
import { Card, Col, Form, Table } from "react-bootstrap";
import { BsArrowLeftRight, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import {
  getAllPendingTransferFundRequest,
  postRejectFundRequest,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import ActionButton from "../../../components/ActionButton";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Link } from "react-router-dom";
import ImageViewer from "../../../components/ImageViewer";
import AllTransferedFund from "./AllTransferedFund";
import AllFund from "./AllFund";
import TooltipComponent from "../../../components/TooltipComponent";
import RescheduledTransfer from "./RescheduledTransfer";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { getAllModuleByRoleId } from "../../../services/authapi";



const FundTransfer = () => {
  const [pendingFundTransfer, setPendingFundTransfer] = useState([]);
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
  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: true, // All users can view by default
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
  const { user } = useSelector(selectUser);

  const fetchPermissions = async () => {
    try {
      const userID = user.user_type; // Assuming `user_type` is the user's role identifier
      const res = await getAllModuleByRoleId(userID);
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "fund management");
        console.log("hrModule", hrModule)
        if (hrModule && hrModule.submodules) {
          const employeesSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "fund transfer"
          );
          console.log("employeesSubmodule", employeesSubmodule)
          if (employeesSubmodule) {
            setPermissions({
              create: Boolean(employeesSubmodule.create),
              update: Boolean(employeesSubmodule.update),
              delete: Boolean(employeesSubmodule.delete),
              view: true, // Ensure view is set explicitly to true
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setIsPermissionsLoading(false);
    }
  };

  const fetchPendingFundTransferData = async () => {
    const res = await getAllPendingTransferFundRequest(
      searchTerm,
      pageSize,
      pageNo
    );
    if (res.status) {
      setPendingFundTransfer(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setPendingFundTransfer([]);
      setPageDetail({});
    }
    setLoading(false);
  };

  const handleRejected = async () => {
    const res = await postRejectFundRequest(storeId.id);
    if (res.status) {
      toast.success(res.message);
      fetchPendingFundTransferData();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
  };

  useEffect(() => {
    fetchPendingFundTransferData();
    fetchPermissions();
  }, [searchTerm, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
  };

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
              title={[t("Fund Transfer")]}
            />
            <Tab className="ms-auto" title={[t("Pending Transfer")]}>
              {activeTab == "2" && (
                <>
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
                            <th>{t("Request Amount")}</th>
                            <th>{t("Total Approved Amount")}</th>
                            <th>{t("Status")}</th>
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
                          ) : pendingFundTransfer.length > 0 ? (
                            pendingFundTransfer.map((data, id1) => (
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
                                  className={`fw-bolder text-${data.total_request_amount > 0
                                    ? "green"
                                    : "danger"
                                    }`}
                                >
                                  {data.total_request_amount > 0
                                    ? `${"₹"} ${data.total_request_amount}`
                                    : "0"}
                                </td>
                                <td
                                  className={`fw-bolder text-${data.total_approved_amount > 0
                                    ? "green"
                                    : "danger"
                                    }`}
                                >
                                  {data.total_approved_amount > 0
                                    ? `${"₹"} ${data.total_approved_amount}`
                                    : "0"}
                                </td>
                                <td
                                  className={`text-${data?.status === "0"
                                    ? "warning"
                                    : data?.status === "1"
                                      ? "green"
                                      : data?.status === "2"
                                        ? "danger"
                                        : data?.status === "3"
                                          ? "orange"
                                          : "success"
                                    }`}
                                >
                                  {data?.status}
                                </td>
                                <td>
                                  {/* <ActionButton
                                    hideDelete={"d-none"}
                                    hideEdit={"d-none"}
                                    eyelink={`/fund-transfer/create-fund-transfer/${data.id}?type=view`}
                                    custom={
                                      <>
                                        <div className={`vr hr-shadow`} />

                                        {data?.active ? (
                                          <TooltipComponent
                                            align={"left"}
                                            title={"Transfer"}
                                          >
                                            <Link
                                              to={`/fund-transfer/create-fund-transfer/${data.id}?type=transfer`}
                                            >
                                              <BsArrowLeftRight
                                                className={`social-btn danger-combo`}
                                              />
                                            </Link>
                                          </TooltipComponent>
                                        ) : (
                                          <Link
                                            to={`/fund-transfer/create-fund-transfer/${data.id}?type=transfer`}
                                            style={{ pointerEvents: "none" }}
                                          >
                                            <BsArrowLeftRight
                                              className={`social-btn `}
                                            />
                                          </Link>
                                        )}
                                      </>
                                    }
                                  /> */}
                                  <ActionButton
                                    hideDelete={"d-none"}
                                    hideEdit={"d-none"}
                                    eyelink={`/fund-transfer/create-fund-transfer/${data.id}?type=view`}
                                    custom={
                                      <>
                                        <div className={`vr hr-shadow`} />

                                        {permissions.update && data?.active && (
                                          <TooltipComponent align={"left"} title={"Transfer"}>
                                            <Link to={`/fund-transfer/create-fund-transfer/${data.id}?type=transfer`}>
                                              <BsArrowLeftRight className={`social-btn danger-combo`} />
                                            </Link>
                                          </TooltipComponent>
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
                                    ? pendingFundTransfer.length - 1 < pageSize
                                      ? "danger-combo-disable pe-none"
                                      : "success-combo"
                                    : pendingFundTransfer.length < pageSize
                                      ? "danger-combo-disable pe-none"
                                      : "success-combo"
                                }
                                title={`Showing ${pageDetail?.pageStartResult || 0
                                  } to ${pageDetail?.pageEndResult || 0} of ${pageDetail?.total || 0
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
            <Tab title={t("Rescheduled Fund")}>
              {activeTab == "3" && <RescheduledTransfer />}
            </Tab>
            <Tab title={[t("Transfered Fund")]}>
              {activeTab == "4" && <AllTransferedFund />}
            </Tab>

            <Tab title={[t("All")]} className="me-1">
              {activeTab == "5" && <AllFund />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default FundTransfer;
