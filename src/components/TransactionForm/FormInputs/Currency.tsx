import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

interface Props {
  value: string
  isExpanded: boolean
  onChange: (currency: string) => void
  onExpand: () => void
  onComplete: () => void
  options: { value: string; label: string }[]
  alwaysShowOptionsIfEmpty: boolean
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

const sortOptionsByHardcodedOrder = (options: { value: string; label: string }[]) => {
  const hardcodedCurrencyOrder = ['KZT', 'RUB', 'USD', 'EUR']

  return [...options].sort((a, b) => {
    const indexA = hardcodedCurrencyOrder.indexOf(a.value)
    const indexB = hardcodedCurrencyOrder.indexOf(b.value)

    // If both currencies are in hardcodedCurrencyOrder, sort by their order there
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    // If only a is in hardcodedCurrencyOrder, it comes first
    if (indexA !== -1) {
      return -1
    }

    // If only b is in hardcodedCurrencyOrder, it comes first
    if (indexB !== -1) {
      return 1
    }

    // If neither is in hardcodedCurrencyOrder, maintain original order
    return 0
  })
}

export default function Currency({
  value,
  isExpanded,
  onChange,
  onExpand,
  onComplete,
  options,
  alwaysShowOptionsIfEmpty,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isExpanded) {
      containerRef.current?.focus()
    }
  }, [isExpanded])

  function renderSelectedOptionLabel() {
    const selectedOption = options.find((option) => option.value === value)
    return selectedOption ? selectedOption.label : 'Валюта?'
  }

  const handleOptionClick = (currency: string) => {
    if (!isExpanded) {
      onExpand()
      // to prevent calling onComplete before onExpand
      setTimeout(() => {
        onChange(currency)
        onComplete()
      }, 0)
    } else {
      onChange(currency)
      onComplete()
    }
  }

  const renderOptions = () => {
    const sortedOptions = sortOptionsByHardcodedOrder(options)

    return (
      <>
        {sortedOptions.map((option) => (
          <Option
            key={option.value}
            isActive={value === option.value}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </Option>
        ))}
      </>
    )
  }

  if (!isExpanded) {
    return (
      <div className="field">
        <Container ref={containerRef} tabIndex={0} onClick={onExpand}>
          {alwaysShowOptionsIfEmpty && !value ? (
            renderOptions()
          ) : (
            <Option isActive>{renderSelectedOptionLabel()}</Option>
          )}
        </Container>
      </div>
    )
  }

  return (
    <div className="field">
      <Container ref={containerRef} tabIndex={0}>
        {renderOptions()}
      </Container>
    </div>
  )
}
