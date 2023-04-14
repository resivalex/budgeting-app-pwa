import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from './types'

const initialState: AppState = {
  isAuthenticated: false,
  transactions: [],
  error: '',
  isLoading: false,
  offlineMode: false,
  lastNotificationText: '',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
    setTransactions: (state, action: PayloadAction<any[]>) => {
      state.transactions = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
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
  setError,
  setIsLoading,
  setOfflineMode,
  setLastNotificationText,
} = appSlice.actions

export default appSlice.reducer
