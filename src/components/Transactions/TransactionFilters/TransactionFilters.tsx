import Select from 'react-select'

interface Props {
  filterAccountName: string
  accountNames: string[]
  onFilterAccountNameChange: (accountName: string) => void
}

export default function TransactionFilters({
  filterAccountName,
  accountNames,
  onFilterAccountNameChange,
}: Props) {
  const accountOptions = accountNames.map((accountName) => ({
    value: accountName,
    label: accountName,
  }))
  return (
    <div className="px-2 pb-1">
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={accountOptions.find((option) => option.value === filterAccountName)}
        onChange={(selectedOption) => {
          if (!selectedOption) return
          onFilterAccountNameChange(selectedOption.value)
        }}
        options={accountOptions}
        isSearchable={false}
      />
    </div>
  )
}
