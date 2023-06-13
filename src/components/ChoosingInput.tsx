import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'

// Component Styles
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

// Component Props
interface Option {
  value: string
  label: string
}

interface ChoosingInputProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
}

// Custom Hook
function useChoosingInput({ value, onChange, options }: ChoosingInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const option = options.find((option) => option.value === value)
    setInputValue(option?.label || '')
  }, [value, options])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleFocus = () => {
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    const option = options.find((option) => option.label === inputValue)
    if (!option) {
      const prevOption = options.find((option) => option.value === value)
      setInputValue(prevOption?.label || '')
    }

    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestionValue: string, suggestionLabel: string) => {
    onChange(suggestionValue)
    setInputValue(suggestionLabel)
  }

  const filteredSuggestions = useMemo(() => {
    return inputValue
      ? options.filter((option) => {
          return (
            option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
            option.label !== inputValue
          )
        })
      : options
  }, [options, inputValue])

  return {
    inputValue,
    showSuggestions,
    filteredSuggestions,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleSuggestionClick,
  }
}

// Main Component
export default function ChoosingInput(props: ChoosingInputProps) {
  const {
    inputValue,
    showSuggestions,
    filteredSuggestions,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleSuggestionClick,
  } = useChoosingInput(props)

  return (
    <Wrapper>
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
          {filteredSuggestions.map((option, index) => (
            <Suggestion
              key={index}
              onMouseDown={() => handleSuggestionClick(option.value, option.label)}
            >
              {option.label}
            </Suggestion>
          ))}
        </Suggestions>
      )}
    </Wrapper>
  )
}
