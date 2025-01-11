import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { BsDownload, BsXLg } from "react-icons/bs";

const ImageViewer = ({ children, src, downloadIcon, href, size }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <span onClick={setShow} className="cursor-pointer">
        {children}
      </span>
      <Modal
        size={size}
        contentClassName={"border-0 rounded-1"}
        scrollable={true}
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        centered
      >
        <Modal.Header className="success-combo border-0">
          <Modal.Title>
            <img
              src={src}
              // className="img-fluid"
              style={{
                objectFit: "fill",
                height: "470px",
                width: "100%",
                // maxWidth: "100%",
              }}
            />
          </Modal.Title>
        </Modal.Header>
        {/* <div className='position-absolute top-50 end-0 translate-middle-y shadow-sm cursor-pointer rounded-start bg-white py-2 fs-6 px-3'><BsDownload /></div> */}
        <div className="position-absolute top-50 end-0 translate-middle-y shadow-sm cursor-pointer rounded-start bg-white py-2 fs-6 px-3">
          <BsXLg className="text-danger" onClick={() => setShow(false)} />{" "}
          {downloadIcon && (
            <a target="_blank" href={href} download>
              <BsDownload className="text-green" />
            </a>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ImageViewer;
