import React from "react";

import * as Icon from "react-feather";

export const SidebarData = [
  {
    label: "Main",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        icon: <Icon.Grid />,
        submenu: true,
        showSubRoute: false,

        submenuItems: [
          { label: "Admin Dashboard", link: "/admin-dashboard" },
          // { label: "Sales Dashboard", link: "/sales-dashboard" },
        ],
      },
      
    ],
  },
  

  {
    label: "HRM",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "HRM",
    submenuItems: [
      {
        label: "Employees",
        link: "/employees-grid",
        icon: <Icon.Users />,
        showSubRoute: false,
      },
      {
        label: "Departments",
        link: "/department-grid",
        icon: <Icon.User />,
        showSubRoute: false,
      },
      
    ],
  },
 

  {
    label: "User Management",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "User Management",
    submenuItems: [
      {
        label: "Users",
        link: "/users",
        icon: <Icon.UserCheck />,
        showSubRoute: false,
      },
      {
        label: "Roles & Permissions",
        link: "/roles-permissions",
        icon: <Icon.UserCheck />,
        showSubRoute: false,
      },
    ],
  },


];
