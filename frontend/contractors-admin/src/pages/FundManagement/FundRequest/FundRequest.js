import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import {
  getFundRequest,
  postRejectFundRequest,
} from "../../../services/contractorApi";
import TextareaAutosize from "react-textarea-autosize";
import { Helmet } from "react-helmet";
import ActionButton from "../../../components/ActionButton";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import ApprovedFundRequest from "./ApprovedFundRequest";
import RejectedFundRequest from "./RejectedFundRequest";
import { Link } from "react-router-dom";
import ImageViewer from "../../../components/ImageViewer";
import { Formik } from "formik";
import { addRemarkSchema } from "../../../utils/formSchema";
import { useTranslation } from "react-i18next";
import { getAllModuleByRoleId } from "../../../services/authapi";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";

const FundRequest = () => {
  const [fundRequest, setFundRequest] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: true, // All users can view by default
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
  const { user } = useSelector(selectUser);

  const fetchPermissions = async () => {
    try {
      const userID = user.user_type; // Assuming `user_type` is the user's role identifier
      const res = await getAllModuleByRoleId(userID);
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "fund management");
        console.log("hrModule", hrModule)
        if (hrModule && hrModule.submodules) {
          const employeesSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "fund request"
          );
          console.log("employeesSubmodule", employeesSubmodule)
          if (employeesSubmodule) {
            setPermissions({
              create: Boolean(employeesSubmodule.create),
              update: Boolean(employeesSubmodule.update),
              delete: Boolean(employeesSubmodule.delete),
              view: true, // Ensure view is set explicitly to true
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setIsPermissionsLoading(false);
    }
  };

  const fetchFundRequestData = async () => {
    const res = await getFundRequest(searchTerm, pageSize, pageNo);
    if (res.status) {
      setFundRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setFundRequest([]);
      setPageDetail({});
    }
  };

  const handleUpdate = (data) => {
    setStoreId(data);
    setShowAlert(true);
  };

  const handleRejected = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      remarks: values.remark,
    };
    const res = await postRejectFundRequest(storeId.id, sData);
    if (res.status) {
      toast.success(res.message);
      fetchFundRequestData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowAlert(false);
  };

  useEffect(() => {
    fetchFundRequestData();
    fetchPermissions();
  }, [searchTerm, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
  };

  return (
    <>
      <Helmet>
        <title>Fund Request · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab
              className="pe-none fs-15 fw-bold"
              title={[t("Fund Request")]}
            />
            <Tab className="ms-auto" title={[t("Pending Request")]}>
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
                    {/* <Button
                      as={Link}
                      to={`/fund-request/create-fund-request/new`}
                      variant="light"
                      className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
                    >
                      <BsPlus /> {t("Create")}
                    </Button> */}
                    {permissions.create && (
                      <Button
                        as={Link}
                        to={`/fund-request/create-fund-request/new`}
                        variant="light"
                        className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
                      >
                        <BsPlus /> {t("Create")}
                      </Button>
                    )}

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
                            <th>{t("Request Amount")}</th>
                            <th>{t("Total Item")}</th>
                            <th>{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fundRequest.length > 0 ? null : (
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
                          {fundRequest.map((data, id1) => (
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
                                    </span>
                                  </span>
                                </ImageViewer>
                              </td>
                              <td
                                className={`text-${data?.status === "1" ? "green" : "orange"
                                  }`}
                              >
                                {data?.status === "1" ? "Approved" : "Pending"}
                              </td>
                              <td>{data.request_date}</td>
                              <td
                                className={`fw-bolder text-${data.total_request_amount > 0
                                  ? "green"
                                  : "danger"
                                  }`}
                              >
                                {data.total_request_amount > 0
                                  ? `${"₹"} ${data.total_request_amount}`
                                  : "0"}
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
                                  style={{ fontSize: 11 }}
                                >
                                  {data.total_new_request_items} {t("new")}
                                </Badge>
                              </td>
                              <td>
                                {/* <ActionButton
                                  editlink={`/fund-request/create-fund-request/${data.id}?type=edit`}
                                  hideDelete={"d-none"}
                                  rejectOnclick={() => handleUpdate(data)}
                                  approveLink={`/fund-request/create-fund-request/${data.id}?type=approve`}
                                  eyelink={`/fund-request/create-fund-request/${data.id}?type=view`}
                                  approveClass={
                                    !data?.active
                                      ? `danger-combo-disable pe-none`
                                      : `success-combo`
                                  }
                                  rejectClass={
                                    !data?.active
                                      ? `danger-combo-disable pe-none `
                                      : `red-combo`
                                  }
                                  editClass={
                                    !data?.update_fund_request
                                      ? `danger-combo-disable pe-none`
                                      : `danger-combo`
                                  }
                                /> */}
                                <ActionButton
                                  editlink={
                                    permissions.update
                                      ? `/fund-request/create-fund-request/${data.id}?type=edit`
                                      : null
                                  } // Allow editing only if update permission exists
                                  hideDelete={"d-none"} // Hide the delete button if no delete permission
                                  rejectOnclick={
                                    permissions.delete
                                      ? () => handleUpdate(data)
                                      : null
                                  } // Allow rejection only if delete permission exists
                                  approveLink={
                                    permissions.delete
                                      ? `/fund-request/create-fund-request/${data.id}?type=approve`
                                      : null
                                  } // Allow approval only if delete permission exists
                                  eyelink={
                                    permissions.view
                                      ? `/fund-request/create-fund-request/${data.id}?type=view`
                                      : null
                                  } // Allow view only if view permission exists
                                  approveClass={
                                    !data?.active || !permissions.delete
                                      ? `danger-combo-disable pe-none`
                                      : `success-combo`
                                  } // Disable approve button if data is inactive or no delete permission
                                  rejectClass={
                                    !data?.active || !permissions.delete
                                      ? `danger-combo-disable pe-none`
                                      : `red-combo`
                                  } // Disable reject button if data is inactive or no delete permission
                                  editClass={
                                    !data?.update_fund_request || !permissions.update
                                      ? `danger-combo-disable pe-none`
                                      : `danger-combo`
                                  } // Disable edit button if no update permission or update_fund_request is false
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
                                          {storeId?.request_data?.request_fund
                                            .length > 0 && (
                                              <>
                                                <h6 className="my-2">
                                                  {t("Request Fund")}
                                                </h6>
                                                <Table className="table-sm table Roles">
                                                  <thead>
                                                    <tr>
                                                      <th>{t("unique Id")}</th>
                                                      <th>{t("Item Name")}</th>
                                                      <th>{t("Item rate")}</th>
                                                      <th>{t("request qty")}</th>
                                                      <th>
                                                        {t("request amount")}
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {storeId?.request_data?.request_fund?.map(
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
                                                            ₹ {itm.fund_amount}
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
                                                          ₹{" "}
                                                          {storeId?.request_data?.request_fund.reduce(
                                                            (userTotal, item) =>
                                                              userTotal +
                                                              +item.fund_amount,
                                                            0
                                                          )}
                                                        </b>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </Table>
                                              </>
                                            )}

                                          {storeId?.request_data
                                            ?.new_request_fund.length > 0 && (
                                              <>
                                                <h6 className="my-2">
                                                  {t("New Request Fund")}
                                                </h6>
                                                <Table className="table-sm table Roles">
                                                  <thead>
                                                    <tr>
                                                      <th>{t("unique Id")}</th>
                                                      <th>{t("Item Name")}</th>
                                                      <th>{t("Item rate")}</th>
                                                      <th>{t("request qty")}</th>
                                                      <th>
                                                        {t("request amount")}
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {storeId?.request_data?.new_request_fund?.map(
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
                                                                    ? itm?.item_image
                                                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                                }
                                                              >
                                                                <img
                                                                  width={35}
                                                                  height={35}
                                                                  className="my-bg object-fit p-1 rounded-circle"
                                                                  src={
                                                                    itm?.item_image
                                                                      ? itm?.item_image
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
                                                          ₹{" "}
                                                          {storeId?.request_data?.new_request_fund.reduce(
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
                                                          ₹{" "}
                                                          {
                                                            storeId?.total_request_amount
                                                          }
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
                            <ReactPagination
                              pageSize={pageSize}
                              prevClassName={
                                pageNo === 1
                                  ? "danger-combo-disable pe-none"
                                  : "red-combo"
                              }
                              nextClassName={
                                pageSize == pageDetail?.total
                                  ? fundRequest.length - 1 < pageSize
                                    ? "danger-combo-disable pe-none"
                                    : "success-combo"
                                  : fundRequest.length < pageSize
                                    ? "danger-combo-disable pe-none"
                                    : "success-combo"
                              }
                              title={`Showing ${pageDetail?.pageStartResult || 0
                                } to ${pageDetail?.pageEndResult || 0} of ${pageDetail?.total || 0
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
              {activeTab == "3" && <ApprovedFundRequest />}
            </Tab>
            <Tab title={t("Rejected")}>
              {activeTab == "4" && <RejectedFundRequest />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default FundRequest;
