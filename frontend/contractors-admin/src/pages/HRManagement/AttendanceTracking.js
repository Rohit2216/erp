// import React, { useEffect, useState } from "react";
// import { Table, Col, Form } from "react-bootstrap";
// import CardComponent from "../../components/CardComponent";
// import ReactPagination from "../../components/ReactPagination";
// import { getAdminAllHREmployees, fetchPastAttendancesUser } from "../../services/authapi"; // API Service Function
// import ActionButton from "../../components/ActionButton"; // Import ActionButton
// import { toast } from "react-toastify";
// import { Helmet } from "react-helmet";

// const UserList = () => {
//     const [users, setUsers] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [pageDetail, setPageDetail] = useState({});
//     const [search, setSearch] = useState("");
//     const [pageNo, setPageNo] = useState(1);
//     const [pageSize, setPageSize] = useState(10);

//     const fetchUsers = async () => {
//         try {
//             setIsLoading(true);
//             const res = await getAdminAllHREmployees({ search, pageNo, pageSize });
//             if (res.status) {
//                 setUsers(res.data);
//                 setPageDetail(res.pageDetails);
//             } else {
//                 setUsers([]);
//                 setPageDetail({});
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch users!");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, [search, pageNo, pageSize]);

//     const handlePageSizeChange = (selectedOption) => {
//         setPageSize(selectedOption.value);
//     };

//     const serialNumber = Array.from(
//         { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
//         (_, index) => pageDetail?.pageStartResult + index
//     );

//     return (
//         <>
//             <Col md={12}>
//                 <Helmet>
//                     <title>User Listing · CMS Electricals</title>
//                 </Helmet>
//                 <CardComponent
//                     title="Users"
//                     search={true}
//                     searchOnChange={(e) => setSearch(e.target.value)}
//                 >
//                     <div className="table-scroll">
//                         <Table className="text-body bg-new Roles">
//                             <thead>
//                                 <tr>
//                                     <th>Sr. No.</th>
//                                     <th>Name</th>
//                                     <th>Email</th>
//                                     <th>Mobile</th>
//                                     <th>Employee ID</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {isLoading ? (
//                                     <tr>
//                                         <td colSpan={6}>
//                                             <img
//                                                 className="p-3"
//                                                 width="250"
//                                                 src="/assets/images/Curve-Loading.gif"
//                                                 alt="Loading"
//                                             />
//                                         </td>
//                                     </tr>
//                                 ) : users.length > 0 ? (
//                                     users.map((user, index) => (
//                                         <tr key={user.id}>
//                                             <td>{serialNumber[index]}</td>
//                                             <td>{user.name}</td>
//                                             <td>{user.email}</td>
//                                             <td>{user.mobile}</td>
//                                             <td>{user.employee_id}</td>
//                                             <td>
//                                                 <ActionButton
//                                                     eyelink={`/attendance/${user.id}`} // View link
//                                                     hideEdit="d-none"
//                                                     hideDelete="d-none"
//                                                     hideApproveLine={true}
//                                                     hideAssignLine={true}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={6}>
//                                             <img
//                                                 className="p-3"
//                                                 width="250"
//                                                 src="/assets/images/no-results.png"
//                                                 alt="No results"
//                                             />
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                             <tfoot>
//                                 <tr>
//                                     <td colSpan={6}>
//                                         <ReactPagination
//                                             pageSize={pageSize}
//                                             prevClassName={
//                                                 pageNo === 1
//                                                     ? "danger-combo-disable pe-none"
//                                                     : "red-combo"
//                                             }
//                                             nextClassName={
//                                                 pageSize === pageDetail?.total
//                                                     ? users.length - 1 < pageSize
//                                                         ? "danger-combo-disable pe-none"
//                                                         : "success-combo"
//                                                     : users.length < pageSize
//                                                     ? "danger-combo-disable pe-none"
//                                                     : "success-combo"
//                                             }
//                                             title={`Showing ${
//                                                 pageDetail?.pageStartResult || 0
//                                             } to ${
//                                                 pageDetail?.pageEndResult || 0
//                                             } of ${pageDetail?.total || 0}`}
//                                             handlePageSizeChange={handlePageSizeChange}
//                                             prevonClick={() => setPageNo(pageNo - 1)}
//                                             nextonClick={() => setPageNo(pageNo + 1)}
//                                         />
//                                     </td>
//                                 </tr>
//                             </tfoot>
//                         </Table>
//                     </div>
//                 </CardComponent>
//             </Col>
//         </>
//     );
// };

// export default UserList;



