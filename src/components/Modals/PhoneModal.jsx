import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";


export const PhoneModal = (props) => {
    return (
        <Modal isOpen={props.isOpened} style={{ textAlign: 'center' }} toggle={() => props.setOpened(false)}>
            <ModalHeader toggle={() => props.setOpened(false)}></ModalHeader>
            <ModalBody >
                <div className="phone-list">
                    <ul>
                        {props.phones.map((phone, i) => (<li key={i}>{phone}</li>))}
                    </ul>
                </div>
            </ModalBody>
        </Modal >
    )
}


export default PhoneModal;
