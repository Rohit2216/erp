import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Table, Tooltip } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  deleteFeedbackSuggestionById,
  getAllFeedbackSuggestion,
} from "../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { MdOutlineSms } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TooltipComponent from "../../components/TooltipComponent";
import Select from "react-select";

const AllFeedbackSuggestion = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allFeedbackSuggestion, setAllFeedbackSuggestion] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [feedbackSuggestionId, setFeedbackSuggestionId] = useState({
    label: "",
    value: "",
  });
  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchBrandData = async () => {
    const res = await getAllFeedbackSuggestion(
      search,
      pageSize,
      pageNo,
      feedbackSuggestionId.value
    );

    if (res.status) {
      setAllFeedbackSuggestion(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllFeedbackSuggestion([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteFeedbackSuggestionById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllFeedbackSuggestion((prev) =>
        prev.filter((dlt) => dlt.id !== idToDelete)
      );
      fetchBrandData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchBrandData();
  }, [search, pageNo, pageSize, feedbackSuggestionId.value]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Category · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={t("All Feedback And Suggestion")}
          showBackButton={true}
          icon={<BsPlus />}
          link={`/FeedbackSuggestion/create`}
          tag={"Create"}
        >
          <div className="d-flex justify-content-end">
            <Col md={3} className="mb-3">
              <Select
                placeholder={t("--select--")}
                menuPortalTarget={document.body}
                options={[
                  {
                    label: "Feedback",
                    value: "1",
                  },
                  {
                    label: "Suggestion",
                    value: "2",
                  },
                ]}
                value={feedbackSuggestionId.value && feedbackSuggestionId}
                onChange={(e) => {
                  if (e) {
                    setFeedbackSuggestionId({
                      value: e?.value,
                      label: e?.label,
                    });
                  } else {
                    setFeedbackSuggestionId({});
                  }
                }}
                isClearable
              />
            </Col>
          </div>
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Feedback By")}</th>
                  <th>{t("title")}</th>
                  <th>{t("description")}</th>
                  <th>{t("Response From")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={4}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt={t("Loading")}
                    />
                  </td>
                ) : allFeedbackSuggestion.length > 0 ? (
                  <>
                    {allFeedbackSuggestion?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{serialNumber[idx]}</td>
                        <td>{itm?.created_by?.name ?? "--"}</td>
                        <td>{itm?.title}</td>
                        <td>
                          {itm?.description.length < 59
                            ? itm?.description
                            : itm.description.slice(0, 60) + "....."}
                        </td>
                        <td>{itm?.response_by?.name ?? "--"}</td>
                        <td
                          className={`text-${
                            itm?.status == "1" ? "green" : "orange"
                          }`}
                        >
                          {itm?.status == "1" ? "Feedback" : "Suggestion"}
                        </td>
                        <td className="d-flex justify-content-around">
                          <TooltipComponent
                            className={`${
                              itm?.response_by?.name
                                ? "danger-combo-disable  pe-none"
                                : "cursor-pointer text-green success-combo"
                            } shadow p-1 me-2`}
                            title={t("Response")}
                          >
                            <MdOutlineSms
                              className={`${
                                itm?.response_by?.name
                                  ? "danger-combo-disable  pe-none"
                                  : "cursor-pointer text-green"
                              }`}
                              size={16}
                              onClick={() =>
                                navigate(`/FeedbackSuggestion/response`, {
                                  state: {
                                    id: itm?.id,
                                  },
                                })
                              }
                            />
                          </TooltipComponent>
                          <div className="vr hr-shadow me-2" />
                          <ActionButton
                            deleteOnclick={() => {
                              setIdToDelete(itm.id);
                              setShowAlert(true);
                            }}
                            eyeOnclick={() =>
                              navigate(`/FeedbackSuggestion/view`, {
                                state: {
                                  id: itm.id,
                                },
                              })
                            }
                            hideEdit={"d-none"}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={4}>
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
                <tr>
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
                          ? allFeedbackSuggestion.length - 1 < pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                          : allFeedbackSuggestion.length < pageSize
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
                </tr>
              </tfoot>
            </Table>
          </div>
        </CardComponent>
      </Col>
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default AllFeedbackSuggestion;
