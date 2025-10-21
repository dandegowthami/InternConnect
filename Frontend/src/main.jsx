import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { InternshipProvider } from "./context/InternshipContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <InternshipProvider>
        <App />
      </InternshipProvider>
    </BrowserRouter>
  </React.StrictMode>
);
