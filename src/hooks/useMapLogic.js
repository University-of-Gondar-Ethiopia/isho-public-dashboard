import { useState } from "react";
import L from "leaflet";
import chroma from "chroma-js";
import { getItemName } from "../utils/common";

export const useMapLogic = (mapViews, chartDatas, shapes) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  let mapBounds = null;

  const processChartData = (chartData) => {
    const chartConfig = {
      series: [],
      yAxis: {
        categories: [],
        crosshair: true,
      },
    };

    if (chartData) {
      const rows = chartData.rows?.toSorted((a, b) => {
        let avalue = Number(a.length > 1 ? a[1] : a[0]);
        let bvalue = Number(b.length > 1 ? b[1] : b[0]);
        return avalue - bvalue;
      });

      if (!Array.isArray(rows)) {
        return chartConfig;
      }

      console.log("rows", rows);
      for (const row of rows) {
        chartConfig?.data?.push({
          label: getItemName(chartData, row[0]),
          value: Number(row[1]),
        });
      }

      let columnSeries = {};
      if (chartData) {
        for (const row of rows) {
          let n = getItemName(chartData, row[0]);
          let xAxisNames = getItemName(chartData, row[1]);

          if (!columnSeries[n]) {
            columnSeries[n] = [];
          }
          columnSeries[n].push(Number(row[2]));
          if (chartConfig.yAxis.categories.indexOf(xAxisNames) === -1) {
            chartConfig.yAxis.categories.push(xAxisNames);
          }
        }

        for (const key of Object.keys(columnSeries)) {
          chartConfig.series.push({
            data: columnSeries[key],
            label: key,
          });
        }
      }
    }
    return chartConfig;
  };

  const flattenCoordinates = (arr) => {
    if (!Array.isArray(arr[0])) {
      return [arr];
    }

    return arr?.reduce(
      (acc, val) =>
        Array.isArray(val[0])
          ? acc.concat(flattenCoordinates(val))
          : acc.concat([val]),
      []
    );
  };

  const parseCoordinates = (co) => {
    let parsed = JSON.parse(co);
    if (!Array.isArray(parsed[0])) {
      parsed = [parsed];
    }
    return parsed.map((polygon) =>
      flattenCoordinates(polygon).map(([lng, lat]) => [lat, lng])
    );
  };

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
    });
  };

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

  const processMapLayer = (
    chartConfig,
    displayName,
    shape,
    colorScale,
    opacity,
    layer
  ) => {
    console.log("inner chart config", chartConfig, layer);
    const mapData = chartConfig?.series;
    const regionList = chartConfig?.yAxis?.categories;
    const numColors = regionList?.length;

    const combinedData = mapData?.reduce((acc, series) => {
      return series.data.map((value, index) => (acc[index] || 0) + value);
    }, []);

    let mn, mx, range;
    let colorScaleArray;
    if (combinedData.length > 0) {
      mn = Math.min(...combinedData);
      mx = Math.max(...combinedData);
      range = mx - mn;
      colorScaleArray = chroma
        .scale(colorScale?.split(","))
        .domain([mn, mx])
        .colors(numColors);
    } else {
      // colorScaleArray = []
    }

    console.log("region color2", regionList, colorScale, colorScaleArray);

    const regionColors = regionList?.map((regionName, index) => {
      const value = combinedData[index];
      const colorIndex = Math.floor(((value - mn) / range) * (numColors - 1));
      return {
        region: regionName,
        value: value,
        color: colorScale && colorScaleArray[colorIndex],
      };
    });

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

    mapBounds = null;
    let bounds = L.latLngBounds([]);
    shape.forEach((region) => {
      let coordinates = parseCoordinates(region.co);
      coordinates.forEach((polygon) => {
        bounds.extend(polygon);
      });
    });
    mapBounds = bounds;

    return {
      sortedShape,
      displayName,
      regionColors,
      colorScaleArray,
      regionList,
      mapData,
      opacity,
      layer,
    };
  };

  const parsedMapViews = mapViews.map((view) => {
    const chartConfig = processChartData(chartDatas[view.id]);

    if (view.layer === "thematic" && chartConfig.series.length === 0) {
      return null;
    }
    console.log("chartConfig", chartConfig);
    console.log("view", "shape", shapes[view.id], view);
    return processMapLayer(
      chartConfig,
      view?.displayName,
      shapes[view.id],
      view?.colorScale ?? "#ffffd4,#fed98e,#fe9929,#d95f0e,#993404",
      view?.opacity,
      view.layer
    );
  });

  return {
    parsedMapViews,
    parseCoordinates,
    handleMouseEnter,
    handleMouseLeave,
    hoveredRegion,
    mapBounds,
  };
};

export default useMapLogic;
