import { groq } from 'next-sanity'

export const rankingData = groq`
  "id": _id,
  title,
  "slug": slug.current,
  "total": count(players)
`

export const rankingPlayerData = groq`
  "id": _id,
  "key": _key,
  name,
  "avatar": avatarUrl
`

export const getRankingListsQuery = groq`
  *[ _type == 'ranking-list' ] { 
    ${rankingData}
  }
`

export const getPaginatedRankingListsQuery = groq`
  {
    "data": *[_type == "ranking-list"][$offset...$offset + $pageSize] {
      ${rankingData}
    },
    "total": count(*[_type == "ranking-list"]),
    "page": (($offset - ($offset % $pageSize)) / $pageSize) + 1,
    "pageSize": $pageSize,
    "nextOffset": $offset + $pageSize,
    "hasNextPage": ($offset + $pageSize) < count(*[_type == "ranking-list"])
  }
`

export const getRankingListBySlugQuery = groq`
  *[_type == "ranking-list" && slug.current == $slug][0] {
    ${rankingData},
    "players": players[]-> {
      ${rankingPlayerData}
    }
  }
`

export const getPaginatedRankingListBySlugQuery = groq`
  *[_type == "ranking-list" && slug.current == $slug][0] {
    ${rankingData},
    "pageSize": $pageSize,
    "page": (($offset - ($offset % $pageSize)) / $pageSize) + 1,
    "nextOffset": $offset + $pageSize,
    "hasNextPage": ($offset + $pageSize) < count(players[]),
    "data": players[$offset...($offset + $pageSize)][]-> {
      ${rankingPlayerData}
    }
  }
`
