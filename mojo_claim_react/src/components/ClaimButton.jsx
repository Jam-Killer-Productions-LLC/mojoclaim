import React, { useState } from "react";

const ClaimButton = ({ wallet }) => {
  const [status, setStatus] = useState("");

  const claimTokens = async () => {
    setStatus("Checking eligibility...");
    try {
      const response = await fetch(import.meta.env.VITE_CLAIM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setStatus(`Claim Successful! Tx: ${data.transactionHash}`);
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      setStatus("Failed to claim tokens.");
    }
  };

  return (
    <div>
      <button onClick={claimTokens}>Claim Tokens</button>
      <p>{status}</p>
    </div>
  );
};

export default ClaimButton;