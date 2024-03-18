import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import { PieChart, BarChart, LineChart } from "@mui/x-charts";
import Dashboard from "./Dashboard";
import {
  Grid,
  Paper,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material";
import Title from "./Title";
import { useSnackbar } from "material-ui-snackbar-provider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import GaugeChart from "react-gauge-chart";

const apiBase = "https://hmis.dhis.et/";
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
    } else {
      setChartInfo(null);
      return;
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
        } else {
          console.log("unsuported chart type: " + item.type);
          setChartData(null);
          return;
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
  const [fullScreenItem, setFullScreenItem] = React.useState(null);
  const item = props?.item;
  const id = item[type]?.id;

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
      chartType === "bar" ||
      chartType === "pivot_table" ||
      chartType === "gauge"
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
        else if (chartType === "column") {
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
        } else if (chartType == "pivot_table") {
          return (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell key={-1}></TableCell>
                    {chartConfig.yAxis.categories.map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chartConfig.series.map((row) => (
                    <TableRow
                      key={row.label}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.label}
                      </TableCell>
                      {row.data.map((data, i) => (
                        <TableCell key={"data" + i} align="right">
                          {data + ""}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }
      } else {
        return "unsupported, chart type: " + chartType;
      }
    }
    if (chartType == "gauge" && chartData.rows[0] && chartData.rows[0][1]) {
      const dataItem =
        chartData.metaData.items[chartData.metaData.dimensions.dx].name;
      const period =
        chartData.metaData.items[chartData.metaData.dimensions.pe].name;
      const orgunit =
        chartData.metaData.items[chartData.metaData.dimensions.ou].name;
      const percent = chartData.rows[0][1] / 100;

      return (
        <>
          <GaugeChart
            percent={percent}
            nrOfLevels={30}
            needleBaseColor={percent > 0.3 ? "#E65100" : "#00897B"}
            needleColor={percent > 0.3 ? "#E65100" : "#00897B"}
            textColor="#000"
            arcsLength={[0.15, 0.1, 0.55]}
            colors={["#009688", "#CDDC39", "#F44336"]}
          />
          <span align="center">
            {dataItem} - {orgunit} - {period}
          </span>
        </>
      );
    } else {
      console.log("Unsupported chart type: " + chartType);
      return (
        <span style={{ color: "#DDD" }}>
          Unsupported chart type: {chartType}
        </span>
      );
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handelFullScreen = () => {
    setFullScreenItem(id);
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    handleClose(); // Close the menu after entering fullscreen}
  };

  const handelFullScreenExit = () => {
    setFullScreenItem(null);
  };

  return (
    <Grid item xs={12} md={6} lg={6}>
      <Paper
        sx={
          fullScreenItem != null && fullScreenItem == id
            ? {
                zIndex: 1300,
                p: 2,
                display: "block",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                flexDirection: "column",
                width: "100vw",
                height: "100vh",
                padding: "2%",
                paddingBottom: "4%",
              }
            : {
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "10cm",
              }
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <Title>{title}</Title>
          </Grid>
          <Grid item xs={1}>
            {fullScreenItem ? (
              <IconButton
                style={{
                  position: "fixed",
                  top: "3%",
                  right: "3%",
                }}
                aria-label="exit"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handelFullScreenExit}
              >
                <FullscreenExitIcon style={{ color: "grey" }} />
              </IconButton>
            ) : (
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon style={{ color: "grey" }} />
              </IconButton>
            )}
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handelFullScreen}>
                <ListItemIcon>
                  <FullscreenIcon />
                </ListItemIcon>
                <ListItemText primary="Full Screen" />
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <BookmarkAddIcon />
                </ListItemIcon>
                <ListItemText primary="Save" />
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
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
