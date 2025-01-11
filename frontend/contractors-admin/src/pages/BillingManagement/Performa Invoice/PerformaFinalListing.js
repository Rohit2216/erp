import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import "react-best-tabs/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactPagination from "../../../components/ReactPagination";
import ActionButton from "../../../components/ActionButton";
import Select from "react-select";
import { FcCancel } from "react-icons/fc";
import {
  discardPerformaById,
  getAllBillNumber,
  getAllPerformaInvoice,
  getAllPoListInvoice,
  getAllRoListInvoice,
} from "../../../services/contractorApi";
import TooltipComponent from "../../../components/TooltipComponent";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { toast } from "react-toastify";

const PerformaFinalListing = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [poId, setPoId] = useState({});
  const [allPiNumber, setAllPiNumber] = useState([]);
  const [regionalOfficceId, setRegionalOfficeId] = useState({});
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [allPo, setAllPo] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [complaint_id, setComplaint_id] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const [idToDiscard, setIdToDiscard] = useState("");

  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    let status = 2;
    const res = await getAllPerformaInvoice(
      poId?.id,
      regionalOfficceId.id,
      complaint_id,
      pageSize,
      pageNo,
      search,
      status
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
    const res = await discardPerformaById(idToDiscard);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard(false);
    setIdToDiscard("");
  };
  const fetchAllPo = async () => {
    const status = 2;
    const res = await getAllPoListInvoice(status);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async (poId = "") => {
    const status = 2;
    const res = await getAllRoListInvoice(status, poId);
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllPINumber = async (ro_id) => {
    const status = 2;
    const res = await getAllBillNumber(status, ro_id, poId.id);

    if (res.status) {
      setAllPiNumber(res.data);
    } else {
      setAllPiNumber([]);
    }
  };

  useEffect(() => {
    fetchAllPo();
    fetchAllRegionalOffice();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [pageNo, pageSize, poId, regionalOfficceId, complaint_id, refresh]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <div className="p-3">
      <Row>
        <Col md={3}>
          <Select
            placeholder={t("select po")}
            menuPortalTarget={document.body}
            options={allPo?.map((user) => ({
              label: user.po_number,
              value: user.id,
            }))}
            onChange={(e) => {
              if (e) {
                setPoId({ id: e?.value, name: e?.label });
                fetchAllRegionalOffice(e?.value);
                setComplaint_id(null);
              } else {
                setPoId({});
              }
            }}
            isClearable
          />
        </Col>
        <Col md={3}>
          <Select
            placeholder={t("select Ro")}
            menuPortalTarget={document.body}
            options={allRegionalOffice?.map((user) => ({
              label: user.regional_office_name,
              value: user.ro_id,
            }))}
            onChange={(e) => {
              if (e) {
                setRegionalOfficeId({ id: e?.value, name: e?.label });
                fetchAllPINumber(e?.value);
              } else setRegionalOfficeId({});
            }}
            isClearable
          />
        </Col>
        <Col md={3}>
          <Select
            placeholder={t("Select bill number")}
            menuPortalTarget={document.body}
            options={allPiNumber?.map((user) => ({
              label: user.bill_no,
              value: user.bill_no,
            }))}
            onChange={(e) => {
              setComplaint_id(e ? e?.value : null);
            }}
            isClearable
          />
        </Col>
      </Row>
      <div className="table-scroll my-3">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              <th>{t("PI NUMBER")}</th>
              <th>{t("PI DATE")}</th>
              <th>{t("FINANCIAL YEAR")}</th>
              <th>{t("BILLING REGIONAL OFFICE")}</th>
              <th>{t("Outlet Name")}</th>
              <th style={{ width: "fit-content" }}>{t("Complaint Id")}</th>
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
                <td>
                  {data.outletDetails.length > 0
                    ? data?.outletDetails?.map((item, idx) => (
                        <li> {item?.outlet_name ?? "--"}</li>
                      ))
                    : "--"}
                </td>
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
                      navigate(`/view-performa-invoice`, {
                        state: {
                          id: data?.id,
                        },
                      })
                    }
                    editOnclick={() => {
                      navigate(`/PerformaInvoice/CreatePerformaInvoice/edit`, {
                        state: {
                          regionalOfficceId: {
                            name: data?.billing_to_ro_office.ro_name,
                            id: data?.billing_to_ro_office.ro_id,
                          },
                          measurements: [data.id],

                          poId: {
                            id: data?.po_id,
                            name: data?.po_number,
                          },

                          editFrom: "final",
                        },
                      });
                    }}
                    custom={
                      <TooltipComponent align="left" title={"discard"}>
                        <Button
                          className={`view-btn`}
                          variant="light"
                          onClick={() => {
                            setShowDiscard(true);
                            setIdToDiscard(data.id);
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
  );
};

export default PerformaFinalListing;
