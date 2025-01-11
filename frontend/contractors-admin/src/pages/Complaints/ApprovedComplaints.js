import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Table } from "react-bootstrap";
import {
  getAllApprovedAssignComplaints,
  getAllApprovedUnAssignComplaints,
  getAreaManagerAssign,
  getSupervisorAssign,
  getApprovedComplaints,
  postAfterAssignCanRejectedComplaints,
  getAllEndUser,
  postRejectComplaints,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";
import { Link } from "react-router-dom";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { BsPencil, BsPlus, BsSearch } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import { FilterComponent } from "./FilterComponent";
import { addRemarkSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { FaRegStopCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import MultiSelectVisibility from "./MultiSelectVisibility";

const ApprovedComplaints = () => {
  const [requestData, setRequestData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [edit, setEdit] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [typeData, setTypeData] = useState("Un-Assign");
  const [allManagers, setAllManagers] = useState([]);
  const [allSupervisors, setAllSupervisors] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [managerById, setManagerById] = useState("");
  const [supervisorById, setSupervisorById] = useState("");
  const [endUserId, setEndUserId] = useState("");
  const [endUSer, setEndUSer] = useState([]);
  const [column, setColumn] = useState([]);

  const { t } = useTranslation();

  const tabs = [
    { title: t("Approved Complaints"), className: "pe-none fs-15 fw-bold" },
    { title: t("Un-Assign"), className: "ms-auto", page: <TableComponent /> },
    { title: t("Assign"), page: <TableComponent /> },
    { title: t("All"), className: "me-1", page: <TableComponent /> },
  ];

  const fetchApprovedComplaints = async () => {
    const queryParams = {
      search,
      pageSize,
      pageNo,
      sales_area_id: salesAreaId,
      outlet_id: outletId,
      regional_office_id: regionalOfficeId,
      order_by_id: orderById,
      area_manager_id: managerById,
      supervisor_id: supervisorById,
      end_user_id: endUserId,
    };
    const res =
      typeData == "Un-Assign"
        ? await getAllApprovedUnAssignComplaints(queryParams)
        : typeData == "Assign"
        ? await getAllApprovedAssignComplaints(queryParams)
        : await getApprovedComplaints(
            search,
            pageSize,
            pageNo,
            salesAreaId,
            outletId,
            regionalOfficeId,
            orderById,
            managerById,
            supervisorById,
            endUserId
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

  const fetchManagers = async () => {
    const res = await getAreaManagerAssign();
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  const fetchSupervisors = async () => {
    const res = await getSupervisorAssign();
    if (res.status) {
      setAllSupervisors(res.data);
    } else {
      setAllSupervisors([]);
    }
  };

  const fetchEndUser = async () => {
    const res = await getAllEndUser();
    if (res.status) {
      setEndUSer(res.data);
    } else {
      setEndUSer([]);
    }
  };

  useEffect(() => {
    if (typeData == "Assign") {
      fetchManagers();
      fetchSupervisors();
      fetchEndUser();
    }
  }, [typeData]);

  useEffect(() => {
    fetchApprovedComplaints();
  }, [
    search,
    pageNo,
    pageSize,
    typeData,
    salesAreaId,
    outletId,
    regionalOfficeId,
    orderById,
    managerById,
    supervisorById,
    endUserId,
  ]);

  const handleClick = async (e) => {
    setTypeData(e.target.textContent);
    setSearch("");
    setPageNo(1);
    setPageSize(8);
  };

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
    const columns = JSON.stringify(column || []);
    const pageSizeValue = "";
    const res = await getApprovedComplaints(
      search,
      pageSizeValue,
      pageNo,
      salesAreaId,
      outletId,
      regionalOfficeId,
      orderById,
      managerById,
      supervisorById,
      endUserId,
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

    // if (res.status) {
    //   toast.success(res.message);

    //   const filePath = res.filePath;
    //   const fileUrl = `${process.env.REACT_APP_API_URL}${filePath}`;

    //   const response = await fetch(fileUrl);
    //   if (response.ok) {
    //     const blob = await response.blob();
    //     const url = window.URL.createObjectURL(blob);

    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = "RequestComplaints.xlsx";
    //     document.body.appendChild(link);
    //     link.click();

    //     link.remove();
    //     window.URL.revokeObjectURL(url);
    //   } else {
    //     toast.error("Failed to download file.");
    //   }
    // } else {
    //   toast.error(res.message);
    // }
  };
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      id: edit?.id,
      status: 4,
      rejected_remark: values.remark,
    };

    // return console.log("sData", sData);
    const res =
      typeData == "Assign"
        ? await postAfterAssignCanRejectedComplaints(sData)
        : await postRejectComplaints(sData);
    if (res.status) {
      toast.success(res.message);
      fetchApprovedComplaints();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
    resetForm();
    setSubmitting(false);
  };

  function TableComponent() {
    return (
      <>
        <div className="table-scroll">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Complaint No.")}</th>
                <th>{t("Complaint Type")}</th>
                <th>{t("Outlet")}</th>
                <th>{t("Regional Office Name")}</th>
                <th>{t("Sales Area Name")}</th>
                {typeData == "Assign" && <th>{t("Area manager")}</th>}
                {typeData == "Assign" && <th>{t("Supervisor")}</th>}
                {typeData == "Assign" && <th>{t("End User")}</th>}
                <th>{t("Order By")}</th>
                <th>{t("Company Name")}</th>
                {typeData == "All" && <th>{t("status")}</th>}
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                </tr>
              ) : requestData.length > 0 ? (
                <>
                  {requestData?.map((data, idx) => (
                    <tr key={idx}>
                      <td>
                        <Link
                          className="text-secondary text-none"
                          to={`ViewRequestsComplaint/${data.id}?type=approve`}
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
                      {typeData == "Assign" ? (
                        <td>
                          {data?.checkUsersAssign?.[0]?.areaManagerDetails
                            ?.name ?? "-"}
                        </td>
                      ) : null}
                      {typeData == "Assign" ? (
                        <td>
                          {data?.checkUsersAssign?.[0]?.supervisorDetails
                            ?.length > 0 &&
                            data?.checkUsersAssign?.[0]?.supervisorDetails
                              ?.filter(
                                (obj, index, self) =>
                                  index ===
                                  self.findIndex((t) => t.id === obj.id)
                              )
                              ?.map((val) => {
                                return (
                                  <div
                                    className="shadow px-1"
                                    style={{ marginTop: "5px" }}
                                  >
                                    {val.name ?? "--"}
                                  </div>
                                );
                              })}
                        </td>
                      ) : null}
                      {typeData == "Assign" ? (
                        <td>
                          {data?.checkUsersAssign?.[0]?.endUserDetails?.map(
                            (val) => {
                              return (
                                <div
                                  className="shadow px-1"
                                  style={{ marginTop: "5px" }}
                                >
                                  {val.name}
                                </div>
                              );
                            }
                          )}
                        </td>
                      ) : null}
                      <td>{data.order_by_details}</td>
                      <td>{data.energy_company_name}</td>
                      {typeData == "All" && (
                        <td
                          className={`text-${
                            data?.isComplaintAssigned ? "green" : "danger"
                          }`}
                        >
                          {data?.isComplaintAssigned ? "Assign" : "UnAssign"}
                        </td>
                      )}
                      <td>
                        <ActionButton
                          assignLink={`/ApprovedComplaints/CreateAllocate/${data.id}`}
                          hideDelete={"d-none"}
                          eyelink={`ViewRequestsComplaint/${data.id}?type=approve`}
                          editlink={`/create-complaint/${data.id}`}
                          rejectOnclick={() => {
                            setEdit(data);
                            setShowAlert(true);
                          }}
                          custom={
                            typeData == "Assign" ||
                            data?.isComplaintAssigned ? (
                              <>
                                <div className={`vr hr-shadow`} />
                                <TooltipComponent
                                  align="left"
                                  title={"Update Allocate"}
                                >
                                  <Button
                                    className={`view-btn`}
                                    variant="light"
                                    as={Link}
                                    to={`/ApprovedComplaints/UpdateAllocate/${data.id}`}
                                  >
                                    <BsPencil
                                      className={`social-btn red-combo`}
                                    />
                                  </Button>
                                </TooltipComponent>
                              </>
                            ) : typeData == "Un-Assign" ? (
                              <TooltipComponent
                                align="left"
                                title={"Hold Complaint"}
                              >
                                <Button
                                  className={`view-btn`}
                                  variant="light"
                                  as={Link}
                                  to={`/ApprovedComplaints/HoldComplaints/${data.id}`}
                                >
                                  <FaRegStopCircle
                                    className={`social-btn red-combo`}
                                  />
                                </Button>
                              </TooltipComponent>
                            ) : null
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={10}>
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
              {/* <tr> */}
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
              {/* </tr> */}
            </tfoot>
          </Table>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Approved Complaints · CMS Electrical</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e) => handleClick(e)}
            activeTab={"2"}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <span className="d-align mt-3 me-3 justify-content-end gap-2">
                  <span className="position-relative">
                    <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                    <Form.Control
                      type="text"
                      placeholder={t("Search")}
                      onChange={(e) => setSearch(e.target.value)}
                      className="me-2"
                      aria-label="Search"
                    />
                  </span>
                </span>
                <div className="p-3">
                  {tab.title == typeData ? (
                    <FilterComponent
                      setSalesAreaId={setSalesAreaId}
                      setOutletId={setOutletId}
                      setRegionalOfficeId={setRegionalOfficeId}
                      setOrderById={setOrderById}
                      setEndUserId={setEndUserId}
                      status={
                        typeData == "Un-Assign"
                          ? 2
                          : typeData == "Assign"
                          ? 3
                          : 3
                      }
                    >
                      {typeData == "Assign" ? (
                        <>
                          <Col md={3}>
                            <Select
                              placeholder={t("Managers User")}
                              menuPortalTarget={document.body}
                              options={allManagers?.map((user) => ({
                                label: user.name,
                                value: user.id,
                              }))}
                              onChange={(e) => {
                                setManagerById(e ? e.value : null);
                              }}
                              isClearable
                            />
                          </Col>
                          <Col md={3}>
                            <Select
                              placeholder={t("Supervisor")}
                              menuPortalTarget={document.body}
                              options={allSupervisors?.map((user) => ({
                                label: user.name,
                                value: user.id,
                              }))}
                              onChange={(e) => {
                                setSupervisorById(e ? e.value : null);
                              }}
                              isClearable
                            />
                          </Col>
                          <Col md={3}>
                            <Select
                              placeholder={t("End User")}
                              menuPortalTarget={document.body}
                              options={endUSer?.map((user) => ({
                                label: user.name,
                                value: user.id,
                              }))}
                              onChange={(e) => {
                                setEndUserId(e ? e.value : null);
                              }}
                              isClearable
                            />
                          </Col>
                        </>
                      ) : null}
                      {typeData == "All" ? (
                        <>
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
                        </>
                      ) : null}
                    </FilterComponent>
                  ) : null}
                  {tab.page}
                </div>
              </Tab>
            ))}
          </Tabs>
        </Card>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          remark: "",
        }}
        validationSchema={addRemarkSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <ConfirmAlert
            size={"sm"}
            formikProps={props}
            hide={setShowAlert}
            show={showAlert}
            type="submit"
            title={`Confirm Reject`}
            description={
              <>
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
                <small className="text-danger">{props.errors.remark}</small>
              </>
            }
          />
        )}
      </Formik>
    </>
  );
};

export default ApprovedComplaints;
