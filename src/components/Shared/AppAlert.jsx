import React, { useState } from 'react';
import { Alert } from "reactstrap";


const AppAlert = (props) => {
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);


    return (
        <>
            <Alert color="danger" style={{ marginTop: "20px", textAlign: 'center' }} fade={true} isOpen={visible}>
                <i style={{ position: 'absolute', top: 5, right: 5, cursor: 'pointer' }} className="fas fa-window-close" onClick={() => onDismiss()}></i>
                <span>{props.message}</span>
            </Alert>
        </>
    )
}

export default AppAlert;