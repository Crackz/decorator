import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const PhotoModal = (props) => {
    console.log('IMG SRC: ', props.imgSrc);
    return (
        <Modal isOpen={props.isOpened} style={{ textAlign: 'center' }} toggle={() => props.setOpened(false)}>
            <ModalHeader toggle={() => props.setOpened(false)}></ModalHeader>
            <ModalBody >
                <div>
                    <img alt="..." src={props.imgSrc} width='100%' height='100%' />
                </div>
            </ModalBody>
        </Modal >
    )
}

export default PhotoModal;