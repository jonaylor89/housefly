"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "../i18n/constants";

export function LanguageSwitcher() {
  const pathname = usePathname();
  
  // Get the current locale from the pathname
  const currentLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || 'en';
  
  // Get the alternative locale
  const alternativeLocale = currentLocale === 'en' ? 'ru' : 'en';
  
  // Get the path without the locale prefix
  const pathnameWithoutLocale = pathname
    .replace(new RegExp(`^\/${currentLocale}($|\/)`), '/')
    .replace(/^\/$/, '');
  
  // Construct target path with the alternative locale
  const targetPath = `/${alternativeLocale}${pathnameWithoutLocale}`;

  return (
    <div className="language-switcher">
      <Link 
        href={targetPath}
        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        {currentLocale === 'en' ? "Русский" : "English"}
      </Link>
    </div>
  );
}