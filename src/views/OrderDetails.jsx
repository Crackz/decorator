import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Prompt, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';
import { generateId } from '../utils/generator';
import OrderContact from './OrderContact';
import OrderDetailsHeader from './OrderDetailsHeader';
import OrderNotes from './OrderNotes';
import OrderProduct from './OrderProduct';
import OrderProgressImgs from './OrderProgressImgs';

const OrderDetails = (props) => {

    const [order, setOrder] = useState({});
    const { clientId, orderId } = useParams();
    const [isFetchingOrder, setFetchingOrder] = useState(false);
    const [isActiveOrderRequest, setActiveOrderRequest] = useState(false);
    const [overlayText, setOverlayText] = useState('');
    const [notes, setNotes] = useState('');
    const [progressImages, setProgressImages] = useState(null);
    const [products, setProducts] = useState(null);
    const [allowSync, setAllowSync] = useState(false);

    const orderProductsRef = React.createRef();

    const fetchOrderData = async () => {
        setFetchingOrder(true)
        try {
            const res = await Axios({
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/clients/${clientId}/orders/${orderId}`,
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
            });

            setOrder(res.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404)
                    return props.history.push('/dashboard/404');
            }
            alert(error);
        }

        setFetchingOrder(false);
    }


    useEffect(() => {
        props.setNavbarOpts({ text: 'Order Details' });
        fetchOrderData();
    }, []);

    useEffect(() => {
        if (Object.keys(order).length > 0) {
            setNotes(order.notes);
            setProgressImages(order.progressImgs.map((progressImgUrl) => ({
                original: progressImgUrl,
                thumbnail: progressImgUrl,
                id: generateId()
            })));
            setProducts(order.products)
        }
    }, [order])

    const onDeletingOrderHandler = async () => {
        setOverlayText('Deleting Order...');
        setAllowSync(false)
        setActiveOrderRequest(true);
        try {
            await Axios({
                method: 'delete',
                url: `${process.env.REACT_APP_API_URL}/clients/${clientId}/orders/${orderId}`,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            return props.history.push(`/dashboard/clients/${clientId}/profile`);
        } catch (error) {
            alert(error);
        }

        setAllowSync(true);
        setActiveOrderRequest(false);
    }


    const syncOrderHandler = async () => {
        if (!isActiveOrderRequest) {
            setActiveOrderRequest(true);
            setOverlayText('Gathering Data...');
            const products = orderProductsRef.current.validateAndGetAllProducts()
            if (products) {
                const formData = new FormData();
                formData.append('products', JSON.stringify(products));

                console.log('progressImages found: ', progressImages);
                if (progressImages.length === 0)
                    formData.append('progressImgs', "[]");
                else
                    progressImages.forEach((progressImg) => {
                        if (progressImg.uploadableData) {
                            formData.append('progressImgs', progressImg.uploadableData);
                        } else {
                            formData.append('progressImgs', progressImg.original);
                        }
                    });

                if (notes)
                    formData.append('notes', notes);

                setOverlayText('Updating Data...');

                try {
                    const res = await Axios({
                        method: 'patch',
                        url: `${process.env.REACT_APP_API_URL}/clients/${clientId}/orders/${orderId}`,
                        data: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            "Authorization": `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    setAllowSync(false);
                    setOrder(res.data);
                } catch (error) {
                    alert(error);
                }
            }

            setActiveOrderRequest(false);

        }
    }

    const updateNotes = (updatedNotes) => {
        setAllowSync(true);
        setNotes(updatedNotes);
    }
    const updateProgressImgs = (updatedProgressImgs) => {
        setAllowSync(true);
        setProgressImages(updatedProgressImgs);
    }

    const onProductChange = () => {
        setAllowSync(true);
    }


    const onOrderStatusChanged = (newStatus) => {
        setOrder({ ...order, status: newStatus });
    }

    if (isFetchingOrder)
        return (
            <div className="d-flex flex-grow-1 bg-white align-items-center justify-content-center">
                <div>
                    <LoadingSpinner fontSize={32} />
                </div>
            </div>
        )

    return (

        <LoadingOverlay active={isActiveOrderRequest} text={overlayText}>

            <Prompt
                when={allowSync}
                message='لديك بعض التعديلات التي لم تقم بحفظها. هل تريد المتابعة؟'
            />

            <div className="d-flex flex-grow-1 bg-white">
                <div className="d-flex flex-grow-1 flex-column my-4 mx-4">
                    <OrderDetailsHeader order={order} 
                    onDeletingOrderHandler={onDeletingOrderHandler} 
                    isLoading={isActiveOrderRequest} 
                    onOrderStatusChanged={onOrderStatusChanged}
                    />

                    <div className="d-flex flex-grow-1 flex-column">
                        <div className="d-flex flex-grow-1 my-3 flex-wrap">
                            <div style={{ flex: 2, maxWidth: "70%" }} className="mr-2">
                                <div>
                                    <OrderProduct products={products} onProductChange={onProductChange}
                                        ref={orderProductsRef} createdAt={order.createdAt} updatedAt={order.updatedAt} />
                                </div>

                                <div>
                                    <OrderProgressImgs progressImages={progressImages} setProgressImages={updateProgressImgs} />
                                </div>
                            </div>
                            <div style={{ flex: 1 }} >
                                <div style={{ minWidth: '30%' }}>
                                    <div className="order-sm-2 shadow-lg rounded">
                                        <OrderContact client={order.client} />
                                    </div>

                                    <div className="shadow-lg rounded mt-4">
                                        <OrderNotes notes={notes} setNotes={updateNotes} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    allowSync &&
                    <div id="orderSyncBtn"
                        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
                        onClick={syncOrderHandler}
                    >
                        <i className={`fas fa-sync-alt ${isActiveOrderRequest ? 'fa-spin' : ''}`}></i>
                    </div>
                }
            </div>
        </LoadingOverlay>
    )
}


export default OrderDetails;
