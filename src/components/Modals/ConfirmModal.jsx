import React from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";

const ConfirmModal = (props) => {
    return (
        <Modal isOpen={props.isOpened} toggle={() => props.setOpened(false)}>
            <ModalHeader toggle={() => props.setOpened(false)}>Warning!</ModalHeader>
            <ModalBody>
                {props.message}
            </ModalBody>
            <ModalFooter>
                { props.acceptanceComponent || <Button color="primary" onClick={props.onConfirmation}>{props.acceptanceText}</Button>}
                <Button color="secondary" onClick={() => props.setOpened(false)}>{props.rejectionText}</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ConfirmModal;