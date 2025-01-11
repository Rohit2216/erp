import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import TextareaAutosize from "react-textarea-autosize";

import {
  deleteStockRequestById,
  getStockRequest,
  postStockReject,
  postStockRequestStatus,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import ApprovedStockRequest from "./ApprovedStockRequest";
import { Link } from "react-router-dom";
import RejectedStockRequest from "./RejectedStockRequest";
import ImageViewer from "../../components/ImageViewer";
import ActionButton from "../../components/ActionButton";
import { Formik } from "formik";
import { addRemarkSchema } from "../../utils/formSchema";
import AllStockRequest from "./AllStockRequest";
import { useTranslation } from "react-i18next";

const StockRequest = () => {
  const [stockRequest, setStockRequest] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const fetchStockRequestData = async () => {
    const res = await getStockRequest(pageSize, pageNo);
    if (res.status) {
      setStockRequest(res.data);

      setPageDetail(res.pageDetails);
    } else {
      setStockRequest([]);
      setPageDetail({});
    }
  };

  const handleUpdate = (data) => {
    setStoreId(data);
    setShowAlert(true);
  };

  const handleRejected = async (values) => {
    const sData = {
      id: storeId.id,
      status: "2",
      rejected_remarks: values.remark,
    };

    const res = await postStockReject(sData);
    if (res.status) {
      toast.success(res.message);
      fetchStockRequestData();
      setShowAlert(false);
    } else {
      toast.error(res.message);
    }
  };

  const results = !searchTerm
    ? stockRequest
    : stockRequest.filter((itm) =>
        itm?.requested_by
          ?.toLowerCase()
          .includes(searchTerm.toLocaleLowerCase())
      );

  const handleDelete = async () => {
    const res = await deleteStockRequestById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setStockRequest((prev) => prev.filter((itm) => itm.id !== idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchStockRequestData();
  }, [pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Stock Request · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold" title={t("Stock Request")} />
            <Tab className="ms-auto" title={t("Pending Request")}>
              {activeTab == "2" && (
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
                    <Button
                      as={Link}
                      to={`/stock-request/create-stock-request/new`}
                      variant="light"
                      className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
                    >
                      <BsPlus /> {t("Create")}
                    </Button>
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
                          {results.length > 0 ? null : (
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
                                className={`text-${
                                  data?.status === "1" ? "green" : "orange"
                                }`}
                              >
                                {data?.status === "1" ? "Approved" : "Pending"}
                              </td>
                              <td>{data.request_date}</td>
                              <td
                                className={`fw-bolder text-${
                                  data.total_request_qty > 0
                                    ? "green"
                                    : "danger"
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
                                  editlink={`/stock-request/create-stock-request/${data.id}?type=update`}
                                  approveLink={`/stock-request/create-stock-request/${data.id}?type=approve`}
                                  approveClass={
                                    !data?.active
                                      ? `danger-combo-disable pe-none`
                                      : `success-combo`
                                  }
                                  rejectOnclick={() => handleUpdate(data)}
                                  deleteOnclick={() => {
                                    setIdToDelete(data.id);
                                    setShowDelete(true);
                                  }}
                                  hideDelete={"d-none"}
                                  editClass={`danger-${
                                    data?.status === "0"
                                      ? "combo"
                                      : "combo-disable pe-none"
                                  }`}
                                  rejectClass={
                                    !data?.active
                                      ? `danger-combo-disable pe-none `
                                      : `red-combo`
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <td colSpan={10}>
                            <Formik
                              enableReinitialize={true}
                              initialValues={{
                                remark: "",
                              }}
                              validationSchema={addRemarkSchema}
                              onSubmit={handleRejected}
                            >
                              {(props) => (
                                <ConfirmAlert
                                  formikProps={props}
                                  size={"md"}
                                  hide={setShowAlert}
                                  show={showAlert}
                                  type="submit"
                                  title={"Confirm Reject"}
                                  description={
                                    <Row className="g-3 py-1">
                                      <Col md={12}>
                                        <TextareaAutosize
                                          minRows={3}
                                          placeholder="type remarks..."
                                          onChange={props.handleChange}
                                          name="remark"
                                          className="edit-textarea"
                                          onBlur={props.handleBlur}
                                          isInvalid={Boolean(
                                            props.touched.remark &&
                                              props.errors.remark
                                          )}
                                        />
                                        <small className="text-danger">
                                          {props.errors.remark}
                                        </small>
                                      </Col>
                                      <Col md={12}>
                                        <div className="table-scroll">
                                          {storeId?.request_stock?.request_stock
                                            .length > 0 && (
                                            <>
                                              <h6 className="my-2">
                                                {t("Request Item")}
                                              </h6>
                                              <Table className="table-sm table Roles">
                                                <thead>
                                                  <tr>
                                                    <th>{t("Unique Id")}</th>
                                                    <th>{t("Item Name")}</th>
                                                    <th>{t("Item rate")}</th>
                                                    <th>{t("request qty")}</th>
                                                    <th>
                                                      {t("request amount")}
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {storeId?.request_stock?.request_stock?.map(
                                                    (itm, idx) => (
                                                      <tr key={idx}>
                                                        <td>
                                                          {storeId?.unique_id}
                                                        </td>
                                                        <td>
                                                          <div className="d-flex">
                                                            <ImageViewer
                                                              src={
                                                                itm?.item_name
                                                                  ?.image
                                                                  ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                              }
                                                            >
                                                              <img
                                                                width={35}
                                                                height={35}
                                                                className="my-bg object-fit p-1 rounded-circle"
                                                                src={
                                                                  itm?.item_name
                                                                    ?.image
                                                                    ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                                }
                                                              />
                                                            </ImageViewer>{" "}
                                                            <span className="small d-grid">
                                                              <span>
                                                                {
                                                                  itm.item_name
                                                                    ?.label
                                                                }
                                                              </span>
                                                              <span className="text-gray">
                                                                {itm.item_name
                                                                  ?.unique_id
                                                                  ? `(${itm.item_name?.unique_id})`
                                                                  : "-"}
                                                              </span>
                                                            </span>
                                                          </div>
                                                        </td>
                                                        <td>
                                                          ₹{" "}
                                                          {itm.item_name?.rate}
                                                        </td>
                                                        <td>
                                                          {itm.request_quantity}
                                                        </td>
                                                        <td>
                                                          ₹ {itm.total_price}
                                                        </td>
                                                      </tr>
                                                    )
                                                  )}
                                                  <tr>
                                                    <td colSpan={2}></td>
                                                    <td colSpan={2}>
                                                      {t("total request amt")}.
                                                    </td>
                                                    <td className="text-start text-green">
                                                      <b>
                                                        ₹
                                                        {storeId?.request_stock?.request_stock.reduce(
                                                          (userTotal, item) =>
                                                            userTotal +
                                                            +item.total_price,
                                                          0
                                                        )}
                                                      </b>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </Table>
                                            </>
                                          )}

                                          {storeId?.request_stock
                                            ?.new_request_stock.length > 0 && (
                                            <>
                                              <h6 className="my-2">
                                                {t("New Request Item")}
                                              </h6>
                                              <Table className="table-sm table Roles">
                                                <thead>
                                                  <tr>
                                                    <th>{t("Unique Id")}</th>
                                                    <th>{t("Item Name")}</th>
                                                    <th>{t("Item rate")}</th>
                                                    <th>{t("request qty")}</th>
                                                    <th>
                                                      {t("request amount")}
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {storeId?.request_stock?.new_request_stock?.map(
                                                    (itm, idx) => (
                                                      <tr key={idx}>
                                                        <td>
                                                          {storeId?.unique_id}
                                                        </td>
                                                        <td>
                                                          <div className="d-flex">
                                                            <ImageViewer
                                                              src={
                                                                itm?.item_image
                                                                  ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
                                                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                              }
                                                            >
                                                              <img
                                                                width={35}
                                                                height={35}
                                                                className="my-bg object-fit p-1 rounded-circle"
                                                                src={
                                                                  itm?.item_image
                                                                    ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
                                                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                                }
                                                              />
                                                            </ImageViewer>{" "}
                                                            <span className="small d-grid">
                                                              <span>
                                                                {
                                                                  itm.title
                                                                    ?.label
                                                                }
                                                              </span>
                                                              <span className="text-gray">
                                                                {itm.item_name
                                                                  ?.unique_id
                                                                  ? `(${itm.item_name?.unique_id})`
                                                                  : "-"}
                                                              </span>
                                                            </span>
                                                          </div>
                                                        </td>
                                                        <td>₹ {itm?.rate}</td>
                                                        <td>{itm?.qty}</td>
                                                        <td>
                                                          ₹ {itm?.fund_amount}
                                                        </td>
                                                      </tr>
                                                    )
                                                  )}
                                                  <tr>
                                                    <td colSpan={2}></td>
                                                    <td colSpan={2}>
                                                      {t("total request amt")}.
                                                    </td>
                                                    <td className="text-start text-green">
                                                      <b>
                                                        ₹
                                                        {storeId?.request_stock?.new_request_stock.reduce(
                                                          (userTotal, item) =>
                                                            userTotal +
                                                            +item.fund_amount,
                                                          0
                                                        )}
                                                      </b>
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td colSpan={2}></td>
                                                    <td colSpan={2}>
                                                      {t("Final Amount")}
                                                    </td>

                                                    <td className="text-start text-green">
                                                      <b>
                                                        ₹
                                                        {storeId?.request_stock?.new_request_stock.reduce(
                                                          (userTotal, item) =>
                                                            userTotal +
                                                            +item.fund_amount,
                                                          0
                                                        ) +
                                                          storeId?.request_stock?.request_stock.reduce(
                                                            (userTotal, item) =>
                                                              userTotal +
                                                              +item.total_price,
                                                            0
                                                          )}
                                                      </b>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </Table>
                                            </>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  }
                                />
                              )}
                            </Formik>

                            <ConfirmAlert
                              size={"sm"}
                              deleteFunction={handleDelete}
                              hide={setShowDelete}
                              show={showDelete}
                              title={"Confirm Delete"}
                              description={
                                "Are you sure you want to delete this!!"
                              }
                            />
                            <ReactPagination
                              pageSize={pageSize}
                              prevClassName={
                                pageNo === 1
                                  ? "danger-combo-disable pe-none"
                                  : "red-combo"
                              }
                              nextClassName={
                                pageSize == pageDetail?.total
                                  ? stockRequest.length - 1 < pageSize
                                    ? "danger-combo-disable pe-none"
                                    : "success-combo"
                                  : stockRequest.length < pageSize
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
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </Tab>
            <Tab title={t("Approved")}>
              {activeTab == "3" && <ApprovedStockRequest />}
            </Tab>
            <Tab title={t("Rejected")}>
              {activeTab == "4" && <RejectedStockRequest />}
            </Tab>
            <Tab title={t("All Request")}>
              {activeTab == "5" && <AllStockRequest />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default StockRequest;
