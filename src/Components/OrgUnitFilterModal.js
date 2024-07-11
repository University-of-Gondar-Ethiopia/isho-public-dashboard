import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import OrgUnitFilter from "./OrgUnitFilter";
import { Typography, Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";

const OrgUnitFilterModal = ({ onConfirmed }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [orgUnitGroups, setOrgUnitGroups] = useState([]);
  const [orgUnitLevels, setOrgUnitLevels] = useState([]);
  const apiBase = process.env.REACT_APP_BASE_URI;
  const [selected, setSelected] = useState([]);
  const [selectedOrgUnitGroup, setSelectedOrgUnitGroup] = useState([]);
  const [selectedOrgUnitLevel, setSelectedOrgUnitLevel] = useState([]);

  const fetchData = async () => {
    const url = `${apiBase}api/organisationUnits/b3aCK1PTn5S?fields=displayName, path, id, children%5Bid%2Cpath%2CdisplayName%5D`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const fetchedData = await response.json();
    const updatedData = await hasChildren(fetchedData.children);
    setData({ ...fetchedData, children: updatedData });
  };

  const fetchOrgUnitGroups = async () => {
    const url = `${apiBase}api/organisationUnitGroups?paging=false`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    setOrgUnitGroups(data.organisationUnitGroups);
  };

  const fetchOrgUnitLevels = async () => {
    const url = `${apiBase}api/organisationUnitLevels?paging=false`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    setOrgUnitLevels(data.organisationUnitLevels);
  };

  const hasChildren = async (nodes) => {
    for (const node of nodes) {
      const urlChildren = `${apiBase}api/organisationUnits/${node.id}?fields=path,children%3A%3Asize`;
      const response = await fetch(urlChildren);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (parseInt(data.children) > 0) {
        node.hasChildren = true;
      }
    }
    return nodes;
  };

  useEffect(() => {
    fetchData();
    fetchOrgUnitGroups();
    fetchOrgUnitLevels();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirmed(selected, selectedOrgUnitGroup, selectedOrgUnitLevel);
    setOpen(false);
  };

  const handelClearFitler = () => {
    setSelected([]);
    setSelectedOrgUnitGroup([]);
    setSelectedOrgUnitLevel([]);
    handleConfirm();
  };

  const filterCount =
    selected.length + selectedOrgUnitGroup.length + selectedOrgUnitLevel.length;
  const hasFilters = filterCount > 0;

  return (
    <Box minHeight="2rem">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
          marginRight: " 2%",
          gap: "2%",
        }}
      >
        <Tooltip
          arrow={false}
          color="neutral"
          placement="bottom"
          size="sm"
          variant="plain"
          title="Apply Filter"
        >
          <IconButton
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleClickOpen}
            aria-label="filter org unit"
          >
            <Badge
              badgeContent={filterCount}
              color="secondary"
              visiable={hasFilters}
              title="Number of Filters Applied"
            >
              <FilterListIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {hasFilters ? (
          <Tooltip
            arrow={false}
            color="neutral"
            placement="bottom"
            size="sm"
            variant="plain"
            title="Clear Filter"
          >
            <IconButton
              size="small"
              variant="outlined"
              aria-label="clear filter"
              color="secondary"
              onClick={handelClearFitler}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        ) : (
          ""
        )}
      </div>
      <Dialog
        sx={{ minHeight: "50vh", padding: "10px" }}
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography
            sx={{ padding: "10px", fontWeight: "bold", fontSize: "1.2rem" }}
          >
            Organization Unit
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "50vh", padding: "10px" }} dividers>
          {data ? (
            <OrgUnitFilter
              data={data}
              orgUnitGroups={orgUnitGroups}
              orgUnitLevels={orgUnitLevels}
              selected={selected}
              setSelected={setSelected}
              selectedOrgUnitGroup={selectedOrgUnitGroup}
              setSelectedOrgUnitGroup={setSelectedOrgUnitGroup}
              selectedOrgUnitLevel={selectedOrgUnitLevel}
              setSelectedOrgUnitLevel={setSelectedOrgUnitLevel}
            />
          ) : (
            <CircularProgress size={24} />
          )}
        </DialogContent>
        <DialogActions>
          <Button color={"primary"} autoFocus onClick={handleConfirm}>
            Confirm
          </Button>
          <Button color={"inherit"} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrgUnitFilterModal;
