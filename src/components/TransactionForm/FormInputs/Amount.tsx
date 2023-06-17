import { useEffect, useRef } from 'react'

interface Props {
  amount: string
  onAmountChange: (amount: string) => void
}

export default function Amount({ amount, onAmountChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // focus on mount
    inputRef.current?.focus()
  }, [])
  return (
    <div className="field">
      <div className="is-size-7">Сумма</div>
      <div className="control">
        <input
          ref={inputRef}
          className="input is-small"
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
      </div>
    </div>
  )
}
