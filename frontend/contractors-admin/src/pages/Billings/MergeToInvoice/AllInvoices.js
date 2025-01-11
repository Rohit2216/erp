import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { toast } from "react-toastify";
import ReactPagination from "../../../components/ReactPagination";
import ActionButton from "../../../components/ActionButton";
import ConfirmAlert from "../../../components/ConfirmAlert";

import {
  discardPerformaById,
  getAllBillingFromList,
  getAllBillingToListing,
  getAllFinalInvoicesListing,
  getAllPoListInMergeInvoice,
  getAllRoListInMergeInvoice,
  postMergeInvoice,
} from "../../../services/contractorApi";

import AllMegeInvoices from "./AllMegeInvoices";
import DiscardMergeInvoices from "./DiscardMergeInvoices";

const AllInvoices = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [poId, setPoId] = useState({ label: "", value: "" });
  const [allBillingFrom, setAllBillingFrom] = useState([]);
  const [allBillingTo, setAllBillingTo] = useState([]);
  const [regionalOfficceId, setRegionalOfficeId] = useState({
    label: "",
    value: "",
  });
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [allPo, setAllPo] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [billingFromId, setBillingFromId] = useState({ label: "", value: "" });
  const [billingToId, setBillingToId] = useState({ label: "", value: "" });
  const [showDiscard, setShowDiscard] = useState(false);
  const [idToDiscard, setIdToDiscard] = useState("");
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [selectedPerformaInvoice, setSelectedPerfomaInvoice] = useState([]);

  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    const status = 1;

    const res = await getAllFinalInvoicesListing(
      status,
      pageSize,
      pageNo,
      search,
      poId?.value,
      regionalOfficceId?.value,
      billingFromId?.value,
      billingToId?.value
    );

    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };

  const handleDiscard = async () => {
    const res = await discardPerformaById(idToDiscard);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard(false);
    setIdToDiscard("");
  };

  const fetchAllPo = async () => {
    const status = 1;
    const res = await getAllPoListInMergeInvoice(status);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async (poId) => {
    const status = 1;
    const res = await getAllRoListInMergeInvoice(status, poId);
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllBillingFrom = async (po_id, ro_id) => {
    const status = 1;
    const res = await getAllBillingFromList(status, po_id.id, ro_id);
    if (res.status) {
      setAllBillingFrom(res.data);
    } else {
      setAllBillingFrom([]);
    }
  };

  const fetchAllBillingTo = async (po_id, ro_id, billingFromId) => {
    const status = 1;
    const res = await getAllBillingToListing(
      status,
      po_id,
      ro_id,
      billingFromId
    );
    if (res.status) {
      setAllBillingTo(res.data);
    } else {
      setAllBillingTo([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedPerformaInvoice.includes(id)) {
      setSelectedPerfomaInvoice(
        selectedPerformaInvoice.filter((item) => item !== id)
      );
    } else {
      setSelectedPerfomaInvoice([...selectedPerformaInvoice, id]);
    }
  };

  const handleSelectAll = (check) => {
    if (check) {
      const allItemId = allComplaints.map((item) => item.id);
      setSelectedPerfomaInvoice(allItemId);
    } else setSelectedPerfomaInvoice([]);
  };

  useEffect(() => {
    fetchAllPo();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    poId.value,
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
    setBillingFromId({ label: "", value: "" });
    setBillingToId({ label: "", value: "" });
    setPoId({ label: "", value: "" });
    setRegionalOfficeId({ label: "", value: "" });
  };

  const handleMergeInvoice = async () => {
    const sData = {
      id: selectedPerformaInvoice,
      po_number: poId.value,
      regional_office: regionalOfficceId.value,
      billing_from: billingFromId.value,
      billing_to: billingToId.value,
      companies_for: billingToId.companies_for,
    };

    // return console.log(sData, "sdata");
    const res = await postMergeInvoice(sData);
    if (res.status) {
      toast.success(res.message);
      setSelectedPerfomaInvoice([]);
      setRefresh(true);
      setBillingFromId({ label: "", value: "" });
      setBillingToId({ label: "", value: "" });
      setPoId({ label: "", value: "" });
      setRegionalOfficeId({ label: "", value: "" });
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
              title={t("Merge Invoice")}
            />
            <Tab className="ms-auto" title={t("ready to merge invoice")}>
              {activeTab == "2" && (
                <>
                  {poId?.value &&
                    regionalOfficceId?.value &&
                    billingFromId?.value &&
                    billingToId?.value &&
                    selectedPerformaInvoice.length > 0 && (
                      <div className="d-flex justify-content-end">
                        <button
                          className="m-2 shadow border-0 purple-combo cursor-pointer px-4 py-1"
                          onClick={() => handleMergeInvoice()}
                        >
                          {t("Merge Invoice")}
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
                        value={poId.value && poId}
                        isDisabled={regionalOfficceId?.value}
                        onChange={(e) => {
                          if (e) {
                            setPoId({ value: e?.value, label: e?.label });
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
                        value={regionalOfficceId.value && regionalOfficceId}
                        isDisabled={billingFromId?.value}
                        onChange={(e) => {
                          if (e) {
                            setRegionalOfficeId({
                              value: e?.value,
                              label: e?.label,
                            });
                            fetchAllBillingFrom(poId.value, e?.value);
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
                          label: user.name,
                          value: user.id,
                        }))}
                        value={billingFromId?.value && billingFromId}
                        isDisabled={billingToId?.value}
                        onChange={(e) => {
                          if (e) {
                            setBillingFromId({
                              label: e.label,
                              value: e.value,
                            });
                            fetchAllBillingTo(
                              poId.value,
                              regionalOfficceId.value,
                              e.value
                            );
                          } else setBillingFromId({ label: "", value: "" });
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
                          companies_for: user.companies_for,
                        }))}
                        value={billingToId.value && billingToId}
                        onChange={(e) => {
                          if (e) {
                            setBillingToId({
                              label: e.label,
                              value: e.value,
                              companies_for: e.companies_for,
                            });
                          } else {
                            setBillingToId({});
                          }
                          setSelectedPerfomaInvoice([]);
                        }}
                        isClearable
                      />
                    </Col>
                  </Row>
                  <div className="p-3">
                    <div className="table-scroll my-2  ">
                      <Table className="text-body Roles">
                        <thead className="text-truncate">
                          <tr>
                            {poId?.value &&
                              regionalOfficceId?.value &&
                              billingFromId?.value &&
                              billingToId?.value && (
                                <th>
                                  <Form.Check
                                    onClick={(e) =>
                                      handleSelectAll(e.target.checked)
                                    }
                                    checked={allComplaints.every((item) =>
                                      selectedPerformaInvoice.includes(item.id)
                                    )}
                                  ></Form.Check>
                                </th>
                              )}
                            <th>{t("Invoice NUMBER11")}</th>
                            <th>{t("Invoice DATE")}</th>
                            <th>{t("FINANCIAL YEAR")}</th>
                            <th>{t("BILLING REGIONAL OFFICE")}</th>
                            <th>{t("Billing From")}</th>
                            <th>{t("Billing To")}</th>
                            <th style={{ minWidth: "155px" }}>
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
                              {poId?.value &&
                                regionalOfficceId?.value &&
                                billingFromId?.value &&
                                billingToId?.value && (
                                  <td>
                                    <Form.Check
                                      checked={selectedPerformaInvoice.includes(
                                        data.id
                                      )}
                                      onClick={() => handleSelect(data.id)}
                                    ></Form.Check>
                                  </td>
                                )}
                              <td>{data?.bill_no ?? "--"}</td>
                              <td>{data?.created_at ?? "--"}</td>
                              <td>{data?.financial_year ?? "--"}</td>
                              <td>
                                {data?.billing_to_ro_office?.ro_name ?? "--"}
                              </td>
                              <td>{data.billing_from.company_name}</td>
                              <td>{data?.billing_to?.company_name}</td>

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
                                    navigate(`/view-invoice`, {
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
                        deleteFunction={handleDiscard}
                        hide={setShowDiscard}
                        show={showDiscard}
                        title={"Confirm Discard"}
                        description={"Are you sure you want to discard this!!"}
                      />
                    </div>
                  </div>
                </>
              )}
            </Tab>

            <Tab title={t("final")}>
              {activeTab == "3" && <AllMegeInvoices />}
            </Tab>
            <Tab title={t("discard")}>
              {activeTab == "4" && <DiscardMergeInvoices />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default AllInvoices;
