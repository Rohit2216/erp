import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";

import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  approveRejectOutletById,
  deleteOutletById,
  getAllOutlet,
} from "../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { useTranslation } from "react-i18next";

const ApprovedOutlet = () => {
  const [outlet, setOutlet] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [outletId, setOutletId] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchOutletAllData = async () => {
    const status = 2;
    const res = await getAllOutlet(search, pageSize, pageNo, status);
    console.log(res.data, "datata");
    if (res.status) {
      setOutlet(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setOutlet([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteOutletById(outletId);
    if (res.status) {
      toast.success(res.message);
      setOutlet((prev) => prev.filter((data) => data.id != outletId));
    } else {
      toast.error(res.message);
    }
    setOutletId("");
    setShowDelete(false);
  };

  const handleApproveReject = async () => {
    const status = "3";
    const res = await approveRejectOutletById(status, outletId);
    if (res.status) {
      toast.success(res.message);
      setOutlet((prev) => prev.filter((itm) => itm.id !== outletId));
      setPageDetail({
        ...pageDetail,
        total: +pageDetail.total - 1,
        pageEndResult: pageDetail.pageEndResult - 1,
      });
    } else {
      toast.error(res.message);
    }
    setOutletId("");
    setShowReject(false);
  };

  useEffect(() => {
    fetchOutletAllData();
  }, [search, pageNo, pageSize]);

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
        <title>Outlet Management · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"Approved Outlet"}
        >
          <div className="table-scroll  mb-2">
            <Table className="text-body bg-new Roles">
              {console.log(pageDetail, "pageDetails")}
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Outlet Name")}</th>
                  <th>{t("Energy Company Name")}</th>
                  <th>{t("Zone Name")}</th>
                  <th>{t("Regional Office Name")}</th>
                  <th>{t("Sales Area Name")}</th>
                  <th>{t("District Name")}</th>
                  <th>{t("Outlet Unique Id")}</th>
                  <th>{t("Outlet Category")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={9}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : outlet.length > 0 ? (
                  <>
                    {outlet.map((data, id1) => (
                      <tr key={id1}>
                        <td>{serialNumber[id1]}</td>
                        <td>{data.outlet_name}</td>
                        <td>{data.energy_company_name}</td>
                        <td>{data.zone_name}</td>
                        <td>{data.regional_office_name}</td>
                        <td>{data.sales_area_name}</td>
                        <td>{data.district_name}</td>
                        <td>{data.outlet_unique_id}</td>
                        <td>{data.outlet_category}</td>
                        <td>
                          <ActionButton
                            eyeOnclick={() =>
                              navigate(`/outlet/create/${data.id}?type=view`)
                            }
                            editOnclick={() =>
                              navigate(`/outlet/create/${data.id}`)
                            }
                            rejectOnclick={() => {
                              setOutletId(data.id);
                              setShowReject(true);
                            }}
                            deleteOnclick={() => {
                              setOutletId(data.id);
                              setShowDelete(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={9}>
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
                    <ConfirmAlert
                      size={"sm"}
                      deleteFunction={handleDelete}
                      hide={setShowDelete}
                      show={showDelete}
                      title={"Confirm Delete"}
                      description={"Are you sure you want to delete this!!"}
                    />

                    <ConfirmAlert
                      size={"sm"}
                      deleteFunction={handleApproveReject}
                      hide={setShowReject}
                      show={showReject}
                      title={"Confirm reject"}
                      description={"Are you sure you want to reject this!!"}
                    />
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>

          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? outlet.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : outlet.length < pageSize
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
      </Col>
    </>
  );
};

export default ApprovedOutlet;
