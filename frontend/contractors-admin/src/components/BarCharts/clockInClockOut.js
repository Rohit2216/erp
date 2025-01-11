// import React, { useState, useEffect } from "react";
// import { Button, Col, Row, Card } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import { postClockIN, postClockOut, getCheckinStatus } from "../../services/contractorApi";
// import { toast } from "react-toastify";
// import ConfirmAlert from "../ConfirmAlert";

// export default function ClockIn() {
//   const { t } = useTranslation();
//   const [isClockedIn, setIsClockedIn] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null); // Track clock-out time
//   const [showModal, setShowModal] = useState(false);
//   const [totalHours, setTotalHours] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("authToken"));

//   useEffect(() => {
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

//     // Check clock-in status on component mount
//     const fetchCheckinStatus = async () => {
//       try {
//         const statusResponse = await getCheckinStatus(); // Fetch clock-in status
//         if (statusResponse.status) {
//           if (statusResponse.clockOutTime) {
//             setClockOutTime(statusResponse.clockOutTime); // Set clock-out time
//             setClockInTime(statusResponse.clockInTime); // Set clock-in time
//           } else if (statusResponse.clockInTime) {
//             setIsClockedIn(true); // User has clocked in but not clocked out
//             setClockInTime(statusResponse.clockInTime); // Set clock-in time
//           }
//         }
//       } catch (error) {
//         console.error("Error checking clock-in status:", error);
//       }
//     };

//     fetchCheckinStatus(); // Fetch the clock-in status when component mounts
//   }, []);  // Empty dependency array means it runs only once when the component mounts

//   const handleClockIn = async () => {
//     if (location) {
//       try {
//         const inTime = new Date().toISOString(); // Get the current time for clock-in
//         const response = await postClockIN({
//           in_time: inTime,
//           clockInLongitude: location.longitude,
//           clockInLatitude: location.latitude,
//         });

//         if (response.status) {
//           setIsClockedIn(true);
//           setClockInTime(response.clockInTime ?? inTime); // Store the clock-in time
//           setClockOutTime(null); // Ensure clock-out time is cleared when clocking in
//           toast.success(response.message || "Check In Success");
//         } else {
//           toast.error(response.message || "Failed to clock in.");
//         }
//       } catch (error) {
//         console.error("Error during check-in:", error);
//         toast.error("Error during check-in.");
//       }
//     } else {
//       toast.error("Unable to get location.");
//     }
//   };

//   const calculateTotalHours = (clockInTime) => {
//     if (!clockInTime) return 0; // If no clock-in time, return 0 hours

//     const clockInDate = new Date(clockInTime); // Convert clock-in time to Date object
//     const currentDate = new Date(); // Get the current date and time

//     // Calculate the difference in milliseconds
//     const timeDifference = currentDate - clockInDate;

//     // Convert the difference from milliseconds to hours and minutes
//     const totalHours = timeDifference / (1000 * 60 * 60); // Hours
//     const totalMinutes = (timeDifference / (1000 * 60)) % 60; // Minutes

//     return {
//       totalHours: Math.floor(totalHours), // Full hours
//       totalMinutes: Math.round(totalMinutes), // Rounding minutes
//     };
//   };

//   const handleClockOut = async () => {
//     if (location) {
//       try {
//         const statusResponse = await getCheckinStatus(); // Fetch clock-in status

//         if (statusResponse.status && statusResponse.clockInTime) {
//           const { clockInTime } = statusResponse;

//           // Calculate total hours worked
//           const { totalHours, totalMinutes } = calculateTotalHours(clockInTime);

//           if (totalHours < 9) {
//             // If less than 9 hours, show a warning modal
//             setTotalHours(`${totalHours} hours and ${totalMinutes} minutes`);
//             setShowModal(true);
//             return; // Stop the clock-out process until user confirms
//           }

//           // If user has worked 9 hours or more, proceed with clock-out
//           await proceedClockOut();
//         }
//       } catch (error) {
//         console.error("Error during check-out:", error);
//         toast.error("Error during check-out.");
//       }
//     } else {
//       toast.error("Unable to get location.");
//     }
//   };

