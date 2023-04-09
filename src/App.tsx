import React, { useEffect, useState, useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './Home'
import Status from './Status'
import Transactions from './Transactions'
import NotFound from './NotFound'
import TransactionForm from './TransactionForm'
import { TransactionDTO } from './Transaction'
import Login from './Login'
import DbService from './DbService'
import TransactionAggregator from './TransactionAggregator'
import Menu from './Menu'
import BackendService from './BackendService'
import Notification from './Notification'

const appVersion = '20230409-1600'

type ConfigType = {
  backendUrl: string
  backendToken: string
  dbUrl: string
}

export default function App() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)
  const [lastNotificationText, setLastNotificationText] = useState('This is a test notification')
  const dbServiceRef = useRef<DbService | null>(null)

  useEffect(() => {
    if (window.localStorage.config) {
      setIsAuthenticated(true)
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
        setOfflineMode(true)
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
        onLoading: setIsLoading,
        onDocsRead: setTransactions,
        onError: setError,
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
    setLastNotificationText('Transaction added')
    navigate('/transactions')
  }

  async function removeTransaction(id: string) {
    const dbService: DbService | null = dbServiceRef.current
    if (!dbService) {
      return
    }

    await dbService.removeTransaction(id)
    setLastNotificationText('Transaction removed')
  }

  return (
    <div>
      {lastNotificationText && (
        <Notification
          message={lastNotificationText}
          type="is-success"
          duration={1500}
          onDismiss={() => {
            setLastNotificationText('')
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
        <Login onSuccessfulLogin={() => setIsAuthenticated(true)} />
      )}
      <Status isLoading={isLoading} error={error} onClose={() => setError('')} />
    </div>
  )
}
