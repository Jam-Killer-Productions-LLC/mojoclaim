// src/App.jsx
import React from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { createThirdwebClient } from "@thirdweb-dev/sdk";
import ClaimPage from "./components/ClaimPage";

// Create the thirdweb client using the client ID from the environment variable.
const client = createThirdwebClient({
  clientId: import.meta.env.VITE_CLIENT_ID,
});

// Define your desired chain. (For example, chainId 10.)
const desiredChainId = 10;

function App() {
  return (
    <ThirdwebProvider desiredChainId={desiredChainId} client={client}>
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
}

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