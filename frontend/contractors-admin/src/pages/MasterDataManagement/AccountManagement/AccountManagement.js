import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import { Helmet } from "react-helmet";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import {
  deleteAccountDetailsById,
  getAllAccountDetails,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ImageViewer from "../../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const AccountManagement = () => {
  const [allBank, setAllBank] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchAllBankData = async () => {
    const res = await getAllAccountDetails(search, pageSize, pageNo);
    if (res.status) {
      setAllBank(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllBank([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteAccountDetailsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllBank((prev) => prev.filter((dlt) => dlt.id !== idToDelete));
      fetchAllBankData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllBankData();
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
      <Col md={12} data-aos={"fade-up"}>
        <Helmet>
          <title>All Account Management · CMS Electricals</title>
        </Helmet>
        <CardComponent
          title={"All Account Management"}
          icon={<BsPlus />}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          link={"/account-management/create-account-management/new"}
          tag={"Create"}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr className="text-center">
                  <th>{t("Sr No.")}</th>
                  <th>{t("Bank Name")}</th>
                  <th>{t("Holder Name")}</th>
                  <th>{t("Account Number")}</th>
                  <th>{t("Branch")}</th>
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
                ) : allBank.length > 0 ? (
                  <>
                    {allBank?.map((e, idx) => (
                      <tr>
                        <td>{serialNumber[idx]}</td>
                        <td>
                          <ImageViewer
                            src={
                              e?.logo
                                ? `${process.env.REACT_APP_API_URL}${e?.logo}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <span className="d-flex align-items-center gap-2">
                              <img
                                width={30}
                                height={30}
                                className="my-bg object-fit p-1 rounded-circle"
                                src={
                                  e?.logo
                                    ? `${process.env.REACT_APP_API_URL}${e?.logo}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              />{" "}
                              {e?.bank_name}
                            </span>
                          </ImageViewer>
                        </td>
                        <td>{e.account_holder_name}</td>
                        <td>{e.account_number}</td>
                        <td>{e.branch}</td>
                        <td>
                          <ActionButton
                            editlink={`/account-management/create-account-management/${e.id}`}
                            eyelink={`/account-management/view-transaction/${e.id}?type=details`}
                            deleteOnclick={() => {
                              setIdToDelete(e.id);
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
                        ? allBank.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : allBank.length < pageSize
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

export default AccountManagement;
