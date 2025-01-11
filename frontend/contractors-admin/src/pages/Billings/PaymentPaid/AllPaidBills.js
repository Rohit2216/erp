import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ReactPagination from "../../../components/ReactPagination";
import ActionButton from "../../../components/ActionButton";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  discardfinalInvoices,
  getAllAreaManagerInPaymentPaid,
  getAllPaidPaymentListing,
  getAllRoInPaymentPaid,
  postPaymentPaid,
} from "../../../services/contractorApi";
import Select from "react-select";
import { BsPlus } from "react-icons/bs";
import DonePayments from "./DonePayments";
import PaymentProcess from "./PaymentProcess";
import PoDetailsInpaymentPaid from "./PoDetailsInpaymentPaid";

const AllPaidBills = () => {
  const { t } = useTranslation();
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardDetails, setDiscardDetails] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [allRo, setAllRo] = useState([]);
  const [allAreaManager, setAllAreaManager] = useState([]);
  const [roId, setRoId] = useState({ label: "", value: "" });
  const [areaMangerId, setAreaManagerId] = useState({ label: "", value: "" });
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [totalMeasurement, setTotalMeasurement] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [finalManagerAmount, setFinalManagerAmount] = useState(0);

  const navigate = useNavigate();

  const fetchAllInvoices = async () => {
    const res = await getAllPaidPaymentListing(
      pageSize,
      pageNo,
      search,
      roId?.value,
      areaMangerId?.value
    );

    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };
  const fetchAllRo = async () => {
    const res = await getAllRoInPaymentPaid();
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };

  const fetchAreaManager = async () => {
    const res = await getAllAreaManagerInPaymentPaid();
    if (res.data) {
      setAllAreaManager(res.data);
    } else {
      setAllAreaManager([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((item) => item !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  // calculate total amount for all selected invoices
  const calculateTotal = (check) => {
    if (check) {
      const totalMeasurement = allComplaints.reduce(
        (total, item) => total + item.measurement_amount,
        0
      );
      const deduction = allComplaints.reduce(
        (total, item) => total + +item.deduction.deduction,
        0
      );

      const managerAmount = allComplaints.reduce(
        (total, item) => total + item.manager_amount,
        0
      );

      setTotalMeasurement(totalMeasurement);
      setTotalDeduction(deduction);
      setFinalManagerAmount(managerAmount);
    } else {
      setTotalMeasurement(0);
      setTotalDeduction(0);
      setFinalManagerAmount(0);
    }
  };

  // calculate total measurement amount for individual
  const calculateTotalForIndividual = (
    check,
    Measurement_amount,
    deduction,
    managerAmount
  ) => {
    if (check) {
      setTotalMeasurement(totalMeasurement + Measurement_amount);
      setTotalDeduction(totalDeduction + deduction);
      setFinalManagerAmount(finalManagerAmount + managerAmount);
    } else {
      setTotalMeasurement(totalMeasurement - Measurement_amount);
      setTotalDeduction(totalDeduction - deduction);
      setFinalManagerAmount(finalManagerAmount - managerAmount);
    }
  };

  const handleSelectAll = (check) => {
    if (check) {
      const allItemId = allComplaints.map((item) => item.complaint_id);
      setSelectedInvoices(allItemId);
    } else setSelectedInvoices([]);
  };

  const handleDiscard = async () => {
    const res = await discardfinalInvoices(discardDetails?.id);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard(false);
    setDiscardDetails("");
  };
  useEffect(() => {
    fetchAllInvoices();
  }, [pageSize, pageNo, roId?.value, areaMangerId.value, refresh]);

  useEffect(() => {
    fetchAllRo();
    fetchAreaManager();
  }, []);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClick = async (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
  };

  const handleSubmit = async () => {
    const filteredData = allComplaints.filter((item) =>
      selectedInvoices.includes(item.complaint_id)
    );

    const payment_data = filteredData.map((data) => {
      return {
        billNumber: data.invoice_no,
        bill_date: data.invoice_date,
        complaint_id: data.complaint_id,
        measurement_id: data.measurement_id,
        pv_number: data.pv_number,
        pv_date: data.payment_voucher_date,
        deduction: data.deduction.toFixed(2),
      };
    });

    const sData = {
      manager_id: filteredData[0]?.area_manager_detail.area_manager_id,
      ro_id: filteredData[0]?.ro_id,
      paid_payment: parseFloat(finalManagerAmount).toFixed(2),
      payment_data,
    };

    // return console.log(sData, "sdata");

    const res = await postPaymentPaid(sData);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
      navigate("/payment-paid/all");
    } else {
      toast.error(res.message);
    }
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
            <Tab className="pe-none fs-15 fw-bold " title={t("payment paid")} />
            <Tab className="ms-auto" title={t("All paid bills")}>
              <Row className="p-2">
                <Col md={3}>
                  <Select
                    placeholder={t("select ro")}
                    menuPortalTarget={document.body}
                    options={allRo?.map((data) => ({
                      label: data.ro_name,
                      value: data.ro_id,
                    }))}
                    value={roId.value && roId}
                    isDisabled={areaMangerId.value}
                    onChange={(e) => {
                      if (e) {
                        setRoId({ value: e?.value, label: e?.label });
                      } else {
                        setRoId({});
                      }
                    }}
                    isClearable
                  />
                </Col>
                <Col md={3}>
                  <Select
                    placeholder={t("area manager")}
                    menuPortalTarget={document.body}
                    options={allAreaManager?.map((data) => ({
                      label: data.area_manager_name,
                      value: data.area_manager_id,
                    }))}
                    value={areaMangerId.value && areaMangerId}
                    onChange={(e) => {
                      if (e) {
                        setAreaManagerId({ value: e?.value, label: e?.label });
                      } else {
                        setAreaManagerId({});
                      }
                    }}
                    isClearable
                  />
                </Col>
              </Row>
              <div className="mt-3 fw-bold mx-2">
                {t("measurement Amount")} {totalMeasurement.toFixed(2)}
                <br></br>
                {t("deduction Amount")} {parseFloat(totalDeduction).toFixed(2)}
                <br></br>
                {t("Final Amount")}{" "}
                {parseFloat(totalMeasurement - totalDeduction).toFixed(2)}
                <br></br>
                {t("manager Amount")}{" "}
                {parseFloat(finalManagerAmount).toFixed(2)}
              </div>

              <div className="d-flex justify-content-end">
                {roId?.value &&
                  areaMangerId?.value &&
                  selectedInvoices.length > 0 && (
                    <button
                      disabled={
                        (totalMeasurement - totalDeduction).toFixed(2) < 0
                      }
                      className="shadow border-0 purple-combo cursor-pointer px-4 py-1 me-4"
                      onClick={(e) => {
                        handleSubmit();
                      }}
                    >
                      <BsPlus />
                      {t("create payment")}
                    </button>
                  )}
              </div>
              <div className="p-3">
                <div className="table-scroll my-2  ">
                  <Table className="text-body Roles">
                    <thead className="text-truncate">
                      <tr>
                        {roId?.value && areaMangerId?.value && (
                          <th>
                            {allComplaints.length > 0 && (
                              <Form.Check
                                onClick={(e) => {
                                  handleSelectAll(e.target.checked);
                                  calculateTotal(e.target.checked);
                                }}
                                checked={allComplaints.every((item) =>
                                  selectedInvoices.includes(item.complaint_id)
                                )}
                              ></Form.Check>
                            )}
                          </th>
                        )}
                        <th>{t("Bill number")}</th>
                        <th>{t("Bill Date")}</th>
                        <th style={{ minWidth: "80px" }}>
                          {t("measurement Amount")}
                        </th>
                        <th style={{ minWidth: "120px" }}>
                          {t("complaint number")}
                        </th>
                        <th>{t("Po number")}</th>
                        <th>{t("po date")}</th>
                        <th>{t("area manager")}</th>
                        <th>{t("regional office")}</th>
                        <th>{t("sales area")}</th>
                        <th>{t("pv number")}</th>
                        <th>{t("pv date")}</th>
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
                          {roId?.value && areaMangerId?.value && (
                            <td>
                              <Form.Check
                                checked={selectedInvoices.includes(
                                  data.complaint_id
                                )}
                                onClick={(e) => {
                                  handleSelect(data.complaint_id);
                                  calculateTotalForIndividual(
                                    e.target.checked,
                                    data.measurement_amount,
                                    data.deduction.deduction,
                                    data.manager_amount
                                  );
                                }}
                              ></Form.Check>
                            </td>
                          )}

                          <td>{data?.invoice_no ?? "--"}</td>
                          <td>{data?.invoice_date ?? "--"}</td>
                          <td>₹ {data?.measurement_amount ?? "--"}</td>
                          <td>{data?.complaint_unique_id ?? "--"}</td>
                          <td>{data?.po_number ?? "--"}</td>
                          <td>{data?.po_date ?? "--"}</td>
                          <td>
                            {data?.area_manager_detail?.user_name ?? "--"}
                          </td>
                          <td>{data?.ro_name ?? "--"}</td>
                          <td>{data?.sales_area_name ?? "--"}</td>
                          <td>{data?.payment_voucher_number ?? "--"}</td>
                          <td>{data?.payment_voucher_date ?? "--"}</td>
                        </tr>
                      ))}
                    </tbody>
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
              <ReactPagination
                pageSize={pageSize}
                prevClassName={
                  pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
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
                title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                  pageDetail?.pageEndResult || 0
                } of ${pageDetail?.total || 0}`}
                handlePageSizeChange={handlePageSizeChange}
                prevonClick={() => setPageNo(pageNo - 1)}
                nextonClick={() => setPageNo(pageNo + 1)}
              />
            </Tab>

            <Tab title={t("payment process")}>
              {activeTab == "3" && <PaymentProcess />}
            </Tab>

            <Tab title={t("done payments")}>
              {activeTab == "4" && <DonePayments />}
            </Tab>
            {/* <Tab title={t("Po Details")}>
              {activeTab == "5" && <PoDetailsInpaymentPaid />}
            </Tab> */}
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default AllPaidBills;
