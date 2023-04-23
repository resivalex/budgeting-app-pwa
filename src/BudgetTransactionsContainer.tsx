// TransactionsContainer.tsx
import React from 'react'
import Transactions from './Transactions'
import { useNavigate } from 'react-router-dom'

interface Props {
  transactions: any[]
}

export default function BudgetTransactionsContainer({ transactions }: Props) {
  const navigate = useNavigate()

  function handleEdit(id: string) {
    navigate(`/transactions/${id}`, { replace: true })
  }

  return <Transactions transactions={transactions} onRemove={null} onEdit={handleEdit} />
}
