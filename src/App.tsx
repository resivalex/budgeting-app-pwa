import React, { useEffect, useRef } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './Home'
import Status from './Status'
import Transactions from './Transactions'
import NotFound from './NotFound'
import TransactionForm from './TransactionForm'
import Login from './Login'
import DbService from './DbService'
import TransactionAggregator from './TransactionAggregator'
import Menu from './Menu'
import BackendService from './BackendService'
import Notification from './Notification'
import { TransactionDTO } from './Transaction'

type AppProps = {
  isAuthenticated: boolean
  transactions: any
  error: string
  isLoading: boolean
  offlineMode: boolean
  lastNotificationText: string
  onSetIsAuthenticated: (value: boolean) => void
  onSetTransactions: (transactions: any) => void
  onSetError: (error: string) => void
  onSetIsLoading: (value: boolean) => void
  onSetOfflineMode: (value: boolean) => void
  onSetLastNotificationText: (text: string) => void
}

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

const appVersion = '20230414-1700'

export default function App(props: AppProps) {
  const {
    isAuthenticated,
    transactions,
    error,
    isLoading,
    offlineMode,
    lastNotificationText,
    onSetIsAuthenticated,
    onSetTransactions,
    onSetError,
    onSetIsLoading,
    onSetOfflineMode,
    onSetLastNotificationText,
  } = props

  const dbServiceRef = useRef<DbService | null>(null)

  useEffect(() => {
    if (window.localStorage.config) {
      onSetIsAuthenticated(true)
    }
  }, [])

  const navigate = useNavigate()

  const transactionAggregator = new TransactionAggregator(transactions)
  const accountDetails = transactionAggregator.getAccountDetails()
  const sortedCategories = transactionAggregator.getSortedCategories()

  const handleLogout = () => {
    localStorage.removeItem('config')
    window.location.reload()
  }

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
        onSetOfflineMode(true)
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
        onLoading: onSetIsLoading,
        onDocsRead: onSetTransactions,
        onError: onSetError,
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
    onSetLastNotificationText('Transaction added')
    navigate('/transactions')
  }

  async function removeTransaction(id: string) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.removeTransaction(id)
    onSetLastNotificationText('Transaction removed')
  }

  return (
    <div>
      {lastNotificationText && (
        <Notification
          message={lastNotificationText}
          type="is-success"
          duration={1500}
          onDismiss={() => {
            onSetLastNotificationText('')
          }}
        />
      )}
      {isAuthenticated ? (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: offlineMode ? 'gray' : 'white',
          }}
        >
          <Menu handleLogout={handleLogout} appVersion={appVersion} offlineMode={offlineMode} />
          <div
            style={{
              width: '100%',
              flex: 1,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Routes>
              <Route
                path="/"
                element={<Home transactions={transactions} accountDetails={accountDetails} />}
              />
              <Route
                path="/transactions"
                element={<Transactions transactions={transactions} onRemove={removeTransaction} />}
              />
              <Route
                path="/add"
                element={
                  <TransactionForm
                    onAdd={addTransaction}
                    accounts={accountDetails}
                    categories={sortedCategories}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Login onSuccessfulLogin={() => onSetIsAuthenticated(true)} />
      )}
      <Status isLoading={isLoading} error={error} onClose={() => onSetError('')} />
    </div>
  )
}
