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
  setPayeeTransferAccount,
  setComment,
  setDatetime,
  selectTransactionForm,
  reset,
} from './redux/transactionFormSlice'
import { useAppSelector } from './redux/appSlice'
import _ from 'lodash'
import { useEffect } from 'react'

interface Props {
  onAdd: (t: TransactionDTO) => void
}

export default function TransactionFormContainer({ onAdd }: Props) {
  const dispatch = useDispatch()
  const transactionForm = useSelector(selectTransactionForm)
  const accounts: AccountDetails[] = useAppSelector((state) => state.accountDetails)
  const categories: string[] = useAppSelector((state) => state.categories)
  const currencies: string[] = useAppSelector((state) => state.currencies)
  const payees: string[] = useAppSelector((state) => state.payees)
  const comments: string[] = useAppSelector((state) => state.comments)

  useEffect(() => {
    // reset form on mount
    dispatch(reset())
  }, [dispatch])

  if (accounts.length === 0) {
    return null
  }

  const type = transactionForm.type
  const availableCurrencies =
    type === 'transfer'
      ? currencies.filter((c) => accounts.filter((a) => a.currency === c).length > 1)
      : currencies
  const currency = _.includes(availableCurrencies, transactionForm.currency)
    ? transactionForm.currency
    : availableCurrencies[0]
  const currencyAccounts = accounts.filter((a) => a.currency === currency)
  const account = _.includes(
    currencyAccounts.map((a) => a.account),
    transactionForm.account
  )
    ? transactionForm.account
    : currencyAccounts[0].account
  const category = _.includes(categories, transactionForm.category)
    ? transactionForm.category
    : categories[0]
  let payeeTransferAccount = transactionForm.payeeTransferAccount
  if (
    !_.includes(
      currencyAccounts.map((a) => a.account),
      payeeTransferAccount
    )
  ) {
    payeeTransferAccount = currencyAccounts[0].account
  }
  if (type === 'transfer' && payeeTransferAccount === account) {
    payeeTransferAccount = currencyAccounts[1].account
  }

  const handleDatetimeChange = (value: Date | null) => {
    if (value) {
      dispatch(setDatetime(value.toISOString()))
    } else {
      dispatch(setDatetime(new Date().toISOString()))
    }
  }

  const handlePayeeTransferAccountChange = (value: string) => {
    if (value === account) {
      dispatch(setAccount(payeeTransferAccount))
    }
    dispatch(setPayeeTransferAccount(value))
  }

  const isValid = !!(
    transactionForm.datetime &&
    transactionForm.amount &&
    account &&
    category &&
    type &&
    currency &&
    (type !== 'transfer' || payeeTransferAccount) &&
    payeeTransferAccount
  )

  const handleAdd = () => {
    onAdd({
      _id: uuidv4(),
      datetime: convertToUtcTime(transactionForm.datetime),
      account: account,
      category: type === 'transfer' ? '' : category,
      type: type,
      amount: (parseFloat(transactionForm.amount) || 0).toFixed(2),
      currency: currency,
      payee: type === 'transfer' ? payeeTransferAccount : transactionForm.payee,
      comment: transactionForm.comment,
    })
  }

  return (
    <TransactionForm
      type={type}
      onTypeChange={(type: 'income' | 'expense' | 'transfer') => dispatch(setType(type))}
      amount={transactionForm.amount}
      onAmountChange={(amount: string) => dispatch(setAmount(amount))}
      account={account}
      currency={currency}
      category={category}
      onCategoryChange={(category: string) => dispatch(setCategory(category))}
      payee={transactionForm.payee}
      onPayeeChange={(payee: string) => dispatch(setPayee(payee))}
      payeeTransferAccount={payeeTransferAccount}
      onPayeeTransferAccountChange={handlePayeeTransferAccountChange}
      comment={transactionForm.comment}
      onCommentChange={(comment: string) => dispatch(setComment(comment))}
      datetime={new Date(transactionForm.datetime)}
      onAccountChange={(account) => dispatch(setAccount(account))}
      onDatetimeChange={handleDatetimeChange}
      onAdd={handleAdd}
      accounts={currencyAccounts}
      categories={categories}
      currencies={availableCurrencies}
      onCurrencyChange={(currency: string) => dispatch(setCurrency(currency))}
      isValid={isValid}
      payees={payees}
      comments={comments}
    />
  )
}
