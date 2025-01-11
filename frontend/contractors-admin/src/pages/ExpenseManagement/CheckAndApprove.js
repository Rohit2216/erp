import React, { useEffect, useState } from "react";
import ActionButton from "../../components/ActionButton";
import { Badge, Form, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { getApprovedExpensePunch } from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import ImageViewer from "../../components/ImageViewer";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";

const CheckAndApprove = () => {
  const [approveStockRequest, setApproveStockRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchStockApprovedData = async () => {
    const res = await getApprovedExpensePunch(searchTerm, pageSize, pageNo);
    if (res.status) {
      setApproveStockRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setApproveStockRequest([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  // set Delay time to get data on search
  const debounceValue = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchStockApprovedData();
  }, [debounceValue, pageNo, pageSize]);

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
          <div className="p-3">
            <Table className="text-body Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("employee Id")}</th>
                  <th>{t("user name")}</th>
                  <th>{t("Complaint Number")}</th>
                  <th>{t("Total Items")}</th>
                  <th>
                    {t("Total")} <br /> {t("Transactions")}
                  </th>
                  <th>{t("date")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {approveStockRequest.length > 0 ? null : (
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

                {approveStockRequest.map((data, id1) => (
                  <tr key={id1}>
                    <td>{data?.employee_id ?? "--"}</td>
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
                          <span className="d-grid">{data?.user_name} </span>
                        </span>
                      </ImageViewer>
                    </td>

                    <td>
                      {data?.complainsDetails?.complaint_unique_id ?? "--"}
                    </td>

                    <td className="text-center">
                      {
                        <Badge
                          bg="secondary"
                          className="fw-normal"
                          style={{ fontSize: 11, marginTop: "5px" }}
                        >
                          {data?.total_items} {t("item")}
                        </Badge>
                      }
                    </td>

                    <td className="text-center">{data?.total_transactions}</td>
                    <td>{data.approved_at?.split("T")?.[0]}</td>

                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                        approveMargin={false}
                        approveAlign={"left"}
                        eyeOnclick={() =>
                          navigate(
                            `/expense-punch/create-expense-punch/${data.id}?type=view`,
                            {
                              state: {
                                Complain_id: data.complaint_id,
                                userId: data.user_id,
                                viewType: "approveData",
                              },
                            }
                          )
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
                      pageNo === 1
                        ? "danger-combo-disable pe-none"
                        : "red-combo"
                    }
                    nextClassName={
                      pageSize == pageDetail?.total
                        ? approveStockRequest.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : approveStockRequest.length < pageSize
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
      </div>
    </>
  );
};

export default CheckAndApprove;
