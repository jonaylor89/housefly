import "./global.css";
import type { Metadata } from "next";
import { Navbar } from "./components/nav";
import Footer from "./components/footer";
import { Space_Grotesk } from "next/font/google";
import { baseUrl } from "./lib/utils";
import PlausibleProvider from "next-plausible";

const title = "Housefly - Web Scraping Playground";
const description =
  "An interactive learning project designed to teach web scraping through structured challenges, featuring realistic scenarios and automated solution checking.";
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: "%s | Housefly",
  },
  description,
  openGraph: {
    title,
    description,
    url: baseUrl,
    siteName: "Housefly",
    locale: "en_US",
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
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(
        "text-black bg-white dark:text-white dark:bg-black",
        SpaceGrotesk.variable,
      )}
    >
      <body className="antialiased max-w-2xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <PlausibleProvider domain="housefly.cc">
            <Navbar />
            {children}
            <Footer />
          </PlausibleProvider>
        </main>
      </body>
    </html>
  );
}
