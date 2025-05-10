import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoDefend Exchange",
  description: "Secure cryptocurrency trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="sticky top-0 z-50 border-b border-solid border-gray py-4 bg-background">
          <div className="container mx-auto flex justify-between items-center px-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" width={200} height={40} alt="CryptoDefend" />
            </Link>

            <nav className="hidden md:flex gap-6">
              <Link href="/" className="hover:text-secondary">Home</Link>
              <Link href="/trading" className="hover:text-secondary">Trading</Link>
              <Link href="/orderbook" className="hover:text-secondary">Order Book</Link>
              <Link href="/market" className="hover:text-secondary">Market</Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="button button-ghost text-sm py-1 px-3"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="button button-primary text-sm py-1 px-3"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="py-6 border-t border-solid border-gray mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">CryptoDefend</h3>
                <p className="text-gray-dark text-sm">The most secure cryptocurrency exchange platform.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/help" className="hover:text-secondary">Help Center</Link></li>
                  <li><Link href="/api-docs" className="hover:text-secondary">API Documentation</Link></li>
                  <li><Link href="/terms" className="hover:text-secondary">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Products</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/exchange" className="hover:text-secondary">Exchange</Link></li>
                  <li><Link href="/derivatives" className="hover:text-secondary">Derivatives</Link></li>
                  <li><Link href="/custody" className="hover:text-secondary">Custody</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Connect</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/twitter" className="hover:text-secondary">Twitter</Link></li>
                  <li><Link href="/discord" className="hover:text-secondary">Discord</Link></li>
                  <li><Link href="/telegram" className="hover:text-secondary">Telegram</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-solid border-gray flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-dark">&copy; 2023 CryptoDefend Exchange. All rights reserved.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Link href="/privacy" className="text-sm text-gray-dark hover:text-secondary">Privacy Policy</Link>
                <Link href="/terms" className="text-sm text-gray-dark hover:text-secondary">Terms of Use</Link>
                <Link href="/cookies" className="text-sm text-gray-dark hover:text-secondary">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Honeypot links for bot detection */}
        <a href="/admin-login" className="honeypot-link">Admin Login</a>
        <a href="/internal-api" className="honeypot-link">Internal API</a>
        <div style={{ height: 0, overflow: 'hidden' }}>
          <a href="/scraper-trap">Special Offers</a>
        </div>
      </body>
    </html>
  );
}