// import React, { useEffect, useState } from "react";
// import { Table, Col, Modal, Button } from "react-bootstrap";
// import CardComponent from "../../components/CardComponent";
// import ReactPagination from "../../components/ReactPagination";
// import { getAdminAllHREmployees, fetchPastAttendancesUser } from "../../services/authapi";
// import ActionButton from "../../components/ActionButton";
// import { toast } from "react-toastify";
// import { Helmet } from "react-helmet";

// const UserList = () => {
//     const [users, setUsers] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [pageDetail, setPageDetail] = useState({});
//     const [search, setSearch] = useState("");
//     const [pageNo, setPageNo] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [attendanceData, setAttendanceData] = useState(null); // State for attendance data
//     const [showModal, setShowModal] = useState(false); // State for Modal visibility

//     const fetchUsers = async () => {
//         try {
//             setIsLoading(true);
//             const res = await getAdminAllHREmployees({ search, pageNo, pageSize });
//             if (res.status) {
//                 setUsers(res.data);
//                 setPageDetail(res.pageDetails);
//             } else {
//                 setUsers([]);
//                 setPageDetail({});
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch users!");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, [search, pageNo, pageSize]);

//     const handlePageSizeChange = (selectedOption) => {
//         setPageSize(selectedOption.value);
//     };

//     // Fetch attendance details for a user
//     const handleViewAttendance = async (userId) => {
//         try {
//             setIsLoading(true);
//             const res = await fetchPastAttendancesUser(userId); // API call with user ID
//             if (res.status) {
//                 setAttendanceData(res.data);
//                 setShowModal(true); // Show modal with attendance data
//             } else {
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch attendance data!");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const serialNumber = Array.from(
//         { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
//         (_, index) => pageDetail?.pageStartResult + index
//     );

//     return (
//         <>
//             <Col md={12}>
//                 <Helmet>
//                     <title>User Listing · CMS Electricals</title>
//                 </Helmet>
//                 <CardComponent
//                     title="Users"
//                     search={true}
//                     searchOnChange={(e) => setSearch(e.target.value)}
//                 >
//                     <div className="table-scroll">
//                         <Table className="text-body bg-new Roles">
//                             <thead>
//                                 <tr>
//                                     <th>Sr. No.</th>
//                                     <th>Name</th>
//                                     <th>Email</th>
//                                     <th>Mobile</th>
//                                     <th>Employee ID</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {isLoading ? (
//                                     <tr>
//                                         <td colSpan={6}>
//                                             <img
//                                                 className="p-3"
//                                                 width="250"
//                                                 src="/assets/images/Curve-Loading.gif"
//                                                 alt="Loading"
//                                             />
//                                         </td>
//                                     </tr>
//                                 ) : users.length > 0 ? (
//                                     users.map((user, index) => (
//                                         <tr key={user.id}>
//                                             <td>{serialNumber[index]}</td>
//                                             <td>{user.name}</td>
//                                             <td>{user.email}</td>
//                                             <td>{user.mobile}</td>
//                                             <td>{user.employee_id}</td>
//                                             <td>
//                                                 <ActionButton
//                                                     eyelink="#"
//                                                     hideEdit="d-none"
//                                                     hideDelete="d-none"
//                                                     hideApproveLine={true}
//                                                     hideAssignLine={true}
//                                                     eyeOnclick={() => handleViewAttendance(user.id)} // Pass user ID
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={6}>
//                                             <img
//                                                 className="p-3"
//                                                 width="250"
//                                                 src="/assets/images/no-results.png"
//                                                 alt="No results"
//                                             />
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                             <tfoot>
//                                 <tr>
//                                     <td colSpan={6}>
//                                         <ReactPagination
//                                             pageSize={pageSize}
//                                             prevClassName={
//                                                 pageNo === 1
//                                                     ? "danger-combo-disable pe-none"
//                                                     : "red-combo"
//                                             }
//                                             nextClassName={
//                                                 pageSize === pageDetail?.total
//                                                     ? users.length - 1 < pageSize
//                                                         ? "danger-combo-disable pe-none"
//                                                         : "success-combo"
//                                                     : users.length < pageSize
//                                                     ? "danger-combo-disable pe-none"
//                                                     : "success-combo"
//                                             }
//                                             title={`Showing ${
//                                                 pageDetail?.pageStartResult || 0
//                                             } to ${
//                                                 pageDetail?.pageEndResult || 0
//                                             } of ${pageDetail?.total || 0}`}
//                                             handlePageSizeChange={handlePageSizeChange}
//                                             prevonClick={() => setPageNo(pageNo - 1)}
//                                             nextonClick={() => setPageNo(pageNo + 1)}
//                                         />
//                                     </td>
//                                 </tr>
//                             </tfoot>
//                         </Table>
//                     </div>
//                 </CardComponent>
//             </Col>

