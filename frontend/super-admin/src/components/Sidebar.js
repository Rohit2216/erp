// import React, { Fragment } from "react";
// import { Accordion, Nav, Spinner } from "react-bootstrap";
// import { BsRecord2 } from "react-icons/bs";
// import { NavLink, useLocation } from "react-router-dom";
// import SimpleBar from "simplebar-react";
// import "simplebar-react/dist/simplebar.min.css";
// import {
//   getAdminAllEnableDisable,
//   getAllModuleByRoleId, 
// } from "../services/authapi";
// import { useState } from "react";
// import { useEffect } from "react";
// import { getIcons } from "../constants/getIcons";
// import { findActiveDropdownId, findActiveSubDropdownId } from "../constants";
// import { selectUser } from "../features/auth/authSlice";
// import { useSelector } from "react-redux";

// const JsSidebar = () => {
//   const { user, userPermission } = useSelector(selectUser);

//   const { pathname } = useLocation();

//   const [sidebarData, setSidebarData] = useState([]);
//   const fetchAllData = async () => {
//     // const res = await getAdminAllEnableDisable();
//     const res = await getAllModuleByRoleId(user?.id);

//     if (res.status) {
//       setSidebarData(res.data);
//     } else {
//       setSidebarData([]);
//     }
//   };

//   const checkRolesAndPermission = (module, subModule, subSubModule) => {
//     console.log("helllo chekc kro","module",module,"submodule", subModule,"subsubmodule", subSubModule);
//     const data = userPermission.find((itm) => itm.title === module);
//     console.log("data in checkpermissin",data);
//     if (subModule && subSubModule === null) {
//       return data.submodules.find((itm2) => itm2.title === subModule);
//     } else if (subSubModule) {
//       const data3 = data.submodules
//         .find((itm2) => itm2.title === subModule)
//         .modulesOfSubModule.find((itm3) => itm3.title === subSubModule);
//       return data3;
//     } else return data;
//   };

//   useEffect(() => {
//     fetchAllData();
//   },[]);

//   if (sidebarData.length === 0) {
//     return (
//       <div className="text-center mt-5">
//         <Spinner animation="border" variant="secondary" size="sm" /> PLEASE
//         WAIT...
//       </div>
//     );
//   }

//   return (
//     <section className="sidebar">
//       <SimpleBar color="red" className="area">
//         <Accordion
//           defaultActiveKey={findActiveDropdownId(sidebarData, pathname) || 0}
//         >
//           <Nav className="d-grid gap-2 pe-3 ps-2 pt-3 mb-3">
//             {sidebarData?.map((e) => (
//               <Fragment key={e.id}>
//                 {e?.submodules?.length > 0 ? (
//                   <Accordion.Item eventKey={e.id}>
//                     <Accordion.Header title={e.title}>
//                       <div className="d-grid">
//                         <div className="text-truncate">
//                           <span className="me-2">{getIcons(e.icon)}</span>
//                           {e.title}
//                         </div>
//                       </div>
//                     </Accordion.Header>

