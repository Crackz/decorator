import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const AddressModal = (props) => {
  return (
    <Modal isOpen={props.isOpened} style={{ textAlign: 'center' }} toggle={() => props.setOpened(false)}>
      <ModalHeader toggle={() => props.setOpened(false)}></ModalHeader>
      <ModalBody >
        <p>
          {props.address}
        </p>
      </ModalBody>
    </Modal >
  )
}

export default AddressModal;