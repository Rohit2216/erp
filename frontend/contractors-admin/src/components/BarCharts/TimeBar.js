// working superb

// import React, { useEffect, useState, useMemo } from "react";
// import moment from "moment";
// import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
// import { getCheckinStatus, postClockIN, postClockOut } from "../../services/contractorApi";
// import { adminProfile } from "../../services/authapi";
// import { toast } from "react-toastify";
// import ConfirmAlert from "../ConfirmAlert";
// import { FaCheck, FaSignOutAlt } from "react-icons/fa"; // Icons for Check In/Out
// import Confetti from "react-confetti";
// import { v4 as uuidv4 } from "uuid";
// const TimeBar = () => {
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [username, setUsername] = useState("User");
//   const [location, setLocation] = useState(null);
//   const [totalWorkedTime, setTotalWorkedTime] = useState(null); // Store total worked time
//   const [isClockedIn, setIsClockedIn] = useState(false); // Track if the user is clocked in or not
//   const [isCheckedOut, setIsCheckedOut] = useState(false); // Track if the user has checked out
//   const [showModal, setShowModal] = useState(false); // Modal visibility state
//   const [isCheckedIn, setIsCheckedIn] = useState(false); // Track if the user has checked out
//   const [birthday, setBirthday] = useState(null); // Store the user's birthday
//   const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
//   const [showConfetti, setShowConfetti] = useState(false); // Manage Confetti animation
//   const [company_location_name, setCompanyLocationName] = useState("")
//   const [currentTime, setCurrentTime] = useState(moment());


//   const fetchClockStatus = async () => {
//     try {
//       const response = await getCheckinStatus();
//       const { clockInTime, clockOutTime, company_location_name } = response;
//       setClockInTime(clockInTime);
//       setClockOutTime(clockOutTime);
//       setCompanyLocationName(company_location_name || ""); // Set company location name

//       if (clockInTime && clockOutTime) {
//         const totalTime = calculateTotalWorkedTime(clockInTime, clockOutTime);
//         setTotalWorkedTime(totalTime);
//         setIsClockedIn(false);
//         setIsCheckedOut(true);
//       } else if (clockInTime && !clockOutTime) {
//         setIsClockedIn(true);
//         setIsCheckedOut(false);
//       }
//     } catch (error) {
//       console.error("Error fetching check-in status:", error);
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(moment());
//     }, 1000); // Update every second

//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const profile = await adminProfile();
//       setUsername(profile.data.username || profile.data.name);
//       setBirthday(profile.data.dob); // Assume the API returns a "dob" field in YYYY-MM-DD format
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//     }
//   };

//   const getOrCreateUUID = () => {
//     const uuidKey = `device_uuid`;
//     let deviceUUID = localStorage.getItem(uuidKey);
//     if (!deviceUUID) {
//       deviceUUID = crypto.randomUUID(); // Generate a new UUID
//       localStorage.setItem(uuidKey, deviceUUID); // Save to local storage
//     }
//     return deviceUUID;
//   };




//   useEffect(() => {
//     fetchUserProfile();

//     if (birthday) {
//       const today = moment(); // Current date
//       const userBirthday = moment(birthday, "YYYY-MM-DD");
//       console.log("userBirthday", userBirthday)
//       if (today.format("MM-DD") === userBirthday.format("MM-DD")) {
//         setBirthday(true); // Set birthday flag
//         setShowConfetti(true); // Start Confetti animation

//         // Stop Confetti after 10 seconds
//         setTimeout(() => {
//           setShowConfetti(false);
//         }, 10000); // 10000 ms = 10 seconds
//       }
//     }
//   }, [birthday]); // Re-run when `birthday` updates


//   // Initialize the component by fetching data
//   useEffect(() => {
//     fetchClockStatus(); // Fetch check-in status
//     fetchUserProfile(); // Fetch user profile data

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//         }
//       );
//     }
//   }, []);

//   const handleClockIn = async () => {
//     if (location) {
//       try {
//         const inTime = new Date().toLocaleString();
//         const deviceUUID = getOrCreateUUID();

//         const userAgent = navigator.userAgent;
//         let deviceInfo = "Unknown Device";

//         if (userAgent.indexOf("Android") > -1) {
//           deviceInfo = "Android";
//         } else if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) {
//           deviceInfo = "iOS";
//         } else if (userAgent.indexOf("Mac OS X") > -1) {
//           deviceInfo = "Mac";
//         } else if (userAgent.indexOf("Windows NT") > -1) {
//           deviceInfo = "Windows";
//         }

//         const response = await postClockIN({
//           in_time: inTime,
//           clockInLongitude: location.longitude,
//           clockInLatitude: location.latitude,
//           company_location_name: company_location_name,
//           user_uuid: deviceUUID,
//           device_info: deviceInfo,  
//         });

//         if (response.status) {
//           setClockInTime(inTime);
//           setClockOutTime(null);
//           setIsClockedIn(true);
//           setIsCheckedIn(false)
//           setCompanyLocationName(company_location_name); // Keep the entered location name
//           setIsCheckedOut(false);
//           toast.success(response.message || "Checked In Successfully!");

//           await fetchClockStatus();
//         } else {
//           toast.error(response.message || "Check-In Failed.");
//         }
//       } catch (error) {
//         console.error("Error during check-in:", error);
//         toast.error("Error during check-in.");
//       }
//     } else {
//       toast.error("Unable to fetch location.");
//     }
//   };


//   // Calculate total worked time in hours, minutes, and seconds
//   const calculateTotalWorkedTime = (clockInTime, clockOutTime) => {
//     const clockIn = moment(clockInTime);
//     const clockOut = moment(clockOutTime);
//     const duration = moment.duration(clockOut.diff(clockIn));
//     return duration;
//   };

//   // Calculate worked time from clock-in to current time (if not clocked out yet)
//   const calculateWorkedTimeUntilNow = () => {
//     const clockIn = moment(clockInTime);
//     const now = moment();
//     const duration = moment.duration(now.diff(clockIn));
//     return duration;
//   };

//   // Handle Clock Out logic with confirmation
//   const handleClockOut = async () => {
//     // Calculate total worked time until now
//     const workedTime = calculateWorkedTimeUntilNow();
//     const totalWorkedHours = workedTime.hours();

//     if (totalWorkedHours < 9) {
//       // If worked time is < 9 hours, show the confirmation modal
//       setShowModal(true);
//     } else {
//       // If worked time is >= 9 hours, proceed with clock out directly
//       performClockOut();
//     }
//   };
//   // Perform clock-out action
//   const performClockOut = async () => {
//     if (location) {
//       try {
//         const outTime = new Date().toLocaleString(); // Get the current time for clock-out
//         const response = await postClockOut({
//           out_time: outTime,
//           clockOutLongitude: location.longitude,
//           clockOutLatitude: location.latitude,
//         });

