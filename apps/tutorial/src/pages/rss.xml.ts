import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const allPosts = await getCollection("posts");

  const items = allPosts
    .sort((a, b) => {
      return (
        new Date(b.data.publishedAt).getTime() -
        new Date(a.data.publishedAt).getTime()
      );
    })
    .map((post) => {
      const parts = post.id.split("/");
      const locale = parts[0];
      const slug = parts.slice(1).join("/");
      return {
        title:
          post.data.title +
          (locale !== "en" ? " (" + locale.toUpperCase() + ")" : ""),
        pubDate: new Date(post.data.publishedAt),
        description: post.data.summary || "",
        link: "/" + locale + "/posts/" + slug,
      };
    });

  return rss({
    title: "Housefly - Web Scraping Playground",
    description: "Housefly - Web Scraping Playground RSS feed - All languages",
    site: context.site!.toString(),
    items,
  });
}
