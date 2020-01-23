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
            <div style={{ display: "flex", flexDirection: 'column', minWidth: "100px" }}>
                <span style={{ borderBottom: '1px solid #ccc', marginBottom: 10, textAlign: 'center' }}>{client.name}</span>
                <div className="clientData" style={{ display: 'flex', justifyContent: "space-between" }}>
                    <div className="icon-sm icon-shape bg-green text-white rounded-circle shadow" style={{ cursor: 'pointer' }}
                        onClick={() => setPhoneModelOpened(true)}>
                        <i className="fa fa-phone fa-rotate-90"></i>
                    </div>
                    <div className="icon-sm icon-shape bg-blue text-white rounded-circle shadow" style={{ cursor: 'pointer' }}
                        onClick={() => setAddressModelOpened(true)}>
                        <i className="fa fa-address-book"></i>
                    </div>
                </div>
            </div>
        </>
    );
}


export default ClientContact;