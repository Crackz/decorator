import React from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, NavbarBrand } from "reactstrap";

class AdminNavbar extends React.Component {
  render() {
    return (
      <>
        <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md" >
          <Container className="px-4">
            <NavbarBrand to="/" tag={Link} style={{ width: "20%" }}>
              <img alt="logo" src={require("assets/img/brand/logo.png")} style={{ width: "100%", height: 'auto' }} />
            </NavbarBrand>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;
