// import React from "react";
// import { Accordion, Nav } from "react-bootstrap";
// import { BsRecord2 } from "react-icons/bs";
// import { NavLink, useLocation } from "react-router-dom";
// import SimpleBar from "simplebar-react";
// import "simplebar-react/dist/simplebar.min.css";
// import {
//   findActiveDropdownId,
//   findActiveSubDropdownId,
//   menubar,
// } from "../constants";
// import { useTranslation } from "react-i18next";

// const JsSidebar = () => {
//   const { t } = useTranslation();
//   const { pathname } = useLocation();

//   return (
//     <section className="sidebar">
//       <SimpleBar color="red" className="area">
//         <Accordion
//           defaultActiveKey={findActiveDropdownId(menubar, pathname) || 0}
//         >
//           <Nav className="d-grid gap-2 pe-3 ps-2 pt-3 mb-3">
//             {menubar.map((menu, idx) => (
//               <React.Fragment key={idx}>
//                 {menu.nav?.map((item, ida) => (
//                   <NavLink
//                     to={item.url}
//                     key={ida}
//                     className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
//                     style={{ padding: ".6rem .7rem" }}
//                     title={item.menu}
//                   >
//                     <span className="me-2">{item.icon}</span>
//                     {t(item.menu)}
//                   </NavLink>
//                 ))}
//                 {menu.drop?.map((content, idc) => (
//                   <Accordion.Item key={idc} eventKey={menu.id}>
//                     <Accordion.Header title={content.title}>
//                       <div className="d-grid">
//                         <div
//                           className="text-truncate"
//                           onClick={() => {
//                             localStorage.setItem("last_tab", "2");
//                           }}
//                         >
//                           <span className="me-2">{content.nesicon}</span>
//                           {t(content.title)}
//                         </div>
//                       </div>
//                     </Accordion.Header>
//                     <Accordion.Body className="last-child-none active-sidebar d-grid p-2">
//                       {content.dropmenu?.map((body, str) => (
//                         <React.Fragment key={str}>
//                           {body.smenu?.map((body, idd) => (
//                             <NavLink
//                               to={body.url}
//                               className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                               key={idd}
//                               title={body.nestitle}
//                               onClick={() => {
//                                 localStorage.setItem("last_tab", "2");
//                               }}
//                             >
//                               <BsRecord2 /> {t(body.nestitle)}
//                             </NavLink>
//                           ))}
//                           <Accordion
//                             defaultActiveKey={findActiveSubDropdownId(
//                               body,
//                               pathname
//                             )}
//                           >
//                             {body.submenu?.map((menu2, iuu) => (
//                               <Accordion.Item
//                                 key={iuu}
//                                 className={menu2.className}
//                                 eventKey={menu2.id}
//                               >
//                                 <Accordion.Header title={menu2.title}>
//                                   <div className="d-grid">
//                                     <div className="text-truncate">
//                                       <span className="me-2">{menu2.icon}</span>
//                                       {t(menu2.title)}
//                                     </div>
//                                   </div>
//                                 </Accordion.Header>
//                                 <Accordion.Body className="last-child-none d-grid p-2">
//                                   {menu2.smenu2?.map((menu, iyy) => (
//                                     <NavLink
//                                       to={menu.url2}
//                                       className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                                       key={iyy}
//                                       title={menu.title2}
//                                     >
//                                       <BsRecord2 /> {t(menu.title2)}
//                                     </NavLink>
//                                   ))}
//                                 </Accordion.Body>
//                               </Accordion.Item>
//                             ))}
//                           </Accordion>
//                         </React.Fragment>
//                       ))}
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 ))}
//               </React.Fragment>
//             ))}
//           </Nav>
//         </Accordion>
//       </SimpleBar>
//     </section>
//   );
// };

// export default JsSidebar;


