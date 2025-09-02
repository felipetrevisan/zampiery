import { getRankingList, getRankingListBySlug } from '@nathy/web/server/ranking'
import { RankingListView } from './_components'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  const data = await getRankingListBySlug(slug)

  return <RankingListView {...data} />
}

export async function generateStaticParams() {
  const lists = await getRankingList()

  return lists.map((list) => ({
    slug: list.slug,
  }))
}
