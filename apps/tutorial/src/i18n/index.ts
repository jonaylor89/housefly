import { getDictionary } from "./dictionaries";
import { defaultLocale, locales } from "./constants";
export { locales, defaultLocale };
export type { Dictionary } from "./dictionaries";

export function getDictionaryForLocale(locale: string) {
  if (!locales.includes(locale)) {
    return getDictionary(defaultLocale);
  }
  return getDictionary(locale);
}

export function getLocaleFromUrl(url: URL): string {
  const [, locale] = url.pathname.split("/");
  if (locale && locales.includes(locale)) {
    return locale;
  }
  return defaultLocale;
}
