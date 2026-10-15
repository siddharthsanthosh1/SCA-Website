import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./lib/auth";
import { ProgressProvider } from "./lib/progress";
import "./styles/app.css";
import "./styles/games.css";
import "./styles/joy.css";

/* After a redeploy, a tab that was already open asks for code files that no
   longer exist. Reload once to pick up the new version; the error screen
   (components/ErrorBoundary) covers it if that doesn't help. */
window.addEventListener("vite:preloadError", (e) => {
  try {
    if (sessionStorage.getItem("sca-learn:reloaded")) return;
    sessionStorage.setItem("sca-learn:reloaded", "1");
  } catch {
    return;
  }
  e.preventDefault();
  window.location.reload();
});
window.addEventListener("load", () => {
  try {
    setTimeout(() => sessionStorage.removeItem("sca-learn:reloaded"), 10000);
  } catch {
    /* storage blocked */
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Hash URLs (/learn/#/course/python), like the main site: GitHub Pages
        has no rewrites, so a deep link to /learn/course/python would 404. */}
    <HashRouter>
      <AuthProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
