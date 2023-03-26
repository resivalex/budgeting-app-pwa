import { useState } from 'react'
import { TransactionDTO } from './Transaction'

type Props = {
  onAdd: (t: TransactionDTO) => void
}

export default function Transaction({ onAdd }: Props) {
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense')
  const [currency, setCurrency] = useState('')
  const [payee, setPayee] = useState('')
  const [comment, setComment] = useState('')

  return (
    <div className="field has-addons p-2">
      <div className="control">
        <input
          className="input"
          type="number"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Account"
          onChange={(e) => setAccount(e.target.value)}
        />
      </div>
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="control">
        <select
          className="input"
          onChange={(e) => {
            const type = e.target.value as 'income' | 'expense' | 'transfer'
            setType(type)
          }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Currency"
          onChange={(e) => setCurrency(e.target.value)}
        />
      </div>
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Payee"
          onChange={(e) => setPayee(e.target.value)}
        />
      </div>
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Comment"
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="control">
        <button
          className="button is-info"
          onClick={() =>
            onAdd({
              datetime: new Date().toISOString().substring(0, 19).replace('T', ' '),
              account: account,
              category: category,
              type: type,
              amount: `${amount}.00`,
              currency: currency,
              payee: payee,
              comment: comment,
            })
          }
        >
          ADD
        </button>
      </div>
    </div>
  )
}
