import React, { useImperativeHandle, forwardRef, useRef, MutableRefObject, useState } from 'react'
import Select from 'react-select'
import {
  convertCurrencyCodeToSymbol,
  reactSelectColorStyles,
  useColoredAccounts,
  formatFinancialAmount,
} from '@/utils'
import { AccountDetailsDTO } from '@/types'

const ColoredAccountSelect = forwardRef(
  (
    {
      value,
      onChange,
      accountDetails,
      availableAccountNames,
      emptyOption,
    }: {
      value: string
      onChange: (value: string) => void
      accountDetails: AccountDetailsDTO[]
      availableAccountNames: string[]
      emptyOption: string | null
    },
    ref
  ) => {
    const [menuIsOpen, setMenuOpen] = useState(false)
    const coloredAccounts = useColoredAccounts(localStorage.accountProperties || '', accountDetails)
    const availableColoredAccounts = coloredAccounts.filter((a) =>
      availableAccountNames.includes(a.account)
    )
    const emptyOptions = emptyOption ? [{ value: '', label: emptyOption, color: '#ffffff' }] : []
    const accountOptions = availableColoredAccounts.map((a) => ({
      value: a.account,
      label: `${formatFinancialAmount(a.balance)} ${convertCurrencyCodeToSymbol(a.currency)} | ${
        a.account
      }`,
      color: a.color,
    }))
    const options = [...emptyOptions, ...accountOptions]

    const selectRef: MutableRefObject<any> = useRef(null)

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (selectRef.current) {
          selectRef.current.focus()
          setMenuOpen(true)
        }
      },
    }))

    return (
      // @ts-ignore
      <Select
        ref={selectRef}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        className="basic-single"
        classNamePrefix="select"
        value={options.find((option) => option.value === value) || null}
        // @ts-ignore
        onChange={(selectedOption) => {
          if (!selectedOption) return
          onChange(selectedOption.value)
        }}
        options={options}
        isSearchable={false}
        placeholder="Выберите из списка..."
        styles={reactSelectColorStyles}
      />
    )
  }
)

export default ColoredAccountSelect
