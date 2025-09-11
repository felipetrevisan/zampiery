import type { Metadata } from 'next'
import './style.css'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardPage() {
  return (
    <div className="space-y-2">
      {/* <div className="-rotate-3">
        <div className='neon blue m-auto text-center font-bold font-nixie text-9xl text-white'>
          N<span className="fade text-white opacity-80">athy</span> Zampiery
        </div>
      </div> */}
    </div>
  )
}
