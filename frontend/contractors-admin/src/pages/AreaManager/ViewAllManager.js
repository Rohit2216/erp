import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllAreaManagerTransactionById } from "../../services/contractorApi";
import { useTranslation } from "react-i18next";
import CardComponent from "../../components/CardComponent";
import { Col, Table } from "react-bootstrap";
import ReactPagination from "../../components/ReactPagination";

const ViewAllManager = () => {
  const location = useLocation();
  const id = location.state?.id;
  const { t } = useTranslation();

  const [allManagerData, setAllManagerData] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const fetchAreaManagerById = async () => {
    const res = await getAllAreaManagerTransactionById(
      search,
      pageSize,
      pageNo,
      id
    );

    if (res.status) {
      setAllManagerData(res.getBalance);
      setViewData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllManagerData([]);
      setViewData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) fetchAreaManagerById();
  }, []);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <CardComponent showBackButton={true} title={"view Area Manager"}>
      <div className="mb-3">
        <Col md={12}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("Area Manager Name")} :</th>
                    <td>{allManagerData?.name}</td>
                  </tr>
                  <tr>
                    <th>{t("Employee Id")} :</th>
                    <td>{allManagerData?.employee_id}</td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td className="text-success text-end fw-semibold fs-6">
                      <span className="text-black">
                        {" "}
                        {t("Total Amount Received")} :
                      </span>{" "}
                      {allManagerData?.total_received_non_credit}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td className="text-success text-end fw-semibold fs-6">
                      <span className="text-black"> {t("Balance")} :</span>{" "}
                      {allManagerData?.balance}
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
                <th>{t("Balance")}</th>
                <th>{t("Received Amount")}</th>
                <th>{t("Status")}</th>
                <th>{t("OTP")}</th>
                <th>{t("Transaction Id")}</th>
                <th>{t("Date")}</th>
              </tr>
            </thead>
            {isLoading ? (
              <td colSpan={9}>
                <img
                  className="p-3"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                  alt="Loading"
                />
              </td>
            ) : viewData.length > 0 ? (
              <>
                {viewData.map((data, id1) => (
                  <tr key={id1}>
                    <td className="p-2">{serialNumber[id1]}</td>
                    <td className="p-2">{data.balance}</td>
                    <td className="p-2">{data.received_amount}</td>
                    <td
                      className={`p-2 text-${
                        data.status == "credit" ? "green" : "orange"
                      }`}
                    >
                      {data.status}
                    </td>
                    <td className="p-2">{data.otp}</td>
                    <td className="p-2">{data.transaction_id || "--"}</td>
                    <td className="p-2">{data.date}</td>
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
              ? viewData.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : viewData.length < pageSize
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

export default ViewAllManager;
