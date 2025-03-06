import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

export default {
  async fetch(request, env) {
    // CORS for mojoclaim.pages.dev
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://mojoclaim.pages.dev",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const { wallet } = await request.json();
      if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
        return new Response(
          JSON.stringify({ status: "error", message: "Invalid wallet address" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      const walletLower = wallet.toLowerCase();

      // Thirdweb Client Setup
      const client = createThirdwebClient({
        clientId: env.THIRDWEB_CLIENT_ID,
        secretKey: env.THIRDWEB_SECRET_KEY,
      });

      // Server-side wallet for signing
      if (!env.PRIVATE_KEY) {
        throw new Error("PRIVATE_KEY not configured");
      }
      const account = privateKeyToAccount({
        client,
        privateKey: env.PRIVATE_KEY,
      });

      // Contract Setup (Optimism)
      const contract = getContract({
        client,
        chain: defineChain({
          id: 10,
          rpc: env.QUICKNODE_RPC_URL || "https://nameless-practical-seed.optimism.quiknode.pro/e4850d21b93c9dc2993e74d91ebb00e4c3171f38/",
        }),
        address: "0xf9e7D3cd71Ee60C7A3A64Fa7Fcb81e610Ce1daA5",
      });

      // Load Allowlist from R2
      const allowlistObj = await env.local_allowlist.get("allowlist.json");
      if (!allowlistObj) {
        throw new Error("Allowlist not found in R2 bucket");
      }
      const allowlist = JSON.parse(await allowlistObj.text());
      if (!allowlist.addresses.includes(walletLower)) {
        return new Response(
          JSON.stringify({ status: "error", message: "Not Eligible" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check if claimed (KV: mojo)
      const alreadyClaimed = await env.mojo.get(walletLower);
      if (alreadyClaimed) {
        return new Response(
          JSON.stringify({ status: "error", message: "Already Claimed" }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mint 100,000 tokens
      const amount = "100000000000000000000000"; // 100,000 * 10^18
      const transaction = await prepareContractCall({
        contract,
        method: "function mintTo(address _to, uint256 _amount)",
        params: [walletLower, amount],
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      // Mark as claimed
      await env.mojo.put(walletLower, "true");

      return new Response(
        JSON.stringify({ status: "success", transactionHash }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (error) {
      console.error("Error:", error); // Logs to Cloudflare observability
      return new Response(
        JSON.stringify({ status: "error", message: error.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  },
};