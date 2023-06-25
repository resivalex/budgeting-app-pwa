import { convertCurrencyCodeToSymbol, reactSelectColorStyles, useColoredAccounts } from '@/utils'
import Select from 'react-select'
import { AccountDetailsDTO } from '@/types'

export default function ColoredAccountSelect({
  value,
  onChange,
  accountDetails,
  availableAccountNames,
}: {
  value: string
  onChange: (value: string) => void
  accountDetails: AccountDetailsDTO[]
  availableAccountNames: string[]
}) {
  const coloredAccounts = useColoredAccounts(localStorage.accountProperties || '', accountDetails)
  const availableColoredAccounts = coloredAccounts.filter((a) =>
    availableAccountNames.includes(a.account)
  )
  const accountOptions = availableColoredAccounts.map((a) => ({
    value: a.account,
    label: `[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`,
    color: a.color,
  }))

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
