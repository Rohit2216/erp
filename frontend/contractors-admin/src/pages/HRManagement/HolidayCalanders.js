// import React, { useEffect, useState } from "react";
// import { Card, Col, Table, Spinner, Form, Button, Modal } from "react-bootstrap";
// import { getAllHolidayList, createHolidayList, updateHolidayList, deleteHolidayList } from "../../services/authapi"; // hypothetical API functions
// import moment from "moment";
// import ActionButton from "../../components/ActionButton"; // Import ActionButton

// const HolidayCalendar = () => {
//   const currentYear = new Date().getFullYear();
//   const [holidayDetails, setHolidayDetails] = useState([]);
//   const [filteredHolidays, setFilteredHolidays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
//   const [holidayName, setHolidayName] = useState("");
//   const [holidayDate, setHolidayDate] = useState("");
//   const [selectedHolidayId, setSelectedHolidayId] = useState(null); // For tracking which holiday to update

//   const fetchHolidayData = async () => {
//     setLoading(true);
//     try {
//       const res = await getAllHolidayList("", "", "", selectedYear);
//       if (res.status && res.data.length > 0) {
//         setHolidayDetails(res.data);
//         setFilteredHolidays(res.data); // Show all holidays initially
//       } else {
//         setHolidayDetails([]);
//         setFilteredHolidays([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch holiday details:", error);
//       setHolidayDetails([]);
//       setFilteredHolidays([]);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const getYearRange = () => {
//     const currentYear = new Date().getFullYear(); // Get the current year
//     const years = [
//       currentYear - 1, // Previous year
//       currentYear,     // Current year
//       currentYear + 1  // Next year
//     ];
//     return years;
//   };

//   const handleYearChange = (event) => {
//     const year = event.target.value;
//     setSelectedYear(year);
//   };

//   const handleCreateHoliday = async () => {
//     try {
//       const res = await createHolidayList(holidayName, holidayDate);
//       if (res.status) {
//         fetchHolidayData(); // Refresh the list after adding a new holiday
//         setShowModal(false); // Close the modal
//         setHolidayName("");
//         setHolidayDate("");
//       } else {
//         console.error("Failed to create holiday:", res.message);
//       }
//     } catch (error) {
//       console.error("Error creating holiday:", error);
//     }
//   };

//   const handleUpdateHoliday = async () => {
//     try {
//       const res = await updateHolidayList(selectedHolidayId, holidayName, holidayDate);
//       if (res.status) {
//         fetchHolidayData(); // Refresh the list after updating the holiday
//         setShowModal(false); // Close the modal
//         setHolidayName("");
//         setHolidayDate("");
//         setSelectedHolidayId(null); // Reset selectedHolidayId
//       } else {
//         console.error("Failed to update holiday:", res.message);
//       }
//     } catch (error) {
//       console.error("Error updating holiday:", error);
//     }
//   };

//   const handleDeleteHoliday = async () => {
//     try {
//       const res = await deleteHolidayList(selectedHolidayId);
//       if (res.status) {
//         fetchHolidayData(); // Refresh the list after deleting the holiday
//         setShowDeleteModal(false); // Close the delete confirmation modal
//         setSelectedHolidayId(null); // Reset selectedHolidayId
//       } else {
//         console.error("Failed to delete holiday:", res.message);
//       }
//     } catch (error) {
//       console.error("Error deleting holiday:", error);
//     }
//   };

//   useEffect(() => {
//     fetchHolidayData();
//   }, [selectedYear]);

//   if (loading) {
//     return (
//       <Col md={12} className="d-flex justify-content-center">
//         <Spinner animation="border" />
//       </Col>
//     );
//   }

//   const handleEditHoliday = (holiday) => {
//     setHolidayName(holiday.holiday_name);
//     setHolidayDate(moment(holiday.holiday_date).format("YYYY-MM-DD"));
//     setSelectedHolidayId(holiday.id);
//     setShowModal(true); // Open the modal for editing
//   };

//   const handleOpenDeleteModal = (holidayId) => {
//     setSelectedHolidayId(holidayId);
//     setShowDeleteModal(true); // Show the confirmation modal
//   };

