import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Nav, Navbar, UncontrolledDropdown } from "reactstrap";
import * as actions from '../../store/actions';


const AdminNavbar = (props) => {

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm">
                    <img
                      alt="..."
                      src={props.currentUser ?
                        props.currentUser.profileImg :
                        require('../../assets/img/brand/profile-img.jpg')
                      }
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {props.currentUser.name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem style={{cursor: 'pointer'}} onClick={() => props.signout(props.history)}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signout: (history) => dispatch(actions.signout(history))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminNavbar);
