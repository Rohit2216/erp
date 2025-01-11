import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import CardComponent from "../../components/CardComponent";
import {
  getRequestComplaints,
  postApprovedComplaints,
  postRejectComplaints,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ActionButton from "../../components/ActionButton";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { addRemarkSchema } from "../../utils/formSchema";
import { Link } from "react-router-dom";
import { FilterComponent } from "./FilterComponent";
import { useTranslation } from "react-i18next";
import MultiSelectVisibility from "./MultiSelectVisibility";

const RequestsComplaint = () => {
  const [requestData, setRequestData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [actionStatus, setActionStatus] = useState(null);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const { t } = useTranslation();
  const [column, setColumn] = useState([]);
  const fetchRequestComplaints = async () => {
    const res = await getRequestComplaints(
      search,
      pageSize,
      pageNo,
      salesAreaId,
      outletId,
      regionalOfficeId,
      orderById
    );
    if (res.status) {
      setRequestData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRequestData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleCheckboxChange = (data, status) => {
    setActionStatus(status);
    setShowAlert(true);
    setSelectedRows(data);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {};

    if (actionStatus === 4) {
      sData["id"] = selectedRows?.id;
      sData["rejected_remark"] = values.remark;
      sData["status"] = 4;
    } else {
      sData["complaint_id"] = selectedRows?.id;
    }

    // return console.log("sData", sData);
    const res =
      actionStatus === 4
        ? await postRejectComplaints(sData)
        : await postApprovedComplaints(sData);
    if (res.status) {
      toast.success(res.message);
      fetchRequestComplaints();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
    // setSelectedRows([]);
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    fetchRequestComplaints();
  }, [
    search,
    pageNo,
    pageSize,
    salesAreaId,
    outletId,
    regionalOfficeId,
    orderById,
  ]);
  const headerNames = [
    { name: "Id", value: "id" },
    { name: "Complaint No.", value: "complaint_unique_id" },
    { name: "Complaint Type", value: "complaint_type" },
    { name: "Outlet", value: "outlet" },
    { name: "Regional Office Name", value: "regionalOffice" },
    { name: "Sales Area Name", value: "saleAreaDetails" },
    { name: "Area manager", value: "area_manager_name" },
    { name: "Supervisor", value: "supervisor_name" },
    { name: "Order By", value: "order_by_details" },
    { name: "Energy Company Name", value: "energy_company_name" },
    { name: "status", value: "status" },
  ];

  const handleClickExcel = async () => {
    fetchData();
  };
  const fetchData = async () => {
    const type = "1";
    const columns = JSON.stringify(column || ["id", "complaint_unique_id"]);
    const pageSizeValue = "";
    const res = await getRequestComplaints(
      search,
      pageSizeValue,
      pageNo,
      salesAreaId,
      outletId,
      regionalOfficeId,
      orderById,
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
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Requests Complaints · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"Requests Complaint"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
      >
        <FilterComponent
          setSalesAreaId={setSalesAreaId}
          setOutletId={setOutletId}
          setRegionalOfficeId={setRegionalOfficeId}
          setOrderById={setOrderById}
          status={1}
        >
          <Col md="3">
            <MultiSelectVisibility
              headerNames={headerNames}
              setColumn={setColumn}
              column={column}
            ></MultiSelectVisibility>
          </Col>
          <Col md={"5"}>
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
        </FilterComponent>
        <div className="table-scroll">
          <Formik
            enableReinitialize={true}
            initialValues={{
              remark: "",
            }}
            validationSchema={actionStatus === 4 ? addRemarkSchema : null}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <ConfirmAlert
                formikProps={props}
                size={"md"}
                hide={setShowAlert}
                show={showAlert}
                type="submit"
                title={`Confirm ${actionStatus === 4 ? "Reject" : "Approve"}`}
                description={
                  <>
                    <Row className="g-3 py-1">
                      {actionStatus === 4 ? (
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
                      ) : null}
                      <Col md={12}>
                        <div className="p-20 shadow rounded h-100">
                          <strong className="text-secondary">
                            {t("Company Details")}
                          </strong>
                          <div className="mt-2">
                            <table className="table-sm table">
                              <tbody>
                                {selectedRows?.energy_company_name && (
                                  <tr>
                                    <th>{t("Energy Company Name")} :</th>
                                    <td>{selectedRows?.energy_company_name}</td>
                                  </tr>
                                )}
                                {selectedRows?.outlet && (
                                  <tr>
                                    <th>{t("Outlet Name")} :</th>
                                    <td>
                                      {selectedRows?.outlet[0].outlet_name}
                                    </td>
                                  </tr>
                                )}
                                {selectedRows?.regionalOffice && (
                                  <tr>
                                    <th>{t("Regional Office Name")} :</th>
                                    <td>
                                      {
                                        selectedRows?.regionalOffice[0]
                                          .regional_office_name
                                      }
                                    </td>
                                  </tr>
                                )}
                                {selectedRows?.saleAreaDetails && (
                                  <tr>
                                    <th>{t("Sales Area Name")} :</th>
                                    <td>
                                      {
                                        selectedRows?.saleAreaDetails[0]
                                          .sales_area_name
                                      }
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="p-20 shadow rounded h-100">
                          <strong className="text-secondary">
                            {t("Complaint Details")}
                          </strong>
                          <div className="mt-2">
                            <table className="table-sm table">
                              <tbody>
                                {selectedRows?.complaintRaiseType && (
                                  <tr>
                                    <th>{t("Complaint Raise Type")} :</th>
                                    <td>{selectedRows?.complaintRaiseType}</td>
                                  </tr>
                                )}
                                {selectedRows?.complaint_raise_by && (
                                  <tr>
                                    <th>{t("Complaint Raise By")} :</th>
                                    <td>{selectedRows?.complaint_raise_by}</td>
                                  </tr>
                                )}
                                {selectedRows?.complaint_type && (
                                  <tr>
                                    <th>{t("Complaint Type")} :</th>
                                    <td>{selectedRows?.complaint_type}</td>
                                  </tr>
                                )}
                                {selectedRows?.complaint_unique_id && (
                                  <tr>
                                    <th>{t("Complaint Id")} :</th>
                                    <td>{selectedRows?.complaint_unique_id}</td>
                                  </tr>
                                )}
                                {selectedRows?.created_at && (
                                  <tr>
                                    <th>{t("Created At")} :</th>
                                    <td>{selectedRows?.created_at}</td>
                                  </tr>
                                )}
                                {selectedRows?.description && (
                                  <tr>
                                    <th>{t("Description")} :</th>
                                    <td>{selectedRows?.description}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </>
                }
              />
            )}
          </Formik>

          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Complaint No.")}</th>
                <th>{t("Complaint Type")}</th>
                <th>{t("Outlet")}</th>
                <th>{t("Regional Office Name")}</th>
                <th>{t("Sales Area Name")}</th>
                <th>{t("Order By")}</th>
                <th>{t("Company Name")}</th>
                <th>{t("status")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <td colSpan={9}>
                  <img
                    className="p-3"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt="Loading"
                  />
                </td>
              ) : requestData.length > 0 ? (
                <>
                  {requestData?.map((data, idx) => (
                    <tr key={idx}>
                      <td>
                        <Link
                          className="text-secondary text-none"
                          to={`/RequestsComplaint/ViewRequestsComplaint/${data.id}`}
                        >
                          {data.complaint_unique_id}
                        </Link>
                      </td>
                      <td>{data.complaint_type}</td>
                      <td>
                        {data.outlet?.length > 0
                          ? data.outlet[0]?.outlet_name
                          : "-"}
                      </td>
                      <td>
                        {data.regionalOffice?.length > 0
                          ? data.regionalOffice[0]?.regional_office_name
                          : "-"}
                      </td>
                      <td>
                        {data.saleAreaDetails?.length > 0
                          ? data.saleAreaDetails[0]?.sales_area_name
                          : "-"}
                      </td>
                      <td>{data.order_by_details}</td>
                      <td>{data.energy_company_name}</td>
                      <td
                        className={`text-${
                          data.status === "pending" ? "orange" : "danger"
                        }`}
                      >
                        {data.status}
                      </td>
                      <td>
                        <ActionButton
                          eyelink={`/RequestsComplaint/ViewRequestsComplaint/${data.id}`}
                          editlink={`/create-complaint/${data.id}`}
                          hideDelete={"d-none"}
                          approveOnclick={() => handleCheckboxChange(data, 1)}
                          rejectOnclick={() => handleCheckboxChange(data, 4)}
                          editClass={`danger-${
                            data?.status === "rejected"
                              ? "combo-disable pe-none"
                              : "combo"
                          }`}
                          rejectClass={
                            data?.status === "rejected"
                              ? "danger-combo-disable pe-none"
                              : "red-combo"
                          }
                          approveClass={
                            data?.status === "rejected"
                              ? "danger-combo-disable pe-none"
                              : "success-combo"
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <td colSpan={9}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="250"
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
                      ? requestData.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : requestData.length < pageSize
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
      </CardComponent>
    </Col>
  );
};

export default RequestsComplaint;