// import React, { Fragment, useEffect, useState, useMemo } from "react";
// import { Accordion, Nav, Spinner } from "react-bootstrap";
// import { BsRecord2 } from "react-icons/bs";
// import { NavLink, useLocation } from "react-router-dom";
// import SimpleBar from "simplebar-react";
// import "simplebar-react/dist/simplebar.min.css";
// import { getAllModuleByRoleId } from "../services/authapi";
// import { getIcons } from "../constants/getIcons";
// import { findActiveDropdownId, findActiveSubDropdownId } from "../constants";
// import { selectUser } from "../features/auth/authSlice";
// import { useSelector } from "react-redux";

// const JsSidebar = () => {
//   const { user, userPermission } = useSelector(selectUser);
//   const { pathname } = useLocation();
//   const [sidebarData, setSidebarData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAllData = async () => {
//     try {
//       // console.log("user data", user)
//       const userID = user.user_type;
//       const res = await getAllModuleByRoleId(userID);
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

//   // const checkRolesAndPermission = (module, subModule, subSubModule) => {
//   //   const modulePermission = userPermission?.find((itm) => itm.title === module);
//   //   if (!modulePermission) return null;

//   //   if (subModule && !subSubModule) {
//   //     return modulePermission.submodules?.find((itm) => itm.title === subModule);
//   //   }
//   //   if (subModule && subSubModule) {
//   //     return modulePermission.submodules
//   //       ?.find((itm) => itm.title === subModule)
//   //       ?.modulesOfSubModule?.find((itm) => itm.title === subSubModule);
//   //   }
//   //   return modulePermission;
//   // };
  

//   const hasValidPermission = (item) => {
//     // Check if any of the CRUD permissions are true
//     return item?.create || item?.view || item?.update || item?.delete;
//   };
  
//   const checkModulePermissions = (module) => {
//     // Check module permission
//     if (hasValidPermission(module)) return true;
  
//     // Check submodules and their modules
//     if (module?.submodules?.length > 0) {
//       return module.submodules.some((submodule) => {
//         if (hasValidPermission(submodule)) return true;
  
//         if (submodule?.modulesOfSubModule?.length > 0) {
//           return submodule.modulesOfSubModule.some((modSubModule) =>
//             hasValidPermission(modSubModule)
//           );
//         }
//         return false;
//       });
//     }
  
//     return false;
//   };

  
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // const sidebarContent = useMemo(
//   //   () =>
//   //     sidebarData?.map((e) => (
//   //       <Fragment key={e.id}>
//   //         {e?.submodules?.length > 0 ? (
//   //           <Accordion.Item eventKey={e.id}>
//   //             <Accordion.Header title={e.title}>
//   //               <div className="d-grid">
//   //                 <div className="text-truncate">
//   //                   <span className="me-2">{getIcons(e.icon)}</span>
//   //                   {e.title}
//   //                 </div>
//   //               </div>
//   //             </Accordion.Header>

//   //             <Accordion.Body className="last-child-none d-grid p-2">
//   //               {e?.submodules?.map((body) => (
//   //                 <Fragment key={body.id}>
//   //                   {body?.modulesOfSubModule?.length > 0 ? (
//   //                     <Accordion
//   //                       defaultActiveKey={
//   //                         findActiveSubDropdownId(body, pathname) || 0
//   //                       }
//   //                     >
//   //                       <Accordion.Item eventKey={body.id}>
//   //                         <Accordion.Header title={body.title}>
//   //                           <div className="d-grid">
//   //                             <div className="text-truncate">{body.title}</div>
//   //                           </div>
//   //                         </Accordion.Header>
//   //                         <Accordion.Body className="last-child-none d-grid p-2">
//   //                           {body?.modulesOfSubModule?.map((bb) =>
//   //                             checkRolesAndPermission(
//   //                               e.title,
//   //                               body.title,
//   //                               bb.title
//   //                             )?.view ? (
//   //                               <NavLink
//   //                                 to={bb.path}
//   //                                 className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//   //                                 key={bb.id}
//   //                                 title={bb.title}
//   //                               >
//   //                                 <BsRecord2 /> {bb.title}
//   //                               </NavLink>
//   //                             ) : null
//   //                           )}
//   //                         </Accordion.Body>
//   //                       </Accordion.Item>
//   //                     </Accordion>
//   //                   ) : checkRolesAndPermission(e.title, body.title)?.view ? (
//   //                     <NavLink
//   //                       to={body.path}
//   //                       className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//   //                       title={body.title}
//   //                     >
//   //                       <BsRecord2 /> {body.title}
//   //                     </NavLink>
//   //                   ) : null}
//   //                 </Fragment>
//   //               ))}
//   //             </Accordion.Body>
//   //           </Accordion.Item>
//   //         ) : (
//   //           <NavLink
//   //             to={e.path}
//   //             className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
//   //             style={{ padding: ".6rem .7rem" }}
//   //             title={e.title}
//   //           >
//   //             <span className="me-2">{getIcons(e.icon)}</span>
//   //             {e.title}
//   //           </NavLink>
//   //         )}
//   //       </Fragment>
//   //     )),
//   //   [sidebarData, pathname, userPermission]
//   // );

