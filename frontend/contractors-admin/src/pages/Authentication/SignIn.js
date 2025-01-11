// import { Formik } from "formik";
// import React, { useState } from "react";
// import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
// import { Helmet } from "react-helmet";
// import { BsEye, BsEyeSlash, BsShieldLockFill } from "react-icons/bs";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import Switch from "../../components/Switch";
// import { login } from "../../features/auth/authSlice";
// import { adminLogin } from "../../services/authapi";
// import { loginSchema } from "../../utils/formSchema";

// const SignIn = () => {
//   const dispatch = useDispatch();
//   const [passwordShown, setPasswordShown] = useState(false);
//   const [checked, setChecked] = useState(false);
//   const togglePassword = () => {
//     setPasswordShown(!passwordShown);
//   };

//   const handleSubmit = async (values) => {
//     // const res = checked && await adminLogin(values);
//     const res = await adminLogin(values);
//     if (res.status) {
//       localStorage.setItem("cms-ca-token", res.token);
//       dispatch(login(res.data));
//       toast.success(res.message);
//     } else {
//       toast.error(res.message);
//     }
//   };

//   return (
//     <section className="overflow-hidden login">
//       <Helmet>
//         <title>Sign In · CMS Electricals</title>
//       </Helmet>
//       <div className="w-100">
//         <Formik
//           initialValues={{
//             email: "contractor1@gmail.com",
//             password: "12345678",
//           }}
//           validationSchema={loginSchema}
//           onSubmit={handleSubmit}
//         >
//           {(props) => (
//             <Form onSubmit={props.handleSubmit}>
//               <Row className="g-0 vh-100 overflow-hidden">
//                 <Col md={6} className="bg-img d-none d-md-block">
//                   <div className="login-text text-white">
//                     <h1 className="mb-3 text-shadow-1">
//                       Welcome labrys solutions
//                     </h1>
//                     <p>
//                       Lorem Ipsum is simply dummy text of the printing and
//                       typesetting industry. Lorem Ipsum has been the industry's
//                       standard dummy text ever since the 1500s, when an unknown
//                       printer took a galley of type and.
//                     </p>
//                   </div>
//                 </Col>
//                 <Col
//                   md={6}
//                   data-aos="flip-left"
//                   data-aos-easing="ease-out-cubic"
//                   data-aos-duration="1000"
//                 >
//                   <div className="bg-blue h-100 p-80 d-align">
//                     <Row className="g-4 w-75 shadow py-3 px-2">
//                       <h3 className="fs-20 mt-0 mb-4 fw-bold">
//                         <span className="pb-3 text-secondary hr-border2">
//                           Log In
//                         </span>
//                       </h3>
//                       <Form.Group>
//                         <Form.Label>Email Address</Form.Label>
//                         <Form.Control
//                           type="email"
//                           name={"email"}
//                           value={props.values.email}
//                           onChange={props.handleChange}
//                           onBlur={props.handleBlur}
//                           isInvalid={Boolean(
//                             props.touched.email && props.errors.email
//                           )}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {props.errors.email}
//                         </Form.Control.Feedback>
//                       </Form.Group>
//                       <Form.Group>
//                         <Form.Label>Enter Password</Form.Label>
//                         <span className="position-relative pass">
//                           <Form.Control
//                             type={passwordShown ? "text" : "password"}
//                             name={"password"}
//                             value={props.values.password}
//                             onChange={props.handleChange}
//                             onBlur={props.handleBlur}
//                             isInvalid={Boolean(
//                               props.touched.password && props.errors.password
//                             )}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {props.errors.password}
//                           </Form.Control.Feedback>
//                           <span
//                             className="float-end text-gray cursor-pointer pass-icon"
//                             onClick={togglePassword}
//                           >
//                             {passwordShown ? <BsEye /> : <BsEyeSlash />}
//                           </span>
//                         </span>
//                       </Form.Group>
//                       {/* <Form.Group className="d-flex justify-content-between mb-3">
//                         <Switch onClick={() => setChecked(!checked)} checked={checked} idFor='rem' title={"Remember Me"} />
//                         <Link to='/ForgetPassword' className='nav-link text-secondary'>Forget Password</Link>
//                       </Form.Group> */}
//                       <Form.Group>
//                         <Button
//                           disabled={props.isSubmitting}
//                           type="Submit"
//                           className="btn-shadow rounded-1 bg-secondary border-0 w-100 d-align gap-2"
//                         >
//                           {props.isSubmitting ? (
//                             <>
//                               <Spinner
//                                 animation="border"
//                                 variant="light"
//                                 size="sm"
//                               />{" "}
//                               PLEASE WAIT...
//                             </>
//                           ) : (
//                             <>
//                               <BsShieldLockFill /> LOG IN
//                             </>
//                           )}
//                         </Button>
//                       </Form.Group>
//                     </Row>
//                   </div>
//                 </Col>
//               </Row>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </section>
//   );
// };

