import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// The two faces, self-hosted from fontsource (OFL). Libre Franklin for the
// interface, Source Serif 4 for the written summaries. No CDN.
import "@fontsource-variable/libre-franklin";
import "@fontsource-variable/source-serif-4";
import "./index.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
