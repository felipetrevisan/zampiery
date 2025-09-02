import type { SanityImageMetadata, SanityImageSource } from '@sanity/asset-utils'

export type SanityAsset = {
  asset: SanityImageSource
  metadata: Pick<SanityImageMetadata, 'lqip' | 'dimensions'>
}
