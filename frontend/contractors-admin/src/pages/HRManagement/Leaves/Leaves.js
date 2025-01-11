// import React, { useState, useEffect } from "react";
// import Tabs, { Tab } from "react-best-tabs";
// import "react-best-tabs/dist/index.css";
// import { Col, Form, Row } from "react-bootstrap";
// import { Helmet } from "react-helmet";
// import CardComponent from "../../../components/CardComponent";
// import Modaljs from "../../../components/Modal";
// import TextareaAutosize from "react-textarea-autosize";
// import ApprovedLeave from "./ApprovedLeave";
// import Select from "react-select";
// import RequestLeave from "./RequestLeave";
// import RejectedLeave from "./RejectedLeave";
// import {
//   assignLeave,
//   getAdminAllHREmployees,
//   getAdminAllLeavesType,
//   getAllAppliedLeaves,
//   getAllModuleByRoleId,
// } from "../../../services/authapi";
// import { BsCalendarDate, BsLightningCharge, BsPlus } from "react-icons/bs";
// import moment from "moment";
// import { Formik } from "formik";
// import { toast } from "react-toastify";
// import { assignLeaveSchema } from "../../../utils/formSchema";
// import { useTranslation } from "react-i18next";
// import { selectUser } from "../../../features/auth/authSlice";
// import { useSelector } from "react-redux";

// const Leaves = () => {
//   const [appliedLeaves, setAppliedLeaves] = useState([]);
//   const [detailShow, setDetailShow] = useState(false);
//   const [assignShow, setAssignShow] = useState(false);
//   const [edit, setEdit] = useState({});
//   const [pageDetail, setPageDetail] = useState({});
//   const [search, setSearch] = useState(0);
//   const [pageNo, setPageNo] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const [leavet, setLeavet] = useState([]);
//   const [refresh, setRefresh] = useState(false);
//   const [allHrEmployees, setAllHrEmployees] = useState([]);
//   const { t } = useTranslation();
//   const { user } = useSelector(selectUser);

//   const [permissions, setPermissions] = useState({
//     create: false,
//     update: false,
//     delete: false,
//     view: false,
//   });
//   const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);

//   const fetchPermissions = async () => {
//     try {
//       const userID = user.user_type; // Assuming `user_type` is the user's role identifier
//       const res = await getAllModuleByRoleId(userID);
//       if (res.status && res.data.length > 0) {
//         const hrModule = res.data.find((module) => module.title === "HR Management");
//         if (hrModule && hrModule.submodules) {
//           const employeesSubmodule = hrModule.submodules.find(
//             (submodule) => submodule.title === "Leaves"
//           );
//           if (employeesSubmodule) {
//             setPermissions({
//               create: Boolean(employeesSubmodule.create),
//               update: Boolean(employeesSubmodule.update),
//               delete: Boolean(employeesSubmodule.delete),
//               view: true, // Ensure view is set explicitly to true
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

//   const handleEdit = async (ele) => {
//     setEdit(ele);
//     setDetailShow(true);
//   };
//   const tabs = [
//     {
//       title: t("Request Leave"),
//       page: (
//         <RequestLeave
//           refresh={refresh}
//           setRefresh={setRefresh}
//           search={search}
//           handleEdit={handleEdit}
//           setDetailShow={setDetailShow}
//         />
//       ),
//     },
//     {
//       title: t("Approved Leave"),
//       page: (
//         <ApprovedLeave
//           refresh={refresh}
//           handleEdit={handleEdit}
//           setDetailShow={setDetailShow}
//           data={appliedLeaves.filter((e) => e.status === "approved")}
//         />
//       ),
//     },
//     {
//       title: t("Rejected Leave"),
//       page: (
//         <RejectedLeave
//           refresh={refresh}
//           handleEdit={handleEdit}
//           setDetailShow={setDetailShow}
//           data={appliedLeaves.filter((e) => e.status === "rejected")}
//         />
//       ),
//     },


//   ];
//   const fetchAllHrEmployeesData = async () => {
//     const isDropdown = "false";
//     const res = await getAdminAllHREmployees({ isDropdown });
//     if (res.status) {
//       const rData = res.data.map((itm) => {
//         return {
//           value: itm.id,
//           label: itm.name,
//         };
//       });

//       setAllHrEmployees(rData);
//     } else {
//       setAllHrEmployees([]);
//     }
//   };

//   const fetchLeaveData = async () => {
//     const res = await getAdminAllLeavesType();
//     if (res.status) {
//       const rData = res.data.map((itm) => {
//         return {
//           value: itm.id,
//           label: itm.leave_type,
//         };
//       });
//       setLeavet(rData);
//     } else {
//       setLeavet([]);
//     }
//   };
//   const fetchData = async () => {
//     const res = await getAllAppliedLeaves(search, pageSize, pageNo);
//     if (res.status) {
//       setAppliedLeaves(res.data);
//       setPageDetail(res.pageDetails);
//     } else {
//       setAppliedLeaves([]);
//       setPageDetail({});
//     }
//   };


//   const handleSubmitFrom = async (values, { setSubmitting, resetForm }) => {
//     // console.log(values);
//     const bodyFormData = new FormData();
//     bodyFormData.set("user_id", values.user_id.value);
//     bodyFormData.set("leave_type_id", values.leave_type_id.value);
//     bodyFormData.set("start_date", values.start_date);
//     bodyFormData.set("end_date", values.end_date);
//     bodyFormData.set("reason", values.reason);
//     bodyFormData.set("image", values.image);
//     bodyFormData.set("status", "approved");
//     const res = await assignLeave(bodyFormData);
//     if (res.status) {
//       toast.success(res.message);
//     } else {
//       toast.error(res.message);
//     }
//     resetForm();
//     setSubmitting(false);
//     setAssignShow(false);
//     setRefresh(!refresh);
//   };

//   useEffect(() => {
//     fetchData();
//     fetchAllHrEmployeesData();
//     fetchPermissions();
//     fetchLeaveData();
//   }, [search, pageSize, pageNo, refresh]);

//   return (
//     <>
//       <Helmet>
//         <title>Leaves · CMS Electricals</title>
//       </Helmet>
//       <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
//         <CardComponent
//           title={"All Employees Leaves"}
//           search={true}
//           searchOnChange={(e) => {
//             setSearch(e.target.value);
//           }}
//           icon={<BsPlus />}
//           onclick={() => {
//             setAssignShow(true);
//           }}
//           // tag={"Create"}
//           tag={permissions.create ? t("Create") : null}

