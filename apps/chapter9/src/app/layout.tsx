import type { Metadata } from "next";
import { Inter, Nunito, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const nunitoFont = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const sansFont = Inter({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GraphQL Developer Hub",
  description: "A hands-on platform for learning GraphQL and coding challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoFont.variable} ${sansFont.variable} ${monoFont.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
