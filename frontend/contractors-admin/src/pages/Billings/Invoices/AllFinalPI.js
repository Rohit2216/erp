import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
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
  getAllBillingFrom,
  getAllBillingTo,
  getAllInvoiceListing,
  getAllPoListInvoice,
  getAllRoListInvoice,
} from "../../../services/contractorApi";
import AllFinalInvoices from "./AllFinalInvoices";
import DiscardInvoices from "./DiscardInvoices";
import TooltipComponent from "../../../components/TooltipComponent";
import { BsPlus } from "react-icons/bs";

const AllFinalPI = () => {
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
  const [showDiscard, setShowDiscard] = useState(false);
  const [idToDiscard, setIdToDiscard] = useState("");
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [selectedPerformaInvoice, setSelectedPerfomaInvoice] = useState([]);

  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    const res = await getAllInvoiceListing(
      poId?.id,
      regionalOfficceId.id,
      billingFromId,
      billingToId,
      pageSize,
      pageNo,
      search
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
    const status = null;
    const invoice = "1";
    const res = await getAllPoListInvoice(status, invoice);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async (poId = "") => {
    const status = null;
    const invoice = "1";
    const res = await getAllRoListInvoice(status, poId, invoice);
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllBillingFrom = async (po_id, ro_id) => {
    const invoice = "1";
    const res = await getAllBillingFrom(po_id.id, ro_id, invoice);
    if (res.status) {
      setAllBillingFrom(res.data);
    } else {
      setAllBillingFrom([]);
    }
  };

  const fetchAllBillingTo = async (po_id, ro_id, billingFromId) => {
    const invoice = "1";
    const res = await getAllBillingTo(po_id, ro_id, billingFromId, invoice);
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
            <Tab className="pe-none fs-15 fw-bold " title={t("Invoice")} />
            <Tab className="ms-auto" title={t("ready to invoice")}>
              {activeTab == "2" && (
                <>
                  {poId.id &&
                    regionalOfficceId.id &&
                    billingFromId &&
                    billingToId &&
                    selectedPerformaInvoice.length > 1 && (
                      <div className="d-flex justify-content-end ">
                        <button
                          className="m-2 shadow border-0 purple-combo cursor-pointer px-4 py-1"
                          onClick={() => {
                            navigate(`/Invoice/CreateInvoice/${"new"}`, {
                              state: {
                                selectedPI: selectedPerformaInvoice,
                                billing_to: billingToId,
                                po_number: poId?.id,
                                regional_office: regionalOfficceId?.id,
                                billing_from: billingFromId,
                              },
                            });
                          }}
                        >
                          {t("Create Invoice")}
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
                            setRegionalOfficeId({
                              id: e?.value,
                              name: e?.label,
                            });
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
                                      selectedPerformaInvoice.includes(item.id)
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
                              {poId.id &&
                                regionalOfficceId.id &&
                                billingFromId &&
                                billingToId && (
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
                                    navigate(`/view-performa-invoice`, {
                                      state: {
                                        id: data?.id,
                                        show: "finalPI",
                                      },
                                    })
                                  }
                                  hideEdit={"d-none"}
                                  custom={
                                    <TooltipComponent
                                      align="left"
                                      title={"Create"}
                                    >
                                      <Button
                                        className={`view-btn`}
                                        variant="light"
                                        disabled={
                                          selectedPerformaInvoice.length > 1
                                        }
                                        onClick={() => {
                                          navigate(
                                            `/Invoice/CreateInvoice/${"new"}`,
                                            {
                                              state: {
                                                billing_to:
                                                  data?.billing_to?.company_id,
                                                selectedPI: [data.id],
                                                po_number: data.po_id,
                                                regional_office:
                                                  data.billing_to_ro_office
                                                    .ro_id,
                                                billing_from:
                                                  data.billing_from.company_id,
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

            <Tab title={t("final invoice")}>
              {activeTab == "3" && <AllFinalInvoices />}
            </Tab>
            <Tab title={t("discard")}>
              {activeTab == "4" && <DiscardInvoices />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default AllFinalPI;
