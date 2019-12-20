import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";


class Login extends Component {
  render() {
    return (
      <>
        <footer className="py-5">
          <Container>
            <Row className="align-items-center justify-content-xl-between">
              <Col xl="6">
                <div className="copyright text-xl-left text-muted">
                Created By
                  <a
                    className="font-weight-bold ml-1"
                    href="https://www.facebook.com/MuhammedxMagdy"
                    // eslint-disable-next-line react/jsx-no-target-blank
                    target="_blank"
                  >Muhammed Magdy
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
