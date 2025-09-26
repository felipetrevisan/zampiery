'use client'

import { cn } from '@nathy/shared/lib/utils'
import { HoleBackground } from '@nathy/shared/ui/animated/backgrounds/hole'
import { StarsBackground } from '@nathy/shared/ui/animated/backgrounds/stars'
import { useApp } from '@nathy/web/hooks/use-app'
import { useSettings } from '@nathy/web/hooks/use-settings'
import { useEffect } from 'react'

export function Background() {
  const { data } = useSettings()
  const {
    showBackgroundEffect,
    setShowBackgroundEffect,
    backgroundEffectType,
    setBackgroundEffectType,
  } = useApp()

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (data?.showBackgroundEffect) setShowBackgroundEffect(data?.showBackgroundEffect)
    if (data?.backgroundEffectType) setBackgroundEffectType(data?.backgroundEffectType)
  }, [data?.showBackgroundEffect, data?.backgroundEffectType])

  return (
    <>
      {showBackgroundEffect && (
        <>
          {backgroundEffectType === 'hole' && (
            <HoleBackground className="absolute inset-0 z-0 flex items-center justify-center rounded-xl" />
          )}
          {backgroundEffectType === 'stars' && (
            <StarsBackground
              className={cn(
                'absolute inset-0 flex items-center justify-center rounded-xl',
                'bg-[radial-gradient(ellipse_at_bottom,_#f5f5f5_0%,_#fff_100%)] dark:bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]',
              )}
            />
          )}
        </>
      )}
    </>
  )
}
