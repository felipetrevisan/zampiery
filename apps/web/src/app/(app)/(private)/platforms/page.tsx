import { getPaginatedPlatforms } from '@nathy/web/server/platform'
import type { Metadata } from 'next'
import { PlatformsList } from './_components'

export const metadata: Metadata = {
  title: 'Platforms',
  description: 'List of platforms',
}

export default async function Platforms() {
  const data = await getPaginatedPlatforms({ offset: 0, pageSize: 10 })

  return <PlatformsList data={data} />
}
