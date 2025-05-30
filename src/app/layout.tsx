import './globals.css'
import type { Metadata } from 'next'
import { Merriweather, Source_Sans_3 } from 'next/font/google'

const merriweather = Merriweather({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Portfolio Notes',
  description: 'A networked note-taking portfolio inspired by Andy Matuschak',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${merriweather.variable} ${sourceSans.variable}`}>
      <body className={sourceSans.className}>{children}</body>
    </html>
  )
}
