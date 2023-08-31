import React, { useState, useRef, useMemo, useImperativeHandle, forwardRef } from 'react'
import styled from 'styled-components'
import { AiOutlineCloseCircle } from 'react-icons/ai'

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

const CloseIcon = styled(AiOutlineCloseCircle)`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  font-size: 30px;
  background-color: white;
  border-radius: 50%;
  padding: 2px;
`

interface SuggestingInputProps {
  suggestions: string[]
  value: string
  onChange: (value: string) => void
}

const SuggestingInput = forwardRef((props: SuggestingInputProps, ref) => {
  const { suggestions, value, onChange } = props
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus()
        setShowSuggestions(true)
      }
    },
  }))

  const filteredSuggestions = useMemo(() => {
    if (!value) {
      return suggestions
    }

    return suggestions.filter(
      (suggestion) => suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
    )
  }, [suggestions, value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange(value)
  }

  const handleFocus = () => {
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showSuggestions && (
        <Suggestions>
          <CloseIcon onClick={() => setShowSuggestions(false)} />
          {filteredSuggestions.map((suggestion, index) => (
            <Suggestion key={index} onMouseDown={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </Suggestion>
          ))}
        </Suggestions>
      )}
    </Wrapper>
  )
})

export default SuggestingInput
