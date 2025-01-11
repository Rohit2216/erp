import React, { useEffect, useState } from "react";
import ActionButton from "../../../components/ActionButton";
import { Badge, Col, Form, Row, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import {
  getApprovedFundRequest,
  postRejectFundRequest,
} from "../../../services/contractorApi";
import ReactPagination from "../../../components/ReactPagination";
import ImageViewer from "../../../components/ImageViewer";
import ConfirmAlert from "../../../components/ConfirmAlert";
import TextareaAutosize from "react-textarea-autosize";
import { Formik } from "formik";
import { addRemarkSchema } from "../../../utils/formSchema";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getAllModuleByRoleId } from "../../../services/authapi";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
const ApprovedFundRequest = () => {
  const [approveFundRequest, setApproveFundRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
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

  const fetchFundApprovedData = async () => {
    const res = await getApprovedFundRequest(searchTerm, pageSize, pageNo);
    if (res.status) {
      setApproveFundRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setApproveFundRequest([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleRejected = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      remarks: storeId.id,
    };
    const res = await postRejectFundRequest(storeId.id, sData);
    if (res.status) {
      toast.success(res.message);
      fetchFundApprovedData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowAlert(false);
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleUpdate = (data) => {
    setStoreId(data);
    setShowAlert(true);
  };

  useEffect(() => {
    fetchFundApprovedData();
    fetchPermissions();
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
                <th>{t("status")}</th>
                <th>{t("Request Date")}</th>
                <th>{t("Request amount")}</th>
                <th>{t("Total Approved amount")}</th>
                <th>{t("Approved By")}</th>
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
              ) : approveFundRequest.length > 0 ? (
                <>
                  {approveFundRequest.map((data, id1) => (
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
                      <td className={`text-green`}>{t("Approved")}</td>
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
                      <td
                        className={`fw-bolder text-${data.total_approved_amount > 0 ? "green" : "danger"
                          }`}
                      >
                        ₹{" "}
                        {data.total_approved_amount > 0
                          ? data.total_approved_amount
                          : "0"}
                      </td>
                      <td>
                        <ImageViewer
                          src={
                            data?.approved_by_image
                              ? `${process.env.REACT_APP_API_URL}${data?.approved_by_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <span className="d-flex align-items-center gap-2">
                            <img
                              width={30}
                              height={30}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                data?.approved_by_image
                                  ? `${process.env.REACT_APP_API_URL}${data?.approved_by_image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />{" "}
                            <span className="d-grid">
                              {data?.approved_by}{" "}
                              {data?.approved_by_employee_id
                                ? data?.approved_by_employee_id
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
                          {data.total_new_request_items} {t("New")}
                        </Badge>
                      </td>
                      <td>
                        {/* <ActionButton
                          eyelink={`/fund-request/create-fund-request/${data.id}?type=view`}
                          hideDelete={"d-none"}
                          // editClass={`danger-${
                          //   data?.active
                          //     ? "combo"
                          //     : "combo-disable pe-none"
                          // }`}
                          editlink={`/fund-request/create-fund-request/${data.id}?type=approve`}
                          rejectOnclick={() => handleUpdate(data)}
                        /> */}
                        <ActionButton
                          eyelink={`/fund-request/create-fund-request/${data.id}?type=view`}
                          hideDelete={"d-none"} // Show delete if the user has delete permissions
                          editlink={
                            permissions.update
                              ? `/fund-request/create-fund-request/${data.id}?type=approve`
                              : null
                          } // Show edit link if the user has update permissions
                          rejectOnclick={
                            permissions.delete
                              ? () => handleUpdate(data)
                              : null
                          } // Show reject button if user has both update and delete permissions
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
                                props.touched.remark && props.errors.remark
                              )}
                            />
                            <small className="text-danger">
                              {props.errors.remark}
                            </small>
                          </Col>

                          <Col md={12}>
                            <div className="table-scroll">
                              {storeId?.request_data?.request_fund.length >
                                0 && (
                                  <>
                                    <h6 className="my-2">{t("Request Fund")}</h6>
                                    <Table className="table-sm table Roles">
                                      <thead>
                                        <tr>
                                          <th>{t("Unique Id")}</th>
                                          <th>{t("Item Name")}</th>
                                          <th>{t("Item rate")}</th>
                                          <th>{t("request qty")}</th>
                                          <th>{t("request amount")}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {storeId?.request_data?.request_fund?.map(
                                          (itm, idx) => (
                                            <tr key={idx}>
                                              <td>{storeId?.unique_id}</td>
                                              <td>
                                                <div className="d-flex">
                                                  <ImageViewer
                                                    src={
                                                      itm?.item_name?.image
                                                        ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                    }
                                                  >
                                                    <img
                                                      width={35}
                                                      height={35}
                                                      className="my-bg object-fit p-1 rounded-circle"
                                                      src={
                                                        itm?.item_name?.image
                                                          ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                      }
                                                    />
                                                  </ImageViewer>{" "}
                                                  <span className="small d-grid">
                                                    <span>
                                                      {itm.item_name?.label}
                                                    </span>
                                                    <span className="text-gray">
                                                      {itm.item_name?.unique_id
                                                        ? `(${itm.item_name?.unique_id})`
                                                        : "-"}
                                                    </span>
                                                  </span>
                                                </div>
                                              </td>
                                              <td>₹ {itm.item_name?.rate}</td>
                                              <td>{itm.request_quantity}</td>
                                              <td>₹ {itm.fund_amount}</td>
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
                                              ₹ {storeId?.total_request_amount}
                                            </b>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </Table>
                                  </>
                                )}

                              {storeId?.request_data?.new_request_fund.length >
                                0 && (
                                  <>
                                    <h6 className="my-2">
                                      {t("New Request Fund")}
                                    </h6>
                                    <Table className="table-sm table Roles">
                                      <thead>
                                        <tr>
                                          <th>{t("Unique Id")}</th>
                                          <th>{t("Item Name")}</th>
                                          <th>{t("Item rate")}</th>
                                          <th>{t("request qty")}</th>
                                          <th>{t("request amount")}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {storeId?.request_data?.new_request_fund?.map(
                                          (itm, idx) => (
                                            <tr key={idx}>
                                              <td>{storeId?.unique_id}</td>
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
                                                      {itm.title?.label}
                                                    </span>
                                                    <span className="text-gray">
                                                      {itm.item_name?.unique_id
                                                        ? `(${itm.item_name?.unique_id})`
                                                        : "-"}
                                                    </span>
                                                  </span>
                                                </div>
                                              </td>
                                              <td>₹ {itm?.rate}</td>
                                              <td>{itm?.qty}</td>
                                              <td>₹ {itm?.fund_amount}</td>
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
                                              ₹ {storeId?.total_request_amount}
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
                    pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                  }
                  nextClassName={
                    pageSize == pageDetail?.total
                      ? approveFundRequest.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : approveFundRequest.length < pageSize
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
    </>
  );
};

export default ApprovedFundRequest;
