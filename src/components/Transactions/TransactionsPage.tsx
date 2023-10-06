import { AccountDetailsDTO, TransactionDTO } from '@/types'
import { FC, useState } from 'react'
import TransactionsContainer from './TransactionsContainer'
import { Search } from '@material-ui/icons'

export default function TransactionsPage({
  AccountSelect,
  filterAccountName,
  filterPayee,
  filterComment,
  transactions,
  onFilterAccountNameChange,
  onFilterPayeeChange,
  onFilterCommentChange,
  onRemove,
}: {
  AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
  }>
  filterAccountName: string
  filterPayee: string
  filterComment: string
  transactions: TransactionDTO[]
  accountDetails: AccountDetailsDTO[]
  onFilterAccountNameChange: (accountName: string) => void
  onFilterPayeeChange: (payee: string) => void
  onFilterCommentChange: (comment: string) => void
  onRemove: (id: string) => void
}) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)

  const handleSearchClick = () => {
    setIsFilterExpanded(!isFilterExpanded)
  }

  const handleApplyFilters = () => {
    setIsFilterExpanded(false)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <AccountSelect value={filterAccountName} onChange={onFilterAccountNameChange} />
        <button onClick={handleSearchClick}>
          <Search />
        </button>
      </div>
      {isFilterExpanded && (
        <>
          <input
            value={filterPayee}
            placeholder="Filter by Payee"
            onChange={(e) => onFilterPayeeChange(e.target.value)}
          />
          <input
            value={filterComment}
            placeholder="Filter by Comment"
            onChange={(e) => onFilterCommentChange(e.target.value)}
          />
          <button onClick={handleApplyFilters}>Search</button>
        </>
      )}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <TransactionsContainer transactions={transactions} onRemove={onRemove} />
      </div>
    </div>
  )
}
