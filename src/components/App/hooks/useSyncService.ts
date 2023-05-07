import { AppState, setOfflineMode, useAppSelector } from '@/redux/appSlice'
import { useDispatch } from 'react-redux'
import { BackendService, DbService } from '@/services'
import { useInterval } from './useInterval'
import { useEffect, useState } from 'react'
import { TransactionDTO } from '@/types'

export function useSyncService(
  backendService: BackendService,
  dbService: DbService,
  instanceId: string,
  onTransactionsPull: (transactions: TransactionDTO[]) => void
) {
  const [isFailedPush, setIsFailedPush] = useState(false)
  const dispatch = useDispatch()
  const offlineMode = useAppSelector((state: AppState) => state.offlineMode)

  async function loadTransactionsFromLocal() {
    const docs = await dbService.readAllDocs()
    onTransactionsPull(docs)
  }

  useEffect(() => {
    void loadTransactionsFromLocal()
  }, [])

  async function pullDataFromRemote() {
    try {
      const checkSettings = await backendService.getSettings()

      const dbChanged =
        localStorage.transactionsUploadedAt !== checkSettings.transactionsUploadedAt
      if (dbChanged) {
        await dbService.reset()
        localStorage.transactionsUploadedAt = checkSettings.transactionsUploadedAt
      }
      if (await dbService.pullChanges()) {
        await loadTransactionsFromLocal()
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

  async function addDbTransaction(t: TransactionDTO) {
    await dbService.addTransaction(t)
    await pushDbChangesToRemote()
  }

  async function replaceDbTransaction(t: TransactionDTO) {
    await dbService.replaceTransaction(t)
    await pushDbChangesToRemote()
  }

  async function removeDbTransaction(id: string) {
    await dbService.removeTransaction(id)
    await pushDbChangesToRemote()
  }

  return {
    offlineMode,
    addDbTransaction,
    replaceDbTransaction,
    removeDbTransaction,
  }
}
