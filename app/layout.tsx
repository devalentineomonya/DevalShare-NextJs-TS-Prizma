import type React from "react";
import { Inter } from "next/font/google";
import { ClientProviders } from "@/providers/ClientProvider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevShare - Share Your Projects",
  description:
    "A platform for developers to share their project ideas with the world",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
            {children}
            <Toaster />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
