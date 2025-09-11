import { Background } from '@nathy/web/components/background'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <Background />
        <div className="relative z-10 mx-4 mb-10">{children}</div>
      </main>
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
    </>
  )
}
