import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import TransactionAggregator from './TransactionAggregator'
import { AccountDetailsDTO } from '@/types'

export type AppState = {
  isInitialized: boolean
  isAuthenticated: boolean
  transactions: any[]
  isLoading: boolean
  offlineMode: boolean
  lastNotificationText: string
  accountDetails: AccountDetailsDTO[]
  categories: string[]
  currencies: string[]
  payees: string[]
  comments: string[]
}

const initialState: AppState = {
  isInitialized: false,
  isAuthenticated: false,
  transactions: [],
  isLoading: false,
  offlineMode: false,
  lastNotificationText: '',
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
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
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
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload
    },
    setLastNotificationText: (state, action: PayloadAction<string>) => {
      state.lastNotificationText = action.payload
    },
  },
})

export const {
  setIsAuthenticated,
  setTransactions,
  setIsLoading,
  setOfflineMode,
  setLastNotificationText,
} = appSlice.actions

export function useAppSelector(selector: (state: AppState) => any) {
  return useSelector((state: RootState) => selector(state.app))
}

export default appSlice.reducer
