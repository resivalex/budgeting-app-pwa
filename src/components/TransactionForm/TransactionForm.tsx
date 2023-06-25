import { convertCurrencyCodeToSymbol, reactSelectColorStyles } from '@/utils'
import { ColoredAccountDetailsDTO } from '@/types'
import {
  Type as TypeFormInput,
  Currency as CurrencyFormInput,
  Amount as AmountFormInput,
  Account as AccountFormInput,
  PayeeTransferAccount as PayeeTransferAccountFormInput,
  Category as CategoryFormInput,
  Payee as PayeeFormInput,
  Comment as CommentFormInput,
  Datetime as DatetimeFormInput,
} from './FormInputs'
import Select from 'react-select'

// Types
type TransactionType = 'income' | 'expense' | 'transfer'

interface SelectOption {
  value: string
  label: string
}

interface Props {
  // Basic transaction details
  type: TransactionType | ''
  currency: string
  amount: string
  account: string
  category: string
  payee: string
  payeeTransferAccount: string
  comment: string
  datetime: Date

  // Options for dropdown/select inputs
  accounts: ColoredAccountDetailsDTO[]
  categoryOptions: SelectOption[]
  currencies: string[]
  payees: string[]
  comments: string[]

  // Event handlers
  onTypeChange: (type: TransactionType) => void
  onCurrencyChange: (currency: string) => void
  onAmountChange: (amount: string) => void
  onAccountChange: (account: string) => void
  onCategoryChange: (category: string) => void
  onPayeeChange: (payee: string) => void
  onPayeeTransferAccountChange: (payeeTransferAccount: string) => void
  onCommentChange: (comment: string) => void
  onDatetimeChange: (datetime: Date | null) => void

  // Save event
  isValid: boolean
  onSave: () => void
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
  onSave,
  accounts,
  categoryOptions,
  currencies,
  onCurrencyChange,
  isValid,
  payees,
  comments,
}: Props) {
  const typeOptions = [
    { value: 'expense', label: 'Расход' },
    { value: 'income', label: 'Доход' },
    { value: 'transfer', label: 'Перевод' },
  ]
  const currencyOptions = currencies.map((c) => ({ value: c, label: c }))
  const accountOptions = accounts.map((a) => ({
    value: a.account,
    label: `[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`,
    color: a.color,
  }))

  function AccountSelect({
    value,
    onChange,
  }: {
    value: string
    onChange: (value: string) => void
  }) {
    return (
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={accountOptions.find((option) => option.value === value) || null}
        onChange={(selectedOption) => {
          if (!selectedOption) return
          onChange(selectedOption.value)
        }}
        options={accountOptions}
        isSearchable={false}
        placeholder="Выберите из списка..."
        styles={reactSelectColorStyles}
      />
    )
  }

  return (
    <div className="field p-2">
      <AmountFormInput amount={amount} onAmountChange={onAmountChange} />
      <TypeFormInput type={type} onTypeChange={onTypeChange} typeOptions={typeOptions} />
      <CurrencyFormInput
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        currencyOptions={currencyOptions}
      />
      <AccountFormInput
        AccountSelect={AccountSelect}
        account={account}
        onAccountChange={onAccountChange}
      />
      {type === 'transfer' ? (
        <PayeeTransferAccountFormInput
          AccountSelect={AccountSelect}
          payeeTransferAccount={payeeTransferAccount}
          onPayeeTransferAccountChange={onPayeeTransferAccountChange}
        />
      ) : (
        <>
          <CategoryFormInput
            category={category}
            onCategoryChange={onCategoryChange}
            categoryOptions={categoryOptions}
          />
          <PayeeFormInput payee={payee} onPayeeChange={onPayeeChange} payees={payees} type={type} />
        </>
      )}
      <CommentFormInput comment={comment} onCommentChange={onCommentChange} comments={comments} />
      <DatetimeFormInput datetime={datetime} onDatetimeChange={onDatetimeChange} />
      <div className="field">
        <div className="control">
          <button className="button is-info" onClick={onSave} disabled={!isValid}>
            {isValid ? 'Сохранить' : 'Заполните необходимые поля'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionForm
