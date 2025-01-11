import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  discardfinalInvoices,
  getAllPaymentRecievedListing,
  getAllPVNumber,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { Col, Row, Table } from "react-bootstrap";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import ConfirmAlert from "../../../components/ConfirmAlert";
import Select from "react-select";

export default function PaymentRecievedDone() {
  const { t } = useTranslation();
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardDetails, setDiscardDetails] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [allPvNumber, setAllPvNumber] = useState([]);
  const [pv_number, setPv_number] = useState("");

  const navigate = useNavigate();

  const fetchAllInvoices = async () => {
    const status = "2";
    const res = await getAllPaymentRecievedListing(
      status,
      pageSize,
      pageNo,
      search,
      pv_number
    );

    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };

  const fetchAllPVNumber = async () => {
    const status = "2";
    const res = await getAllPVNumber(status);

    if (res.status) {
      setAllPvNumber(res.data);
    } else {
      setAllPvNumber([]);
    }
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
    fetchAllPVNumber();
  }, [refresh, pv_number]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };
  return (
    <>
      <Row className="p-2">
        <Col md={3}>
          <Select
            placeholder={t("select PV Number")}
            menuPortalTarget={document.body}
            options={allPvNumber.map((data) => ({
              label: data.pv_number,
              value: data.pv_number,
            }))}
            onChange={(e) => {
              setPv_number(e ? e.value : "");
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
                <th>{t("Payment Unique id")}</th>
                <th>{t("Invoice Number")}</th>
                <th style={{ minWidth: "80px" }}>{t("Invoice Date")}</th>
                <th style={{ minWidth: "120px" }}>{t("Pv Number")}</th>
                <th>{t("Recieved amount")}</th>
                <th>{t("status")}</th>
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
                  <td>{data?.payment_unique_id ?? "--"}</td>
                  <td>{data?.invoice_number ?? "--"}</td>
                  <td>{data?.invoice_date.split("T")[0] ?? "--"}</td>
                  <td>{data?.pv_number ?? "--"}</td>
                  <td>{data?.amount_received ?? "--"}</td>
                  <td>{"done"}</td>

                  <td>
                    <ActionButton
                      hideDelete={"d-none"}
                      eyeOnclick={() =>
                        navigate(`/payments/view-recieved-payments`, {
                          state: {
                            id: data?.id,
                          },
                        })
                      }
                      editOnclick={() => {
                        navigate(`/payments/create`, {
                          state: {
                            selectedInvoices: [data.id],
                            type: "update",
                          },
                        });
                      }}
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
  );
}
