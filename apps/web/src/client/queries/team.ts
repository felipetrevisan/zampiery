import { groq } from 'next-sanity'

export const teamData = groq`
  "id": _id,
  name,
  shield,
  country,
  continent
`

export const getTeamsQuery = groq`
  *[_type == "team"] {
    ${teamData}
  }
`
