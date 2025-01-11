import React, { useEffect, useState } from "react";
import { getAllmeasurementByStatus } from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { FilterComponentInMeasurement } from "./FilterComponentInMeasurement";
import { useTranslation } from "react-i18next";

export default function AllDraft() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    let status = 3;
    const res = await getAllmeasurementByStatus(
      salesAreaId,
      regionalOfficeId,
      outletId,
      orderById,
      pageSize,
      pageNo,
      search,
      status
    );

    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [pageNo, pageSize, outletId, regionalOfficeId, salesAreaId, orderById]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <div>
      <div className="p-3">
        <FilterComponentInMeasurement
          setSalesAreaId={setSalesAreaId}
          setOutletId={setOutletId}
          setRegionalOfficeId={setRegionalOfficeId}
          setOrderById={setOrderById}
          status={3}
          filterFor={"draft"}
        ></FilterComponentInMeasurement>
        <div className="table-scroll">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("COMPLAINT NO.")}</th>
                <th>{t("COMPLAINT TYPE")}</th>
                <th>{t("OUTLET")}</th>
                <th>{t("ro")}</th>
                <th>{t("sa")}</th>
                <th>{t("PO Number")}</th>
                <th>{t("ORDER BY")}</th>
                <th>{t("status")}</th>
                <th>
                  {t("measurement")} <br />
                  {t("Amount")}
                </th>
                <th>
                  {t("measurement")} <br /> {t("date")}
                </th>
                <th>
                  {t("po")} {t("Amount")}
                </th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {allComplaints.length > 0 ? null : (
                <tr>
                  <td colSpan={12}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              )}

              {allComplaints.map((data, id1) => (
                <tr key={id1}>
                  <td className="fw-bolder text-green">
                    {data?.complaint_unique_id ?? "--"}
                  </td>
                  <td>{data?.complaint_type_name ?? "--"}</td>
                  <td>{data?.outlet_name ?? "--"}</td>
                  <td>{data?.regional_office_name}</td>
                  <td>{data?.sales_area_name ?? "--"}</td>
                  <td>{data?.po_number ?? "--"}</td>
                  <td className="">{data?.order_by_name}</td>
                  <td className="fw-bold ">{data?.status}</td>
                  <td>{data?.measurement_amount}</td>
                  <td>{data?.measurement_date}</td>
                  <td>{data?.po_limit}</td>

                  <td>
                    <ActionButton
                      hideDelete={"d-none"}
                      eyeOnclick={() =>
                        navigate(`/view-measurement-details`, {
                          state: {
                            complaint_id: data?.id,
                          },
                        })
                      }
                      // editlink={`/Measurements/CreateMeasurement/${data.id}`}
                      editOnclick={() =>
                        navigate(`/Measurements/CreateMeasurement/${data.id}`, {
                          state: {
                            editFrom: "draft",
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
                      ? allComplaints.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : allComplaints.length < pageSize
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
