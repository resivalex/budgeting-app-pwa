import { FC } from 'react'

export default function Account({
  AccountSelect,
  account,
  onAccountChange,
}: {
  AccountSelect: FC<{ value: string; onChange: (value: string) => void }>
  account: string
  onAccountChange: (account: string) => void
}) {
  return (
    <div className="field">
      <div className="is-size-7">Счёт</div>
      <div className="control">
        <AccountSelect value={account} onChange={onAccountChange} />
      </div>
    </div>
  )
}