//   return (
//     <Col md={12}>
//       <Card className="h-100 shadow-lg shadow-slate-400">
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <Form.Group controlId="yearSelect">
//               <Form.Label
//                 style={{
//                   fontWeight: "600",
//                   fontSize: "1rem",
//                   color: "#333",
//                 }}
//               >
//                 Select Year
//               </Form.Label>
//               <Form.Control
//                 as="select"
//                 value={selectedYear}
//                 onChange={handleYearChange}
//                 style={{
//                   padding: "0.5rem",
//                   fontSize: "1rem",
//                   borderRadius: "0.375rem",
//                   borderColor: "#ccc",
//                   backgroundColor: "#f9f9f9",
//                 }}
//               >
//                 {getYearRange().map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </Form.Control>
//             </Form.Group>
//             <Button
//               variant="primary"
//               onClick={() => setShowModal(true)}
//               style={{
//                 backgroundColor: "#ffbc00",
//                 padding: "0.5rem 2rem",
//                 fontSize: "1rem",
//                 borderRadius: "0.375rem",
//                 color: "white",
//                 cursor: "pointer",
//                 transition: "background-color 0.3s ease",
//               }}
//               onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff9f00")}
//               onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffbc00")}
//             >
//               Create Holiday
//             </Button>
//           </div>

//           <Table striped bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Holiday Name</th>
//                 <th>Holiday Date</th>
//                 <th>action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredHolidays.map((holiday, index) => (
//                 <tr key={holiday.id}>
//                   <td>{index + 1}</td>
//                   <td>{holiday.holiday_name}</td>
//                   <td>{moment(holiday.holiday_date).format("DD/MM/YYYY")}</td>
//                   <td>
//                     {/* <ActionButton
//                       editOnclick={() => handleEditHoliday(holiday)}
//                       deleteOnclick={() => handleOpenDeleteModal(holiday.id)} // Open the delete confirmation modal
//                       // hideEdit={false}
//                       // hideDelete={false}

//                       editClass="warning"  // Orange color for update
//                       deleteClass="danger"  // Red color for delete
//                     /> */
//                     <ActionButton
//                     deleteOnclick={() => {
//                       handleOpenDeleteModal(holiday.id)
//                     }}
//                     hideEye={"d-none"}
//                     hideEdit={`${true ? "d-none" :"" }`}
//                     editOnclick={() => handleEditHoliday(holiday)}
//                     />}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>

//       {/* Modal for creating or updating a holiday */}
//       <Modal
//         show={showModal}
//         onHide={() => {
//           setShowModal(false); // Close the modal
//           setHolidayName(""); // Reset holidayName
//           setHolidayDate(""); // Reset holidayDate
//           setSelectedHolidayId(null); // Reset selectedHolidayId
//         }}
//         centered
//         style={{
//           fontFamily: "Arial, sans-serif",
//           borderRadius: "10px",
//         }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title
//             style={{
//               fontWeight: "600",
//               fontSize: "1.2rem",
//               color: "#333",
//             }}
//           >
//             {selectedHolidayId ? "Update Holiday" : "Create New Holiday"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="holidayName">
//               <Form.Label
//                 style={{
//                   fontWeight: "600",
//                   fontSize: "1rem",
//                   color: "#333",
//                 }}
//               >
//                 Holiday Name
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter holiday name"
//                 value={holidayName}
//                 onChange={(e) => setHolidayName(e.target.value)}
//                 style={{
//                   padding: "0.8rem",
//                   fontSize: "1rem",
//                   borderRadius: "0.375rem",
//                   borderColor: "#ccc",
//                   backgroundColor: "#f9f9f9",
//                   boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                 }}
//               />
//             </Form.Group>

//             <Form.Group controlId="holidayDate">
//               <Form.Label
//                 style={{
//                   fontWeight: "600",
//                   fontSize: "1rem",
//                   color: "#333",
//                 }}
//               >
//                 Holiday Date
//               </Form.Label>
//               <Form.Control
//                 type="date"
//                 value={holidayDate}
//                 onChange={(e) => setHolidayDate(e.target.value)}
//                 style={{
//                   padding: "0.8rem",
//                   fontSize: "1rem",
//                   borderRadius: "0.375rem",
//                   borderColor: "#ccc",
//                   backgroundColor: "#f9f9f9",
//                   boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                 }}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => {
//               setShowModal(false); // Close modal on cancel
//               setHolidayName(""); // Reset
//               setHolidayDate(""); // Reset
//               setSelectedHolidayId(null); // Reset
//             }}
//             style={{
//               padding: "0.5rem 2rem",
//               fontSize: "1rem",
//               borderRadius: "0.375rem",
//             }}
//           >
//             Close
//           </Button>
//           <Button
//             variant="primary"
//             onClick={selectedHolidayId ? handleUpdateHoliday : handleCreateHoliday}
//             style={{
//               padding: "0.5rem 2rem",
//               fontSize: "1rem",
//               borderRadius: "0.375rem",
//               backgroundColor: "#ff8a00", // Orange color for Update
//             }}
//           >
//             {selectedHolidayId ? "Update" : "Create"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal for delete confirmation */}
//       <Modal
//         show={showDeleteModal}
//         onHide={() => setShowDeleteModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to delete this holiday?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowDeleteModal(false)}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="danger"
//             onClick={handleDeleteHoliday}
//           >
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Col>
//   );
// };

