import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: "How to AI — Data",
  description:
    "Download the full How to AI newsletter archive. Access posts, workflows, and AI guides by Ruben Hassid.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "How to AI — Data",
    description:
      "Download the full How to AI newsletter archive. Access posts, workflows, and AI guides by Ruben Hassid.",
    type: "website",
    siteName: "How to AI Data",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to AI — Data",
    description:
      "Download the full How to AI newsletter archive. Access posts, workflows, and AI guides by Ruben Hassid.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
