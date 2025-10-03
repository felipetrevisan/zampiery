import { groq } from 'next-sanity'

export const formationData = groq`
  "id": _id,
  title,
  "positions": positions[] {
    "id": _key,
    "x": positionX,
    "y": positionY,
    "player": player-> {
      "id": _id,
      name,
      "avatar": avatarUrl,
    },
    role
  },
  
`

export const getFormationsQuery = groq`
  *[_type == "club-lineup"] {
    ${formationData}
  }
`
