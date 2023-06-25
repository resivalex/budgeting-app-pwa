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
import OfflineOverlay from './OfflineOverlay'

export default function App({
  transactions,
  filterAccountName,
  isLoading,
  offlineMode,
  lastNotificationText,
  onExport,
  onLogout,
  onFilterAccountNameChange,
  onAddTransaction,
  onEditTransaction,
  onRemoveTransaction,
  onDismissNotification,
}: {
  transactions: any
  filterAccountName: string
  isLoading: boolean
  offlineMode: boolean
  lastNotificationText: string
  onExport: () => void
  onLogout: () => void
  onFilterAccountNameChange: (accountName: string) => void
  onAddTransaction: (transaction: TransactionDTO) => void
  onEditTransaction: (transaction: TransactionDTO) => void
  onRemoveTransaction: (id: string) => void
  onDismissNotification: () => void
}) {
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
        <Menu handleExport={onExport} handleLogout={onLogout} appVersion={appVersion} />
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
                  filterAccountName={filterAccountName}
                  onFilterAccountNameChange={onFilterAccountNameChange}
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
