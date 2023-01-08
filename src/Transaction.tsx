import React from 'react'

class TransactionDTO {
  datetime!: string
  account!: string
  category!: string
  type!: 'income' | 'expense' | 'transfer'
  amount!: string
  currency!: string
  payee!: string
  comment!: string
}

export default function Transaction({ t }: { t: TransactionDTO }) {
  return (
    <div className="box m-1">
      <div className="is-flex is-justify-content-space-between">
        <div>
          <div className="has-text-weight-semibold">{t.category}</div>
          <div>{t.account}</div>
          <div className="is-size-7 has-text-weight-semibold">{t.payee}</div>
          <div className="is-size-7">{t.comment}</div>
        </div>
        <div className="has-text-right">
          <div className="is-size-5">
            {t.amount} {t.currency}
          </div>
          <div className="is-size-7">{t.datetime}</div>
        </div>
      </div>
    </div>
  )
}
