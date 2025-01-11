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
// import { ErrorMessage, Formik } from "formik";
// import { toast } from "react-toastify";
// import { assignLeaveSchema } from "../../../utils/formSchema";
// import { checkPermission } from "../../../utils/checkPermissions";
// import { CREATED } from "../../../utils/constants";
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../../features/auth/authSlice";

// const Leaves = () => {
//   let { pathname } = useLocation();
//   const { user } = useSelector(selectUser);
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
//   const handleEdit = async (ele) => {
//     setEdit(ele);
//     setDetailShow(true);
//   };
//   const tabs = [
//     {
//       title: "Request Leave",
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
//       title: "Approved Leave",
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
//       title: "Rejected Leave",
//       page: (
//         <RejectedLeave
//           refresh={refresh}
//           handleEdit={handleEdit}
//           setDetailShow={setDetailShow}
//           data={appliedLeaves.filter((e) => e.status === "rejected")}
//         />
//       ),
//     },
//     ,
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

//   // console.log('edit', edit)

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

//     const params = await checkPermission({
//       user_id: user.id,
//       pathname: `/${pathname.split("/")[1]}`,
//     });
//     params["action"] = CREATED;

//     const res = await assignLeave(bodyFormData, params);
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
//           tag={"Create"}
//         >
//           <Tabs
//             activeTab="1"
//             ulClassName="border-primary me-1 border-bottom"
//             activityClassName="bg-secondary"
//           >
//             {tabs.map((tab, idx) => (
//               <Tab key={idx} title={tab.title} className={tab.className}>
//                 <div className="mt-4">{tab.page}</div>
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
//         title={"View Details"}
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
//                     supporting documents
//                   </a>
//                 </small>
//               )}

//               {edit?.reason && (
//                 <small className="text-gray">reason - {edit?.reason}</small>
//               )}
//               <small className="text-gray">
//                 <BsCalendarDate /> Start date -{" "}
//                 <span className="text-success fw-bolder">
//                   {moment(edit?.start_date).format("DD/MM/YYYY")}
//                 </span>
//               </small>
//               <small className="text-gray">
//                 <BsCalendarDate /> End date -{" "}
//                 <span className="text-danger fw-bolder">
//                   {moment(edit?.end_date).format("DD/MM/YYYY")}
//                 </span>
//               </small>
//               <small className="text-gray">
//                 Duration -{" "}
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
//             title={"Assign Leave"}
//           >
//             <Col md={12} className="mx-auto">
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>
//                   Employee <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Col md={8}>
//                   <Select
//                     menuPosition="fixed"
//                     className="text-primary"
//                     options={allHrEmployees}
//                     name={"user_id"}
//                     value={props.values.user_id}
//                     onChange={(val) => props.setFieldValue("user_id", val)}
//                   />
//                   <ErrorMessage
//                     name="user_id"
//                     component="small"
//                     className="text-danger"
//                   />
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>
//                   Leave Type <span className="text-danger">*</span>
//                 </Form.Label>
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
//                   <ErrorMessage
//                     name="leave_type_id"
//                     component="small"
//                     className="text-danger"
//                   />
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>
//                   Start Date <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Col md={8}>
//                   <Form.Control
//                     type="date"
//                     name={"start_date"}
//                     value={props.values.start_date}
//                     onChange={props.handleChange}
//                   />
//                   <ErrorMessage
//                     name="start_date"
//                     component="small"
//                     className="text-danger"
//                   />
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>
//                   End Date <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Col md={8}>
//                   <Form.Control
//                     type="date"
//                     name="end_date"
//                     value={props.values.end_date}
//                     onChange={props.handleChange}
//                   />
//                   <ErrorMessage
//                     name="end_date"
//                     component="small"
//                     className="text-danger"
//                   />
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column>
//                   Reason <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Col md={8}>
//                   <TextareaAutosize
//                     placeholder="Type Reason...."
//                     className="edit-textarea"
//                     name="reason"
//                     value={props.values.reason}
//                     onChange={props.handleChange}
//                   />
//                   <ErrorMessage
//                     name="reason"
//                     component="small"
//                     className="text-danger"
//                   />
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Row}>
//                 <Form.Label column>Document</Form.Label>
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
import {
  assignLeave,
  getAdminAllHREmployees,
  getAdminAllLeavesType,
  getAllAppliedLeaves,
} from "../../../services/authapi";
import { BsCalendarDate, BsLightningCharge, BsPlus } from "react-icons/bs";
import moment from "moment";
import { ErrorMessage, Formik } from "formik";
import { toast } from "react-toastify";
import { assignLeaveSchema } from "../../../utils/formSchema";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED } from "../../../utils/constants";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";

