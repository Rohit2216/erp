import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsCheckLg, BsEyeFill, BsXLg } from "react-icons/bs";
import { toast } from "react-toastify";
import moment from "moment";
import {
  PostApprovedRejectSurvey,
  getAllRequestedSurvey,
} from "../../services/authapi";
import CardComponent from "../../components/CardComponent";
import TooltipComponent from "../../components/TooltipComponent";
import { Link } from "react-router-dom";
import ReactPagination from "../../components/ReactPagination";

const RequestSurvey = () => {
  const [survey, setSurvey] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchAllSurveyData = async () => {
    const status = 1;
    const res = await getAllRequestedSurvey(search, pageSize, pageNo, status);
    console.log(res, "response");
    if (res.status) {
      setSurvey(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setSurvey([]);
      setPageDetail({});
    }
  };

  const handleApproved = async (data) => {
    const sData = {
      survey_id: data.survey_id,
      status: 2,
    };
    const res = await PostApprovedRejectSurvey(sData);
    if (res.status) {
      toast.success(res.message);
      setSurvey((prev) =>
        prev.filter((itm) => itm.survey_id !== +data.survey_id)
      );
    } else {
      toast.error(res.message);
    }
  };

  const handleRejected = async (data) => {
    const sData = {
      survey_id: data.survey_id,
      status: 2,
    };
    const res = await PostApprovedRejectSurvey(sData);
    if (res.status) {
      toast.success(res.message);
      setSurvey((prev) =>
        prev.filter((itm) => itm.survey_id !== +data.survey_id)
      );
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAllSurveyData();
  }, [search, pageSize, pageNo]);

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
        <title>All Survey · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"Request Survey"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {["Sr No.", "Survey", "Date", "Status", "Action"].map(
                    (thead) => (
                      <th key={thead}>{thead}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {survey?.length > 0 ? null : (
                  <tr>
                    <td colSpan={7}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {survey?.map((data, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    {console.log(data, "data")}
                    <td>{data?.title}</td>
                    <td>{moment(data?.created_at).format("DD-MM-YYYY")}</td>
                    <td>
                      <span
                        className={`text-${
                          data?.status == 1 ? "green" : "danger"
                        }`}
                      >
                        {data?.status == 1 ? "Active" : "Inactive"}{" "}
                      </span>
                    </td>
                    <td>
                      <span className="d-align gap-2">
                        {/* <TooltipComponent title={"View"}>
                          <Link to={`/ViewSurvey/${data.survey_id}`}>
                            <span className="social-btn-re d-align gap-2 px-3 w-auto success-combo">
                              <BsEyeFill />
                            </span>
                          </Link>
                        </TooltipComponent> */}
                        <div className="vr hr-shadow"></div>
                        <TooltipComponent title={"Reject"}>
                          <span
                            onClick={() => handleRejected(data)}
                            className="social-btn-re d-align gap-2 px-3 w-auto red-combo"
                          >
                            <BsXLg />
                          </span>
                        </TooltipComponent>
                        <div className="vr hr-shadow"></div>
                        <TooltipComponent title={"Approve"}>
                          <span
                            onClick={() => handleApproved(data)}
                            className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                          >
                            <BsCheckLg />
                          </span>
                        </TooltipComponent>
                      </span>
                    </td>
                  </tr>
                ))}
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
                          ? survey.length - 1 < pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                          : survey.length < pageSize
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
    </>
  );
};

export default RequestSurvey;
