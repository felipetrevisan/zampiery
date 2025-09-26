import { groq } from 'next-sanity'

export const playerData = groq`
    "id": _id,
    name,
    "avatar": avatarUrl,
    favoritePosition,
    "favoriteTeam": favoriteTeam-> {
      "id": _id,
      name,
      country,
      continent,
      shield
    },
    "isFavorite": favorite,
`

export const getPlayersQuery = groq`
  *[_type == "player"] {
    ${playerData}
  }
`

export const getPaginatedPlayersQuery = groq`
  {
    "data": *[_type == "player"][$offset...$offset + $pageSize] {
      ${playerData}
    },
    "total": count(*[_type == "player"]),
    "page": (($offset - ($offset % $pageSize)) / $pageSize) + 1,
    "pageSize": $pageSize,
    "nextOffset": $offset + $pageSize,
    "hasNextPage": ($offset + $pageSize) < count(*[_type == "player"])
  }
`
