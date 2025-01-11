
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTodayAttendance } from "../../services/authapi";
import { Table, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";

const TodayAttendance = () => {
    const { userId } = useParams();
    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const fetchAttendance = async () => {
        try {
            const res = await getTodayAttendance();
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
                                                src={`http://localhost:8090/${attendance.captured_image}`}
                                                alt="Captured"
                                                style={{ width: "100px", height: "auto", borderRadius: "5px", cursor: "pointer" }}
                                                onClick={() => handleImageClick(`http://localhost:8090/${attendance.captured_image}`)}
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
                                                src={`http://localhost:8090/${attendance.checkout_captured_image}`}
                                                alt="Captured"
                                                style={{ width: "100px", height: "auto", borderRadius: "5px", cursor: "pointer" }}
                                                onClick={() => handleImageClick(`http://localhost:8090/${attendance.checkout_captured_image}`)}
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

            <Modal show={showModal} onHide={handleCloseModal}>
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
            </Modal>
        </div>
    );
};

export default TodayAttendance;