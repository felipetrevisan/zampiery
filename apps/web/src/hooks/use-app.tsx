'use client'

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react'
import type { ThemeColor } from '../types/settings'

type AppContextProps = {
  color: keyof typeof ThemeColor
  setColor: Dispatch<SetStateAction<keyof typeof ThemeColor>>
  showBackgroundEffect: boolean
  setShowBackgroundEffect: Dispatch<SetStateAction<boolean>>
  backgroundEffectType: string
  setBackgroundEffectType: Dispatch<SetStateAction<string>>
}

const AppContext = createContext({} as AppContextProps)

export function AppProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<keyof typeof ThemeColor>('default')
  const [showBackgroundEffect, setShowBackgroundEffect] = useState(false)
  const [backgroundEffectType, setBackgroundEffectType] = useState('hole')

  return (
    <AppContext.Provider
      value={{
        color,
        setColor,
        showBackgroundEffect,
        setShowBackgroundEffect,
        backgroundEffectType,
        setBackgroundEffectType,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextProps {
  return useContext(AppContext)
}
