import React, { useState, useEffect } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { BsEyeFill, BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import { changeStatusEarthingTesting } from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { getAllEarthingTesting } from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EarthingTesting = () => {
  const [requireData, setRequireData] = useState([]);
  const [edit, setEdit] = useState({});
  const [viewDetails, setViewDetails] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAllAssetsRepairRequireData = async () => {
    const res = await getAllEarthingTesting({ search, pageSize, pageNo });
    if (res.status) {
      setRequireData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRequireData([]);
      setPageDetail({});
    }
    setIsLoading(false);
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
        title={"All Earthing Testing"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        icon={<BsPlus />}
        link={`/earthing-testing/create/new`}
        tag={"Create"}
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
                <th>{t("status")}</th>
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
                      <td
                        className={`${
                          itm.status == "1"
                            ? "text-orange"
                            : itm.status == "2"
                            ? "text-green"
                            : itm.status == "3"
                            ? "text-danger"
                            : "text-black"
                        }`}
                      >
                        {itm.status == "1"
                          ? "requested"
                          : itm.status == "2"
                          ? "approved"
                          : itm.status == "3"
                          ? "rejected"
                          : ""}
                      </td>
                      <td>
                        <ActionButton
                          hideDelete={"d-none"}
                          hideEdit={"d-none"}
                          eyeOnclick={() =>
                            navigate(`/earthing-testing/view`, {
                              state: {
                                id: itm.id,
                              },
                            })
                          }
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

      {/* <Modaljs
        open={viewDetails}
        hideFooter={false}
        size={"md"}
        close={() => setViewDetails(true)}
        title={
          <>
            <BsEyeFill className="text-green" /> Assets Repair Require Detials
          </>
        }
      >
        <Row className="g-3 py-1">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">Details</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {edit?.asset_name && (
                      <tr>
                        <th>Asset Name :</th>
                        <td>{edit?.asset_name}</td>
                      </tr>
                    )}
                    {edit?.asset_model_number && (
                      <tr>
                        <th>asset model no :</th>
                        <td>{edit?.asset_model_number}</td>
                      </tr>
                    )}
                    {edit?.label && (
                      <tr>
                        <th>label :</th>
                        <td
                          className={`text-${
                            edit?.label === "1"
                              ? "green"
                              : edit?.label === "2"
                              ? "danger"
                              : "orange"
                          }`}
                        >
                          {edit?.label === "1"
                            ? "Normal"
                            : edit?.label === "2"
                            ? "Important"
                            : "Urgent"}
                        </td>
                      </tr>
                    )}
                    {edit?.requested_by && (
                      <tr>
                        <th>requested by :</th>
                        <td>{edit?.requested_by}</td>
                      </tr>
                    )}
                    {edit?.requested_at && (
                      <tr>
                        <th>requested at :</th>
                        <td>{edit?.requested_at}</td>
                      </tr>
                    )}
                    {edit?.viewed_by_name && (
                      <tr>
                        <th>viewed by :</th>
                        <td>{edit?.viewed_by_name}</td>
                      </tr>
                    )}
                    {edit?.viewed_at && (
                      <tr>
                        <th>viewed at :</th>
                        <td>{edit?.viewed_at}</td>
                      </tr>
                    )}
                    {edit?.description && (
                      <tr>
                        <th>description :</th>
                        <td>{edit?.description}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </Modaljs> */}
    </Col>
  );
};

export default EarthingTesting;
