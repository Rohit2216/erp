import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  getAllMergeInvoice,
  getAllMergedToPiListing,
} from "../../../services/contractorApi";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";

export default function DiscardMergeInvoices() {
  const { t } = useTranslation();
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchAllMergePI = async () => {
    let status = 2;
    const res = await getAllMergeInvoice(status, pageSize, pageNo, search);

    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    fetchAllMergePI();
  }, []);

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
                <th>{t("Invoice NUMBER")}</th>
                <th>{t("Invoice DATE")}</th>
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
                  <td>{data?.created_at ?? "--"}</td>
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
                        navigate(`/view-merge-invoice`, {
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
        </div>
      </div>
    </>
  );
}
