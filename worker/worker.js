export default {
  async fetch(request, env) {
      if (request.method !== "POST") {
          return new Response("Method Not Allowed", { status: 405 });
      }

      try {
          const data = await request.json();
          const address = data.event.address.toLowerCase();
          const eventType = data.event.type;

          // Load thirdweb client with Cloudflare secrets
          const client = createThirdwebClient({
              clientId: env.THIRDWEB_CLIENT_ID,
              secretKey: env.THIRDWEB_SECRET_KEY,
          });

          // Connect to MojoClaim contract
          const contract = getContract({
              client,
              chain: defineChain(10),
              address: "0x84d133d1CecB3190E110118AC6598C9BA45A6FD2",
          });

          // Retrieve and update claim status
          let allowlist = JSON.parse(await env.ALLOWLIST_KV.get("allowlist")) || { allowlist: [] };
          let user = allowlist.allowlist.find((entry) => entry.address.toLowerCase() === address);

          if (user) {
              if (eventType === "ClaimProcessed") user.claimed = true;
              if (eventType === "Minted") user.minted = true;
          }

          await env.ALLOWLIST_KV.put("allowlist", JSON.stringify(allowlist));

          return new Response("Success", { status: 200 });
      } catch (error) {
          return new Response(`Error processing request: ${error}`, { status: 500 });
      }
  }
};