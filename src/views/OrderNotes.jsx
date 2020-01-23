import React, { useState } from 'react';
import { Form, FormGroup, Input } from 'reactstrap';
import { useEffect } from 'react';

const OrderNotes = (props) => {
    const [isEditingMode, setEditingMode] = useState(false);
    const [editorNotes, setEditortNotes] = useState('')
    const inputRef = React.createRef();

    const changeTextarea = (event) => {
        setEditortNotes(event.target.value)
    }

    useEffect(() => {
        setEditortNotes(props.notes);
    }, [props.notes])

    const renderActions = () => {
        if (isEditingMode) {
            return (
                <div className="d-flex">
                    <div className="mx-2 fas fa-save edit-notes-button" style={{ cursor: 'pointer', color: 'green' }} onClick={() => {
                        props.setNotes(editorNotes);
                        setEditingMode(false)
                    }}>
                    </div>
                    <div className="mx-2 fas fa-window-close edit-notes-button" style={{ cursor: 'pointer', color: 'red' }} onClick={() => {
                        setEditingMode(false)
                    }}>
                    </div>
                </div>
            )
        }

        return (
            <div className="mx-2 edit-notes-button" style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setEditingMode(true)}>
                <i className="fas fa-edit"></i>
            </div>
        )
    }

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-between mx-2 my-2 align-item-center justify-content-center">
                <h5>Notes:</h5>
                {renderActions()}
            </div>
            <div className="mx-2" style={{ borderBottom: '1px dotted black' }} ></div>

            <div className="m-2 text-center">
                {
                    isEditingMode ?
                        (
                            <Form>
                                <FormGroup>
                                    < Input
                                        className="text-center"
                                        type="textarea" name="text" id="exampleText"
                                        value={editorNotes}
                                        onChange={changeTextarea}
                                        rows={20}
                                        ref={inputRef}
                                    />
                                </FormGroup>
                            </Form>
                        )
                        :
                        <span>{!props.notes ? 'لا يوجد اي ملاحظات' : props.notes}</span>
                }
            </div>
        </div>
    )
}

export default OrderNotes;