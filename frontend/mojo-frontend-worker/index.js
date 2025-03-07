export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const headers = {
      "Content-Security-Policy": "script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://*.ipfs.dweb.link; img-src 'self' https://*.ipfs.dweb.link data:;",
      "Access-Control-Allow-Origin": "https://mojoclaim.producerprotocol.pro",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (path === "/styles.css") {
      const css = await env.ASSETS.get("styles.css");
      if (!css) return new Response("Not Found", { status: 404 });
      return new Response(css, {
        headers: { "Content-Type": "text/css", ...headers },
      });
    }

    if (path === "/thirdweb.js") {
      const js = await env.ASSETS.get("thirdweb.js");
      if (!js) return new Response("Not Found", { status: 404 });
      return new Response(js, {
        headers: { "Content-Type": "application/javascript", ...headers },
      });
    }

    const html = await env.ASSETS.get("index.html");
    if (!html) return new Response("Not Found", { status: 404 });
    return new Response(html, {
      headers: { "Content-Type": "text/html", ...headers },
    });
  },
};