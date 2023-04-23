// TransactionsContainer.tsx
import React from 'react'
import Transactions from './Transactions'

interface Props {
  transactions: any[]
}

export default function BudgetTransactionsContainer({ transactions }: Props) {
  return (
    <Transactions
      transactions={transactions}
      onRemove={null}
    />
  )
}
