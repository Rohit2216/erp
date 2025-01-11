import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";
import { Col, Table } from "react-bootstrap";
import ActionButton from "../../components/ActionButton";
import { getAllPromotionalsetting } from "../../services/contractorApi";
const AreaManagerRatioOverview = () => {
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [allOverviewData, setAllOverviewData] = useState([]);

  const { t } = useTranslation();

  const fetchAllOverview = async () => {
    const res = await getAllPromotionalsetting(search, pageSize, pageNo);
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
        title={"Area Manager Ratio Overview"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        showBackButton={true}
      >
        <div className="table-scroll p-2 mb-2">
          <Table className="text-body  Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Area Manager")}</th>
                <th>{t("Manager Ratio")}</th>
                <th>{t("Company Ratio")}</th>
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
                      <td>{data.manager_name}</td>
                      <td>{data.manager_ratio}</td>
                      <td>{data.company_ratio}</td>
                      <td>
                        <ActionButton
                          hideDelete={"d-none"}
                          hideEye={"d-none"}
                          editlink={`/setting/area-manager-ratio/${data.id}`}
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
      </CardComponent>
    </Col>
  );
};

export default AreaManagerRatioOverview;
