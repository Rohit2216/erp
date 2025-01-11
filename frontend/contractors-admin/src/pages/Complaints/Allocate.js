import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsEyeFill } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import TooltipComponent from "../../components/TooltipComponent";
import {
  getAreaManagerAssign,
  getSupervisorAssign,
  getApprovedComplaints,
  getAllEndUser,
  postChangeStatusComplaints,
} from "../../services/contractorApi";
import { Link } from "react-router-dom";
import ReactPagination from "../../components/ReactPagination";
import { FilterComponent } from "./FilterComponent";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import MultiSelectVisibility from "./MultiSelectVisibility";

const Allocate = () => {
  const [allocateData, setAllocateData] = useState([]);
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
  const [modal, setModal] = useState({
    open: false,
    data: "",
  });
  const [statusName, setStatusName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [column, setColumn] = useState([]);

  const { t } = useTranslation();

  const fetchAllocateComplaints = async () => {
    const res = await getApprovedComplaints(
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
      setAllocateData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllocateData([]);
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

  const changeStatus = async (id, status) => {
    if (status == "") return;
    let params = {
      complaint_id: id,
      status: status,
    };
    const res = await postChangeStatusComplaints(params);
    if (res.status) {
      toast.success(res?.message);
      setStatusName("");
      setModal((e) => ({ ...e, open: false, data: "" }));
      setRefresh((e) => !e);
    } else {
      toast.error(res?.message);
    }
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };
  const handleUpdateStatus = (data) => {
    setModal({ ...modal, open: true, data: data });
  };
  useEffect(() => {
    fetchManagers();
    fetchSupervisors();
    fetchEndUser();
  }, []);

  useEffect(() => {
    fetchAllocateComplaints();
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
    refresh,
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
  };
  return (
    <>
      <Helmet>
        <title>Allocate · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={t("Allocate")}
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
            status={3}
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
                ) : allocateData.length > 0 ? (
                  <>
                    {allocateData?.map((data, idx) => (
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
                            : "--"}
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
                            : "--"}
                        </td>
                        <td>
                          {data.checkUsersAssign?.[0]?.endUserDetails?.length >
                          0
                            ? data?.checkUsersAssign?.[0]?.endUserDetails?.map(
                                (val) => {
                                  return (
                                    <div
                                      className="shadow px-1"
                                      style={{ marginTop: "5px" }}
                                    >
                                      {val?.name ?? "--"}
                                    </div>
                                  );
                                }
                              )
                            : "--"}
                        </td>
                        <td>{data.order_by_details}</td>
                        <td>{data.energy_company_name}</td>
                        <td className={`text-green`}>{data.status}</td>
                        <td
                          className="d-align gap-2"
                          style={{ marginTop: "20px" }}
                        >
                          <span className="d-align gap-2">
                            <TooltipComponent align={"left"} title={"View"}>
                              <Link
                                to={`ViewRequestsComplaint/${data.id}?type=approve`}
                              >
                                <BsEyeFill className="social-btn success-combo" />
                              </Link>
                            </TooltipComponent>
                          </span>
                          <span className="d-align gap-2">
                            <TooltipComponent
                              align={"left"}
                              title={"Update Status"}
                            >
                              <GrUpdate
                                className="social-btn "
                                onClick={() => {
                                  handleUpdateStatus(data);
                                }}
                              />
                            </TooltipComponent>
                          </span>
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
                      pageNo === 1
                        ? "danger-combo-disable pe-none"
                        : "red-combo"
                    }
                    nextClassName={
                      pageSize == pageDetail?.total
                        ? allocateData.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : allocateData.length < pageSize
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
        <ConfirmAlert
          size={"sm"}
          deleteFunction={() => {
            changeStatus(modal.data?.id, statusName);
          }}
          hide={() => setModal((e) => ({ ...e, open: false }))}
          show={modal.open}
          title={"Confirm UPDATE"}
          description={
            <>
              Are you sure you want to update status!
              <Select
                menuPosition="fixed"
                className="mt-2 text-start"
                placeholder="--Update Status--"
                options={[
                  {
                    label: "Hold",
                    value: 6,
                  },
                  {
                    label: "Resolve",
                    value: 5,
                  },
                ]}
                onChange={(e) => {
                  setStatusName(e.value);
                }}
                isClearable={true}
              ></Select>
            </>
          }
        />
      </Col>
    </>
  );
};

export default Allocate;