//         >
//           <Tabs
//             activeTab="1"
//             ulClassName="border-primary me-1 border-bottom"
//             activityClassName="bg-secondary"
//           >

//             {tabs.map((tab, idx) => (
//               <Tab key={idx} title={tab.title} className={tab.className}>
//                 <div className="mt-4">{tab.page}

//                 </div>


//               </Tab>

//             ))}
//           </Tabs>

//         </CardComponent>
//       </Col>

//       <Modaljs
//         open={detailShow}
//         size={"md"}
//         closebtn={"Cancel"}
//         hideFooter={"d-none"}
//         close={() => setDetailShow(false)}
//         title={t("View Details")}
//       >
//         <div className="shadow m-2 after-bg-light">
//           <div className="d-align h-100 p-3 gap-5 justify-content-start">
//             <div className="my-bg p-2 rounded-circle">
//               <img
//                 className="border-blue object-fit rounded-circle"
//                 height={100}
//                 width={100}
//                 src={
//                   edit.user_image
//                     ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
//                     : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
//                 }
//                 alt={edit?.applicant_name}
//               />
//             </div>
//             <div className="d-grid gap-2">
//               <small className={"text-green"}>
//                 <BsLightningCharge /> {edit?.leave_type}
//               </small>
//               {edit?.applicant_name && (
//                 <p className="mb-0 fw-bold">{edit?.applicant_name}</p>
//               )}

//               {edit?.supporting_documents && (
//                 <small className="text-gray">
//                   <a
//                     className="text-secondary"
//                     target="_blank"
//                     href={
//                       process.env.REACT_APP_API_URL + edit?.supporting_documents
//                     }
//                   >
//                     {"supporting documents"}
//                   </a>
//                 </small>
//               )}

//               {edit?.reason && (
//                 <small className="text-gray">
//                   {t("reason")} - {edit?.reason}
//                 </small>
//               )}
//               <small className="text-gray">
//                 <BsCalendarDate /> {t("Start date")} -{" "}
//                 <span className="text-success fw-bolder">
//                   {moment(edit?.start_date).format("DD/MM/YYYY")}
//                 </span>
//               </small>
//               <small className="text-gray">
//                 <BsCalendarDate /> {t("End date")} -{" "}
//                 <span className="text-danger fw-bolder">
//                   {moment(edit?.end_date).format("DD/MM/YYYY")}
//                 </span>
//               </small>
//               <small className="text-gray">
//                 {t("Duration")} -{" "}
//                 <span className="fw-bolder">{edit?.total_days}.00</span> Days{" "}
//                 <span className="fw-bolder">{edit?.total_hours}</span> Hours
//               </small>
//             </div>
//           </div>
//         </div>
//       </Modaljs>

//       {/* Assign Leave */}
//       <Formik
//         enableReinitialize={true}
//         initialValues={{
//           user_id: "",
//           leave_type_id: "",
//           start_date: "",
//           end_date: "",
//           reason: "",
//           image: null,
//         }}
//         validationSchema={assignLeaveSchema}
//         onSubmit={handleSubmitFrom}
//       >
//         {(props) => (
//           <Modaljs
//             formikProps={props}
//             open={assignShow}
//             size={"md"}
//             closebtn={"Cancel"}
//             Savebtn={"Save"}
//             close={() => setAssignShow(false)}
//             title={t("Create Leave")}

//           >
//             {/* Display the remaining leaves */}
//             <div>
//             <p><strong>{t("Remaining Leaves")}:</strong> <strong>{user.remaining_leaves}</strong></p>
//             </div>
//             <Col md={12} className="mx-auto">
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>{t("Employee")}</Form.Label>
//                 <Col md={8}>
//                   <Select
//                     menuPosition="fixed"
//                     className="text-primary"
//                     options={allHrEmployees}
//                     name={"user_id"}
//                     value={props.values.user_id}
//                     onChange={(val) => props.setFieldValue("user_id", val)}
//                   />
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>{t("Leave Type")}</Form.Label>
//                 <Col md={8}>
//                   <Select
//                     menuPosition="fixed"
//                     className="text-primary"
//                     options={leavet}
//                     name={"leave_type_id"}
//                     value={props.values.leave_type_id}
//                     onChange={(val) =>
//                       props.setFieldValue("leave_type_id", val)
//                     }
//                   />
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>{t("Start Date")}</Form.Label>
//                 <Col md={8}>
//                   <Form.Control
//                     type="date"
//                     name={"start_date"}
//                     value={props.values.start_date}
//                     onChange={props.handleChange}
//                     onBlur={props.handleBlur}
//                     isInvalid={Boolean(
//                       props.touched.start_date && props.errors.start_date
//                     )}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {props.errors.start_date}
//                   </Form.Control.Feedback>
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>{t("End date")}</Form.Label>
//                 <Col md={8}>
//                   <Form.Control
//                     type="date"
//                     name="end_date"
//                     value={props.values.end_date}
//                     onChange={props.handleChange}
//                     onBlur={props.handleBlur}
//                     isInvalid={Boolean(
//                       props.touched.end_date && props.errors.end_date
//                     )}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {props.errors.end_date}
//                   </Form.Control.Feedback>
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>{t("reason")}</Form.Label>
//                 <Col md={8}>
//                   <TextareaAutosize
//                     placeholder={t("Type Reason...")}
//                     className="edit-textarea"
//                     name="reason"
//                     value={props.values.reason}
//                     onChange={props.handleChange}
//                     onBlur={props.handleBlur}
//                     isInvalid={Boolean(
//                       props.touched.reason && props.errors.reason
//                     )}
//                   />
//                   <small className="text-danger">{props.errors.reason}</small>
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row}>
//                 <Form.Label column>{t("Document")}</Form.Label>
//                 <Col md={8}>
//                   <Form.Control
//                     type="file"
//                     name={"image"}
//                     onChange={(e) =>
//                       props.setFieldValue("image", e.target.files[0])
//                     }
//                     onBlur={props.handleBlur}
//                   />
//                 </Col>
//               </Form.Group>
//             </Col>
//           </Modaljs>
//         )}
//       </Formik>
//     </>
//   );
// };

// export default Leaves;



