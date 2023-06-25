import { FC } from 'react'

interface Props {
  AccountSelect: FC<{ value: string; onChange: (value: string) => void }>
  payeeTransferAccount: string
  onPayeeTransferAccountChange: (payeeTransferAccount: string) => void
}

export default function PayeeTransferAccount({
  AccountSelect,
  payeeTransferAccount,
  onPayeeTransferAccountChange,
}: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Перевод на счёт</div>
      <div className="control">
        <AccountSelect value={payeeTransferAccount} onChange={onPayeeTransferAccountChange} />
      </div>
    </div>
  )
}
