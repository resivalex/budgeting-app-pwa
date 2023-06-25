import { AccountDetailsDTO, TransactionDTO } from '@/types'
import TransactionsContainer from './TransactionsContainer'
import { TransactionFiltersContainer } from './TransactionFilters'

export default function TransactionsPage({
  filterAccountName,
  transactions,
  accountDetails,
  onFilterAccountNameChange,
  onRemove,
}: {
  filterAccountName: string
  transactions: TransactionDTO[]
  accountDetails: AccountDetailsDTO[]
  onFilterAccountNameChange: (accountName: string) => void
  onRemove: (id: string) => void
}) {
  function AccountSelect({
    value,
    onChange,
  }: {
    value: string
    onChange: (value: string) => void
  }) {
    return (
      <TransactionFiltersContainer
        accountName={value}
        accountDetails={accountDetails}
        onAccountNameChange={onChange}
      />
    )
  }

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
