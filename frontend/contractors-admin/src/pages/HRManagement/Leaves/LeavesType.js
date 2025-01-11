// import React, { useEffect, useState } from "react";
// import "react-best-tabs/dist/index.css";
// import { Col, Form, Row, Table } from "react-bootstrap";
// import { Helmet } from "react-helmet";
// import { BsPlus } from "react-icons/bs";
// import CardComponent from "../../../components/CardComponent";
// import Modaljs from "../../../components/Modal";
// import TextareaAutosize from "react-textarea-autosize";
// import ActionButton from "../../../components/ActionButton";
// import {
//   getAdminAllLeavesType,
//   getAdminCreateLeavesType,
//   getAdminDeleteLeavesType,
//   getAdminUpdateLeavesType,
//   getAllModuleByRoleId,
// } from "../../../services/authapi";
// import { toast } from "react-toastify";
// import { Formik } from "formik";
// import { addRolesSchema } from "../../../utils/formSchema";
// import ConfirmAlert from "../../../components/ConfirmAlert";
// import moment from "moment";
// import Select from "react-select";
// import { selectUser } from "../../../features/auth/authSlice";
// import { useSelector } from "react-redux";
// import ReactPagination from "../../../components/ReactPagination";

// const LeavesType = () => {
//   const [leavesTypeData, setLeavesTypeData] = useState(false);
//   const [leavet, setLeavet] = useState([]);
//   const [edit, setEdit] = useState({});
//   const [idToDelete, setIdToDelete] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [pageDetail, setPageDetail] = useState({});
//   const [search, setSearch] = useState(0);
//   const [pageNo, setPageNo] = useState(1);
//   const [pageSize, setPageSize] = useState(8);

//   const fetchLeaveData = async () => {
//     const res = await getAdminAllLeavesType(search, pageSize, pageNo);
//     if (res.status) {
//       setLeavet(res.data);
//       setPageDetail(res.pageDetails);
//     } else {
//       setLeavet([]);
//       setPageDetail({});
//     }
//   };

//   const handleEdit = async (leavet) => {
//     setEdit(leavet);
//     setLeavesTypeData(true);
//   };

//   const handleDelete = async () => {
//     const res = await getAdminDeleteLeavesType(idToDelete);
//     if (res.status) {
//       toast.success(res.message);
//       setLeavet((prev) => prev.filter((itm) => itm.id !== idToDelete));
//       fetchLeaveData();
//     } else {
//       toast.error(res.message);
//     }
//     setIdToDelete("");
//     setShowAlert(false);
//   };

//   useEffect(() => {
//     fetchLeaveData();
//   }, [search, pageSize, pageNo]);

//   const handlePageSizeChange = (selectedOption) => {
//     setPageSize(selectedOption.value);
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     // return console.log('values', values)
//     const leaveStatus = values.status.value;
//     const sData = {
//       leave_type: values.name,
//       description: values.description,
//       status: leaveStatus,
//     };

