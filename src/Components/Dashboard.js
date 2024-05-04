import * as React from "react";
import Grid from "@mui/material/Grid";
import Chart from "./Chart";

export default function Dashboard() {
  const [savedReports, setSavedReports] = React.useState(
    JSON.parse(localStorage.getItem("saved_reports"))
  );

  const [selectedSavedChart, setSelectedSavedChart] = React.useState(null);

  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Chart
        savedReports={savedReports}
        setSavedReports={setSavedReports}
        selectedSavedChart={selectedSavedChart}
        setSelectedSavedChart={setSelectedSavedChart}
      />
    </Grid>
  );
}
