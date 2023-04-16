import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable'

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

  const handleChange = (selectedOption: any) => {
    if (!selectedOption) return
    const inputValue: string = (selectedOption as OptionType).value
    setInputValue(inputValue)
    onChange(inputValue)
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
    <CreatableSelect
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      value={selectedOption}
      inputValue={inputValue}
    />
  )
}
