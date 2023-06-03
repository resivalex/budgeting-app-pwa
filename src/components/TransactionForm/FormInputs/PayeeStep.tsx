import styled from 'styled-components'
import SuggestingInput2 from '@/components/SuggestingInput2'

interface Props {
  payee: string
  isExpanded: boolean
  onPayeeChange: (payee: string) => void
  onExpand: () => void
  payees: string[]
  type: 'expense' | 'income' | 'transfer'
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
  payees,
  type,
}: Props) {
  if (!isExpanded) {
    return (
      <div className="field" onClick={onExpand}>
        <PayeeLabel className="is-size-7" isExpanded={isExpanded}>
          {type === 'expense' ? 'Получатель' : 'Плательщик'}
        </PayeeLabel>
        <SelectedPayee>{payee || 'Select'}</SelectedPayee>
      </div>
    )
  }

  return (
    <div className="field">
      <PayeeLabel className="is-size-7" isExpanded={isExpanded}>
        {type === 'expense' ? 'Получатель' : 'Плательщик'}
      </PayeeLabel>
      <div className="control">
        <SuggestingInput2 value={payee} suggestions={payees} onChange={onPayeeChange} />
      </div>
    </div>
  )
}