// import React, { useState, useEffect } from "react";
// import Tabs, { Tab } from "react-best-tabs";
// import "react-best-tabs/dist/index.css";
// import { Col, Form, Row } from "react-bootstrap";
// import { Helmet } from "react-helmet";
// import CardComponent from "../../../components/CardComponent";
// import Modaljs from "../../../components/Modal";
// import TextareaAutosize from "react-textarea-autosize";
// import ApprovedLeave from "./ApprovedLeave";
// import Select from "react-select";
// import RequestLeave from "./RequestLeave";
// import RejectedLeave from "./RejectedLeave";
// import LeaveHistory from "./LeaveHistory";
// import {
//   assignLeave,
//   getAdminAllHREmployees,
//   getAdminAllLeavesType,
//   getAllAppliedLeaves,
//   getAllModuleByRoleId,
//   adminProfile,
//   getAllHolidayList,
// } from "../../../services/authapi";
// import { BsCalendarDate, BsLightningCharge, BsPlus } from "react-icons/bs";
// import moment from "moment";
// import { Formik } from "formik";
// import { toast } from "react-toastify";
// import { assignLeaveSchema } from "../../../utils/formSchema";
// import { useTranslation } from "react-i18next";
// import { selectUser } from "../../../features/auth/authSlice";
// import { useSelector } from "react-redux";

// const Leaves = () => {
//   const [appliedLeaves, setAppliedLeaves] = useState([]);
//   const [detailShow, setDetailShow] = useState(false);
//   const [assignShow, setAssignShow] = useState(false);
//   const [edit, setEdit] = useState({});
//   const [pageDetail, setPageDetail] = useState({});
//   const [search, setSearch] = useState(0);
//   const [pageNo, setPageNo] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const [leavet, setLeavet] = useState([]);
//   const [refresh, setRefresh] = useState(false);
//   const [allHrEmployees, setAllHrEmployees] = useState([]);
//   const [userData, setUserData] =useState([]);
//   const [holidayList, setHolidayList] = useState([]);
//   const { t } = useTranslation();
//   const { user } = useSelector(selectUser);

//   const [permissions, setPermissions] = useState({
//     create: false,
//     update: false,
//     delete: false,
//     view: false,
//   });
//   const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
//   const currentYear = new Date().getFullYear();
//   const [selectedYear, setSelectedYear] = useState(currentYear);

//   const fetchPermissions = async () => {
//     try {
//       const userID = user.user_type; // Assuming `user_type` is the user's role identifier
//       const res = await getAllModuleByRoleId(userID);
//       if (res.status && res.data.length > 0) {
//         const hrModule = res.data.find((module) => module.title === "HR Management");
//         if (hrModule && hrModule.submodules) {
//           const employeesSubmodule = hrModule.submodules.find(
//             (submodule) => submodule.title === "Leaves"
//           );
//           if (employeesSubmodule) {
//             setPermissions({
//               create: Boolean(employeesSubmodule.create),
//               update: Boolean(employeesSubmodule.update),
//               delete: Boolean(employeesSubmodule.delete),
//               view: true, // Ensure view is set explicitly to true
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

//   const fetchUserDetails = async () => {
//     try {
//       const res = await adminProfile(); // Assuming adminProfile is an API function
//       console.log("Response data:", res);

//       if (res && res.data) {
//         setUserData(res.data); // Safely set the user data
//       } else {
//         console.warn("Unexpected response structure:", res);
//       }
//     } catch (error) {
//       console.error("Failed to fetch user details:", error);
//     }
//   };

//   const handleEdit = async (ele) => {
//     setEdit(ele);
//     setDetailShow(true);
//   };
//   const tabs = [
//     {
//       title: t("Request Leave"),
//       page: (
//         <RequestLeave
//           refresh={refresh}
//           setRefresh={setRefresh}
//           search={search}
//           handleEdit={handleEdit}
//           setDetailShow={setDetailShow}
//         />
//       ),
//     },
//     {
//       title: t("Approved Leave"),
//       page: (
//         <ApprovedLeave
//           refresh={refresh}
//           handleEdit={handleEdit}
//           setDetailShow={setDetailShow}
//           data={appliedLeaves.filter((e) => e.status === "approved")}
//         />
//       ),
//     },
//     {
//       title: t("Rejected Leave"),
//       page: (
//         <RejectedLeave
//           refresh={refresh}
//           handleEdit={handleEdit}
//           setDetailShow={setDetailShow}
//           data={appliedLeaves.filter((e) => e.status === "rejected")}
//         />
//       ),
//     },

//     {
//       title: t("Leave History"),
//       page: (
//         <LeaveHistory
//           refresh={refresh}
//           setRefresh={setRefresh}
//           search={search}
//           handleEdit={handleEdit}
//           setDetailShow={setDetailShow}
//           data={appliedLeaves.filter((e) => e.status !== "pending")}

//         />
//       ),
//     },


//   ];
//   const fetchAllHrEmployeesData = async () => {
//     const isDropdown = "false";
//     const res = await getAdminAllHREmployees({ isDropdown });
//     if (res.status) {
//       const rData = res.data.map((itm) => {
//         return {
//           value: itm.id,
//           label: itm.name,
//         };
//       });

//       setAllHrEmployees(rData);
//     } else {
//       setAllHrEmployees([]);
//     }
//   };

//   const fetchLeaveData = async () => {
//     const res = await getAdminAllLeavesType();
//     if (res.status) {
//       const rData = res.data.map((itm) => {
//         return {
//           value: itm.id,
//           label: itm.leave_type,
//         };
//       });
//       setLeavet(rData);
//     } else {
//       setLeavet([]);
//     }
//   };

//   const fetchData = async () => {
//     const res = await getAllAppliedLeaves(search, pageSize, pageNo);
//     if (res.status) {
//       setAppliedLeaves(res.data);
//       setPageDetail(res.pageDetails);
//     } else {
//       setAppliedLeaves([]);
//       setPageDetail({});
//     }
//   };

//   const fetchHolidayData = async()=>{
//     try {
//       const res = await getAllHolidayList("", "", "", selectedYear);
//       console.log("res for holiday in leave sections", res)
//       if(res.status){
//         setHolidayList(res.data)
//       }
//     } catch (error) {
//       setHolidayList([])
//     }
//   }

//   const handleSubmitFrom = async (values, { setSubmitting, resetForm }) => {
//     // Calculate adjusted requested days
//     const startDate = moment(values.start_date);
//     const endDate = moment(values.end_date);
//     const isSameDate = startDate.isValid() && endDate.isValid() && startDate.isSame(endDate, "day");

//     let adjustedRequestedDays = 0;
//     let leave_duration = "Full Day"; // Default to Full Day

//     if (values.shortLeave) {
//       adjustedRequestedDays = 0.25; // Short Leave = 0.25 day
//       leave_duration = "Short Leave";
//     } else if (values.halfDay) {
//       adjustedRequestedDays = 0.5; // Half Day = 0.5 day
//       leave_duration = "Half Day";
//     } else {
//       adjustedRequestedDays = startDate.isValid() && endDate.isValid() ? endDate.diff(startDate, 'days') + 1 : 0;
//     }

