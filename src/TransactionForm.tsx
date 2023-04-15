import React from 'react'
import DateTimePicker from 'react-datetime-picker'
import { AccountDetails } from './TransactionAggregator'
import { convertCurrencyCodeToSymbol } from './finance-utils'

type Props = {
  type: 'income' | 'expense'
  setType: (type: 'income' | 'expense') => void
  amount: string
  setAmount: (amount: string) => void
  account: string
  currency: string
  category: string
  setCategory: (category: string) => void
  payee: string
  setPayee: (payee: string) => void
  comment: string
  setComment: (comment: string) => void
  datetime: Date
  onAccountChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onDatetimeChange: (value: Date | null) => void
  onAdd: () => void
  accounts: AccountDetails[]
  categories: string[]
}

function TransactionForm({
  type,
  setType,
  amount,
  setAmount,
  account,
  currency,
  category,
  setCategory,
  payee,
  setPayee,
  comment,
  setComment,
  datetime,
  onAccountChange,
  onDatetimeChange,
  onAdd,
  accounts,
  categories,
}: Props) {
  return (
    <div className="field p-2">
      <div className="field">
        <div className="control">
          <select
            className="input"
            value={type}
            onChange={(e) => {
              const type = e.target.value as 'income' | 'expense'
              setType(type)
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {convertCurrencyCodeToSymbol(currency)}
        </div>
      </div>
      <div className="field">
        <div className="control">
          <select className="input" value={account} onChange={onAccountChange}>
            <option value="">Select Account</option>
            {accounts.map((a) => (
              <option key={a.account} value={a.account}>
                {`[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Payee"
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <DateTimePicker
            onChange={onDatetimeChange}
            value={datetime}
            format="y-MM-dd HH:mm:ss"
            disableClock
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button className="button is-info" onClick={onAdd}>
            ADD
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionForm
