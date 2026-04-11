import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alan Szmyt | Portfolio",
    template: "%s | Alan Szmyt",
  },
  description:
    "Personal portfolio of Alan Szmyt — software engineer focused on building thoughtful, reliable systems.",
  keywords: [
    "Alan Szmyt",
    "software engineer",
    "portfolio",
    "full-stack",
    "web development",
  ],
  authors: [{ name: "Alan Szmyt", url: siteUrl }],
  creator: "Alan Szmyt",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Alan Szmyt | Portfolio",
    description:
      "Personal portfolio of Alan Szmyt — software engineer focused on building thoughtful, reliable systems.",
    siteName: "Alan Szmyt | Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alan Szmyt | Portfolio",
    description:
      "Personal portfolio of Alan Szmyt — software engineer focused on building thoughtful, reliable systems.",
    creator: "@szmyty",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Alan Szmyt",
      url: siteUrl,
      sameAs: ["https://github.com/szmyty"],
      jobTitle: "Software Engineer",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Alan Szmyt | Portfolio",
      description:
        "Personal portfolio of Alan Szmyt — software engineer focused on building thoughtful, reliable systems.",
      author: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
