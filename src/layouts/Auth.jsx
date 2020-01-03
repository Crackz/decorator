import React from "react";
import { Route, Switch } from "react-router-dom";
import routes from "routes.js";

const Auth = () => {
  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
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


  return (
    <>

      <div className="authContainer">
        <div>
          <img id="authLogo" alt="logo" src={require("assets/img/brand/logo.png")} />
          <h1>Welcome !</h1>
        </div>
        <div className="authFormContainer">
          <Switch>{getRoutes(routes)}</Switch>
        </div>
      </div>
    </>
  );
}


export default Auth;