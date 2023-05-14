import React from 'react'
import { convertCurrencyCodeToSymbol, formatFinancialAmount } from '@/utils'

interface Account {
  name: string
  currency: string
  balance: number
  color: string
}

interface Props {
  accounts: Account[]
}

export default function Home({ accounts }: Props) {
  return (
    <div className="box py-0 px-2">
      <div>
        {accounts.map(({ name, currency, balance, color }, index) => (
          <div key={index} className="box my-2" style={{ backgroundColor: color }}>
            <div className="columns is-mobile">
              <div className="column is-flex-grow-1 has-text-left-tablet">
                <h3 className="title is-6">{name}</h3>
              </div>
              <div className="column has-text-right">
                <p>
                  {formatFinancialAmount(balance)} {convertCurrencyCodeToSymbol(currency)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
