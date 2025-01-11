import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcCancel } from "react-icons/fc";
import TooltipComponent from "../../../components/TooltipComponent";
import ActionButton from "../../../components/ActionButton";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import {
  discardfinalInvoices,
  getAllFinalInvoicesListing,
} from "../../../services/contractorApi";

export default function AllFinalInvoices() {
  const { t } = useTranslation();

  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardDetails, setDiscardDetails] = useState("");
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  const fetchAllMergePI = async () => {
    const status = 1;
    const res = await getAllFinalInvoicesListing(
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
    fetchAllMergePI();
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
                <th>{t("Invoice Number")}</th>
                <th style={{ minWidth: "80px" }}>{t("Invoice Date")}</th>
                <th style={{ minWidth: "120px" }}>{t("PI NUMBER")}</th>
                <th>{t("FINANCIAL YEAR")}</th>
                <th>{t("BILLING REGIONAL OFFICE")}</th>
                <th>{t("Billing From")}</th>
                <th>{t("Billing To")}</th>

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
                        navigate(`/view-invoice`, {
                          state: {
                            id: data?.id,
                          },
                        })
                      }
                      // hideEdit={"d-none"}
                      editOnclick={() => {
                        navigate(`/Invoice/CreateInvoice/${data.id}`);
                      }}
                      custom={
                        <TooltipComponent align="left" title={t("discard")}>
                          <Button
                            className={`view-btn`}
                            variant="light"
                            onClick={() => {
                              setShowDiscard(true);
                              setDiscardDetails(data);
                            }}
                          >
                            <FcCancel className={`social-btn red-combo`} />
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
