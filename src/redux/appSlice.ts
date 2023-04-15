import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from './store'

export interface AppState {
  isAuthenticated: boolean
  transactions: any[]
  error: string
  isLoading: boolean
  offlineMode: boolean
  lastNotificationText: string
}

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

export function useAppSelector(selector: (state: AppState) => any) {
  return useSelector((state: RootState) => selector(state.app))
}

export default appSlice.reducer