// export default HolidayCalendar;



// import React, { useEffect, useState } from "react";
// import { Card, Col, Table, Spinner, Form, Button, Modal } from "react-bootstrap";
// import { getAllHolidayList, createHolidayList, updateHolidayList, deleteHolidayList, getAllModuleByRoleId } from "../../services/authapi";
// import moment from "moment";
// import ActionButton from "../../components/ActionButton";
// import { selectUser } from "../../features/auth/authSlice";
// import { useSelector } from "react-redux";

// const HolidayCalendar = () => {
//   const currentYear = new Date().getFullYear();
//   const [holidayDetails, setHolidayDetails] = useState([]);
//   const [filteredHolidays, setFilteredHolidays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [permissions, setPermissions] = useState({
//     create: 0,
//     update: 0,
//     delete: 0,
//     view: 0, // Include the 'view' permission
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false); 
//   const [holidayName, setHolidayName] = useState("");
//   const [holidayDate, setHolidayDate] = useState("");
//   const [selectedHolidayId, setSelectedHolidayId] = useState(null);
//   const { user, userPermission } = useSelector(selectUser);

//   // Fetch holiday data
//   const fetchHolidayData = async () => {

//     setLoading(true);
//     try {
//       const res = await getAllHolidayList(selectedYear);
//       if (res.status && res.data.length > 0) {
//         console.log("Holiday Data:", res.data); // Debug log
//         setHolidayDetails(res.data);
//         setFilteredHolidays(res.data); // Show all holidays initially
//       } else {
//         console.log("No holidays data"); // Debug log
//         setHolidayDetails([]);
//         setFilteredHolidays([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch holiday details:", error);
//       setHolidayDetails([]);
//       setFilteredHolidays([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch permissions for the "Holidays Calendar" module
//   const fetchPermissions = async () => {
//     try {
//       const userID = user.user_type;;
//       const res = await getAllModuleByRoleId(userID);
//       console.log("Permissions API Response:", res); // Debug log

//       if (res.status && res.data.length > 0) {
//         const hrModule = res.data.find((module) => module.title === "HR Management");
//         console.log("HR Management Module:", hrModule); // Debug log

//         if (hrModule && hrModule.submodules) {
//           const holidayCalendarSubmodule = hrModule.submodules.find(
//             (submodule) => submodule.title === "Holidays Calender"
//           );
//           console.log("Holiday Calendar Submodule Permissions:", holidayCalendarSubmodule); // Debug log

//           if (holidayCalendarSubmodule) {
//             setPermissions({
//               create: holidayCalendarSubmodule.create,
//               update: holidayCalendarSubmodule.update,
//               delete: holidayCalendarSubmodule.delete,
//               view: holidayCalendarSubmodule.view, // Set the 'view' permission
//             });
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch permissions:", error);
//     }
//   };

//   useEffect(() => {
//     fetchHolidayData();
//     fetchPermissions(); // Fetch permissions on component load
//   }, [selectedYear]);

//   useEffect(() => {
//     console.log("Permissions:", permissions); // Debug log
//   }, [permissions]);

//   if (loading) {
//     return (
//       <Col md={12} className="d-flex justify-content-center">
//         <Spinner animation="border" />
//       </Col>
//     );
//   }

//   const handleYearChange = (event) => {
//     const year = event.target.value;
//     setSelectedYear(year);
//   };

//   const handleEditHoliday = (holiday) => {
//     setHolidayName(holiday.holiday_name);
//     setHolidayDate(moment(holiday.holiday_date).format("YYYY-MM-DD"));
//     setSelectedHolidayId(holiday.id);
//     setShowModal(true); // Open the modal for editing
//   };

