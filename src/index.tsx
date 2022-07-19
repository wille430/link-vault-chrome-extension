import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { Popup } from "./popup/Popup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const client = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Popup />
    </QueryClientProvider>
  </React.StrictMode>
);
