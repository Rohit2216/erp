import React, { useEffect, useState } from "react";
import { Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import {
  deleteAssetsById,
  getAllAssets,
  postAssignedAssetToUser,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import Modaljs from "../../components/Modal";
import ActionButton from "../../components/ActionButton";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addUserIdSchema } from "../../utils/formSchema";
import { getAllUsers } from "../../services/authapi";
import { useTranslation } from "react-i18next";

const RejectedAssets = () => {
  const [requestData, setRequestData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});

  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  // const [Allocate, setAllocate] = useState(false);
  const [assignUserData, setAssignUserData] = useState([]);
  const { t } = useTranslation();

  const fetchAllAssetsData = async () => {
    const status = 3;
    const isDropdown = false;
    const res = await getAllAssets({
      search,
      pageSize,
      pageNo,
      isDropdown,
      status,
    });
    if (res.status) {
      setRequestData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRequestData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const fetchAssignUserData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAssignUserData(res.data);
    } else {
      setAssignUserData([]);
    }
  };

  useEffect(() => {
    fetchAllAssetsData();
    fetchAssignUserData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const UserOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className="d-flex justify-content-between px-2 align-items-center cursor-pointer"
    >
      <span>
        <img
          className="avatar me-2"
          src={
            data.image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={data.name}
        />
        {label}
      </span>
    </div>
  );

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>All Rejected Assets · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"Rejected Assets"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
      >
        <div className="table-scroll mb-3">
          <Table className=" Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Asset Name")}</th>
                <th>{t("Asset Model No")}</th>
                <th>{t("uin No")}</th>
                <th>{t("Price")}</th>
                <th>{t("Purchase Date")}</th>
                <th>{t("Status")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <td colSpan={8}>
                  <img
                    className="p-3"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt="Loading"
                  />
                </td>
              ) : requestData.length > 0 ? (
                <>
                  {requestData?.map((data, idx) => (
                    <tr key={idx}>
                      <td>{serialNumber[idx]}</td>
                      <td>{data.asset_name}</td>
                      <td>{data.asset_model_number}</td>
                      <td>{data.asset_uin_number}</td>
                      <td>{data.asset_price}</td>
                      <td>{data.asset_purchase_date}</td>
                      <td className="text-green">rejected</td>
                      <td>
                        <ActionButton
                          hideEdit={"d-none"}
                          eyelink={`/AllAssets/CreateAssets/${data?.id}?type=view`}
                          hideDelete={"d-none"}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <td colSpan={8}>
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
              ? requestData.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : requestData.length < pageSize
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

export default RejectedAssets;
