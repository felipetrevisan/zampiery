export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen items-center justify-center">{children}</div>
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
