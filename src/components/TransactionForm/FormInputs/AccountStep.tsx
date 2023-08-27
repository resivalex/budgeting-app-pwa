import styled from 'styled-components'
import { FC } from 'react'

const SelectContainer = styled.div<{ isExpanded: boolean }>`
  font-size: ${(props) => (props.isExpanded ? '1rem' : '0.8rem')};
`

const AccountLabel = styled.div<{ isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.isExpanded ? 'black' : 'gray')};
`

const SelectedOption = styled.div<{ color?: string }>`
  font-size: 0.8rem;
  background: ${(props) => props.color};
  padding: 2px 5px;
`

export default function AccountStep({
  AccountSelect,
  account,
  isExpanded,
  onAccountChange,
  onExpand,
  onComplete,
  accountOptions,
}: {
  AccountSelect: FC<{ value: string; onChange: (value: string) => void }>
  account: string
  isExpanded: boolean
  onAccountChange: (account: string) => void
  onComplete: () => void
  onExpand: () => void
  accountOptions: { value: string; label: string; color: string }[]
}) {
  const selectedOption = accountOptions.find((option) => option.value === account)

  const handleAccountChange = (value: string) => {
    onAccountChange(value)
    onComplete()
  }

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <AccountLabel className="is-size-7" isExpanded={isExpanded}>
          Счёт
        </AccountLabel>
        <SelectedOption color={selectedOption?.color}>
          {selectedOption ? selectedOption.label : 'Select'}
        </SelectedOption>
      </div>
    )
  }

  return (
    <div className="field">
      <AccountLabel className="is-size-7" isExpanded={isExpanded}>
        Счёт
      </AccountLabel>
      <SelectContainer className="control" isExpanded={isExpanded}>
        <AccountSelect value={account} onChange={handleAccountChange} />
      </SelectContainer>
    </div>
  )
}
