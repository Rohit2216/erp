import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactPagination from "../../../components/ReactPagination";
import ActionButton from "../../../components/ActionButton";
import Select from "react-select";

import {
  getAllCompanyNAme,
  getAllPoList,
  getAllReadyToPi,
  getAllRoList,
} from "../../../services/contractorApi";
import { BsPlus } from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import PerformaListing from "./PerformaListing";
import PerformaDiscard from "./PerformaDiscard";
import PerformaFinalListing from "./PerformaFinalListing";

const AllReadyToPi = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [poId, setPoId] = useState({});
  const [regionalOfficceId, setRegionalOfficeId] = useState({});
  const [search, setSearch] = useState("");
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [allPo, setAllPo] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [complaint_id, setComplaint_id] = useState("");
  const [companyDetails, setCompanyDetails] = useState();
  const [companyNameList, setCompanyNameList] = useState([]);
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    let status = 5;
    const res = await getAllReadyToPi(
      poId?.id,
      regionalOfficceId.id,
      complaint_id,
      pageSize,
      pageNo,
      search,
      status,
      companyDetails
    );

    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };

  const handleSelect = (id) => {
    if (selectedMeasurements.includes(id)) {
      setSelectedMeasurements(
        selectedMeasurements.filter((item) => item !== id)
      );
    } else {
      setSelectedMeasurements([...selectedMeasurements, id]);
    }
  };

  const fetchAllPo = async () => {
    const status = 5;
    const res = await getAllPoList(status);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async (poId) => {
    const status = 5;
    const res = await getAllRoList(status, poId);
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllCompanyName = async (ro_id) => {
    const status = 5;
    const res = await getAllCompanyNAme(status, ro_id, poId.id);
    if (res.status) {
      setCompanyNameList(res.data);
    } else {
      setCompanyNameList([]);
    }
  };

  useEffect(() => {
    fetchAllPo();
  }, []);

  const handleSelectAll = (check) => {
    if (check) {
      const allItemId = allComplaints.map((item) => item.id);
      setSelectedMeasurements(allItemId);
    } else setSelectedMeasurements([]);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [pageNo, pageSize, poId, regionalOfficceId, complaint_id, companyDetails]);

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
            <Tab
              className="pe-none fs-15 fw-bold"
              title={t("Performa Invoice")}
            />
            <Tab className="ms-auto" title={t("ready to pi")}>
              {activeTab == "2" && (
                <>
                  <div className="p-3">
                    <Row>
                      <Col md={3}>
                        <Select
                          placeholder={t("select po")}
                          menuPortalTarget={document.body}
                          options={allPo?.map((user) => ({
                            label: user.po_number,
                            value: user.id,
                          }))}
                          isDisabled={regionalOfficceId.id}
                          onChange={(e) => {
                            if (e) {
                              setPoId({ id: e?.value, name: e?.label });
                              fetchAllRegionalOffice(e?.value);
                            } else {
                              setPoId({});
                              setAllRegionalOffice([]);
                            }
                          }}
                          isClearable
                        />
                      </Col>

                      <Col md={3}>
                        <Select
                          placeholder={t("select Ro")}
                          menuPortalTarget={document.body}
                          options={allRegionalOffice?.map((user) => ({
                            label: user.regional_office_name,
                            value: user.ro_id,
                          }))}
                          isDisabled={companyDetails?.label}
                          onChange={(e) => {
                            if (e) {
                              setRegionalOfficeId({
                                id: e?.value,
                                name: e?.label,
                              });
                              fetchAllCompanyName(e?.value);
                            } else setRegionalOfficeId({});
                          }}
                          isClearable
                        />
                      </Col>

                      <Col md={3}>
                        <Select
                          placeholder={t("select Company")}
                          menuPortalTarget={document.body}
                          options={companyNameList?.map((user) => ({
                            label: user.company_name,
                            value: user.company_id,
                            complaint_for: user.complaint_for,
                          }))}
                          onChange={(e) => {
                            if (e) {
                              setCompanyDetails(e);
                            } else {
                              setCompanyDetails({});
                            }
                          }}
                          isClearable
                        />
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end m-2">
                      {selectedMeasurements.length > 0 && (
                        <button
                          className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                          onClick={() =>
                            navigate(
                              `/PerformaInvoice/CreatePerformaInvoice/new`,
                              {
                                state: {
                                  measurements: selectedMeasurements,
                                  regionalOfficceId,
                                  poId,
                                  companyDetails: {
                                    name: companyDetails.label,
                                    id: companyDetails.value,
                                    complaint_for: companyDetails.complaint_for,
                                  },
                                },
                              }
                            )
                          }
                        >
                          <BsPlus />
                          {t("Create")}
                        </button>
                      )}
                    </div>
                    <div className="table-scroll">
                      <Table className="text-body bg-new Roles">
                        <thead className="text-truncate">
                          <tr>
                            {poId?.id &&
                              regionalOfficceId?.id &&
                              companyDetails?.value && (
                                <th>
                                  <Form.Check
                                    onClick={(e) =>
                                      handleSelectAll(e.target.checked)
                                    }
                                    // checked={true}

                                    checked={allComplaints.every((item) =>
                                      selectedMeasurements.includes(item.id)
                                    )}
                                  ></Form.Check>
                                </th>
                              )}
                            <th>{t("COMPLAINT NO.")}</th>
                            <th>{t("COMPLAINT TYPE")}</th>
                            <th>{t("OUTLET")}</th>
                            <th>{t("ro")}</th>
                            <th>{t("sa")}</th>
                            <th>{t("PO Number")}</th>
                            <th>{t("ORDER BY")}</th>
                            <th>{t("status")}</th>
                            <th>
                              {t("measurement")} <br />
                              {t("Amount")}
                            </th>
                            <th>
                              {t("measurement")} <br /> {t("date")}
                            </th>
                            <th>
                              {t("po")} {t("Amount")}
                            </th>
                            <th>{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allComplaints.length > 0 ? null : (
                            <tr>
                              <td colSpan={12}>
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
                              {poId?.id &&
                                regionalOfficceId?.id &&
                                companyDetails?.value && (
                                  <td>
                                    <Form.Check
                                      checked={selectedMeasurements.includes(
                                        data.id
                                      )}
                                      onClick={() => handleSelect(data.id)}
                                    ></Form.Check>
                                  </td>
                                )}
                              <td className="fw-bolder text-green">
                                {data?.complaint_unique_id ?? "--"}
                              </td>
                              <td>{data?.complaint_type_name ?? "--"}</td>
                              <td>{data?.outlet_name ?? "--"}</td>
                              <td>{data?.regional_office_name}</td>
                              <td>{data?.sales_area_name ?? "--"}</td>
                              <td>{data?.po_number ?? "--"}</td>
                              <td className="">{data?.order_by_name}</td>
                              <td className="fw-bold ">{data?.status}</td>
                              <td>{data?.measurement_amount}</td>
                              <td>{data?.measurement_date}</td>
                              <td>{data?.po_limit}</td>

                              <td>
                                <ActionButton
                                  hideDelete={"d-none"}
                                  hideEdit={"d-none"}
                                  eyeOnclick={() =>
                                    navigate(`/view-measurement-details`, {
                                      state: {
                                        complaint_id: data?.id,
                                      },
                                    })
                                  }
                                  custom={
                                    <TooltipComponent
                                      align="left"
                                      title={"Create"}
                                    >
                                      <Button
                                        className={`view-btn`}
                                        variant="light"
                                        disabled={
                                          selectedMeasurements.length > 1
                                        }
                                        onClick={() => {
                                          navigate(
                                            `/PerformaInvoice/CreatePerformaInvoice/new`,
                                            {
                                              state: {
                                                regionalOfficceId: {
                                                  name: data?.regional_office_name,
                                                  id: data?.ro_office_id,
                                                },
                                                measurements: [data.id],

                                                poId: {
                                                  id: data?.po_id,
                                                  name: data?.po_number,
                                                },
                                                companyDetails: {
                                                  name: data?.company_details
                                                    .name,
                                                  id: data.company_details.id,
                                                  complaint_for:
                                                    data.complaint_for,
                                                },
                                              },
                                            }
                                          );
                                        }}
                                      >
                                        <BsPlus
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
            <Tab title={[t("Performa Invoice")]}>
              {activeTab == "3" && <PerformaListing />}
            </Tab>

            <Tab title={[t("final")]}>
              {activeTab == "4" && <PerformaFinalListing />}
            </Tab>
            <Tab title={[t("discard")]}>
              {activeTab == "5" && <PerformaDiscard />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default AllReadyToPi;
