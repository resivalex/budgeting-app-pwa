import { TransactionDTO } from '@/types'
import TransactionsContainer from './TransactionsContainer'
import { TransactionFiltersContainer } from './TransactionFilters'

export default function TransactionsPage({
  filterAccountName,
  transactions,
  onFilterAccountNameChange,
  onRemove,
}: {
  filterAccountName: string
  transactions: TransactionDTO[]
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
        <TransactionFiltersContainer
          accountName={filterAccountName}
          onAccountNameChange={onFilterAccountNameChange}
        />
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
