import "../global.css";
import type { Metadata } from "next";
import { Navbar } from "../components/nav";
import Footer from "../components/footer";
import { Space_Grotesk } from "next/font/google";
import { baseUrl } from "../lib/utils";
import PlausibleProvider from "next-plausible";
import { getDictionaryForLocale } from "../i18n/locale";

type Params = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const dictionary = await getDictionaryForLocale(params.locale);
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: dictionary.metadata.title,
      template: "%s | Housefly",
    },
    description: dictionary.metadata.description,
    openGraph: {
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      url: params.locale === 'en' ? baseUrl : `${baseUrl}/${params.locale}`,
      siteName: "Housefly",
      locale: params.locale === 'en' ? 'en_US' : 'ru_RU',
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      languages: {
        'en': baseUrl + '/en',
        'ru': baseUrl + '/ru',
      },
    },
  };
}

const cx = (...classes: unknown[]) => classes.filter(Boolean).join(" ");

const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const dictionary = await getDictionaryForLocale(locale);
  
  return (
    <html
      lang={locale}
      className={cx(
        "text-black bg-white dark:text-white dark:bg-black",
        SpaceGrotesk.variable,
      )}
    >
      <body className="antialiased max-w-2xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <PlausibleProvider domain="housefly.cc">
            <Navbar locale={locale} dictionary={dictionary} />
            <>{children}</>
            <Footer />
          </PlausibleProvider>
        </main>
      </body>
    </html>
  );
}