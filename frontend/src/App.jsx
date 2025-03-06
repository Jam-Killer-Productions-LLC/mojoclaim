// src/App.jsx
import React from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import ClaimPage from "./components/ClaimPage";
import "./styles.css";

// Replace with your chain ID. In our case, defineChain(10) corresponds to chainId 10.
const desiredChainId = 10;

function App() {
  return (
    <ThirdwebProvider desiredChainId={desiredChainId}>
      <div className="app">
        <header className="app-header">
          <img
            src="https://bafybeig6dpytw3q4v7vzdy6sb7q4x3apqgrvfi3zsbvb3n6wvs5unfr36i.ipfs.dweb.link?filename=480.gif"
            alt="MOJO Logo"
            className="logo"
          />
        </header>
        <ClaimPage />
      </div>
    </ThirdwebProvider>
  );
}

export default App;