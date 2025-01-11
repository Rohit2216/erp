// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchPastAttendancesUser } from "../../services/authapi";
// import { Table } from "react-bootstrap";
// import { toast } from "react-toastify";

// const AttendanceDetailss = () => {
//     const { userId } = useParams(); // Extract userId from the route
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     const fetchAttendance = async () => {
//         try {
//             const res = await fetchPastAttendancesUser(userId);
//             if (res.status) {
//                 setAttendanceData(res.data);
//             } else {
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch attendance data!");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAttendance();
//     }, [userId]);

//     return (
//         <div>
//             <h2>Attendance Details</h2>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : attendanceData.length > 0 ? (
//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
//                             <th>Date</th>
//                             <th>Status</th>
//                             <th>In Time</th>
//                             <th>Out Time</th>
//                             <th>Location</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {attendanceData.map((attendance) => (
//                             <tr key={attendance.id}>
//                                 <td>{new Date(attendance.created_at).toLocaleDateString()}</td>
//                                 <td>{attendance.status_label}</td>
//                                 <td>{attendance.in_time}</td>
//                                 <td>{attendance.out_time || "N/A"}</td>
//                                 <td>{attendance.company_location_name || "N/A"}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             ) : (
//                 <p>No attendance data available.</p>
//             )}
//         </div>
//     );
// };

// export default AttendanceDetailss;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchPastAttendancesUser } from "../../services/authapi";
// import { Table } from "react-bootstrap";
// import { toast } from "react-toastify";
// import moment from "moment"; // Import moment

// const AttendanceDetailss = () => {
//     const { userId } = useParams(); // Extract userId from the route
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     const fetchAttendance = async () => {
//         try {
//             const res = await fetchPastAttendancesUser(userId);
//             if (res.status) {
//                 setAttendanceData(res.data);
//             } else {
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch attendance data!");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAttendance();
//     }, [userId]);

//     return (
//         <div>
//             <h2>Attendance Details</h2>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : attendanceData.length > 0 ? (
//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
//                             <th>Date</th>
//                             <th>Status</th>
//                             <th>In Time</th>
//                             <th>Out Time</th>
//                             <th>Checkin longitude</th>
//                             <th>checkin latitude</th>
//                             <th>checkout longitude</th>
//                             <th>checkout latitude</th>
//                             <th>Location</th>
//                             <th>Device Info</th>
//                             <th>UUID</th>
//                             <th>caputred image</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {attendanceData.map((attendance) => (
//                             <tr key={attendance.id}>
//                                 <td>{moment(attendance.created_at).format("DD-MM-YYYY")}</td>
//                                 <td>{attendance.status_label}</td>
//                                 <td>
//                                     {attendance.in_time
//                                         ? moment(attendance.in_time).format("hh:mm A")
//                                         : "N/A"}
//                                 </td>
//                                 <td>
//                                     {attendance.out_time
//                                         ? moment(attendance.out_time).format("hh:mm A")
//                                         : "N/A"}
//                                 </td>
//                                 <td>{attendance.clockInLongitude || "N/A"}</td>
//                                 <td>{attendance.clockInLatitude || "N/A"}</td>
//                                 <td>{attendance.clockOutLongitude || "N/A"}</td>
//                                 <td>{attendance.clockOutLatitude || "N/A"}</td>
//                                 <td>{attendance.company_location_name || "N/A"}</td>
//                                 <td>{attendance.device_info || "N/A"}</td>
//                                 <td>{attendance.user_uuid || "N/A"}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             ) : (
//                 <p>No attendance data available.</p>
//             )}
//         </div>
//     );
// };

// export default AttendanceDetailss;



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchPastAttendancesUser } from "../../services/authapi";
// import { Table } from "react-bootstrap";
// import { toast } from "react-toastify";
// import moment from "moment"; // Import moment

// const AttendanceDetailss = () => {
//   const { userId } = useParams(); // Extract userId from the route
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchAttendance = async () => {
//     try {
//       const res = await fetchPastAttendancesUser(userId);
//       if (res.status) {
//         setAttendanceData(res.data);
//       } else {
//         toast.error(res.message);
//       }
//     } catch (error) {
//       toast.error("Failed to fetch attendance data!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, [userId]);

//   return (
//     <div>
//       <h2>Attendance Details</h2>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : attendanceData.length > 0 ? (
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Status</th>
//               <th>In Time</th>
//               <th>Out Time</th>
//               <th>Checkin Longitude</th>
//               <th>Checkin Latitude</th>
//               <th>Checkout Longitude</th>
//               <th>Checkout Latitude</th>
//               <th>Location</th>
//               <th>Device Info</th>
//               <th>UUID</th>
//               <th>Captured Image</th> {/* New column for Captured Image */}
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceData.map((attendance) => (
//               <tr key={attendance.id}>
//                 <td>{moment(attendance.created_at).format("DD-MM-YYYY")}</td>
//                 <td>{attendance.status_label}</td>
//                 <td>
//                   {attendance.in_time
//                     ? moment(attendance.in_time).format("hh:mm A")
//                     : "N/A"}
//                 </td>
//                 <td>
//                   {attendance.out_time
//                     ? moment(attendance.out_time).format("hh:mm A")
//                     : "N/A"}
//                 </td>
//                 <td>{attendance.clockInLongitude || "N/A"}</td>
//                 <td>{attendance.clockInLatitude || "N/A"}</td>
//                 <td>{attendance.clockOutLongitude || "N/A"}</td>
//                 <td>{attendance.clockOutLatitude || "N/A"}</td>
//                 <td>{attendance.company_location_name || "N/A"}</td>
//                 <td>{attendance.device_info || "N/A"}</td>
//                 <td>{attendance.user_uuid || "N/A"}</td>
//                 {/* Render the captured image */}
//                 <td>
//                   {attendance.captured_image ? (
//                     <img
//                       src={`${process.env.REACT_APP_API_URL}/${attendance.captured_image}`}
//                       alt="Captured"
//                       style={{ width: "100px", height: "auto", borderRadius: "5px" }}
//                     />
//                   ) : (
//                     "No image"
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       ) : (
//         <p>No attendance data available.</p>
//       )}
//     </div>
//   );
// };

// export default AttendanceDetailss;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchPastAttendancesUser } from "../../services/authapi";
// import { Table, Modal } from "react-bootstrap";
// import { toast } from "react-toastify";
// import moment from "moment"; // Import moment

// const AttendanceDetailss = () => {
//     const { userId } = useParams(); // Extract userId from the route
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false); // State to control modal visibility
//     const [selectedImage, setSelectedImage] = useState(""); // State to store the selected image URL

//     const fetchAttendance = async () => {
//         try {
//             const res = await fetchPastAttendancesUser(userId);
//             if (res.status) {
//                 setAttendanceData(res.data);
//             } else {
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch attendance data!");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAttendance();
//     }, [userId]);

//     // Handle opening the modal with the selected image
//     const handleImageClick = (imageUrl) => {
//         setSelectedImage(imageUrl); // Set the selected image
//         setShowModal(true); // Show the modal
//     };

//     // Handle closing the modal
//     const handleCloseModal = () => {
//         setShowModal(false); // Close the modal
//         setSelectedImage(""); // Clear the selected image
//     };

//     return (
//             <div>
//                 <h2>Attendance Details</h2>
//                 {isLoading ? (
//                     <p>Loading...</p>
//                 ) : attendanceData.length > 0 ? (
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Date</th>
//                                 <th>Status</th>
//                                 <th>In Time</th>
//                                 <th>Out Time</th>
//                                 <th>Checkin Longitude</th>
//                                 <th>Checkin Latitude</th>
//                                 <th>checkin Image</th> {/* New column for Captured Image */}
//                                 <th>Checkout Longitude</th>
//                                 <th>Checkout Latitude</th>
//                                 <th>checkout Image</th> {/* New column for Captured Image */}
//                                 <th>Location</th>
//                                 <th>Device Info</th>
//                                 <th>UUID</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {attendanceData.map((attendance) => (
//                                 <tr key={attendance.id}>
//                                     <td>{moment(attendance.created_at).format("DD-MM-YYYY")}</td>
//                                     <td>{attendance.status_label}</td>
//                                     <td>
//                                         {attendance.in_time
//                                             ? moment(attendance.in_time).format("hh:mm A")
//                                             : "N/A"}
//                                     </td>
//                                     <td>
//                                         {attendance.out_time
//                                             ? moment(attendance.out_time).format("hh:mm A")
//                                             : "N/A"}
//                                     </td>
//                                     <td>{attendance.clockInLongitude || "N/A"}</td>
//                                     <td>{attendance.clockInLatitude || "N/A"}</td>
//                                     {/* Render the captured image */}
//                                     <td>
//                                         {attendance.captured_image ? (
//                                             <img
//                                                 src={`http://localhost:8090/${attendance.captured_image}`}
//                                                 alt="Captured"
//                                                 style={{ width: "100px", height: "auto", borderRadius: "5px", cursor: "pointer" }}
//                                                 onClick={() => handleImageClick(`http://localhost:8090/${attendance.captured_image}`)} // Show the modal on click
//                                             />
//                                         ) : (
//                                             "No image"
//                                         )}
//                                     </td>
//                                     <td>{attendance.clockOutLongitude || "N/A"}</td>
//                                     <td>{attendance.clockOutLatitude || "N/A"}</td>
//                                     <td>
//                                         {attendance.checkout_captured_image ? (
//                                             <img
//                                                 src={`http://localhost:8090/${attendance.checkout_captured_image}`}
//                                                 alt="Captured"
//                                                 style={{ width: "100px", height: "auto", borderRadius: "5px", cursor: "pointer" }}
//                                                 onClick={() => handleImageClick(`http://localhost:8090/${attendance.checkout_captured_image}`)} // Show the modal on click
//                                             />
//                                         ) : (
//                                             "No image"
//                                         )}
//                                     </td>
//                                     <td>{attendance.company_location_name || "N/A"}</td>
//                                     <td>{attendance.device_info || "N/A"}</td>
//                                     <td>{attendance.user_uuid || "N/A"}</td>

//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 ) : (
//                     <p>No attendance data available.</p>
//                 )}

//                 {/* Modal to view the image */}
//                 <Modal show={showModal} onHide={handleCloseModal}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>Captured Image</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <img
//                             src={selectedImage}
//                             alt="Captured"
//                             style={{ width: "100%", height: "auto", borderRadius: "5px" }}
//                         />
//                     </Modal.Body>

//                 </Modal>
//             </div>
//     );
// };

// export default AttendanceDetailss;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPastAttendancesUser } from "../../services/authapi";
import { Table, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";

const AttendanceDetailss = () => {
    const { userId } = useParams();
    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const fetchAttendance = async () => {
        try {
            const res = await fetchPastAttendancesUser(userId);
            if (res.status) {
                setAttendanceData(res.data);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to fetch attendance data!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [userId]);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage("");
    };

    return (
        <div>
            <h2>Attendance Details</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : attendanceData.length > 0 ? (
                <div className="table-scroll">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
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
                            {attendanceData.map((attendance) => (
                                <tr key={attendance.id}>
                                    <td>{moment(attendance.created_at).format("DD-MM-YYYY")}</td>
                                    <td>{attendance.status_label}</td>
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
                                                style={{ width: "100px", height: "auto", borderRadius: "5px", cursor: "pointer" }}
                                                onClick={() => handleImageClick(`${process.env.REACT_APP_API_URL}/${attendance.captured_image}`)}
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
                                                style={{ width: "100px", height: "auto", borderRadius: "5px", cursor: "pointer" }}
                                                onClick={() => handleImageClick(`${process.env.REACT_APP_API_URL}/${attendance.checkout_captured_image}`)}
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
                </div>

            ) : (
                <p>No attendance data available.</p>
            )}

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
                    <Modal.Title style={{ color: "#2b2d42" }}>Captured Image</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: "center", padding: "1.5rem", backgroundColor: "#edf2f4" }}>
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
        </div>
    );
};

export default AttendanceDetailss;