// import React, { useEffect, useState } from "react";
// import { Card, Col, Table, Spinner, Form, Button, Modal } from "react-bootstrap";
// import {
//   getpreciseLocationById,
//   addPreciseLocation,
//   updatePreciseLocation,
//   deletePreciseLocation,
// } from "../../services/authapi";
// import ActionButton from "../../components/ActionButton";

// const PreciseLocation = () => {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedLocationId, setSelectedLocationId] = useState(null);
//   const [locationName, setLocationName] = useState("");
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [radius, setRadius] = useState("");
//   const [assignLeave, setAssignLeave] = useState("");

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   const fetchLocations = async () => {
//     setLoading(true);
//     try {
//       const response = await getpreciseLocationById();
//       if (Array.isArray(response.data)) {
//         setLocations(response.data);
//       } else {
//         console.error("Unexpected response format:", response.data);
//       }

//     } catch (error) {
//       console.error("Error fetching locations:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateOrUpdateLocation = async () => {
//     const locationData = { name: locationName, latitude, longitude, radius, assign_leave: assignLeave };
//     try {
//       if (selectedLocationId) {
//         await updatePreciseLocation(selectedLocationId, locationData);
//       } else {
//         await addPreciseLocation(locationData);
//       }
//       fetchLocations();
//       setShowModal(false);
//       resetForm();
//     } catch (error) {
//       console.error(selectedLocationId ? "Error updating location:" : "Error creating location:", error);
//     }
//   };

//   const handleEditLocation = (location) => {
//     setSelectedLocationId(location.id);
//     setLocationName(location.name);
//     setLatitude(location.latitude);
//     setLongitude(location.longitude);
//     setRadius(location.radius);
//     setAssignLeave(location.assign_leave || "");
//     setShowModal(true);
//   };

//   const handleOpenDeleteModal = (id) => {
//     setSelectedLocationId(id);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteLocation = async () => {
//     try {
//       await deletePreciseLocation(selectedLocationId);
//       fetchLocations();
//       setShowDeleteModal(false);
//     } catch (error) {
//       console.error("Error deleting location:", error);
//     }
//   };

//   const resetForm = () => {
//     setSelectedLocationId(null);
//     setLocationName("");
//     setLatitude("");
//     setLongitude("");
//     setRadius("");
//     setAssignLeave("");
//   };

//   return (
//     <Col md={12}>
//       <Card className="h-100 shadow-lg">
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5>Precise Locations & Assign leave criteria</h5>
//             <Button
//               variant="primary"
//               onClick={() => {
//                 resetForm();
//                 setShowModal(true);
//               }}
//             >
//               Create Location
//             </Button>
//           </div>

//           {loading ? (
//             <Spinner animation="border" />
//           ) : (
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Location Name</th>
//                   <th>Latitude</th>
//                   <th>Longitude</th>
//                   <th>Radius</th>
//                   <th>Assigned Leave</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {locations.length > 0 ? (
//                   locations.map((location, index) => (
//                     <tr key={location.id}>
//                       <td>{index + 1}</td>
//                       <td>{location.name}</td>
//                       <td>{location.latitude}</td>
//                       <td>{location.longitude}</td>
//                       <td>{location.radius}</td>
//                       <td>{location.assign_leave || "N/A"}</td>
//                       <td>
//                         <ActionButton
//                           editOnclick={() => handleEditLocation(location)}
//                           deleteOnclick={() => handleOpenDeleteModal(location.id)}
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       No locations found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Create/Update Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedLocationId ? "Update Location" : "Create Location"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="locationName">
//               <Form.Label>Location Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={locationName}
//                 onChange={(e) => setLocationName(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="latitude">
//               <Form.Label>Latitude</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={latitude}
//                 onChange={(e) => setLatitude(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="longitude">
//               <Form.Label>Longitude</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={longitude}
//                 onChange={(e) => setLongitude(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="radius">
//               <Form.Label>Radius</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={radius}
//                 onChange={(e) => setRadius(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="assignLeave">
//               <Form.Label>Assigned Leave</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={assignLeave}
//                 onChange={(e) => setAssignLeave(e.target.value)}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleCreateOrUpdateLocation}>
//             {selectedLocationId ? "Update Location" : "Create Location"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Delete Location</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Are you sure you want to delete this location?</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Close
//           </Button>
//           <Button variant="danger" onClick={handleDeleteLocation}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Col>
//   );
// };

// export default PreciseLocation;


// import React, { useEffect, useState } from "react";
// import { Card, Col, Table, Spinner, Form, Button, Modal } from "react-bootstrap";
// import { toast } from "react-toastify";
// import {
//     getpreciseLocationById,
//     addPreciseLocation,
//     updatePreciseLocation,
//     deletePreciseLocation,
// } from "../../services/authapi";
// import ActionButton from "../../components/ActionButton";

// const PreciseLocation = () => {
//     const [locations, setLocations] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [selectedLocationId, setSelectedLocationId] = useState(null);
//     const [locationName, setLocationName] = useState("");
//     const [latitude, setLatitude] = useState("");
//     const [longitude, setLongitude] = useState("");
//     const [radius, setRadius] = useState("");
//     const [assignLeave, setAssignLeave] = useState("");

//     useEffect(() => {
//         fetchLocations();
//     }, []);

//     const fetchLocations = async () => {
//         setLoading(true);
//         try {
//             const response = await getpreciseLocationById();
//             if (Array.isArray(response.data)) {
//                 setLocations(response.data);
//             } else {
//                 console.error("Unexpected response format:", response.data);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch locations. Please try again later.");
//             console.error("Error fetching locations:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCreateOrUpdateLocation = async () => {
//         const locationData = { name: locationName, latitude, longitude, radius, assign_leave: assignLeave };
//         try {
//             if (selectedLocationId) {
//                 await updatePreciseLocation(selectedLocationId, locationData);
//                 toast.success("Location updated successfully!");
//             } else {
//                 await addPreciseLocation(locationData);
//                 toast.success("Location created successfully!");
//             }
//             fetchLocations();
//             setShowModal(false);
//             resetForm();
//         } catch (error) {
//             toast.error(selectedLocationId ? "Failed to update location." : "Failed to create location.");
//             console.error(selectedLocationId ? "Error updating location:" : "Error creating location:", error);
//         }
//     };

//     const handleEditLocation = (location) => {
//         setSelectedLocationId(location.id);
//         setLocationName(location.name);
//         setLatitude(location.latitude);
//         setLongitude(location.longitude);
//         setRadius(location.radius);
//         setAssignLeave(location.assign_leave || "");
//         setShowModal(true);
//     };

//     const handleOpenDeleteModal = (id) => {
//         setSelectedLocationId(id);
//         setShowDeleteModal(true);
//     };

//     const handleDeleteLocation = async () => {
//         try {
//             await deletePreciseLocation(selectedLocationId);
//             toast.success("Location deleted successfully!");
//             fetchLocations();
//             setShowDeleteModal(true);
//         } catch (error) {
//             toast.error("Failed to delete location. Please try again.");
//             console.error("Error deleting location:", error);
//         }
//     };

//     const resetForm = () => {
//         setSelectedLocationId(null);
//         setLocationName("");
//         setLatitude("");
//         setLongitude("");
//         setRadius("");
//         setAssignLeave("");
//     };

//     return (
//         <Col md={12}>
//             <Card className="h-100 shadow-lg">
//                 <Card.Body>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h5>Precise Locations & Assign leave criteria</h5>
//                         <Button
//                             style={{ backgroundColor: "#ff5733", borderColor: "#ff5733" }} // Orange button styling
//                             onClick={() => {
//                                 resetForm();
//                                 setShowModal(true);
//                             }}
//                         >
//                             Create Location
//                         </Button>

//                     </div>

//                     {loading ? (
//                         <Spinner animation="border" />
//                     ) : (
//                         <Table striped bordered hover responsive>
//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Location Name</th>
//                                     <th>Latitude</th>
//                                     <th>Longitude</th>
//                                     <th>Radius</th>
//                                     <th>Assigned Leave</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {locations.length > 0 ? (
//                                     locations.map((location, index) => (
//                                         <tr key={location.id}>
//                                             <td>{index + 1}</td>
//                                             <td>{location.name}</td>
//                                             <td>{location.latitude}</td>
//                                             <td>{location.longitude}</td>
//                                             <td>{location.radius}</td>
//                                             <td>{location.assign_leave || "N/A"}</td>
//                                             <td>
//                                                 <ActionButton
//                                                     hideEye={"d-none"}
//                                                     editOnclick={() => handleEditLocation(location)}
//                                                     deleteOnclick={() => handleOpenDeleteModal(location.id)}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="7" className="text-center">
//                                             No locations found.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </Table>
//                     )}
//                 </Card.Body>
//             </Card>

//             {/* Create/Update Modal */}
//             <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>{selectedLocationId ? "Update Location" : "Create Location"}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group controlId="locationName">
//                             <Form.Label>Location Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 value={locationName}
//                                 onChange={(e) => setLocationName(e.target.value)}
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="latitude">
//                             <Form.Label>Latitude</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 value={latitude}
//                                 onChange={(e) => setLatitude(e.target.value)}
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="longitude">
//                             <Form.Label>Longitude</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 value={longitude}
//                                 onChange={(e) => setLongitude(e.target.value)}
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="radius">
//                             <Form.Label>Radius</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 value={radius}
//                                 onChange={(e) => setRadius(e.target.value)}
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="assignLeave">
//                             <Form.Label>Assigned Leave</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 value={assignLeave}
//                                 onChange={(e) => setAssignLeave(e.target.value)}
//                             />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Close
//                     </Button>
//                     <Button
//                         variant="primary"
//                         style={{ backgroundColor: "#ff5733", borderColor: "#ff5733" }} // Orange button styling
//                         onClick={handleCreateOrUpdateLocation}
//                     >
//                         {selectedLocationId ? "Update Location" : "Create Location"}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             {/* Delete Confirmation Modal */}
//             <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Delete Location</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <p>Are you sure you want to delete this location?</p>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//                         Close
//                     </Button>
//                     <Button variant="danger" onClick={handleDeleteLocation}>
//                         Delete
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Col>
//     );
// };

// export default PreciseLocation;


import React, { useEffect, useState } from "react";
import { Col, Table, Spinner, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
    getpreciseLocationById,
    addPreciseLocation,
    updatePreciseLocation,
    deletePreciseLocation,
    getAllModuleByRoleId,
} from "../../services/authapi";
import Modaljs from "../../components/Modal"; // Assuming this is your custom modal component
import ActionButton from "../../components/ActionButton";
import moment from "moment";
import { BsLightningCharge, BsCalendarDate, BsPlus } from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
const PreciseLocation = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assignShow, setAssignShow] = useState(false);
    const [detailShow, setDetailShow] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [permissions, setPermissions] = useState({
    create: 0,
    update: 0,
    delete: 0,
    view: 1, // All users can view holidays by default
  });
    const { user } = useSelector(selectUser);
   

    // Handler to close the modal
    const handleCloseModal = () => setShowModal(false);

   
    
    const [formData, setFormData] = useState({
        name: "",
        latitude: "",
        longitude: "",
        radius: "",
        assign_leave: "",
    });

    useEffect(() => {
        fetchLocations();
        fetchPermissions();
    }, []);




    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await getpreciseLocationById();
            if (Array.isArray(response.data)) {
                setLocations(response.data);
            } else {
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    };

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
                (submodule) => submodule.title === "Precise Locations" // Fixed title here
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

    const handleSaveLocation = async () => {
        try {
            if (selectedLocation.id) {
                await updatePreciseLocation(selectedLocation.id, formData);
                toast.success("Location updated successfully!");
            } else {
                await addPreciseLocation(formData);
                toast.success("Location created successfully!");
            }
            fetchLocations();
            setAssignShow(false);
        } catch (error) {
            console.error("Error saving location:", error);
            toast.error("Failed to save location.");
        }
    };

    const handleViewDetails = (location) => {
        setSelectedLocation(location);
        setDetailShow(true);
    };

    const handleEditLocation = (location) => {
        setFormData({
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
            radius: location.radius,
            assign_leave: location.assign_leave || "",
        });
        setSelectedLocation(location);
        setAssignShow(true);
    };
    const handleDeleteModalOpen = (location) => {
        setSelectedLocation(location); // Store the location to delete
        setShowModal(true); // Open the delete modal
      };
      
    const handleDeleteLocation = async (id) => {
        
        try {
            await deletePreciseLocation(id);
            toast.success("Location deleted successfully!");

            fetchLocations();
        } catch (error) {
            console.error("Error deleting location:", error);
            toast.error("Failed to delete location.");
        }
    };

    return (
        <Col md={12} data-aos="fade-up" data-aos-delay={200}>
            {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Precise Locations</h5>
                <Button
                    style={{ backgroundColor: "#ff5733", borderColor: "#ff5733" }}
                    onClick={() => {
                        setFormData({
                            name: "",
                            latitude: "",
                            longitude: "",
                            radius: "",
                            assign_leave: "",
                        });
                        setAssignShow(true);
                    }}
                >
                    <BsPlus /> Create
                </Button>
            </div> */}
            <div className="d-flex justify-content-between align-items-center mb-3">
  <h5>Precise Locations</h5>
  {permissions.create === 1 && (
    <Button
      style={{ backgroundColor: "#ff5733", borderColor: "#ff5733" }}
      onClick={() => {
        setFormData({
          name: "",
          latitude: "",
          longitude: "",
          radius: "",
          assign_leave: "",
        });
        setAssignShow(true);
      }}
    >
      <BsPlus /> Create
    </Button>
  )}
</div>

            {loading ? (
                <Spinner animation="border" />
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Location Name</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Radius</th>
                            <th>Assigned Leave</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.length > 0 ? (
                            locations.map((location, index) => (
                                <tr key={location.id}>
                                    <td>{index + 1}</td>
                                    <td>{location.name}</td>
                                    <td>{location.latitude}</td>
                                    <td>{location.longitude}</td>
                                    <td>{location.radius}</td>
                                    <td>{location.assign_leave || "N/A"}</td>
                                    <td>
                                        <ActionButton
                                        hideEye={"d-none"}
                                        hideEdit={permissions.update === 0 ? "d-none" : ""}
                                        hideDelete={permissions.delete === 0 ? "d-none" : ""}
                                            editOnclick={() => handleEditLocation(location)}
                                            deleteOnclick={() => handleDeleteModalOpen(location.id)}
                                            // deleteOnclick={setShowModal(true)}
                                            viewOnclick={() => handleViewDetails(location)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No locations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

<Modaljs
  open={assignShow}
  size="md"
  closebtn="Cancel"
  close={() => setAssignShow(false)}
  title={selectedLocation.id ? "Update Location" : "Create Location"}
  Savebtn={selectedLocation.id ? "Update" : "Create"}
  saveOnclick={handleSaveLocation} // Call the same function for save
>
  <form>
    <div className="form-group">
      <label>Location Name</label>
      <input
        type="text"
        className="form-control"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
    </div>
    <div className="form-group">
      <label>Latitude</label>
      <input
        type="number"
        className="form-control"
        value={formData.latitude}
        onChange={(e) =>
          setFormData({ ...formData, latitude: e.target.value })
        }
      />
    </div>
    <div className="form-group">
      <label>Longitude</label>
      <input
        type="number"
        className="form-control"
        value={formData.longitude}
        onChange={(e) =>
          setFormData({ ...formData, longitude: e.target.value })
        }
      />
    </div>
    <div className="form-group">
      <label>Radius</label>
      <input
        type="number"
        className="form-control"
        value={formData.radius}
        onChange={(e) =>
          setFormData({ ...formData, radius: e.target.value })
        }
      />
    </div>
    <div className="form-group">
      <label>Assigned Leave</label>
      <input
        type="number"
        className="form-control"
        value={formData.assign_leave}
        onChange={(e) =>
          setFormData({ ...formData, assign_leave: e.target.value })
        }
      />
    </div>
  </form>
</Modaljs>


            {/* View Details Modal */}
            <Modaljs
                open={detailShow}
                size="md"
                closebtn="Cancel"
                hideFooter="d-none"
                close={() => setDetailShow(false)}
                title="View Details"
            >
                <div className="shadow m-2 after-bg-light">
                    <div className="d-align h-100 p-3 gap-5 justify-content-start">
                        <div className="my-bg p-2 rounded-circle">
                            <img
                                className="border-blue object-fit rounded-circle"
                                height={100}
                                width={100}
                                src={
                                    selectedLocation.image
                                        ? `${process.env.REACT_APP_API_URL}${selectedLocation.image}`
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                                alt={selectedLocation.name}
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <p className="mb-0 fw-bold">{selectedLocation.name}</p>
                            <small className="text-gray">
                                Latitude: {selectedLocation.latitude}
                            </small>
                            <small className="text-gray">
                                Longitude: {selectedLocation.longitude}
                            </small>
                            <small className="text-gray">
                                Radius: {selectedLocation.radius} meters
                            </small>
                            <small className="text-gray">
                                Assigned Leave: {selectedLocation.assign_leave || "N/A"}
                            </small>
                            <small className="text-gray">
                                Created At:{" "}
                                {selectedLocation.created_at
                                    ? moment(selectedLocation.created_at).format("DD/MM/YYYY")
                                    : "N/A"}
                            </small>
                        </div>
                    </div>
                </div>
            </Modaljs>

            {/* delete modals */}
            {/* Delete Confirmation Modal */}
      <Modaljs
        open={showModal}
        close={handleCloseModal}
        title="Delete Location"
        closebtn="Cancel"
        Savebtn="Delete"
        saveOnclick={handleDeleteLocation}
        footerClass="justify-content-center"
      >
        <p>
          Are you sure you want to delete the location{" "}
          <strong>{selectedLocation?.name}</strong>? This action cannot be
          undone.
        </p>
      </Modaljs>
        </Col>
    );
};

export default PreciseLocation;

// import React, { useEffect, useState } from "react";
// import { Col, Table, Spinner, Button } from "react-bootstrap";
// import { toast } from "react-toastify";
// import {
//   getpreciseLocationById,
//   addPreciseLocation,
//   updatePreciseLocation,
//   deletePreciseLocation,
// } from "../../services/authapi";
// import Modaljs from "../../components/Modal"; // Assuming this is your custom modal component
// import ActionButton from "../../components/ActionButton";
// import moment from "moment";
// import { BsPlus } from "react-icons/bs";

// const PreciseLocation = () => {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [assignShow, setAssignShow] = useState(false);
//   const [detailShow, setDetailShow] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     latitude: "",
//     longitude: "",
//     radius: "",
//     assign_leave: "",
//   });

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   const fetchLocations = async () => {
//     setLoading(true);
//     try {
//       const response = await getpreciseLocationById();
//       setLocations(response.data || []);
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveLocation = async () => {
//     try {
//       if (selectedLocation?.id) {
//         await updatePreciseLocation(selectedLocation.id, formData);
//         toast.success("Location updated successfully!");
//       } else {
//         await addPreciseLocation(formData);
//         toast.success("Location created successfully!");
//       }
//       fetchLocations();
//       setAssignShow(false);
//     } catch (error) {
//       console.error("Error saving location:", error);
//       toast.error("Failed to save location.");
//     }
//   };

//   const handleViewDetails = (location) => {
//     setSelectedLocation(location);
//     setDetailShow(true);
//   };

//   const handleEditLocation = (location) => {
//     setFormData({
//       name: location.name,
//       latitude: location.latitude,
//       longitude: location.longitude,
//       radius: location.radius,
//       assign_leave: location.assign_leave || "",
//     });
//     setSelectedLocation(location);
//     setAssignShow(true);
//   };

//   const handleDeleteModalOpen = (location) => {
//     setSelectedLocation(location);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedLocation(null);
//     setShowModal(false);
//   };

//   const handleDeleteLocation = async () => {
//     if (!selectedLocation) return;

//     try {
//       await deletePreciseLocation(selectedLocation.id);
//       toast.success("Location deleted successfully!");
//       fetchLocations();
//     } catch (error) {
//       console.error("Error deleting location:", error);
//       toast.error("Failed to delete location.");
//     } finally {
//       handleCloseModal();
//     }
//   };

//   return (
//     <Col md={12} data-aos="fade-up" data-aos-delay={200}>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5>Precise Locations</h5>
//         <Button
//           style={{ backgroundColor: "#ff5733", borderColor: "#ff5733" }}
//           onClick={() => {
//             setFormData({
//               name: "",
//               latitude: "",
//               longitude: "",
//               radius: "",
//               assign_leave: "",
//             });
//             setAssignShow(true);
//           }}
//         >
//           <BsPlus /> Create Location
//         </Button>
//       </div>

//       {loading ? (
//         <Spinner animation="border" />
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Location Name</th>
//               <th>Latitude</th>
//               <th>Longitude</th>
//               <th>Radius</th>
//               <th>Assigned Leave</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {locations.length > 0 ? (
//               locations.map((location, index) => (
//                 <tr key={location.id}>
//                   <td>{index + 1}</td>
//                   <td>{location.name}</td>
//                   <td>{location.latitude}</td>
//                   <td>{location.longitude}</td>
//                   <td>{location.radius}</td>
//                   <td>{location.assign_leave || "N/A"}</td>
//                   <td>
//                     <ActionButton
//                       editOnclick={() => handleEditLocation(location)}
//                       deleteOnclick={() => handleDeleteModalOpen(location)}
//                       viewOnclick={() => handleViewDetails(location)}
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center">
//                   No locations found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       {/* Create/Update Modal */}
//       <Modaljs
//         open={assignShow}
//         size="md"
//         closebtn="Cancel"
//         close={() => setAssignShow(false)}
//         title={selectedLocation?.id ? "Update Location" : "Create Location"}
//       >
//         <form>
//           <div className="form-group">
//             <label>Location Name</label>
//             <input
//               type="text"
//               className="form-control"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//           </div>
//           <div className="form-group">
//             <label>Latitude</label>
//             <input
//               type="number"
//               className="form-control"
//               value={formData.latitude}
//               onChange={(e) =>
//                 setFormData({ ...formData, latitude: e.target.value })
//               }
//             />
//           </div>
//           <div className="form-group">
//             <label>Longitude</label>
//             <input
//               type="number"
//               className="form-control"
//               value={formData.longitude}
//               onChange={(e) =>
//                 setFormData({ ...formData, longitude: e.target.value })
//               }
//             />
//           </div>
//           <div className="form-group">
//             <label>Radius</label>
//             <input
//               type="number"
//               className="form-control"
//               value={formData.radius}
//               onChange={(e) =>
//                 setFormData({ ...formData, radius: e.target.value })
//               }
//             />
//           </div>
//           <div className="form-group">
//             <label>Assigned Leave</label>
//             <input
//               type="number"
//               className="form-control"
//               value={formData.assign_leave}
//               onChange={(e) =>
//                 setFormData({ ...formData, assign_leave: e.target.value })
//               }
//             />
//           </div>
//           <Button
//             variant="primary"
//             style={{ backgroundColor: "#ff5733", borderColor: "#ff5733" }}
//             onClick={handleSaveLocation}
//           >
//             {selectedLocation?.id ? "Update" : "Create"}
//           </Button>
//         </form>
//       </Modaljs>

      
//     </Col>
//   );
// };

// export default PreciseLocation;
