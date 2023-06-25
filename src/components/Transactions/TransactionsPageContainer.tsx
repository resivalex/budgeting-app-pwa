import { useTransactionFiltersSelect, setAccountName } from '@/redux/transactionFiltersSlice'
import { useDispatch } from 'react-redux'
import { TransactionDTO } from '@/types'
import TransactionsPage from './TransactionsPage'

interface Props {
  transactions: TransactionDTO[]
  onRemove: (id: string) => void
}

export default function TransactionsPageContainer({ transactions, onRemove }: Props) {
  const filterAccountName = useTransactionFiltersSelect((state) => state.accountName)

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterAccountName === '') return true
    if (transaction.type === 'transfer' && transaction.payee === filterAccountName) {
      return true
    }
    return transaction.account === filterAccountName
  })

  const dispatch = useDispatch()

  return (
    <TransactionsPage
      filterAccountName={filterAccountName}
      transactions={filteredTransactions}
      onFilterAccountNameChange={(accountName) => {
        dispatch(setAccountName(accountName))
      }}
      onRemove={onRemove}
    />
  )
}
