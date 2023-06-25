import React from 'react'
import { useAppSelector, AppState } from '@/redux/appSlice'
import { AccountPropertiesDTO, ColoredAccountDetailsDTO } from '@/types'
import { mergeAccountDetailsAndProperties } from '@/utils'
import Home from './Home'

export default function HomeContainer() {
  const transactionAggregations = useAppSelector((state: AppState) => state.aggregations)
  const accountDetails = transactionAggregations.accountDetails
  const accountProperties: AccountPropertiesDTO = localStorage.accountProperties
    ? JSON.parse(localStorage.accountProperties)
    : { accounts: [] }

  const coloredAccounts: ColoredAccountDetailsDTO[] = mergeAccountDetailsAndProperties(
    accountDetails,
    accountProperties
  )
  const accounts = coloredAccounts.map((account) => ({
    name: account.account,
    currency: account.currency,
    balance: account.balance,
    color: account.color,
  }))

  return <Home accounts={accounts} />
}
