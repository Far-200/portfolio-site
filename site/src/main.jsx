import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/v4-tokens.css";
import "./styles/v4-ambient.css";
import "./styles/v4-nav.css";
import "./styles/v4-hero.css";
import "./styles/v4-selected-work.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
