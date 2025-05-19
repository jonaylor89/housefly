import { baseUrl, getPosts } from "app/lib/utils";

export async function GET() {
  let allPosts = await getPosts();

  console.log({ allPosts: allPosts.map((post) => post) });

  const itemsXml = allPosts
    .sort((a, b) => {
      if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .map(
      (post) =>
        `<item>
          <title>${post.title}</title>
          <link>${baseUrl}/posts/${post.slug}</link>
          <description>${post.summary || ""}</description>
          <pubDate>${new Date(
            post.publishedAt,
          ).toUTCString()}</pubDate>
        </item>`,
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>Housefly - Web Scraping Playground</title>
        <link>${baseUrl}</link>
        <description>Housefly - Web Scraping Playground RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