//         if (response.status) {
//           setClockOutTime(outTime); // Set the clock-out time
//           setClockInTime(null); // Reset check-in time
//           setIsClockedIn(false); // Disable further check-ins/outs
//           setIsCheckedOut(true); // Mark user as checked out
//           setIsCheckedIn(true);

//           toast.success(response.message || "Checked out successfully!");

//           // After clocking out, fetch the status and calculate total worked hours
//           await fetchClockStatus();
//         } else {
//           toast.error(response.message || "Failed to check out.");
//         }
//       } catch (error) {
//         console.error("Error during check-out:", error);
//         toast.error("Error during check-out.");
//       }
//     } else {
//       toast.error("Unable to get location.");
//     }
//   };

//   const handleLocationChange = (e) => {
//     setCompanyLocationName(e.target.value);
//   };


//   const isBirthdayToday = () => {
//     if (!birthday) return false;
//     const today = moment(); // Current date
//     const userBirthday = moment(birthday, "YYYY-MM-DD");
//     return today.format("MM-DD") === userBirthday.format("MM-DD");
//   };

//   const getGreeting = useMemo(() => {
//     if (isBirthdayToday()) {
//       return `Happy Birthday! 🎂🎉`;
//     } else {
//       const hour = moment().hour();
//       if (hour < 12) {
//         return `Good Morning! 🌅`;
//       } else if (hour < 16) {
//         return `Good Afternoon! ☀️`;
//       } else if (hour < 20) {
//         return `Good Evening! 🌇`;
//       } else {
//         return `Good Night! 🌃`;
//       }
//     }


//   }, [birthday]);
//   // Handle confirmation modal close
//   const handleModalClose = () => {
//     performClockOut();
//     setShowModal(!showModal); // Close the modal without taking any action
//   };

//   // Handle confirmation modal confirmation
//   const handleModalConfirm = () => {
//     setShowModal(false); // Close the modal
//     performClockOut(); // Proceed with clock-out
//   };

//   // Disable Check In and Check Out based on status
//   const isCheckInDisabled = clockInTime !== null && clockOutTime === null;  // Disable Check In if already clocked in
//   const isCheckOutDisabled = clockInTime === null || clockOutTime !== null;  // Disable Check Out if not clocked in or already checked out

//   return (
//     <Container fluid className="mt-4">
//       {showConfetti && (
//         <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={150} />
//       )}

//       <Card className="mb-4 shadow-sm">
//         <Card.Body className="d-flex justify-content-between align-items-center">
//           <div>
//             <h5 className="mb-2" style={{ color: "#333" }}>
//               Hi, {username}!
//             </h5>
//             <h6
//               className="text-muted mb-0"
//               style={{ marginTop: "0.5rem" }}
//             >
//               {getGreeting}
//             </h6>
//           </div>
//           <div>
//             <p className="mb-0 text-muted" style={{ color: "#6c757d", fontSize: "0.9rem" }}>
//               {moment().format("Do MMMM YYYY")}
//             </p>
//             <p
//               className="mb-0 text-muted"
//               style={{ color: "#6c757d", fontSize: "0.9rem", marginTop: "0.5rem" }}
//             >
//               {currentTime.format("dddd")} {currentTime.format("hh:mm:ss A")}
//             </p>
//           </div>
//         </Card.Body>
//       </Card>


//       <Card className="shadow-sm">
//         <Card.Body>
//           <h5 className="mb-4">Your Today's Attendance</h5>
//           <Row style={{ display: "flex", alignItems: "stretch" }}>
//             {/* Check In Card */}
//             <Col md={6} style={{ display: "flex", flexDirection: "column" }}>
//               <Card className="text-center p-3 shadow-sm" style={{ flex: 1 }}>
//                 <h6 className="text-primary">Check In</h6>
//                 <p className="mb-0 text-muted">
//                   {clockInTime
//                     ? new Date(clockInTime).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       second: "2-digit",
//                     })
//                     : "Not Checked In"}
//                 </p>
//                 <Form.Group className="mt-3">
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter Company/Location name"
//                     value={company_location_name}
//                     onChange={handleLocationChange}
//                     disabled={isCheckedIn || isCheckedOut || isCheckInDisabled}
//                   />
//                 </Form.Group>
//                 <div style={{ marginTop: "auto" }}>
//                   <Button
//                     variant={isClockedIn ? "secondary" : "success"}
//                     onClick={handleClockIn}
//                     disabled={isCheckInDisabled || isCheckedIn || isClockedIn || isCheckedOut}
//                     style={{ width: "100%" }} // Make the button full width
//                   >
//                     {isClockedIn ? (
//                       <>
//                         <FaCheck /> Checked In
//                       </>
//                     ) : (
//                       <>
//                         <FaCheck /> Check In
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Card>
//             </Col>

//             {/* Check Out Card */}
//             <Col md={6} style={{ display: "flex", flexDirection: "column" }}>
//               <Card className="text-center p-3 shadow-sm" style={{ flex: 1 }}>
//                 <h6 className="text-primary">Check Out</h6>
//                 <p className="mb-0 text-muted">
//                   {clockOutTime
//                     ? new Date(clockOutTime).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       second: "2-digit",
//                     })
//                     : "Not Checked Out"}
//                 </p>
//                 <div style={{ marginTop: "auto" }}>
//                   <Button
//                     variant={isCheckedOut ? "secondary" : "danger"}
//                     onClick={handleClockOut}
//                     disabled={isCheckedIn || isCheckedOut}
//                     style={{ width: "100%" }} // Make the button full width
//                   >
//                     {isCheckedOut ? (
//                       <>
//                         <FaSignOutAlt /> Checked Out
//                       </>
//                     ) : (
//                       <>
//                         <FaSignOutAlt /> Check Out
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>


//       {/* Modal for confirmation */}
//       <ConfirmAlert
//         show={showModal}
//         hide={setShowModal}
//         title="Confirm Check Out"
//         description="You have not completed 9 hours of work. Are you sure you want to check out?"
//         deleteFunction={handleModalClose}

//       />
//     </Container>
//   );
// };

// export default TimeBar;


// import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
// import moment from "moment";
// import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
// import { getCheckinStatus, postClockIN, postClockOut } from "../../services/contractorApi";
// import { adminProfile } from "../../services/authapi";
// import { toast } from "react-toastify";
// import ConfirmAlert from "../ConfirmAlert";
// import { FaCheck, FaSignOutAlt, FaCamera, FaRedo, FaTimes, FaUpload } from "react-icons/fa"; // Icons for Check In/Out
// import Confetti from "react-confetti";
// import { v4 as uuidv4 } from "uuid";
// import Webcam from "react-webcam";

