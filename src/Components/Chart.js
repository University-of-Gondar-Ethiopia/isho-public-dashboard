import * as React from "react";
// import { useTheme } from "@mui/material/styles";
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
import { useSnackbar } from "material-ui-snackbar-provider";
import Filters from "./Filters";
import OrgUnitFilterModal from "./OrgUnitFilterModal";
import ReactGA from "react-ga4";

const apiBase = process.env.REACT_APP_BASE_URI;

const url =
  apiBase +
  "api/dashboards.json?paging=false&fields=id,name,favorite,dashboardItems[id,resources[id, name],type,shape,x,y,width,height,text,visualization[id,displayName],map[id,displayName],eventReport[id,displayName],eventChart[id,displayName]]";

export default function Chart({
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

  //load the list of charts
  React.useEffect(() => {
    fetch(encodeURI(url))
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        let jsonData = JSON.parse(data);
        let dashboards_json = jsonData.dashboards.map((_dashboard) => {
          return {
            ..._dashboard,
            dashboardItems: _dashboard.dashboardItems.map((item) => {
              return { ...item, _id: item.id };
            }),
          };
        });
        setDashboards(dashboards_json);
        setLoading(false);
        const params = new URLSearchParams(window.location.search);
        const dashboardId = params.get("dashboard");
        const dashboardItemId = params.get("dashboardItemId");
        const favoriteDashboard = dashboards_json.find(
          (_dashboard) => _dashboard.favorite
        );

        if (favoriteDashboard) {
          setDashbaord(favoriteDashboard);
        }
        if (dashboardId) {
          const selectedDashboard = dashboards_json.find(
            (d) => d.id === dashboardId
          );
          if (selectedDashboard && dashboardItemId) {
            const selectedDashboardItem = selectedDashboard.dashboardItems.find(
              (d) =>
                d._id === dashboardItemId ||
                d[d.type.toLowerCase()].id === dashboardItemId
            );

            setDashbaord({
              ...selectedDashboard,
              dashboardItems: [selectedDashboardItem],
            });
          } else if (selectedDashboard) {
            setDashbaord(selectedDashboard);
          }
        }
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

    // Send a custom event
    ReactGA.event({
      category: "select_dashboard",
      action: "select_dashboard",
      value: 1,
      label: dashboard.name + "[" + dashboard.id + "]",
      nonInteraction: false,
      transport: "xhr",
    });

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
    hideEmptyCharts,
    indicator,
    phase
  ) => {
    setFilters({
      orgunits: orgunitFilters,
      orgunitGroup: orgunitGroupFilters,
      orgunitLevel: orgunitLevelFilters,
      hideEmptyCharts: hideEmptyCharts,
      indicator: indicator,
      phase: phase,
    });
  };

  return (
    <React.Fragment>
      <Filters
        dashboard={dashboard}
        filters={filters}
        handelFilterSelect={handelFilterSelect}
        loading={loading}
        dashboardMenuList={dashboardMenuList}
      ></Filters>

      <DashboardItems
        savedReports={savedReports}
        setSavedReports={setSavedReports}
        items={
          selectedSavedChart ? selectedSavedChart : dashboard?.dashboardItems
        }
        filters={filters}
      ></DashboardItems>
    </React.Fragment>
  );
}
