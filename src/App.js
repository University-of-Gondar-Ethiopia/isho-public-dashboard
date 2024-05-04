import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Dashboard from "./Components/Dashboard";
import Form from "./Components/Form";
import Home from "./Components/Home";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home title="" />} />
        <Route path="/dashboard" element={<Home title="Dashboard" />} />
        <Route path="/request-form" element={<Home title="Request-Form" />} />
      </Routes>
    </Router>
  );
}
