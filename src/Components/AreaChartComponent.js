import React from "react";
import PropTypes from "prop-types";
import { LineChart } from "@mui/x-charts";
import { Typography } from "@mui/material";
import { ChartsReferenceLine } from "@mui/x-charts";

const AreaChartComponent = ({ chartData, chartInfo, item }) => {
  // Extract and transform the data for the AreaChart
  const getChartData = () => {
    const { headers, metaData, rows } = chartData;

    //
    console.log("chartData:", chartData);

    if (!metaData || !rows || rows.length === 0) {
      return { xData: [], seriesData: [] };
    }

    const periods = metaData.dimensions?.pe || [];
    const periodNames = periods.map((period) => metaData.items[period]?.name);

    const dataDimension = metaData.dimensions?.dx[0];
    const dataDimensionName = metaData.items[dataDimension]?.name;

    const valueIndex = headers.findIndex((header) => header.name === "value");

    
    console.log("periods:", periods);
    console.log("periodNames:", periodNames);
    console.log("dataDimension:", dataDimension);
    console.log("dataDimensionName:", dataDimensionName);
    console.log("valueIndex:", valueIndex);

    if (periods.length === 0 || !dataDimensionName || valueIndex === -1) {
      return { xData: [], seriesData: [] };
    }

    const xData = periodNames;
    const seriesData = periods.map((period) => {
      const row = rows.find((r) => r[1] === period);
      return row ? parseFloat(row[valueIndex]) : 0;
    });

    
    const isValidData = seriesData.every((value) => !isNaN(value));

    if (!isValidData) {
      console.error("Invalid data detected:", seriesData);
      return { xData: [], seriesData: [] };
    }

    return { xData, seriesData };
  };

  const { xData, seriesData } = getChartData();
  console.log("xData:", xData);
  console.log("seriesData:", seriesData);

  return (
    <>
          {xData.length > 0 && seriesData.length > 0 ? (
            <LineChart
              xAxis={[{ scaleType:'band' , data: xData }]}
              series={[{ data: seriesData, area: true , label: item.visualization.displayName}]}
              targetLine={chartInfo.targetLineValue}
              baseLine={chartInfo.baseLineValue}
            >
            {chartInfo.targetLineValue ? (
              <ChartsReferenceLine
                lineStyle={{ strokeDasharray: "10 5" }}
                labelStyle={{ fontSize: "10" }}
                y={chartInfo.targetLineValue}
                label={chartInfo.targetLineLabel}
                labelAlign="start"
              />
            ) : (
              ""
            )}

            {chartInfo.baseLineValue ? (
              <ChartsReferenceLine
                lineStyle={{ strokeDasharray: "10 5" }}
                labelStyle={{ fontSize: "10" }}
                y={chartInfo.baseLineValue}
                label={chartInfo.baseLineLabel}
                labelAlign="start"
              />
            ) : (
              ""
            )}</LineChart>
          ) : (
            <Typography variant="h6">No data available</Typography>
          )}
      
    </>
  );
};

AreaChartComponent.propTypes = {
  chartData: PropTypes.object.isRequired,
  chartInfo: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default AreaChartComponent;