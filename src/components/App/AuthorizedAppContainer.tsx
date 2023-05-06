import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
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
import { useCategoryExpansions } from './hooks/useCategoryExpansions'
import { useAccountProperties } from './hooks/useAccountProperties'

interface Props {
  backendService: BackendService
  dbService: DbService
}

export default function AppContainer({ backendService, dbService }: Props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const transactions = useAppSelector((state: AppState) => state.transactions)
  const isLoading = useAppSelector((state: AppState) => state.isLoading)
  const offlineMode = useAppSelector((state: AppState) => state.offlineMode)
  const lastNotificationText = useAppSelector((state: AppState) => state.lastNotificationText)
  const isInitialized = useAppSelector((state: AppState) => state.isInitialized)
  const [hasFailedPush, setHasFailedPush] = useState(false)
  const pushIntervalRef = useRef<number | null>(null)

  useCategoryExpansions(backendService)
  useAccountProperties(backendService)

  useEffect(() => {
    async function loadTransactions() {
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

    void loadTransactions()
  }, [backendService, dbService, dispatch])

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
        await pushChangesWithRetry(dbService)
      }, 10000)
    } else if (!hasFailedPush && pushIntervalRef.current) {
      clearInterval(pushIntervalRef.current)
      pushIntervalRef.current = null
    }
  }, [hasFailedPush, dbService])

  async function addTransaction(t: TransactionDTO) {
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

  const handleSetLastNotificationText = (text: string) => {
    dispatch(setLastNotificationText(text))
  }

  const handleDismissNotification = () => {
    handleSetLastNotificationText('')
  }

  return (
    <App
      transactions={transactions}
      isLoading={isLoading || !isInitialized}
      offlineMode={offlineMode}
      lastNotificationText={lastNotificationText}
      onLogout={handleLogout}
      onAddTransaction={addTransaction}
      onEditTransaction={editTransaction}
      onRemoveTransaction={removeTransaction}
      onDismissNotification={handleDismissNotification}
    />
  )
}
