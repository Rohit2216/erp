import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import ReactPagination from "../../components/ReactPagination";
import { getStockPunchTransferList } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import "react-best-tabs/dist/index.css";
import { useNavigate } from "react-router-dom";
import ImageViewer from "../../components/ImageViewer";
import CardComponent from "../../components/CardComponent";
import { BiTransfer } from "react-icons/bi";
import ActionButton from "../../components/ActionButton";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";

const AllStockTransferPunch = () => {
  const [stockRequest, setStockRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchStockPunchTransferData = async () => {
    const res = await getStockPunchTransferList(searchTerm, pageSize, pageNo);
    if (res.status) {
      setStockRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setStockRequest([]);
      setPageDetail({});
    }
  };

  // set Delay time to get data on search
  const debounceValue = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchStockPunchTransferData();
  }, [debounceValue, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <Helmet>
        <title>Stock Punch · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className="card-bg"
          title={"stock punch transfer"}
          search={true}
          searchOnChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          link={`/create-stock-punch-transfer`}
          icon={<BiTransfer />}
          tag={"Transfer"}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Transfer By")}</th>
                  <th>{t("Transfer To")}</th>
                  <th>{t("supplier Name")}</th>
                  <th>{t("Transfer date & time")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {stockRequest.length > 0 ? null : (
                  <tr>
                    <td colSpan={8}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {stockRequest.map((data, id1) => (
                  <tr key={id1}>
                    <td>
                      <ImageViewer
                        src={
                          data?.transfer_by?.image
                            ? `${process.env.REACT_APP_API_URL}${data?.transfer_by?.image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <span className="d-flex align-items-center gap-2">
                          <img
                            width={30}
                            height={30}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              data?.transfer_by?.image
                                ? `${process.env.REACT_APP_API_URL}${data?.transfer_by?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                          <span className="d-grid">
                            {data?.transfer_by?.name}{" "}
                          </span>
                        </span>
                      </ImageViewer>
                    </td>
                    <td>
                      <ImageViewer
                        src={
                          data?.transfer_to_details?.image
                            ? `${process.env.REACT_APP_API_URL}${data?.transfer_to_details?.image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <span className="d-flex align-items-center gap-2">
                          <img
                            width={30}
                            height={30}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              data?.transfer_to_details?.image
                                ? `${process.env.REACT_APP_API_URL}${data?.transfer_to_details?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                          <span className="d-grid">
                            {data?.transfer_to_details?.name}{" "}
                          </span>
                        </span>
                      </ImageViewer>
                    </td>

                    <td>{data?.supplier_name ?? "--"}</td>
                    <td>{data.transfered_date}</td>
                    <td>
                      <ActionButton
                        eyeOnclick={() =>
                          navigate(`/view-stock-punch-transfer`, {
                            state: {
                              transfer_by_id: data?.transfer_by?.id,
                              transfer_to_id: data?.transfer_to_details?.id,
                            },
                          })
                        }
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                      />
                    </td>
                  </tr>
                ))}
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
                        ? stockRequest.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : stockRequest.length < pageSize
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
    </>
  );
};

export default AllStockTransferPunch;
