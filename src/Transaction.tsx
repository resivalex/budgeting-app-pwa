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
    <div className="box">
      <div>
        <div>
          <div>{t.account}</div>
          <div>{t.category}</div>
        </div>
        <div>
          {t.amount}
        </div>
      </div>
      <div>
        <div>
          {t.payee && <div>{t.payee}</div>}
          {t.comment && <div>{t.comment}</div>}
        </div>
        <div>{t.datetime}</div>
      </div>
    </div>
  )
}
