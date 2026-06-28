import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Luma — Delightful Events Start Here",
    template: "%s · Luma",
  },
  description:
    "Set up an event page, invite friends and sell tickets. Host a memorable event today.",
  openGraph: {
    title: "Luma — Delightful Events Start Here",
    description:
      "Set up an event page, invite friends and sell tickets. Host a memorable event today.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
