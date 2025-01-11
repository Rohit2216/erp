import React, { useEffect, useState } from "react";
import ActionButton from "../../components/ActionButton";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { BsArrowCounterclockwise, BsSearch } from "react-icons/bs";
import {
  getAllStockRequest,
  getRejectedStockRequest,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import ImageViewer from "../../components/ImageViewer";
import TooltipComponent from "../../components/TooltipComponent";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AllStockRequest = () => {
  const [rejectedStockRequest, setRejectedStockRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const fetchStockAllData = async () => {
    const res = await getAllStockRequest(pageSize, pageNo);
    if (res.status) {
      setRejectedStockRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRejectedStockRequest([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const results = !searchTerm
    ? rejectedStockRequest
    : rejectedStockRequest.filter((itm) =>
        itm?.requested_by
          ?.toLowerCase()
          .includes(searchTerm.toLocaleLowerCase())
      );

  useEffect(() => {
    fetchStockAllData();
  }, [pageNo, pageSize]);

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
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
                <th>{t("Status")}</th>
                <th>{t("Request Date")}</th>
                <th>{t("Request Qty")}</th>
                <th>{t("Supplier")}</th>
                <th>{t("Total Item")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <td colSpan={7}>
                  <img
                    className="p-3"
                    width="200"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt="Loading"
                  />
                </td>
              ) : results.length > 0 ? (
                <>
                  {results.map((data, id1) => (
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
                                {data?.requested_by_employee_id
                                  ? data?.requested_by_employee_id
                                  : null}
                              </span>
                            </span>
                          </span>
                        </ImageViewer>
                      </td>
                      <td
                        className={
                          data.status === "Rejected"
                            ? `text-danger`
                            : data.status === "Approved"
                            ? "text-green"
                            : data.status === "Pending"
                            ? "text-orange"
                            : data.status === "Done"
                            ? "text-green"
                            : "text-orange"
                        }
                      >
                        {data.status}
                      </td>
                      <td>{data.request_date}</td>
                      <td
                        className={`fw-bolder text-${
                          data.total_request_qty > 0 ? "green" : "danger"
                        }`}
                      >
                        {data.total_request_qty > 0
                          ? data.total_request_qty
                          : "0"}
                      </td>
                      <td>{data?.supplier_name ?? "--"}</td>
                      <td>
                        <Badge
                          bg="orange"
                          className="fw-normal"
                          style={{ fontSize: 11 }}
                        >
                          {data.total_request_items} {t("old")}
                        </Badge>
                        &ensp;
                        <Badge
                          bg="secondary"
                          className="fw-normal"
                          style={{ fontSize: 11, marginTop: "5px" }}
                        >
                          {data.total_new_request_items} {t("new")}
                        </Badge>
                      </td>
                      <td>
                        <ActionButton
                          eyelink={`/stock-request/create-stock-request/${data.id}?type=view`}
                          hideDelete={"d-none"}
                          hideEdit={"d-none"}
                          // custom={
                          //   <TooltipComponent title={"Re-Active"} align="left">
                          //     <Button
                          //       as={Link}
                          //       to={`/stock-request/create-stock-request/${data.id}?type=reject`}
                          //       className={`view-btn`}
                          //       variant="light"
                          //     >
                          //       <BsArrowCounterclockwise
                          //         // onClick={() => {
                          //         //   setIdToRejected(data.id);
                          //         //   setShowAlert(true);
                          //         // }}
                          //         className={`social-btn danger-combo`}
                          //       />
                          //     </Button>
                          //   </TooltipComponent>
                          // }
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <td colSpan={7}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="200"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
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
                        ? rejectedStockRequest.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : rejectedStockRequest.length < pageSize
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
    </>
  );
};

export default AllStockRequest;
