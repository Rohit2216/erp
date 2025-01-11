import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import ReactPagination from "../../../components/ReactPagination";
import ActionButton from "../../../components/ActionButton";
import "react-best-tabs/dist/index.css";
import {
  getAllOutletForFundInOffice,
  getAllRegionalForFundInOffice,
  getAllSalesForFundInOffice,
  getOfficeFundRequestForApproved,
} from "../../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import MultiSelectVisibility from "../../Complaints/MultiSelectVisibility";

export default function ApprovedFund() {
  const navigate = useNavigate();
  const [expenseRequest, setExpenseRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allOutletArea, setAllOutletArea] = useState([]);
  const [allRoOffice, setAllRoOffice] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState("");
  const [RegionalId, setRegionalId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [column, setColumn] = useState([]);

  const { t } = useTranslation();

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const fetchApproveFundRequest = async () => {
    const res = await getOfficeFundRequestForApproved(
      salesAreaId,
      RegionalId,
      outletId,
      pageSize,
      pageNo
    );

    if (res.status) {
      setExpenseRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setExpenseRequest([]);
      setPageDetail({});
    }
  };

  const fetchSalesArea = async () => {
    const res = await getAllSalesForFundInOffice(2);
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };
  const fetchOutletArea = async () => {
    const res = await getAllOutletForFundInOffice(2);
    if (res.status) {
      setAllOutletArea(res.data);
    } else {
      setAllOutletArea([]);
    }
  };
  const fetchRoOffice = async () => {
    const res = await getAllRegionalForFundInOffice(2);
    if (res.status) {
      setAllRoOffice(res.data);
    } else {
      setAllRoOffice([]);
    }
  };

  useEffect(() => {
    fetchOutletArea();
    fetchRoOffice();
    fetchSalesArea();
  }, []);

  useEffect(() => {
    fetchApproveFundRequest();
  }, [outletId, RegionalId, salesAreaId]);

  const headerNames = [
    { name: "Id", value: "id" },
    { name: "Outlet Id", value: "outlet_unique_id" },
    { name: "Outlet Name", value: "outlet_name" },
    { name: "regional office", value: "regional_office_name" },
    { name: "Sales Area", value: "sales_area_name" },
    { name: "Total Amount", value: "total_amount" },
    { name: "Total Complaints", value: "total_complaints" },
    { name: "status", value: "status" },
  ];

  const handleClickExcel = async () => {
    fetchData();
  };
  const fetchData = async () => {
    const type = "1";
    const columns = JSON.stringify(column || ["id", "outlet_unique_id"]);
    const pageSizeValue = "";
    const search = "";
    const res = await getOfficeFundRequestForApproved(
      salesAreaId,
      RegionalId,
      outletId,
      pageSizeValue,
      pageNo,
      search,
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
    <div>
      <div className="m-3 d-flex">
        <Form.Group as={Col} md="3" className="m-1">
          <Form.Label className="small">{t("regional_office")}</Form.Label>
          <Select
            placeholder={t("Regional Office")}
            menuPortalTarget={document.body}
            isClearable={true}
            options={allRoOffice?.map((user) => ({
              label: user.regional_office_name,
              value: user.id,
            }))}
            onChange={(e) => {
              setRegionalId(e?.value);
            }}
          />
        </Form.Group>

        <Form.Group as={Col} md="3" className="m-1">
          <Form.Label className="small">{t("Sales Area")}</Form.Label>
          <Select
            placeholder={t("Sales Area")}
            menuPortalTarget={document.body}
            isClearable={true}
            options={allSalesArea?.map((user) => ({
              label: user.sales_area_name,
              value: user.id,
            }))}
            onChange={(e) => setSalesAreaId(e?.value)}
          />
        </Form.Group>

        <Form.Group as={Col} md="3" className="m-1">
          <Form.Label className="small">{t("Outlet Name")} </Form.Label>
          <Select
            placeholder={t("Outlet")}
            menuPortalTarget={document.body}
            isClearable={true}
            options={allOutletArea?.map((user) => ({
              label: user.outlet_name,
              value: user.id,
            }))}
            onChange={(e) => setOutletId(e?.value)}
          />
        </Form.Group>
      </div>
      <Col md="3" className="m-3">
        <MultiSelectVisibility
          headerNames={headerNames}
          setColumn={setColumn}
          column={column}
        ></MultiSelectVisibility>
      </Col>
      <Col className="ms-3" md={"5"}>
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
      <div className="p-3">
        <div className="table-scroll">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                {[
                  "outlet_id",
                  "Outlet Name",
                  "regional_office",
                  "Sales Area",
                  "Total Amount",
                  "Total Complaints",
                  "status",
                  "Action",
                ].map((thead) => (
                  <th key={thead}>{t(thead)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenseRequest.length > 0 ? null : (
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
              {expenseRequest.map((data, id1) => (
                <tr key={id1}>
                  <td>{data.outlet?.[0]?.outlet_unique_id}</td>
                  <td>{data?.outlet?.[0]?.outlet_name ?? "--"}</td>
                  <td>
                    {data?.regionalOffice?.[0]?.regional_office_name ?? "--"}
                  </td>
                  <td>{data?.saleAreaDetails?.[0]?.sales_area_name ?? "--"}</td>
                  <td className="fw-bolder text-green">{data?.total_amount}</td>
                  <td>{data?.total_complaints}</td>
                  <td className="text-green">
                    {data.status == "2" && "Approved"}
                  </td>

                  <td>
                    <ActionButton
                      hideDelete={"d-none"}
                      hideEdit={"d-none"}
                      eyeOnclick={() =>
                        navigate(`/view-office-fund`, {
                          state: {
                            outletId: data?.outlet?.[0]?.id,
                            month: data?.month,
                            type: "approved",
                          },
                        })
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
                    pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                  }
                  nextClassName={
                    pageSize == pageDetail?.total
                      ? expenseRequest.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : expenseRequest.length < pageSize
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
  );
}
