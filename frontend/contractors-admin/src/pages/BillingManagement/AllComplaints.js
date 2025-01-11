import React, { useEffect, useState } from "react";
import { Button, Card, Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate } from "react-router-dom";
import ReactPagination from "../../components/ReactPagination";
import ActionButton from "../../components/ActionButton";
import { getAllComplaintsForMeasurement } from "../../services/contractorApi";
import { FilterComponent } from "../Complaints/FilterComponent";
import { IoIosAttach } from "react-icons/io";
import TooltipComponent from "../../components/TooltipComponent";
import AllDiscards from "./AllDiscards";
import AllDraft from "./AllDraft";
import AllFinal from "./AllFinal";
import { useTranslation } from "react-i18next";
import ReadyToPi from "./ReadyToPi";
import ProcessToMeasurement from "./ProcessToMeasurement";

const AllComplaints = () => {
  const navigate = useNavigate();
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [status, setStatus] = useState("");
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    const res = await getAllComplaintsForMeasurement(
      salesAreaId,
      regionalOfficeId,
      outletId,
      orderById,
      pageSize,
      pageNo,
      status
    );

    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    outletId,
    regionalOfficeId,
    salesAreaId,
    orderById,
    status,
  ]);

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
        <title>Billing Management CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold" title={t("measurement")} />
            <Tab className="ms-auto" title={[t("All Complaints")]}>
              {activeTab == "2" && (
                <>
                  <div className="p-3">
                    <FilterComponent
                      setSalesAreaId={setSalesAreaId}
                      setOutletId={setOutletId}
                      setRegionalOfficeId={setRegionalOfficeId}
                      setOrderById={setOrderById}
                      status={5}
                      statusFilter={true}
                      setStatus={setStatus}
                    ></FilterComponent>
                    <div className="table-scroll">
                      <Table className="text-body bg-new Roles">
                        <thead className="text-truncate">
                          <tr>
                            <th>{t("COMPLAINT NO.")}</th>
                            <th>{t("COMPLAINT TYPE")}</th>
                            <th>{t("OUTLET")}</th>
                            <th>{t("ro")}</th>
                            <th>{t("sa")}</th>
                            <th>{t("ORDER BY")}</th>
                            <th>{t("status")}</th>
                            <th>{t("COMPANY NAME")}</th>
                            <th>{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allComplaints.length > 0 ? null : (
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

                          {allComplaints.map((data, id1) => (
                            <tr key={id1}>
                              <td className="fw-bolder text-green">
                                {data?.complaint_unique_id ?? "--"}
                              </td>
                              <td>{data?.complaint_type ?? "--"}</td>
                              <td>{data?.outlet?.[0]?.outlet_name ?? "--"}</td>
                              <td>
                                {
                                  data?.regionalOffice?.[0]
                                    ?.regional_office_name
                                }
                              </td>
                              <td>
                                {data?.saleAreaDetails?.[0]?.sales_area_name ??
                                  "--"}
                              </td>
                              <td className="">{data?.order_by_details}</td>
                              <td className="fw-bold ">{data?.status}</td>
                              <td>{data?.energy_company_name}</td>

                              <td>
                                <ActionButton
                                  hideDelete={"d-none"}
                                  eyeOnclick={() =>
                                    navigate(`/view-measurements/${data.id}`)
                                  }
                                  hideEdit={"d-none"}
                                  custom={
                                    <TooltipComponent
                                      align="left"
                                      title={"Attach Documents"}
                                    >
                                      <Button
                                        className={`view-btn`}
                                        disabled={data.status != "Resolved"}
                                        variant="light"
                                        onClick={() => {
                                          navigate(`/attach-hard-copies`, {
                                            state: {
                                              complaint_id: data?.id,
                                            },
                                          });
                                        }}
                                      >
                                        <IoIosAttach
                                          className={`social-btn red-combo`}
                                        />
                                      </Button>
                                    </TooltipComponent>
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
                                  ? allComplaints.length - 1 < pageSize
                                    ? "danger-combo-disable pe-none"
                                    : "success-combo"
                                  : allComplaints.length < pageSize
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

            <Tab title={[t("proccess to measurment")]}>
              {activeTab == "3" && <ProcessToMeasurement />}
            </Tab>

            <Tab title={[t("draft")]}> {activeTab == "4" && <AllDraft />}</Tab>

            <Tab title={[t("final")]}> {activeTab == "5" && <AllFinal />}</Tab>
            <Tab title={[t("discard")]}>
              {activeTab == "6" && <AllDiscards />}
            </Tab>
            <Tab title={[t("ready to pi")]}>
              {activeTab == "7" && <ReadyToPi />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default AllComplaints;
