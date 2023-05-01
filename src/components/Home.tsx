import React from 'react'
import { AccountDetailsDTO } from '../types'
import { convertCurrencyCodeToSymbol, formatFinancialAmount } from '../utils/finance-utils'

interface Props {
  transactions: any[]
  accountDetails: AccountDetailsDTO[]
}

export default function Home({ accountDetails }: Props) {
  return (
    <div className="box">
      <div>
        {accountDetails.map((accountDetail, index) => (
          <div key={index} className="box my-2">
            <div className="columns is-mobile">
              <div className="column is-flex-grow-1 has-text-left-tablet">
                <h3 className="title is-6">{accountDetail.account}</h3>
              </div>
              <div className="column has-text-right">
                <p>
                  {formatFinancialAmount(accountDetail.balance)}{' '}
                  {convertCurrencyCodeToSymbol(accountDetail.currency)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
