import { useWallet, useConnect, metamaskWallet } from "thirdweb/react";
const ClaimButton = () => {
  const wallet = useWallet();
  const connect = useConnect();
  return (
    <div>
      {wallet ? (
        <button onClick={() => alert("Claim function coming soon!")} className="claim-button">
          Claim Mojo
        </button>
      ) : (
        <button onClick={() => connect(metamaskWallet())} className="claim-button">
          Connect Wallet
        </button>
      )}
    </div>
  );
};
export default ClaimButton;