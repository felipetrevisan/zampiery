'use client'

import { useTheme } from 'next-themes'
import { Toaster as BaseToaster, type ToasterProps } from 'sonner'

export function Toaster() {
  const { theme } = useTheme()

  return <BaseToaster theme={theme as ToasterProps['theme']} />
}
