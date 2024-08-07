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
import { IconButton } from "@mui/material";
import { useSnackbar } from "material-ui-snackbar-provider";
import InstallButton from "./InstallButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Download } from "@mui/icons-material";
import useInstallPrompt from "../hooks/useInstallPrompt";
import useDynamicPosition from "../hooks/useDynamicPosition";
import Box from "@mui/material/Box";
import Chart from "./Chart";
import { Container, Grid } from "@mui/material";

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};
function SecondaryListItems({
  savedReports,
  setSavedReports,
  setSelectedSavedChart,
  onSavedReportClick,
}) {
  const handleDelete = (index) => {
    const newReport = {
      items: [...savedReports.items.filter((e, i) => i != index)],
    };
    setSavedReports(newReport);
    localStorage.setItem("saved_reports", JSON.stringify(newReport));
  };
  const handelClick = (index) => {
    setSelectedSavedChart([savedReports.items[index]]);
  };

  const [hoverIndex, setHoverIndex] = React.useState(null);
  const snackbar = useSnackbar();
  const { isAppInstalled, promptInstall } = useInstallPrompt();
  const position = useDynamicPosition();
  const [_selectedSavedChart, _setSelectedSavedChart] = React.useState(
    setSelectedSavedChart
  );

  return (
    <React.Fragment>
      <ListSubheader
        style={{ cursor: "pointer" }}
        component="div"
        onClick={() => {
          if (
            savedReports &&
            savedReports.items &&
            savedReports.items.length > 0
          ) {
            setSelectedSavedChart(savedReports.items);
            if (onSavedReportClick) {
              onSavedReportClick();
            }
          } else
            snackbar.showMessage(
              "No saved reports yet. You can save reports to display them here.",
              undefined,
              { autoHideDuration: 1000 },
              {
                type: "info",
              }
            );
        }}
        inset
      >
        Saved reports
      </ListSubheader>
      {savedReports &&
        savedReports.items.map((report, index) => (
          <ListItemButton
            key={index}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => handelClick(index)}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              primary={truncateText(
                report[report?.type?.toLowerCase()]?.displayName ??
                  "Unnamed dashboard item ",
                12
              )}
            />
            {hoverIndex === index && (
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </ListItemButton>
        ))}
      <Box
        sx={{
          position: "relative",
          bottom: position.bottom,
        }}
      >
        <ListItemButton onClick={promptInstall}>
          <ListItemIcon>
            <Download />
          </ListItemIcon>

          <ListItemText>
            <InstallButton />
          </ListItemText>
        </ListItemButton>
      </Box>
    </React.Fragment>
  );
}

export default SecondaryListItems;
