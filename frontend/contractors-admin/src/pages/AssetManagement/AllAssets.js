import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import {
  deleteAssetsById,
  getAllAssets,
  postAssignedAssetToUser,
} from "../../services/contractorApi";
import TextareaAutosize from "react-textarea-autosize";
import ReactPagination from "../../components/ReactPagination";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Modaljs from "../../components/Modal";
import { ErrorMessage, Formik } from "formik";
import ActionButton from "../../components/ActionButton";
import ConfirmAlert from "../../components/ConfirmAlert";
import { getAllUsers } from "../../services/authapi";
import { addUserIdSchema } from "../../utils/formSchema";
import { useTranslation } from "react-i18next";

const AllAssets = () => {
  const [requestData, setRequestData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [viewDetails, setViewDetails] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  // const [Allocate, setAllocate] = useState(false);
  const [assignUserData, setAssignUserData] = useState([]);
  const { t } = useTranslation();

  const fetchAllAssetsData = async () => {
    const res = await getAllAssets({ search, pageSize, pageNo });
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

  const handleDelete = async () => {
    const res = await deleteAssetsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRequestData((prev) => prev.filter((dlt) => dlt.id !== idToDelete));
      fetchAllAssetsData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
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
        <title>All Assets · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"All Assets"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
      >
        <div className="table-scroll ">
          <Table className="text-body Roles">
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
                <td colSpan={7}>
                  <img
                    className="p-3"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt={t("Loading")}
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
                      {console.log(data, "status")}
                      <td
                        className={`${
                          data.status == "1"
                            ? "text-orange"
                            : data.status == "2"
                            ? "text-green"
                            : data.status == "3"
                            ? "text-danger"
                            : data.status == "4"
                            ? "text-green"
                            : data.status == "5"
                            ? "text-orange"
                            : data.status == "6"
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
                          : data.status == "4"
                          ? "assigned"
                          : data.status == "5"
                          ? "repair"
                          : data.status == "6"
                          ? "scrap"
                          : ""}
                      </td>
                      <td>
                        <ActionButton
                          eyelink={`/AllAssets/CreateAssets/${data?.id}?type=view`}
                          // editlink={`/AllAssets/CreateAssets/${data?.id}`}
                          hideEdit={"d-none"}
                          deleteOnclick={() => {
                            setIdToDelete(data.id);
                            setShowAlert(true);
                          }}
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
          className="my-2"
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

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </Col>
  );
};

export default AllAssets;
