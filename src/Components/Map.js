import React from "react";
import { EChart } from "@kbox-labs/react-echarts";
import { HeatmapChart, CustomChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent } from "echarts/components";

const Map = () => {
  const coordinates = [
    [
      [100, 0], // Example polygon coordinates
      [101, 0],
      [101, 1],
      [100, 1],
      [100, 0],
    ],
    // Add more polygons as needed
  ];

  const option = {
    title: {
      text: "map component coming soon",
      subtext: "test",
      sublink: "",
      left: "right",
    },
    series: [
      {
        type: "custom",
        coordinateSystem: "geo",
        renderItem: (params, api) => {
          const points = [];
          for (let i = 0; i < coordinates.length; i++) {
            const coord = coordinates[i].map((coord) => api.coord(coord));
            points.push(coord);
          }
          return {
            type: "polygon",
            shape: {
              points: points,
            },
            style: {
              fill: "#f00",
            },
          };
        },
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <EChart
        use={[CanvasRenderer, GridComponent]}
        option={option}
        series={[
          {
            type: "custom",
            coordinateSystem: "geo",
            renderItem: (params, api) => {
              const points = [];
              for (let i = 0; i < coordinates.length; i++) {
                const coord = coordinates[i].map((coord) => api.coord(coord));
                points.push(coord);
              }
              return {
                type: "polygon",
                shape: {
                  points: points,
                },
                style: {
                  fill: "#f00",
                },
              };
            },
          },
        ]}
      />
    </div>
  );
};

export default Map;
