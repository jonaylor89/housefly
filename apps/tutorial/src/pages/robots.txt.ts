import type { APIContext } from "astro";

export function GET(context: APIContext): Response {
  const sitemapURL = new URL("/sitemap-index.xml", context.site).href;
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`,
    { headers: { "Content-Type": "text/plain" } },
  );
}
