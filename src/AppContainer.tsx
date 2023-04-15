import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from './redux/types'
import {
  setIsAuthenticated,
  setIsLoading,
  setTransactions,
  setError,
  setOfflineMode,
  setLastNotificationText,
} from './redux/appSlice'
import App from './App'

export default function AppContainer() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state: AppState) => state.isAuthenticated)
  const transactions = useSelector((state: AppState) => state.transactions)
  const error = useSelector((state: AppState) => state.error)
  const isLoading = useSelector((state: AppState) => state.isLoading)
  const offlineMode = useSelector((state: AppState) => state.offlineMode)
  const lastNotificationText = useSelector((state: AppState) => state.lastNotificationText)

  const handleSetIsAuthenticated = (value: boolean) => {
    dispatch(setIsAuthenticated(value))
  }

  const handleSetTransactions = (transactions: any) => {
    dispatch(setTransactions(transactions))
  }

  const handleSetError = (error: string) => {
    dispatch(setError(error))
  }

  const handleSetIsLoading = (value: boolean) => {
    dispatch(setIsLoading(value))
  }

  const handleSetOfflineMode = (value: boolean) => {
    dispatch(setOfflineMode(value))
  }

  const handleSetLastNotificationText = (text: string) => {
    dispatch(setLastNotificationText(text))
  }

  return (
    <App
      isAuthenticated={isAuthenticated}
      transactions={transactions}
      error={error}
      isLoading={isLoading}
      offlineMode={offlineMode}
      lastNotificationText={lastNotificationText}
      onSetIsAuthenticated={handleSetIsAuthenticated}
      onSetTransactions={handleSetTransactions}
      onSetError={handleSetError}
      onSetIsLoading={handleSetIsLoading}
      onSetOfflineMode={handleSetOfflineMode}
      onSetLastNotificationText={handleSetLastNotificationText}
    />
  )
}
