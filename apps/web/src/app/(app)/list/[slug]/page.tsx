import { getGroupedList, getGroupedListBySlug } from '@nathy/web/server/grouped-list'
import { GroupedListView } from './_components'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  const data = await getGroupedListBySlug(slug)

  return <GroupedListView data={data} />
}

export async function generateStaticParams() {
  const lists = await getGroupedList()

  return lists.map((list) => ({
    slug: list.slug,
  }))
}
