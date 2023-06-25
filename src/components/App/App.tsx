import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Status from './Status'
import NotFound from './NotFound'
import Notification from './Notification'
import Menu from './Menu'
import { HomeContainer } from '@/components/Home'
import { TransactionFormContainer } from '@/components/TransactionForm'
import { BudgetsContainer } from '../Budgets'
import { TransactionDTO, TransactionsAggregations } from '@/types'
import { appVersion } from '@/version'
import { TransactionsPageContainer } from '../Transactions'
import OfflineOverlay from './OfflineOverlay'
import ColoredAccountSelect from './ColoredAccountSelect'

export default function App({
  transactions,
  transactionAggregations,
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
  transactions: TransactionDTO[]
  transactionAggregations: TransactionsAggregations
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
  const LimitedAccountSelect = React.useMemo(
    () =>
      ({
        value,
        onChange,
        availableNames,
      }: {
        value: string
        onChange: (value: string) => void
        availableNames: string[]
      }) =>
        (
          <ColoredAccountSelect
            accountDetails={transactionAggregations.accountDetails}
            value={value}
            onChange={onChange}
            availableAccountNames={availableNames}
          />
        ),
    [transactionAggregations.accountDetails]
  )

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
            <Route
              path="/"
              element={<HomeContainer accountDetails={transactionAggregations.accountDetails} />}
            />
            <Route
              path="/transactions"
              element={
                <TransactionsPageContainer
                  transactions={transactions}
                  accountDetails={transactionAggregations.accountDetails}
                  filterAccountName={filterAccountName}
                  onFilterAccountNameChange={onFilterAccountNameChange}
                  onRemove={onRemoveTransaction}
                />
              }
            />
            <Route
              path="/budgets"
              element={
                <BudgetsContainer
                  transactions={transactions}
                  transactionAggregations={transactionAggregations}
                  onTransactionRemove={onRemoveTransaction}
                />
              }
            />
            <Route
              path="/add"
              element={
                <TransactionFormContainer
                  LimitedAccountSelect={LimitedAccountSelect}
                  transactions={transactions}
                  transactionsAggregations={transactionAggregations}
                  onApply={onAddTransaction}
                />
              }
            />
            <Route
              path="/transactions/:transactionId"
              element={
                <TransactionFormContainer
                  LimitedAccountSelect={LimitedAccountSelect}
                  transactions={transactions}
                  transactionsAggregations={transactionAggregations}
                  onApply={onEditTransaction}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {offlineMode && <OfflineOverlay />}
      </div>
    </div>
  )
}
