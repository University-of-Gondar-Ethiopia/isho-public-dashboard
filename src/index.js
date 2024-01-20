import * as React from "react";
import * as ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
import { SnackbarProvider } from "material-ui-snackbar-provider";
import CustomSnackbar from "./Components/CustomSnackbar";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider
      SnackbarComponent={CustomSnackbar}
      SnackbarProps={{ autoHideDuration: 4000 }}
    >
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App />
    </SnackbarProvider>
  </ThemeProvider>
);