// const TimeBar = () => {
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [username, setUsername] = useState("User");
//   const [location, setLocation] = useState(null);
//   const [totalWorkedTime, setTotalWorkedTime] = useState(null); // Store total worked time
//   const [isClockedIn, setIsClockedIn] = useState(false); // Track if the user is clocked in or not
//   const [isCheckedOut, setIsCheckedOut] = useState(false); // Track if the user has checked out
//   const [showModal, setShowModal] = useState(false); // Modal visibility state
//   const [isCheckedIn, setIsCheckedIn] = useState(false); // Track if the user has checked out
//   const [birthday, setBirthday] = useState(null); // Store the user's birthday
//   const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
//   const [showConfetti, setShowConfetti] = useState(false); // Manage Confetti animation
//   const [company_location_name, setCompanyLocationName] = useState("")
//   const [currentTime, setCurrentTime] = useState(moment());
//   const [isWebcamVisible, setIsWebcamVisible] = useState(false);
//   const [isWebcamVisibleCheckout, setIsWebcamVisibleCheckout] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [capturedImageCheckout, setCapturedImageCheckout] = useState(null);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isSuccessCheckout, setIsSuccessCheckout] = useState(false);
//   const webcamRef = useRef(null);



//   const fetchClockStatus = async () => {
//     try {
//       const response = await getCheckinStatus();
//       const { clockInTime, clockOutTime, company_location_name, checkin_captured_image } = response;
//       setClockInTime(clockInTime);
//       setClockOutTime(clockOutTime);
//       setCompanyLocationName(company_location_name || ""); // Set company location name
//       setCapturedImage(checkin_captured_image); //
//       if (clockInTime && clockOutTime) {
//         const totalTime = calculateTotalWorkedTime(clockInTime, clockOutTime);
//         setTotalWorkedTime(totalTime);
//         setIsClockedIn(false);
//         setIsCheckedOut(true);
//       } else if (clockInTime && !clockOutTime) {
//         setIsClockedIn(true);
//         setIsCheckedOut(false);
//       }
//     } catch (error) {
//       console.error("Error fetching check-in status:", error);
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(moment());
//     }, 1000); // Update every second

//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const profile = await adminProfile();
//       setUsername(profile.data.username || profile.data.name);
//       setBirthday(profile.data.dob); // Assume the API returns a "dob" field in YYYY-MM-DD format
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//     }
//   };

//   const getOrCreateUUID = () => {
//     const uuidKey = `device_uuid`;
//     let deviceUUID = localStorage.getItem(uuidKey);
//     if (!deviceUUID) {
//       deviceUUID = crypto.randomUUID(); // Generate a new UUID
//       localStorage.setItem(uuidKey, deviceUUID); // Save to local storage
//     }
//     return deviceUUID;
//   };


//   useEffect(() => {
//     fetchUserProfile();

//     if (birthday) {
//       const today = moment(); // Current date
//       const userBirthday = moment(birthday, "YYYY-MM-DD");
//       console.log("userBirthday", userBirthday)
//       if (today.format("MM-DD") === userBirthday.format("MM-DD")) {
//         setBirthday(true); // Set birthday flag
//         setShowConfetti(true); // Start Confetti animation

//         // Stop Confetti after 10 seconds
//         setTimeout(() => {
//           setShowConfetti(false);
//         }, 10000); // 10000 ms = 10 seconds
//       }
//     }
//   }, [birthday]); // Re-run when `birthday` updates


//   // Initialize the component by fetching data
//   useEffect(() => {
//     fetchClockStatus(); // Fetch check-in status
//     fetchUserProfile(); // Fetch user profile data

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//         }
//       );
//     }
//   }, []);


//   const handleClockIn = async () => {
//     if (location) {
//       try {
//         const inTime = new Date().toLocaleString();
//         const deviceUUID = getOrCreateUUID();

//         const userAgent = navigator.userAgent;
//         let deviceInfo = "Unknown Device";

//         if (userAgent.indexOf("Android") > -1) {
//           deviceInfo = "Android";
//         } else if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) {
//           deviceInfo = "iOS";
//         } else if (userAgent.indexOf("Mac OS X") > -1) {
//           deviceInfo = "Mac";
//         } else if (userAgent.indexOf("Windows NT") > -1) {
//           deviceInfo = "Windows";
//         }

//         const response = await postClockIN({
//           in_time: inTime,
//           clockInLongitude: location.longitude,
//           clockInLatitude: location.latitude,
//           company_location_name: company_location_name,
//           user_uuid: deviceUUID,
//           device_info: deviceInfo,
//           capturedImage: capturedImage,
//         });

//         if (response.status) {
//           setClockInTime(inTime);
//           setClockOutTime(null);
//           setIsClockedIn(true);
//           setIsCheckedIn(false)
//           setCompanyLocationName(company_location_name); // Keep the entered location name
//           setIsCheckedOut(false);
//           toast.success(response.message || "Checked In Successfully!");

//           await fetchClockStatus();
//         } else {
//           toast.error(response.message || "Check-In Failed.");
//         }
//       } catch (error) {
//         console.error("Error during check-in:", error);
//         toast.error("Error during check-in.");
//       }
//     } else {
//       toast.error("Unable to fetch location.");
//     }
//   };


//   // Calculate total worked time in hours, minutes, and seconds
//   const calculateTotalWorkedTime = (clockInTime, clockOutTime) => {
//     const clockIn = moment(clockInTime);
//     const clockOut = moment(clockOutTime);
//     const duration = moment.duration(clockOut.diff(clockIn));
//     return duration;
//   };

//   // Calculate worked time from clock-in to current time (if not clocked out yet)
//   const calculateWorkedTimeUntilNow = () => {
//     const clockIn = moment(clockInTime);
//     const now = moment();
//     const duration = moment.duration(now.diff(clockIn));
//     return duration;
//   };

//   // Handle Clock Out logic with confirmation
//   const handleClockOut = async () => {
//     // Calculate total worked time until now
//     const workedTime = calculateWorkedTimeUntilNow();
//     const totalWorkedHours = workedTime.hours();

//     if (totalWorkedHours < 9) {
//       // If worked time is < 9 hours, show the confirmation modal
//       setShowModal(true);
//     } else {
//       // If worked time is >= 9 hours, proceed with clock out directly
//       performClockOut();
//     }
//   };

//   // Perform clock-out action
//   const performClockOut = async () => {
//     if (location) {
//       try {
//         const outTime = new Date().toLocaleString(); // Get the current time for clock-out
//         const response = await postClockOut({
//           out_time: outTime,
//           clockOutLongitude: location.longitude,
//           clockOutLatitude: location.latitude,
//           capturedImage: capturedImageCheckout,
//         });

//         if (response.status) {
//           setClockOutTime(outTime); // Set the clock-out time
//           setClockInTime(null); // Reset check-in time
//           setIsClockedIn(false); // Disable further check-ins/outs
//           setIsCheckedOut(true); // Mark user as checked out
//           setIsCheckedIn(true);

//           toast.success(response.message || "Checked out successfully!");

//           // After clocking out, fetch the status and calculate total worked hours
//           await fetchClockStatus();
//         } else {
//           toast.error(response.message || "Failed to check out.");
//         }
//       } catch (error) {
//         console.error("Error during check-out:", error);
//         toast.error("Error during check-out.");
//       }
//     } else {
//       toast.error("Unable to get location.");
//     }
//   };