// export default SignIn;



import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsEye, BsEyeSlash, BsShieldLockFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../features/auth/authSlice";
import { adminLogin } from "../../services/authapi";
import { loginSchema } from "../../utils/formSchema";

// const SignIn = () => {
//   const dispatch = useDispatch();
//   const [passwordShown, setPasswordShown] = useState(false);
//   const [location, setLocation] = useState({ latitude: null, longitude: null });

//   const togglePassword = () => setPasswordShown(!passwordShown);

//   // Geolocation fetch function
//   const fetchLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           toast.error("Failed to retrieve location. Please enable location services.");
//           console.error("Geolocation error:", error);
//         }
//       );
//     } else {
//       toast.error("Geolocation is not supported by your browser.");
//     }
//   };

//   React.useEffect(() => {
//     fetchLocation(); // Fetch location when component loads
//   }, []);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const loginData = {
//         ...values,
//         location, // Add geolocation data to the login payload
//       };

//       const res = await adminLogin(loginData); // Call login API
//       if (res.status) {
//         localStorage.setItem("cms-ca-token", res.token);
//         dispatch(login(res.data));
//         toast.success(res.message);
//       } else {
//         toast.error(res.message);
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <section className="overflow-hidden login">
//       <Helmet>
//         <title>Sign In · Labrys solutinos</title>
//       </Helmet>
//       <div className="w-100">
//         <Formik
//           initialValues={{
//             email: "",
//             password: "",
//           }}
//           validationSchema={loginSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, errors, handleChange, handleBlur, handleSubmit, touched, isSubmitting }) => (
//             <Form onSubmit={handleSubmit}>
//               <Row className="g-0 vh-100 overflow-hidden">
//                 <Col md={6} className="bg-img d-none d-md-block">
//                   <div className="login-text text-white">
//                     <h1 className="mb-3 text-shadow-1">Welcome to Labrys Solutions</h1>
//                     <p>
//                     An HRMS (Human Resource Management System) is a software solution that streamlines and automates HR processes such as recruitment, payroll, performance management, and employee data management.
//                     </p>
//                   </div>
//                 </Col>
//                 <Col md={6} data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="1000">
//                   <div className="bg-blue h-100 p-80 d-align">
//                     <Row className="g-4 w-75 shadow py-3 px-2">
//                       <h3 className="fs-20 mt-0 mb-4 fw-bold">
//                         <span className="pb-3 text-secondary hr-border2">Log In</span>
//                       </h3>
//                       <Form.Group>
//                         <Form.Label>Email Address</Form.Label>
//                         <Form.Control
//                           type="email"
//                           name="email"
//                           value={values.email}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           isInvalid={Boolean(touched.email && errors.email)}
//                         />
//                         <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
//                       </Form.Group>
//                       <Form.Group>
//                         <Form.Label>Enter Password</Form.Label>
//                         <span className="position-relative pass">
//                           <Form.Control
//                             type={passwordShown ? "text" : "password"}
//                             name="password"
//                             value={values.password}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={Boolean(touched.password && errors.password)}
//                           />
//                           <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
//                           <span
//                             className="float-end text-gray cursor-pointer pass-icon"
//                             onClick={togglePassword}
//                           >
//                             {passwordShown ? <BsEye /> : <BsEyeSlash />}
//                           </span>
//                         </span>
//                       </Form.Group>
//                       <Form.Group>
//                         <Button
//                           disabled={isSubmitting}
//                           type="Submit"
//                           className="btn-shadow rounded-1 bg-secondary border-0 w-100 d-align gap-2"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <Spinner animation="border" variant="light" size="sm" /> PLEASE WAIT...
//                             </>
//                           ) : (
//                             <>
//                               <BsShieldLockFill /> LOG IN
//                             </>
//                           )}
//                         </Button>
//                       </Form.Group>
//                     </Row>
//                   </div>
//                 </Col>
//               </Row>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </section>
//   );
// };

