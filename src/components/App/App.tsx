import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Status from './Status'
import NotFound from './NotFound'
import Notification from './Notification'
import Menu from './Menu'
import { HomeContainer } from '@/components/Home'
import { TransactionFormContainer } from '@/components/TransactionForm'
import { BudgetsContainer } from '../Budgets'
import { TransactionDTO } from '@/types'
import { appVersion } from '@/version'
import { TransactionsPageContainer } from '../Transactions'
import OfflineOverlay from '@/components/App/OfflineOverlay'

interface AppProps {
  transactions: any
  isLoading: boolean
  offlineMode: boolean
  lastNotificationText: string
  onLogout: () => void
  onAddTransaction: (transaction: TransactionDTO) => void
  onEditTransaction: (transaction: TransactionDTO) => void
  onRemoveTransaction: (id: string) => void
  onDismissNotification: () => void
}

export default function App(props: AppProps) {
  const {
    transactions,
    isLoading,
    offlineMode,
    lastNotificationText,
    onLogout,
    onAddTransaction,
    onEditTransaction,
    onRemoveTransaction,
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
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Menu handleLogout={onLogout} appVersion={appVersion} />
        <Status isLoading={isLoading} />
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
            <Route path="/add" element={<TransactionFormContainer onApply={onAddTransaction} />} />
            <Route
              path="/transactions/:transactionId"
              element={<TransactionFormContainer onApply={onEditTransaction} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {offlineMode && <OfflineOverlay />}
      </div>
    </div>
  )
}
