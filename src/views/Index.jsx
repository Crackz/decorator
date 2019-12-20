import React from "react";
import { Card, CardBody, CardTitle, Container, Row, Col, CardImg, CardImgOverlay, CardText } from "reactstrap";



class Index extends React.Component {
  render() {
    return (
      <>
        <Container fluid style={{ alignSelf: 'center' }}>
          <Row >
            <Col className="ml-5 mr-5" justifyContent="center" style={{ cursor: 'pointer' }}>
              <Card className="card-stats mb-4 mb-xl-0 text-center">
                <CardBody>
                  <div className="icon-lg icon-shape bg-red text-white rounded-circle shadow">
                    <i className="fa fa-users fa-10x" />
                  </div>
                </CardBody>

                <CardTitle tag="h5" className="text-uppercase text-muted mb-2">Clients</CardTitle>
              </Card>
            </Col>
            <Col  className="ml-5 mr-5" justifyContent="center" style={{ cursor: 'pointer' }}>
              <Card className="card-stats mb-4 mb-xl-0 text-center">
                <CardBody>
                  <div className="icon-lg icon-shape bg-info text-white rounded-circle shadow">
                    <i className="ni ni-collection mr-1" />
                  </div>
                </CardBody>

                <CardTitle tag="h5" className="text-uppercase text-muted mb-2" >Orders</CardTitle>
              </Card>
            </Col>

          </Row>
        </Container>
      </>
    );
  }
}

export default Index;
