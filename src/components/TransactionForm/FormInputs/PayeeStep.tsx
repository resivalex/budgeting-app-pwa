import styled from 'styled-components'
import SuggestingInput2 from '@/components/SuggestingInput2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

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

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
      <ControlContainer className="control">
        <SuggestingInput2 value={payee} suggestions={payees} onChange={onPayeeChange} />
        <button onClick={onComplete}>
          <FontAwesomeIcon icon={faCheckCircle} />
        </button>
      </ControlContainer>
    </div>
  )
}
