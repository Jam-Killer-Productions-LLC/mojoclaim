import {
    createThirdwebClient,
    getContract,
  } from "thirdweb";
  import { defineChain } from "thirdweb/chains";
  
  export default {
    async fetch(request, env) {
      // CORS handling
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }
  
      // Only accept POST requests
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
        });
      }
  
      try {
        const { wallet } = await request.json();
  
        // Thirdweb Client Setup
        const client = createThirdwebClient({
          clientId: env.THIRDWEB_CLIENT_ID,
        });
  
        // Contract Setup
        const contract = getContract({
          client,
          chain: defineChain(10), // Optimism
          address:
            "0xf9e7D3cd71Ee60C7A3A64Fa7Fcb81e610Ce1daA5",
        });
  
        // Load Allowlist
        const allowlist = JSON.parse(
          await env.ALLOWLIST.get("allowlist.json"),
        );
  
        // Check Wallet Eligibility
        if (
          !allowlist.addresses.includes(wallet.toLowerCase())
        ) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Not Eligible",
            }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
  
        // Check If Already Claimed
        const alreadyClaimed = await env.MOJO_KV.get(wallet);
        if (alreadyClaimed) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Already Claimed",
            }),
            {
              status: 409,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
  
        // Perform Claim Transaction
        const transaction = await prepareContractCall({
          contract,
          method: "function mintTo(address _to, uint256 _amount)",
          params: [_to, _amount],
        });
        const { transactionHash } = await sendTransaction({
          transaction,
          account: wallet,
        });
  
        // Mark as Claimed
        await env.MOJO_KV.put(wallet, "claimed");
  
        return new Response(
          JSON.stringify({
            status: "success",
            transactionHash,
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: error.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    },
  };
  