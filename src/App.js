import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import RequestForm from "./Components/RequestForm";
import useServiceWorker from "./hooks/useServiceWorker";
import Indicator from "./Components/Indicator";
import ReactGA from "react-ga4";

export default function App() {
  const GAKey = process.env.REACT_APP_GA_ID;
  ReactGA.initialize(GAKey);

  useServiceWorker();

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/indicator" element={<Indicator />} />
        </Routes>
      </Router>
    </div>
  );
}
