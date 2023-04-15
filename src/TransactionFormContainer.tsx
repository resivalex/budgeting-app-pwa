import { useState } from 'react'
import { TransactionDTO } from './Transaction'
import { convertToUtcTime } from './date-utils'
import { v4 as uuidv4 } from 'uuid'
import { AccountDetails } from './TransactionAggregator'
import TransactionForm from "./TransactionForm";

type Props = {
  onAdd: (t: TransactionDTO) => void
  accounts: AccountDetails[]
  categories: string[]
}

export default function TransactionFormContainer({ onAdd, accounts, categories }: Props) {
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

  const handleAdd = () => {
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

  return (
    <TransactionForm
      type={type}
      setType={setType}
      amount={amount}
      setAmount={setAmount}
      account={account}
      currency={currency}
      category={category}
      setCategory={setCategory}
      payee={payee}
      setPayee={setPayee}
      comment={comment}
      setComment={setComment}
      datetime={datetime}
      onAccountChange={handleAccountChange}
      onDatetimeChange={handleDatetimeChange}
      onAdd={handleAdd}
      accounts={accounts}
      categories={categories}
    />
  )
}
