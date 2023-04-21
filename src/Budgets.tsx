import React from 'react'
import { Budget } from './redux/budgetsSlice'
import { convertCurrencyCodeToSymbol, formatFinancialAmount } from './finance-utils'

interface Props {
  budgets: Budget[]
}

export default function Budgets({ budgets }: Props) {
  return (
    <div className="box" style={{ flex: 1, overflow: 'scroll' }}>
      {budgets.map((budget: Budget, index: number) => {
        return (
          <div key={index} className="box">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  <div className="title is-4">{budget.name}</div>
                </div>
              </div>
            </div>
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  <div>
                    Всего {formatFinancialAmount(budget.amount)}{' '}
                    {convertCurrencyCodeToSymbol(budget.currency)}
                  </div>
                </div>
              </div>
            </div>
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  <div>
                    Потрачено {formatFinancialAmount(budget.spentAmount)}{' '}
                    {convertCurrencyCodeToSymbol(budget.currency)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
