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
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FormControl, InputLabel, MenuItem, Select, SvgIcon } from "@mui/material";
import ReactDOMServer from "react-dom/server";
import { Home as HomeIcon, LocalHospital as LocalHospitalIcon, Room as RoomIcon } from "@mui/icons-material";
import Legend from "./Legend";
import { useMapLogic } from "../hooks/useMapLogic";

const TileLayerControl = ({ tileLayer, setTileLayer, tileLayers }) => {
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

const createCustomIcon = (iconComponent, color) =>
  new L.DivIcon({
    html: ReactDOMServer.renderToString(
      <SvgIcon component={iconComponent} style={{ color }} />
    ),
    className: "",
    iconSize: [10, 10],
  });

const Map = ({ mapViews, chartDatas, shapes, basemap }) => {
  const [tileLayer, setTileLayer] = useState(basemap === 'none' ? "osm" : basemap);
  console.log("tile layer", tileLayer);

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
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    darkBaseMap: {
      url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attributions">CARTO</a>',
    },
  };

  const {
    parsedMapViews,
    parseCoordinates,
    handleMouseEnter,
    handleMouseLeave,
    hoveredRegion,
    mapBounds,
  } = useMapLogic(mapViews, chartDatas, shapes);

  if (!mapBounds) return null;

  const renderFacilityMarkers = (viewData) =>
    viewData.sortedShape.map((region, regionIndex) => {
      const coordinates = parseCoordinates(region.co);
      const [lat, lng] = coordinates[0][0];
      const regionType = region.na.split(" ").pop().toLowerCase();

      const markerIcons = {
        hospital: createCustomIcon(LocalHospitalIcon, "red"),
        clinic: createCustomIcon(RoomIcon, "red"),
        healthpost: createCustomIcon(RoomIcon, "blue"),
        healthcenter: createCustomIcon(HomeIcon, "green"),
      };

      const markerIcon = markerIcons[regionType] || markerIcons.healthcenter;

      return (
        <Marker key={`${region.id}-${regionIndex}`} position={[lat, lng]} icon={markerIcon}>
          <Popup>
            <span>{region.na}</span>
          </Popup>
        </Marker>
      );
    });

  const renderOrgUnitPolygons = (viewData) =>
    viewData.sortedShape.map((region, regionIndex) => {
      const coordinates = parseCoordinates(region.co);
      const opacity = 0;

      return coordinates.map((polygon, polygonIndex) => (
        <Polygon
          key={`${region.id}-${polygonIndex}-${regionIndex}`}
          positions={polygon}
          color="#000"
          fillOpacity={opacity}
          weight={2}
          eventHandlers={{
            mouseover: (e) => handleMouseEnter(e, region),
            mouseout: (e) => handleMouseLeave(e),
          }}
        >
          <Tooltip>
            {viewData.regionList
              .filter((name) => name === region.na)
              .map((name, num) =>
                viewData.mapData.map((regionData) => (
                  <li key={num}>
                    {regionData.label}: {regionData.data[num]}
                  </li>
                ))
              )}
            <span>{region.na}</span>
          </Tooltip>
        </Polygon>
      ));
    });

  const renderThematicPolygons = (viewData) =>
    viewData.sortedShape.map((region, regionIndex) => {
      const coordinates = parseCoordinates(region.co);
      const regionColor = viewData.regionColors.find((rc) => rc.region === region.na);
      const color = regionColor ? regionColor.color : "";
      const opacity = color ? viewData.opacity : 0;

      return coordinates.map((polygon, polygonIndex) => (
        <Polygon
          key={`${region.id}-${polygonIndex}-${regionIndex}`}
          positions={polygon}
          fillColor={color}
          color="#000"
          fillOpacity={opacity}
          weight={2}
          eventHandlers={{
            mouseover: (e) => handleMouseEnter(e, region),
            mouseout: (e) => handleMouseLeave(e),
          }}
        >
          <Tooltip>
            <span>
              {region.na}
              {viewData.regionList
                .filter((name) => name === region.na)
                .map((name, num) =>
                  viewData.mapData.map((regionData) => (
                    <li key={num}>
                      {regionData.label}: {regionData.data[num]}
                    </li>
                  ))
                )}
            </span>
          </Tooltip>
        </Polygon>
      ));
    });

  return (
    <MapContainer bounds={mapBounds} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url={tileLayers[tileLayer].url}
        attribution={tileLayers[tileLayer].attribution}
      />
      <TileLayerControl tileLayer={tileLayer} setTileLayer={setTileLayer} tileLayers={tileLayers} />

      {parsedMapViews.map((viewData) => {
        switch (viewData?.layer) {
          case "facility":
            return renderFacilityMarkers(viewData);
          case "orgUnit":
            return renderOrgUnitPolygons(viewData);
          case "thematic":
            return renderThematicPolygons(viewData);
          default:
            return null;
        }
      })}

      
      {/* <Legend
        colorScaleArray={parsedMapViews[0]?.colorScaleArray}
        mn={Math.min(
          ...parsedMapViews.map((v) =>
            Math.min(...v?.mapData.map((d) => Math.min(...d.data)))
          )
        )}
        mx={Math.max(
          ...parsedMapViews.map((v) =>
            Math.max(...v?.mapData.map((d) => Math.max(...d.data)))
          )
        )}
        numColors={parsedMapViews[0]?.regionColors?.length || 0}
        regionColors={parsedMapViews[0]?.regionColors || []}
      /> */}
    </MapContainer>
  );
};

export default Map;