//   const proceedClockOut = async () => {
//     try {
//       const outTime = new Date().toISOString(); // Get the current time for clock-out
//       const response = await postClockOut({
//         out_time: outTime,
//         clockOutLongitude: location.longitude,
//         clockOutLatitude: location.latitude,
//       });

//       if (response.status) {
//         setIsClockedIn(false);
//         setClockInTime(null); // Reset clock-in time when clocking out
//         setClockOutTime(outTime); // Set the clock-out time
//         setShowModal(false); // Hide the modal after successful clock-out

//         // Re-fetch check-in status after clock-out
//         const statusResponse = await getCheckinStatus();
//         if (statusResponse.status) {
//           setClockInTime(statusResponse.clockInTime);  // Set the clock-in time
//           setClockOutTime(statusResponse.clockOutTime);  // Set the clock-out time
//           setIsClockedIn(false);  // Make sure button reflects "Already Clocked In & Out"
//         }

//         toast.success("Checked out successfully!");
//       } else {
//         toast.error(response.message || "Failed to check out.");
//       }
//     } catch (error) {
//       console.error("Error during check-out:", error);
//       toast.error("Error during check-out.");
//     }
//   };

//   return (
//     // <div>
//     //   <Col md={12} className="my-2">
//     //     <Row className="justify-content-end">
//     //       <Col md={2}>
//     //         {/* Disable Clock In button if the user has both clock-in and clock-out times */}
//     //         <Button
//     //           variant={isClockedIn ? "danger" : "success"}
//     //           onClick={isClockedIn ? handleClockOut : handleClockIn}
//     //           disabled={clockInTime && clockOutTime} // Disable if both clock-in and clock-out exist
//     //         >
//     //           {clockInTime && clockOutTime
//     //             ? t("Already Checked In/Out") // Text if user already clocked in and out
//     //             : isClockedIn
//     //             ? t("Check Out")
//     //             : t("Check In")}
//     //         </Button>
//     //       </Col>
//     //     </Row>
//     //   </Col>

//     //   {/* Display clock-in time on the dashboard */}
//     //   {isClockedIn && clockInTime && (
//     //     <Card className="mt-3">
//     //       <Card.Body>
//     //         <Card.Title>{t("You checked in at")}</Card.Title>
//     //         <Card.Text>{new Date(clockInTime).toLocaleString()}</Card.Text>
//     //       </Card.Body>
//     //     </Card>
//     //   )}

//     //   {/* Confirm Alert Modal */}
//     //   <ConfirmAlert
//     //     show={showModal}
//     //     hide={setShowModal}
//     //     title="Confirm Check Out"
//     //     description={`You have not completed 9 hours of work. You have completed ${totalHours} hours. Are you sure you want to check out?`}
//     //     deleteFunction={proceedClockOut} // Function to proceed with clock-out
//     //   />
//     // </div>

//     <div>
//       <Col md={12} className="my-2">
//         <Row className="justify-content-start"> {/* Changed justify-content-end to justify-content-start */}
//           <Col md={2}> {/* Left-align button */}
//             <Button
//               variant={isClockedIn ? "danger" : "success"}
//               onClick={isClockedIn ? handleClockOut : handleClockIn}
//               disabled={clockInTime && clockOutTime} // Disable if both clock-in and clock-out exist
//             >
//               {clockInTime && clockOutTime
//                 ? t("Already Checked In/Out") // Text if user already clocked in and out
//                 : isClockedIn
//                   ? t("Check Out")
//                   : t("Check In")}
//             </Button>
//           </Col>
//         </Row>
//       </Col>

//       {/* Display clock-in time on the dashboard */}
//       {isClockedIn && clockInTime && (
//         <Card className="mt-3">
//           <Card.Body>
//             <Card.Title>{t("You checked in at")}</Card.Title>
//             <Card.Text>{new Date(clockInTime).toLocaleString()}</Card.Text>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Confirm Alert Modal */}
//       <ConfirmAlert
//         size="sm" 
//         show={showModal}
//         hide={setShowModal}
//         title="Confirm Check Out"
//         description={`You have not completed 9 hours of work. You have completed ${totalHours} hours. Are you sure you want to check out?`}
//         deleteFunction={proceedClockOut} // Function to proceed with clock-out
//       />
//     </div>

