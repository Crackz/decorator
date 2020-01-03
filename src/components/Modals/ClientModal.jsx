import React, { useEffect, useState } from 'react';
import useForm from 'react-hook-form';
import { Button, Form, FormFeedback, FormGroup, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { LoadingSpinner } from '../Shared/LoadingSpinner';
import Axios from 'axios';
import AppAlert from '../Shared/AppAlert';
import { cleanObject, generateId } from '../../utils';

const ClientModal = (props) => {

    const { handleSubmit, register, errors } = useForm({
        defaultValues: props.existingClient || {}
    });
    const [phones, setPhones] = useState([]);
    const [isFetching, setFetching] = useState(false);
    const [apiErrors, setApiErrors] = useState(null);

    const onSubmit = async (values, e) => {
        setFetching(true);
        values = cleanObject(values);
        try {
            if (props.existingClient)
                return await onUpdatingSubmit(values, e);
            else
                return await onCreatingSubmit(values, e);
        } catch (error) {
            let apiErrors = [];

            if (error && error.response)
                apiErrors = apiErrors.concat(error.response.data.error.errors);
            else
                apiErrors.push({ message: 'تاكد من الانترنت وحاول مرة اخري', param: 'tryAgain' });

            setApiErrors(apiErrors);
        }

        setFetching(false);
    }

    const onUpdatingSubmit = async (values, e) => {
        const res = await Axios({
            method: 'patch',
            url: `${process.env.REACT_APP_API_URL}/clients/${props.existingClient._id}`,
            data: values,
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
        });
        props.setOpen(false);
        e.target.reset();
        props.updatedClientHandler(res.data)
    }


    const onCreatingSubmit = async (values, e) => {
        const res = await Axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/clients`,
            data: values,
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
        });
        props.setOpen(false);
        e.target.reset();
        props.addNewClient(res.data)
    };


    const onCreateNewPhoneHandler = () => {
        setPhones([...phones, { id: generateId() }])
    }

    const onRemovePhoneHandler = ({ id }) => {
        const filteredPhones = phones.filter((el) => el.id !== id);
        setPhones(filteredPhones)
    }

    useEffect(() => {
        const isExistingPhones = props.existingClient && props.existingClient.phones && props.existingClient.phones.length > 0
        setPhones(isExistingPhones ? props.existingClient.phones.map(() => ({ id: generateId() })) : [{ id: generateId() }])
    }, [props.existingClient && props.existingClient.phones]);

    const renderSubmitButton = () => {
        const buttonText = props.existingClient ? 'Update' : 'Create';

        return (
            <Button color="primary" type="submit" onClick={onsubmit}>
                {isFetching ? <LoadingSpinner fontSize={18} /> : buttonText}
            </Button>
        )
    }

    return (
        <Modal isOpen={props.isOpenModel} style={{ textAlign: 'center' }}>
            <ModalHeader toggle={() => props.setOpen(false)}>Create New Client</ModalHeader>
            <Form role="form" onSubmit={handleSubmit(onSubmit)}>
                <ModalBody style={{ display: 'flex', flexDirection: 'column' }}>
                    <FormGroup>
                        <InputGroup className="input-group-alternative">
                            <Input
                                name="name"
                                placeholder="name"
                                type="text"
                                invalid={errors.name ? true : false}
                                innerRef={register({ required: true })} />
                            <FormFeedback invalid={(errors.name && errors.name.type === 'required') ? "true" : "false"}>
                                يرجي ادخال اسم العميل
                        </FormFeedback>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>{phones.map((item, index) => (
                        <InputGroup key={item.id} className="input-group-alternative" style={{ margin: "5px auto" }}>
                            <Input
                                name={`phones[${index}]`}
                                placeholder="phone"
                                type="phone"
                                invalid={errors[`phones[${index}]`] ? true : false}
                                innerRef={register({
                                    required: true,
                                    pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/

                                })} />
                            <Button color="secondary" onClick={() => onRemovePhoneHandler(item)} hidden={phones.length <= 1}>-</Button>
                            <Button color="secondary" onClick={onCreateNewPhoneHandler} hidden={index !== 0}>+</Button>
                            <FormFeedback invalid={(errors[`phones[${index}]`] && errors[`phones[${index}]`].type === 'required') ? "true" : "false"}>
                                يرجي ادخال رقم الهاتف صحيح
                            </FormFeedback>
                        </InputGroup>
                    ))}</FormGroup>
                    <FormGroup>
                        <InputGroup className="input-group-alternative">
                            <Input name="address" placeholder="address" type="textarea" innerRef={register} />
                            <FormFeedback invalid={(errors.address && errors.address.type === 'required') ? "true" : "false"}>
                                يرجي ادخال عنوان العميل
                            </FormFeedback>
                        </InputGroup>
                    </FormGroup>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="mr-3">
                            <label style={{ fontSize: 32 }} htmlFor="radio-male" className="fa fa-male"></label>
                            <input type="radio" name="gender" value="MALE" id="radio-male" className="form-radio" defaultChecked ref={register({ required: true })} />
                        </div>
                        <div >
                            <label style={{ fontSize: 32 }} htmlFor="radio-female" className="fa fa-female"></label>
                            <input type="radio" name="gender" value="FEMALE" id="radio-female" className="form-radio" ref={register({ required: true })} />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {renderSubmitButton()}
                    <Button color="secondary" onClick={() => props.setOpen(false)}>Cancel</Button>
                </ModalFooter>
            </Form>

            {apiErrors && apiErrors.map((apiError) => <AppAlert message={apiError.message} key={apiError.param || Math.floor((Math.random() * 1000))} />)}

        </Modal >
    )
}



export default ClientModal;
