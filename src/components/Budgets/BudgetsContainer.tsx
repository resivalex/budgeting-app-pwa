import { useState, useEffect } from 'react'
import { convertToLocaleTime } from '@/utils'
import { BackendService } from '@/services'
import Budgets from './Budgets'
import { TransactionDTO, SpendingLimitsDTO, TransactionsAggregations } from '@/types'
import { BudgetDTO } from './BudgetDTO'
import _ from 'lodash'

type ConversionMapType = { [sourceCurrency: string]: { [targetCurrency: string]: number } }

interface MonthSpendingLimit {
  name: string
  color: string
  categories: string[]
  currency: string
  amount: number
  isEditable: boolean
}

function calculateBudget(
  transactions: TransactionDTO[],
  spendingLimit: MonthSpendingLimit,
  conversionMap: ConversionMapType,
  color: string,
  isEditable: boolean
) {
  const budget: BudgetDTO = {
    name: spendingLimit.name,
    color: color,
    currency: spendingLimit.currency,
    amount: spendingLimit.amount,
    categories: spendingLimit.categories,
    transactions: [],
    spentAmount: 0,
    isEditable: isEditable,
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

  // TODO: refactor this rate reversion
  for (const conversionRate of currencyConfig.conversionRates) {
    conversionRate.rate = 1.0 / conversionRate.rate
  }

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
  const monthSpendingLimitsWithNulls: (MonthSpendingLimit | null)[] = spendingLimits.limits.map(
    (spendingLimit) => {
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

      const result: MonthSpendingLimit = {
        name: spendingLimit.name,
        color: spendingLimit.color,
        categories: spendingLimit.categories,
        currency: spendingLimitMonthLimit.currency,
        amount: spendingLimitMonthLimit.amount,
        isEditable: true,
      }

      return result
    }
  )
  const monthSpendingLimits: MonthSpendingLimit[] = monthSpendingLimitsWithNulls.filter(
    (spendingLimit) => spendingLimit !== null
  ) as MonthSpendingLimit[]

  const totalLimit: MonthSpendingLimit = {
    name: 'ОБЩИЙ',
    color: '#b6b6b6',
    categories: [],
    currency: currencyConfig.mainCurrency,
    amount: 0,
    isEditable: false,
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
    isEditable: false,
  }

  return [totalLimit, ...monthSpendingLimits, restLimit].map(
    (spendingLimit: MonthSpendingLimit) => {
      return calculateBudget(
        monthTransactions,
        spendingLimit,
        conversionMap,
        spendingLimit.color,
        spendingLimit.isEditable
      )
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
  const nextMonthFirstDay = new Date(
    selectedMonthDate.getFullYear(),
    selectedMonthDate.getMonth() + 1,
    1
  )
  const millisecondsInMonth = nextMonthFirstDay.getTime() - selectedMonthFirstDay.getTime()
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
  onTransactionRemove: (id: string) => Promise<void>
}) {
  const [focusedBudgetName, setFocusedBudgetName] = useState('')
  const [budgetMonthFirstDay, setBudgetMonthFirstDay] = useState(currentMonthFirstDay)
  const [availableMonths, setAvailableMonths] = useState<string[]>([currentMonthFirstDay])
  const [budgets, setBudgets] = useState<BudgetDTO[]>([])
  const [modificationsCount, setModificationsCount] = useState(0)
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
  }, [categories, transactions, selectedMonth, modificationsCount])

  async function updateBudgetItem(name: string, currency: string, amount: number) {
    const config = JSON.parse(localStorage.config)
    const backendService = new BackendService(config.backendUrl, config.backendToken)

    await backendService.setMonthSpendingItemLimit(selectedMonth, name, currency, amount)
    setModificationsCount(modificationsCount + 1)
  }

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
      onBudgetItemChange={(name: string, currency: string, amount: number) =>
        updateBudgetItem(name, currency, amount)
      }
      onFocus={handleFocus}
      focusedBudget={focusedBudget}
      commonBudgetsExpectationRatio={commonBudgetsExpectationRatio}
      onTransactionRemove={onTransactionRemove}
    />
  )
}
