import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const Input = styled.input`
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const Suggestion = styled.div`
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #f1f1f1;
  }
`

const Suggestions = styled.div`
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
  background-color: white;
  border-radius: 5px;
`

interface Option {
  value: string
  label: string
}

interface ChoosingInputProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
}

export default function ChoosingInput({ value, onChange, options }: ChoosingInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Update the input value when the external value changes
  useEffect(() => {
    const option = options.find((option) => option.value === value)
    setInputValue(option ? option.label : '')
  }, [value])

  // Filter suggestions based on input value
  function getFilteredSuggestions() {
    if (!inputValue) {
      return options
    }

    return options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
  }

  // Handle outside click to close suggestions
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleFocus = () => {
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestionValue: string) => {
    onChange(suggestionValue)
    setShowSuggestions(false)
  }

  return (
    <Wrapper ref={inputRef}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder="Выберите из списка..."
      />
      {showSuggestions && (
        <Suggestions>
          {getFilteredSuggestions().map((option, index) => (
            <Suggestion key={index} onClick={() => handleSuggestionClick(option.value)}>
              {option.label}
            </Suggestion>
          ))}
        </Suggestions>
      )}
    </Wrapper>
  )
}
