import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  deleteQuotationById,
  getAllQuotation,
} from "../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { color } from "d3";
import { useTranslation } from "react-i18next";

const WorkQuotations = () => {
  const [quotation, setQuotation] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const fetchWorkQuotationsData = async () => {
    const res = await getAllQuotation(search, pageSize, pageNo);
    console.log(res.data[1].status, "status");
    if (res.status) {
      setQuotation(res.data);

      setPageDetail(res.pageDetails);
    } else {
      setQuotation([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteQuotationById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setQuotation((prev) => prev.filter((itm) => itm.id !== idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchWorkQuotationsData();
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
        <title>Work Quotation · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={t("Work Quotation")}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("quotation date")}</th>
                  <th>{t("quotations number")}</th>
                  <th>{t("Regional office")}</th>
                  <th>{t("sales area")}</th>
                  <th>{t("outlet")}</th>
                  <th>{t("po")}</th>
                  <th>{t("Complaint Type")}</th>
                  <th>{t("status")}</th>
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
                ) : quotation.length > 0 ? (
                  <>
                    {quotation.map((data, id1) => (
                      <tr key={id1}>
                        <td>{serialNumber[id1]}</td>
                        <td>{data.quotation_dates}</td>
                        <td>{data.quotations_number}</td>
                        <td>{data.regional_office_name}</td>
                        <td>{data.sales_area_name}</td>
                        <td>{data.outlet_name}</td>
                        <td>{data.po_name}</td>
                        <td>{data.complaint_type}</td>
                        <td
                          className={`${
                            data.status == "1"
                              ? "text-orange"
                              : data.status == "2"
                              ? "text-green"
                              : data.status == "3"
                              ? "text-danger"
                              : ""
                          }`}
                        >
                          {data.status == "1"
                            ? "requested"
                            : data.status == "2"
                            ? "approved"
                            : data.status == "3"
                            ? "rejected"
                            : ""}
                        </td>
                        <td>
                          <ActionButton
                            eyeOnclick={() =>
                              navigate(`/create-quotation/${data.id}?type=view`)
                            }
                            hideEdit={"d-none"}
                            hideDelete={"d-none"}
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
                    <ReactPagination
                      pageSize={pageSize}
                      prevClassName={
                        pageNo === 1
                          ? "danger-combo-disable pe-none"
                          : "red-combo"
                      }
                      nextClassName={
                        pageSize == pageDetail?.total
                          ? quotation.length - 1 < pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                          : quotation.length < pageSize
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

export default WorkQuotations;
