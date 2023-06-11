import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import {
  typeAtom,
  amountAtom,
  currencyAtom,
  categoryAtom,
  accountAtom,
  payeeTransferAccountAtom,
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
  const [account, setAccount] = useAtom(accountAtom)
  const [payeeTransferAccount, setPayeeTransferAccount] = useAtom(payeeTransferAccountAtom)
  const [payee, setPayee] = useAtom(payeeAtom)
  const [comment, setComment] = useAtom(commentAtom)
  const [datetime, setDatetime] = useAtom(datetimeAtom)
  const [payeeSuggestions, setPayeeSuggestions] = useAtom(payeeSuggestionsAtom)
  const [commentSuggestions, setCommentSuggestions] = useAtom(commentSuggestionsAtom)

  const dispatch = useDispatch()
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
        setAccount(transaction.account)
        setCurrency(transaction.currency)
        setCategory(transaction.category)
        setPayee(transaction.payee)
        setPayeeTransferAccount(transaction.payeeTransferAccount)
        setComment(transaction.comment)
        setDatetime(convertToLocaleTime(transaction.datetime))
      } else {
        navigate('/', { replace: true })
      }
    } else {
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
  const fixedAccount = _.includes(
    currencyAccounts.map((a) => a.account),
    account
  )
    ? account
    : currencyAccounts[0].account
  const fixedCategory = _.includes(categories, category) ? category : ''
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
      account={fixedAccount}
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
      payeeTransferAccount={fixedPayeeTransferAccount}
      onPayeeTransferAccountChange={(value) => setPayeeTransferAccountAwareOfAccount(value)}
      comment={comment}
      onCommentChange={(comment: string) => setComment(comment)}
      datetime={new Date(datetime)}
      onAccountChange={(account) => setAccountAwareOfPayeeTransferAccount(account)}
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
