import React from "react";
import PropTypes from "prop-types";
import { LineChart, lineElementClasses, markElementClasses } from "@mui/x-charts";
import { Typography } from "@mui/material";
import { ChartsReferenceLine } from "@mui/x-charts";
import regression from "regression";
import * as science from "science";


const AreaChartComponent = ({ chartData, chartInfo }) => {
  const loess = (xval, yval, bandwidth) => {
    return science.stats.loess().bandwidth(bandwidth)(xval, yval);
  };

  const getChartData = () => {
    const { headers, metaData, rows } = chartData;

    if (!metaData || !rows || rows.length === 0) {
      return { xData: [], seriesData: [] };
    }

    const periods = metaData.dimensions?.pe || [];
    const periodNames = periods.map((period) => metaData.items[period]?.name);

    const dataDimensions = metaData.dimensions?.dx || [];
    const valueIndex = headers.findIndex((header) => header.name === "value");

    if (periods.length === 0 || dataDimensions.length === 0 || valueIndex === -1) {
      return { xData: [], seriesData: [] };
    }

    const xData = periodNames;
    const seriesData = dataDimensions.map((dataDimension) => {
      const seriesName = metaData.items[dataDimension]?.name;
      const data = periods.map((period) => {
        const row = rows.find((r) => r[1] === period && r[0] === dataDimension);
        return row ? parseFloat(row[valueIndex]) : 0;
      });
      return { name: seriesName, data };
    });

    return { xData, seriesData };
  };

  const calculateTrendLine = (seriesData, regressionType) => {
    const dataPoints = seriesData.map((value, index) => [index, value]);

    let result;
    switch (regressionType) {
      case "LINEAR":
        result = regression.linear(dataPoints);
        break;
      case "LOESS":
        const result_ = loess(
          dataPoints.map((d) => d[0]),
          dataPoints.map((d) => d[1]),
          0.45
        );
        result = { points: result_.map((e, i) => [i, e]) };
        break;
      case "POLYNOMIAL":
        result = regression.polynomial(dataPoints);
        break;
      default:
        console.error("Unsupported regression type:", regressionType);
        return [];
    }

    return result.points.map((point) => point[1]);
  };

  const { xData, seriesData } = getChartData();
  const seriesWithTrendData = seriesData.map((series) => ({
    ...series,
    trendData: calculateTrendLine(series.data, chartInfo.regressionType),
  }));

  const formattedSeries = seriesWithTrendData.map((series, index) => ({
    data: series.data,
    label: series.name,
    area : true,
    stack : "true",
    stackOffset: 'none',
    id: `series-${index}`,
  }));

  const formattedTrendSeries = seriesWithTrendData.map((series, index) => ({
    data: series.trendData,
    label: `${series.name} trend`,
    id: `trend-${index}`,
  }));

  return (
    <>
      {xData.length > 0 && seriesData.length > 0 ? (
        <LineChart
          margin={{ top: 150 }}
          xAxis={[{ scaleType: "band", data: xData }]}
          series={[...formattedSeries, ...formattedTrendSeries]}
          sx={{
            [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
              strokeWidth: 1,
            },
            ...formattedTrendSeries.reduce((acc, series) => ({
              ...acc,
              [`.MuiLineElement-series-${series.id}`]: {
                strokeDasharray: "5 5", // Adjust dash pattern as needed
              },
            }), {}),
            [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]: {
              fill: "#fff",
            },
            [`& .${markElementClasses.highlighted}`]: {
              stroke: "none",
            },
          }}
        >
          {chartInfo.targetLineValue && (
            <ChartsReferenceLine
              lineStyle={{ strokeDasharray: "10 5" }}
              labelStyle={{ fontSize: "10" }}
              y={chartInfo.targetLineValue}
              label={chartInfo.targetLineLabel}
              labelAlign="start"
            />
          )}

          {chartInfo.baseLineValue && (
            <ChartsReferenceLine
              lineStyle={{ strokeDasharray: "10 5" }}
              labelStyle={{ fontSize: "10" }}
              y={chartInfo.baseLineValue}
              label={chartInfo.baseLineLabel}
              labelAlign="start"
            />
          )}
        </LineChart>
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