//     const remainingLeaves = userData.remaining_leaves || 0; // Assuming `user.remaining_leaves` is available
//     const paidDays = Math.min(adjustedRequestedDays, remainingLeaves);
//     const unpaidDays = Math.max(adjustedRequestedDays - remainingLeaves, 0);

//     // Prepare FormData
//     const bodyFormData = new FormData();
//     bodyFormData.set("user_id", values.user_id.value);
//     bodyFormData.set("leave_type_id", values.leave_type_id.value);
//     bodyFormData.set("start_date", values.start_date);
//     bodyFormData.set("end_date", values.end_date);
//     bodyFormData.set("leave_duration", leave_duration);
//     bodyFormData.set("requested_days", adjustedRequestedDays);
//     bodyFormData.set("remaining_leaves", (remainingLeaves - adjustedRequestedDays));
//     bodyFormData.set("paid_days", paidDays);
//     bodyFormData.set("unpaid_days", unpaidDays);
//     bodyFormData.set("reason", values.reason);
//     bodyFormData.set("image", values.image);
//     bodyFormData.set("status", "approved");

//     // Send request to the server
//     const res = await assignLeave(bodyFormData);
//     if (res.status) {
//       toast.success(res.message);
//     } else {
//       toast.error(res.message);
//     }
//     resetForm();
//     setSubmitting(false);
//     setAssignShow(false);
//     setRefresh(!refresh);
//   };

//   useEffect(() => {
//     fetchData();
//     fetchAllHrEmployeesData();
//     fetchPermissions();
//     fetchLeaveData();
//     fetchUserDetails();
//     fetchHolidayData();
//   }, [search, pageSize, pageNo, refresh]);

//   return (
//     <>
//       <Helmet>
//         <title>Leaves · CMS Electricals</title>
//       </Helmet>
//       <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
//         <CardComponent
//           title={"All Employees Leaves"}
//           search={true}
//           searchOnChange={(e) => {
//             setSearch(e.target.value);
//           }}
//           icon={<BsPlus />}
//           onclick={() => {
//             setAssignShow(true);
//           }}
//           // tag={"Create"}
//           tag={permissions.create ? t("Create") : null}

//         >
//           <Tabs
//             activeTab="1"
//             ulClassName="border-primary me-1 border-bottom"
//             activityClassName="bg-secondary"
//           >

//             {tabs.map((tab, idx) => (
//               <Tab key={idx} title={tab.title} className={tab.className}>
//                 <div className="mt-4">{tab.page}

//                 </div>


//               </Tab>

//             ))}
//           </Tabs>

//         </CardComponent>
//       </Col>

//       <Modaljs
//         open={detailShow}
//         size={"md"}
//         closebtn={"Cancel"}
//         hideFooter={"d-none"}
//         close={() => setDetailShow(false)}
//         title={t("View Details")}
//       >
//         <div className="shadow m-2 after-bg-light">
//           <div className="d-align h-100 p-3 gap-5 justify-content-start">
//             <div className="my-bg p-2 rounded-circle">
//               <img
//                 className="border-blue object-fit rounded-circle"
//                 height={100}
//                 width={100}
//                 src={
//                   edit.user_image
//                     ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
//                     : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
//                 }
//                 alt={edit?.applicant_name}
//               />
//             </div>
//             <div className="d-grid gap-2">
//               <small className={"text-green"}>
//                 <BsLightningCharge /> {edit?.leave_type}
//               </small>
//               {edit?.applicant_name && (
//                 <p className="mb-0 fw-bold">{edit?.applicant_name}</p>
//               )}

//               {edit?.supporting_documents && (
//                 <small className="text-gray">
//                   <a
//                     className="text-secondary"
//                     target="_blank"
//                     href={
//                       process.env.REACT_APP_API_URL + edit?.supporting_documents
//                     }
//                   >
//                     {"supporting documents"}
//                   </a>
//                 </small>
//               )}

//               {edit?.reason && (
//                 <small className="text-gray">
//                   {t("reason")} - {edit?.reason}
//                 </small>
//               )}
//               <small className="text-gray">
//                 <BsCalendarDate /> {t("Start date")} -{" "}
//                 <span className="text-success fw-bolder">
//                   {moment(edit?.start_date).format("DD/MM/YYYY")}
//                 </span>
//               </small>
//               <small className="text-gray">
//                 <BsCalendarDate /> {t("End date")} -{" "}
//                 <span className="text-danger fw-bolder">
//                   {moment(edit?.end_date).format("DD/MM/YYYY")}
//                 </span>
//               </small>
//               <small className="text-gray">
//                 {t("Duration")} -{" "}
//                 <span className="fw-bolder">{edit?.total_days}.00</span> Days{" "}
//                 <span className="fw-bolder">{edit?.total_hours}</span> Hours
//               </small>
//               <small className="text-gray">
//                 {t("Paid Days")} -{" "}
//                 <span className="fw-bolder">{edit?.paid_days}</span> Days{" "}
//               </small>
//               <small className="text-gray">
//                 {t("unpaid days")} -{" "}
//                 <span className="fw-bolder">{edit?.unpaid_days}</span> Days{" "}
//               </small>
//             </div>
//           </div>
//         </div>
//       </Modaljs>

//       {/* Assign Leave */}
//       <Formik
//         enableReinitialize={true}
//         initialValues={{
//           user_id: "",
//           leave_type_id: "",
//           start_date: "",
//           end_date: "",
//           leave_duration: "",
//           reason: "",
//           image: null,
//           shortLeave: false, // New field for Short Leave
//           halfDay: false, // New field for Half Day
//         }}
//         validationSchema={assignLeaveSchema}
//         onSubmit={handleSubmitFrom}
//       >
//         {(props) => {
//           const startDate = moment(props.values.start_date);
//           const endDate = moment(props.values.end_date);
//           const isSameDate = startDate.isValid() && endDate.isValid() && startDate.isSame(endDate, "day");

//           // Calculate the requested leave days based on the checkboxes
//           let adjustedRequestedDays = 0;
//           if (props.values.shortLeave) {
//             adjustedRequestedDays = 0.25; // Short Leave = 0.25 day
//           } else if (props.values.halfDay) {
//             adjustedRequestedDays = 0.5; // Half Day = 0.5 day
//           } else {
//             adjustedRequestedDays = startDate.isValid() && endDate.isValid() ? endDate.diff(startDate, 'days') + 1 : 0;
//           }

//           const remainingLeaves = userData.remaining_leaves || 0;

