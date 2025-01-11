// import React, { useEffect, useState } from "react";
// import { Col, Form, Table } from "react-bootstrap";
// import { BsDownload, BsPlus, BsUpload } from "react-icons/bs";
// import CardComponent from "../../components/CardComponent";
// import Modaljs from "../../components/Modal";
// import { Helmet } from "react-helmet";
// import { useNavigate } from "react-router-dom";
// import ReactDropzone from "../../components/ReactDropzone";
// import TextareaAutosize from "react-textarea-autosize";
// import {
//   changeEmployeeStatus,
//   deleteEmployee,
//   getAdminAllHREmployees,
//   importEmployeeData,
// } from "../../services/authapi";
// import ActionButton from "../../components/ActionButton";
// import ConfirmAlert from "../../components/ConfirmAlert";
// import { toast } from "react-toastify";
// import Switch from "../../components/Switch";
// import ReactPagination from "../../components/ReactPagination";
// import { Formik } from "formik";
// import { addRemarkSchema } from "../../utils/formSchema";
// import { selectUser } from "../../features/auth/authSlice";
// import { useSelector } from "react-redux";
// import TooltipComponent from "../../components/TooltipComponent";
// import { useTranslation } from "react-i18next";

// const Employees = () => {
//   const [allHrEmployees, setAllHrEmployees] = useState([]);
//   const [idToDelete, setIdToDelete] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [showImports, setShowImports] = useState(false);
//   const [refresh, setRefresh] = useState(false);
//   const [remarks, setRemarks] = useState(false);
//   const [edit, setEdit] = useState({});
//   const navigate = useNavigate();
//   const [pageDetail, setPageDetail] = useState({});
//   const [search, setSearch] = useState("");
//   const [pageNo, setPageNo] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useSelector(selectUser);
//   const { t } = useTranslation();

//   const fetchAllHrEmployeesData = async () => {
//     const res = await getAdminAllHREmployees({ search, pageSize, pageNo });
//     if (res.status) {
//       setAllHrEmployees(res.data);
//       setPageDetail(res.pageDetails);
//     } else {
//       setAllHrEmployees([]);
//       setPageDetail({});
//     }
//     setIsLoading(false);
//   };

//   const handleCahngeStatus = async (values, { setSubmitting, resetForm }) => {
//     const sData = {
//       id: edit.id,
//       remark: values.remark,
//       updated_by: user.id,
//       status: +edit.status === 1 ? 0 : 1,
//     };
//     // return console.log('changeStatus', sData)
//     const res = await changeEmployeeStatus(sData);
//     if (res.status) {
//       toast.success(res.message);
//       fetchAllHrEmployeesData();
//     } else {
//       toast.error(res.message);
//     }
//     setRefresh(true);
//     setRemarks(false);
//     resetForm();
//     setSubmitting(false);
//   };

//   const handleFileChange = (e, setFieldValue) => {
//     if (e.target.files) {
//       setFieldValue("data", e.target.files[0]);
//     }
//   };

//   const handleUploadEmployees = async (
//     values,
//     { setSubmitting, resetForm }
//   ) => {
//     const formData = new FormData();
//     formData.append("data", values.data);
//     const res = await importEmployeeData(user.id, formData);
//     if (res.status) {
//       toast.success(res.message);
//       fetchAllHrEmployeesData();
//     } else {
//       toast.error(res.message);
//     }
//     setShowImports(false);
//     resetForm();
//     setSubmitting(false);
//   };

