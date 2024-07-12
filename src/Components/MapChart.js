import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from './HeatMapLayer'; // Adjust the import path as necessary
import 'leaflet/dist/leaflet.css';

const MapChart = ({ chartData, chartInfo }) => {
  const getHeatmapData = () => {
    const { headers, metaData, rows } = chartData;

    if (!metaData || !rows || rows.length === 0) {
      return [];
    }

    const valueIndex = headers.findIndex(header => header.name === 'value');

    if (valueIndex === -1) {
      return [];
    }

    const heatmapData = rows.map(row => {
      const latitude = parseFloat(row[2]); // Adjust index based on your data structure
      const longitude = parseFloat(row[3]); // Adjust index based on your data structure
      const intensity = parseFloat(row[valueIndex]);
      return [latitude, longitude, intensity];
    });

    return heatmapData;
  };

  const heatmapData = getHeatmapData();

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {heatmapData.length > 0 && (
        <HeatmapLayer
          points={heatmapData}
          options={{ radius: 25, blur: 15, max: 1.0 }}
        />
      )}
    </MapContainer>
  );
};

MapChart.propTypes = {
  chartData: PropTypes.object.isRequired,
  chartInfo: PropTypes.object.isRequired,
};

export default MapChart;
