'use client'

import useKonamiToggle from '@nathy/web/hooks/use-konami-code'
import './cat.css'

export default function CatEasterEgg() {
  const activated = useKonamiToggle()

  if (!activated) return null

  return (
    <div className='fixed bottom-10 left-10 z-50 flex w-screen items-end gap-4'>
      <div className="move">
        <div className="cat walking"></div>
      </div>
    </div>
  )
}
