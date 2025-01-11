import React, { useState, useEffect } from "react";
import { Card, Col, Container, Navbar, Offcanvas, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import JsFooter from "../Footer";
import JsNavbar from "../Navbar";
import Offcanvasjs from "../Offcanvas";
import ThemeCustomizer from "../OffcanvasContent/ThemeCustomizer";
import JsSidebar from "../Sidebar";
import { BsGear } from "react-icons/bs";

const Layout = () => {
  const mainLayout = [
    {
      id: 1,
      col: 3,
      colclassName: "my-sidebar",
      cardclassName: "border-0 vh-100",
      cardbodyclass: "p-0",
      layoutName: (
        <div className="position-relative">
          <Navbar expand="lg" className="p-0 m-md-0 m-2">
            <Navbar.Toggle aria-controls="iq-navbar" className="filter" />
            <Navbar.Offcanvas
              id="iq-navbar"
              className="bg-glass side-offcanvas filter-white"
              aria-labelledby="offcanvasLabel-md"
              placement="end"
            >
              <Offcanvas.Header
                closeButton
                className="border-primary px-2 hr-border justify-content-between d-inline-flex border-bottom nav-57 d-align"
              >
                <span className="fs-6 fw-bold text-secondary text-truncate px-md-3 mb-0">
                Pacific Technoproducts India Pvt. Ltd.
                </span>
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
      navbar: <JsNavbar />,
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

  const [color, setColor] = useState(localStorage.getItem("color"));
  const changeBg = (themeColor) => {
    localStorage.setItem("color", themeColor);
    document.body.classList.remove("light");
    document.body.classList.remove("dark");
    document.body.classList.remove("semi-dark");
    document.body.classList.add(themeColor);
    setColor(themeColor);
  };
  useEffect(() => {
    const color = localStorage.getItem("color");
    document.body.classList.remove("light");
    document.body.classList.remove("dark");
    document.body.classList.remove("semi-dark");
    setColor(color);
    document.body.classList.add(color);
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
