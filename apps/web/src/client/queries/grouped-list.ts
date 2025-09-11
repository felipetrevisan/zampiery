import { groq } from 'next-sanity'

export const groupedListData = groq`
  "id": _id,
  title,
  "slug": slug.current,
`
export const groupedListGameData = groq`
  "id": _id,
  date,
  "slug": slug.current,
  played,
  "players": {
    "home": {
      "player": player1->{ "id": _id, name},
      "score": score1,
      "attendance": attendance1
    },
    "guest": {
      "player": player2->{ "id": _id, name},
      "score": score2,
      "attendance": attendance2
    }
  }
`

export const getGroupedListQuery = groq`
  *[ _type == 'list' ] { 
    ${groupedListData}
  }
`

export const getPaginatedGroupedListQuery = groq`
  {
    "data": *[_type == "list"][$offset...$offset + $pageSize] {
      ${groupedListData}
    },
    "total": count(*[_type == "list"]),
    "page": (($offset - ($offset % $pageSize)) / $pageSize) + 1,
    "pageSize": $pageSize,
    "nextOffset": $offset + $pageSize,
    "hasNextPage": ($offset + $pageSize) < count(*[_type == "list"])
  }
`

export const getGroupedListBySlugQuery = groq`
  *[_type == "list" && slug.current == $slug][0] {
    ${groupedListData},
    games[]-> {
      ${groupedListGameData}
    }
  }
`

export const getPaginatedGroupedListBySlugQuery = groq`
  *[_type == "list" && slug.current == $slug][0] {
    ${groupedListData}
    "pageSize": $pageSize,
    "page": (($offset - ($offset % $pageSize)) / $pageSize) + 1,
    "nextOffset": $offset + $pageSize,
    "hasNextPage": ($offset + $pageSize) < count(games[]),
    "data": games[$offset...($offset + $pageSize)][]-> {
      ${groupedListGameData}
    }
  }
`