//   const handleOpenDeleteModal = (holidayId) => {
//     setSelectedHolidayId(holidayId);
//     setShowDeleteModal(true); // Show the confirmation modal
//   };

//   const handleCreateHoliday = async () => {
//     try {
//       const res = await createHolidayList(holidayName, holidayDate);
//       if (res.status) {
//         fetchHolidayData(); // Refresh the list after adding a new holiday
//         setShowModal(false); // Close the modal
//         setHolidayName("");
//         setHolidayDate("");
//       } else {
//         console.error("Failed to create holiday:", res.message);
//       }
//     } catch (error) {
//       console.error("Error creating holiday:", error);
//     }
//   };

//   const handleUpdateHoliday = async () => {
//     try {
//       const res = await updateHolidayList(selectedHolidayId, holidayName, holidayDate);
//       if (res.status) {
//         fetchHolidayData(); // Refresh the list after updating the holiday
//         setShowModal(false); // Close the modal
//         setHolidayName("");
//         setHolidayDate("");
//         setSelectedHolidayId(null); // Reset selectedHolidayId
//       } else {
//         console.error("Failed to update holiday:", res.message);
//       }
//     } catch (error) {
//       console.error("Error updating holiday:", error);
//     }
//   };

//   const handleDeleteHoliday = async () => {
//     try {
//       const res = await deleteHolidayList(selectedHolidayId);
//       if (res.status) {
//         fetchHolidayData(); // Refresh the list after deleting the holiday
//         setShowDeleteModal(false); // Close the delete confirmation modal
//         setSelectedHolidayId(null); // Reset selectedHolidayId
//       } else {
//         console.error("Failed to delete holiday:", res.message);
//       }
//     } catch (error) {
//       console.error("Error deleting holiday:", error);
//     }
//   };

//   console.log("Permissions State:", permissions); // Debug log for permissions state

//   return (
//     <Col md={12}>
//       <Card className="h-100 shadow-lg shadow-slate-400">
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <Form.Group controlId="yearSelect">
//               <Form.Label>Select Year</Form.Label>
//               <Form.Control
//                 as="select"
//                 value={selectedYear}
//                 onChange={handleYearChange}
//               >
//                 {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </Form.Control>
//             </Form.Group>
//             {permissions.create === 1 && (
//               <Button variant="primary" onClick={() => setShowModal(true)}>
//                 Create Holiday
//               </Button>
//             )}
//           </div>

//           {permissions.view === 1 ? ( // Only render the table if 'view' permission is 1
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Holiday Name</th>
//                   <th>Holiday Date</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredHolidays.map((holiday, index) => (
//                   <tr key={holiday.id}>
//                     <td>{index + 1}</td>
//                     <td>{holiday.holiday_name}</td>
//                     <td>{moment(holiday.holiday_date).format("DD/MM/YYYY")}</td>
//                     <td>
//                       <ActionButton
//                         editOnclick={() => handleEditHoliday(holiday)}
//                         deleteOnclick={() => handleOpenDeleteModal(holiday.id)}
//                         hideEdit={permissions.update === 0 ? "d-none" : ""}
//                         hideDelete={permissions.delete === 0 ? "d-none" : ""}
//                         hideEye={"d-none"} // Assuming no "view" button for now
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <p>No permission to view holidays.</p> // Display a message if no 'view' permission
//           )}
//         </Card.Body>
//       </Card>
//     </Col>
//   );
// };

// export default HolidayCalendar;


// import React, { useEffect, useState } from "react";
// import { Card, Col, Table, Spinner, Form, Button, Modal } from "react-bootstrap";
// import { getAllHolidayList, createHolidayList, updateHolidayList, deleteHolidayList, getAllModuleByRoleId } from "../../services/authapi";
// import moment from "moment";
// import ActionButton from "../../components/ActionButton";
// import { selectUser } from "../../features/auth/authSlice";
// import { useSelector } from "react-redux";

// const HolidayCalendar = () => {
//   const currentYear = new Date().getFullYear();
//   const [holidayDetails, setHolidayDetails] = useState([]);
//   const [filteredHolidays, setFilteredHolidays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [permissions, setPermissions] = useState({
//     create: 0,
//     update: 0,
//     delete: 0,
//     view: 1, // All users can view holidays by default
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [holidayName, setHolidayName] = useState("");
//   const [holidayDate, setHolidayDate] = useState("");
//   const [selectedHolidayId, setSelectedHolidayId] = useState(null);
//   const { user } = useSelector(selectUser);

