import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  setIsAuthenticated,
  setIsLoading,
  setTransactions,
  setError,
  setOfflineMode,
  setLastNotificationText,
  useAppSelector,
  AppState,
} from '../redux/appSlice'
import App from './App'
import DbService from '../services/DbService'
import BackendService from '../services/BackendService'
import { TransactionDTO } from '../types'

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export default function AppContainer() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state: AppState) => state.isAuthenticated)
  const transactions = useAppSelector((state: AppState) => state.transactions)
  const error = useAppSelector((state: AppState) => state.error)
  const isLoading = useAppSelector((state: AppState) => state.isLoading)
  const offlineMode = useAppSelector((state: AppState) => state.offlineMode)
  const lastNotificationText = useAppSelector((state: AppState) => state.lastNotificationText)
  const accountDetails = useAppSelector((state: AppState) => state.accountDetails)
  const isInitialized = useAppSelector((state: AppState) => state.isInitialized)
  const dbServiceRef = useRef<DbService | null>(null)

  useEffect(() => {
    if (window.localStorage.config) {
      dispatch(setIsAuthenticated(true))
    }
  }, [dispatch])

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

    async function loadCategoryExpansions() {
      if (!window.localStorage.config) {
        return
      }
      const config: ConfigType = JSON.parse(window.localStorage.config)
      const backendService = new BackendService(config.backendUrl, config.backendToken)
      const categoryExpansions = await backendService.getCategoryExpansions()

      window.localStorage.categoryExpansions = JSON.stringify(categoryExpansions)
    }

    void loadTransactions()
    void loadCategoryExpansions()
  }, [isAuthenticated, dispatch])

  async function addTransaction(t: TransactionDTO) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.addTransaction(t)
    dispatch(setLastNotificationText('Запись добавлена'))
    navigate('/transactions', { replace: true })
  }

  async function editTransaction(t: TransactionDTO) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.replaceTransaction(t)
    dispatch(setLastNotificationText('Запись изменена'))
    navigate('/transactions', { replace: true })
  }

  async function removeTransaction(id: string) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.removeTransaction(id)
    dispatch(setLastNotificationText('Запись удалена'))
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

  return (
    <App
      isAuthenticated={isAuthenticated}
      transactions={transactions}
      error={error}
      isLoading={isLoading || (isAuthenticated && !isInitialized)}
      offlineMode={offlineMode}
      lastNotificationText={lastNotificationText}
      onLogout={handleLogout}
      onAddTransaction={addTransaction}
      onEditTransaction={editTransaction}
      onRemoveTransaction={removeTransaction}
      onSuccessfulLogin={handleSuccessfulLogin}
      onCloseError={handleCloseError}
      onDismissNotification={handleDismissNotification}
      accountDetails={accountDetails}
    />
  )
}
