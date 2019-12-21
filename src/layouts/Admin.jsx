import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import React from "react";
import { Route, Switch } from "react-router-dom";
import routes from "routes.js";


class Admin extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/dashboard") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
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
          routes={routes.filter((route) => route.path.includes('/index') || route.path.includes('/clients'))}
          logo={{
            innerLink: "/dashboard/index",
            imgSrc: require("assets/img/brand/logo.png"),
            imgAlt: "logo"
          }}
        />

        <div className="main-content bg-gradient-info" ref="mainContent" style={{ display: "flex" }}>
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
        </div>
      </>
    );
  }
}

export default Admin;
