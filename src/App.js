import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import RequestForm from "./Components/RequestForm";
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