//   const handleLocationChange = (e) => {
//     setCompanyLocationName(e.target.value);
//   };


//   const handleCapture = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
//     setIsWebcamVisible(false); // Hide webcam after capture
//   };

//   const handleApprove = () => {
//     console.log("Image approved:", capturedImage);
//     // Save or process the image as needed
//     setCapturedImage(capturedImage); // Reset captured image
//     setIsSuccess(true); // Show success message
//     // setTimeout(() => setIsSuccess(false), 3000); // Hide success message after 3 seconds
//   };

//   const handleRetake = () => {
//     setCapturedImage(null); // Discard the captured image
//     setIsWebcamVisible(true); // Reopen the webcam
//     setIsSuccess(false)
//   };



//   const handleCaptureCheckout = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImageCheckout(imageSrc);
//     setIsWebcamVisibleCheckout(false); // Hide webcam after capture
//   };

//   const handleApproveCheckout = () => {
//     console.log("Image approved for checkout:", capturedImageCheckout);
//     // Save or process the image as needed
//     setCapturedImageCheckout(capturedImageCheckout); // Reset captured image
//     setIsSuccessCheckout(true); // Show success message
//     // setTimeout(() => setIsSuccess(false), 3000); // Hide success message after 3 seconds
//   };

//   const handleRetakeCheckout = () => {
//     setCapturedImageCheckout(null); // Discard the captured image
//     setIsWebcamVisibleCheckout(true); // Reopen the webcam
//     setIsSuccessCheckout(false)
//   };

//   const isBirthdayToday = () => {
//     if (!birthday) return false;
//     const today = moment(); // Current date
//     const userBirthday = moment(birthday, "YYYY-MM-DD");
//     return today.format("MM-DD") === userBirthday.format("MM-DD");
//   };

//   const getGreeting = useMemo(() => {
//     if (isBirthdayToday()) {
//       return `Happy Birthday! 🎂🎉`;
//     } else {
//       const hour = moment().hour();
//       if (hour < 12) {
//         return `Good Morning! 🌅`;
//       } else if (hour < 16) {
//         return `Good Afternoon! ☀️`;
//       } else if (hour < 20) {
//         return `Good Evening! 🌇`;
//       } else {
//         return `Good Night! 🌃`;
//       }
//     }


//   }, [birthday]);
//   // Handle confirmation modal close
//   const handleModalClose = () => {
//     performClockOut();
//     setShowModal(!showModal); // Close the modal without taking any action
//   };

//   // Handle confirmation modal confirmation
//   const handleModalConfirm = () => {
//     setShowModal(false); // Close the modal
//     performClockOut(); // Proceed with clock-out
//   };

//   // Disable Check In and Check Out based on status
//   const isCheckInDisabled = clockInTime !== null && clockOutTime === null;  // Disable Check In if already clocked in
//   const isCheckOutDisabled = clockInTime === null || clockOutTime !== null;  // Disable Check Out if not clocked in or already checked out

//   return (
//     <Container fluid className="mt-4">
//       {/* Confetti */}
//       {showConfetti && (
//         <Confetti
//           width={windowSize.width}
//           height={windowSize.height}
//           numberOfPieces={150}
//         />
//       )}

//       {/* Welcome Card */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body className="d-flex justify-content-between align-items-center">
//           <div>
//             <h5 className="mb-2" style={{ color: "#333" }}>
//               Hi, {username}!
//             </h5>
//             <h6 className="text-muted mb-0" style={{ marginTop: "0.5rem" }}>
//               {getGreeting}
//             </h6>
//           </div>
//           <div>
//             <p
//               className="mb-0 text-muted"
//               style={{ color: "#6c757d", fontSize: "0.9rem" }}
//             >
//               {moment().format("Do MMMM YYYY")}
//             </p>
//             <p
//               className="mb-0 text-muted"
//               style={{ color: "#6c757d", fontSize: "0.9rem", marginTop: "0.5rem" }}
//             >
//               {currentTime.format("dddd")} {currentTime.format("hh:mm:ss A")}
//             </p>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Attendance Card */}
//       <Card className="shadow-sm">
//         <Card.Body>
//           <h5 className="mb-4">Your Today's Attendance</h5>
//           <Row style={{ display: "flex", alignItems: "stretch" }}>
//             {/* Check In Card */}
//             <Col md={6} style={{ display: "flex", flexDirection: "column" }}>
//               <Card className="text-center p-3 shadow-sm" style={{ flex: 1 }}>
//                 <h6 className="text-primary">Check In</h6>
//                 <p className="mb-0 text-muted">
//                   {clockInTime
//                     ? new Date(clockInTime).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       second: "2-digit",
//                     })
//                     : "Not Checked In"}
//                 </p>
//                 <Form.Group className="mt-3">
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter Company/Location name"
//                     value={company_location_name}
//                     onChange={handleLocationChange}
//                     disabled={isCheckedIn || isCheckedOut || isCheckInDisabled}
//                   />
//                 </Form.Group>

//                 <div style={{ textAlign: "center", marginTop: "20px" }}>
//                   {/* Webcam Toggle Button */}
//                   {(!isWebcamVisible && !capturedImage && !isCheckedIn && !isCheckedOut && !isCheckInDisabled) && (
//                     <button
//                       onClick={() => setIsWebcamVisible(true)}
//                       style={{
//                         background: "white",
//                         border: "1px solid #007BFF",
//                         color: "#007BFF",
//                         borderRadius: "50%",
//                         padding: "10px",
//                         fontSize: "24px",
//                         cursor: "pointer",
//                         width: "50px",
//                         height: "50px",
//                       }}
//                     >
//                       <FaCamera />
//                     </button>
//                   )}

