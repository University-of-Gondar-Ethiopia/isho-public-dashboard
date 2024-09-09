// orgunit selector component
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import React from "react";

const indicators = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "Vision , Policy and Governance",
  },
  {
    id: 2,
    name: "Skilled Workforce",
  },
  {
    id: 3,
    name: "Effective Information System",
  },
];

const IndicatorMenuList = () => {
  return indicators.map((indicator) => (
    <MenuItem key={indicator.id} value={indicator}>
      {indicator.name}
    </MenuItem>
  ));
};

const IndicatorSelector = ({ filters, handelFilterSelect }) => {
  let [indicator, setIndicator] = React.useState(indicators[0]);

  const handleIndicatorChange = (event) => {
    setIndicator(event.target.value);
    handelFilterSelect(
      filters?.orgunits,
      filters?.orgunitGroup,
      filters?.orgunitLevel,
      filters?.hideEmptyCharts,
      event.target.value,
      filters?.phase
    );
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="indicator-select-label">{"Select Indicator"}</InputLabel>
      <Select
        labelId="indicator-select-label"
        value={indicator}
        label="Select Indicator"
        onChange={handleIndicatorChange}
      >
        {IndicatorMenuList()}
      </Select>
    </FormControl>
  );
};

export default IndicatorSelector;
