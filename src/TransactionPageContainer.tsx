import { useTransactionFiltersSelect } from './redux/transactionFiltersSlice'
import { TransactionDTO } from './Transaction'
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

  return <TransactionsPage transactions={filteredTransactions} onRemove={onRemove} />
}
