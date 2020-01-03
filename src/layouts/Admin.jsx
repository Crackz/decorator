import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import React from "react";
import { Route, Switch } from "react-router-dom";
import routes from "routes.js";
import Client from '../views/Client';
import ClientProfile from '../views/ClientProfile';
import Index from '../views/Index';
import RequireAuth from '../components/Shared/RequireAuth';

class Admin extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }

  getBrandText = path => {
    console.log(this.props.location.pathname, 'this.props.location.pathname');

    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };


  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes.filter((route) => route.path === '/index' || route.path === '/clients')}
          logo={{
            innerLink: "/dashboard/index",
            imgSrc: require("assets/img/brand/logo.png"),
            imgAlt: "logo"
          }}
        />

        <div className="main-content" ref="mainContent" style={{ display: "flex", flex: 1 }}>
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            <Route exact path="/dashboard/index" component={Index} />
            <Route path="/dashboard/clients/profile/:profileId" component={ClientProfile} />
            <Route path="/dashboard/clients" component={Client} />
          </Switch>
        </div>
      </>
    );
  }
}



export default RequireAuth(Admin);
