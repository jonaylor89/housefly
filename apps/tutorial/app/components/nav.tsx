import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { Dictionary } from "../i18n/dictionaries";

type NavbarProps = {
  locale: string;
  dictionary: Dictionary;
};

export function Navbar({ locale, dictionary }: NavbarProps) {
  // Create the nav items dynamically based on the locale and dictionary
  const navItems = {
    [`/${locale}`]: {
      name: dictionary.nav.home,
    },
    [`/${locale}/posts`]: {
      name: dictionary.nav.posts,
    },
    [`/${locale}/how-to`]: {
      name: dictionary.nav.howTo,
    },
  };
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row justify-start items-center px-0 pb-0 fade"
          id="nav"
        >
          <div className="flex flex-row justify-between px-10 w-full">
            <div className="flex flex-row items-center">

            <Link href={`/${locale}`}>
              <Image
                src="/housefly-logo.png"
                alt="Logo"
                width={36}
                height={36}
              />
            </Link>

            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                >
                  {name}
                </Link>
              );
            })}
            </div>
            
            <div>
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