// const SignIn = () => {
//   const dispatch = useDispatch();
//   const [passwordShown, setPasswordShown] = useState(false);
//   const [location, setLocation] = useState({ latitude: null, longitude: null });

//   const togglePassword = () => setPasswordShown(!passwordShown);

//   // Geolocation fetch function
//   const fetchLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           toast.error("Failed to retrieve location. Please enable location services.");
//           console.error("Geolocation error:", error);
//         }
//       );
//     } else {
//       toast.error("Geolocation is not supported by your browser.");
//     }
//   };

//   React.useEffect(() => {
//     fetchLocation(); // Fetch location when component loads
//   }, []);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const loginData = {
//         ...values,
//         location, // Add geolocation data to the login payload
//       };

//       const res = await adminLogin(loginData); // Call login API
//       if (res.status) {
//         localStorage.setItem("cms-ca-token", res.token);
//         dispatch(login(res.data));
//         toast.success(res.message);
//       } else {
//         toast.error(res.message);
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <section className="overflow-hidden login">
//       <Helmet>
//         <title>Sign In · Labrys solutinos</title>
//       </Helmet>
//       <div className="w-100">
//         <Formik
//           initialValues={{
//             email: "",
//             password: "",
//           }}
//           validationSchema={loginSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, errors, handleChange, handleBlur, handleSubmit, touched, isSubmitting }) => (
//             <Form onSubmit={handleSubmit}>
//               <Row className="g-0 vh-100 overflow-hidden">
//                 <Col md={6} className="bg-img d-none d-md-block">
//                   <div className="login-text text-white">
//                     <h1 className="mb-3 text-shadow-1" style={{ color: 'white' }}>
//                       Welcome to Pacific Technoproducts India Pvt. Ltd.
//                     </h1>
//                     <p>
//                       An HRMS (Human Resource Management System) is a software solution that streamlines and automates HR processes such as recruitment, payroll, performance management, and employee data management.
//                     </p>
//                   </div>
//                 </Col>
//                 <Col md={6} data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="1000">
//                   <div className="bg-blue h-100 p-80 d-align">
//                     <Row className="g-4 w-75 shadow py-3 px-2">
//                       <h3 className="fs-20 mt-0 mb-4 fw-bold">
//                         <span className="pb-3 text-secondary hr-border2">Log In</span>
//                       </h3>
//                       <Form.Group>
//                         <Form.Label>Email Address</Form.Label>
//                         <Form.Control
//                           type="email"
//                           name="email"
//                           value={values.email}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           isInvalid={Boolean(touched.email && errors.email)}
//                         />
//                         <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
//                       </Form.Group>
//                       <Form.Group>
//                         <Form.Label>Enter Password</Form.Label>
//                         <span className="position-relative pass">
//                           <Form.Control
//                             type={passwordShown ? "text" : "password"}
//                             name="password"
//                             value={values.password}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={Boolean(touched.password && errors.password)}
//                           />
//                           <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
//                           <span
//                             className="float-end text-gray cursor-pointer pass-icon"
//                             onClick={togglePassword}
//                           >
//                             {passwordShown ? <BsEye /> : <BsEyeSlash />}
//                           </span>
//                         </span>
//                       </Form.Group>
//                       <Form.Group>
//                         <Button
//                           disabled={isSubmitting}
//                           type="Submit"
//                           className="btn-shadow rounded-1 bg-secondary border-0 w-100 d-align gap-2"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <Spinner animation="border" variant="light" size="sm" /> PLEASE WAIT...
//                             </>
//                           ) : (
//                             <>
//                               <BsShieldLockFill /> LOG IN
//                             </>
//                           )}
//                         </Button>
//                       </Form.Group>
//                     </Row>
//                   </div>
//                 </Col>
//               </Row>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </section>
//   );
// };



