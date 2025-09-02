'use client'

import { type Cycle, useCycle } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ThemeColor } from '../types/settings'

type AppContextProps = {
  color: keyof typeof ThemeColor
  setColor: Dispatch<SetStateAction<keyof typeof ThemeColor>>
  backgroundEffect: boolean
  setBackgroundEffect: Dispatch<SetStateAction<boolean>>
}

const AppContext = createContext({} as AppContextProps)

export function AppProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<keyof typeof ThemeColor>('default')
  const [backgroundEffect, setBackgroundEffect] = useState(false)

  return (
    <AppContext.Provider
      value={{
        color,
        setColor,
        backgroundEffect,
        setBackgroundEffect,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextProps {
  return useContext(AppContext)
}
