// TransactionsContainer.tsx
import React from 'react'
import Transactions from './Transactions'
import { useNavigate } from 'react-router-dom'

interface Props {
  transactions: any[]
  onRemove: (id: string) => void
}

export default function TransactionsContainer({ transactions, onRemove }: Props) {
  const navigate = useNavigate()

  function handleEdit(id: string) {
    navigate(`/transactions/${id}`, { replace: true })
  }

  return (
    <Transactions
      transactions={transactions}
      showRemoveButton={true}
      onRemove={onRemove}
      onEdit={handleEdit}
    />
  )
}
