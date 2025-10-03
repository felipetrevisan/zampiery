import { ClubsView } from '@nathy/web/app/(app)/(private)/(plataform)/[game]/[list]/_clubs'
import { getPlatforms } from '@nathy/web/server/game-platform'
import {
  getGroupedListByPlatform,
  getGroupedListBySlugAndPlatform,
} from '@nathy/web/server/grouped-list'
import { GroupedListView } from './_components'

interface PageProps {
  params: Promise<{ list: string; game: string }>
}

export const dynamic = 'force-dynamic'

export default async function Page({ params }: PageProps) {
  const { list, game } = await params

  const data = await getGroupedListBySlugAndPlatform({
    slug: list,
    platform: game,
  })

  if (data.isClub && data.clubs?.id) return <ClubsView list={data} />

  return <GroupedListView list={data} />
}

export async function generateStaticParams() {
  const platforms = await getPlatforms()

  return (
    await Promise.all(
      platforms.map(async (platform) => {
        const lists = await getGroupedListByPlatform(platform.slug)
        return lists.map((list) => ({
          game: platform.slug,
          list: list.slug,
        }))
      }),
    )
  ).flat()
}