//   // Fetch holiday data
//   const fetchHolidayData = async () => {
//     setLoading(true);
//     console.log("Fetching data for selected year:", selectedYear);
//     try {
//       const res = await getAllHolidayList("", "", "", selectedYear);
//       console.log("Holiday data response:", res); // Check the response
//       if (res.status && res.data.length > 0) {
//         setHolidayDetails(res.data);
//         setFilteredHolidays(res.data); // Show all holidays initially
//       } else {
//         setHolidayDetails([]);
//         setFilteredHolidays([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch holiday details:", error);
//       setHolidayDetails([]);
//       setFilteredHolidays([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch permissions for the "Holidays Calendar" module
//   const fetchPermissions = async () => {
//     try {
//       const userID = user.user_type; // Assuming user_type is what you use to fetch permissions
//       const res = await getAllModuleByRoleId(userID);
//       console.log("Permissions response:", res); // Check the permissions response
//       if (res.status && res.data.length > 0) {
//         const hrModule = res.data.find((module) => module.title === "HR Management");
//         console.log("hrModule.submodules", hrModule?.submodules);
//         if (hrModule && hrModule.submodules) {
//           const holidayCalendarSubmodule = hrModule.submodules.find(
//             (submodule) => submodule.title === "Holidays Calender" // Fixed title here
//           );
//           console.log("holidayCalendarSubmodule", holidayCalendarSubmodule);


//         if (holidayCalendarSubmodule) {
//           setPermissions({
//             create: holidayCalendarSubmodule.create,
//             update: holidayCalendarSubmodule.update,
//             delete: holidayCalendarSubmodule.delete,
//             view: 1, // Always allow viewing holidays
//           });
//         }
//       }
//     }
//     } catch (error) {
//     console.error("Failed to fetch permissions:", error);
//   }
// };

// useEffect(() => {
//   fetchHolidayData();
//   fetchPermissions(); // Fetch permissions on component load
// }, [selectedYear, user]); // Trigger fetch again when the user changes

// const handleYearChange = (event) => {
//   const year = event.target.value;
//   setSelectedYear(year);
// };

// const handleEditHoliday = (holiday) => {
//   setHolidayName(holiday.holiday_name);
//   setHolidayDate(moment(holiday.holiday_date).format("YYYY-MM-DD"));
//   setSelectedHolidayId(holiday.id);
//   setShowModal(true); // Open the modal for editing
// };

// const handleOpenDeleteModal = (holidayId) => {
//   setSelectedHolidayId(holidayId);
//   setShowDeleteModal(true); // Show the confirmation modal
// };

// const handleCreateHoliday = async () => {
//   try {
//     const res = await createHolidayList(holidayName, holidayDate);
//     if (res.status) {
//       fetchHolidayData(); // Refresh the list after adding a new holiday
//       setShowModal(false); // Close the modal
//       setHolidayName("");
//       setHolidayDate("");
//     } else {
//       console.error("Failed to create holiday:", res.message);
//     }
//   } catch (error) {
//     console.error("Error creating holiday:", error);
//   }
// };

// const handleUpdateHoliday = async () => {
//   try {
//     const res = await updateHolidayList(selectedHolidayId, holidayName, holidayDate);
//     if (res.status) {
//       fetchHolidayData(); // Refresh the list after updating the holiday
//       setShowModal(false); // Close the modal
//       setHolidayName("");
//       setHolidayDate("");
//       setSelectedHolidayId(null); // Reset selectedHolidayId
//     } else {
//       console.error("Failed to update holiday:", res.message);
//     }
//   } catch (error) {
//     console.error("Error updating holiday:", error);
//   }
// };

// const handleDeleteHoliday = async () => {
//   try {
//     const res = await deleteHolidayList(selectedHolidayId);
//     if (res.status) {
//       fetchHolidayData(); // Refresh the list after deleting the holiday
//       setShowDeleteModal(false); // Close the delete confirmation modal
//       setSelectedHolidayId(null); // Reset selectedHolidayId
//     } else {
//       console.error("Failed to delete holiday:", res.message);
//     }
//   } catch (error) {
//     console.error("Error deleting holiday:", error);
//   }
// };

// if (loading) {
//   return (
//     <Col md={12} className="d-flex justify-content-center">
//       <Spinner animation="border" />
//     </Col>
//   );
// }

