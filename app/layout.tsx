import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Relay | AI-Powered Customer Support',
  description: 'Multi-agent AI customer support system with specialized agents for support, orders, and billing. Powered by advanced routing and context management.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    userScalable: true,
  },
  icons: {
    icon: '/circles.svg',
    shortcut: '/circles.svg',
    apple: '/circles.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-display antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
