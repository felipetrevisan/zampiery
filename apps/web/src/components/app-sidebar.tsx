'use client'

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
import { Badge } from '@nathy/shared/ui/badge'
import { ChevronRight, ChevronsUpDown, Command, ListFilter, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { useGroupedList } from '../hooks/use-grouped-list'
import { usePlayer } from '../hooks/use-player'
import { useRankingList } from '../hooks/use-ranking'
import { useSettings } from '../hooks/use-settings'
import type { SidebarItem } from '../types/sidebar'

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
      items: [],
    },
    {
      title: 'Jogadores',
      url: '/players',
      icon: UsersIcon,
      items: [],
    },
  ],
} satisfies SidebarItem

export function Sidebar() {
  const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0])
  const { data: rankingLists } = useRankingList([])
  const { data: groupedLists } = useGroupedList()
  const { data: players } = usePlayer([])
  const { data: settings } = useSettings()

  if (!activeTeam) return null

  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
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
      total: list.total,
      showBadge: true,
    })) ?? []

  const dynamicGroupedLists =
    groupedLists?.map((list) => ({
      title: list.title,
      url: `/list/${list.slug}`,
      total: 0,
      showBadge: false,
    })) ?? []

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const nav = React.useMemo(() => {
    return DATA.navMain.map((item) => {
      if (item.title === 'Ranking') {
        return {
          ...item,
          items: [
            ...dynamicRankingLists,
            { title: 'Todas', url: '/ranking', total: 0, showBadge: false },
          ],
        }
      }

      if (item.title === 'Listas') {
        return {
          ...item,
          items: [
            ...dynamicGroupedLists,
            { title: 'Todas', url: '/list', total: 0, showBadge: false },
          ],
        }
      }

      if (item.title === 'Jogadores') {
        return {
          ...item,
          items: [
            ...item.items,
            { title: 'Todos', url: '/players', total: players?.length ?? 0, showBadge: true },
          ],
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
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar"
                  size="lg"
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
                asChild
                className="group/collapsible"
                defaultOpen={false}
                key={item.title}
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
                            {subItem.url ? (
                              <Link
                                className="flex w-full items-center justify-between"
                                href={subItem.url}
                              >
                                <span>{subItem.title}</span>
                                {subItem?.showBadge && (
                                  <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                                    {subItem.total}
                                  </Badge>
                                )}
                              </Link>
                            ) : (
                              <>
                                <span>{subItem.title}</span>
                                {subItem?.showBadge && (
                                  <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                                    {subItem.total}
                                  </Badge>
                                )}
                              </>
                            )}
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
