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
export default function Filters({
  dashboard,
  handleChartChange,
  loading,
  dashboardMenuList,
  handelFilterSelect,
}) {
  return (
    <Grid item xs={12} md={10} lg={10}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "row",
          height: "400",
          flexWrap: "nowrap",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "2%",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            {"Select Dashboard"}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={dashboard?.id}
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

        <OrgUnitFilterModal onConfirmed={handelFilterSelect} />
      </Paper>
    </Grid>
  );
}
