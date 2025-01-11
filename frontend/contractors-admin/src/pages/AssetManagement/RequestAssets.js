import React, { useEffect, useState } from "react";
import { Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import {
  approveRejectAssetsManagementById,
  approveRejectWorkImageById,
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
import { getAllUsers, getAllModuleByRoleId } from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";


const RequestAssets = () => {
  const [requestData, setRequestData] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [assestsId, setAssestsId] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  // const [Allocate, setAllocate] = useState(false);
  const [assignUserData, setAssignUserData] = useState([]);
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);
  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: false,
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);


  const fetchAllAssetsData = async () => {
    const status = 1;
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

  const fetchPermissions = async () => {
    try {
      const userID = user.user_type; // Assuming `user_type` is the user's role identifier
      const res = await getAllModuleByRoleId(userID);
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "Assets Management");
        console.log("hrModule", hrModule)
        if (hrModule && hrModule.submodules) {
          const employeesSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "Request Assets"
          );
          console.log("employeesSubmodule", employeesSubmodule)
          if (employeesSubmodule) {
            setPermissions({
              create: Boolean(employeesSubmodule.create),
              update: Boolean(employeesSubmodule.update),
              delete: Boolean(employeesSubmodule.delete),
              view: true, // Ensure view is set explicitly to true
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setIsPermissionsLoading(false);
    }
  };

  const handleDelete = async () => {
    const res = await deleteAssetsById(assestsId);
    if (res.status) {
      toast.success(res.message);
      setRequestData((prev) => prev.filter((dlt) => dlt.id !== assestsId));
      fetchAllAssetsData();
    } else {
      toast.error(res.message);
    }
    setAssestsId("");
    setShowDelete(false);
  };
  const handleApproveReject = async () => {
    const status = showApprove ? "2" : "3";
    const res = await approveRejectAssetsManagementById(status, assestsId);

    if (res.status) {
      toast.success(res.message);
      setRequestData((prev) => prev.filter((itm) => itm.id !== assestsId));
      setPageDetail({
        ...pageDetail,
        total: +pageDetail.total - 1,
        pageEndResult: pageDetail.pageEndResult - 1,
      });
    } else {
      toast.error(res.message);
    }

    setAssestsId("");
    setShowApprove(false);
    setShowReject(false);
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
    fetchPermissions();
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
    <>
      <Col md={12} data-aos={"fade-up"}>
        <Helmet>
          <title>All Request Assets · CMS Electricals</title>
        </Helmet>
        <CardComponent
          title={"Request Assets"}
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
                        <td className="text-orange">requested</td>
                        <td>
                          {/* <ActionButton
                            editlink={`/AllAssets/CreateAssets/${data?.id}`}
                            eyelink={`/AllAssets/CreateAssets/${data?.id}?type=view`}
                            deleteOnclick={() => {
                              setAssestsId(data.id);
                              setShowDelete(true);
                            }}
                            approveOnclick={() => {
                              setAssestsId(data.id);
                              setShowApprove(true);
                            }}
                            rejectOnclick={() => {
                              setAssestsId(data.id);
                              setShowReject(true);
                            }}
                          /> */}

                          <ActionButton
                            editlink={permissions.update ? `/AllAssets/CreateAssets/${data?.id}` : null} // Edit link visible only if update permission exists
                            eyelink={permissions.view ? `/AllAssets/CreateAssets/${data?.id}?type=view` : null} // View link visible only if view permission exists
                            hideEye={permissions.view ? "" : "d-none"} // Hide the eye button if no view permission
                            hideEdit={permissions.update ? "" : "d-none"} // Hide the edit button if no update permission
                            hideDelete={permissions.delete ? "" : "d-none"} // Hide the delete
                            deleteOnclick={
                              permissions.delete
                                ? () => {
                                  setAssestsId(data.id);
                                  setShowDelete(true);
                                }
                                : null
                            } // Delete action allowed only if delete permission exists
                            approveOnclick={
                              permissions.delete
                                ? () => {
                                  setAssestsId(data.id);
                                  setShowApprove(true);
                                }
                                : null
                            } // Approve action allowed only if delete permission exists
                            rejectOnclick={
                              permissions.delete
                                ? () => {
                                  setAssestsId(data.id);
                                  setShowReject(true);
                                }
                                : null
                            } // Reject action allowed only if delete permission exists
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
            title={`Showing ${pageDetail?.pageStartResult || 0} to ${pageDetail?.pageEndResult || 0
              } of ${pageDetail?.total || 0}`}
            handlePageSizeChange={handlePageSizeChange}
            prevonClick={() => setPageNo(pageNo - 1)}
            nextonClick={() => setPageNo(pageNo + 1)}
          />
        </CardComponent>
      </Col>
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowDelete}
        show={showDelete}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproveReject}
        hide={setShowApprove}
        show={showApprove}
        title={"Confirm Approve"}
        description={"Are you sure you want to approve this!!"}
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproveReject}
        hide={setShowReject}
        show={showReject}
        title={"Confirm reject"}
        description={"Are you sure you want to reject this!!"}
      />
    </>
  );
};

export default RequestAssets;
