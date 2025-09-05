import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter, Nixie_One, Russo_One } from 'next/font/google'
import type { ReactNode } from 'react'
import Providers from './providers'
import './styles.css'
import { Toaster } from '@nathy/shared/ui'
import { getSettings } from '@nathy/web/server/settings'

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-inter',
})

const nixieOne = Nixie_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-nixie',
})

const russo = Russo_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-russo',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = settings?.title || 'Nathy Zampiery'

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
  }
}

type Props = {
  children: ReactNode
}

export default async function RootLayoutt({ children }: Props) {
  const settings = await getSettings()

  return (
    <html
      lang="en"
      className={`${inter.variable} ${russo.variable} ${nixieOne.variable}`}
      suppressHydrationWarning
    >
      <body
        className="flex h-full flex-col overflow-x-hidden antialiased"
        data-theme={settings.theme.color}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
