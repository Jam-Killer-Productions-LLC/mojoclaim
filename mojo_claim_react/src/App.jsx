import { ConnectButton, useAddress } from "thirdweb/react";

import MojoClaimIcon from "./assets/PPs.svg";
import { client } from "/src/client.js";
import { useState } from "react";

export function App() {
  // Get the connected wallet address
  const address = useAddress();

  // State variable to display success/error messages
  const [message, setMessage] = useState("");

  // Function to call the worker and claim Mojo tokens
  const claimMojo = async () => {
    // If no wallet is connected, display a message
    if (!address) {
      setMessage("Please connect your wallet first.");
      return;
    }

    try {
      // Call your worker using the provided URL and send the connected wallet address
      const response = await fetch(
        "https://mojo-claim-worker.fletcher-christians-account3359.workers.dev",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet: address }),
        },
      );

      const data = await response.json();
      // Check for success status and update message state accordingly
      if (data.status === "success") {
        setMessage(
          `✅ Success! Tx: ${data.transactionHash}`,
        );
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      // If something goes wrong, show an error message
      setMessage("⚠ Something went wrong. Try again.");
    }
  };

  return (
    <div className="background">
      <div className="content">
        <img
          src="https://bafybeig6dpytw3q4v7vzdy6sb7q4x3apqgrvfi3zsbvb3n6wvs5unfr36i.ipfs.dweb.link?filename=480.gif"
          alt="Mojo Logo"
        />
        <h1>Mojo Claim</h1>
        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Mojo Claim",
              url: "https://mojoclaim.producerprotocol.pro",
            }}
          />
        </div>
        <button onClick={claimMojo} className="claim-btn">
          Claim MOJO
        </button>
        {message && (
          <p className="status-message">{message}</p>
        )}
      </div>
    </div>
  );
}
