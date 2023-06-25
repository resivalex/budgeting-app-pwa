import { reactSelectColorStyles } from '@/utils'
import Select from 'react-select'

export default function Account({
  account,
  onAccountChange,
  accountOptions,
}: {
  account: string
  onAccountChange: (account: string) => void
  accountOptions: { value: string; label: string; color: string }[]
}) {
  function AccountSelect({
    value,
    onChange,
  }: {
    value: string
    onChange: (value: string) => void
  }) {
    return (
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={accountOptions.find((option) => option.value === value) || null}
        onChange={(selectedOption) => {
          if (!selectedOption) return
          onChange(selectedOption.value)
        }}
        options={accountOptions}
        isSearchable={false}
        placeholder="Выберите из списка..."
        styles={reactSelectColorStyles}
      />
    )
  }

  return (
    <div className="field">
      <div className="is-size-7">Счёт</div>
      <div className="control">
        <AccountSelect value={account} onChange={onAccountChange} />
      </div>
    </div>
  )
}
