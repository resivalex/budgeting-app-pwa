import { useEffect, useState, useCallback } from 'react'
import { BackendService, DbService } from '@/services'
import { useInterval } from './useInterval'
import { TransactionDTO } from '@/types'

export function useSyncService(
  backendService: BackendService,
  dbService: DbService,
  instanceId: string,
  onTransactionsPull: (transactions: TransactionDTO[]) => void
) {
  const [isFailedPush, setIsFailedPush] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)

  const loadTransactionsFromLocalCallback = useCallback(
    async function loadTransactionsFromLocal() {
      const docs = await dbService.readAllDocs()
      onTransactionsPull(docs)
    },
    [dbService, onTransactionsPull]
  )

  const pullDataFromRemoteCallback = useCallback(
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
          await loadTransactionsFromLocalCallback()
        }
        setOfflineMode(false)
      } catch (error: any) {
        setOfflineMode(true)
      }
    },
    [backendService, dbService, loadTransactionsFromLocalCallback]
  )

  useEffect(() => {
    void loadTransactionsFromLocalCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pushDbChangesToRemoteCallback = useCallback(
    async function pushDbChangesToRemote() {
      try {
        await dbService.pushChanges()
        setIsFailedPush(false)
      } catch (error) {
        setIsFailedPush(true)
      }
    },
    [dbService]
  )

  const repeatFailedPushToRemoteCallback = useCallback(
    async function repeatFailedPushToRemote() {
      if (!isFailedPush) {
        return
      }
      void pushDbChangesToRemoteCallback()
    },
    [isFailedPush, pushDbChangesToRemoteCallback]
  )

  const initialDelay = 3000
  const intervalDelay = 10000
  useInterval(pullDataFromRemoteCallback, initialDelay, intervalDelay, instanceId)
  useInterval(repeatFailedPushToRemoteCallback, initialDelay, intervalDelay, instanceId)

  async function addDbTransaction(t: TransactionDTO) {
    await dbService.addTransaction(t)
    await pushDbChangesToRemoteCallback()
  }

  async function replaceDbTransaction(t: TransactionDTO) {
    await dbService.replaceTransaction(t)
    await pushDbChangesToRemoteCallback()
  }

  async function removeDbTransaction(id: string) {
    await dbService.removeTransaction(id)
    await pushDbChangesToRemoteCallback()
  }

  return {
    offlineMode,
    addDbTransaction,
    replaceDbTransaction,
    removeDbTransaction,
  }
}
