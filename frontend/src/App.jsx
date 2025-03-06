// src/App.jsx
import React from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import ClaimPage from "./components/ClaimPage";

const desiredChainId = 10; // Use your chainId (for example, 10 for Optimism)

const App = () => {
  return (
    <ThirdwebProvider desiredChainId={desiredChainId}>
      <div style={styles.app}>
        <header style={styles.header}>
          <img
            src="https://bafybeig6dpytw3q4v7vzdy6sb7q4x3apqgrvfi3zsbvb3n6wvs5unfr36i.ipfs.dweb.link?filename=480.gif"
            alt="MOJO Logo"
            style={styles.logo}
          />
        </header>
        <ClaimPage />
      </div>
    </ThirdwebProvider>
  );
};

const styles = {
  app: {
    minHeight: "100vh",
    backgroundImage:
      "url('https://bafybeichh5ayc3oiogb7k5b36cteojashw55m4ysz3aejruevb2cry4iua.ipfs.dweb.link?filename=MojoClaimPageNewbackground.png')",
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: "2rem",
  },
  logo: {
    width: "150px",
  },
};

export default App;