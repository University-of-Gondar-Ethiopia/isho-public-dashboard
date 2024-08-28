import React from "react";
import { ResponsiveRadar } from "@nivo/radar";

const RadarChartComponent = ({ chartData }) => {
  const keys = Array.from(
    new Set(
      chartData.rows.map((row) => chartData.metaData.items[`${row[0]}`].name)
    )
  );

  const data = chartData.metaData.dimensions.pe.map((period) => {
    const dataObject = { metric: chartData.metaData.items[period].name };
    chartData.rows.forEach((row) => {
      if (row[1] === period) {
        const keyName = chartData.metaData.items[`${row[0]}`].name;
        dataObject[keyName] = row[2];
      } else {
        keys.forEach((key) => {
          if (!dataObject[key]) {
            dataObject[key] = null;
          }
        });
      }
    });
    return dataObject;
  });
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ResponsiveRadar
        data={data}
        keys={keys}
        indexBy="metric"
        // maxValue={300}
        margin={{ top: 50, right: 70, bottom: 110, left: 80 }}
        curve="linear"
        borderWidth={2}
        borderColor={{ from: "color" }}
        gridLevels={chartData.width}
        gridShape="circular"
        gridLabelOffset={36}
        enableDots={true}
        dotSize={8}
        dotColor={{ theme: "background" }}
        dotBorderWidth={2}
        dotBorderColor={{ from: "color" }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: "set2" }}
        fillOpacity={0}
        blendMode="multiply"
        animate={true}
        motionConfig="wobbly"
        isInteractive={true}
        legends={[
          {
            // anchor: "bottom",
            direction: "column",
            translateX: 50,
            translateY: 350,
            itemWidth: 80,
            itemHeight: 20,
          },
        ]}
      />
    </div>
  );
};

export default RadarChartComponent;
