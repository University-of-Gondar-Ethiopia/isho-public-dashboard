// import React from "react";
// import { EChart } from "@kbox-labs/react-echarts";
// import { HeatmapChart, CustomChart } from "echarts/charts";
// import { CanvasRenderer } from "echarts/renderers";
// import { GridComponent } from "echarts/components";

// const Map = () => {
//   const coordinates = [
//     [
//       [100, 0], // Example polygon coordinates
//       [101, 0],
//       [101, 1],
//       [100, 1],
//       [100, 0],
//     ],
//     // Add more polygons as needed
//   ];

//   const option = {
//     title: {
//       text: "map component coming soon",
//       subtext: "test",
//       sublink: "",
//       left: "right",
//     },
//     series: [
//       {
//         type: "custom",
//         coordinateSystem: "geo",
//         renderItem: (params, api) => {
//           const points = [];
//           for (let i = 0; i < coordinates.length; i++) {
//             const coord = coordinates[i].map((coord) => api.coord(coord));
//             points.push(coord);
//           }
//           return {
//             type: "polygon",
//             shape: {
//               points: points,
//             },
//             style: {
//               fill: "#f00",
//             },
//           };
//         },
//       },
//     ],
//   };

//   return (
//     <div style={{ width: "100%", height: "500px" }}>
//       here is the map component
//       <EChart
//         use={[CanvasRenderer, GridComponent]}
//         option={option}
//         series={[
//           {
//             type: "custom",
//             coordinateSystem: "geo",
//             renderItem: (params, api) => {
//               const points = [];
//               for (let i = 0; i < coordinates.length; i++) {
//                 const coord = coordinates[i].map((coord) => api.coord(coord));
//                 points.push(coord);
//               }
//               return {
//                 type: "polygon",
//                 shape: {
//                   points: points,
//                 },
//                 style: {
//                   fill: "#f00",
//                 },
//               };
//             },
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default Map;

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import chroma from "chroma-js";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Legend from "./Legend";

const CustomControl = ({ tileLayer, setTileLayer, tileLayers }) => {
  const map = useMap();

  useEffect(() => {
    const controlDiv = L.DomUtil.create(
      "div",
      "leaflet-control-layers leaflet-control"
    );

    const formControl = (
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
        <InputLabel id="tile-layer-select-label">Base Map</InputLabel>
        <Select
          labelId="tile-layer-select-label"
          id="tile-layer-select"
          value={tileLayer}
          onChange={(e) => setTileLayer(e.target.value)}
          label="Base Map"
        >
          {Object.keys(tileLayers).map((layer) => (
            <MenuItem key={layer} value={layer}>
              {layer}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );

    ReactDOM.render(formControl, controlDiv);

    const customControl = L.control({ position: "topright" });
    customControl.onAdd = () => controlDiv;
    customControl.addTo(map);

    return () => {
      customControl.remove();
    };
  }, [map, tileLayer, setTileLayer, tileLayers]);

  return null;
};

const Map = ({ shape, chartConfig, colorScale = null, opacity }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [tileLayer, setTileLayer] = useState("osm");

  const mapData = chartConfig.series;
  const regionList = chartConfig?.yAxis?.categories;
  const numColors = regionList?.length;
  console.log("regionList", regionList);

  // Combine data from all series
  const combinedData = mapData?.reduce((acc, series) => {
    return series.data.map((value, index) => (acc[index] || 0) + value);
  }, []);
  console.log("combine data", combinedData);
  let mn, mx, range;
  if (combinedData) {
    mn = Math.min(...combinedData);
    mx = Math.max(...combinedData);
    range = mx - mn;
  }

  const colorScaleArray = chroma
    .scale(colorScale?.split(","))
    .domain([mn, mx])
    .colors(numColors);

  // Assign colors to regions
  const regionColors = regionList?.map((regionName, index) => {
    const value = combinedData[index];
    const colorIndex = Math.floor(((value - mn) / range) * (numColors - 1));
    return {
      region: regionName,
      value: value,
      color: colorScaleArray[colorIndex],
    };
  });

  console.log("regionColors", regionColors);

  const handleMouseEnter = (e, region) => {
    setHoveredRegion(region);
    e.target.setStyle({
      weight: 5,
    });
  };

  const handleMouseLeave = (e) => {
    setHoveredRegion(null);
    e.target.setStyle({
      weight: 2,
      fillOpacity: opacity,
    });
  };

  const flattenCoordinates = (arr) => {
    return arr.reduce(
      (acc, val) =>
        Array.isArray(val[0])
          ? acc.concat(flattenCoordinates(val))
          : acc.concat([val]),
      []
    );
  };

  const parseCoordinates = (co) => {
    const parsed = JSON.parse(co);
    return parsed.map((polygon) =>
      flattenCoordinates(polygon).map(([lng, lat]) => [lat, lng])
    );
  };

  useEffect(() => {
    let bounds = L.latLngBounds([]);
    shape?.forEach((region) => {
      const coordinates = parseCoordinates(region.co);
      coordinates.forEach((polygon) => {
        bounds.extend(polygon);
      });
    });
    setMapBounds(bounds);
  }, [shape]);

  if (!mapBounds) {
    return null;
  }

  const calculatePolygonArea = (polygon) => {
    let area = 0;
    const numPoints = polygon.length;
    for (let i = 0; i < numPoints; i++) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[(i + 1) % numPoints];
      area += x1 * y2 - y1 * x2;
    }
    return Math.abs(area / 2);
  };

  const totalRegions = shape.length;

  const sortedShape = shape.slice().sort((a, b) => {
    const areaA = parseCoordinates(a.co).reduce(
      (sum, polygon) => sum + calculatePolygonArea(polygon),
      0
    );
    const areaB = parseCoordinates(b.co).reduce(
      (sum, polygon) => sum + calculatePolygonArea(polygon),
      0
    );
    return areaB - areaA;
  });

  const tileLayers = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    },
    osmLight: {
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors',
    },
    darkBaseMap: {
      url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attributions">CARTO</a>',
    },
  };

  return (
    <MapContainer bounds={mapBounds} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url={tileLayers[tileLayer].url}
        attribution={tileLayers[tileLayer].attribution}
      />
      <CustomControl
        tileLayer={tileLayer}
        setTileLayer={setTileLayer}
        tileLayers={tileLayers}
      />
      <Legend
        colorScaleArray={colorScaleArray}
        mn={mn}
        mx={mx}
        numColors={numColors}
        regionColors={regionColors}
      />
      {sortedShape?.map((region, index) => {
        const coordinates = parseCoordinates(region.co);
        const regionColor = regionColors?.find((rc) => rc.region === region.na);
        const color = regionColor ? regionColor.color : "#000";
        return coordinates.map((polygon, polygonIndex) => (
          <Polygon
            key={`${region.id}-${polygonIndex}`}
            positions={polygon}
            fillColor={color}
            color={"#000"}
            fillOpacity={opacity}
            weight={1}
            eventHandlers={{
              mouseover: (e) => handleMouseEnter(e, region),
              mouseout: (e) => handleMouseLeave(e),
            }}
          >
            <Tooltip>
              <span>{`${region.na}`}</span>
              {regionList?.map(
                (name, num) =>
                  name === region.na &&
                  mapData.map(
                    (regionData) => (
                      console.log("regionData", name),
                      (
                        <li key={num}>
                          {regionData.label} : {regionData.data[num]}
                        </li>
                      )
                    )
                  )
              )}
            </Tooltip>
          </Polygon>
        ));
      })}
    </MapContainer>
  );
};

export default Map;
