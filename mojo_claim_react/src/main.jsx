import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "thirdweb/react";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;  // ✅ Load from .env

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider clientId={clientId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);