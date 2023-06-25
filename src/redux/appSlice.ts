import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import TransactionAggregator from '@/services/TransactionAggregator'
import { AccountDetailsDTO } from '@/types'

export type AppState = {
  isInitialized: boolean
  transactions: any[]
  offlineMode: boolean
  accountDetails: AccountDetailsDTO[]
  categories: string[]
  currencies: string[]
  payees: string[]
  comments: string[]
}

const initialState: AppState = {
  isInitialized: false,
  transactions: [],
  offlineMode: false,
  accountDetails: [],
  categories: [],
  currencies: [],
  payees: [],
  comments: [],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<any[]>) => {
      const transactions = action.payload
      state.transactions = transactions
      state.isInitialized = true

      const transactionAggregator = new TransactionAggregator(transactions)
      state.accountDetails = transactionAggregator.getAccountDetails()
      state.categories = transactionAggregator.getSortedCategories()
      state.currencies = transactionAggregator.getSortedCurrencies()
      state.payees = transactionAggregator.getRecentPayees()
      state.comments = transactionAggregator.getRecentComments()
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload
    },
  },
})

export const { setTransactions, setOfflineMode } = appSlice.actions

export function useAppSelector(selector: (state: AppState) => any) {
  return useSelector((state: RootState) => selector(state.app))
}

export default appSlice.reducer