//   );
// }



// import React, { useState, useEffect } from "react";
// import { Button, Col, Row, Card } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import { postClockIN, postClockOut, getCheckinStatus } from "../../services/contractorApi";
// import { toast } from "react-toastify";
// import ConfirmAlert from "../ConfirmAlert";

// export default function ClockIn() {
//   const { t } = useTranslation();
//   const [isClockedIn, setIsClockedIn] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null); // Track clock-out time
//   const [showModal, setShowModal] = useState(false);
//   const [totalHours, setTotalHours] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("authToken"));

//   useEffect(() => {
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

//     // Check clock-in status on component mount
//     const fetchCheckinStatus = async () => {
//       try {
//         const statusResponse = await getCheckinStatus(); // Fetch clock-in status
//         if (statusResponse.status) {
//           if (statusResponse.clockOutTime) {
//             setClockOutTime(statusResponse.clockOutTime); // Set clock-out time
//             setClockInTime(statusResponse.clockInTime); // Set clock-in time
//           } else if (statusResponse.clockInTime) {
//             setIsClockedIn(true); // User has clocked in but not clocked out
//             setClockInTime(statusResponse.clockInTime); // Set clock-in time
//           }
//         }
//       } catch (error) {
//         console.error("Error checking clock-in status:", error);
//       }
//     };

//     fetchCheckinStatus(); // Fetch the clock-in status when component mounts
//   }, []);  // Empty dependency array means it runs only once when the component mounts

//   const handleClockIn = async () => {
//     if (location) {
//       try {
//         const inTime = new Date().toISOString(); // Get the current time for clock-in
//         const response = await postClockIN({
//           in_time: inTime,
//           clockInLongitude: location.longitude,
//           clockInLatitude: location.latitude,
//         });

//         if (response.status) {
//           setIsClockedIn(true);
//           setClockInTime(response.clockInTime ?? inTime); // Store the clock-in time
//           setClockOutTime(null); // Ensure clock-out time is cleared when clocking in
//           toast.success(response.message || "Check In Success");
//         } else {
//           toast.error(response.message || "Failed to clock in.");
//         }
//       } catch (error) {
//         console.error("Error during check-in:", error);
//         toast.error("Error during check-in.");
//       }
//     } else {
//       toast.error("Unable to get location.");
//     }
//   };

//   const calculateTotalHours = (clockInTime) => {
//     if (!clockInTime) return 0; // If no clock-in time, return 0 hours

//     const clockInDate = new Date(clockInTime); // Convert clock-in time to Date object
//     const currentDate = new Date(); // Get the current date and time

//     // Calculate the difference in milliseconds
//     const timeDifference = currentDate - clockInDate;

//     // Convert the difference from milliseconds to hours and minutes
//     const totalHours = timeDifference / (1000 * 60 * 60); // Hours
//     const totalMinutes = (timeDifference / (1000 * 60)) % 60; // Minutes

//     return {
//       totalHours: Math.floor(totalHours), // Full hours
//       totalMinutes: Math.round(totalMinutes), // Rounding minutes
//     };
//   };

//   const handleClockOut = async () => {
//     if (location) {
//       try {
//         const statusResponse = await getCheckinStatus(); // Fetch clock-in status

//         if (statusResponse.status && statusResponse.clockInTime) {
//           const { clockInTime } = statusResponse;

//           // Calculate total hours worked
//           const { totalHours, totalMinutes } = calculateTotalHours(clockInTime);

//           if (totalHours < 9) {
//             // If less than 9 hours, show a warning modal
//             setTotalHours(`${totalHours} hours and ${totalMinutes} minutes`);
//             setShowModal(true);
//             return; // Stop the clock-out process until user confirms
//           }

//           // If user has worked 9 hours or more, proceed with clock-out
//           await proceedClockOut();
//         }
//       } catch (error) {
//         console.error("Error during check-out:", error);
//         toast.error("Error during check-out.");
//       }
//     } else {
//       toast.error("Unable to get location.");
//     }
//   };

