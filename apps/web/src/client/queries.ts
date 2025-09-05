import { groq } from 'next-sanity'

export const getSettingsQuery = groq`
  *[ _type == 'settings' && _id == "settings" ][0] { 
    title,
    "theme": theme {
      "schema": schema,
      "color": color
    },
    backgroundEffect
  }
`

export const getPlayersQuery = groq`
  *[_type == "player"] {
    "id": _id,
    name,
    favoritePosition,
    favoriteTeam
  }
`

export const getPaginatedPlayersQuery = groq`
  {
    "data": *[_type == "player"][$offset...$offset + $pageSize] {
      "id": _id,
      name,
      favoritePosition,
      favoriteTeam
    },
    "total": count(*[_type == "player"]),
    "page": (($offset - ($offset % $pageSize)) / $pageSize) + 1,
    "pageSize": $pageSize,
    "nextOffset": $offset + $pageSize,
    "hasNextPage": ($offset + $pageSize) < count(*[_type == "player"])
  }
`

export const getRankingListsQuery = groq`
  *[ _type == 'ranking-list' ] { 
    "id": _id,
    title,
    "slug": slug.current,
    "playersCount": count(players)
  }
`

export const getPaginatedRankingListsQuery = groq`
  {
    "data": *[_type == "ranking-list"][$offset...$offset + $pageSize] {
      "id": _id,
      title,
      "slug": slug.current,
      "playersCount": count(players)
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
    "id": _id,
    title,
    "slug": slug.current,
    "players": players[]->{
      "id": _id,
      name
    }
  }
`

export const getPaginatedRankingListBySlugQuery = groq`
  *[_type == "ranking-list" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    "total": count(players[]),
    "pageSize": $pageSize,
    "page": (($offset - ($offset % $pageSize)) / $pageSize) + 1,
    "nextOffset": $offset + $pageSize,
    "hasNextPage": ($offset + $pageSize) < count(players[]),
    "data": players[$offset...($offset + $pageSize)][]-> {
      "id": _id,
      name,
    }
  }
`

export const getLastRankingListRankQuery = groq`
  *[_type == 'ranking-list']|order(@['orderRank'] desc)[0]['orderRank']
`

export const getGroupedListQuery = groq`
  *[ _type == 'list' ] { 
    "id": _id,
    title,
    "slug": slug.current,
  }
`

export const getGroupedListBySlugQuery = groq`
  *[_type == "list" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    games[]-> {
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
    }
  }
`

export const getLastListRankQuery = groq`
  *[_type == 'list']|order(@['orderRank'] desc)[0]['orderRank']
`