//     if (edit.id) {
//       sData["id"] = edit.id;
//     }
//     // console.log('sData', sData)
//     const res = edit.id
//       ? await getAdminUpdateLeavesType(sData)
//       : await getAdminCreateLeavesType(sData);
//     if (res.status) {
//       fetchLeaveData();
//       toast.success(res.message);
//     } else {
//       toast.error(res.message);
//     }
//     resetForm();
//     setSubmitting(false);
//     setLeavesTypeData(false);
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Leaves Type · CMS Electricals</title>
//       </Helmet>
//       <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
//         <CardComponent
//           title={"Leaves Type"}
//           icon={<BsPlus />}
//           onclick={() => {
//             setEdit({});
//             setLeavesTypeData(true);
//           }}
//           search={true}
//           searchOnChange={(e) => {
//             setSearch(e.target.value);
//           }}
//           tag={"Create"}
//         >
//           <div className="table-scroll p-2">
//             <Table className="text-body bg-new Roles">
//               <thead className="text-truncate">
//                 <tr>
//                   {[
//                     "Sr No.",
//                     "Leaves Type",
//                     "Description",
//                     "Date",
//                     "Status",
//                     "Action",
//                   ].map((thead) => (
//                     <th key={thead}>{thead}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {leavet?.length > 0 ? null : (
//                   <tr>
//                     <td colSpan={6}>
//                       <img
//                         className="p-3"
//                         alt="no-result"
//                         width="230"
//                         src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
//                       />
//                     </td>
//                   </tr>
//                 )}
//                 {leavet.map((leavet, idx) => (
//                   <tr key={idx}>
//                     <td>{idx + 1}</td>
//                     <td>{leavet.leave_type}</td>
//                     <td>{leavet.description}</td>
//                     <td>{moment(leavet.created_at).format("DD-MM-YYYY")}</td>
//                     <td
//                       className={`text-${
//                         leavet.status === 1 ? "green" : "danger"
//                       }`}
//                     >
//                       {leavet.status === 1 ? "Active" : "Inactive"}
//                     </td>
//                     <td>
//                       <ActionButton
//                         deleteOnclick={() => {
//                           setIdToDelete(leavet.id);
//                           setShowAlert(true);
//                         }}
//                         hideEye={"d-none"}
//                         editOnclick={() => handleEdit(leavet)}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <ReactPagination
//               pageSize={pageSize}
//               prevClassName={
//                 pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
//               }
//               nextClassName={
//                 leavet.length < pageSize
//                   ? "danger-combo-disable pe-none"
//                   : "success-combo"
//               }
//               title={`Showing ${pageDetail?.pageStartResult || 0} to ${
//                 pageDetail?.pageEndResult || 0
//               } of ${pageDetail?.total || 0}`}
//               handlePageSizeChange={handlePageSizeChange}
//               prevonClick={() => setPageNo(pageNo - 1)}
//               nextonClick={() => setPageNo(pageNo + 1)}
//             />
//           </div>
//         </CardComponent>
//       </Col>

//       <Formik
//         enableReinitialize={true}
//         initialValues={{
//           id: edit?.id || "",
//           name: edit?.leave_type || "",
//           description: edit?.description || "",
//           status:
//             +edit.status === 1
//               ? { label: "Active", value: 1 }
//               : { label: "InActive", value: 0 } || {
//                   label: "InActive",
//                   value: 0,
//                 },
//         }}
//         validationSchema={addRolesSchema}
//         onSubmit={handleSubmit}
//       >
//         {(props) => (
//           <Modaljs
//             formikProps={props}
//             open={leavesTypeData}
//             size={"md"}
//             closebtn={"Cancel"}
//             Savebtn={edit.id ? "Update" : "Save"}
//             close={() => setLeavesTypeData(false)}
//             title={edit.id ? "Update Leave" : "Create Leave"}
//           >
//             <Row className="g-2">
//               <Form.Group as={Col} md={6}>
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={props.values.name}
//                   onChange={props.handleChange}
//                   onBlur={props.handleBlur}
//                 />
//               </Form.Group>
//               <Form.Group as={Col} md={6}>
//                 <Form.Label>Status</Form.Label>
//                 <Select
//                   // ref={selectRef}
//                   menuPosition="fixed"
//                   name={"status"}
//                   options={[
//                     { label: "Active", value: 1 },
//                     { label: "Inactive", value: 0 },
//                   ]}
//                   value={props.values.status}
//                   onChange={(selectedOption) => {
//                     props.setFieldValue("status", selectedOption);
//                   }}
//                 />
//               </Form.Group>
//               <Form.Group as={Col} md={12}>
//                 <Form.Label>Description</Form.Label>
//                 <TextareaAutosize
//                   onChange={props.handleChange}
//                   value={props.values.description}
//                   name="description"
//                   className="edit-textarea"
//                 />
//               </Form.Group>
//             </Row>
//           </Modaljs>
//         )}
//       </Formik>

//       <ConfirmAlert
//         size={"sm"}
//         deleteFunction={handleDelete}
//         hide={setShowAlert}
//         show={showAlert}
//         title={"Confirm Delete"}
//         description={"Are you sure you want to delete this!!"}
//       />
//     </>
//   );
// };

