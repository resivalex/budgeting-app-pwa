import React from 'react'
import DateTimePicker from 'react-datetime-picker'
import { AccountDetails } from './TransactionAggregator'
import { convertCurrencyCodeToSymbol } from './finance-utils'
import Select from 'react-select'
import SuggestingInput from './SuggestingInput'

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
  payees: string[]
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
  payees,
}: Props) {
  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
    { value: 'transfer', label: 'Transfer' },
  ]
  const currencyOptions = currencies.map((c) => ({ value: c, label: c }))
  const accountOptions = accounts.map((a) => ({
    value: a.account,
    label: `[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`,
  }))
  const categoryOptions = categories.map((c) => ({ value: c, label: c }))

  return (
    <div className="field p-2">
      <div className="field">
        <div className="label">Type</div>
        <div className="control">
          <Select
            className="basic-single"
            classNamePrefix="select"
            value={typeOptions.find((option) => option.value === type)}
            onChange={(selectedOption) => {
              if (!selectedOption) return
              onTypeChange(selectedOption.value as 'income' | 'expense' | 'transfer')
            }}
            options={typeOptions}
            isSearchable={false}
          />
        </div>
      </div>
      <div className="field">
        <div className="label">Currency</div>
        <div className="control">
          <Select
            className="basic-single"
            classNamePrefix="select"
            value={currencyOptions.find((option) => option.value === currency)}
            onChange={(selectedOption) => {
              if (!selectedOption) return
              onCurrencyChange(selectedOption.value)
            }}
            options={currencyOptions}
            isSearchable={false}
          />
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
          <Select
            className="basic-single"
            classNamePrefix="select"
            value={accountOptions.find((option) => option.value === account)}
            onChange={(selectedOption) => {
              if (!selectedOption) return
              onAccountChange(selectedOption.value)
            }}
            options={accountOptions}
            isSearchable={false}
          />
        </div>
      </div>
      {type === 'transfer' ? (
        <div className="field">
          <div className="label">Transfer to account</div>
          <div className="control">
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={accountOptions.find((option) => option.value === payeeTransferAccount)}
              onChange={(selectedOption) => {
                if (!selectedOption) return
                onPayeeTransferAccountChange(selectedOption.value)
              }}
              options={accountOptions}
              isSearchable={false}
            />
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
              <SuggestingInput value={payee} suggestions={payees} onChange={(value) => {
                onPayeeChange(value)
              }} />
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
            {isValid ? 'Add' : 'Fill in all required fields'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionForm
