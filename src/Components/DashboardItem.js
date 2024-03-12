import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import { PieChart, BarChart, LineChart } from "@mui/x-charts";
import Dashboard from "./Dashboard";
import { Grid, Paper, Snackbar } from "@mui/material";
import Title from "./Title";
import { useSnackbar } from "material-ui-snackbar-provider";

const apiBase = "https://mail.cdhi.uog.edu.et/public_html/234WAoeC/";
const dimensionParam =
  "dimension,filter,programStage,items[dimensionItem,dimensionItemType]";

const getObjectItems = function (obj, prop, dataDimensionItems) {
  let res = [];
  if (dataDimensionItems) {
    for (let i = 0; i < obj.items.length; i++) {
      const item = obj.items[i];
      if (
        item[prop] &&
        dataDimensionItems[i] &&
        dataDimensionItems[i].reportingRate &&
        dataDimensionItems[i].reportingRate.dimensionItem
      ) {
        res.push(dataDimensionItems[i].reportingRate.dimensionItem);
      } else if (item[prop]) {
        res.push(item[prop]);
      }
    }
  } else
    for (const item of obj.items) {
      if (item[prop]) {
        res.push(item[prop]);
      }
    }

  return res;
};

const getItemName = function (obj, key) {
  if (
    obj &&
    obj.metaData &&
    obj.metaData.items &&
    obj.metaData.items[key] &&
    obj.metaData.items[key].name
  ) {
    return obj.metaData.items[key].name;
  }
  return key;
};

function DashboardItem(props) {
  const [chartInfo, setChartInfo] = React.useState();
  const [chartData, setChartData] = React.useState();
  const snackbar = useSnackbar();

  React.useEffect(() => {
    let item = props?.item;
    let url = apiBase;
    let id = "";

    if (
      item.type === "VISUALIZATION" ||
      item.type === "CHART" ||
      item.type === "REPORT_TABLE"
    ) {
      id = item.visualization.id;
      url +=
        "api/visualizations/" +
        id +
        ".json?fields=id,displayName,dataDimensionItems,type,columns[:all],columnDimensions[:all],filters[:all],rows[:all]";
    } else if (item.type === "EVENT_CHART") {
      id = item.eventChart.id;
      url +=
        "api/eventCharts/" +
        id +
        ".json?fields=id,displayName,type,program,programStage,columns[" +
        dimensionParam +
        "],rows[" +
        dimensionParam +
        "],filters[" +
        dimensionParam +
        "]";
    }

    fetch(encodeURI(url))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setChartInfo(data);

        let dimension = "",
          filters = "";
        for (const filter of data.filters) {
          filters += "&filter=" + filter.dimension;
          if (filter.items.length > 0) {
            let filterItemsId = getObjectItems(filter, "id");

            let filterDimensionItems = getObjectItems(filter, "dimensionItem");
            if (filterItemsId.length > 0) {
              filters += ":" + filterItemsId.join(";");
            }
            if (filterDimensionItems.length > 0) {
              filters += ":" + filterDimensionItems.join(";");
            }
          }
        }

        for (const col of data.columns) {
          dimension += "dimension=";
          dimension += col.dimension;
          if (col.filter) {
            dimension += ":" + col.filter;
          }

          if (col.items.length > 0) {
            let colItemsId = getObjectItems(col, "id", data.dataDimensionItems);

            let colDimensionItems = getObjectItems(col, "dimensionItem");
            if (colItemsId.length > 0) {
              dimension += ":" + colItemsId.join(";");
            }
            if (colDimensionItems.length > 0) {
              dimension += ":" + colDimensionItems.join(";");
            }
          }
        }

        for (const row of data.rows) {
          dimension += "&dimension=";
          dimension += row.dimension;

          if (row.filter) {
            dimension += ":" + row.filter;
          }

          if (row.items.length > 0) {
            let rowItemsId = getObjectItems(row, "id");
            let rowDimensionItems = getObjectItems(row, "dimensionItem");
            if (rowItemsId.length > 0) {
              dimension += ":" + rowItemsId.join(";");
            }
            if (rowDimensionItems.length > 0) {
              dimension += ":" + rowDimensionItems.join(";");
            }
          }
        }

        let url = apiBase;
        if (
          item.type === "VISUALIZATION" ||
          item.type === "CHART" ||
          item.type === "REPORT_TABLE"
        ) {
          id = item.visualization.id;
          url += "api/analytics.json?";
        } else if (item.type === "EVENT_CHART") {
          id = item.eventChart.id;
          url +=
            "api/analytics/events/aggregate/" +
            data.program.id +
            ".json?programStage=" +
            data.programStage.id +
            "&";
        }

        url += dimension + filters;

        fetch(encodeURI(url))
          .then((response) => {
            return response.json();
          })
          .then((analyticsData) => {
            setChartData(analyticsData);
          });
      })
      .catch((data) => {
        snackbar.showMessage("Failed to load data!", undefined, undefined, {
          type: "error",
        });
      });
  }, []);

  const type = props?.item?.type.toLowerCase();
  const title = props?.item[type]?.displayName;
  const chartType = chartInfo?.type.toLowerCase();

  const renderChart = () => {
    let chartConfig = {};

    if (!chartData) return <span style={{ color: "#DDD" }}>No Data</span>;

    const rows = chartData.rows?.toSorted((a, b) => {
      let avalue = Number(a.length > 1 ? a[1] : a[0]);
      let bvalue = Number(b.length > 1 ? b[1] : b[0]);
      return avalue - bvalue;
    });

    if (chartType === "pie") {
      let pieSeries = {
        colorByPoint: true,
        data: [],
        cornerRadius: 10,
        innerRadius: 10,
        highlightScope: { faded: "global", highlighted: "item" },
        faded: { innerRadius: 10, additionalRadius: -30, color: "gray" },
      };

      for (const row of rows) {
        pieSeries?.data.push({
          label: getItemName(chartData, row[0]),
          value: Number(row[1]),
        });
      }

      return pieSeries.data.length > 0 ? (
        <PieChart
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "top", horizontal: "middle" },
              padding: 0,
            },
          }}
          margin={{ top: 100 }}
          series={[pieSeries]}
        />
      ) : (
        <span style={{ color: "#DDD" }}>No Data</span>
      );
    } else if (
      chartType === "column" ||
      chartType === "line" ||
      chartType === "bar"
    ) {
      chartConfig = { series: [] };
      chartConfig.plotOptions = {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      };

      chartConfig.yAxis = {
        categories: [],
        crosshair: true,
      };

      let columnSeries = {};
      let categories = [];
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

        if (chartType === "line")
          return (
            <LineChart
              layout="vertical"
              series={chartConfig.series}
              xAxis={[
                {
                  data: chartConfig.yAxis.categories,
                  barGapRatio: 0.4,
                  scaleType: "band",
                },
              ]}
            />
          );

        if (chartType === "bar")
          return (
            <BarChart
              layout="horizontal"
              series={chartConfig.series}
              yAxis={[
                {
                  data: chartConfig.yAxis.categories,
                  barGapRatio: 0.4,
                  scaleType: "band",
                  labelStyle: {
                    transform: `translateY(${
                      // Hack that should be added in the lib latter.
                      5 * Math.abs(Math.sin((Math.PI * props.angle) / 180))
                    }px)`,
                  },
                  tickLabelStyle: {
                    angle: 70,
                    textAnchor: "end",
                  },
                },
              ]}
            />
          );
        else
          return (
            <BarChart
              layout="vertical"
              series={chartConfig.series}
              xAxis={[
                {
                  data: chartConfig.yAxis.categories,
                  barGapRatio: 0.4,
                  scaleType: "band",
                },
              ]}
            />
          );
      }
    }
  };

  return (
    <Grid item xs={12} md={6} lg={6}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "10cm",
        }}
      >
        <Title>{title}</Title>
        {renderChart()}
      </Paper>
    </Grid>
  );
}

function DashboardItems(props) {
  return props?.items?.map((item) => (
    <DashboardItem key={item.id} item={item}></DashboardItem>
  ));
}

DashboardItem.propTypes = {
  children: PropTypes.node,
};

export default DashboardItems;
