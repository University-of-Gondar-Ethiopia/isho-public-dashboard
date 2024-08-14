import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import {
  PieChart,
  BarChart,
  LineChart,
  ResponsiveChartContainer,
  BarPlot,
  LinePlot,
  ChartsXAxis,
  ChartsLegend,
  ChartsYAxis,
  ChartsTooltip,
  MarkPlot,
  ChartsAxisHighlight,
} from "@mui/x-charts";
import {
  lineElementClasses,
  markElementClasses,
} from "@mui/x-charts/LineChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import SpeedIcon from "@mui/icons-material/Speed";
import PivotTableChartIcon from "@mui/icons-material/PivotTableChart";
import InsightsIcon from "@mui/icons-material/Insights";

import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import regression from "regression";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import * as csvtojson from "csvtojson";
import Map from "./Map";

import {
  Grid,
  Paper,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Button,
} from "@mui/material";
import AreaChartComponent from "./AreaChartComponent";
import Title from "./Title";
import { CircularProgress, Popover } from "@mui/material";
import { useSnackbar } from "material-ui-snackbar-provider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ListItemIcon from "@mui/material/ListItemIcon";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import GaugeChart from "../lib";
import { Code, Share } from "@mui/icons-material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TextChart from "./TextChart";
import ResourceComponent from "./ResourceComponent";
import ScatterChartComponent from "./ScatterChartComponent";
import MapComponent from "./MapComponent";

import { toCSVText, getObjectItems, loess, getItemName } from "../utils/common";
import { getFilters, getOuDimensions, getDimensions } from "../utils/filters";
import SingleValueChart from "./SingleValueChart";
import ShareModal from "./ShareModal";

const apiBase = process.env.REACT_APP_BASE_URI;

const dimensionParam =
  "dimension,filter,programStage,items[dimensionItem,dimensionItemType]";

