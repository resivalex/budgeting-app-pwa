import React from 'react'
import classNames from 'classnames'
// @ts-ignore
import Measure from 'react-measure'
import { convertToLocaleTime } from './date-utils'

export class TransactionDTO {
  datetime!: string
  account!: string
  category!: string
  type!: 'income' | 'expense' | 'transfer'
  amount!: string
  currency!: string
  payee!: string
  comment!: string
}

export default function Transaction({
  t,
  onDimentionsChange,
}: {
  t: TransactionDTO
  onDimentionsChange: any
}) {
  return (
    // @ts-ignore
    <Measure
      bounds
      onResize={(contentRect: any) => {
        onDimentionsChange({
          width: contentRect.bounds?.width || 300,
          height: contentRect.bounds?.height || 100,
        })
      }}
    >
      {({ measureRef }: any) => {
        const datetimeString = convertToLocaleTime(t.datetime)

        return (
          <div ref={measureRef} className="box m-1">
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
                >
                  {t.type === 'expense' && '-'}
                  {t.type === 'income' && '+'}
                  {t.amount.replace('.00', '')} {t.currency}
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
