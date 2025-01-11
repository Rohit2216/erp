// import React, { useEffect, useState } from "react";
// import { Col, Table } from "react-bootstrap";
// import { BsCheckLg, BsEyeFill, BsXLg } from "react-icons/bs";
// import { Link } from "react-router-dom";
// import TooltipComponent from "../../../components/TooltipComponent";
// import {
//   approvedLeaveRequest,
//   getAllAppliedLeaves,
// } from "../../../services/authapi";
// import moment from "moment/moment";
// import { toast } from "react-toastify";
// import ConfirmAlert from "../../../components/ConfirmAlert";
// import { useTranslation } from "react-i18next";

// const RequestLeave = ({
//   search,
//   pageSize,
//   pageNo,
//   handleEdit,
//   setRefresh,
//   refresh,
// }) => {
//   const [appliedLeaves, setAppliedLeaves] = useState([]);
//   // const [refresh, setRefresh] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [showAlertOne, setShowAlertOne] = useState(false);
//   const [idToApprove, setIdToApprove] = useState({
//     id: "",
//     status: "",
//   });
//   const [idToReject, setIdToReject] = useState({
//     id: "",
//     status: "",
//   });
//   const { t } = useTranslation();

//   const fetchData = async () => {
//     const res = await getAllAppliedLeaves(search, pageSize, pageNo);
//     if (res.status) {
//       const rData = res.data.filter((e) => e.status === "pending");
//       setAppliedLeaves(rData);
//     } else {
//       setAppliedLeaves([]);
//     }
//   };

//   const handleApproveRequest = async () => {
//     const rData = {
//       id: idToApprove.id,
//       status: idToApprove.status === "pending" ? "approved" : "pending",
//     };
//     const res = await approvedLeaveRequest(rData);
//     if (res.status) {
//       toast.success(res.message);
//     } else {
//       toast.error(res.message);
//     }
//     setIdToApprove("");
//     setShowAlert(false);
//     setRefresh(!refresh);
//   };

//   const handleRejectRequest = async () => {
//     const rData = {
//       id: idToReject.id,
//       status: idToReject.status === "pending" ? "rejected" : "pending",
//     };
//     const res = await approvedLeaveRequest(rData);
//     if (res.status) {
//       toast.success(res.message);
//     } else {
//       toast.error(res.message);
//     }
//     setIdToReject("");
//     setShowAlertOne(false);
//     setRefresh(!refresh);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [search, refresh]);

//   return (
//     <>
//       <Col md={12} data-aos={"fade-up"}>
//         <div className="table-scroll p-2">
//           <Table className="text-body bg-new Roles">
//             <thead className="text-truncate">
//               <tr>
//                 <th>{t("Id")}</th>
//                 <th>{t("Employee Name")}</th>
//                 <th>{t("Duration")}</th>
//                 <th>{t("Start Date")}</th>
//                 <th>{t("End Date")}</th>
//                 <th>{t("Leave Type")}</th>
//                 <th>{t("Action")}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appliedLeaves.length > 0 ? null : (
//                 <tr>
//                   <td colSpan={7}>
//                     <img
//                       className="p-3"
//                       alt="no-result"
//                       width="280"
//                       src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
//                     />
//                   </td>
//                 </tr>
//               )}
//               {appliedLeaves?.map((ele) => (
//                 <tr key={ele.id}>
//                   <td>{ele.id}</td>
//                   <td>
//                     <div className="text-truncate">
//                       <img
//                         className="avatar me-2"
//                         src={
//                           ele.image
//                             ? `${process.env.REACT_APP_API_URL}/${ele.image}`
//                             : "./assets/images/default-image.png"
//                         }
//                         alt="user-img"
//                       />
//                       {ele?.applicant_name}
//                     </div>
//                   </td>
//                   <td>
//                     {ele?.total_days}.00 Days {ele?.total_hours} Hours
//                   </td>
//                   <td>{moment(ele?.start_date).format("DD/MM/YYYY")}</td>
//                   <td>{moment(ele?.end_date).format("DD/MM/YYYY")}</td>
//                   <td>{ele?.leave_type}</td>
//                   <td>
//                     <span className="d-align gap-2">
//                       <TooltipComponent title={"View Details"}>
//                         {/* <Link to={`/ViewEmployeeLeave/${ele?.id}`}> */}
//                         <span
//                           onClick={() => handleEdit(ele)}
//                           className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
//                         >
//                           <BsEyeFill />
//                         </span>
//                         {/* </Link> */}
//                       </TooltipComponent>
//                       <div className="vr hr-shadow"></div>
//                       <TooltipComponent title={"Reject"}>
//                         <span
//                           onClick={() => {
//                             setIdToReject({
//                               id: ele?.id,
//                               status: ele?.status,
//                             });
//                             setShowAlertOne(true);
//                           }}
//                           className="social-btn-re d-align gap-2 px-3 w-auto red-combo"
//                         >
//                           <BsXLg />
//                         </span>
//                       </TooltipComponent>
//                       <div className="vr hr-shadow"></div>
//                       <TooltipComponent title={"Approve"}>
//                         <span
//                           onClick={() =>
//                             // handleApproveRequest(ele?.id, ele?.status)
//                             {
//                               setIdToApprove({
//                                 id: ele?.id,
//                                 status: ele?.status,
//                               });
//                               setShowAlert(true);
//                             }
//                           }
//                           className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
//                         >
//                           <BsCheckLg />
//                         </span>
//                       </TooltipComponent>
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </Col>
//       <ConfirmAlert
//         size={"sm"}
//         icon={<BsCheckLg />}
//         deleteFunction={handleApproveRequest}
//         hide={setShowAlert}
//         show={showAlert}
//         title={"Approved?"}
//         description={"Are you sure you want to Approve Leave Request!!"}
//       />
//       <ConfirmAlert
//         size={"sm"}
//         icon={<BsCheckLg />}
//         deleteFunction={handleRejectRequest}
//         hide={setShowAlertOne}
//         show={showAlertOne}
//         title={"Rejected?"}
//         description={"Are you sure you want to Reject Leave Request!!"}
//       />
//     </>
//   );
// };

