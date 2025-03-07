// ✅ Updated Content Security Policy (CSP) to allow Thirdweb scripts
const cspHeaderValue = `
  default-src 'self' https://thirdweb.com https://cdn.thirdweb.com https://thirdweb.dev;
  script-src 'self' 'unsafe-eval' https://thirdweb.com https://cdn.thirdweb.com https://thirdweb.dev;
`;

// ✅ Thirdweb SDK imports
import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

export default {
  async fetch(request, env) {
    // ✅ CORS & CSP Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://mojoclaim.producerprotocol.pro",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Security-Policy": cspHeaderValue,
    };

    // ✅ Handle CORS Preflight Requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ✅ Enforce POST-only method
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      // ✅ Parse request body
      const { wallet } = await request.json();
      if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
        return new Response(
          JSON.stringify({ status: "error", message: "Invalid wallet address" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const walletLower = wallet.toLowerCase();

      // ✅ Load allowlist from Cloudflare R2
      const allowlistObj = await env.local_allowlist.get("allowlist.json");
      if (!allowlistObj) {
        throw new Error("Allowlist not found in R2 bucket");
      }

      const allowlist = JSON.parse(await allowlistObj.text());

      // ✅ Debugging Log (Optional)
      console.log("Allowlist Data:", allowlist);

      if (!allowlist.addresses.includes(walletLower)) {
        return new Response(
          JSON.stringify({ status: "error", message: "Not Eligible" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // ✅ Check if wallet has already claimed
      const alreadyClaimed = await env.mojo.get(walletLower);
      if (alreadyClaimed) {
        return new Response(
          JSON.stringify({ status: "error", message: "Already Claimed" }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // ✅ Initialize Thirdweb Client
      const client = createThirdwebClient({
        clientId: env.THIRDWEB_CLIENT_ID,
        secretKey: env.THIRDWEB_SECRET_KEY,
      });

      if (!env.PRIVATE_KEY) {
        throw new Error("PRIVATE_KEY not configured");
      }

      // ✅ Create Thirdweb account
      const account = privateKeyToAccount({
        client,
        privateKey: env.PRIVATE_KEY,
      });

      // ✅ Define Optimism contract
      const contract = getContract({
        client,
        chain: defineChain({
          id: 10, // Optimism
          rpc: env.QUICKNODE_RPC_URL || "https://nameless-practical-seed.optimism.quiknode.pro/e4850d21b93c9dc2993e74d91ebb00e4c3171f38/",
        }),
        address: "0xf9e7D3cd71Ee60C7A3A64Fa7Fcb81e610Ce1daA5",
      });

      // ✅ Prepare & send mint transaction
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

      // ✅ Store claim status in KV
      await env.mojo.put(walletLower, "claimed");

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