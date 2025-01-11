// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Table } from "react-bootstrap";
// import { fetchPastAttendances, fetchUpcomingHolidays, fetchLeavesData } from "../../services/authapi";

// const DashboardOverview = () => {
//     const [attendanceHistory, setAttendanceHistory] = useState([]);
//     const [leaveStatus, setLeaveStatus] = useState({});
//     const [upcomingHolidays, setUpcomingHolidays] = useState([]);

//     // Fetch data when the component mounts
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch attendance history
//                 const attendanceResponse = await fetchPastAttendances();
//                 if (attendanceResponse.status) {
//                     setAttendanceHistory(attendanceResponse.data);
//                 } else {
//                     console.error(attendanceResponse.message);
//                 }

//                 // Fetch leave status
//                 const leavesResponse = await fetchLeavesData();
//                 if (leavesResponse.status) {
//                     setLeaveStatus(leavesResponse.data);
//                 } else {
//                     console.error(leavesResponse.message);
//                 }

//                 // Fetch upcoming holidays
//                 const holidaysResponse = await fetchUpcomingHolidays();
//                 if (holidaysResponse.status) {
//                     setUpcomingHolidays(holidaysResponse.data);
//                 } else {
//                     console.error(holidaysResponse.message);
//                 }
//             } catch (error) {
//                 console.error("Error fetching dashboard data:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <Container fluid className="mt-4 w-full flex justify-around">
//             <Row>
//                 {/* Past 10 Days Attendance */}

//                 <Col md={4} className="w-1/2">
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <h5 className="mb-4">Past 10 Days Attendance</h5>
//                             <Table bordered hover>
//                                 <thead>
//                                     <tr>
//                                         <th>Date</th>
//                                         <th>Clock In</th>
//                                         <th>Clock Out</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {attendanceHistory.length > 0 ? (
//                                         attendanceHistory.map((item) => (
//                                             <tr key={item.id}>
//                                                 <td>{new Date(item.in_time).toLocaleDateString()}</td>
//                                                 <td>
//                                                     {item.in_time
//                                                         ? new Date(item.in_time).toLocaleTimeString()
//                                                         : "N/A"}
//                                                 </td>
//                                                 <td>
//                                                     {item.out_time
//                                                         ? new Date(item.out_time).toLocaleTimeString()
//                                                         : "N/A"}
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="3" className="text-center">
//                                                 No Attendance Records
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </Table>
//                         </Card.Body>
//                     </Card>
//                 </Col>   

//                 <Col className="w-1/2 flex justify-around items-center">
//                     {/* Leave Status */}
//                     <Col md={4}>
//                         <Card className="shadow-sm">
//                             <Card.Body>
//                                 <h5 className="mb-4">Leave Status</h5>
//                                 <Table bordered hover>
//                                     <thead>
//                                         <tr>
//                                             <th>Status</th>
//                                             <th>Count</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {leaveStatus ? (
//                                             <>
//                                                 <tr>
//                                                     <td>Approved</td>
//                                                     <td>{leaveStatus.approved_count || 0}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td>Rejected</td>
//                                                     <td>{leaveStatus.rejected_count || 0}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td>Pending</td>
//                                                     <td>{leaveStatus.pending_count || 0}</td>
//                                                 </tr>
//                                             </>
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan="2" className="text-center">
//                                                     No Leave Data
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </Table>
//                             </Card.Body>
//                         </Card>
//                     </Col>

//                     {/* Upcoming Holidays */}
//                     <Col md={4}>
//                         <Card className="shadow-sm">
//                             <Card.Body>
//                                 <h5 className="mb-4">Upcoming Holidays</h5>
//                                 <ul className="list-group">
//                                     {upcomingHolidays.length > 0 ? (
//                                         upcomingHolidays.map((holiday) => (
//                                             <li key={holiday.id} className="list-group-item">
//                                                 <strong>{holiday.holiday_date}</strong>:{" "}
//                                                 {holiday.holiday_name}
//                                             </li>
//                                         ))
//                                     ) : (
//                                         <li className="list-group-item text-center">
//                                             No Upcoming Holidays
//                                         </li>
//                                     )}
//                                 </ul>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Col>


//             </Row>
//         </Container>
//     );
// };