const SignIn = () => {
  const dispatch = useDispatch();
  const [passwordShown, setPasswordShown] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const togglePassword = () => setPasswordShown(!passwordShown);

  // Geolocation fetch function
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          toast.error("Failed to retrieve location. Please enable location services.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  React.useEffect(() => {
    fetchLocation(); // Fetch location when component loads
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const loginData = {
        ...values,
        location, // Add geolocation data to the login payload
      };

      const res = await adminLogin(loginData); // Call login API
      if (res.status) {
        localStorage.setItem("cms-ca-token", res.token);
        dispatch(login(res.data));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden login">
      <Helmet>
        <title>Sign In · Pacific Technoproducts India Pvt. Ltd.</title>
      </Helmet>
      <div className="w-100">
        <Formik
          initialValues={{
            emailOrMobile: "", // Changed field name
            password: "",
          }}
          validationSchema={loginSchema} // Update schema below
          onSubmit={handleSubmit}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit, touched, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row className="g-0 vh-100 overflow-hidden">
                <Col md={6} className="bg-img d-none d-md-block">
                  <div className="login-text text-white">
                    <h1 className="mb-3 text-shadow-1" style={{ color: 'white' }}>
                      Welcome to Pacific Technoproducts India Pvt. Ltd.
                    </h1>

                    <p>
                      An HRMS (Human Resource Management System) is a software solution that streamlines and automates HR processes such as recruitment, payroll, performance management, and employee data management.
                    </p>
                  </div>
                </Col>
                <Col
                  md={6}
                  data-aos="flip-left"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="1000"
                >
                  <div className="bg-blue h-100 p-80 d-align">
                    <Row className="g-4 w-75 shadow py-3 px-2">
                      <h3 className="fs-20 mt-0 mb-4 fw-bold">
                        <span className="pb-3 text-secondary hr-border2">Log In</span>
                      </h3>
                      <Form.Group>
                        <Form.Label>Email or Mobile</Form.Label> {/* Updated label */}
                        <Form.Control
                          type="text" // Changed type to text to allow mobile numbers
                          name="emailOrMobile"
                          placeholder="Enter your email or mobile"
                          value={values.emailOrMobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={Boolean(touched.emailOrMobile && errors.emailOrMobile)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.emailOrMobile}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Enter Password</Form.Label>
                        <span className="position-relative pass">
                          <Form.Control
                            type={passwordShown ? "text" : "password"}
                            placeholder="Enter your password here... "

                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={Boolean(touched.password && errors.password)}
                          />
                          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                          <span
                            className="float-end text-gray cursor-pointer pass-icon"
                            onClick={togglePassword}
                          >
                            {passwordShown ? <BsEye /> : <BsEyeSlash />}
                          </span>
                        </span>
                      </Form.Group>
                      <Form.Group>
                        <Button
                          disabled={isSubmitting}
                          type="Submit"
                          className="btn-shadow rounded-1 bg-secondary border-0 w-100 d-align gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Spinner animation="border" variant="light" size="sm" /> PLEASE WAIT...
                            </>
                          ) : (
                            <>
                              <BsShieldLockFill /> LOG IN
                            </>
                          )}
                        </Button>
                      </Form.Group>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

// const SignIn = () => {
//   const dispatch = useDispatch();
//   const [passwordShown, setPasswordShown] = useState(false);
//   const [location, setLocation] = useState({ latitude: null, longitude: null });

//   const togglePassword = () => setPasswordShown(!passwordShown);

//   // Function to generate or retrieve UUID
//   const getOrCreateUUID = () => {
//     const uuidKey = `device_uuid`;
//     let deviceUUID = localStorage.getItem(uuidKey);
//     if (!deviceUUID) {
//         deviceUUID = crypto.randomUUID(); // Generate a new UUID
//         localStorage.setItem(uuidKey, deviceUUID); // Save to local storage
//     }
//     return deviceUUID;
// };


//   // Fetch geolocation
//   const fetchLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           toast.error("Failed to retrieve location. Please enable location services.");
//           console.error("Geolocation error:", error);
//         }
//       );
//     } else {
//       toast.error("Geolocation is not supported by your browser.");
//     }
//   };

//   React.useEffect(() => {
//     fetchLocation(); // Fetch location when component loads
//   }, []);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const deviceUUID = getOrCreateUUID(); // Get the UUID from local storage or generate it

//       const loginData = {
//         ...values,
//         location, // Add geolocation data to the login payload
//         device_uuid: deviceUUID, // Include UUID in the login payload
//       };

//       const res = await adminLogin(loginData); // Call login API
//       if (res.status) {
//         localStorage.setItem("cms-ca-token", res.token); // Save the token
//         dispatch(login(res.data));
//         toast.success(res.message);
//       } else {
//         toast.error(res.message);
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <section className="overflow-hidden login">
//       <Helmet>
//         <title>Sign In · Labrys Solutions</title>
//       </Helmet>
//       <div className="w-100">
//         <Formik
//           initialValues={{
//             emailOrMobile: "", // Changed field name
//             password: "",
//           }}
//           validationSchema={loginSchema} // Update schema below
//           onSubmit={handleSubmit}
//         >
//           {({ values, errors, handleChange, handleBlur, handleSubmit, touched, isSubmitting }) => (
//             <Form onSubmit={handleSubmit}>
//               <Row className="g-0 vh-100 overflow-hidden">
//                 <Col md={6} className="bg-img d-none d-md-block">
//                   <div className="login-text text-white">
//                     <h1 className="mb-3 text-shadow-1">Welcome to Labrys Solutions</h1>
//                     <p>
//                       An HRMS (Human Resource Management System) is a software solution that streamlines and automates HR processes such as recruitment, payroll, performance management, and employee data management.
//                     </p>
//                   </div>
//                 </Col>
//                 <Col
//                   md={6}
//                   data-aos="flip-left"
//                   data-aos-easing="ease-out-cubic"
//                   data-aos-duration="1000"
//                 >
//                   <div className="bg-blue h-100 p-80 d-align">
//                     <Row className="g-4 w-75 shadow py-3 px-2">
//                       <h3 className="fs-20 mt-0 mb-4 fw-bold">
//                         <span className="pb-3 text-secondary hr-border2">Log In</span>
//                       </h3>
//                       <Form.Group>
//                         <Form.Label>Email or Mobile</Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="emailOrMobile"
//                           placeholder="Enter your email or mobile"
//                           value={values.emailOrMobile}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           isInvalid={Boolean(touched.emailOrMobile && errors.emailOrMobile)}
//                         />
//                         <Form.Control.Feedback type="invalid">{errors.emailOrMobile}</Form.Control.Feedback>
//                       </Form.Group>
//                       <Form.Group>
//                         <Form.Label>Enter Password</Form.Label>
//                         <span className="position-relative pass">
//                           <Form.Control
//                             type={passwordShown ? "text" : "password"}
//                             name="password"
//                             placeholder="Enter your email or mobile"
//                             value={values.password}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={Boolean(touched.password && errors.password)}
//                           />
//                           <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
//                           <span
//                             className="float-end text-gray cursor-pointer pass-icon"
//                             onClick={togglePassword}
//                           >
//                             {passwordShown ? <BsEye /> : <BsEyeSlash />}
//                           </span>
//                         </span>
//                       </Form.Group>
//                       <Form.Group>
//                         <Button
//                           disabled={isSubmitting}
//                           type="Submit"
//                           className="btn-shadow rounded-1 bg-secondary border-0 w-100 d-align gap-2"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <Spinner animation="border" variant="light" size="sm" /> PLEASE WAIT...
//                             </>
//                           ) : (
//                             <>
//                               <BsShieldLockFill /> LOG IN
//                             </>
//                           )}
//                         </Button>
//                       </Form.Group>
//                     </Row>
//                   </div>
//                 </Col>
//               </Row>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </section>
//   );
// };


export default SignIn;
