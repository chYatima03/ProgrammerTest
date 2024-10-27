import React from "react";
import { Route, Navigate } from "react-router-dom";
import Dashboard from "../feature-module/dashboard/Dashboard";

const routes = all_routes;

import DepartmentGrid from "../feature-module/hrm/departmentgrid";
import DepartmentList from "../feature-module/hrm/departmentlist";
// import Profile from "../feature-module/pages/profile";
import Signin from "../feature-module/pages/login/signin";
// import Register from "../feature-module/pages/register/register";
import Users from "../feature-module/usermanagement/users";
import RolesPermissions from "../feature-module/usermanagement/rolespermissions";
import Permissions from "../feature-module/usermanagement/permissions";
// import DeleteAccount from "../feature-module/usermanagement/deleteaccount";
import EmployeesGrid from "../feature-module/hrm/employeesgrid";
import EditEmployee from "../feature-module/hrm/editemployee";
import AddEmployee from "../feature-module/hrm/addemployee";
import { all_routes } from "./all_routes";
export const publicRoutes = [
  {
    id: 1,
    path: routes.dashboard,
    name: "home",
    element: <Dashboard />,
    route: Route,
  },
  {
    id: 38,
    path: routes.departmentgrid,
    name: "departmentgrid",
    element: <DepartmentGrid />,
    route: Route,
  },

  {
    id: 39,
    path: routes.departmentlist,
    name: "departmentlist",
    element: <DepartmentList />,
    route: Route,
  },

  {
    id: 104,
    path: routes.users,
    name: "users",
    element: <Users />,
    route: Route,
  },
  {
    id: 105,
    path: routes.rolespermission,
    name: "rolespermission",
    element: <RolesPermissions />,
    route: Route,
  },
  {
    id: 106,
    path: routes.permissions,
    name: "permissions",
    element: <Permissions />,
    route: Route,
  },

  {
    id: 108,
    path: routes.employeegrid,
    name: "employeegrid",
    element: <EmployeesGrid />,
    route: Route,
  },
  {
    id: 109,
    path: routes.addemployee,
    name: "addemployee",
    element: <AddEmployee />,
    route: Route,
  },
  {
    id: 110,
    path: routes.editemployee,
    name: "editemployee",
    element: <EditEmployee />,
    route: Route,
  },
  
  {
    id: 117,
    path: '/',
    name: 'Root',
    element: <Navigate to="/signin" />,
    route: Route,
  },
  
];

export const pagesRoute = [
  {
    id: 1,
    path: routes.signin,
    name: "signin",
    element: <Signin />,
    route: Route,
  },
  
];
