import {
  useConnectedWallet,
  useConnect,
} from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const ClaimButton = () => {
  const wallet = useConnectedWallet();
  const connect = useConnect();

  const handleConnect = () => {
    connect(createWallet("io.metamask"));
  };

  return (
    <div>
      {wallet ? (
        <button>Claim Mojo</button>
      ) : (
        <button onClick={handleConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ClaimButton;