//                   {/* Webcam Component */}
//                   {isWebcamVisible && (
//                     <div className="webcam-container" style={{ marginTop: "20px" }}>
//                       <Webcam
//                         audio={false}
//                         screenshotFormat="image/jpeg"
//                         width="100%"
//                         videoConstraints={{
//                           facingMode: "user", // Use the front camera
//                         }}
//                         ref={webcamRef} // Attach webcamRef to the Webcam component
//                       />
//                       <div style={{ marginTop: "10px" }}>
//                         <button
//                           onClick={handleCapture}
//                           style={{
//                             background: "#007BFF",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "50%",
//                             padding: "10px",
//                             cursor: "pointer",
//                             margin: "5px",
//                           }}
//                         >
//                           <FaCamera /> {/* Capture Icon */}
//                         </button>
//                         <button
//                           onClick={() => setIsWebcamVisible(false)}
//                           style={{
//                             background: "red",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "50%",
//                             padding: "10px",
//                             cursor: "pointer",
//                             margin: "5px",
//                           }}
//                         >
//                           <FaTimes /> {/* Close Icon */}
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Captured Image Preview */}
//                   {capturedImage && (
//                     <div style={{ marginTop: "20px", textAlign: "center" }}>
//                       <h5>Preview Image</h5>
//                       <img
//                         src={capturedImage || "http://192.168.0.96:3001/checkin_image/1736334224379_output_resized.jpg"}
//                         alt="Captured"
//                         style={{
//                           width: "100%",
//                           maxWidth: "300px",
//                           border: "2px solid #007BFF",
//                           borderRadius: "10px",
//                         }}
//                       />
//                       <div style={{ marginTop: "10px" }}>
//                         <button
//                           onClick={handleApprove}
//                           disabled={isCheckedIn || isCheckedOut || isCheckInDisabled}
//                           style={{
//                             background: "green",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "50%",
//                             padding: "10px",
//                             cursor: "pointer",
//                             margin: "5px",
//                           }}
//                         >
//                           <FaCheck /> {/* Approve Icon */}
//                         </button>
//                         <button
//                           onClick={handleRetake}
//                           disabled={isCheckedIn || isCheckedOut || isCheckInDisabled}
//                           style={{
//                             background: "#FFA500",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "50%",
//                             padding: "10px",
//                             cursor: "pointer",
//                             margin: "5px",
//                           }}
//                         >
//                           <FaRedo /> {/* Retake Icon */}
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Success Message */}
//                   {isSuccess && (
//                     <div
//                       style={{
//                         background: "#28a745",
//                         color: "white",
//                         padding: "10px",
//                         borderRadius: "5px",
//                         marginTop: "20px",
//                         textAlign: "center",
//                       }}
//                     >
//                       <FaUpload /> CheckIn live Selfie uploaded successfully!
//                     </div>
//                   )}
//                 </div>



//                 <div style={{ marginTop: "auto" }}>
//                   <Button
//                     variant={isClockedIn ? "secondary" : "success"}
//                     onClick={handleClockIn}
//                     disabled={
//                       isCheckInDisabled || isCheckedIn || isClockedIn || isCheckedOut
//                     }
//                     style={{ width: "100%" }}
//                   >
//                     {isClockedIn ? (
//                       <>
//                         <FaCheck /> Checked In
//                       </>
//                     ) : (
//                       <>
//                         <FaCheck /> Check In
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Card>
//             </Col>

//             {/* Check Out Card */}
//             <Col md={6} style={{ display: "flex", flexDirection: "column" }}>
//               <Card className="text-center p-3 shadow-sm" style={{ flex: 1 }}>
//                 <h6 className="text-primary">Check Out</h6>
//                 <p className="mb-0 text-muted">
//                   {clockOutTime
//                     ? new Date(clockOutTime).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       second: "2-digit",
//                     })
//                     : "Not Checked Out"}
//                 </p>

//                 <div style={{ textAlign: "center", marginTop: "20px" }}>
//                   {/* Webcam Toggle Button */}
//                   {(!isWebcamVisibleCheckout && !capturedImageCheckout && !isCheckedIn && !isCheckedOut) && (
//                     <button
//                       onClick={() => setIsWebcamVisibleCheckout(true)}

//                       style={{
//                         background: "white",
//                         border: "1px solid #007BFF",
//                         color: "#007BFF",
//                         borderRadius: "50%",
//                         padding: "10px",
//                         fontSize: "24px",
//                         cursor: "pointer",
//                         width: "50px",
//                         height: "50px",
//                       }}
//                     >
//                       <FaCamera />
//                     </button>
//                   )}

//                   {/* Webcam Component */}
//                   {isWebcamVisibleCheckout && (
//                     <div className="webcam-container" style={{ marginTop: "20px" }}>
//                       <Webcam
//                         audio={false}
//                         screenshotFormat="image/jpeg"
//                         width="100%"
//                         videoConstraints={{
//                           facingMode: "user", // Use the front camera
//                         }}
//                         ref={webcamRef} // Attach webcamRef to the Webcam component
//                       />
//                       <div style={{ marginTop: "10px" }}>
//                         <button
//                           onClick={handleCaptureCheckout}
//                           style={{
//                             background: "#007BFF",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "50%",
//                             padding: "10px",
//                             cursor: "pointer",
//                             margin: "5px",
//                           }}
//                         >
//                           <FaCamera /> {/* Capture Icon */}
//                         </button>
//                         <button
//                           onClick={() => setIsWebcamVisibleCheckout(false)}
//                           style={{
//                             background: "red",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "50%",
//                             padding: "10px",
//                             cursor: "pointer",
//                             margin: "5px",
//                           }}
//                         >
//                           <FaTimes /> {/* Close Icon */}
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Captured Image Preview */}
//                   {capturedImageCheckout && (
//                     <div style={{ marginTop: "20px", textAlign: "center" }}>
//                       <h5>Preview Image</h5>
//                       <img
//                         src={capturedImageCheckout}
//                         alt="Captured"
//                         style={{
//                           width: "100%",
//                           maxWidth: "300px",
//                           border: "2px solid #007BFF",
//                           borderRadius: "10px",
//                         }}
//                       />
//                       <div style={{ marginTop: "10px" }}>
//                         <button
//                           onClick={handleApproveCheckout}
//                           disabled={isCheckedIn || isCheckedOut}
//                           style={{
//                             background: "green",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "50%",
//                             padding: "10px",
//                             cursor: "pointer",
//                             margin: "5px",
//                           }}
//                         >
//                           <FaCheck /> {/* Approve Icon */}
//                         </button>
//                         <button
//                           onClick={handleRetakeCheckout}
//                           disabled={isCheckedIn || isCheckedOut} style={{
//                             background: "#FFA500",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "50%",
//                             padding: "10px",
//                             cursor: "pointer",
//                             margin: "5px",
//                           }}
//                         >
//                           <FaRedo /> {/* Retake Icon */}
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Success Message */}
//                   {isSuccessCheckout && (
//                     <div
//                       style={{
//                         background: "#28a745",
//                         color: "white",
//                         padding: "10px",
//                         borderRadius: "5px",
//                         marginTop: "20px",
//                         textAlign: "center",
//                       }}
//                     >
//                       <FaUpload /> Checkout live Selfie uploaded successfully!
//                     </div>
//                   )}
//                 </div>
//                 <div style={{ marginTop: "auto" }}>
//                   <Button
//                     variant={isCheckedOut ? "secondary" : "danger"}
//                     onClick={handleClockOut}
//                     disabled={isCheckedIn || isCheckedOut}
//                     style={{ width: "100%" }}
//                   >
//                     {isCheckedOut ? (
//                       <>
//                         <FaSignOutAlt /> Checked Out
//                       </>
//                     ) : (
//                       <>
//                         <FaSignOutAlt /> Check Out
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Modal for Confirmation */}
//       <ConfirmAlert
//         show={showModal}
//         hide={setShowModal}
//         title="Confirm Check Out"
//         description="You have not completed 9 hours of work. Are you sure you want to check out?"
//         deleteFunction={handleModalClose}
//       />

//     </Container>
//   );
// };

// export default TimeBar;




