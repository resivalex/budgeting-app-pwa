import styled from 'styled-components'

interface Props {
  value: string
  onChange: (type: 'income' | 'expense' | 'transfer') => void
}

const TypeButton = styled.button<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? '#3273dc' : '#fff')};
  color: ${(props) => (props.isActive ? '#fff' : '#3273dc')};
  border: 1px solid #3273dc;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  outline: none;

  &:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`

export default function TypeStep({ value, onChange }: Props) {
  return (
    <div className="field">
      <TypeButton isActive={value === 'expense'} onClick={() => onChange('expense')}>
        Расход
      </TypeButton>
      <TypeButton isActive={value === 'income'} onClick={() => onChange('income')}>
        Доход
      </TypeButton>
      <TypeButton isActive={value === 'transfer'} onClick={() => onChange('transfer')}>
        Перевод
      </TypeButton>
    </div>
  )
}
