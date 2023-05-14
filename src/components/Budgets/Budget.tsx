import React from 'react'
import BudgetProgressBar from './BudgetProgressBar'
import { convertCurrencyCodeToSymbol, formatFinancialAmountRounded } from '@/utils'
import { LongPressDetectEvents, useLongPress } from 'use-long-press'

interface Props {
  name: string
  color: string
  totalAmount: number
  spentAmount: number
  currency: string
  commonBudgetsExpectationRatio: number | null
  onLongPress: () => void
}

function outputAmountDifference(
  totalAmount: number,
  spentAmount: number,
  currency: string,
  currencySymbol: string
) {
  if (spentAmount > totalAmount) {
    return (
      <>
        <span style={{ color: '#8f2626' }}>
          -{formatFinancialAmountRounded(spentAmount - totalAmount)} {currencySymbol}
        </span>
      </>
    )
  }
  if (spentAmount < 0) {
    return (
      <>
        <span style={{ color: '#23672e' }}>
          +{formatFinancialAmountRounded(-spentAmount)} {currencySymbol}
        </span>
      </>
    )
  }
  if (spentAmount <= totalAmount) {
    return (
      <>
        <span>
          {formatFinancialAmountRounded(totalAmount - spentAmount)} {currencySymbol}
        </span>
      </>
    )
  }
}

export default function Budget({
  totalAmount,
  spentAmount,
  currency,
  name,
  color,
  commonBudgetsExpectationRatio,
  onLongPress,
}: Props) {
  const longPressBind = useLongPress(onLongPress, {
    onFinish: onLongPress,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true,
    detect: LongPressDetectEvents.BOTH,
  })
  const currencySymbol = convertCurrencyCodeToSymbol(currency)

  return (
    <div {...longPressBind()} className="box my-2 py-0 pr-2 pl-0">
      <div className="is-flex is-align-content-stretch">
        <div
          className="marker is-align-self-stretch mr-1"
          style={{ backgroundColor: color, width: 5, borderBottomLeftRadius: 5 }}
        ></div>
        <div className="is-flex-grow-1 py-2 px-1">
          <div className="is-flex is-justify-content-space-between pb-1">
            <div className="is-flex pr-1">{name}</div>
            <div className="is-flex pl-1" style={{ color: '#c7c7c7' }}>
              {formatFinancialAmountRounded(totalAmount)} {currencySymbol}
            </div>
          </div>
          <BudgetProgressBar
            totalAmount={totalAmount}
            spentAmount={spentAmount}
            externalRatio={commonBudgetsExpectationRatio}
          />
          <div className="is-flex is-justify-content-space-between pt-1">
            <div className="is-flex pr-1">
              {formatFinancialAmountRounded(spentAmount)} {currencySymbol}
            </div>
            <div className="is-flex pl-1">
              {outputAmountDifference(totalAmount, spentAmount, currency, currencySymbol)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
