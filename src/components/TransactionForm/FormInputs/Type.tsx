import { reactSelectSmallStyles } from '@/utils'
import Select from 'react-select'

interface Props {
  type: 'income' | 'expense' | 'transfer' | ''
  onTypeChange: (type: 'income' | 'expense' | 'transfer') => void
  typeOptions: { value: string; label: string }[]
}

export default function Type({ type, onTypeChange, typeOptions }: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Тип</div>
      <div className="control">
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={typeOptions.find((option) => option.value === type) || null}
          onChange={(selectedOption) => {
            if (!selectedOption) return
            onTypeChange(selectedOption.value as 'income' | 'expense' | 'transfer')
          }}
          options={typeOptions}
          isSearchable={false}
          placeholder="Выберите из списка..."
          styles={reactSelectSmallStyles}
        />
      </div>
    </div>
  )
}
