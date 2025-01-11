import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import ReactPagination from "../../components/ReactPagination";
import {
  getAllTransferFundRequest,
  getAllTransferStockRequest,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";
import MultiSelectVisibility from "../Complaints/MultiSelectVisibility";
import { toast } from "react-toastify";

const AllStock = () => {
  const [transferedStock, setTransferedStock] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [column, setColumn] = useState([]);

  const { t } = useTranslation();

  const fetchTransferedFundData = async () => {
    const res = await getAllTransferStockRequest(searchTerm, pageSize, pageNo);
    if (res.status) {
      setTransferedStock(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setTransferedStock([]);
      setPageDetail({});
    }
    setLoading(false);
  };

  const results = !searchTerm
    ? transferedStock
    : transferedStock.filter(
        (itm) =>
          itm?.request_by
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          itm?.request_by_employee_id
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase())
      );

  useEffect(() => {
    fetchTransferedFundData();
  }, [pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  const headerNames = [
    { name: "Id", value: "id" },
    { name: "unique Id", value: "unique_id" },
    { name: "Request For", value: "request_for" },
    { name: "Request Date", value: "request_date" },
    { name: "Request Quantity", value: "total_request_qty" },
    { name: "Total Approved Quantity", value: "total_approved_qty" },
    { name: "Transfered Quantity", value: "transfer_stock_quantity" },
    { name: "status", value: "status" },
  ];

  const handleClickExcel = async () => {
    fetchData();
  };
  const fetchData = async () => {
    const type = "1";
    const columns = JSON.stringify(column || ["id", "unique_id"]);
    const pageSizeValue = "";
    const res = await getAllTransferStockRequest(
      searchTerm,
      pageSizeValue,
      pageNo,
      type,
      columns
    );
    if (res.status) {
      toast.success(res.message);

      const filePath = res.filePath;
      const fileUrl = `${process.env.REACT_APP_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>All Fund · CMS Electricals</title>
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

        <Col md="3" className="m-3">
          <MultiSelectVisibility
            headerNames={headerNames}
            setColumn={setColumn}
            column={column}
          ></MultiSelectVisibility>
        </Col>
        <Col className="ms-3" md={"5"}>
          <button
            className="shadow border-0 red-combo cursor-pointer px-4 py-1"
            onClick={handleClickExcel}
          >
            Excel report
          </button>
          <button className="shadow border-0 red-combo cursor-pointer px-4 py-1 mx-2">
            Pdf report
          </button>
        </Col>

        <div className="p-3">
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Unique Id")}</th>
                  <th>{t("Request For")}</th>
                  <th>{t("Request Date")}</th>
                  <th>{t("Request Quantity")}</th>
                  <th>{t("Total Approved Quantity")}</th>
                  <th>{t("Transfered Quantity")}</th>
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
                          hideEdit={"d-none"}
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
                          ? transferedStock.length - 1 < pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                          : transferedStock.length < pageSize
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

export default AllStock;
