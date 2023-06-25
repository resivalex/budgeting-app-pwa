import { convertCurrencyCodeToSymbol, reactSelectColorStyles, useColoredAccounts } from '@/utils'
import Select from 'react-select'
import { AccountDetailsDTO } from '@/types'

export default function ColoredAccountSelect({
  value,
  onChange,
  accountDetails,
  availableAccountNames,
  emptyOption,
}: {
  value: string
  onChange: (value: string) => void
  accountDetails: AccountDetailsDTO[]
  availableAccountNames: string[]
  emptyOption: string | null
}) {
  const coloredAccounts = useColoredAccounts(localStorage.accountProperties || '', accountDetails)
  const availableColoredAccounts = coloredAccounts.filter((a) =>
    availableAccountNames.includes(a.account)
  )
  const emptyOptions = emptyOption ? [{ value: '', label: emptyOption, color: '#ffffff' }] : []
  const accountOptions = availableColoredAccounts.map((a) => ({
    value: a.account,
    label: `[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`,
    color: a.color,
  }))
  const options = [...emptyOptions, ...accountOptions]

  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      value={options.find((option) => option.value === value) || null}
      onChange={(selectedOption) => {
        if (!selectedOption) return
        onChange(selectedOption.value)
      }}
      options={options}
      isSearchable={false}
      placeholder="Выберите из списка..."
      styles={reactSelectColorStyles}
    />
  )
}
