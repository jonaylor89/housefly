import 'server-only';
import { getDictionary } from './dictionaries';
import { defaultLocale, locales } from './constants';

// Use this function in layout or page files
async function getLocale(locale: string) {
  // Validate that the locale is supported
  if (!locales.includes(locale as any)) {
    return defaultLocale;
  }
  
  return locale;
}

// Use this function in layout or page files
export async function getDictionaryForLocale(locale: string) {
  const validatedLocale = await getLocale(locale);
  return getDictionary(validatedLocale);
}