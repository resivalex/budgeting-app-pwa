import React, { useState } from 'react'

type Props = {
  onChange: (value: string) => void
}

export default function Config({ onChange }: Props) {
  const [value, setValue] = useState('')
  const [placeholder, setPlaceholder] = useState('Place configuration here')

  return (
    <div className="box">
      <textarea
        className="textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
      <button
        className="button mt-1"
        onClick={() => {
          onChange(value)
          setValue('')
          setPlaceholder('Config saved. Reload the app.')
        }}
      >
        Save
      </button>
    </div>
  )
}
