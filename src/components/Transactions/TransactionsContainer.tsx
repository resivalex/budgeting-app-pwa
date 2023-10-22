import { useState, useMemo } from 'react'
import Transactions from './Transactions'
import { useNavigate } from 'react-router-dom'
import { TransactionDTO } from '@/types'

export default function TransactionsContainer({
  transactions,
  onRemove,
}: {
  transactions: TransactionDTO[]
  onRemove: (id: string) => Promise<void>
}) {
  const [focusedTransactionId, setFocusedTransactionId] = useState<string>('')

  const navigate = useNavigate()

  const focusedTransaction = useMemo(
    () => transactions.find((transaction) => transaction._id === focusedTransactionId),
    [transactions, focusedTransactionId]
  )

  const handleEdit = (id: string) => {
    navigate(`/transactions/${id}`, { replace: true })
  }

  const handleUnfocus = () => {
    setFocusedTransactionId('')
  }

  return (
    <Transactions
      transactions={transactions}
      focusedTransaction={focusedTransaction}
      onRemove={onRemove}
      onEdit={handleEdit}
      onFocus={setFocusedTransactionId}
      onUnfocus={handleUnfocus}
    />
  )
}