//   const proceedClockOut = async () => {
//     try {
//       const outTime = new Date().toISOString(); // Get the current time for clock-out
//       const response = await postClockOut({
//         out_time: outTime,
//         clockOutLongitude: location.longitude,
//         clockOutLatitude: location.latitude,
//       });

//       if (response.status) {
//         setIsClockedIn(false);
//         setClockInTime(null); // Reset clock-in time when clocking out
//         setClockOutTime(outTime); // Set the clock-out time
//         setShowModal(false); // Hide the modal after successful clock-out

//         // Re-fetch check-in status after clock-out
//         const statusResponse = await getCheckinStatus();
//         if (statusResponse.status) {
//           setClockInTime(statusResponse.clockInTime);  // Set the clock-in time
//           setClockOutTime(statusResponse.clockOutTime);  // Set the clock-out time
//           setIsClockedIn(false);  // Make sure button reflects "Already Clocked In & Out"
//         }

//         toast.success("Checked out successfully!");
//       } else {
//         toast.error(response.message || "Failed to check out.");
//       }
//     } catch (error) {
//       console.error("Error during check-out:", error);
//       toast.error("Error during check-out.");
//     }
//   };

//   return (
//     <div>
//       <Col md={12} className="my-2">
//         <Row className="justify-content-start">
//           <Col md={2}>
//             <Button
//               variant={isClockedIn ? "danger" : "success"}
//               onClick={isClockedIn ? handleClockOut : handleClockIn}
//               disabled={clockInTime && clockOutTime} // Disable if both clock-in and clock-out exist
//             >
//               {clockInTime && clockOutTime
//                 ? t("Check In")
//                 : isClockedIn
//                 ? t("Check Out")
//                 : t("Check In")}
//             </Button>
//           </Col>
//           {isClockedIn && (
//             <Col md={8} className="d-flex align-items-center">
//               <span className="ms-3">
//                 Every small effort counts. Keep pushing forward—your hard work will lead to success!
//               </span>
//             </Col>
//           )}
//         </Row>
//       </Col>

//       {/* Display clock-in time on the dashboard */}
//       {isClockedIn && clockInTime && (
//         <Card className="mt-3">
//           <Card.Body>
//             <Card.Title>{t("You checked in at")}</Card.Title>
//             <Card.Text>{new Date(clockInTime).toLocaleString()}</Card.Text>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Confirm Alert Modal */}
//       <ConfirmAlert
//         size="sm"
//         show={showModal}
//         hide={setShowModal}
//         title="Confirm Check Out"
//         description={`You have not completed 9 hours of work. You have completed ${totalHours} hours. Are you sure you want to check out?`}
//         deleteFunction={proceedClockOut} // Function to proceed with clock-out
//       />
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { Button, Col, Row, Card } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import { postClockIN, postClockOut, getCheckinStatus } from "../../services/contractorApi";
// import { toast } from "react-toastify";
// import ConfirmAlert from "../ConfirmAlert";

// export default function ClockIn() {
//   const { t } = useTranslation();
//   const [isClockedIn, setIsClockedIn] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null); // Track clock-out time
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
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

//     // Check clock-in status on component mount
//     const fetchCheckinStatus = async () => {
//       try {
//         const statusResponse = await getCheckinStatus(); // Fetch clock-in status
//         if (statusResponse.status) {
//           setClockInTime(statusResponse.clockInTime || null); // Set clock-in time
//           setClockOutTime(statusResponse.clockOutTime || null); // Set clock-out time
//           setIsClockedIn(Boolean(statusResponse.clockInTime && !statusResponse.clockOutTime)); // Set clocked-in status
//         }
//       } catch (error) {
//         console.error("Error checking clock-in status:", error);
//       }
//     };

//     fetchCheckinStatus();
//   }, []);

//   const handleClockIn = async () => {
//     if (location) {
//       try {
//         const inTime = new Date().toISOString(); // Get the current time for clock-in
//         const response = await postClockIN({
//           in_time: inTime,
//           clockInLongitude: location.longitude,
//           clockInLatitude: location.latitude,
//         });