// export default RequestLeave;



// import React, { useEffect, useState } from "react";
// import { Col, Table } from "react-bootstrap";
// import { BsCheckLg, BsEyeFill, BsXLg } from "react-icons/bs";
// import { useTranslation } from "react-i18next";
// import TooltipComponent from "../../../components/TooltipComponent";
// import {
//   approvedLeaveRequest,
//   getAllAppliedLeaves,
// } from "../../../services/authapi";
// import moment from "moment";
// import { toast } from "react-toastify";
// import ConfirmAlert from "../../../components/ConfirmAlert";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../../features/auth/authSlice";
// import { getAllModuleByRoleId } from "../../../services/authapi";

// const RequestLeave = ({
//   search,
//   pageSize,
//   pageNo,
//   handleEdit,
//   setRefresh,
//   refresh,
// }) => {
//   const [appliedLeaves, setAppliedLeaves] = useState([]);
//   const [showAlert, setShowAlert] = useState(false);
//   const [showAlertOne, setShowAlertOne] = useState(false);
//   const [idToApprove, setIdToApprove] = useState({ id: "", status: "" });
//   const [idToReject, setIdToReject] = useState({ id: "", status: "" });
//   const [permissions, setPermissions] = useState({
//     create: 0,
//     update: 0,
//     delete: 0,
//     view: 1, // All users can view by default
//   });
//   const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
//   const { user } = useSelector(selectUser);
//   const { t } = useTranslation();

//   const fetchData = async () => {
//     const res = await getAllAppliedLeaves(search, pageSize, pageNo);
//     if (res.status) {
//       const rData = res.data.filter((e) => e.status === "pending");
//       setAppliedLeaves(rData);
//     } else {
//       setAppliedLeaves([]);
//     }
//   };

//   const fetchPermissions = async () => {
//     try {
//       const userID = user.user_type;
//       const res = await getAllModuleByRoleId(userID);
//       if (res.status && res.data.length > 0) {
//         const hrModule = res.data.find((module) => module.title === "HR Management");
//         if (hrModule && hrModule.submodules) {
//           const leavesTypeSubmodule = hrModule.submodules.find(
//             (submodule) => submodule.title === "Leaves"
//           );
//           if (leavesTypeSubmodule) {
//             setPermissions({
//               create: leavesTypeSubmodule.create,
//               update: leavesTypeSubmodule.update,
//               delete: leavesTypeSubmodule.delete,
//               view: 1, // Always allow viewing
//             });
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch permissions:", error);
//     } finally {
//       setIsPermissionsLoading(false);
//     }
//   };

//   const handleApproveRequest = async () => {
//     const rData = {
//       id: idToApprove.id,
//       status: idToApprove.status === "pending" ? "approved" : "pending",
//     };
//     const res = await approvedLeaveRequest(rData);
//     if (res.status) {
//       toast.success(res.message);
//     } else {
//       toast.error(res.message);
//     }
//     setIdToApprove("");
//     setShowAlert(false);
//     setRefresh(!refresh);
//   };

//   const handleRejectRequest = async () => {
//     const rData = {
//       id: idToReject.id,
//       status: idToReject.status === "pending" ? "rejected" : "pending",
//     };
//     const res = await approvedLeaveRequest(rData);
//     if (res.status) {
//       toast.success(res.message);
//     } else {
//       toast.error(res.message);
//     }
//     setIdToReject("");
//     setShowAlertOne(false);
//     setRefresh(!refresh);
//   };