import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import moment from "moment";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { getCheckinStatus, postClockIN, postClockOut } from "../../services/contractorApi";
import { adminProfile } from "../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../ConfirmAlert";
import { FaCheck, FaSignOutAlt, FaCamera, FaRedo, FaTimes, FaUpload } from "react-icons/fa"; // Icons for Check In/Out
import Confetti from "react-confetti";
import { v4 as uuidv4 } from "uuid";
import Webcam from "react-webcam";

const TimeBar = () => {
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [username, setUsername] = useState("User");
  const [location, setLocation] = useState(null);
  const [totalWorkedTime, setTotalWorkedTime] = useState(null); // Store total worked time
  const [isClockedIn, setIsClockedIn] = useState(false); // Track if the user is clocked in or not
  const [isCheckedOut, setIsCheckedOut] = useState(false); // Track if the user has checked out
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [isCheckedIn, setIsCheckedIn] = useState(false); // Track if the user has checked out
  const [birthday, setBirthday] = useState(null); // Store the user's birthday
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showConfetti, setShowConfetti] = useState(false); // Manage Confetti animation
  const [company_location_name, setCompanyLocationName] = useState("")
  const [currentTime, setCurrentTime] = useState(moment());
  const [isWebcamVisible, setIsWebcamVisible] = useState(false);
  const [isWebcamVisibleCheckout, setIsWebcamVisibleCheckout] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); // webcam capture image
  const [capturedImages, setCapturedImages] = useState(null); // stored images in db
  const [capturedImageCheckout, setCapturedImageCheckout] = useState(null);
  const [capturedImagesCheckout, setCapturedImagesCheckout] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessCheckout, setIsSuccessCheckout] = useState(false);
  const webcamRef = useRef(null);

  console.log("capturedImages", capturedImages)

  // const fetchClockStatus = async () => {
  //   try {
  //     const response = await getCheckinStatus();
  //     const { clockInTime, clockOutTime, company_location_name, checkin_captured_image } = response;
  //     setClockInTime(clockInTime);
  //     setClockOutTime(clockOutTime);
  //     setCompanyLocationName(company_location_name || ""); // Set company location name
  //     setCapturedImage(checkin_captured_image); //
  //     if (clockInTime && clockOutTime) {
  //       const totalTime = calculateTotalWorkedTime(clockInTime, clockOutTime);
  //       setTotalWorkedTime(totalTime);
  //       setIsClockedIn(false);
  //       setIsCheckedOut(true);
  //     } else if (clockInTime && !clockOutTime) {
  //       setIsClockedIn(true);
  //       setIsCheckedOut(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching check-in status:", error);
  //   }
  // };

  const fetchClockStatus = async () => {
    try {
      const response = await getCheckinStatus();
      const { clockInTime, clockOutTime, company_location_name, checkin_captured_image, checkout_captured_image } = response;

      setClockInTime(clockInTime);
      setClockOutTime(clockOutTime);
      setCompanyLocationName(company_location_name || "");
      setCapturedImages(checkin_captured_image);
      setCapturedImagesCheckout(checkout_captured_image)

      if (clockInTime && clockOutTime) {
        const totalTime = calculateTotalWorkedTime(clockInTime, clockOutTime);
        setTotalWorkedTime(totalTime);
        setIsClockedIn(false);
        setIsCheckedOut(true);
      } else if (clockInTime && !clockOutTime) {
        setIsClockedIn(true);
        setIsCheckedOut(false);
      }
    } catch (error) {
      console.error("Error fetching check-in status:", error);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await adminProfile();
      setUsername(profile.data.username || profile.data.name);
      setBirthday(profile.data.dob); // Assume the API returns a "dob" field in YYYY-MM-DD format
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const getOrCreateUUID = () => {
    const uuidKey = `device_uuid`;
    let deviceUUID = localStorage.getItem(uuidKey);
    if (!deviceUUID) {
      deviceUUID = crypto.randomUUID(); // Generate a new UUID
      localStorage.setItem(uuidKey, deviceUUID); // Save to local storage
    }
    return deviceUUID;
  };


  useEffect(() => {
    fetchUserProfile();

    if (birthday) {
      const today = moment(); // Current date
      const userBirthday = moment(birthday, "YYYY-MM-DD");
      console.log("userBirthday", userBirthday)
      if (today.format("MM-DD") === userBirthday.format("MM-DD")) {
        setBirthday(true); // Set birthday flag
        setShowConfetti(true); // Start Confetti animation

        // Stop Confetti after 10 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 10000); // 10000 ms = 10 seconds
      }
    }
  }, [birthday]); // Re-run when `birthday` updates


  // Initialize the component by fetching data
  useEffect(() => {
    fetchClockStatus(); // Fetch check-in status
    fetchUserProfile(); // Fetch user profile data

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);


  const handleClockIn = async () => {
    if (location) {
      try {
        const inTime = new Date().toLocaleString();
        const deviceUUID = getOrCreateUUID();

        const userAgent = navigator.userAgent;
        let deviceInfo = "Unknown Device";

        if (userAgent.indexOf("Android") > -1) {
          deviceInfo = "Android";
        } else if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) {
          deviceInfo = "iOS";
        } else if (userAgent.indexOf("Mac OS X") > -1) {
          deviceInfo = "Mac";
        } else if (userAgent.indexOf("Windows NT") > -1) {
          deviceInfo = "Windows";
        }

        const response = await postClockIN({
          in_time: inTime,
          clockInLongitude: location.longitude,
          clockInLatitude: location.latitude,
          company_location_name: company_location_name,
          user_uuid: deviceUUID,
          device_info: deviceInfo,
          capturedImage: capturedImage,
        });

        if (response.status) {
          setClockInTime(inTime);
          setClockOutTime(null);
          setIsClockedIn(true);
          setIsCheckedIn(false)
          setCompanyLocationName(company_location_name); // Keep the entered location name
          setIsCheckedOut(false);
          toast.success(response.message || "Checked In Successfully!");

          await fetchClockStatus();
        } else {
          toast.error(response.message || "Check-In Failed.");
        }
      } catch (error) {
        console.error("Error during check-in:", error);
        toast.error("Error during check-in.");
      }
    } else {
      toast.error("Unable to fetch location.");
    }
  };


  // Calculate total worked time in hours, minutes, and seconds
  const calculateTotalWorkedTime = (clockInTime, clockOutTime) => {
    const clockIn = moment(clockInTime);
    const clockOut = moment(clockOutTime);
    const duration = moment.duration(clockOut.diff(clockIn));
    return duration;
  };

  // Calculate worked time from clock-in to current time (if not clocked out yet)
  const calculateWorkedTimeUntilNow = () => {
    const clockIn = moment(clockInTime);
    const now = moment();
    const duration = moment.duration(now.diff(clockIn));
    return duration;
  };

  // Handle Clock Out logic with confirmation
  const handleClockOut = async () => {
    // Calculate total worked time until now
    const workedTime = calculateWorkedTimeUntilNow();
    const totalWorkedHours = workedTime.hours();

    if (totalWorkedHours < 9) {
      // If worked time is < 9 hours, show the confirmation modal
      setShowModal(true);
    } else {
      // If worked time is >= 9 hours, proceed with clock out directly
      performClockOut();
    }
  };

  // Perform clock-out action
  const performClockOut = async () => {
    if (location) {
      try {
        const outTime = new Date().toLocaleString(); // Get the current time for clock-out
        const response = await postClockOut({
          out_time: outTime,
          clockOutLongitude: location.longitude,
          clockOutLatitude: location.latitude,
          capturedImage: capturedImageCheckout,
        });

        if (response.status) {
          setClockOutTime(outTime); // Set the clock-out time
          setClockInTime(null); // Reset check-in time
          setIsClockedIn(false); // Disable further check-ins/outs
          setIsCheckedOut(true); // Mark user as checked out
          setIsCheckedIn(true);

          toast.success(response.message || "Checked out successfully!");

          // After clocking out, fetch the status and calculate total worked hours
          await fetchClockStatus();
        } else {
          toast.error(response.message || "Failed to check out.");
        }
      } catch (error) {
        console.error("Error during check-out:", error);
        toast.error("Error during check-out.");
      }
    } else {
      toast.error("Unable to get location.");
    }
  };

  const handleLocationChange = (e) => {
    setCompanyLocationName(e.target.value);
  };


  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsWebcamVisible(false); // Hide webcam after capture
  };

  const handleApprove = () => {
    console.log("Image approved:", capturedImage);
    // Save or process the image as needed
    setCapturedImage(capturedImage); // Reset captured image
    setIsSuccess(true); // Show success message
    // setTimeout(() => setIsSuccess(false), 3000); // Hide success message after 3 seconds
  };

  const handleRetake = () => {
    setCapturedImage(null); // Discard the captured image
    setIsWebcamVisible(true); // Reopen the webcam
    setIsSuccess(false)
  };



  const handleCaptureCheckout = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImageCheckout(imageSrc);
    setIsWebcamVisibleCheckout(false); // Hide webcam after capture
  };

  const handleApproveCheckout = () => {
    console.log("Image approved for checkout:", capturedImageCheckout);
    // Save or process the image as needed
    setCapturedImageCheckout(capturedImageCheckout); // Reset captured image
    setIsSuccessCheckout(true); // Show success message
    // setTimeout(() => setIsSuccess(false), 3000); // Hide success message after 3 seconds
  };

  const handleRetakeCheckout = () => {
    setCapturedImageCheckout(null); // Discard the captured image
    setIsWebcamVisibleCheckout(true); // Reopen the webcam
    setIsSuccessCheckout(false)
  };

  const isBirthdayToday = () => {
    if (!birthday) return false;
    const today = moment(); // Current date
    const userBirthday = moment(birthday, "YYYY-MM-DD");
    return today.format("MM-DD") === userBirthday.format("MM-DD");
  };

  const getGreeting = useMemo(() => {
    if (isBirthdayToday()) {
      return `Happy Birthday! 🎂🎉`;
    } else {
      const hour = moment().hour();
      if (hour < 12) {
        return `Good Morning! 🌅`;
      } else if (hour < 16) {
        return `Good Afternoon! ☀️`;
      } else if (hour < 20) {
        return `Good Evening! 🌇`;
      } else {
        return `Good Night! 🌃`;
      }
    }


  }, [birthday]);
  // Handle confirmation modal close
  const handleModalClose = () => {
    performClockOut();
    setShowModal(!showModal); // Close the modal without taking any action
  };

  // Handle confirmation modal confirmation
  const handleModalConfirm = () => {
    setShowModal(false); // Close the modal
    performClockOut(); // Proceed with clock-out
  };

  // Disable Check In and Check Out based on status
  const isCheckInDisabled = clockInTime !== null && clockOutTime === null;  // Disable Check In if already clocked in
  const isCheckOutDisabled = clockInTime === null || clockOutTime !== null;  // Disable Check Out if not clocked in or already checked out

  return (
    <Container fluid className="mt-4">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={150}
        />
      )}

      {/* Welcome Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-2" style={{ color: "#333" }}>
              Hi, {username}!
            </h5>
            <h6 className="text-muted mb-0" style={{ marginTop: "0.5rem" }}>
              {getGreeting}
            </h6>
          </div>
          <div>
            <p
              className="mb-0 text-muted"
              style={{ color: "#6c757d", fontSize: "0.9rem" }}
            >
              {moment().format("Do MMMM YYYY")}
            </p>
            <p
              className="mb-0 text-muted"
              style={{ color: "#6c757d", fontSize: "0.9rem", marginTop: "0.5rem" }}
            >
              {currentTime.format("dddd")} {currentTime.format("hh:mm:ss A")}
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Attendance Card */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-4">Your Today's Attendance</h5>
          <Row style={{ display: "flex", alignItems: "stretch" }}>
            {/* Check In Card */}
            <Col md={6} style={{ display: "flex", flexDirection: "column" }}>
              <Card className="text-center p-3 shadow-sm" style={{ flex: 1 }}>
                <h6 className="text-primary">Check In</h6>
                <p className="mb-0 text-muted">
                  {clockInTime
                    ? new Date(clockInTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                    : "Not Checked In"}
                </p>


                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  {/* Webcam Toggle Button */}
                  {(!isWebcamVisible && !capturedImage && !isCheckedIn && !isCheckedOut && !isCheckInDisabled) && (
                    <button
                      onClick={() => setIsWebcamVisible(true)}
                      style={{
                        background: "white",
                        border: "1px solid #007BFF",
                        color: "#007BFF",
                        borderRadius: "50%",
                        padding: "10px",
                        fontSize: "24px",
                        cursor: "pointer",
                        width: "50px",
                        height: "50px",
                      }}
                    >
                      <FaCamera />
                    </button>
                  )}

                  {/* Webcam Component */}
                  {isWebcamVisible && (
                    <div className="webcam-container" style={{ marginTop: "20px" }}>
                      <Webcam
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        videoConstraints={{
                          facingMode: "user", // Use the front camera
                        }}
                        ref={webcamRef}
                      />
                      <div style={{ marginTop: "10px" }}>
                        <button
                          onClick={handleCapture}
                          style={{
                            background: "#007BFF",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            padding: "10px",
                            cursor: "pointer",
                            margin: "5px",
                          }}
                        >
                          <FaCamera /> {/* Capture Icon */}
                        </button>
                        <button
                          onClick={() => setIsWebcamVisible(false)}
                          style={{
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            padding: "10px",
                            cursor: "pointer",
                            margin: "5px",
                          }}
                        >
                          <FaTimes /> {/* Close Icon */}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Captured Image Preview (Without Buttons if Checked In/Out) */}
                  {capturedImage && (isCheckedIn || isCheckedOut) && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                      <h5>Captured Image</h5>
                      <img
                        src={capturedImage}
                        alt="Captured"
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          border: "2px solid #007BFF",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  )}

                  {/* Captured Image Preview with Buttons */}
                  {(capturedImage || capturedImages) && (!isCheckedIn || isCheckedOut) && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                      <h5>Preview Image</h5>
                      <img
                        src={
                          capturedImages === null
                            ? capturedImage // Show capturedImage directly if capturedImages is null
                            : `${process.env.REACT_APP_API_URL}/${capturedImages}` // Construct URL if capturedImages is not null
                        }
                        alt="Captured"
                        style={{
                          width: "100px",
                          maxWidth: "300px",
                          border: "2px solid #5200ff",
                          borderRadius: "5px",
                          marginBottom: "10px"
                        }}
                      />
                      {capturedImages === null && (
                        <div style={{ marginTop: "10px" }}>
                          <button
                            onClick={handleApprove}
                            disabled={isCheckedIn || isCheckedOut || isCheckInDisabled}
                            style={{
                              background: "green",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              padding: "10px",
                              cursor: "pointer",
                              margin: "5px",
                            }}
                          >
                            <FaCheck /> {/* Approve Icon */}
                          </button>
                          <button
                            onClick={handleRetake}
                            disabled={isCheckedIn || isCheckedOut || isCheckInDisabled}
                            style={{
                              background: "#FFA500",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              padding: "10px",
                              cursor: "pointer",
                              margin: "5px",
                            }}
                          >
                            <FaRedo /> {/* Retake Icon */}
                          </button>
                        </div>
                      )}
                    </div>
                  )}


                  {/* Success Message */}
                  {isSuccess && (
                    <div
                      style={{
                        background: "#28a745",
                        color: "white",
                        padding: "10px",
                        borderRadius: "5px",
                        marginTop: "20px",
                        textAlign: "center",
                      }}
                    >
                      <FaUpload /> Check-In live selfie uploaded successfully!
                    </div>
                  )}
                </div>

                <Form.Group className="mt-3 mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Company/Location name"
                    value={company_location_name}
                    onChange={handleLocationChange}
                    disabled={isCheckedIn || isCheckedOut || isCheckInDisabled}
                  />
                </Form.Group>

                <div style={{ marginTop: "auto" }}>
                  <Button
                    variant={isClockedIn ? "secondary" : "success"}
                    onClick={handleClockIn}
                    disabled={
                      isCheckInDisabled || isCheckedIn || isClockedIn || isCheckedOut
                    }
                    style={{ width: "100%" }}
                  >
                    {isClockedIn ? (
                      <>
                        <FaCheck /> Checked In
                      </>
                    ) : (
                      <>
                        <FaCheck /> Check In
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Check Out Card */}
            <Col md={6} style={{ display: "flex", flexDirection: "column" }}>
              <Card className="text-center p-3 shadow-sm" style={{ flex: 1 }}>
                <h6 className="text-primary">Check Out</h6>
                <p className="mb-0 text-muted">
                  {clockOutTime
                    ? new Date(clockOutTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                    : "Not Checked Out"}
                </p>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  {/* Webcam Toggle Button */}
                  {(!isWebcamVisibleCheckout && !capturedImageCheckout && !isCheckedIn && !isCheckedOut) && (
                    <button
                      onClick={() => setIsWebcamVisibleCheckout(true)}
                      style={{
                        background: "white",
                        border: "1px solid #007BFF",
                        color: "#007BFF",
                        borderRadius: "50%",
                        padding: "10px",
                        fontSize: "24px",
                        cursor: "pointer",
                        width: "50px",
                        height: "50px",
                      }}
                    >
                      <FaCamera />
                    </button>
                  )}

                  {/* Webcam Component */}
                  {isWebcamVisibleCheckout && (
                    <div className="webcam-container" style={{ marginTop: "20px" }}>
                      <Webcam
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        videoConstraints={{
                          facingMode: "user", // Use the front camera
                        }}
                        ref={webcamRef} // Attach webcamRef to the Webcam component
                      />
                      <div style={{ marginTop: "10px" }}>
                        <button
                          onClick={handleCaptureCheckout}
                          style={{
                            background: "#007BFF",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            padding: "10px",
                            cursor: "pointer",
                            margin: "5px",
                          }}
                        >
                          <FaCamera /> {/* Capture Icon */}
                        </button>
                        <button
                          onClick={() => setIsWebcamVisibleCheckout(false)}
                          style={{
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            padding: "10px",
                            cursor: "pointer",
                            margin: "5px",
                          }}
                        >
                          <FaTimes /> {/* Close Icon */}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Captured Image Preview */}
                  {(capturedImageCheckout || capturedImagesCheckout) && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                      <h5>Preview Image</h5>
                      <img
                        src={
                          capturedImagesCheckout === null
                            ? capturedImageCheckout // Show capturedImageCheckout directly if capturedImagesCheckout is null
                            : `${process.env.REACT_APP_API_URL}/${capturedImagesCheckout}` // Construct URL if capturedImagesCheckout is not null
                        }
                        alt="Captured"
                        style={{
                          width: "100px",
                          maxWidth: "300px",
                          border: "2px solid #5200ff",
                          borderRadius: "10px",
                        }}
                      />
                      {capturedImagesCheckout === null && (
                        <div style={{ marginTop: "10px" }}>
                          <button
                            onClick={handleApproveCheckout}
                            disabled={isCheckedIn || isCheckedOut}
                            style={{
                              background: "green",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              padding: "10px",
                              cursor: "pointer",
                              margin: "5px",
                            }}
                          >
                            <FaCheck /> {/* Approve Icon */}
                          </button>
                          <button
                            onClick={handleRetakeCheckout}
                            disabled={isCheckedIn || isCheckedOut}
                            style={{
                              background: "#FFA500",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              padding: "10px",
                              cursor: "pointer",
                              margin: "5px",
                            }}
                          >
                            <FaRedo /> {/* Retake Icon */}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Success Message */}
                  {isSuccessCheckout && (
                    <div
                      style={{
                        background: "#28a745",
                        color: "white",
                        padding: "10px",
                        borderRadius: "5px",
                        marginTop: "20px",
                        textAlign: "center",
                      }}
                    >
                      <FaUpload /> Checkout live Selfie uploaded successfully!
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "auto" }}>
                  <Button
                    variant={isCheckedOut ? "secondary" : "danger"}
                    onClick={handleClockOut}
                    disabled={isCheckedIn || isCheckedOut}
                    style={{ width: "100%" }}
                  >
                    {isCheckedOut ? (
                      <>
                        <FaSignOutAlt /> Checked Out
                      </>
                    ) : (
                      <>
                        <FaSignOutAlt /> Check Out
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Modal for Confirmation */}
      <ConfirmAlert
        show={showModal}
        hide={setShowModal}
        title="Confirm Check Out"
        description="You have not completed 9 hours of work. Are you sure you want to check out?"
        deleteFunction={handleModalClose}
      />

    </Container>
  );
};

export default TimeBar;