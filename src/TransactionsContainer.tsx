// TransactionsContainer.tsx
import React from 'react'
import Transactions from './Transactions'

interface Props {
  transactions: any[]
  onRemove: ((id: string) => void) | null
}

export default function TransactionsContainer({ transactions, onRemove }: Props) {
  return (
    <Transactions
      transactions={transactions}
      onRemove={onRemove}
    />
  )
}
