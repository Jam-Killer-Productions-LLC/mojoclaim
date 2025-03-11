import { ConnectButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { client } from "/src/client.js";
import { useState } from "react";

export function App() {
  const account = useActiveAccount();
  const address = account?.address; 
  const [message, setMessage] = useState("");

  const claimMojo = async () => {
    if (!address) {
      setMessage("Please connect your wallet first.");
      return;
    }

    try {
      const response = await fetch("https://mojo-claim-worker.fletcher-christians-account3359.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setMessage(`✅ Success! Tx: ${data.transactionHash}`);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("⚠ Something went wrong. Try again.");
    }
  };

  return (
    <div className="background">
      <div className="content">
        <h1>Mojo Claim</h1>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <img 
            src="https://bafybeig6dpytw3q4v7vzdy6sb7q4x3apqgrvfi3zsbvb3n6wvs5unfr36i.ipfs.dweb.link?filename=480.gif" 
            alt="Mojo Logo" 
            className="w-20 h-20" 
          />
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Mojo Claim",
              url: "https://mojoclaim.producerprotocol.pro",
            }}
          />
        </div>

        <div className="mt-4">
          <button onClick={claimMojo} className="claim-btn">
            Claim MOJO
          </button>
        </div>

        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
}