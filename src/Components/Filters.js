// a component to filter dashbords

import * as React from "react";
import {
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";
import OrgUnitFilterModal from "./OrgUnitFilterModal";
import OrgunitSelector from "./OrgunitSelector";
import IndicatorSelector from "./IndicatorSelector";
import PhaseSelector from "./PhaseSelector";
export default function Filters(props) {
  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "max(2%,20px)",
        }}
      >
        <Grid item xs={12} md={3.8} lg={3.8}>
          <OrgunitSelector {...props}></OrgunitSelector>
        </Grid>

        <Grid item xs={12} md={3.8} lg={3.8}>
          <IndicatorSelector {...props}></IndicatorSelector>
        </Grid>

        <Grid item xs={12} md={3.8} lg={3.8}>
          <PhaseSelector {...props}></PhaseSelector>
        </Grid>
      </Paper>
    </Grid>
  );
}
