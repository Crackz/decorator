import React, { useState } from "react";
import useForm from "react-hook-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row, UncontrolledAlert } from "reactstrap";
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';
import * as actions from '../store/actions';
import AppAlert from '../components/Shared/AppAlert';

const Register = (props) => {
  const { handleSubmit, register, errors } = useForm();

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImgPreviewUrl] = useState(null);

  const profileImgHandler = event => {
    setSelectedFile(event.target.files[0]);

    const reader = new FileReader();
    reader.onloadend = () => setImgPreviewUrl(reader.result);
    reader.readAsDataURL(event.target.files[0])
  }

  const onSubmit = async values => {
    const registerData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key === 'profileImg' && selectedFile)
        registerData.append('profileImg', selectedFile, selectedFile.name);
      else
        registerData.append(key, values[key]);
    })

    props.register(registerData, props.history);
  };


  let profileImgInput;
  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Form onSubmit={handleSubmit(onSubmit)}>

              <FormGroup>
                <div className="avatar-wrapper">
                  <img className="profile-pic" src={imagePreviewUrl || require("assets/img/brand/profile-img.jpg")} alt="profile-pic" />
                  <div className="upload-button" onClick={() => profileImgInput.click()}>
                    <i className="fa fa-arrow-circle-up" aria-hidden="true"></i>
                  </div>
                  <input
                    hidden={true}
                    name="profileImg" type="file" accept="image/*"
                    onChange={profileImgHandler}
                    ref={fileInput => {
                      profileImgInput = fileInput
                      return register({ required: true })(fileInput);
                    }}
                  />
                </div>
                <div className="invalid-feedback" style={{ display: 'block' }} hidden={!errors.profileImg ? true : false}>
                  قم برفع صورة لك
                </div>

              </FormGroup>
              <FormGroup>

                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-user" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="name"
                    placeholder="Name"
                    type="text"
                    invalid={errors.name ? true : false}
                    innerRef={register({ required: true, minLength: 3 })}
                  />

                  <FormFeedback invalid={(errors.name && errors.name.type === 'minLength') ? "true" : "false"}>
                    يجب ان لا يقل الاسم عن ثلاثة احرف
                  </FormFeedback>
                </InputGroup>
              </FormGroup>

              <FormGroup>

                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-phone fa-rotate-90" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="phone"
                    placeholder="Phone No."
                    type="text"
                    invalid={errors.phone ? true : false}
                    innerRef={register({
                      required: true,
                      pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
                    })}
                  />

                  <FormFeedback invalid={(errors.phone && errors.phone.type === 'pattern') ? "true" : "false"}>
                    رقم الهاتف غير صحيح
                </FormFeedback>
                </InputGroup>


              </FormGroup>

              <FormGroup>

                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="password"
                    placeholder="Password"
                    type="password"
                    invalid={errors.password ? true : false}
                    innerRef={register({ required: true })}
                  />

                  <FormFeedback invalid={(errors.password && errors.password.type === 'required') ? "true" : "false"}>
                    يرجي ادخال كلمة السر
                  </FormFeedback>
                </InputGroup>

              </FormGroup>

              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit" disabled={props.isAuthenticating}>
                  {props.isAuthenticating ? <LoadingSpinner /> : "Create account"}
                </Button>
              </div>
            </Form>

            {props.apiErrors && props.apiErrors.map((apiError) => <AppAlert message={apiError.message} key={apiError.param || Math.floor((Math.random() * 1000))} />)}

          </CardBody>
        </Card>

        <Row className="mt-3">
          <Col className="text-right" xs="2">
            <Link to="/auth/login" >
              <Button color="primary" outline disabled={props.isAuthenticating} onClick={props.clearErrors}>Login</Button>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );

}


function mapStateToProps(state) {
  return {
    apiErrors: state.auth.apiErrors,
    isAuthenticating: state.auth.isAuthenticating,
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    register: (registerData, history) => dispatch(actions.register(registerData, history)),
    clearErrors: () => dispatch(actions.clearErrors())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Register);