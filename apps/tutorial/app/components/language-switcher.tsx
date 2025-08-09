"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales } from "../i18n/constants";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  // Get the current locale from the pathname
  const currentLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || 'en';
  
  // Get the path without the locale prefix
  const pathnameWithoutLocale = pathname
    .replace(new RegExp(`^\/${currentLocale}($|\/)`), '/')
    .replace(/^\/$/,'');

  // Map of language display names
  const languageNames = {
    en: 'English',
    ru: 'Русский',
    es: 'Español',
    zh: '中文',
    ja: '日本語',
    de: 'Deutsch',
    ro: 'Română',
    hi: 'हिन्दी',
    ta: 'தமிழ்',
    gu: 'ગુજરાતી',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="language-switcher relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 rounded-md transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{languageNames[currentLocale]}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-max min-w-full z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {locales.map(locale => (
            <Link 
              key={locale}
              href={`/${locale}${pathnameWithoutLocale}`}
              className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${locale === currentLocale ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {languageNames[locale]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}