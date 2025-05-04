import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from "@/context/auth-context"
import { inter, spaceGrotesk } from './fonts'
import FuturisticEffectsWrapper from '@/components/futuristic-effects-wrapper'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050510',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: 'Crypto X - Islamic Crypto Analysis & Reviews',
  description: 'Unbiased cryptocurrency and exchange reviews with Islamic compliance ratings. Get detailed analysis of crypto projects and trading platforms.',
  generator: 'Next.js',
  keywords: ['cryptocurrency', 'crypto', 'islamic finance', 'halal crypto', 'crypto reviews', 'crypto analysis', 'crypto exchanges'],
  authors: [{ name: 'Mohammed Ali Team' }],
  creator: 'Crypto X',
  publisher: 'Crypto X',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crypto X.com',
    title: 'Crypto X - Islamic Crypto Analysis & Reviews',
    description: 'Unbiased cryptocurrency and exchange reviews with Islamic compliance ratings',
    siteName: 'Crypto x',
    images: [
      {
        url: '/Crypto-X.png',
        width: 1200,
        height: 630,
        alt: 'CryptoReview Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'crypto X - Islamic Crypto Analysis & Reviews',
    description: 'Unbiased cryptocurrency and exchange reviews with Islamic compliance ratings',
    images: ['/Crypto-X.png'],
  },
  icons: {
    icon: [
      { url: '/Crypto-X.png', sizes: '32x32', type: 'image/png' },
      { url: '/Crypto-X.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/Crypto-X.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/Crypto-X.png'],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/Crypto-X.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-[#050510] text-white antialiased font-sans">
        <AuthProvider>
          <FuturisticEffectsWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
