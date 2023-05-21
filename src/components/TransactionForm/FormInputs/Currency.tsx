import { reactSelectSmallStyles } from '@/utils'
import Select from 'react-select'
import styled from "styled-components";

interface Props {
  currency: string
  onCurrencyChange: (currency: string) => void
  currencyOptions: { value: string; label: string }[]
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

export default function Currency({ currency, onCurrencyChange, currencyOptions }: Props) {
  return (
    <div className="field">
      <div className="is-size-7">Валюта</div>
      <div className="control">
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={currencyOptions.find((option) => option.value === currency)}
          onChange={(selectedOption) => {
            if (!selectedOption) return
            onCurrencyChange(selectedOption.value)
          }}
          options={currencyOptions}
          isSearchable={false}
          styles={reactSelectSmallStyles}
        />
      </div>
    </div>
  )
}
