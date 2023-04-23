import { useState } from 'react'
import { convertToLocaleTime } from './date-utils'
import { TransactionDTO } from './Transaction'
import { convertCurrencyCodeToSymbol, formatFinancialAmount } from './finance-utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

interface Props {
  transaction: TransactionDTO
  onEdit: (id: string) => void
  showRemoveButton: boolean
  onRemove: (id: string) => void
  onClose: () => void
}

export default function TransactionInfoModal({
  transaction,
  onClose,
  showRemoveButton,
  onRemove,
  onEdit,
}: Props) {
  const [isRemoveActive, setIsRemoveActive] = useState(false)
  if (!transaction) return null

  const { datetime, account, category, type, amount, currency, payee, comment } = transaction

  const datetimeString = convertToLocaleTime(datetime)

  function handleRemoveClick(transactionId: string) {
    if (isRemoveActive) {
      onRemove(transactionId)
    } else {
      setIsRemoveActive(true)
    }
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card p-2">
        <header className="modal-card-head">
          <p className="modal-card-title">Запись</p>
          <button className="delete" onClick={onClose} aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <p>
            <strong>Дата и время:</strong> {datetimeString}
          </p>
          <p>
            <strong>Счёт:</strong> {account}
          </p>
          <p>
            <strong>Категория:</strong> {category}
          </p>
          <p>
            <strong>Тип:</strong> {type}
          </p>
          <p>
            <strong>Сумма:</strong> {formatFinancialAmount(parseFloat(amount))}{' '}
            {convertCurrencyCodeToSymbol(currency)}
          </p>
          <p>
            <strong>Получатель:</strong> {payee}
          </p>
          <p>
            <strong>Комментарий:</strong> {comment}
          </p>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-info" onClick={() => onEdit(transaction._id)}>
            <FontAwesomeIcon icon={faEdit} style={{ color: 'white' }} />
          </button>
          {showRemoveButton && (
            <button
              className="button is-danger"
              style={{ marginLeft: 'auto' }}
              onClick={() => handleRemoveClick(transaction._id)}
            >
              {isRemoveActive ? (
                <span>Подтвердите удаление</span>
              ) : (
                <FontAwesomeIcon icon={faTrash} style={{ color: 'white' }} />
              )}
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
