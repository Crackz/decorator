import React from "react";
import { Col, Row } from "reactstrap";


class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Row className="justify-content-xl-end">
          <Col xl="6">
            <div className="copyright text-center text-xl-left text-muted">
              <a
                className="font-weight-bold ml-1"
                href="https://www.facebook.com/MuhammedxMagdy"
                rel="noopener noreferrer"
                target="_blank"
              >
                Created By Muhammed Magdy
              </a>
            </div>
          </Col>
        </Row>
      </footer>
    );
  }
}

export default Footer;
