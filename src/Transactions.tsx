import React from 'react'
import Transaction from './Transaction'

export default function Transactions({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return <div className="box">Empty</div>
  }

  return (
    <div>
      {transactions.map((transaction: any, index: number) => {
        return <Transaction key={index} t={transaction}></Transaction>
      })}
    </div>
  )
}