// export default LeavesType;



// import React, { useEffect, useState } from "react";
// import "react-best-tabs/dist/index.css";
// import { Col, Form, Row, Table } from "react-bootstrap";
// import { Helmet } from "react-helmet";
// import { BsPlus } from "react-icons/bs";
// import CardComponent from "../../../components/CardComponent";
// import Modaljs from "../../../components/Modal";
// import TextareaAutosize from "react-textarea-autosize";
// import ActionButton from "../../../components/ActionButton";
// import {
//   getAdminAllLeavesType,
//   getAdminCreateLeavesType,
//   getAdminDeleteLeavesType,
//   getAdminUpdateLeavesType,
//   getAllModuleByRoleId,
// } from "../../../services/authapi";
// import { toast } from "react-toastify";
// import { Formik } from "formik";
// import { addRolesSchema } from "../../../utils/formSchema";
// import ConfirmAlert from "../../../components/ConfirmAlert";
// import moment from "moment";
// import Select from "react-select";
// import { selectUser } from "../../../features/auth/authSlice";
// import { useSelector } from "react-redux";
// import ReactPagination from "../../../components/ReactPagination";

// const LeavesType = () => {
//   const [leavesTypeData, setLeavesTypeData] = useState(false);
//   const [leavet, setLeavet] = useState([]);
//   const [edit, setEdit] = useState({});
//   const [idToDelete, setIdToDelete] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [pageDetail, setPageDetail] = useState({});
//   const [search, setSearch] = useState(0);
//   const [pageNo, setPageNo] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const [permissions, setPermissions] = useState({
//     create: 0,
//     update: 0,
//     delete: 0,
//     view: 1, // All users can view by default
//   });
//   const { user } = useSelector(selectUser);

//   const fetchLeaveData = async () => {
//     const res = await getAdminAllLeavesType(search, pageSize, pageNo);
//     if (res.status) {
//       setLeavet(res.data);
//       setPageDetail(res.pageDetails);
//     } else {
//       setLeavet([]);
//       setPageDetail({});
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
//             (submodule) => submodule.title === "Leaves Type"
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
//     }
//   };

//   const handleEdit = (leavet) => {
//     setEdit(leavet);
//     setLeavesTypeData(true);
//   };

//   const handleDelete = async () => {
//     const res = await getAdminDeleteLeavesType(idToDelete);
//     if (res.status) {
//       toast.success(res.message);
//       setLeavet((prev) => prev.filter((itm) => itm.id !== idToDelete));
//       fetchLeaveData();
//     } else {
//       toast.error(res.message);
//     }
//     setIdToDelete("");
//     setShowAlert(false);
//   };

//   useEffect(() => {
//     fetchLeaveData();
//     fetchPermissions();
//   }, [search, pageSize, pageNo]);

//   const handlePageSizeChange = (selectedOption) => {
//     setPageSize(selectedOption.value);
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     const leaveStatus = values.status.value;
//     const sData = {
//       leave_type: values.name,
//       description: values.description,
//       status: leaveStatus,
//     };

