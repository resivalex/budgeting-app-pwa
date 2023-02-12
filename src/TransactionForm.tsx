import { useState } from 'react'
import { TransactionDTO } from './Transaction'

type Props = {
  onAdd: (t: TransactionDTO) => void
}

export default function Transaction({ onAdd }: Props) {
  const [amount, setAmount] = useState('')

  return (
    <div>
      <input type="number" onChange={(e) => setAmount(e.target.value)} />
      <button
        onClick={() =>
          onAdd({
            datetime: new Date().toISOString().substring(0, 19).replace('T', ' '),
            account: 'Ваня Карта',
            category: 'Кафе',
            type: 'expense',
            amount: `${amount}.00`,
            currency: 'RUB',
            payee: 'Тестовое',
            comment: 'На что-то',
          })
        }
      >
        ADD
      </button>
    </div>
  )
}