//         if (response.status) {
//           setClockInTime(inTime); // Store the clock-in time
//           setClockOutTime(null); // Ensure clock-out time is cleared
//           setIsClockedIn(true);
//           toast.success(response.message || "Check In Success");
//         } else {
//           toast.error(response.message || "Failed to check in.");
//         }
//       } catch (error) {
//         console.error("Error during check-in:", error);
//         toast.error("Error during check-in.");
//       }
//     } else {
//       toast.error("Unable to get location.");
//     }
//   };

//   const handleClockOut = async () => {
//     if (location) {
//       try {
//         const outTime = new Date().toISOString(); // Get the current time for clock-out
//         const response = await postClockOut({
//           out_time: outTime,
//           clockOutLongitude: location.longitude,
//           clockOutLatitude: location.latitude,
//         });

//         if (response.status) {
//           setClockOutTime(outTime); // Set the clock-out time
//           setIsClockedIn(false); // Disable further check-ins/outs
//           toast.success(response.message || "Checked out successfully!");
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

//   return (
//     <div>
//       <Col md={12} className="my-2">
//         <Row className="justify-content-start">
//           <Col md={2}>
//             <Button
//               variant={clockInTime && !clockOutTime ? "danger" : "success"}
//               onClick={clockInTime && !clockOutTime ? handleClockOut : handleClockIn}
//               disabled={Boolean(clockInTime && clockOutTime)} // Disable if both clock-in and clock-out exist
//             >
//               {clockInTime && clockOutTime
//                 ? t("Checked Out") // All actions complete
//                 : clockInTime
//                 ? t("Check Out") // Ready to check out
//                 : t("Check In")} // Ready to check in
//             </Button>
//           </Col>
//           {isClockedIn && (
//             <Col md={8} className="d-flex align-items-center">
//               <span className="ms-3">
//                 Every small effort counts. Keep pushing forward—your hard work will lead to success!
//               </span>
//             </Col>
//           )}
//         </Row>
//       </Col>

//       {/* Display clock-in and clock-out times */}
//       {(clockInTime || clockOutTime) && (
//         <Card className="mt-3">
//           <Card.Body>
//             <Card.Title>{t("Attendance Details")}</Card.Title>
//             {clockInTime && (
//               <Card.Text>
//                 <strong>{t("Clock In Time")}:</strong> {new Date(clockInTime).toLocaleString()}
//               </Card.Text>
//             )}
//             {clockOutTime && (
//               <Card.Text>
//                 <strong>{t("Clock Out Time")}:</strong> {new Date(clockOutTime).toLocaleString()}
//               </Card.Text>
//             )}
//           </Card.Body>
//         </Card>
//       )}

