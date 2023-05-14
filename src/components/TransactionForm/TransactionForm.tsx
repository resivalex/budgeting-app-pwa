import { convertCurrencyCodeToSymbol } from '@/utils'
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
  onSave: () => void
  accounts: ColoredAccountDetailsDTO[]
  categories: string[]
  currencies: string[]
  onCurrencyChange: (currency: string) => void
  isValid: boolean
  payees: string[]
  comments: string[]
}

function StepByStepTransactionForm({
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
  categories,
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
  const categoryOptions = categories.map((c) => ({ value: c, label: c }))

  return (
    <div className="field p-2">
      <TypeFormInput type={type} onTypeChange={onTypeChange} typeOptions={typeOptions} />
      <CurrencyFormInput
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        currencyOptions={currencyOptions}
      />
      <AmountFormInput amount={amount} onAmountChange={onAmountChange} />
      <AccountFormInput
        account={account}
        onAccountChange={onAccountChange}
        accountOptions={accountOptions}
      />
      {type === 'transfer' ? (
        <PayeeTransferAccountFormInput
          payeeTransferAccount={payeeTransferAccount}
          onPayeeTransferAccountChange={onPayeeTransferAccountChange}
          accountOptions={accountOptions}
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

export default StepByStepTransactionForm
