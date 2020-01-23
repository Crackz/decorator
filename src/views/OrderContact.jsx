import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';


const OrderContact = (props) => {
    return (
        <div className="d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between flex-wrap m-3 font-weight-bold">
                <span style={{ fontSize: '20px' }}>{props.client && props.client.name}</span>
                <Link className="mt-2"
                    to={`/dashboard/clients/${props.client && props.client._id}/profile`}>
                    <Button outline size="sm">View Details</Button>
                </Link>
            </div>
            <div style={{ borderBottom: '1px dotted black' }} className="mx-2"></div>
            <div className="mx-2 my-3">
                <h5 style={{ alignSelf: 'flex-start' }}>Phones: </h5>
                <div className="d-flex flex-column justify-content-center align-items-center" >
                    {props.client && props.client.phones.map((phone, i) => (
                        <div key={i} className="my-1">
                            <div className="icon-sm icon-shape bg-green text-white rounded-circle shadow mr-2">
                                <li className="fa fa-phone fa-rotate-90" ></li>
                            </div>
                            <span>{phone}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ borderBottom: '1px dotted black' }} className="mx-2"></div>
            <div className="mx-2 my-3">
                <h5>Address: </h5>
                <p className="text-center">{props.client && props.client.address}</p>
            </div>
        </div>
    )
}

export default OrderContact;