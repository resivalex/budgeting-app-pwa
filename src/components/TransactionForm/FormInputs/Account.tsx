import { reactSelectColorStyles } from '@/utils'
import Select from 'react-select'

interface Props {
  account: string
  onAccountChange: (account: string) => void
  accountOptions: { value: string; label: string; color: string }[]
}

export default function Account({ account, onAccountChange, accountOptions }: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Счёт</div>
      <div className="control">
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={accountOptions.find((option) => option.value === account) || null}
          onChange={(selectedOption) => {
            if (!selectedOption) return
            onAccountChange(selectedOption.value)
          }}
          options={accountOptions}
          isSearchable={false}
          placeholder="Выберите из списка..."
          styles={reactSelectColorStyles}
        />
      </div>
    </div>
  )
}
