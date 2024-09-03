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
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SvgIcon,
} from "@mui/material";
import ReactDOMServer from "react-dom/server";
import {
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import Legend from "./Legend";
import { useMapLogic } from "../hooks/useMapLogic";
import RoomIcon from "@mui/icons-material/ControlPoint";
import HealthPostIcon from "@mui/icons-material/MedicalInformation";

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

const WhiteTileLayer = L.GridLayer.extend({
  createTile: function (coords) {
    const tile = document.createElement("div");
    tile.style.width = "256px";
    tile.style.height = "256px";
    tile.style.background = "white";
    return tile;
  },
});

const BlankWhiteLayer = () => {
  const map = useMap();

  useEffect(() => {
    const whiteLayer = new WhiteTileLayer();
    whiteLayer.addTo(map);

    return () => {
      map.removeLayer(whiteLayer);
    };
  }, [map]);

  return null;
};

const Map = ({ mapViews, chartDatas, shapes, basemap }) => {
  console.log("mapViews here", mapViews);
  const [tileLayer, setTileLayer] = useState(
    basemap === "none" ? "osm" : basemap
  );
  const legendData = [];
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
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    },

    darkBaseMap: {
      url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attributions">CARTO</a>',
    },
    blankWhite: {
      url: null,
      attribution: "",
      layer: new WhiteTileLayer(),
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

  const renderFacilityMarkers = (viewData) => {
    legendData.push({
      name: "facility",
      hospital: 0,
      clinic: 0,
      post: 0,
      center: 0,
    });

    return viewData.sortedShape.map((region, regionIndex) => {
      const coordinates = parseCoordinates(region.co);
      const [lat, lng] = coordinates[0][0];
      const regionType = region.na.split(" ").pop().toLowerCase();
      const currentLegendData = legendData[legendData.length - 1];

      if (currentLegendData.hasOwnProperty(regionType)) {
        currentLegendData[regionType] += 1;
      } else {
        currentLegendData["center"] += 1;
      }

      const markerIcons = {
        hospital: createCustomIcon(LocalHospitalIcon, "red"),
        clinic: createCustomIcon(RoomIcon, "red"),
        healthpost: createCustomIcon(HealthPostIcon, "blue"),
        healthcenter: createCustomIcon(HomeIcon, "green"),
      };

      const markerIcon = markerIcons[regionType] || markerIcons.healthcenter;

      return (
        <Marker
          key={`${region.id}-${regionIndex}`}
          position={[lat, lng]}
          icon={markerIcon}
        >
          <Popup>
            <span>{region.na}</span>
          </Popup>
        </Marker>
      );
    });
  };

  const renderOrgUnitPolygons = (viewData) => {
    legendData.push({
      name: "orgUnit",
    });

    return viewData.sortedShape.map((region, regionIndex) => {
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
  };

  const renderThematicPolygons = (viewData) => {
    console.log("hidden thematic", viewData);
    const legendMn = Math.min(
      ...viewData.mapData.map((d) => Math.min(...d.data))
    );
    const legendMx = Math.max(
      ...viewData.mapData.map((d) => Math.max(...d.data))
    );
    const legendNumColors = viewData.regionColors?.length || 0;
    const legendRegionColors = viewData.regionColors || [];
    console.log("mx and mn", legendMx, legendMn);
    legendData.push({
      name: "thematic",
      displayName: viewData.displayName,
      colorScaleArray: viewData.colorScaleArray,
      mn: legendMn,
      mx: legendMx,
      numColors: legendNumColors,
      regionColors: legendRegionColors,
    });

    return viewData.sortedShape.map((region, regionIndex) => {
      const coordinates = parseCoordinates(region.co);
      const regionColor = viewData.regionColors.find(
        (rc) => rc.region === region.na
      );
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
  };

  const renderBubbleMap = (viewData) => {
    const legendMn = Math.min(
      ...viewData.mapData.map((d) => Math.min(...d.data))
    );
    const legendMx = Math.max(
      ...viewData.mapData.map((d) => Math.max(...d.data))
    );

    const legendRegionColors = viewData.regionColors || [];
    console.log("mx and mn", legendMx, legendMn);

    legendData.push({
      name: "bubble",
      displayName: viewData.displayName,
      mn: legendMn,
      mx: legendMx,
      colorScaleArray: viewData.colorScaleArray,
      regionColors: legendRegionColors,
    });

    return viewData?.sortedShape?.map((region, regionIndex) => {
      const fetchedCoordinates = parseCoordinates(region.co);
      let lat = 0,
        lng = 0,
        length = 0;
      if (fetchedCoordinates.length > 0) {
        fetchedCoordinates.forEach((coord) =>
          coord.forEach((coordinates) => {
            lat += coordinates[0];
            lng += coordinates[1];
            length += 1;
          })
        );
      }
      const coordinates = [lat / length, lng / length];

      const regionListIndex = viewData.regionList.indexOf(region.na);

      const dataValue =
        regionListIndex !== -1 ? viewData.mapData[0].data[regionListIndex] : 0;

      // radius based on the data value
      const radius = (dataValue / (legendMx - legendMn)) * 70;

      // color for the region
      const regionColor = viewData.regionColors.find(
        (rc) => rc.region === region.na
      );
      const color = regionColor ? regionColor.color : "#3388ff";
      const opacity = viewData.opacity;

      return (
        <Circle
          key={`${region.id}-${regionIndex}`}
          center={coordinates}
          radius={radius * 1000}
          fillColor={color}
          color="#000"
          fillOpacity={opacity}
          weight={1}
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
        </Circle>
      );
    });
  };

  console.log("parsed_map order", parsedMapViews);


  const defaultBounds = L.latLngBounds([3.0, 33.0], [15.0, 48.0]);
  return (
    <MapContainer
      bounds={mapBounds.isValid() ? mapBounds : defaultBounds}
      style={{ height: "100%", width: "100%" }}
    >
      {tileLayer === "blankWhite" ? (
        <BlankWhiteLayer />
      ) : (
        <TileLayer
          url={tileLayers[tileLayer]?.url}
          attribution={tileLayers[tileLayer]?.attribution}
        />
      )}
      <TileLayerControl
        tileLayer={tileLayer}
        setTileLayer={setTileLayer}
        tileLayers={tileLayers}
      />

      {parsedMapViews?.map((viewData) => {
        switch (viewData?.layer) {
          case "facility":
            return renderFacilityMarkers(viewData);

          case "orgUnit":
            return renderOrgUnitPolygons(viewData);

          case "thematic":
            if (viewData?.thematicMapType === "BUBBLE") {
              return renderBubbleMap(viewData);

            } else if (viewData?.thematicMapType === "CHOROPLETH") {
              return renderThematicPolygons(viewData);
            }
            break;

          default:
            return null;
        }
      })}

      <Legend legendDatas={legendData} />
    </MapContainer>
  );
};

export default Map;
