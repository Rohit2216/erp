// import React, { useEffect, useState } from "react";
// import { Card, Col, Container, Navbar, Offcanvas, Row } from "react-bootstrap";
// import { Outlet } from "react-router-dom";
// import JsFooter from "../Footer";
// import JsNavbar from "../Navbar";
// import Offcanvasjs from "../Offcanvas";
// import ThemeCustomizer from "../OffcanvasContent/ThemeCustomizer";
// import JsSidebar from "../Sidebar";
// import { BsGear } from "react-icons/bs";

// const Layout = () => {
//   const [showOpen, setShowOpen] = useState(false);

//   const mainLayout = [
//     {
//       id: 1,
//       col: 3,
//       colclassName: `my-sidebar ${showOpen && "w-0"}`,
//       cardclassName: "border-0 vh-100",
//       cardbodyclass: "p-0",
//       layoutName: (
//         <div className="position-relative">
//           <Navbar expand="lg" className="p-0 m-md-0 m-2">
//             <Navbar.Toggle aria-controls="iq-navbar" className="filter" />
//             <Navbar.Offcanvas
//               id="iq-navbar"
//               className="bg-glass filter-white"
//               aria-labelledby="offcanvasLabel-md"
//               placement="end"
//             >
//               <Offcanvas.Header
//                 closeButton
//                 className={`border-primary hr-border ${
//                   showOpen && "p-0"
//                 } justify-content-between d-inline-flex border-bottom nav-57 d-align`}
//               >
//                 <h3
//                   className={`fs-20 fw-bold text-secondary text-truncate ${
//                     showOpen ? "p-0" : "px-md-3"
//                   } mb-0`}
//                 >
//                 Labrys Solutions
//                 </h3>
//               </Offcanvas.Header>
//               <Offcanvas.Body className="d-block hr-border">
//                 <JsSidebar />
//               </Offcanvas.Body>
//             </Navbar.Offcanvas>
//           </Navbar>
//         </div>
//       ),
//     },
//     {
//       id: 2,
//       col: 9,
//       colclassName: "custom-col",
//       cardclassName: "bg-new main-section mx-4",
//       layoutName: (
//         <Col className="main-page pe-3">
//           <Row className="g-4">
//             <Outlet />
//           </Row>
//         </Col>
//       ),
//       navbar: <JsNavbar showOpen={showOpen} setShowOpen={setShowOpen} />,
//     },
//     {
//       id: 3,
//       col: 12,
//       colclassName: "position-absolute bottom-0 zIndex-1",
//       cardclassName: "bg-new mx-2",
//       layoutName: <JsFooter />,
//     },
//   ];

//   const [smShow, setSmShow] = useState();

//   const [color, setColor] = useState(localStorage.getItem("color"));
//   const changeBg = (themeColor) => {
//     localStorage.setItem("color", themeColor);
//     document.body.classList.remove("light");
//     document.body.classList.remove("dark");
//     document.body.classList.remove("semi-dark");
//     document.body.classList.add(themeColor);
//     setColor(themeColor);
//   };
//   useEffect(() => {
//     const color = localStorage.getItem("color");
//     document.body.classList.remove("light");
//     document.body.classList.remove("dark");
//     document.body.classList.remove("semi-dark");
//     setColor(color);
//     document.body.classList.add(color);
//   }, []);
//   return (
//     <>
//       <Container fluid className="px-0">
//         <Row className="g-0 position-relative flex-nowrap">
//           {mainLayout.map((layout, idx) => (
//             <Col key={idx} md={layout.col} className={layout.colclassName}>
//               {layout.navbar}
//               <Card className={layout.cardclassName}>
//                 <Card.Body className={layout.cardbodyclass}>
//                   {layout.layoutName}
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//       <div
//         data-aos={"fade-left"}
//         data-aos-delay={200}
//         onClick={() => setSmShow(true)}
//         className="position-fixed top-50 my-bg end-0 cursor-pointer p-2 rounded-start fs-5 d-align"
//       >
//         <BsGear className="App-logo" />
//       </div>
//       <Offcanvasjs
//         open={smShow}
//         title={"Theme Customizer"}
//         close={() => setSmShow(false)}
//       >
//         <ThemeCustomizer changeBg={changeBg} checked={color} />
//       </Offcanvasjs>
//     </>
//   );
// };

