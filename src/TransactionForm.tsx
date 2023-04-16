import React from 'react'
import DateTimePicker from 'react-datetime-picker'
import { AccountDetails } from './TransactionAggregator'
import { convertCurrencyCodeToSymbol } from './finance-utils'
import Select from 'react-select'
import SuggestingInput from './SuggestingInput'
import { reactSelectSmallStyles } from './react-select-styles'

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
  comments: string[]
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
  comments,
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
        <div className="is-size-7">Type</div>
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
            styles={reactSelectSmallStyles}
          />
        </div>
      </div>
      <div className="field">
        <div className="is-size-7">Currency</div>
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
            styles={reactSelectSmallStyles}
          />
        </div>
      </div>
      <div className="field">
        <div className="is-size-7">Amount</div>
        <div className="control">
          <input
            className="input is-small"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="is-size-7">Account</div>
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
            styles={reactSelectSmallStyles}
          />
        </div>
      </div>
      {type === 'transfer' ? (
        <div className="field">
          <div className="is-size-7">Transfer to account</div>
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
              styles={reactSelectSmallStyles}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="field">
            <div className="is-size-7">Category</div>
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
                styles={reactSelectSmallStyles}
              />
            </div>
          </div>
          <div className="field">
            <div className="is-size-7">Payee</div>
            <div className="control">
              <SuggestingInput value={payee} suggestions={payees} onChange={onPayeeChange} />
            </div>
          </div>
        </>
      )}
      <div className="field">
        <div className="is-size-7">Comment</div>
        <div className="control">
          <SuggestingInput suggestions={comments} value={comment} onChange={onCommentChange} />
        </div>
      </div>
      <div className="field">
        <div className="is-size-7">Date & Time</div>
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
