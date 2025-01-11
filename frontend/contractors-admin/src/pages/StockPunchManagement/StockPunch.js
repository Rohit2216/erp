import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import ReactPagination from "../../components/ReactPagination";
import { getStockPunchDetails } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Link, useNavigate } from "react-router-dom";
import ImageViewer from "../../components/ImageViewer";
import ActionButton from "../../components/ActionButton";
import CheckAndAppove from "./CheckAndAppove";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";

const StockPunch = () => {
  const [stockRequest, setStockRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchPunchRequestData = async () => {
    const res = await getStockPunchDetails(searchTerm, pageSize, pageNo);
    if (res.status) {
      setStockRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setStockRequest([]);
      setPageDetail({});
    }
  };

  // set Delay time to get data on search
  const debounceValue = useDebounce(searchTerm, 500);
  useEffect(() => {
    fetchPunchRequestData();
  }, [debounceValue, pageNo, pageSize]);

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
        <title>Stock Punch · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold" title={t("Stock Punch")} />
            <Tab className="ms-auto" title={t("Pending Request")}>
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

                    <span className="position-relative">
                      <Button
                        className="text-none view-btn shadow rounded-0 px-1 text-orange"
                        as={Link}
                        to={`/stock-punch/create-stock-punch/new`}
                      >
                        <BsPlus />
                        {t("Create")}
                      </Button>
                    </span>
                  </span>
                  <div className="p-3">
                    <div className="table-scroll">
                      <Table className="text-body bg-new Roles">
                        <thead className="text-truncate">
                          <tr>
                            <th>{t("Employee Id")}</th>
                            <th>{t("User Name")}</th>
                            <th>{t("complaint number")}</th>
                            <th>{t("Punch At")}</th>
                            <th>{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockRequest.length > 0 ? null : (
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
                          {stockRequest.map((data, id1) => (
                            <tr key={id1}>
                              <td>{data.employee_id ?? "--"}</td>

                              <td>
                                <ImageViewer
                                  src={
                                    data?.user_image
                                      ? `${process.env.REACT_APP_API_URL}${data?.user_image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                >
                                  <span className="d-flex align-items-center gap-2">
                                    <img
                                      width={30}
                                      height={30}
                                      className="my-bg object-fit p-1 rounded-circle"
                                      src={
                                        data?.user_image
                                          ? `${process.env.REACT_APP_API_URL}${data?.user_image}`
                                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                      }
                                    />{" "}
                                    <span className="d-grid">
                                      {data?.user_name}{" "}
                                    </span>
                                  </span>
                                </ImageViewer>
                              </td>

                              <td>{data?.complaint_unique_id}</td>
                              <td>{data.punch_at}</td>

                              <td>
                                <ActionButton
                                  hideDelete={"d-none"}
                                  hideEdit={"d-none"}
                                  approveMargin={false}
                                  approveAlign={"left"}
                                  approveOnclick={() =>
                                    navigate(
                                      `/approve-stock-punch-request/${data.id}`,
                                      {
                                        state: {
                                          Complain_id: data.complaint_id,
                                          userId: data.user_id,
                                        },
                                      }
                                    )
                                  }
                                  eyeOnclick={() =>
                                    navigate(
                                      `/stock-punch/create-stock-punch/${data.id}?type=view`,
                                      {
                                        state: {
                                          Complain_id: data.complaint_id,
                                          userId: data.user_id,
                                        },
                                      }
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
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
                                  ? stockRequest.length - 1 < pageSize
                                    ? "danger-combo-disable pe-none"
                                    : "success-combo"
                                  : stockRequest.length < pageSize
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
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </Tab>

            <Tab title={t("Check and Approve")}>
              {activeTab == "3" && <CheckAndAppove />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default StockPunch;
