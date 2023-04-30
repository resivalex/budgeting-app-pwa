import React from 'react'
import { Budget as BudgetType } from './redux/budgetsSlice'
import Budget from './Budget'
import BudgetInfoModal from './BudgetInfoModal'
import Select from 'react-select'
import dayjs from 'dayjs'

interface Props {
  budgets: BudgetType[]
  selectedMonth: string
  availableMonths: string[]
  onMonthSelect: (month: string) => void
  onFocus: (name: string) => void
  focusedBudget: BudgetType | null
  onTransactionRemove: (id: string) => void
}

export default function Budgets({
  budgets,
  selectedMonth,
  availableMonths,
  onMonthSelect,
  onFocus,
  focusedBudget,
  onTransactionRemove,
}: Props) {
  const monthOptions = availableMonths.map((month) => ({
    value: month,
    label: dayjs(month).format('MMMM YYYY'),
  }))

  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={monthOptions.find((option) => option.value === selectedMonth)}
        onChange={(selectedOption) => {
          if (!selectedOption) return
          onMonthSelect(selectedOption.value)
        }}
        options={monthOptions}
        isSearchable={false}
      />
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
      {focusedBudget && (
        <BudgetInfoModal
          budget={focusedBudget}
          onClose={() => onFocus('')}
          onTransactionRemove={onTransactionRemove}
        />
      )}
    </>
  )
}
