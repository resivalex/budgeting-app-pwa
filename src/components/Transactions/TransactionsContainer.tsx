import { useState, useEffect } from 'react'
import Transactions from './Transactions'
import { useNavigate } from 'react-router-dom'
import { TransactionDTO } from '@/types'

interface Props {
  transactions: any[]
  onRemove: (id: string) => void
}

export default function TransactionsContainer({ transactions, onRemove }: Props) {
  const [storeTransactions, setStoreTransactions] = useState<TransactionDTO[]>([])
  const [focusedTransactionId, setFocusedTransactionId] = useState<string>('')

  const navigate = useNavigate()

  const focusedTransaction = storeTransactions.find(
    (transaction) => transaction._id === focusedTransactionId
  )

  useEffect(() => {
    setStoreTransactions(transactions)
  }, [transactions])

  function handleEdit(id: string) {
    navigate(`/transactions/${id}`, { replace: true })
  }

  return (
    <Transactions
      transactions={storeTransactions}
      focusedTransaction={focusedTransaction}
      onRemove={onRemove}
      onEdit={handleEdit}
      onFocus={setFocusedTransactionId}
      onUnfocus={() => setFocusedTransactionId('')}
    />
  )
}
