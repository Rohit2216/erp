import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ApproveOrReeligibleRetentions,
  getAllProcessPaymentForRO,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import ConfirmAlert from "../../components/ConfirmAlert";

const DonePaymentsInRO = () => {
  const { t } = useTranslation();
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [openConfirmAndId, setOpenConfirmAndId] = useState("");

  const navigate = useNavigate();

  const fetchAllInvoices = async () => {
    const status = "2";
    const res = await getAllProcessPaymentForRO(
      status,
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

  useEffect(() => {
    fetchAllInvoices();
  }, [refresh]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };
  return (
    <>
      <div className="p-3">
        <div className="table-scroll my-2  ">
          <Table className="text-body Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("s.no.")}</th>
                <th className="text-wrap">{t("payment unique id")}</th>
                <th>{t("ro name")}</th>
                <th>{t("po number")}</th>
                <th>{t("amount")}</th>
                <th>{t("received amount")}</th>
                <th>{t("Payment Mode")}</th>
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
                  <td>{data?.ro_name ?? "--"}</td>
                  <td>{data?.po_details.po_number ?? "--"}</td>
                  <td className="text-green">₹ {data?.amount ?? "--"}</td>
                  <td>₹ {data?.paid_amount ?? "--"}</td>
                  <td>{data?.payment_mode ?? "--"}</td>
                  <td>
                    <ActionButton
                      hideDelete={"d-none"}
                      hideEdit={"d-none"}
                      eyeOnclick={() =>
                        navigate(`/regional-office/view`, {
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
};

export default DonePaymentsInRO;
