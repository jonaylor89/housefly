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
  
  // Get the path without the locale prefix
  const pathnameWithoutLocale = pathname
    .replace(new RegExp(`^\/${currentLocale}($|\/)`), '/')
    .replace(/^\/$/, '');

  // Map of language display names
  const languageNames = {
    en: 'English',
    ru: 'Русский',
    es: 'Español',
    zh: '中文',
    ja: '日本語'
  };

  return (
    <div className="language-switcher flex gap-2">
      {locales.map(locale => (
        locale !== currentLocale && (
          <Link 
            key={locale}
            href={`/${locale}${pathnameWithoutLocale}`}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 rounded-md transition-colors"
          >
            {languageNames[locale]}
          </Link>
        )
      ))}
    </div>
  );
}