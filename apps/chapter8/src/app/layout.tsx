import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wanderlust Travel - Book Your Next Adventure",
  description: "Find and book your dream vacation with our easy-to-use travel platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-800 text-white py-6">
              <div className="container mx-auto px-4">
                <p className="text-center">
                  © {new Date().getFullYear()} Wanderlust Travel - Chapter 8 Demo
                </p>
              </div>
            </footer>
          </div>
          <ToastContainer position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}