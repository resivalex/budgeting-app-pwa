import styled from 'styled-components'

interface Props {
  amount: string
  isExpanded: boolean
  onAmountChange: (amount: string) => void
  onExpand: () => void
}

const InputContainer = styled.div`
  font-size: 1rem;
`

const AmountLabel = styled.div<{ isExpanded: boolean }>`
  font-size: 1rem;
  color: ${(props) => (props.isExpanded ? 'black' : 'gray')};
`

export default function AmountStep({ amount, isExpanded, onAmountChange, onExpand }: Props) {
  return (
    <div className="field" onClick={() => onExpand()}>
      <AmountLabel className="is-size-7" isExpanded={isExpanded}>
        Сумма
      </AmountLabel>
      <InputContainer className="control">
        <input
          className="input is-small"
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
      </InputContainer>
    </div>
  )
}
