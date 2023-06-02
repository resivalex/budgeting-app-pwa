import { useNavigate } from 'react-router-dom'
import App from './App'
import { BackendService, DbService } from '@/services'
import { TransactionDTO } from '@/types'
import { useCategoryExpansions } from './hooks/useCategoryExpansions'
import { useAccountProperties } from './hooks/useAccountProperties'
import { useReduxTransactions } from './hooks/useReduxTransactions'
import { v4 as uuidv4 } from 'uuid'
import { useSyncService } from './hooks/useSyncService'
import { useLastNotificationText } from './hooks/useLastNotificationText'

const instanceId = uuidv4()

interface Props {
  backendService: BackendService
  dbService: DbService
  isLoading: boolean
}

export default function AuthorizedAppContainer({ backendService, dbService, isLoading }: Props) {
  const navigate = useNavigate()

  useCategoryExpansions(backendService)
  useAccountProperties(backendService)

  const {
    transactions,
    setReduxTransactions,
    addReduxTransaction,
    replaceReduxTransaction,
    removeReduxTransaction,
  } = useReduxTransactions()

  async function handleUpdatedTransactions(transactions: TransactionDTO[]) {
    setReduxTransactions(transactions)
  }

  const { offlineMode, addDbTransaction, replaceDbTransaction, removeDbTransaction } =
    useSyncService(backendService, dbService, instanceId, handleUpdatedTransactions)

  const { lastNotificationText, setLastNotificationText } = useLastNotificationText()

  async function addTransaction(t: TransactionDTO) {
    await addDbTransaction(t)
    addReduxTransaction(t)
    setLastNotificationText('Запись добавлена')
    navigate('/transactions', { replace: true })
  }

  async function editTransaction(t: TransactionDTO) {
    await replaceDbTransaction(t)
    replaceReduxTransaction(t)
    setLastNotificationText('Запись изменена')
    navigate('/transactions', { replace: true })
  }

  async function removeTransaction(id: string) {
    await removeDbTransaction(id)
    removeReduxTransaction(id)
    setLastNotificationText('Запись удалена')
  }

  function handleLogout() {
    localStorage.removeItem('config')
    window.location.reload()
  }

  async function handleExport() {
    const csvString = await backendService.getExportingCsvString()
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const isoDate = new Date().toISOString().slice(0, 10)
    link.setAttribute('download', `${isoDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <App
      transactions={transactions}
      isLoading={isLoading}
      offlineMode={offlineMode}
      lastNotificationText={lastNotificationText}
      onExport={handleExport}
      onLogout={handleLogout}
      onAddTransaction={addTransaction}
      onEditTransaction={editTransaction}
      onRemoveTransaction={removeTransaction}
      onDismissNotification={() => setLastNotificationText('')}
    />
  )
}