//     if (edit.id) {
//       sData["id"] = edit.id;
//     }
//     const res = edit.id
//       ? await getAdminUpdateLeavesType(sData)
//       : await getAdminCreateLeavesType(sData);
//     if (res.status) {
//       fetchLeaveData();
//       toast.success(res.message);
//     } else {
//       toast.error(res.message);
//     }
//     resetForm();
//     setSubmitting(false);
//     setLeavesTypeData(false);
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Leaves Type · CMS Electricals</title>
//       </Helmet>
//       <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
//         <CardComponent
//           title={"Leaves Type"}
//           icon={<BsPlus />}
//           onclick={() => {
//             setEdit({});
//             setLeavesTypeData(true);
//           }}
//           search={true}
//           searchOnChange={(e) => setSearch(e.target.value)}
//           tag={permissions.create ? "Create" : null} // Hide "Create" button if no permission
//         >
//           <div className="table-scroll p-2">
//             <Table className="text-body bg-new Roles">
//               {/* <thead className="text-truncate">
//                 <tr>
//                   {[
//                     "Sr No.",
//                     "Leaves Type",
//                     "Description",
//                     "Date",
//                     "Status",
//                     "Action",
//                   ].map((thead) => (
//                     <th key={thead}>{thead}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {leavet?.length > 0 ? null : (
//                   <tr>
//                     <td colSpan={6}>
//                       <img
//                         className="p-3"
//                         alt="no-result"
//                         width="230"
//                         src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
//                       />
//                     </td>
//                   </tr>
//                 )}
//                 {leavet.map((leavet, idx) => (
//                   <tr key={idx}>
//                     <td>{idx + 1}</td>
//                     <td>{leavet.leave_type}</td>
//                     <td>{leavet.description}</td>
//                     <td>{moment(leavet.created_at).format("DD-MM-YYYY")}</td>
//                     <td
//                       className={`text-${leavet.status === 1 ? "green" : "danger"}`}
//                     >
//                       {leavet.status === 1 ? "Active" : "Inactive"}
//                     </td>
//                     <td>
//                       <ActionButton
//                         deleteOnclick={() => {
//                           setIdToDelete(leavet.id);
//                           setShowAlert(true);
//                         }}
//                         hideDelete={permissions.delete ? "" : "d-none"} // Hide "Delete" button if no permission
//                         editOnclick={() => handleEdit(leavet)}
//                         hideEdit={permissions.update ? "" : "d-none"} // Hide "Edit" button if no permission
//                         hideEye={"d-none"} // Not used
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody> */}

//               <thead className="text-truncate">
//                 <tr>
//                   {[
//                     "Sr No.",
//                     "Leaves Type",
//                     "Description",
//                     "Date",
//                     "Status",
//                   ].map((thead) => (
//                     <th key={thead}>{thead}</th>
//                   ))}
//                   {(permissions.update || permissions.delete) && <th>Action</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {leavet?.length > 0 ? null : (
//                   <tr>
//                     <td colSpan={permissions.update || permissions.delete ? 6 : 5}>
//                       <img
//                         className="p-3"
//                         alt="no-result"
//                         width="230"
//                         src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
//                       />
//                     </td>
//                   </tr>
//                 )}
//                 {leavet.map((leavet, idx) => (
//                   <tr key={idx}>
//                     <td>{idx + 1}</td>
//                     <td>{leavet.leave_type}</td>
//                     <td>{leavet.description}</td>
//                     <td>{moment(leavet.created_at).format("DD-MM-YYYY")}</td>
//                     <td
//                       className={`text-${leavet.status === 1 ? "green" : "danger"}`}
//                     >
//                       {leavet.status === 1 ? "Active" : "Inactive"}
//                     </td>
//                     {(permissions.update || permissions.delete) && (
//                       <td>
//                         <ActionButton
//                           deleteOnclick={() => {
//                             setIdToDelete(leavet.id);
//                             setShowAlert(true);
//                           }}
//                           hideDelete={permissions.delete ? "" : "d-none"} // Hide "Delete" button if no permission
//                           editOnclick={() => handleEdit(leavet)}
//                           hideEdit={permissions.update ? "" : "d-none"} // Hide "Edit" button if no permission
//                           hideEye={"d-none"} // Not used
//                         />
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>

//             </Table>
//             <ReactPagination
//               pageSize={pageSize}
//               prevClassName={
//                 pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
//               }
//               nextClassName={
//                 leavet.length < pageSize
//                   ? "danger-combo-disable pe-none"
//                   : "success-combo"
//               }
//               title={`Showing ${pageDetail?.pageStartResult || 0} to ${pageDetail?.pageEndResult || 0
//                 } of ${pageDetail?.total || 0}`}
//               handlePageSizeChange={handlePageSizeChange}
//               prevonClick={() => setPageNo(pageNo - 1)}
//               nextonClick={() => setPageNo(pageNo + 1)}
//             />
//           </div>
//         </CardComponent>
//       </Col>

