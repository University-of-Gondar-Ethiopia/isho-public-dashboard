import React, { useState } from "react";
import { Box, Checkbox, CircularProgress, Typography } from "@mui/material";
import { SimpleTreeView, TreeItem, treeItemClasses } from "@mui/x-tree-view";
import { styled, alpha } from "@mui/material/styles";
import FolderIcon from "@mui/icons-material/Folder";

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const OrgUnitFilter = (props) => {
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState({ ...props.data });
  const apiBase = "https://hmis.dhis.et/";

  const fetchData = async (nodeId) => {
    const url = `${apiBase}api/40/organisationUnits/${nodeId}?fields=displayName,path,id,children%5Bid%2Cpath%2CdisplayName%5D`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  };

  const handleToggle = async (event, nodeIds) => {
    setExpanded(nodeIds);

    const nodeId = nodeIds;
    const fetchedData = await fetchData(nodeId);
    const updatedDataChildren = await hasChildren(fetchedData.children);
    const updatedData = { ...fetchedData, children: updatedDataChildren };
    const paths = updatedData.path.split("/").slice(2);
    const newData = updateData(paths, updatedData);
    setData(newData);
    console.log("newChildren", newData);
  };

  const updateData = (path, updatedData) => {
    let tempData = { ...data };

    const addChildren = (node, i) => {
      if (i === path.length) {
        return { ...node, children: updatedData.children };
      }

      if (!node.children) {
        return node;
      }

      const updatedChildren = node.children.map((child) => {
        if (child.id === path[i]) {
          return addChildren(child, i + 1);
        }
        return child;
      });

      return { ...node, children: updatedChildren };
    };

    tempData = addChildren(tempData, 0);
    console.log("tempData++", tempData);
    return tempData;
  };

  const hasChildren = async (nodes) => {
    for (const node of nodes) {
      const urlChildren = `${apiBase}api/40/organisationUnits/${node.id}?fields=path,children%3A%3Asize`;
      const response = await fetch(urlChildren);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      node.hasChildren = parseInt(data.children) > 0;
    }
    return nodes;
  };

  const handleSelect = (event, nodeId) => {
    const isChecked = event.target.checked;
    setSelected((prevSelected) =>
      isChecked
        ? [...prevSelected, nodeId]
        : prevSelected.filter((id) => id !== nodeId)
    );
  };

  const renderTree = (nodes) => (
    <CustomTreeItem
      key={nodes.id}
      itemId={nodes.id}
      label={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={selected.includes(nodes.id)}
            onChange={(event) => handleSelect(event, nodes.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <FolderIcon />
          <Typography variant="body2" ml={1}>
            {nodes.displayName}
          </Typography>
        </Box>
      }
    >
      {Array.isArray(nodes.children) ? (
        nodes.children.map((node) => renderTree(node))
      ) : nodes.hasChildren ? (
        <CircularProgress size={24} />
      ) : null}
    </CustomTreeItem>
  );

  return (
    <Box>
      <SimpleTreeView
        onItemExpansionToggle={handleToggle}
        multiSelect
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          overflow: "auto",
        }}
      >
        {renderTree(data)}
      </SimpleTreeView>
    </Box>
  );
};

export default OrgUnitFilter;
