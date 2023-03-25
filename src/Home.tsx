import React from 'react'

type Props = {
  transactions: any[]
}

export default function Home({ transactions }: Props) {
  return (
    <div className="box">
      <h1 className="title is-4">Welcome to the Budgeting App!</h1>

      <div>
        <h2 className="subtitle is-5">Transactions count: {transactions.length}</h2>
      </div>
    </div>
  )
}
