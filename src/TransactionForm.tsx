import { useState } from 'react'
import { TransactionDTO } from './Transaction'
import { convertToUtcTime } from './date-utils'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  onAdd: (t: TransactionDTO) => void
  accounts: { account: string; currency: string }[]
  categories: string[]
}

export default function Transaction({ onAdd, accounts, categories }: Props) {
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('')
  const [currency, setCurrency] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [payee, setPayee] = useState('')
  const [comment, setComment] = useState('')

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAccount = accounts.find((a) => a.account === e.target.value)

    if (selectedAccount) {
      setAccount(selectedAccount.account)
      setCurrency(selectedAccount.currency)
    }
  }

  return (
    <div className="field p-2">
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="number"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <select className="input" onChange={handleAccountChange}>
            <option value="">Select Account</option>
            {accounts.map((a) => (
              <option key={a.account} value={a.account}>
                {`${a.account} (${a.currency})`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <select className="input" onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <select
            className="input"
            onChange={(e) => {
              const type = e.target.value as 'income' | 'expense'
              setType(type)
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Payee"
            onChange={(e) => setPayee(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Comment"
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button
            className="button is-info"
            onClick={() =>
              onAdd({
                _id: uuidv4(),
                datetime: convertToUtcTime(new Date()),
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
    </div>
  )
}
