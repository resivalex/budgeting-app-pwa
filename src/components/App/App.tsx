import { useRef, forwardRef, useImperativeHandle, useMemo, FC, Ref } from 'react'
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

type LimitedAccountSelectType = FC<{
  value: string
  onChange: (value: string) => void
  availableNames: string[]
  ref?: Ref<{ focus: () => void }>
}>

type FullAccountSelectType = FC<{
  value: string
  onChange: (value: string) => void
  ref?: Ref<{ focus: () => void }>
}>

export default function App({
  transactions,
  transactionAggregations,
  filterAccountName,
  filterPayee,
  filterComment,
  isLoading,
  offlineMode,
  lastNotificationText,
  onExport,
  onLogout,
  onFilterAccountNameChange,
  onFilterPayeeChange,
  onFilterCommentChange,
  onAddTransaction,
  onEditTransaction,
  onRemoveTransaction,
  onDismissNotification,
}: {
  transactions: TransactionDTO[]
  transactionAggregations: TransactionsAggregations
  filterAccountName: string
  filterPayee: string
  filterComment: string
  isLoading: boolean
  offlineMode: boolean
  lastNotificationText: string
  onExport: () => Promise<void>
  onLogout: () => void
  onFilterAccountNameChange: (accountName: string) => void
  onFilterPayeeChange: (payee: string) => void
  onFilterCommentChange: (comment: string) => void
  onAddTransaction: (transaction: TransactionDTO) => Promise<void>
  onEditTransaction: (transaction: TransactionDTO) => Promise<void>
  onRemoveTransaction: (id: string) => Promise<void>
  onDismissNotification: () => void
}) {
  const LimitedAccountSelect: LimitedAccountSelectType = useMemo(
    () =>
      forwardRef(({ value, onChange, availableNames }: any, ref) => {
        const limitedSelectRef = useRef<any>(null)
        useImperativeHandle(ref, () => ({
          focus: () => {
            if (limitedSelectRef.current) {
              limitedSelectRef.current.focus()
            }
          },
        }))
        return (
          <ColoredAccountSelect
            ref={limitedSelectRef}
            accountDetails={transactionAggregations.accountDetails}
            value={value}
            onChange={onChange}
            availableAccountNames={availableNames}
            emptyOption={null}
          />
        )
      }),
    [transactionAggregations.accountDetails]
  )

  const FullAccountSelect: FullAccountSelectType = useMemo(
    () =>
      forwardRef(({ value, onChange }: any, ref) => {
        const fullSelectRef = useRef<any>(null)
        useImperativeHandle(ref, () => ({
          focus: () => {
            if (fullSelectRef.current) {
              fullSelectRef.current.focus()
            }
          },
        }))
        return (
          <ColoredAccountSelect
            ref={fullSelectRef}
            accountDetails={transactionAggregations.accountDetails}
            value={value}
            onChange={onChange}
            availableAccountNames={transactionAggregations.accountDetails.map(
              (account) => account.account
            )}
            emptyOption="Все счета"
          />
        )
      }),
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
                  AccountSelect={FullAccountSelect}
                  transactions={transactions}
                  accountDetails={transactionAggregations.accountDetails}
                  filterAccountName={filterAccountName}
                  filterPayee={filterPayee}
                  filterComment={filterComment}
                  onFilterAccountNameChange={onFilterAccountNameChange}
                  onFilterPayeeChange={onFilterPayeeChange}
                  onFilterCommentChange={onFilterCommentChange}
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
