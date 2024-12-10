import React from "react";
import { Modal } from "react-bootstrap";

const ModalComponent = ({ title, show, handleClose, children, footerButtons = [] }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {footerButtons.map((button, index) => (
          <button
            key={index}
            className={`btn ${button.className}`}
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
