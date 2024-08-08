import * as React from "react";
// import { useTheme } from "@mui/material/styles";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
} from "@mui/material";
import DashboardItems from "./DashboardItem";
import { useSnackbar } from "material-ui-snackbar-provider";
import OrgUnitFilterModal from "./OrgUnitFilterModal";
import LevelItems from "./LevelItems";

const apiBase = process.env.REACT_APP_BASE_URI;

const url =
  apiBase +
  "api/dashboards.json?paging=false&fields=id,name,favorite,dashboardItems[id,resources[id, name],type,shape,x,y,width,height,text,visualization[id,displayName],map[id,displayName],eventReport[id,displayName],eventChart[id,displayName]]";

const getSLASGroupsetURL =
  apiBase +
  "api/dataElementGroupSets?filter=code:in:[AS,SL]&fields=name,,code,id,items[name,id,description]&paging=false";

export default function IndicatorContainer({
  savedReports,
  setSavedReports,
  selectedSavedChart,
  setSelectedSavedChart,
}) {
  // const theme = useTheme();
  const [dashboard, setDashbaord] = React.useState(null);
  const [dashboards, setDashboards] = React.useState([]);
  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState(true); // State variable for loading indicator
  const [filters, setFilters] = React.useState(null);

  const [SLGroupset, setSLGropuset] = React.useState(null);
  const [ASGroupset, setASGropuset] = React.useState(null);

  //load the list of charts
  React.useEffect(() => {
    fetch(encodeURI(getSLASGroupsetURL))
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        let jsonData = JSON.parse(data);
        let slGroupSet = jsonData.dataElementGroupSets.find((groupset) => {
          return groupset.code === "SL";
        });

        let asGroupSet = jsonData.dataElementGroupSets.find((groupset) => {
          return groupset.code === "AS";
        });

        setSLGropuset(slGroupSet);
        setASGropuset(asGroupSet);
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
    let dashboard = dashboards.find(
      (dashboard) => dashboard.id === data.target.value
    );
    setDashbaord(dashboard);
    setSelectedSavedChart(null);

    const newUrl = `${window.location.origin}${window.location.pathname}?dashboard=${dashboard.id}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const dashboardMenuList = () => {
    return dashboards.map((dashboard) => (
      <MenuItem key={dashboard.id} value={dashboard.id}>
        {dashboard.name}
      </MenuItem>
    ));
  };

  const handelFilterSelect = (
    orgunitFilters,
    orgunitGroupFilters,
    orgunitLevelFilters,
    hideEmptyCharts
  ) => {
    setFilters({
      orgunits: orgunitFilters,
      orgunitGroup: orgunitGroupFilters,
      orgunitLevel: orgunitLevelFilters,
      hideEmptyCharts: hideEmptyCharts,
    });
  };

  return (
    <React.Fragment>
      <Grid item xs={12} md={10} lg={10}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "400",
            flexWrap: "nowrap",
            alignItems: "left",
            gap: "2%",
          }}
        >
          <Typography variant="h6">Site Level Indicators</Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "400",
              flexWrap: "nowrap",
              alignItems: "center",
              gap: "2%",
            }}
          >
            {SLGroupset?.items?.map((item) => (
              <Button>{item.name}</Button>
            ))}
          </div>
        </Paper>
      </Grid>

      <LevelItems groupset={SLGroupset}></LevelItems>

      <Grid item xs={12} md={10} lg={10}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "400",
            flexWrap: "nowrap",
            alignItems: "left",
            gap: "2%",
          }}
        >
          <Typography variant="h6">Above Site Indicators</Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "400",
              flexWrap: "nowrap",
              alignItems: "center",
              gap: "2%",
            }}
          >
            {ASGroupset?.items?.map((item) => (
              <Button>{item.name}</Button>
            ))}
          </div>
        </Paper>
      </Grid>

      <LevelItems groupset={ASGroupset}></LevelItems>
    </React.Fragment>
  );
}