//           const paidDays = Math.min(adjustedRequestedDays, remainingLeaves);
//           const unpaidDays = Math.max(adjustedRequestedDays - remainingLeaves, 0);

//           return (
//             <Modaljs
//               formikProps={props}
//               open={assignShow}
//               size={"md"}
//               closebtn={"Cancel"}
//               Savebtn={"Save"}
//               close={() => setAssignShow(false)}
//               title={t("Create Leave")}
//             >
//               {/* Display the remaining leaves and adjusted calculations */}
//               <div className="mb-3">
//                 <div className="row">
//                   <div className="col-6">
//                     <p>
//                       {t("Remaining Leaves")}:{" "}
//                       <strong>{remainingLeaves}</strong>
//                     </p>
//                   </div>
//                   <div className="col-6">
//                     <p>
//                       {t("Paid Days")}:{" "}
//                       <strong>{paidDays}</strong>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="col-6">
//                     <p>
//                       {t("Requested Days")}:{" "}
//                       <strong>{adjustedRequestedDays}</strong>
//                     </p>
//                   </div>
//                   <div className="col-6">
//                     <p>
//                       {t("Unpaid Days")}:{" "}
//                       <strong>{unpaidDays}</strong>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Leave Form Fields */}
//               <Col md={12} className="mx-auto">


//                 <Form.Group as={Row} className="mb-3">
//                   <Form.Label column>{t("Employee")}</Form.Label>
//                   <Col md={8}>
//                     <Select
//                       menuPosition="fixed"
//                       className="text-primary"
//                       options={allHrEmployees}
//                       name={"user_id"}
//                       value={props.values.user_id}
//                       onChange={(val) => props.setFieldValue("user_id", val)}
//                     />
//                   </Col>
//                 </Form.Group>
//                 <Form.Group as={Row} className="mb-3">
//                   <Form.Label column>{t("Leave Type")}</Form.Label>
//                   <Col md={8}>
//                     <Select
//                       menuPosition="fixed"
//                       className="text-primary"
//                       options={leavet}
//                       name={"leave_type_id"}
//                       value={props.values.leave_type_id}
//                       onChange={(val) => props.setFieldValue("leave_type_id", val)}
//                     />
//                   </Col>
//                 </Form.Group>
//                 <Form.Group as={Row} className="mb-3">
//                   <Form.Label column>{t("Start Date")}</Form.Label>
//                   <Col md={8}>
//                     <Form.Control
//                       type="date"
//                       name={"start_date"}
//                       value={props.values.start_date}
//                       onChange={props.handleChange}
//                       onBlur={props.handleBlur}
//                       isInvalid={Boolean(props.touched.start_date && props.errors.start_date)}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {props.errors.start_date}
//                     </Form.Control.Feedback>
//                   </Col>
//                 </Form.Group>
//                 <Form.Group as={Row} className="mb-3">
//                   <Form.Label column>{t("End Date")}</Form.Label>
//                   <Col md={8}>
//                     <Form.Control
//                       type="date"
//                       name="end_date"
//                       value={props.values.end_date}
//                       onChange={props.handleChange}
//                       onBlur={props.handleBlur}
//                       isInvalid={Boolean(props.touched.end_date && props.errors.end_date)}
//                     />


//                     <Form.Control.Feedback type="invalid">
//                       {props.errors.end_date}
//                     </Form.Control.Feedback>
//                   </Col>
//                 </Form.Group>
//                 <Form.Group as={Row} className="mb-3">
//                   <Form.Label column>{t("Leave Duration")}</Form.Label>
//                   <Col md={8}>
//                     <div className="d-flex align-items-center">
//                       {/* Short Leave Checkbox */}
//                       <div className="form-check me-4">
//                         <Form.Check
//                           type="checkbox"
//                           name="shortLeave"
//                           label={t("Short Leave")}
//                           disabled={!isSameDate}
//                           checked={props.values.shortLeave}
//                           onChange={() => {
//                             props.setFieldValue("shortLeave", !props.values.shortLeave);
//                             if (!props.values.shortLeave) {
//                               props.setFieldValue("halfDay", false); // Uncheck Half Day if Short Leave is selected
//                             }
//                           }}
//                         />
//                         <small className="text-muted">{t("(0.25 days)")}</small>
//                       </div>

//                       {/* Half Day Checkbox */}
//                       <div className="form-check">
//                         <Form.Check
//                           type="checkbox"
//                           name="halfDay"
//                           label={t("Half Day")}
//                           disabled={!isSameDate}
//                           checked={props.values.halfDay}
//                           onChange={() => {
//                             props.setFieldValue("halfDay", !props.values.halfDay);
//                             if (!props.values.halfDay) {
//                               props.setFieldValue("shortLeave", false); // Uncheck Short Leave if Half Day is selected
//                             }
//                           }}
//                         />
//                         <small className="text-muted">{t("(0.5 days)")}</small>
//                       </div>
//                     </div>
//                   </Col>
//                 </Form.Group>
//                 <Form.Group as={Row} className="mb-3">
//                   <Form.Label column>{t("Reason")}</Form.Label>
//                   <Col md={8}>
//                     <TextareaAutosize
//                       placeholder={t("Type Reason...")}
//                       className="edit-textarea"
//                       name="reason"
//                       value={props.values.reason}
//                       onChange={props.handleChange}
//                       onBlur={props.handleBlur}
//                       isInvalid={Boolean(props.touched.reason && props.errors.reason)}
//                     />
//                     <small className="text-danger">{props.errors.reason}</small>
//                   </Col>
//                 </Form.Group>
//                 <Form.Group as={Row}>
//                   <Form.Label column>{t("Document")}</Form.Label>
//                   <Col md={8}>
//                     <Form.Control
//                       type="file"
//                       name={"image"}
//                       onChange={(e) => props.setFieldValue("image", e.target.files[0])}
//                       onBlur={props.handleBlur}
//                     />
//                   </Col>
//                 </Form.Group>
//               </Col>
//             </Modaljs>
//           );
//         }}
//       </Formik>

//     </>
//   );
// };

// export default Leaves;




import React, { useState, useEffect } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import Modaljs from "../../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import ApprovedLeave from "./ApprovedLeave";
import Select from "react-select";
import RequestLeave from "./RequestLeave";
import RejectedLeave from "./RejectedLeave";
import LeaveHistory from "./LeaveHistory";

