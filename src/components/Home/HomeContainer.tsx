import React from 'react'
import { useAppSelector, AppState } from '@/redux/appSlice'
import { AccountDetailsDTO, AccountPropertiesDTO } from '@/types'
import Home from './Home'

const defaultColor = '#ffffff'

export default function HomeContainer() {
  const accountDetails = useAppSelector((state: AppState) => state.accountDetails)
  const accountProperties: AccountPropertiesDTO = window.localStorage.accountProperties
    ? JSON.parse(window.localStorage.accountProperties)
    : { accounts: [] }

  const coloredAccounts: any[] = []
  const otherAccounts: any[] = []
  accountProperties.accounts.forEach((account) => {
    const accountDetail = accountDetails.find((a: AccountDetailsDTO) => a.account === account.name)
    if (!accountDetail) {
      return
    }
    coloredAccounts.push({
      name: account.name,
      currency: accountDetail.currency,
      balance: accountDetail.balance,
      color: account.color,
    })
  })
  accountDetails.forEach((accountDetailsItem: AccountDetailsDTO) => {
    const properties = accountProperties.accounts.find((a) => a.name === accountDetailsItem.account)

    if (properties) {
      return
    }

    otherAccounts.push({
      name: accountDetailsItem.account,
      currency: accountDetailsItem.currency,
      balance: accountDetailsItem.balance,
      color: defaultColor,
    })
  })

  return <Home accounts={[...coloredAccounts, ...otherAccounts]} />
}
