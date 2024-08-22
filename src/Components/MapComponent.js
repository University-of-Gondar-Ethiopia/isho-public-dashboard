import React, { useEffect, useState } from "react";
import { getFilters, getDimensions, getOuDimensions } from "../utils/filters";
import Map from "./Map";
import { useSnackbar } from "material-ui-snackbar-provider";

function MapComponent({ data, setMapData, mainProps, setLoading }) {
  const apiBase = process.env.REACT_APP_BASE_URI;
  const [shapes, setShapes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const snackbar = useSnackbar();
  const [chartData, setChartData] = useState({});
  let url = process.env.REACT_APP_BASE_URI;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Order mapViews by layer type
        const orderedMapViews = [...data.mapViews].sort((a, b) => {
          const order = ["thematic", "orgUnit", "facility"];
          return order.indexOf(a.layer) - order.indexOf(b.layer);
        });

        // Process ordered mapViews
        const promises = orderedMapViews.map(async (view) => {
          let filters = getFilters(view.filters, mainProps?.filters);
          let dimension = getDimensions(view);
          let ou_dimension = getOuDimensions(view.rows, { type: "MAP" });

          let geoFeaturesUrl = `${apiBase}api/geoFeatures.json?ou=${ou_dimension}&displayProperty=NAME`;

          const response = await fetch(encodeURI(geoFeaturesUrl));
          const shapeData = await response.json();

          url += "api/40/analytics.json?" + dimension + filters;
          fetch(encodeURI(url))
            .then((response) => response.json())
            .then((analyticsData) => {
              console.log("chartData", analyticsData);

              setChartData((prevChartData) => ({
                ...prevChartData,
                [view.id]: analyticsData,
              }));
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
            });

          setShapes((prevShapes) => ({ ...prevShapes, [view.id]: shapeData }));
        });

        await Promise.all(promises);
        setIsLoading(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        snackbar.showMessage("Error fetching data");
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mainProps.filters, data, setMapData, setLoading, shapes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("data", data);
  console.log("shape", shapes);

  return (
    <Map
      key={data.id}
      mapViews={data.mapViews}
      chartDatas={chartData}
      shapes={shapes}
      basemap={data.basemap}
    />
  );
}

export default MapComponent;
