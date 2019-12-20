import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormFeedback } from "reactstrap";
import AppAlert from "../components/Shared/AppAlert";
import { connect } from "react-redux";
import * as actions from '../store/actions';
import { LoadingSpinner } from "../components/Shared/LoadingSpinner";
import useForm from "react-hook-form";

const Login = (props) => {

  const { handleSubmit, register, errors } = useForm();



  const onSubmit = async values => {
    if (values.phone)
      values.username = values.phone;

    props.login(values, props.history);
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit(onSubmit)}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-phone fa-rotate-90" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input name="phone" placeholder="phone" type="text" innerRef={register({ required: true })} />
                  <FormFeedback invalid={(errors.phone && errors.phone.type === 'required') ? "true" : "false"}>
                    يرجي ادخال رقم الهاتف
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
                  <Input name="password" placeholder="Password" type="password" innerRef={register({ required: true })} />
                  <FormFeedback invalid={(errors.password && errors.password.type === 'required') ? "true" : "false"}>
                    يرجي ادخال كلمة السر
                  </FormFeedback>
                </InputGroup>
              </FormGroup>

              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  <Link to="/auth/login" />
                  {props.isAuthenticating ? <LoadingSpinner /> : "Login"}
                </Button>
              </div>
            </Form>

            {props.apiErrors && props.apiErrors.map((apiError) => <AppAlert message={apiError.message} key={apiError.param || Math.floor((Math.random() * 1000))} />)}
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col className="text-right" xs="12">
            <Link to="/auth/register" >
              <Button color="primary" outline disabled={props.isAuthenticating} onClick={props.clearErrors}>Create new account</Button>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    apiErrors: state.auth.apiErrors,
    isAuthenticating: state.auth.isAuthenticating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (loginData, history) => dispatch(actions.login(loginData, history)),
    clearErrors: () => dispatch(actions.clearErrors())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);
