import React, { useState } from "react";
import { ThirdwebProvider, useConnect } from "thirdweb/react";

const WalletConnect = () => {
  const [wallet, setWallet] = useState(null);
  const connect = useConnect();

  const handleConnect = async () => {
    try {
      const address = await connect();
      setWallet(address);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <div>
      {wallet ? (
        <ClaimButton wallet={wallet} />
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default () => (
  <ThirdwebProvider clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}>
    <WalletConnect />
  </ThirdwebProvider>
);