import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import ReactPagination from "../../components/ReactPagination";
import {
  getTransferFund,
  getTransferStock,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const AllTransferedStock = () => {
  const [transferedFund, setTransferedFund] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchTransferedStockData = async () => {
    const res = await getTransferStock(pageSize, pageNo);
    if (res.status) {
      setTransferedFund(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setTransferedFund([]);
      setPageDetail({});
    }
    setLoading(false);
  };

  const results = !searchTerm
    ? transferedFund
    : transferedFund.filter(
        (itm) =>
          itm?.request_by
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          itm?.request_by_employee_id
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase())
      );

  useEffect(() => {
    fetchTransferedStockData();
  }, [pageNo, pageSize]);

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
        <title>Transfered Stock · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
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
                  <th>{t("Request for")}</th>
                  <th>{t("Request Date")}</th>
                  <th>{t("Request Quantity")}</th>
                  <th>{t("Total Approved Quantity")}</th>
                  <th>{t("Transfered Quantity")}</th>
                  <th>{t("Bill No")}.</th>
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
                ) : results.length > 0 ? (
                  results.map((data, id1) => (
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
                              {data?.request_for}{" "}
                              <span>
                                {data?.request_for_employee_id
                                  ? data?.request_for_employee_id
                                  : null}
                              </span>
                            </span>
                          </span>
                        </ImageViewer>
                      </td>
                      <td>{data.request_date}</td>
                      <td className={`fw-bolder text-danger`}>
                        {data?.total_request_qty}
                      </td>
                      <td className={`fw-bolder text-green`}>
                        {data?.total_approved_qty}
                      </td>
                      <td className={`fw-bolder text-green`}>
                        {data?.transfer_stock_quantity}
                      </td>

                      <td>{data?.bill_number ?? "pending"}</td>
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
                        {data?.status}
                      </td>
                      <td>
                        <ActionButton
                          hideDelete={"d-none"}
                          editlink={`/stock-transfer/create-stock-transfer/${data.id}?type=update`}
                          eyelink={`/stock-request/create-stock-request/${data.id}?type=view`}
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
                          ? transferedFund.length - 1 < pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                          : transferedFund.length < pageSize
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
      </Col>
    </>
  );
};

export default AllTransferedStock;