function DashboardItem(props) {
  const [chartInfo, setChartInfo] = React.useState();
  const [chartData, setChartData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const snackbar = useSnackbar();
  const [mapData, setMapData] = React.useState();

  const [shape, setShape] = React.useState(null);
  const [customeChartType, setCustomChartType] = React.useState(undefined);

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
        ".json?fields=id,displayName,aggregationType,dataDimensionItems,targetLineValue,axes,regressionType,targetLineLabel,baseLineValue,baseLineLabel,type,columns[:all],columnDimensions[:all],filters[:all],rows[:all]";
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
    } else if (item.type == "MAP") {
      id = item.map.id;
      console.log("map id", id);
      url +=
        "api/maps/" +
        id +
        ".json?fields=id,displayName,latitude,zoom,basemap,mapViews[id,colorScale,opacity,layer,thematicMapType,displayName,type,displayDescription,columns[dimension,legendSet[id],filter,programStage,items[dimensionItem~rename(id),displayName~rename(name),dimensionItemType]],rows[:all],filters[:all]]";
    } else if (item.type == "TEXT") {
      id = item._id;
      setChartInfo({ ...item });
      setLoading(false);
      return;
    } else if (item.type == "RESOURCES") {
      id = item._id;
      setChartInfo({ ...item });
      setLoading(false);
      return;
    } else {
      setChartInfo(null);
      return;
    }

    fetch(encodeURI(url))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (item.type == "MAP") {
          console.log("another Item", item);
          console.log("mapViews", data);
          data.type = "map";
          console.log("map origin", data);
          setMapData({ ...data });
          // data = data.mapViews.length > 0 ? data.mapViews[0] : data; // TODO add support for mulitple layers

          setLoading(false);
          return;
        }

        setChartInfo(data);

        let filters = getFilters(
          data.filters,
          props?.filters,
          data?.aggregationType
        );
        let dimension = getDimensions(data);
        let ou_dimension = getOuDimensions(data.rows, { type: "map" });

        let url = apiBase;
        console.log("item here", item);

        if (
          item.type === "VISUALIZATION" ||
          item.type === "CHART" ||
          item.type === "REPORT_TABLE"
        ) {
          id = item.visualization.id;
          url += "api/analytics.json?";
          // } else if (item.type === "MAP") {
          //   // console.log("here is called");
          //   id = item.map.id;
          //   url += "api/analytics.json?";
          //   //load shape data
          //   let geoFeatures =
          //     apiBase +
          //     "api/geoFeatures.json?" +
          //     "ou=" +
          //     ou_dimension +
          //     "&displayProperty=NAME";
          //   console.log(geoFeatures);
          //   fetch(encodeURI(geoFeatures))
          //     .then((response) => {
          //       return response.json();
          //     })
          //     .then((shapeData) => {
          //       setShape(shapeData);
          //     });
        } else if (item.type === "EVENT_CHART") {
          id = item.eventChart.id;
          url +=
            "api/analytics/events/aggregate/" +
            data.program.id +
            ".json?programStage=" +
            data.programStage.id +
            "&";
        } else {
          setChartData(null);
          return;
        }

        console.log("filters", filters);
        url += dimension + filters + "&includeMetadataDetails=true";

        fetch(encodeURI(url))
          .then((response) => {
            return response.json();
          })
          .then((analyticsData) => {
            setChartData(analyticsData);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
          });
      })
      .catch((data) => {
        snackbar.showMessage("Failed to load data!", undefined, undefined, {
          type: "error",
        });
        setLoading(false);
      });
  }, [props.filters]);

  const type = props?.item?.type.toLowerCase();
  const title = props?.item[type]?.displayName;
  let chartType = chartInfo?.type.toLowerCase();
  const [fullScreenItem, setFullScreenItem] = React.useState(null);
  const item = props?.item;
  const id = item[type]?.id;
  item.id = id;
  let chartConfig = {};

  const renderChart = () => {
    console.log("entrance", chartType, chartData, shape, chartInfo);
    if (chartType == "resources") {
      return <ResourceComponent resourcesItems={chartInfo.resources} />;
    }
    if (chartType === "text") return <TextChart item={item} />;
    if (mapData && mapData.type === "map") {
      return (
        <MapComponent
          data={mapData}
          setMapData={setMapData}
          mainProps={props}
          setLoading={setLoading}
          setChartData={setChartData}
        />
      );
      // let layer = chartInfo.layer;
      // let colorScale = chartInfo.colorScale;
      // let opacity = chartInfo.opacity;
      // if (layer == "orgUnit") {
      //   console.log("finally got here");
      //   return (
      // <Map
      //   chartConfig={chartConfig}
      //   shape={shape}
      //   colorScale={colorScale}
      //   opacity={0}
      // />
      //   );
      // }
    }

    if (!chartData) {
      return <span style={{ color: "#DDD" }}>No Data</span>;
    }

    if (chartData.status) {
      return <Code>{JSON.stringify(chartData)}</Code>;
    }

    // sort rows
    const rows = chartData.rows?.toSorted((a, b) => {
      let avalue = Number(a.length > 1 ? a[1] : a[0]);
      let bvalue = Number(b.length > 1 ? b[1] : b[0]);
      return avalue - bvalue;
    });
    console.log("second entrance", chartType);

    chartType = customeChartType ?? chartType;
    if (chartType === "pie") {
      chartConfig = {
        colorByPoint: true,
        data: [],
        cornerRadius: 10,
        innerRadius: 10,
        highlightScope: { faded: "global", highlighted: "item" },
        faded: { innerRadius: 10, additionalRadius: -30, color: "gray" },
      };

      for (const row of rows) {
        chartConfig?.data.push({
          label: getItemName(chartData, row[0]),
          value: Number(row[1]),
        });
      }

      return chartConfig.data.length > 0 ? (
        <PieChart
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "top", horizontal: "middle" },
              padding: 0,
            },
          }}
          margin={{ top: 100 }}
          series={[chartConfig]}
        />
      ) : (
        <span style={{ color: "#DDD" }}>No Data</span>
      );
    } else if (
      chartType === "column" ||
      chartType === "line" ||
      chartType === "bar" ||
      chartType === "pivot_table" ||
      chartType === "gauge" ||
      chartType == "map" ||
      chartType == "scatter"
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
      console.log("here chart Data", chartData, chartType);
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

        if (chartType === "line") {
          //calcualte the trend line for each series
          let ChartStyle = {
            [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
              strokeWidth: 1,
            },
            [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]:
              {
                fill: "#fff",
              },
            [`& .${markElementClasses.highlighted}`]: {
              stroke: "none",
            },
          };
          if (chartInfo.regressionType != "NONE") {
            chartConfig?.series?.forEach((series, i) => {
              const dataPoints = series.data.map((value, index) => [
                index,
                value,
              ]);
              let regressionResult;
              if (chartInfo.regressionType == "LINEAR")
                regressionResult = regression.linear(dataPoints);

              if (chartInfo.regressionType == "POLYNOMIAL")
                regressionResult = regression.polynomial(dataPoints);

              if (chartInfo.regressionType == "LOESS") {
                const result = loess(
                  dataPoints.map((d) => d[0]),
                  dataPoints.map((d) => d[1]),
                  0.45
                );
                regressionResult = {};
                regressionResult.points = result.map((e, i) => [i, e]);
              }

              ChartStyle[`.MuiLineElement-series-trend${i}`] = {
                strokeDasharray: "3 4 5 2",
              };

              chartConfig?.series.push({
                data: regressionResult.points.map((e) => e[1]),
                label: series.label + " (trend)",
                type: "line",
                id: `trend${i}`,
              });
            });
          }
          return (
            <LineChart
              margin={{ top: 100 }}
              layout="vertical"
              sx={ChartStyle}
              series={chartConfig.series}
              xAxis={[
                {
                  data: chartConfig.yAxis.categories,
                  barGapRatio: 0.4,
                  scaleType: "band",
                },
              ]}
              margin={{ top: 40 + 30 * chartConfig.series.length }}
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
              )}
            </LineChart>
          );
        }
        console.log("here too", chartType);
        // if (chartType === "map" && shape) {
        //   console.log("It is called", shape);
        //   console.log("chartConfigInside", chartConfig);
        //   console.log("chartDataInside", chartData);
        //   console.log("chartInfoInside", chartInfo);
        //   // const mapComponents = chartInfo.map((mapLayer, index) => {
        //   //   console.log("mapLayer", mapLayer);
        //   //   const { layer, colorScale, opacity } = mapLayer;

        //   //   if (layer === "orgUnit") {
        //   //     return (
        //   //       <Map
        //   //         key={`orgUnit-${index}`}
        //   //         chartConfig={chartConfig}
        //   //         shape={shape}
        //   //         colorScale={colorScale}
        //   //         opacity={0}
        //   //       />
        //   //     );
        //   //   } else if (layer === "thematic") {
        //   //     return (
        //   //       <Map
        //   //         key={`thematic-${index}`}
        //   //         chartConfig={chartConfig}
        //   //         shape={shape}
        //   //         colorScale={colorScale}
        //   //         opacity={opacity}
        //   //       />
        //   //     );
        //   //   }
        //   //   return null;
        //   // });r

        //   // return <>{mapComponents}</>;

        //   let layer = chartInfo.layer;
        //   let colorScale = chartInfo.colorScale;
        //   let opacity = chartInfo.opacity;
        //   if (layer == "orgUnit") {
        //     console.log("finally got here");
        //     return (
        //       <Map
        //         chartConfig={chartConfig}
        //         shape={shape}
        //         colorScale={colorScale}
        //         opacity={0}
        //       />
        //     );
        //   } else if (layer == "thematic") {
        //     return (
        //       <Map
        //         chartConfig={chartConfig}
        //         shape={shape}
        //         colorScale={colorScale}
        //         opacity={opacity}
        //       />
        //     );
        //   }
        // }
        if (chartType === "text") return <TextChart item={item} />;
        if (chartType === "bar") {
          return (
            <BarChart
              axisHighlight={{
                y: "line", // Or 'none'
              }}
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
            >
              {chartInfo.targetLineValue ? (
                <ChartsReferenceLine
                  lineStyle={{ strokeDasharray: "10 5" }}
                  labelStyle={{ fontSize: "10" }}
                  x={chartInfo.targetLineValue}
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
                  x={chartInfo.baseLineValue}
                  label={chartInfo.baseLineLabel}
                  labelAlign="start"
                />
              ) : (
                ""
              )}
            </BarChart>
          );
        } else if (chartType === "column") {
          //calcualte the trend line for each series
          let ChartStyle = {
            [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
              strokeWidth: 1,
            },
            [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]:
              {
                fill: "#fff",
              },
            [`& .${markElementClasses.highlighted}`]: {
              stroke: "none",
            },
          };
          if (chartInfo.regressionType != "NONE") {
            chartConfig?.series?.forEach((series, i) => {
              chartConfig.series[i].type = "bar";
              chartConfig.series[i].showMark = false;

              const dataPoints = series.data.map((value, index) => [
                index,
                value,
              ]);
              let regressionResult;
              if (chartInfo.regressionType == "LINEAR")
                regressionResult = regression.linear(dataPoints);

              if (chartInfo.regressionType == "POLYNOMIAL")
                regressionResult = regression.polynomial(dataPoints);

              if (chartInfo.regressionType == "LOESS") {
                const result = loess(
                  dataPoints.map((d) => d[0]),
                  dataPoints.map((d) => d[1]),
                  0.45
                );
                regressionResult = {};
                regressionResult.points = result.map((e, i) => [i, e]);
              }

              ChartStyle[`.MuiLineElement-series-trend${i}`] = {
                strokeDasharray: "3 4 5 2",
              };

              chartConfig?.series.push({
                data: regressionResult.points.map((e) => e[1]),
                label: series.label + " (trend)",
                type: "line",
              });
            });
            return (
              <ResponsiveChartContainer
                xAxis={[
                  {
                    data: chartConfig.yAxis.categories,
                    barGapRatio: 0.4,
                    scaleType: "band",
                    id: "x-axis-id",
                  },
                ]}
                series={chartConfig.series}
                margin={{ top: 40 + 30 * chartConfig.series.length }}
                sx={ChartStyle}
              >
                <BarPlot layout="horizontal" />
                <LinePlot />
                <MarkPlot showMark={(point) => point} />
                <ChartsYAxis />
                <ChartsXAxis />
                <ChartsAxisHighlight />
                <ChartsTooltip />
                <ChartsLegend direction="row" />
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
                )}
              </ResponsiveChartContainer>
            );
          } else {
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
                margin={{ top: 40 + 30 * chartConfig.series.length }}
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
                )}
              </BarChart>
            );
          }
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
        chartData.metaData.items[chartData.metaData.dimensions.dx]?.name;
      const period =
        chartData.metaData.items[chartData.metaData.dimensions.pe]?.name;
      const orgunit =
        chartData.metaData.items[chartData.metaData.dimensions.ou]?.name;
      const percent = chartData.rows[0][1] / 100;

      console.log(
        chartInfo.targetLineValue,
        "is target defined",
        chartInfo.baseLineValue
      );
      return (
        <>
          <GaugeChart
            percent={percent}
            nrOfLevels={30}
            // needleBaseColor={percent > 0.3 ? "#E65100" : "#00897B"}
            // needleColor={percent > 0.3 ? "#E65100" : "#00897B"}
            textColor="#000"
            arcsLength={[0.15, 0.1, 0.55]}
            colors={["#009688", "#CDDC39", "#F44336"]}
            target={0.8}
            baseline={chartInfo.baseLineValue}
          />
          <span align="center">
            {dataItem} - {orgunit} - {period}
          </span>
        </>
      );
    } else if (chartInfo.type == "AREA") {
      return (
        <>
          <AreaChartComponent
            chartData={chartData}
            chartInfo={chartInfo}
            item={item}
          />
        </>
      );
    } else if (chartInfo.type == "SCATTER") {
      return (
        <ScatterChartComponent
          key={item._id}
          chartData={chartData}
          chartInfo={chartInfo}
          item={item}
          chartConfig={chartConfig}
        />
      );
    } else if (chartInfo.type == "SINGLE_VALUE") {
      return <SingleValueChart chartData={chartData} />;
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
  const [subMenuAnchorEl, setSubMenuAnchorEl] = React.useState(null);
  const [anchorChangeChartType, setAnchorChangeChartType] =
    React.useState(null);
  const [subMenuAnchorChangeChartType, setSubMenuAnchorChangeChartType] =
    React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickChangeChartType = (event) => {
    setAnchorChangeChartType(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleCloseChangeChartType = () => {
    setAnchorChangeChartType(null);
    setSubMenuAnchorChangeChartType(null);
  };

  const handleSubMenuOpen = (event) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleSubMenuOpenChangeChartType = (event) => {
    setSubMenuAnchorChangeChartType(event.currentTarget);
  };

  const handleSaveChart = () => {
    let saved_reports = localStorage.getItem("saved_reports");
    let saved_reports_json;
    if (saved_reports && saved_reports != null) {
      saved_reports_json = JSON.parse(saved_reports);
      if (saved_reports_json && saved_reports_json.items) {
        if (saved_reports_json.items.find((it) => it.id == id) == undefined)
          saved_reports_json.items.push(item);
        else
          snackbar.showMessage("Item already saved!", undefined, undefined, {
            type: "error",
          });
      } else {
        saved_reports_json = {};
        saved_reports_json.items = [item];
      }
    } else {
      saved_reports_json = {};
      saved_reports_json.items = [item];
    }
    localStorage.setItem("saved_reports", JSON.stringify(saved_reports_json));
    props.setSavedReports(saved_reports_json);
    handleClose(); // Close the menu
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
  const componentRef = React.useRef(null);

  const handleDownload = async (type) => {
    // Perform download logic based on the selected type
    if (type.toLowerCase() == "png") {
      try {
        // Convert the div to an image
        const imageUrl = await htmlToImage.toPng(componentRef.current);

        // Trigger the download of the image
        saveAs(imageUrl, "downloaded_image.png");
      } catch (error) {
        snackbar.showMessage("Error downloading image", undefined, undefined, {
          type: "error",
        });
      }
    }
    if (type.toLowerCase() == "csv") {
      let csvString = toCSVText(chartConfig, title);
      saveAs(
        new Blob([toCSVText(chartConfig, title)], {
          type: "text/plain;charset=utf-8",
        }),
        "downloaded_csv.csv"
      );
    }

    if (type.toLowerCase() == "excel") {
      let csvString = toCSVText(chartConfig, title);
      let json_data = await csvtojson().fromString(csvString);
      let ws = XLSX.utils.json_to_sheet(json_data);
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "sheet");
      XLSX.writeFile(wb, "downloaded_excel.xlsx", { type: "file" });
    }

    handleClose();
  };

  const popover_id = Boolean(subMenuAnchorEl) ? "simple-popover" : undefined;
  const popover_id2 = Boolean(subMenuAnchorChangeChartType)
    ? "simple-popover2"
    : undefined;
  const [selectShare, setSelectShare] = React.useState(false);
  const [shareURL, setShareURL] = React.useState("");

  const handleShare = () => {
    const currentURL = window.location.href;
    let shareURL;
    if (item.id) {
      shareURL = `${currentURL}&dashboardItemId=${item.id}`;
    } else {
      shareURL = `${currentURL}&dashboardItemId=${item._id}`;
    }
    setSelectShare(true);
    setShareURL(shareURL);
    // return <ShareModal />;
  };

  return (
    <Grid item xs={12} md={6} lg={6}>
      <Paper
        ref={componentRef}
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
                height: "13cm",
                width: "100%",
              }
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={10} sm={11}>
            <Title>{title}</Title>
          </Grid>
          <Grid item xs={2} sm={1}>
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
              <MenuItem onClick={handleSaveChart}>
                <ListItemIcon>
                  <BookmarkAddIcon />
                </ListItemIcon>
                <ListItemText primary="Save" />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <InsightsIcon />
                </ListItemIcon>
                <Popover
                  id={popover_id2}
                  open={Boolean(subMenuAnchorChangeChartType)}
                  anchorEl={subMenuAnchorChangeChartType}
                  onClose={() => setSubMenuAnchorChangeChartType(null)}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={() => setCustomChartType("line")}>
                    <ListItemIcon>
                      <ShowChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Line Chart" />
                  </MenuItem>
                  <MenuItem onClick={() => setCustomChartType("column")}>
                    <ListItemIcon>
                      <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Column Chart" />
                  </MenuItem>
                  <MenuItem onClick={() => setCustomChartType("pie")}>
                    <ListItemIcon>
                      <PieChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Pie Chart" />
                  </MenuItem>
                  <MenuItem onClick={() => setCustomChartType("bar")}>
                    <ListItemIcon>
                      <SplitscreenIcon />
                    </ListItemIcon>
                    <ListItemText primary="Bar Chart" />
                  </MenuItem>
                  <MenuItem onClick={() => setCustomChartType("scatter")}>
                    <ListItemIcon>
                      <ScatterPlotIcon />
                    </ListItemIcon>
                    <ListItemText primary="Scatter Chart" />
                  </MenuItem>
                  <MenuItem onClick={() => setCustomChartType("gauge")}>
                    <ListItemIcon>
                      <SpeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Gauge Chart" />
                  </MenuItem>
                  <MenuItem onClick={() => setCustomChartType("pivot_table")}>
                    <ListItemIcon>
                      <PivotTableChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Pivot Table" />
                  </MenuItem>
                </Popover>
                <ListItemText
                  onMouseEnter={handleSubMenuOpenChangeChartType}
                  primary="Change Chart Type"
                ></ListItemText>
              </MenuItem>
              <MenuItem onClick={handleShare}>
                <ListItemIcon>
                  <Share />
                </ListItemIcon>
                <ListItemText primary="Share" />
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <FileDownloadIcon />
                </ListItemIcon>
                <Popover
                  id={popover_id}
                  open={Boolean(subMenuAnchorEl)}
                  anchorEl={subMenuAnchorEl}
                  onClose={() => setSubMenuAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={() => handleDownload("csv")}>
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download CSV" />
                  </MenuItem>
                  <MenuItem onClick={() => handleDownload("excel")}>
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download Excel" />
                  </MenuItem>
                  <MenuItem onClick={() => handleDownload("png")}>
                    <ListItemIcon>
                      <InsertPhotoIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download PNG Image" />
                  </MenuItem>
                </Popover>
                <ListItemText
                  onMouseEnter={handleSubMenuOpen}
                  primary="Download"
                ></ListItemText>
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          renderChart()
        )}
        {selectShare && (
          <ShareModal
            open={selectShare}
            onClose={() => setSelectShare(false)}
            url={shareURL}
          />
        )}
      </Paper>
    </Grid>
  );
}

function DashboardItems(props) {
  console.log("first props", props);
  if (props?.items?.length == 0) {
    return <div>Empty Dashboard</div>;
  }
  return props?.items?.map((item, i) => {
    return (
      <DashboardItem
        {...props}
        key={item.id ?? item._id + i}
        item={{ ...item, id: item.id ?? item._id }}
      ></DashboardItem>
    );
  });
}

DashboardItem.propTypes = {
  children: PropTypes.node,
};

export default DashboardItems;
