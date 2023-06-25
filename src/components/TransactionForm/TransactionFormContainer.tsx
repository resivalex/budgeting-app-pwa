import { useState, useMemo, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { useEffect } from 'react'
import {
  TransactionDTO,
  AccountDetailsDTO,
  CategoryExpansionsDTO,
  AccountPropertiesDTO,
  ColoredAccountDetailsDTO,
  TransactionsAggregations,
} from '@/types'
import {
  convertCurrencyCodeToSymbol,
  convertToLocaleTime,
  convertToUtcTime,
  mergeAccountDetailsAndProperties,
  reactSelectColorStyles,
} from '@/utils'
import TransactionForm from './TransactionForm'
import StepByStepTransactionForm from './StepByStepTransactionForm'
import { useNavigate, useParams } from 'react-router-dom'
import { TransactionAggregator } from '@/services'
import Select from 'react-select'

function useCategoryExtensions(localStorageCategoryExpansions: string): { [name: string]: string } {
  return useMemo(() => {
    const categoryExpansions: CategoryExpansionsDTO = localStorageCategoryExpansions
      ? JSON.parse(localStorageCategoryExpansions)
      : { expansions: [] }

    const categoryNameToExtendedMap: { [name: string]: string } = {}
    categoryExpansions.expansions.forEach((e) => {
      categoryNameToExtendedMap[e.name] = e.expandedName
    })

    return categoryNameToExtendedMap
  }, [localStorageCategoryExpansions])
}

function useAccounts(
  localStorageAccountProperties: string,
  accountDetails: AccountDetailsDTO[]
): ColoredAccountDetailsDTO[] {
  return useMemo(() => {
    const accountProperties: AccountPropertiesDTO = localStorageAccountProperties
      ? JSON.parse(localStorageAccountProperties)
      : { accounts: [] }

    return mergeAccountDetailsAndProperties(accountDetails, accountProperties)
  }, [accountDetails, localStorageAccountProperties])
}

export default function TransactionFormContainer({
  transactions,
  transactionsAggregations,
  onApply,
}: {
  transactions: TransactionDTO[]
  transactionsAggregations: TransactionsAggregations
  onApply: (t: TransactionDTO) => void
}) {
  const [type, setType] = useState<'income' | 'expense' | 'transfer' | ''>('expense')
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

  const appCategories: string[] = transactionsAggregations.categories
  const appCurrencies: string[] = transactionsAggregations.currencies
  const appPayees: string[] = transactionsAggregations.payees
  const appComments: string[] = transactionsAggregations.comments
  const accountDetails = transactionsAggregations.accountDetails
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const curTransaction = transactions.find((t: TransactionDTO) => t._id === transactionId)

  const categoryExtensions = useCategoryExtensions(localStorage.categoryExpansions || '')
  const categoryOptions = useMemo(
    () =>
      appCategories.map((c) => ({
        value: c,
        label: categoryExtensions[c] || c,
      })),
    [appCategories, categoryExtensions]
  )

  const accounts = useAccounts(localStorage.accountProperties || '', accountDetails)

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
    setType('')
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

  const getAvailableCurrenciesAndAccounts = useCallback(
    (type: string, currency: string) => {
      const availableCurrencies =
        type === 'transfer'
          ? appCurrencies.filter((c) => accounts.filter((a) => a.currency === c).length > 1)
          : appCurrencies
      const availableAccounts = accounts.filter((a) => a.currency === currency)

      return {
        availableCurrencies,
        availableAccounts,
      }
    },
    [accounts, appCurrencies]
  )

  const { availableCurrencies, availableAccounts } = useMemo(
    () => getAvailableCurrenciesAndAccounts(type, currency),
    [type, currency, getAvailableCurrenciesAndAccounts]
  )

  const AccountSelect = useMemo(
    () =>
      ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
        const accountOptions = availableAccounts.map((a) => ({
          value: a.account,
          label: `[ ${convertCurrencyCodeToSymbol(a.currency)} ] ${a.account}`,
          color: a.color,
        }))
        return (
          <Select
            className="basic-single"
            classNamePrefix="select"
            value={accountOptions.find((option) => option.value === value) || null}
            onChange={(selectedOption) => {
              if (!selectedOption) return
              onChange(selectedOption.value)
            }}
            options={accountOptions}
            isSearchable={false}
            placeholder="Выберите из списка..."
            styles={reactSelectColorStyles}
          />
        )
      },
    [availableAccounts]
  )

  if (accounts.length === 0) {
    return null
  }

  const handleDatetimeChange = (value: Date | null) => {
    if (value) {
      setDatetime(value.toISOString())
    } else {
      setDatetime(new Date().toISOString())
    }
  }

  const isValid = !!(
    datetime &&
    amount &&
    account &&
    (type === 'transfer' || category) &&
    type &&
    currency &&
    (type !== 'transfer' || payeeTransferAccount)
  )

  const handleSave = () => {
    if (type === '') {
      return
    }
    if (!isValid) {
      return
    }
    onApply({
      _id: transactionId || uuidv4(),
      datetime: convertToUtcTime(datetime),
      account: account,
      category: type === 'transfer' ? '' : category,
      type: type,
      amount: (parseFloat(amount) || 0).toFixed(2),
      currency: currency,
      payee: type === 'transfer' ? payeeTransferAccount : payee,
      comment: comment,
    })
  }

  const handleCategoryChange = (category: string) => {
    setCategory(category)
    const transactionAggregator = new TransactionAggregator(transactions)
    const payeeSuggestions = transactionAggregator.getRecentPayeesByCategory(category)
    setPayeeSuggestions(payeeSuggestions)
    const commentSuggestions = transactionAggregator.getRecentCommentsByCategory(category)
    setCommentSuggestions(commentSuggestions)
  }

  function adjustCurrencyAndAccounts(type: string, currency: string) {
    const { availableCurrencies, availableAccounts } = getAvailableCurrenciesAndAccounts(
      type,
      currency
    )
    if (!_.includes(availableCurrencies, currency)) {
      setCurrency('')
    }
    if (
      !_.includes(
        _.map(availableAccounts, (a) => a.account),
        account
      )
    ) {
      setAccount('')
    }
    if (
      !_.includes(
        _.map(availableAccounts, (a) => a.account),
        payeeTransferAccount
      )
    ) {
      setPayeeTransferAccount('')
    }
  }

  const handleTypeChange = (type: 'income' | 'expense' | 'transfer') => {
    setType(type)
    adjustCurrencyAndAccounts(type, currency)
  }

  const handleAmountChange = (amount: string) => {
    setAmount(amount)
  }

  const handlePayeeChange = (payee: string) => {
    setPayee(payee)
  }

  const handlePayeeTransferAccountChange = (value: string) => {
    setPayeeTransferAccount(value)
    if (account === value) {
      setAccount(payeeTransferAccount)
    }
  }

  const handleCommentChange = (comment: string) => {
    setComment(comment)
  }

  const handleAccountChange = (value: string) => {
    setAccount(value)
    if (payeeTransferAccount === value) {
      setPayeeTransferAccount(account)
    }
  }

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency)
    adjustCurrencyAndAccounts(type, currency)
  }

  const viewDatetime = new Date(datetime)
  const payees = category ? payeeSuggestions : appPayees
  const comments = category ? commentSuggestions : appComments

  const isStepByStep = false
  const TransactionFormComponent = isStepByStep ? StepByStepTransactionForm : TransactionForm

  return (
    <TransactionFormComponent
      // Functional components
      AccountSelect={AccountSelect}
      // Basic transaction details
      type={type}
      amount={amount}
      account={account}
      currency={currency}
      category={category}
      payee={payee}
      payeeTransferAccount={payeeTransferAccount}
      comment={comment}
      datetime={viewDatetime}
      // Event handlers for basic transaction details
      onTypeChange={handleTypeChange}
      onAmountChange={handleAmountChange}
      onAccountChange={handleAccountChange}
      onCategoryChange={handleCategoryChange}
      onPayeeChange={handlePayeeChange}
      onPayeeTransferAccountChange={handlePayeeTransferAccountChange}
      onCommentChange={handleCommentChange}
      onDatetimeChange={handleDatetimeChange}
      // Dropdown options
      accounts={isStepByStep ? availableAccounts : []}
      categoryOptions={categoryOptions}
      currencies={availableCurrencies}
      payees={payees}
      comments={comments}
      // Event handlers for dropdown options
      onCurrencyChange={handleCurrencyChange}
      // Validation and Save event
      isValid={isValid}
      onSave={handleSave}
    />
  )
}
