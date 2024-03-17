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

  function renderAmountAndCurrencySteps(compact: boolean) {
    return compact ? (
      <div className="field is-flex is-flex-direction-row">
        <div>
          <CurrencyFormInput
            value={currency}
            options={currencyOptions}
            isExpanded={currentStep === currencyStep}
            onChange={onCurrencyChange}
            onExpand={() => setCurrentStep(currencyStep)}
            onComplete={() => setCurrentStep(typeStep)}
            alwaysShowOptionsIfEmpty
          />
        </div>
        <div className="is-flex-grow-1">
          <AmountFormInput
            amount={amount}
            isExpanded={currentStep === amountStep}
            onAmountChange={onAmountChange}
            onExpand={() => setCurrentStep(amountStep)}
            onComplete={() => setCurrentStep(currencyStep)}
          />
        </div>
      </div>
    ) : (
      <>
        <AmountFormInput
          amount={amount}
          isExpanded={currentStep === amountStep}
          onAmountChange={onAmountChange}
          onExpand={() => setCurrentStep(amountStep)}
          onComplete={() => setCurrentStep(currencyStep)}
        />
        <CurrencyFormInput
          value={currency}
          options={currencyOptions}
          isExpanded={currentStep === currencyStep}
          onChange={onCurrencyChange}
          onExpand={() => setCurrentStep(currencyStep)}
          onComplete={() => setCurrentStep(typeStep)}
          alwaysShowOptionsIfEmpty
        />
      </>
    )
  }

  function renderTypeStep() {
    return (
      <TypeFormInput
        value={type}
        isExpanded={currentStep === typeStep}
        alwaysShowOptionsIfEmpty={true}
        onChange={onTypeChange}
        onExpand={() => setCurrentStep(typeStep)}
        onComplete={() => setCurrentStep(accountStep)}
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
        onComplete={() =>
          setCurrentStep(type === 'transfer' ? payeeTransferAccountStep : categoryStep)
        }
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
        onComplete={() => setCurrentStep(payeeStep)}
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
        onComplete={() => setCurrentStep(commentStep)}
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
        onComplete={() => {
          const nextStep = type === 'transfer' ? '' : commentStep
          setCurrentStep(nextStep)
        }}
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

  const combineAmountAndCurrency = currentStep !== amountStep && currentStep !== currencyStep

  return (
    <div className="field p-2">
      {renderAmountAndCurrencySteps(combineAmountAndCurrency)}
      {renderTypeStep()}
      {renderAccountStep()}
      {type === 'transfer' ? (
        renderPayeeTransferAccountStep()
      ) : (
        <>
          {renderCategoryStep()}
          {renderPayeeStep()}
        </>
      )}
      <FormLayout
        CommentStep={CommentStep}
        DatetimeStep={DatetimeStep}
        SaveButton={SaveButton}
        currentStep={currentStep}
        onCurrentStepChange={setCurrentStep}
      />
    </div>
  )
}

export default StepByStepTransactionForm
