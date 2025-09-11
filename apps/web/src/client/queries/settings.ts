import { groq } from 'next-sanity'

export const getSettingsQuery = groq`
  *[ _type == 'settings' && _id == "settings" ][0] { 
    title,
    "theme": theme {
      "schema": schema,
      "color": color
    },
    showBackgroundEffect,
    backgroundEffectType
  }
`
