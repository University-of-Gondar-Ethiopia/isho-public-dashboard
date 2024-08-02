import React, { useState, useEffect } from "react";
import { Paper, Box } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useMap } from "react-leaflet";
import ReactDOM from "react-dom";
import L from "leaflet";
import chroma from "chroma-js";

const Legend = ({ colorScaleArray, mn, mx, numColors, regionColors }) => {
  const [showDetails, setShowDetails] = useState(false);
  const map = useMap();

  const intervalCount = 5; // Number of intervals you want to display
  const intervalSize = (mx - mn) / intervalCount;

  const intervals = Array.from({ length: intervalCount }, (_, i) => {
    const start = mn + i * intervalSize;
    const end = mn + (i + 1) * intervalSize;
    return { start, end };
  });

  const counts = intervals.map(
    ({ start, end }) =>
      regionColors?.filter(({ value }) => value >= start && value < end).length
  );

  const midpointColors = intervals.map(({ start, end }) => {
    const midpoint = (start + end) / 2;
    return chroma.scale(colorScaleArray).domain([mn, mx])(start).hex();
  });

  const handleClick = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    const legendDiv = L.DomUtil.create("div", "info legend");

    const legendItems = intervals.map(({ start, end }, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          padding: 2,
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: midpointColors[index],
            marginRight: "8px",
            border: "1px solid #999",
          }}
        ></div>
        <span>{`${start.toFixed(2)} - ${end.toFixed(2)} (${
          counts[index]
        })`}</span>
      </div>
    ));

    const legendContent = (
      <Paper
        elevation={1}
        sx={{ padding: 0.5 }}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <Box display="flex" alignItems="center" m={0.5}>
          <FormatListBulletedIcon />
          {showDetails ? " Legend" : ""}
        </Box>

        {showDetails && legendItems}
      </Paper>
    );

    ReactDOM.render(legendContent, legendDiv);

    const legendControl = L.control({ position: "bottomright" });
    legendControl.onAdd = () => legendDiv;
    legendControl.addTo(map);

    return () => {
      legendControl.remove();
    };
  }, [map, showDetails, intervals, midpointColors, counts]);

  return null;
};

export default Legend;
