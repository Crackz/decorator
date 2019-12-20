import { UncontrolledAlert } from "reactstrap";
import React from 'react';


const AppAlert = (props) => {
    return (
        <>
            <UncontrolledAlert style={{ marginTop: "20px", textAlign: 'center' }} color="danger">
                {props.message}
            </UncontrolledAlert>
        </>
    )
}

export default AppAlert;