//             {/* Modal for Attendance Data */}
//             <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Attendance Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {attendanceData ? (
//                         <Table striped bordered hover>
//                             <thead>
//                                 <tr>
//                                     <th>Date</th>
//                                     <th>Status</th>
//                                     <th>In Time</th>
//                                     <th>Out Time</th>
//                                     <th>Location</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {attendanceData.map((attendance) => (
//                                     <tr key={attendance.id}>
//                                         <td>{new Date(attendance.created_at).toLocaleDateString()}</td>
//                                         <td>{attendance.status_label}</td>
//                                         <td>{attendance.in_time}</td>
//                                         <td>{attendance.out_time || "N/A"}</td>
//                                         <td>{attendance.company_location_name || "N/A"}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </Table>
//                     ) : (
//                         <p>No attendance data available.</p>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// };

// export default UserList;



import React, { useEffect, useState } from "react";
import { Table, Col } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import ReactPagination from "../../components/ReactPagination";
import { getAdminAllHREmployees } from "../../services/authapi";
import ActionButton from "../../components/ActionButton";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageDetail, setPageDetail] = useState({});
    const [search, setSearch] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate(); // Initialize navigation

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const res = await getAdminAllHREmployees({ search, pageNo, pageSize });
            if (res.status) {
                setUsers(res.data);
                setPageDetail(res.pageDetails);
            } else {
                setUsers([]);
                setPageDetail({});
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to fetch users!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, pageNo, pageSize]);

    const handlePageSizeChange = (selectedOption) => {
        setPageSize(selectedOption.value);
    };

    // const handleViewAttendance = (userId) => {
    //     console.log(userId);
    //     navigate(`/AttendanceTracking/TrackingDetails/${userId}`);
    // };

    const handleViewAttendance = (userId) => {
        const path = `/AttendanceTracking/TrackingDetails/${userId}`;
        console.log("Navigating to:", path); // Log the path
        navigate(path); // Perform navigation
    };


    const serialNumber = Array.from(
        { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
        (_, index) => pageDetail?.pageStartResult + index
    );

    return (
        <>
            <Col md={12}>
                <Helmet>
                    <title>User Listing · CMS Electricals</title>
                </Helmet>
                <CardComponent
                    title="Users"
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                >
                    <div className="table-scroll">
                        <Table className="text-body bg-new Roles">
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Employee ID</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <img
                                                className="p-3"
                                                width="250"
                                                src="/assets/images/Curve-Loading.gif"
                                                alt="Loading"
                                            />
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{serialNumber[index]}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.mobile}</td>
                                            <td>{user.employee_id}</td>
                                            <td>
                                                <ActionButton
                                                    
                                                    hideEdit={`${true ? "d-none" :"" }`}
                                                    hideDelete={`${true ? "d-none" :"" }`}
                                                    hideApproveLine={`${true ? "d-none" :"" }`}
                                                    hideAssignLine={`${true ? "d-none" :"" }`}
                                                    // eyeOnclick={()=>handleViewAttendance(user.id)} // Navigate to new page
                                                    eyelink={`/AttendanceTracking/TrackingDetails/${user.id}`}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <img
                                                className="p-3"
                                                width="250"
                                                src="/assets/images/no-results.png"
                                                alt="No results"
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={6}>
                                        <ReactPagination
                                            pageSize={pageSize}
                                            prevClassName={
                                                pageNo === 1
                                                    ? "danger-combo-disable pe-none"
                                                    : "red-combo"
                                            }
                                            nextClassName={
                                                pageSize === pageDetail?.total
                                                    ? users.length - 1 < pageSize
                                                        ? "danger-combo-disable pe-none"
                                                        : "success-combo"
                                                    : users.length < pageSize
                                                        ? "danger-combo-disable pe-none"
                                                        : "success-combo"
                                            }
                                            title={`Showing ${pageDetail?.pageStartResult || 0
                                                } to ${pageDetail?.pageEndResult || 0
                                                } of ${pageDetail?.total || 0}`}
                                            handlePageSizeChange={handlePageSizeChange}
                                            prevonClick={() => setPageNo(pageNo - 1)}
                                            nextonClick={() => setPageNo(pageNo + 1)}
                                        />
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                </CardComponent>
            </Col>
        </>
    );
};

export default UserList;
