// src/components/ClaimPage.jsx
import React, { useState } from "react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

const ClaimPage = () => {
  const address = useAddress();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [message, setMessage] = useState("");

  const handleClaim = async () => {
    if (!address) {
      setMessage("Please connect your wallet.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      // Call your Cloudflare Worker API endpoint here (to be set up later)
      const response = await fetch("http://localhost:8787/api/claim", {
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
    <div style={styles.container}>
      {!address ? (
        <ConnectWallet accentColor="#000" colorMode="light" />
      ) : (
        <div style={styles.claimSection}>
          <p>Connected: {address}</p>
          <button onClick={handleClaim} disabled={loading} style={styles.button}>
            {loading ? "Claiming..." : "Claim Tokens"}
          </button>
        </div>
      )}
      {message && <p>{message}</p>}
      {txHash && <p>Transaction Hash: {txHash}</p>}
    </div>
  );
};

const styles = {
  container: {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "1rem 2rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  claimSection: {
    marginBottom: "1rem",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default ClaimPage;