import React from "react";
import { ResponsiveRadar } from "@nivo/radar";

const data = [
  { metric: "Nehase 2015", value: 97.4 },
  { metric: "Meskerem 2016", value: 115.2 },
  { metric: "Tikemet 2016", value: 177.2 },
  { metric: "Hidar 2016", value: 99.2 },
  { metric: "Tahesas 2016", value: 100 },
  { metric: "Tir 2016", value: 101.6 },
  { metric: "Yekatit 2016", value: 99.6 },
  { metric: "Megabit 2016", value: 101.6 },
  { metric: "Miazia 2016", value: 97.7 },
  { metric: "Ginbot 2016", value: 300 },
  { metric: "Sene 2016", value: 97.7 },
  { metric: "Hamle 2016", value: 99.6 },
];

const RadarChartComponent = ({ chartData, chartInfo, item }) => {
    chartData.rows.map((values, index) =>{
        data.push({metric: chartData.metaData[index], value: values[item]})
    })
    
  return (
    <div style={{ height: 500 }}>
      <ResponsiveRadar
        data={data}
        keys={["value"]}
        indexBy="metric"
        maxValue={300}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: "color" }}
        gridLevels={6}
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
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionConfig="wobbly"
        isInteractive={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: -50,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: "#999",
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
};

export default RadarChartComponent;