//   const handleDownload = () => {
//     const element = document.createElement("a");
//     element.href = `${process.env.REACT_APP_API_URL}/sample_file/import_users_sample_file.csv`;
//     element.download = "import_users_sample_file.csv";
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   const handleDelete = async () => {
//     const res = await deleteEmployee(idToDelete);
//     if (res.status) {
//       toast.success(res.message);
//       setAllHrEmployees((prev) => prev.filter((itm) => itm.id !== idToDelete));
//       fetchAllHrEmployeesData();
//     } else {
//       toast.error(res.message);
//     }
//     setIdToDelete("");
//     setShowAlert(false);
//   };

//   const handleRemarks = (id, status) => {
//     setEdit({ id, status });
//     setRemarks(true);
//   };

//   useEffect(() => {
//     fetchAllHrEmployeesData();
//   }, [search, pageNo, pageSize, refresh]);

//   const handlePageSizeChange = (selectedOption) => {
//     setPageSize(selectedOption.value);
//   };

//   const serialNumber = Array.from(
//     { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
//     (_, index) => pageDetail?.pageStartResult + index
//   );

  // return (
  //   <>
  //     <Col md={12} data-aos={"fade-up"}>
  //       <Helmet>
  //         <title>Employees · CMS Electricals</title>
  //       </Helmet>
  //       <CardComponent
  //         title={t("Employees")}
  //         icon={<BsPlus />}
  //         search={true}
  //         searchOnChange={(e) => {
  //           setSearch(e.target.value);
  //         }}
  //         custom={
  //           <TooltipComponent align={"left"} title={"Import Employees"}>
  //             <span
  //               onClick={() => setShowImports(true)}
  //               className="social-btn-re d-align gap-2 px-3 w-auto danger-combo"
  //             >
  //               <BsUpload />
  //             </span>
  //           </TooltipComponent>
  //         }
  //         link={"/Employees/AddEmployee/new"}
  //         tag={"Create"}
  //       >
  //         <div className="table-scroll">
  //           <Table className="text-body bg-new Roles">
  //             <thead className="text-truncate">
  //               <tr className="text-center">
  //                 <th>{t("Sr No.")}</th>
  //                 <th>{t("Employee Id")}</th>
  //                 <th>{t("Employees Name")}</th>
  //                 <th>{t("Email")}</th>
  //                 <th>{t("Mobile")}</th>
  //                 <th>{t("Joined")}</th>
  //                 <th>{t("Status")}</th>
  //                 <th>{t("Role Name")}</th>
  //                 <th>{t("Action")}</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {isLoading ? (
  //                 <td colSpan={10}>
  //                   <img
  //                     className="p-3"
  //                     width="250"
  //                     src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
  //                     alt="Loading"
  //                   />
  //                 </td>
  //               ) : allHrEmployees.length > 0 ? (
  //                 <>
  //                   {allHrEmployees?.map((e, ele) => (
  //                     <tr key={ele}>
  //                       <td>{serialNumber[ele]}</td>
  //                       <td>{e.employee_id}</td>
  //                       <td>
  //                         <div className="text-truncate">
  //                           <img
  //                             className="avatar me-2"
  //                             src={
  //                               e?.image
  //                                 ? `${process.env.REACT_APP_API_URL}/${e?.image}`
  //                                 : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
  //                             }
  //                           />
  //                           {e.name}
  //                         </div>
  //                       </td>
  //                       <td>
  //                         <div className="text-truncate2 line-clamp-2">
  //                           {e.email}
  //                         </div>
  //                       </td>
  //                       <td className="text-center">
  //                         <div className="text-truncate2 line-clamp-2">
  //                           {e.mobile ? e.mobile : "-"}
  //                         </div>
  //                       </td>
  //                       <td className="text-center">
  //                         {" "}
  //                         {e.joining_date ? e.joining_date : "-"}
  //                       </td>
  //                       <td className="text-green text-center">
  //                         <Switch
  //                           checked={+e.status === 1 ? true : false}
  //                           onChange={() => handleRemarks(e.id, e.status)}
  //                         />
  //                       </td>
  //                       <td>{e.role_name}</td>
  //                       <td>
  //                         <ActionButton
  //                           eyelink={`/Employees/ViewEmployee/${e.id}`}
  //                           editlink={`/Employees/AddEmployee/${e.id}`}
  //                           deleteOnclick={() => {
  //                             setIdToDelete(e.id);
  //                             setShowAlert(true);
  //                           }}
  //                         />
  //                       </td>
  //                     </tr>
  //                   ))}
  //                 </>
  //               ) : (
  //                 <td colSpan={10}>
  //                   <img
  //                     className="p-3"
  //                     alt="no-result"
  //                     width="250"
  //                     src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
  //                   />
  //                 </td>
  //               )}
  //             </tbody>
  //             <tfoot>
  //               <td colSpan={10}>
  //                 <ReactPagination
  //                   pageSize={pageSize}
  //                   prevClassName={
  //                     pageNo === 1
  //                       ? "danger-combo-disable pe-none"
  //                       : "red-combo"
  //                   }
  //                   nextClassName={
  //                     pageSize == pageDetail?.total
  //                       ? allHrEmployees.length - 1 < pageSize
  //                         ? "danger-combo-disable pe-none"
  //                         : "success-combo"
  //                       : allHrEmployees.length < pageSize
  //                       ? "danger-combo-disable pe-none"
  //                       : "success-combo"
  //                   }
  //                   title={`Showing ${pageDetail?.pageStartResult || 0} to ${
  //                     pageDetail?.pageEndResult || 0
  //                   } of ${pageDetail?.total || 0}`}
  //                   handlePageSizeChange={handlePageSizeChange}
  //                   prevonClick={() => setPageNo(pageNo - 1)}
  //                   nextonClick={() => setPageNo(pageNo + 1)}
  //                 />
  //               </td>
  //             </tfoot>
  //           </Table>
  //         </div>
  //       </CardComponent>
  //     </Col>
  //     <ConfirmAlert
  //       size={"sm"}
  //       deleteFunction={handleDelete}
  //       hide={setShowAlert}
  //       show={showAlert}
  //       title={"Confirm Delete"}
  //       description={"Are you sure you want to delete this!!"}
  //     />

  //     <Formik
  //       enableReinitialize={true}
  //       initialValues={{
  //         remark: "",
  //       }}
  //       validationSchema={addRemarkSchema}
  //       onSubmit={handleCahngeStatus}
  //     >
  //       {(props) => (
  //         <Modaljs
  //           formikProps={props}
  //           open={remarks}
  //           size={"md"}
  //           closebtn={"Cancel"}
  //           Savebtn={"Save"}
  //           close={() => setRemarks(false)}
  //           title={"Add Remark"}
  //         >
  //           <Form.Group>
  //             {/* <Form.Label>Remarks</Form.Label> */}
  //             <TextareaAutosize
  //               minRows={3}
  //               placeholder="type remarks..."
  //               onChange={props.handleChange}
  //               name="remark"
  //               className="edit-textarea"
  //               onBlur={props.handleBlur}
  //               isInvalid={Boolean(props.touched.remark && props.errors.remark)}
  //             />
  //             <small className="text-danger">{props.errors.remark}</small>
  //           </Form.Group>
  //         </Modaljs>
  //       )}
  //     </Formik>

  //     <Formik
  //       enableReinitialize={true}
  //       initialValues={{
  //         data: "",
  //       }}
  //       onSubmit={handleUploadEmployees}
  //     >
  //       {(props) => (
  //         <Modaljs
  //           formikProps={props}
  //           open={showImports}
  //           newButtonType={"button"}
  //           newButtonOnclick={handleDownload}
  //           size={"md"}
  //           closebtn={"Cancel"}
  //           Savebtn={"Save"}
  //           close={() => setShowImports(false)}
  //           newButtonClass={"success-combo"}
  //           newButtonTitle={<BsDownload />}
  //           title={"Import Employees"}
  //         >
  //           <Form.Group>
  //             <ReactDropzone
  //               name="data"
  //               value={props.values.data}
  //               onChange={(e) => handleFileChange(e, props.setFieldValue)}
  //               title={`Upload Employees`}
  //             />
  //           </Form.Group>
  //         </Modaljs>
  //       )}
  //     </Formik>
  //   </>
  // );
// };

// export default Employees;




import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { BsDownload, BsPlus, BsUpload } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import ReactDropzone from "../../components/ReactDropzone";
import TextareaAutosize from "react-textarea-autosize";
import {
  changeEmployeeStatus,
  deleteEmployee,
  getAdminAllHREmployees,
  importEmployeeData,
  getAllModuleByRoleId,
} from "../../services/authapi";
import ActionButton from "../../components/ActionButton";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import Switch from "../../components/Switch";
import ReactPagination from "../../components/ReactPagination";
import { Formik } from "formik";
import { addRemarkSchema } from "../../utils/formSchema";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import TooltipComponent from "../../components/TooltipComponent";
import { useTranslation } from "react-i18next";

const Employees = () => {
  const [allHrEmployees, setAllHrEmployees] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showImports, setShowImports] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [remarks, setRemarks] = useState(false);
  const [edit, setEdit] = useState({});
  const navigate = useNavigate();
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector(selectUser);
  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    delete: false,
    view: false,
  });
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
  const { t } = useTranslation();
  const [fileName, setFileName] = useState(""); // State to store the file name


  const fetchAllHrEmployeesData = async () => {
    const res = await getAdminAllHREmployees({ search, pageSize, pageNo });
    if (res.status) {
      setAllHrEmployees(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllHrEmployees([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const fetchPermissions = async () => {
    try {
      const userID = user.user_type; // Assuming `user_type` is the user's role identifier
      const res = await getAllModuleByRoleId(userID);
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "HR Management");
        if (hrModule && hrModule.submodules) {
          const employeesSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "Employees"
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

  const handleCahngeStatus = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      id: edit.id,
      remark: values.remark,
      updated_by: user.id,
      status: +edit.status === 1 ? 0 : 1,
    };
    const res = await changeEmployeeStatus(sData);
    if (res.status) {
      toast.success(res.message);
      fetchAllHrEmployeesData();
    } else {
      toast.error(res.message);
    }
    setRefresh(true);
    setRemarks(false);
    resetForm();
    setSubmitting(false);
  };

  // const handleFileChange = (e, setFieldValue) => {
  //   if (e.target.files) {
  //     setFieldValue("data", e.target.files[0]);
  //   }
  // };
  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
        const selectedFile = e.target.files[0];
        console.log("Selected File Details:", selectedFile);
        setFileName(selectedFile.name); // Update the file name in state
        setFieldValue("data", selectedFile);
    }
};


  const handleUploadEmployees = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    const formData = new FormData();
    formData.append("data", values.data);
    const res = await importEmployeeData(user.id, formData);
    
    if (res.status) {
      toast.success(res.message);
      fetchAllHrEmployeesData();
    } else {
      toast.error(res.message);
    }
    setShowImports(false);
    resetForm();
    setSubmitting(false);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    element.href = `${process.env.REACT_APP_API_URL}/sample_file/import_users_sample_file.csv`;
    element.download = "import_users_sample_file.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDelete = async () => {
    const res = await deleteEmployee(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllHrEmployees((prev) => prev.filter((itm) => itm.id !== idToDelete));
      fetchAllHrEmployeesData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleRemarks = (id, status) => {
    setEdit({ id, status });
    setRemarks(true);
  };

  useEffect(() => {
    fetchAllHrEmployeesData();
    fetchPermissions();
  }, [search, pageNo, pageSize, refresh]);

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
          <title>Employees · CMS Electricals</title>
        </Helmet>
        <CardComponent
          title={t("Employees")}
          icon={<BsPlus />}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          custom={
            <TooltipComponent align={"left"} title={"Import Employees"}>
              <span
                onClick={() => setShowImports(true)}
                className="social-btn-re d-align gap-2 px-3 w-auto danger-combo"
              >
                <BsUpload />
              </span>
            </TooltipComponent>
          }
          
          link={permissions.create ? "/Employees/AddEmployee/new" : null}  // Only show link if 'create' permission exists
          tag={permissions.create ? t("Create") : null}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr className="text-center">
                  <th>{t("Sr No.")}</th>
                  <th>{t("Employee Id")}</th>
                  <th>{t("Employees Name")}</th>
                  <th>{t("Email")}</th>
                  <th>{t("Mobile")}</th>
                  <th>{t("Joined")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Role Name")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={10}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : allHrEmployees.length > 0 ? (
                  <>
                    {allHrEmployees?.map((e, ele) => (
                      <tr key={ele}>
                        <td>{serialNumber[ele]}</td>
                        <td>{e.employee_id}</td>
                        <td>
                          <div className="text-truncate">
                            <img
                              className="avatar me-2"
                              src={
                                e?.image
                                  ? `${process.env.REACT_APP_API_URL}/${e?.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />
                            {e.name}
                          </div>
                        </td>
                        <td>
                          <div className="text-truncate2 line-clamp-2">
                            {e.email}
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="text-truncate2 line-clamp-2">
                            {e.mobile ? e.mobile : "-"}
                          </div>
                        </td>
                        <td className="text-center">
                          {" "}
                          {e.joining_date ? e.joining_date : "-"}
                        </td>
                        <td className="text-green text-center">
                          <Switch
                            checked={+e.status === 1 ? true : false}
                            onChange={() => handleRemarks(e.id, e.status)}
                          />
                        </td>
                        <td>{e.role_name}</td>
                        <td>
                          {/* <ActionButton
                            eyelink={`/Employees/ViewEmployee/${e.id}`}
                            editlink={`/Employees/AddEmployee/${e.id}`}
                            deleteOnclick={() => {
                              setIdToDelete(e.id);
                              setShowAlert(true);
                            }}
                          /> */}
                          
                          {<ActionButton
                                hideEye={permissions.view === true ?"":"d-none"}  // Hide if no view permission

                                hideEdit={permissions.update === true?"":"d-none"} // Hide if no update permission

                                hideDelete={permissions.delete === true?"":"d-none"} // Hide if no delete permission

                                eyelink={`/Employees/ViewEmployee/${e.id}`}
                                editlink={`/Employees/AddEmployee/${e.id}`}

                                deleteOnclick={permissions.delete ? () => {
                                  setIdToDelete(e.id);
                                  setShowAlert(true);
                                } : null}
                              />
                              }
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={10}>
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
                        ? allHrEmployees.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : allHrEmployees.length < pageSize
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

      <Formik
        enableReinitialize={true}
        initialValues={{
          remark: "",
        }}
        validationSchema={addRemarkSchema}
        onSubmit={handleCahngeStatus}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={remarks}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setRemarks(false)}
            title={"Add Remark"}
          >
            <Form.Group>
              {/* <Form.Label>Remarks</Form.Label> */}
              <TextareaAutosize
                minRows={3}
                placeholder="type remarks..."
                onChange={props.handleChange}
                name="remark"
                className="edit-textarea"
                onBlur={props.handleBlur}
                isInvalid={Boolean(props.touched.remark && props.errors.remark)}
              />
              <small className="text-danger">{props.errors.remark}</small>
            </Form.Group>
          </Modaljs>
        )}
      </Formik>

      <Formik
        enableReinitialize={true}
        initialValues={{
          data: "",
        }}
        onSubmit={handleUploadEmployees}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={showImports}
            newButtonType={"button"}
            newButtonOnclick={handleDownload}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setShowImports(false)}
            newButtonClass={"success-combo"}
            newButtonTitle={<BsDownload />}
            title={"Import Employees"}
          >
            <Form.Group>
              {/* <ReactDropzone
                name="data"
                value={props.values.data}
                onChange={(e) => handleFileChange(e, props.setFieldValue)}
                title={`Upload Employees`}
              /> */}
              <Form.Group>
            <ReactDropzone
                name="data"
                value={props.values.data}
                onChange={(e) => handleFileChange(e, props.setFieldValue)}
                title={`Upload Employees`}
            />
            {fileName && (
                <p style={{ marginTop: "10px", color: "green" }}>
                    Import File: {fileName}
                </p>
            )}
        </Form.Group>
              
            </Form.Group>
            
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default Employees;
