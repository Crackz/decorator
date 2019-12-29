import React, { useEffect, useState } from 'react';
import useForm from 'react-hook-form';
import { Button, Form, FormFeedback, FormGroup, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';
import Axios from 'axios';
import AppAlert from '../components/Shared/AppAlert';
import { cleanObject } from '../utils/clean-object';

export const ClientModal = (props) => {

    const { handleSubmit, register, errors } = useForm();
    const [phones, setPhones] = useState([]);
    const [isFetching, setFetching] = useState(false);
    const [apiErrors, setApiErrors] = useState(null);

    const onSubmit = async (values, e) => {
        try {
            setFetching(true)
            const res = await Axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/clients`,
                data: cleanObject(values),
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
            });
            props.addNewClient(res.data)
            props.setOpenModel(false);
            e.target.reset();
        } catch (error) {
            let apiErrors = [];

            if (error && error.response)
                apiErrors = apiErrors.concat(error.response.data.error.errors);
            else
                apiErrors.push({ message: 'try again', param: 'tryAgain' });

            setApiErrors(apiErrors);
        }

        setFetching(false);
    };


    const handleNewPhone = () => {
        setPhones([...phones, { id: Math.floor(Math.random() * 1000) }])
    }

    const handleRemovePhone = ({ id }) => {
        const filteredPhones = phones.filter((el) => el.id !== id);
        setPhones(filteredPhones)
    }

    useEffect(() => {
        handleNewPhone()
    }, []);


    return (
        <Modal isOpen={props.isOpenModel} style={{ textAlign: 'center' }}>
            <ModalHeader toggle={() => props.setOpenModel(false)}>Create New Client</ModalHeader>
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
                            <Button color="secondary" onClick={() => handleRemovePhone(item)} hidden={phones.length <= 1}>-</Button>
                            <Button color="secondary" onClick={handleNewPhone} hidden={index !== 0}>+</Button>
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
                    <Button color="primary" type="submit" onClick={onsubmit}>{isFetching ? <LoadingSpinner fontSize={18} /> : "Create"}</Button>
                    <Button color="secondary" onClick={() => props.setOpenModel(false)}>Cancel</Button>
                </ModalFooter>
            </Form>

            {apiErrors && apiErrors.map((apiError) => <AppAlert message={apiError.message} key={apiError.param || Math.floor((Math.random() * 1000))} />)}

        </Modal >
    )
}

