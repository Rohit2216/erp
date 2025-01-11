import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  getAllPOTransactions,
  getAllROTransactions,
} from "../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { useTranslation } from "react-i18next";

const POTransactions = () => {
  const [allManager, setAllManager] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchAllManagerData = async () => {
    const res = await getAllPOTransactions(search, pageSize, pageNo);
    if (res.status) {
      setAllManager(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllManager([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllManagerData();
  }, []);

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
        <title> Regional Office · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"Purchase Order transactions"}
        >
          <div className="table-scroll mb-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("po number")}</th>
                  <th>{t("Total in amount")}</th>
                  <th>{t("total pay amount")}</th>
                  <th>{t("balance")}</th>
                  <th>{t("Action")}</th>
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
              ) : allManager.length > 0 ? (
                <>
                  {allManager.map((data, id1) => (
                    <tr key={id1}>
                      <td>{id1 + 1}</td>
                      <td>{data.po_number}</td>
                      <td>
                        ₹ {parseFloat(data.total_received_credit).toFixed(2)}
                      </td>
                      <td>₹ {data.total_received_non_credit || 0}</td>
                      <td>
                        <span className="text-green fw-bold">
                          ₹ {parseFloat(data.balance).toFixed(2)}{" "}
                        </span>
                      </td>
                      <td>
                        {console.log(data, "ddaaaaa")}
                        <ActionButton
                          eyeOnclick={() =>
                            navigate(`/regional-office/view-po-details`, {
                              state: {
                                id: data.po_id,
                              },
                            })
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
                ? allManager.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : allManager.length < pageSize
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

export default POTransactions;
