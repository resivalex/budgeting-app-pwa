import React, { useState, useRef, useEffect } from 'react'

interface SuggestingInputProps {
  suggestions: string[]
  value: string
  onChange: (value: string) => void
}

export default function SuggestingInput({ suggestions, value, onChange }: SuggestingInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = inputValue
    ? suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      )
    : suggestions

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onChange(e.target.value)
  }

  const handleFocus = () => {
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    onChange(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div ref={inputRef}>
      <input type="text" value={inputValue} onChange={handleChange} onFocus={handleFocus} />
      {showSuggestions && (
        <div>
          {filteredSuggestions.map((suggestion, index) => (
            <div key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
