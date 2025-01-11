import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { BsArrowLeftRight, BsPlus, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import {
  getAllPendingTransferFundRequest,
  postRejectFundRequest,
} from "../../../services/contractorApi";
import ActionButton from "../../../components/ActionButton";
import "react-best-tabs/dist/index.css";
import { Link } from "react-router-dom";
import ImageViewer from "../../../components/ImageViewer";
import TooltipComponent from "../../../components/TooltipComponent";
import { getAllRescheduledTransfer } from "../../../services/contractoApi2";
import { useTranslation } from "react-i18next";

export default function RescheduledTransfer() {
  const [pendingFundTransfer, setPendingFundTransfer] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const getRescheduledTransferFund = async () => {
    const res = await getAllRescheduledTransfer(searchTerm, pageSize, pageNo);
    if (res.status) {
      setPendingFundTransfer(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setPendingFundTransfer([]);
      setPageDetail({});
    }
    setLoading(false);
  };

  useEffect(() => {
    getRescheduledTransferFund();
  }, [searchTerm, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );
  return (
    <div>
      <span className="d-align mt-3 me-3 justify-content-end gap-2">
        <span className="position-relative">
          <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
          <Form.Control
            type="text"
            placeholder={t("Search")}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="me-2"
            aria-label="Search"
          />
        </span>
      </span>
      <div className="p-3">
        <div className="table-scroll">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Unique Id")}</th>
                <th>{t("Request For")}</th>
                <th>{t("Request Date")}</th>
                <th>{t("Request Amount")}</th>
                <th>{t("Total Approved Amount")}</th>
                <th>{t("Status")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                </tr>
              ) : pendingFundTransfer.length > 0 ? (
                pendingFundTransfer.map((data, id1) => (
                  <tr key={id1}>
                    <td>{data?.unique_id}</td>
                    <td>
                      <ImageViewer
                        src={
                          data?.request_for_image
                            ? `${process.env.REACT_APP_API_URL}${data?.request_for_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <span className="d-flex align-items-center gap-2">
                          <img
                            width={30}
                            height={30}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              data?.request_for_image
                                ? `${process.env.REACT_APP_API_URL}${data?.request_for_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                          <span className="d-grid">
                            {data?.request_by}{" "}
                            <span>
                              {data?.request_by_employee_id
                                ? data?.request_by_employee_id
                                : null}
                            </span>
                          </span>
                        </span>
                      </ImageViewer>
                    </td>
                    <td>{data.request_date}</td>
                    <td
                      className={`fw-bolder text-${
                        data.total_request_amount > 0 ? "green" : "danger"
                      }`}
                    >
                      {data.total_request_amount > 0
                        ? `${"₹"} ${data.total_request_amount}`
                        : "0"}
                    </td>
                    <td
                      className={`fw-bolder text-${
                        data.total_approved_amount > 0 ? "green" : "danger"
                      }`}
                    >
                      {data.total_approved_amount > 0
                        ? `${"₹"} ${data.total_approved_amount}`
                        : "0"}
                    </td>

                    <td
                      className={`text-${
                        data?.status === "0"
                          ? "warning"
                          : data?.status === "1"
                          ? "green"
                          : data?.status === "2"
                          ? "danger"
                          : data?.status === "3"
                          ? "orange"
                          : "success"
                      }`}
                    >
                      {data?.status ?? "--"}
                    </td>
                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                        eyelink={`/fund-transfer/create-fund-transfer/${data.id}?type=view`}
                        custom={
                          data?.active ? (
                            <>
                              <div className={`vr hr-shadow`} />
                              <TooltipComponent
                                align={"left"}
                                title={"Transfer"}
                              >
                                <Link
                                  to={`/fund-transfer/create-fund-transfer/${data.id}?type=transfer`}
                                >
                                  <BsArrowLeftRight
                                    className={`social-btn danger-combo`}
                                  />
                                </Link>
                              </TooltipComponent>
                            </>
                          ) : null
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
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
                        ? pendingFundTransfer.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : pendingFundTransfer.length < pageSize
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
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    </div>
  );
}
