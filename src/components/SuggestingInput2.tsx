import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
`

const Suggestions = styled.div`
  position: absolute;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  background-color: white;
`

const Suggestion = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`

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
    <Wrapper ref={inputRef}>
      <Input type="text" value={inputValue} onChange={handleChange} onFocus={handleFocus} />
      {showSuggestions && (
        <Suggestions>
          {filteredSuggestions.map((suggestion, index) => (
            <Suggestion key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </Suggestion>
          ))}
        </Suggestions>
      )}
    </Wrapper>
  )
}
