export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const path = url.pathname;
  
      if (path === "/styles.css") {
        const css = await env.ASSETS.get("styles.css");
        if (!css) return new Response("Not Found", { status: 404 });
        return new Response(css, {
          headers: { "Content-Type": "text/css" },
        });
      }
  
      if (path === "/thirdweb.js") {
        const js = await env.ASSETS.get("thirdweb.js");
        if (!js) return new Response("Not Found", { status: 404 });
        return new Response(js, {
          headers: { "Content-Type": "application/javascript" },
        });
      }
  
      const html = await env.ASSETS.get("index.html");
      if (!html) return new Response("Not Found", { status: 404 });
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    },
  };