import { useEffect, FC, Ref, useRef } from 'react'
import styled from 'styled-components'

const SelectContainer = styled.div<{ isExpanded: boolean }>`
  font-size: ${(props) => (props.isExpanded ? '1rem' : '0.8rem')};
`

const AccountLabel = styled.div<{ isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.isExpanded ? 'black' : 'gray')};
`

const SelectedOption = styled.div<{ color?: string }>`
  font-size: 1.2rem;
  background: ${(props) => props.color};
  padding: 2px 5px;
`

export default function PayeeTransferAccount({
  AccountSelect,
  payeeTransferAccount,
  isExpanded,
  onPayeeTransferAccountChange,
  onExpand,
  onComplete,
  accountOptions,
}: {
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
    ref?: Ref<{ focus: () => void }>
  }>
  payeeTransferAccount: string
  isExpanded: boolean
  onPayeeTransferAccountChange: (payeeTransferAccount: string) => void
  onComplete: () => void
  onExpand: () => void
  accountOptions: { value: string; label: string; color: string }[]
}) {
  const accountSelectRef = useRef<{ focus: () => void }>(null)

  const selectedOption = accountOptions.find((option) => option.value === payeeTransferAccount)

  const handlePayeeTransferAccountChange = (value: string) => {
    onPayeeTransferAccountChange(value)
    onComplete()
  }

  useEffect(() => {
    if (isExpanded && accountSelectRef.current) {
      accountSelectRef.current.focus()
    }
  }, [isExpanded])

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        {!selectedOption && (
          <AccountLabel className="is-size-7" isExpanded={isExpanded}>
            Перевод на счёт
          </AccountLabel>
        )}
        <SelectedOption color={selectedOption?.color}>
          {selectedOption ? selectedOption.label : '(пусто)'}
        </SelectedOption>
      </div>
    )
  }

  return (
    <div className="field">
      <AccountLabel className="is-size-7" isExpanded={isExpanded}>
        Перевод на счёт
      </AccountLabel>
      <SelectContainer className="control" isExpanded={isExpanded}>
        <AccountSelect
          value={payeeTransferAccount}
          onChange={handlePayeeTransferAccountChange}
          ref={accountSelectRef}
        />
      </SelectContainer>
    </div>
  )
}
