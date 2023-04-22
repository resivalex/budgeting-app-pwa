import React from 'react'
import { Budget as BudgetType } from './redux/budgetsSlice'
import Budget from './Budget'
import BudgetInfoModal from './BudgetInfoModal'

interface Props {
  budgets: BudgetType[]
  onFocus: (name: string) => void
  focusedBudget: BudgetType | null
}

export default function Budgets({ budgets, onFocus, focusedBudget }: Props) {
  return (
    <>
      <div className="box" style={{ flex: 1, overflow: 'scroll' }}>
        {budgets.map((budget, index) => (
          <Budget
            key={index}
            totalAmount={budget.amount}
            spentAmount={budget.spentAmount}
            currency={budget.currency}
            name={budget.name}
            onLongPress={() => onFocus(budget.name)}
          />
        ))}
      </div>{' '}
      {focusedBudget && <BudgetInfoModal budget={focusedBudget} onClose={() => onFocus('')} />}
    </>
  )
}
