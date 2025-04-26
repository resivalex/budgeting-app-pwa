import { useState, useMemo, FC, Ref, forwardRef, useImperativeHandle, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { useEffect } from 'react'
import { TransactionDTO, CategoryExpansionsDTO, TransactionsAggregations } from '@/types'
import { convertToLocaleTime, convertToUtcTime } from '@/utils'
import StepByStepTransactionForm from './StepByStepTransactionForm'
import { useNavigate, useParams } from 'react-router-dom'
import { TransactionAggregator } from '@/services'
import { useColoredAccounts } from '@/utils'

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

export default function TransactionFormContainer({
  LimitedAccountSelect,
  transactions,
  transactionsAggregations,
  onApply,
}: {
  LimitedAccountSelect: FC<{
    value: string
    onChange: (value: string) => void
    availableNames: string[]
    ref?: Ref<{ focus: () => void }>
  }>
  transactions: TransactionDTO[]
  transactionsAggregations: TransactionsAggregations
  onApply: (t: TransactionDTO) => Promise<void>
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

  const coloredAccounts = useColoredAccounts(localStorage.accountProperties || '', accountDetails)

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

  const getAvailableCurrenciesAndAccounts = (type: string, currency: string) => {
    const availableCurrencies =
      type === 'transfer'
        ? appCurrencies.filter((c) => coloredAccounts.filter((a) => a.currency === c).length > 1)
        : appCurrencies
    const availableColoredAccounts = coloredAccounts.filter((a) => a.currency === currency)

    return {
      availableCurrencies,
      availableColoredAccounts,
    }
  }

  const { availableCurrencies } = getAvailableCurrenciesAndAccounts(type, currency)

  const availableColoredAccounts = useMemo(() => {
    return coloredAccounts.filter((a) => a.currency === currency)
  }, [coloredAccounts, currency])

  const availableAccountNames = useMemo(
    () => availableColoredAccounts.map((a) => a.account),
    [availableColoredAccounts]
  )

  const AccountSelect: FC<{
    value: string
    onChange: (value: string) => void
    ref?: Ref<{ focus: () => void }>
  }> = useMemo(
    () =>
      forwardRef(({ value, onChange }: { value: string; onChange: (v: string) => void }, ref) => {
        const limitedAccountSelectRef = useRef<any>(null)

        useImperativeHandle(ref, () => ({
          focus: () => {
            if (limitedAccountSelectRef.current && limitedAccountSelectRef.current.focus) {
              limitedAccountSelectRef.current.focus()
            }
          },
        }))

        return (
          <LimitedAccountSelect
            ref={limitedAccountSelectRef}
            value={value}
            onChange={onChange}
            availableNames={availableAccountNames}
          />
        )
      }),
    [availableAccountNames]
  )

  const payees = useMemo(() => {
    if (!category) {
      return appPayees
    }
    const transactionAggregator = new TransactionAggregator(transactions)
    return transactionAggregator.getRecentPayeesByCategory(category)
  }, [category, transactions, appPayees])

  const comments = useMemo(() => {
    if (!category) {
      return appComments
    }
    const transactionAggregator = new TransactionAggregator(transactions)
    return transactionAggregator.getRecentCommentsByCategory(category)
  }, [category, transactions, appComments])

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

  const handleSave = async () => {
    if (type === '') {
      return
    }
    if (!isValid) {
      return
    }
    await onApply({
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

  const adjustCurrencyAndAccounts = (type: string, currency: string) => {
    const { availableCurrencies, availableColoredAccounts } = getAvailableCurrenciesAndAccounts(
      type,
      currency
    )
    if (!_.includes(availableCurrencies, currency)) {
      setCurrency('')
    }
    if (
      !_.includes(
        availableColoredAccounts.map((a) => a.account),
        account
      )
    ) {
      setAccount('')
    }
    if (
      !_.includes(
        availableColoredAccounts.map((a) => a.account),
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

  const handleAmountChange = (amount: string) => setAmount(amount)

  const handlePayeeChange = (payee: string) => setPayee(payee)

  const handlePayeeTransferAccountChange = (value: string) => {
    setPayeeTransferAccount(value)
    if (account === value) {
      setAccount(payeeTransferAccount)
    }
  }

  const handleCommentChange = (comment: string) => setComment(comment)

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

  const handleCategoryChange = (category: string) => {
    setCategory(category)
  }

  const viewDatetime = new Date(datetime)

  if (coloredAccounts.length === 0) {
    return null
  }

  return (
    <StepByStepTransactionForm
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
      accounts={availableColoredAccounts}
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
