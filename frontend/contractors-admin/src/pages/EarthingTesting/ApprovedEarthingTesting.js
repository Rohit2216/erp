import React, { useState, useEffect } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { BsEyeFill, BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import {
  approveRejectEarthingTestingById,
  changeStatusEarthingTesting,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { getAllEarthingTesting } from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ApprovedEarthingTesting = () => {
  const [requireData, setRequireData] = useState([]);
  const [earthingTestingId, setEarthingTestingId] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [edit, setEdit] = useState({});
  const [viewDetails, setViewDetails] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAllAssetsRepairRequireData = async () => {
    const status = 2;
    const res = await getAllEarthingTesting({
      search,
      pageSize,
      pageNo,
      status,
    });
    if (res.status) {
      setRequireData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRequireData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleApproveReject = async () => {
    console.log(requireData, "require data");
    const status = "3";
    const res = await approveRejectEarthingTestingById(
      status,
      earthingTestingId
    );

    if (res.status) {
      toast.success(res.message);
      setRequireData((prev) =>
        prev.filter((itm) => itm.id !== earthingTestingId)
      );
      setPageDetail({
        ...pageDetail,
        total: +pageDetail.total - 1,
        pageEndResult: pageDetail.pageEndResult - 1,
      });
    } else {
      toast.error(res.message);
    }

    setEarthingTestingId("");
    setShowReject(false);
  };

  useEffect(() => {
    fetchAllAssetsRepairRequireData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <Col md={12}>
      <CardComponent
        title={"Approved Earthing Testing"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
      >
        <div className="table-scroll p-2 mb-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Complaint id")}</th>
                <th>{t("Complaint Type")}</th>
                <th>{t("Outlet Data")}</th>
                <th>{t("User Data")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <td colSpan={7}>
                  <img
                    className="p-3"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt="Loading"
                  />
                </td>
              ) : requireData.length > 0 ? (
                <>
                  {requireData?.map((itm, idx) => (
                    <tr key={idx}>
                      <td>{serialNumber[idx]}</td>
                      <td>{itm?.complaint_unique_id}</td>
                      <td>{itm?.complaint_type_name}</td>
                      <td>
                        <span className="d-grid gap-2">
                          {itm?.outletData?.map((itm, i1) => (
                            <div key={i1} className="shadow px-1">
                              {i1 + 1}. {itm.outlet_name}
                            </div>
                          ))}
                        </span>
                      </td>
                      <td>
                        <span className="d-grid gap-2">
                          {itm?.user_data?.map((itm, i1) => (
                            <div key={i1} className="shadow px-1">
                              {i1 + 1}. {itm.name}
                            </div>
                          ))}
                        </span>
                      </td>
                      <td>
                        <ActionButton
                          hideDelete={"d-none"}
                          eyeOnclick={() =>
                            navigate(`/earthing-testing/view`, {
                              state: {
                                id: itm.id,
                              },
                            })
                          }
                          rejectOnclick={() => {
                            setEarthingTestingId(itm.id);
                            setShowReject(true);
                          }}
                          editlink={`/earthing-testing/create/${itm.id}`}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <td colSpan={7}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
              )}
            </tbody>
          </Table>
        </div>
        <ReactPagination
          pageSize={pageSize}
          prevClassName={
            pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
          }
          nextClassName={
            pageSize == pageDetail?.total
              ? requireData.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : requireData.length < pageSize
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
      </CardComponent>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproveReject}
        hide={setShowReject}
        show={showReject}
        title={"Confirm reject"}
        description={"Are you sure you want to reject this!!"}
      />
    </Col>
  );
};

export default ApprovedEarthingTesting;
