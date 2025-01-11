import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  getAllEligibleAndDoneRetentions,
  getAllPVNumber,
  approveEligibleRetention,
  getAllRoListing,
  getAllPONumber,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { Col, Row, Table, Form } from "react-bootstrap";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import Select from "react-select";
import { BsPlus } from "react-icons/bs";

export default function AllEligibleRetentions() {
  const { t } = useTranslation();
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [ro_number, setRo_number] = useState("");
  const [po_number, setPo_number] = useState("");
  const [allRo, setAllRo] = useState([]);
  const [allPo, setAllPo] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  const navigate = useNavigate();

  const fetchAllInvoices = async () => {
    const status = "1";
    const res = await getAllEligibleAndDoneRetentions(
      status,
      pageSize,
      pageNo,
      search,
      po_number,
      ro_number
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
    const status = "1";
    const res = await getAllRoListing(status, po_number);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };

  const fetchAllPoNumber = async () => {
    const status = "1";
    const res = await getAllPONumber(status);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
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

  const handleApproveRetention = async () => {
    const sData = { ids: selectedInvoices };
    const res = await approveEligibleRetention(sData);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
      setSelectedInvoices([]);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
    fetchAllRo();
    getAllPONumber();
    fetchAllPoNumber();
  }, [refresh, ro_number, po_number]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };
  return (
    <>
      <Row className="p-2">
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
      </Row>

      <div className="d-flex justify-content-end ">
        {selectedInvoices.length > 0 && (
          <button
            className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
            onClick={() => handleApproveRetention()}
          >
            <BsPlus />
            approve Retention
          </button>
        )}
      </div>
      <div className="p-3">
        <div className="table-scroll my-2 ">
          <Table className="text-body Roles">
            <thead className="text-truncate">
              <tr>
                {allComplaints.length > 0 && po_number && ro_number && (
                  <th>
                    <Form.Check
                      onClick={(e) => handleSelectAll(e.target.checked)}
                      checked={allComplaints.every((item) =>
                        selectedInvoices.includes(item.id)
                      )}
                    ></Form.Check>
                  </th>
                )}
                <th>{t("s.no.")}</th>
                <th>{t("Bill number")}</th>
                <th style={{ minWidth: "80px" }}>{t("Bill Date")}</th>
                <th style={{ minWidth: "140px" }}>{t("Outlet Name")}</th>
                <th style={{ minWidth: "120px" }}>{t("outlet code")}</th>
                <th style={{ minWidth: "120px" }}>{t("sales area")}</th>
                <th>{t("ro")}</th>
                <th style={{ minWidth: "150px" }}>{t("complain type")}</th>
                <th style={{ minWidth: "150px" }}>{t("complain code")}</th>
                <th>{t("po number")}</th>
                <th>{t("callup number")}</th>
                <th>{t("voucher number")}</th>
                <th>{t("voucher date")}</th>
                <th>{t("voucher amount")}</th>
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
                  {po_number && ro_number && (
                    <td>
                      <Form.Check
                        checked={selectedInvoices.includes(data.id)}
                        onClick={() => handleSelect(data.id)}
                      ></Form.Check>
                    </td>
                  )}
                  <td>{idx + 1}</td>
                  <td>{data?.invoice_no ?? "--"}</td>
                  <td>{data?.invoice_date ?? "--"}</td>
                  <td>
                    {data?.outletDetails.map((data) => (
                      <li>{data.outlet_name}</li>
                    ))}
                  </td>
                  <td>
                    {data?.outletDetails.map((data) => (
                      <li>{data.outlet_unique_id}</li>
                    ))}
                  </td>
                  <td>
                    {data?.salesAreaDetails.map((data) => (
                      <li>{data.sales_area_name}</li>
                    ))}
                  </td>
                  <td>{data?.ro_name ?? "--"}</td>
                  <td>
                    {data?.complaintDetails.map((data) => (
                      <li>{data.complaint_type_name}</li>
                    ))}
                  </td>

                  <td>
                    {data?.complaintDetails.map((data) => (
                      <li>{data.complaint_id}</li>
                    ))}
                  </td>
                  <td>{data?.po_number ?? "--"}</td>
                  <td>{data?.callup_number ?? "--"}</td>
                  <td>{data?.pv_number ?? "--"}</td>
                  <td>{data?.pv_date ?? "--"}</td>
                  <td>₹{data?.pv_amount ?? "--"}</td>

                  <td>
                    <ActionButton
                      hideDelete={"d-none"}
                      editOnclick={() => {
                        navigate(`/create-retention`, {
                          state: {
                            selectedInvoices: [data.id],
                          },
                        });
                      }}
                      eyeOnclick={() =>
                        navigate(`/view-retention-money`, {
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
        </div>
      </div>
    </>
  );
}
