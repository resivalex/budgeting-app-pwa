import { useState } from 'react'
import { TransactionDTO } from './Transaction'
import { convertToUtcTime } from './date-utils'
import { v4 as uuidv4 } from 'uuid'
import { AccountDetails } from './TransactionAggregator'
import { convertCurrencyCodeToSymbol } from './finance-utils'
import DateTimePicker from 'react-datetime-picker'

type Props = {
  onAdd: (t: TransactionDTO) => void
  accounts: AccountDetails[]
  categories: string[]
}

export default function TransactionForm({ onAdd, accounts, categories }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('')
  const [currency, setCurrency] = useState('')
  const [category, setCategory] = useState('')
  const [payee, setPayee] = useState('')
  const [comment, setComment] = useState('')
  const [datetime, setDatetime] = useState(new Date())

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAccount = accounts.find((a) => a.account === e.target.value)

    if (selectedAccount) {
      setAccount(selectedAccount.account)
      setCurrency(selectedAccount.currency)
    }
  }

  const handleDatetimeChange = (value: Date | null) => {
    if (value) {
      setDatetime(value)
    } else {
      setDatetime(new Date())
    }
  }

  return (
    <div className="field p-2">
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
                {`[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`}
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
          <DateTimePicker
            onChange={handleDatetimeChange}
            value={datetime}
            format="y-MM-dd HH:mm:ss"
            disableClock
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
                datetime: convertToUtcTime(datetime),
                account: account,
                category: category,
                type: type,
                amount: (parseFloat(amount) || 0).toFixed(2),
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
