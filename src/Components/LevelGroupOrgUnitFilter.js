import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";

const LevelGroupOrgUnitFilter = (props) => {
  const orgUnitGroups = props.orgUnitGroups;
  const orgUnitLevels = props.orgUnitLevels;
  const {
    selectedOrgUnitGroup,
    setSelectedOrgUnitGroup,
    selectedOrgUnitLevel,
    setSelectedOrgUnitLevel,
  } = props;

  const renderOrgUnitGroups = () => {
    return orgUnitGroups.map((group) => {
      return (
        <MenuItem key={group.id} value={group.id}>
          <Checkbox checked={selectedOrgUnitGroup.indexOf(group.id) > -1} />
          <ListItemText primary={group.displayName} />
        </MenuItem>
      );
    });
  };

  const renderOrgUnitLevels = () => {
    return orgUnitLevels.map((level) => {
      return (
        <MenuItem key={level.id} value={level.id}>
          <Checkbox checked={selectedOrgUnitLevel.indexOf(level.id) > -1} />
          <ListItemText primary={level.displayName} />
        </MenuItem>
      );
    });
  };

  const handleGroupChange = (event) => {
    const value = event.target.value;
    setSelectedOrgUnitGroup(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleLevelChange = (event) => {
    const value = event.target.value;
    setSelectedOrgUnitLevel(
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Box display="flex" gap={2} width="100%">
      <FormControl fullWidth>
        <InputLabel id="select-level">Select Level</InputLabel>
        <Select
          labelId="select-level"
          label="Select Level"
          fullWidth
          multiple
          value={selectedOrgUnitLevel}
          onChange={handleLevelChange}
          renderValue={(selected) =>
            selected
              .map(
                (id) =>
                  orgUnitLevels.find((level) => level.id === id).displayName
              )
              .join(", ")
          }
        >
          {renderOrgUnitLevels()}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="select-group">Select Group</InputLabel>
        <Select
          labelId="select-group"
          label="Select Group"
          fullWidth
          multiple
          value={selectedOrgUnitGroup}
          onChange={handleGroupChange}
          renderValue={(selected) =>
            selected
              .map(
                (id) =>
                  orgUnitGroups.find((group) => group.id === id).displayName
              )
              .join(", ")
          }
        >
          {renderOrgUnitGroups()}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LevelGroupOrgUnitFilter;
