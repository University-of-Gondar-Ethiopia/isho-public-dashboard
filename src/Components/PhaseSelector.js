// orgunit selector component
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { useEffect } from "react";
import React from "react";

const phases = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "Phase 1",
  },
  {
    id: 2,
    name: "Phase 2",
  },
  {
    id: 3,
    name: "Phase 3",
  },
  {
    id: 4,
    name: "Phase 4",
  },
  {
    id: 5,
    name: "Phase 5",
  },
  {
    id: 6,
    name: "Phase 6",
  },
];

const PhaseMenuList = () => {
  return phases.map((phase) => (
    <MenuItem key={phase.id} value={phase}>
      {phase.name}
    </MenuItem>
  ));
};

const PhaseSelector = ({ filters, handelFilterSelect }) => {
  let [phase, setPhase] = React.useState(phases[0]);

  const handlePhaseChange = (event) => {
    console.log(event.target.value);
    setPhase(event.target.value);
    handelFilterSelect(
      filters?.orgunits,
      filters?.orgunitGroup,
      filters?.orgunitLevel,
      filters?.hideEmptyCharts,
      filters?.indicator,
      event.target.value
    );
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="phase-select-label">{"Select Phase"}</InputLabel>
      <Select
        labelId="phase-select-label"
        value={phase}
        label="Select Phase"
        onChange={handlePhaseChange}
      >
        {PhaseMenuList()}
      </Select>
    </FormControl>
  );
};

export default PhaseSelector;
