export type Settings = {
  title: string
  theme: {
    schema: 'light' | 'dark' | 'system'
    color: keyof typeof ThemeColor
  }
  showBackgroundEffect: boolean
  backgroundEffectType: 'hole' | 'stars'
}

export enum ThemeColor {
  default = 'Default',
  blue = 'Blue',
  green = 'Green',
  amber = 'Amber',
  purple = 'Purple',
  rose = 'Rose',
  orange = 'Orange',
  teal = 'Teal',
}

export const ThemeColorLabels: Record<ThemeColor, string> = {
  [ThemeColor.default]: 'Padrao',
  [ThemeColor.blue]: 'Azul',
  [ThemeColor.green]: 'Verde',
  [ThemeColor.amber]: 'Ambar',
  [ThemeColor.purple]: 'Roxo',
  [ThemeColor.rose]: 'Rosa',
  [ThemeColor.orange]: 'Laranja',
  [ThemeColor.teal]: 'Teal',
}
