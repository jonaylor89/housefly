import { baseUrl, getPosts } from "app/lib/utils";
import { locales } from "app/i18n/constants";

export async function GET() {
  // Get posts from all locales
  const allPostsPromises = locales.map(async (locale) => {
    const posts = await getPosts(locale);
    return posts.map(post => ({
      ...post,
      locale,
      link: `${baseUrl}/${locale}/posts/${post.slug}`
    }));
  });

  const allPostsArrays = await Promise.all(allPostsPromises);
  const allPosts = allPostsArrays.flat();

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
          <title>${post.title}${post.locale !== 'en' ? ` (${post.locale.toUpperCase()})` : ''}</title>
          <link>${post.link}</link>
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
        <description>Housefly - Web Scraping Playground RSS feed - All languages</description>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
