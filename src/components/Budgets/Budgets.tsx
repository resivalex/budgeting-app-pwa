import React from 'react'
import Budget from './Budget'
import BudgetInfoModal from './BudgetInfoModal'
import Select from 'react-select'
import dayjs from 'dayjs'
import { BudgetDTO } from './BudgetDTO'

interface Props {
  budgets: BudgetDTO[]
  selectedMonth: string
  availableMonths: string[]
  onMonthSelect: (month: string) => void
  onBudgetItemChange: (name: string, currency: string, amount: number) => void
  onFocus: (name: string) => void
  focusedBudget: BudgetDTO | null
  commonBudgetsExpectationRatio: number | null
  onTransactionRemove: (id: string) => Promise<void>
}

export default function Budgets({
  budgets,
  selectedMonth,
  availableMonths,
  onMonthSelect,
  onBudgetItemChange,
  onFocus,
  focusedBudget,
  commonBudgetsExpectationRatio,
  onTransactionRemove,
}: Props) {
  const monthOptions = availableMonths.map((month) => ({
    value: month,
    label: dayjs(month).format('MMMM YYYY'),
  }))
  monthOptions.reverse()

  return (
    <>
      <div className="px-2 pb-1">
        {/* @ts-ignore */}
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={monthOptions.find((option) => option.value === selectedMonth)}
          // @ts-ignore
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
          onBudgetChange={(amount: number) =>
            onBudgetItemChange(focusedBudget.name, focusedBudget.currency, amount)
          }
        />
      )}
    </>
  )
}