// console.log("Permissions view:", permissions.view); // Check if the view permission is set correctly

// return (
//   <Col md={12}>
//     <Card className="h-100 shadow-lg shadow-slate-400">
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <Form.Group controlId="yearSelect">
//             <Form.Label>Select Year</Form.Label>
//             <Form.Control
//               as="select"
//               value={selectedYear}
//               onChange={handleYearChange}
//             >
//               {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </Form.Control>
//           </Form.Group>
//           {permissions.create === 1 && (
//             <Button variant="primary" onClick={() => setShowModal(true)}>
//               Create Holiday
//             </Button>
//           )}
//         </div>

//         {permissions.view === 1 ? (
//           <Table striped bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Holiday Name</th>
//                 <th>Holiday Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredHolidays.length > 0 ? (
//                 filteredHolidays.map((holiday, index) => (
//                   <tr key={holiday.id}>
//                     <td>{index + 1}</td>
//                     <td>{holiday.holiday_name}</td>
//                     <td>{moment(holiday.holiday_date).format("DD/MM/YYYY")}</td>
//                     <td>
//                       <ActionButton
//                         editOnclick={() => handleEditHoliday(holiday)}
//                         deleteOnclick={() => handleOpenDeleteModal(holiday.id)}
//                         hideEdit={permissions.update === 0 ? "d-none" : ""}
//                         hideDelete={permissions.delete === 0 ? "d-none" : ""}
//                         hideEye={"d-none"} // Assuming no "view" button for now
//                       />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center">
//                     No holidays available for the selected year.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         ) : (
//           <p>No permission to view holidays.</p>
//         )}
//       </Card.Body>
//     </Card>
//   </Col>
// );
// };

// export default HolidayCalendar;

import React, { useEffect, useState } from "react";
import { Card, Col, Table, Spinner, Form, Button, Modal } from "react-bootstrap";
import { getAllHolidayList, createHolidayList, updateHolidayList, deleteHolidayList, getAllModuleByRoleId } from "../../services/authapi";
import moment from "moment";
import ActionButton from "../../components/ActionButton";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";