// export default DashboardOverview;
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Modal } from "react-bootstrap";
import { fetchPastAttendances, fetchUpcomingHolidays, fetchLeavesData, getTodayAttendance } from "../../services/authapi";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const DashboardOverview = () => {
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [leaveStatus, setLeaveStatus] = useState({});
    const [upcomingHolidays, setUpcomingHolidays] = useState([]);
    const [isTodayAttendace, setIsTodayAttendace] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const { user } = useSelector(selectUser);

    const userType = user.user_type;

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage("");
    };
    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch attendance history
                const attendanceResponse = await fetchPastAttendances();
                if (attendanceResponse.status) {
                    setAttendanceHistory(attendanceResponse.data);
                } else {
                    console.error(attendanceResponse.message);
                }

                // Fetch leave status
                const leavesResponse = await fetchLeavesData();
                if (leavesResponse.status) {
                    setLeaveStatus(leavesResponse.data);
                } else {
                    console.error(leavesResponse.message);
                }

                // Fetch upcoming holidays
                const holidaysResponse = await fetchUpcomingHolidays();
                if (holidaysResponse.status) {
                    setUpcomingHolidays(holidaysResponse.data);
                } else {
                    console.error(holidaysResponse.message);
                }


                const attendanceData = await getTodayAttendance();
                if (attendanceData.status) {
                    setIsTodayAttendace(attendanceData.data);
                } else {
                    console.error(attendanceData.message);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container fluid className="mt-5">
            <Row className="justify-content-center">
                <Col lg={6} md={6} sm={12} className="mb-4">
                    <Card className="shadow-lg rounded-lg overflow-hidden">
                        <Card.Body>
                            <h5 className="mb-3 text-primary font-weight-bold">
                                Past 10 Days Attendance
                            </h5>
                            <Table bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Check In</th>
                                        <th>Check Out</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceHistory.length > 0 ? (
                                        attendanceHistory.map((item) => (
                                            <tr key={item.id}>
                                                <td>{new Date(item.in_time).toLocaleDateString()}</td>
                                                <td>
                                                    {item.in_time
                                                        ? new Date(item.in_time).toLocaleTimeString()
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    {item.out_time
                                                        ? new Date(item.out_time).toLocaleTimeString()
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    <span
                                                        className={
                                                            item.status_label === "A"
                                                                ? "text-danger "
                                                                : item.status_label === "P"
                                                                    ? "text-success"
                                                                    : item.status_label === "H"
                                                                        ? "text-warning"
                                                                        : "text-muted"
                                                        }
                                                    >
                                                        {item.status_label ? item.status_label : "N/A"}
                                                    </span>
                                                </td>                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                No Attendance Records
                                            </td>
                                        </tr>
                                    )}


                                </tbody>
                            </Table>
                            {/* Legend Section */}
                            <div className="mt-3">
                                <h6 className="text-muted font-weight-bold">Legend:</h6>
                                <div className="d-flex gap-3">
                                    <span>
                                        <strong className="text-danger">A</strong> = Absent
                                    </span>
                                    <span>
                                        <strong className="text-success">P</strong> = Present
                                    </span>
                                    <span>
                                        <strong className="text-warning">H</strong> = Half Day
                                    </span>
                                </div>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>


                {/* Leave Status and Upcoming Holidays */}
                <Col lg={6} md={6} sm={12} className="mb-4">
                    <Row className="g-3">
                        {/* Leave Status */}
                        <Col xs={12}>
                            <Card className="shadow-lg rounded-lg overflow-hidden">
                                <Card.Body>
                                    <h5 className="mb-3 text-primary font-weight-bold">Leave Status</h5>
                                    <Table bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Status</th>
                                                <th>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaveStatus ? (
                                                <>
                                                    <tr>
                                                        <td>Pending Approval</td>
                                                        <td>{leaveStatus.pending_count || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Approved</td>
                                                        <td>{leaveStatus.approved_count || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Rejected</td>
                                                        <td>{leaveStatus.rejected_count || 0}</td>
                                                    </tr>

                                                </>
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="text-center">
                                                        No Leave Data
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Upcoming Holidays */}
                        <Col xs={12}>
                            <Card className="shadow-lg rounded-lg overflow-hidden">
                                <Card.Body>
                                    <h5 className="mb-3 text-primary font-weight-bold">Upcoming Holidays</h5>
                                    <ul className="list-group">
                                        {upcomingHolidays.length > 0 ? (
                                            upcomingHolidays.map((holiday) => (
                                                <li key={holiday.id} className="list-group-item">
                                                    <strong>{holiday.holiday_date}</strong>: {holiday.holiday_name}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item text-center">
                                                No Upcoming Holidays
                                            </li>
                                        )}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>


                {userType == 3 && (
                    <Col lg={12} md={6} sm={12} className="mb-4">
                        <Card className="shadow-lg rounded-lg overflow-hidden">
                            <Card.Body>
                                <h5 className="mb-3 text-primary font-weight-bold">
                                    Today's Attendance List of Employees
                                </h5>
                                <Table bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Employee Id</th>
                                            <th>In Time</th>
                                            <th>Out Time</th>
                                            <th>Checkin Longitude</th>
                                            <th>Checkin Latitude</th>
                                            <th>Checkin Image</th>
                                            <th>Checkout Longitude</th>
                                            <th>Checkout Latitude</th>
                                            <th>Checkout Image</th>
                                            <th>Location</th>
                                            <th>Device Info</th>
                                            <th>UUID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isTodayAttendace.map((attendance) => (
                                            <tr key={attendance.id}>
                                                <td>{attendance.name || "N/A"}</td>
                                                <td>{attendance.employee_id || "N/A"}</td>
                                                <td>
                                                    {attendance.in_time
                                                        ? moment(attendance.in_time).format("hh:mm A")
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    {attendance.out_time
                                                        ? moment(attendance.out_time).format("hh:mm A")
                                                        : "N/A"}
                                                </td>
                                                <td>{attendance.clockInLongitude || "N/A"}</td>
                                                <td>{attendance.clockInLatitude || "N/A"}</td>
                                                <td>
                                                    {attendance.captured_image ? (
                                                        <img
                                                            src={`${process.env.REACT_APP_API_URL}/${attendance.captured_image}`}
                                                            alt="Captured"
                                                            style={{
                                                                width: "100px",
                                                                height: "auto",
                                                                borderRadius: "5px",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                handleImageClick(
                                                                    `${process.env.REACT_APP_API_URL}/${attendance.captured_image}`
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        "No image"
                                                    )}
                                                </td>
                                                <td>{attendance.clockOutLongitude || "N/A"}</td>
                                                <td>{attendance.clockOutLatitude || "N/A"}</td>
                                                <td>
                                                    {attendance.checkout_captured_image ? (
                                                        <img
                                                            src={`${process.env.REACT_APP_API_URL}/${attendance.checkout_captured_image}`}
                                                            alt="Captured"
                                                            style={{
                                                                width: "100px",
                                                                height: "auto",
                                                                borderRadius: "5px",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                handleImageClick(
                                                                    `${process.env.REACT_APP_API_URL}/${attendance.checkout_captured_image}`
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        "No image"
                                                    )}
                                                </td>
                                                <td>{attendance.company_location_name || "N/A"}</td>
                                                <td>{attendance.device_info || "N/A"}</td>
                                                <td>{attendance.user_uuid || "N/A"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        {/* Modal for Viewing Captured Images */}
                        {/* <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Captured Image</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <img
                                    src={selectedImage}
                                    alt="Captured"
                                    style={{ width: "100%", height: "auto", borderRadius: "5px" }}
                                />
                            </Modal.Body>
                        </Modal> */}

                        <Modal show={showModal} onHide={handleCloseModal} centered>
                            <Modal.Header closeButton style={{ backgroundColor: "#8d99ae", borderBottom: "1px solid #ddd" }}>
                                <Modal.Title style ={{color:"#2b2d42"}}>Captured Image</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ textAlign: "center", padding: "1.5rem",  backgroundColor: "#edf2f4"}}>
                                <img
                                    src={selectedImage}
                                    alt="Captured"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: "70vh", // Ensure it fits within the viewport height
                                        borderRadius: "10px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                        
                                    }}
                                />
                            </Modal.Body>
                        </Modal>

                    </Col>
                )}


            </Row>
        </Container>



    );
};

export default DashboardOverview;
