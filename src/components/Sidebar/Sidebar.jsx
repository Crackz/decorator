import { PropTypes } from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link, NavLink as NavLinkRRD } from "react-router-dom";
import {
  Col, Collapse, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Nav, Navbar, NavbarBrand, NavItem,
  NavLink, Row, UncontrolledDropdown
} from "reactstrap";
import * as actions from '../../store/actions';
import RequireAuth from "../Shared/RequireAuth";


class Sidebar extends React.Component {
  state = {
    collapseOpen: false
  };
  constructor(props) {
    super(props);
    this.activeRoute = this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // closes the collapse
  closeCollapse = () => {
    this.setState({
      collapseOpen: false
    });
  };

  // creates the links that appear in the left menu / Sidebar
  createLinks = routes => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={this.closeCollapse}
            activeClassName="active"
            style={{ textAlign: 'center' }}
          >
            <i className={prop.icon} />
            <span className="p-2">
              {prop.name}
            </span>
          </NavLink>
        </NavItem>
      );
    });
  };


  render() {
    const { routes, logo } = this.props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
      navbarBrandProps = {
        to: logo.innerLink,
        tag: Link
      };
    } else if (logo && logo.outterLink) {
      navbarBrandProps = {
        href: logo.outterLink,
        target: "_blank"
      };
    }
    return (
      <Navbar
        className="navbar-vertical fixed-left navbar-light bg-white"
        expand="md"
        id="sidenav-main"
      >
        <Container fluid>
          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={this.toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          {/* Brand */}
          {logo ? (
            <>
              <NavbarBrand className="pt-0" {...navbarBrandProps}>
                <img
                  alt={logo.imgAlt}
                  className="navbar-brand-img"
                  src={logo.imgSrc}
                />
              </NavbarBrand>
            </>
          ) : null}

          {/* When it's Collaped */}
          <Nav className="align-items-center d-md-none" >
            <UncontrolledDropdown nav>
              <DropdownToggle nav >
                <Media className="align-items-center" >
                  <span className="avatar avatar-lg rounded-circle">
                    <img
                      alt="..."
                      src={this.props.currentUser.profileImg}
                    />
                  </span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => this.props.signout(this.props.history)}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>

          {/* Collapse */}
          <Collapse navbar isOpen={this.state.collapseOpen}>
            {/* Collapse header */}
            <div className="navbar-collapse-header d-md-none">
              <Row>
                {logo ? (
                  <Col className="collapse-brand" xs="6">
                    {logo.innerLink ? (
                      <Link to={logo.innerLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </Link>
                    ) : (
                        <a href={logo.outterLink}>
                          <img alt={logo.imgAlt} src={logo.imgSrc} />
                        </a>
                      )}
                  </Col>
                ) : null}
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={this.toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>


            <Nav navbar style={{ alignItems: 'center' }}>{this.createLinks(routes)}</Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

Sidebar.defaultProps = {
  routes: [{}]
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired
  })
};

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

export default connect(mapStateToProps, mapDispatchToProps)(RequireAuth(Sidebar));
