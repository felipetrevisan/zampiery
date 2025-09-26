export type Settings = {
  title: string
  theme: {
    schema: 'light' | 'dark' | 'system'
    color: keyof typeof ThemeColor
  }
  showBackgroundEffect: boolean
  backgroundEffectType: 'hole' | 'stars'
}

export const ThemeColor = {
  default: 'default',
  blue: 'blue',
  green: 'green',
  purple: 'purple',
  crimson: 'crimson',
  teal: 'teal',
} as const

export const themeColorKeys = Object.values(ThemeColor)
export type ThemeColorType = (typeof themeColorKeys)[number]

export const ThemeColorLabels: Record<ThemeColorType, string> = {
  default: 'Padrão',
  blue: 'Azul',
  green: 'Verde',
  purple: 'Roxo',
  crimson: 'Crimson',
  teal: 'Azul-Petróleo',
}
