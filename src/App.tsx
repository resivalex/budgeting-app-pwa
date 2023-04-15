import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Status from './Status'
import Transactions from './Transactions'
import NotFound from './NotFound'
import TransactionFormContainer from './TransactionFormContainer'
import Login from './Login'
import Menu from './Menu'
import Notification from './Notification'
import { TransactionDTO } from './Transaction'

type AppProps = {
  isAuthenticated: boolean
  transactions: any
  error: string
  isLoading: boolean
  offlineMode: boolean
  lastNotificationText: string
  onLogout: () => void
  onAddTransaction: (transaction: TransactionDTO) => void
  onRemoveTransaction: (id: string) => void
  onSuccessfulLogin: () => void
  onCloseError: () => void
  onDismissNotification: () => void,
  accountDetails: any,
  sortedCategories: any,
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
    onLogout,
    onAddTransaction,
    onRemoveTransaction,
    onSuccessfulLogin,
    onCloseError,
    onDismissNotification,
    accountDetails,
    sortedCategories,
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
                element={
                  <Transactions transactions={transactions} onRemove={onRemoveTransaction} />
                }
              />
              <Route
                path="/add"
                element={
                  <TransactionFormContainer
                    onAdd={onAddTransaction}
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
        <Login onSuccessfulLogin={onSuccessfulLogin} />
      )}
      <Status isLoading={isLoading} error={error} onClose={onCloseError} />
    </div>
  )
}
