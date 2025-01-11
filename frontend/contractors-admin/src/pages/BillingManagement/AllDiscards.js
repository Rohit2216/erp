import React, { useEffect, useState } from "react";
import { FilterComponent } from "../Complaints/FilterComponent";
import {
  discardMeasurementsById,
  getAllComplaintsForMeasurement,
  getAllmeasurementByStatus,
  getPendingComplains,
  reactiveMeasurementsById,
} from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import TooltipComponent from "../../components/TooltipComponent";
import { IoIosAttach } from "react-icons/io";
import { FilterComponentInMeasurement } from "./FilterComponentInMeasurement";
import { toast } from "react-toastify";
import { BsHourglassTop } from "react-icons/bs";
import ConfirmAlert from "../../components/ConfirmAlert";
import { IoRefreshCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export default function AllDiscards() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [reactiveDetails, setReactiveDetails] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    let status = 2;
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

  const handleReactive = async () => {
    const data = {
      id: reactiveDetails?.id,
      complaint_id: reactiveDetails?.complaint_id,
      measurement_amount: reactiveDetails?.measurement_amount,
      po_id: reactiveDetails.po_id,
    };
    const res = await reactiveMeasurementsById(data);
    if (res.status) {
      toast.success(res.message);
      setAllComplaints((prev) =>
        prev.filter((itm) => itm.id !== reactiveDetails.id)
      );
    } else {
      toast.error(res.message);
    }

    setShowDiscard(false);
    setReactiveDetails({});
  };

  return (
    <div>
      <div className="p-3">
        <FilterComponentInMeasurement
          setSalesAreaId={setSalesAreaId}
          setOutletId={setOutletId}
          setRegionalOfficeId={setRegionalOfficeId}
          setOrderById={setOrderById}
          status={2}
          filterFor={"discard"}
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
                      custom={
                        <TooltipComponent align="left" title={"re-active"}>
                          <Button
                            className={`view-btn`}
                            variant="light"
                            onClick={() => {
                              setShowDiscard(true);
                              setReactiveDetails(data);
                            }}
                          >
                            <IoRefreshCircleOutline
                              className={`social-btn red-combo`}
                            />
                          </Button>
                        </TooltipComponent>
                      }
                      hideEdit={"d-none"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>

            <ConfirmAlert
              size={"sm"}
              deleteFunction={handleReactive}
              hide={setShowDiscard}
              show={showDiscard}
              title={"Confirm Re-active"}
              description={"Are you sure you want to re-active this!!"}
            />
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
