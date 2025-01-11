import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import {
  getAllComplaints,
  getAllEndUser,
  getAreaManagerAssign,
  getSupervisorAssign,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";
import { Link } from "react-router-dom";
import { FilterComponent } from "./FilterComponent";
import Select from "react-select";
import { useTranslation } from "react-i18next";
// import { MultiSelect } from "primereact/multiselect";
import MultiSelectVisibility from "./MultiSelectVisibility";
import { toast } from "react-toastify";

const AllComplaints = () => {
  const [allComplaintsData, setAllComplaintsData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [allManagers, setAllManagers] = useState([]);
  const [allSupervisors, setAllSupervisors] = useState([]);
  const [managerById, setManagerById] = useState("");
  const [supervisorById, setSupervisorById] = useState("");
  const [endUSer, setEndUSer] = useState([]);
  const [endUserId, setEndUserId] = useState("");
  const [column, setColumn] = useState([]);
  const { t } = useTranslation();

  const fetchAllComplaints = async () => {
    const res = await getAllComplaints(
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
    console.log(res, "complaints");
    if (res.status) {
      setAllComplaintsData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaintsData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const fetchEndUser = async () => {
    const res = await getAllEndUser();
    if (res.status) {
      setEndUSer(res.data);
    } else {
      setEndUSer([]);
    }
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
  const headerNames = [
    { name: "Id", value: "id" },
    { name: "Complaint No.", value: "complaint_unique_id" },
    { name: "Complaint Type", value: "complaint_type" },
    { name: "Outlet", value: "outlet" },
    { name: "Regional Office Name", value: "regionalOffice" },
    { name: "Sales Area Name", value: "saleAreaDetails" },
    { name: "Area manager", value: "area_manager_name" },
    { name: "Supervisor", value: "supervisor_name" },
    { name: "End User", value: "end_user_name" },
    { name: "Order By", value: "order_by_details" },
    { name: "Energy Company Name", value: "energy_company_name" },
    { name: "status", value: "status" },
  ];
  useEffect(() => {
    fetchAllComplaints();
  }, [
    search,
    pageNo,
    pageSize,
    salesAreaId,
    outletId,
    regionalOfficeId,
    orderById,
    managerById,
    supervisorById,
    endUserId,
  ]);
  useEffect(() => {
    fetchManagers();
    fetchSupervisors();
    fetchEndUser();
  }, []);
  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClickExcel = async () => {
    fetchData();
  };
  const fetchData = async () => {
    const type = "1";
    const columns = JSON.stringify(column || []);
    const pageSizeValue = "";
    const res = await getAllComplaints(
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
    //     link.download = "Complaints.xlsx";
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

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>All Complaints · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"All Complaints"}
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
          status={0}
        >
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
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Complaint No.")}</th>
                <th>{t("Complaint Type")}</th>
                <th>{t("Outlet")}</th>
                <th>{t("Regional Office Name")}</th>
                <th>{t("Sales Area Name")}</th>
                <th>{t("Area manager")}</th>
                <th>{t("Supervisor")}</th>
                <th>{t("End User")}</th>
                <th>{t("Order By")}</th>
                <th>{t("Company Name")}</th>
                <th>{t("status")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <td colSpan={10}>
                  <img
                    className="p-3"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt="Loading"
                  />
                </td>
              ) : allComplaintsData?.length > 0 ? (
                <>
                  {allComplaintsData?.map((data, idx) => (
                    <tr key={idx}>
                      <td>
                        <Link
                          className="text-secondary text-none"
                          to={`/complaints/ViewRequestsComplaint/${data.id}${
                            data.status == "pending"
                              ? ""
                              : `?type=${data.status}`
                          }`}
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
                      <td>
                        {data?.checkUsersAssign?.[0]?.areaManagerDetails
                          ?.name ?? "--"}
                      </td>{" "}
                      <td>
                        {data?.checkUsersAssign?.[0]?.supervisorDetails
                          ?.length > 0
                          ? data?.checkUsersAssign?.[0]?.supervisorDetails
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
                              })
                          : " --"}
                      </td>
                      <td>
                        {data?.checkUsersAssign?.[0]?.endUserDetails?.length > 0
                          ? data?.checkUsersAssign?.[0]?.endUserDetails?.map(
                              (val) => {
                                return (
                                  <div
                                    className="shadow px-1"
                                    style={{ marginTop: "5px" }}
                                  >
                                    {val.name ?? "--"}
                                  </div>
                                );
                              }
                            )
                          : "--"}
                      </td>
                      <td>{data.order_by_details}</td>
                      <td>{data.energy_company_name}</td>
                      <td
                        className={`text-${
                          data.status == "rejected"
                            ? "danger"
                            : data.status == "pending"
                            ? "orange"
                            : "green"
                        }`}
                      >
                        {data.status}
                      </td>
                      <td>
                        <ActionButton
                          hideDelete={"d-none"}
                          hideEdit={"d-none"}
                          eyelink={`/complaints/ViewRequestsComplaint/${
                            data.id
                          }${
                            data.status == "pending"
                              ? ""
                              : `?type=${data.status}`
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <td colSpan={10}>
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
                      ? allComplaintsData.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : allComplaintsData.length < pageSize
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

export default AllComplaints;
