import React, { useState } from 'react'
import Select from 'react-select'
import { reactSelectSmallStyles } from '../utils/react-select-styles'

type OptionType = {
  value: string
  label: string
}

interface SuggestingInputProps {
  suggestions: string[]
  value: string
  onChange: (value: string) => void
}

export default function SuggestingInput({ suggestions, value, onChange }: SuggestingInputProps) {
  const options: OptionType[] = suggestions.map((suggestion) => ({
    value: suggestion,
    label: suggestion,
  }))

  const [inputValue, setInputValue] = useState('')
  // HACK: Rerender to avoid clearing of input
  const [renderKey, setRenderKey] = useState(Math.random())

  const handleChange = (selectedOption: any) => {
    if (!selectedOption) return
    const selectedValue: string = (selectedOption as OptionType).value
    setInputValue(selectedValue)
    onChange(selectedValue)
    setRenderKey(Math.random())
  }

  const handleInputChange = (inputValue: string, { action }: { action: string }) => {
    if (action === 'input-change') {
      setInputValue(inputValue)
      onChange(inputValue)
    }
  }

  const selectedOption: OptionType = {
    value: value,
    label: value,
  }

  return (
    <Select
      key={renderKey}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      value={selectedOption}
      inputValue={inputValue}
      styles={reactSelectSmallStyles}
    />
  )
}
