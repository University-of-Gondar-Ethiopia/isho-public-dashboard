import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import DashboardItems from "./DashboardItem";
import Title from "./Title";
import { useSnackbar } from "material-ui-snackbar-provider";

function createData(time, amount) {
  return { time, amount: amount ?? null };
}

const apiBase = "https://hmis.dhis.et/";
const url =
  apiBase +
  "api/dashboards.json?paging=false&fields=id,name,dashboardItems[id,type,shape,x,y,width,height,visualization[id,displayName],map[id,displayName],eventReport[id,displayName],eventChart[id,displayName]]";

export default function Chart({
  savedReports,
  setSavedReports,
  selectedSavedChart,
  setSelectedSavedChart,
}) {
  const theme = useTheme();
  const [dashboard, setDashbaord] = React.useState(null);
  const [dashboards, setDashboards] = React.useState([]);
  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState(true); // State variable for loading indicator

  //load the list of charts
  React.useEffect(() => {
    fetch(encodeURI(url))
      .then((data) => data.json())
      .then((data) => {
        setDashboards(data?.dashboards);
        setLoading(false);
      })
      .catch(() => {
        snackbar.showMessage(
          "Failed to load dashboards",
          undefined,
          undefined,
          { type: "error" }
        );
        setLoading(false);
      });
  }, []);

  const handleChartChange = (data) => {
    setDashbaord(data.target.value);
    setSelectedSavedChart(null);
  };

  const dashboardMenuList = () => {
    return dashboards.map((dashboard) => (
      <MenuItem key={dashboard.id} value={dashboard}>
        {dashboard.name}
      </MenuItem>
    ));
  };

  return (
    <React.Fragment>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "400",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Dashboard
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dashboard}
              label="Select Dashboard"
              onChange={handleChartChange}
            >
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                dashboardMenuList()
              )}
            </Select>
          </FormControl>
        </Paper>
      </Grid>

      <DashboardItems
        savedReports={savedReports}
        setSavedReports={setSavedReports}
        items={
          selectedSavedChart ? selectedSavedChart : dashboard?.dashboardItems
        }
      ></DashboardItems>
    </React.Fragment>
  );
}
