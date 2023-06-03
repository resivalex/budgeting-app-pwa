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
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter suggestions based on input value
  function getFilteredSuggestions() {
    if (!inputValue) {
      return options
    }

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) && option.label !== inputValue
    )
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  const inputValueRef = useRef(inputValue)

  // Store inputValue to check in setTimeout
  useEffect(() => {
    inputValueRef.current = inputValue
  }, [inputValue])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    if (isFocused) {
      const option = options.find((option) => option.value === value)
      setInputValue(option ? option.label : '')
      setShowSuggestions(true)
    } else {
      // Handle blur after suggestion click
      timeoutId = setTimeout(() => {
        const option = options.find((option) => option.label === inputValueRef.current)
        if (option) {
          onChange(option.value)
        } else {
          const previousOption = options.find((option) => option.value === value)
          setInputValue(previousOption ? previousOption.label : '')
        }
        setShowSuggestions(false)
      }, 100)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isFocused])

  function handleFocus() {
    setIsFocused(true)
  }

  function handleBlur() {
    setIsFocused(false)
  }

  const handleSuggestionClick = (suggestionValue: string) => {
    setInputValue(suggestionValue)
    onChange(suggestionValue)
  }

  return (
    <Wrapper ref={inputRef}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
