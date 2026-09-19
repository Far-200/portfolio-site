import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/v4-tokens.css";
import "./styles/v4-rhythm.css";
import "./styles/v4-ambient.css";
import "./styles/v4-nav.css";
import "./styles/v4-hero.css";
import "./styles/v4-selected-work.css";
import "./styles/v4-build-log.css";
import "./styles/v4-log-bridge.css";
import "./styles/v4-lab-bridge.css";
import "./styles/v4-lab.css";
import "./styles/v4-notfound.css";
import "./styles/v4-resume.css";
import "./styles/v4-project.css";
import "./styles/v4-motion.css";
import "./styles/v4-about.css";
import "./styles/v4-interaction.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
