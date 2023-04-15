import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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
import DbService from './DbService'
import BackendService from './BackendService'
import { TransactionDTO } from './Transaction'
import TransactionAggregator from './TransactionAggregator'

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export default function AppContainer() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state: AppState) => state.isAuthenticated)
  const transactions = useSelector((state: AppState) => state.transactions)
  const error = useSelector((state: AppState) => state.error)
  const isLoading = useSelector((state: AppState) => state.isLoading)
  const offlineMode = useSelector((state: AppState) => state.offlineMode)
  const lastNotificationText = useSelector((state: AppState) => state.lastNotificationText)
  const dbServiceRef = useRef<DbService | null>(null)

  useEffect(() => {
    if (window.localStorage.config) {
      dispatch(setIsAuthenticated(true))
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    async function loadTransactions() {
      if (!window.localStorage.config) {
        return
      }
      const config: ConfigType = JSON.parse(window.localStorage.config)

      const backendService = new BackendService(config.backendUrl, config.backendToken)
      let settings = null
      try {
        settings = await backendService.getSettings()
      } catch (err) {
        dispatch(setOfflineMode(true))
      }

      const shouldReset = settings
        ? async () => {
            const checkSettings = await backendService.getSettings()
            const changed =
              window.localStorage.transactionsUploadedAt !== checkSettings.transactionsUploadedAt
            if (changed) {
              window.localStorage.transactionsUploadedAt = checkSettings.transactionsUploadedAt
            }
            return changed
          }
        : async () => false

      if (dbServiceRef.current) {
        return
      }
      const dbService = new DbService({
        dbUrl: config.dbUrl,
        onLoading: (value) => dispatch(setIsLoading(value)),
        onDocsRead: (docs) => dispatch(setTransactions(docs)),
        onError: (err) => dispatch(setError(err)),
        shouldReset: shouldReset,
      })
      dbServiceRef.current = dbService
      if (settings) {
        const resetDb =
          window.localStorage.transactionsUploadedAt !== settings.transactionsUploadedAt
        if (resetDb) {
          window.localStorage.transactionsUploadedAt = settings.transactionsUploadedAt
          await dbService.reset()
        }
      }
      await dbService.synchronize()
    }
    void loadTransactions()
  }, [isAuthenticated])

  async function addTransaction(t: TransactionDTO) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.addTransaction(t)
    dispatch(setLastNotificationText('Transaction added'))
    navigate('/transactions')
  }

  async function removeTransaction(id: string) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.removeTransaction(id)
    dispatch(setLastNotificationText('Transaction removed'))
  }

  const handleLogout = () => {
    localStorage.removeItem('config')
    window.location.reload()
  }

  const handleSetIsAuthenticated = (value: boolean) => {
    dispatch(setIsAuthenticated(value))
  }

  const handleSetError = (error: string) => {
    dispatch(setError(error))
  }

  const handleSetLastNotificationText = (text: string) => {
    dispatch(setLastNotificationText(text))
  }

  const handleSuccessfulLogin = () => {
    handleSetIsAuthenticated(true)
  }

  const handleCloseError = () => {
    handleSetError('')
  }

  const handleDismissNotification = () => {
    handleSetLastNotificationText('')
  }

  const transactionAggregator = new TransactionAggregator(transactions)
  const accountDetails = transactionAggregator.getAccountDetails()
  const sortedCategories = transactionAggregator.getSortedCategories()

  return (
    <App
      isAuthenticated={isAuthenticated}
      transactions={transactions}
      error={error}
      isLoading={isLoading}
      offlineMode={offlineMode}
      lastNotificationText={lastNotificationText}
      onLogout={handleLogout}
      onAddTransaction={addTransaction}
      onRemoveTransaction={removeTransaction}
      onSuccessfulLogin={handleSuccessfulLogin}
      onCloseError={handleCloseError}
      onDismissNotification={handleDismissNotification}
      accountDetails={accountDetails}
      sortedCategories={sortedCategories}
    />
  )
}
