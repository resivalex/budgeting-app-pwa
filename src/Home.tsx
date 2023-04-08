import React from 'react'
import { AccountDetails } from './TransactionAggregator'

type Props = {
  transactions: any[]
  accountDetails: AccountDetails[]
}

export default function Home({ accountDetails }: Props) {
  return (
    <div className="box">
      <div>
        {accountDetails.map((accountDetail, index) => (
          <div key={index} className="box">
            <div className="columns is-mobile">
              <div className="column is-flex-grow-1 has-text-left-tablet">
                <h3 className="title is-6">{accountDetail.account}</h3>
              </div>
              <div className="column has-text-right">
                <p>
                  {accountDetail.balance.toFixed(2)} {accountDetail.currency}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
