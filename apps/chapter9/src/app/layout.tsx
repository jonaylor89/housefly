import type { Metadata } from "next";
import { Source_Sans_3, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const sansFont = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
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
      <body className={`${sansFont.variable} ${monoFont.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
