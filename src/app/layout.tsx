import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { Toaster } from '@/components/ui/toaster';
import { baseDomain, blogDesc, blogName, blogThumbnailURL } from '@/config/const';
import '@/config/globals.css';
import { Footer } from '@/layouts/Footer';
import { Header } from '@/layouts/Header';
import { ThemeProvider } from '@/layouts/theme/Provider';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

export const metadata: Metadata = {
  metadataBase: new URL(baseDomain),
  title: blogName,
  description: blogDesc,
  openGraph: {
    title: blogName,
    description: blogDesc,
    siteName: blogName,
    images: [blogThumbnailURL],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: blogName,
    description: blogDesc,
    images: [blogThumbnailURL],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className='h-full scroll-smooth' suppressHydrationWarning>
      <head>
        <Script
          id="adsbygoogle-init"
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1154659137489563"
          crossOrigin="anonymous"
        />
      </head>
      <body className='flex min-h-screen flex-col font-pretendard'>
        <ThemeProvider>
          <Header />
          <main className='mt-[calc(64px+env(safe-area-inset-top))] flex flex-1 flex-col'>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Toaster />
        <GoogleTagManager gtmId='GTM-M5JW97ZQ' />
      </body>
    </html>
  );
}
