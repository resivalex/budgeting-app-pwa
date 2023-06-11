import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { useEffect } from 'react'
import {
  TransactionDTO,
  AccountDetailsDTO,
  CategoryExpansionsDTO,
  AccountPropertiesDTO,
  ColoredAccountDetailsDTO,
} from '@/types'
import { convertToLocaleTime, convertToUtcTime, mergeAccountDetailsAndProperties } from '@/utils'
import TransactionForm from './TransactionForm'
import StepByStepTransactionForm from './StepByStepTransactionForm'
import { useAppSelector } from '@/redux/appSlice'
import { setAccountName } from '@/redux/transactionFiltersSlice'
import { resetFocusedTransactionId } from '@/redux/transactionsSlice'
import { useNavigate, useParams } from 'react-router-dom'
import TransactionAggregator from '@/redux/TransactionAggregator'

interface Props {
  transactionId?: string
  onApply: (t: TransactionDTO) => void
}

export default function TransactionFormContainer({ onApply }: Props) {
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState('')
  const [payeeTransferAccount, setPayeeTransferAccount] = useState('')
  const [payee, setPayee] = useState('')
  const [comment, setComment] = useState('')
  const [datetime, setDatetime] = useState(new Date().toISOString())
  const [payeeSuggestions, setPayeeSuggestions] = useState<string[]>([])
  const [commentSuggestions, setCommentSuggestions] = useState<string[]>([])

  const dispatch = useDispatch()
  const accountDetails: AccountDetailsDTO[] = useAppSelector((state) => state.accountDetails)
  const appCategories: string[] = useAppSelector((state) => state.categories)
  const appCurrencies: string[] = useAppSelector((state) => state.currencies)
  const appPayees: string[] = useAppSelector((state) => state.payees)
  const appTransactions: TransactionDTO[] = useAppSelector((state) => state.transactions)
  const appComments: string[] = useAppSelector((state) => state.comments)
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const curTransaction = useAppSelector((state) => state.transactions).find(
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

  const initializeFormFromTransaction = (t: TransactionDTO) => {
    setType(t.type)
    setAmount(`${parseFloat(t.amount)}`.replace(',', '.'))
    setAccount(t.account)
    setCurrency(t.currency)
    setCategory(t.category)
    if (t.type === 'transfer') {
      setPayeeTransferAccount(t.payee)
    } else {
      setPayee(t.payee)
    }
    setComment(t.comment)
    setDatetime(convertToLocaleTime(t.datetime))
  }

  useEffect(() => {
    if (!transactionId) {
      return
    }
    if (curTransaction) {
      initializeFormFromTransaction(curTransaction)
    } else {
      navigate('/', { replace: true })
    }
  }, [navigate, curTransaction, transactionId])

  const resetForm = () => {
    setType('expense')
    setAmount('')
    setAccount('')
    setCurrency('')
    setCategory('')
    setPayee('')
    setPayeeTransferAccount('')
    setComment('')
    setDatetime(new Date().toISOString())
  }

  useEffect(() => {
    if (!transactionId) {
      resetForm()
    }
  }, [transactionId])

  if (accounts.length === 0) {
    return null
  }

  const availableCurrencies =
    type === 'transfer'
      ? appCurrencies.filter((c) => accounts.filter((a) => a.currency === c).length > 1)
      : appCurrencies
  const fixedCurrency = _.includes(availableCurrencies, currency)
    ? currency
    : availableCurrencies[0]
  const currencyAccounts = accounts.filter((a) => a.currency === fixedCurrency)
  const fixedAccount = _.includes(
    currencyAccounts.map((a) => a.account),
    account
  )
    ? account
    : currencyAccounts[0].account
  const fixedCategory = _.includes(appCategories, category) ? category : ''
  let fixedPayeeTransferAccount = payeeTransferAccount
  if (
    !_.includes(
      currencyAccounts.map((a) => a.account),
      payeeTransferAccount
    )
  ) {
    fixedPayeeTransferAccount = currencyAccounts[0].account
  }
  if (type === 'transfer' && fixedPayeeTransferAccount === fixedAccount) {
    fixedPayeeTransferAccount = currencyAccounts[1].account
  }

  const handleDatetimeChange = (value: Date | null) => {
    if (value) {
      setDatetime(value.toISOString())
    } else {
      setDatetime(new Date().toISOString())
    }
  }

  function setAccountAwareOfPayeeTransferAccount(value: string) {
    if (payeeTransferAccount === value) {
      setPayeeTransferAccount(account)
    }
    setAccount(value)
  }

  function setPayeeTransferAccountAwareOfAccount(value: string) {
    if (account === value) {
      setAccount(payeeTransferAccount)
    }
    setPayeeTransferAccount(value)
  }

  const isValid = !!(
    datetime &&
    amount &&
    fixedAccount &&
    (type === 'transfer' || fixedCategory) &&
    type &&
    fixedCurrency &&
    (type !== 'transfer' || fixedPayeeTransferAccount)
  )

  const handleSave = () => {
    onApply({
      _id: transactionId || uuidv4(),
      datetime: convertToUtcTime(datetime),
      account: fixedAccount,
      category: type === 'transfer' ? '' : fixedCategory,
      type: type,
      amount: (parseFloat(amount) || 0).toFixed(2),
      currency: fixedCurrency,
      payee: type === 'transfer' ? fixedPayeeTransferAccount : payee,
      comment: comment,
    })
    if (!transactionId) {
      dispatch(setAccountName(fixedAccount))
    }
    dispatch(resetFocusedTransactionId())
  }

  const handleCategoryChange = (category: string) => {
    const restoredCategory = categoryNameFromExtendedMap[category] || category
    setCategory(restoredCategory)
    const transactionAggregator = new TransactionAggregator(appTransactions)
    const payeeSuggestions = transactionAggregator.getRecentPayeesByCategory(restoredCategory)
    setPayeeSuggestions(payeeSuggestions)
    const commentSuggestions = transactionAggregator.getRecentCommentsByCategory(restoredCategory)
    setCommentSuggestions(commentSuggestions)
  }

  const handleTypeChange = (type: 'income' | 'expense' | 'transfer') => {
    setType(type)
  }

  const handleAmountChange = (amount: string) => {
    setAmount(amount)
  }

  const handlePayeeChange = (payee: string) => {
    setPayee(payee)
  }

  const handlePayeeTransferAccountChange = (payeeTransferAccount: string) => {
    setPayeeTransferAccountAwareOfAccount(payeeTransferAccount)
  }

  const handleCommentChange = (comment: string) => {
    setComment(comment)
  }

  const handleAccountChange = (account: string) => {
    setAccountAwareOfPayeeTransferAccount(account)
  }

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency)
  }

  const viewDatetime = new Date(datetime)
  const payees = fixedCategory ? payeeSuggestions : appPayees
  const comments = fixedCategory ? commentSuggestions : appComments

  const expandedCategory = categoryNameToExtendedMap[fixedCategory] || fixedCategory
  const expandedCategories = appCategories.map((c) => categoryNameToExtendedMap[c] || c)

  const isStepByStep = false
  const TransactionFormComponent = isStepByStep ? StepByStepTransactionForm : TransactionForm

  return (
    <TransactionFormComponent
      type={type}
      onTypeChange={handleTypeChange}
      amount={amount}
      onAmountChange={handleAmountChange}
      account={fixedAccount}
      currency={fixedCurrency}
      category={expandedCategory}
      onCategoryChange={handleCategoryChange}
      payee={payee}
      onPayeeChange={handlePayeeChange}
      payeeTransferAccount={fixedPayeeTransferAccount}
      onPayeeTransferAccountChange={handlePayeeTransferAccountChange}
      comment={comment}
      onCommentChange={handleCommentChange}
      datetime={viewDatetime}
      onAccountChange={handleAccountChange}
      onDatetimeChange={handleDatetimeChange}
      onSave={handleSave}
      accounts={currencyAccounts}
      categories={expandedCategories}
      currencies={availableCurrencies}
      onCurrencyChange={handleCurrencyChange}
      isValid={isValid}
      payees={payees}
      comments={comments}
    />
  )
}
