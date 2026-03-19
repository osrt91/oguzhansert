import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { getProfile } from "@/lib/content";
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

const SITE_URL = "https://oguzhansert.dev";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile("tr");

  const name = profile?.name || "Oguzhan Sert";
  const description =
    profile?.description || "Software Engineer & Developer";
  const url = profile?.social_links?.website || SITE_URL;

  return {
    metadataBase: new URL(url as string),
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      title: name,
      description,
      url: url as string,
      siteName: name,
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
    twitter: {
      title: name,
      card: "summary_large_image",
    },
    verification: {
      google: "",
      yandex: "",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geist.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased relative`}
      >
        {children}
      </body>
    </html>
  );
}
