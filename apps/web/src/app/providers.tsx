'use client'

import { Bar } from '@bprogress/next'
import { ProgressProvider } from '@bprogress/next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, useTheme } from 'next-themes'
import { type ReactNode, useEffect, useState } from 'react'
import { AppProvider, useApp } from '../hooks/use-app'
import { useSettings } from '../hooks/use-settings'
import type { ThemeColor } from '../types/settings'

interface AppThemeProviderProps {
  children: ReactNode
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const { data: settings } = useSettings()

  return (
    <SessionProvider>
      <AppProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme={settings?.theme.schema ?? 'system'}
          enableSystem
        >
          <ProgressProvider
            color="var(--color-primary)"
            height="6px"
            options={{ showSpinner: true }}
            shallowRouting
          >
            <Bar />
            <AppThemeWrapper settings={settings}>{children}</AppThemeWrapper>
          </ProgressProvider>
        </ThemeProvider>
      </AppProvider>
    </SessionProvider>
  )
}

function AppThemeWrapper({
  children,
  settings,
}: {
  children: ReactNode
  settings?: { theme?: { schema?: 'light' | 'dark' | 'system'; color?: keyof typeof ThemeColor } }
}) {
  const { setTheme } = useTheme()
  const { setColor } = useApp()

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (settings?.theme?.schema) setTheme(settings.theme.schema)
  }, [settings?.theme?.schema])

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (settings?.theme?.color) {
      setColor(settings.theme.color)
      document.documentElement.dataset.theme = settings.theme.color
    }
  }, [settings?.theme?.color])

  return <>{children}</>
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>{children}</AppThemeProvider>
      {process.env.NODE_ENV !== 'production' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  )
}