import {
  assignLeave,
  getAdminAllHREmployees,
  getAdminAllLeavesType,
  getAllAppliedLeaves,
  getAllModuleByRoleId,
  adminProfile,
  getAllHolidayList,
  getAllLeaveBalance,
} from "../../../services/authapi";
import { BsCalendarDate, BsLightningCharge, BsPlus } from "react-icons/bs";
import moment from "moment";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { assignLeaveSchema } from "../../../utils/formSchema";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import LeaveBalance from "./LeaveBalance";

const Leaves = () => {
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [detailShow, setDetailShow] = useState(false);
  const [assignShow, setAssignShow] = useState(false);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [leavet, setLeavet] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [allHrEmployees, setAllHrEmployees] = useState([]);
  const [userData, setUserData] = useState([]);
  const [holidayList, setHolidayList] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);

  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: false,
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const fetchPermissions = async () => {
    try {
      const userID = user.user_type; // Assuming `user_type` is the user's role identifier
      const res = await getAllModuleByRoleId(userID);
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "HR Management");
        if (hrModule && hrModule.submodules) {
          const employeesSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "Leaves"
          );
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

  const fetchUserDetails = async () => {
    try {
      const res = await adminProfile(); // Assuming adminProfile is an API function
      console.log("Response data:", res);

      if (res && res.data) {
        setUserData(res.data); // Safely set the user data
      } else {
        console.warn("Unexpected response structure:", res);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

    const fetchLeaveBalance = async () => {
      try {
        const response = await getAllLeaveBalance(selectedYear, selectedMonth);
        if (response.status) {
          setLeaveBalance(response.leaveStatuses || []);
        } else {
          setLeaveBalance([]);
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching leave balance:", error);
        setLeaveBalance([]);
      } 
    };

  const handleEdit = async (ele) => {
    setEdit(ele);
    setDetailShow(true);
  };
  const tabs = [
    {
      title: t("Request Leave"),
      page: (
        <RequestLeave
          refresh={refresh}
          setRefresh={setRefresh}
          search={search}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
        />
      ),
    },
    {
      title: t("Approved Leave"),
      page: (
        <ApprovedLeave
          refresh={refresh}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
          data={appliedLeaves.filter((e) => e.status === "approved")}
        />
      ),
    },
    {
      title: t("Rejected Leave"),
      page: (
        <RejectedLeave
          refresh={refresh}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
          data={appliedLeaves.filter((e) => e.status === "rejected")}
        />
      ),
    },

    {
      title: t("Leave History"),
      page: (
        <LeaveHistory
          refresh={refresh}
          setRefresh={setRefresh}
          search={search}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
          data={appliedLeaves.filter((e) => e.status !== "pending")}

        />
      ),
    },

    {
      title: t("Leave Balance"),
      page: (
        <LeaveBalance
          refresh={refresh}
          setRefresh={setRefresh}
          search={search}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
          data={appliedLeaves}

        />
      ),
    },


  ];
  const fetchAllHrEmployeesData = async () => {
    const isDropdown = "false";
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.name,
        };
      });

      setAllHrEmployees(rData);
    } else {
      setAllHrEmployees([]);
    }
  };

  const fetchLeaveData = async () => {
    const res = await getAdminAllLeavesType();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.leave_type,
        };
      });
      setLeavet(rData);
    } else {
      setLeavet([]);
    }
  };

  const fetchData = async () => {
    const res = await getAllAppliedLeaves(search, pageSize, pageNo);
    if (res.status) {
      setAppliedLeaves(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAppliedLeaves([]);
      setPageDetail({});
    }
  };

  const fetchHolidayData = async () => {
    try {
      const res = await getAllHolidayList("", "", "", selectedYear);
      console.log("res for holiday in leave sections", res);
      if (res.status) {
        setHolidayList(res.data);
      }
    } catch (error) {
      setHolidayList([]);
    }
  };




  // const [checkSubmit, setCheckSubmit] = useState(false);

  // const handleSubmitFrom = async (values, { setSubmitting, resetForm }) => {
  //   // Calculate adjusted requested days
  //   const startDate = moment(values.start_date);
  //   const endDate = moment(values.end_date);
  //   const isSameDate = startDate.isValid() && endDate.isValid() && startDate.isSame(endDate, "day");

  //   const checkHolidayAndSameDayLeave = async () => {
  //     // Check if the start date and end date are the same
  //     if (moment(values.start_date).isSame(values.end_date, "day")) {
  //       // If start and end dates are the same, check if it's a holiday
  //       console.log("holidayList", holidayList);
  //       const isHoliday = holidayList.some((holiday) =>
  //         moment(values.start_date).isSame(holiday.holiday_date, "day")
  //       );

  //       console.log("isHoliday", isHoliday);
  //       if (isHoliday) {
  //         toast.error("You cannot apply for leave on a holiday");
  //         setSubmitting(false);
  //         setCheckSubmit(false); // Reset state to false if leave is on a holiday
  //         return false; // Prevent further submission
  //       }
  //     }
  //     // If no holiday issue, set checkSubmit to true (allow submission)
  //     setCheckSubmit(true);
  //     return true;
  //   };

  //   // Ensure that we wait for the holiday check before proceeding
  //   const isHolidayValid = await checkHolidayAndSameDayLeave();
  //   if (!isHolidayValid) {
  //     return; // Exit if there's an issue with holiday
  //   }

  //   let adjustedRequestedDays = 0;
  //   let leave_duration = "Full Day"; // Default to Full Day

  //   if (values.shortLeave) {
  //     adjustedRequestedDays = 0.25; // Short Leave = 0.25 day
  //     leave_duration = "Short Leave";
  //   } else if (values.halfDay) {
  //     adjustedRequestedDays = 0.5; // Half Day = 0.5 day
  //     leave_duration = "Half Day";
  //   } else {
  //     adjustedRequestedDays = startDate.isValid() && endDate.isValid() ? endDate.diff(startDate, 'days') + 1 : 0;
  //   }

  //   const remainingLeaves = userData.remaining_leaves || 0; // Assuming `user.remaining_leaves` is available
  //   const paidDays = Math.min(adjustedRequestedDays, remainingLeaves);
  //   const unpaidDays = Math.max(adjustedRequestedDays - remainingLeaves, 0);
  //   console.log("testing the leave data", remainingLeaves, paidDays, unpaidDays);

  //   // Prepare FormData
  //   const bodyFormData = new FormData();
  //   bodyFormData.set("user_id", values.user_id.value);
  //   bodyFormData.set("leave_type_id", values.leave_type_id.value);
  //   bodyFormData.set("start_date", values.start_date);
  //   bodyFormData.set("end_date", values.end_date);
  //   bodyFormData.set("leave_duration", leave_duration);
  //   bodyFormData.set("requested_days", adjustedRequestedDays);
  //   bodyFormData.set("remaining_leaves", (remainingLeaves - adjustedRequestedDays));
  //   bodyFormData.set("paid_days", paidDays);
  //   bodyFormData.set("unpaid_days", unpaidDays);
  //   bodyFormData.set("reason", values.reason);
  //   bodyFormData.set("image", values.image);
  //   bodyFormData.set("status", "approved");

  //   // Send request to the server if the holiday check passed and checkSubmit is true
  //   if (checkSubmit === false) {
  //     const res = await assignLeave(bodyFormData);
  //     if (res) {
  //       toast.success(res.message);
  //     } else {
  //       toast.error(res.message);
  //     }
  //   } else {
  //     toast.error("Office holiday is selected");
  //   }

  //   resetForm();
  //   setSubmitting(false);
  //   setAssignShow(false);
  //   setRefresh(!refresh);
  // };


  const handleSubmitFrom = async (values, { setSubmitting, resetForm }) => {
    // Calculate adjusted requested days
    const startDate = moment(values.start_date);
    const endDate = moment(values.end_date);
    const isSameDate = startDate.isValid() && endDate.isValid() && startDate.isSame(endDate, "day");

    const checkHolidayAndSameDayLeave = async () => {
      // Check if the start date and end date are the same
      if (moment(values.start_date).isSame(values.end_date, "day")) {
        // Check if it's a Sunday
        const isSunday = moment(values.start_date).day() === 0; // day() returns 0 for Sunday
        if (isSunday) {
          toast.error("You cannot apply for leave on a Sunday");
          setSubmitting(false);
          setCheckSubmit(false); // Reset state to false if leave is on a Sunday
          return false; // Prevent further submission
        }

        // If start and end dates are the same, check if it's a holiday
        console.log("holidayList", holidayList);
        const isHoliday = holidayList.some((holiday) =>
          moment(values.start_date).isSame(holiday.holiday_date, "day")
        );

        if (isHoliday) {
          toast.error("You cannot apply for leave on a holiday");
          setSubmitting(false);
          setCheckSubmit(false); // Reset state to false if leave is on a holiday
          return false; // Prevent further submission
        }
      }

      // If start and end dates are different, no condition to check, proceed directly
      return true; // Continue submission if no issues with dates
    };

    // Ensure that we wait for the holiday and Sunday check before proceeding
    const isHolidayValid = await checkHolidayAndSameDayLeave();
    if (!isHolidayValid) {
      return; // Exit if there's an issue with holiday or Sunday
    }


    let adjustedRequestedDays = 0;
    let leave_duration = "Full Day"; // Default to Full Day

    if (values.shortLeave) {
      adjustedRequestedDays = 0.25; // Short Leave = 0.25 day
      leave_duration = "Short Leave";
    } else if (values.halfDay) {
      adjustedRequestedDays = 0.5; // Half Day = 0.5 day
      leave_duration = "Half Day";
    } else {
      adjustedRequestedDays = startDate.isValid() && endDate.isValid() ? endDate.diff(startDate, 'days') + 1 : 0;
    }

    const remainingLeaves = userData.remaining_leaves || 0; // Assuming `user.remaining_leaves` is available
    const paidDays = Math.min(adjustedRequestedDays, remainingLeaves);
    const unpaidDays = Math.max(adjustedRequestedDays - remainingLeaves, 0);
    console.log("testing the leave data", remainingLeaves, paidDays, unpaidDays);

    // Prepare FormData
    const bodyFormData = new FormData();
    bodyFormData.set("user_id", values.user_id.value);
    bodyFormData.set("leave_type_id", values.leave_type_id.value);
    bodyFormData.set("start_date", values.start_date);
    bodyFormData.set("end_date", values.end_date);
    bodyFormData.set("leave_duration", leave_duration);
    bodyFormData.set("requested_days", adjustedRequestedDays);
    bodyFormData.set("remaining_leaves", (remainingLeaves - adjustedRequestedDays));
    bodyFormData.set("paid_days", paidDays);
    bodyFormData.set("unpaid_days", unpaidDays);
    bodyFormData.set("reason", values.reason);
    bodyFormData.set("image", values.image);
    bodyFormData.set("status", "approved");

    // Send request to the server if the holiday check passed
    if (checkSubmit === false) {
      const res = await assignLeave(bodyFormData);
      if (res) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error("You can on holiday.");
    }

    resetForm();
    setSubmitting(false);
    setAssignShow(false);
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchData();
    fetchAllHrEmployeesData();
    fetchPermissions();
    fetchLeaveData();
    fetchUserDetails();
    fetchHolidayData();
    fetchLeaveBalance();
  }, [search, pageSize, pageNo, refresh]);

  return (
    <>
      <Helmet>
        <title>Leaves · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Employees Leaves"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          onclick={() => {
            setAssignShow(true);
          }}
          // tag={"Create"}
          tag={permissions.create ? t("Create") : null}

        >
          <Tabs
            activeTab="1"
            ulClassName="border-primary me-1 border-bottom"
            activityClassName="bg-secondary"
          >

            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <div className="mt-4">{tab.page}

                </div>


              </Tab>

            ))}
          </Tabs>

        </CardComponent>
      </Col>

      <Modaljs
        open={detailShow}
        size={"md"}
        closebtn={"Cancel"}
        hideFooter={"d-none"}
        close={() => setDetailShow(false)}
        title={t("View Details")}
      >
        <div className="shadow m-2 after-bg-light">
          <div className="d-align h-100 p-3 gap-5 justify-content-start">
            <div className="my-bg p-2 rounded-circle">
              <img
                className="border-blue object-fit rounded-circle"
                height={100}
                width={100}
                src={
                  edit.user_image
                    ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                }
                alt={edit?.applicant_name}
              />
            </div>
            <div className="d-grid gap-2">
              <small className={"text-green"}>
                <BsLightningCharge /> {edit?.leave_type}
              </small>
              {edit?.applicant_name && (
                <p className="mb-0 fw-bold">{edit?.applicant_name}</p>
              )}

              {edit?.supporting_documents && (
                <small className="text-gray">
                  <a
                    className="text-secondary"
                    target="_blank"
                    href={
                      process.env.REACT_APP_API_URL + edit?.supporting_documents
                    }
                  >
                    {"supporting documents"}
                  </a>
                </small>
              )}

              {edit?.reason && (
                <small className="text-gray">
                  {t("reason")} - {edit?.reason}
                </small>
              )}
              <small className="text-gray">
                <BsCalendarDate /> {t("Start date")} -{" "}
                <span className="text-success fw-bolder">
                  {moment(edit?.start_date).format("DD/MM/YYYY")}
                </span>
              </small>
              <small className="text-gray">
                <BsCalendarDate /> {t("End date")} -{" "}
                <span className="text-danger fw-bolder">
                  {moment(edit?.end_date).format("DD/MM/YYYY")}
                </span>
              </small>
              <small className="text-gray">
                {t("Duration")} -{" "}
                <span className="fw-bolder">{edit?.total_days}.00</span> Days{" "}
                <span className="fw-bolder">{edit?.total_hours}</span> Hours
              </small>
              <small className="text-gray">
                {t("Paid Days")} -{" "}
                <span className="fw-bolder">{edit?.paid_days}</span> Days{" "}
              </small>
              <small className="text-gray">
                {t("unpaid days")} -{" "}
                <span className="fw-bolder">{edit?.unpaid_days}</span> Days{" "}
              </small>
            </div>
          </div>
        </div>
      </Modaljs>

      {/* Assign Leave */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          user_id: "",
          leave_type_id: "",
          start_date: "",
          end_date: "",
          leave_duration: "",
          reason: "",
          image: null,
          shortLeave: false, // New field for Short Leave
          halfDay: false, // New field for Half Day
        }}
        validationSchema={assignLeaveSchema}
        onSubmit={handleSubmitFrom}
      >
        {(props) => {
          const startDate = moment(props.values.start_date);
          const endDate = moment(props.values.end_date);
          const isSameDate = startDate.isValid() && endDate.isValid() && startDate.isSame(endDate, "day");

          // Calculate the requested leave days based on the checkboxes
          let adjustedRequestedDays = 0;
          if (props.values.shortLeave) {
            adjustedRequestedDays = 0.25; // Short Leave = 0.25 day
          } else if (props.values.halfDay) {
            adjustedRequestedDays = 0.5; // Half Day = 0.5 day
          } else {
            adjustedRequestedDays = startDate.isValid() && endDate.isValid() ? endDate.diff(startDate, 'days') + 1 : 0;
          }

          const remainingLeaves = userData.remaining_leaves || 0;
          const paidDays = Math.min(adjustedRequestedDays, remainingLeaves);
          const unpaidDays = Math.max(adjustedRequestedDays - remainingLeaves, 0);
          const getUnpaidDays =  Number(leaveBalance[0]?.unpaid_leaves) + Number(unpaidDays);

          return (
            <Modaljs
              formikProps={props}
              open={assignShow}
              size={"md"}
              closebtn={"Cancel"}
              Savebtn={"Save"}
              close={() => setAssignShow(false)}
              title={t("Create Leave")}
            >
              {/* Display the remaining leaves and adjusted calculations */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-6">
                    <p>
                      {t("Remaining Leaves")}:{" "}
                      <strong>{remainingLeaves}</strong>
                    </p>
                  </div>
                  <div className="col-6">
                    <p>
                      {t("Paid Days")}:{" "}
                      <strong>{paidDays}</strong>
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <p>
                      {t("Requested Days")}:{" "}
                      <strong>{adjustedRequestedDays}</strong>
                    </p>
                  </div>
                  <div className="col-6">
                    <p>
                      {t("Unpaid Days")}:{" "}
                      <strong>{getUnpaidDays}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Leave Form Fields */}
              <Col md={12} className="mx-auto">


                <Form.Group as={Row} className="mb-3">
                  <Form.Label column>{t("Employee")}</Form.Label>
                  <Col md={8}>
                    <Select
                      menuPosition="fixed"
                      className="text-primary"
                      options={allHrEmployees}
                      name={"user_id"}
                      value={props.values.user_id}
                      onChange={(val) => props.setFieldValue("user_id", val)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column>{t("Leave Type")}</Form.Label>
                  <Col md={8}>
                    <Select
                      menuPosition="fixed"
                      className="text-primary"
                      options={leavet}
                      name={"leave_type_id"}
                      value={props.values.leave_type_id}
                      onChange={(val) => props.setFieldValue("leave_type_id", val)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column>{t("Start Date")}</Form.Label>
                  <Col md={8}>
                    <Form.Control
                      type="date"
                      name={"start_date"}
                      value={props.values.start_date}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(props.touched.start_date && props.errors.start_date)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.start_date}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column>{t("End Date")}</Form.Label>
                  <Col md={8}>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={props.values.end_date}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(props.touched.end_date && props.errors.end_date)}
                    />


                    <Form.Control.Feedback type="invalid">
                      {props.errors.end_date}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column>{t("Leave Duration")}</Form.Label>
                  <Col md={8}>
                    <div className="d-flex align-items-center">
                      {/* Short Leave Checkbox */}
                      <div className="form-check me-4">
                        <Form.Check
                          type="checkbox"
                          name="shortLeave"
                          label={t("Short Leave")}
                          disabled={!isSameDate}
                          checked={props.values.shortLeave}
                          onChange={() => {
                            props.setFieldValue("shortLeave", !props.values.shortLeave);
                            if (!props.values.shortLeave) {
                              props.setFieldValue("halfDay", false); // Uncheck Half Day if Short Leave is selected
                            }
                          }}
                        />
                        <small className="text-muted">{t("(0.25 days)")}</small>
                      </div>

                      {/* Half Day Checkbox */}
                      <div className="form-check">
                        <Form.Check
                          type="checkbox"
                          name="halfDay"
                          label={t("Half Day")}
                          disabled={!isSameDate}
                          checked={props.values.halfDay}
                          onChange={() => {
                            props.setFieldValue("halfDay", !props.values.halfDay);
                            if (!props.values.halfDay) {
                              props.setFieldValue("shortLeave", false); // Uncheck Short Leave if Half Day is selected
                            }
                          }}
                        />
                        <small className="text-muted">{t("(0.5 days)")}</small>
                      </div>
                    </div>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column>{t("Reason")}</Form.Label>
                  <Col md={8}>
                    <TextareaAutosize
                      placeholder={t("Type Reason...")}
                      className="edit-textarea"
                      name="reason"
                      value={props.values.reason}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(props.touched.reason && props.errors.reason)}
                    />
                    <small className="text-danger">{props.errors.reason}</small>
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column>{t("Document")}</Form.Label>
                  <Col md={8}>
                    <Form.Control
                      type="file"
                      name={"image"}
                      onChange={(e) => props.setFieldValue("image", e.target.files[0])}
                      onBlur={props.handleBlur}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Modaljs>
          );
        }}
      </Formik>

    </>
  );
};

export default Leaves;
