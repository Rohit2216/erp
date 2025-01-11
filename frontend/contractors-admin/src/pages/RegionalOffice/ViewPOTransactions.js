import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getAllPOTransactionById,
  getAllRegionalOfficeTransactionById,
} from "../../services/contractorApi";
import { useTranslation } from "react-i18next";
import CardComponent from "../../components/CardComponent";
import { Col, Table } from "react-bootstrap";
import ReactPagination from "../../components/ReactPagination";

const ViewPOTransactions = () => {
  const location = useLocation();
  const id = location.state?.id;
  const { t } = useTranslation();

  const [allRoData, setAllRoData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const fetchAreaManagerById = async () => {
    const res = await getAllPOTransactionById(search, pageSize, pageNo, id);
    if (res.status) {
      setAllRoData(res);
      setPageDetail(res.pageDetails);
    } else {
      setAllRoData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAreaManagerById();
  }, []);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <CardComponent showBackButton={true} title={"Purchase order transactions"}>
      <div className="mb-3">
        <Col md={12}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("po number")} :</th>
                    <td>{allRoData.getBalance?.po_number}</td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td className="text-success text-end fw-semibold fs-6">
                      <span className="text-black">
                        {" "}
                        {t("Total Amount Received")} :
                      </span>{" "}
                      ₹ {allRoData?.getBalance?.total_received_non_credit || 0}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td className="text-success text-end fw-semibold fs-6">
                      <span className="text-black"> {t("Balance")} :</span> ₹
                      {parseFloat(allRoData?.getBalance?.balance).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </div>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <div className="table-scroll mb-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Total Received amount")}</th>
                <th>{t("Balance")}</th>
                <th>{t("Payment Mode")}</th>
                <th>{t("Transaction Id")}</th>
              </tr>
            </thead>
            {isLoading ? (
              <td colSpan={9}>
                <img
                  className="p-3"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                  alt={t("Loading")}
                />
              </td>
            ) : allRoData.data.length > 0 ? (
              <>
                {allRoData.data.map((data, id1) => (
                  <tr key={id1}>
                    <td className="p-2">{serialNumber[id1]}</td>
                    <td className="p-2">₹ {data.amount_received}</td>
                    <td className="p-2">₹ {data.balance}</td>
                    <td className="p-2">{data.status}</td>
                    <td className="p-2">{data.transaction_id ?? "--"}</td>
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

            <tfoot></tfoot>
          </Table>
        </div>
        <ReactPagination
          pageSize={pageSize}
          prevClassName={
            pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
          }
          nextClassName={
            pageSize == pageDetail?.total
              ? allRoData.data?.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : allRoData.data?.length < pageSize
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
      </Col>
    </CardComponent>
  );
};

export default ViewPOTransactions;
