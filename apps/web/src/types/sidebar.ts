import type { LucideProps } from 'lucide-react'

export type SidebarItem = {
  navMain: Menu[]
}

export type Menu = {
  title: string
  url: string
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  items: MenuItem[]
}

export type MenuItem = {
  title: string
  url: string
  total?: number
  showBadge?: boolean
}
