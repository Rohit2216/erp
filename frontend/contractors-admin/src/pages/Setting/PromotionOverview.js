import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";
import { Col, Table } from "react-bootstrap";
import { getAllPaymentsetting } from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";

const PromotionOverview = () => {
  const [allOverviewData, setAllOverviewData] = useState([]);
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [pageDetail, setPageDetail] = useState({});

  const { t } = useTranslation();

  const fetchAllOverview = async () => {
    const res = await getAllPaymentsetting(search, pageSize, pageNo);
    if (res.status) {
      setAllOverviewData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllOverviewData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllOverview();
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
        title={"Promotion Overview"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
      >
        <div className="table-scroll p-2 mb-2">
          <Table className="text-body  Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Regional Office")}</th>
                <th>{t("gst")}</th>
                <th>{t("tds")}</th>
                <th>{t("tds with gst")}</th>
                <th>{t("Retention money")}</th>
                <th>{t("Promotion Expense")}</th>
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
              ) : allOverviewData.length > 0 ? (
                <>
                  {allOverviewData.map((data, idx) => (
                    <tr key={idx}>
                      <td>{serialNumber[idx]}</td>
                      <td>{data.regional_office}</td>
                      <td>{data.gst}</td>
                      <td>{data.tds}</td>
                      <td>{data.tds_with_gst}</td>
                      <td>{data.retention_money}</td>
                      <td>{data.promotion_expense}</td>
                      <td>
                        <ActionButton
                          hideDelete={"d-none"}
                          hideEye={"d-none"}
                          editlink={`/setting/create/${data.id}`}
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
              ? allOverviewData.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : allOverviewData.length < pageSize
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
  );
};

export default PromotionOverview;
