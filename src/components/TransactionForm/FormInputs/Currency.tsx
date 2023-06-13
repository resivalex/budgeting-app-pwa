import { reactSelectSmallStyles } from '@/utils'
import Select from 'react-select'

interface Props {
  currency: string
  onCurrencyChange: (currency: string) => void
  currencyOptions: { value: string; label: string }[]
}

export default function Currency({ currency, onCurrencyChange, currencyOptions }: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Валюта</div>
      <div className="control">
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={currencyOptions.find((option) => option.value === currency) || null}
          onChange={(selectedOption) => {
            if (!selectedOption) return
            onCurrencyChange(selectedOption.value)
          }}
          options={currencyOptions}
          isSearchable={false}
          placeholder="Выберите из списка..."
          styles={reactSelectSmallStyles}
        />
      </div>
    </div>
  )
}
