import { FC } from 'react'

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
  DatetimeStep,
  SaveButton,
  currentStep,
  onCurrentStepChange,
}: {
  DatetimeStep: FC<DatetimeStepProps>
  SaveButton: FC<SaveButtonProps>
  currentStep: string
  onCurrentStepChange: (step: string) => void
}) {
  return (
    <>
      <DatetimeStep
        isExpanded={currentStep === datetimeStep}
        onExpand={() => onCurrentStepChange(datetimeStep)}
      />
      <SaveButton />
    </>
  )
}

export default FormLayout
