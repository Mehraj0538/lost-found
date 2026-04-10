import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Navbar from '@/components/navbar'
import BottomNav from '@/components/bottom-nav'
import Footer from '@/components/footer'
import { AuthProvider } from '@/context/auth-context'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: {
    default: 'EcoSort AI — Intelligent E-Waste Classification',
    template: '%s | EcoSort AI',
  },
  description:
    'AI-powered e-waste classification and damage assessment. Find recycling centers, earn eco-points, and shop sustainable products.',
  keywords: ['e-waste', 'recycling', 'AI', 'EcoSort', 'electronic waste', 'sustainability', 'eco-points'],
  authors: [{ name: 'EcoSort AI' }],
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-background`}>
        <AuthProvider>
          <Navbar />
          <div className="flex-1 pt-16 pb-24">
            {children}
          </div>
          <Footer />
          <BottomNav />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
