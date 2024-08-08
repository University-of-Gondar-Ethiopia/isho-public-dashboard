[![Netlify Status](https://api.netlify.com/api/v1/badges/3788e94c-c894-492e-888a-af077b95d385/deploy-status)](https://app.netlify.com/sites/isho-dashboad/deploys)

# Public Dashboard for DHIS2

This is a public dashboard application built with React and Material-UI. It fetches data from the DHIS2 API and displays it in various visualizations.

## Installation

1. Clone the repository: `git clone https://github.com/University-of-Gondar-Ethiopia/isho-public-dashboard.git`
2. Navigate to the project directory: `cd isho-public-dashboard`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

## Usage

The application is divided into different components:

- `Dashboard`: Displays a grid of visualizations fetched from the DHIS2 API.
- `DashboardItem`: Represents a single visualization.
- `Chart`: Displays a chart based on the selected visualization.
- `Map`: Displays a heatmap of data points on a map.

## Configuration

The application requires a `manifest.json` file in the `public` directory to enable PWA functionality. The `manifest.json` file should include the following:
