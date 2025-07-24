import type { Metadata } from 'next'
// eslint-disable-next-line camelcase
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { NavBar } from '@/components/nav-bar'
import { Toaster } from '../components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TCC - Oxossi',
  description: 'Developed by Julio Rarick',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={geistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-3.5rem-1px)]"> {/* 3.5rem is navbar height */}
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
