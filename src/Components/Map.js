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
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import chroma from "chroma-js";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CustomControl = ({ tileLayer, setTileLayer, tileLayers }) => {
  const map = useMap();

  useEffect(() => {
    const controlDiv = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');

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
          <MenuItem value="osm">OSM</MenuItem>
          <MenuItem value="satellite">Satellite</MenuItem>
          <MenuItem value="osmLight">OSM Light</MenuItem>
          
        </Select>
      </FormControl>
    );

    ReactDOM.render(formControl, controlDiv);

    const customControl = L.control({ position: 'topright' });
    customControl.onAdd = () => controlDiv;
    customControl.addTo(map);

    return () => {
      customControl.remove();
    };
  }, [map, tileLayer, setTileLayer, tileLayers]);

  return null;
};

const Map = ({ shape, chartConfig }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [tileLayer, setTileLayer] = useState("osm");
  console.log("shape in map", shape)

  const mapData = chartConfig.series;
  const regionList = chartConfig.yAxis;

  const handleMouseEnter = (region) => {
    setHoveredRegion(region);
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
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
    const flattened = flattenCoordinates(parsed);
    return [flattened.map(([lng, lat]) => [lat, lng])];
  };

  const getColor = (index, total) => {
    const scale = chroma
      .scale(["#000", "#fff"])
      .domain([0, 1]);
    return scale(index / (totalRegions - 1)).hex();
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

  const totalRegions = shape.length;
  let regionIndex;

  const tileLayers = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    },
    osmLight: {
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors',
    },

    
  };

  return (
    <MapContainer bounds={mapBounds} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url={tileLayers[tileLayer].url}
        attribution={tileLayers[tileLayer].attribution}
      />
      <CustomControl tileLayer={tileLayer} setTileLayer={setTileLayer} tileLayers={tileLayers} />
      {shape?.map((region, index) => {
        const coordinates = parseCoordinates(region.co);
        const color = getColor(index, totalRegions);
        return coordinates.map((polygon, polygonIndex) => (
          <Polygon
            key={`${region.id}-${polygonIndex}`}
            positions={polygon}
            color={color}
            fillOpacity={0.9}
            weight={2}
            eventHandlers={{
              mouseover: () => handleMouseEnter(region),
              mouseout: handleMouseLeave,
            }}
          >
            <Tooltip>
              <span>{`${region.na} - ${region.pn}`}</span>
              {regionList.categories.find((name, num) => {
                if (name === region.na) {
                  regionIndex = num;
                }
              })}
              <span>
                {mapData.map((regionData) => {
                  return (
                    <li key={regionIndex}>
                      {regionData.label} : {regionData.data[regionIndex]}
                    </li>
                  );
                })}
              </span>
            </Tooltip>
          </Polygon>
        ));
      })}
    </MapContainer>
  );
};

export default Map;
