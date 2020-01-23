
import Axios from 'axios';
import React, { useState } from 'react';
import { Badge, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import ConfirmModal from '../components/Modals/ConfirmModal';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';
import { getOrderStatusColor, statusMappings } from './ClientOrder';


const OrderDetailsHeader = (props) => {
    const [isDeletingOrderModelOpened, setDeletingOrderModelOpened] = useState(false);
    const [isChangeStatusModelOpened, setChangeStatusModelOpened] = useState(false);
    const [isUpdatingStatus, setUpdatingStatus] = useState(false);

    const getNextStatus = () => {
        switch (props.order.status) {
            case 'PENDING':
                return 'WORK_IN_PROGRESS'
            case 'WORK_IN_PROGRESS':
                return 'FINISHED'
            default:
                return 'FINISHED';
        }
    }

    const getStatusChangerButtonText = () => {
        switch (props.order.status) {
            case 'PENDING':
                return `قم بتحويل الحالة الي ${statusMappings[getNextStatus()]}`
            case 'WORK_IN_PROGRESS':
                return `قم بتحويل الحالة الي ${statusMappings[getNextStatus()]}`;
            default:
                return '';
        }
    }

    const getStatusChangerButtonColor = () => {
        switch (props.order.status) {
            case 'PENDING':
                return getOrderStatusColor(getNextStatus())
            case 'WORK_IN_PROGRESS':
                return getOrderStatusColor(getNextStatus())
            default:
                return '';
        }
    }

    const onStatusChangeHandler = async () => {
        setUpdatingStatus(true);
        try {
            const formData = new FormData();
            formData.append('status', getNextStatus());

            const res = await Axios({
                method: 'patch',
                data: formData,
                url: `${process.env.REACT_APP_API_URL}/clients/${props.order.client._id}/orders/${props.order._id}`,
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
            });

            props.onOrderStatusChanged(res.data.status);
        } catch (error) {
            alert(error);
        }

        setUpdatingStatus(false);
        setChangeStatusModelOpened(false)
    }

    return (
        <>
            {
                isDeletingOrderModelOpened && <ConfirmModal setOpened={setDeletingOrderModelOpened} isOpened={isDeletingOrderModelOpened}
                    message={`Are you sure deleting "${props.order._id}" ?`}
                    acceptanceComponent={
                        <Button color="primary" onClick={props.onDeletingOrderHandler}>
                            {props.isLoading ? <LoadingSpinner fontSize={18} /> : "yes"}
                        </Button>
                    }
                    rejectionText="no"
                />
            }
            {
                isChangeStatusModelOpened && <ConfirmModal setOpened={setChangeStatusModelOpened} isOpened={isChangeStatusModelOpened}
                    message={`هل انت متاكد من تحويل الحالة الى ${statusMappings[getNextStatus()]} ?`}
                    acceptanceComponent={
                        <Button color="primary" onClick={onStatusChangeHandler}>
                            {isUpdatingStatus ? <LoadingSpinner fontSize={18} /> : "نعم"}
                        </Button>
                    }
                    rejectionText="لا"
                />
            }

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h3>Order #{props.order._id}</h3>
                    <span>
                        <Badge color={getOrderStatusColor(props.order.status)} pill>{statusMappings[props.order.status]}</Badge>
                    </span>
                </div>
                <div className="d-flex align-items-center justify-content-center mr-2">
                    {
                        props.order.status !== 'FINISHED' &&
                        <div className="mr-3">
                            <Button color={getStatusChangerButtonColor()} outline onClick={() => setChangeStatusModelOpened(true)}>
                                {getStatusChangerButtonText()}
                                </Button>
                        </div>
                    }
                    <UncontrolledDropdown>
                        <DropdownToggle tag="span" style={{ cursor: 'pointer' }}>
                            <i className="fas fa-ellipsis-h"></i>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={() => setDeletingOrderModelOpened(true)}>
                                <div className="d-flex justify-content-center align-items-center">
                                    <i style={{ color: '#f5365c' }} className="fas fa-trash-alt mr-2"></i>
                                    <span>Delete</span>
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </div>
        </>
    )

}


export default OrderDetailsHeader;