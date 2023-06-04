import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
  const [isFocused, setIsFocused] = useState(false)

  const inputValueRef = useRef(inputValue)

  useEffect(() => {
    inputValueRef.current = inputValue
  }, [inputValue])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleFocusChange = useCallback(() => {
    isFocused ? updateInputOnFocus() : handleBlurAfterSuggestionClick()
  }, [isFocused])

  useEffect(() => {
    handleFocusChange()
  }, [handleFocusChange])

  const updateInputOnFocus = useCallback(() => {
    const option = options.find((option) => option.value === value)
    setInputValue(option ? option.label : '')
    setShowSuggestions(true)
  }, [options, value])

  const handleBlurAfterSuggestionClick = useCallback(() => {
    const blurTimeoutId = setTimeout(() => {
      const option = options.find((option) => option.label === inputValueRef.current)
      if (option) {
        onChange(option.value)
      } else {
        revertToPreviousValue()
      }
      setShowSuggestions(false)
    }, 100)

    return () => clearTimeout(blurTimeoutId)
  }, [options, onChange, value])

  const revertToPreviousValue = useCallback(() => {
    const previousOption = options.find((option) => option.value === value)
    setInputValue(previousOption ? previousOption.label : '')
  }, [options, value])

  const handleSuggestionClick = useCallback(
    (suggestionValue: string) => {
      setInputValue(suggestionValue)
      onChange(suggestionValue)
    },
    [onChange]
  )

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
    handleInputChange,
    setIsFocused,
    showSuggestions,
    handleSuggestionClick,
    filteredSuggestions,
  }
}

// Main Component
export default function ChoosingInput(props: ChoosingInputProps) {
  const {
    inputValue,
    handleInputChange,
    setIsFocused,
    showSuggestions,
    handleSuggestionClick,
    filteredSuggestions,
  } = useChoosingInput(props)

  return (
    <Wrapper>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Выберите из списка..."
      />
      {showSuggestions && (
        <Suggestions>
          {filteredSuggestions.map((option, index) => (
            <Suggestion key={index} onClick={() => handleSuggestionClick(option.value)}>
              {option.label}
            </Suggestion>
          ))}
        </Suggestions>
      )}
    </Wrapper>
  )
}
