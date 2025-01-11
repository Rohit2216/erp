import React, { useEffect, useState } from "react";
import { Col, Table, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ActionButton from "../../../components/ActionButton";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import {
  discardfinalInvoices,
  getAllFinalInvoices,
} from "../../../services/contractorApi";
import CardComponent from "../../../components/CardComponent";
import { BsPlus } from "react-icons/bs";

export default function Payments() {
  const { t } = useTranslation();

  const [allComplaints, setAllComplaints] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardDetails, setDiscardDetails] = useState("");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const fetchAllInvoices = async () => {
    const res = await getAllFinalInvoices(pageSize, pageNo, search);

    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };

  const handleSelect = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((item) => item !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const handleSelectAll = (check) => {
    if (check) {
      const allItemId = allComplaints.map((item) => item.id);
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
  }, [refresh]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          title={t("payments")}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <div className="d-flex justify-content-end ">
            {selectedInvoices.length > 0 && (
              <button
                className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                onClick={() =>
                  navigate(`/payments/create`, {
                    state: {
                      selectedInvoices: selectedInvoices,
                    },
                  })
                }
              >
                <BsPlus />
                {t("create Payment")}
              </button>
            )}
          </div>

          <div className="table-scroll my-2  ">
            <Table className="text-body Roles">
              <thead className="text-truncate">
                <tr>
                  {allComplaints.length > 0 && (
                    <th>
                      <Form.Check
                        onClick={(e) => handleSelectAll(e.target.checked)}
                        checked={allComplaints.every((item) =>
                          selectedInvoices.includes(item.id)
                        )}
                      ></Form.Check>
                    </th>
                  )}
                  <th>{t("Invoice Number")}</th>
                  <th style={{ minWidth: "80px" }}>{t("Invoice Date")}</th>
                  <th style={{ minWidth: "120px" }}>{t("PI NUMBER")}</th>
                  <th>{t("FINANCIAL YEAR")}</th>
                  <th>{t("BILLING REGIONAL OFFICE")}</th>
                  <th>{t("billing from")}</th>
                  <th>{t("billing to")}</th>

                  <th style={{ minWidth: "150px" }}>{t("Complaint Id")}</th>
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
                    <td>
                      <Form.Check
                        checked={selectedInvoices.includes(data.id)}
                        onClick={() => handleSelect(data.id)}
                      ></Form.Check>
                    </td>
                    <td>{data?.bill_no ?? "--"}</td>
                    <td>{data?.invoice_date ?? "--"}</td>
                    <td>
                      {data?.pi_bill.map((pi) => (
                        <li>{pi}</li>
                      ))}
                    </td>

                    <td>{data?.financial_year ?? "--"}</td>
                    <td>{data?.billing_to_ro_office?.ro_name ?? "--"}</td>
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
                          navigate(`/payments/view-invoice`, {
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
                    title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                      pageDetail?.pageEndResult || 0
                    } of ${pageDetail?.total || 0}`}
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
        </CardComponent>
      </Col>
    </>
  );
}
