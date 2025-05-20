import { getPosts } from "app/lib/utils";

export const baseUrl = "https://housefly.cc";
const locales = ['en', 'ru', 'es', 'zh', 'ja'];

export default async function sitemap() {
  // Generate entries for all posts in both languages
  const blogEntries: { url: string; lastModified: string }[] = [];
  
  for (const locale of locales) {
    const posts = await getPosts(locale);
    const localizedPosts = posts.map((post) => ({
      url: `${baseUrl}/${locale}/posts/${post.slug}`,
        lastModified: post.publishedAt,
    }));

    blogEntries.push(...localizedPosts);
  }

  // Generate entries for static routes in both languages
  const routeEntries: { url: string; lastModified: string }[] = [];
  const routes = ["", "/posts"];
  
  for (const locale of locales) {
    for (const route of routes) {
      routeEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    }
  }

  // Also include the root URL which will redirect to the default locale
  const rootEntry = {
    url: baseUrl,
    lastModified: new Date().toISOString().split("T")[0],
  };

  return [rootEntry, ...routeEntries, ...blogEntries];
}