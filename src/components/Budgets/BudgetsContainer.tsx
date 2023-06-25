import { useState, useEffect } from 'react'
import { convertToLocaleTime } from '@/utils'
import { BackendService } from '@/services'
import Budgets from './Budgets'
import { TransactionDTO, BudgetDTO, SpendingLimitsDTO, TransactionsAggregations } from '@/types'
import _ from 'lodash'

type ConversionMapType = { [sourceCurrency: string]: { [targetCurrency: string]: number } }

interface MonthSpendingLimit {
  name: string
  color: string
  categories: string[]
  currency: string
  amount: number
}

function calculateBudget(
  transactions: TransactionDTO[],
  spendingLimit: MonthSpendingLimit,
  conversionMap: ConversionMapType,
  color: string
) {
  const budget: BudgetDTO = {
    name: spendingLimit.name,
    color: color,
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
  spendingLimits: SpendingLimitsDTO,
  monthDate: string
): BudgetDTO[] {
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
        color: spendingLimit.color,
        categories: spendingLimit.categories,
        currency: spendingLimitMonthLimit.currency,
        amount: spendingLimitMonthLimit.amount,
      }
    })
    .filter((spendingLimit) => spendingLimit !== null) as MonthSpendingLimit[]

  const totalLimit: MonthSpendingLimit = {
    name: 'ОБЩИЙ',
    color: '#b6b6b6',
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
    color: '#b6b6b6',
    currency: currencyConfig.mainCurrency,
    amount: 0,
    categories: categories.filter((category) => !totalLimit.categories.includes(category)),
  }

  return [totalLimit, ...monthSpendingLimits, restLimit].map(
    (spendingLimit: MonthSpendingLimit) => {
      return calculateBudget(monthTransactions, spendingLimit, conversionMap, spendingLimit.color)
    }
  )
}

function getAvailableMonths(spendingLimits: SpendingLimitsDTO) {
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

function calculateExpectationRatioByCurrentDate(selectedMonth: string) {
  const currentDate = new Date()
  const selectedMonthDate = new Date(selectedMonth)

  if (currentDate.getMonth() !== selectedMonthDate.getMonth()) {
    return null
  }
  const selectedMonthFirstDay = new Date(
    selectedMonthDate.getFullYear(),
    selectedMonthDate.getMonth(),
    1
  )
  const selectedMonthLastDay = new Date(
    selectedMonthDate.getFullYear(),
    selectedMonthDate.getMonth() + 1,
    0
  )
  const millisecondsInMonth = selectedMonthLastDay.getTime() - selectedMonthFirstDay.getTime()
  const millisecondsFromSelectedMonth = currentDate.getTime() - selectedMonthFirstDay.getTime()

  return millisecondsFromSelectedMonth / millisecondsInMonth
}

const currentMonthFirstDay = new Date().toISOString().slice(0, 7) + '-01'

export default function BudgetsContainer({
  transactions,
  transactionAggregations,
  onTransactionRemove,
}: {
  transactionAggregations: TransactionsAggregations
  transactions: TransactionDTO[]
  onTransactionRemove: (id: string) => void
}) {
  const [focusedBudgetName, setFocusedBudgetName] = useState('')
  const [budgetMonthFirstDay, setBudgetMonthFirstDay] = useState(currentMonthFirstDay)
  const [availableMonths, setAvailableMonths] = useState<string[]>([currentMonthFirstDay])
  const [budgets, setBudgets] = useState<BudgetDTO[]>([])
  const categories: string[] = transactionAggregations.categories
  const selectedMonth = budgetMonthFirstDay

  useEffect(() => {
    const config = JSON.parse(localStorage.config)
    const backendService = new BackendService(config.backendUrl, config.backendToken)

    async function requestBudgetsFromBackend(backendService: BackendService) {
      async function getSpendingLimits(): Promise<SpendingLimitsDTO> {
        try {
          const spendingLimits = await backendService.getSpendingLimits()
          localStorage.spendingLimits = JSON.stringify(spendingLimits)

          return spendingLimits
        } catch (error) {
          if (!localStorage.spendingLimits) {
            return { limits: [], monthCurrencyConfigs: [] }
          }

          return JSON.parse(localStorage.spendingLimits)
        }
      }

      const spendingLimits = await getSpendingLimits()

      const budgets = calculateBudgets(transactions, categories, spendingLimits, selectedMonth)
      const availableMonths = getAvailableMonths(spendingLimits)
      setBudgets(budgets)
      setAvailableMonths(availableMonths)
    }

    void requestBudgetsFromBackend(backendService)
  }, [categories, transactions, selectedMonth])

  function handleFocus(budgetName: string) {
    setFocusedBudgetName(budgetName)
  }

  const focusedBudget = budgets.find((budget) => budget.name === focusedBudgetName) || null
  const commonBudgetsExpectationRatio = calculateExpectationRatioByCurrentDate(selectedMonth)

  return (
    <Budgets
      budgets={budgets}
      selectedMonth={selectedMonth}
      availableMonths={availableMonths}
      onMonthSelect={(month) => setBudgetMonthFirstDay(month)}
      onFocus={handleFocus}
      focusedBudget={focusedBudget}
      commonBudgetsExpectationRatio={commonBudgetsExpectationRatio}
      onTransactionRemove={onTransactionRemove}
    />
  )
}
