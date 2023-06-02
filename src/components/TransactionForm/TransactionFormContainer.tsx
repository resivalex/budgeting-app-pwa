import { useSelector, useDispatch } from 'react-redux'
import {
  TransactionDTO,
  AccountDetailsDTO,
  CategoryExpansionsDTO,
  AccountPropertiesDTO,
  ColoredAccountDetailsDTO,
} from '@/types'
import { convertToLocaleTime, convertToUtcTime, mergeAccountDetailsAndProperties } from '@/utils'
import { v4 as uuidv4 } from 'uuid'
import TransactionForm from './TransactionForm'
import StepByStepTransactionForm from './StepByStepTransactionForm'
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
  setPayeeSuggestions,
  setCommentSuggestions,
  selectTransactionForm,
  reset,
} from '@/redux/transactionFormSlice'
import { useAppSelector } from '@/redux/appSlice'
import { setAccountName } from '@/redux/transactionFiltersSlice'
import { resetFocusedTransactionId } from '@/redux/transactionsSlice'
import _ from 'lodash'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TransactionAggregator from '@/redux/TransactionAggregator'

interface Props {
  transactionId?: string
  onApply: (t: TransactionDTO) => void
}

export default function TransactionFormContainer({ onApply }: Props) {
  const dispatch = useDispatch()
  const transactionForm = useSelector(selectTransactionForm)
  const accountDetails: AccountDetailsDTO[] = useAppSelector((state) => state.accountDetails)
  const categories: string[] = useAppSelector((state) => state.categories)
  const currencies: string[] = useAppSelector((state) => state.currencies)
  const payees: string[] = useAppSelector((state) => state.payees)
  const transactions: TransactionDTO[] = useAppSelector((state) => state.transactions)
  const comments: string[] = useAppSelector((state) => state.comments)
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const transaction = useAppSelector((state) => state.transactions).find(
    (t: TransactionDTO) => t._id === transactionId
  )
  const categoryExpansions: CategoryExpansionsDTO = localStorage.categoryExpansions
    ? JSON.parse(localStorage.categoryExpansions)
    : { expansions: [] }
  const categoryNameToExtendedMap: { [name: string]: string } = {}
  const categoryNameFromExtendedMap: { [extendedName: string]: string } = {}
  categoryExpansions.expansions.forEach((e) => {
    categoryNameToExtendedMap[e.name] = e.expandedName
    categoryNameFromExtendedMap[e.expandedName] = e.name
  })

  const accountProperties: AccountPropertiesDTO = localStorage.accountProperties
    ? JSON.parse(localStorage.accountProperties)
    : { accounts: [] }
  const accounts: ColoredAccountDetailsDTO[] = mergeAccountDetailsAndProperties(
    accountDetails,
    accountProperties
  )

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
  const category = _.includes(categories, transactionForm.category) ? transactionForm.category : ''
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
    (type === 'transfer' || category) &&
    type &&
    currency &&
    (type !== 'transfer' || payeeTransferAccount)
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
    if (!transactionId) {
      dispatch(setAccountName(account))
    }
    dispatch(resetFocusedTransactionId())
  }

  const expandedCategory = categoryNameToExtendedMap[category] || category
  const expandedCategories = categories.map((c) => categoryNameToExtendedMap[c] || c)

  const isStepByStep = false
  const TransactionFormComponent = isStepByStep ? StepByStepTransactionForm : TransactionForm

  return (
    <TransactionFormComponent
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
        const transactionAggregator = new TransactionAggregator(transactions)
        const payeeSuggestions = transactionAggregator.getRecentPayeesByCategory(fixedCategory)
        dispatch(setPayeeSuggestions(payeeSuggestions))
        const commentSuggestions = transactionAggregator.getRecentCommentsByCategory(fixedCategory)
        dispatch(setCommentSuggestions(commentSuggestions))
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
      payees={category ? transactionForm.payeeSuggestions : payees}
      comments={category ? transactionForm.commentSuggestions : comments}
    />
  )
}
