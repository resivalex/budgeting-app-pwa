import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import {
  typeAtom,
  amountAtom,
  currencyAtom,
  categoryAtom,
  payeeAtom,
  commentAtom,
  datetimeAtom,
  payeeSuggestionsAtom,
  commentSuggestionsAtom,
} from './atoms'
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
import {
  setAccount,
  setPayeeTransferAccount,
  selectTransactionForm,
  reset,
} from '@/redux/transactionFormSlice'
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
  const [type, setType] = useAtom(typeAtom)
  const [amount, setAmount] = useAtom(amountAtom)
  const [currency, setCurrency] = useAtom(currencyAtom)
  const [category, setCategory] = useAtom(categoryAtom)
  const [payee, setPayee] = useAtom(payeeAtom)
  const [comment, setComment] = useAtom(commentAtom)
  const [datetime, setDatetime] = useAtom(datetimeAtom)
  const [payeeSuggestions, setPayeeSuggestions] = useAtom(payeeSuggestionsAtom)
  const [commentSuggestions, setCommentSuggestions] = useAtom(commentSuggestionsAtom)

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
        setType(transaction.type)
        setAmount(`${parseFloat(transaction.amount)}`.replace(',', '.'))
        dispatch(setAccount(transaction.account))
        setCurrency(transaction.currency)
        setCategory(transaction.category)
        setPayee(transaction.payee)
        dispatch(setPayeeTransferAccount(transaction.payeeTransferAccount))
        setComment(transaction.comment)
        setDatetime(convertToLocaleTime(transaction.datetime))
      } else {
        navigate('/', { replace: true })
      }
    } else {
      setType('expense')
      setAmount('')
      setCurrency('')
      setCategory('')
      setPayee('')
      setComment('')
      setDatetime(new Date().toISOString())
      dispatch(reset())
    }
  }, [dispatch, navigate, transaction, transactionId])

  if (accounts.length === 0) {
    return null
  }

  const availableCurrencies =
    type === 'transfer'
      ? currencies.filter((c) => accounts.filter((a) => a.currency === c).length > 1)
      : currencies
  const fixedCurrency = _.includes(availableCurrencies, currency)
    ? currency
    : availableCurrencies[0]
  const currencyAccounts = accounts.filter((a) => a.currency === fixedCurrency)
  const account = _.includes(
    currencyAccounts.map((a) => a.account),
    transactionForm.account
  )
    ? transactionForm.account
    : currencyAccounts[0].account
  const fixedCategory = _.includes(categories, category) ? category : ''
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
      setDatetime(value.toISOString())
    } else {
      setDatetime(new Date().toISOString())
    }
  }

  const handlePayeeTransferAccountChange = (value: string) => {
    if (value === account) {
      dispatch(setAccount({ type: type, account: payeeTransferAccount }))
    }
    dispatch(setPayeeTransferAccount({ type: type, account: value }))
  }

  const isValid = !!(
    datetime &&
    amount &&
    account &&
    (type === 'transfer' || fixedCategory) &&
    type &&
    fixedCurrency &&
    (type !== 'transfer' || payeeTransferAccount)
  )

  const handleSave = () => {
    onApply({
      _id: transactionId || uuidv4(),
      datetime: convertToUtcTime(datetime),
      account: account,
      category: type === 'transfer' ? '' : fixedCategory,
      type: type,
      amount: (parseFloat(amount) || 0).toFixed(2),
      currency: fixedCurrency,
      payee: type === 'transfer' ? payeeTransferAccount : payee,
      comment: comment,
    })
    if (!transactionId) {
      dispatch(setAccountName(account))
    }
    dispatch(resetFocusedTransactionId())
  }

  const expandedCategory = categoryNameToExtendedMap[fixedCategory] || fixedCategory
  const expandedCategories = categories.map((c) => categoryNameToExtendedMap[c] || c)

  const isStepByStep = false
  const TransactionFormComponent = isStepByStep ? StepByStepTransactionForm : TransactionForm

  return (
    <TransactionFormComponent
      type={type}
      onTypeChange={(type: 'income' | 'expense' | 'transfer') => setType(type)}
      amount={amount}
      onAmountChange={(amount: string) => setAmount(amount)}
      account={account}
      currency={fixedCurrency}
      category={expandedCategory}
      onCategoryChange={(category: string) => {
        const restoredCategory = categoryNameFromExtendedMap[category] || category
        setCategory(restoredCategory)
        const transactionAggregator = new TransactionAggregator(transactions)
        const payeeSuggestions = transactionAggregator.getRecentPayeesByCategory(restoredCategory)
        setPayeeSuggestions(payeeSuggestions)
        const commentSuggestions =
          transactionAggregator.getRecentCommentsByCategory(restoredCategory)
        setCommentSuggestions(commentSuggestions)
      }}
      payee={payee}
      onPayeeChange={(payee: string) => setPayee(payee)}
      payeeTransferAccount={payeeTransferAccount}
      onPayeeTransferAccountChange={handlePayeeTransferAccountChange}
      comment={comment}
      onCommentChange={(comment: string) => setComment(comment)}
      datetime={new Date(datetime)}
      onAccountChange={(account) => dispatch(setAccount({ type: type, account: account }))}
      onDatetimeChange={handleDatetimeChange}
      onSave={handleSave}
      accounts={currencyAccounts}
      categories={expandedCategories}
      currencies={availableCurrencies}
      onCurrencyChange={(currency: string) => setCurrency(currency)}
      isValid={isValid}
      payees={fixedCategory ? payeeSuggestions : payees}
      comments={fixedCategory ? commentSuggestions : comments}
    />
  )
}