//       <Formik
//         enableReinitialize={true}
//         initialValues={{
//           id: edit?.id || "",
//           name: edit?.leave_type || "",
//           description: edit?.description || "",
//           status:
//             +edit.status === 1
//               ? { label: "Active", value: 1 }
//               : { label: "Inactive", value: 0 },
//         }}
//         validationSchema={addRolesSchema}
//         onSubmit={handleSubmit}
//       >
//         {(props) => (
//           <Modaljs
//             formikProps={props}
//             open={leavesTypeData}
//             size={"md"}
//             closebtn={"Cancel"}
//             Savebtn={edit.id ? "Update" : "Save"}
//             close={() => setLeavesTypeData(false)}
//             title={edit.id ? "Update Leave" : "Create Leave"}
//           >
//             <Row className="g-2">
//               <Form.Group as={Col} md={6}>
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={props.values.name}
//                   onChange={props.handleChange}
//                   onBlur={props.handleBlur}
//                 />
//               </Form.Group>
//               <Form.Group as={Col} md={6}>
//                 <Form.Label>Status</Form.Label>
//                 <Select
//                   menuPosition="fixed"
//                   name={"status"}
//                   options={[
//                     { label: "Active", value: 1 },
//                     { label: "Inactive", value: 0 },
//                   ]}
//                   value={props.values.status}
//                   onChange={(selectedOption) => {
//                     props.setFieldValue("status", selectedOption);
//                   }}
//                 />
//               </Form.Group>
//               <Form.Group as={Col} md={12}>
//                 <Form.Label>Description</Form.Label>
//                 <TextareaAutosize
//                   onChange={props.handleChange}
//                   value={props.values.description}
//                   name="description"
//                   className="edit-textarea"
//                 />
//               </Form.Group>
//             </Row>
//           </Modaljs>
//         )}
//       </Formik>

//       <ConfirmAlert
//         size={"sm"}
//         deleteFunction={handleDelete}
//         hide={setShowAlert}
//         show={showAlert}
//         title={"Confirm Delete"}
//         description={"Are you sure you want to delete this!!"}
//       />
//     </>
//   );
// };

// export default LeavesType;


