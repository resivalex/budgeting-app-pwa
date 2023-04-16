import React from 'react'
import classNames from 'classnames'
// @ts-ignore
import Measure from 'react-measure'
import { convertToLocaleTime } from './date-utils'
import { useLongPress, LongPressDetectEvents } from 'use-long-press'
import { convertCurrencyCodeToSymbol, formatFinancialAmount } from './finance-utils'

export interface TransactionDTO {
  _id: string
  datetime: string
  account: string
  category: string
  type: 'income' | 'expense' | 'transfer'
  amount: string
  currency: string
  payee: string
  comment: string
}

interface Props {
  t: TransactionDTO
  onDimensionsChange: any
  onLongPress: () => void
}

export default function Transaction({ t, onDimensionsChange, onLongPress }: Props) {
  const longPressBind = useLongPress(onLongPress, {
    onFinish: onLongPress,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: true,
    detect: LongPressDetectEvents.BOTH,
  })

  return (
    // @ts-ignore
    <Measure
      bounds
      onResize={(contentRect: any) => {
        onDimensionsChange({
          width: contentRect.bounds?.width || 300,
          height: contentRect.bounds?.height || 100,
        })
      }}
    >
      {({ measureRef }: any) => {
        const datetimeString = convertToLocaleTime(t.datetime)

        return (
          <div {...longPressBind()} ref={measureRef} className="box m-1">
            <div className="is-flex is-justify-content-space-between">
              <div>
                <div className="has-text-weight-semibold">{t.category}</div>
                <div>{t.account}</div>
                <div className="is-size-7 has-text-weight-semibold">{t.payee}</div>
                <div className="is-size-7">{t.comment}</div>
              </div>
              <div className="has-text-right">
                <div
                  className={classNames('is-size-5', {
                    'has-text-success': t.type === 'income',
                    'has-text-danger': t.type === 'expense',
                  })}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {t.type === 'expense' && '-'}
                  {t.type === 'income' && '+'}
                  {formatFinancialAmount(parseFloat(t.amount))}{' '}
                  {convertCurrencyCodeToSymbol(t.currency)}
                </div>
                <div className="is-size-7">
                  <div className="has-text-grey">{datetimeString.split(' ')[1]}</div>
                  <div className="has-text-weight-semibold">{datetimeString.split(' ')[0]}</div>
                </div>
              </div>
            </div>
          </div>
        )
      }}
    </Measure>
  )
}
