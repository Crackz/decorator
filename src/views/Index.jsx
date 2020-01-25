import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";

class Index extends React.Component {
  componentWillMount() {
    this.props.setNavbarOpts({ text: 'Home' });
  }

  render() {
    return (
      <>
        <div style={{ flex: 1, flexDirection: 'row', display: "flex", alignItems: 'center' }}>
          <div style={{ flex: 1, margin: "5%" }}>
            <Link to="/dashboard/clients">
              <Card className="card-stats mb-4 mb-xl-0 text-center">
                <CardBody>
                  <div className="icon-lg icon-shape bg-danger text-white rounded-circle shadow">
                    <i className="fa fa-users fa-10x" />
                  </div>
                </CardBody>
                <CardTitle tag="h5" className="text-uppercase text-muted mb-2">Clients</CardTitle>
              </Card>
            </Link>

          </div>

          <div style={{ flex: 1, margin: "5%", }}>
            <Link to="/dashboard/orders">
              <Card className="card-stats mb-4 mb-xl-0 text-center bg-">
                <CardBody>
                  <div className="icon-lg icon-shape bg-info text-white rounded-circle shadow">
                    <i className="fas fa-database mr-1" />
                  </div>
                </CardBody>

                <CardTitle tag="h5" className="text-uppercase text-muted mb-2" >Orders</CardTitle>
              </Card>

            </Link>
          </div>

        </div>
      </>
    );
  }
}

export default Index;
