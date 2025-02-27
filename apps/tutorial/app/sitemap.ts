import { getPosts } from "app/posts/utils";

export const baseUrl = "https://housefly.cc";

export default async function sitemap() {
  let blogs = (await getPosts()).map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let routes = ["", "/post", "how-to"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
