import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
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

      const allowlistObj = await env.local_allowlist.get("allowlist.json");
      if (!allowlistObj) {
        return new Response(
          JSON.stringify({ status: "error", message: "Allowlist not found" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const allowlist = JSON.parse(await allowlistObj.text());
      if (!allowlist.addresses.includes(walletLower)) {
        return new Response(
          JSON.stringify({ status: "error", message: "Not Eligible" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const alreadyClaimed = await env.mojo_kv.get(walletLower);
      if (alreadyClaimed) {
        return new Response(
          JSON.stringify({ status: "error", message: "Already Claimed" }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!env.PRIVATE_KEY) {
        return new Response(
          JSON.stringify({ status: "error", message: "PRIVATE_KEY not configured" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const client = createThirdwebClient({
        clientId: env.THIRDWEB_CLIENT_ID,
      });

      const account = privateKeyToAccount({
        client,
        privateKey: env.PRIVATE_KEY,
      });

      const contract = getContract({
        client,
        chain: defineChain({
          id: 10, // Optimism
          rpc: env.QUICKNODE_RPC_URL,
        }),
        address: "0xf9e7D3cd71Ee60C7A3A64Fa7Fcb81e610Ce1daA5",
      });

      const amount = "100000000000000000000000"; // 100,000 tokens
      const transaction = await prepareContractCall({
        contract,
        method: "function mintTo(address _to, uint256 _amount)",
        params: [walletLower, amount],
      });

      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      await env.mojo_kv.put(walletLower, "claimed");

      return new Response(
        JSON.stringify({ status: "success", transactionHash }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ status: "error", message: error.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }
};
