import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import TransactionAggregator from '@/services/TransactionAggregator'
import { AccountDetailsDTO } from '@/types'

export type AppState = {
  aggregations: {
    accountDetails: AccountDetailsDTO[]
    categories: string[]
    currencies: string[]
    payees: string[]
    comments: string[]
  }
}

const initialState: AppState = {
  aggregations: {
    accountDetails: [],
    categories: [],
    currencies: [],
    payees: [],
    comments: [],
  },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    aggregateTransactions: (state, action: PayloadAction<any[]>) => {
      const transactions = action.payload

      const transactionAggregator = new TransactionAggregator(transactions)
      state.aggregations.accountDetails = transactionAggregator.getAccountDetails()
      state.aggregations.categories = transactionAggregator.getSortedCategories()
      state.aggregations.currencies = transactionAggregator.getSortedCurrencies()
      state.aggregations.payees = transactionAggregator.getRecentPayees()
      state.aggregations.comments = transactionAggregator.getRecentComments()
    },
  },
})

export const { aggregateTransactions } = appSlice.actions

export function useAppSelector(selector: (state: AppState) => any) {
  return useSelector((state: RootState) => selector(state.app))
}

export default appSlice.reducer
