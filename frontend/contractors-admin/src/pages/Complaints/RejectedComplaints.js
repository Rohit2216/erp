import React, { useEffect, useState } from "react";
import { Button, Col, Table } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import {
  getRejectedComplaints,
  postReactiveRejectComplaints,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";
import { Link } from "react-router-dom";
import { FilterComponent } from "./FilterComponent";
import ConfirmAlert from "../../components/ConfirmAlert";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { toast } from "react-toastify";
import TooltipComponent from "../../components/TooltipComponent";
import { useTranslation } from "react-i18next";
import MultiSelectVisibility from "./MultiSelectVisibility";

const RejectedComplaints = () => {
  const [rejectedData, setRejectedData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [idToRejected, setIdToRejected] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [column, setColumn] = useState([]);

  const { t } = useTranslation();

  const fetchRejectedComplaints = async () => {
    const res = await getRejectedComplaints(
      search,
      pageSize,
      pageNo,
      salesAreaId,
      outletId,
      regionalOfficeId,
      orderById
    );
    if (res.status) {
      setRejectedData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRejectedData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleRejected = async () => {
    const res = await postReactiveRejectComplaints(idToRejected);
    if (res.status) {
      toast.success(res.message);
      setRejectedData((prev) => prev.filter((itm) => itm.id !== idToRejected));
      fetchRejectedComplaints();
    } else {
      toast.error(res.message);
    }
    setIdToRejected("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchRejectedComplaints();
  }, [
    search,
    pageNo,
    pageSize,
    salesAreaId,
    outletId,
    regionalOfficeId,
    orderById,
  ]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
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
  // {
  //   console.log(column, "columns");
  // }

  const fetchData = async () => {
    const type = "1";
    const columns = JSON.stringify(column || []);
    const pageSizeValue = "";
    const res = await getRejectedComplaints(
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
        <title>Rejected Complaints · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"Rejected Complaints"}
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
          status={4}
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
                <td colSpan={10}>
                  <img
                    className="p-3"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt="Loading"
                  />
                </td>
              ) : rejectedData.length > 0 ? (
                <>
                  {rejectedData?.map((data, idx) => (
                    <tr key={idx}>
                      <td>
                        <Link
                          className="text-secondary text-none"
                          to={`/rejected-complaints/ViewRequestsComplaint/${data.id}?type=rejected`}
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
                      <td className={`text-danger`}>{data.status}</td>
                      <td>
                        <ActionButton
                          hideDelete={"d-none"}
                          hideEdit={"d-none"}
                          eyelink={`/rejected-complaints/ViewRequestsComplaint/${data.id}?type=rejected`}
                          custom={
                            <>
                              <div className={`vr hr-shadow`} />
                              <TooltipComponent
                                title={"Re-Active"}
                                align="left"
                              >
                                <Button className={`view-btn`} variant="light">
                                  <BsArrowCounterclockwise
                                    onClick={() => {
                                      setIdToRejected(data.id);
                                      setShowAlert(true);
                                    }}
                                    className={`social-btn danger-combo`}
                                  />
                                </Button>
                              </TooltipComponent>
                            </>
                          }
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
                      ? rejectedData.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : rejectedData.length < pageSize
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
        defaultIcon={<BsArrowCounterclockwise />}
        deleteFunction={handleRejected}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Re-Active"}
        description={"Are you sure you want to re-active this!!"}
      />
    </Col>
  );
};

export default RejectedComplaints;
