import { FC, useState, Ref, useCallback, useEffect } from 'react'
import { convertCurrencyCodeToSymbol } from '@/utils'
import { ColoredAccountDetailsDTO } from '@/types'
import {
  Type,
  Currency,
  Amount,
  Account,
  PayeeTransferAccount,
  Category,
  Payee,
  Comment,
  Datetime,
  SaveButton,
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
} from './StepByStepTransactionForm/FormLayout'

// Types
type TransactionType = 'income' | 'expense' | 'transfer'

interface SelectOption {
  value: string
  label: string
}

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
    useEffect(() => {
      console.log('AmountStep mounted')
    }, [])
    return (
      <Amount
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
      <Currency
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
      <Type
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
      <Account
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
      <Category
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
      <Payee
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
      <PayeeTransferAccount
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
      <Comment
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
      <Datetime
        datetime={datetime}
        onDatetimeChange={onDatetimeChange}
        isExpanded={isExpanded}
        onExpand={onExpand}
      />
    )
  }

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    await onSave()
    setIsLoading(false)
  }, [onSave])

  const MemoizedSaveButton = () => (
    <SaveButton isValid={isValid} isLoading={isLoading} onSave={handleSave} />
  )

  return (
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
      SaveButton={MemoizedSaveButton}
    />
  )
}

export default StepByStepTransactionForm
