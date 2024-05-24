import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
import InstallButton from "./InstallButton";
import { Link } from "@mui/material";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <InstallButton />
    </ListItemButton>
    <ListItemButton component={Link} to="/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/request-form">
      <ListItemIcon>
        <SendTimeExtensionIcon />
      </ListItemIcon>
      <ListItemText primary="Request Form" />
    </ListItemButton>
  </React.Fragment>
);
