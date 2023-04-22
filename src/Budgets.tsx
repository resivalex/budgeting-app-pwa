import React from 'react'
import { Budget as BudgetType } from './redux/budgetsSlice'
import Budget from './Budget'

interface Props {
  budgets: BudgetType[]
}

export default function Budgets({ budgets }: Props) {
  return (
    <div className="box" style={{ flex: 1, overflow: 'scroll' }}>
      {budgets.map((budget, index) => (
        <Budget
          key={index}
          totalAmount={budget.amount}
          spentAmount={budget.spentAmount}
          currency={budget.currency}
          name={budget.name}
        />
      ))}
    </div>
  )
}
