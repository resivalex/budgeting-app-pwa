import { TransactionDTO } from '@/types'
import TransactionsPage from './TransactionsPage'

export default function TransactionsPageContainer({
  transactions,
  filterAccountName,
  onFilterAccountNameChange,
  onRemove,
}: {
  transactions: TransactionDTO[]
  filterAccountName: string
  onFilterAccountNameChange: (accountName: string) => void
  onRemove: (id: string) => void
}) {
  const filteredTransactions = transactions.filter((transaction) => {
    if (filterAccountName === '') return true
    if (transaction.type === 'transfer' && transaction.payee === filterAccountName) {
      return true
    }
    return transaction.account === filterAccountName
  })

  return (
    <TransactionsPage
      filterAccountName={filterAccountName}
      transactions={filteredTransactions}
      onFilterAccountNameChange={onFilterAccountNameChange}
      onRemove={onRemove}
    />
  )
}
