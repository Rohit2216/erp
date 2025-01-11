import React, { useEffect, useState } from "react";
import {
  discardMeasurementsById,
  getAllmeasurementByStatus,
} from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import TooltipComponent from "../../components/TooltipComponent";
import { FilterComponentInMeasurement } from "./FilterComponentInMeasurement";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { FcCancel } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { MdPreview } from "react-icons/md";
import { MdOutlineChangeCircle } from "react-icons/md";

export default function AllFinal() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [discardDetails, setDiscardDetails] = useState({});
  const [showDiscard, setShowDiscard] = useState(false);
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    let status = 4;
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
  const handleDiscard = async () => {
    const data = {
      id: discardDetails?.id,
      complaint_id: discardDetails?.complaint_id,
      measurement_amount: discardDetails?.measurement_amount,
      po_id: discardDetails.po_id,
    };
    const res = await discardMeasurementsById(data);
    if (res.status) {
      toast.success(res.message);
      setAllComplaints((prev) =>
        prev.filter((itm) => itm.id !== discardDetails.id)
      );
    } else {
      toast.error(res.message);
    }

    setShowDiscard(false);
    setDiscardDetails({});
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
          status={4}
          filterFor={"final"}
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
                      editOnclick={() =>
                        navigate(`/Measurements/CreateMeasurement/${data.id}`, {
                          state: {
                            editFrom: "final",
                          },
                        })
                      }
                      custom={
                        <>
                          {" "}
                          <TooltipComponent align="left" title={"discard"}>
                            <Button
                              className={`view-btn`}
                              variant="light"
                              onClick={() => {
                                setShowDiscard(true);
                                setDiscardDetails(data);
                              }}
                            >
                              <FcCancel className={`social-btn red-combo`} />
                            </Button>
                          </TooltipComponent>
                          <TooltipComponent
                            align="left"
                            title={"View Timeline"}
                          >
                            <Button
                              className={`view-btn`}
                              variant="light"
                              onClick={() => {
                                navigate(`/view-measurement-timeline`, {
                                  state: {
                                    measurement_id: data.id,
                                  },
                                });
                              }}
                            >
                              <MdPreview className={`social-btn red-combo`} />
                            </Button>
                          </TooltipComponent>
                          <TooltipComponent align="left" title={"Change Po"}>
                            <Button
                              className={`view-btn`}
                              variant="light"
                              onClick={() => {
                                navigate(`/change-po-number/${data.id}`, {
                                  state: {
                                    measurement_id: data.id,
                                  },
                                });
                              }}
                            >
                              <MdOutlineChangeCircle
                                className={`social-btn purple-combo`}
                              />
                            </Button>
                          </TooltipComponent>
                        </>
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>

            <ConfirmAlert
              size={"sm"}
              deleteFunction={handleDiscard}
              hide={setShowDiscard}
              show={showDiscard}
              title={"Confirm Discard"}
              description={"Are you sure you want to discard this!!"}
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
