import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
import { Link } from "@mui/material";

export const mainListItems = (
  <React.Fragment>
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
