import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ApproveOrReeligibleRetentions,
  getAllEligibleAndDoneRetentions,
  getAllPONumber,
  getAllProcessPaymentPaid,
  getAllPVNumber,
  getAllRetentionIdListing,
  getAllRoListing,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { Button, Col, Row, Table } from "react-bootstrap";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import ConfirmAlert from "../../../components/ConfirmAlert";
import Select from "react-select";
import TooltipComponent from "../../../components/TooltipComponent";
import { HiChatBubbleBottomCenter } from "react-icons/hi2";

export default function DonePayments() {
  const { t } = useTranslation();
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [openConfirmAndId, setOpenConfirmAndId] = useState("");
  const [ro_number, setRo_number] = useState("");
  const [po_number, setPo_number] = useState("");
  const [allRo, setAllRo] = useState([]);
  const [allPo, setAllPo] = useState([]);
  const [retention_id, setRetention_id] = useState("");
  const [allRetention, setAllRetention] = useState([]);

  const navigate = useNavigate();

  const fetchAllInvoices = async () => {
    const status = "2";
    const res = await getAllProcessPaymentPaid(
      status,
      pageSize,
      pageNo,
      search,
      po_number,
      ro_number,
      retention_id
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
    const status = "3";
    const res = await getAllRoListing(status, po_number);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };
  const fetchAllRetention = async () => {
    const status = "3";
    const res = await getAllRetentionIdListing(status, ro_number);
    if (res.status) {
      setAllRetention(res.data);
    } else {
      setAllRetention([]);
    }
  };
  const handleApproveReject = async () => {
    const sData = { id: openConfirmAndId, status: "1" };
    const res = await ApproveOrReeligibleRetentions(sData);
    if (res.status) {
      toast.success(res.message);
      setAllComplaints((prev) =>
        prev.filter((itm) => itm.id !== openConfirmAndId)
      );
      setPageDetail({
        ...pageDetail,
        total: +pageDetail.total - 1,
        pageEndResult: pageDetail.pageEndResult - 1,
      });
    } else {
      toast.error(res.message);
    }
    setOpenConfirmAndId("");
  };

  const fetchAllPoNumber = async () => {
    const status = "3";
    const res = await getAllPONumber(status);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
    fetchAllRo();
    fetchAllPoNumber();
    fetchAllRetention();
  }, [refresh, po_number, ro_number, retention_id]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };
  return (
    <>
      {/* <Row className="p-2">
        <Col md={3}>
          <Select
            placeholder={t("select po")}
            menuPortalTarget={document.body}
            isDisabled={ro_number}
            options={allPo.map((data) => ({
              label: data.po_number,
              value: data.id,
            }))}
            onChange={(e) => {
              setPo_number(e ? e.value : "");
            }}
            isClearable
          />
        </Col>
        <Col md={3}>
          <Select
            placeholder={t("select ro")}
            menuPortalTarget={document.body}
            isDisabled={retention_id}
            options={allRo.map((data) => ({
              label: data.regional_office_name,
              value: data.id,
            }))}
            onChange={(e) => {
              setRo_number(e ? e.value : "");
            }}
            isClearable
          />
        </Col>
      </Row> */}
      <div className="p-3">
        <div className="table-scroll my-2  ">
          <Table className="text-body Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("s.no.")}</th>
                <th className="text-wrap">{t("payment unique id")}</th>
                <th>{t("manager name")}</th>
                <th>{t("ro name ")}</th>
                <th>{t("amount")}</th>
                <th>{t("otp")}</th>
                <th>{t("recieved amount")}</th>
                <th>{t("payment mode")}</th>
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

              {allComplaints?.map((data, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{data?.unique_id ?? "--"}</td>
                  <td>{data?.manager_name ?? "--"}</td>
                  <td>{data?.ro_name ?? "--"}</td>
                  <td className="text-green">₹ {data?.amount ?? "--"}</td>
                  <td>{data?.otp ?? "--"}</td>
                  <td>₹ {data?.paid_amount ?? "--"}</td>
                  <td>{data?.payment_mode ?? "--"}</td>
                  <td>
                    <ActionButton
                      hideDelete={"d-none"}
                      hideEdit={"d-none"}
                      eyeOnclick={() =>
                        navigate(`/payment-paid/view`, {
                          state: {
                            id: data?.id,
                          },
                        })
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
            deleteFunction={handleApproveReject}
            hide={setOpenConfirmAndId}
            show={openConfirmAndId}
            title={"Confirm Re-eligible"}
            description={"Are you sure you want to convert this!!"}
          />
        </div>
      </div>
    </>
  );
}
