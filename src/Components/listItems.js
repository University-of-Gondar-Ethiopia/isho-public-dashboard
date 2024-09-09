import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";

import PublicIcon from "@mui/icons-material/Public";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
import { Link, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export const mainListItems = (
  <React.Fragment>
    <Tooltip title="Dashboard page" arrow>
      <ListItemButton component={Link} to="/dashboard">
        <ListItemIcon>
          <PublicIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Tooltip>
    <Tooltip title="Indicators page" arrow>
      <ListItemButton component={Link} to="/indicator">
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="Indicator" />
      </ListItemButton>
    </Tooltip>
  </React.Fragment>
);
