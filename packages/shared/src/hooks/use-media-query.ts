'use client'

import { useEffect, useState } from 'react'

export function useMediaQuery(breakpoint = 768) {
  const [mediaQuery, setMediaQuery] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => {
      setMediaQuery(window.innerWidth < breakpoint)
    }

    mql.addEventListener('change', onChange)
    setMediaQuery(window.innerWidth < breakpoint)

    return () => {
      mql.removeEventListener('change', onChange)
    }
  }, [breakpoint])

  return !!mediaQuery
}
