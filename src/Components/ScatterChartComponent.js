// implement scatter chart component use x-charts of MUI
import { ChartsReferenceLine, ScatterChart } from "@mui/x-charts";
import * as React from "react";
import { Paper } from "@mui/material";
import {} from "@mui/x-charts/ResponsiveChartContainer";

const CustomItemTooltipContent = (props) => {
  const { itemData, series } = props;
  return (
    <Paper
      sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 1, paddingTop: 1 }}
    >
      <p>
        <b>{series.data[itemData.dataIndex].region}</b> <br />
        {series.data[itemData.dataIndex].label_x}
        {": "}
        {series.data[itemData.dataIndex].x}
        <br />
        {series.data[itemData.dataIndex].label_y}
        {": "}
        {series.data[itemData.dataIndex].y}
      </p>
    </Paper>
  );
};

const ScatterChartComponent = ({ chartConfig, chartData, chartInfo, item }) => {
  let customChartConfig = [];
  let dataItems = new Set(chartData.rows.map((r) => r[0]));
  if (dataItems.size == 2)
    dataItems.forEach((dataItem, index) => {
      if (index == 1) return;
      customChartConfig.push({
        data: chartData.rows
          .filter((r) => r[0] == dataItem)
          .map((r, index) => {
            // find the two elements that match the same region
            let row = chartData.rows.find(
              (ro) => ro[1] == r[1] && ro[0] != r[0]
            );
            return {
              x: Number.parseFloat(r[2]),
              y: Number.parseFloat(row[2]),
              id: index,
              region: chartData.metaData.items[r[1]].name,
              _rows: [r, row],
              label_x: chartData.metaData.items[r[0]].name,
              label_y: chartData.metaData.items[row[0]].name,
            };
          }),
      });
    });

  return (
    <ScatterChart
      tooltip={{ trigger: "item", itemContent: CustomItemTooltipContent }}
      series={[customChartConfig[0]]}
      grid={{ vertical: true, horizontal: true }}
      yAxis={[{ label: chartConfig.series[1].label }]}
      xAxis={[{ label: chartConfig.series[0].label }]}
    >
      {chartInfo?.axes?.map((axis) => {
        if (axis?.baseLine == undefined && axis.targetLine == undefined)
          return null;

        return axis?.index == 0 ? (
          axis.baseLine && axis.targetLine ? (
            <>
              <ChartsReferenceLine
                lineStyle={{ strokeDasharray: "10 5" }}
                labelStyle={{ fontSize: "10" }}
                y={axis?.baseLine?.value}
                label={axis?.baseLine?.title?.text}
                labelAlign="start"
              />
              <ChartsReferenceLine
                lineStyle={{ strokeDasharray: "10 5" }}
                labelStyle={{ fontSize: "10" }}
                y={axis?.targetLine?.value}
                label={axis?.targetLine?.title?.text}
                labelAlign="start"
              />
            </>
          ) : (
            <ChartsReferenceLine
              lineStyle={{ strokeDasharray: "10 5" }}
              labelStyle={{ fontSize: "10" }}
              y={axis?.baseLine?.value ?? axis?.targetLine?.value}
              label={
                axis?.baseLine?.title?.text ?? axis?.targetLine?.title?.text
              }
              labelAlign="start"
            />
          )
        ) : axis.baseLine && axis.targetLine ? (
          <>
            <ChartsReferenceLine
              lineStyle={{ strokeDasharray: "10 5" }}
              labelStyle={{ fontSize: "10" }}
              x={axis?.baseLine?.value}
              label={axis?.baseLine?.title?.text}
              labelAlign="start"
            />
            <ChartsReferenceLine
              lineStyle={{ strokeDasharray: "10 5" }}
              labelStyle={{ fontSize: "10" }}
              x={axis?.targetLine?.value}
              label={axis?.targetLine?.title?.text}
              labelAlign="start"
            />
          </>
        ) : (
          <ChartsReferenceLine
            lineStyle={{ strokeDasharray: "10 5" }}
            labelStyle={{ fontSize: "10" }}
            x={axis?.baseLine?.value ?? axis?.targetLine?.value}
            label={axis?.baseLine?.title?.text ?? axis?.targetLine?.title?.text}
            labelAlign="start"
          />
        );
      })}
    </ScatterChart>
  );
};

export default ScatterChartComponent;
