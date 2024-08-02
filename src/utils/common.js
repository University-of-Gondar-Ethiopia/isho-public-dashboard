import * as science from "science";

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

const toCSVText = function (chartConfig, title) {
  if (!chartConfig) return "";

  let csvString = title + "\n,";

  if (chartConfig.data) {
    // it is a pie chart
    csvString +=
      "\n" +
      chartConfig.data.reduce(
        (alldata, data) => alldata + data.label + "," + data.value + "\n",
        ""
      );
  }

  if (chartConfig.yAxis) {
    // it is not a pie chart

    csvString +=
      chartConfig.series.reduce((x, y) => y.label + "," + x, "") + "\n"; // table header

    csvString += chartConfig.yAxis.categories.reduce((alldata, category, i) => {
      return (
        alldata +
        category +
        "," +
        chartConfig.series.reduce((y, series, seriesIndex) => {
          let retString = y;
          if (series.data[i]) retString += series.data[i] + ",";
          else retString += ",";
          return retString;
        }, "") +
        "\n"
      );
    }, "");
  }

  return csvString;
};

// LOESS function
const loess = function (xval, yval, bandwidth) {
  return science.stats.loess().bandwidth(bandwidth)(xval, yval);
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

export { toCSVText, getObjectItems, loess, getItemName };
