import { env } from '@nathy/web/config/env'
import type { SanityImageSource } from '@sanity/asset-utils'
import createImageUrlBuilder from '@sanity/image-url'

const imageBuilder = createImageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
})

export function urlForImage(source: SanityImageSource) {
  return imageBuilder?.image(source).auto('format').fit('max')
}