// export default Layout;

import React, { useEffect, useState } from "react";
import { Card, Col, Container, Navbar, Offcanvas, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import JsFooter from "../Footer";
import JsNavbar from "../Navbar";
import Offcanvasjs from "../Offcanvas";
import ThemeCustomizer from "../OffcanvasContent/ThemeCustomizer";
import JsSidebar from "../Sidebar";
import { BsGear } from "react-icons/bs";

const Layout = () => {
  const [showOpen, setShowOpen] = useState(false);

  const mainLayout = [
    {
      id: 1,
      col: 3,
      colclassName: `my-sidebar ${showOpen && "w-0"}`,
      cardclassName: "border-0 vh-100",
      cardbodyclass: "p-0",
      layoutName: (
        <div className="position-relative">
          <Navbar expand="lg" className="p-0 m-md-0 m-2">
            <Navbar.Toggle aria-controls="iq-navbar" className="filter" />
            <Navbar.Offcanvas
              id="iq-navbar"
              className="bg-glass filter-white"
              aria-labelledby="offcanvasLabel-md"
              placement="end"
            >
              <Offcanvas.Header
                closeButton
                className={`border-primary hr-border ${
                  showOpen && "p-0"
                } justify-content-between d-inline-flex border-bottom nav-57 d-align`}
              >
                <h6
                  className={`flex fs-8 fw-bold text-secondary text-truncate ${
                    showOpen ? "p-0" : "px-md-4"
                  } mb-0`}
                >
                 Pacific Technoproducts
                 <h6 className={`flex fs-8 fw-bold text-secondary text-truncate ${
                    showOpen ? "p-0" : "px-md-4"
                  } mb-0`}>India Pvt. Ltd.</h6>
                </h6>
              </Offcanvas.Header>
              <Offcanvas.Body className="d-block hr-border">
                <JsSidebar />
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Navbar>
        </div>
      ),
    },
    {
      id: 2,
      col: 9,
      colclassName: "custom-col",
      cardclassName: "bg-new main-section mx-4",
      layoutName: (
        <Col className="main-page pe-3">
          <Row className="g-4">
            <Outlet />
          </Row>
        </Col>
      ),
      navbar: <JsNavbar showOpen={showOpen} setShowOpen={setShowOpen} />,
    },
    {
      id: 3,
      col: 12,
      colclassName: "position-absolute bottom-0 zIndex-1",
      cardclassName: "bg-new mx-2",
      layoutName: <JsFooter />,
    },
  ];

  const [smShow, setSmShow] = useState();

  // Initialize color with default 'light' if not found in localStorage
  const [color, setColor] = useState(localStorage.getItem("color") || "light");

  const changeBg = (themeColor) => {
    localStorage.setItem("color", themeColor);
    document.body.classList.remove("light");
    document.body.classList.remove("dark");
    document.body.classList.remove("semi-dark");
    document.body.classList.add(themeColor);
    setColor(themeColor);
  };

  useEffect(() => {
    const storedColor = localStorage.getItem("color") || "light"; // Default to 'light'
    document.body.classList.remove("light", "dark", "semi-dark");
    document.body.classList.add(storedColor);
    setColor(storedColor);
  }, []);

  return (
    <>
      <Container fluid className="px-0">
        <Row className="g-0 position-relative flex-nowrap">
          {mainLayout.map((layout, idx) => (
            <Col key={idx} md={layout.col} className={layout.colclassName}>
              {layout.navbar}
              <Card className={layout.cardclassName}>
                <Card.Body className={layout.cardbodyclass}>
                  {layout.layoutName}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <div
        data-aos={"fade-left"}
        data-aos-delay={200}
        onClick={() => setSmShow(true)}
        className="position-fixed top-50 my-bg end-0 cursor-pointer p-2 rounded-start fs-5 d-align"
      >
        <BsGear className="App-logo" />
      </div>
      <Offcanvasjs
        open={smShow}
        title={"Theme Customizer"}
        close={() => setSmShow(false)}
      >
        <ThemeCustomizer changeBg={changeBg} checked={color} />
      </Offcanvasjs>
    </>
  );
};

export default Layout;
