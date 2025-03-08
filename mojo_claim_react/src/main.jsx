import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect } from "thirdweb/react";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;  // 🔥 Use env variable

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      clientId={clientId}
      supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);