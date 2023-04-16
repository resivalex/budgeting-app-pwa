import React from 'react'
import DateTimePicker from 'react-datetime-picker'
import { AccountDetails } from './TransactionAggregator'
import { convertCurrencyCodeToSymbol } from './finance-utils'
import Select from 'react-select'

interface Props {
  type: 'income' | 'expense' | 'transfer'
  onTypeChange: (type: 'income' | 'expense' | 'transfer') => void
  amount: string
  onAmountChange: (amount: string) => void
  account: string
  currency: string
  category: string
  onCategoryChange: (category: string) => void
  payee: string
  onPayeeChange: (payee: string) => void
  payeeTransferAccount: string
  onPayeeTransferAccountChange: (payeeTransferAccount: string) => void
  comment: string
  onCommentChange: (comment: string) => void
  datetime: Date
  onAccountChange: (account: string) => void
  onDatetimeChange: (datetime: Date | null) => void
  onAdd: () => void
  accounts: AccountDetails[]
  categories: string[]
  currencies: string[]
  onCurrencyChange: (currency: string) => void
  isValid: boolean
}

function TransactionForm({
  type,
  onTypeChange,
  amount,
  onAmountChange,
  account,
  currency,
  category,
  onCategoryChange,
  payee,
  onPayeeChange,
  payeeTransferAccount,
  onPayeeTransferAccountChange,
  comment,
  onCommentChange,
  datetime,
  onAccountChange,
  onDatetimeChange,
  onAdd,
  accounts,
  categories,
  currencies,
  onCurrencyChange,
  isValid,
}: Props) {
  const categoryOptions = categories.map((c) => ({ value: c, label: c }))

  return (
    <div className="field p-2">
      <div className="field">
        <div className="label">Type</div>
        <div className="control">
          <select
            className="input"
            value={type}
            onChange={(e) => {
              const type = e.target.value as 'income' | 'expense' | 'transfer'
              onTypeChange(type)
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
      </div>
      <div className="field">
        <div className="label">Currency</div>
        <div className="control">
          <select
            className="input"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <div className="label">Amount</div>
        <div className="control">
          <input
            className="input"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="label">Account</div>
        <div className="control">
          <select
            className="input"
            value={account}
            onChange={(e) => onAccountChange(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.account} value={a.account}>
                {`[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      {type === 'transfer' ? (
        <div className="field">
          <div className="label">Transfer to account</div>
          <div className="control">
            <select
              className="input"
              value={payeeTransferAccount}
              onChange={(e) => onPayeeTransferAccountChange(e.target.value)}
            >
              {accounts.map((a) => (
                <option key={a.account} value={a.account}>
                  {`[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <>
          <div className="field">
            <div className="label">Category</div>
            <div className="control">
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={categoryOptions.find((option) => option.value === category)}
                onChange={(selectedOption) => {
                  if (!selectedOption) return
                  onCategoryChange(selectedOption.value)
                }}
                options={categoryOptions}
              />
            </div>
          </div>
          <div className="field">
            <div className="label">Payee</div>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Payee"
                value={payee}
                onChange={(e) => onPayeeChange(e.target.value)}
              />
            </div>
          </div>
        </>
      )}
      <div className="field">
        <div className="label">Comment</div>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Comment"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="label">Date & Time</div>
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
          <button className="button is-info" onClick={onAdd} disabled={!isValid}>
            {isValid ? 'Add' : 'Fill all required fields'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionForm
