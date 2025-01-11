import React, { useEffect, useState } from "react";
import { Col, Table, Row, Form } from "react-bootstrap";
import { BsEyeFill, BsPlus, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import Modaljs from "../../components/Modal";
import ActionButton from "../../components/ActionButton";
import {
  deletePurchaseOrderById,
  deleteSecurityDepositById,
  getAllPurchaseOrder,
  getSinglePurchaseOrderById,
  getSingleSecurityDepositById,
} from "../../services/contractorApi";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const SecurityDeposit = () => {
  const [securityDeposit, setSecurityDeposit] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [singleData, setSingleData] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchSecurityDepositData = async () => {
    const po_status = 1;
    const status = "";
    const res = await getAllPurchaseOrder(
      search,
      pageSize,
      pageNo,
      status,
      po_status
    );

    if (res.status) {
      setSecurityDeposit(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setSecurityDeposit([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  // const handleDetails = async (id) => {
  //   const res = await getSinglePurchaseOrderById(id);
  //   if (res.status) {
  //     setSingleData(res.data);
  //   } else {
  //     setSingleData({});
  //   }
  //   setViewDetails(true);
  // };

  const handleDelete = async () => {
    const res = await deletePurchaseOrderById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setSecurityDeposit((prev) => prev.filter((itm) => itm.id !== idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchSecurityDepositData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Security Deposit · CMS Electricals</title>
      </Helmet>
      <span className="d-align mt-3 me-3 justify-content-end gap-2">
        <span className="position-relative">
          <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
          <Form.Control
            type="text"
            placeholder={t("Search")}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="me-2"
            aria-label="Search"
          />
        </span>
        {/* <Link
          to={`/PurchaseOrder/create-security-deposit/new`}
          variant="light"
          className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
        >
          <BsPlus /> {t("Create")}
        </Link> */}
      </span>
      <div className="overflow-auto p-3 mb-2">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              <th>{t("Sr No.")}</th>
              <th>{t("po number")}</th>
              <th>{t("Tender Date")}</th>
              <th>{t("Tender Number")}</th>
              <th>{t("security deposit date")}</th>
              <th>{t("security deposit amount")}</th>
              <th>{t("regional office name")}</th>
              <th>{t("Status")}</th>
              <th>{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <td colSpan={10}>
                <img
                  className="p-3"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                  alt={t("Loading")}
                />
              </td>
            ) : securityDeposit.length > 0 ? (
              <>
                {securityDeposit.map((data, id1) => (
                  <tr key={id1}>
                    <td>{serialNumber[id1]}</td>
                    <td>{data.po_number}</td>
                    <td>{data.tender_date}</td>
                    <td>{data.tender_number}</td>
                    <td>{data.security_deposit_date}</td>
                    <td>{data.security_deposit_amount}</td>
                    <td>{data.regional_office_name}</td>
                    <td className={`text-${"green"}`}>Deposit</td>

                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                        eyeOnclick={() =>
                          navigate(`/PurchaseOrder/security-deposit/view`, {
                            state: {
                              id: data.id,
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <td colSpan={10}>
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </td>
            )}
          </tbody>
        </Table>
      </div>
      <ReactPagination
        pageSize={pageSize}
        prevClassName={
          pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
        }
        nextClassName={
          pageSize == pageDetail?.total
            ? securityDeposit.length - 1 < pageSize
              ? "danger-combo-disable pe-none"
              : "success-combo"
            : securityDeposit.length < pageSize
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

      {/* <Modaljs
        open={viewDetails}
        hideFooter={true}
        size={"md"}
        close={() => setViewDetails(false)}
        title={
          <>
            <BsEyeFill className="text-green" /> {t("Security Deposit Details")}
          </>
        }
      >
        <Row className="g-3 py-1">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {singleData?.date && (
                      <tr>
                        <th>{t("Date")} :</th>
                        <td>{singleData?.date}</td>
                      </tr>
                    )}
                    {singleData?.po_number && (
                      <tr>
                        <th>{t("po number")} :</th>
                        <td>{singleData?.po_number}</td>
                      </tr>
                    )}
                    {singleData?.amount && (
                      <tr>
                        <th>{t("Amount")} :</th>
                        <td>{singleData?.amount}</td>
                      </tr>
                    )}
                    {singleData?.method && (
                      <tr>
                        <th>{t("method")} :</th>
                        <td>{singleData?.method}</td>
                      </tr>
                    )}
                    {singleData?.security_deposit_status && (
                      <tr>
                        <th>{t("security deposit status")} :</th>
                        <td>{singleData?.security_deposit_status}</td>
                      </tr>
                    )}
                    {singleData?.payment_status && (
                      <tr>
                        <th>{t("payment status")} :</th>
                        <td
                          className={`text-${
                            (singleData.payment_status_id === "1" &&
                              "orange") ||
                            (singleData.payment_status_id === "2" && "green") ||
                            (singleData.payment_status_id === "3" && "danger")
                          }`}
                        >
                          {singleData?.payment_status}
                        </td>
                      </tr>
                    )}
                    {singleData?.details && (
                      <tr>
                        <th>{t("details")} :</th>
                        <td>{singleData?.details}</td>
                      </tr>
                    )}
                    {singleData?.created_by && (
                      <tr>
                        <th>{t("created by")} :</th>
                        <td>{singleData?.created_by}</td>
                      </tr>
                    )}
                    {singleData?.created_at && (
                      <tr>
                        <th>{t("created at")} :</th>
                        <td>{singleData?.created_at}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </Modaljs> */}
    </>
  );
};

export default SecurityDeposit;
