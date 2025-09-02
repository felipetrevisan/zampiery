import { useState } from 'react'

export function EditableScore({
  value,
  onSave,
  className,
}: {
  value: number | string
  onSave: (newValue: number) => void
  className: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [temp, setTemp] = useState(value.toString())

  const handleSave = () => {
    const num = Number.parseInt(temp, 10)

    if (!Number.isNaN(num)) onSave(num)
    setIsEditing(false)
  }

  return (
    <span className={className}>
      {isEditing ? (
        <input
          className="w-10 rounded bg-neutral-800 text-center outline-none"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') setIsEditing(false)
          }}
        />
      ) : (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <span className="cursor-pointer hover:text-blue-400" onClick={() => setIsEditing(true)}>
          {value}
        </span>
      )}
    </span>
  )
}
