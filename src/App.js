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
import Button from "@mui/material/Button";
import Dashboard from "./Components/Dashboard";
import RequestForm from "./Components/RequestForm";
import useInstallPrompt from "./hooks/useInstallPrompt";
import useServiceWorker from "./hooks/useServiceWorker";

export default function App() {
  useServiceWorker();

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request-form" element={<RequestForm />} />
        </Routes>
      </Router>
      
    </div>
  );
}