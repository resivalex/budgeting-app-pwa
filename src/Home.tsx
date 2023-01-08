import React from 'react'

type Props = {
  transactions: any[]
}

export default function Home({ transactions }: Props) {
  return (
    <div className="box">
      <div>Home</div>
      <div>Transactions: {transactions.length}</div>
    </div>
  )
}
