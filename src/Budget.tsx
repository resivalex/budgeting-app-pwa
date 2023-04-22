import React from 'react'
import BudgetProgressBar from './BudgetProgressBar'
import { convertCurrencyCodeToSymbol, formatFinancialAmountRounded } from './finance-utils'
import { LongPressDetectEvents, useLongPress } from 'use-long-press'

interface Props {
  name: string
  totalAmount: number
  spentAmount: number
  currency: string
  onLongPress: () => void
}

export default function Budget({ totalAmount, spentAmount, currency, name, onLongPress }: Props) {
  const isOverSpent = spentAmount > totalAmount
  const diffAmount = Math.abs(totalAmount - spentAmount)
  const currencySymbol = convertCurrencyCodeToSymbol(currency)

  const longPressBind = useLongPress(onLongPress, {
    onFinish: onLongPress,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true,
    detect: LongPressDetectEvents.BOTH,
  })

  return (
    <div {...longPressBind()} className="box">
      <div className="is-flex is-justify-content-space-between pb-1">
        <div className="has-text-weight-bold is-flex pr-1">{name}</div>
      </div>
      <BudgetProgressBar totalAmount={totalAmount} spentAmount={spentAmount} />
      <div className="is-flex pt-1 is-justify-content-right">
        <div>
          {isOverSpent ? 'Перерасход' : 'Осталось'}{' '}
          <span className="has-text-weight-bold">
            {formatFinancialAmountRounded(diffAmount)} {currencySymbol}
          </span>{' '}
          /{' '}
          <span className="has-text-weight-bold">
            {formatFinancialAmountRounded(totalAmount)} {currencySymbol}
          </span>
        </div>
      </div>
    </div>
  )
}