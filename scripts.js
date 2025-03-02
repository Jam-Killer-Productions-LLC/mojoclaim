import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize thirdweb with secure credentials
const client = createThirdwebClient({
    clientId: process.env.THIRDWEB_CLIENT_ID,
    secretKey: process.env.THIRDWEB_SECRET_KEY,
});

// Connect to the MojoClaim contract
const contract = getContract({
    client,
    chain: defineChain(10),
    address: "0x84d133d1CecB3190E110118AC6598C9BA45A6FD2",
});

// Function to check Allowlist JSON for eligibility
async function checkAllowlist(address) {
    try {
        const response = await fetch("/allowlist.json");
        const data = await response.json();
        const user = data.allowlist.find(entry => entry.address.toLowerCase() === address.toLowerCase());
        return user && !user.claimed;
    } catch (error) {
        console.error("Error fetching allowlist:", error);
        return false;
    }
}

// Function to handle wallet connection
async function connectWallet() {
    const { ThirdwebProvider, useAddress, useMetamask } = await import("thirdweb");
    
    const address = useAddress();
    const connect = useMetamask();
    
    if (!address) {
        connect();
    }
    
    const eligible = await checkAllowlist(address);
    if (eligible) {
        document.getElementById("claim-status").innerText = "✅ You are eligible to claim!";
    } else {
        document.getElementById("claim-status").innerText = "❌ You are NOT eligible to claim.";
    }
}

// Event listener for wallet connection button
document.addEventListener("DOMContentLoaded", () => {
    const connectButton = document.getElementById("connect-wallet");
    if (connectButton) {
        connectButton.addEventListener("click", connectWallet);
    }
});
