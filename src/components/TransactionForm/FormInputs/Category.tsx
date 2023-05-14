import { reactSelectSmallStyles } from '@/utils'
import Select from 'react-select'

interface Props {
  category: string
  onCategoryChange: (category: string) => void
  categoryOptions: { value: string; label: string }[]
}

export default function Category({ category, onCategoryChange, categoryOptions }: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Категория</div>
      <div className="control">
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={categoryOptions.find((option) => option.value === category)}
          onChange={(selectedOption) => {
            if (!selectedOption) return
            onCategoryChange(selectedOption.value)
          }}
          options={categoryOptions}
          styles={reactSelectSmallStyles}
        />
      </div>
    </div>
  )
}
