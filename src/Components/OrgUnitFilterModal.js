import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import OrgUnitFilter from "./OrgUnitFilter"; 
import { Typography, Box, CircularProgress } from "@mui/material";

const OrgUnitFilterModal = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const apiBase = "https://hmis.dhis.et/";

  const fetchData = async () => {
    const url = `${apiBase}api/40/organisationUnits/b3aCK1PTn5S?fields=displayName, path, id, children%5Bid%2Cpath%2CdisplayName%5D`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const fetchedData = await response.json();
    console.log("fetched data_", fetchedData);
    const updatedData = await hasChildren(fetchedData.children);
    console.log("fetched data", updatedData);
    setData({ ...fetchedData, children: updatedData });
  };

  const hasChildren = async (nodes) => {
    for (const node of nodes) {
      const urlChildren = `${apiBase}api/40/organisationUnits/${node.id}?fields=path,children%3A%3Asize`;
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

  const handleClickOpen = () => {
    fetchData();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box minHeight="2rem">
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        OrgUnitFilter
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography
            sx={{ padding: "10px", fontWeight: "bold", fontSize: "1.2rem" }}
          >
            Organization Unit
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {data ? (
            <OrgUnitFilter data={data} />
          ) : (
            <CircularProgress size={24} />
          )}
        </DialogContent>
        <DialogActions>
          <Button color={"primary"} autoFocus onClick={handleClose}>
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
