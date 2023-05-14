import React from 'react'
import Budget from './Budget'
import BudgetInfoModal from './BudgetInfoModal'
import Select from 'react-select'
import dayjs from 'dayjs'
import { BudgetDTO } from '@/types'

interface Props {
  budgets: BudgetDTO[]
  selectedMonth: string
  availableMonths: string[]
  onMonthSelect: (month: string) => void
  onFocus: (name: string) => void
  focusedBudget: BudgetDTO | null
  commonBudgetsExpectationRatio: number | null
  onTransactionRemove: (id: string) => void
}

export default function Budgets({
  budgets,
  selectedMonth,
  availableMonths,
  onMonthSelect,
  onFocus,
  focusedBudget,
  commonBudgetsExpectationRatio,
  onTransactionRemove,
}: Props) {
  const monthOptions = availableMonths.map((month) => ({
    value: month,
    label: dayjs(month).format('MMMM YYYY'),
  }))

  return (
    <>
      <div className="px-2 pb-1">
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
      </div>
      <div className="box py-0 px-2" style={{ flex: 1, overflow: 'scroll' }}>
        {budgets.map((budget, index) => (
          <Budget
            key={index}
            totalAmount={budget.amount}
            spentAmount={budget.spentAmount}
            currency={budget.currency}
            name={budget.name}
            color={budget.color}
            commonBudgetsExpectationRatio={commonBudgetsExpectationRatio}
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
