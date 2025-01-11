import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Table } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import ActionButton from "../../../components/ActionButton";
import Select from "react-select";
import ReactPagination from "../../../components/ReactPagination";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  deleteBillNoFormatById,
  getAllBillNoFormat,
  getAllFinancialYears,
} from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";

const BillNoFormat = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allBillNoFormat, setAllBillNoFormat] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();

  const fetchBillNoFormatData = async () => {
    const res = await getAllBillNoFormat(search, pageSize, pageNo);
    if (res.status) {
      setAllBillNoFormat(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllBillNoFormat([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYears();
    if (res.status) {
      setAllFinancialYear(res.data);
    } else {
      setAllFinancialYear([]);
    }
  };

  const handleDelete = async () => {
    const res = await deleteBillNoFormatById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllBillNoFormat((prev) => prev.filter((dlt) => dlt.id !== idToDelete));
      fetchBillNoFormatData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchBillNoFormatData();
    showFinancialYearApi();
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
        <title>Bill Number Format · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"Bill Number Format"}
          custom={
            <Select
              menuPortalTarget={document.body}
              placeholder={t("Financial Year")}
              options={allFinancialYear?.map((year) => ({
                label: year.year_name,
                value: year.year_name,
              }))}
              isClearable
              onChange={(e) => {
                setSearch(e ? e.value : null);
              }}
            />
          }
          link={`/bill-no-format/create-bill-no-format/new`}
          tag={"Create"}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Prefix")}</th>
                  <th>{t("Financial Year Format")}</th>
                  <th>{t("Start Bill Number")}</th>
                  <th>{t("Financial Year")}</th>
                  <th>{t("Sample Format")}</th>
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
                      alt={t("Loading")}
                    />
                  </td>
                ) : allBillNoFormat.length > 0 ? (
                  <>
                    {allBillNoFormat?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{serialNumber[idx]}</td>
                        <td>{itm?.prefix}</td>
                        <td>{itm?.financial_year_format}</td>
                        <td>{itm?.start_bill_number}</td>
                        <td>{itm?.financial_year}</td>
                        <td className="text-secondary">{itm?.sample_format}</td>
                        <td>
                          <ActionButton
                            hideEye={"d-none"}
                            deleteOnclick={() => {
                              setIdToDelete(itm.id);
                              setShowAlert(true);
                            }}
                            editlink={`/bill-no-format/create-bill-no-format/${itm?.id}`}
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
              <tfoot>
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
                        ? allBillNoFormat.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : allBillNoFormat.length < pageSize
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

export default BillNoFormat;
