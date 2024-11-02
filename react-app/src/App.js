import "./App.css";
import { useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
import Process from "./components/Process";
import Upload from "./components/Upload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/process" element={<Process />} />
      </Routes>
    </Router>
  );
}

export default App;
