import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import React from "react";
import { Route, Switch } from "react-router-dom";
import routes from "routes.js";
import Client from '../views/Client';
import ClientProfile from '../views/ClientProfile';
import Index from '../views/Index';
import RequireAuth from '../components/Shared/RequireAuth';
import OrderDetails from '../views/OrderDetails';
import NotFound from '../views/NotFound';
import LoadingOverlay from 'react-loading-overlay';
import Order from "../views/Order";
import User from "../views/User";
import Forbidden from "../views/Forbidden";
import { connect } from "react-redux";
import * as actions from '../store/actions';

class Admin extends React.Component {
  state = {
    isFetchingUser: false,
    navbarOpts: {
      text: 'Home',
      hide: false
    }
  }

  async componentWillMount() {
    this.props.fetchUser(this.props.currentUser._id);
  }


  setNavbarOpts(navbarOpts = {}) {
    this.setState({ navbarOpts: { ...this.state.navbarOpts, ...navbarOpts } });
  }

  render() {
    const setNavbarOpts = this.setNavbarOpts.bind(this);
    return (
      <>
        <LoadingOverlay active={this.state.activeLoadingOverlay}>

          <Sidebar
            {...this.props}
            routes={routes.filter((route) => {
              if (route.layout === '/dashboard' && (route.allowedRoles[0] === '*' || route.allowedRoles.some((el) => this.props.currentUser.roles.includes(el))))
                return true;

              return false;
            })}

            logo={{
              innerLink: "/dashboard/index",
              imgSrc: require("assets/img/brand/logo.png"),
              imgAlt: "logo"
            }}
          />

          <div className="main-content" ref="mainContent" style={{ display: "flex", flex: 1 }}>
            <AdminNavbar navbarOpts={this.state.navbarOpts} locationPathName={this.props.location.pathname} history={this.props.history} />

            {
              (!this.props.currentUser.roles.includes('SUPER_ADMIN') && !this.props.currentUser.roles.includes('ADMIN')) ?
                <Forbidden /> :
                <Switch>
                  <Route exact path="/dashboard/index" render={props => <Index {...props} setNavbarOpts={setNavbarOpts} />} />
                  <Route path="/dashboard/clients/:clientId/orders/:orderId" render={props => <OrderDetails {...props}
                    setNavbarOpts={setNavbarOpts} />}
                  />
                  <Route path="/dashboard/clients/:clientId/profile" render={props => <ClientProfile {...props}
                    setNavbarOpts={setNavbarOpts} />} />
                  <Route path="/dashboard/clients" render={props => <Client {...props} setNavbarOpts={setNavbarOpts} />} />
                  <Route path="/dashboard/orders" render={props => <Order {...props} setNavbarOpts={setNavbarOpts} />} />
                  <Route path="/dashboard/users" render={props => <User {...props} setNavbarOpts={setNavbarOpts} />} />
                  <Route path="/dashboard/forbidden" render={props => <Forbidden {...props} setNavbarOpts={setNavbarOpts} />} />
                  <Route path="/dashboard/404" render={props => <NotFound {...props} setNavbarOpts={setNavbarOpts} />} />
                </Switch>
            }
          </div>
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser
  }
}


const mapDisptachToProps = (disptach) => {
  return {
    fetchUser: (userId) => disptach(actions.fetchUser(userId))
  }
}

export default connect(mapStateToProps, mapDisptachToProps)(RequireAuth(Admin));
