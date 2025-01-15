import type { Metadata, Viewport } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nightlife.aniketgoyal.tech'),
  title: {
    default: 'Nightlife - Event & Venue Management Platform',
    template: '%s | Nightlife'
  },
  description: 'Streamline your venue and event management with Nightlife. Easily manage venues, create events, handle guest lists.',
  keywords: ['event management', 'venue management', 'guest list', 'nightlife', 'events', 'venues', 'organizer platform', 'event planning'],
  authors: [{ name: 'Nightlife Team' }],
  creator: 'Nightlife',
  publisher: 'Nightlife',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nightlife.aniketgoyal.tech',
    title: 'Nightlife - Event & Venue Management Platform',
    description: 'Streamline your venue and event management with Nightlife. Easily manage venues, create events, handle guest lists.',
    siteName: 'Nightlife',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Nightlife - Event & Venue Management Platform'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nightlife - Event & Venue Management Platform',
    description: 'Streamline your venue and event management with Nightlife. Easily manage venues, create events, handle guest lists.',
    images: ['/twitter-image.jpg'],
    creator: '@nightlife',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/site.webmanifest',
  verification: {
    other: {
      me: ['https://aniketgoyal.tech'],
    }
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.variable} bg-secondary min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
