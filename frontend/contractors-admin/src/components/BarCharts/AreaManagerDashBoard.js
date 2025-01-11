import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import ImageViewer from "../ImageViewer";
import Modaljs from "../../components/Modal";
import {
  getAllFinancialYearsForDashboard,
  getDetailsOfAreaManagerDetails,
  getDetailsOfComplaintInAreaManager,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import ReactPagination from "../ReactPagination";

export default function AreaManagerDashBoard() {
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const [modal, setModal] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();

  const fetchTransferDetails = async (year) => {
    const res = await getDetailsOfAreaManagerDetails(year);
    if (res.status) {
      setData(res.data);
    } else {
      setData([]);
    }
  };

  const handlePending = async (item) => {
    const complaintData = item?.complaint_ids?.pending.split(",").map(Number);
    const data = {
      complaint_ids: complaintData,
    };
    const res = await getDetailsOfComplaintInAreaManager(
      data,
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setDetails(res.data);
      setPageDetail(res.pageDetails);
      setModal(true);
    } else {
      toast.error(res.message);
      setPageDetail({});
      setDetails([]);
    }
  };
  const handleApproved = async (item) => {
    const complaintData = item?.complaint_ids?.approved.split(",").map(Number);
    const data = {
      complaint_ids: complaintData,
    };
    const res = await getDetailsOfComplaintInAreaManager(
      data,
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setDetails(res.data);
      setPageDetail(res.pageDetails);
      setModal(true);
    } else {
      toast.error(res.message);
      setPageDetail({});
      setDetails([]);
    }
  };
  const handleWorking = async (item) => {
    const complaintData = item?.complaint_ids?.working.split(",").map(Number);
    const data = {
      complaint_ids: complaintData,
    };
    const res = await getDetailsOfComplaintInAreaManager(
      data,
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setDetails(res.data);
      setPageDetail(res.pageDetails);
      setModal(true);
    } else {
      toast.error(res.message);
      setPageDetail({});
      setDetails([]);
    }
  };
  const handleRejected = async (item) => {
    const complaintData = item?.complaint_ids?.rejected.split(",").map(Number);
    const data = {
      complaint_ids: complaintData,
    };
    const res = await getDetailsOfComplaintInAreaManager(
      data,
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setDetails(res.data);
      setPageDetail(res.pageDetails);
      setModal(true);
    } else {
      toast.error(res.message);
      setPageDetail({});
      setDetails([]);
    }
  };
  const handleResolved = async (item) => {
    const complaintData = item?.complaint_ids?.resolved.split(",").map(Number);
    const data = {
      complaint_ids: complaintData,
    };
    const res = await getDetailsOfComplaintInAreaManager(
      data,
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setDetails(res.data);
      setPageDetail(res.pageDetails);
      setModal(true);
    } else {
      toast.error(res.message);
      setPageDetail({});
      setDetails([]);
    }
  };
  const handleHold = async (item) => {
    const complaintData = item?.complaint_ids?.hold.split(",").map(Number);

    const data = {
      complaint_ids: complaintData,
    };
    const res = await getDetailsOfComplaintInAreaManager(
      data,
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setDetails(res.data);
      setPageDetail(res.pageDetails);
      setModal(true);
    } else {
      toast.error(res.message);
      setPageDetail({});
      setDetails([]);
    }
  };

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYearsForDashboard();
    if (res.status) {
      const financialYears = res.data;
      setAllFinancialYear(financialYears);
      const defaultYear = financialYears[0];
      setYearValue({
        label: defaultYear.year_name,
        value: defaultYear.year_name,
      });

      fetchTransferDetails(defaultYear.year_name);
    } else {
      setAllFinancialYear([]);
    }
  };

  useEffect(() => {
    showFinancialYearApi();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <div>
      <Col md={12} className="my-2">
        <Row className="d-align mb-3 justify-content-end">
          <Col md={2}>
            <Select
              placeholder={"--select--"}
              menuPortalTarget={document.body}
              options={allFinancialYear?.map((data) => ({
                label: data?.year_name,
                value: data?.year_name,
              }))}
              value={yearValue}
              onChange={(e) => {
                if (e) {
                  setYearValue({ value: e?.value, label: e?.label });
                  fetchTransferDetails(e?.value);
                } else {
                  setYearValue(null);
                }
              }}
              isClearable
            />
          </Col>
        </Row>
        <div className="p-20 shadow rounded h-100">
          <div className="mt-2">
            <Table className="table-sm table Roles">
              <thead>
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("name")}</th>
                  <th>{t("Total Complaints")}</th>
                  <th>{t("Pending")}</th>
                  <th>{t("approved")}</th>
                  <th>{t("Working")}</th>
                  <th>{t("Rejected")}</th>
                  <th>{t("resolved")}</th>
                  <th>{t("hold")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 &&
                  data?.map((itm, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <ImageViewer
                            src={
                              itm?.image
                                ? `${process.env.REACT_APP_API_URL}${itm?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                            }
                          >
                            <img
                              width={30}
                              height={30}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                itm?.image
                                  ? `${process.env.REACT_APP_API_URL}${itm?.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                              }
                            />{" "}
                            {itm?.name}
                          </ImageViewer>
                        </td>
                        <td>{itm?.total_complaints}</td>
                        <td
                          className={`text-${
                            itm.status.pending == 0 ? "black" : "orange"
                          } cursor-${
                            itm.status.pending == 0 ? "auto" : "pointer"
                          }`}
                          onClick={() => handlePending(itm)}
                          aria-disabled={itm?.status.pending == 0}
                        >
                          {itm?.status.pending ?? "--"}
                        </td>
                        <td
                          className={`text-${
                            itm.status.approved == 0 ? "black" : "orange"
                          } cursor-${
                            itm.status.approved == 0 ? "auto" : "pointer"
                          }`}
                          onClick={() => handleApproved(itm)}
                          aria-disabled={itm?.status.approved == 0}
                        >
                          {itm?.status.approved ?? "--"}
                        </td>
                        <td
                          className={`text-${
                            itm.status.working == 0 ? "black" : "orange"
                          } cursor-${
                            itm.status.working == 0 ? "auto" : "pointer"
                          }`}
                          onClick={() => handleWorking(itm)}
                          aria-disabled={itm?.status.working == 0}
                        >
                          {itm?.status.working ?? "--"}
                        </td>
                        <td
                          className={`text-${
                            itm.status.rejected == 0 ? "black" : "orange"
                          } cursor-${
                            itm.status.rejected == 0 ? "auto" : "pointer"
                          }`}
                          onClick={() => handleRejected(itm)}
                          aria-disabled={itm?.status.rejected == 0}
                        >
                          {itm?.status.rejected ?? "--"}
                        </td>
                        <td
                          className={`text-${
                            itm.status.resolved == 0 ? "black" : "orange"
                          } cursor-${
                            itm.status.resolved == 0 ? "auto" : "pointer"
                          }`}
                          onClick={() => handleResolved(itm)}
                          aria-disabled={itm?.status.resolved == 0}
                        >
                          {itm?.status.resolved ?? "--"}
                        </td>
                        <td
                          className={`text-${
                            itm.status.hold == 0 ? "black" : "orange"
                          } cursor-${
                            itm.status.hold == 0 ? "auto" : "pointer"
                          }`}
                          onClick={() => handleHold(itm)}
                          aria-disabled={itm?.status.hold == 0}
                        >
                          {itm?.status.hold ?? "--"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      </Col>
      <Modaljs
        open={modal}
        size={"lg"}
        closebtn={"Cancel"}
        Savebtn={"ok"}
        close={() => setModal(false)}
        title={t("Complaint Details")}
      >
        <Row className="g-2 align-items-center">
          <div>
            {/* <span className="fw-bold mx-2 text-danger"> All Invoices</span> */}

            <div className="mt-2">
              <Table className="table-sm table Roles">
                <thead>
                  <tr>
                    <th>{t("Sr No.")}</th>
                    <th>{t("Complaint No")}</th>
                    <th>{t("Complaint Type")}</th>
                    <th>{t("Outlet")}</th>
                    <th>{t("Regional Office Name")}</th>
                    <th>{t("Sales Area Name")}</th>
                    <th>{t("Order By")}</th>
                    <th>{t("Company Name")}</th>
                  </tr>
                </thead>
                <tbody>
                  {details?.length > 0 &&
                    details?.map((data, idx) => {
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{data.complaint_unique_id}</td>
                          <td>{data.complaint_type}</td>
                          <td>{data?.outlet?.map((itm) => itm.outlet_name)}</td>
                          <td>
                            {data?.regionalOffice?.map(
                              (itm) => itm.regional_office_name
                            )}
                          </td>
                          <td>
                            {data?.saleAreaDetails?.map(
                              (itm) => itm.sales_area_name
                            )}
                          </td>
                          <td>{data.order_by_details}</td>
                          <td>{data.energy_company_name}</td>
                        </tr>
                      );
                    })}
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
                            ? details.length - 1 < pageSize
                              ? "danger-combo-disable pe-none"
                              : "success-combo"
                            : details.length < pageSize
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
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>
        </Row>
      </Modaljs>
    </div>
  );
}
