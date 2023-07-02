import { FC, useState } from 'react'
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
  AccountSelect: FC<{ value: string; onChange: (value: string) => void }>
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
}) {
  const [currentStep, setCurrentStep] = useState(amountStep)
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

  function renderTypeStep() {
    return (
      <TypeFormInput
        value={type}
        isExpanded={currentStep === typeStep}
        onChange={onTypeChange}
        onExpand={() => setCurrentStep(typeStep)}
      />
    )
  }

  function renderCurrencyStep() {
    return (
      <CurrencyFormInput
        value={currency}
        options={currencyOptions}
        isExpanded={currentStep === currencyStep}
        onChange={onCurrencyChange}
        onExpand={() => setCurrentStep(currencyStep)}
      />
    )
  }

  function renderAmountStep() {
    return (
      <AmountFormInput
        amount={amount}
        isExpanded={currentStep === amountStep}
        onAmountChange={onAmountChange}
        onExpand={() => setCurrentStep(amountStep)}
      />
    )
  }

  function renderAccountStep() {
    return (
      <AccountFormInput
        AccountSelect={AccountSelect}
        account={account}
        accountOptions={accountOptions}
        isExpanded={currentStep === accountStep}
        onAccountChange={onAccountChange}
        onExpand={() => setCurrentStep(accountStep)}
      />
    )
  }

  function renderCategoryStep() {
    return (
      <CategoryFormInput
        category={category}
        categoryOptions={categoryOptions}
        isExpanded={currentStep === categoryStep}
        onCategoryChange={onCategoryChange}
        onExpand={() => setCurrentStep(categoryStep)}
      />
    )
  }

  function renderPayeeStep() {
    return (
      <PayeeFormInput
        type={type}
        payee={payee}
        payees={payees}
        isExpanded={currentStep === payeeStep}
        onPayeeChange={onPayeeChange}
        onExpand={() => setCurrentStep(payeeStep)}
      />
    )
  }

  function renderPayeeTransferAccountStep() {
    return (
      <PayeeTransferAccountFormInput
        AccountSelect={AccountSelect}
        payeeTransferAccount={payeeTransferAccount}
        accountOptions={accountOptions}
        isExpanded={currentStep === payeeTransferAccountStep}
        onPayeeTransferAccountChange={onPayeeTransferAccountChange}
        onExpand={() => setCurrentStep(payeeTransferAccountStep)}
      />
    )
  }

  function renderCommentStep() {
    return (
      <CommentFormInput
        comment={comment}
        comments={comments}
        isExpanded={currentStep === commentStep}
        onCommentChange={onCommentChange}
        onExpand={() => setCurrentStep(commentStep)}
      />
    )
  }

  function renderDatetimeStep() {
    return (
      <DatetimeFormInput
        datetime={datetime}
        isExpanded={currentStep === datetimeStep}
        onDatetimeChange={onDatetimeChange}
        onExpand={() => setCurrentStep(datetimeStep)}
      />
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    await onSave()
    setIsLoading(false)
  }

  return (
    <div className="field p-2" style={{ backgroundColor: 'rgba(255, 0, 0, 0.05)' }}>
      {renderAmountStep()}
      {renderTypeStep()}
      {renderCurrencyStep()}
      {renderAccountStep()}
      {type === 'transfer' ? (
        renderPayeeTransferAccountStep()
      ) : (
        <>
          {renderCategoryStep()}
          {renderPayeeStep()}
        </>
      )}
      {renderCommentStep()}
      {renderDatetimeStep()}
      <div className="field">
        <div className="control">
          <button className="button is-info" onClick={handleSave} disabled={!isValid || isLoading}>
            {isValid ? 'Сохранить' : 'Заполните необходимые поля'}
            {isLoading && '...'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StepByStepTransactionForm