//   useEffect(() => {
//     fetchData();
//     fetchPermissions(); // Fetch permissions when component mounts
//   }, [search, refresh]);

//   return (
//     <>
//       <Col md={12} data-aos={"fade-up"}>
//         <div className="table-scroll p-2">
//           <Table className="text-body bg-new Roles">
//             <thead className="text-truncate">
//               <tr>
//                 <th>{t("Id")}</th>
//                 <th>{t("Employee Name")}</th>
//                 <th>{t("Duration")}</th>
//                 <th>{t("Start Date")}</th>
//                 <th>{t("End Date")}</th>
//                 <th>{t("Leave Type")}</th>
//                 <th>{t("Action")}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appliedLeaves.length > 0 ? null : (
//                 <tr>
//                   <td colSpan={7}>
//                     <img
//                       className="p-3"
//                       alt="no-result"
//                       width="280"
//                       src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
//                     />
//                   </td>
//                 </tr>
//               )}
//               {appliedLeaves?.map((ele) => (
//                 <tr key={ele.id}>
//                   <td>{ele.id}</td>
//                   <td>
//                     <div className="text-truncate">
//                       <img
//                         className="avatar me-2"
//                         src={
//                           ele.image
//                             ? `${process.env.REACT_APP_API_URL}/${ele.image}`
//                             : "./assets/images/default-image.png"
//                         }
//                         alt="user-img"
//                       />
//                       {ele?.applicant_name}
//                     </div>
//                   </td>
//                   <td>
//                     {ele?.total_days}.00 Days {ele?.total_hours} Hours
//                   </td>
//                   <td>{moment(ele?.start_date).format("DD/MM/YYYY")}</td>
//                   <td>{moment(ele?.end_date).format("DD/MM/YYYY")}</td>
//                   <td>{ele?.leave_type}</td>
//                   <td>
//                     <span className="d-align gap-2">
//                       {permissions.view && (
//                         <TooltipComponent title={"View Details"}>
//                           <span
//                             onClick={() => handleEdit(ele)}
//                             className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
//                           >
//                             <BsEyeFill />
//                           </span>
//                         </TooltipComponent>
//                       )}
//                       <div className="vr hr-shadow"></div>
//                       {permissions.delete && (
//                         <TooltipComponent title={"Reject"}>
//                           <span
//                             onClick={() => {
//                               setIdToReject({
//                                 id: ele?.id,
//                                 status: ele?.status,
//                               });
//                               setShowAlertOne(true);
//                             }}
//                             className="social-btn-re d-align gap-2 px-3 w-auto red-combo"
//                           >
//                             <BsXLg />
//                           </span>
//                         </TooltipComponent>
//                       )}
//                       <div className="vr hr-shadow"></div>
//                       {permissions.update && (
//                         <TooltipComponent title={"Approve"}>
//                           <span
//                             onClick={() => {
//                               setIdToApprove({
//                                 id: ele?.id,
//                                 status: ele?.status,
//                               });
//                               setShowAlert(true);
//                             }}
//                             className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
//                           >
//                             <BsCheckLg />
//                           </span>
//                         </TooltipComponent>
//                       )}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </Col>
//       <ConfirmAlert
//         size={"sm"}
//         icon={<BsCheckLg />}
//         deleteFunction={handleApproveRequest}
//         hide={setShowAlert}
//         show={showAlert}
//         title={"Approved?"}
//         description={"Are you sure you want to Approve Leave Request!!"}
//       />
//       <ConfirmAlert
//         size={"sm"}
//         icon={<BsXLg />}
//         deleteFunction={handleRejectRequest}
//         hide={setShowAlertOne}
//         show={showAlertOne}
//         title={"Rejected?"}
//         description={"Are you sure you want to Reject Leave Request!!"}
//       />
//     </>
//   );
// };

// export default RequestLeave;


import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsCheckLg, BsEyeFill, BsXLg } from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import {
  approvedLeaveRequest,
  getAllAppliedLeaves,
} from "../../../services/authapi";
import moment from "moment/moment";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { getAllModuleByRoleId } from "../../../services/authapi";

