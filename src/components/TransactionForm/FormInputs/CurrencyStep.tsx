import styled from 'styled-components'

interface Props {
  value: string
  isExpanded: boolean
  onChange: (currency: string) => void
  onExpand: () => void
  options: { value: string; label: string }[]
}

const Option = styled.div<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? '#3273dc' : '#fff')};
  color: ${(props) => (props.isActive ? '#fff' : '#3273dc')};
  border: 1px solid #3273dc;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-size: 1rem;
  cursor: pointer;

  &:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }

  &:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`

const Container = styled.div`
  outline: none;
  display: inline-flex;
  flex-grow: 1;

  &:focus {
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgba(50, 115, 220, 0.3);
  }
`

export default function CurrencyStep({ value, isExpanded, onChange, onExpand, options }: Props) {
  function renderSelectedOptionLabel() {
    const selectedOption = options.find((option) => option.value === value)
    return selectedOption ? selectedOption.label : '?'
  }

  if (!isExpanded) {
    return (
      <div className="field">
        <Container tabIndex={0} onClick={onExpand}>
          <Option isActive>{renderSelectedOptionLabel()}</Option>
        </Container>
      </div>
    )
  }

  return (
    <div className="field">
      <Container tabIndex={0}>
        {options.map((option) => (
          <Option
            key={option.value}
            isActive={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Option>
        ))}
      </Container>
    </div>
  )
}
