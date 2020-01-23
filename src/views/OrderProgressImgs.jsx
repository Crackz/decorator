import React from 'react';
import ImageGallery from 'react-image-gallery';
import { Button } from 'reactstrap';
import { generateId } from '../utils/generator';

const OrderProgressImgs = (props) => {

    const progressImgInput = React.createRef();


    const renderCustomControls = () => {
        return (
            <div className="icon-sm icon-shape bg-white rounded-circle"
                style={{ position: 'absolute', left: 10, top: 10, cursor: 'pointer', zIndex: 10 }}
                onClick={() => { progressImgInput.current.click(); }}>


                <i style={{ color: '#5e72e4' }} className="fas fa-plus"></i>
            </div>
        )
    }

    const renderProgressImgs = () => {
        if (!props.progressImages || props.progressImages.length === 0) {
            return (

                <div className="d-flex flex-grow-1 flex-wrap shadow-lg rounded mt-4 justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <Button color="primary" onClick={() => progressImgInput.current.click()} >اضف صورة تقدم</Button>
                </div>
            )
        }

        return (
            <div className="mt-4" style={{ flex: 1 }} >
                <ImageGallery
                    items={props.progressImages}
                    renderItem={progressImgRender}
                    renderCustomControls={renderCustomControls}
                />
            </div>
        )
    }


    const progressImgHandler = event => {
        const reader = new FileReader();
        const uploadableData = event.target.files[0];
        reader.onloadend = () => {
            const newImages = [...props.progressImages];
            newImages.push({
                original: reader.result,
                thumbnail: reader.result,
                id: generateId(),
                uploadableData: uploadableData
            })
            props.setProgressImages(newImages);
        };
        reader.readAsDataURL(uploadableData)
    }


    const progressImgRender = (item) => {
        return (
            <div style={{ minHeight: '400px' }} key={item.id}>
                <img key={item.id} className='image-gallery-image' src={item.original} alt="progress-img" style={{
                    maxHeight: "500px",
                    maxWidth: "800px",
                    height: "100%",
                    width: "100%",
                }} />
                <div className=" icon-sm icon-shape bg-white text-red rounded-circle"
                    style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', zIndex: 1000 }}
                    onClick={() => {
                        const newImages = [...props.progressImages.filter((el) => el.id !== item.id)];
                        props.setProgressImages(newImages);
                    }}>
                    <i style={{ color: '#f5365c' }}
                        className="fas fa-trash-alt">
                    </i>
                </div>
            </div >
        )
    }

    console.log('PROGRESS IMGS : ', props.progressImages);

    return (
        <>
            <input
                hidden={true}
                name="progressImg" type="file" accept="image/*"
                onChange={progressImgHandler}
                ref={progressImgInput}
            />

            {renderProgressImgs()}

        </>
    )

}


export default OrderProgressImgs;