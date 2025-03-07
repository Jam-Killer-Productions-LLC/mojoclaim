import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Security-Policy": "default-src 'self' https://thirdweb.com https://cdn.thirdweb.com https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://thirdweb.com https://cdn.thirdweb.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://mojoclaim.pages.dev; img-src 'self' data: https://mojoclaim.pages.dev https://bafybeig6dpytw3q4v7vzdy6sb7q4x3apqgrvfi3zsbvb3n6wvs5unfr36i.ipfs.dweb.link; font-src 'self' https://fonts.gstatic.com;",
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

      const alreadyClaimed = await env.mojo_kv.get(walletLower);
      if (alreadyClaimed) {
        return new Response(
          JSON.stringify({ status: "error", message: "Already Claimed" }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

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