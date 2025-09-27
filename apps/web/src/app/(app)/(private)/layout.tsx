import { SidebarInset, SidebarProvider } from '@nathy/shared/ui/animated/sidebar'
import { Sidebar } from '@nathy/web/components/app-sidebar'
import { Background } from '@nathy/web/components/background'
import CatEasterEgg from '@nathy/web/components/easter-egg/cat-easter-egg'
import { SidebarToolbar } from '@nathy/web/components/sidebar/toolbar'
import { authOptions } from '@nathy/web/server/auth-options'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="before:absolute before:z-1 before:h-full before:w-full before:bg-background/60 before:backdrop-blur-md">
        <SidebarToolbar />
        <div>
          <Background />
          <div className="relative z-10 mx-4 mb-10">{children}</div>
          <CatEasterEgg />
        </div>
        <svg className="hidden" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                result="goo"
                values="1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 21 -7"
              />
              <feBlend in="SourceGraphic" in2="goo" result="mix" />
            </filter>
          </defs>
        </svg>
      </SidebarInset>
    </SidebarProvider>
  )
}
