import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'HSLU Module Reviews | Blockchain-Powered Student Feedback',
  description: 'Transparent, decentralized module reviews by HSLU students for HSLU students. Make better course choices with verified, on-chain feedback.',
  keywords: ['HSLU', 'module reviews', 'blockchain', 'student feedback', 'DApp', 'Polygon'],
  authors: [{ name: 'HSLU Community' }],
  openGraph: {
    title: 'HSLU Module Reviews',
    description: 'Blockchain-powered student reviews for HSLU modules',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
