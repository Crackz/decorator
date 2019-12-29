import Client from "views/Client.jsx";
import Index from "views/Index.jsx";
import Login from "views/Login.jsx";
import Register from "views/Register.jsx";
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
