import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import SuggestingInput2 from '@/components/SuggestingInput2'

interface Props {
  payee: string
  isExpanded: boolean
  onPayeeChange: (payee: string) => void
  onExpand: () => void
  onComplete: () => void
  payees: string[]
  type: 'expense' | 'income' | 'transfer' | ''
}

const PayeeLabel = styled.div<{ isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.isExpanded ? 'black' : 'gray')};
`

const SelectedPayee = styled.div`
  font-size: 0.8rem;
`

export default function PayeeStep({
  payee,
  isExpanded,
  onPayeeChange,
  onExpand,
  onComplete,
  payees,
  type,
}: Props) {
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  function labelText() {
    return type === 'income' ? 'Плательщик' : 'Получатель'
  }

  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <PayeeLabel className="is-size-7" isExpanded={isExpanded}>
          {labelText()}
        </PayeeLabel>
        <SelectedPayee>{payee || 'Select'}</SelectedPayee>
      </div>
    )
  }

  return (
    <div className="field">
      <PayeeLabel className="is-size-7" isExpanded={isExpanded}>
        {labelText()}
      </PayeeLabel>
      <div className="control">
        <SuggestingInput2
          ref={inputRef}
          value={payee}
          suggestions={payees}
          onChange={onPayeeChange}
          onConfirm={onComplete}
        />
      </div>
    </div>
  )
}
