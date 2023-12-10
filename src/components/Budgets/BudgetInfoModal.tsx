import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { formatFinancialAmount, convertCurrencyCodeToSymbol } from '@/utils'
import { TransactionsContainer } from '@/components/Transactions'
import { BudgetDTO } from '@/types'

interface Props {
  budget: BudgetDTO
  onClose: () => void
  onTransactionRemove: (id: string) => Promise<void>
}

export default function BudgetInfoModal({ budget, onClose, onTransactionRemove }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  if (!budget) return null

  const { name, currency, amount, categories, transactions, spentAmount } = budget

  let displayCategories = categories.join(', ')
  const initialDisplayCategoryLength = 2
  if (categories.length > initialDisplayCategoryLength && !isExpanded) {
    displayCategories = categories.slice(0, initialDisplayCategoryLength).join(', ') + ' и ещё ' + (categories.length - initialDisplayCategoryLength) + '...'
  }
  const toggleButton = categories.length > initialDisplayCategoryLength && (
    <button onClick={() => setIsExpanded(!isExpanded)}>
      <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
    </button>
  )

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card p-2">
        <header className="modal-card-head">
          <p className="modal-card-title">{name}</p>
          <button className="delete" onClick={onClose} aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <p>
            Всего:{' '}
            <strong>
              {formatFinancialAmount(amount)} {convertCurrencyCodeToSymbol(currency)}
            </strong>
          </p>
          <p>
            Потрачено:{' '}
            <strong>
              {formatFinancialAmount(spentAmount)} {convertCurrencyCodeToSymbol(currency)}
            </strong>
          </p>
          <p>
            Осталось:{' '}
            <strong>
              {formatFinancialAmount(amount - spentAmount)} {convertCurrencyCodeToSymbol(currency)}
            </strong>
          </p>
          <p>
            Категории: <strong>{displayCategories}</strong>
            {' '}{toggleButton}
          </p>
          <div style={{ height: 300, display: 'flex' }}>
            <TransactionsContainer transactions={transactions} onRemove={onTransactionRemove} />
          </div>
        </section>
      </div>
    </div>
  )
}
