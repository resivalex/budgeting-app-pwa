import { useState } from 'react'
import { convertToLocaleTime, convertCurrencyCodeToSymbol, formatFinancialAmount } from '@/utils'
import { TransactionDTO } from '@/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

interface Props {
  transaction: TransactionDTO
  onEdit: (id: string) => void
  onRemove: (id: string) => Promise<void>
  onClose: () => void
}

export default function TransactionInfoModal({ transaction, onClose, onRemove, onEdit }: Props) {
  const [isRemoveActive, setIsRemoveActive] = useState(false)
  if (!transaction) return null

  const { datetime, account, category, type, amount, currency, payee, comment } = transaction

  const datetimeString = convertToLocaleTime(datetime)

  async function handleRemoveClick(transactionId: string) {
    if (isRemoveActive) {
      await onRemove(transactionId)
    } else {
      setIsRemoveActive(true)
    }
  }

  function translateType(type: string) {
    if (type === 'expense') return 'Расход'
    if (type === 'income') return 'Доход'
    if (type === 'transfer') return 'Перевод'
    return type
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
            <strong>Тип:</strong> {translateType(type)}
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
            {/* @ts-ignore */}
            <FontAwesomeIcon icon={faEdit} style={{ color: 'white' }} />
          </button>

          <button
            className="button is-danger"
            style={{ marginLeft: 'auto' }}
            onClick={() => handleRemoveClick(transaction._id)}
          >
            {isRemoveActive ? (
              <span>Подтвердите удаление</span>
            ) : (
              // @ts-ignore
              <FontAwesomeIcon icon={faTrash} style={{ color: 'white' }} />
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}
