import { convertToLocaleTime } from './date-utils'
import { TransactionDTO } from './Transaction'
import { convertCurrencyCodeToSymbol, formatFinancialAmount } from './finance-utils'

interface Props {
  transaction: TransactionDTO
  onRemove: (id: string) => void
  onClose: () => void
}

export default function TransactionInfoModal({ transaction, onClose, onRemove }: Props) {
  if (!transaction) return null

  const { datetime, account, category, type, amount, currency, payee, comment } = transaction

  const datetimeString = convertToLocaleTime(datetime)

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card p-2">
        <header className="modal-card-head">
          <p className="modal-card-title">Transaction Info</p>
          <button className="delete" onClick={onClose} aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <p>
            <strong>Date:</strong> {datetimeString}
          </p>
          <p>
            <strong>Account:</strong> {account}
          </p>
          <p>
            <strong>Category:</strong> {category}
          </p>
          <p>
            <strong>Type:</strong> {type}
          </p>
          <p>
            <strong>Amount:</strong> {formatFinancialAmount(parseFloat(amount))}{' '}
            {convertCurrencyCodeToSymbol(currency)}
          </p>
          <p>
            <strong>Payee:</strong> {payee}
          </p>
          <p>
            <strong>Comment:</strong> {comment}
          </p>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-danger" onClick={() => onRemove(transaction._id)}>
            Remove
          </button>
          <button className="button" style={{ marginLeft: 'auto' }} onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}