//                     <Accordion.Body className="last-child-none d-grid p-2">
//                       <React.Fragment>
//                         {e?.submodules?.map((body) => (
//                           <Fragment key={body.id}>
//                             {body?.modulesOfSubModule?.length > 0 ? (
//                               <Accordion
//                                 defaultActiveKey={
//                                   findActiveSubDropdownId(body, pathname) || 0
//                                 }
//                               >
//                                 <Accordion.Item eventKey={body.id}>
//                                   <Accordion.Header title={body.title}>
//                                     <div className="d-grid">
//                                       <div className="text-truncate">
//                                         {body.title}
//                                       </div>
//                                     </div>
//                                   </Accordion.Header>
//                                   <Accordion.Body className="last-child-none d-grid p-2">
//                                     <React.Fragment>
//                                       {body?.modulesOfSubModule?.map((bb) =>
//                                         checkRolesAndPermission(
//                                           e.title,
//                                           body.title,
//                                           bb.title
//                                         )?.view ? (
//                                           <NavLink
//                                             to={bb.path}
//                                             className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                                             key={bb.id}
//                                             title={bb.title}
//                                           >
//                                             <BsRecord2 /> {bb.title}
//                                           </NavLink>
//                                         ) : null
//                                       )}
//                                     </React.Fragment>
//                                   </Accordion.Body>
//                                 </Accordion.Item>
//                               </Accordion>
//                             ) : checkRolesAndPermission(e.title, body.title)
//                                 .view ? (
//                               <NavLink
//                                 to={body.path}
//                                 className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                                 title={body.title}
//                               >
//                                 <BsRecord2 /> {body.title}
//                               </NavLink>
//                             ) : null}
//                           </Fragment>
//                         ))}
//                       </React.Fragment>
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 ) : (
//                   <NavLink
//                     to={e.path}
//                     className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
//                     style={{ padding: ".6rem .7rem" }}
//                     title={e.title}
//                   >
//                     <span className="me-2">{getIcons(e.icon)}</span>
//                     {e.title}
//                   </NavLink>
//                 )}
//               </Fragment>
//             ))}
//           </Nav>
//         </Accordion>
//       </SimpleBar>
//     </section>
//   );
// };

// export default JsSidebar;


// import React, { Fragment, useEffect, useState } from "react";
// import { Accordion, Nav, Spinner } from "react-bootstrap";
// import { BsRecord2 } from "react-icons/bs";
// import { NavLink, useLocation } from "react-router-dom";
// import SimpleBar from "simplebar-react";
// import "simplebar-react/dist/simplebar.min.css";
// import {
//   getAdminAllEnableDisable,
//   getAllModuleByRoleId,
// } from "../services/authapi";
// import { getIcons } from "../constants/getIcons";
// import { findActiveDropdownId, findActiveSubDropdownId } from "../constants";
// import { selectUser } from "../features/auth/authSlice";
// import { useSelector } from "react-redux";

// const JsSidebar = () => {
//   const { user, userPermission } = useSelector(selectUser);
//   const { pathname } = useLocation();
//   const [sidebarData, setSidebarData] = useState([]);

//   const fetchAllData = async () => {
//     const res = await getAllModuleByRoleId(user?.id);
//         console.log("logs data", res)

//     if (res.status) {
//       setSidebarData(res.data);
//     } else {
//       setSidebarData([]);
//     }
//   };

//   const checkRolesAndPermission = (module, subModule, subSubModule) => {
//     const data = userPermission?.find((itm) => itm.title === module);
    
//     if (!data) return null;

//     if (subModule && !subSubModule) {
//       return data.submodules?.find((itm2) => itm2.title === subModule);
//     } else if (subModule && subSubModule) {
//       return data.submodules
//         ?.find((itm2) => itm2.title === subModule)
//         ?.modulesOfSubModule?.find((itm3) => itm3.title === subSubModule);
//     } else {
//       return data;
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   if (sidebarData.length === 0) {
//     return (
//       <div className="text-center mt-5">
//         <Spinner animation="border" variant="secondary" size="sm" /> PLEASE
//         WAIT...
//       </div>
//     );
//   }

//   return (
//     <section className="sidebar">
//       <SimpleBar color="red" className="area">
//         <Accordion
//           defaultActiveKey={findActiveDropdownId(sidebarData, pathname) || 0}
//         >
//           <Nav className="d-grid gap-2 pe-3 ps-2 pt-3 mb-3">
//             {sidebarData?.map((e) => (
//               <Fragment key={e.id}>
//                 {e?.submodules?.length > 0 ? (
//                   <Accordion.Item eventKey={e.id}>
//                     <Accordion.Header title={e.title}>
//                       <div className="d-grid">
//                         <div className="text-truncate">
//                           <span className="me-2">{getIcons(e.icon)}</span>
//                           {e.title}
//                         </div>
//                       </div>
//                     </Accordion.Header>

//                     <Accordion.Body className="last-child-none d-grid p-2">
//                       <React.Fragment>
//                         {e?.submodules?.map((body) => (
//                           <Fragment key={body.id}>
//                             {body?.modulesOfSubModule?.length > 0 ? (
//                               <Accordion
//                                 defaultActiveKey={
//                                   findActiveSubDropdownId(body, pathname) || 0
//                                 }
//                               >
//                                 <Accordion.Item eventKey={body.id}>
//                                   <Accordion.Header title={body.title}>
//                                     <div className="d-grid">
//                                       <div className="text-truncate">
//                                         {body.title}
//                                       </div>
//                                     </div>
//                                   </Accordion.Header>
//                                   <Accordion.Body className="last-child-none d-grid p-2">
//                                     <React.Fragment>
//                                       {body?.modulesOfSubModule?.map((bb) =>
//                                         checkRolesAndPermission(
//                                           e.title,
//                                           body.title,
//                                           bb.title
//                                         )?.view ? (
//                                           <NavLink
//                                             to={bb.path}
//                                             className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                                             key={bb.id}
//                                             title={bb.title}
//                                           >
//                                             <BsRecord2 /> {bb.title}
//                                           </NavLink>
//                                         ) : null
//                                       )}
//                                     </React.Fragment>
//                                   </Accordion.Body>
//                                 </Accordion.Item>
//                               </Accordion>
//                             ) : checkRolesAndPermission(e.title, body.title)
//                                 ?.view ? (
//                               <NavLink
//                                 to={body.path}
//                                 className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                                 title={body.title}
//                               >
//                                 <BsRecord2 /> {body.title}
//                               </NavLink>
//                             ) : null}
//                           </Fragment>
//                         ))}
//                       </React.Fragment>
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 ) : (
//                   <NavLink
//                     to={e.path}
//                     className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
//                     style={{ padding: ".6rem .7rem" }}
//                     title={e.title}
//                   >
//                     <span className="me-2">{getIcons(e.icon)}</span>
//                     {e.title}
//                   </NavLink>
//                 )}
//               </Fragment>
//             ))}
//           </Nav>
//         </Accordion>
//       </SimpleBar>
//     </section>
//   );
// };

// export default JsSidebar;





/// *********** working ********************

// import React, { Fragment, useEffect, useState, useMemo } from "react";
// import { Accordion, Nav, Spinner } from "react-bootstrap";
// import { BsRecord2 } from "react-icons/bs";
// import { NavLink, useLocation } from "react-router-dom";
// import SimpleBar from "simplebar-react";
// import "simplebar-react/dist/simplebar.min.css";
// import {
//   getAllModuleByRoleId,
// } from "../services/authapi";
// import { getIcons } from "../constants/getIcons";
// import { findActiveDropdownId, findActiveSubDropdownId } from "../constants";
// import { selectUser } from "../features/auth/authSlice";
// import { useSelector } from "react-redux";

// const JsSidebar = () => {
//   const { user, userPermission } = useSelector(selectUser);
//   console.log("use selctor",user, userPermission);
//   const { pathname } = useLocation();
//   const [sidebarData, setSidebarData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAllData = async () => {
//     try {
//       const res = await getAllModuleByRoleId(user?.id);
//       console.log("check kro roles ", res)
//       if (res.status) {

//         setSidebarData(res.data);
//       } else {
//         setSidebarData([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch sidebar data:", error);
//       setSidebarData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkRolesAndPermission = (module, subModule, subSubModule) => {
//     const modulePermission = userPermission?.find((itm) => itm.title === module);
//     if (!modulePermission) return null;

//     if (subModule && !subSubModule) {
//       return modulePermission.submodules?.find((itm) => itm.title === subModule);
//     }
//     if (subModule && subSubModule) {
//       return modulePermission.submodules
//         ?.find((itm) => itm.title === subModule)
//         ?.modulesOfSubModule?.find((itm) => itm.title === subSubModule);
//     }
//     return modulePermission;
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const sidebarContent = useMemo(
//     () =>
//       sidebarData?.map((e) => (
//         <Fragment key={e.id}>
//           {e?.submodules?.length > 0 ? (
//             <Accordion.Item eventKey={e.id}>
//               <Accordion.Header title={e.title}>
//                 <div className="d-grid">
//                   <div className="text-truncate">
//                     <span className="me-2">{getIcons(e.icon)}</span>
//                     {e.title}
//                   </div>
//                 </div>
//               </Accordion.Header>

//               <Accordion.Body className="last-child-none d-grid p-2">
//                 {e?.submodules?.map((body) => (
//                   <Fragment key={body.id}>
//                     {body?.modulesOfSubModule?.length > 0 ? (
//                       <Accordion
//                         defaultActiveKey={
//                           findActiveSubDropdownId(body, pathname) || 0
//                         }
//                       >
//                         <Accordion.Item eventKey={body.id}>
//                           <Accordion.Header title={body.title}>
//                             <div className="d-grid">
//                               <div className="text-truncate">{body.title}</div>
//                             </div>
//                           </Accordion.Header>
//                           <Accordion.Body className="last-child-none d-grid p-2">
//                             {body?.modulesOfSubModule?.map((bb) =>
//                               checkRolesAndPermission(
//                                 e.title,
//                                 body.title,
//                                 bb.title
//                               )?.view ? (
//                                 <NavLink
//                                   to={bb.path}
//                                   className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                                   key={bb.id}
//                                   title={bb.title}
//                                 >
//                                   <BsRecord2 /> {bb.title}
//                                 </NavLink>
//                               ) : null
//                             )}
//                           </Accordion.Body>
//                         </Accordion.Item>
//                       </Accordion>
//                     ) : checkRolesAndPermission(e.title, body.title)?.view ? (
//                       <NavLink
//                         to={body.path}
//                         className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                         title={body.title}
//                       >
//                         <BsRecord2 /> {body.title}
//                       </NavLink>
//                     ) : null}
//                   </Fragment>
//                 ))}
//               </Accordion.Body>
//             </Accordion.Item>
//           ) : (
//             <NavLink
//               to={e.path}
//               className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
//               style={{ padding: ".6rem .7rem" }}
//               title={e.title}
//             >
//               <span className="me-2">{getIcons(e.icon)}</span>
//               {e.title}
//             </NavLink>
//           )}
//         </Fragment>
//       )),
//     [sidebarData, pathname, userPermission]
//   );

//   if (loading) {
//     return (
//       <div className="text-center mt-5">
//         <Spinner animation="border" variant="secondary" size="sm" /> PLEASE
//         WAIT...
//       </div>
//     );
//   }

//   return (
//     <section className="sidebar">
//       <SimpleBar color="red" className="area">
//         <Accordion
//           defaultActiveKey={findActiveDropdownId(sidebarData, pathname) || 0}
//         >
//           <Nav className="d-grid gap-2 pe-3 ps-2 pt-3 mb-3">{sidebarContent}</Nav>
//         </Accordion>
//       </SimpleBar>
//     </section>
//   );
// };

// export default JsSidebar;




import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Accordion, Nav, Spinner } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
  getAllModuleByRoleId,
} from "../services/authapi";
import { getIcons } from "../constants/getIcons";
import { findActiveDropdownId, findActiveSubDropdownId } from "../constants";
import { selectUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const JsSidebar = () => {
  const { user, userPermission } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [sidebarData, setSidebarData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      console.log("user data", user)
      const userID = user.user_type;;
      const res = await getAllModuleByRoleId(userID);
      if (res.status) {
        console.log('res.Status',res.status);
        setSidebarData(res.data);
      } else {
        setSidebarData([]);
      }
    } catch (error) {
      console.error("Failed to fetch sidebar data:", error);
      setSidebarData([]);
    } finally {
      setLoading(false);
    }
  };


  const hasValidPermission = (item) => {
    // Check if any of the CRUD permissions are true
    return item?.create || item?.view || item?.update || item?.delete;
  };
  
  const checkModulePermissions = (module) => {
    // Check module permission
    if (hasValidPermission(module)) return true;
  
    // Check submodules and their modules
    if (module?.submodules?.length > 0) {
      return module.submodules.some((submodule) => {
        if (hasValidPermission(submodule)) return true;
  
        if (submodule?.modulesOfSubModule?.length > 0) {
          return submodule.modulesOfSubModule.some((modSubModule) =>
            hasValidPermission(modSubModule)
          );
        }
        return false;
      });
    }
  
    return false;
  };

  
  useEffect(() => {
    fetchAllData();
  }, []);

  // const sidebarContent = useMemo(
  //   () =>
  //     sidebarData?.map((e) => (
  //       <Fragment key={e.id}>
  //         {e?.submodules?.length > 0 ? (
  //           <Accordion.Item eventKey={e.id}>
  //             <Accordion.Header title={e.title}>
  //               <div className="d-grid">
  //                 <div className="text-truncate">
  //                   <span className="me-2">{getIcons(e.icon)}</span>
  //                   {e.title}
  //                 </div>
  //               </div>
  //             </Accordion.Header>

  //             <Accordion.Body className="last-child-none d-grid p-2">
  //               {e?.submodules?.map((body) => (
  //                 <Fragment key={body.id}>
  //                   {body?.modulesOfSubModule?.length > 0 ? (
  //                     <Accordion
  //                       defaultActiveKey={
  //                         findActiveSubDropdownId(body, pathname) || 0
  //                       }
  //                     >
  //                       <Accordion.Item eventKey={body.id}>
  //                         <Accordion.Header title={body.title}>
  //                           <div className="d-grid">
  //                             <div className="text-truncate">{body.title}</div>
  //                           </div>
  //                         </Accordion.Header>
  //                         <Accordion.Body className="last-child-none d-grid p-2">
  //                           {body?.modulesOfSubModule?.map((bb) =>
  //                             checkRolesAndPermission(
  //                               e.title,
  //                               body.title,
  //                               bb.title
  //                             )?.view ? (
  //                               <NavLink
  //                                 to={bb.path}
  //                                 className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
  //                                 key={bb.id}
  //                                 title={bb.title}
  //                               >
  //                                 <BsRecord2 /> {bb.title}
  //                               </NavLink>
  //                             ) : null
  //                           )}
  //                         </Accordion.Body>
  //                       </Accordion.Item>
  //                     </Accordion>
  //                   ) : checkRolesAndPermission(e.title, body.title)?.view ? (
  //                     <NavLink
  //                       to={body.path}
  //                       className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
  //                       title={body.title}
  //                     >
  //                       <BsRecord2 /> {body.title}
  //                     </NavLink>
  //                   ) : null}
  //                 </Fragment>
  //               ))}
  //             </Accordion.Body>
  //           </Accordion.Item>
  //         ) : (
  //           <NavLink
  //             to={e.path}
  //             className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
  //             style={{ padding: ".6rem .7rem" }}
  //             title={e.title}
  //           >
  //             <span className="me-2">{getIcons(e.icon)}</span>
  //             {e.title}
  //           </NavLink>
  //         )}
  //       </Fragment>
  //     )),
  //   [sidebarData, pathname, userPermission]
  // );

  const sidebarContent = useMemo(
    () =>
      sidebarData
        ?.filter((module) => checkModulePermissions(module)) // Filter modules without permissions
        .map((module) => (
          <Fragment key={module.id}>
            {module?.submodules?.length > 0 ? (
              <Accordion.Item eventKey={module.id}>
                <Accordion.Header title={module.title}>
                  <div className="d-grid">
                    <div className="text-truncate">
                      <span className="me-2">{getIcons(module.icon)}</span>
                      {module.title}
                    </div>
                  </div>
                </Accordion.Header>
  
                <Accordion.Body className="last-child-none d-grid p-2">
                  {module?.submodules
                    ?.filter((submodule) =>
                      checkModulePermissions({ submodules: [submodule] }) // Check submodule permissions
                    )
                    .map((submodule) => (
                      <Fragment key={submodule.id}>
                        {submodule?.modulesOfSubModule?.length > 0 ? (
                          <Accordion
                            defaultActiveKey={
                              findActiveSubDropdownId(submodule, pathname) || 0
                            }
                          >
                            <Accordion.Item eventKey={submodule.id}>
                              <Accordion.Header title={submodule.title}>
                                <div className="d-grid">
                                  <div className="text-truncate">
                                    {submodule.title}
                                  </div>
                                </div>
                              </Accordion.Header>
                              <Accordion.Body className="last-child-none d-grid p-2">
                                {submodule?.modulesOfSubModule
                                  ?.filter((modSubModule) =>
                                    hasValidPermission(modSubModule)
                                  )
                                  .map((modSubModule) => (
                                    <NavLink
                                      to={modSubModule.path}
                                      className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
                                      key={modSubModule.id}
                                      title={modSubModule.title}
                                    >
                                      <BsRecord2 /> {modSubModule.title}
                                    </NavLink>
                                  ))}
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        ) : (
                          <NavLink
                            to={submodule.path}
                            className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
                            title={submodule.title}
                            key={submodule.id}
                          >
                            <BsRecord2 /> {submodule.title}
                          </NavLink>
                        )}
                      </Fragment>
                    ))}
                </Accordion.Body>
              </Accordion.Item>
            ) : (
              <NavLink
                to={module.path}
                className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
                style={{ padding: ".6rem .7rem" }}
                title={module.title}
              >
                <span className="me-2">{getIcons(module.icon)}</span>
                {module.title}
              </NavLink>
            )}
          </Fragment>
        )),
    [sidebarData, pathname, userPermission]
  );
  

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="secondary" size="sm" /> PLEASE
        WAIT...
      </div>
    );
  }

  return (
    <section className="sidebar">
      <SimpleBar color="red" className="area">
        <Accordion
          defaultActiveKey={findActiveDropdownId(sidebarData, pathname) || 0}
        >
          <Nav className="d-grid gap-2 pe-3 ps-2 pt-3 mb-3">{sidebarContent}</Nav>
        </Accordion>
      </SimpleBar>
    </section>
  );
};

export default JsSidebar;

