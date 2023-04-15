import { useSelector, useDispatch } from 'react-redux'
import { TransactionDTO } from './Transaction'
import { convertToUtcTime } from './date-utils'
import { v4 as uuidv4 } from 'uuid'
import { AccountDetails } from './TransactionAggregator'
import TransactionForm from './TransactionForm'
import {
  setType,
  setAmount,
  setAccount,
  setCurrency,
  setCategory,
  setPayee,
  setComment,
  setDatetime,
  selectTransactionForm,
} from './redux/transactionFormSlice'

type Props = {
  onAdd: (t: TransactionDTO) => void
  accounts: AccountDetails[]
  categories: string[]
}

export default function TransactionFormContainer({ onAdd, accounts, categories }: Props) {
  const dispatch = useDispatch()
  const transactionForm = useSelector(selectTransactionForm)

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAccount = accounts.find((a) => a.account === e.target.value)

    if (selectedAccount) {
      dispatch(setAccount(selectedAccount.account))
      dispatch(setCurrency(selectedAccount.currency))
    }
  }

  const handleDatetimeChange = (value: Date | null) => {
    if (value) {
      dispatch(setDatetime(value.toISOString()))
    } else {
      dispatch(setDatetime(new Date().toISOString()))
    }
  }

  const handleAdd = () => {
    onAdd({
      _id: uuidv4(),
      datetime: convertToUtcTime(transactionForm.datetime),
      account: transactionForm.account,
      category: transactionForm.category,
      type: transactionForm.type,
      amount: (parseFloat(transactionForm.amount) || 0).toFixed(2),
      currency: transactionForm.currency,
      payee: transactionForm.payee,
      comment: transactionForm.comment,
    })
  }

  return (
    <TransactionForm
      type={transactionForm.type}
      setType={(type: 'income' | 'expense') => dispatch(setType(type))}
      amount={transactionForm.amount}
      setAmount={(amount: string) => dispatch(setAmount(amount))}
      account={transactionForm.account}
      currency={transactionForm.currency}
      category={transactionForm.category}
      setCategory={(category: string) => dispatch(setCategory(category))}
      payee={transactionForm.payee}
      setPayee={(payee: string) => dispatch(setPayee(payee))}
      comment={transactionForm.comment}
      setComment={(comment: string) => dispatch(setComment(comment))}
      datetime={new Date(transactionForm.datetime)}
      onAccountChange={handleAccountChange}
      onDatetimeChange={handleDatetimeChange}
      onAdd={handleAdd}
      accounts={accounts}
      categories={categories}
    />
  )
}
