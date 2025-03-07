const sdk = new ThirdwebSDK("optimism", {
    clientId: "692b03efca5fa1f10f792dcf20fa172c",
  });
  
  const status = document.getElementById("status");
  status.textContent = "SDK Loaded.";
  
  const claimBtn = document.getElementById("claim-btn");
  const contractAddress = "0xf9e7D3cd71Ee60C7A3A64Fa7Fcb81e610Ce1daA5";
  const amount = "100000000000000000000000"; // 100,000 * 10^18
  
  claimBtn.addEventListener("click", async () => {
    status.textContent = "Button clicked!";
    try {
      if (!window.ethereum) {
        status.textContent = "MetaMask not detected! Please install MetaMask.";
        console.error("No window.ethereum");
        return;
      }
  
      status.textContent = "Connecting to MetaMask...";
      console.log("Attempting to connect wallet...");
      await sdk.wallet.connect("metamask");
      const wallet = (await sdk.wallet.getAddress()).toLowerCase();
      status.textContent = `Connected: ${wallet}`;
      console.log("Wallet connected:", wallet);
  
      status.textContent = "Checking eligibility...";
      const response = await fetch("https://mojo-claim-worker.fletcher-christians-account3359.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      const result = await response.json();
      console.log("Worker response:", result);
      if (result.status !== "success") {
        status.textContent = `Error: ${result.message}`;
        return;
      }
  
      status.textContent = "Minting 100,000 Mojo...";
      const contract = sdk.getContract(contractAddress);
      const tx = await contract.call("mintTo", [wallet, amount]);
      status.textContent = `Minted! Tx Hash: ${tx.receipt.transactionHash}`;
      console.log("Mint tx:", tx.receipt.transactionHash);
    } catch (error) {
      console.error("Action failed:", error.message, error.stack);
      status.textContent = "Failed: " + error.message;
    }
  });