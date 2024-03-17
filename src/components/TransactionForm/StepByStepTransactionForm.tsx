import { FC, useState, Ref, useMemo, useCallback } from 'react'
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
  SaveButton as SaveButtonFormInput,
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

  const currencyOptions = useMemo(
    () =>
      currencies.map((currency) => ({
        value: currency,
        label: currency,
      })),
    [currencies]
  )

  const accountOptions = useMemo(
    () =>
      accounts.map((a) => ({
        value: a.account,
        label: `[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`,
        color: a.color,
      })),
    [accounts]
  )

  const AmountStep = useMemo(
    () =>
      ({ isExpanded, onExpand, onComplete }: AmountStepProps) =>
        (
          <AmountFormInput
            amount={amount}
            onAmountChange={onAmountChange}
            isExpanded={isExpanded}
            onExpand={onExpand}
            onComplete={onComplete}
          />
        ),
    [amount, onAmountChange]
  )

  const CurrencyStep = useMemo(
    () =>
      ({ alwaysShowOptionsIfEmpty, isExpanded, onExpand, onComplete }: CurrencyStepProps) =>
        (
          <CurrencyFormInput
            value={currency}
            options={currencyOptions}
            onChange={onCurrencyChange}
            alwaysShowOptionsIfEmpty={alwaysShowOptionsIfEmpty}
            isExpanded={isExpanded}
            onExpand={onExpand}
            onComplete={onComplete}
          />
        ),
    [currency, currencyOptions, onCurrencyChange]
  )

  const TypeStep = useMemo(
    () =>
      ({ alwaysShowOptionsIfEmpty, isExpanded, onExpand, onComplete }: TypeStepProps) =>
        (
          <TypeFormInput
            value={type}
            onChange={onTypeChange}
            alwaysShowOptionsIfEmpty={alwaysShowOptionsIfEmpty}
            isExpanded={isExpanded}
            onExpand={onExpand}
            onComplete={onComplete}
          />
        ),
    [type, onTypeChange]
  )

  const AccountStep = useMemo(
    () =>
      ({ isExpanded, onExpand, onComplete }: AccountStepProps) =>
        (
          <AccountFormInput
            AccountSelect={AccountSelect}
            account={account}
            accountOptions={accountOptions}
            onAccountChange={onAccountChange}
            isExpanded={isExpanded}
            onExpand={onExpand}
            onComplete={onComplete}
          />
        ),
    [AccountSelect, account, accountOptions, onAccountChange]
  )

  const CategoryStep = useMemo(
    () =>
      ({ isExpanded, onExpand, onComplete }: CategoryStepProps) =>
        (
          <CategoryFormInput
            category={category}
            categoryOptions={categoryOptions}
            onCategoryChange={onCategoryChange}
            isExpanded={isExpanded}
            onExpand={onExpand}
            onComplete={onComplete}
          />
        ),
    [category, categoryOptions, onCategoryChange]
  )

  const PayeeStep = useMemo(
    () =>
      ({ isExpanded, onExpand, onComplete }: PayeeStepProps) =>
        (
          <PayeeFormInput
            type={type}
            payee={payee}
            payees={payees}
            onPayeeChange={onPayeeChange}
            isExpanded={isExpanded}
            onExpand={onExpand}
            onComplete={onComplete}
          />
        ),
    [type, payee, payees, onPayeeChange]
  )

  const PayeeTransferAccountStep = useMemo(
    () =>
      ({ isExpanded, onExpand, onComplete }: PayeeTransferAccountStepProps) =>
        (
          <PayeeTransferAccountFormInput
            AccountSelect={AccountSelect}
            payeeTransferAccount={payeeTransferAccount}
            accountOptions={accountOptions}
            onPayeeTransferAccountChange={onPayeeTransferAccountChange}
            isExpanded={isExpanded}
            onExpand={onExpand}
            onComplete={onComplete}
          />
        ),
    [AccountSelect, payeeTransferAccount, accountOptions, onPayeeTransferAccountChange]
  )

  const CommentStep = useMemo(
    () =>
      ({ isExpanded, onExpand, onComplete }: CommentStepProps) =>
        (
          <CommentFormInput
            comment={comment}
            comments={comments}
            isExpanded={isExpanded}
            onCommentChange={onCommentChange}
            onExpand={onExpand}
            onComplete={onComplete}
          />
        ),
    [comment, comments, onCommentChange]
  )

  const DatetimeStep = useMemo(
    () =>
      ({ isExpanded, onExpand }: DatetimeStepProps) =>
        (
          <DatetimeFormInput
            datetime={datetime}
            onDatetimeChange={onDatetimeChange}
            isExpanded={isExpanded}
            onExpand={onExpand}
          />
        ),
    [datetime, onDatetimeChange]
  )

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    await onSave()
    setIsLoading(false)
  }, [onSave])

  const SaveButton = useMemo(
    () => () => <SaveButtonFormInput isValid={isValid} isLoading={isLoading} onSave={handleSave} />,
    [isValid, isLoading, handleSave]
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
      SaveButton={SaveButton}
    />
  )
}

export default StepByStepTransactionForm
