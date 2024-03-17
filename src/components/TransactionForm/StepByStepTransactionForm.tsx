import { FC, useState, Ref } from 'react'
import { convertCurrencyCodeToSymbol } from '@/utils'
import { ColoredAccountDetailsDTO } from '@/types'
import {
  TypeStep as TypeFormInput,
  CurrencyStep as CurrencyFormInput,
  AmountStep as AmountFormInput,
  AccountStep as AccountFormInput,
  PayeeTransferAccountStep as PayeeTransferAccountFormInput,
  CategoryStep as CategoryFormInput,
  PayeeStep as PayeeFormInput,
  CommentStep as CommentFormInput,
  DatetimeStep as DatetimeFormInput,
} from './FormInputs'
import FormLayout, {
  AmountStepProps,
  CurrencyStepProps,
  TypeStepProps,
  AccountStepProps,
  CategoryStepProps,
  PayeeStepProps,
  PayeeTransferAccountStepProps,
  CommentStepProps,
  DatetimeStepProps,
  SaveButtonProps,
} from './StepByStepTransactionForm/FormLayout'

// Types
type TransactionType = 'income' | 'expense' | 'transfer'

interface SelectOption {
  value: string
  label: string
}

const typeStep = 'type'
const currencyStep = 'currency'
const amountStep = 'amount'
const accountStep = 'account'
const categoryStep = 'category'
const payeeStep = 'payee'
const payeeTransferAccountStep = 'payeeTransferAccount'
const commentStep = 'comment'
const datetimeStep = 'datetime'

function StepByStepTransactionForm({
  AccountSelect,
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
}: {
  // Functional components
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
    ref?: Ref<{ focus: () => void }>
  }>
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
  onSave: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)

  const currencyOptions = currencies.map((currency) => ({
    value: currency,
    label: currency,
  }))
  const accountOptions = accounts.map((a) => ({
    value: a.account,
    label: `[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`,
    color: a.color,
  }))

  function AmountStep({ isExpanded, onExpand, onComplete }: AmountStepProps) {
    return (
      <AmountFormInput
        amount={amount}
        onAmountChange={onAmountChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function CurrencyStep({
    alwaysShowOptionsIfEmpty,
    isExpanded,
    onExpand,
    onComplete,
  }: CurrencyStepProps) {
    return (
      <CurrencyFormInput
        value={currency}
        options={currencyOptions}
        onChange={onCurrencyChange}
        alwaysShowOptionsIfEmpty={alwaysShowOptionsIfEmpty}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function TypeStep({ alwaysShowOptionsIfEmpty, isExpanded, onExpand, onComplete }: TypeStepProps) {
    return (
      <TypeFormInput
        value={type}
        onChange={onTypeChange}
        alwaysShowOptionsIfEmpty={alwaysShowOptionsIfEmpty}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function AccountStep({ isExpanded, onExpand, onComplete }: AccountStepProps) {
    return (
      <AccountFormInput
        AccountSelect={AccountSelect}
        account={account}
        accountOptions={accountOptions}
        onAccountChange={onAccountChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function CategoryStep({ isExpanded, onExpand, onComplete }: CategoryStepProps) {
    return (
      <CategoryFormInput
        category={category}
        categoryOptions={categoryOptions}
        onCategoryChange={onCategoryChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function PayeeStep({ isExpanded, onExpand, onComplete }: PayeeStepProps) {
    return (
      <PayeeFormInput
        type={type}
        payee={payee}
        payees={payees}
        onPayeeChange={onPayeeChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function PayeeTransferAccountStep({
    isExpanded,
    onExpand,
    onComplete,
  }: PayeeTransferAccountStepProps) {
    return (
      <PayeeTransferAccountFormInput
        AccountSelect={AccountSelect}
        payeeTransferAccount={payeeTransferAccount}
        accountOptions={accountOptions}
        onPayeeTransferAccountChange={onPayeeTransferAccountChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function CommentStep({ isExpanded, onExpand, onComplete }: CommentStepProps) {
    return (
      <CommentFormInput
        comment={comment}
        comments={comments}
        isExpanded={isExpanded}
        onCommentChange={onCommentChange}
        onExpand={onExpand}
        onComplete={onComplete}
      />
    )
  }

  function DatetimeStep({ isExpanded, onExpand }: DatetimeStepProps) {
    return (
      <DatetimeFormInput
        datetime={datetime}
        onDatetimeChange={onDatetimeChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
      />
    )
  }

  function SaveButton({}: SaveButtonProps) {
    return (
      <div className="field">
        <div className="control">
          <button className="button is-info" onClick={handleSave} disabled={!isValid || isLoading}>
            {isValid ? 'Сохранить' : 'Заполните необходимые поля'}
            {isLoading && '...'}
          </button>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    await onSave()
    setIsLoading(false)
  }

  return (
    <div className="field p-2">
      <FormLayout
        type={type}
        AmountStep={AmountStep}
        CurrencyStep={CurrencyStep}
        TypeStep={TypeStep}
        AccountStep={AccountStep}
        CategoryStep={CategoryStep}
        PayeeStep={PayeeStep}
        PayeeTransferAccountStep={PayeeTransferAccountStep}
        CommentStep={CommentStep}
        DatetimeStep={DatetimeStep}
        SaveButton={SaveButton}
      />
    </div>
  )
}

export default StepByStepTransactionForm
