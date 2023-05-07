import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppState, setLastNotificationText, setOfflineMode, useAppSelector } from '@/redux/appSlice'
import App from './App'
import { BackendService, DbService } from '@/services'
import { TransactionDTO } from '@/types'
import { useCategoryExpansions } from './hooks/useCategoryExpansions'
import { useAccountProperties } from './hooks/useAccountProperties'
import { useInterval } from './hooks/useInterval'
import { useReduxTransactions } from './hooks/useReduxTransactions'
import { v4 as uuidv4 } from 'uuid'

const instanceId = uuidv4()

interface Props {
  backendService: BackendService
  dbService: DbService
}

export default function AuthorizedAppContainer({ backendService, dbService }: Props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useAppSelector((state: AppState) => state.isLoading)
  const offlineMode = useAppSelector((state: AppState) => state.offlineMode)
  const lastNotificationText = useAppSelector((state: AppState) => state.lastNotificationText)
  const isInitialized = useAppSelector((state: AppState) => state.isInitialized)
  const [isFailedPush, setIsFailedPush] = useState(false)

  useCategoryExpansions(backendService)
  useAccountProperties(backendService)

  const {
    transactions,
    setReduxTransactions,
    addReduxTransaction,
    replaceReduxTransaction,
    removeReduxTransaction,
  } = useReduxTransactions()

  const updateTransactionsFromLocalDb = useCallback(async () => {
    const docs = await dbService.readAllDocs()
    setReduxTransactions(docs)
  }, [dbService, dispatch])

  useEffect(() => {
    void updateTransactionsFromLocalDb()
  }, [updateTransactionsFromLocalDb])

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

  async function pushDbChangesToRemote() {
    try {
      await dbService.pushChanges()
      setIsFailedPush(false)
    } catch (error) {
      setIsFailedPush(true)
    }
  }

  async function repeatFailedPushToRemote() {
    if (!isFailedPush) {
      return
    }
    void pushDbChangesToRemote()
  }

  useInterval(pullDataFromRemote, 10000, instanceId)
  useInterval(repeatFailedPushToRemote, 10000, instanceId)

  async function addTransaction(t: TransactionDTO) {
    await dbService.addTransaction(t)

    addReduxTransaction(t)

    dispatch(setLastNotificationText('Запись добавлена'))
    navigate('/transactions', { replace: true })

    await pushDbChangesToRemote()
  }

  async function editTransaction(t: TransactionDTO) {
    await dbService.replaceTransaction(t)

    replaceReduxTransaction(t)

    dispatch(setLastNotificationText('Запись изменена'))
    navigate('/transactions', { replace: true })

    await pushDbChangesToRemote()
  }

  async function removeTransaction(id: string) {
    await dbService.removeTransaction(id)

    removeReduxTransaction(id)

    dispatch(setLastNotificationText('Запись удалена'))

    await pushDbChangesToRemote()
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
