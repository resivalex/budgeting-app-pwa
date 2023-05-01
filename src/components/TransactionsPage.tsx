import { TransactionDTO } from './Transaction'
import TransactionsContainer from './TransactionsContainer'
import TransactionFiltersContainer from './TransactionFiltersContainer'

interface Props {
  transactions: TransactionDTO[]
  onRemove: (id: string) => void
}

export default function TransactionsPage({ transactions, onRemove }: Props) {
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
      <div style={{ flex: 1 }}>
        <TransactionFiltersContainer />
      </div>
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
