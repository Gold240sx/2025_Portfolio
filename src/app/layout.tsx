import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "My Blog",
  description: "A blog built with Next.js, Payload CMS, and tRPC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <main>{children}</main>
      </body>
    </html>
  );
}
