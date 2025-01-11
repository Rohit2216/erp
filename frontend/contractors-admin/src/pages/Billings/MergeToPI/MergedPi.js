import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import ReactPagination from "../../../components/ReactPagination";
import ActionButton from "../../../components/ActionButton";

import {
  getAllBillingFrom,
  getAllBillingTo,
  getAllPoListInvoice,
  getAllRoListInvoice,
  getComplaintsListingToMerge,
  postMergePi,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import FinalMergeToPI from "./FinalMergeToPI";
import DiscardMergeToPI from "./DiscardMergeToPI";

const MergedPi = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [poId, setPoId] = useState({});
  const [allBillingFrom, setAllBillingFrom] = useState([]);
  const [allBillingTo, setAllBillingTo] = useState([]);
  const [regionalOfficceId, setRegionalOfficeId] = useState({});
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [allPo, setAllPo] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [billingFromId, setBillingFromId] = useState("");
  const [billingToId, setBillingToId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);

  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    let status = 2;
    const res = await getComplaintsListingToMerge(
      poId?.id,
      regionalOfficceId.id,
      billingFromId,
      billingToId,
      pageSize,
      pageNo,
      search,
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

  const fetchAllPo = async () => {
    const status = 2;
    const res = await getAllPoListInvoice(status);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async (poId = "") => {
    const status = 2;
    const res = await getAllRoListInvoice(status, poId);
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllBillingFrom = async (po_id, ro_id) => {
    const res = await getAllBillingFrom(po_id.id, ro_id);
    if (res.status) {
      setAllBillingFrom(res.data);
    } else {
      setAllBillingFrom([]);
    }
  };

  const fetchAllBillingTo = async (po_id, ro_id, billingFromId) => {
    const res = await getAllBillingTo(po_id, ro_id, billingFromId);
    if (res.status) {
      setAllBillingTo(res.data);
    } else {
      setAllBillingTo([]);
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

  const handleSelectAll = (check) => {
    if (check) {
      const allItemId = allComplaints.map((item) => item.id);
      setSelectedMeasurements(allItemId);
    } else setSelectedMeasurements([]);
  };

  useEffect(() => {
    fetchAllPo();
    fetchAllRegionalOffice();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    poId,
    regionalOfficceId,
    billingFromId,
    billingToId,
    refresh,
  ]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
    setBillingFromId("");
    setBillingToId("");
    setPoId("");
    setRegionalOfficeId("");
  };

  const handleMergePi = async () => {
    const sData = {
      id: selectedMeasurements,
      billing_from: billingFromId,
      billing_to: billingToId,
      billing_to_ro_office: regionalOfficceId?.id,
      po_number: poId.id,
      complaint_for: allComplaints[0]?.complaint_for,
      billing_from_state: allComplaints[0]?.billing_from_state_id,
      financial_year: allComplaints[0]?.financial_year,
    };

    // return console.log(sData, "sdata");
    const res = await postMergePi(sData);
    if (res.status) {
      toast.success(res.message);
      setSelectedMeasurements([]);
      setShowConfirm(false);
      setRefresh(true);
    } else toast.error(res.message);
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
              className="pe-none fs-15 fw-bold "
              title={t("Merge Performa Invoice")}
            />
            <Tab className="ms-auto" title={t("ready to Merge Pi")}>
              {poId.id &&
                regionalOfficceId.id &&
                billingFromId &&
                billingToId &&
                selectedMeasurements.length > 1 && (
                  <div className="d-flex justify-content-end ">
                    <button
                      className="m-2 shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      onClick={() => setShowConfirm(true)}
                    >
                      Merge Pi
                    </button>
                  </div>
                )}
              <Row className="p-2 ">
                <Col md={3}>
                  <Select
                    placeholder={t("select po")}
                    menuPortalTarget={document.body}
                    options={allPo?.map((user) => ({
                      label: user.po_number,
                      value: user.id,
                    }))}
                    isDisabled={regionalOfficceId?.id}
                    onChange={(e) => {
                      if (e) {
                        setPoId({ id: e?.value, name: e?.label });
                        fetchAllRegionalOffice(e?.value);
                        setBillingFromId(null);
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
                    // value={}
                    isDisabled={billingFromId}
                    onChange={(e) => {
                      if (e) {
                        setRegionalOfficeId({ id: e?.value, name: e?.label });
                        fetchAllBillingFrom(poId, e?.value);
                      } else {
                        setRegionalOfficeId({});
                        setAllBillingFrom([]);
                      }
                    }}
                    isClearable
                  />
                </Col>
                <Col md={3}>
                  <Select
                    placeholder={t("Select billing from")}
                    menuPortalTarget={document.body}
                    options={allBillingFrom?.map((user) => ({
                      label: user.company_name,
                      value: user.id,
                    }))}
                    isDisabled={billingToId}
                    onChange={(e) => {
                      if (e) {
                        setBillingFromId(e ? e?.value : null);
                        fetchAllBillingTo(
                          poId.id,
                          regionalOfficceId.id,
                          e.value
                        );
                      } else setBillingFromId(null);
                      setAllBillingTo([]);
                    }}
                    isClearable
                  />
                </Col>

                <Col md={3}>
                  <Select
                    placeholder={t("Select billing to")}
                    menuPortalTarget={document.body}
                    options={allBillingTo?.map((user) => ({
                      label: user.name,
                      value: user.id,
                    }))}
                    onChange={(e) => {
                      setBillingToId(e ? e?.value : null);
                      setSelectedMeasurements([]);
                    }}
                    isClearable
                  />
                </Col>
              </Row>
              <div className="p-3">
                <div className="table-scroll my-2">
                  <Table className="text-body Roles">
                    <thead className="text-truncate">
                      <tr>
                        {poId.id &&
                          regionalOfficceId.id &&
                          billingFromId &&
                          billingToId && (
                            <th>
                              <Form.Check
                                onClick={(e) =>
                                  handleSelectAll(e.target.checked)
                                }
                                checked={allComplaints.every((item) =>
                                  selectedMeasurements.includes(item.id)
                                )}
                              ></Form.Check>
                            </th>
                          )}
                        <th>{t("PI NUMBER")}</th>
                        <th>{t("PI DATE")}</th>
                        <th>{t("FINANCIAL YEAR")}</th>
                        <th>{t("BILLING REGIONAL OFFICE")}</th>
                        <th>{t("Billing From")}</th>
                        <th>{t("Billing To")}</th>
                        <th>{t("Outlet Name")}</th>
                        <th style={{ minWidth: "160px" }}>
                          {t("Complaint Id")}
                        </th>
                        <th>{t("po")}</th>
                        <th>{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allComplaints?.length > 0 ? null : (
                        <tr>
                          <td colSpan={12}>
                            <img
                              className="p-3"
                              alt="no-result"
                              width="210"
                              src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                            />
                          </td>
                        </tr>
                      )}

                      {allComplaints?.map((data, id1) => (
                        <tr key={id1 + 1}>
                          {poId.id &&
                            regionalOfficceId.id &&
                            billingFromId &&
                            billingToId && (
                              <td>
                                <Form.Check
                                  checked={selectedMeasurements.includes(
                                    data.id
                                  )}
                                  onClick={() => handleSelect(data.id)}
                                ></Form.Check>
                              </td>
                            )}
                          <td>{data?.bill_no ?? "--"}</td>
                          <td>{data?.created_at ?? "--"}</td>
                          <td>{data?.financial_year ?? "--"}</td>
                          <td>{data?.billing_to_ro_office?.ro_name ?? "--"}</td>
                          <td>{data.billing_from.company_name}</td>
                          <td>{data?.billing_to?.company_name}</td>
                          <td>
                            {data?.outletDetails?.length > 0
                              ? data?.outletDetails?.map((item, idx) => (
                                  <li> {item?.outlet_name ?? "--"}</li>
                                ))
                              : "--"}
                          </td>
                          <td>
                            {data?.complaintDetails?.map((item, idx) => (
                              <li> {item?.complaint_unique_id ?? "--"}</li>
                            )) ?? "--"}
                          </td>
                          <td>{data?.po_number ?? "--"}</td>
                          <td>
                            <ActionButton
                              hideDelete={"d-none"}
                              eyeOnclick={() =>
                                navigate(`/view-performa-invoice`, {
                                  state: {
                                    id: data?.id,
                                  },
                                })
                              }
                              hideEdit={"d-none"}
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

                  <ConfirmAlert
                    size={"sm"}
                    deleteFunction={handleMergePi}
                    hide={setShowConfirm}
                    show={showConfirm}
                    title={"Confirm Merge"}
                    description={"Are you sure you want to merge this Pi!!"}
                  />
                </div>
              </div>
            </Tab>

            <Tab title={t("final")}>
              {activeTab == "3" && <FinalMergeToPI />}
            </Tab>
            <Tab title={t("discard")}>
              {activeTab == "4" && <DiscardMergeToPI />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default MergedPi;
