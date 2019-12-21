import Index from "views/Index.jsx";
import Profile from "views/examples/Profile.jsx";
import Maps from "views/examples/Maps.jsx";
import Register from "views/Register.jsx";
import Login from "views/Login.jsx";
import Client from "views/Client.jsx";
import Icons from "views/examples/Icons.jsx";
import RequireAuth from "./components/Shared/RequireAuth";

var routes = [
  {
    path: "/index",
    name: "Home",
    icon: "ni ni-tv-2 text-primary",
    component: RequireAuth(Index),
    layout: "/dashboard"
  },
  {
    path: "/clients",
    name: "Clients",
    icon: "ni ni-bullet-list-67 text-red",
    component: RequireAuth(Client),
    layout: "/dashboard"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: RequireAuth(Icons),
    layout: "/dashboard"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: RequireAuth(Maps),
    layout: "/dashboard"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: RequireAuth(Profile),
    layout: "/dashboard"
  },
  
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  }
];
export default routes;
