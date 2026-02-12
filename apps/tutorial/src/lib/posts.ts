import { getCollection } from "astro:content";

export async function getPostsByLocale(locale: string) {
  const allPosts = await getCollection("posts");
  return allPosts
    .filter((post) => post.id.startsWith(`${locale}/`))
    .map((post) => ({
      ...post,
      slug: post.id.replace(`${locale}/`, ""),
    }))
    .sort((a, b) => {
      return (
        new Date(a.data.publishedAt).getTime() -
        new Date(b.data.publishedAt).getTime()
      );
    });
}

export function formatDate(
  date: string,
  includeRelative = false,
  locale = "en",
) {
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = date + "T00:00:00";
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate =
      locale === "ru" ? yearsAgo + " г. назад" : yearsAgo + "y ago";
  } else if (monthsAgo > 0) {
    formattedDate =
      locale === "ru" ? monthsAgo + " мес. назад" : monthsAgo + "mo ago";
  } else if (daysAgo > 0) {
    formattedDate = locale === "ru" ? daysAgo + " д. назад" : daysAgo + "d ago";
  } else {
    formattedDate = locale === "ru" ? "Сегодня" : "Today";
  }

  const localeString = locale === "ru" ? "ru-RU" : "en-US";
  let fullDate = targetDate.toLocaleString(localeString, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return fullDate + " (" + formattedDate + ")";
}
