import React, { useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
          {group.displayName}
        </MenuItem>
      );
    });
  };

  const renderOrgUnitLevels = () => {
    return orgUnitLevels.map((level) => {
      return (
        <MenuItem id={level.id} value={level.id}>
          {level.displayName}
        </MenuItem>
      );
    });
  };

  const handleGroupChange = (event) => {
    setSelectedOrgUnitGroup(event.target.value);
  };
  const handleLevelChange = (event) => {
    setSelectedOrgUnitLevel(event.target.value);
  };

  return (
    <Box display="flex" gap={2} width="100%">
      <FormControl fullWidth>
        <InputLabel id="select-level">Select Level</InputLabel>
        <Select
          labelId="select-level"
          label="Select Level"
          fullWidth
          value={selectedOrgUnitLevel}
          onChange={handleLevelChange}
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
          value={selectedOrgUnitGroup}
          onChange={handleGroupChange}
        >
          {renderOrgUnitGroups()}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LevelGroupOrgUnitFilter;
