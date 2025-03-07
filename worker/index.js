// Add this constant at the TOP of your file, before the export default
const cspHeaderValue =
  "default-src 'self'; script-src 'self' 'unsafe-eval' https://cdn.thirdweb.com";
import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

export default {
  async fetch(request, env) {
    // CORS configuration for security and cross-origin requests
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://mojoclaim.producerprotocol.pro",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Security-Policy": cspHeaderValue,
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Enforce POST method
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      // Validate wallet address
      const { wallet } = await request.json();
      if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
        return new Response(
          JSON.stringify({ status: "error", message: "Invalid wallet address" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const walletLower = wallet.toLowerCase();

      // Load and validate allowlist
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
      if (alreadyClaimed) {
        return new Response(
          JSON.stringify({ status: "error", message: "Already Claimed" }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Initialize thirdweb client and account
      const client = createThirdwebClient({
        clientId: env.THIRDWEB_CLIENT_ID,
        secretKey: env.THIRDWEB_SECRET_KEY,
      });

      if (!env.PRIVATE_KEY) {
        throw new Error("PRIVATE_KEY not configured");
      }

      const account = privateKeyToAccount({
        client,
        privateKey: env.PRIVATE_KEY,
      });

      // Configure contract on Optimism
      const contract = getContract({
        client,
        chain: defineChain({
          id: 10, // Optimism
          rpc: env.QUICKNODE_RPC_URL || "https://nameless-practical-seed.optimism.quiknode.pro/e4850d21b93c9dc2993e74d91ebb00e4c3171f38/",
        }),
        address: "0xf9e7D3cd71Ee60C7A3A64Fa7Fcb81e610Ce1daA5",
      });

      // Prepare and send minting transaction
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
      
            // Mark as claimed in KV store
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
