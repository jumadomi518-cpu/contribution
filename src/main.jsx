
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// Capture JavaScript errors for debugging
window.onerror = function (message, source, line, column, error) {
  document.body.innerHTML = `
    <div style="padding:20px;color:#b91c1c;font-family:Arial">
      <h2>Application Error</h2>
      <pre style="white-space:pre-wrap">${message}</pre>
      <pre style="white-space:pre-wrap">${error?.stack || ""}</pre>
    </div>
  `;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

