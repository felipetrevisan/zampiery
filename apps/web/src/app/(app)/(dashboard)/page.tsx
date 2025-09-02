import type { Metadata } from 'next'
import { DashboardWidgets } from './widgets'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export const revalidate = 900

export default function DashboardPage() {
  return (
    <>
      <h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
      <DashboardWidgets />
    </>
  )
}
