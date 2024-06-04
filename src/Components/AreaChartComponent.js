import React from "react";
import PropTypes from "prop-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const AreaChartComponent = ({ chartData, chartInfo, item }) => {
  // Extract and transform the data for the AreaChart
  const getChartData = () => {
    const { headers, metaData, rows } = chartData;
    if (!chartData.headerWidth) {
      return [];
    }

    const periods = metaData.dimensions.pe;
    const periodNames = periods.map((period) => metaData.items[period].name);

    const dataDimension = metaData.dimensions.dx[0];
    const dataDimensionName = metaData.items[dataDimension].name;

    const valueIndex = headers.findIndex((header) => header.name === "value");

    const data = periods.map((period, index) => {
      const row = rows.find((r) => r[1] === period);
      return {
        name: periodNames[index],
        [dataDimensionName]: row ? parseFloat(row[valueIndex]) : 0,
      };
    });

    return data;
  };

  const data = getChartData();
  const dataKey = data.length > 0 ? Object.keys(data[0])[1] : "";

  return (
    <Paper style={{ margin: "5px", padding: "5px" }}>
      <Box>
        {/* <Typography variant="h6">{item.visualization.displayName}</Typography> */}
        <Box width="100%" height="13rem">
          <ResponsiveContainer width="100%" height="100%">
            {data.length > 0 ? (
              <AreaChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                {chartInfo.targetLineValue && (
                  <ReferenceLine
                    y={chartInfo.targetLineValue}
                    label={chartInfo.targetLineLabel}
                    stroke="red"
                  />
                )}
                {chartInfo.baseLineValue && (
                  <ReferenceLine
                    y={chartInfo.baseLineValue}
                    label={chartInfo.baseLineLabel}
                    stroke="green"
                  />
                )}
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke="#8884d8"
                  fillOpacity={0.3}
                  fill="#8884d8"
                />
              </AreaChart>
            ) : (
              <Typography variant="h6">No data available</Typography>
            )}
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
};

AreaChartComponent.propTypes = {
  chartData: PropTypes.object.isRequired,
  chartInfo: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default AreaChartComponent;