import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import Modaljs from "../../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import ActionButton from "../../../components/ActionButton";
import {
  getAdminAllLeavesType,
  getAdminCreateLeavesType,
  getAdminDeleteLeavesType,
  getAdminUpdateLeavesType,
  getAllModuleByRoleId,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { addRolesSchema } from "../../../utils/formSchema";
import ConfirmAlert from "../../../components/ConfirmAlert";
import moment from "moment";
import Select from "react-select";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ReactPagination from "../../../components/ReactPagination";

const LeavesType = () => {
  const [leavesTypeData, setLeavesTypeData] = useState(false);
  const [leavet, setLeavet] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: true, // All users can view by default
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
  const { user } = useSelector(selectUser);

  const fetchLeaveData = async () => {
    const res = await getAdminAllLeavesType(search, pageSize, pageNo);
    if (res.status) {
      setLeavet(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setLeavet([]);
      setPageDetail({});
    }
  };

  const fetchPermissions = async () => {
    try {
      const userID = user.user_type;
      const res = await getAllModuleByRoleId(userID);
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "HR Management");
        if (hrModule && hrModule.submodules) {
          const leavesTypeSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "Leaves Type"
          );
          if (leavesTypeSubmodule) {
            setPermissions({
              create: leavesTypeSubmodule.create,
              update: leavesTypeSubmodule.update,
              delete: leavesTypeSubmodule.delete,
              view: 1, // Always allow viewing
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

  const handleEdit = (leavet) => {
    setEdit(leavet);
    setLeavesTypeData(true);
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteLeavesType(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setLeavet((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchLeaveData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchLeaveData();
    fetchPermissions();
  }, [search, pageSize, pageNo]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const leaveStatus = values.status.value;
    const sData = {
      leave_type: values.name,
      description: values.description,
      status: leaveStatus,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    const res = edit.id
      ? await getAdminUpdateLeavesType(sData)
      : await getAdminCreateLeavesType(sData);
    if (res.status) {
      fetchLeaveData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setLeavesTypeData(false);
  };

  return (
    <>
      <Helmet>
        <title>Leaves Type · CMS Electricals</title>
      </Helmet>
      {isPermissionsLoading ? (
        <div>Loading...</div>
      ) : (
        <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
          <CardComponent
            title={"Leaves Type"}
            icon={<BsPlus />}
            onclick={() => {
              setEdit({});
              setLeavesTypeData(true);
            }}
            search={true}
            searchOnChange={(e) => setSearch(e.target.value)}
            tag={permissions.create ? "Create" : null} // Hide "Create" button if no permission
          >
            <div className="table-scroll p-2">
              <Table className="text-body bg-new Roles">
                <thead className="text-truncate">
                  <tr>
                    {[
                      "Sr No.",
                      "Leaves Type",
                      "Description",
                      "Date",
                      "Status",
                    ].map((thead) => (
                      <th key={thead}>{thead}</th>
                    ))}
                    {(permissions.update || permissions.delete) && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {leavet?.length > 0 ? null : (
                    <tr>
                      <td colSpan={permissions.update || permissions.delete ? 6 : 5}>
                        <img
                          className="p-3"
                          alt="no-result"
                          width="230"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                        />
                      </td>
                    </tr>
                  )}
                  {leavet.map((leavet, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{leavet.leave_type}</td>
                      <td>{leavet.description}</td>
                      <td>{moment(leavet.created_at).format("DD-MM-YYYY")}</td>
                      <td
                        className={`text-${leavet.status === 1 ? "green" : "danger"}`}
                      >
                        {leavet.status === 1 ? "Active" : "Inactive"}
                      </td>
                      {(permissions.update || permissions.delete) && (
                        <td>
                          <ActionButton
                            deleteOnclick={() => {
                              setIdToDelete(leavet.id);
                              setShowAlert(true);
                            }}
                            hideDelete={permissions.delete ? "" : "d-none"}
                            editOnclick={() => handleEdit(leavet)}
                            hideEdit={permissions.update ? "" : "d-none"}
                            hideEye={"d-none"}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <ReactPagination
                pageSize={pageSize}
                prevClassName={
                  pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                }
                nextClassName={
                  leavet.length < pageSize
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
            </div>
          </CardComponent>
        </Col>
      )}

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit?.id || "",
          name: edit?.leave_type || "",
          description: edit?.description || "",
          status:
            +edit.status === 1
              ? { label: "Active", value: 1 }
              : { label: "Inactive", value: 0 },
        }}
        validationSchema={addRolesSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={leavesTypeData}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Save"}
            close={() => setLeavesTypeData(false)}
            title={edit.id ? "Update Leave" : "Create Leave"}
          >
            <Row className="g-2">
              <Form.Group as={Col} md={6}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={props.touched.name && props.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Status</Form.Label>
                <Select
                  options={[
                    { label: "Active", value: 1 },
                    { label: "Inactive", value: 0 },
                  ]}
                  value={props.values.status}
                  onChange={(option) => props.setFieldValue("status", option)}
                  onBlur={props.handleBlur}
                  name="status"
                />
                {props.touched.status && props.errors.status && (
                  <div className="text-danger mt-1">{props.errors.status}</div>
                )}
              </Form.Group>
            </Row>
            <Row className="g-2 mt-3">
              <Form.Group as={Col} md={12}>
                <Form.Label>Description</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  className="form-control"
                  name="description"
                  value={props.values.description}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />
                {props.touched.description && props.errors.description && (
                  <div className="text-danger mt-1">
                    {props.errors.description}
                  </div>
                )}
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
      <ConfirmAlert
        onConfirm={handleDelete}
        setShowAlert={setShowAlert}
        showAlert={showAlert}
        title="Are You Sure?"
        message="You want to delete this Leave Type?"
      />
    </>
  );
};

export default LeavesType;

