import React from 'react'
import classNames from 'classnames'
// @ts-ignore
import Measure from 'react-measure'
import { convertToLocaleTime } from '../utils/date-utils'
import { useLongPress, LongPressDetectEvents } from 'use-long-press'
import { convertCurrencyCodeToSymbol, formatFinancialAmount } from '../utils/finance-utils'
import dayjs from 'dayjs'
import ruLocale from 'dayjs/locale/ru'

dayjs.locale(ruLocale)

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
  hasDateHeader?: boolean
  onDimensionsChange: any
  onLongPress: () => void
}

export default function Transaction({ t, hasDateHeader, onDimensionsChange, onLongPress }: Props) {
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
        const currentDate = dayjs(datetimeString)

        const formattedDate = currentDate.format('D MMMM YYYY, dddd')
        return (
          <div ref={measureRef}>
            {hasDateHeader && (
              <div className="has-text-weight-semibold py-1 px-3" style={{ background: '#f3f3f3' }}>
                {formattedDate}
              </div>
            )}
            <div {...longPressBind()} className="box m-0 is-flex">
              <div className="is-flex is-justify-content-space-between is-flex-grow-1">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }}
    </Measure>
  )
}
