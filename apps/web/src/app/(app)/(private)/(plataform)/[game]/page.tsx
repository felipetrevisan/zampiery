import { getPaginatedPlatformListByPlatform, getPlatforms } from '@nathy/web/server/game-platform'
import type { Metadata } from 'next'
import { PlatformGameListView } from './_components'

export const metadata: Metadata = {
  title: 'Game List',
  description: 'List of games',
}

interface PageProps {
  params: Promise<{ game: string }>
}

export default async function Platform({ params }: PageProps) {
  const { game } = await params
  const data = await getPaginatedPlatformListByPlatform({
    offset: 0,
    pageSize: 10,
    platform: game,
  })

  return <PlatformGameListView platform={data} />
}

export async function generateStaticParams() {
  const platforms = await getPlatforms()

  return platforms.map((platform) => ({
    slug: platform.slug,
  }))
}
