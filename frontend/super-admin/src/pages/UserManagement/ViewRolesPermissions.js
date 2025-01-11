// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   getAllModuleByRoleId,
//   postRolesPermissions,
// } from "../../services/authapi";
// import { useEffect } from "react";
// import { Col, Form, Spinner } from "react-bootstrap";
// import { Helmet } from "react-helmet";
// import { getIcons } from "../../constants/getIcons";
// import { BsRecord2 } from "react-icons/bs";
// import { Formik } from "formik";
// import { toast } from "react-toastify";
// import CardComponent from "../../components/CardComponent";
// import { useDispatch, useSelector } from "react-redux";
// import { selectUser, setUserPermission } from "../../features/auth/authSlice";

// const CodeTesting = () => {
//   const { userPermission } = useSelector(selectUser);
//   const dispatch = useDispatch();

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [modules, setModules] = useState([]);

//   const fetchAllModulesData = async () => {
//     const res = await getAllModuleByRoleId(id);
//     console.log("logs data",)
//     if (res.status) {
//       setModules(res.data);
//     } else {
//       setModules([]);
//     }
//   };

//   const updatePermission = (
//     moduleId,
//     permissionType,
//     submoduleId,
//     nestedSubmoduleId
//   ) => {
//     const updatedModules = modules.map((item) => {
//       if (item.id === moduleId) {
//         if (!submoduleId) {
//           return {
//             ...item,
//             [permissionType]: item[permissionType] === 1 ? 0 : 1,
//           };
//         }

//         const updatedSubmodules = item.submodules.map((submodule) => {
//           if (submodule.id === submoduleId) {
//             if (!nestedSubmoduleId) {
//               return {
//                 ...submodule,
//                 [permissionType]: submodule[permissionType] === 1 ? 0 : 1,
//               };
//             }

//             const updatedNestedSubmodules = submodule.modulesOfSubModule.map(
//               (nestedSubmodule) => {
//                 if (nestedSubmodule.id === nestedSubmoduleId) {
//                   return {
//                     ...nestedSubmodule,
//                     [permissionType]:
//                       nestedSubmodule[permissionType] === 1 ? 0 : 1,
//                   };
//                 } else {
//                   return nestedSubmodule;
//                 }
//               }
//             );

//             return {
//               ...submodule,
//               modulesOfSubModule: updatedNestedSubmodules,
//             };
//           } else {
//             return submodule;
//           }
//         });

//         return {
//           ...item,
//           submodules: updatedSubmodules,
//         };
//       } else {
//         return item;
//       }
//     });

//     setModules(updatedModules);
//   };

//   useEffect(() => {
//     fetchAllModulesData();
//   }, []);

