import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@nathy/shared/ui/animated/collapsible'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@nathy/shared/ui/animated/sidebar'
import { Badge } from '@nathy/shared/ui/badge'
import { usePlatforms } from '@nathy/web/hooks/use-platform'
import { usePlayer } from '@nathy/web/hooks/use-player'
import { useRankingList } from '@nathy/web/hooks/use-ranking'
import { ChartBarIcon, ChevronRight, JoystickIcon, PersonStandingIcon } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'

export function SidebarNavigation() {
  const { data: rankingLists } = useRankingList([])
  const { data: platforms } = usePlatforms([])
  const { data: players } = usePlayer([])

  return (
    <SidebarContent>
      <SidebarGroup>
        {platforms.map((platform) => (
          <Fragment key={platform.id}>
            <SidebarGroupLabel>{platform.title}</SidebarGroupLabel>
            <SidebarMenu>
              <Collapsible asChild className="group/collapsible" defaultOpen={false}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Listas">
                      <ChartBarIcon />
                      <span>Listas</span>
                      <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {platform.lists?.map((list) => (
                        <SidebarMenuSubItem key={list.id}>
                          <SidebarMenuSubButton asChild>
                            {list.slug ? (
                              <Link
                                className="flex w-full items-center justify-between"
                                href={`/${platform.slug}/${list.slug}`}
                              >
                                <span>{list.title}</span>
                              </Link>
                            ) : (
                              <span>{list.title}</span>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            className="flex w-full items-center justify-between"
                            href={`/${platform.slug}`}
                          >
                            <span>Ver Todos</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </Fragment>
        ))}
        <SidebarGroupLabel>Outros</SidebarGroupLabel>
        <SidebarMenu>
          <Collapsible asChild className="group/collapsible" defaultOpen={false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Ranking">
                  <ChartBarIcon />
                  <span>Ranking</span>
                  <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {rankingLists.map((list) => (
                    <SidebarMenuSubItem key={list.title}>
                      <SidebarMenuSubButton asChild>
                        {list.slug ? (
                          <Link
                            className="flex w-full items-center justify-between"
                            href={`/ranking/${list.slug}`}
                          >
                            <span>{list.title}</span>
                            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                              {list.total}
                            </Badge>
                          </Link>
                        ) : (
                          <>
                            <span>{list.title}</span>
                            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                              {list.total}
                            </Badge>
                          </>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link className="flex w-full items-center justify-between" href="/ranking">
                        <span>Ver Todos</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <Collapsible asChild className="group/collapsible" defaultOpen={false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Jogadores">
                  <PersonStandingIcon />
                  <span>Jogadores</span>
                  <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link className="flex w-full items-center justify-between" href="/players">
                        <span>Ver Todos</span>
                        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                          {players?.length}
                        </Badge>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <Collapsible asChild className="group/collapsible" defaultOpen={false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Plataformas">
                  <JoystickIcon />
                  <span>Plataformas</span>
                  <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link className="flex w-full items-center justify-between" href="/platforms">
                        <span>Ver Todas</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}
