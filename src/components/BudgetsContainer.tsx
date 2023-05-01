import { useDispatch } from 'react-redux'
import { convertToLocaleTime } from '../utils/date-utils'
import {
  Budget,
  setBudgets,
  setFocusedBudgetName,
  setBudgetMonthFirstDay,
  setAvailableMonths,
  useBudgetsSelector,
} from '../redux/budgetsSlice'
import { AppState, useAppSelector } from '../redux/appSlice'
import { useEffect } from 'react'
import BackendService, { SpendingLimits } from '../services/BackendService'
import Budgets from './Budgets'
import { TransactionDTO } from './Transaction'
import _ from 'lodash'

type ConversionMapType = { [sourceCurrency: string]: { [targetCurrency: string]: number } }

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
        sign * parseFloat(transaction.amount) * conversionMap[transaction.currency][budget.currency]
    }
  })

  return budget
}

function calculateBudgets(
  transactions: TransactionDTO[],
  categories: string[],
  spendingLimits: SpendingLimits,
  monthDate: string
): Budget[] {
  const monthCurrencyConfig = spendingLimits.monthCurrencyConfigs.find((c) => c.date === monthDate)
  if (!monthCurrencyConfig) {
    return []
  }
  const currencyConfig = monthCurrencyConfig.config
  const conversionMap: ConversionMapType = {
    [currencyConfig.mainCurrency]: { [currencyConfig.mainCurrency]: 1 },
  }
  currencyConfig.conversionRates.forEach((conversionRate) => {
    conversionMap[currencyConfig.mainCurrency][conversionRate.currency] = 1 / conversionRate.rate
  })
  currencyConfig.conversionRates.forEach((conversionRate) => {
    conversionMap[conversionRate.currency] = {
      [conversionRate.currency]: 1,
      [currencyConfig.mainCurrency]: conversionRate.rate,
    }
    currencyConfig.conversionRates.forEach((anotherConversionRate) => {
      if (anotherConversionRate.currency === conversionRate.currency) {
        return
      }
      conversionMap[conversionRate.currency][anotherConversionRate.currency] =
        conversionRate.rate / anotherConversionRate.rate
    })
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
    totalLimit.amount +=
      spendingLimit.amount * conversionMap[spendingLimit.currency][currencyConfig.mainCurrency]
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
      return calculateBudget(monthTransactions, spendingLimit, conversionMap)
    }
  )
}

function getAvailableMonths(spendingLimits: SpendingLimits) {
  const availableMonths: string[] = []
  spendingLimits.limits.forEach((spendingLimit) => {
    spendingLimit.monthLimits.forEach((monthLimit) => {
      if (!availableMonths.includes(monthLimit.date)) {
        availableMonths.push(monthLimit.date)
      }
    })
  })

  return _.sortBy(availableMonths, (date) => new Date(date).getTime())
}

export default function BudgetsContainer({ onTransactionRemove }: Props) {
  const dispatch = useDispatch()
  const categories: string[] = useAppSelector((state) => state.categories)
  const transactions = useAppSelector((state: AppState) => state.transactions)
  const budgets: any[] = useBudgetsSelector((state) => state.budgets)
  const focusedBudgetName = useBudgetsSelector((state) => state.focusedBudgetName)
  const selectedMonth = useBudgetsSelector((state) => state.budgetMonthFirstDay)
  const availableMonths = useBudgetsSelector((state) => state.availableMonths)

  useEffect(() => {
    const config = JSON.parse(window.localStorage.config)
    const backendService = new BackendService(config.backendUrl, config.backendToken)

    async function requestBudgetsFromBackend(backendService: BackendService) {
      const spendingLimits = await backendService.getSpendingLimits()
      const budgets = calculateBudgets(transactions, categories, spendingLimits, selectedMonth)
      const availableMonths = getAvailableMonths(spendingLimits)
      dispatch(setBudgets(budgets))
      dispatch(setAvailableMonths(availableMonths))
    }

    void requestBudgetsFromBackend(backendService)
  }, [dispatch, categories, transactions, selectedMonth])

  function handleFocus(budgetName: string) {
    dispatch(setFocusedBudgetName(budgetName))
  }

  const focusedBudget = budgets.find((budget) => budget.name === focusedBudgetName) || null

  return (
    <Budgets
      budgets={budgets}
      selectedMonth={selectedMonth}
      availableMonths={availableMonths}
      onMonthSelect={(month) => dispatch(setBudgetMonthFirstDay(month))}
      onFocus={handleFocus}
      focusedBudget={focusedBudget}
      onTransactionRemove={onTransactionRemove}
    />
  )
}
