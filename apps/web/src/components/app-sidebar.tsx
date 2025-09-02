'use client'

import * as React from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@nathy/shared/ui/animated/collapsible'
import { DropdownMenu, DropdownMenuTrigger } from '@nathy/shared/ui/animated/dropdown-menu'
import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@nathy/shared/ui/animated/sidebar'
import { ChevronRight, ChevronsUpDown, Command, ListFilter } from 'lucide-react'
import Link from 'next/link'
import { useGroupedList } from '../hooks/use-grouped-list'
import { useRankingList } from '../hooks/use-ranking'
import { useSettings } from '../hooks/use-settings'

const DATA = {
  teams: [
    {
      name: 'Nathy Zampiery',
      logo: Command,
    },
  ],
  navMain: [
    // {
    //   title: 'Calendário',
    //   url: '#',
    //   icon: CalendarRange,
    //   actions: [],
    //   isActive: true,
    //   items: [
    //     {
    //       title: 'Amistosos Online',
    //       url: '#',
    //     },
    //     {
    //       title: 'Clubs',
    //       url: '#',
    //     },
    //   ],
    // },
    {
      title: 'Ranking',
      url: '#',
      icon: ListFilter,
      items: [],
    },
    {
      title: 'Listas',
      url: '#',
      icon: ListFilter,
      actions: [
        {
          id: 'add',
          title: 'Nova Lista',
          callback: () => null,
        },
      ],
      items: [],
    },
    {
      title: 'Jogadores',
      url: '/players',
      icon: ListFilter,
      actions: [],
      items: [
        {
          title: 'Todos os Jogadores',
          url: '/players',
        },
      ],
    },
  ],
}

export function Sidebar() {
  const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0])
  const { data: rankingLists } = useRankingList([])
  const { data: groupedLists } = useGroupedList()
  const { data: settings } = useSettings()

  if (!activeTeam) return null

  React.useEffect(() => {
    if (settings) {
      setActiveTeam({
        name: settings.title,
        logo: Command,
      })
    }
  }, [settings])

  const dynamicRankingLists =
    rankingLists?.map((list) => ({
      title: list.title,
      url: `/ranking/${list.slug}`,
    })) ?? []

  const dynamicGroupedLists =
    groupedLists?.map((list) => ({
      title: list.title,
      url: `/list/${list.slug}`,
    })) ?? []

  const nav = React.useMemo(() => {
    return DATA.navMain.map((item) => {
      if (item.title === 'Ranking') {
        return {
          ...item,
          items: [...dynamicRankingLists, { title: 'Todas as Listas', url: '/ranking' }],
        }
      }

      if (item.title === 'Listas') {
        return {
          ...item,
          items: [...dynamicGroupedLists, { title: 'Todas as Listas', url: '/list' }],
        }
      }

      return item
    })
  }, [dynamicRankingLists, dynamicGroupedLists])

  return (
    <BaseSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground">
                    <activeTeam.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{activeTeam.name}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Team Switcher */}
      </SidebarHeader>

      <SidebarContent>
        {/* Nav Main */}
        <SidebarGroup>
          <SidebarGroupLabel>EA FC 2025</SidebarGroupLabel>
          <SidebarMenu>
            {nav.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* Nav Main */}
      </SidebarContent>
      <SidebarRail />
    </BaseSidebar>
  )
}
