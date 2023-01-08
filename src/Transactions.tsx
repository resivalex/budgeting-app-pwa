import React from 'react'
import Transaction from './Transaction'

export default function Transactions({ transactions }: { transactions: any[] }) {
  return (
    <div>
      {transactions.map((transaction: any, index: number) => {
        return <Transaction key={index} t={transaction}></Transaction>
      })}
    </div>
  )
}
