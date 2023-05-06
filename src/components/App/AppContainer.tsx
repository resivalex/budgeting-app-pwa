import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  setIsAuthenticated,
  setIsLoading,
  setTransactions,
  setOfflineMode,
  setLastNotificationText,
  useAppSelector,
  AppState,
} from '@/redux/appSlice'
import App from './App'
import { DbService, BackendService } from '@/services'
import { TransactionDTO } from '@/types'
import _ from 'lodash'

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
  const isLoading = useAppSelector((state: AppState) => state.isLoading)
  const offlineMode = useAppSelector((state: AppState) => state.offlineMode)
  const lastNotificationText = useAppSelector((state: AppState) => state.lastNotificationText)
  const isInitialized = useAppSelector((state: AppState) => state.isInitialized)
  const dbServiceRef = useRef<DbService | null>(null)
  const [hasFailedPush, setHasFailedPush] = useState(false)
  const pushIntervalRef = useRef<number | null>(null)

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

      if (dbServiceRef.current) {
        return
      }
      const dbService = new DbService({
        dbUrl: config.dbUrl,
        onLoading: (value) => dispatch(setIsLoading(value)),
      })
      dbServiceRef.current = dbService

      async function updateTransactionsFromLocalDb() {
        const docs = await dbService.readAllDocs()
        const sortedDocs = _.sortBy(docs, (doc: TransactionDTO) => doc.datetime).reverse()
        dispatch(setTransactions(sortedDocs))
      }

      await updateTransactionsFromLocalDb()

      async function pullDataFromRemote() {
        try {
          const checkSettings = await backendService.getSettings()

          const dbChanged =
            window.localStorage.transactionsUploadedAt !== checkSettings.transactionsUploadedAt
          if (dbChanged) {
            await dbService.reset()
            window.localStorage.transactionsUploadedAt = checkSettings.transactionsUploadedAt
          }
          if (await dbService.pullChanges()) {
            await updateTransactionsFromLocalDb()
          }
          dispatch(setOfflineMode(false))
        } catch (error: any) {
          dispatch(setOfflineMode(true))
        }
      }

      await pullDataFromRemote()

      const pullInterval = setInterval(pullDataFromRemote, 10000)

      return () => {
        clearInterval(pullInterval)
      }
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

    async function loadAccountProperties() {
      if (!window.localStorage.config) {
        return
      }
      const config: ConfigType = JSON.parse(window.localStorage.config)
      const backendService = new BackendService(config.backendUrl, config.backendToken)
      const accountProperties = await backendService.getAccountProperties()

      window.localStorage.accountProperties = JSON.stringify(accountProperties)
    }

    void loadTransactions()
    void loadCategoryExpansions()
    void loadAccountProperties()
  }, [isAuthenticated, dispatch])

  async function pushChangesWithRetry(dbService: DbService) {
    try {
      await dbService.pushChanges()
      setHasFailedPush(false)
    } catch (error) {
      setHasFailedPush(true)
    }
  }

  useEffect(() => {
    if (hasFailedPush && !pushIntervalRef.current) {
      pushIntervalRef.current = window.setInterval(async () => {
        const dbService: DbService | null = dbServiceRef.current
        if (dbService) {
          await pushChangesWithRetry(dbService)
        }
      }, 10000)
    } else if (!hasFailedPush && pushIntervalRef.current) {
      clearInterval(pushIntervalRef.current)
      pushIntervalRef.current = null
    }
  }, [hasFailedPush])

  async function addTransaction(t: TransactionDTO) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.addTransaction(t)

    const newTransactions = [...transactions, t]
    const sortedTransactions = _.sortBy(
      newTransactions,
      (doc: TransactionDTO) => doc.datetime
    ).reverse()
    dispatch(setTransactions(sortedTransactions))

    dispatch(setLastNotificationText('Запись добавлена'))
    navigate('/transactions', { replace: true })

    await pushChangesWithRetry(dbService)
  }

  async function editTransaction(t: TransactionDTO) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.replaceTransaction(t)

    // replace transaction in redux store
    const newTransactions = [...transactions]
    const index = newTransactions.findIndex((transaction) => transaction._id === t._id)
    newTransactions[index] = t
    const sortedTransactions = _.sortBy(
      newTransactions,
      (doc: TransactionDTO) => doc.datetime
    ).reverse()
    dispatch(setTransactions(sortedTransactions))

    dispatch(setLastNotificationText('Запись изменена'))
    navigate('/transactions', { replace: true })

    await pushChangesWithRetry(dbService)
  }

  async function removeTransaction(id: string) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.removeTransaction(id)

    // remove transaction from redux store
    const newTransactions = [...transactions]
    const index = newTransactions.findIndex((transaction) => transaction._id === id)
    newTransactions.splice(index, 1)
    dispatch(setTransactions(newTransactions))

    dispatch(setLastNotificationText('Запись удалена'))

    await pushChangesWithRetry(dbService)
  }

  const handleLogout = () => {
    localStorage.removeItem('config')
    window.location.reload()
  }

  const handleSetIsAuthenticated = (value: boolean) => {
    dispatch(setIsAuthenticated(value))
  }

  const handleSetLastNotificationText = (text: string) => {
    dispatch(setLastNotificationText(text))
  }

  const handleSuccessfulLogin = () => {
    handleSetIsAuthenticated(true)
  }

  const handleDismissNotification = () => {
    handleSetLastNotificationText('')
  }

  return (
    <App
      isAuthenticated={isAuthenticated}
      transactions={transactions}
      isLoading={isLoading || (isAuthenticated && !isInitialized)}
      offlineMode={offlineMode}
      lastNotificationText={lastNotificationText}
      onLogout={handleLogout}
      onAddTransaction={addTransaction}
      onEditTransaction={editTransaction}
      onRemoveTransaction={removeTransaction}
      onSuccessfulLogin={handleSuccessfulLogin}
      onDismissNotification={handleDismissNotification}
    />
  )
}
