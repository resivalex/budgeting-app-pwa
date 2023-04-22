import Transactions from './Transactions'
import { Budget } from './redux/budgetsSlice'
import { formatFinancialAmount, convertCurrencyCodeToSymbol } from './finance-utils'

interface Props {
  budget: Budget
  onClose: () => void
}

export default function BudgetInfoModal({ budget, onClose }: Props) {
  if (!budget) return null

  const { name, currency, amount, categories, transactions, spentAmount } = budget

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
            <strong>Всего:</strong> {formatFinancialAmount(amount)}{' '}
            {convertCurrencyCodeToSymbol(currency)}
          </p>
          <p>
            <strong>Потрачено:</strong> {formatFinancialAmount(spentAmount)}{' '}
            {convertCurrencyCodeToSymbol(currency)}
          </p>
          <p>
            <strong>Осталось:</strong> {formatFinancialAmount(amount - spentAmount)}{' '}
            {convertCurrencyCodeToSymbol(currency)}
          </p>
          <p>
            <strong>Категории:</strong> {categories.join(', ')}
          </p>
          <div style={{ height: 300, display: 'flex' }}>
            <Transactions transactions={transactions} onRemove={() => {}} />
          </div>
        </section>
      </div>
    </div>
  )
}
