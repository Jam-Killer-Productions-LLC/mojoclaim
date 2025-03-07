const sdk = new ThirdwebSDK("optimism", {
  clientId: "692b03efca5fa1f10f792dcf20fa172c",
});
const status = document.getElementById("status");
status.textContent = "SDK Loaded.";

const claimBtn = document.getElementById("claim-btn");

claimBtn.addEventListener("click", async () => {
  try {
    if (!window.ethereum) {
      status.textContent = "MetaMask not detected! Please install MetaMask.";
      return;
    }

    status.textContent = "Connecting to MetaMask...";
    await sdk.wallet.connect("metamask");
    const wallet = (await sdk.wallet.getAddress()).toLowerCase();
    status.textContent = `Connected: ${wallet}`;

    status.textContent = "Claiming 100,000 Mojo...";
    const response = await fetch("https://mojo-claim-worker.fletcher-christians-account3359.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });
    const result = await response.json();
    if (result.status === "success") {
      status.textContent = `Claimed! Tx Hash: ${result.transactionHash}`;
    } else {
      status.textContent = `Error: ${result.message}`;
    }
  } catch (error) {
    console.error("Action failed:", error);
    status.textContent = "Failed: " + error.message;
  }
});