//   const permissions = ["create", "update", "view", "delete"];

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     const sData = {
//       moduleName: modules,
//       role_id: id,
//     };

//     // return console.log("sData", sData);
//     const res = await postRolesPermissions(sData);
//     if (res.status) {
//       toast.success(res.message);
//       dispatch(setUserPermission(sData.moduleName));
//       resetForm();
//       navigate("/AllRoles");
//     } else {
//       toast.error(res.message);
//     }
//     setSubmitting(false);
//   };

//   return (
//     <Col md={12} data-aos={"fade-up"}>
//       <Helmet>
//         <title>Permissions Features · CMS Electricals</title>
//       </Helmet>
//       <CardComponent className={"after-bg-light"} title={"Edit Permissions"}>
//         <Formik
//           enableReinitialize={true}
//           initialValues={{
//             modules: "",
//           }}
//           onSubmit={handleSubmit}
//         >
//           {(props) => (
//             <Form onSubmit={props.handleSubmit}>
//               <div className="d-grid gap-2">
//                 {modules.map((item, index) => (
//                   <div key={index} className="d-grid gap-3 shadow px-3 py-2">
//                     <div className={"text-black fw-bolder"}>
//                       {getIcons(item.icon)} {item.title}
//                     </div>
//                     {item?.submodules?.length > 0 ? null : (
//                       <div key={index} className="d-grid gap-3">
//                         <div className="d-flex gap-3">
//                           {permissions?.map((el) => (
//                             <label key={el}>
//                               <input
//                                 className="form-check-input"
//                                 checked={item[el] === 1}
//                                 type="checkbox"
//                                 onChange={() => updatePermission(item.id, el)}
//                               />
//                               {el}
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {item?.submodules?.length > 0
//                       ? item.submodules.map((submodule, subIndex) => (
//                           <>
//                             <div key={subIndex}>
//                               <div className={"text-gray fw-bolder mb-2"}>
//                                 <BsRecord2 /> {submodule.title}
//                               </div>
//                               <div className="d-grid gap-3">
//                                 <div className="d-flex gap-3">
//                                   {permissions?.map((el) => (
//                                     <label key={el}>
//                                       <input
//                                         className="form-check-input"
//                                         checked={submodule[el] === 1}
//                                         type="checkbox"
//                                         onChange={() =>
//                                           updatePermission(
//                                             item.id,
//                                             el,
//                                             submodule.id
//                                           )
//                                         }
//                                       />
//                                       {el}
//                                     </label>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                             {submodule?.modulesOfSubModule?.length > 0
//                               ? submodule?.modulesOfSubModule?.map(
//                                   (moduleOfSubModule, moduleIndex) => (
//                                     <div key={moduleIndex} className="ms-3">
//                                       <div
//                                         className={"text-gray fw-bolder mb-2"}
//                                       >
//                                         <BsRecord2 /> {moduleOfSubModule.title}
//                                       </div>
//                                       <div className="d-grid gap-3">
//                                         <div className="d-flex gap-3">
//                                           {permissions?.map((el) => (
//                                             <label key={el}>
//                                               <input
//                                                 className="form-check-input"
//                                                 checked={
//                                                   moduleOfSubModule[el] === 1
//                                                 }
//                                                 type="checkbox"
//                                                 onChange={() =>
//                                                   updatePermission(
//                                                     item.id,
//                                                     el,
//                                                     submodule.id,
//                                                     moduleOfSubModule.id
//                                                   )
//                                                 }
//                                               />
//                                               {el}
//                                             </label>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   )
//                                 )
//                               : null}
//                           </>
//                         ))
//                       : null}
//                   </div>
//                 ))}

//                 <div className="text-center mt-4">
//                   <button
//                     type="submit"
//                     disabled={props?.isSubmitting}
//                     className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
//                   >
//                     {props?.isSubmitting ? (
//                       <>
//                         <Spinner
//                           animation="border"
//                           variant="primary"
//                           size="sm"
//                         />{" "}
//                         PLEASE WAIT...
//                       </>
//                     ) : (
//                       <>{"SAVE Permissions"}</>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </CardComponent>
//     </Col>
//   );
// };

// export default CodeTesting;


// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   getAllModuleByRoleId,
//   postRolesPermissions,
// } from "../../services/authapi";
// import { useEffect } from "react";
// import { Col, Form, Spinner } from "react-bootstrap";
// import { Helmet } from "react-helmet";
// import { getIcons } from "../../constants/getIcons";
// import { BsRecord2 } from "react-icons/bs";
// import { Formik } from "formik";
// import { toast } from "react-toastify";
// import CardComponent from "../../components/CardComponent";
// import { useDispatch, useSelector } from "react-redux";
// import { selectUser, setUserPermission } from "../../features/auth/authSlice";

// const CodeTesting = () => {
//   const { userPermission } = useSelector(selectUser);
//   const dispatch = useDispatch();

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [modules, setModules] = useState([]);

//   const fetchAllModulesData = async () => {
//     const res = await getAllModuleByRoleId(id);
//     console.log("logs data",)
//     if (res.status) {
//       setModules(res.data);
//     } else {
//       setModules([]);
//     }
//   };

//   const updatePermission = (
//     moduleId,
//     permissionType,
//     submoduleId,
//     nestedSubmoduleId,
//     isSelectAll = false
//   ) => {
//     const updatedModules = modules.map((item) => {
//       if (item.id === moduleId) {
//         if (!submoduleId) {
//           // Module level update
//           if (isSelectAll) {
//             // Toggle all permissions for the module
//             return {
//               ...item,
//               create: item.create === 0 ? 1 : 0,
//               update: item.update === 0 ? 1 : 0,
//               view: item.view === 0 ? 1 : 0,
//               delete: item.delete === 0 ? 1 : 0,
//             };
//           }
//           return {
//             ...item,
//             [permissionType]: item[permissionType] === 1 ? 0 : 1,
//           };
//         }

//         const updatedSubmodules = item.submodules.map((submodule) => {
//           if (submodule.id === submoduleId) {
//             if (!nestedSubmoduleId) {
//               // Submodule level update
//               if (isSelectAll) {
//                 // Toggle all permissions for the submodule
//                 return {
//                   ...submodule,
//                   create: submodule.create === 0 ? 1 : 0,
//                   update: submodule.update === 0 ? 1 : 0,
//                   view: submodule.view === 0 ? 1 : 0,
//                   delete: submodule.delete === 0 ? 1 : 0,
//                 };
//               }
//               return {
//                 ...submodule,
//                 [permissionType]: submodule[permissionType] === 1 ? 0 : 1,
//               };
//             }

//             const updatedNestedSubmodules = submodule.modulesOfSubModule.map(
//               (nestedSubmodule) => {
//                 if (nestedSubmodule.id === nestedSubmoduleId) {
//                   // Nested submodule level update
//                   if (isSelectAll) {
//                     // Toggle all permissions for the nested submodule
//                     return {
//                       ...nestedSubmodule,
//                       create: nestedSubmodule.create === 0 ? 1 : 0,
//                       update: nestedSubmodule.update === 0 ? 1 : 0,
//                       view: nestedSubmodule.view === 0 ? 1 : 0,
//                       delete: nestedSubmodule.delete === 0 ? 1 : 0,
//                     };
//                   }
//                   return {
//                     ...nestedSubmodule,
//                     [permissionType]:
//                       nestedSubmodule[permissionType] === 1 ? 0 : 1,
//                   };
//                 } else {
//                   return nestedSubmodule;
//                 }
//               }
//             );

//             return {
//               ...submodule,
//               modulesOfSubModule: updatedNestedSubmodules,
//             };
//           } else {
//             return submodule;
//           }
//         });

//         return {
//           ...item,
//           submodules: updatedSubmodules,
//         };
//       } else {
//         return item;
//       }
//     });

//     setModules(updatedModules);
//   };

//   useEffect(() => {
//     fetchAllModulesData();
//   }, []);

//   const permissions = ["create", "update", "view", "delete"];

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     const sData = {
//       moduleName: modules,
//       role_id: id,
//     };

//     const res = await postRolesPermissions(sData);
//     if (res.status) {
//       toast.success(res.message);
//       dispatch(setUserPermission(sData.moduleName));
//       resetForm();
//       navigate("/AllRoles");
//     } else {
//       toast.error(res.message);
//     }
//     setSubmitting(false);
//   };

//   // Check if all permissions are selected for a given item
//   const isAllPermissionsSelected = (item) => {
//     return permissions.every(perm => item[perm] === 1);
//   };

//   return (
//     <Col md={12} data-aos={"fade-up"}>
//       <Helmet>
//         <title>Permissions Features · CMS Electricals</title>
//       </Helmet>
//       <CardComponent className={"after-bg-light"} title={"Edit Permissions"}>
//         <Formik
//           enableReinitialize={true}
//           initialValues={{
//             modules: "",
//           }}
//           onSubmit={handleSubmit}
//         >
//           {(props) => (
//             <Form onSubmit={props.handleSubmit}>
//               <div className="d-grid gap-2">
//                 {modules.map((item, index) => (
//                   <div key={index} className="d-grid gap-3 shadow px-3 py-2">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div className={"text-black fw-bolder"}>
//                         {getIcons(item.icon)} {item.title}
//                       </div>
//                       <label className="d-flex align-items-center gap-2">
//                         <input
//                           type="checkbox"
//                           className="form-check-input"
//                           checked={isAllPermissionsSelected(item)}
//                           onChange={() => updatePermission(item.id, null, null, null, true)}
//                         />
//                       </label>
//                     </div>
                    
//                     {item?.submodules?.length > 0 ? null : (
//                       <div key={index} className="d-grid gap-3">
//                         <div className="d-flex gap-3">
//                           {permissions?.map((el) => (
//                             <label key={el}>
//                               <input
//                                 className="form-check-input"
//                                 checked={item[el] === 1}
//                                 type="checkbox"
//                                 onChange={() => updatePermission(item.id, el)}
//                               />
//                               {el}
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {item?.submodules?.length > 0
//                       ? item.submodules.map((submodule, subIndex) => (
//                           <div key={subIndex}>
//                             <div className="d-flex justify-content-between align-items-center">
//                               <div className={"text-gray fw-bolder mb-2"}>
//                                 <BsRecord2 /> {submodule.title}
//                               </div>
//                               <label className="d-flex align-items-center gap-2">
//                                 <input
//                                   type="checkbox"
//                                   className="form-check-input"
//                                   checked={isAllPermissionsSelected(submodule)}
//                                   onChange={() => updatePermission(item.id, null, submodule.id, null, true)}
//                                 />
//                               </label>
//                             </div>
//                             <div className="d-grid gap-3">
//                               <div className="d-flex gap-3">
//                                 {permissions?.map((el) => (
//                                   <label key={el}>
//                                     <input
//                                       className="form-check-input"
//                                       checked={submodule[el] === 1}
//                                       type="checkbox"
//                                       onChange={() =>
//                                         updatePermission(
//                                           item.id,
//                                           el,
//                                           submodule.id
//                                         )
//                                       }
//                                     />
//                                     {el}
//                                   </label>
//                                 ))}
//                               </div>
//                             </div>
                            
//                             {submodule?.modulesOfSubModule?.length > 0
//                               ? submodule?.modulesOfSubModule?.map(
//                                   (moduleOfSubModule, moduleIndex) => (
//                                     <div key={moduleIndex} className="ms-3">
//                                       <div className="d-flex justify-content-between align-items-center">
//                                         <div
//                                           className={"text-gray fw-bolder mb-2"}
//                                         >
//                                           <BsRecord2 /> {moduleOfSubModule.title}
//                                         </div>
//                                         <label className="d-flex align-items-center gap-2">
//                                           <input
//                                             type="checkbox"
//                                             className="form-check-input"
//                                             checked={isAllPermissionsSelected(moduleOfSubModule)}
//                                             onChange={() => updatePermission(item.id, null, submodule.id, moduleOfSubModule.id, true)}
//                                           />
//                                         </label>
//                                       </div>
//                                       <div className="d-grid gap-3">
//                                         <div className="d-flex gap-3">
//                                           {permissions?.map((el) => (
//                                             <label key={el}>
//                                               <input
//                                                 className="form-check-input"
//                                                 checked={
//                                                   moduleOfSubModule[el] === 1
//                                                 }
//                                                 type="checkbox"
//                                                 onChange={() =>
//                                                   updatePermission(
//                                                     item.id,
//                                                     el,
//                                                     submodule.id,
//                                                     moduleOfSubModule.id
//                                                   )
//                                                 }
//                                               />
//                                               {el}
//                                             </label>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   )
//                                 )
//                               : null}
//                           </div>
//                         ))
//                       : null}
//                   </div>
//                 ))}

//                 <div className="text-center mt-4">
//                   <button
//                     type="submit"
//                     disabled={props?.isSubmitting}
//                     className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
//                   >
//                     {props?.isSubmitting ? (
//                       <>
//                         <Spinner
//                           animation="border"
//                           variant="primary"
//                           size="sm"
//                         />{" "}
//                         PLEASE WAIT...
//                       </>
//                     ) : (
//                       <>{"SAVE Permissions"}</>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </CardComponent>
//     </Col>
//   );
// };

// export default CodeTesting;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllModuleByRoleId, postRolesPermissions } from "../../services/authapi";
import { Col, Form, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { getIcons } from "../../constants/getIcons";
import { BsRecord2 } from "react-icons/bs";
import { Formik } from "formik";
import { toast } from "react-toastify";
import CardComponent from "../../components/CardComponent";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUserPermission } from "../../features/auth/authSlice";

const CodeTesting = () => {
  const { userPermission } = useSelector(selectUser);
  const dispatch = useDispatch();

  const { id } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [isGlobalSelected, setIsGlobalSelected] = useState(false); // State to track global selection

  const fetchAllModulesData = async () => {
    const res = await getAllModuleByRoleId(id);
    if (res.status) {
      setModules(res.data);
    } else {
      setModules([]);
    }
  };

  // Function to toggle permissions for all modules, submodules, and nested submodules
  const toggleGlobalPermissions = (value) => {
    const updatedModules = modules.map((module) => {
      return {
        ...module,
        create: value ? 1 : 0,
        update: value ? 1 : 0,
        view: value ? 1 : 0,
        delete: value ? 1 : 0,
        submodules: module.submodules.map((submodule) => ({
          ...submodule,
          create: value ? 1 : 0,
          update: value ? 1 : 0,
          view: value ? 1 : 0,
          delete: value ? 1 : 0,
          modulesOfSubModule: submodule.modulesOfSubModule.map((nestedSubmodule) => ({
            ...nestedSubmodule,
            create: value ? 1 : 0,
            update: value ? 1 : 0,
            view: value ? 1 : 0,
            delete: value ? 1 : 0,
          })),
        })),
      };
    });
    setModules(updatedModules);
    setIsGlobalSelected(value); // Update global selection state
  };

  const updatePermission = (
    moduleId,
    permissionType,
    submoduleId,
    nestedSubmoduleId,
    isSelectAll = false
  ) => {
    const updatedModules = modules.map((item) => {
      if (item.id === moduleId) {
        if (!submoduleId) {
          // Module level update
          if (isSelectAll) {
            return {
              ...item,
              create: item.create === 0 ? 1 : 0,
              update: item.update === 0 ? 1 : 0,
              view: item.view === 0 ? 1 : 0,
              delete: item.delete === 0 ? 1 : 0,
            };
          }
          return {
            ...item,
            [permissionType]: item[permissionType] === 1 ? 0 : 1,
          };
        }

        const updatedSubmodules = item.submodules.map((submodule) => {
          if (submodule.id === submoduleId) {
            if (!nestedSubmoduleId) {
              // Submodule level update
              if (isSelectAll) {
                return {
                  ...submodule,
                  create: submodule.create === 0 ? 1 : 0,
                  update: submodule.update === 0 ? 1 : 0,
                  view: submodule.view === 0 ? 1 : 0,
                  delete: submodule.delete === 0 ? 1 : 0,
                };
              }
              return {
                ...submodule,
                [permissionType]: submodule[permissionType] === 1 ? 0 : 1,
              };
            }

            const updatedNestedSubmodules = submodule.modulesOfSubModule.map(
              (nestedSubmodule) => {
                if (nestedSubmodule.id === nestedSubmoduleId) {
                  if (isSelectAll) {
                    return {
                      ...nestedSubmodule,
                      create: nestedSubmodule.create === 0 ? 1 : 0,
                      update: nestedSubmodule.update === 0 ? 1 : 0,
                      view: nestedSubmodule.view === 0 ? 1 : 0,
                      delete: nestedSubmodule.delete === 0 ? 1 : 0,
                    };
                  }
                  return {
                    ...nestedSubmodule,
                    [permissionType]: nestedSubmodule[permissionType] === 1 ? 0 : 1,
                  };
                } else {
                  return nestedSubmodule;
                }
              }
            );

            return {
              ...submodule,
              modulesOfSubModule: updatedNestedSubmodules,
            };
          } else {
            return submodule;
          }
        });

        return {
          ...item,
          submodules: updatedSubmodules,
        };
      } else {
        return item;
      }
    });

    setModules(updatedModules);
  };

  useEffect(() => {
    fetchAllModulesData();
  }, []);

  const permissions = ["create", "update", "view", "delete"];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      moduleName: modules,
      role_id: id,
    };

    const res = await postRolesPermissions(sData);
    if (res.status) {
      toast.success(res.message);
      dispatch(setUserPermission(sData.moduleName));
      resetForm();
      navigate("/AllRoles");
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  // Check if all permissions are selected for a given item
  const isAllPermissionsSelected = (item) => {
    return permissions.every(perm => item[perm] === 1);
  };

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Permissions Features · CMS Electricals</title>
      </Helmet>
      <CardComponent className={"after-bg-light"} title={"Edit Permissions"}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            modules: "",
          }}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              {/* Global Select All Checkbox */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="fw-bolder">Select all</div>
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isGlobalSelected}
                    onChange={(e) => toggleGlobalPermissions(e.target.checked)}
                  />
                </label>
              </div>

              <div className="d-grid gap-2">
                {modules.map((item, index) => (
                  <div key={index} className="d-grid gap-3 shadow px-3 py-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className={"text-black fw-bolder"}>
                        {getIcons(item.icon)} {item.title}
                      </div>
                      <label className="d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isAllPermissionsSelected(item)}
                          onChange={() => updatePermission(item.id, null, null, null, true)}
                        />
                      </label>
                    </div>

                    {item?.submodules?.length > 0 ? null : (
                      <div key={index} className="d-grid gap-3">
                        <div className="d-flex gap-3">
                          {permissions?.map((el) => (
                            <label key={el}>
                              <input
                                className="form-check-input"
                                checked={item[el] === 1}
                                type="checkbox"
                                onChange={() => updatePermission(item.id, el)}
                              />
                              {el}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {item?.submodules?.length > 0
                      ? item.submodules.map((submodule, subIndex) => (
                          <div key={subIndex}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className={"text-gray fw-bolder mb-2"}>
                                <BsRecord2 /> {submodule.title}
                              </div>
                              <label className="d-flex align-items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={isAllPermissionsSelected(submodule)}
                                  onChange={() => updatePermission(item.id, null, submodule.id, null, true)}
                                />
                              </label>
                            </div>
                            <div className="d-grid gap-3">
                              <div className="d-flex gap-3">
                                {permissions?.map((el) => (
                                  <label key={el}>
                                    <input
                                      className="form-check-input"
                                      checked={submodule[el] === 1}
                                      type="checkbox"
                                      onChange={() =>
                                        updatePermission(item.id, el, submodule.id)
                                      }
                                    />
                                    {el}
                                  </label>
                                ))}
                              </div>
                            </div>

                            {submodule?.modulesOfSubModule?.length > 0
                              ? submodule?.modulesOfSubModule?.map(
                                  (moduleOfSubModule, moduleIndex) => (
                                    <div key={moduleIndex} className="ms-3">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div
                                          className={"text-gray fw-bolder mb-2"}
                                        >
                                          <BsRecord2 /> {moduleOfSubModule.title}
                                        </div>
                                        <label className="d-flex align-items-center gap-2">
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={isAllPermissionsSelected(moduleOfSubModule)}
                                            onChange={() => updatePermission(item.id, null, submodule.id, moduleOfSubModule.id, true)}
                                          />
                                        </label>
                                      </div>
                                      <div className="d-grid gap-3">
                                        <div className="d-flex gap-3">
                                          {permissions?.map((el) => (
                                            <label key={el}>
                                              <input
                                                className="form-check-input"
                                                checked={moduleOfSubModule[el] === 1}
                                                type="checkbox"
                                                onChange={() =>
                                                  updatePermission(
                                                    item.id,
                                                    el,
                                                    submodule.id,
                                                    moduleOfSubModule.id
                                                  )
                                                }
                                              />
                                              {el}
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )
                              : null}
                          </div>
                        ))
                      : null}
                  </div>
                ))}

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    disabled={props?.isSubmitting}
                    className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                  >
                    {props?.isSubmitting ? (
                      <>
                        <Spinner
                          animation="border"
                          variant="primary"
                          size="sm"
                        />{" "}
                        PLEASE WAIT...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </CardComponent>
    </Col>
  );
};

export default CodeTesting;



