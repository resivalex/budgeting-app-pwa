import { FC } from 'react'

export interface CategoryStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
}

export interface PayeeStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
}

export interface PayeeTransferAccountStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
}

export interface CommentStepProps {
  isExpanded: boolean
  onExpand: () => void
  onComplete: () => void
}

export interface DatetimeStepProps {
  isExpanded: boolean
  onExpand: () => void
}

export interface SaveButtonProps {}

const typeStep = 'type'
const currencyStep = 'currency'
const amountStep = 'amount'
const accountStep = 'account'
const categoryStep = 'category'
const payeeStep = 'payee'
const payeeTransferAccountStep = 'payeeTransferAccount'
const commentStep = 'comment'
const datetimeStep = 'datetime'

function FormLayout({
  CategoryStep,
  PayeeStep,
  PayeeTransferAccountStep,
  CommentStep,
  DatetimeStep,
  SaveButton,
  type,
  currentStep,
  onCurrentStepChange,
}: {
  CategoryStep: FC<CategoryStepProps>
  PayeeStep: FC<PayeeStepProps>
  PayeeTransferAccountStep: FC<PayeeTransferAccountStepProps>
  CommentStep: FC<CommentStepProps>
  DatetimeStep: FC<DatetimeStepProps>
  SaveButton: FC<SaveButtonProps>
  type: 'expense' | 'income' | 'transfer' | ''
  currentStep: string
  onCurrentStepChange: (step: string) => void
}) {
  return (
    <>
      {type === 'transfer' ? (
        <PayeeTransferAccountStep
          isExpanded={currentStep === payeeTransferAccountStep}
          onExpand={() => onCurrentStepChange(payeeTransferAccountStep)}
          onComplete={() => {
            const nextStep = type === 'transfer' ? '' : commentStep
            onCurrentStepChange(nextStep)
          }}
        />
      ) : (
        <>
          <CategoryStep
            isExpanded={currentStep === categoryStep}
            onExpand={() => onCurrentStepChange(categoryStep)}
            onComplete={() => onCurrentStepChange(payeeStep)}
          />
          <PayeeStep
            isExpanded={currentStep === payeeStep}
            onExpand={() => onCurrentStepChange(payeeStep)}
            onComplete={() => onCurrentStepChange(commentStep)}
          />
        </>
      )}
      <CommentStep
        isExpanded={currentStep === commentStep}
        onExpand={() => onCurrentStepChange(commentStep)}
        onComplete={() => onCurrentStepChange(datetimeStep)}
      />
      <DatetimeStep
        isExpanded={currentStep === datetimeStep}
        onExpand={() => onCurrentStepChange(datetimeStep)}
      />
      <SaveButton />
    </>
  )
}

export default FormLayout
