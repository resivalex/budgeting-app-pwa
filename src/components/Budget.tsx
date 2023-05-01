import React from 'react'
import BudgetProgressBar from './BudgetProgressBar'
import { convertCurrencyCodeToSymbol, formatFinancialAmountRounded } from '../finance-utils'
import { LongPressDetectEvents, useLongPress } from 'use-long-press'

interface Props {
  name: string
  totalAmount: number
  spentAmount: number
  currency: string
  onLongPress: () => void
}

function outputAmountDifference(totalAmount: number, spentAmount: number, currency: string) {
  const currencySymbol = convertCurrencyCodeToSymbol(currency)

  function outputBeforeTotalAmount(
    totalAmount: number,
    spentAmount: number,
    currencySymbol: string
  ) {
    if (spentAmount > totalAmount) {
      return (
        <>
          Перерасход{' '}
          <span className="has-text-weight-bold">
            {formatFinancialAmountRounded(spentAmount - totalAmount)} {currencySymbol}
          </span>
        </>
      )
    }
    if (spentAmount < 0) {
      return (
        <>
          Доход{' '}
          <span className="has-text-weight-bold">
            {formatFinancialAmountRounded(-spentAmount)} {currencySymbol}
          </span>
        </>
      )
    }
    if (spentAmount <= totalAmount) {
      return (
        <>
          Осталось{' '}
          <span className="has-text-weight-bold">
            {formatFinancialAmountRounded(totalAmount - spentAmount)} {currencySymbol}
          </span>
        </>
      )
    }
  }

  return (
    <>
      {outputBeforeTotalAmount(totalAmount, spentAmount, currencySymbol)} /{' '}
      <span className="has-text-weight-bold">
        {formatFinancialAmountRounded(totalAmount)} {currencySymbol}
      </span>
    </>
  )
}

export default function Budget({ totalAmount, spentAmount, currency, name, onLongPress }: Props) {
  const longPressBind = useLongPress(onLongPress, {
    onFinish: onLongPress,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true,
    detect: LongPressDetectEvents.BOTH,
  })

  return (
    <div {...longPressBind()} className="box my-2 py-2">
      <div className="is-flex is-justify-content-space-between pb-1">
        <div className="has-text-weight-bold is-flex pr-1">{name}</div>
      </div>
      <BudgetProgressBar totalAmount={totalAmount} spentAmount={spentAmount} />
      <div className="is-flex pt-1 is-justify-content-right">
        <div>{outputAmountDifference(totalAmount, spentAmount, currency)}</div>
      </div>
    </div>
  )
}