const RequestLeave = ({
  search,
  pageSize,
  pageNo,
  handleEdit,
  setRefresh,
  refresh,
}) => {
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertOne, setShowAlertOne] = useState(false);
  const [idToApprove, setIdToApprove] = useState({ id: "", status: "" });
  const [idToReject, setIdToReject] = useState({ id: "", status: "" });
  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: false,
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
  const { user } = useSelector(selectUser);
  const { t } = useTranslation();

  // Fetch applied leaves data
  const fetchData = async () => {
    const res = await getAllAppliedLeaves(search, pageSize, pageNo);
    if (res.status) {
      const rData = res.data.filter((e) => e.status === "pending");
      setAppliedLeaves(rData);
    } else {
      setAppliedLeaves([]);
    }
  };

  // Fetch user permissions based on their role
  const fetchPermissions = async () => {
    try {
      const userID = user.user_type;
      const res = await getAllModuleByRoleId(userID);
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "HR Management");
        if (hrModule && hrModule.submodules) {
          const leavesTypeSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "Leaves"
          );
          if (leavesTypeSubmodule) {
            setPermissions({
              create: Boolean(leavesTypeSubmodule.create),
              update: Boolean(leavesTypeSubmodule.update),
              delete: Boolean(leavesTypeSubmodule.delete),
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

  // Handle approve request
  const handleApproveRequest = async () => {
    const rData = {
      id: idToApprove.id,
      status: idToApprove.status === "pending" ? "approved" : "pending",
    };
    const res = await approvedLeaveRequest(rData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIdToApprove("");
    setShowAlert(false);
    setRefresh(!refresh);
  };

  // Handle reject request
  const handleRejectRequest = async () => {
    const rData = {
      id: idToReject.id,
      status: idToReject.status === "pending" ? "rejected" : "pending",
    };
    const res = await approvedLeaveRequest(rData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIdToReject("");
    setShowAlertOne(false);
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchData();
    fetchPermissions(); // Fetch user permissions
  }, [search, refresh]);

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <div className="table-scroll p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Id")}</th>
                <th>{t("Employee Name")}</th>
                <th>{t("Duration")}</th>
                <th>{t("Start Date")}</th>
                <th>{t("End Date")}</th>
                <th>{t("Leave Type")}</th>
                {(permissions.view || permissions.update || permissions.delete) && (
                  <th>{t("Action")}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {appliedLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="280"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              ) : (
                appliedLeaves.map((ele) => (
                  <tr key={ele.id}>
                    <td>{ele.id}</td>
                    <td>
                      <div className="text-truncate">
                        <img
                          className="avatar me-2"
                          src={
                            ele.image
                              ? `${process.env.REACT_APP_API_URL}/${ele.image}`
                              : "./assets/images/default-image.png"
                          }
                          alt="user-img"
                        />
                        {ele?.applicant_name}
                      </div>
                    </td>
                    <td>
                      {ele?.total_days}.00 Days {ele?.total_hours} Hours
                    </td>
                    <td>{moment(ele?.start_date).format("DD/MM/YYYY")}</td>
                    <td>{moment(ele?.end_date).format("DD/MM/YYYY")}</td>
                    <td>{ele?.leave_type}</td>
                    {(permissions.view || permissions.update || permissions.delete) && (
                      <td>
                        <span className="d-align gap-2">
                          {permissions.view && (
                            <TooltipComponent title={"View Details"}>
                              <span
                                onClick={() => handleEdit(ele)}
                                className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                              >
                                <BsEyeFill />
                              </span>
                            </TooltipComponent>
                          )}
                          {permissions.delete && (
                            <>
                              <div className="vr hr-shadow"></div>
                              <TooltipComponent title={"Reject"}>
                                <span
                                  onClick={() => {
                                    setIdToReject({
                                      id: ele?.id,
                                      status: ele?.status,
                                    });
                                    setShowAlertOne(true);
                                  }}
                                  className="social-btn-re d-align gap-2 px-3 w-auto red-combo"
                                >
                                  <BsXLg />
                                </span>
                              </TooltipComponent>
                            </>
                          )}
                          {permissions.update && (
                            <>
                              <div className="vr hr-shadow"></div>
                              <TooltipComponent title={"Approve"}>
                                <span
                                  onClick={() => {
                                    setIdToApprove({
                                      id: ele?.id,
                                      status: ele?.status,
                                    });
                                    setShowAlert(true);
                                  }}
                                  className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                                >
                                  <BsCheckLg />
                                </span>
                              </TooltipComponent>
                            </>
                          )}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Col>
      <ConfirmAlert
        size={"sm"}
        icon={<BsCheckLg />}
        deleteFunction={handleApproveRequest}
        hide={setShowAlert}
        show={showAlert}
        title={"Approved?"}
        description={"Are you sure you want to Approve Leave Request!!"}
      />
      <ConfirmAlert
        size={"sm"}
        icon={<BsCheckLg />}
        deleteFunction={handleRejectRequest}
        hide={setShowAlertOne}
        show={showAlertOne}
        title={"Rejected?"}
        description={"Are you sure you want to Reject Leave Request!!"}
      />
    </>
  );
};

export default RequestLeave;
