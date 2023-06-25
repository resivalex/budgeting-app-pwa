import { AccountDetailsDTO, TransactionDTO } from '@/types'
import { FC } from 'react'
import TransactionsContainer from './TransactionsContainer'

export default function TransactionsPage({
  AccountSelect,
  filterAccountName,
  transactions,
  onFilterAccountNameChange,
  onRemove,
}: {
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
  }>
  filterAccountName: string
  transactions: TransactionDTO[]
  accountDetails: AccountDetailsDTO[]
  onFilterAccountNameChange: (accountName: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <div style={{ flex: 1 }}>
        <AccountSelect value={filterAccountName} onChange={onFilterAccountNameChange} />
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <TransactionsContainer transactions={transactions} onRemove={onRemove} />
      </div>
    </div>
  )
}
