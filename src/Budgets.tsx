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
        const percentage = budget.amount === 0 ? 0 : (budget.spentAmount / budget.amount) * 100

        const progressBarValue = budget.spentAmount > budget.amount ? 100 : percentage

        const progressBarColor = budget.spentAmount > budget.amount ? 'is-danger' : 'is-primary'

        return (
          <div key={index} className="box">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  <div className="title is-4">{budget.name}</div>
                </div>
              </div>
            </div>
            <div className="level is-flex-mobile">
              <div className="level-left">
                <div className="level-item">
                  <div>
                    {formatFinancialAmount(budget.spentAmount)}{' '}
                    {convertCurrencyCodeToSymbol(budget.currency)}
                  </div>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  {formatFinancialAmount(budget.amount - budget.spentAmount)}{' '}
                  {convertCurrencyCodeToSymbol(budget.currency)}
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <div>
                    {formatFinancialAmount(budget.amount)}{' '}
                    {convertCurrencyCodeToSymbol(budget.currency)}
                  </div>
                </div>
              </div>
            </div>
            <progress className={`progress ${progressBarColor}`} value={progressBarValue} max="100">
              {progressBarValue}%
            </progress>
          </div>
        )
      })}
    </div>
  )
}