//   const sidebarContent = useMemo(
//     () =>
//       sidebarData
//         ?.filter((module) => checkModulePermissions(module)) // Filter modules without permissions
//         .map((module) => (
//           <Fragment key={module.id}>
//             {module?.submodules?.length > 0 ? (
//               <Accordion.Item eventKey={module.id}>
//                 <Accordion.Header title={module.title}>
//                   <div className="d-grid">
//                     <div className="text-truncate">
//                       <span className="me-2">{getIcons(module.icon)}</span>
//                       {module.title}
//                     </div>
//                   </div>
//                 </Accordion.Header>
  
//                 <Accordion.Body className="last-child-none d-grid p-2">
//                   {module?.submodules
//                     ?.filter((submodule) =>
//                       checkModulePermissions({ submodules: [submodule] }) // Check submodule permissions
//                     )
//                     .map((submodule) => (
//                       <Fragment key={submodule.id}>
//                         {submodule?.modulesOfSubModule?.length > 0 ? (
//                           <Accordion
//                             defaultActiveKey={
//                               findActiveSubDropdownId(submodule, pathname) || 0
//                             }
//                           >
//                             <Accordion.Item eventKey={submodule.id}>
//                               <Accordion.Header title={submodule.title}>
//                                 <div className="d-grid">
//                                   <div className="text-truncate">
//                                     {submodule.title}
//                                   </div>
//                                 </div>
//                               </Accordion.Header>
//                               <Accordion.Body className="last-child-none d-grid p-2">
//                                 {submodule?.modulesOfSubModule
//                                   ?.filter((modSubModule) =>
//                                     hasValidPermission(modSubModule)
//                                   )
//                                   .map((modSubModule) => (
//                                     <NavLink
//                                       to={modSubModule.path}
//                                       className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                                       key={modSubModule.id}
//                                       title={modSubModule.title}
//                                     >
//                                       <BsRecord2 /> {modSubModule.title}
//                                     </NavLink>
//                                   ))}
//                               </Accordion.Body>
//                             </Accordion.Item>
//                           </Accordion>
//                         ) : (
//                           <NavLink
//                             to={submodule.path}
//                             className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
//                             title={submodule.title}
//                             key={submodule.id}
//                           >
//                             <BsRecord2 /> {submodule.title}
//                           </NavLink>
//                         )}
//                       </Fragment>
//                     ))}
//                 </Accordion.Body>
//               </Accordion.Item>
//             ) : (
//               <NavLink
//                 to={module.path}
//                 className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
//                 style={{ padding: ".6rem .7rem" }}
//                 title={module.title}
//               >
//                 <span className="me-2">{getIcons(module.icon)}</span>
//                 {module.title}
//               </NavLink>
//             )}
//           </Fragment>
//         )),
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
import { getAllModuleByRoleId } from "../services/authapi";
import { getIcons } from "../constants/getIcons";
import { findActiveDropdownId, findActiveSubDropdownId } from "../constants/index";
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