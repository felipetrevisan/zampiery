import { groq } from 'next-sanity'

export const gameData = groq`
  "id": _id,
  title,
  "slug": slug.current,
  "logo": logo {
    "asset": asset,
    "metadata": {
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  },
  "totalLists": count( *[_type == "list" && references(^._id)]),
`

export const getPlatformsQuery = groq`
  *[_type == "game-platform"] {
    ${gameData}
    "lists": *[_type == "list" && references(^._id)] {
      "id": _id,
      title,
      "slug": slug.current
    }
  }
`
export const getPaginatedPlatformsQuery = groq`
  {
    "data": *[_type == "game-platform"][$offset...$offset + $pageSize] {
      ${gameData}
    },
    "total": count(*[_type == "game-platform"]),
    "page": (($offset - ($offset % $pageSize)) / $pageSize) + 1,
    "pageSize": $pageSize,
    "nextOffset": $offset + $pageSize,
    "hasNextPage": ($offset + $pageSize) < count(*[_type == "game-platform"])
  }
`

export const getPlatformsPaginatedListByPlatformQuery = groq`
  *[_type == "game-platform" && slug.current == $slug][0] {
    ${gameData}
    "pageSize": $pageSize,
    "page": (($offset - ($offset % $pageSize)) / $pageSize) + 1,
    "nextOffset": $offset + $pageSize,
    "hasNextPage": ($offset + $pageSize) < count(*[_type == "list" && references(^._id)]),
    "data": *[_type == "list" && references(^._id)][$offset...($offset + $pageSize)] {
      "id": _id,
      title,
      "slug": slug.current
    }
  }
`
