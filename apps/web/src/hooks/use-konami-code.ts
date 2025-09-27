'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export default function useKonamiToggle() {
  const bufferRef = useRef<string[]>([])
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // normalize: letras para lower-case, outras teclas mantêm o nome (ArrowUp etc)
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key

      bufferRef.current.push(key)
      // manter somente os últimos N
      if (bufferRef.current.length > KONAMI.length) {
        bufferRef.current.splice(0, bufferRef.current.length - KONAMI.length)
      }

      // verificar igualdade
      if (
        bufferRef.current.length === KONAMI.length &&
        KONAMI.every((k, i) => bufferRef.current[i] === k)
      ) {
        setActivated((prev) => {
          const next = !prev
          toast.success(`Código ${next ? 'ativado' : 'desativado'}`)
          return next
        })

        bufferRef.current = []
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return activated
}
