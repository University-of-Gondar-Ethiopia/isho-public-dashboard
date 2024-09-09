// require('dotenv').config();
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems } from "./listItems";
import Chart from "./Chart";
import SecondaryListItems from "./SecondaryListItems";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        CDHi
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function RequestForm() {
  const form = React.useRef();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [affiliation, setAffiliation] = React.useState("");
  const [request, setRequest] = React.useState("");
  const [showChart, setShowChart] = React.useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAffiliationChange = (event) => {
    setAffiliation(event.target.value);
  };

  const handleRequestChange = (event) => {
    setRequest(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const recipient = process.env.REACT_APP_EMAIL_ADRESS;
    window.open(
      `mailto:${recipient}?subject=Request on ${affiliation}&body=${request}`
    );
  };

  const handleSavedReportClick = () => {
    setShowChart(true);
  };

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [savedReports, setSavedReports] = React.useState(
    JSON.parse(localStorage.getItem("saved_reports"))
  );

  const [selectedSavedChart, setSelectedSavedChart] = React.useState(null);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              HMIS Insights: Exploring Health Metrics with Interactive
              Visualizations
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems
              savedReports={savedReports}
              setSavedReports={setSavedReports}
              setSelectedSavedChart={setSelectedSavedChart}
              onSavedReportClick={handleSavedReportClick}
            />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            pl: 4,
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, p: 4 }}>
            {showChart ? (
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                  {/* Chart */}
                  <Chart
                    savedReports={savedReports}
                    setSavedReports={setSavedReports}
                    selectedSavedChart={selectedSavedChart}
                    setSelectedSavedChart={setSelectedSavedChart}
                  />
                </Grid>
                <Copyright sx={{ pt: 4 }} />
              </Container>
            ) : (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                padding={4}
                rowSpacing={2}
                spacing={4}
                sx={{ padding: "10px", marginTop: "5rem" }}
              >
                <Paper elevation={3}>
                  <Typography
                    variant="h6"
                    align="center"
                    gutterBottom
                    sx={{ padding: "10px" }}
                  >
                    Request Form
                  </Typography>
                  <form ref={form} onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ padding: "15px" }}>
                      <Grid item xs={12}>
                        <TextField
                          sx={{ padding: "10px" }}
                          name="name"
                          label="Full Name"
                          variant="outlined"
                          required
                          fullWidth
                          value={name}
                          onChange={handleNameChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          sx={{ padding: "10px" }}
                          name="email"
                          label="Email"
                          variant="outlined"
                          required
                          fullWidth
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          sx={{ padding: "10px" }}
                          name="affiliation"
                          label="Affiliation"
                          variant="outlined"
                          required
                          fullWidth
                          value={affiliation}
                          onChange={handleAffiliationChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{ padding: "10px" }}
                        >
                          <InputLabel htmlFor="request">Request</InputLabel>
                          <OutlinedInput
                            name="request"
                            id="request"
                            multiline
                            rows={4}
                            required
                            label="Request"
                            value={request}
                            onChange={handleRequestChange}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{ padding: "10px" }}
                        >
                          Submit Request
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
