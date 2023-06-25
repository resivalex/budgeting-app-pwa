import { useState } from 'react'
import Transactions from './Transactions'
import { useNavigate } from 'react-router-dom'
import { TransactionDTO } from '@/types'

export default function TransactionsContainer({
  transactions,
  onRemove,
}: {
  transactions: TransactionDTO[]
  onRemove: (id: string) => void
}) {
  const [focusedTransactionId, setFocusedTransactionId] = useState<string>('')

  const navigate = useNavigate()

  const focusedTransaction = transactions.find(
    (transaction) => transaction._id === focusedTransactionId
  )

  function handleEdit(id: string) {
    navigate(`/transactions/${id}`, { replace: true })
  }

  return (
    <Transactions
      transactions={transactions}
      focusedTransaction={focusedTransaction}
      onRemove={onRemove}
      onEdit={handleEdit}
      onFocus={setFocusedTransactionId}
      onUnfocus={() => setFocusedTransactionId('')}
    />
  )
}
