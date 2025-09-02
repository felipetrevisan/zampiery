'use client'

import { HoleBackground } from '@nathy/shared/ui/animated/backgrounds/hole'
import { useApp } from '@nathy/web/hooks/use-app'
import { useSettings } from '@nathy/web/hooks/use-settings'
import { useEffect } from 'react'

export function Background() {
  const { data } = useSettings()
  const { backgroundEffect, setBackgroundEffect } = useApp()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data?.backgroundEffect) setBackgroundEffect(data?.backgroundEffect)
  }, [data?.backgroundEffect])

  return (
    <>
      {backgroundEffect && (
        <HoleBackground className="absolute inset-0 z-0 flex items-center justify-center rounded-xl" />
      )}
    </>
  )
}
