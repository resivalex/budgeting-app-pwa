import { AccountDetailsDTO, TransactionDTO } from '@/types'
import { FC, useState } from 'react'
import TransactionsContainer from './TransactionsContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

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
  onRemove: (id: string) => Promise<void>
}) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [localFilterPayee, setLocalFilterPayee] = useState(filterPayee)
  const [localFilterComment, setLocalFilterComment] = useState(filterComment)

  const handleSearchIconClick = () => {
    setIsFilterExpanded(!isFilterExpanded)
  }

  const handleApplyFilters = () => {
    onFilterPayeeChange(localFilterPayee)
    onFilterCommentChange(localFilterComment)
    setIsFilterExpanded(false)
  }

  const displayFilters = () => {
    let filters = []

    if (filterPayee) {
      filters.push(`Payee: ${filterPayee}`)
    }

    if (filterComment) {
      filters.push(`Comment: ${filterComment}`)
    }

    return filters.join(', ')
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1, marginRight: '8px' }}>
          <AccountSelect value={filterAccountName} onChange={onFilterAccountNameChange} />
        </div>
        <button onClick={handleSearchIconClick} style={{ background: 'none', border: 'none' }}>
          {/* @ts-ignore */}
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </div>
      {isFilterExpanded ? (
        <div style={{ marginTop: '10px' }}>
          <input
            value={localFilterPayee}
            placeholder="Filter by Payee"
            onChange={(e) => setLocalFilterPayee(e.target.value)}
          />
          <input
            value={localFilterComment}
            placeholder="Filter by Comment"
            onChange={(e) => setLocalFilterComment(e.target.value)}
          />
          <button onClick={handleApplyFilters}>Search</button>
        </div>
      ) : (
        <div style={{ color: '#777' }}>{displayFilters()}</div>
      )}
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
        }}
      >
        <TransactionsContainer transactions={transactions} onRemove={onRemove} />
      </div>
    </div>
  )
}
