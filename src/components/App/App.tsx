import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Status from './Status'
import NotFound from './NotFound'
import Notification from './Notification'
import Menu from './Menu'
import { HomeContainer } from '@/components/Home'
import { TransactionFormContainer } from '@/components/TransactionForm'
import { BudgetsContainer } from '../Budgets'
import Login from '../Login'
import { TransactionDTO } from '@/types'
import { appVersion } from '@/version'
import { TransactionsPageContainer } from '../Transactions'

interface AppProps {
  isAuthenticated: boolean
  transactions: any
  error: string
  isLoading: boolean
  offlineMode: boolean
  lastNotificationText: string
  onLogout: () => void
  onAddTransaction: (transaction: TransactionDTO) => void
  onEditTransaction: (transaction: TransactionDTO) => void
  onRemoveTransaction: (id: string) => void
  onSuccessfulLogin: () => void
  onCloseError: () => void
  onDismissNotification: () => void
}

export default function App(props: AppProps) {
  const {
    isAuthenticated,
    transactions,
    error,
    isLoading,
    offlineMode,
    lastNotificationText,
    onLogout,
    onAddTransaction,
    onEditTransaction,
    onRemoveTransaction,
    onSuccessfulLogin,
    onCloseError,
    onDismissNotification,
  } = props

  return (
    <div>
      {lastNotificationText && (
        <Notification
          message={lastNotificationText}
          type="is-success"
          duration={1500}
          onDismiss={onDismissNotification}
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
          <Menu handleLogout={onLogout} appVersion={appVersion} offlineMode={offlineMode} />
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }}
          >
            <Routes>
              <Route path="/" element={<HomeContainer />} />
              <Route
                path="/transactions"
                element={
                  <TransactionsPageContainer
                    transactions={transactions}
                    onRemove={onRemoveTransaction}
                  />
                }
              />
              <Route
                path="/budgets"
                element={<BudgetsContainer onTransactionRemove={onRemoveTransaction} />}
              />
              <Route
                path="/add"
                element={<TransactionFormContainer onApply={onAddTransaction} />}
              />
              <Route
                path="/transactions/:transactionId"
                element={<TransactionFormContainer onApply={onEditTransaction} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Login onSuccessfulLogin={onSuccessfulLogin} />
      )}
      <Status isLoading={isLoading} error={error} onClose={onCloseError} />
    </div>
  )
}