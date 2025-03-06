// src/components/ClaimPage.jsx
import React, { useState } from "react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

const ClaimPage = () => {
  const address = useAddress();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [message, setMessage] = useState("");

  const handleClaim = async () => {
    if (!address) {
      setMessage("Please connect your wallet.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      // Call your Cloudflare Worker API endpoint to handle the claim process.
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      });
      const data = await response.json();
      if (response.ok) {
        setTxHash(data.transactionHash);
        setMessage("Claim successful!");
      } else {
        setMessage(data.error || "Claim failed");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="claim-page">
      {!address ? (
        <ConnectWallet accentColor="#000" colorMode="light" />
      ) : (
        <div>
          <p>Connected: {address}</p>
          <button onClick={handleClaim} disabled={loading}>
            {loading ? "Claiming..." : "Claim Tokens"}
          </button>
        </div>
      )}
      {message && <p>{message}</p>}
      {txHash && <p>Transaction Hash: {txHash}</p>}
    </div>
  );
};

export default ClaimPage;