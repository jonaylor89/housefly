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

const localeCodes: Record<string, string> = {
  en: "en-US",
  ru: "ru-RU",
  es: "es-ES",
  zh: "zh-CN",
  ja: "ja-JP",
  de: "de-DE",
  ro: "ro-RO",
  hi: "hi-IN",
  ta: "ta-IN",
  gu: "gu-IN",
  fa: "fa-IR",
  ur: "ur-PK",
  ar: "ar",
  tr: "tr-TR",
};

export function formatDate(
  date: string,
  includeRelative = false,
  locale = "en",
) {
  const targetDate = new Date(
    date.includes("T") ? date : `${date}T00:00:00`,
  );
  const localeCode = localeCodes[locale] ?? localeCodes.en;
  const fullDate = new Intl.DateTimeFormat(localeCode, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(targetDate);

  if (!includeRelative) return fullDate;

  const elapsedDays = Math.floor(
    (Date.now() - targetDate.getTime()) / (24 * 60 * 60 * 1000),
  );
  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;
  if (elapsedDays >= 365) {
    value = Math.floor(elapsedDays / 365);
    unit = "year";
  } else if (elapsedDays >= 30) {
    value = Math.floor(elapsedDays / 30);
    unit = "month";
  } else {
    value = elapsedDays;
    unit = "day";
  }
  const relative = new Intl.RelativeTimeFormat(localeCode, {
    numeric: "auto",
  }).format(-value, unit);

  return `${fullDate} (${relative})`;
}
