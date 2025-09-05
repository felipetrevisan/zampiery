import { getPaginatedRankingListBySlug, getRankingList, getRankingListBySlug } from '@nathy/web/server/ranking'
import { RankingListView } from './_components'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  const data = await getPaginatedRankingListBySlug({ offset: 0, pageSize: 10, slug })

  console.log(data)

  return <RankingListView data={data} />
}

export async function generateStaticParams() {
  const lists = await getRankingList()

  return lists.map((list) => ({
    slug: list.slug,
  }))
}
