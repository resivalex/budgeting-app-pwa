import { reactSelectSmallStyles } from '@/utils'
import Select from 'react-select'

interface Props {
  value: string
  onChange: (category: string) => void
  options: { value: string; label: string }[]
}

export default function ChoosingInput({ value, onChange, options }: Props) {
  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      value={options.find((option) => option.value === value)}
      onChange={(selectedOption) => {
        if (!selectedOption) return
        onChange(selectedOption.value)
      }}
      options={options}
      styles={reactSelectSmallStyles}
      placeholder="Выберите из списка..."
    />
  )
}
