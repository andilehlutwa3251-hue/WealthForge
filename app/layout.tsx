import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://wealthforge.app'),
  title: {
    default: 'WealthForge',
    template: '%s | WealthForge',
  },
  description:
    'WealthForge helps South Africans understand, improve, and manage their wealth with a clearer score, smarter strategy, and practical financial guidance.',
  generator: 'Next.js',
  keywords: ['wealth', 'finance', 'South Africa', 'financial planning', 'wealth score'],
  openGraph: {
    title: 'WealthForge',
    description: 'Make your money work harder.',
    url: 'https://wealthforge.app',
    siteName: 'WealthForge',
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WealthForge',
    description: 'Make your money work harder.',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
    }
