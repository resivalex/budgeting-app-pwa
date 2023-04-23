import { Budget } from './redux/budgetsSlice'
import { formatFinancialAmount, convertCurrencyCodeToSymbol } from './finance-utils'
import BudgetTransactionsContainer from './BudgetTransactionsContainer'

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
            Категории: <strong>{categories.join(', ')}</strong>
          </p>
          <div style={{ height: 300, display: 'flex' }}>
            <BudgetTransactionsContainer transactions={transactions} />
          </div>
        </section>
      </div>
    </div>
  )
}
