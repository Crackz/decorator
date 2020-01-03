import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { DropdownItem, DropdownMenu, DropdownToggle, Media, Nav, Navbar, UncontrolledDropdown } from "reactstrap";
import * as actions from '../../store/actions';
import RequireAuth from "../Shared/RequireAuth";


const AdminNavbar = (props) => {

  return (
    <>
      <Navbar className="navbar-top navbar-dark d-none d-md-flex" expand="md" id="navbar-main">
        <Link className="h4 mb-0 ml-3 text-white text-uppercase d-lg-inline-block" to="/" >
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
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome, {props.currentUser.name}</h6>
              </DropdownItem>
              <DropdownItem style={{ cursor: 'pointer' }} onClick={() => props.signout(props.history)}>
                <i className="fa fa-suitcase" aria-hidden="true" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
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

export default connect(mapStateToProps, mapDispatchToProps)(RequireAuth(AdminNavbar));
