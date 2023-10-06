import { FC } from 'react'
import { TransactionDTO, AccountDetailsDTO } from '@/types'
import TransactionsPage from './TransactionsPage'

export default function TransactionsPageContainer({
  AccountSelect,
  transactions,
  accountDetails,
  filterAccountName,
  filterPayee,
  filterComment,
  onFilterAccountNameChange,
  onRemove,
}: {
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
  }>
  transactions: TransactionDTO[]
  accountDetails: AccountDetailsDTO[]
  filterAccountName: string
  filterPayee: string
  filterComment: string
  onFilterAccountNameChange: (accountName: string) => void
  onRemove: (id: string) => void
}) {
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by payee (exclude transfers and check for payee match if filterPayee is set)
    if (filterPayee) {
      if (
        transaction.type === 'transfer' ||
        !transaction.payee.toLowerCase().includes(filterPayee.toLowerCase())
      ) {
        return false
      }
    }

    // Filter by account name
    if (
      filterAccountName &&
      transaction.type === 'transfer' &&
      transaction.payee !== filterAccountName
    ) {
      return false
    }
    if (filterAccountName && transaction.account !== filterAccountName) {
      return false
    }

    // Filter by comment
    if (filterComment && !transaction.comment.toLowerCase().includes(filterComment.toLowerCase())) {
      return false
    }

    return true
  })

  return (
    <TransactionsPage
      AccountSelect={AccountSelect}
      filterAccountName={filterAccountName}
      transactions={filteredTransactions}
      accountDetails={accountDetails}
      onFilterAccountNameChange={onFilterAccountNameChange}
      onRemove={onRemove}
    />
  )
}
