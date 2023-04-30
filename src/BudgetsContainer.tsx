import { useDispatch } from 'react-redux'
import { convertToLocaleTime } from './date-utils'
import { Budget, setBudgets, setFocusedBudgetName, useBudgetsSelector } from './redux/budgetsSlice'
import { AppState, useAppSelector } from './redux/appSlice'
import { useEffect } from 'react'
import BackendService, { SpendingLimits, CurrencyConfig } from './BackendService'
import Budgets from './Budgets'
import { TransactionDTO } from './Transaction'

type ConversionMapType = { [targetCurrency: string]: number }

interface Props {
  onTransactionRemove: (id: string) => void
}

interface MonthSpendingLimit {
  name: string
  categories: string[]
  currency: string
  amount: number
}

function calculateBudget(
  transactions: TransactionDTO[],
  spendingLimit: MonthSpendingLimit,
  conversionMap: ConversionMapType
) {
  const budget: Budget = {
    name: spendingLimit.name,
    currency: spendingLimit.currency,
    amount: spendingLimit.amount,
    categories: spendingLimit.categories,
    transactions: [],
    spentAmount: 0,
  }
  const categoriesMap: { [category: string]: boolean } = {}
  spendingLimit.categories.forEach((category) => {
    categoriesMap[category] = true
  })
  transactions.forEach((transaction) => {
    if (categoriesMap[transaction.category]) {
      budget.transactions.push(transaction)
      const sign = transaction.type === 'expense' ? 1 : -1
      budget.spentAmount +=
        sign * parseFloat(transaction.amount) * conversionMap[transaction.currency]
    }
  })

  return budget
}

function calculateBudgets(
  transactions: TransactionDTO[],
  categories: string[],
  spendingLimits: SpendingLimits,
  currencyConfig: CurrencyConfig,
  monthDate: string
): Budget[] {
  const conversionMap: ConversionMapType = { [currencyConfig.mainCurrency]: 1 }
  currencyConfig.conversionRates.forEach((conversionRate) => {
    conversionMap[conversionRate.currency] = conversionRate.rate
  })

  const monthDateObject = new Date(monthDate)
  const monthTransactions = transactions.filter((transaction) => {
    if (transaction.type === 'transfer') {
      return false
    }
    const transactionDate = new Date(convertToLocaleTime(transaction.datetime))
    return (
      transactionDate.getMonth() === monthDateObject.getMonth() &&
      transactionDate.getFullYear() === monthDateObject.getFullYear()
    )
  })
  monthTransactions.forEach((transaction) => {
    if (!conversionMap[transaction.currency]) {
      throw new Error('Transaction currency not in conversion map')
    }
  })
  const monthSpendingLimits = spendingLimits.limits
    .map((spendingLimit) => {
      const spendingLimitMonthLimits = spendingLimit.monthLimits.filter((monthLimit) => {
        const monthLimitDateObject = new Date(monthLimit.date)
        return (
          monthLimitDateObject.getMonth() === monthDateObject.getMonth() &&
          monthLimitDateObject.getFullYear() === monthDateObject.getFullYear()
        )
      })
      if (spendingLimitMonthLimits.length === 0) {
        return null
      }
      const spendingLimitMonthLimit = spendingLimitMonthLimits[0]
      return {
        name: spendingLimit.name,
        categories: spendingLimit.categories,
        currency: spendingLimitMonthLimit.currency,
        amount: spendingLimitMonthLimit.amount,
      }
    })
    .filter((spendingLimit) => spendingLimit !== null) as MonthSpendingLimit[]

  const totalLimit: MonthSpendingLimit = {
    name: 'ОБЩИЙ',
    categories: [],
    currency: currencyConfig.mainCurrency,
    amount: 0,
  }
  monthSpendingLimits.forEach((spendingLimit: MonthSpendingLimit) => {
    totalLimit.amount += spendingLimit.amount
    totalLimit.categories = totalLimit.categories.concat(spendingLimit.categories)
  })

  const restLimit: MonthSpendingLimit = {
    name: 'Другое',
    currency: currencyConfig.mainCurrency,
    amount: 0,
    categories: categories.filter((category) => !totalLimit.categories.includes(category)),
  }

  return [totalLimit, ...monthSpendingLimits, restLimit].map(
    (spendingLimit: MonthSpendingLimit) => {
      if (spendingLimit.currency !== currencyConfig.mainCurrency) {
        throw new Error('Limit must be in main currency')
      }
      return calculateBudget(monthTransactions, spendingLimit, conversionMap)
    }
  )
}

export default function BudgetsContainer({ onTransactionRemove }: Props) {
  const dispatch = useDispatch()
  const categories: string[] = useAppSelector((state) => state.categories)
  const transactions = useAppSelector((state: AppState) => state.transactions)
  const budgets: any[] = useBudgetsSelector((state) => state.budgets)
  const focusedBudgetName = useBudgetsSelector((state) => state.focusedBudgetName)

  useEffect(() => {
    const config = JSON.parse(window.localStorage.config)
    const backendService = new BackendService(config.backendUrl, config.backendToken)

    async function requestBudgetsFromBackend(backendService: BackendService) {
      const currencyConfig = await backendService.getCurrencyConfig()
      const spendingLimits = await backendService.getSpendingLimits()
      const budgets = calculateBudgets(
        transactions,
        categories,
        spendingLimits,
        currencyConfig,
        new Date().toISOString().split('T')[0]
      )
      dispatch(setBudgets(budgets))
    }

    void requestBudgetsFromBackend(backendService)
  }, [dispatch, categories, transactions])

  function handleFocus(budgetName: string) {
    dispatch(setFocusedBudgetName(budgetName))
  }

  const focusedBudget = budgets.find((budget) => budget.name === focusedBudgetName) || null

  return (
    <Budgets
      budgets={budgets}
      onFocus={handleFocus}
      focusedBudget={focusedBudget}
      onTransactionRemove={onTransactionRemove}
    />
  )
}
