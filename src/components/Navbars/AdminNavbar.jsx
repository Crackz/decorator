import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { DropdownItem, DropdownMenu, DropdownToggle, Media, Nav, Navbar, UncontrolledDropdown } from "reactstrap";
import * as actions from '../../store/actions';


const AdminNavbar = (props) => {
  if (props.navbarOpts && props.navbarOpts.hide)
    return null;

  return (
    <Navbar className="navbar-top navbar-dark d-none d-md-flex" expand="md" id="navbar-main">
      <Link className="h4 mb-0 ml-3 text-white text-uppercase d-lg-inline-block" to={props.locationPathName} >
        {props.navbarOpts && props.navbarOpts.text}
      </Link>
      <Nav className="align-items-center d-none d-md-flex" navbar>
        <UncontrolledDropdown nav>
          <DropdownToggle className="mr-2" nav>
            <Media className="align-items-center">
              <span className="avatar avatar-md">
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
              <h6 className="text-overflow m-0">Welcome, {props.currentUser && props.currentUser.name}</h6>
            </DropdownItem>
            <DropdownItem style={{ cursor: 'pointer' }} onClick={() => props.signout(props.history)}>
              <i className="fas fa-sign-out-alt" aria-hidden="true" />
              <span>logout</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Navbar>
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
