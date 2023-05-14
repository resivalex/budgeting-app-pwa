import { reactSelectColorStyles } from '@/utils'
import Select from 'react-select'

interface Props {
  payeeTransferAccount: string
  onPayeeTransferAccountChange: (payeeTransferAccount: string) => void
  accountOptions: { value: string; label: string; color: string }[]
}

export default function PayeeTransferAccount({
  payeeTransferAccount,
  onPayeeTransferAccountChange,
  accountOptions,
}: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Перевод на счёт</div>
      <div className="control">
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={accountOptions.find((option) => option.value === payeeTransferAccount)}
          onChange={(selectedOption) => {
            if (!selectedOption) return
            onPayeeTransferAccountChange(selectedOption.value)
          }}
          options={accountOptions}
          isSearchable={false}
          styles={reactSelectColorStyles}
        />
      </div>
    </div>
  )
}
