import React, { useState } from 'react';
import PhoneModal from '../components/Modals/PhoneModal';
import AddressModal from '../components/Modals/AddressModal';


const ClientContact = (props) => {

    const [isPhoneModelOpened, setPhoneModelOpened] = useState(false);
    const [isAddressModelOpened, setAddressModelOpened] = useState(false);
    const client = props.client;

    return (
        <>
            {
                isPhoneModelOpened && <PhoneModal phones={(client && client.phones) || []} isOpened={isPhoneModelOpened}
                    setOpened={setPhoneModelOpened} />
            }
            {
                isAddressModelOpened && <AddressModal address={client.address} isOpened={isAddressModelOpened}
                    setOpened={setAddressModelOpened} />
            }
            <div className="d-flex flex-column" style={{ minWidth: "100px" }}>
                <span className="text-center mb-2" style={{ borderBottom: '1px solid #ccc' }}>{client.name}</span>
                <div className="clientData d-flex justify-content-around">
                    <div className="icon-sm icon-shape bg-success text-white rounded-circle shadow" style={{ cursor: 'pointer' }}
                        onClick={() => setPhoneModelOpened(true)}>
                        <i className="fa fa-phone fa-rotate-90"></i>
                    </div>
                    <div className="icon-sm icon-shape bg-primary text-white rounded-circle shadow" style={{ cursor: 'pointer' }}
                        onClick={() => setAddressModelOpened(true)}>
                        <i className="fa fa-address-book"></i>
                    </div>
                </div>
            </div>
        </>
    );
}


export default ClientContact;