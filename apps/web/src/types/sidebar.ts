import type { LucideProps } from 'lucide-react'

export type SidebarItem = {
  teams: Team[]
  navMain: Menu[]
}

export type Team = {
  name: string
  logo: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
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