const Leaves = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
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
  const handleEdit = async (ele) => {
    setEdit(ele);
    setDetailShow(true);
  };
  const tabs = [
    {
      title: "Request Leave",
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
      title: "Approved Leave",
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
      title: "Rejected Leave",
      page: (
        <RejectedLeave
          refresh={refresh}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
          data={appliedLeaves.filter((e) => e.status === "rejected")}
        />
      ),
    },
    ,
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

  // console.log('edit', edit)

  const handleSubmitFrom = async (values, { setSubmitting, resetForm }) => {
    // console.log(values);
    const bodyFormData = new FormData();
    bodyFormData.set("user_id", values.user_id.value);
    bodyFormData.set("leave_type_id", values.leave_type_id.value);
    bodyFormData.set("start_date", values.start_date);
    bodyFormData.set("end_date", values.end_date);
    bodyFormData.set("reason", values.reason);
    bodyFormData.set("image", values.image);
    bodyFormData.set("status", "approved");

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = CREATED;

    const res = await assignLeave(bodyFormData, params);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setAssignShow(false);
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchData();
    fetchAllHrEmployeesData();
    fetchLeaveData();
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
          tag={"Create"}
        >
          <Tabs
            activeTab="1"
            ulClassName="border-primary me-1 border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <div className="mt-4">{tab.page}</div>
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
        title={"View Details"}
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
                    supporting documents
                  </a>
                </small>
              )}

              {edit?.reason && (
                <small className="text-gray">reason - {edit?.reason}</small>
              )}
              <small className="text-gray">
                <BsCalendarDate /> Start date -{" "}
                <span className="text-success fw-bolder">
                  {moment(edit?.start_date).format("DD/MM/YYYY")}
                </span>
              </small>
              <small className="text-gray">
                <BsCalendarDate /> End date -{" "}
                <span className="text-danger fw-bolder">
                  {moment(edit?.end_date).format("DD/MM/YYYY")}
                </span>
              </small>
              <small className="text-gray">
                Duration -{" "}
                <span className="fw-bolder">{edit?.total_days}.00</span> Days{" "}
                <span className="fw-bolder">{edit?.total_hours}</span> Hours
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
          reason: "",
          image: null,
        }}
        validationSchema={assignLeaveSchema}
        onSubmit={handleSubmitFrom}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={assignShow}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setAssignShow(false)}
            title={"Assign Leave"}
          >
            <Col md={12} className="mx-auto">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column>
                  Employee <span className="text-danger">*</span>
                </Form.Label>
                <Col md={8}>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    options={allHrEmployees}
                    name={"user_id"}
                    value={props.values.user_id}
                    onChange={(val) => props.setFieldValue("user_id", val)}
                  />
                  <ErrorMessage
                    name="user_id"
                    component="small"
                    className="text-danger"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column>
                  Leave Type <span className="text-danger">*</span>
                </Form.Label>
                <Col md={8}>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    options={leavet}
                    name={"leave_type_id"}
                    value={props.values.leave_type_id}
                    onChange={(val) =>
                      props.setFieldValue("leave_type_id", val)
                    }
                  />
                  <ErrorMessage
                    name="leave_type_id"
                    component="small"
                    className="text-danger"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column>
                  Start Date <span className="text-danger">*</span>
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    type="date"
                    name={"start_date"}
                    value={props.values.start_date}
                    onChange={props.handleChange}
                  />
                  <ErrorMessage
                    name="start_date"
                    component="small"
                    className="text-danger"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column>
                  End Date <span className="text-danger">*</span>
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={props.values.end_date}
                    onChange={props.handleChange}
                  />
                  <ErrorMessage
                    name="end_date"
                    component="small"
                    className="text-danger"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column>
                  Reason <span className="text-danger">*</span>
                </Form.Label>
                <Col md={8}>
                  <TextareaAutosize
                    placeholder="Type Reason...."
                    className="edit-textarea"
                    name="reason"
                    value={props.values.reason}
                    onChange={props.handleChange}
                  />
                  <ErrorMessage
                    name="reason"
                    component="small"
                    className="text-danger"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column>Document</Form.Label>
                <Col md={8}>
                  <Form.Control
                    type="file"
                    name={"image"}
                    onChange={(e) =>
                      props.setFieldValue("image", e.target.files[0])
                    }
                    onBlur={props.handleBlur}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default Leaves;
