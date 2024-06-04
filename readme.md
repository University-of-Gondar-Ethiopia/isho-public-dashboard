# Public Dashboard for DHIS2

This is a public dashboard application built with React and Material-UI. It fetches data from the DHIS2 API and displays it in various visualizations.

## Installation

1. Clone the repository: `git clone https://github.com/HABTec/public-dashboard.git`
2. Navigate to the project directory: `cd public-dashboard`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

## Usage

The application is divided into different components:

- `Dashboard`: Displays a grid of visualizations fetched from the DHIS2 API.
- `DashboardItem`: Represents a single visualization.
- `Chart`: Displays a chart based on the selected visualization.
- `Map`: Displays a heatmap of data points on a map.
- `RequestForm`: Allows the user to request a specific dashboard from the DHIS2 API.

## Configuration

The application requires a `manifest.json` file in the `public` directory to enable PWA functionality. The `manifest.json` file should include the following:
