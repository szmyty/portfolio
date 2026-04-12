import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { siteConfig, isDev, env } from "@portfolio/config";
import { DebugPanel } from "@portfolio/components/debug/DebugPanel";
import { ThemeProvider } from "@portfolio/lib/theme";
import nextPkg from "next/package.json";
import reactPkg from "react/package.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteUrl }],
  creator: siteConfig.author.name,
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
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.author.handle,
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
      name: siteConfig.author.name,
      url: siteUrl,
      sameAs: [siteConfig.author.github],
      jobTitle: siteConfig.author.jobTitle,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteConfig.name,
      description: siteConfig.description,
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
        {/*
         * Anti-flicker theme script — runs synchronously before paint so the
         * correct theme is applied before React hydrates, eliminating any
         * flash of the wrong theme.
         *
         * The storage key 'theme-preference' is hardcoded here because this
         * script executes before any module is loaded — it cannot import
         * THEME_STORAGE_KEY from src/lib/theme.tsx at runtime. Keep this
         * literal in sync with THEME_STORAGE_KEY in that file.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: [
              "(function(){",
              "try{",
              "var s=sessionStorage.getItem('theme-preference');",
              "var m=s||'dark';",
              "var r=m==='system'?(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):m;",
              "if(r==='light'){document.documentElement.setAttribute('data-theme','light');}",
              "document.documentElement.classList.add('no-theme-transition');",
              "requestAnimationFrame(function(){document.documentElement.classList.remove('no-theme-transition');});",
              "}catch(e){}",
              "})();",
            ].join(""),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        {isDev && (
          <DebugPanel
            info={{
              siteUrl: env.NEXT_PUBLIC_SITE_URL,
              nextVersion: nextPkg.version,
              reactVersion: reactPkg.version,
              locale,
              nodeEnv: process.env.NODE_ENV,
            }}
          />
        )}
      </body>
    </html>
  );
}