//       {/* Confirm Alert Modal */}
//       <ConfirmAlert
//         size="sm"
//         show={showModal}
//         hide={setShowModal}
//         title="Confirm Check Out"
//         description="You have not completed 9 hours of work. Are you sure you want to check out?"
//         deleteFunction={handleClockOut}
//       />
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { Button, Col, Row, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { postClockIN, postClockOut, getCheckinStatus } from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../ConfirmAlert";
import { v4 as uuidv4 } from 'uuid'; 

export default function ClockIn() {
  const { t } = useTranslation();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [location, setLocation] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null); // Track clock-out time
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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

    // Check clock-in status on component mount
    const fetchCheckinStatus = async () => {
      try {
        const statusResponse = await getCheckinStatus(); // Fetch clock-in status
        if (statusResponse.status) {
          setClockInTime(statusResponse.clockInTime || null); // Set clock-in time
          setClockOutTime(statusResponse.clockOutTime || null); // Set clock-out time
          setIsClockedIn(Boolean(statusResponse.clockInTime && !statusResponse.clockOutTime)); // Set clocked-in status
        }
      } catch (error) {
        console.error("Error checking clock-in status:", error);
      }
    };

    fetchCheckinStatus();
  }, []);

  // const handleClockIn = async () => {
  //   if (location) {
  //     try {
  //       const inTime = new Date().toISOString(); // Get the current time for clock-in
  //       const response = await postClockIN({
  //         in_time: inTime,
  //         clockInLongitude: location.longitude,
  //         clockInLatitude: location.latitude,
  //       });

  //       if (response.status) {
  //         setClockInTime(inTime); // Store the clock-in time
  //         setClockOutTime(null); // Ensure clock-out time is cleared
  //         setIsClockedIn(true);
  //         toast.success(response.message || "Check In Success");
  //       } else {
  //         toast.error(response.message || "Failed to check in.");
  //       }
  //     } catch (error) {
  //       console.error("Error during check-in:", error);
  //       toast.error("Error during check-in.");
  //     }
  //   } else {
  //     toast.error("Unable to get location.");
  //   }
  // };



  //   // Function to generate or retrieve UUID
  const getOrCreateUUID = () => {
    const uuidKey = `device_uuid`;
    let deviceUUID = localStorage.getItem(uuidKey);
    if (!deviceUUID) {
        deviceUUID = crypto.randomUUID(); // Generate a new UUID
        localStorage.setItem(uuidKey, deviceUUID); // Save to local storage
    }
    return deviceUUID;
};


  const handleClockIn = async () => {
    if (location) {
      try {
        // Check if UUID is already saved in local storage

        const inTime = new Date().toISOString(); // Get the current time for clock-in
        const deviceUUID = getOrCreateUUID();
        const response = await postClockIN({
          user_uuid:deviceUUID, // Send the UUID in the payload
          in_time: inTime,
          clockInLongitude: location.longitude,
          clockInLatitude: location.latitude,
        });

        if (response.status) {
          setClockInTime(inTime); // Store the clock-in time
          setIsClockedIn(true);
          toast.success(response.message || "Check In Success");
        } else {
          toast.error(response.message || "Failed to check in.");
        }
      } catch (error) {
        console.error("Error during check-in:", error);
        toast.error("Error during check-in.");
      }
    } else {
      toast.error("Unable to get location.");
    }
  };

  const handleClockOut = async () => {
    if (location) {
      try {
        const outTime = new Date().toISOString(); // Get the current time for clock-out
        const response = await postClockOut({
          out_time: outTime,
          clockOutLongitude: location.longitude,
          clockOutLatitude: location.latitude,
        });

        if (response.status) {
          setClockOutTime(outTime); // Set the clock-out time
          setIsClockedIn(false); // Disable further check-ins/outs
          toast.success(response.message || "Checked out successfully!");
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

  return (
    <div>
      <Col md={12} className="my-2">
        <Row className="justify-content-start">
          <Col md={2}>
            <Button
              variant={clockInTime && !clockOutTime ? "danger" : "success"}
              onClick={clockInTime && !clockOutTime ? handleClockOut : handleClockIn}
              disabled={Boolean(clockInTime && clockOutTime)} // Disable if both clock-in and clock-out exist
            >
              {clockInTime && clockOutTime
                ? t("Checked Out") // All actions complete
                : clockInTime
                ? t("Check Out") // Ready to check out
                : t("Check In")} // Ready to check in
            </Button>
          </Col>
          {isClockedIn && (
            <Col md={8} className="d-flex align-items-center">
              <span className="ms-3">
                Every small effort counts. Keep pushing forward—your hard work will lead to success!
              </span>
            </Col>
          )}
        </Row>
      </Col>

      {/* Display clock-in and clock-out times */}
      {(clockInTime || clockOutTime) && (
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>{t("Attendance Details")}</Card.Title>
            {clockInTime && (
              <Card.Text>
                <strong>{t("Clock In Time")}:</strong> {new Date(clockInTime).toLocaleString()}
              </Card.Text>
            )}
            {clockOutTime && (
              <Card.Text>
                <strong>{t("Clock Out Time")}:</strong> {new Date(clockOutTime).toLocaleString()}
              </Card.Text>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Confirm Alert Modal */}
      <ConfirmAlert
        size="sm"
        show={showModal}
        hide={setShowModal}
        title="Confirm Check Out"
        description="You have not completed 9 hours of work. Are you sure you want to check out?"
        deleteFunction={handleClockOut}
      />
    </div>
  );
}