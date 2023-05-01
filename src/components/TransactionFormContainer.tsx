import { useSelector, useDispatch } from 'react-redux'
import { TransactionDTO, AccountDetailsDTO, CategoryExpansionsDTO } from '../types'
import { convertToLocaleTime, convertToUtcTime } from '../utils/date-utils'
import { v4 as uuidv4 } from 'uuid'
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
} from '../redux/transactionFormSlice'
import { useAppSelector } from '../redux/appSlice'
import _ from 'lodash'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface Props {
  transactionId?: string
  onApply: (t: TransactionDTO) => void
}

export default function TransactionFormContainer({ onApply }: Props) {
  const dispatch = useDispatch()
  const transactionForm = useSelector(selectTransactionForm)
  const accounts: AccountDetailsDTO[] = useAppSelector((state) => state.accountDetails)
  const categories: string[] = useAppSelector((state) => state.categories)
  const currencies: string[] = useAppSelector((state) => state.currencies)
  const payees: string[] = useAppSelector((state) => state.payees)
  const comments: string[] = useAppSelector((state) => state.comments)
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const transaction = useAppSelector((state) => state.transactions).find(
    (t: TransactionDTO) => t._id === transactionId
  )
  const categoryExpansions: CategoryExpansionsDTO = window.localStorage.categoryExpansions
    ? JSON.parse(window.localStorage.categoryExpansions)
    : { expansions: [] }
  const categoryNameToExtendedMap: { [name: string]: string } = {}
  const categoryNameFromExtendedMap: { [extendedName: string]: string } = {}
  categoryExpansions.expansions.forEach((e) => {
    categoryNameToExtendedMap[e.name] = e.expandedName
    categoryNameFromExtendedMap[e.expandedName] = e.name
  })

  useEffect(() => {
    if (transactionId) {
      if (transaction) {
        dispatch(setType(transaction.type))
        dispatch(setAmount(`${parseFloat(transaction.amount)}`.replace(',', '.')))
        dispatch(setAccount(transaction.account))
        dispatch(setCurrency(transaction.currency))
        dispatch(setCategory(transaction.category))
        dispatch(setPayee(transaction.payee))
        dispatch(setPayeeTransferAccount(transaction.payeeTransferAccount))
        dispatch(setComment(transaction.comment))
        dispatch(setDatetime(convertToLocaleTime(transaction.datetime)))
      } else {
        navigate('/', { replace: true })
      }
    } else {
      dispatch(reset())
    }
  }, [dispatch, navigate, transaction, transactionId])

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

  const handleSave = () => {
    onApply({
      _id: transactionId || uuidv4(),
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

  const expandedCategory = categoryNameToExtendedMap[category] || category
  const expandedCategories = categories.map((c) => categoryNameToExtendedMap[c] || c)

  return (
    <TransactionForm
      type={type}
      onTypeChange={(type: 'income' | 'expense' | 'transfer') => dispatch(setType(type))}
      amount={transactionForm.amount}
      onAmountChange={(amount: string) => dispatch(setAmount(amount))}
      account={account}
      currency={currency}
      category={expandedCategory}
      onCategoryChange={(category: string) => {
        const fixedCategory = categoryNameFromExtendedMap[category] || category
        dispatch(setCategory(fixedCategory))
      }}
      payee={transactionForm.payee}
      onPayeeChange={(payee: string) => dispatch(setPayee(payee))}
      payeeTransferAccount={payeeTransferAccount}
      onPayeeTransferAccountChange={handlePayeeTransferAccountChange}
      comment={transactionForm.comment}
      onCommentChange={(comment: string) => dispatch(setComment(comment))}
      datetime={new Date(transactionForm.datetime)}
      onAccountChange={(account) => dispatch(setAccount(account))}
      onDatetimeChange={handleDatetimeChange}
      onSave={handleSave}
      accounts={currencyAccounts}
      categories={expandedCategories}
      currencies={availableCurrencies}
      onCurrencyChange={(currency: string) => dispatch(setCurrency(currency))}
      isValid={isValid}
      payees={payees}
      comments={comments}
    />
  )
}
