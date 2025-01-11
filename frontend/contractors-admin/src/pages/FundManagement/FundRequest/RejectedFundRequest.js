import React, { useEffect, useState } from "react";
import ActionButton from "../../../components/ActionButton";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import {
  getRejectedFundRequest,
  postReactiveRejectFundRequestet,
} from "../../../services/contractorApi";
import ReactPagination from "../../../components/ReactPagination";
import { BsArrowCounterclockwise } from "react-icons/bs";
import ImageViewer from "../../../components/ImageViewer";
import TooltipComponent from "../../../components/TooltipComponent";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";


const RejectedFundRequest = () => {
  const [rejectedFundRequest, setRejectedFundRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [idToRejected, setIdToRejected] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);

  const userId = user.user_type;

  const fetchFundRejectedData = async () => {
    const res = await getRejectedFundRequest(searchTerm, pageSize, pageNo);
    if (res.status) {
      setRejectedFundRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRejectedFundRequest([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleRejected = async () => {
    const res = await postReactiveRejectFundRequestet(idToRejected);
    if (res.status) {
      toast.success(res.message);
      setRejectedFundRequest((prev) =>
        prev.filter((itm) => itm.id !== idToRejected)
      );
      fetchFundRejectedData();
    } else {
      toast.error(res.message);
    }
    setIdToRejected("");
    setShowAlert(false);
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  useEffect(() => {
    fetchFundRejectedData();
  }, [searchTerm, pageNo, pageSize]);

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
                <th>{t("Request amount")}</th>
                <th>{t("Reject By")}</th>
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
              ) : rejectedFundRequest.length > 0 ? (
                <>
                  {rejectedFundRequest.map((data, id1) => (
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
                            <span className="d-grid">{data?.request_for} </span>
                          </span>
                        </ImageViewer>
                      </td>
                      <td className={`text-danger`}>{t("Rejected")}</td>
                      <td>{data.request_date}</td>
                      <td
                        className={`fw-bolder text-${data.total_request_amount > 0 ? "green" : "danger"
                          }`}
                      >
                        ₹{" "}
                        {data.total_request_amount > 0
                          ? data.total_request_amount
                          : "0"}
                      </td>
                      <td>
                        <ImageViewer
                          src={
                            data?.rejected_by_image
                              ? `${process.env.REACT_APP_API_URL}${data?.rejected_by_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <span className="d-flex align-items-center gap-2">
                            <img
                              width={30}
                              height={30}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                data?.rejected_by_image
                                  ? `${process.env.REACT_APP_API_URL}${data?.rejected_by_image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />{" "}
                            <span className="d-grid">
                              {data?.rejected_by}{" "}
                              {data?.rejected_by_employee_id
                                ? data?.rejected_by_employee_id
                                : null}
                            </span>
                          </span>
                        </ImageViewer>
                      </td>
                      <td className="text-center">
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
                        {/* <ActionButton
                          eyelink={`/fund-request/create-fund-request/${data.id}?type=view`}
                          hideDelete={"d-none"}
                          hideEdit={"d-none"}
                          custom={
                            <TooltipComponent title={"Re-Active"} align="left">
                              <Button
                                as={Link}
                                to={`/fund-request/create-fund-request/${data.id}?type=reject`}
                                className={`view-btn`}
                                variant="light"
                              >
                                <BsArrowCounterclockwise
                                  // onClick={() => {
                                  //   setIdToRejected(data.id);
                                  //   setShowAlert(true);
                                  // }}
                                  className={`social-btn danger-combo`}
                                />
                              </Button>
                            </TooltipComponent>
                          }
                        /> */}
                        <ActionButton
                          eyelink={`/fund-request/create-fund-request/${data.id}?type=view`}
                          hideDelete={"d-none"}
                          hideEdit={"d-none"}
                          custom={
                            userId === 3 ? ( // Check if the user ID is 3
                              <TooltipComponent title={"Re-Active"} align="left">
                                <Button
                                  as={Link}
                                  to={`/fund-request/create-fund-request/${data.id}?type=reject`}
                                  className={`view-btn`}
                                  variant="light"
                                >
                                  <BsArrowCounterclockwise className={`social-btn danger-combo`} />
                                </Button>
                              </TooltipComponent>
                            ) : null // Hide the button for other users
                          }
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
              <td colSpan={10}>
                <ReactPagination
                  pageSize={pageSize}
                  prevClassName={
                    pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                  }
                  nextClassName={
                    pageSize == pageDetail?.total
                      ? rejectedFundRequest.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : rejectedFundRequest.length < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                  }
                  title={`Showing ${pageDetail?.pageStartResult || 0} to ${pageDetail?.pageEndResult || 0
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

      <ConfirmAlert
        size={"sm"}
        defaultIcon={<BsArrowCounterclockwise />}
        deleteFunction={handleRejected}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Re-Active"}
        description={"Are you sure you want to re-active this!!"}
      />
    </>
  );
};

export default RejectedFundRequest;