const HolidayCalendar = () => {
  const currentYear = new Date().getFullYear();
  const [holidayDetails, setHolidayDetails] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [permissions, setPermissions] = useState({
    create: 0,
    update: 0,
    delete: 0,
    view: 1, // All users can view holidays by default
  });
  const { user } = useSelector(selectUser);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);

  // Fetch holiday data
  const fetchHolidayData = async () => {
    setLoading(true);
    console.log("Fetching data for selected year:", selectedYear);
    try {
      const res = await getAllHolidayList("", "", "", selectedYear);
      console.log("Holiday data response:", res); // Check the response
      if (res.status && res.data.length > 0) {
        setHolidayDetails(res.data);
        setFilteredHolidays(res.data); // Show all holidays initially
      } else {
        setHolidayDetails([]);
        setFilteredHolidays([]);
      }
    } catch (error) {
      console.error("Failed to fetch holiday details:", error);
      setHolidayDetails([]);
      setFilteredHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch permissions for the "Holidays Calendar" module
  const fetchPermissions = async () => {
    try {
      const userID = user.user_type; // Assuming user_type is what you use to fetch permissions
      const res = await getAllModuleByRoleId(userID);
      console.log("Permissions response:", res); // Check the permissions response
      if (res.status && res.data.length > 0) {
        const hrModule = res.data.find((module) => module.title === "HR Management");
        console.log("hrModule.submodules", hrModule?.submodules);
        if (hrModule && hrModule.submodules) {
          const holidayCalendarSubmodule = hrModule.submodules.find(
            (submodule) => submodule.title === "Holidays Calender" // Fixed title here
          );
          console.log("holidayCalendarSubmodule", holidayCalendarSubmodule);

          if (holidayCalendarSubmodule) {
            setPermissions({
              create: holidayCalendarSubmodule.create,
              update: holidayCalendarSubmodule.update,
              delete: holidayCalendarSubmodule.delete,
              view: 1, // Always allow viewing holidays
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  useEffect(() => {
    fetchHolidayData();
    fetchPermissions(); // Fetch permissions on component load
  }, [selectedYear, user]); // Trigger fetch again when the user changes

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
  };

  const handleEditHoliday = (holiday) => {
    setHolidayName(holiday.holiday_name);
    setHolidayDate(moment(holiday.holiday_date).format("YYYY-MM-DD"));
    setSelectedHolidayId(holiday.id);
    setShowModal(true); // Open the modal for editing
  };

  const handleOpenDeleteModal = (holidayId) => {
    setSelectedHolidayId(holidayId);
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const handleCreateHoliday = async () => {
    try {
      const res = await createHolidayList(holidayName, holidayDate);
      if (res.status) {
        fetchHolidayData(); // Refresh the list after adding a new holiday
        setShowModal(false); // Close the modal
        setHolidayName("");
        setHolidayDate("");
      } else {
        console.error("Failed to create holiday:", res.message);
      }
    } catch (error) {
      console.error("Error creating holiday:", error);
    }
  };

  const handleUpdateHoliday = async () => {
    try {
      const res = await updateHolidayList(selectedHolidayId, holidayName, holidayDate);
      if (res.status) {
        fetchHolidayData(); // Refresh the list after updating the holiday
        setShowModal(false); // Close the modal
        setHolidayName("");
        setHolidayDate("");
        setSelectedHolidayId(null); // Reset selectedHolidayId
      } else {
        console.error("Failed to update holiday:", res.message);
      }
    } catch (error) {
      console.error("Error updating holiday:", error);
    }
  };

  const handleDeleteHoliday = async () => {
    try {
      const res = await deleteHolidayList(selectedHolidayId);
      if (res.status) {
        fetchHolidayData(); // Refresh the list after deleting the holiday
        setShowDeleteModal(false); // Close the delete confirmation modal
        setSelectedHolidayId(null); // Reset selectedHolidayId
      } else {
        console.error("Failed to delete holiday:", res.message);
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  if (loading) {
    return (
      <Col md={12} className="d-flex justify-content-center">
        <Spinner animation="border" />
      </Col>
    );
  }

  console.log("Permissions view:", permissions.view); // Check if the view permission is set correctly

  return (

    <Col md={12}>
      <Card className="h-100 shadow-lg shadow-slate-400">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Group controlId="yearSelect">
              <Form.Label>Select Year</Form.Label>
              <Form.Control
                as="select"
                value={selectedYear}
                onChange={handleYearChange}
              >
                {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {permissions.create === 1 && (
              <Button
                variant="primary"
                style={{ backgroundColor: '#ff5733', borderColor: '#ff5733' }}
                onClick={() => setShowModal(true)}
              >
                Create Holiday
              </Button>
            )}
          </div>

          {permissions.view === 1 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Holiday Name</th>
                  <th>Holiday Date</th>
                  {(permissions.update === 1 || permissions.delete === 1) && (
                    <th>Action</th> // Only render "Action" column if either update or delete is allowed
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredHolidays.length > 0 ? (
                  filteredHolidays.map((holiday, index) => (
                    <tr key={holiday.id}>
                      <td>{index + 1}</td>
                      <td>{holiday.holiday_name}</td>
                      <td>{moment(holiday.holiday_date).format("DD/MM/YYYY")}</td>
                      {(permissions.update === 1 || permissions.delete === 1) && (
                        <td>
                          <ActionButton
                            editOnclick={() => handleEditHoliday(holiday)}
                            deleteOnclick={() => handleOpenDeleteModal(holiday.id)}
                            hideEdit={permissions.update === 0 ? "d-none" : ""}
                            hideDelete={permissions.delete === 0 ? "d-none" : ""}
                            hideEye={"d-none"} // Assuming no "view" button for now
                          />
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={permissions.update === 0 && permissions.delete === 0 ? "3" : "4"} className="text-center">
                      No holidays available for the selected year.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          ) : (
            <p>No permission to view holidays.</p>
          )}
        </Card.Body>
      </Card>

      {/* Create/Update Holiday Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedHolidayId ? 'Update Holiday' : 'Create Holiday'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="holidayName">
              <Form.Label>Holiday Name</Form.Label>
              <Form.Control
                type="text"
                value={holidayName}
                placeholder="Enter holiday name"
                onChange={(e) => setHolidayName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="holidayDate">
              <Form.Label>Holiday Date</Form.Label>
              <Form.Control
                type="date"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            style={{ backgroundColor: '#ff5733', borderColor: '#ff5733' }} // Custom style
            onClick={selectedHolidayId ? handleUpdateHoliday : handleCreateHoliday}
          >
            {selectedHolidayId ? 'Update Holiday' : 'Create Holiday'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Holiday Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this holiday?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteHoliday}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>

  );
};

export default HolidayCalendar;


