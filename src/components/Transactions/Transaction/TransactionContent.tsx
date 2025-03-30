import React, { useState } from 'react'
import classNames from 'classnames'
import { convertCurrencyCodeToSymbol, formatFinancialAmount } from '@/utils'
import dayjs from 'dayjs'
import ruLocale from 'dayjs/locale/ru'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'

dayjs.locale(ruLocale)

interface Props {
  category: string
  account: string
  payee: string
  comment: string
  type: string
  amount: string
  currency: string
  localTime: string
}

export default function TransactionContent({
  category,
  account,
  payee,
  comment,
  type,
  amount,
  currency,
  localTime,
}: Props) {
  const [showTime, setShowTime] = useState(false)

  const toggleShowTime = () => {
    setShowTime(!showTime)
  }

  return (
    <div className="is-flex is-justify-content-space-between is-flex-grow-1">
      <div>
        <div className="has-text-weight-semibold">{category}</div>
        {type === 'transfer' ? (
          <div className="has-text-weight-semibold">{/* @ts-ignore */}
            {account} <FontAwesomeIcon icon={faArrowRightLong} /> {payee}
          </div>
        ) : (
          <>
            <div>{account}</div>
            <div className="is-size-7 has-text-weight-semibold">{payee}</div>
          </>
        )}
        <div className="is-size-7">{comment}</div>
      </div>
      <div className="has-text-right">
        <div
          className={classNames('is-size-5', {
            'has-text-success': type === 'income',
            'has-text-danger': type === 'expense',
          })}
          style={{ whiteSpace: 'nowrap' }}
          onClick={toggleShowTime}
        >
          {type === 'expense' && '-'}
          {type === 'income' && '+'}
          {formatFinancialAmount(parseFloat(amount))} {convertCurrencyCodeToSymbol(currency)}
        </div>
        {showTime && (
          <div className="is-size-7">
            <div className="has-text-grey">{localTime}</div>
          </div>
        )}
      </div>
    </div>
  )
}
