import { red, yellow, orange } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#009688",
    },
    secondary: {
      main: "#114B5F",
    },
    error: {
      main: "#ad1457",
    },
    phase1: {
      main: red["A100"],
    },
    phase2: {
      main: orange.A400,
    },
    phase3: {
      main: "#9e9d24",
    },
    phase4: {
      main: yellow.A700,
    },
    phase6: {
      main: "#00897b",
    },
    phase5: {
      main: "#a7ffeb",
    },
  },
});

export default theme;
