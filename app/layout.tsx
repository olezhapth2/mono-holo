import type { Metadata } from "next";
import { Geist, Geist_Mono, Jersey_15 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jersey = Jersey_15({
  variable: "--font-jersey",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Renovation. Managed.",
  description:
    "End-to-end renovation and interior transformation with engineering depth, structured process, and full accountability",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jersey.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
