import { useState } from 'react'
import { convertCurrencyCodeToSymbol } from '@/utils'
import { ColoredAccountDetailsDTO } from '@/types'
import {
  TypeStep as TypeFormInput,
  CurrencyStep as CurrencyFormInput,
  AmountStep as AmountFormInput,
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

const typeStep = 'type'
const currencyStep = 'currency'
const amountStep = 'amount'
const accountStep = 'account'
const categoryStep = 'category'
const payeeStep = 'payee'
const payeeTransferAccountStep = 'payeeTransferAccount'
const commentStep = 'comment'
const datetimeStep = 'datetime'
const stepNames = [
  typeStep,
  currencyStep,
  amountStep,
  accountStep,
  categoryStep,
  payeeStep,
  payeeTransferAccountStep,
  commentStep,
  datetimeStep,
]

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
  const [currentStep, setCurrentStep] = useState(typeStep)

  const currencyOptions = currencies.map((currency) => ({
    value: currency,
    label: currency,
  }))
  const accountOptions = accounts.map((a) => ({
    value: a.account,
    label: `[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`,
    color: a.color,
  }))
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
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
    if (currentStep !== accountStep) {
      return <div onClick={() => setCurrentStep(accountStep)}>Account: {account}</div>
    }

    return (
      <AccountFormInput
        account={account}
        onAccountChange={onAccountChange}
        accountOptions={accountOptions}
      />
    )
  }

  function renderCategoryStep() {
    if (currentStep !== categoryStep) {
      return <div onClick={() => setCurrentStep(categoryStep)}>Category: {category}</div>
    }

    return (
      <CategoryFormInput
        category={category}
        onCategoryChange={onCategoryChange}
        categoryOptions={categoryOptions}
      />
    )
  }

  function renderPayeeStep() {
    if (currentStep !== payeeStep) {
      return <div onClick={() => setCurrentStep(payeeStep)}>Payee: {payee}</div>
    }

    return (
      <PayeeFormInput payee={payee} onPayeeChange={onPayeeChange} payees={payees} type={type} />
    )
  }

  function renderPayeeTransferAccountStep() {
    if (currentStep !== payeeTransferAccountStep) {
      return (
        <div onClick={() => setCurrentStep(payeeTransferAccountStep)}>
          Payee Transfer Account: {payeeTransferAccount}
        </div>
      )
    }

    return (
      <PayeeTransferAccountFormInput
        payeeTransferAccount={payeeTransferAccount}
        onPayeeTransferAccountChange={onPayeeTransferAccountChange}
        accountOptions={accountOptions}
      />
    )
  }

  function renderCommentStep() {
    if (currentStep !== commentStep) {
      return <div onClick={() => setCurrentStep(commentStep)}>Comment: {comment}</div>
    }

    return (
      <CommentFormInput comment={comment} onCommentChange={onCommentChange} comments={comments} />
    )
  }

  function renderDatetimeStep() {
    if (currentStep !== datetimeStep) {
      return (
        <div onClick={() => setCurrentStep(datetimeStep)}>Datetime: {datetime.toISOString()}</div>
      )
    }

    return <DatetimeFormInput datetime={datetime} onDatetimeChange={onDatetimeChange} />
  }

  return (
    <div className="field p-2" style={{ backgroundColor: 'rgba(255, 0, 0, 0.05)' }}>
      {renderTypeStep()}
      {renderCurrencyStep()}
      {renderAmountStep()}
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
          <button className="button is-info" onClick={onSave} disabled={!isValid}>
            {isValid ? 'Сохранить' : 'Заполните необходимые поля'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StepByStepTransactionForm
