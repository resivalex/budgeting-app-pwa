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
  onRemove: (id: string) => void
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
        <button onClick={handleSearchIconClick}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      {isFilterExpanded && (
        <>
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
