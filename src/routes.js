import Client from "views/Client.jsx";
import Index from "views/Index.jsx";
import Login from "views/Login.jsx";
import Register from "views/Register.jsx";
import Order from "./views/Order";
import User from "./views/User";

var routes = [
  {
    path: "/index",
    name: "Home",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/dashboard",
    allowedRoles: ['*']
  },
  {
    path: "/clients",
    name: "Clients",
    icon: "fas fa-users text-red",
    component: Client,
    layout: "/dashboard",
    allowedRoles: ['*']
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "fas fa-database text-info",
    component: Order,
    layout: "/dashboard",
    allowedRoles: ['*']
  },
  {
    path: "/users",
    name: "Users",
    icon: "fas fa-users-cog text-light",
    component: User,
    layout: "/dashboard",
    allowedRoles: ['SUPER_ADMIN']
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
