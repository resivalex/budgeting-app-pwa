import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

interface Props {
  amount: string
  isExpanded: boolean
  onAmountChange: (amount: string) => void
  onExpand: () => void
  onComplete: () => void
}

const InputContainer = styled.div`
  font-size: 1rem;
`

export default function Amount({
  amount,
  isExpanded,
  onAmountChange,
  onExpand,
  onComplete,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onComplete()
    }
  }

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus()
    } else {
      inputRef.current?.blur()
    }
  }, [isExpanded])

  return (
    <div className="field" onClick={() => onExpand()}>
      <InputContainer className="control">
        <input
          ref={inputRef}
          className="input"
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </InputContainer>
    </div>
  )
}
